/**
 * EXAMPLE DATA. NONE OF THIS IS REAL.
 *
 * Module evaluation returns are confidential to the institution, so every
 * comment, count and theme below is invented for this page. What is real is the
 * shape: open text arrives, most of it is blank or "D/A", what remains is
 * classified for sentiment and theme, and a recap meeting sees the summary
 * rather than the raw returns.
 *
 * Nothing here should ever be replaced with actual feedback.
 */

export const SENTIMENTS = [
  { id: 'positive', label: 'Positive' },
  { id: 'mixed', label: 'Mixed' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'negative', label: 'Negative' },
]

export const THEMES = [
  { id: 'teaching', label: 'Teaching and support' },
  { id: 'content', label: 'Content and materials' },
  { id: 'workload', label: 'Workload and time' },
  { id: 'clarity', label: 'Assessment clarity' },
  { id: 'systems', label: 'Systems and tools' },
]

/**
 * Thirty-six invented returns. Half of them carry no comment, which is the
 * shape the classifier has to deal with: a good part of the work is deciding
 * what is not a comment at all.
 */
export const RETURNS = [
  {
    t: 'The lecturer explained everything clearly and was always happy to help.',
    s: 'positive',
    th: 'teaching',
  },
  { t: 'D/A' },
  { t: 'Too much content packed into too few weeks.', s: 'negative', th: 'workload' },
  { t: 'n/a' },
  {
    t: 'I enjoyed the group project and learned a lot about the industry.',
    s: 'positive',
    th: 'content',
  },
  { t: '-' },
  { t: 'Great teaching, but the workload was unmanageable.', s: 'mixed', th: 'workload' },
  { t: 'D/A' },
  {
    t: 'The assignment guide was genuinely useful. I wish other modules had one.',
    s: 'positive',
    th: 'clarity',
  },
  { t: 'D/A' },
  {
    t: 'I was never sure what the assignment actually wanted.',
    s: 'negative',
    th: 'clarity',
  },
  { t: 'na' },
  { t: 'Good balance of theory and practical work.', s: 'positive', th: 'content' },
  { t: 'D/A' },
  { t: 'It was fine.', s: 'neutral', th: 'content' },
  { t: 'D/A' },
  { t: 'The case studies made the theory make sense.', s: 'positive', th: 'content' },
  { t: '.' },
  {
    t: 'The submission tool was confusing and I lost a draft.',
    s: 'negative',
    th: 'systems',
  },
  { t: 'D/A' },
  { t: 'I feel much more confident presenting now.', s: 'positive', th: 'teaching' },
  { t: 'D/A' },
  {
    t: 'Interesting content, though the gap to the deadline was too tight.',
    s: 'mixed',
    th: 'workload',
  },
  { t: 'n/a' },
  { t: 'Really supportive teaching. Thank you.', s: 'positive', th: 'teaching' },
  { t: 'D/A' },
  { t: 'No strong feelings either way.', s: 'neutral', th: 'content' },
  { t: 'D/A' },
  { t: 'Clear slides and helpful worked examples.', s: 'positive', th: 'content' },
  { t: '-' },
  {
    t: 'Tutors were approachable and answered questions quickly.',
    s: 'positive',
    th: 'teaching',
  },
  { t: 'D/A' },
  {
    t: 'The reading list was far longer than the time allowed for it.',
    s: 'negative',
    th: 'workload',
  },
  { t: 'D/A' },
  { t: 'Best module of the year so far.', s: 'positive', th: 'teaching' },
  { t: 'D/A' },
]

/** The recap slide's headline, worked out from the returns above. */
export const FUNNEL = (() => {
  const withText = RETURNS.filter((r) => r.s)
  return {
    returns: RETURNS.length,
    withText: withText.length,
    blank: RETURNS.length - withText.length,
  }
})()

export const NOTE =
  'Example data. Real module evaluations are confidential to the institution, so every comment and figure here is invented. Only the shape of the output is real.'

/* ---- Outcomes against KPI, also invented ---------------------------------
 *
 * The recap meeting opens with how the module did before it gets to what
 * students wrote. Same rule as above: none of this is real. Campuses are
 * lettered rather than named so no figure can be read as any real site's
 * performance. The numbers are a healthy cohort: three of the four headline
 * figures meet target and one falls just short, with a single group clearly
 * behind. Attendance nudges the outcomes without determining them (r = 0.50
 * against submission, 0.68 against pass), which is the shape a real cohort has.
 */

export const KPI_TARGETS = { sub: 90, pass: 85, mark: 60, att: 85 }

export const KPI_COLUMNS = [
  { id: 'sub', label: 'First submission', short: 'Submission', unit: '%' },
  { id: 'pass', label: 'First-attempt pass', short: 'Pass', unit: '%' },
  { id: 'mark', label: 'Average mark', short: 'Avg mark', unit: '' },
  { id: 'att', label: 'Attendance', short: 'Attendance', unit: '%' },
]

export const GROUPS = [
  { campus: 'Campus A', group: 'A1', students: 28, sub: 88, pass: 86, mark: 59, att: 97 },
  { campus: 'Campus A', group: 'A2', students: 57, sub: 80, pass: 79, mark: 61, att: 78 },
  { campus: 'Campus A', group: 'C1', students: 36, sub: 91, pass: 90, mark: 62, att: 90 },
  { campus: 'Campus B', group: 'B1', students: 33, sub: 99, pass: 89, mark: 61, att: 88 },
  { campus: 'Campus B', group: 'B2', students: 43, sub: 99, pass: 91, mark: 66, att: 97 },
  { campus: 'Campus C', group: 'C1', students: 32, sub: 86, pass: 78, mark: 65, att: 88 },
  { campus: 'Campus C', group: 'E1', students: 54, sub: 97, pass: 87, mark: 57, att: 83 },
  { campus: 'Campus C', group: 'K1', students: 22, sub: 98, pass: 81, mark: 63, att: 86 },
  { campus: 'Campus D', group: 'B1', students: 46, sub: 78, pass: 64, mark: 58, att: 65 },
  { campus: 'Campus D', group: 'E1', students: 56, sub: 83, pass: 76, mark: 58, att: 87 },
  { campus: 'Campus E', group: 'E1', students: 51, sub: 88, pass: 87, mark: 63, att: 83 },
  { campus: 'Campus E', group: 'K1', students: 40, sub: 97, pass: 90, mark: 62, att: 80 },
]

/**
 * How far a figure is from its target, as one of four bands.
 *
 * Met, then within five, then more than five below, then more than ten. The
 * three below-target bands run pale yellow to dark red, which is a ramp, and
 * meeting the target is green with a tick beside it so it never depends on the
 * colour alone. The four fills were chosen for the widest separation under
 * colour-vision deficiency that still holds text above 7:1 (worst pair 10.3 in
 * light, 7.0 in dark).
 */
export function kpiBand(value, target) {
  if (value >= target) return 'met'
  if (value >= target - 5) return 'close'
  if (value >= target - 10) return 'below'
  return 'far'
}

export const KPI_BANDS = [
  { id: 'met', label: 'Met the target' },
  { id: 'close', label: 'Within 5' },
  { id: 'below', label: 'More than 5 below' },
  { id: 'far', label: 'More than 10 below' },
]

/** The module-average row the recap opens on. */
export const KPI_AVERAGES = KPI_COLUMNS.map((c) => ({
  ...c,
  value: Math.round(GROUPS.reduce((s, g) => s + g[c.id], 0) / GROUPS.length),
  target: KPI_TARGETS[c.id],
}))
