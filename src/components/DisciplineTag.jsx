import { disciplines } from '../data/cv.js'

/**
 * A discipline label. The coloured dot is reinforcement only — the text label
 * always ships with it, so the colour never has to carry the meaning alone.
 * (Light-mode tourism sits below 3:1 against the surface by design.)
 */
export default function DisciplineTag({ id, className = '' }) {
  const d = disciplines[id]
  if (!d) return null
  return (
    <span className={`tag-disc ${className}`} data-discipline={id}>
      {d.label}
    </span>
  )
}
