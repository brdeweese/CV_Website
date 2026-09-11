import { useCallback, useEffect, useRef, useState } from 'react'
import { TROLLEY } from '../../data/games.js'

/**
 * The trolley problem, drawn as a cartoon and played with one lever.
 *
 * The whole activity is that there is no marked answer. The trolley runs
 * either way, the toll is stated plainly, and the reasoning for both readings
 * is only revealed once a choice has been made, so nobody is told what to
 * think before they have committed to something.
 *
 * The figures are stick people rather than anything more literal on purpose:
 * this is a seminar prompt about a principle, and the drawing should not ask
 * anyone to picture a real person being killed.
 */

const VB = { w: 900, h: 440 }
const RUN_MS = 2200

/* The junction, then one branch straight on and one curving away. */
const JUNCTION = { x: 330, y: 250 }
const STRAIGHT = [
  [70, 250],
  [JUNCTION.x, JUNCTION.y],
  [860, 250],
]
const DIVERT = [
  [JUNCTION.x, JUNCTION.y],
  [520, 262],
  [640, 330],
  [860, 356],
]

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Four on the line it is already taking, one on the line you can send it to. */
const STRAIGHT_PEOPLE = [660, 692, 724, 756]
const DIVERT_PEOPLE = [700]

function Person({ x, y, hit }) {
  return (
    <g
      className="tr-person"
      data-hit={hit ? 'true' : undefined}
      transform={`translate(${x} ${y})`}
    >
      <circle className="tr-head" cx="0" cy="-26" r="7.5" />
      <path className="tr-body" d="M0 -18 V-2" />
      <path className="tr-body" d="M-8 -13 L8 -13" />
      <path className="tr-body" d="M0 -2 L-7 12" />
      <path className="tr-body" d="M0 -2 L7 12" />
    </g>
  )
}

