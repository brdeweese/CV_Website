/**
 * The four areas the work sits across, drawn as overlapping sets.
 *
 * COLOUR NOTE: three of the circles carry the site's discipline colours. The
 * fourth is deliberately ink rather than a new hue. The palette's three
 * categorical slots are the most that stay separable under colour-vision
 * deficiency — a fourth hue was tested (violet, magenta, red, yellow, and green
 * all fail: violet collapses onto the dark-mode blue at ΔE 1.9 for red-blind
 * viewers) so ink is used instead. It is also the heaviest colour on the page,
 * so the lecturing circle reads as the anchor rather than as a leftover.
 *
 * Illustrative, not quantitative: the circles are equal and evenly placed, so
 * no area encodes a magnitude. Every circle is directly labelled, so identity
 * never depends on colour.
 */

const R = 48

// The viewBox is wider than the circles need, so the longest label
// ("Tourism Industry") has room to sit outside them without clipping.
const CIRCLES = [
  { key: 'economics', cx: 158, cy: 82, tone: 'accent', discipline: 'economics' },
  { key: 'data', cx: 222, cy: 82, tone: 'accent', discipline: 'data' },
  { key: 'tourism', cx: 158, cy: 138, tone: 'accent', discipline: 'tourism' },
  { key: 'lecturing', cx: 222, cy: 138, tone: 'ink' },
]

export default function DisciplineVenn() {
  return (
    <svg
      className="venn"
      viewBox="0 0 380 240"
      role="img"
      aria-label="Four overlapping circles labelled Economics, Data Science, Tourism Industry Analysis, and Lecturing and Research, meeting in the middle."
    >
      {CIRCLES.map((c) => (
        <circle
          key={c.key}
          className={`venn-circle${c.tone === 'ink' ? ' venn-circle--ink' : ''}`}
          data-discipline={c.discipline}
          cx={c.cx}
          cy={c.cy}
          r={R}
        />
      ))}

      {/* Where all four meet */}
      <circle className="venn-core" cx="190" cy="110" r="4" />

      <text className="venn-label" x="144" y="26" textAnchor="end">
        Economics
      </text>
      <text className="venn-label" x="236" y="26" textAnchor="start">
        Data Science
      </text>

      <text className="venn-label" x="144" y="206" textAnchor="end">
        Tourism Industry
        <tspan x="144" dy="18">
          Analysis
        </tspan>
      </text>
      <text className="venn-label" x="236" y="206" textAnchor="start">
        Lecturing &amp;
        <tspan x="236" dy="18">
          Research
        </tspan>
      </text>
    </svg>
  )
}
