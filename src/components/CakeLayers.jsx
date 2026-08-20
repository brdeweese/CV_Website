import { useCallback, useEffect, useRef, useState } from 'react'
import { CAKE_LAYERS, UTENSILS, UTENSIL_PATHS } from '../data/projects/chicagoCake.js'

/**
 * The forward-selection results as one cake, eaten from the top down.
 *
 * R-squared already is a cake: the share of a crime category's year-to-year
 * variation the selected cost of living factors account for. What gets eaten
 * is explained; what stays on the stand is not.
 *
 * THE LAYERS ARE THE SCALE. Five of them, each exactly a fifth of the cake, so
 * a layer is twenty percentage points and the axis can be read straight off the
 * sponge. That is also why the colours are safe to choose freely: they run
 * through every column alike, marking height rather than category, so nothing
 * categorical rides on them. Category identity comes from the label under each
 * column, and which factors did the eating comes from the utensil silhouettes.
 * Four categorical hues could not have been made colourblind-safe here anyway;
 * chicagoCake.js records that search.
 */

const VB = { w: 980, h: 700 }
const SLICE = 96
const CAKE = { x: 152, y: 190, h: 340 }
const FULL_W = SLICE * CAKE_LAYERS.length

/* Five layers, one fifth each, with the frosting line centred on the boundary
   so the gridline and the seam are the same thing. */
const BANDS = 5
const STEP = CAKE.h / BANDS
const FROSTING = 7
const SPONGE = ['vanilla', 'rose', 'pistachio', 'caramel', 'cocoa']

const DECOR_H = 26 // frill and cherries sit above the top layer

const BITE_MS = 780
const GAP_MS = 220
const LEAD_MS = 900 // long enough to see the cake whole before it is touched

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const ease = (t) => 1 - (1 - t) ** 3

const colX = (i) => CAKE.x + i * SLICE
/** y for a share eaten from the top: 0 is an untouched cake, 1 is the stand. */
const yFor = (eaten) => CAKE.y + CAKE.h * eaten

function columnPath(i, eaten) {
  const x0 = colX(i)
  const x1 = x0 + SLICE
  const yTop = yFor(eaten)
  const yBot = CAKE.y + CAKE.h
  if (eaten <= 0.001) {
    return `M${x0} ${yTop} L${x1} ${yTop} L${x1} ${yBot} L${x0} ${yBot} Z`
  }
  const r = SLICE / 4
  return [
    `M${x0} ${yTop}`,
    `a ${r} ${r} 0 0 1 ${2 * r} 0`,
    `a ${r} ${r} 0 0 1 ${2 * r} 0`,
    `L${x1} ${yBot}`,
    `L${x0} ${yBot}`,
    'Z',
  ].join(' ')
}

/** A run of piped swirls along the top of a column. */
function frillPath(i) {
  const x0 = colX(i)
  const n = 4
  const w = SLICE / n
  const r = w / 2
  let d = `M${x0} ${CAKE.y}`
  for (let k = 0; k < n; k++) d += ` a ${r} ${r} 0 0 1 ${w} 0`
  d += ` L${x0 + SLICE} ${CAKE.y + 7} L${x0} ${CAKE.y + 7} Z`
  return d
}

