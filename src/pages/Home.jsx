import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  awards,
  certifications,
  disciplines,
  education,
  experience,
  metrics,
  profile,
  sections,
  skills,
  teaching,
  visibleProjects,
} from '../data/cv.js'
import { useReveal } from '../hooks/useReveal.js'
import { formatPeriod } from '../utils/period.js'
import CareerTimeline from '../components/CareerTimeline.jsx'
import DisciplineTag from '../components/DisciplineTag.jsx'
import DisciplineVenn from '../components/DisciplineVenn.jsx'

function SectionHead({ id }) {
  const s = sections.find((x) => x.id === id)
  return (
    <div className="section-head">
      <span className="section-num">{s.number}</span>
      <h2 className="section-title">{s.label}</h2>
    </div>
  )
}

function Arrow() {
  return (
    <svg className="arw" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Home() {
  const { hash } = useLocation()
  useReveal()

  // Support /#section links arriving from a detail page.
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [hash])

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero" data-discipline="data">
        <div className="wrap hero-inner">
          <div className="hero-eyebrow">
            <span className="mono">{profile.role}</span>
            <span className="mono">/</span>
            <span className="mono">{profile.location}</span>
          </div>

          <h1 className="hero-name">
            Brina
            <br />
            DeWeese <span className="cred">MSc</span>
          </h1>

          <p className="hero-tagline">
            I lead a teaching programme across five campuses and build the data behind
            it, working where <b>economics</b>, <b>data science</b>, and <b>tourism</b>{' '}
            meet.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">
              View projects <Arrow />
            </a>
            {profile.cvUrl ? (
              <a className="btn btn-ghost" href={profile.cvUrl} target="_blank" rel="noreferrer">
                Download CV
              </a>
            ) : (
              <a className="btn btn-ghost" href="#contact">
                Get in touch
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Metrics ---------- */}
      <div className="metrics">
        {metrics.map((m) => (
          <div className="metric reveal" key={m.label} data-discipline={m.discipline}>
            <div className="metric-value">
              {m.prefix}
              {m.value}
              {m.suffix && <span className="unit">{m.suffix}</span>}
            </div>
            <div className="metric-label">{m.label}</div>
            <p className="metric-detail">{m.detail}</p>
          </div>
        ))}

        {/* Sits last so it lands beside the degrees figure, and doubles as the
            key to the discipline colours used across the rest of the page. */}
        <div className="metric metric-visual reveal">
          <DisciplineVenn />
          <p className="metric-detail" style={{ textAlign: 'center' }}>
            Economics frames the question, data science answers it, and the sector
            knowledge decides which answers matter.
          </p>
        </div>
      </div>

      <main id="main">
        {/* ---------- 01 About ---------- */}
        <section className="section" id="about">
          <div className="wrap">
            <SectionHead id="about" />
            <div className="about-grid">
              <div className="about-prose reveal">
                {profile.intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="disc-cards reveal">
                {Object.values(disciplines).map((d) => (
                  <div className="disc-card" key={d.id} data-discipline={d.id}>
                    <h3>{d.label}</h3>
                    <p>{d.blurb}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 02 Experience ---------- */}
        <section className="section" id="work">
          <div className="wrap">
            <SectionHead id="work" />
            <CareerTimeline />

            <div className="exp-list">
              {experience.map((e) => (
                <article className="exp reveal" key={e.id} data-discipline={e.discipline}>
                  <div className="exp-when">{formatPeriod(e, true)}</div>
                  <div>
                    <h3 className="exp-role">{e.role}</h3>
                    <div className="exp-org">
                      <span className="exp-org-name">{e.org}</span>
                      {e.orgNote && <span className="exp-loc">{e.orgNote}</span>}
                      <span className="exp-loc">{e.location}</span>
                      <DisciplineTag id={e.discipline} />
                    </div>
                    <p className="exp-summary">{e.summary}</p>
                    <ul className="exp-points">
                      {e.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            {/* Skills */}
            <div style={{ marginTop: 'clamp(2.5rem, 6vw, 4rem)' }}>
              <h3 className="sub-head">Technical toolkit</h3>
              <div className="skills-grid reveal">
                {skills.map((g) => (
                  <div className="skill-group" key={g.group} data-discipline={g.discipline}>
                    <h3>{g.group}</h3>
                    <div className="tags">
                      {g.items.map((item) => (
                        <span className="tag" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="certs">
                <span className="mono">Certified</span>
                {certifications.map((c) => (
                  <span className="tag" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 03 Projects ---------- */}
        <section className="section" id="projects">
          <div className="wrap">
            <SectionHead id="projects" />
            <p className="lede" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
              Applied work across econometrics, analytics, and pedagogy. Each one opens
              into a fuller write-up.
            </p>
            <div className="proj-grid">
              {visibleProjects.map((p) => (
                <Link
                  className="proj-card reveal"
                  to={`/projects/${p.slug}`}
                  key={p.slug}
                  data-discipline={p.discipline}
                >
                  <div className="proj-top">
                    <DisciplineTag id={p.discipline} />
                    <span className="mono">{p.year || p.kind}</span>
                  </div>
                  <h3 className="proj-title">{p.title}</h3>
                  <p className="proj-sub">{p.subtitle}</p>
                  <p className="proj-summary">{p.summary}</p>
                  <span className="proj-more">
                    Read more <Arrow />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 04 Teaching ---------- */}
        <section className="section" id="teaching">
          <div className="wrap">
            <SectionHead id="teaching" />
            <p className="lede" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
              Lecture activities built to make abstract material stick, using gamification,
              real academic sourcing, and data tools students can carry into work.
            </p>
            <div className="teach-grid">
              {teaching.map((t) => (
                <article className="teach-card reveal" key={t.title} data-discipline={t.discipline}>
                  <DisciplineTag id={t.discipline} />
                  <h3 className="teach-title">{t.title}</h3>
                  <p>{t.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 05 Background ---------- */}
        <section className="section" id="background">
          <div className="wrap">
            <SectionHead id="background" />
            <div className="bg-grid">
              <div className="reveal">
                <h3 className="sub-head">Education</h3>
                {education.map((e) => (
                  <div className="edu-item" key={e.id} data-discipline={e.discipline}>
                    <div className="edu-degree">{e.degree}</div>
                    {(e.org || e.start) && (
                      <div className="edu-meta">
                        {e.org}
                        {e.org && e.start ? ' · ' : ''}
                        {e.start ? `${e.start} — ${e.end ?? 'Present'}` : ''}
                      </div>
                    )}
                    {e.note && <div className="edu-note">{e.note}</div>}
                  </div>
                ))}
              </div>

              <div className="reveal">
                <h3 className="sub-head">Awards & recognition</h3>
                {awards.map((a) => (
                  <div className="award-item" key={a.title} data-discipline={a.discipline}>
                    {a.year && <div className="award-year">{a.year}</div>}
                    <div className="award-title">{a.title}</div>
                    <div className="award-detail">{a.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 06 Contact ---------- */}
        <section className="section" id="contact">
          <div className="wrap contact-inner">
            <SectionHead id="contact" />
            <p className="contact-big">
              Open to roles and collaborations in data science, economic analysis, and
              higher education.
            </p>
            <a className="contact-mail" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <div className="hero-actions">
              {profile.cvUrl && (
                <a className="btn btn-ghost" href={profile.cvUrl} target="_blank" rel="noreferrer">
                  Download CV
                </a>
              )}
              {profile.linkedin && (
                <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              )}
              {profile.github && (
                <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
