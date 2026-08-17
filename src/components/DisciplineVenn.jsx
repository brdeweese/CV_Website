/**
 * The three fields as overlapping sets, sitting beside the "three degrees"
 * figure. It earns its place by doing a second job: it is the first thing on
 * the page that pairs each discipline colour with its name, so the colour
 * coding used throughout the rest of the site is legible from the start.
 *
 * Illustrative, not quantitative — the circles are equal and evenly placed, so
 * no area here encodes a magnitude that could be misread.
 */

const R = 48
const CX = 170

const CIRCLES = [
  { id: 'economics', cx: CX, cy: 70 },
  { id: 'data', cx: CX - 24, cy: 118 },
  { id: 'tourism', cx: CX + 24, cy: 118 },
]

export default function DisciplineVenn() {
  return (
    <svg
      className="venn"
      viewBox="0 0 340 210"
      role="img"
      aria-label="Three overlapping circles labelled Economics, Data Science, and Tourism and Teaching, meeting in the middle."
    >
      {CIRCLES.map((c) => (
        <circle
          key={c.id}
          className="venn-circle"
          data-discipline={c.id}
          cx={c.cx}
          cy={c.cy}
          r={R}
        />
      ))}

      {/* The triple intersection */}
      <circle className="venn-core" cx={CX} cy={102} r="4" />

      <text className="venn-label" x={CX} y="15" textAnchor="middle">
        Economics
      </text>

      {/* Side labels wrap to two lines so they clear the circles and the viewBox */}
      <text className="venn-label" x="88" y="112" textAnchor="end">
        Data
        <tspan x="88" dy="18">
          Science
        </tspan>
      </text>

      <text className="venn-label" x="252" y="112" textAnchor="start">
        Tourism &amp;
        <tspan x="252" dy="18">
          Teaching
        </tspan>
      </text>
    </svg>
  )
}