export default function CakeLayers() {
  const [done, setDone] = useState(0)
  const [cutting, setCutting] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [runId, setRunId] = useState(0)
  const [hover, setHover] = useState(null)
  const timers = useRef([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (reduced) {
      setDone(CAKE_LAYERS.length)
      setCutting(-1)
      setProgress(1)
      return undefined
    }
    setDone(0)
    setCutting(-1)
    setProgress(0)

    let raf = 0
    const runColumn = (i) => {
      if (i >= CAKE_LAYERS.length) return
      setCutting(i)
      let settled = false
      const t0 = performance.now()
      const finish = () => {
        if (settled) return
        settled = true
        setProgress(1)
        setDone(i + 1)
        setCutting(-1)
        timers.current.push(setTimeout(() => runColumn(i + 1), GAP_MS))
      }
      const tick = (now) => {
        const p = clamp01((now - t0) / BITE_MS)
        setProgress(p)
        if (p < 1) raf = requestAnimationFrame(tick)
        else finish()
      }
      setProgress(0)
      raf = requestAnimationFrame(tick)
      /* rAF does not run in every embedded browser and is throttled to nothing
         in a background tab; without this the cake never gets eaten. */
      timers.current.push(setTimeout(finish, BITE_MS + 300))
    }
    timers.current.push(setTimeout(() => runColumn(0), LEAD_MS))
    return () => {
      cancelAnimationFrame(raf)
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [reduced, runId])

  const replay = useCallback(() => setRunId((n) => n + 1), [])

  const eatenOf = (i) => {
    if (i < done) return CAKE_LAYERS[i].eaten
    if (i === cutting) return CAKE_LAYERS[i].eaten * ease(progress)
    return 0
  }
  /* The icing goes first, because the bite starts at the top. */
  const decorOf = (i) => clamp01(1 - eatenOf(i) * 14)

  return (
    <figure className="cake">
      <figcaption className="cake-head">
        <h3 className="cake-title">How much of each crime the cost of living explains</h3>
        <p className="cake-sub">
          Each column starts as a whole cake standing for one crime category, and every
          layer is a fifth of it. The percentage is how much of that crime&rsquo;s
          year-to-year variation the cost of living factors account for, so it is also how
          far down the cake the utensils get. What stays on the stand is the share nothing
          here explains.
        </p>
      </figcaption>

      <div className="cake-plot">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          role="img"
          aria-label="A layer cake in seven columns, one per crime category, each eaten down from the top by the share of its variation the model explains, from property-related at 96 percent to public crime at 41 percent. Each of the five layers is twenty percentage points."
        >
          <defs>
            <clipPath id="cakeStanding">
              {CAKE_LAYERS.map((l, i) => (
                <path key={l.id} d={columnPath(i, eatenOf(i))} />
              ))}
            </clipPath>
          </defs>

          {/* Scale. The layer seams are the gridlines. */}
          <text className="cake-axistitle" x={20} y={CAKE.y - 104}>
            Share of the crime explained, and how far down the cake that reaches
          </text>
          {Array.from({ length: BANDS + 1 }, (_, k) => (
            <g key={k}>
              <line
                className="cake-grid"
                x1={CAKE.x - 12}
                x2={CAKE.x + FULL_W}
                y1={yFor(k / BANDS)}
                y2={yFor(k / BANDS)}
              />
              <text
                className="cake-tick"
                x={CAKE.x - 22}
                y={yFor(k / BANDS) + 4}
                textAnchor="end"
              >
                {(k / BANDS) * 100}%
              </text>
            </g>
          ))}

          {/* The whole cake, before anyone got to it. */}
          <rect
            className="cake-ghost"
            x={CAKE.x}
            y={CAKE.y}
            width={FULL_W}
            height={CAKE.h}
            rx="4"
          />

          <g clipPath="url(#cakeStanding)">
            <rect
              className="cake-frostingfill"
              x={CAKE.x}
              y={CAKE.y}
              width={FULL_W}
              height={CAKE.h}
            />
            {Array.from({ length: BANDS }, (_, b) => (
              <rect
                key={b}
                className="cake-band"
                data-sponge={SPONGE[b]}
                x={CAKE.x}
                y={CAKE.y + b * STEP + FROSTING / 2}
                width={FULL_W}
                height={STEP - FROSTING}
              />
            ))}
          </g>

          {/* Piped icing and a cherry per column, on top while the cake is
              whole. Both go with the first mouthful, since the bite starts
              where they sit. */}
          {CAKE_LAYERS.map((l, i) => (
            <g key={l.id} className="cake-decor" style={{ opacity: decorOf(i) }}>
              <path className="cake-frill" d={frillPath(i)} />
              <line
                className="cake-stalk"
                x1={colX(i) + SLICE / 2}
                x2={colX(i) + SLICE / 2 + 5}
                y1={CAKE.y - DECOR_H + 4}
                y2={CAKE.y - 12}
              />
              <circle
                className="cake-cherry"
                cx={colX(i) + SLICE / 2}
                cy={CAKE.y - DECOR_H + 9}
                r="8"
              />
              <circle
                className="cake-glint"
                cx={colX(i) + SLICE / 2 - 2.6}
                cy={CAKE.y - DECOR_H + 6}
                r="2.2"
              />
            </g>
          ))}

          {CAKE_LAYERS.map((l, i) => (
            <path key={l.id} className="cake-edge" d={columnPath(i, eatenOf(i))} />
          ))}

          {CAKE_LAYERS.map((l, i) => {
            const x = colX(i)
            const mid = x + SLICE / 2
            const eaten = eatenOf(i)
            const yTop = yFor(eaten)
            return (
              <g
                key={l.id}
                className="cake-col"
                data-hover={hover === l.id ? 'true' : undefined}
                onMouseEnter={() => setHover(l.id)}
                onMouseLeave={() => setHover(null)}
              >
                <rect
                  className="cake-hit"
                  x={x}
                  y={CAKE.y - 70}
                  width={SLICE}
                  height={CAKE.h + 70}
                />

                {eaten > 0.02 && (
                  <text className="cake-pct" x={mid} y={CAKE.y - 62} textAnchor="middle">
                    {Math.round(eaten * 100)}%
                  </text>
                )}

                {i < done &&
                  l.by.map((id, k) => (
                    <g
                      key={id}
                      className="cake-utensil"
                      transform={`translate(${mid} ${yTop - 38 - k * 48}) rotate(-90) scale(0.56)`}
                    >
                      <path d={UTENSIL_PATHS[id]} fillRule="evenodd" />
                    </g>
                  ))}

                {l.lines.map((word, k) => (
                  <text
                    key={word}
                    className="cake-name"
                    x={mid}
                    y={CAKE.y + CAKE.h + 62 + k * 15 - ((l.lines.length - 1) * 15) / 2}
                    textAnchor="middle"
                  >
                    {word}
                  </text>
                ))}
              </g>
            )
          })}

          <text
            className="cake-axistitle"
            x={CAKE.x + FULL_W / 2}
            y={CAKE.y + CAKE.h + 108}
            textAnchor="middle"
          >
            Crime category
          </text>

          <rect
            className="cake-plate"
            x={CAKE.x - 34}
            y={CAKE.y + CAKE.h}
            width={FULL_W + 68}
            height="11"
            rx="5.5"
          />
          <rect
            className="cake-stem"
            x={CAKE.x + FULL_W / 2 - 16}
            y={CAKE.y + CAKE.h + 11}
            width="32"
            height="13"
          />
          <rect
            className="cake-foot"
            x={CAKE.x + FULL_W / 2 - 68}
            y={CAKE.y + CAKE.h + 24}
            width="136"
            height="8"
            rx="4"
          />
        </svg>
      </div>

      <div className="cake-legend">
        {UTENSILS.map((u) => (
          <div className="cake-key" key={u.id}>
            <svg viewBox="-44 -15 88 30" className="cake-key-icon" aria-hidden="true">
              <path d={UTENSIL_PATHS[u.id]} fillRule="evenodd" />
            </svg>
            <p className="cake-key-text">
              <b>{u.name}</b>
              {u.factor}
            </p>
          </div>
        ))}
      </div>

      <div className="cake-controls">
        <p className="cake-note">
          The fork does most of the eating: the price of a restaurant meal is kept in five
          of the seven columns, and the price of a home in four. The spoon appears only in
          the last two, which are the two least eaten.
        </p>
        <button type="button" className="cake-replay" onClick={replay}>
          Replay
        </button>
      </div>

      <p className="cake-foot">
        Adjusted R&sup2; from forward-selection linear regression, per crime category.
        Explained is not caused: across 2010 to 2022 Chicago prices rose steadily while
        crime fell steadily, and two opposite trends fit each other well whether or not they
        are connected.
      </p>
    </figure>
  )
}
