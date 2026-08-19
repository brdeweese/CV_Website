import { useNavigate } from 'react-router-dom'
import { visibleProjects } from '../data/cv.js'

/**
 * Jump straight to a project's write-up.
 *
 * A native <select> on purpose. It gets keyboard support, screen reader
 * support, and the platform's own picker on a phone for free, none of which a
 * hand-rolled listbox gives you without a good deal of ARIA work. Only the
 * wrapper is styled; the control itself stays native.
 *
 * The value is never held in state: this navigates rather than choosing
 * something, so leaving it on the placeholder means the field still reads
 * "Select a project" when someone comes back to the page.
 */
export default function ProjectPicker() {
  const navigate = useNavigate()

  return (
    <div className="picker">
      <label className="picker-label" htmlFor="project-picker">
        Explore in depth
      </label>

      <div className="picker-control">
        <select
          id="project-picker"
          className="picker-select"
          value=""
          onChange={(e) => {
            if (e.target.value) navigate(`/projects/${e.target.value}`)
          }}
        >
          <option value="">Select a project…</option>
          {visibleProjects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>

        <svg
          className="picker-chevron"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
