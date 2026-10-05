import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GAME_ART } from './gameArt.jsx'

/**
 * The invitation to go and play the activities.
 *
 * The drawings sit in a fanned stack, like a hand of cards mid-deal, and one at
 * a time lifts to the front. It keeps moving on its own so the panel reads as
 * something to press rather than another line of text, and it only runs while
 * it is on screen. Hovering spreads the fan.
 *
 * The same panel goes on the home page and on the project page, so the two
 * cannot drift apart.
 */

const STEP_MS = 1900

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

/* Counted from the list rather than written down, so adding an activity cannot
   leave the label saying six. */
const countWord = (n) => WORDS[n] ?? String(n)
const sentence = (s) => s[0].toUpperCase() + s.slice(1)

/* The arc keeps the same width however many cards are in it, so the outer cards
   never lean far enough to bleed past the fan. The widths are in the stylesheet,
   picked by the card count. */
const ARC_DEG = 32.5

export default function PlayCta({
  eyebrow = `${sentence(countWord(GAME_ART.length))} activities`,
}) {
  const [front, setFront] = useState(0)
  const [live, setLive] = useState(false)
  const hostRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setLive(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => setLive(entries.some((e) => e.isIntersecting)),
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    clearTimeout(timer.current)
    if (!live) return
    /* A panel that deals itself forever is what this preference is for, so the
       fan simply sits there instead. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    timer.current = setTimeout(() => setFront((f) => (f + 1) % GAME_ART.length), STEP_MS)
    return () => clearTimeout(timer.current)
  }, [live, front])

  useEffect(() => () => clearTimeout(timer.current), [])

  const n = GAME_ART.length
  const mid = (n - 1) / 2
  const rotStep = ARC_DEG / Math.max(1, n - 1)

  return (
    <Link className="playcta" to="/games" ref={hostRef}>
      <span className="playcta-copy">
        <span className="playcta-eyebrow">{eyebrow}</span>
        <span className="playcta-title">Play the activities</span>
        <span className="playcta-line">
          A few of the games I bring in to the classroom, playable here.
        </span>
        <span className="playcta-go">
          Play them <span aria-hidden="true">→</span>
        </span>
      </span>

      {/* How many cards there are decides how wide each one may be, and the
          stylesheet holds a width per count. */}
      <span className="playcta-fan" aria-hidden="true" data-n={n}>
        {GAME_ART.map(({ id, name, Art }, i) => {
          /* Fanned around the middle of the stack, with whichever card is
             taking its turn pulled upright and to the top. */
          const offset = i - mid
          const isFront = i === front
          return (
            <span
              className="playcta-card"
              key={id}
              data-front={isFront ? 'true' : undefined}
              style={{
                '--i': offset,
                '--fan-r': `${(offset * rotStep).toFixed(2)}deg`,
                zIndex: isFront ? n + 1 : n - Math.abs(offset),
              }}
            >
              <span className="playcta-art">
                <Art />
              </span>
              <span className="playcta-name">{name}</span>
            </span>
          )
        })}
      </span>
    </Link>
  )
}
