import { useCallback, useEffect, useRef, useState } from 'react'
import { TROLLEY } from '../../data/games.js'
import EthicsMatch from './EthicsMatch.jsx'

/**
 * The trolley problem, drawn as a cartoon and played with one lever.
 *
 * The trolley sets off on its own and the lever is live the whole way down. It
 * has to run for the dilemma to be a dilemma: if nothing moves until you press
 * something, then leaving the lever alone is not a choice you made, it is a
 * button you failed to press. Here the trolley is already coming, the lever is
 * already set to the four, and doing nothing is a decision with an outcome.
 *
 * The lever is the control. Pull it, put it back, change your mind as many
 * times as you like, until the trolley reaches the junction and the points are
 * whatever you left them.
 *
 * The figures are stick people rather than anything more literal on purpose:
 * this is a seminar prompt about a principle, and the drawing should not ask
 * anyone to picture a real person being killed.
 */

const VB = { w: 900, h: 440 }
const APPROACH_MS = 5200
const COMMIT_MS = 1500

const JUNCTION = { x: 330, y: 250 }
const START = { x: 70, y: 250 }

/* The diverted rail, as drawn. The trolley follows samples off this same curve
   so it cannot drift away from the track under it. */
const DIVERT_CURVE = [
  [JUNCTION.x, JUNCTION.y],
  [460, 254],
  [560, 300],
  [860, 356],
]

function cubicAt(t, [p0, p1, p2, p3]) {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ]
}

/* Four on the line it is already taking, one on the line you can send it to.
   The single figure sits on the curve rather than beside it. */
const STRAIGHT_PEOPLE = [660, 692, 724, 756]
const DIVERT_PERSON = cubicAt(0.8, DIVERT_CURVE)

const STRAIGHT_STOP = [636, 250]

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Walks a polyline by segment length, so the speed stays even. */
function alongPath(path, t) {
  const segs = []
  let total = 0
  for (let i = 0; i < path.length - 1; i++) {
    const d = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1])
    segs.push(d)
    total += d
  }
  let want = clamp01(t) * total
  for (let i = 0; i < segs.length; i++) {
    if (want <= segs[i] || i === segs.length - 1) {
      const u = segs[i] ? want / segs[i] : 0
      return [
        path[i][0] + (path[i + 1][0] - path[i][0]) * u,
        path[i][1] + (path[i + 1][1] - path[i][1]) * u,
      ]
    }
    want -= segs[i]
  }
  return path[path.length - 1]
}

/* The branch the trolley takes once the points are set, sampled off the drawn
   curve so the wheels stay on the rail. */
const DIVERT_RUN = Array.from({ length: 10 }, (_, i) =>
  cubicAt((i / 9) * 0.7, DIVERT_CURVE),
)
const STRAIGHT_RUN = [[JUNCTION.x, JUNCTION.y], STRAIGHT_STOP]

function Person({ x, y, hit }) {
  return (
    <g
      className="tr-person"
      data-hit={hit ? 'true' : undefined}
      transform={`translate(${x} ${y})`}
    >
      <circle className="tr-head" cx="0" cy="-26" r="7.5" />
      <path className="tr-body" d="M0 -18 V-2" />
      <path className="tr-body" d="M-8 -13 L8 -13" />
      <path className="tr-body" d="M0 -2 L-7 12" />
      <path className="tr-body" d="M0 -2 L7 12" />
    </g>
  )
}

