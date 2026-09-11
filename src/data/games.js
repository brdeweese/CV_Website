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

/* ---- Key word crosswords --------------------------------------------------
 *
 * Two of the crosswords Brina sets, one from each side of her teaching. The
 * grids are given as word lists with a start cell and a direction; the squares
 * and the clue numbers are derived from those, so a grid cannot fall out of
 * step with its clues.
 */

export const CROSSWORDS = [
  {
    id: 'research',
    name: 'Research methods',
    subject: 'Business and tourism',
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
  },
  {
    id: 'afm',
    name: 'AFM key words, week 2',
    subject: 'Accounting and finance',
    cols: 20,
    rows: 11,
    source:
      'Clues are written from the module reading, with a full Harvard reference list: BBC (2023); Bryman (2016); Deloitte United Kingdom (2019); Lindemulder, Kosinski and Jonker (2024); Saunders, Lewis and Thornhill (2019); Sloman, Garratt and Guest (2022); Statista Encyclopedia (2020).',
    words: [
      {
        n: 3,
        dir: 'across',
        r: 3,
        c: 0,
        a: 'CYBERSECURITY',
        q: '(Blank) is the practice of protecting people, systems and data from cyberattacks using a mix of technologies, processes and policies (Lindemulder, Kosinski and Jonker, 2024).',
      },
      {
        n: 8,
        dir: 'across',
        r: 5,
        c: 1,
        a: 'INFLATION',
        q: '(Blank) is an overall increase in the price level across the entire economy (Sloman et al., 2022).',
      },
      {
        n: 9,
        dir: 'across',
        r: 5,
        c: 17,
        a: 'AIM',
        q: 'A research (blank) is the main overall purpose of your study; it explains what you want to find out and is broad, giving general direction (Bryman, 2016; Saunders, Lewis & Thornhill, 2019).',
      },
      {
        n: 10,
        dir: 'across',
        r: 6,
        c: 11,
        a: 'NOMINAL',
        q: 'The (blank) value of a good is its current price in today’s money; its face value, without taking inflation into account. £20 in 1990 and £20 today have the same (blank) value (Sloman et al., 2022).',
      },
      {
        n: 1,
        dir: 'down',
        r: 0,
        c: 2,
        a: 'NEOBANK',
        q: 'A (blank) operates solely online and through mobile apps; customers can carry out traditional banking processes such as money transfers, loans and reviewing savings accounts without the need for a physical branch, and it will not necessarily have its own banking licence but may instead partner with a traditional bank (Deloitte United Kingdom, 2019).',
      },
      {
        n: 2,
        dir: 'down',
        r: 0,
        c: 6,
        a: 'OBJECTIVES',
        q: 'Research (blank) are the smaller steps you take to achieve your aim; they are more specific and explain exactly what you will do, measure, compare, or analyse (Bryman, 2016; Saunders, Lewis & Thornhill, 2019).',
      },
      {
        n: 4,
        dir: 'down',
        r: 3,
        c: 11,
        a: 'TREND',
        q: 'A (blank) is a pattern found in time series datasets; it is used to describe if the data is showing an upward or downward movement for part or all of the time series (Statista Encyclopedia, 2020).',
      },
      {
        n: 5,
        dir: 'down',
        r: 3,
        c: 17,
        a: 'REAL',
        q: 'The (blank) value is the nominal value after adjusting for inflation, measured against a base year so that values from different times can be compared accurately (Sloman et al., 2022).',
      },
      {
        n: 6,
        dir: 'down',
        r: 4,
        c: 15,
        a: 'FINTECH',
        q: '(Blank), short for Financial Technology, is the emerging industry that aims to modernise, improve and automate the delivery of financial services, using modern software and infrastructure to compete with traditional methods of delivering financial solutions (Deloitte United Kingdom, 2019).',
      },
      {
        n: 7,
        dir: 'down',
        r: 4,
        c: 19,
        a: 'SMART',
        q: '(Blank) objectives are Specific, Measurable, Agreed, Realistic and Time-bound (BBC, 2023).',
      },
    ],
  },
]

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
