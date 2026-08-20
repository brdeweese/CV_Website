import { lazy, Suspense, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { visibleProjects } from '../data/cv.js'
import DisciplineTag from '../components/DisciplineTag.jsx'
import NotFound from './NotFound.jsx'

// Recharts is ~400 kB. Loading it lazily keeps it out of the main bundle so it
// is only fetched on a project page that actually has chart data.
const ProjectChart = lazy(() => import('../components/ProjectChart.jsx'))
const ProjectVisuals = lazy(() => import('../components/ProjectVisuals.jsx'))
// Pulls in a topojson world atlas, so it loads only on the page that uses it.
const MigrationExplorer = lazy(() => import('../components/MigrationExplorer.jsx'))

const MarketingVisuals = lazy(() => import('../components/MarketingVisuals.jsx'))
const BtcForecast = lazy(() => import('../components/BtcForecast.jsx'))
const ResilienceFork = lazy(() => import('../components/ResilienceFork.jsx'))
const CakeLayers = lazy(() => import('../components/CakeLayers.jsx'))
const ErasBars = lazy(() => import('../components/ErasBars.jsx'))

const HEROES = { migration: MigrationExplorer, marketing: MarketingVisuals, btc: BtcForecast, resilience: ResilienceFork, cake: CakeLayers, eras: ErasBars }

function Takeaways({ items }) {
  if (!items?.length) return null
  return (
    <ul className="takeaways">
      {items.map((text, i) => (
        <li className="takeaway" key={i}>
          <span className="takeaway-num">{String(i + 1).padStart(2, '0')}</span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  )
}

function Aside({ project, className = 'aside-box' }) {
  const hasMethods = project.methods?.length > 0
  const hasLinks = project.links?.length > 0
  if (!hasMethods && !hasLinks) return null

  return (
    <aside className={className}>
      {hasMethods && (
        <div>
          <h2 className="sub-head" style={{ marginBottom: '0.9rem' }}>
            Methods &amp; tools
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

      {hasLinks && (
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
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const index = visibleProjects.findIndex((p) => p.slug === slug)
  const project = visibleProjects[index]

  useEffect(() => {
    if (project) document.title = `${project.title} — Brina DeWeese`
    return () => {
      document.title = 'Brina DeWeese — Lecturer & Module Lead'
    }
  }, [project])

  if (!project) return <NotFound />

  const prev = visibleProjects[index - 1]
  const next = visibleProjects[index + 1]

  // 'visual' puts the charts at full width and leads with short takeaways
  // instead of prose, for projects where the finding is the graph.
  const isVisual = project.layout === 'visual'
  // A project can name a bespoke lead visual; it renders above the takeaways.
  const HeroVisual = project.hero ? HEROES[project.hero] : null

  // Sourcing and the headline finding. Sits under the lead visual, so the
  // graph lands first and the explanation follows it.
  const intro = project.intro?.length > 0 && (
    <div className="detail-intro">
      {project.intro.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )

  const visuals = project.visuals?.length > 0 && (
    <Suspense fallback={<div className="viz-loading">Loading charts…</div>}>
      <ProjectVisuals visuals={project.visuals} />
    </Suspense>
  )

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

        {isVisual ? (
          <>
            {HeroVisual && (
              <Suspense fallback={<div className="viz-loading">Loading…</div>}>
                <HeroVisual />
              </Suspense>
            )}
            {intro}
            <Takeaways items={project.takeaways} />
            {visuals}
            {project.body?.length > 0 && (
              <div className="detail-body detail-body--after">
                {project.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            <Aside project={project} className="aside-row" />
          </>
        ) : (
          <div className="detail-grid">
            <div className="detail-body">
              {intro}
              {project.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {visuals}
              {project.chart?.data?.length > 0 && (
                <Suspense fallback={null}>
                  <ProjectChart chart={project.chart} />
                </Suspense>
              )}
            </div>
            <Aside project={project} />
          </div>
        )}

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
