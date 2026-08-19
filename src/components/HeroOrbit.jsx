/**
 * The four disciplines as labelled spheres, orbiting slowly beside the name.
 *
 * Built in HTML rather than SVG: real text stays crisper at small sizes, and
 * CSS gradients give depth far more cheaply than SVG filters.
 *
 * WHERE THE LABELS SIT. Each label belongs on the clear part of its own
 * sphere, not in the lens where two spheres cross. The clear part is always the
 * side facing away from the middle of the group, so each label is offset
 * outward from its sphere's centre.
 *
 * That offset has to travel with the orbit to keep pointing outward, so it is
 * applied on the layer that rotates. Only the text itself runs the rotation in
 * reverse, which keeps it upright without dragging it back over the overlap.
 * The highlight is offset the same way, so the label stays in the lit part too.
 *
 * WHY THE LABELS ARE A SEPARATE LAYER. The four slots are coplanar, so the
 * browser paints them in document order: measured front to back it is always
 * br, bl, tr, tl. A label therefore sat under every sphere declared after it,
 * and Economics, declared first, sat under three.
 *
 * That looked intermittent rather than constant because the projection is not
 * rigid. The plane is tilted and lit by a perspective, which magnifies whichever
 * slot is nearest the viewer, so the overlaps between spheres and labels shift
 * as the group turns and the text sank under the glass and surfaced again.
 *
 * Labels therefore ride a second, flat layer that runs the same rotation. It is
 * a sibling of the orbit under the same perspective, so the two stay registered,
 * and being flat it is painted as one unit after every sphere. The text is also
 * never multiplied against whatever passes beneath it.
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
          <div
            key={o.key}
            className={`orb-slot orb-slot--${o.pos}`}
            data-discipline={o.discipline}
          >
            <div className={`orb${o.tone === 'ink' ? ' orb--ink' : ''}`} />
            <div className="orb-gloss" />
          </div>
        ))}
      </div>

      <div className="orbit orbit--labels">
        {ORBS.map((o) => (
          <div key={o.key} className={`orb-slot orb-slot--${o.pos}`}>
            <div className="orb-label-pos">
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
