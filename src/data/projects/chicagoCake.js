/**
 * Forward-selection results for the Chicago study, as a cake.
 *
 * `eaten` is the adjusted R-squared of the model forward selection settled on
 * for that crime category: the share of the variation in it the selected cost
 * of living factors account for. Read off the R2 heatmap in the paper and
 * cross-checked against the OLS tables, which report adjusted values matching
 * to the second decimal (drug-related 0.799, public crime 0.407, vulnerable
 * populations 0.680, property-related 0.958, economically motivated 0.923,
 * miscellaneous 0.863, violent 0.861).
 *
 * `by` lists the factors forward selection kept. The paper prints the order of
 * selection for economically motivated crimes only, so the layers are eaten in
 * one bite rather than one per factor: sizing separate bites would mean
 * inventing the split.
 *
 * IDENTITY IS CARRIED BY SHAPE, NOT COLOUR. Four categorical hues cannot be
 * made colourblind-safe against this site's dark surface. Of 4,845 four-hue
 * combinations tested, none passed all-pairs: the best managed a CVD separation
 * of 5.7 against a floor of 6. Utensil silhouettes have no such ceiling, and
 * they survive greyscale printing as well.
 */

export const UTENSILS = [
  { id: 'fork', name: 'Fork', factor: 'Restaurant meal price' },
  { id: 'knife', name: 'Butter knife', factor: 'Home buy price' },
  { id: 'spork', name: 'Spork', factor: 'Mortgage interest rate' },
  { id: 'spoon', name: 'Spoon', factor: 'Monthly net salary' },
]

/** Sorted by how much gets eaten, so the cut edge falls as a staircase. */
export const CAKE_LAYERS = [
  {
    id: 'property',
    name: 'Property-related',
    lines: ['Property-', 'related'],
    eaten: 0.96,
    by: ['knife', 'spork', 'fork'],
  },
  {
    id: 'econ',
    name: 'Economically motivated',
    lines: ['Economically', 'motivated'],
    eaten: 0.92,
    by: ['fork', 'knife', 'spork'],
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    lines: ['Miscel-', 'laneous'],
    eaten: 0.86,
    by: ['knife', 'fork'],
  },
  {
    id: 'violent',
    name: 'Violent',
    lines: ['Violent'],
    eaten: 0.86,
    by: ['knife', 'fork'],
  },
  {
    id: 'drug',
    name: 'Drug-related',
    lines: ['Drug-', 'related'],
    eaten: 0.8,
    by: ['fork'],
  },
  {
    id: 'vulnerable',
    name: 'Vulnerable populations',
    lines: ['Vulnerable', 'populations'],
    eaten: 0.68,
    by: ['spoon'],
  },
  {
    id: 'public',
    name: 'Public crime',
    lines: ['Public', 'crime'],
    eaten: 0.41,
    by: ['spoon'],
  },
]

/**
 * Utensils in plan view, business end at -x so they come in from the right.
 * Each is a single path of several subpaths; the spork uses evenodd so its
 * slots read as cut through the bowl rather than drawn on top of it.
 */
export const UTENSIL_PATHS = {
  /* Four tines, long and clearly separated: the one silhouette that must not
     be confused with the spork. */
  fork: [
    'M-36 -12.4 L-15 -12.4 L-15 -8.9 L-36 -8.9 Z',
    'M-36 -5.4 L-15 -5.4 L-15 -1.9 L-36 -1.9 Z',
    'M-36 1.9 L-15 1.9 L-15 5.4 L-36 5.4 Z',
    'M-36 8.9 L-15 8.9 L-15 12.4 L-36 12.4 Z',
    'M-17 -12.4 L-7 -12.4 L-7 12.4 L-17 12.4 Z',
    'M-8 -3 L35 -2.2 L35 2.2 L-8 3 Z',
  ].join(' '),

  /* A plain deep bowl. */
  spoon: [
    'M-35 0 A 13 11 0 1 1 -9 0 A 13 11 0 1 1 -35 0 Z',
    'M-11 -3 L35 -2.2 L35 2.2 L-11 3 Z',
  ].join(' '),

  /* The same bowl with three slots cut clean through it, so it reads as a
     spork and not as a spoon with marks on it. */
  spork: [
    'M-35 0 A 13 11 0 1 1 -9 0 A 13 11 0 1 1 -35 0 Z',
    'M-33 -7.2 L-19 -7.2 L-19 -3.9 L-33 -3.9 Z',
    'M-33.6 -1.7 L-19 -1.7 L-19 1.7 L-33.6 1.7 Z',
    'M-33 3.9 L-19 3.9 L-19 7.2 L-33 7.2 Z',
    'M-11 -3 L35 -2.2 L35 2.2 L-11 3 Z',
  ].join(' '),

  knife: [
    'M-41 0',
    'Q-41 -9.6 -31 -10.4',
    'L-12 -7.4',
    'Q-5 -6 -3 -3.4',
    'L18 -4.4',
    'Q39 -5.4 39 -2',
    'L39 2',
    'Q39 5.4 18 4.4',
    'L-3 3.4',
    'Q-5 6 -12 7.4',
    'L-31 10.4',
    'Q-41 9.6 -41 0',
    'Z',
  ].join(' '),
}
