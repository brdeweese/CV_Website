import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BTC_ACTUAL, BTC_FORECASTS, BTC_START } from '../data/projects/bitcoinForecast.js'
import { BTC_MODELS } from '../data/projects/bitcoin.js'

/**
 * The 30-day out-of-sample window, with the models arriving one at a time.
 *
 * WHY ONE AT A TIME, beyond it looking better. Six lines want six hues, and a
 * six-hue categorical palette cannot be made colourblind-safe against this
 * site's dark surface: the dark lightness band is narrow enough that every
 * fourth hue I tested collided with either the blue or the orange under protan
 * and deutan simulation. Rather than ship a palette that fails its own check,
 * the chart never asks colour to separate more than one model at a time. The
 * model being introduced is coloured; the ones already seen drop to a thin grey
 * and stay for comparison. Identity is carried by a direct label at the end of
 * every line, so it never rests on colour alone.
 *
 * The hues are the ones from the dissertation's own matplotlib code, restepped
 * for legibility: each clears 3:1 against both the light and the dark surface.
 */

const N = BTC_ACTUAL.length
const MAE = Object.fromEntries(BTC_MODELS.map((m) => [m.model, m.mae]))

const HOLD_MS = 1500 // pause on a finished model before the next one starts
const DRAW_MS = 1100 // time for one model line to draw across

/* The right gutter holds the end labels. "Linear Regression" is the longest at
   about 102px, so 122 clears it; below the wide breakpoint the labels are
   dropped and the gutter closes, because a 102px label on a 300px plot eats a
   third of the chart. The stepper and the caption carry identity there. */
const PAD_WIDE = { top: 26, right: 122, bottom: 34, left: 58 }
const PAD_NARROW = { top: 22, right: 18, bottom: 32, left: 48 }
const LABEL_GAP = 13 // minimum vertical spacing between two end labels
const STEP = 4000

const ALL = [BTC_ACTUAL, ...BTC_FORECASTS.map((f) => f.values)].flat()
const Y_MIN = Math.floor(Math.min(...ALL) / STEP) * STEP
const Y_MAX = Math.ceil(Math.max(...ALL) / STEP) * STEP
const TICKS = []
for (let v = Y_MIN; v <= Y_MAX; v += STEP) TICKS.push(v)

const DAY = 86400000
const START_MS = Date.parse(BTC_START)
const shortDate = (i) =>
  new Date(START_MS + i * DAY).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })

const usd0 = (v) => '$' + Math.round(v).toLocaleString('en-GB')
const usdK = (v) => '$' + Math.round(v / 1000) + 'k'

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

