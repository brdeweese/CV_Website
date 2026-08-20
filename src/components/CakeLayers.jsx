import { useCallback, useEffect, useRef, useState } from 'react'
import { CAKE_LAYERS, UTENSILS, UTENSIL_PATHS } from '../data/projects/chicagoCake.js'

/**
 * The forward-selection results as one rainbow cake, eaten from the top down.
 *
 * A cake is the right shape for this because R-squared already is one: the
 * share of a crime category's variation the model accounts for. What gets
 * eaten is explained, what stays on the stand is not.
 *
 * The categories run ACROSS the cake, one column each, and the rainbow layers
 * run THROUGH it, the same six in every column. That is what makes the colour
 * safe: it is the cake's own layering, shared by every category, so nothing
 * categorical rides on it. Identity comes from the label under each column and
 * from the utensils, whose silhouettes carry which factors did the eating.
 * Four categorical hues cannot be made colourblind-safe here in any case; see
 * chicagoCake.js for the search behind that.
 *
 * Sorted by how much goes, the bitten top edge falls as a staircase, and the
 * finding is legible from the silhouette before anyone reads a number.
 */

const VB = { w: 960, h: 640 }
const SLICE = 96
const CAKE = { x: 128, y: 150, h: 340 }
const FULL_W = SLICE * CAKE_LAYERS.length

/* Six sponge layers with frosting between, as in a rainbow cake. Decorative:
   they span every column, so they encode nothing. */
const BANDS = 6
const FROSTING = 6
const BAND_H = (CAKE.h - FROSTING * (BANDS - 1)) / BANDS
const SPONGE = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

const BITE_MS = 780
const GAP_MS = 220
const LEAD_MS = 480

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const ease = (t) => 1 - (1 - t) ** 3

const colX = (i) => CAKE.x + i * SLICE

/**
 * One column's remaining cake. The top edge is scalloped once it has been
 * bitten and flat while it has not, so an untouched column looks baked rather
 * than nibbled.
 */
function columnPath(i, remain) {
  const x0 = colX(i)
  const x1 = x0 + SLICE
  const yTop = CAKE.y + CAKE.h * (1 - remain)
  const yBot = CAKE.y + CAKE.h
  if (remain >= 0.999) {
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

  const remainOf = (i) => {
    if (i < done) return 1 - CAKE_LAYERS[i].eaten
    if (i === cutting) return 1 - CAKE_LAYERS[i].eaten * ease(progress)
    return 1
  }
  const pctOf = (i) => {
    if (i < done) return CAKE_LAYERS[i].eaten
    if (i === cutting) return CAKE_LAYERS[i].eaten * ease(progress)
    return 0
  }

  return (
    <figure className="cake">
      <figcaption className="cake-head">
        <h3 className="cake-title">How much of each crime the cost of living explains</h3>
        <p className="cake-sub">
          Every column starts as a whole cake. What gets eaten is the share of that
          crime&rsquo;s variation the selected cost of living factors account for; what
          stays on the stand is the share they do not.
        </p>
      </figcaption>

      <div className="cake-plot">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          role="img"
          aria-label="A rainbow layer cake in seven columns, one per crime category, each eaten down from the top by the share of its variation the model explains: property-related 96 percent down to public crime 41 percent"
        >
          <defs>
            {/* The sponge is drawn once across the whole cake and clipped to
                whatever is left standing, so the layers line up between columns
                the way they would in a real cake. */}
            <clipPath id="cakeStanding">
              {CAKE_LAYERS.map((l, i) => (
                <path key={l.id} d={columnPath(i, remainOf(i))} />
              ))}
            </clipPath>
          </defs>

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
                y={CAKE.y + b * (BAND_H + FROSTING)}
                width={FULL_W}
                height={BAND_H}
              />
            ))}
          </g>

          {/* A frosted edge following whatever is left of each column. */}
          {CAKE_LAYERS.map((l, i) => (
            <path key={l.id} className="cake-edge" d={columnPath(i, remainOf(i))} />
          ))}

          {CAKE_LAYERS.map((l, i) => {
            const x = colX(i)
            const mid = x + SLICE / 2
            const remain = remainOf(i)
            const yTop = CAKE.y + CAKE.h * (1 - remain)
            const pct = pctOf(i)
            const words = l.lines
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
                  y={CAKE.y - 60}
                  width={SLICE}
                  height={CAKE.h + 60}
                />

                {pct > 0.02 && (
                  <text className="cake-pct" x={mid} y={CAKE.y - 34} textAnchor="middle">
                    {Math.round(pct * 100)}%
                  </text>
                )}

                {/* The utensils that took this column, hanging in the space they
                    cleared. Turned to face down, the direction of the eating. */}
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

                {words.map((word, k) => (
                  <text
                    key={word}
                    className="cake-name"
                    x={mid}
                    y={CAKE.y + CAKE.h + 62 + k * 15 - ((words.length - 1) * 15) / 2}
                    textAnchor="middle"
                  >
                    {word}
                  </text>
                ))}
              </g>
            )
          })}

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
            <svg viewBox="-40 -15 80 30" className="cake-key-icon" aria-hidden="true">
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
