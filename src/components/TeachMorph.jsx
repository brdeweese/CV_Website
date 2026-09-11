import { useCallback, useEffect, useRef, useState } from 'react'

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
 */

const HOLD_MS = 1500

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
  const hostRef = useRef(null)
  const timer = useRef(null)

  /* Reduced motion still gets the reveal, because the joke is the point of the
     slide. The transitions are switched off in CSS for that preference, so the
     word cuts from one to the other instead of sliding. */
  const play = useCallback(() => {
    clearTimeout(timer.current)
    setState('teach')
    timer.current = setTimeout(() => setState('tech'), HOLD_MS)
  }, [])

  /* Runs when it comes into view, so the joke is not already over by the time
     anyone looks at it. */
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      play()
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          play()
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [play])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <button
      type="button"
      className="morph"
      ref={hostRef}
      data-state={state}
      onClick={play}
      aria-label="Title slide: you can’t spell teach without tech. Select to replay."
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
    </button>
  )
}
