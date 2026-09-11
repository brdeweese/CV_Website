import { useCallback, useMemo, useRef, useState } from 'react'
import { CROSSWORDS } from '../../data/games.js'

/**
 * The key word crosswords, one from each side of Brina's teaching.
 *
 * The grid is derived from the word list rather than written out: every square
 * a word passes through becomes a cell, and the clue numbers fall out of where
 * words begin. That way a changed clue cannot leave the grid out of step with
 * it, and a second puzzle needs nothing but its own word list.
 */

const key = (r, c) => `${r},${c}`

function buildGrid(puzzle) {
  const cells = new Map() // "r,c" -> { r, c, answer, words: [] }
  const starts = new Map() // "r,c" -> clue number

  for (const w of puzzle.words) {
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
  const [puzzleId, setPuzzleId] = useState(CROSSWORDS[0].id)
  const puzzle = CROSSWORDS.find((p) => p.id === puzzleId) || CROSSWORDS[0]
  const { cells, starts } = useMemo(() => buildGrid(puzzle), [puzzle])
  const [entries, setEntries] = useState({})
  const [checked, setChecked] = useState(false)
  const [active, setActive] = useState(null) // { n, dir }
  const [at, setAt] = useState(null) // "r,c" of the square in focus
  const refs = useRef({})

  const across = puzzle.words.filter((w) => w.dir === 'across')
  const down = puzzle.words.filter((w) => w.dir === 'down')

  const switchTo = useCallback((id) => {
    setPuzzleId(id)
    setEntries({})
    setChecked(false)
    setActive(null)
    setAt(null)
    refs.current = {}
  }, [])

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

  /* At most two: one across, one down. That is what a square can belong to,
     and it is all the clue bar ever needs to show. */
  const hereClues = (() => {
    const cell = at ? cells.get(at) : null
    if (!cell) return []
    return cell.words
      .map((w) => puzzle.words.find((x) => x.n === w.n && x.dir === w.dir))
      .filter(Boolean)
  })()

  const inActive = (r, c) =>
    active &&
    cells.get(key(r, c))?.words.some((w) => w.n === active.n && w.dir === active.dir)

  return (
    <div className="game gm-cw">
      <div className="gm-cwtabs" role="tablist" aria-label="Choose a crossword">
        {CROSSWORDS.map((p) => (
          <button
            type="button"
            role="tab"
            key={p.id}
            className="gm-cwtab"
            aria-selected={p.id === puzzleId}
            onClick={() => switchTo(p.id)}
          >
            <span className="gm-cwtabname">{p.name}</span>
            <span className="gm-cwtabsub">{p.subject}</span>
          </button>
        ))}
      </div>

      <div className="gm-cwlayout">
        <div className="gm-cwscroll">
          <div
            className="gm-grid"
            style={{ gridTemplateColumns: `repeat(${puzzle.cols}, 22px)` }}
          >
            {Array.from({ length: puzzle.rows }, (_, r) =>
              Array.from({ length: puzzle.cols }, (_, c) => {
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
                        setAt(key(r, c))
                        /* Keep typing along the current word if this square is
                           on it; otherwise start on the square's first. */
                        const stay = cell.words.find(
                          (w) => active && w.n === active.n && w.dir === active.dir,
                        )
                        const w = stay || cell.words[0]
                        setActive({ n: w.n, dir: w.dir })
                      }}
                      onChange={(e) => {
                        const w =
                          puzzle.words.find(
                            (x) => active && x.n === active.n && x.dir === active.dir,
                          ) ||
                          puzzle.words.find(
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

        <div className="gm-cluebar" aria-live="polite">
          {hereClues.length === 0 && (
            <p className="gm-cluenone">Pick a square to see its clues.</p>
          )}
          {hereClues.map((w) => (
            <button
              type="button"
              key={`${w.dir}${w.n}`}
              className="gm-clueline"
              data-active={
                active && active.n === w.n && active.dir === w.dir ? 'true' : undefined
              }
              onClick={() => {
                setActive({ n: w.n, dir: w.dir })
                refs.current[key(w.r, w.c)]?.focus()
              }}
            >
              <b>
                {w.n} {w.dir === 'across' ? 'Across' : 'Down'}
              </b>
              <span>{w.q}</span>
            </button>
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
      <p className="gm-source">{puzzle.source}</p>
    </div>
  )
}
