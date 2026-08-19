import { useEffect, useRef, useState } from 'react'

/**
 * Ranked model comparison that re-sorts itself when you change the metric.
 *
 * Built in HTML rather than SVG on purpose. Bars need to animate their length
 * AND slide to a new rank at the same time; CSS transitions on width and
 * transform do both for free, whereas SVG attributes cannot be transitioned in
 * CSS and would need per-frame JavaScript.
 *
 * The reordering is the point, not decoration: ARIMA and Scaled ARDL swap
 * places depending on whether you measure average error or squared error, which
 * is a real finding and easy to miss in a static table.
 *
 * It cycles metrics on its own until the reader takes over, then stops.
 */

const ROW_H = 46
const CYCLE_MS = 3600

function format(value, metricKey) {
  if (metricKey === 'mse') {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  return Math.round(value).toLocaleString()
}

export default function ModelRace({ data, metrics, title, source, note, unitNote }) {
  const [metricIndex, setMetricIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) setAutoplay(false)
  }, [])

  useEffect(() => {
    if (!autoplay) return undefined
    const id = window.setInterval(() => {
      setMetricIndex((i) => (i + 1) % metrics.length)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [autoplay, metrics.length])

  const metric = metrics[metricIndex]
  const ranked = [...data].sort((a, b) => a[metric.key] - b[metric.key])
  const worst = ranked[ranked.length - 1][metric.key]

  function choose(i) {
    setAutoplay(false)
    setMetricIndex(i)
  }

  return (
    <figure className="viz race">
      <div className="viz-head">
        <figcaption>
          <span className="viz-title">{title}</span>
          {source && <span className="viz-source">{source}</span>}
        </figcaption>

        <div className="race-switch" role="group" aria-label="Choose an error metric">
          {metrics.map((m, i) => (
            <button
              key={m.key}
              className={`race-tab${i === metricIndex ? ' is-on' : ''}`}
              onClick={() => choose(i)}
              aria-pressed={i === metricIndex}
              title={m.hint}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="race-plot" style={{ height: ranked.length * ROW_H }}>
        {ranked.map((row, rank) => {
          const value = row[metric.key]
          const pct = (value / worst) * 100
          const tone = rank === 0 ? 'best' : rank === ranked.length - 1 ? 'worst' : 'mid'
          return (
            <div
              className="race-row"
              key={row.model}
              style={{ transform: `translateY(${rank * ROW_H}px)` }}
            >
              <span className="race-name">{row.model}</span>
              <span className="race-track">
                <span className={`race-bar race-bar--${tone}`} style={{ width: `${pct}%` }} />
              </span>
              <span className="race-value">{format(value, metric.key)}</span>
            </div>
          )
        })}
      </div>

      <p className="race-legend">
        <span className="race-key race-key--best" /> Best
        <span className="race-key race-key--worst" /> Worst
        {unitNote && <span className="race-unit">{unitNote}</span>}
      </p>

      {note && <p className="viz-note">{note}</p>}
    </figure>
  )
}
