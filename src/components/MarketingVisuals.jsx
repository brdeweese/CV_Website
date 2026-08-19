import { useCallback, useEffect, useRef, useState } from 'react'
import { FUNNEL_SEGMENTS, MARKET_SEGMENTS } from '../data/projects/marketingSegments.js'

/**
 * The dripping funnel and the value-versus-cost comparison, ported from the
 * original marketing dashboard.
 *
 * Both are SVG built as a string and injected, which keeps the dashboard's SMIL
 * animations exactly as they were. Converting them to JSX would have meant
 * rewriting every <animate> by hand for no gain; the markup is generated here,
 * never from user input.
 *
 * The funnel reads per 100 enquiries, which is its natural basis. The market
 * comparison shows real order value and acquisition cost: indexing the UK to
 * 100 made the baseline look like a price rather than a reference, so it was
 * dropped.
 */

const MARKETS = ['All', 'UK', 'US']
const CLIENTS = ['All', 'New', 'Repeat']

/* Resolve theme colours once, and again whenever the theme changes: the SVG is
   a generated string and cannot inherit CSS custom properties. */
function useThemeInk(ref) {
  const [ink, setInk] = useState(null)

  const read = useCallback(() => {
    const el = ref.current
    if (!el) return
    const cs = getComputedStyle(el)
    const v = (n, fallback) => cs.getPropertyValue(n).trim() || fallback
    setInk({
      s1: v('--funnel-1', '#86b6ef'),
      s2: v('--funnel-2', '#3987e5'),
      s3: v('--funnel-3', '#184f95'),
      gain: v('--tourism', '#1baf7a'),
      cost: v('--div-neg', '#e34948'),
      text: v('--ink', '#0b0b0b'),
      muted: v('--ink-3', '#898781'),
      rule: v('--rule', '#e1e0d9'),
    })
  }, [ref])

  useEffect(() => {
    read()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener?.('change', read)
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      mq.removeEventListener?.('change', read)
      mo.disconnect()
    }
  }, [read])

  return ink
}

const rnd = (a, b) => a + Math.random() * (b - a)

/* Same shape as the original dashboard's formatter. */
const money = (x) =>
  Math.abs(x) >= 1000 ? '£' + Math.round(x).toLocaleString() : '£' + Math.round(x)

/* ---------- funnel ---------- */

function funnel3d(cx, mouthY, topRx, neckY, neckRx, grad) {
  const topRy = topRx * 0.2
  const neckRy = Math.max(4, neckRx * 0.42)
  const lx = cx - topRx
  const rx = cx + topRx
  const lnx = cx - neckRx
  const rnx = cx + neckRx
  const body = `M ${lx} ${mouthY} L ${lnx} ${neckY} A ${neckRx} ${neckRy} 0 0 0 ${rnx} ${neckY} L ${rx} ${mouthY} A ${topRx} ${topRy} 0 0 1 ${lx} ${mouthY} Z`
  return (
    `<path d="${body}" fill="url(#${grad})"/>` +
    `<path d="M ${lx} ${mouthY} L ${lnx} ${neckY}" stroke="#ffffff" stroke-opacity="0.28" stroke-width="2" fill="none"/>` +
    `<ellipse cx="${cx}" cy="${mouthY}" rx="${topRx}" ry="${topRy}" fill="#20302B" fill-opacity="0.28"/>` +
    `<ellipse cx="${cx}" cy="${mouthY}" rx="${topRx}" ry="${topRy}" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.5"/>` +
    `<ellipse cx="${cx}" cy="${neckY}" rx="${neckRx}" ry="${neckRy}" fill="#20302B" fill-opacity="0.34"/>`
  )
}

function dotFall(cx, y0, y1, r, color, count) {
  let s = ''
  const dur = 1.9
  for (let i = 0; i < count; i++) {
    const dx = (cx + (Math.random() * 34 - 17)).toFixed(0)
    const begin = ((i / count) * dur).toFixed(2)
    s +=
      `<circle cx="${dx}" cy="${y0}" r="${r}" fill="${color}" opacity="0">` +
      `<animate attributeName="cy" from="${y0}" to="${y1}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>` +
      `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.22;0.72;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`
  }
  return s
}

