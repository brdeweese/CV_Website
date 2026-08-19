import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

/**
 * Interactive charts for a project detail page.
 *
 * Each chart grows in on mount, can be replayed, and shows a tooltip on hover.
 * Two series use the validated categorical slots; the diverging form uses the
 * documented blue/red poles with a neutral zero line, because it encodes
 * direction (more women / more men) rather than identity.
 *
 * SIZING: this deliberately does NOT use Recharts' ResponsiveContainer, which
 * renders nothing until its ResizeObserver fires. The wrapper is measured
 * synchronously in useLayoutEffect so the chart has real dimensions on the
 * first paint.
 *
 * ANIMATION: Recharts' own animation is switched off and the growth is driven
 * here instead. Recharts' bar animation renders empty <g> wrappers in a
 * production build (verified in Chrome: ten wrappers, zero rectangles, long
 * after the animation window), which silently produces a blank chart. Tweening
 * the values ourselves avoids that path entirely and, critically, a timeout
 * failsafe forces the final frame if requestAnimationFrame never runs — so the
 * worst case is a chart that appears without animating, never a blank one.
 * Reduced-motion users jump straight to the final state.
 *
 * A project renders charts only if it declares a `visuals` array, so nothing is
 * ever invented for a project that has no data.
 */

const SERIES = ['var(--series-1)', 'var(--series-2)']
const axisTick = { fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--ink-3)' }
const DURATION = 950

/* --- hooks ---------------------------------------------------------------- */

function useElementSize() {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setSize((prev) =>
      Math.round(prev.width) === Math.round(r.width) &&
      Math.round(prev.height) === Math.round(r.height)
        ? prev
        : { width: r.width, height: r.height },
    )
  }, [])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const ro = new ResizeObserver(measure)
    if (ref.current) ro.observe(ref.current)
    return () => ro.disconnect()
  }, [measure])

  return [ref, size]
}

const easeOut = (p) => 1 - Math.pow(1 - p, 3)

/** Progress from 0 to 1, with a failsafe so the end state always arrives. */
function useTween(runKey, duration = DURATION) {
  const [t, setT] = useState(0)

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof requestAnimationFrame === 'undefined') {
      setT(1)
      return undefined
    }

    setT(0)
    let raf = 0
    let startTs
    const step = (ts) => {
      if (startTs === undefined) startTs = ts
      const p = Math.min(1, (ts - startTs) / duration)
      setT(p >= 1 ? 1 : easeOut(p))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    // If rAF never advances, land on the final frame anyway.
    const failsafe = window.setTimeout(() => setT(1), duration + 500)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(failsafe)
    }
  }, [runKey, duration])

  return t
}

/* --- helpers -------------------------------------------------------------- */

/**
 * A domain and tick list that land on round numbers and always include zero.
 * Letting Recharts derive ticks from a raw data domain produces labels like
 * "+28%" and "+143%"; this snaps the step to 1, 2, 2.5, 5 or 10 times a power
 * of ten so the axis reads +50, +100, +150 instead.
 */
function niceScale(lo, hi, targetTicks = 5) {
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo === hi) {
    return { domain: [0, 1], ticks: [0, 1] }
  }
  const rawStep = (hi - lo) / targetTicks
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const norm = rawStep / mag
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag

  const start = Math.floor(lo / step) * step
  const end = Math.ceil(hi / step) * step
  const ticks = []
  for (let v = start; v <= end + step / 1000; v += step) {
    ticks.push(Math.round(v * 1e6) / 1e6)
  }
  return { domain: [start, end], ticks }
}

/* --- pieces --------------------------------------------------------------- */

