import { useCallback, useMemo, useState } from 'react'
import {
  GROUPS,
  KPI_AVERAGES,
  KPI_BANDS,
  KPI_COLUMNS,
  KPI_TARGETS,
  kpiBand,
} from '../data/meqDemo.js'

/**
 * How the module did against its KPIs, group by group.
 *
 * This is the half of the recap meeting that comes before the feedback: four
 * averages against target, then every group's own figures with each cell shaded
 * by how far off it is.
 *
 * Every number is invented. See the note in the data file.
 *
 * The shading is one ramp rather than four colours, because distance to target
 * is ordered. Meeting the target is the one step different in kind, so it
 * carries a tick as well, and every cell shows its number, so the colour is
 * never the only thing saying what a cell means.
 */

/** Reads the same either side of the target, rather than "-1 below". */
function gapText(value, target) {
  if (value === target) return 'met'
  return value > target ? `${value - target} above` : `${target - value} below`
}

export default function KpiBoard() {
  const [shown, setShown] = useState(false)
  const [sort, setSort] = useState('campus')

  const rows = useMemo(() => {
    const copy = [...GROUPS]
    if (sort === 'campus')
      return copy.sort(
        (a, b) => a.campus.localeCompare(b.campus) || a.group.localeCompare(b.group),
      )
    /* Worst first when sorting by a figure: the point of the table is finding
       the groups that need something done about them. */
    return copy.sort((a, b) => a[sort] - b[sort])
  }, [sort])

  const cycleSort = useCallback((id) => {
    setSort((s) => (s === id ? 'campus' : id))
  }, [])

  const play = useCallback(() => {
    setSort('campus')
    /* Off, then on a tick later, so replaying re-runs the transitions instead
       of landing on the state they already hold. */
    setShown(false)
    setTimeout(() => setShown(true), 60)
  }, [])

  return (
    <figure className="kpi" data-on={shown ? 'true' : undefined}>
      <figcaption className="kpi-head">
        <p className="kpi-eyebrow">The same example, before the comments</p>
        <h3 className="kpi-title">How the module did against target</h3>
      </figcaption>

      <div className="kpi-start" data-done={shown ? 'true' : undefined}>
        <button
          type="button"
          className="ff-play kpi-playbtn"
          onClick={play}
          aria-label="Score the groups against their targets"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle className="ff-playring" cx="12" cy="12" r="10.5" />
            <path className="ff-playtri" d="M9.5 7.5L17 12L9.5 16.5Z" />
          </svg>
        </button>
        <p className="kpi-startline">
          {shown ? 'Scored against target.' : 'Press play to score against target'}
        </p>
        <p className="kpi-startsub">
          {shown
            ? 'Select a column to sort by it, lowest first.'
            : 'The figures are already in. Play fills the bars and colours each cell by how far it is from its KPI.'}
        </p>
      </div>

      <ul className="kpi-averages">
        {KPI_AVERAGES.map((k) => {
          const band = kpiBand(k.value, k.target)
          /* Percentages and marks are both out of 100, so one track serves
             all four without a second scale. */
          const pct = Math.min(100, k.value)
          const tpct = Math.min(100, k.target)
          return (
            <li key={k.id} data-band={band}>
              <span className="kpi-avlabel">{k.label}</span>
              <span className="kpi-avvalue">
                {k.value}
                {k.unit}
              </span>
              <span className="kpi-track">
                <span
                  className="kpi-fill"
                  style={{ width: shown ? `${pct}%` : '0%' }}
                  data-band={band}
                />
                <span className="kpi-target" style={{ left: `${tpct}%` }} />
              </span>
              <span className="kpi-avtarget">
                target {k.target}
                {k.unit} &middot; {gapText(k.value, k.target)}
              </span>
            </li>
          )
        })}
      </ul>

      <div className="kpi-legend">
        {KPI_BANDS.map((b) => (
          <span key={b.id} className="kpi-key" data-band={b.id}>
            <i aria-hidden="true">{b.id === 'met' ? '✓' : ''}</i>
            {b.label}
          </span>
        ))}
      </div>

      <div className="kpi-scroll">
        <table className="kpi-table">
          <thead>
            <tr>
              <th scope="col">
                <button
                  type="button"
                  onClick={() => cycleSort('campus')}
                  data-active={sort === 'campus' ? 'true' : undefined}
                >
                  Campus
                </button>
              </th>
              <th scope="col">Group</th>
              <th scope="col" className="kpi-num">
                Students
              </th>
              {KPI_COLUMNS.map((c) => (
                <th scope="col" key={c.id} className="kpi-num">
                  <button
                    type="button"
                    onClick={() => cycleSort(c.id)}
                    data-active={sort === c.id ? 'true' : undefined}
                  >
                    {c.short}
                    <span className="kpi-th-target">
                      target {KPI_TARGETS[c.id]}
                      {c.unit}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.campus}-${r.group}`}>
                <td>{r.campus}</td>
                <td className="kpi-group">{r.group}</td>
                <td className="kpi-num kpi-plain">{r.students}</td>
                {KPI_COLUMNS.map((c) => {
                  const band = kpiBand(r[c.id], KPI_TARGETS[c.id])
                  return (
                    <td
                      key={c.id}
                      className="kpi-num kpi-cell"
                      data-band={band}
                      style={{ transitionDelay: `${i * 45}ms` }}
                    >
                      {band === 'met' && (
                        <span className="kpi-tick" aria-hidden="true">
                          ✓
                        </span>
                      )}
                      {r[c.id]}
                      {c.unit}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="kpi-read">
        Three of the four figures meet target and the pass rate falls two short. Attendance
        and outcomes move together loosely, not in lockstep: the correlation with submission
        is 0.50 and with pass 0.68, so attendance is worth chasing without being the whole
        story. One group sits well behind the rest, which is the sort of thing this table
        exists to surface.
      </p>
    </figure>
  )
}
