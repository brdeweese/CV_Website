import { useCallback, useState } from 'react'
import { BUTLER_STAGES, DESTINATIONS, IRRIDEX } from '../../data/games.js'

/**
 * Pin the tail on Butler's curve, with Doxey's Irridex alongside.
 *
 * Tap a destination, then tap a stage. Tap-then-tap rather than drag, because
 * drag is the one interaction that reliably fails on a phone, and every
 * student who plays this in the room is on a phone.
 *
 * These are placements to argue for. The activity says so, and so does the
 * feedback: it names what Brina marks against and leaves the argument open.
 */
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

  return (
    <div className="game gm-butler">
      <p className="gm-hint">
        Tap a destination, then tap a stage on the curve. Then choose where it sits on
        Doxey&rsquo;s Irritation Index. These are placements to argue for, not fixed
        answers.
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
        <svg viewBox="0 0 700 430" aria-hidden="true">
          <path d="M52 34V392H672" className="gm-axis" />
          <path d="M52 140H628" className="gm-capacity" />
          <text className="gm-caplabel" x="626" y="132" textAnchor="end">
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
        </svg>

        {BUTLER_STAGES.map((s) => {
          const sitting = DESTINATIONS.filter((d) => placed[d.id] === s.name)
          return (
            <button
              key={s.name}
              type="button"
              className="gm-slot"
              data-armed={held ? 'true' : undefined}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              onClick={() => drop(s.name)}
            >
              <span className="gm-slotname">{s.name}</span>
              {sitting.map((d) => {
                const state = !checked ? null : d.butler === s.name ? 'ok' : 'no'
                return (
                  <span className="gm-pin" key={d.id} data-state={state || undefined}>
                    {d.name}
                  </span>
                )
              })}
            </button>
          )
        })}
      </div>

      <div className="gm-irridex">
        {DESTINATIONS.map((d) => (
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
            {checked && doxey[d.id] && (
              <span className="gm-imark" data-state={doxey[d.id] === d.doxey ? 'ok' : 'no'}>
                {doxey[d.id] === d.doxey ? '✓' : d.doxey}
              </span>
            )}
          </div>
        ))}
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
          Marked against the placements I use. Venice and Barcelona both sit at stagnation
          with antagonism.
        </p>
      )}
    </div>
  )
}