export default function Trolley() {
  const [choice, setChoice] = useState(null) // 'straight' | 'divert'
  const [phase, setPhase] = useState('idle') // idle | running | done
  const [reduced, setReduced] = useState(false)
  const trolleyRef = useRef(null)
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

  const run = useCallback(
    (which) => {
      if (phase === 'running') return
      setChoice(which)
      setPhase('running')
      const path = which === 'divert' ? [STRAIGHT[0], ...DIVERT] : STRAIGHT

      const at = (t) => {
        /* Walk the polyline by segment length so the speed stays even. */
        const segs = []
        let total = 0
        for (let i = 0; i < path.length - 1; i++) {
          const d = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1])
          segs.push(d)
          total += d
        }
        let want = clamp01(t) * total
        for (let i = 0; i < segs.length; i++) {
          if (want <= segs[i] || i === segs.length - 1) {
            const u = segs[i] ? want / segs[i] : 0
            return [
              path[i][0] + (path[i + 1][0] - path[i][0]) * u,
              path[i][1] + (path[i + 1][1] - path[i][1]) * u,
            ]
          }
          want -= segs[i]
        }
        return path[path.length - 1]
      }

      const place = (t) => {
        const el = trolleyRef.current
        if (!el) return
        const [x, y] = at(t)
        const [x2, y2] = at(Math.min(1, t + 0.01))
        const a = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI
        el.setAttribute(
          'transform',
          `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})`,
        )
      }

      if (reduced) {
        place(1)
        setPhase('done')
        return
      }

      let raf = 0
      let settled = false
      const t0 = performance.now()
      const finish = () => {
        if (settled) return
        settled = true
        place(1)
        setPhase('done')
      }
      const tick = (now) => {
        const t = (now - t0) / RUN_MS
        place(clamp01(t))
        if (t < 1) raf = requestAnimationFrame(tick)
        else finish()
      }
      place(0)
      raf = requestAnimationFrame(tick)
      /* rAF does not run in every embedded browser; without this the trolley
         never arrives and the outcome never appears. */
      timers.current.push(setTimeout(finish, RUN_MS + 300))
      timers.current.push(setTimeout(() => cancelAnimationFrame(raf), RUN_MS + 400))
    },
    [phase, reduced],
  )

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setChoice(null)
    setPhase('idle')
    const el = trolleyRef.current
    if (el)
      el.setAttribute(
        'transform',
        `translate(${STRAIGHT[0][0]} ${STRAIGHT[0][1]}) rotate(0)`,
      )
  }, [])

  const pulled = choice === 'divert'
  const outcome = choice ? TROLLEY.choices[choice] : null
  const straightHit = phase === 'done' && choice === 'straight'
  const divertHit = phase === 'done' && choice === 'divert'

  return (
    <div className="game tr">
      <div className="tr-stage">
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} role="img" aria-label={TROLLEY.prompt}>
          {/* Ground */}
          <rect className="tr-ground" x="0" y="392" width={VB.w} height="48" />

          {/* Track, straight on */}
          <path className="tr-rail" d={`M${STRAIGHT[0][0]} ${STRAIGHT[0][1]} L860 250`} />
          {Array.from({ length: 26 }, (_, k) => (
            <rect
              className="tr-sleeper"
              key={`s${k}`}
              x={74 + k * 30}
              y="243"
              width="9"
              height="15"
              rx="2"
            />
          ))}

          {/* Track, diverted */}
          <path
            className="tr-rail"
            d={`M${JUNCTION.x} ${JUNCTION.y} C 460 254, 560 300, 860 356`}
          />

          {/* The lever, beside the junction */}
          <g className="tr-lever" data-pulled={pulled ? 'true' : undefined}>
            <rect
              className="tr-leverbase"
              x={JUNCTION.x - 16}
              y="292"
              width="32"
              height="12"
              rx="4"
            />
            <path
              className="tr-leverarm"
              d={
                pulled
                  ? `M${JUNCTION.x} 296 L${JUNCTION.x + 30} 258`
                  : `M${JUNCTION.x} 296 L${JUNCTION.x - 30} 258`
              }
            />
            <circle
              className="tr-leverknob"
              cx={pulled ? JUNCTION.x + 30 : JUNCTION.x - 30}
              cy="258"
              r="7"
            />
          </g>

          {STRAIGHT_PEOPLE.map((x) => (
            <Person key={x} x={x} y={250} hit={straightHit} />
          ))}
          {DIVERT_PEOPLE.map((x) => (
            <Person key={x} x={x} y={356} hit={divertHit} />
          ))}

          <text className="tr-count" x="708" y="196" textAnchor="middle">
            4 people
          </text>
          <text className="tr-count" x="700" y="302" textAnchor="middle">
            1 person
          </text>

          {/* The trolley */}
          <g ref={trolleyRef} transform={`translate(${STRAIGHT[0][0]} ${STRAIGHT[0][1]})`}>
            <g className="tr-car">
              <rect x="-32" y="-40" width="64" height="32" rx="6" />
              <rect className="tr-window" x="-22" y="-33" width="18" height="14" rx="3" />
              <rect className="tr-window" x="4" y="-33" width="18" height="14" rx="3" />
              <rect x="-26" y="-10" width="52" height="8" rx="3" />
              <circle className="tr-wheel" cx="-16" cy="0" r="7" />
              <circle className="tr-wheel" cx="16" cy="0" r="7" />
            </g>
          </g>
        </svg>
      </div>

      <div className="tr-bar">
        <p className="tr-prompt">{TROLLEY.prompt}</p>
        <div className="tr-buttons">
          <button
            type="button"
            className="btn-game"
            onClick={() => run('straight')}
            disabled={phase !== 'idle'}
          >
            {TROLLEY.choices.straight.label}
          </button>
          <button
            type="button"
            className="btn-game"
            onClick={() => run('divert')}
            disabled={phase !== 'idle'}
          >
            {TROLLEY.choices.divert.label}
          </button>
          <button type="button" className="btn-game btn-game--ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      {phase === 'done' && outcome && (
        <div className="tr-result">
          <p className="tr-toll">
            <b>{outcome.toll}</b>
            {outcome.toll === 1 ? 'person' : 'people'}
          </p>
          <div>
            <p className="tr-verdict">{outcome.verdict}</p>
            <p className="tr-school">{outcome.school}</p>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="tr-after">
          {TROLLEY.after.map((a) => (
            <div className="tr-card" key={a.title}>
              <p className="tr-cardtitle">{a.title}</p>
              <p className="tr-cardbody">{a.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
