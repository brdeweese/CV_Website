import { useCallback, useEffect, useRef, useState } from 'react'
import { ALBUMS, PAIRS } from '../data/projects/erasAlbums.js'

/**
 * Average Spotify popularity per album, each bar condensed out of a drift of
 * musical notes.
 *
 * Every row starts as a scatter of notes wandering and shimmering across the
 * space its bar will occupy. When the row's turn comes the notes slide home,
 * left to right, and the bar sets behind them as they land and fade.
 *
 * TWO KINDS OF NOTE, and that is the one piece of encoding here: a beamed pair
 * marks a re-recording and a single quaver an original release, which is the
 * comparison the analysis is about. Shape carries it, so it survives
 * colourblindness and a greyscale print, and the pairs strip underneath states
 * it in numbers besides.
 *
 * Colour is the album's own era. Fourteen hues cannot be validated as a
 * categorical set and are not asked to be: every bar is named on the axis. Each
 * is checked for contrast against both surfaces, which is the requirement that
 * does apply to a filled mark this size.
 *
 * Everything animated is written straight to the DOM rather than through state.
 * At fourteen rows of up to fifteen notes there are around a hundred and eighty
 * moving parts, and re-rendering that tree sixty times a second is not worth
 * doing when a transform attribute will do.
 */

const VB = { w: 1000, h: 660 }
const PAD = { left: 210, top: 96, right: 96 }
const ROW = 38
const BAR_H = 21
const SCALE_MAX = 90 // headroom above the top album's 82.93
const FULL = VB.w - PAD.left - PAD.right

const LEAD_MS = 500
const ROW_MS = 1500
const STAGGER = 260
const TOTAL = LEAD_MS + STAGGER * (ALBUMS.length - 1) + ROW_MS

const NOTE_EVERY = 46 // one note per this many units of finished bar

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const ease = (t) => 1 - (1 - t) ** 3
const lerp = (a, b, t) => a + (b - a) * t

/** Deterministic scatter, so a replay lands the same way twice. */
const rand = (i, k, salt) => {
  const x = Math.sin(i * 127.1 + k * 311.7 + salt * 74.7) * 43758.5453
  return x - Math.floor(x)
}

const rowY = (i) => PAD.top + i * ROW
const barW = (v) => (v / SCALE_MAX) * FULL

/* A quaver, and two of them under a beam. */
const NOTE_HEAD = 'M-3.6 3 a3.6 2.8 0 1 0 7.2 0 a3.6 2.8 0 1 0 -7.2 0 Z'
const QUAVER = [
  NOTE_HEAD,
  'M2.4 3 h1.4 v-13 h-1.4 Z',
  'M3.8 -10 q5 1.6 3.8 6.4 q-0.8 -3.4 -3.8 -4 Z',
].join(' ')
const BEAMED = [
  'M-7.4 3.4 a3.4 2.6 0 1 0 6.8 0 a3.4 2.6 0 1 0 -6.8 0 Z',
  'M-1.9 3.4 h1.3 v-12.6 h-1.3 Z',
  'M2.6 3.4 a3.4 2.6 0 1 0 6.8 0 a3.4 2.6 0 1 0 -6.8 0 Z',
  'M8.1 3.4 h1.3 v-12.6 h-1.3 Z',
  'M-1.9 -9.2 h11.3 v3.1 h-11.3 Z',
].join(' ')

/** Where each note comes to rest along its finished bar. */
function homes(i) {
  const w = barW(ALBUMS[i].avg)
  const n = Math.max(6, Math.round(w / NOTE_EVERY))
  return Array.from({ length: n }, (_, k) => ({
    x: PAD.left + ((k + 0.5) * w) / n,
    y: rowY(i) + BAR_H / 2,
  }))
}

