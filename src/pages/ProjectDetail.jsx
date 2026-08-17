import { lazy, Suspense, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { visibleProjects } from '../data/cv.js'
import DisciplineTag from '../components/DisciplineTag.jsx'
import NotFound from './NotFound.jsx'

// Recharts is ~400 kB. Loading it lazily keeps it out of the main bundle so it
// is only fetched on a project page that actually has chart data.
const ProjectChart = lazy(() => import('../components/ProjectChart.jsx'))

export default function ProjectDetail() {
  const { slug } = useParams()
  const index = visibleProjects.findIndex((p) => p.slug === slug)
  const project = visibleProjects[index]

  useEffect(() => {
    if (project) document.title = `${project.title} — Brina DeWeese`
    return () => {
      document.title = 'Brina DeWeese — Lecturer & Data Scientist'
    }
  }, [project])

  if (!project) return <NotFound />

  const prev = visibleProjects[index - 1]
  const next = visibleProjects[index + 1]

  return (
    <main className="detail" id="main">
      <div className="wrap" data-discipline={project.discipline}>
        <Link className="back-link" to="/#projects">
          <span aria-hidden="true">←</span> All projects
        </Link>

        <div className="detail-eyebrow">
          <DisciplineTag id={project.discipline} />
          <span className="mono">{project.kind}</span>
          {project.year && <span className="mono">{project.year}</span>}
        </div>

        <h1 className="detail-title">{project.title}</h1>
        {project.subtitle && <p className="detail-sub">{project.subtitle}</p>}

        <div className="detail-rule" />

        <div className="detail-grid">
          <div className="detail-body">
            {project.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {project.chart?.data?.length > 0 && (
              <Suspense fallback={null}>
                <ProjectChart chart={project.chart} />
              </Suspense>
            )}
          </div>

          <aside className="aside-box">
            {project.methods?.length > 0 && (
              <div>
                <h2 className="sub-head" style={{ marginBottom: '0.9rem' }}>
                  Methods & tools
                </h2>
                <div className="tags">
                  {project.methods.map((m) => (
                    <span className="tag" key={m}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.links?.length > 0 && (
              <div>
                <h2 className="sub-head" style={{ marginBottom: '0.9rem' }}>
                  Read it
                </h2>
                <div className="detail-links">
                  {project.links.map((l) =>
                    l.internal ? (
                      <Link className="detail-link" to={`/${l.href}`} key={l.href}>
                        {l.label} <span aria-hidden="true">→</span>
                      </Link>
                    ) : (
                      <a
                        className="detail-link"
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        key={l.href}
                      >
                        {l.label} <span aria-hidden="true">↗</span>
                      </a>
                    ),
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>

        <nav className="detail-nav" aria-label="Other projects">
          {prev ? (
            <Link className="back-link" style={{ margin: 0 }} to={`/projects/${prev.slug}`}>
              <span aria-hidden="true">←</span> {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link className="back-link" style={{ margin: 0 }} to={`/projects/${next.slug}`}>
              {next.title} <span aria-hidden="true">→</span>
            </Link>
          )}
        </nav>
      </div>
    </main>
  )
}
