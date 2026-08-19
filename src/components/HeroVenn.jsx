/**
 * The four-circle diagram again, as a slowly turning motif beside the name.
 *
 * This version carries NO labels, deliberately. If the circles rotate, any
 * label rotates away from the circle it names and the colour-to-meaning
 * mapping breaks. Unlabelled here, it is decoration; the labelled version in
 * the metrics band is the one that has to explain the colour system.
 *
 * Geometry is symmetrical about the centre of the viewBox, so the centre of
 * the diagram is also the point all four circles share. That is where the MSc
 * comes to rest.
 */

const R = 62
const CIRCLES = [
  { key: 'economics', cx: 86, cy: 86, discipline: 'economics' },
  { key: 'data', cx: 154, cy: 86, discipline: 'data' },
  { key: 'tourism', cx: 86, cy: 154, discipline: 'tourism' },
  { key: 'lecturing', cx: 154, cy: 154, tone: 'ink' },
]

export default function HeroVenn() {
  return (
    <svg className="hero-venn" viewBox="0 0 240 240" aria-hidden="true" focusable="false">
      <g className="hero-venn-spin">
        {CIRCLES.map((c) => (
          <circle
            key={c.key}
            className={`hero-venn-circle${c.tone === 'ink' ? ' hero-venn-circle--ink' : ''}`}
            data-discipline={c.discipline}
            cx={c.cx}
            cy={c.cy}
            r={R}
          />
        ))}
      </g>
    </svg>
  )
}
