import { useCallback, useState } from 'react'
import { BUTLER_STAGES, DESTINATIONS, IRRIDEX } from '../../data/games.js'

/**
 * Pin the tail on Butler's curve, with Doxey's Irridex alongside.
 *
 * Tap a destination, then tap a stage. Tap-then-tap rather than drag, because
 * drag is the one interaction that reliably fails on a phone, and every
 * student who plays this in the room is on a phone.
 *
 * The stage labels are drawn inside the SVG rather than positioned over it in
 * HTML. Percentage positions with fixed-pixel boxes collide as the board
 * narrows; inside the SVG the text scales with the drawing, so a layout that
 * clears at one width clears at every width. Each label sits off the curve on
 * an alternating side, joined to its point by a leader line, so no two labels
 * share a horizontal band.
 *
 * Marking accepts the stage either side on the curve as well as the exact one.
 * These are placements to argue for, and a destination that sits between two
 * stages is a defensible answer at either.
 */

const VB = { w: 700, h: 430 }
const NAME_SIZE = 13
const PIN_SIZE = 12
const PIN_STEP = 15
const CHAR_W = 7.4

const px = (v) => (v / 100) * VB.w
const py = (v) => (v / 100) * VB.h

/** Adjacent on the ordered index, so one step either way is arguable. */
function doxeyState(picked, correct) {
  if (!picked) return null
  if (picked === correct) return 'ok'
  const a = IRRIDEX.indexOf(picked)
  const b = IRRIDEX.indexOf(correct)
  return a >= 0 && b >= 0 && Math.abs(a - b) === 1 ? 'near' : 'no'
}

function butlerState(stageName, correctName) {
  if (stageName === correctName) return 'ok'
  const correct = BUTLER_STAGES.find((s) => s.name === correctName)
  return correct?.next.includes(stageName) ? 'near' : 'no'
}

export default function ButlerCurve() {
  const [placed, setPlaced] = useState({}) // destId -> stage name
  const [doxey, setDoxey] = useState({}) // destId -> irridex level
  const [held, setHeld] = useState(null)
  const [checked, setChecked] = useState(false)

  const drop = useCallback(
    (stage) => {
      if (!held) return
      setChecked(false)
      setPlaced((p) => ({ ...p, [held]: stage }))
      setHeld(null)
    },
    [held],
  )

  const reset = useCallback(() => {
    setPlaced({})
    setDoxey({})
    setHeld(null)
    setChecked(false)
  }, [])

  const unplaced = DESTINATIONS.filter((d) => !placed[d.id])
  const done = DESTINATIONS.filter((d) => placed[d.id] && doxey[d.id]).length
  const anyNear =
    checked &&
    (DESTINATIONS.some(
      (d) => placed[d.id] && butlerState(placed[d.id], d.butler) === 'near',
    ) ||
      DESTINATIONS.some((d) => doxeyState(doxey[d.id], d.doxey) === 'near'))

  return (
    <div className="game gm-butler">
      <p className="gm-hint">
        Tap a destination, then tap a stage on the curve. Then choose where it sits on
        Doxey&rsquo;s Irritation Index. These are placements to argue for, so the stage
        either side counts as well.
      </p>

      <div className="gm-tray">
        {unplaced.length === 0 && <span className="gm-trayempty">All placed</span>}
        {unplaced.map((d) => (
          <button
            key={d.id}
            type="button"
            className="gm-chip"
            data-held={held === d.id ? 'true' : undefined}
            onClick={() => setHeld(held === d.id ? null : d.id)}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="gm-board">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          role="group"
          aria-label="Butler's Tourism Area Life Cycle"
        >
          <path d="M52 34V392H672" className="gm-axis" />
          <path d="M52 140H628" className="gm-capacity" />
          <text className="gm-caplabel" x="58" y="132">
            Destination capacity reached
          </text>
          <path
            d="M60 378C130 372 172 344 216 292C262 238 306 178 372 152C432 128 492 120 545 118"
            className="gm-curve"
          />
          <path d="M545 118C588 108 618 82 662 54" className="gm-curve gm-curve--rejuv" />
          <path
            d="M545 118C588 130 618 164 662 214"
            className="gm-curve gm-curve--decline"
          />
          <text
            className="gm-axislabel"
            x="24"
            y="230"
            transform="rotate(-90 24 230)"
            textAnchor="middle"
          >
            Number of tourists
          </text>
          <text className="gm-axislabel" x="360" y="418" textAnchor="middle">
            Time
          </text>

          {BUTLER_STAGES.map((s) => {
            const sitting = DESTINATIONS.filter((d) => placed[d.id] === s.name)
            const cx = px(s.x)
            const cy = py(s.y)
            const lx = px(s.lx)
            const ly = py(s.ly)

            const widest = Math.max(s.name.length, ...sitting.map((d) => d.name.length), 0)
            const w = widest * CHAR_W + 20
            const boxTop = ly - NAME_SIZE
            const boxH = NAME_SIZE + 8 + sitting.length * PIN_STEP
            const leaderY = ly > cy ? boxTop - 4 : boxTop + boxH + 4

            return (
              <g
                key={s.name}
                className="gm-stage"
                data-armed={held ? 'true' : undefined}
                role="button"
                tabIndex={0}
                aria-label={`Place at ${s.name}`}
                onClick={() => drop(s.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    drop(s.name)
                  }
                }}
              >
                <line className="gm-leader" x1={cx} y1={cy} x2={lx} y2={leaderY} />
                <circle className="gm-dot" cx={cx} cy={cy} r="5.5" />
                <rect
                  className="gm-slotbox"
                  x={lx - w / 2}
                  y={boxTop}
                  width={w}
                  height={boxH}
                  rx="7"
                />
                <text
                  className="gm-slotname"
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  fontSize={NAME_SIZE}
                >
                  {s.name}
                </text>
                {sitting.map((d, i) => {
                  const state = checked ? butlerState(s.name, d.butler) : null
                  return (
                    <text
                      key={d.id}
                      className="gm-pintext"
                      data-state={state || undefined}
                      x={lx}
                      y={ly + 6 + (i + 1) * PIN_STEP}
                      textAnchor="middle"
                      fontSize={PIN_SIZE}
                    >
                      {state === 'ok' || state === 'near' ? `✓ ${d.name}` : d.name}
                    </text>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="gm-irridex">
        {DESTINATIONS.map((d) => {
          const state = checked ? doxeyState(doxey[d.id], d.doxey) : null
          return (
            <div className="gm-irow" key={d.id}>
              <span className="gm-iname">{d.name}</span>
              <select
                value={doxey[d.id] || ''}
                onChange={(e) => {
                  setChecked(false)
                  setDoxey((p) => ({ ...p, [d.id]: e.target.value }))
                }}
                aria-label={`Irridex level for ${d.name}`}
              >
                <option value="">Irridex level</option>
                {IRRIDEX.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              {state && (
                <span className="gm-imark" data-state={state}>
                  {state === 'ok' ? '✓' : state === 'near' ? '✓ arguable' : d.doxey}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="gm-controls">
        <button
          type="button"
          className="btn-game"
          onClick={() => setChecked(true)}
          disabled={done === 0}
        >
          Check answers
        </button>
        <button type="button" className="btn-game btn-game--ghost" onClick={reset}>
          Reset
        </button>
      </div>

      {checked && (
        <p className="gm-fb">
          Marked against the placements I use, and against the stage either side, which is
          just as arguable.
          {anyNear && ' Ticks marked arguable are the neighbouring answer.'} Venice and
          Barcelona both sit at stagnation with antagonism.
        </p>
      )}
    </div>
  )
}