function funnelSvg(seg, ink) {
  const W = 740
  const H = 510
  const cx = 225
  const labX = 442
  const f1 = { mouthY: 62, topRx: 150, neckY: 174, neckRx: 30 }
  const f2 = { mouthY: 206, topRx: 100, neckY: 312, neckRx: 21 }
  const f3 = { mouthY: 344, topRx: 60, neckY: 438, neckRx: 13 }

  const grad = (id, from, to) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`

  let g =
    `<defs>${grad('mfEnq', ink.s1, ink.s2)}${grad('mfQuote', ink.s2, ink.s3)}${grad('mfBook', ink.s3, ink.s3)}</defs>`

  g += dotFall(cx, 8, f1.mouthY + 4, 10, ink.s1, 7)
  g += dotFall(cx, f1.neckY + 6, f2.mouthY + 4, 6, ink.s2, 5)
  g += dotFall(cx, f2.neckY + 6, f3.mouthY + 4, 3.8, ink.s3, 3)
  g += dotFall(cx, f3.neckY + 6, f3.neckY + 40, 3, ink.s3, 2)

  g += funnel3d(cx, f1.mouthY, f1.topRx, f1.neckY, f1.neckRx, 'mfEnq')
  g += funnel3d(cx, f2.mouthY, f2.topRx, f2.neckY, f2.neckRx, 'mfQuote')
  g += funnel3d(cx, f3.mouthY, f3.topRx, f3.neckY, f3.neckRx, 'mfBook')

  const block = (y, name, val, col) =>
    `<circle cx="${labX - 14}" cy="${y - 5}" r="6" fill="${col}"/>` +
    `<text x="${labX}" y="${y}" font-size="14" font-weight="700" fill="${col}" letter-spacing="0.08em" font-family="ui-monospace, monospace">${name}</text>` +
    `<text x="${labX}" y="${y + 38}" font-size="34" font-weight="400" fill="${ink.text}" font-family="Georgia, serif">${val}</text>`

  g += block(100, 'ENQUIRIES', '100', ink.s1)
  g += block(244, 'QUOTES', seg.e2q.toFixed(1), ink.s2)
  g += block(388, 'BOOKINGS', seg.e2b.toFixed(1), ink.s3)

  g += `<text x="${labX}" y="170" font-size="13" fill="${ink.muted}">${seg.e2q.toFixed(1)}% reach a quote &#8595;</text>`
  g += `<text x="${labX}" y="314" font-size="13" fill="${ink.muted}">${seg.q2b.toFixed(1)}% of those book &#8595;</text>`
  g += `<text x="${labX}" y="470" font-size="12" fill="${ink.muted}">per 100 enquiries</text>`

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%">${g}</svg>`
}

/* ---------- value vs cost ---------- */

function poundStream(cx, fromY, toY, count, color, dur) {
  let s = ''
  for (let i = 0; i < count; i++) {
    const x = rnd(cx - 30, cx + 30).toFixed(0)
    const size = rnd(13, 20).toFixed(0)
    const begin = ((i / count) * dur).toFixed(2)
    s +=
      `<text x="${x}" y="${fromY}" font-size="${size}" font-weight="700" fill="${color}" text-anchor="middle" opacity="0">£` +
      `<animate attributeName="y" from="${fromY}" to="${toY}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>` +
      `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.72;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></text>`
  }
  return s
}

function unionJack(x, y, w, h) {
  const id = 'uk' + Math.round(rnd(0, 1e7))
  const cx = x + w / 2
  const cy = y + h / 2
  return (
    `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/></clipPath>` +
    `<g clip-path="url(#${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0A2A66"/>` +
    `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y + h}" stroke="#fff" stroke-width="${h * 0.22}"/>` +
    `<line x1="${x + w}" y1="${y}" x2="${x}" y2="${y + h}" stroke="#fff" stroke-width="${h * 0.22}"/>` +
    `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y + h}" stroke="#C8102E" stroke-width="${h * 0.09}"/>` +
    `<line x1="${x + w}" y1="${y}" x2="${x}" y2="${y + h}" stroke="#C8102E" stroke-width="${h * 0.09}"/>` +
    `<rect x="${cx - w * 0.11}" y="${y}" width="${w * 0.22}" height="${h}" fill="#fff"/>` +
    `<rect x="${x}" y="${cy - h * 0.18}" width="${w}" height="${h * 0.36}" fill="#fff"/>` +
    `<rect x="${cx - w * 0.065}" y="${y}" width="${w * 0.13}" height="${h}" fill="#C8102E"/>` +
    `<rect x="${x}" y="${cy - h * 0.105}" width="${w}" height="${h * 0.21}" fill="#C8102E"/></g>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke="#0003"/>`
  )
}

