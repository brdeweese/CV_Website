import { Link } from 'react-router-dom'

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

/* ---- The drawings on the activity tiles ----------------------------------- */

function MiniImpacts() {
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      {[8, 26, 44].map((y, i) => (
        <g key={y}>
          <rect className="tt-mFill" x="8" y={y} width="62" height="14" rx="7" />
          <rect
            className={`tt-mTint tt-mTint--${i}`}
            x="76"
            y={y}
            width="36"
            height="14"
            rx="7"
          />
        </g>
      ))}
    </svg>
  )
}

function MiniButler() {
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      <path className="tt-mAxis" d="M12 8V54H110" />
      <path className="tt-mCurve" d="M16 50C36 48 48 34 66 24C82 15 96 13 104 13" />
      <path className="tt-mLead" d="M66 24V40" />
      <circle className="tt-mDot" cx="66" cy="24" r="4.5" />
      <rect className="tt-mBox" x="44" y="40" width="44" height="12" rx="5" />
    </svg>
  )
}

function MiniCrossword() {
  const cells = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [1, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
  ]
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      {cells.map(([c, r]) => (
        <rect
          key={`${c}-${r}`}
          className="tt-mCell"
          x={18 + c * 17}
          y={8 + r * 17}
          width="15"
          height="15"
          rx="2"
        />
      ))}
      <text className="tt-mLetter" x={18 + 1 * 17 + 7.5} y={8 + 7.5 + 4}>
        D
      </text>
      <text className="tt-mLetter" x={18 + 2 * 17 + 7.5} y={8 + 2 * 17 + 7.5 + 4}>
        A
      </text>
    </svg>
  )
}

function MiniTrolley() {
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      <path className="tt-mAxis" d="M8 38H112" />
      <path className="tt-mAxis" d="M54 38C74 40 88 48 112 54" />
      <path className="tt-mLead" d="M54 38L64 22" />
      <circle className="tt-mDot" cx="64" cy="22" r="4.5" />
      <rect className="tt-mCar" x="8" y="24" width="26" height="14" rx="3" />
      <circle className="tt-mWheel" cx="16" cy="39" r="3.5" />
      <circle className="tt-mWheel" cx="27" cy="39" r="3.5" />
    </svg>
  )
}

function MiniTrade() {
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      <g className="tt-mPaper tt-mPaper--0" transform="translate(26 34) rotate(-12)">
        <rect x="-14" y="-14" width="28" height="28" rx="3" />
      </g>
      <g className="tt-mPaper tt-mPaper--1" transform="translate(60 26) rotate(8)">
        <path d="M0 -16L14 10H-14Z" />
      </g>
      <g className="tt-mPaper tt-mPaper--2" transform="translate(94 36)">
        <circle r="14" />
      </g>
      <path className="tt-mArc" d="M28 12C46 2 64 2 80 10" />
    </svg>
  )
}

function MiniPython() {
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      <path className="tt-mAxis" d="M40 10V54H112" />
      <path className="tt-mCurve" d="M46 46C58 44 66 30 78 26C90 22 100 20 108 18" />
      <path className="tt-mLead" d="M46 36C58 34 70 40 82 34C94 28 100 34 108 30" />
      <circle className="tt-mDot" cx="22" cy="32" r="11" />
      <path className="tt-mPlay" d="M18.5 27L27 32L18.5 37Z" />
    </svg>
  )
}

const TILES = [
  { id: 'python', name: 'Coding practice with AI', Art: MiniPython },
  { id: 'butler', name: "Pin the tail on Butler's curve", Art: MiniButler },
  { id: 'impacts', name: 'Sort the impact', Art: MiniImpacts },
  { id: 'crossword', name: 'Key word crossword', Art: MiniCrossword },
  { id: 'trolley', name: 'The ethical dilemma', Art: MiniTrolley },
  { id: 'trade', name: 'The international trade game', Art: MiniTrade },
]

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
        <p className="tt-triesHead">The activities, playable</p>
        <div className="tt-grid">
          {TILES.map(({ id, name, Art }) => (
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