function VizTooltip({ active, payload, label, unit = '', full, xKey }) {
  if (!active || !payload?.length) return null
  // Read from the un-animated data so the tooltip never shows a partial value
  // mid-animation.
  const row = full?.find((d) => d[xKey] === label)
  return (
    <div className="viz-tip">
      <div className="viz-tip-label">{label}</div>
      {payload.map((p) => {
        const value = row?.[p.dataKey] ?? p.value
        return (
          <div className="viz-tip-row" key={p.dataKey ?? p.name}>
            <span className="viz-tip-dot" style={{ background: p.color || p.fill }} />
            <span>{p.name}</span>
            <strong>
              {typeof value === 'number' ? Math.round(value * 10) / 10 : value}
              {unit}
            </strong>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Category labels that wrap instead of disappearing.
 *
 * Every category on these charts has to stay labelled, so the axis uses
 * interval={0}. Left as single-line text that collides on narrow screens, which
 * is exactly why Recharts drops labels by default. Wrapping on spaces keeps all
 * of them readable down to phone width.
 */
function WrapTick({ x, y, payload, maxChars = 14 }) {
  const words = String(payload?.value ?? '').split(' ')
  const lines = []
  let line = ''
  words.forEach((w) => {
    const candidate = line ? `${line} ${w}` : w
    if (candidate.length <= maxChars) {
      line = candidate
    } else {
      if (line) lines.push(line)
      line = w
    }
  })
  if (line) lines.push(line)

  return (
    <text
      x={x}
      y={y + 10}
      textAnchor="middle"
      fill="var(--ink-3)"
      fontFamily="var(--font-mono)"
      fontSize={11}
    >
      {lines.map((l, i) => (
        <tspan key={l} x={x} dy={i === 0 ? 0 : 12}>
          {l}
        </tspan>
      ))}
    </text>
  )
}

function ReplayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Chart({ spec, width, height, t }) {
  const {
    kind,
    data,
    xKey,
    series = [],
    unit = '',
    valueKey,
    xInterval,
    xFormat,
    zeroBased = true,
    refLine,
    yFormat,
  } = spec

  const keys = kind === 'diverging' ? [valueKey] : series.map((s) => s.key)

  // Fixed axis bounds from the FINAL data, so the scale does not rescale while
  // the values grow in.
  const scale = useMemo(() => {
    // A magnitude scale must start at zero. A ratio hovering around 2.0 would
    // be a flat line if forced to, so those opt out via zeroBased: false and
    // carry a labelled reference line instead.
    let lo = zeroBased ? 0 : Infinity
    let hi = zeroBased ? 0 : -Infinity
    data.forEach((d) => {
      keys.forEach((k) => {
        const v = d[k]
        if (typeof v !== 'number') return
        if (v < lo) lo = v
        if (v > hi) hi = v
      })
    })
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return { domain: [0, 1], ticks: [0, 1] }
    // Fewer ticks on a narrow chart. Asking for five on a phone produces labels
    // that overlap, which is why Recharts was silently dropping some of them.
    const target = width < 420 ? 3 : width < 700 ? 4 : 5
    return niceScale(lo, hi, target)
  }, [data, keys.join('|'), zeroBased, width])

  const floor = zeroBased ? 0 : scale.domain[0]
  const animated = useMemo(() => {
    if (t >= 1) return data
    return data.map((d) => {
      const row = { ...d }
      keys.forEach((k) => {
        // Grow from the axis floor so a truncated scale animates upward from
        // the bottom of the plot rather than flying in from zero.
        if (typeof row[k] === 'number') row[k] = floor + (row[k] - floor) * t
      })
      return row
    })
  }, [data, keys.join('|'), t, floor])

  const common = { width, height, data: animated }
  const tip = <VizTooltip unit={unit} full={data} xKey={xKey} />

  if (kind === 'line') {
    return (
      <LineChart {...common} margin={{ top: 8, right: 14, bottom: 0, left: -14 }}>
        <CartesianGrid stroke="var(--rule)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={axisTick}
          tickLine={false}
          axisLine={{ stroke: 'var(--rule-strong)' }}
          interval={xInterval ?? 'preserveStartEnd'}
          tickFormatter={xFormat === 'year' ? (v) => String(v).split(' ')[1] : undefined}
        />
        <YAxis
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          width={52}
          domain={scale.domain}
          ticks={scale.ticks}
          allowDataOverflow
          tickFormatter={yFormat === 'ratio' ? (v) => `${v}x` : undefined}
        />
        <Tooltip content={tip} cursor={{ stroke: 'var(--ink-3)', strokeDasharray: '3 3' }} />
        {series.length > 1 && (
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--ink-2)', paddingTop: 6 }} />
        )}
        {refLine && (
          <ReferenceLine
            y={refLine.y}
            stroke="var(--ink-3)"
            strokeDasharray="4 4"
            label={{
              value: refLine.label,
              position: 'insideTopLeft',
              fill: 'var(--ink-3)',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
            }}
          />
        )}
        {series.map((s, i) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={SERIES[i % SERIES.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--surface)' }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    )
  }

  if (kind === 'diverging') {
    return (
      <BarChart {...common} layout="vertical" margin={{ top: 8, right: 22, bottom: 0, left: 6 }}>
        <CartesianGrid stroke="var(--rule)" horizontal={false} />
        <XAxis
          type="number"
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          interval={0}
          domain={scale.domain}
          ticks={scale.ticks}
          allowDataOverflow
          tickFormatter={(v) => `${v > 0 ? '+' : ''}${Math.round(v)}${unit}`}
        />
        <YAxis
          type="category"
          dataKey={xKey}
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          interval={0}
          width={96}
        />
        <Tooltip content={tip} cursor={{ fill: 'var(--surface-2)' }} />
        <ReferenceLine x={0} stroke="var(--rule-strong)" strokeWidth={1.5} />
        <Bar
          dataKey={valueKey}
          name={spec.valueLabel ?? 'Difference'}
          isAnimationActive={false}
        >
          {data.map((d) => (
            <Cell key={d[xKey]} fill={d[valueKey] >= 0 ? 'var(--div-pos)' : 'var(--div-neg)'} />
          ))}
        </Bar>
      </BarChart>
    )
  }

  // grouped bars
  // Roughly 7px per character at this font size, so a category gets as many
  // characters as its slice of the plot can actually hold.
  const catChars = Math.max(6, Math.floor(width / Math.max(1, data.length) / 7))
  return (
    <BarChart {...common} margin={{ top: 8, right: 14, bottom: 14, left: -14 }}>
      <CartesianGrid stroke="var(--rule)" vertical={false} />
      <XAxis
        dataKey={xKey}
        tick={<WrapTick maxChars={catChars} />}
        tickLine={false}
        interval={0}
        axisLine={{ stroke: 'var(--rule-strong)' }}
      />
      <YAxis
        tick={axisTick}
        tickLine={false}
        axisLine={false}
        width={52}
        domain={scale.domain}
        ticks={scale.ticks}
        allowDataOverflow
        tickFormatter={(v) => `${Math.round(v)}${unit}`}
      />
      <Tooltip content={tip} cursor={{ fill: 'var(--surface-2)' }} />
      <Legend wrapperStyle={{ fontSize: 12, color: 'var(--ink-2)', paddingTop: 6 }} />
      {series.map((s, i) => (
        <Bar
          key={s.key}
          dataKey={s.key}
          name={s.label}
          fill={SERIES[i % SERIES.length]}
          radius={[4, 4, 0, 0]}
          maxBarSize={54}
          isAnimationActive={false}
        />
      ))}
    </BarChart>
  )
}

function Viz({ spec }) {
  const [run, setRun] = useState(0)
  const [ref, { width, height }] = useElementSize()
  const t = useTween(run)

  return (
    <figure className="viz">
      <div className="viz-head">
        <figcaption>
          <span className="viz-title">{spec.title}</span>
          {spec.source && <span className="viz-source">{spec.source}</span>}
        </figcaption>
        <button className="viz-replay" onClick={() => setRun((n) => n + 1)}>
          <ReplayIcon /> Replay
        </button>
      </div>

      <div className="viz-plot" ref={ref}>
        {width > 0 && height > 0 && (
          <Chart spec={spec} width={width} height={height} t={t} />
        )}
      </div>

      {spec.note && <p className="viz-note">{spec.note}</p>}
    </figure>
  )
}

export default function ProjectVisuals({ visuals }) {
  if (!visuals?.length) return null
  return (
    <div className="viz-set">
      {visuals.map((spec, i) => (
        <Viz spec={spec} key={spec.title ?? i} />
      ))}
    </div>
  )
}
