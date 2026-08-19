import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
 * Each chart animates on mount and can be replayed. Hovering gives a tooltip on
 * every form. Two series use the validated categorical slots; the diverging
 * form uses the documented blue/red poles with a neutral zero line, because it
 * encodes direction (more women / more men) rather than identity.
 *
 * SIZING: this deliberately does NOT use Recharts' ResponsiveContainer. That
 * component renders nothing until its ResizeObserver fires, which leaves a
 * blank box in any environment where observer callbacks are deferred.
 * Measuring the wrapper synchronously in useLayoutEffect gives the chart real
 * dimensions on the very first paint, with a ResizeObserver attached afterwards
 * only to handle later resizing.
 *
 * A project renders charts only if it declares a `visuals` array, so nothing is
 * ever invented for a project that has no data.
 */

const SERIES = ['var(--series-1)', 'var(--series-2)']
const axisTick = { fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--ink-3)' }
const DURATION = 1100

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

  // Synchronous first measurement, before paint.
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

function VizTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="viz-tip">
      <div className="viz-tip-label">{label}</div>
      {payload.map((p) => (
        <div className="viz-tip-row" key={p.dataKey ?? p.name}>
          <span className="viz-tip-dot" style={{ background: p.color || p.fill }} />
          <span>{p.name}</span>
          <strong>
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
            {unit}
          </strong>
        </div>
      ))}
    </div>
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

function Chart({ spec, width, height }) {
  const { kind, data, xKey, series = [], unit = '', valueKey, xInterval, xFormat } = spec
  const common = { width, height, data }

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
        <YAxis tick={axisTick} tickLine={false} axisLine={false} width={52} />
        <Tooltip
          content={<VizTooltip unit={unit} />}
          cursor={{ stroke: 'var(--ink-3)', strokeDasharray: '3 3' }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--ink-2)', paddingTop: 6 }} />
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
            animationDuration={DURATION}
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
          tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}${unit}`}
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
        <Tooltip content={<VizTooltip unit={unit} />} cursor={{ fill: 'var(--surface-2)' }} />
        <ReferenceLine x={0} stroke="var(--rule-strong)" strokeWidth={1.5} />
        <Bar
          dataKey={valueKey}
          name={spec.valueLabel ?? 'Difference'}
          radius={3}
          animationDuration={DURATION}
        >
          {data.map((d) => (
            <Cell key={d[xKey]} fill={d[valueKey] >= 0 ? 'var(--div-pos)' : 'var(--div-neg)'} />
          ))}
        </Bar>
      </BarChart>
    )
  }

  // grouped bars
  return (
    <BarChart {...common} margin={{ top: 8, right: 14, bottom: 0, left: -14 }}>
      <CartesianGrid stroke="var(--rule)" vertical={false} />
      <XAxis
        dataKey={xKey}
        tick={axisTick}
        tickLine={false}
        axisLine={{ stroke: 'var(--rule-strong)' }}
      />
      <YAxis
        tick={axisTick}
        tickLine={false}
        axisLine={false}
        width={52}
        tickFormatter={(v) => `${v}${unit}`}
      />
      <Tooltip content={<VizTooltip unit={unit} />} cursor={{ fill: 'var(--surface-2)' }} />
      <Legend wrapperStyle={{ fontSize: 12, color: 'var(--ink-2)', paddingTop: 6 }} />
      {series.map((s, i) => (
        <Bar
          key={s.key}
          dataKey={s.key}
          name={s.label}
          fill={SERIES[i % SERIES.length]}
          radius={[4, 4, 0, 0]}
          maxBarSize={54}
          animationDuration={DURATION}
        />
      ))}
    </BarChart>
  )
}

function Viz({ spec }) {
  const [run, setRun] = useState(0)
  const [ref, { width, height }] = useElementSize()

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
          <Chart key={run} spec={spec} width={width} height={height} />
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
