import { useCallback, useState } from 'react'
import { IMPACTS, IMPACT_CATEGORIES } from '../../data/games.js'

/**
 * Six of the fifteen impacts from the escape room. Pick a category for each.
 *
 * Marked per row rather than as a score, because the useful feedback in the
 * room is which one you got wrong, not how many.
 */
export default function ImpactSort() {
  const [picks, setPicks] = useState({})
  const [checked, setChecked] = useState(false)

  const set = useCallback((id, v) => {
    setChecked(false)
    setPicks((p) => ({ ...p, [id]: v }))
  }, [])

  const reset = useCallback(() => {
    setPicks({})
    setChecked(false)
  }, [])

  const answered = IMPACTS.filter((i) => picks[i.id]).length
  const right = IMPACTS.filter((i) => picks[i.id] === i.answer).length

  return (
    <div className="game gm-sort">
      <table className="gm-table">
        <tbody>
          {IMPACTS.map((i) => {
            const state =
              !checked || !picks[i.id] ? null : picks[i.id] === i.answer ? 'ok' : 'no'
            return (
              <tr key={i.id} data-state={state || undefined}>
                <td className="gm-impact">{i.text}</td>
                <td className="gm-pick">
                  <select
                    value={picks[i.id] || ''}
                    onChange={(e) => set(i.id, e.target.value)}
                    aria-label={`Category for: ${i.text}`}
                  >
                    <option value="">Choose a category</option>
                    {IMPACT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="gm-mark">
                  {state === 'ok' ? '✓' : state === 'no' ? i.answer : ''}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="gm-controls">
        <button
          type="button"
          className="btn-game"
          onClick={() => setChecked(true)}
          disabled={answered === 0}
        >
          Check answers
        </button>
        <button type="button" className="btn-game btn-game--ghost" onClick={reset}>
          Reset
        </button>
      </div>

      {checked && (
        <p className="gm-fb">
          {right} of {IMPACTS.length} right.
          {right < IMPACTS.length &&
            ' The correct category is shown beside the ones that are not.'}
        </p>
      )}
    </div>
  )
}
