import { Link } from 'react-router-dom'
import { GAME_ART } from './gameArt.jsx'
import PlayCta from './PlayCta.jsx'

/**
 * The lead panel for the Technology in the Classroom project.
 *
 * The drawing style is carried over from Brina's own Teach with Tech site:
 * the same laptop, the same heavy outline, the same blush and violet fills.
 * The typography, the rules and the spacing stay the CV site's, so the two
 * read as one page rather than as an embedded screenshot of another.
 *
 * The tiles at the bottom are the five activities on /games. Each one shows a
 * drawing of the activity it opens, so the tile says what it is before you
 * read the label.
 */

const TOOLS = [
  'Canva',
  'Wix',
  'Trello',
  'AI tools',
  'Google Colab',
  'Power BI',
  'Tableau',
  'Mailchimp',
  'Excel',
]

/* Brina's laptop, from the Teach with Tech site. */
function Laptop({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 90" aria-hidden="true">
      <path className="tt-lid" d="M30 12h60a6 6 0 0 1 6 6v42H24V18a6 6 0 0 1 6-6z" />
      <rect className="tt-screen" x="34" y="22" width="52" height="30" rx="3" />
      <path className="tt-base" d="M12 60h96l8 16H4z" />
    </svg>
  )
}

export default function TeachTech() {
  return (
    <section className="tt" aria-label="Bringing technology to the classroom">
      <div className="tt-band">
        <Laptop className="tt-laptop tt-laptop--lead" />
        <Laptop className="tt-laptop tt-laptop--far" />
        <svg className="tt-float" viewBox="0 0 100 100" aria-hidden="true">
          <rect x="14" y="14" width="72" height="72" rx="12" />
          <path className="tt-floatMark" d="M32 50h36M50 32v36" />
        </svg>

        <div className="tt-copy">
          <p className="tt-eyebrow">The initiative</p>
          <h2 className="tt-h">
            Bringing technology to <span className="tt-thin">the classroom</span>
          </h2>
          <p className="tt-lede">
            Students are exposed to a myriad of technical applications and tools while they
            study, so they are better prepared for the workplace.
          </p>
          <ul className="tt-tools">
            {TOOLS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="tt-tries">
        <PlayCta eyebrow="All six, in the browser" />
        <p className="tt-triesHead">Or go straight to one</p>
        <div className="tt-grid">
          {GAME_ART.map(({ id, name, Art }) => (
            <Link className="tt-tile" key={id} to={`/games#${id}`}>
              <span className="tt-art" aria-hidden="true">
                <Art />
              </span>
              <span className="tt-name">{name}</span>
              <span className="tt-cta">
                Click to Try <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
