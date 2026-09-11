import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'

const ImpactSort = lazy(() => import('../components/games/ImpactSort.jsx'))
const ButlerCurve = lazy(() => import('../components/games/ButlerCurve.jsx'))
const Crossword = lazy(() => import('../components/games/Crossword.jsx'))
const Trolley = lazy(() => import('../components/games/Trolley.jsx'))
const TradeGame = lazy(() => import('../components/games/TradeGame.jsx'))

/**
 * The classroom activities, playable.
 *
 * One at a time rather than all five down the page: each carries its own
 * canvas and its own animation loop, and five of those running at once is
 * both slower and harder to read than the thing you actually came for.
 */
const GAMES = [
  {
    id: 'impacts',
    name: 'Sort the impact',
    kicker: 'Escape room, puzzle two',
    blurb:
      'Six of the fifteen impacts from the escape room. Students match each to economic, environmental or socio-cultural, under time, to earn their break.',
    Component: ImpactSort,
  },
  {
    id: 'butler',
    name: "Pin the tail on Butler's curve",
    kicker: 'Escape room, puzzle one',
    blurb:
      "Place real destinations on the Tourism Area Life Cycle, then place them again on Doxey's Irritation Index. Two models, one destination, and an argument about whether they agree.",
    Component: ButlerCurve,
  },
  {
    id: 'crossword',
    name: 'Key word crossword',
    kicker: 'Week three starter',
    blurb:
      'Definitions from the module reading, set as a crossword. Every clue carries a full Harvard reference in the worksheet, so revision and academic sourcing get practised together.',
    Component: Crossword,
  },
  {
    id: 'trolley',
    name: 'The ethical dilemma',
    kicker: 'Seminar prompt',
    blurb:
      'The trolley problem, with the lever in the student’s hand. There is no marked answer. The point is that almost everyone pulls it, and then has to say why the arithmetic stopped being enough.',
    Component: Trolley,
  },
  {
    id: 'trade',
    name: 'The international trade game',
    kicker: 'Globalisation',
    blurb:
      'Teams are given paper, scissors, stencils or some mixture, and told to produce perfect shapes. Most cannot start. What happens when trade opens is the lesson, and nobody has to be told it.',
    Component: TradeGame,
  },
]

export default function Games() {
  const [openId, setOpenId] = useState(GAMES[0].id)

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
            Five of the activities I run, cut down to fit a browser. They are built to be
            argued with: where an activity has an answer I mark to, it says so, and where it
            does not, it says that instead.
          </p>
        </header>

        <div className="games-list">
          {GAMES.map((g) => {
            const open = openId === g.id
            return (
              <section
                className="games-item"
                key={g.id}
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
          All five were designed and delivered in my own modules. The escape room puzzles
          and the crossword are shortened here; the classroom versions are longer and timed.
        </p>
      </div>
    </main>
  )
}
