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
