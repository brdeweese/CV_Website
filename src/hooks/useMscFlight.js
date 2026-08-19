import { useEffect, useRef } from 'react'

/**
 * Sends the "MSc" badge bouncing off the name and into the centre of the
 * rotating diagram, where all four circles overlap.
 *
 * Distances are measured rather than hard-coded, because how far the badge has
 * to travel depends entirely on the viewport width. The badge is absolutely
 * positioned onto the spot where it would have sat inline (via a zero-width
 * anchor left in the heading), then transformed to the target.
 *
 * It animates once. Later resizes just snap it to the new resting place rather
 * than replaying, which would be distracting while someone drags a window.
 * Reduced-motion users get it placed instantly with no flight.
 */
export function useMscFlight({ enabled = true } = {}) {
  const hostRef = useRef(null)
  const anchorRef = useRef(null)
  const badgeRef = useRef(null)
  const targetRef = useRef(null)
  const hasFlown = useRef(false)

  useEffect(() => {
    const host = hostRef.current
    const anchor = anchorRef.current
    const badge = badgeRef.current
    const target = targetRef.current
    if (!host || !anchor || !badge || !target) return undefined

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0

    function place(animate) {
      // Below the breakpoint the diagram is hidden, so there is nothing to fly to.
      // CSS parks the badge beside the name; leave it alone.
      const targetBox = target.getBoundingClientRect()
      if (targetBox.width === 0 || targetBox.height === 0) {
        badge.classList.add('is-ready')
        return
      }

      // Park the badge where it would have sat inline, then measure from there.
      badge.style.transform = 'none'
      const hostRect = host.getBoundingClientRect()
      const anchorRect = anchor.getBoundingClientRect()
      badge.style.left = `${anchorRect.left - hostRect.left}px`
      badge.style.top = `${anchorRect.top - hostRect.top}px`

      const badgeRect = badge.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const dx =
        targetRect.left + targetRect.width / 2 - (badgeRect.left + badgeRect.width / 2)
      const dy =
        targetRect.top + targetRect.height / 2 - (badgeRect.top + badgeRect.height / 2)

      badge.classList.add('is-ready')

      const rest = `translate(${dx}px, ${dy}px)`

      if (!animate || reduced || typeof badge.animate !== 'function') {
        badge.style.transform = rest
        hasFlown.current = true
        return
      }

      badge.style.transform = rest
      badge.animate(
        [
          { transform: 'translate(0px, 0px) scale(1) rotate(0deg)', offset: 0 },
          // knocked upward off the name
          {
            transform: `translate(${dx * 0.08}px, ${dy * 0.1 - 54}px) scale(1.18) rotate(-14deg)`,
            offset: 0.2,
          },
          // arcing across
          {
            transform: `translate(${dx * 0.55}px, ${dy * 0.35 - 26}px) scale(1.06) rotate(10deg)`,
            offset: 0.48,
          },
          // drops slightly past the target
          {
            transform: `translate(${dx}px, ${dy + 16}px) scale(0.94) rotate(-6deg)`,
            offset: 0.74,
          },
          // small settle
          {
            transform: `translate(${dx}px, ${dy - 5}px) scale(1.03) rotate(2deg)`,
            offset: 0.88,
          },
          { transform: rest, offset: 1 },
        ],
        {
          duration: 1500,
          delay: 550,
          easing: 'cubic-bezier(0.34, 0.68, 0.36, 1)',
          fill: 'backwards',
        },
      )
      hasFlown.current = true
    }

    // Wait a frame so fonts and layout have settled before measuring.
    raf = requestAnimationFrame(() => place(!hasFlown.current))

    const onResize = () => place(false)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [enabled])

  return { hostRef, anchorRef, badgeRef, targetRef }
}
