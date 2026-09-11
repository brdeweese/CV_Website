import { useEffect, useRef, useState } from 'react'

/**
 * The deck's cover slide, with the joke on it actually happening.
 *
 * The slide reads "you can't spell teach without.." above the word TEACH, with
 * a laptop standing in for the A. Here the laptop shrinks away and the letters
 * close the gap, so TEACH becomes TECH.
 *
 * The letters are laid out in a flex row rather than positioned, so closing the
 * gap needs no measuring: the A's box animates to zero width and the C and H
 * slide left on their own, at any size the panel happens to be.
 *
 * It cycles on its own, and only while it is on screen, so it is not running
 * against a panel nobody is looking at.
 */

/* How long each word sits before it turns into the other one. The transition
   itself is 0.85s, so these are the holds plus the move. */
const HOLD = { teach: 2000, tech: 2600 }

function Laptop() {
  return (
    <svg className="morph-laptop" viewBox="0 0 120 90" aria-hidden="true">
      <path className="tt-lid" d="M30 12h60a6 6 0 0 1 6 6v42H24V18a6 6 0 0 1 6-6z" />
      <rect className="tt-screen" x="34" y="22" width="52" height="30" rx="3" />
      <path className="tt-base" d="M12 60h96l8 16H4z" />
    </svg>
  )
}

export default function TeachMorph() {
  const [state, setState] = useState('teach')
  const [live, setLive] = useState(false)
  const hostRef = useRef(null)
  const timer = useRef(null)

  /* Only cycles while it is on screen, so it starts where someone can see it
     and stops once they have scrolled past. */
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setLive(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => setLive(entries.some((e) => e.isIntersecting)),
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    clearTimeout(timer.current)
    if (!live) return

    /* A slide that never stops moving is the case this preference exists for,
       so reduced motion gets the reveal once and then holds on TECH. The
       transitions are switched off in CSS for it, so that one change is a cut
       rather than a slide. */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      if (state === 'teach') {
        timer.current = setTimeout(() => setState('tech'), HOLD.teach)
      }
      return
    }

    timer.current = setTimeout(
      () => setState((s) => (s === 'teach' ? 'tech' : 'teach')),
      HOLD[state],
    )
    return () => clearTimeout(timer.current)
  }, [live, state])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div
      className="morph"
      ref={hostRef}
      data-state={state}
      role="img"
      aria-label="Title slide: you can’t spell teach without tech"
    >
      <span className="morph-kicker" aria-hidden="true">
        You can’t spell teach without..
      </span>
      <span className="morph-word" aria-hidden="true">
        <span className="morph-letter">T</span>
        <span className="morph-letter">E</span>
        <span className="morph-a">
          <Laptop />
        </span>
        <span className="morph-letter">C</span>
        <span className="morph-letter">H</span>
      </span>
    </div>
  )
}
