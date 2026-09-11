import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ACTUAL_JAN_20,
  AI_PROMPTS,
  CELLS,
  CORRELATION,
  LIN_FORECAST,
  MA_FORECAST,
  MONTHS,
  MOVING_AVERAGE,
  SERIES,
  VISITS,
} from '../../data/pythonLab.js'

/**
 * The Coding Practice with AI worksheet, run in the browser.
 *
 * Students open Google Colab, paste a cell, press play and read what comes
 * back. This is that, without the Colab account: the cells hold the
 * worksheet's own code, the play button runs them in order, and the output
 * draws itself the way a fresh matplotlib figure appears under a cell.
 *
 * The line colours are the worksheet's own matplotlib colours in light mode,
 * so the chart here matches the one a student gets in Colab. The dark theme
 * uses lighter versions of the same three hues, chosen so the three lines stay
 * apart under deuteranopia, protanopia and tritanopia; every line is also
 * labelled at its end, so the colours never carry the meaning on their own.
 */

const VB = { w: 860, h: 400 }
/* The right margin holds the end labels. Sized from their measured widths in
   viewBox units (the longest is "Tourist visits (100k)" at 135.3) rather than
   guessed, so none of them is clipped. */
const PAD = { top: 26, right: 156, bottom: 46, left: 52 }
/* Minimum vertical space between two end labels before they are pushed apart. */
const LABEL_GAP = 15
const DRAW_MS = 1400
const PLOT_W = VB.w - PAD.left - PAD.right
const PLOT_H = VB.h - PAD.top - PAD.bottom

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const fmt = (v, d = 2) => v.toFixed(d)

/** One shared y scale, because the worksheet plots all three on one axis. */
function scaleFor(arrays) {
  const flat = arrays.flat().filter((v) => v != null)
  const lo = Math.min(0, ...flat)
  const hi = Math.max(...flat)
  const pad = (hi - lo) * 0.08
  const top = hi + pad
  const bottom = lo
  return {
    y: (v) => PAD.top + PLOT_H - ((v - bottom) / (top - bottom)) * PLOT_H,
    ticks: Array.from({ length: 5 }, (_, i) => bottom + ((top - bottom) * i) / 4),
    top,
    bottom,
  }
}

function Axes({ scale, labels, extra = 0 }) {
  const n = labels.length + extra
  const x = (i) => PAD.left + (n === 1 ? 0 : (i / (n - 1)) * PLOT_W)
  return (
    <g className="py-axes">
      {scale.ticks.map((t) => (
        <g key={t}>
          <line
            className="py-grid"
            x1={PAD.left}
            x2={PAD.left + PLOT_W}
            y1={scale.y(t)}
            y2={scale.y(t)}
          />
          <text className="py-tick" x={PAD.left - 8} y={scale.y(t) + 4} textAnchor="end">
            {t >= 10 ? Math.round(t) : fmt(t, 1)}
          </text>
        </g>
      ))}
      {labels.map((m, i) => (
        <text
          key={m}
          className="py-tick"
          x={x(i)}
          y={VB.h - PAD.bottom + 20}
          textAnchor="end"
          transform={`rotate(-45 ${x(i)} ${VB.h - PAD.bottom + 20})`}
        >
          {m}
        </text>
      ))}
    </g>
  )
}

/* ---- Part 2: the three line series ---------------------------------------- */

