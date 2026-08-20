import { useCallback, useEffect, useRef, useState } from 'react'
import { ALBUMS, PAIRS } from '../data/projects/erasAlbums.js'

/**
 * Average Spotify popularity per album, each bar played out of an instrument.
 *
 * The instrument is not decoration. A microphone marks a re-recording and a
 * guitar an original release, which is the comparison the analysis is actually
 * about, so that distinction is carried by shape and survives colourblindness
 * and a greyscale print. Read the shapes alone and the finding is already
 * there: every microphone sits above the guitar of the album it replaced.
 *
 * Colour is the album's own era. Fourteen hues cannot be validated as a
 * categorical set, and are not asked to be: every bar is named on the axis, so
 * the colour says which era a bar belongs to rather than carrying the reading.
 * Each is checked for contrast against both surfaces, which is the requirement
 * that does apply to a filled mark this size.
 */

const VB = { w: 1000, h: 660 }
const PAD = { left: 210, top: 96, right: 96 }
const ROW = 38
const BAR_H = 21
const SCALE_MAX = 90 // headroom above the top album's 82.93
const FULL = VB.w - PAD.left - PAD.right

const GROW_MS = 620
const STAGGER = 120
const LEAD_MS = 400

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const ease = (t) => 1 - (1 - t) ** 3

const rowY = (i) => PAD.top + i * ROW
const barW = (v) => (v / SCALE_MAX) * FULL

/** Handheld microphone, upright, sitting on the baseline. */
function Mic() {
  return (
    <g className="eras-inst">
      <path d="M0 -15 a6.4 6.4 0 0 1 6.4 6.4 v4.6 a6.4 6.4 0 0 1 -12.8 0 v-4.6 A6.4 6.4 0 0 1 0 -15 Z" />
      <path d="M-9.4 -4.2 a9.4 9.4 0 0 0 18.8 0 h-3.1 a6.3 6.3 0 0 1 -12.6 0 Z" />
      <rect x="-1.7" y="5" width="3.4" height="7.4" />
      <rect x="-5.4" y="12" width="10.8" height="2.8" rx="1.4" />
    </g>
  )
}

/** Acoustic guitar, upright. The soundhole is painted in the card colour
    rather than cut, because a hole would show the bar through it. */
function Guitar() {
  return (
    <g className="eras-inst">
      <circle cx="0" cy="6.6" r="8.2" />
      <circle cx="0" cy="-3" r="6" />
      <rect x="-2.6" y="-3" width="5.2" height="10" />
      <rect x="-1.7" y="-16" width="3.4" height="9" />
      <rect x="-3.3" y="-20.4" width="6.6" height="5" rx="1.2" />
      <circle className="eras-soundhole" cx="0" cy="3.4" r="2.5" />
    </g>
  )
}

export default function ErasBars() {
  const [shown, setShown] = useState(0)
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
      setShown(ALBUMS.length)
      setProgress(1)
      return undefined
    }
    setShown(0)
    setProgress(0)

    let raf = 0
    const play = (i) => {
      if (i >= ALBUMS.length) return
      setShown(i + 1)
      let settled = false
      const t0 = performance.now()
      const finish = () => {
        if (settled) return
        settled = true
        setProgress(1)
        timers.current.push(setTimeout(() => play(i + 1), 0))
      }
      const tick = (now) => {
        const p = clamp01((now - t0) / GROW_MS)
        setProgress(p)
        if (p < 1) raf = requestAnimationFrame(tick)
        else finish()
      }
      setProgress(0)
      raf = requestAnimationFrame(tick)
      /* rAF does not run in every embedded browser and is throttled to nothing
         in a background tab; without this no bar ever plays. */
      timers.current.push(setTimeout(finish, STAGGER))
    }
    timers.current.push(setTimeout(() => play(0), LEAD_MS))
    return () => {
      cancelAnimationFrame(raf)
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [reduced, runId])

  const replay = useCallback(() => setRunId((n) => n + 1), [])

  const growth = (i) => {
    if (i < shown - 1) return 1
    if (i === shown - 1) return ease(progress)
    return 0
  }

  const ticks = [0, 20, 40, 60, 80]

  return (
    <figure className="eras">
      <figcaption className="eras-head">
        <h3 className="eras-title">Average track popularity, by album</h3>
        <p className="eras-sub">
          Every bar plays out of its instrument: a microphone for a re-recording, a guitar
          for an original release. Length is the mean Spotify popularity score of the
          album&rsquo;s tracks, and the colour is the album&rsquo;s own era. Read the
          instruments alone and the finding is already there, because every microphone sits
          above the guitar of the album it replaced.
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
            const g = growth(i)
            const w = barW(a.avg) * g
            const isHover = hover === a.id
            return (
              <g
                key={a.id}
                className="eras-row"
                data-era={a.era}
                data-hover={isHover ? 'true' : undefined}
                onMouseEnter={() => setHover(a.id)}
                onMouseLeave={() => setHover(null)}
              >
                <rect className="eras-hit" x={0} y={y - 6} width={VB.w} height={ROW} />

                <text
                  className="eras-name"
                  x={PAD.left - 52}
                  y={y + BAR_H / 2 + 4}
                  textAnchor="end"
                >
                  {a.label}
                </text>

                <g transform={`translate(${PAD.left - 26} ${y + BAR_H / 2}) scale(0.92)`}>
                  {a.tv ? <Mic /> : <Guitar />}
                </g>

                <rect
                  className="eras-bar"
                  x={PAD.left}
                  y={y}
                  width={w}
                  height={BAR_H}
                  rx="3"
                />

                {g > 0.94 && (
                  <text className="eras-value" x={PAD.left + w + 10} y={y + BAR_H / 2 + 4}>
                    {a.avg.toFixed(1)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="eras-legend">
        <div className="eras-key">
          <svg viewBox="-16 -22 32 40" className="eras-key-icon" aria-hidden="true">
            <Mic />
          </svg>
          <p className="eras-key-text">
            <b>Microphone</b>
            Taylor&rsquo;s Version, re-recorded
          </p>
        </div>
        <div className="eras-key">
          <svg viewBox="-16 -22 32 40" className="eras-key-icon" aria-hidden="true">
            <Guitar />
          </svg>
          <p className="eras-key-text">
            <b>Guitar</b>
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
        <p className="eras-note">
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
