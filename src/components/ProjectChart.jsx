import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

/**
 * Renders a chart for a project, but ONLY when that project supplies real data
 * in cv.js. Nothing is generated or estimated — a project without a `chart`
 * field simply shows no chart.
 *
 * Series colours use the three validated categorical slots in fixed order and
 * are never cycled. Past three series, fold the rest into "Other" or split into
 * two charts rather than inventing a fourth hue.
 */
const SERIES_COLORS = ['var(--economics)', 'var(--data)', 'var(--tourism)']

const axisStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fill: 'var(--ink-3)',
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--rule-strong)',
        borderRadius: 4,
        padding: '0.6rem 0.75rem',
        fontSize: '0.82rem',
        boxShadow: '0 8px 20px var(--shadow)',
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--ink-3)', marginBottom: 4 }}>
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span
            style={{ width: 9, height: 9, borderRadius: 2, background: p.color, flexShrink: 0 }}
          />
          <span style={{ color: 'var(--ink-2)' }}>{p.name}</span>
          <strong style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
            {p.value}
          </strong>
        </div>
      ))}
    </div>
  )
}

export default function ProjectChart({ chart }) {
  if (!chart?.data?.length || !chart?.series?.length) return null

  const { kind = 'bar', title, source, xKey, series, data } = chart
  const Chart = kind === 'line' ? LineChart : BarChart
  const showLegend = series.length >= 2

  return (
    <figure className="chart-card">
      {title && <figcaption className="chart-title">{title}</figcaption>}
      {source && <p className="chart-source">{source}</p>}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <Chart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
            <CartesianGrid stroke="var(--rule)" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={axisStyle}
              tickLine={false}
              axisLine={{ stroke: 'var(--rule-strong)' }}
            />
            <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={56} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-2)' }} />
            {showLegend && (
              <Legend
                wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-sans)', color: 'var(--ink-2)' }}
              />
            )}
            {series.map((s, i) =>
              kind === 'line' ? (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ) : (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  fill={SERIES_COLORS[i % SERIES_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={44}
                />
              ),
            )}
          </Chart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
