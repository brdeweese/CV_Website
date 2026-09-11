/**
 * Content for the playable classroom activities.
 *
 * The impacts, the Butler and Doxey placements and the crossword clues are
 * taken verbatim from the versions Brina runs, via the Teach with Tech site.
 * Nothing here is invented: where an activity has a defensible answer it is
 * hers, and where it does not the activity says so.
 */

/* ---- Tourism impact sort -------------------------------------------------- */

export const IMPACT_CATEGORIES = ['Economic', 'Environmental', 'Socio-cultural']

export const IMPACTS = [
  {
    id: 'waste',
    text: 'Increased waste generation in natural areas',
    answer: 'Environmental',
  },
  { id: 'jobs', text: 'Jobs created in the hospitality sector', answer: 'Economic' },
  { id: 'identity', text: 'Erosion of local cultural identity', answer: 'Socio-cultural' },
  { id: 'water', text: 'Strain on water resources', answer: 'Environmental' },
  { id: 'seasonal', text: 'Rise in seasonal employment', answer: 'Economic' },
  {
    id: 'exchange',
    text: 'Greater cultural exchange between tourists and locals',
    answer: 'Socio-cultural',
  },
]

/* ---- Pin the tail on Butler's curve --------------------------------------- */

/**
 * The seven stages, as percentages of the board.
 *
 * `x` and `y` are the point on the curve itself. `lx` and `ly` are where the
 * label sits, pushed off the curve and alternating side to side so no two
 * labels share a horizontal band. A leader line joins the two. Everything is a
 * percentage, so labels scale with the drawing instead of staying a fixed pixel
 * size and colliding as the board narrows.
 *
 * `next` names the stages either side on the curve, which is what makes an
 * adjacent placement arguable rather than wrong.
 */
export const BUTLER_STAGES = [
  { name: 'Exploration', x: 16.6, y: 85.3, lx: 18.3, ly: 69.8, next: ['Involvement'] },
  {
    name: 'Involvement',
    x: 32.9,
    y: 64.1,
    lx: 28.0,
    ly: 50.2,
    next: ['Exploration', 'Development'],
  },
  {
    name: 'Development',
    x: 46.6,
    y: 41.2,
    lx: 47.1,
    ly: 58.1,
    next: ['Involvement', 'Consolidation'],
  },
  {
    name: 'Consolidation',
    x: 62.3,
    y: 30.7,
    lx: 59.1,
    ly: 18.1,
    next: ['Development', 'Stagnation'],
  },
  {
    name: 'Stagnation',
    x: 76.3,
    y: 27.6,
    lx: 77.9,
    ly: 55.8,
    next: ['Consolidation', 'Rejuvenation', 'Decline'],
  },
  { name: 'Rejuvenation', x: 91.0, y: 16.4, lx: 85.1, ly: 7.9, next: ['Stagnation'] },
  { name: 'Decline', x: 91.0, y: 43.3, lx: 87.4, ly: 72.1, next: ['Stagnation'] },
]

/** Ordered, so neighbouring levels are the ones that can be argued either way. */
export const IRRIDEX = ['Euphoria', 'Apathy', 'Annoyance', 'Antagonism']

export const DESTINATIONS = [
  { id: 'bhutan', name: 'Bhutan', butler: 'Exploration', doxey: 'Euphoria' },
  { id: 'vietnam', name: 'Vietnam', butler: 'Development', doxey: 'Apathy' },
  { id: 'nyc', name: 'New York City', butler: 'Consolidation', doxey: 'Annoyance' },
  { id: 'venice', name: 'Venice', butler: 'Stagnation', doxey: 'Antagonism' },
  { id: 'barcelona', name: 'Barcelona', butler: 'Stagnation', doxey: 'Antagonism' },
]

/* ---- Data crossword ------------------------------------------------------- */