export default function BtcForecast() {
  const [hostRef, width] = useWidth()
  const height = width && width < 560 ? 300 : 380

  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hover, setHover] = useState(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setReduced(mq.matches)
      if (mq.matches) {
        setPlaying(false)
        setProgress(1)
      }
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  /* Draw the active line, hold, then hand over to the next model. */
  useEffect(() => {
    if (!playing || reduced) return undefined
    let raf = 0
    let timer = 0
    let settled = false
    const t0 = performance.now()

    const finish = () => {
      if (settled) return
      settled = true
      setProgress(1)
      if (active < BTC_FORECASTS.length - 1) {
        timer = setTimeout(() => setActive((a) => a + 1), HOLD_MS)
      } else setPlaying(false)
    }

    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DRAW_MS)
      setProgress(p)
      if (p < 1) raf = requestAnimationFrame(tick)
      else finish()
    }

    setProgress(0)
    raf = requestAnimationFrame(tick)

    /* rAF is throttled to a standstill in a background tab and never runs at
       all in some embedded browsers. Without this the sequence stops on
       whichever model it was drawing and never hands over. */
    const failsafe = setTimeout(finish, DRAW_MS + 400)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      clearTimeout(failsafe)
    }
  }, [active, playing, reduced])

  const jump = useCallback((i) => {
    setPlaying(false)
    setActive(i)
    setProgress(1)
  }, [])

  const replay = useCallback(() => {
    setActive(0)
    setProgress(0)
    setPlaying(true)
  }, [])

  const wide = width >= 560
  const PAD = wide ? PAD_WIDE : PAD_NARROW
  const innerW = Math.max(0, width - PAD.left - PAD.right)
  const innerH = height - PAD.top - PAD.bottom
  const x = (i) => PAD.left + (innerW * i) / (N - 1)
  const y = (v) => PAD.top + innerH * (1 - (v - Y_MIN) / (Y_MAX - Y_MIN))
  const path = (vals) =>
    vals.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(2) + ' ' + y(v).toFixed(2)).join(' ')

  const onMove = (e) => {
    if (!innerW) return
    const box = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - box.left - PAD.left) / innerW) * (N - 1))
    setHover(i >= 0 && i < N ? i : null)
  }

  const current = BTC_FORECASTS[active]
  const xTicks = [0, 7, 14, 21, N - 1]

  /* End labels sit at each line's final value, so two models that finish close
     together produce overlapping text. Lay them out once: sort by the value
     they point at, then push any that crowd their neighbour downward. */
  const endLabels = []
  if (wide) {
    BTC_FORECASTS.slice(0, active).forEach((f) =>
      endLabels.push({ text: f.key, at: y(f.values[N - 1]), kind: 'past' }),
    )
    if (progress > 0.98) {
      endLabels.push({
        text: current.key,
        at: y(current.values[N - 1]),
        kind: 'active',
        tone: current.tone,
      })
    }
    endLabels.push({
      text: 'Actual',
      at: y(BTC_ACTUAL[N - 1]),
      kind: 'actual',
    })
    endLabels.sort((a, b) => a.at - b.at)
    endLabels.forEach((l, i) => {
      const prev = endLabels[i - 1]
      l.y = prev ? Math.max(l.at, prev.y + LABEL_GAP) : l.at
    })
  }

  return (
    <figure className="btcf">
      <figcaption className="btcf-head">
        <h3 className="btcf-title">Thirty days the models had never seen</h3>
        <p className="btcf-sub">
          Actual Bitcoin price, 23 May to 21 June 2024, against each forecast in turn.
        </p>
      </figcaption>

      {/* The ref sits on the plot box, not the figure: the figure's clientWidth
          includes its padding, and an SVG drawn that wide overflows the content
          box by exactly that amount, pushing the end labels past the card. */}
      <div className="btcf-plot" ref={hostRef}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label="Actual Bitcoin price over thirty days, with each model forecast revealed in turn"
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
          >
            {TICKS.map((t) => (
              <g key={t}>
                <line
                  className="btcf-grid"
                  x1={PAD.left}
                  x2={width - PAD.right}
                  y1={y(t)}
                  y2={y(t)}
                />
                <text
                  className="btcf-tick"
                  x={PAD.left - 10}
                  y={y(t)}
                  dy="0.32em"
                  textAnchor="end"
                >
                  {usdK(t)}
                </text>
              </g>
            ))}

            {xTicks.map((i) => (
              <text
                key={i}
                className="btcf-tick"
                x={x(i)}
                y={height - 12}
                textAnchor="middle"
              >
                {shortDate(i)}
              </text>
            ))}

            {/* Models already introduced: still readable, no longer competing. */}
            {BTC_FORECASTS.slice(0, active).map((f) => (
              <path key={f.key} className="btcf-line btcf-line--past" d={path(f.values)} />
            ))}

            {/* The model being introduced. */}
            <path
              className="btcf-line btcf-line--active"
              data-tone={current.tone}
              d={path(current.values)}
              pathLength="1"
              style={{ strokeDasharray: 1, strokeDashoffset: 1 - progress }}
            />
            {/* Actual price: always present, always the heaviest mark. */}
            <path className="btcf-line btcf-line--actual" d={path(BTC_ACTUAL)} />

            {endLabels.map((l) => (
              <text
                key={l.text}
                className={'btcf-endlabel btcf-endlabel--' + l.kind}
                data-tone={l.tone}
                x={width - PAD.right + 8}
                y={l.y}
                dy="0.32em"
              >
                {l.text}
              </text>
            ))}

            {hover != null && (
              <g className="btcf-cross">
                <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} />
                <circle
                  cx={x(hover)}
                  cy={y(BTC_ACTUAL[hover])}
                  r="4"
                  className="btcf-dot btcf-dot--actual"
                />
                <circle
                  cx={x(hover)}
                  cy={y(current.values[hover])}
                  r="4"
                  className="btcf-dot btcf-dot--active"
                  data-tone={current.tone}
                />
              </g>
            )}
          </svg>
        )}

        {hover != null && (
          <div
            className="btcf-tip"
            style={{ left: (x(hover) / width) * 100 + '%' }}
            data-side={x(hover) > width * 0.6 ? 'left' : 'right'}
          >
            <p className="btcf-tip-date">{shortDate(hover)} 2024</p>
            <p className="btcf-tip-row">
              <span>Actual</span>
              <b>{usd0(BTC_ACTUAL[hover])}</b>
            </p>
            <p className="btcf-tip-row" data-tone={current.tone}>
              <span>{current.key}</span>
              <b>{usd0(current.values[hover])}</b>
            </p>
          </div>
        )}
      </div>

      <p className="btcf-note">
        <b className="btcf-note-name" data-tone={current.tone}>
          {current.key}
        </b>
        <span className="btcf-mae">MAE {usd0(MAE[current.key])}</span>
        {current.note}
      </p>

      <div className="btcf-controls">
        <div className="btcf-steps" role="group" aria-label="Choose a model">
          {BTC_FORECASTS.map((f, i) => (
            <button
              key={f.key}
              type="button"
              className="btcf-step"
              aria-pressed={i === active}
              onClick={() => jump(i)}
            >
              <span className="btcf-swatch" data-tone={f.tone} />
              {f.key}
            </button>
          ))}
        </div>
        <button type="button" className="btcf-replay" onClick={replay}>
          {playing ? 'Playing' : 'Replay'}
        </button>
      </div>
    </figure>
  )
}