export default function Trolley() {
  const [pulled, setPulled] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | approach | committed | done
  const [taken, setTaken] = useState(null) // 'straight' | 'divert', once committed
  const trolleyRef = useRef(null)
  const hostRef = useRef(null)
  const timers = useRef([])
  const raf = useRef(0)
  /* Read at the junction rather than through the closure, so a change made in
     the last moment before the points still counts. */
  const pulledRef = useRef(false)
  const startedRef = useRef(false)

  useEffect(() => {
    pulledRef.current = pulled
  }, [pulled])

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    cancelAnimationFrame(raf.current)
  }, [])

  useEffect(() => () => clearAll(), [clearAll])

  const place = useCallback((x, y, angle) => {
    const el = trolleyRef.current
    if (!el) return
    el.setAttribute(
      'transform',
      `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)})`,
    )
  }, [])

  /** Animates along a polyline, then calls done. */
  const travel = useCallback(
    (path, ms, onDone) => {
      const at = (t) => alongPath(path, t)
      const step = (t) => {
        const [x, y] = at(t)
        const [x2, y2] = at(Math.min(1, t + 0.02))
        place(x, y, (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI)
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        step(1)
        onDone()
        return
      }
      let settled = false
      const t0 = performance.now()
      const finish = () => {
        if (settled) return
        settled = true
        step(1)
        onDone()
      }
      const tick = (now) => {
        const t = (now - t0) / ms
        step(clamp01(t))
        if (t < 1) raf.current = requestAnimationFrame(tick)
        else finish()
      }
      step(0)
      raf.current = requestAnimationFrame(tick)
      /* rAF does not run in every embedded browser; without this the trolley
         never arrives and the dilemma never resolves. */
      timers.current.push(setTimeout(finish, ms + 300))
    },
    [place],
  )

  const run = useCallback(() => {
    clearAll()
    setTaken(null)
    setPhase('approach')
    travel(
      [
        [START.x, START.y],
        [JUNCTION.x, JUNCTION.y],
      ],
      APPROACH_MS,
      () => {
        const divert = pulledRef.current
        setTaken(divert ? 'divert' : 'straight')
        setPhase('committed')
        travel(divert ? DIVERT_RUN : STRAIGHT_RUN, COMMIT_MS, () => setPhase('done'))
      },
    )
  }, [clearAll, travel])

  /* Starts when it comes into view, so the approach is not already over. */
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      run()
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !startedRef.current) {
          startedRef.current = true
          run()
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [run])

  const again = useCallback(() => {
    setPulled(false)
    pulledRef.current = false
    place(START.x, START.y, 0)
    run()
  }, [place, run])

  const live = phase === 'approach'
  const throwLever = useCallback(() => {
    if (!live) return
    setPulled((v) => !v)
  }, [live])

  const outcome = taken ? TROLLEY.choices[taken === 'divert' ? 'divert' : 'straight'] : null
  const straightHit = phase === 'done' && taken === 'straight'
  const divertHit = phase === 'done' && taken === 'divert'

  return (
    <div className="game tr" ref={hostRef}>
      <div className="tr-stage">
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} role="img" aria-label={TROLLEY.prompt}>
          <rect className="tr-ground" x="0" y="392" width={VB.w} height="48" />

          {/* Track, straight on */}
          <path className="tr-rail" d={`M${START.x} ${START.y} L860 250`} />
          {Array.from({ length: 26 }, (_, k) => (
            <rect
              className="tr-sleeper"
              key={`s${k}`}
              x={74 + k * 30}
              y="243"
              width="9"
              height="15"
              rx="2"
            />
          ))}

          {/* Track, diverted */}
          <path
            className="tr-rail"
            d={`M${JUNCTION.x} ${JUNCTION.y} C 460 254, 560 300, 860 356`}
          />

          {/* Which way the points are set. */}
          <path
            className="tr-points"
            data-pulled={pulled ? 'true' : undefined}
            d={
              pulled
                ? `M${JUNCTION.x - 22} 250 C ${JUNCTION.x + 40} 251, ${JUNCTION.x + 80} 268, ${JUNCTION.x + 120} 278`
                : `M${JUNCTION.x - 22} 250 L${JUNCTION.x + 120} 250`
            }
          />

          {STRAIGHT_PEOPLE.map((x) => (
            <Person key={x} x={x} y={250} hit={straightHit} />
          ))}
          <Person x={DIVERT_PERSON[0]} y={DIVERT_PERSON[1]} hit={divertHit} />

          <text className="tr-count" x="708" y="196" textAnchor="middle">
            4 people
          </text>
          <text
            className="tr-count"
            x={DIVERT_PERSON[0] + 6}
            y={DIVERT_PERSON[1] + 44}
            textAnchor="middle"
          >
            1 person
          </text>

          {/* The trolley */}
          <g ref={trolleyRef} transform={`translate(${START.x} ${START.y})`}>
            <g className="tr-car">
              <rect x="-32" y="-40" width="64" height="32" rx="6" />
              <rect className="tr-window" x="-22" y="-33" width="18" height="14" rx="3" />
              <rect className="tr-window" x="4" y="-33" width="18" height="14" rx="3" />
              <rect x="-26" y="-10" width="52" height="8" rx="3" />
              <circle className="tr-wheel" cx="-16" cy="0" r="7" />
              <circle className="tr-wheel" cx="16" cy="0" r="7" />
            </g>
          </g>

          {/* The lever. Drawn last so it sits on top and is the thing you press. */}
          <g
            className="tr-lever"
            data-pulled={pulled ? 'true' : undefined}
            data-live={live ? 'true' : undefined}
            role="button"
            tabIndex={0}
            aria-pressed={pulled}
            aria-disabled={!live}
            aria-label={
              pulled
                ? 'Lever pulled: the trolley will take the branch. Select to put it back.'
                : 'Lever not pulled: the trolley will carry straight on. Select to pull it.'
            }
            onClick={throwLever}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                throwLever()
              }
            }}
          >
            <rect
              className="tr-leverhit"
              x={JUNCTION.x - 52}
              y="240"
              width="104"
              height="82"
              rx="10"
            />
            <rect
              className="tr-leverbase"
              x={JUNCTION.x - 18}
              y="300"
              width="36"
              height="13"
              rx="5"
            />
            <path
              className="tr-leverarm"
              d={
                pulled
                  ? `M${JUNCTION.x} 304 L${JUNCTION.x + 34} 262`
                  : `M${JUNCTION.x} 304 L${JUNCTION.x - 34} 262`
              }
            />
            <circle
              className="tr-leverknob"
              cx={pulled ? JUNCTION.x + 34 : JUNCTION.x - 34}
              cy="262"
              r="9"
            />
          </g>
        </svg>

        {live && (
          <p className="tr-live" aria-live="polite">
            The trolley is coming. The lever is set to the four.
          </p>
        )}
      </div>

      <div className="tr-bar">
        <p className="tr-prompt">
          {TROLLEY.prompt} <span className="tr-sub">Pull it, or leave it.</span>
        </p>
        <div className="tr-buttons">
          <button type="button" className="btn-game btn-game--ghost" onClick={again}>
            Run it again
          </button>
        </div>
      </div>

      {phase === 'done' && outcome && (
        <div className="tr-result">
          <p className="tr-toll">
            <b>{outcome.toll}</b>
            {outcome.toll === 1 ? 'person' : 'people'}
          </p>
          <div>
            <p className="tr-verdict">{outcome.verdict}</p>
            <p className="tr-school">{outcome.school}</p>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="tr-after">
          {TROLLEY.after.map((a) => (
            <div className="tr-card" key={a.title}>
              <p className="tr-cardtitle">{a.title}</p>
              <p className="tr-cardbody">{a.body}</p>
            </div>
          ))}
        </div>
      )}

      <EthicsMatch />
    </div>
  )
}
