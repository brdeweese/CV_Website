import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Where the two definitions of resilience diverge.
 *
 * The research's own contribution is that Duchek's (2019) three-stage framework
 * needs separating to account for forwards and backwards thinking, and that the
 * adaptation stage is the thing that separates them. That is a shape, so this
 * draws it: one path through anticipation and coping, shared by both, and then
 * a fork where backwards-thinking returns to the pre-existing state and
 * forwards-thinking carries on past it.
 *
 * The curve is illustrative, not measured. It is a diagram of an argument, and
 * the caption says so, because a line on an axis otherwise reads as data.
 */

const STAGES = [
  {
    id: 'anticipation',
    name: 'Anticipation',
    from: 0,
    to: 0.3,
    detail: 'Detecting critical developments inside the firm and in its environment.',
  },
  {
    id: 'coping',
    name: 'Coping',
    from: 0.3,
    to: 0.58,
    detail: 'Accepting the adversity, then implementing solutions.',
  },
  {
    id: 'adaptation',
    name: 'Adaptation',
    from: 0.58,
    to: 1,
    detail: 'Reflection and learning, then change. Only one of the two paths gets here.',
  },
]

const ADVERSITY_AT = 0.3
const FORK_AT = 0.58
const BASE = 1 // the state held before the adversity

/* Shared: steady, struck, bottoming out, beginning to recover. */
const SHARED = [
  [0, 1],
  [0.16, 1],
  [0.24, 0.99],
  [0.3, 0.95],
  [0.36, 0.79],
  [0.42, 0.63],
  [0.48, 0.55],
  [0.53, 0.57],
  [0.58, 0.63],
]

const BRANCHES = [
  {
    id: 'back',
    name: 'Backwards-thinking',
    tone: 'back',
    end: 'Back to where it was',
    points: [
      [0.58, 0.63],
      [0.68, 0.8],
      [0.78, 0.93],
      [0.88, 0.99],
      [1, 1],
    ],
    caption:
      'Emphasis is placed on bouncing back, on returning to a certain pre-existing state of equilibrium. The Latin resilio, from which resilience derives, means to jump back. Learning can still occur here; change is not implemented.',
  },
  {
    id: 'fwd',
    name: 'Forwards-thinking',
    tone: 'fwd',
    end: 'Beyond where it was',
    points: [
      [0.58, 0.63],
      [0.68, 0.83],
      [0.78, 1.01],
      [0.88, 1.16],
      [1, 1.28],
    ],
    caption:
      'Turning challenges into opportunities for growth and innovation, with the intent of creating a superior performance than was previously being experienced. It carries its own risk: innovations can cause their own disruptions, and Duchek reports that two out of three change initiatives fail.',
  },
]

const Y_MIN = 0.45
const Y_MAX = 1.36
/* The gutter holds the branch end labels; the wider of the two measures
   120px, so 142 clears it with room. */
const PAD_WIDE = { top: 28, right: 142, bottom: 46, left: 22 }
const PAD_NARROW = { top: 24, right: 16, bottom: 42, left: 14 }

const DRAW_SHARED_MS = 1000
const DRAW_BRANCH_MS = 900
const HOLD_MS = 380

/** Cardinal spline through the points, so the curve reads as a movement. */
function smooth(pts, X, Y, tension = 0.5) {
  if (pts.length < 2) return ''
  const p = pts.map(([a, b]) => [X(a), Y(b)])
  let d = 'M' + p[0][0].toFixed(2) + ' ' + p[0][1].toFixed(2)
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] || p2
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension]
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension]
    d +=
      ' C' + c1[0].toFixed(2) + ' ' + c1[1].toFixed(2) +
      ',' + c2[0].toFixed(2) + ' ' + c2[1].toFixed(2) +
      ',' + p2[0].toFixed(2) + ' ' + p2[1].toFixed(2)
  }
  return d
}

