import { profile } from '../data/cv.js'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <span className="mono">
          © {year} {profile.name}
        </span>
        <a className="mono" href={`mailto:${profile.email}`} style={{ textDecoration: 'none' }}>
          {profile.email}
        </a>
      </div>
    </footer>
  )
}