export default function ErasBars() {
  const [reduced, setReduced] = useState(false)
  const [runId, setRunId] = useState(0)
  const [hover, setHover] = useState(null)
  const noteRefs = useRef([])
  const barRefs = useRef([])
  const valueRefs = useRef([])

  const layout = ALBUMS.map((_, i) => homes(i))

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const frame = (ms) => {
      ALBUMS.forEach((a, i) => {
        const p = clamp01((ms - LEAD_MS - i * STAGGER) / ROW_MS)
        const conv = clamp01((p - 0.42) / 0.58)
        const full = barW(a.avg)

        const bar = barRefs.current[i]
        if (bar) bar.setAttribute('width', String(full * ease(conv)))

        const value = valueRefs.current[i]
        if (value) {
          value.style.opacity = conv > 0.96 ? '1' : '0'
          value.setAttribute('x', String(PAD.left + full * ease(conv) + 10))
        }

        const notes = noteRefs.current[i] || []
        const home = layout[i]
        notes.forEach((el, k) => {
          if (!el) return
          const h = home[k]
          const phase = rand(i, k, 1) * 6.28
          /* Wander and shimmer while the row waits its turn. */
          const sx = h.x + (rand(i, k, 2) - 0.5) * 128 + Math.sin(ms / 900 + phase) * 8
          const sy = h.y + (rand(i, k, 3) - 0.5) * 52 + Math.cos(ms / 1100 + phase) * 6

          /* Notes on the left land first, so the bar sets left to right. */
          const arrive = clamp01((conv - 0.18 * (k / home.length)) / 0.82)
          const e = ease(arrive)
          const x = lerp(sx, h.x, e)
          const y = lerp(sy, h.y, e)
          const scale = lerp(0.78 + 0.22 * Math.sin(ms / 380 + phase), 0.5, e)
          el.setAttribute(
            'transform',
            `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale.toFixed(2)})`,
          )
          const shimmer = 0.45 + 0.4 * (0.5 + 0.5 * Math.sin(ms / 420 + phase))
          el.style.opacity = String(shimmer * (1 - e))
        })
      })
    }

    if (reduced) {
      frame(TOTAL)
      return undefined
    }

    let raf = 0
    let settled = false
    const t0 = performance.now()
    const finish = () => {
      if (settled) return
      settled = true
      frame(TOTAL)
    }
    const tick = (now) => {
      const ms = now - t0
      frame(ms)
      if (ms < TOTAL) raf = requestAnimationFrame(tick)
      else finish()
    }
    frame(0)
    raf = requestAnimationFrame(tick)
    /* rAF does not run in every embedded browser and is throttled to nothing in
       a background tab; without this no bar ever forms. */
    const failsafe = setTimeout(finish, TOTAL + 400)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(failsafe)
    }
  }, [reduced, runId])

  const replay = useCallback(() => setRunId((n) => n + 1), [])
  const ticks = [0, 20, 40, 60, 80]

  return (
    <figure className="eras">
      <figcaption className="eras-head">
        <h3 className="eras-title">Average track popularity, by album</h3>
        <p className="eras-sub">
          Each row begins as a drift of notes and settles into its bar. Length is the mean
          Spotify popularity score of the album&rsquo;s tracks and the colour is the
          album&rsquo;s own era. The notes come in two kinds: a beamed pair for a
          re-recording and a single quaver for an original release, so the four
          re-recordings can be picked out without reading a label.
        </p>
      </figcaption>

      <div className="eras-plot">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          role="img"
          aria-label="Fourteen Taylor Swift albums ranked by average track popularity, from reputation at 82.9 down to Fearless Platinum Edition at 46. All four Taylor's Version re-recordings score higher than the originals they replaced."
        >
          <text className="eras-axistitle" x={20} y={PAD.top - 52}>
            Average Spotify popularity score of the album&rsquo;s tracks
          </text>

          {ticks.map((t) => (
            <g key={t}>
              <line
                className="eras-grid"
                x1={PAD.left + barW(t)}
                x2={PAD.left + barW(t)}
                y1={PAD.top - 18}
                y2={rowY(ALBUMS.length - 1) + BAR_H + 16}
              />
              <text
                className="eras-tick"
                x={PAD.left + barW(t)}
                y={PAD.top - 26}
                textAnchor="middle"
              >
                {t}
              </text>
            </g>
          ))}

          {ALBUMS.map((a, i) => {
            const y = rowY(i)
            return (
              <g
                key={a.id}
                className="eras-row"
                data-era={a.era}
                data-hover={hover === a.id ? 'true' : undefined}
                onMouseEnter={() => setHover(a.id)}
                onMouseLeave={() => setHover(null)}
              >
                <rect className="eras-hit" x={0} y={y - 6} width={VB.w} height={ROW} />

                <text
                  className="eras-name"
                  x={PAD.left - 20}
                  y={y + BAR_H / 2 + 4}
                  textAnchor="end"
                >
                  {a.label}
                </text>

                <rect
                  ref={(el) => {
                    barRefs.current[i] = el
                  }}
                  className="eras-bar"
                  x={PAD.left}
                  y={y}
                  width={0}
                  height={BAR_H}
                  rx="3"
                />

                {layout[i].map((h, k) => (
                  <path
                    key={k}
                    ref={(el) => {
                      if (!noteRefs.current[i]) noteRefs.current[i] = []
                      noteRefs.current[i][k] = el
                    }}
                    className="eras-note"
                    d={a.tv ? BEAMED : QUAVER}
                    style={{ opacity: 0 }}
                  />
                ))}

                <text
                  ref={(el) => {
                    valueRefs.current[i] = el
                  }}
                  className="eras-value"
                  x={PAD.left + 10}
                  y={y + BAR_H / 2 + 4}
                  style={{ opacity: 0 }}
                >
                  {a.avg.toFixed(1)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="eras-legend">
        <div className="eras-key">
          <svg viewBox="-14 -16 28 24" className="eras-key-icon" aria-hidden="true">
            <path className="eras-note" d={BEAMED} />
          </svg>
          <p className="eras-key-text">
            <b>Beamed pair</b>
            Taylor&rsquo;s Version, re-recorded
          </p>
        </div>
        <div className="eras-key">
          <svg viewBox="-14 -16 28 24" className="eras-key-icon" aria-hidden="true">
            <path className="eras-note" d={QUAVER} />
          </svg>
          <p className="eras-key-text">
            <b>Single quaver</b>
            Original release
          </p>
        </div>
      </div>

      <div className="eras-pairs">
        <p className="eras-pairtitle">Each re-recording against the release it replaced</p>
        <div className="eras-pairgrid">
          {PAIRS.map((p) => {
            const o = ALBUMS.find((a) => a.id === p.original)
            const t = ALBUMS.find((a) => a.id === p.tv)
            return (
              <div className="eras-pair" key={p.era} data-era={p.era}>
                <span className="eras-pairname">{o.label.replace(/ \(.*\)/, '')}</span>
                <span className="eras-pairnums">
                  {o.avg.toFixed(1)} <span className="eras-arrow">&rarr;</span>{' '}
                  {t.avg.toFixed(1)}
                </span>
                <b className="eras-gain">+{(t.avg - o.avg).toFixed(1)}</b>
              </div>
            )
          })}
        </div>
      </div>

      <div className="eras-controls">
        <p className="eras-note-text">
          reputation and Lover sit at the top and neither has a re-recording, so the two
          most popular albums are absent from the comparison the rest of the chart is
          making.
        </p>
        <button type="button" className="eras-replay" onClick={replay}>
          Replay
        </button>
      </div>

      <p className="eras-foot">
        Mean of the per-track Spotify popularity score within each album, across the
        530-track export. Popularity is Spotify&rsquo;s own measure and is recalculated
        continuously, so it reflects how much an album is played now rather than how it was
        received on release. That matters for the re-recordings, which arrived with an
        audience already waiting.
      </p>
    </figure>
  )
}
