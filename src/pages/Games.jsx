import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const ImpactSort = lazy(() => import('../components/games/ImpactSort.jsx'))
const ButlerCurve = lazy(() => import('../components/games/ButlerCurve.jsx'))
const Crossword = lazy(() => import('../components/games/Crossword.jsx'))
const Trolley = lazy(() => import('../components/games/Trolley.jsx'))
const TradeGame = lazy(() => import('../components/games/TradeGame.jsx'))
const PythonLab = lazy(() => import('../components/games/PythonLab.jsx'))

/**
 * The classroom activities, playable.
 *
 * One at a time rather than all five down the page: each carries its own
 * canvas and its own animation loop, and five of those running at once is
 * both slower and harder to read than the thing you actually came for.
 */
const GAMES = [
  {
    id: 'butler',
    name: "Pin the tail on Butler's curve",
    kicker: 'Escape room, puzzle one',
    blurb:
      "Place destinations on the Tourism Area Life Cycle, then on Doxey's Irritation Index.",
    Component: ButlerCurve,
  },
  {
    id: 'impacts',
    name: 'Sort the impact',
    kicker: 'Escape room, puzzle two',
    blurb:
      'Six of the fifteen impacts from the escape room. Match each one to economic, environmental or socio-cultural.',
    Component: ImpactSort,
  },
  {
    id: 'python',
    name: 'Coding practice with AI',
    kicker: 'Introduction to data science',
    blurb:
      'The Colab worksheet, runnable here. Press play on a cell and the chart draws itself from tourism data.',
    Component: PythonLab,
  },
  {
    id: 'crossword',
    name: 'Key word crossword',
    kicker: 'Week starters',
    blurb:
      'Key definitions from the module reading, set as a crossword. One for business and tourism, one for accounting and finance.',
    Component: Crossword,
  },
  {
    id: 'trolley',
    name: 'The ethical dilemma',
    kicker: 'Seminar prompt',
    blurb: 'The trolley problem. Pull the lever or leave it, then read the two positions.',
    Component: Trolley,
  },
  {
    id: 'trade',
    name: 'The international trade game',
    kicker: 'Globalisation',
    blurb:
      'Teams are given paper, scissors, stencils or a mixture, and asked to produce perfect shapes. Then trade opens.',
    Component: TradeGame,
  },
]

/** /games#butler opens that activity, so the cards on the project page can
    link straight to one rather than dropping you at the top of the list. */
function idFromHash(hash) {
  const id = (hash || '').replace('#', '')
  return GAMES.some((g) => g.id === id) ? id : null
}

export default function Games() {
  const { hash } = useLocation()
  const [openId, setOpenId] = useState(() => idFromHash(hash) || GAMES[0].id)
  const refs = useRef({})

  useEffect(() => {
    const id = idFromHash(hash)
    if (!id) return
    setOpenId(id)
    /* The accordion body mounts on the same tick, so scroll after paint. */
    const t = setTimeout(() => {
      refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <main id="main" className="games">
      <div className="wrap">
        <p className="detail-back">
          <Link to="/">&larr; Back to the site</Link>
        </p>

        <header className="games-head">
          <p className="eyebrow">Teaching</p>
          <h1 className="games-title">Play the activities</h1>
          <p className="games-lede">
            The following are just a few of the games I bring in to the classroom to keep
            learning fun and interactive.
          </p>
        </header>

        <div className="games-list">
          {GAMES.map((g) => {
            const open = openId === g.id
            return (
              <section
                className="games-item"
                key={g.id}
                id={g.id}
                ref={(el) => {
                  refs.current[g.id] = el
                }}
                data-open={open ? 'true' : undefined}
              >
                <button
                  type="button"
                  className="games-toggle"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : g.id)}
                >
                  <span className="games-kicker">{g.kicker}</span>
                  <span className="games-name">{g.name}</span>
                  <span className="games-chev" aria-hidden="true">
                    {open ? '−' : '+'}
                  </span>
                </button>

                <p className="games-blurb">{g.blurb}</p>

                {open && (
                  <Suspense
                    fallback={<p className="games-loading">Loading the activity&hellip;</p>}
                  >
                    <g.Component />
                  </Suspense>
                )}
              </section>
            )
          })}
        </div>

        <p className="games-foot">
          All of these were designed and delivered in my own modules, across tourism,
          business, and accounting and finance. The escape room puzzles and the crosswords
          are shortened here.
        </p>
      </div>
    </main>
  )
}
