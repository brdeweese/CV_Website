import { useEffect } from 'react'

/**
 * Adds `.is-visible` to every `.reveal` element as it scrolls into view.
 * If the visitor prefers reduced motion, everything is revealed immediately
 * (the CSS already neutralises the transform in that case).
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal:not(.is-visible)')
    if (!nodes.length) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    )

    nodes.forEach((n) => observer.observe(n))

    // Failsafe: if anything is still hidden well after load (an observer that
    // never fires, a browser quirk), show it. A CV must never render blank.
    const failsafe = window.setTimeout(() => {
      document
        .querySelectorAll('.reveal:not(.is-visible)')
        .forEach((n) => n.classList.add('is-visible'))
    }, 4000)

    return () => {
      observer.disconnect()
      window.clearTimeout(failsafe)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
