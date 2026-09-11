import TeachMorph from './TeachMorph.jsx'

const FILES = `${import.meta.env.BASE_URL}files/`

/**
 * The Teach with Tech session itself, offered as the deck rather than retold
 * in prose.
 *
 * The cover is rebuilt rather than screenshotted, so the joke printed on it
 * actually happens: TEACH becomes TECH. The two slides beneath it are rendered
 * from the PDF at publish time, so they are the actual slides and cannot go
 * stale against a redeck. Dimensions are set on each image so the panel does
 * not reflow as they load.
 */

const SLIDES = [
  {
    src: `${FILES}deck/ai.png`,
    alt: 'Slide: AI as a tool, covering role play, business plans and data science basics',
    w: 648,
    h: 364,
  },
  {
    src: `${FILES}deck/wix.png`,
    alt: 'Slide: Wix as a tool, covering CV sites, destination sites and event sites',
    w: 648,
    h: 364,
  },
]

export default function TeachDeck() {
  return (
    <section className="deck" aria-label="Teach with Tech, the session deck">
      <div className="deck-head">
        <p className="deck-eyebrow">The session</p>
        <h2 className="deck-title">Teach with Tech</h2>
        <p className="deck-meta">
          <span>28 slides</span>
          <span>PDF</span>
          <span>2.2 MB</span>
        </p>
      </div>

      <ul className="deck-strip">
        {/* The cover is played rather than shown, so the joke on it lands. */}
        <li data-lead="true">
          <TeachMorph />
        </li>
        {SLIDES.map((s) => (
          <li key={s.src}>
            <img
              src={s.src}
              alt={s.alt}
              width={s.w}
              height={s.h}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>

      <div className="deck-actions">
        <a
          className="deck-download"
          href={`${FILES}teach-with-tech.pdf`}
          target="_blank"
          rel="noreferrer"
        >
          Download the presentation <span aria-hidden="true">↓</span>
        </a>
        <a
          className="deck-side"
          href="https://brinadeweese.wixsite.com/teachtech"
          target="_blank"
          rel="noreferrer"
        >
          Teach with Tech resources <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  )
}
