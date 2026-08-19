/**
 * The four disciplines as labelled spheres, orbiting slowly beside the name.
 *
 * Built in HTML rather than SVG for two reasons: real text renders more
 * crisply than SVG <text> at small sizes, and CSS gradients plus box-shadow
 * give the spheres depth far more cheaply than SVG filters would.
 *
 * READABILITY WHILE MOVING is the constraint that shapes this. The orbit turns,
 * which would drag every label upside down with it. Each label therefore runs
 * the same rotation in reverse, at the same duration, so it travels around with
 * its sphere while staying upright the whole way. The stage is tilted on the X
 * axis for depth, which squashes things slightly; the tilt is kept mild enough
 * that the text does not distort noticeably.
 */

const ORBS = [
  { key: 'economics', pos: 'tl', discipline: 'economics', label: 'Economics' },
  { key: 'data', pos: 'tr', discipline: 'data', label: 'Data Science' },
  {
    key: 'tourism',
    pos: 'bl',
    discipline: 'tourism',
    label: 'Tourism Industry Analysis',
  },
  { key: 'lecturing', pos: 'br', tone: 'ink', label: 'Lecturing & Research' },
]

export default function HeroOrbit() {
  return (
    <div className="orbit-stage" aria-hidden="true">
      <div className="orbit">
        {ORBS.map((o) => (
          <div
            key={o.key}
            className={`orb orb--${o.pos}${o.tone === 'ink' ? ' orb--ink' : ''}`}
            data-discipline={o.discipline}
          >
            <span className="orb-label">{o.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
