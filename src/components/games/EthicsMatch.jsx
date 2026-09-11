import { useCallback, useState } from 'react'
import { DILEMMAS, ETHICAL_THEORIES } from '../../data/games.js'

/**
 * Brina's Ethics Matching Game, under the trolley.
 *
 * The trolley is the warm-up and has no marked answer. This does: each dilemma
 * carries three responses, one per theory, and the exercise is to name which is
 * which. One dilemma at a time rather than all six down the page, because the
 * point is to read three sentences closely and not to scroll.
 */

const theoryName = (id) => ETHICAL_THEORIES.find((t) => t.id === id)?.name ?? ''

export default function EthicsMatch() {
  const [at, setAt] = useState(0)
  const [picks, setPicks] = useState({}) // `${dilemmaId}:${index}` -> theory id
  const [checked, setChecked] = useState({}) // dilemmaId -> true

  const d = DILEMMAS[at]
  const shown = checked[d.id]

  const set = useCallback(
    (i, v) => {
      setChecked((c) => ({ ...c, [d.id]: false }))
      setPicks((p) => ({ ...p, [`${d.id}:${i}`]: v }))
    },
    [d.id],
  )

  const answered = d.responses.filter((_, i) => picks[`${d.id}:${i}`]).length
  const right = d.responses.filter((r, i) => picks[`${d.id}:${i}`] === r.answer).length

  const go = useCallback((n) => {
    setAt((a) => (a + n + DILEMMAS.length) % DILEMMAS.length)
  }, [])

  return (
    <section className="eth">
      <div className="eth-head">
        <p className="eth-eyebrow">Matching game: ethical theories</p>
        <p className="eth-how">
          Read the dilemma, then match each response to the theory behind it.
        </p>
      </div>

      <ul className="eth-key">
        {ETHICAL_THEORIES.map((t) => (
          <li key={t.id}>
            <b>{t.name}</b> <span>{t.gloss}</span>
          </li>
        ))}
      </ul>

      <div className="eth-card">
        <div className="eth-nav">
          <button
            type="button"
            className="eth-arrow"
            onClick={() => go(-1)}
            aria-label="Previous dilemma"
          >
            &larr;
          </button>
          <span className="eth-count">
            Dilemma {d.n} of {DILEMMAS.length}
          </span>
          <button
            type="button"
            className="eth-arrow"
            onClick={() => go(1)}
            aria-label="Next dilemma"
          >
            &rarr;
          </button>
        </div>

        <p className="eth-text">{d.text}</p>

        <ol className="eth-responses">
          {d.responses.map((r, i) => {
            const pick = picks[`${d.id}:${i}`] || ''
            const state = !shown || !pick ? null : pick === r.answer ? 'ok' : 'no'
            return (
              <li key={i} data-state={state || undefined}>
                <p className="eth-quote">&ldquo;{r.text}&rdquo;</p>
                <div className="eth-pick">
                  <select
                    value={pick}
                    onChange={(e) => set(i, e.target.value)}
                    aria-label={`Theory behind response ${i + 1}`}
                  >
                    <option value="">Choose a theory</option>
                    {ETHICAL_THEORIES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  {state && (
                    <span className="eth-mark" data-state={state}>
                      {state === 'ok' ? '✓' : theoryName(r.answer)}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        <div className="gm-controls">
          <button
            type="button"
            className="btn-game"
            onClick={() => setChecked((c) => ({ ...c, [d.id]: true }))}
            disabled={answered === 0}
          >
            Check answers
          </button>
          <button
            type="button"
            className="btn-game btn-game--ghost"
            onClick={() => {
              setPicks((p) => {
                const next = { ...p }
                d.responses.forEach((_, i) => delete next[`${d.id}:${i}`])
                return next
              })
              setChecked((c) => ({ ...c, [d.id]: false }))
            }}
          >
            Clear
          </button>
        </div>

        {shown && (
          <p className="gm-fb">
            {right} of {d.responses.length} right.
            {right < d.responses.length &&
              ' The theory is shown beside the ones that are not.'}
          </p>
        )}
      </div>
    </section>
  )
}
