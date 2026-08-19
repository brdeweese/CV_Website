import { useState } from 'react'
import { AGE_BANDS } from '../data/projects/immigrationRaw.js'
import MigrationMap from './MigrationMap.jsx'

/**
 * The animated map from the original dashboard, with its filters.
 *
 * The map is a straight port: the canvas drawing, the arc physics, the era
 * bands and the scrubbable timeline are the dashboard's own code. Only two
 * things changed. The chrome was rebuilt in this site's CSS because the
 * original leaned entirely on Tailwind, which this project does not use. And
 * the arcs were recoloured from pink/blue to this site's chart series, so the
 * map agrees with the line chart sitting directly beneath it rather than
 * showing the same two groups in different colours on one page.
 *
 * State lives here so the filters and the map share it, exactly as they did in
 * the dashboard.
 */

const GENDERS = ['All', 'Female', 'Male']

export default function MigrationExplorer() {
  const [activeBands, setActiveBands] = useState([...AGE_BANDS])
  const [gender, setGender] = useState('All')
  const [, setCurrentQuarterIdx] = useState(0)

  const allSelected = activeBands.length === AGE_BANDS.length
  const isDefault = allSelected && gender === 'All'

  function toggleBand(band) {
    setActiveBands((prev) =>
      prev.includes(band) ? prev.filter((b) => b !== band) : [...prev, band],
    )
  }

  return (
    <div className="mexplore">
      <MigrationMap
        gender={gender}
        activeBands={activeBands}
        setCurrentQuarterIdx={setCurrentQuarterIdx}
      />

      <div className="mfilters">
        <div className="mfilter-group">
          <span className="mfilter-head">Gender</span>
          <div className="mfilter-row" role="group" aria-label="Filter by gender">
            {GENDERS.map((g) => (
              <button
                key={g}
                className={`mfilter-btn${gender === g ? ' is-on' : ''}`}
                onClick={() => setGender(g)}
                aria-pressed={gender === g}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mfilter-group mfilter-group--bands">
          <div className="mfilter-head-row">
            <span className="mfilter-head">Age groups</span>
            <button
              className="mfilter-toggle-all"
              onClick={() => setActiveBands(allSelected ? [] : [...AGE_BANDS])}
            >
              {allSelected ? 'Clear all' : 'Select all'}
            </button>
          </div>
          <div className="mfilter-bands" role="group" aria-label="Filter by age group">
            {AGE_BANDS.map((band) => {
              const on = activeBands.includes(band)
              return (
                <button
                  key={band}
                  className={`mfilter-band${on ? ' is-on' : ''}`}
                  onClick={() => toggleBand(band)}
                  aria-pressed={on}
                >
                  {band}
                </button>
              )
            })}
          </div>
        </div>

        {!isDefault && (
          <button
            className="mfilter-reset"
            onClick={() => {
              setActiveBands([...AGE_BANDS])
              setGender('All')
            }}
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  )
}
