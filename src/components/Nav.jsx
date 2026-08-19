import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { sections, visibleProjects } from '../data/cv.js'
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

function Caret() {
  return (
    <svg className="nav-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Nav() {
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const closeTimer = useRef(0)
  const onHome = pathname === '/'

  // Escape closes whichever menu is showing; route changes close both.
  useEffect(() => {
    if (!menuOpen && !projectsOpen) return undefined
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      setProjectsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, projectsOpen])

  useEffect(() => {
    setMenuOpen(false)
    setProjectsOpen(false)
  }, [pathname])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  // A short grace period on leaving, so clipping the corner of the trigger on
  // the way to the menu does not snap it shut.
  function openProjects() {
    window.clearTimeout(closeTimer.current)
    setProjectsOpen(true)
  }
  function closeProjects() {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setProjectsOpen(false), 140)
  }

  // On the home page, scroll. On a detail page, route home first and let
  // Home's hash handler take it from there.
  function goToSection(event, id) {
    event.preventDefault()
    setMenuOpen(false)
    setProjectsOpen(false)
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
          {sections.map((s) =>
            s.id === 'projects' ? (
              <div
                key={s.id}
                className="nav-item nav-item--menu"
                onMouseEnter={openProjects}
                onMouseLeave={closeProjects}
                // onFocus/onBlur bubble in React, so tabbing into either the
                // trigger or the list keeps the menu open for keyboard users.
                onFocus={openProjects}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) closeProjects()
                }}
              >
                <a
                  className="nav-link nav-link--menu"
                  href={`/#${s.id}`}
                  onClick={(e) => goToSection(e, s.id)}
                  aria-expanded={projectsOpen}
                  aria-haspopup="true"
                >
                  {s.label}
                  <Caret />
                </a>

                <div className="nav-dropdown" hidden={!projectsOpen}>
                  <span className="nav-dropdown-head">Explore in depth</span>
                  {visibleProjects.map((p) => (
                    <Link
                      className="nav-dropdown-item"
                      to={`/projects/${p.slug}`}
                      key={p.slug}
                      onClick={() => setProjectsOpen(false)}
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={s.id}
                className="nav-link"
                href={`/#${s.id}`}
                onClick={(e) => goToSection(e, s.id)}
              >
                {s.label}
              </a>
            ),
          )}

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
            <div key={s.id}>
              <a
                className="nav-drawer-link"
                href={`/#${s.id}`}
                onClick={(e) => goToSection(e, s.id)}
              >
                <span className="section-num">{s.number}</span>
                {s.label}
              </a>

              {/* There is no hover on a touch screen, so the projects are
                  listed outright in the drawer rather than behind one. */}
              {s.id === 'projects' && (
                <div className="nav-drawer-sub">
                  {visibleProjects.map((p) => (
                    <Link
                      className="nav-drawer-sub-link"
                      to={`/projects/${p.slug}`}
                      key={p.slug}
                      onClick={() => setMenuOpen(false)}
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