/** Measured synchronously: an unmeasured first paint renders a zero-width chart. */
function useWidth() {
  const ref = useRef(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const read = () => setW(el.clientWidth)
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}

export default function ResilienceFork() {
  const [hostRef, width] = useWidth()
  const wide = width >= 620
  const height = wide ? 360 : 300

  const [phase, setPhase] = useState('shared') // shared -> branches -> done
  const [sharedP, setSharedP] = useState(0)
  const [branchP, setBranchP] = useState(0)
  const [focus, setFocus] = useState(null) // null = both
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setReduced(mq.matches)
      if (mq.matches) {
        setPhase('done')
        setSharedP(1)
        setBranchP(1)
      }
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  /* Two draws in sequence. The failsafe matters as much as the rAF loop: rAF is
     throttled to nothing in a background tab and absent in some embedded
     browsers, and without it the diagram stops half drawn. */
  useEffect(() => {
    if (reduced || phase === 'done') return undefined
    const dur = phase === 'shared' ? DRAW_SHARED_MS : DRAW_BRANCH_MS
    const set = phase === 'shared' ? setSharedP : setBranchP
    let raf = 0
    let next = 0
    let settled = false
    const t0 = performance.now()

    const finish = () => {
      if (settled) return
      settled = true
      set(1)
      if (phase === 'shared') next = setTimeout(() => setPhase('branches'), HOLD_MS)
      else setPhase('done')
    }
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur)
      set(p)
      if (p < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    set(0)
    raf = requestAnimationFrame(tick)
    const failsafe = setTimeout(finish, dur + 400)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(next)
      clearTimeout(failsafe)
    }
  }, [phase, reduced])

  const replay = useCallback(() => {
    setSharedP(0)
    setBranchP(0)
    setPhase('shared')
  }, [])

  const PAD = wide ? PAD_WIDE : PAD_NARROW
  const innerW = Math.max(0, width - PAD.left - PAD.right)
  const innerH = height - PAD.top - PAD.bottom
  const X = (t) => PAD.left + innerW * t
  const Y = (v) => PAD.top + innerH * (1 - (v - Y_MIN) / (Y_MAX - Y_MIN))

  const shown = phase !== 'shared'
  const active = (b) => !focus || focus === b.id

  return (
    <figure className="rfork">
      <figcaption className="rfork-head">
        <h3 className="rfork-title">Where the two definitions diverge</h3>
        <p className="rfork-sub">
          Both categories need an adversity, and both prepare for it and cope with it. The
          adaptation stage is the only thing that separates them.
        </p>
      </figcaption>

      <div className="rfork-plot" ref={hostRef}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label="A shared path through anticipation and coping that forks at adaptation: backwards-thinking returns to the pre-existing state, forwards-thinking continues past it"
          >
            {/* The level held before the adversity. Both readings are measured
                against it, so it is the one reference the diagram needs. */}
            <line
              className="rfork-base"
              x1={PAD.left}
              x2={width - PAD.right}
              y1={Y(BASE)}
              y2={Y(BASE)}
            />
            <text className="rfork-baselabel" x={PAD.left + 4} y={Y(BASE) - 13}>
              State before the adversity
            </text>

            {STAGES.map((s, i) => (
              <g key={s.id}>
                {i > 0 && (
                  <line
                    className="rfork-divide"
                    x1={X(s.from)}
                    x2={X(s.from)}
                    y1={PAD.top}
                    y2={PAD.top + innerH}
                  />
                )}
                <text
                  className="rfork-stage"
                  x={X((s.from + s.to) / 2)}
                  y={height - PAD.bottom + 22}
                  textAnchor="middle"
                >
                  {s.name}
                </text>
              </g>
            ))}

            <g className="rfork-adversity">
              <line
                x1={X(ADVERSITY_AT)}
                x2={X(ADVERSITY_AT)}
                y1={PAD.top + 6}
                y2={PAD.top + innerH}
              />
              <text x={X(ADVERSITY_AT)} y={PAD.top - 6} textAnchor="middle">
                Adversity
              </text>
            </g>

            <path
              className="rfork-line rfork-line--shared"
              d={smooth(SHARED, X, Y)}
              pathLength="1"
              style={{ strokeDasharray: 1, strokeDashoffset: 1 - sharedP }}
            />

            {shown &&
              BRANCHES.map((b) => (
                <g key={b.id} data-tone={b.tone} data-dim={active(b) ? undefined : 'true'}>
                  <path
                    className="rfork-line rfork-line--branch"
                    d={smooth(b.points, X, Y)}
                    pathLength="1"
                    style={{ strokeDasharray: 1, strokeDashoffset: 1 - branchP }}
                  />
                  {branchP > 0.98 && (
                    <>
                      <circle cx={X(1)} cy={Y(b.points[b.points.length - 1][1])} r="4" />
                      {wide && (
                        <text
                          className="rfork-end"
                          x={X(1) + 10}
                          y={Y(b.points[b.points.length - 1][1])}
                          dy="0.32em"
                        >
                          {b.end}
                        </text>
                      )}
                    </>
                  )}
                </g>
              ))}

            {branchP > 0.98 && (
              <circle className="rfork-fork" cx={X(FORK_AT)} cy={Y(0.63)} r="3.5" />
            )}
          </svg>
        )}
      </div>

      <div className="rfork-stages">
        {STAGES.map((s) => (
          <div className="rfork-stagecard" key={s.id}>
            <p className="rfork-stagename">{s.name}</p>
            <p className="rfork-stagedetail">{s.detail}</p>
          </div>
        ))}
      </div>

      <div className="rfork-controls">
        <div className="rfork-picks" role="group" aria-label="Focus a path">
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              type="button"
              className="rfork-pick"
              data-tone={b.tone}
              aria-pressed={focus === b.id}
              onClick={() => setFocus(focus === b.id ? null : b.id)}
            >
              <span className="rfork-swatch" data-tone={b.tone} />
              {b.name}
            </button>
          ))}
        </div>
        <button type="button" className="rfork-replay" onClick={replay}>
          Replay
        </button>
      </div>

      {BRANCHES.filter((b) => !focus || focus === b.id).map((b) => (
        <p className="rfork-caption" key={b.id} data-tone={b.tone}>
          <b>{b.name}</b>
          {b.caption}
        </p>
      ))}

      <p className="rfork-foot">
        Stages after Duchek (2019); the categorisation after Weking, P&eacute;rez and Schaffer
        (2021). The curve illustrates the argument and is not measured data.
      </p>
    </figure>
  )
}