export const CROSSWORD = {
  cols: 12,
  rows: 12,
  source:
    'Clues are written from the module reading, Saunders, Lewis and Thornhill (2023).',
  words: [
    {
      n: 1,
      dir: 'across',
      r: 0,
      c: 0,
      a: 'QUANTITATIVE',
      q: 'Data that can be recorded as numbers and analysed numerically.',
    },
    {
      n: 3,
      dir: 'across',
      r: 3,
      c: 3,
      a: 'INTERVAL',
      q: 'Numerical data where the difference between two values can be stated, but the relative difference cannot.',
    },
    {
      n: 4,
      dir: 'across',
      r: 7,
      c: 0,
      a: 'NUMERICAL',
      q: 'Data whose values can be measured as quantities.',
    },
    {
      n: 6,
      dir: 'across',
      r: 10,
      c: 1,
      a: 'NOMINAL',
      q: 'Data whose values cannot be measured numerically but can be classified into sets or categories.',
    },
    {
      n: 1,
      dir: 'down',
      r: 0,
      c: 0,
      a: 'QUESTION',
      q: 'Research ___: the key thing the research process will answer, and the precursor to research objectives.',
    },
    {
      n: 2,
      dir: 'down',
      r: 2,
      c: 7,
      a: 'ORDINAL',
      q: 'Data whose values cannot be measured numerically but can be placed in a definite order or rank.',
    },
    {
      n: 5,
      dir: 'down',
      r: 7,
      c: 4,
      a: 'RATIO',
      q: 'Numerical data where both the difference and the relative difference between two values can be stated.',
    },
  ],
}

/* ---- Ethical dilemma: the trolley problem --------------------------------- */

export const TROLLEY = {
  prompt: 'The brake has failed. The lever is yours.',
  choices: {
    straight: {
      id: 'straight',
      label: 'Leave the lever',
      toll: 4,
      verdict:
        'You left the lever. The trolley carried on into the four people already on that track.',
      school: 'Doing nothing was still a choice.',
    },
    divert: {
      id: 'divert',
      label: 'Pull the lever',
      toll: 1,
      verdict: 'You pulled the lever. The trolley took the branch with one person on it.',
      school:
        'One died instead of four, and you caused that death rather than failing to prevent four.',
    },
  },
  /** Neither is the marked answer, which is the point of running it. */
  after: [
    {
      title: 'The consequentialist reading',
      body: 'Judge the act by its outcome. One death is less bad than four, so pull the lever.',
    },
    {
      title: 'The deontological reading',
      body: 'Judge the act by the act. Pulling the lever makes you the cause of a death that would not otherwise have happened.',
    },
    {
      title: 'The footbridge variant',
      body: 'In the footbridge version you stop the trolley by pushing a person onto the track. The arithmetic is identical, and far fewer people say they would do it.',
    },
  ],
}

/* ---- International trade game: globalisation ------------------------------ */

/**
 * Four teams with different endowments. Producing one shape needs paper, a
 * stencil and scissors, so on their own only the team holding all three can
 * make anything at all. The point of the activity is what happens when they
 * are allowed to trade.
 */
export const TRADE_TEAMS = [
  {
    id: 'a',
    name: 'Team A',
    bloc: 'south',
    has: ['paper'],
    alone: 0,
    traded: 5,
    note: 'Paper, and no way to cut it.',
  },
  {
    id: 'b',
    name: 'Team B',
    bloc: 'south',
    has: ['scissors'],
    alone: 0,
    traded: 4,
    note: 'Scissors, and nothing to cut.',
  },
  {
    id: 'c',
    name: 'Team C',
    bloc: 'south',
    has: ['stencil'],
    alone: 0,
    traded: 4,
    note: 'A stencil, and neither paper nor scissors.',
  },
  {
    id: 'd',
    name: 'Team D',
    bloc: 'north',
    has: ['paper', 'scissors', 'stencil'],
    alone: 6,
    traded: 9,
    note: 'All three, and no need to trade.',
  },
]

export const TRADE_RESOURCES = {
  paper: 'Paper',
  scissors: 'Scissors',
  stencil: 'Stencil',
}