function usFlag(x, y, w, h) {
  const id = 'us' + Math.round(rnd(0, 1e7))
  const sh = h / 13
  let s = `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/></clipPath><g clip-path="url(#${id})">`
  for (let i = 0; i < 13; i++) {
    s += `<rect x="${x}" y="${(y + i * sh).toFixed(2)}" width="${w}" height="${(sh + 0.5).toFixed(2)}" fill="${i % 2 ? '#fff' : '#B22234'}"/>`
  }
  const cw = w * 0.42
  const ch = sh * 7
  s += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="#3C3B6E"/>`
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      s += `<circle cx="${(x + (cw * (c + 0.5)) / 5).toFixed(1)}" cy="${(y + (ch * (r + 0.5)) / 5).toFixed(1)}" r="${(sh * 0.16).toFixed(1)}" fill="#fff"/>`
    }
  }
  return s + `</g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke="#0003"/>`
}

function marketSvg(seg, market, ink) {
  const W = 720
  const H = 470
  const fw = 132
  const fh = 80
  const cy = 252
  const ft = cy - fh / 2
  const fb = cy + fh / 2
  const maxRise = 114

  const aovMax = Math.max(seg.aov.UK, seg.aov.US)
  const cacMax = Math.max(seg.cac.UK, seg.cac.US)

  function col(cx, label, aov, cac, flag, dim) {
    const rise = (aov / aovMax) * maxRise
    const drop = (cac / cacMax) * maxRise
    const up = 3 + Math.round((aov / aovMax) * 3)
    const dn = 3 + Math.round((cac / cacMax) * 3)
    let g = `<g opacity="${dim ? 0.28 : 1}">`
    g += poundStream(cx, ft - 6, ft - 6 - rise, up, ink.gain, 1.9)
    g += poundStream(cx, fb + 6, fb + 6 + drop, dn, ink.cost, 1.9)
    g += flag(cx - fw / 2, ft, fw, fh)
    g += `<text x="${cx}" y="26" text-anchor="middle" font-size="18" fill="${ink.text}" font-family="Georgia, serif">${label}</text>`
    g += `<text x="${cx}" y="${ft - rise - 14}" text-anchor="middle" font-size="19" font-weight="700" fill="${ink.gain}" font-family="Georgia, serif">${money(aov)}</text>`
    g += `<text x="${cx}" y="52" text-anchor="middle" font-size="11" fill="${ink.muted}" font-family="ui-monospace, monospace">AOV &#8593;</text>`
    g += `<text x="${cx}" y="${fb + drop + 24}" text-anchor="middle" font-size="19" font-weight="700" fill="${ink.cost}" font-family="Georgia, serif">${money(cac)}</text>`
    g += `<text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="11" fill="${ink.muted}" font-family="ui-monospace, monospace">CAC &#8595;</text>`
    return g + `</g>`
  }

  return (
    `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%">` +
    `<line x1="${W / 2}" y1="70" x2="${W / 2}" y2="${H - 60}" stroke="${ink.rule}"/>` +
    col(190, 'UK', seg.aov.UK, seg.cac.UK, unionJack, market === 'US') +
    col(530, 'US', seg.aov.US, seg.cac.US, usFlag, market === 'UK') +
    `</svg>`
  )
}

/* ---------- component ---------- */

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

export default function MarketingVisuals() {
  const hostRef = useRef(null)
  const ink = useThemeInk(hostRef)

  const [market, setMarket] = useState('All')
  const [client, setClient] = useState('All')
  const [run, setRun] = useState(0)

  const funnelSeg = FUNNEL_SEGMENTS[`${market}|${client}`] ?? FUNNEL_SEGMENTS['All|All']
  const marketSeg = MARKET_SEGMENTS[client] ?? MARKET_SEGMENTS.All
  const isDefault = market === 'All' && client === 'All'

  return (
    <div className="mktviz" ref={hostRef}>
      <div className="mktviz-filters">
        <div className="mktviz-group">
          <span className="mktviz-head">Client</span>
          <div className="mktviz-row" role="group" aria-label="Filter by client type">
            {CLIENTS.map((c) => (
              <button
                key={c}
                className={`mktviz-btn${client === c ? ' is-on' : ''}`}
                onClick={() => setClient(c)}
                aria-pressed={client === c}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mktviz-group">
          <span className="mktviz-head">Market</span>
          <div className="mktviz-row" role="group" aria-label="Filter by market">
            {MARKETS.map((m) => (
              <button
                key={m}
                className={`mktviz-btn${market === m ? ' is-on' : ''}`}
                onClick={() => setMarket(m)}
                aria-pressed={market === m}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="mktviz-actions">
          {!isDefault && (
            <button
              className="mktviz-reset"
              onClick={() => {
                setMarket('All')
                setClient('All')
              }}
            >
              Reset
            </button>
          )}
          <button className="mktviz-replay" onClick={() => setRun((n) => n + 1)}>
            <ReplayIcon /> Replay
          </button>
        </div>
      </div>

      <div className="mktviz-pair">
        <figure className="viz mktviz-card">
          <figcaption className="viz-head">
            <span className="viz-title">Where the enquiries go</span>
            <span className="viz-source">
              Per 100 enquiries · {market === 'All' ? 'both markets' : market} ·{' '}
              {client === 'All' ? 'all clients' : `${client.toLowerCase()} clients`}
            </span>
          </figcaption>
          <div
            className="mktviz-plot"
            key={`funnel-${run}-${market}-${client}`}
            dangerouslySetInnerHTML={{ __html: ink ? funnelSvg(funnelSeg, ink) : '' }}
          />
        </figure>

        <figure className="viz mktviz-card">
          <figcaption className="viz-head">
            <span className="viz-title">Value against cost, UK and US</span>
            <span className="viz-source">
              Value per booking against cost to win one ·{' '}
              {client === 'All' ? 'all clients' : `${client.toLowerCase()} clients`}
            </span>
          </figcaption>
          <div
            className="mktviz-plot"
            key={`market-${run}-${market}-${client}`}
            dangerouslySetInnerHTML={{ __html: ink ? marketSvg(marketSeg, market, ink) : '' }}
          />
          <p className="viz-note">
            Pounds rise with AOV, the value of a booking, and fall with CAC, the cost of
            winning one. The US earns more per booking and costs more to acquire, which is
            the case for investing in it rather than cutting it.
          </p>
        </figure>
      </div>
    </div>
  )
}
