import { useEffect, useRef } from 'react'

/**
 * Bounces the "MSc" badge off the a in Brina, then off the e in DeWeese, and
 * settles it in the empty space above the closing "eese".
 *
 * That resting place needs the x-height of the type, not the line box: "eese"
 * is four x-height letters, so there is real space above them and nothing to
 * collide with. The line box top is nowhere near it, so the position is derived
 * from two exact measurements instead of a guess:
 *   - a zero-height inline probe sitting on the baseline gives the baseline y
 *   - canvas measureText gives the true x-height for the rendered font
 * The badge is then parked a small gap above baseline minus x-height.
 *
 * Distances are measured at runtime because they depend on viewport width. It
 * flies once; later resizes snap it to the new spot rather than replaying.
 */
export function useMscFlight() {
  const hostRef = useRef(null)
  const badgeRef = useRef(null)
  const fromRef = useRef(null) // the a in Brina
  const viaRef = useRef(null) // the e in DeWeese
  const toRef = useRef(null) // the eese
  const baselineRef = useRef(null) // probe sitting on the baseline of eese
  const hasFlown = useRef(false)

  useEffect(() => {
    const host = hostRef.current
    const badge = badgeRef.current
    const from = fromRef.current
    const via = viaRef.current
    const to = toRef.current
    const probe = baselineRef.current
    if (!host || !badge || !from || !via || !to || !probe) return undefined

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let settle = 0
    let flight = null

    function xHeightOf(el) {
      try {
        const cs = getComputedStyle(el)
        const ctx = document.createElement('canvas').getContext('2d')
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
        const m = ctx.measureText('e')
        if (m.actualBoundingBoxAscent) return m.actualBoundingBoxAscent
      } catch {
        /* fall through */
      }
      // Reasonable fallback: x-height is about 0.48em in most serif faces.
      return parseFloat(getComputedStyle(el).fontSize) * 0.48
    }

    function place(animate) {
      if (flight) {
        flight.cancel()
        flight = null
      }
      badge.style.transform = 'none'

      const hostRect = host.getBoundingClientRect()
      const fromRect = from.getBoundingClientRect()

      // Park the badge centred over the a, just above it.
      badge.style.left = `${fromRect.left - hostRect.left}px`
      badge.style.top = `${fromRect.top - hostRect.top}px`

      const badgeRect = badge.getBoundingClientRect()
      const bw = badgeRect.width
      const bh = badgeRect.height
      const originX = badgeRect.left + bw / 2
      const originY = badgeRect.top + bh / 2

      // Point 1: the a in Brina, upper half of the glyph.
      const p0x = fromRect.left + fromRect.width / 2
      const p0y = fromRect.top + fromRect.height * 0.42

      // Point 2: the e in DeWeese.
      const viaRect = via.getBoundingClientRect()
      const p1x = viaRect.left + viaRect.width / 2
      const p1y = viaRect.top + viaRect.height * 0.42

      // Point 3: centred over "eese", sitting above its x-height.
      const toRect = to.getBoundingClientRect()
      const baselineY = probe.getBoundingClientRect().top
      const glyphTop = baselineY - xHeightOf(to)
      const p2x = toRect.left + toRect.width / 2
      const p2y = glyphTop - bh / 2 - Math.max(6, bh * 0.35)

      const d = (x, y) => ({ x: x - originX, y: y - originY })
      const a = d(p0x, p0y)
      const b = d(p1x, p1y)
      const c = d(p2x, p2y)

      const rest = `translate(${c.x}px, ${c.y}px)`

      if (!animate || reduced || typeof badge.animate !== 'function') {
        badge.style.transform = rest
        // Only reveal here if the flight has already happened (or was never
        // going to). Revealing during the pre-flight measuring pass is what
        // made the badge appear at its destination and never bounce, because
        // it also marked the flight as done.
        if (hasFlown.current || reduced || typeof badge.animate !== 'function') {
          badge.classList.add('is-ready')
          hasFlown.current = true
        }
        return
      }

      // Park it ON THE FIRST LETTER and reveal it there. Setting the resting
      // transform first made the badge appear already arrived, then snap back
      // to the start when the animation began, which read as a glitch rather
      // than a bounce.
      // Enter from above the top of the window rather than just above the
      // letter, so it genuinely falls into frame. originY is where the badge
      // sits parked on the a, so this puts its centre past the top edge.
      const entryY = -(originY + bh + 48)
      badge.style.transform = `translate(${a.x}px, ${entryY}px)`
      badge.classList.add('is-ready')

      // Arcs are generous on purpose. Against type this large, a shallow arc
      // reads as a slide rather than a bounce.
      const hop1 = Math.max(96, Math.abs(b.x - a.x) * 0.34)
      const hop2 = Math.max(84, Math.abs(c.x - b.x) * 0.3)
      const apex1 = Math.min(a.y, b.y) - hop1
      const apex2 = Math.min(b.y, c.y) - hop2

      const FALL = 'cubic-bezier(0.45, 0, 1, 1)' // accelerating into a letter
      const RISE = 'cubic-bezier(0, 0, 0.32, 1)' // decelerating off it

      flight = badge.animate(
        [
          // dropping in
          {
            transform: `translate(${a.x}px, ${entryY}px) scale(0.82, 1.3) rotate(-6deg)`,
            offset: 0,
            easing: FALL,
          },
          // first strike, on the a
          {
            transform: `translate(${a.x}px, ${a.y}px) scale(1.34, 0.68) rotate(0deg)`,
            offset: 0.28,
            easing: RISE,
          },
          {
            transform: `translate(${(a.x + b.x) / 2}px, ${apex1}px) scale(0.9, 1.16) rotate(14deg)`,
            offset: 0.44,
            easing: FALL,
          },
          // second strike, on the e
          {
            transform: `translate(${b.x}px, ${b.y}px) scale(1.34, 0.68) rotate(0deg)`,
            offset: 0.61,
            easing: RISE,
          },
          {
            transform: `translate(${(b.x + c.x) / 2}px, ${apex2}px) scale(0.92, 1.14) rotate(-12deg)`,
            offset: 0.76,
            easing: FALL,
          },
          // touchdown at the resting place
          {
            transform: `translate(${c.x}px, ${c.y}px) scale(1.26, 0.76) rotate(0deg)`,
            offset: 0.89,
            easing: RISE,
          },
          // one small hop to settle
          {
            transform: `translate(${c.x}px, ${c.y - 16}px) scale(0.96, 1.07) rotate(3deg)`,
            offset: 0.95,
            easing: FALL,
          },
          { transform: rest + ' scale(1, 1) rotate(0deg)', offset: 1 },
        ],
        {
          duration: 2600,
          delay: 500,
          fill: 'both',
        },
      )

      // Commit the final position so nothing depends on the animation being
      // retained afterwards.
      flight.onfinish = () => {
        badge.style.transform = rest
      }

      hasFlown.current = true
    }

    // The heading reflows once after first paint as the serif resolves, which
    // moves the landing spot. Measuring once was not enough: it left the badge
    // sitting well above the letters. So position immediately (still invisible),
    // then re-measure and launch once the layout has settled.
    const start = () => {
      raf = requestAnimationFrame(() => {
        place(false)
        settle = window.setTimeout(() => place(!hasFlown.current), 240)
      })
    }
    if (document.fonts?.ready) {
      document.fonts.ready.then(start).catch(start)
    } else {
      start()
    }

    // Catch any later reflow of the heading. Skipped mid-flight so a stray
    // callback cannot cancel the animation halfway through.
    let observer = null
    const heading = to.closest('h1')
    if (heading && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        if (flight && flight.playState === 'running') return
        if (!hasFlown.current) return
        place(false)
      })
      observer.observe(heading)
    }

    const onResize = () => place(false)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(settle)
      observer?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return { hostRef, badgeRef, fromRef, viaRef, toRef, baselineRef }
}
