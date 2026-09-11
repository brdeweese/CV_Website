import { useCallback, useMemo, useRef, useState } from 'react'
import { CROSSWORD } from '../../data/games.js'

/**
 * The cut-down week three starter crossword.
 *
 * The grid is derived from the word list rather than written out: every square
 * a word passes through becomes a cell, and the clue numbers fall out of where
 * words begin. That way a changed clue cannot leave the grid out of step with
 * it.
 */

const key = (r, c) => `${r},${c}`

function buildGrid() {
  const cells = new Map() // "r,c" -> { r, c, answer, words: [] }
  const starts = new Map() // "r,c" -> clue number

  for (const w of CROSSWORD.words) {
    starts.set(key(w.r, w.c), w.n)
    for (let i = 0; i < w.a.length; i++) {
      const r = w.dir === 'down' ? w.r + i : w.r
      const c = w.dir === 'across' ? w.c + i : w.c
      const k = key(r, c)
      if (!cells.has(k)) cells.set(k, { r, c, answer: w.a[i], words: [] })
      cells.get(k).words.push({ n: w.n, dir: w.dir, index: i })
    }
  }
  return { cells, starts }
}

export default function Crossword() {
  const { cells, starts } = useMemo(buildGrid, [])
  const [entries, setEntries] = useState({})
  const [checked, setChecked] = useState(false)
  const [active, setActive] = useState(null) // { n, dir }
  const refs = useRef({})

  const across = CROSSWORD.words.filter((w) => w.dir === 'across')
  const down = CROSSWORD.words.filter((w) => w.dir === 'down')

  const cellsOf = useCallback(
    (w) =>
      Array.from({ length: w.a.length }, (_, i) => ({
        r: w.dir === 'down' ? w.r + i : w.r,
        c: w.dir === 'across' ? w.c + i : w.c,
      })),
    [],
  )

  const type = useCallback(
    (r, c, v, w) => {
      setChecked(false)
      const ch = (v || '').slice(-1).toUpperCase()
      setEntries((e) => ({ ...e, [key(r, c)]: ch }))
      if (!ch || !w) return
      const list = cellsOf(w)
      const at = list.findIndex((p) => p.r === r && p.c === c)
      const next = list[at + 1]
      if (next) refs.current[key(next.r, next.c)]?.focus()
    },
    [cellsOf],
  )

  const hint = useCallback(() => {
    const empty = [...cells.values()].filter((cell) => !entries[key(cell.r, cell.c)])
    if (!empty.length) return
    const pick = empty[Math.floor(Math.random() * empty.length)]
    setChecked(false)
    setEntries((e) => ({ ...e, [key(pick.r, pick.c)]: pick.answer }))
  }, [cells, entries])

  const clear = useCallback(() => {
    setEntries({})
    setChecked(false)
  }, [])

  const filled = [...cells.values()].filter((cell) => entries[key(cell.r, cell.c)]).length
  const right = [...cells.values()].filter(
    (cell) => entries[key(cell.r, cell.c)] === cell.answer,
  ).length

  const inActive = (r, c) =>
    active &&
    cells.get(key(r, c))?.words.some((w) => w.n === active.n && w.dir === active.dir)

  return (
    <div className="game gm-cw">
      <div className="gm-cwlayout">
        <div className="gm-cwscroll">
          <div
            className="gm-grid"
            style={{ gridTemplateColumns: `repeat(${CROSSWORD.cols}, 30px)` }}
          >
            {Array.from({ length: CROSSWORD.rows }, (_, r) =>
              Array.from({ length: CROSSWORD.cols }, (_, c) => {
                const cell = cells.get(key(r, c))
                if (!cell) return <span className="gm-void" key={key(r, c)} />
                const v = entries[key(r, c)] || ''
                const state = !checked || !v ? null : v === cell.answer ? 'ok' : 'no'
                return (
                  <span
                    className="gm-cell"
                    key={key(r, c)}
                    data-state={state || undefined}
                    data-active={inActive(r, c) ? 'true' : undefined}
                  >
                    {starts.has(key(r, c)) && (
                      <span className="gm-num">{starts.get(key(r, c))}</span>
                    )}
                    <input
                      ref={(el) => {
                        refs.current[key(r, c)] = el
                      }}
                      value={v}
                      maxLength={1}
                      inputMode="text"
                      aria-label={`Row ${r + 1} column ${c + 1}`}
                      onFocus={() => {
                        const w = cell.words[0]
                        setActive({ n: w.n, dir: w.dir })
                      }}
                      onChange={(e) => {
                        const w =
                          CROSSWORD.words.find(
                            (x) => active && x.n === active.n && x.dir === active.dir,
                          ) ||
                          CROSSWORD.words.find(
                            (x) => x.n === cell.words[0].n && x.dir === cell.words[0].dir,
                          )
                        type(r, c, e.target.value, w)
                      }}
                    />
                  </span>
                )
              }),
            )}
          </div>
        </div>

        <div className="gm-clues">
          {[
            ['Across', across],
            ['Down', down],
          ].map(([title, list]) => (
            <div className="gm-cluelist" key={title}>
              <h4>{title}</h4>
              {list.map((w) => (
                <button
                  type="button"
                  key={`${w.dir}${w.n}`}
                  className="gm-clue"
                  data-active={
                    active && active.n === w.n && active.dir === w.dir ? 'true' : undefined
                  }
                  onClick={() => {
                    setActive({ n: w.n, dir: w.dir })
                    refs.current[key(w.r, w.c)]?.focus()
                  }}
                >
                  <b>{w.n}</b>
                  {w.q}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="gm-controls">
        <button
          type="button"
          className="btn-game"
          onClick={() => setChecked(true)}
          disabled={!filled}
        >
          Check answers
        </button>
        <button type="button" className="btn-game btn-game--ghost" onClick={hint}>
          Give me a letter
        </button>
        <button type="button" className="btn-game btn-game--ghost" onClick={clear}>
          Clear
        </button>
      </div>

      {checked && (
        <p className="gm-fb">
          {right} of {cells.size} letters right.
        </p>
      )}
      <p className="gm-source">{CROSSWORD.source}</p>
    </div>
  )
}
