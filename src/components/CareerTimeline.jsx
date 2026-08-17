import { useMemo } from 'react'
import { disciplines, experience } from '../data/cv.js'
import { formatPeriod, periodPoints } from '../utils/period.js'

/**
 * Career timeline — a span chart of roles over real calendar years.
 *
 * Form choice: the data's job is duration and overlap over time, which is a
 * span/Gantt form, not a magnitude comparison. Nothing here is estimated; every
 * bar is drawn straight from the start/end years in cv.js.
 *
 * Accessibility: the same information appears immediately below as a text list
 * with explicit date ranges, which serves as the table view. Each bar also
 * carries a <title> for hover and screen readers, and every colour is paired
 * with a written label in the legend.
 */

const VB_W = 900
const LABEL_W = 236
const PLOT_X = LABEL_W + 26
const PLOT_W = VB_W - PLOT_X - 16
const HEADER_H = 34
const ROW_H = 56
const PAD_B = 16
const BAR_H = 18

export default function CareerTimeline() {
  const { rows, minYear, maxYear, ticks, nowPos, height } = useMemo(() => {
    const now = new Date()
    const nowYear = now.getFullYear() + now.getMonth() / 12

    const points = experience.map((e) => periodPoints(e, nowYear))
    const starts = points.map((p) => p.start)
    const ends = points.map((p) => p.end)

    const min = Math.floor(Math.min(...starts))
    // Headroom past the newest bar, but not so much that an extra, empty
    // calendar year appears on the axis.
    const max = Math.max(...ends, nowYear) + 0.3

    const scale = (year) => PLOT_X + ((year - min) / (max - min)) * PLOT_W

    const built = experience.map((e, i) => {
      const x1 = scale(points[i].start)
      const x2 = scale(points[i].end)
      return {
        ...e,
        rowTop: HEADER_H + i * ROW_H,
        x: x1,
        // Floor the width so a role lasting a single month stays visible.
        width: Math.max(x2 - x1, 6),
        rangeLabel: formatPeriod(e),
      }
    })

    const tickList = []
    for (let y = min; y <= Math.floor(max); y += 1) {
      tickList.push({ year: y, x: scale(y) })
    }

    return {
      rows: built,
      minYear: min,
      maxYear: max,
      ticks: tickList,
      nowPos: scale(nowYear),
      height: HEADER_H + experience.length * ROW_H + PAD_B,
    }
  }, [])

  return (
    <figure className="tl reveal">
      <div className="tl-head">
        <figcaption className="tl-title">Roles over time</figcaption>
        <div className="tl-legend">
          {Object.values(disciplines).map((d) => (
            <span key={d.id} className="tag-disc" data-discipline={d.id}>
              {d.label}
            </span>
          ))}
        </div>
      </div>

      <div className="tl-scroll">
        <svg
          className="tl-svg"
          viewBox={`0 0 ${VB_W} ${height}`}
          role="img"
          aria-label={`Timeline of ${rows.length} roles from ${minYear} to the present. The same dates are listed as text below.`}
        >
          {/* Year gridlines and ticks */}
          {ticks.map((t) => (
            <g key={t.year}>
              <line
                className="tl-grid"
                x1={t.x}
                y1={HEADER_H - 12}
                x2={t.x}
                y2={height - PAD_B}
              />
              <text className="tl-tick" x={t.x} y={HEADER_H - 20} textAnchor="middle">
                {t.year}
              </text>
            </g>
          ))}

          {/* "Now" marker */}
          <line
            className="tl-axis"
            x1={nowPos}
            y1={HEADER_H - 12}
            x2={nowPos}
            y2={height - PAD_B}
            strokeDasharray="3 3"
          />

          {/* Baseline under the plot */}
          <line
            className="tl-axis"
            x1={PLOT_X}
            y1={height - PAD_B}
            x2={PLOT_X + PLOT_W}
            y2={height - PAD_B}
          />

          {rows.map((r) => (
            <g className="tl-row" key={r.id} data-discipline={r.discipline}>
              {/* Full-width transparent hit target, larger than the bar itself */}
              <rect
                x="0"
                y={r.rowTop}
                width={VB_W}
                height={ROW_H}
                fill="transparent"
              />

              <text className="tl-label" x="0" y={r.rowTop + 26}>
                {r.role}
              </text>
              <text className="tl-sub" x="0" y={r.rowTop + 42}>
                {r.org.toUpperCase()}
              </text>

              {/* Direct label above the bar — no reliance on colour alone */}
              <text className="tl-sub" x={r.x} y={r.rowTop + 18}>
                {r.rangeLabel}
              </text>

              <rect
                className="tl-bar"
                x={r.x}
                y={r.rowTop + 24}
                width={r.width}
                height={BAR_H}
                rx="4"
                fill="var(--accent)"
              >
                <title>{`${r.role}, ${r.org} — ${r.rangeLabel}`}</title>
              </rect>
            </g>
          ))}
        </svg>
      </div>
    </figure>
  )
}
