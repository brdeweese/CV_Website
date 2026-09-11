import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FUNNEL, NOTE, RETURNS, SENTIMENTS, THEMES, THEME_SPLIT } from '../data/meqDemo.js'
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

const PHASES = ['idle', 'land', 'sift', 'sort', 'tally']
const STEP_MS = { idle: 0, land: 1500, sift: 1900, sort: 2100, tally: 0 }

const GRID_COLS = 6

/* Deterministic pseudo-random, so the pile looks dropped rather than arranged
   and still lands in the same place on every render. */
const jitter = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export default function FeedbackFlow() {
  const [phase, setPhase] = useState('idle')
  const [open, setOpen] = useState(null) // sentiment id being read
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
        /* Where they start: dropped on the desk, overlapping and askew. */
        pile: {
          x: 2 + jitter(i, 1) * 82,
          y: 3 + jitter(i, 2) * 80,
          rot: (jitter(i, 3) - 0.5) * 26,
        },
        grid: { x: 6 + col * 15.5, y: 8 + row * 15 },
        lane,
        /* Four lanes across, stacked downwards from the lane label. */
        sorted: { x: 5.5 + lane * 24.5, y: 20 + seat * 6.6 },
        seat,
      }
    })
  }, [])

  /* Both sides share one scale, or a two-sided chart says nothing. */
  const themeMax = useMemo(
    () => Math.max(...THEME_SPLIT.map((t) => Math.max(t.positive, t.negative)), 1),
    [],
  )

  const run = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setOpen(null)
    /* Back to the pile first, so a replay shows the sorting rather than
       starting from a stack that is already square. */
    setPhase('idle')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('tally')
      return
    }
    let t = 450
    PHASES.slice(1).forEach((p) => {
      timers.current.push(setTimeout(() => setPhase(p), t))
      t += STEP_MS[p]
    })
  }, [])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const idle = phase === 'idle'
  const sorted = at >= 3
  const openCards = open ? cards.filter((c) => c.s === open) : []

  return (
    <figure className="ff">
      <figcaption className="ff-head">
        <p className="ff-eyebrow">Worked example</p>
        <h2 className="ff-title">What the recap meeting sees</h2>
        <p className="ff-note">{NOTE}</p>
      </figcaption>

      <KpiBoard />

      <p className="ff-eyebrow ff-second">Then, what students wrote</p>

      <div className="ff-counts">
        <span className="ff-count" data-on={at >= 1 ? 'true' : undefined}>
          <b>{FUNNEL.returns}</b>returns
        </span>
        <span className="ff-arrow" aria-hidden="true">
          →
        </span>
        <span className="ff-count" data-on={at >= 2 ? 'true' : undefined}>
          <b>{at >= 2 ? FUNNEL.blank : '—'}</b>blank or &ldquo;D/A&rdquo;
        </span>
        <span className="ff-arrow" aria-hidden="true">
          →
        </span>
        <span className="ff-count ff-count--keep" data-on={at >= 2 ? 'true' : undefined}>
          <b>{at >= 2 ? FUNNEL.withText : '—'}</b>carried a comment
        </span>
      </div>

      <div className="ff-start" data-done={idle ? undefined : 'true'}>
        <button
          type="button"
          className="ff-play"
          onClick={run}
          aria-label="Run the classifier over the example returns"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle className="ff-playring" cx="12" cy="12" r="10.5" />
            <path className="ff-playtri" d="M9.5 7.5L17 12L9.5 16.5Z" />
          </svg>
        </button>
        <p className="ff-startline">Press play to run the sentiment classifier</p>
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
          /* Piled, then squared up, then sorted into a lane. */
          const pos = idle ? c.pile : sorted && c.s ? c.sorted : c.grid
          const dropped = at >= 2 && !c.s
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
                '--rot': idle ? `${c.pile.rot.toFixed(1)}deg` : '0deg',
                zIndex: idle ? Math.round(jitter(c.i, 4) * 30) : undefined,
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
      <div className="ff-tally" data-on={at >= 4 ? 'true' : undefined}>
        <p className="ff-tallyhead">
          Themes, and whether they were raised as praise or as a complaint
        </p>
        <div className="ff-axis" aria-hidden="true">
          <span className="ff-axisneg">Negative</span>
          <span className="ff-axispos">Positive</span>
        </div>
        <ul className="ff-bars">
          {THEME_SPLIT.map((t) => (
            <li key={t.id}>
              <span className="ff-barlabel">{t.label}</span>
              <span className="ff-barn ff-barn--neg">{t.negative || ''}</span>
              <span className="ff-half ff-half--neg">
                <span
                  className="ff-bar ff-bar--neg"
                  style={{
                    width: at >= 4 ? `${(t.negative / themeMax) * 100}%` : '0%',
                  }}
                />
              </span>
              <span className="ff-half ff-half--pos">
                <span
                  className="ff-bar ff-bar--pos"
                  style={{
                    width: at >= 4 ? `${(t.positive / themeMax) * 100}%` : '0%',
                  }}
                />
              </span>
              <span className="ff-barn ff-barn--pos">{t.positive || ''}</span>
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
        <button type="button" className="btn-game" onClick={run} disabled={idle}>
          Run it again
        </button>
        <p className="ff-hint">
          {idle
            ? ''
            : sorted
              ? 'Select a sentiment to read the comments in it.'
              : 'Sorting the returns…'}
        </p>
      </div>
    </figure>
  )
}
