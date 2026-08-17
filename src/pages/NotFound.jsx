import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="wrap notfound" id="main">
      <span className="mono">Error 404</span>
      <h1>Page not found</h1>
      <p className="lede" style={{ marginInline: 'auto' }}>
        That page does not exist. The projects and CV are all on the home page.
      </p>
      <div>
        <Link className="btn btn-primary" to="/">
          Back to home
        </Link>
      </div>
    </main>
  )
}
