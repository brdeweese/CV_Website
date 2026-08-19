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

      badge.classList.add('is-ready')

      const rest = `translate(${c.x}px, ${c.y}px)`

      if (!animate || reduced || typeof badge.animate !== 'function') {
        badge.style.transform = rest
        hasFlown.current = true
        return
      }

      // Arc height scales with how far each hop travels.
      const hop1 = Math.max(46, Math.abs(b.x - a.x) * 0.22)
      const hop2 = Math.max(38, Math.abs(c.x - b.x) * 0.26)

      badge.style.transform = rest
      flight = badge.animate(
        [
          { transform: `translate(${a.x}px, ${a.y}px) scale(1) rotate(0deg)`, offset: 0 },
          // squash against the a
          {
            transform: `translate(${a.x}px, ${a.y + 4}px) scale(1.22, 0.8) rotate(-6deg)`,
            offset: 0.08,
          },
          // up and over
          {
            transform: `translate(${(a.x + b.x) / 2}px, ${Math.min(a.y, b.y) - hop1}px) scale(0.94, 1.1) rotate(12deg)`,
            offset: 0.3,
          },
          // squash against the e
          {
            transform: `translate(${b.x}px, ${b.y + 4}px) scale(1.24, 0.78) rotate(6deg)`,
            offset: 0.52,
          },
          // second arc
          {
            transform: `translate(${(b.x + c.x) / 2}px, ${Math.min(b.y, c.y) - hop2}px) scale(0.96, 1.08) rotate(-8deg)`,
            offset: 0.72,
          },
          // dip just past the resting place
          {
            transform: `translate(${c.x}px, ${c.y + 10}px) scale(1.08, 0.92) rotate(3deg)`,
            offset: 0.88,
          },
          { transform: rest, offset: 1 },
        ],
        {
          duration: 1850,
          delay: 620,
          easing: 'cubic-bezier(0.4, 0.1, 0.35, 1)',
          fill: 'backwards',
        },
      )
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
