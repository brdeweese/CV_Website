import { useCallback, useEffect, useState } from 'react'

const KEY = 'cv-theme'

/**
 * Theme is tri-state: 'light', 'dark', or null meaning "follow the OS".
 * Only an explicit choice stamps data-theme on <html>; the CSS handles the
 * unstamped case through prefers-color-scheme.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage === 'undefined') return null
    const saved = localStorage.getItem(KEY)
    return saved === 'light' || saved === 'dark' ? saved : null
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme) {
      root.setAttribute('data-theme', theme)
      localStorage.setItem(KEY, theme)
    } else {
      root.removeAttribute('data-theme')
      localStorage.removeItem(KEY)
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => {
      if (current) return current === 'dark' ? 'light' : 'dark'
      // No explicit choice yet: flip away from whatever the OS is showing.
      const osDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return osDark ? 'light' : 'dark'
    })
  }, [])

  return { theme, toggle }
}
