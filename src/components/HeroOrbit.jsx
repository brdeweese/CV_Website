/**
 * The four disciplines as labelled spheres, orbiting slowly beside the name.
 *
 * Built in HTML rather than SVG: real text stays crisper at small sizes, and
 * CSS gradients give depth far more cheaply than SVG filters.
 *
 * LIGHTING. The body colour of a sphere is rotationally symmetric, so it can
 * ride the orbit. The highlight cannot: a specular hit that travels around with
 * the sphere looks wrong, and any label pinned to it drifts out of the light.
 * So the lit face and the label live in a layer that runs the orbit in reverse,
 * which keeps the light source fixed in the scene and the label sitting in the
 * bright part of its sphere the whole way round. That reverse rotation is also
 * what stops the text turning upside down.
 *
 * The label is a sibling of the blended sphere rather than a child, so it is
 * never multiplied against whatever it passes over.
 */

const ORBS = [
  { key: 'economics', pos: 'tl', discipline: 'economics', lines: ['Economics'] },
  { key: 'data', pos: 'tr', discipline: 'data', lines: ['Data Science'] },
  {
    key: 'tourism',
    pos: 'bl',
    discipline: 'tourism',
    lines: ['Tourism Industry', 'Analysis'],
  },
  { key: 'lecturing', pos: 'br', tone: 'ink', lines: ['Lecturing &', 'Research'] },
]

export default function HeroOrbit() {
  return (
    <div className="orbit-stage" aria-hidden="true">
      <div className="orbit">
        {ORBS.map((o) => (
          <div key={o.key} className={`orb-slot orb-slot--${o.pos}`} data-discipline={o.discipline}>
            <div className={`orb${o.tone === 'ink' ? ' orb--ink' : ''}`} />
            <div className="orb-face">
              <span className="orb-gloss" />
              <span className="orb-label">
                {o.lines.map((line) => (
                  <span className="orb-line" key={line}>
                    {line}
                  </span>
                ))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
