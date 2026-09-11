import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FUNNEL, NOTE, RETURNS, SENTIMENTS, THEMES } from '../data/meqDemo.js'
import KpiBoard from './KpiBoard.jsx'

/**
 * What the classifier does to a module's evaluation returns, played through.
 *
 * Returns land as cards, the blank ones fall away, what is left sorts itself
 * into sentiment, and the theme tally builds. That is the whole job: most of
 * the raw text is "D/A" or a full stop, and the useful part is the tenth that
 * says something.
 *
 * Every card is invented. Real evaluations belong to the institution and are
 * not on this site; see NOTE in the data file.
 *
 * Cards are positioned with left/top percentages and moved by CSS transition
 * rather than by an animation loop, because a transition runs from a state
 * change and needs no frame timer to arrive.
 */

const PHASES = ['land', 'sift', 'sort', 'tally']
const STEP_MS = { land: 1500, sift: 1900, sort: 2100, tally: 0 }

const GRID_COLS = 6

export default function FeedbackFlow() {
  const [phase, setPhase] = useState('land')
  const [open, setOpen] = useState(null) // sentiment id being read
  const [live, setLive] = useState(false)
  const hostRef = useRef(null)
  const timers = useRef([])

  const at = PHASES.indexOf(phase)

  /* Where each card sits in each phase, worked out once. */
  const cards = useMemo(() => {
    const bySentiment = {}
    SENTIMENTS.forEach((s) => {
      bySentiment[s.id] = []
    })
    RETURNS.forEach((r, i) => {
      if (r.s) bySentiment[r.s].push(i)
    })

    return RETURNS.map((r, i) => {
      const col = i % GRID_COLS
      const row = Math.floor(i / GRID_COLS)
      const lane = r.s ? SENTIMENTS.findIndex((s) => s.id === r.s) : -1
      const seat = r.s ? bySentiment[r.s].indexOf(i) : 0
      return {
        ...r,
        i,
        grid: { x: 6 + col * 15.5, y: 8 + row * 15 },
        lane,
        /* Four lanes across, stacked downwards from the lane label. */
        sorted: { x: 5.5 + lane * 24.5, y: 22 + seat * 7.6 },
        seat,
      }
    })
  }, [])

  const themeTally = useMemo(
    () =>
      THEMES.map((t) => ({
        ...t,
        n: RETURNS.filter((r) => r.th === t.id).length,
        positive: RETURNS.filter((r) => r.th === t.id && r.s === 'positive').length,
      })).sort((a, b) => b.n - a.n),
    [],
  )

  const run = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setOpen(null)
    setPhase('land')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('tally')
      return
    }
    let t = 0
    PHASES.slice(1).forEach((p, k) => {
      t += STEP_MS[PHASES[k]]
      timers.current.push(setTimeout(() => setPhase(p), t))
    })
  }, [])

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setLive(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLive(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (live) run()
  }, [live, run])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const sorted = at >= 2
  const openCards = open ? cards.filter((c) => c.s === open) : []

  return (
    <figure className="ff" ref={hostRef}>
      <figcaption className="ff-head">
        <p className="ff-eyebrow">Worked example</p>
        <h2 className="ff-title">What the recap meeting sees</h2>
        <p className="ff-note">{NOTE}</p>
      </figcaption>

      <KpiBoard />

      <p className="ff-eyebrow ff-second">Then, what students wrote</p>

      <div className="ff-counts">
        <span className="ff-count" data-on={at >= 0 ? 'true' : undefined}>
          <b>{FUNNEL.returns}</b>returns
        </span>
        <span className="ff-arrow" aria-hidden="true">
          →
        </span>
        <span className="ff-count" data-on={at >= 1 ? 'true' : undefined}>
          <b>{at >= 1 ? FUNNEL.blank : '—'}</b>blank or &ldquo;D/A&rdquo;
        </span>
        <span className="ff-arrow" aria-hidden="true">
          →
        </span>
        <span className="ff-count ff-count--keep" data-on={at >= 1 ? 'true' : undefined}>
          <b>{at >= 1 ? FUNNEL.withText : '—'}</b>carried a comment
        </span>
      </div>

      <div className="ff-stage" data-phase={phase}>
        {/* Lane headings, once there are lanes. */}
        {SENTIMENTS.map((s, k) => {
          const n = RETURNS.filter((r) => r.s === s.id).length
          return (
            <button
              type="button"
              key={s.id}
              className="ff-lane"
              data-sent={s.id}
              data-on={sorted ? 'true' : undefined}
              data-open={open === s.id ? 'true' : undefined}
              style={{ left: `${5.5 + k * 24.5}%` }}
              onClick={() => setOpen((v) => (v === s.id ? null : s.id))}
              aria-label={`${n} ${s.label} comments. Select to read them.`}
              tabIndex={sorted ? 0 : -1}
            >
              <span className="ff-lanename">{s.label}</span>
              <span className="ff-lanen">{n}</span>
            </button>
          )
        })}

        {cards.map((c) => {
          const pos = sorted && c.s ? c.sorted : c.grid
          const dropped = at >= 1 && !c.s
          return (
            <span
              className="ff-card"
              key={c.i}
              data-sent={c.s || undefined}
              data-dropped={dropped ? 'true' : undefined}
              data-dim={open && c.s !== open ? 'true' : undefined}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transitionDelay: `${(c.i % 9) * 40}ms`,
              }}
              title={c.t}
            >
              <span className="ff-cardtext">{c.t}</span>
            </span>
          )
        })}
      </div>

      {/* The summary a module leader actually presents. */}
      <div className="ff-tally" data-on={at >= 3 ? 'true' : undefined}>
        <p className="ff-tallyhead">Themes in the comments that carried one</p>
        <ul className="ff-bars">
          {themeTally.map((t) => (
            <li key={t.id}>
              <span className="ff-barlabel">{t.label}</span>
              <span className="ff-bartrack">
                <span
                  className="ff-bar"
                  style={{ width: at >= 3 ? `${(t.n / themeTally[0].n) * 100}%` : '0%' }}
                />
              </span>
              <span className="ff-barn">{t.n}</span>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <div className="ff-read">
          <p className="ff-readhead">
            {SENTIMENTS.find((s) => s.id === open).label} comments
            <button type="button" className="ff-close" onClick={() => setOpen(null)}>
              Close
            </button>
          </p>
          <ul>
            {openCards.map((c) => (
              <li key={c.i}>
                <span className="ff-readtheme">
                  {THEMES.find((t) => t.id === c.th)?.label}
                </span>
                {c.t}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="ff-controls">
        <button type="button" className="btn-game" onClick={run}>
          Run it again
        </button>
        <p className="ff-hint">
          {sorted
            ? 'Select a sentiment to read the comments in it.'
            : 'Sorting the returns…'}
        </p>
      </div>
    </figure>
  )
}