function LineChart({ run }) {
  const scale = useMemo(() => scaleFor(SERIES.map((s) => s.values)), [])
  const refs = useRef({})
  const labelRefs = useRef({})
  const timers = useRef([])

  const n = MONTHS.length
  const x = (i) => PAD.left + (i / (n - 1)) * PLOT_W

  const paths = useMemo(
    () =>
      SERIES.map((s) => ({
        key: s.key,
        d: s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${scale.y(v)}`).join(' '),
        endY: scale.y(s.values[n - 1]),
        label: s.label,
      })),
    [scale],
  )

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    const set = (t) => {
      paths.forEach((p, i) => {
        const el = refs.current[p.key]
        if (el) {
          /* Stagger, so the three lines arrive one after another the way
             matplotlib paints them in order. */
          const local = clamp01((t - i * 0.12) / (1 - i * 0.12))
          el.style.strokeDashoffset = String(1 - local)
        }
        const lab = labelRefs.current[p.key]
        if (lab) lab.style.opacity = String(t > 0.85 ? (t - 0.85) / 0.15 : 0)
      })
    }
    if (!run) {
      set(0)
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      set(1)
      return
    }
    let raf = 0
    let settled = false
    const t0 = performance.now()
    const finish = () => {
      if (settled) return
      settled = true
      set(1)
    }
    const tick = (now) => {
      const t = (now - t0) / DRAW_MS
      set(clamp01(t))
      if (t < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    set(0)
    raf = requestAnimationFrame(tick)
    /* rAF does not run in every embedded browser; without this the lines never
       finish drawing. */
    timers.current.push(setTimeout(finish, DRAW_MS + 300))
    timers.current.push(setTimeout(() => cancelAnimationFrame(raf), DRAW_MS + 400))
    return () => {
      cancelAnimationFrame(raf)
      timers.current.forEach(clearTimeout)
    }
  }, [run, paths])

  return (
    <svg
      className="py-fig"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      role="img"
      aria-label="Trends in temperature, tourist visits and spending, December 2018 to December 2019"
    >
      <text className="py-figtitle" x={PAD.left} y="16">
        Trends in Temperature, Tourist Visits, and Spending
      </text>
      <Axes scale={scale} labels={MONTHS} />
      {paths.map((p) => (
        <g key={p.key}>
          <path
            ref={(el) => {
              refs.current[p.key] = el
            }}
            className={`py-line py-line--${p.key}`}
            d={p.d}
            pathLength="1"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
          <text
            ref={(el) => {
              labelRefs.current[p.key] = el
            }}
            className={`py-endlabel py-endlabel--${p.key}`}
            x={PAD.left + PLOT_W + 8}
            y={p.endY + 4}
            style={{ opacity: 0 }}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

/* ---- Parts 6 and 7: the two forecasts against the actual ------------------- */

function ForecastChart({ run }) {
  const scale = useMemo(
    () => scaleFor([VISITS, [ACTUAL_JAN_20, LIN_FORECAST, MA_FORECAST]]),
    [],
  )
  const labels = useMemo(() => [...MONTHS, 'Jan-20'], [])
  const n = labels.length
  const x = (i) => PAD.left + (i / (n - 1)) * PLOT_W
  const lastX = x(MONTHS.length - 1)
  const janX = x(n - 1)

  const [phase, setPhase] = useState(0) // 0 none, 1 actual, 2 MA, 3 forecasts
  const timers = useRef([])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (!run) {
      setPhase(0)
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setPhase(3)
      return
    }
    setPhase(0)
    timers.current.push(setTimeout(() => setPhase(1), 40))
    timers.current.push(setTimeout(() => setPhase(2), 900))
    timers.current.push(setTimeout(() => setPhase(3), 1700))
    return () => timers.current.forEach(clearTimeout)
  }, [run])

  const actualD = VISITS.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${scale.y(v)}`).join(' ')
  const maPoints = MOVING_AVERAGE.map((v, i) =>
    v == null ? null : [x(i), scale.y(v)],
  ).filter(Boolean)
  const maD = maPoints.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')

  /* The moving average landed 1.87 above the actual, so their labels would sit
     on top of each other. Push the labels apart while the markers stay on the
     values they belong to, and draw a short tick where one has moved. */
  const marks = useMemo(() => {
    const base = [
      { key: 'actual', y: scale.y(ACTUAL_JAN_20), v: ACTUAL_JAN_20, label: 'Actual' },
      { key: 'lin', y: scale.y(LIN_FORECAST), v: LIN_FORECAST, label: 'Linear trend' },
      { key: 'ma', y: scale.y(MA_FORECAST), v: MA_FORECAST, label: 'Moving average' },
    ]
    const sorted = [...base].sort((a, c) => a.y - c.y)
    sorted.forEach((m, i) => {
      m.labelY = i === 0 ? m.y : Math.max(m.y, sorted[i - 1].labelY + LABEL_GAP)
    })
    return base
  }, [scale])

  return (
    <svg
      className="py-fig"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      role="img"
      aria-label="Visitor forecasts for January 2020 compared with the actual figure"
    >
      <text className="py-figtitle" x={PAD.left} y="16">
        Visitor forecasts for January 2020 compared with actual
      </text>
      <Axes scale={scale} labels={labels} />

      <path
        className="py-line py-line--visits"
        d={actualD}
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: phase >= 1 ? 0 : 1,
          transition: 'stroke-dashoffset 0.85s linear',
        }}
      />
      {phase >= 1 &&
        VISITS.map((v, i) => (
          <circle
            className="py-dot py-dot--visits"
            key={i}
            cx={x(i)}
            cy={scale.y(v)}
            r="3.5"
          />
        ))}

      <path
        className="py-line py-line--ma"
        d={maD}
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: phase >= 2 ? 0 : 1,
          transition: 'stroke-dashoffset 0.7s linear',
        }}
      />

      <g className="py-jan" style={{ opacity: phase >= 3 ? 1 : 0 }}>
        <line
          className="py-janrule"
          x1={janX}
          x2={janX}
          y1={PAD.top}
          y2={PAD.top + PLOT_H}
        />
        {marks.map((m) => (
          <g key={m.key}>
            <line
              className={`py-connect py-connect--${m.key}`}
              x1={lastX}
              y1={scale.y(VISITS[VISITS.length - 1])}
              x2={janX}
              y2={m.y}
            />
            {m.key === 'actual' ? (
              <circle className="py-mark py-mark--actual" cx={janX} cy={m.y} r="6" />
            ) : (
              <path
                className={`py-mark py-mark--${m.key}`}
                d={`M${janX - 6} ${m.y - 6}L${janX + 6} ${m.y + 6}M${janX + 6} ${m.y - 6}L${janX - 6} ${m.y + 6}`}
              />
            )}
            {m.labelY !== m.y && (
              <line
                className={`py-connect py-connect--${m.key}`}
                x1={janX + 7}
                y1={m.y}
                x2={janX + 13}
                y2={m.labelY}
              />
            )}
            <text
              className={`py-endlabel py-endlabel--${m.key}`}
              x={janX + 15}
              y={m.labelY + 4}
            >
              {m.label} {fmt(m.v)}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ---- Cell outputs ---------------------------------------------------------- */

function DataFrame() {
  const cols = ['Month', ...SERIES.map((s) => s.key)]
  return (
    <div className="py-framewrap">
      <table className="py-frame">
        <thead>
          <tr>
            <th />
            <th>Month</th>
            <th>Average_Temperature_Celsius</th>
            <th>Overseas_Visits_to_UK_100k</th>
            <th>Spending_by_Overseas_Residents_100m</th>
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((m, i) => (
            <tr key={m}>
              <td className="py-idx">{i}</td>
              <td>{m}</td>
              {SERIES.map((s) => (
                <td key={s.key} className="py-num">
                  {s.values[i]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="py-shape">
        [{MONTHS.length} rows x {cols.length} columns]
      </p>
    </div>
  )
}

function Matrix() {
  return (
    <div className="py-framewrap">
      <table className="py-frame py-matrix">
        <thead>
          <tr>
            <th />
            {SERIES.map((s) => (
              <th key={s.key}>{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CORRELATION.map((row, i) => (
            <tr key={SERIES[i].key}>
              <th scope="row">{SERIES[i].label}</th>
              {row.map((v, j) => (
                <td
                  key={j}
                  className="py-num"
                  data-strong={i !== j && v >= 0.9 ? 'true' : undefined}
                >
                  {fmt(v, 6)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="py-shape">Column names shortened to fit. The values are unchanged.</p>
    </div>
  )
}

/* ---- The notebook ---------------------------------------------------------- */

export default function PythonLab() {
  const [ran, setRan] = useState({})
  const [busy, setBusy] = useState(null)
  const timers = useRef([])

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  const run = useCallback((id) => {
    setBusy(id)
    setRan((r) => ({ ...r, [id]: false }))
    /* A beat of "running" before the output appears, the way a Colab cell
       shows its spinner before the figure lands. */
    timers.current.push(
      setTimeout(() => {
        setRan((r) => ({ ...r, [id]: true }))
        setBusy(null)
      }, 320),
    )
  }, [])

  const runAll = useCallback(() => {
    CELLS.forEach((c, i) => {
      timers.current.push(setTimeout(() => run(c.id), i * 420))
    })
  }, [run])

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setRan({})
    setBusy(null)
  }, [])

  const closer =
    Math.abs(MA_FORECAST - ACTUAL_JAN_20) < Math.abs(LIN_FORECAST - ACTUAL_JAN_20)

  return (
    <div className="game py">
      <p className="gm-hint">
        Students paste each cell into Google Colab and press play. Press play here instead
        and the same output appears, drawn from the same data.
      </p>

      <div className="gm-controls py-topbar">
        <button type="button" className="btn-game" onClick={runAll}>
          Run all cells
        </button>
        <button type="button" className="btn-game btn-game--ghost" onClick={reset}>
          Clear outputs
        </button>
      </div>

      <div className="py-notebook">
        {CELLS.map((cell) => {
          const done = ran[cell.id]
          const running = busy === cell.id
          return (
            <section className="py-cell" key={cell.id} data-run={done ? 'true' : undefined}>
              <div className="py-cellhead">
                <button
                  type="button"
                  className="py-play"
                  onClick={() => run(cell.id)}
                  aria-label={`Run cell ${cell.n}: ${cell.title}`}
                  data-running={running ? 'true' : undefined}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="py-playring" cx="12" cy="12" r="10.5" />
                    <path className="py-playtri" d="M9.5 7.5L17 12L9.5 16.5Z" />
                  </svg>
                </button>
                <span className="py-part">{cell.part}</span>
                <span className="py-celltitle">{cell.title}</span>
              </div>

              <pre className="py-code">
                <code>{cell.code}</code>
              </pre>

              <div className="py-out" data-empty={done ? undefined : 'true'}>
                {running && <p className="py-running">Running&hellip;</p>}
                {done && cell.kind === 'frame' && <DataFrame />}
                {done && cell.kind === 'matrix' && <Matrix />}
                {done && cell.kind === 'lines' && (
                  <div className="py-figwrap">
                    <LineChart run={done} />
                  </div>
                )}
                {done && cell.kind === 'forecast' && (
                  <div className="py-figwrap">
                    <ForecastChart run={done} />
                  </div>
                )}
                {!done && !running && (
                  <p className="py-idle">Press play to run this cell.</p>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {ran.forecast && (
        <p className="gm-fb">
          The linear trend predicted {fmt(LIN_FORECAST)} and the three month moving average{' '}
          {fmt(MA_FORECAST)}. January 2020 came in at {fmt(ACTUAL_JAN_20, 1)}, so the{' '}
          {closer ? 'moving average' : 'linear trend'} was closer. Two months later Covid
          closed the borders, and both would have been far out.
        </p>
      )}

      <div className="py-prompts">
        <p className="py-promptshead">The challenge prompts students take to AI</p>
        <ul>
          {AI_PROMPTS.map((p) => (
            <li key={p}>&ldquo;{p}&rdquo;</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
