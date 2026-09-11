import { useCallback, useEffect, useRef, useState } from 'react'
import { TRADE_RESOURCES, TRADE_TEAMS } from '../../data/games.js'

/**
 * The international trade game, reduced to the moment it turns on.
 *
 * Making one shape needs paper, a stencil and scissors. Three of the four
 * teams hold exactly one of those, so on their own they produce nothing at all
 * while the fourth, which was handed all three, gets on with it. Open trade
 * and the three who had nothing between them individually turn out to have
 * everything between them collectively.
 *
 * The switch is the whole lesson, so the visual is built around being thrown
 * rather than around a final state: shapes fly between the teams when trade
 * opens, and the totals climb as they land.
 */

const SHAPES = ['star', 'circle', 'hex']
const FLY_MS = 1500

/* A five-point star: ten points alternating between two radii, starting at the
   top. Written out rather than drawn by hand so the points stay even. */
const STAR = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 === 0 ? 10 : 4.3
  const a = (Math.PI / 5) * i - Math.PI / 2
  return `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`
}).join('L')

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const ease = (t) => 1 - (1 - t) ** 3
const rand = (i, salt) => {
  const x = Math.sin(i * 91.7 + salt * 47.3) * 43758.5453
  return x - Math.floor(x)
}

function ShapeGlyph({ kind }) {
  if (kind === 'star') return <path d={`M${STAR}Z`} />
  if (kind === 'circle') return <circle cx="0" cy="0" r="9.5" />
  return <path d="M0 -10 L8.7 -5 L8.7 5 L0 10 L-8.7 5 L-8.7 -5 Z" />
}

/**
 * The shapes a team has made, drawn in a row.
 *
 * With the borders closed only Team D has any, because only Team D was given
 * all three of paper, stencil and scissors. Open trade and every team has a
 * pile. That is the whole point of the activity, and a row of shapes appearing
 * shows it better than a number changing.
 */
function Pile({ count }) {
  if (!count) return <p className="tg-none">Nothing made</p>
  return (
    <svg
      className="tg-pile"
      viewBox={`0 0 ${count * 22} 24`}
      /* Capped at its natural size, so a team with nine does not draw them
         smaller than a team with four. It still shrinks if the card is
         narrower than the row. */
      style={{ maxWidth: `${count * 22}px` }}
      role="img"
      aria-label={`${count} perfect ${count === 1 ? 'shape' : 'shapes'}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <g
          key={i}
          className={`tg-piece tg-piece--${i % SHAPES.length}`}
          transform={`translate(${11 + i * 22} 12)`}
        >
          <ShapeGlyph kind={SHAPES[i % SHAPES.length]} />
        </g>
      ))}
    </svg>
  )
}

export default function TradeGame() {
  const [open, setOpen] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [flying, setFlying] = useState(false)
  const shapeRefs = useRef([])
  const timers = useRef([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  /* Twelve shapes crossing between the three teams that had to trade. */
  const flights = Array.from({ length: 12 }, (_, i) => ({
    kind: SHAPES[i % SHAPES.length],
    from: i % 3,
    to: i % 3 === 2 ? 0 : (i % 3) + 1,
    delay: (i / 12) * 0.45,
  }))

  const toggle = useCallback(() => {
    const next = !open
    setOpen(next)
    if (!next || reduced) {
      setFlying(false)
      return
    }
    setFlying(true)

    let raf = 0
    let settled = false
    const t0 = performance.now()
    const place = (t) => {
      flights.forEach((f, i) => {
        const el = shapeRefs.current[i]
        if (!el) return
        const local = clamp01((t - f.delay) / (1 - f.delay))
        const e = ease(local)
        const x0 = 14 + f.from * 33
        const x1 = 14 + f.to * 33
        const x = x0 + (x1 - x0) * e
        const arc = Math.sin(e * Math.PI) * (16 + rand(i, 1) * 14)
        const y = 52 + (rand(i, 2) - 0.5) * 26 - arc
        el.setAttribute(
          'transform',
          `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(e * 300).toFixed(0)})`,
        )
        el.style.opacity = String(local > 0 && local < 1 ? 0.95 : 0)
      })
    }
    const finish = () => {
      if (settled) return
      settled = true
      place(1)
      setFlying(false)
    }
    const tick = (now) => {
      const t = (now - t0) / FLY_MS
      place(clamp01(t))
      if (t < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    place(0)
    raf = requestAnimationFrame(tick)
    /* rAF does not run in every embedded browser; without this the shapes hang
       in mid air and the totals still need to land. */
    timers.current.push(setTimeout(finish, FLY_MS + 300))
    timers.current.push(setTimeout(() => cancelAnimationFrame(raf), FLY_MS + 400))
  }, [open, reduced, flights])

  const total = TRADE_TEAMS.reduce((s, t) => s + (open ? t.traded : t.alone), 0)

  return (
    <div className="game tg">
      <div className="tg-bar">
        <div className="tg-switch">
          <button type="button" className="btn-game" onClick={toggle} aria-pressed={open}>
            {open ? 'Close the borders' : 'Open trade'}
          </button>
          <p className="tg-state">
            {open ? 'Teams may trade resources' : 'No team may trade'}
          </p>
        </div>
        <p className="tg-total">
          <b>{total}</b>
          <span>perfect shapes made</span>
        </p>
      </div>

      {/* Shapes in transit, over the team row. */}
      <div className="tg-sky" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <g className="tg-flight" style={{ opacity: flying ? 1 : 0 }}>
            {flights.map((f, i) => (
              <g
                key={i}
                ref={(el) => {
                  shapeRefs.current[i] = el
                }}
                className="tg-shape"
                style={{ opacity: 0 }}
              >
                <ShapeGlyph kind={f.kind} />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="tg-teams">
        {TRADE_TEAMS.map((t) => {
          const made = open ? t.traded : t.alone
          return (
            <div
              className="tg-team"
              key={t.id}
              data-bloc={t.bloc}
              data-made={made > 0 ? 'true' : undefined}
            >
              <p className="tg-name">
                {t.name}
                <span className="tg-bloc">
                  {t.bloc === 'north' ? 'Global North' : 'Global South'}
                </span>
              </p>
              <ul className="tg-has">
                {Object.keys(TRADE_RESOURCES).map((r) => (
                  <li key={r} data-held={t.has.includes(r) ? 'true' : undefined}>
                    {TRADE_RESOURCES[r]}
                  </li>
                ))}
              </ul>
              <p className="tg-made">
                <b>{made}</b>
                <span>{made === 1 ? 'shape' : 'shapes'}</span>
              </p>
              <Pile count={made} />
              <p className="tg-note">{t.note}</p>
            </div>
          )
        })}
      </div>

      <p className="tg-read">
        {open
          ? 'The three teams that were each given one resource have everything between them. Team D produces more too, and the gap closes.'
          : 'Only Team D can produce. It was given all three resources; the others were each given one.'}
      </p>
    </div>
  )
}
