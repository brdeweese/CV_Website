import { useCallback, useEffect, useRef, useState } from 'react'
import { CAKE_LAYERS, UTENSILS, UTENSIL_PATHS } from '../data/projects/chicagoCake.js'

/**
 * The forward-selection results as one layer cake, eaten a layer at a time.
 *
 * A cake is the right shape for this because R-squared already is one: the
 * share of a crime category's variation the model accounts for. What gets
 * eaten is explained, what stays on the plate is not. Sorted by how much goes,
 * the cut edge falls as a staircase and the finding is legible from the
 * silhouette alone: the same few costs strip property crime almost to the
 * plate and leave public crime nearly whole.
 *
 * The ghost outline behind each layer is the whole cake, so both quantities are
 * on screen at once rather than only the remainder.
 *
 * Utensils rather than colours because four categorical hues cannot be made
 * colourblind-safe here; see chicagoCake.js for the numbers behind that.
 */

const VB = { w: 940, h: 500 }
const PAD = { left: 214, right: 92, top: 78 }
const LAYER_H = 44
const FILLING = 5 // the cream between two layers
const ROW = LAYER_H + FILLING
const FULL = VB.w - PAD.left - PAD.right
const UTENSIL_GAP = 82 // room for one utensil at rest, drawn ~73 units long

const BITE_MS = 820 // one layer's bite
const GAP_MS = 240 // pause before the next layer
const LEAD_MS = 500 // beat before the first bite

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const ease = (t) => 1 - (1 - t) ** 3

const rowY = (i) => PAD.top + i * ROW

/**
 * The cut edge, scalloped so it reads as bitten rather than sliced. The arcs
 * bulge into the cake, which is the direction a bite actually removes from.
 */
function cakePath(i, remain) {
  const y = rowY(i)
  const x = PAD.left + FULL * remain
  const b = LAYER_H / 3
  return [
    `M${PAD.left} ${y}`,
    `L${x} ${y}`,
    `a ${b} ${b} 0 0 0 0 ${b}`,
    `a ${b} ${b} 0 0 0 0 ${b}`,
    `a ${b} ${b} 0 0 0 0 ${b}`,
    `L${PAD.left} ${y + LAYER_H}`,
    'Z',
  ].join(' ')
}

export default function CakeLayers() {
  const [done, setDone] = useState(0) // layers fully eaten
  const [cutting, setCutting] = useState(-1) // layer mid-bite
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
    const runLayer = (i) => {
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
        timers.current.push(setTimeout(() => runLayer(i + 1), GAP_MS))
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
    timers.current.push(setTimeout(() => runLayer(0), LEAD_MS))
    return () => {
      cancelAnimationFrame(raf)
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [reduced, runId])

  const replay = useCallback(() => setRunId((n) => n + 1), [])

  const remainOf = (i) => {
    const full = 1 - CAKE_LAYERS[i].eaten
    if (i < done) return full
    if (i === cutting) return 1 - CAKE_LAYERS[i].eaten * ease(progress)
    return 1
  }
  const shownPct = (i) => {
    const target = CAKE_LAYERS[i].eaten
    if (i < done) return target
    if (i === cutting) return target * ease(progress)
    return 0
  }

  const utensilFor = (id) => UTENSILS.find((u) => u.id === id)

  return (
    <figure className="cake">
      <figcaption className="cake-head">
        <h3 className="cake-title">How much of each crime the cost of living explains</h3>
        <p className="cake-sub">
          Every layer starts whole. What gets eaten is the share of that crime&rsquo;s
          variation the selected cost of living factors account for; what stays on the plate
          is the share they do not.
        </p>
      </figcaption>

      <div className="cake-plot">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          role="img"
          aria-label="A seven layer cake, one layer per crime category, each eaten to the share of its variation the model explains: property-related 96 percent down to public crime 41 percent"
        >
          <text className="cake-axis" x={PAD.left} y={PAD.top - 26}>
            all of it
          </text>
          <text className="cake-axis" x={PAD.left + FULL} y={PAD.top - 26} textAnchor="end">
            none left
          </text>
          <line
            className="cake-rule"
            x1={PAD.left}
            x2={PAD.left + FULL}
            y1={PAD.top - 16}
            y2={PAD.top - 16}
          />

          {CAKE_LAYERS.map((l, i) => {
            const y = rowY(i)
            const remain = remainOf(i)
            const pct = shownPct(i)
            const active = i === cutting
            const isHover = hover === l.id
            return (
              <g
                key={l.id}
                className="cake-layer"
                data-active={active ? 'true' : undefined}
                data-hover={isHover ? 'true' : undefined}
                onMouseEnter={() => setHover(l.id)}
                onMouseLeave={() => setHover(null)}
              >
                {/* The whole cake, so the eaten share is visible as absence. */}
                <rect
                  className="cake-ghost"
                  x={PAD.left}
                  y={y}
                  width={FULL}
                  height={LAYER_H}
                  rx="3"
                />
                <path className="cake-slab" d={cakePath(i, remain)} />
                {i === 0 && (
                  <rect
                    className="cake-icing"
                    x={PAD.left}
                    y={y - 9}
                    width={Math.max(0, FULL * remain)}
                    height="11"
                    rx="4"
                  />
                )}
                {i < CAKE_LAYERS.length - 1 && (
                  <rect
                    className="cake-filling"
                    x={PAD.left}
                    y={y + LAYER_H}
                    width={Math.max(0, FULL * remain)}
                    height={FILLING}
                  />
                )}

                <text
                  className="cake-name"
                  x={PAD.left - 22}
                  y={y + LAYER_H / 2 + 5}
                  textAnchor="end"
                >
                  {l.name}
                </text>

                {pct > 0.02 && (
                  <text
                    className="cake-pct"
                    x={PAD.left + FULL + 12}
                    y={y + LAYER_H / 2 + 5}
                  >
                    {Math.round(pct * 100)}%
                  </text>
                )}

                {/* Which utensils took this layer. They sit in the eaten space,
                    which is the only part of the row guaranteed to be empty. */}
                {i < done &&
                  l.by.map((id, k) => (
                    <g
                      key={id}
                      className="cake-utensil cake-utensil--rest"
                      transform={`translate(${PAD.left + FULL * remain + 52 + k * UTENSIL_GAP} ${y + LAYER_H / 2}) scale(0.9)`}
                    >
                      <path d={UTENSIL_PATHS[id]} fillRule="evenodd" />
                    </g>
                  ))}

                {/* The utensil doing the eating, riding the cut edge. */}
                {active && (
                  <g
                    className="cake-utensil cake-utensil--live"
                    transform={`translate(${PAD.left + FULL * remain + 52} ${y + LAYER_H / 2}) scale(0.9)`}
                  >
                    <path d={UTENSIL_PATHS[l.by[0]]} fillRule="evenodd" />
                  </g>
                )}
              </g>
            )
          })}

          <rect
            className="cake-plate"
            x={PAD.left - 46}
            y={rowY(CAKE_LAYERS.length - 1) + LAYER_H + 14}
            width={FULL + 92}
            height="10"
            rx="5"
          />
        </svg>
      </div>

      <div className="cake-legend">
        {UTENSILS.map((u) => (
          <div className="cake-key" key={u.id}>
            <svg viewBox="-38 -14 76 28" className="cake-key-icon" aria-hidden="true">
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
          of the seven layers, and the price of a home in four. The spoon appears only in
          the bottom two, which are the two least eaten.
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
