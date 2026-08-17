import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { sections } from '../data/cv.js'
import { useTheme } from '../hooks/useTheme.js'

function ThemeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MenuIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  )
}

export default function Nav() {
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const onHome = pathname === '/'

  // Close the mobile menu on Escape, and whenever the route changes.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => setMenuOpen(false), [pathname])

  // On the home page, scroll. On a detail page, route home first and let
  // Home's hash handler take it from there.
  function goToSection(event, id) {
    event.preventDefault()
    setMenuOpen(false)
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', `#${id}`)
    } else {
      navigate(`/#${id}`)
    }
  }

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link to="/" className="nav-brand">
          Brina DeWeese<span>, MSc</span>
        </Link>

        <nav className="nav-links" aria-label="Sections">
          {sections.map((s) => (
            <a
              key={s.id}
              className="nav-link"
              href={`/#${s.id}`}
              onClick={(e) => goToSection(e, s.id)}
            >
              {s.label}
            </a>
          ))}

          <button
            className="theme-toggle"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title="Toggle theme"
          >
            <ThemeIcon />
          </button>

          <button
            className="theme-toggle nav-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </nav>
      </div>

      <div className={`nav-drawer${menuOpen ? ' is-open' : ''}`} id="mobile-menu" hidden={!menuOpen}>
        <div className="wrap">
          {sections.map((s) => (
            <a
              key={s.id}
              className="nav-drawer-link"
              href={`/#${s.id}`}
              onClick={(e) => goToSection(e, s.id)}
            >
              <span className="section-num">{s.number}</span>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
