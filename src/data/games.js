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
    id: 'tourism',
    name: 'Introduction to the tourism industry',
    subject: 'Tourism',
    cols: 20,
    rows: 15,
    source:
      'Clues are written from the module reading: Cook, Hsu and Taylor (2018) and Du Cros and McKercher (2020).',
    words: [
      {
        n: 4,
        dir: 'across',
        r: 1,
        c: 3,
        a: 'TOURISM',
        q: 'The temporary movement of people to destinations outside their normal places of work and residence, the activities undertaken during their stay in those destinations, and the facilities created to cater to their needs (Cook, Hsu and Taylor, 2018).',
      },
      {
        n: 6,
        dir: 'across',
        r: 4,
        c: 10,
        a: 'PACKAGE',
        q: 'Tour (blank): two or more travel services put together by a tour operator, such as air transportation, accommodations, meals, ground transportation, and attractions (Cook, Hsu and Taylor, 2018).',
      },
      {
        n: 8,
        dir: 'across',
        r: 6,
        c: 16,
        a: 'MASS',
        q: '(Blank) tourism: twentieth-century phenomenon whereby the working and middle classes began travelling in large numbers for leisure purposes (Cook, Hsu and Taylor, 2018).',
      },
      {
        n: 9,
        dir: 'across',
        r: 8,
        c: 0,
        a: 'ACCOMMODATION',
        q: 'Establishments engaged primarily in providing lodging space to the general public (Cook, Hsu and Taylor, 2018).',
      },
      {
        n: 11,
        dir: 'across',
        r: 10,
        c: 9,
        a: 'SUSTAINABLE',
        q: '(Blank) tourism: tourism activities and development that do not endanger the economic, social, cultural, or environmental assets of a destination (Cook, Hsu and Taylor, 2018).',
      },
      {
        n: 1,
        dir: 'down',
        r: 0,
        c: 3,
        a: 'ATTRACTIONS',
        q: 'Natural locations, objects, or constructed facilities that have a special appeal to both tourists and local visitors (Cook, Hsu and Taylor, 2018).',
      },
      {
        n: 2,
        dir: 'down',
        r: 0,
        c: 14,
        a: 'GLOBALISATION',
        q: 'The movement of people, goods, capital and ideas due to increased economic integration, which in turn is propelled by increased trade and investment. It is like moving towards living in a borderless world, and can also include the process whereby aspects of one particular culture are adopted worldwide (Du Cros and McKercher, 2020).',
      },
      {
        n: 3,
        dir: 'down',
        r: 0,
        c: 19,
        a: 'BUSINESS',
        q: '(Blank) travel: travel-related activities associated with commerce and industry (Cook, Hsu and Taylor, 2018).',
      },
      {
        n: 5,
        dir: 'down',
        r: 1,
        c: 16,
        a: 'INTERMEDIARY',
        q: 'Firms that help tourism suppliers locate customers and make sales to them, including tour operators and travel agencies (Cook, Hsu and Taylor, 2018).',
      },
      {
        n: 7,
        dir: 'down',
        r: 6,
        c: 10,
        a: 'LEISURE',
        q: '(Blank) travel: travel for personal interest and enjoyment (Cook, Hsu and Taylor, 2018).',
      },
      {
        n: 10,
        dir: 'down',
        r: 8,
        c: 18,
        a: 'CULTURE',
        q: 'The practices of a society; its customary beliefs, social roles, and material objects (Cook, Hsu and Taylor, 2018).',
      },
      {
        n: 12,
        dir: 'down',
        r: 10,
        c: 12,
        a: 'TOUR',
        q: '(Blank) operator: a business entity engaged in the planning, preparing, marketing, making of reservations, and, at times, operating vacation tours (Cook, Hsu and Taylor, 2018).',
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

/* ---- Ethical theories, the matching game ----------------------------------
 *
 * From Brina's Ethics Matching Game worksheet, verbatim. Each dilemma carries
 * three responses, one per theory, and the exercise is to say which is which.
 * The trolley above it is the warm-up; this is the part with marked answers.
 */

export const ETHICAL_THEORIES = [
  {
    id: 'deontology',
    name: 'Deontology',
    gloss: 'duty-based',
  },
  {
    id: 'virtue',
    name: 'Virtue ethics',
    gloss: 'character-focused',
  },
  {
    id: 'consequentialism',
    name: 'Consequentialism',
    gloss: 'outcome-focused',
  },
]

export const DILEMMAS = [
  {
    id: 'park',
    n: 1,
    text: 'A beautiful national park has reached its daily visitor limit, but a tourist begs you (the park ranger) to let them in because they have come all the way from another country and may never return.',
    responses: [
      {
        text: 'I can’t let them in because the rules exist to protect the environment, and rules must be followed no matter what.',
        answer: 'deontology',
      },
      {
        text: 'I’d decide whether letting them in would cause any real harm or overcrowding today.',
        answer: 'consequentialism',
      },
      {
        text: 'I’d think about what a responsible and caring person who respects nature would do.',
        answer: 'virtue',
      },
    ],
  },
  {
    id: 'coral',
    n: 2,
    text: 'A tourist is offered a rare coral souvenir to buy from a local beach vendor, even though harvesting coral is illegal and harms marine life.',
    responses: [
      {
        text: 'I shouldn’t buy it because it’s illegal, and breaking laws is always wrong.',
        answer: 'deontology',
      },
      {
        text: 'I’d avoid buying it because supporting this trade damages reefs and harms the ecosystem in the long run.',
        answer: 'consequentialism',
      },
      {
        text: 'I wouldn’t buy it because a good traveller respects and protects nature.',
        answer: 'virtue',
      },
    ],
  },
  {
    id: 'tiger',
    n: 3,
    text: 'During a jungle tour, a guide offers you the chance to take a selfie with a sedated tiger for social media likes.',
    responses: [
      {
        text: 'I won’t do it because exploiting animals for entertainment is wrong, regardless of how cute the photo might look.',
        answer: 'deontology',
      },
      {
        text: 'I’d think about whether taking the selfie would encourage more people to support harmful wildlife tourism.',
        answer: 'consequentialism',
      },
      {
        text: 'I’d refuse because a compassionate and respectful person wouldn’t use animals for personal gain.',
        answer: 'virtue',
      },
    ],
  },
  {
    id: 'reviews',
    n: 4,
    text: 'You work at a travel agency. Your manager asks you to post fake positive reviews online to boost business.',
    responses: [
      {
        text: 'I refuse because lying and deceiving customers is always wrong.',
        answer: 'deontology',
      },
      {
        text: 'I’d consider it only if fake reviews help save the business and protect everyone’s jobs.',
        answer: 'consequentialism',
      },
      {
        text: 'I won’t do it because an honest and trustworthy person wouldn’t lie to customers.',
        answer: 'virtue',
      },
    ],
  },
  {
    id: 'overbooked',
    n: 5,
    text: 'You work at a popular resort that has accidentally overbooked rooms. A regular guest arrives, but there is no room left unless you cancel a booking for first-time guests who have also just arrived.',
    responses: [
      {
        text: 'I’ll follow hotel policy and deal fairly with whoever booked first, because fairness is my duty.',
        answer: 'deontology',
      },
      {
        text: 'I’d choose whichever solution protects the resort’s reputation and leads to the best guest satisfaction overall.',
        answer: 'consequentialism',
      },
      {
        text: 'I’d make a decision guided by fairness and kindness because that’s what a good hospitality professional would do.',
        answer: 'virtue',
      },
    ],
  },
  {
    id: 'paper',
    n: 6,
    text: 'You’ve created an amazing ethics matching game for your students. But to print it, you used over 100 sheets of paper. You suddenly realise this might contribute to killing trees and harming the environment, ironically, while teaching about ethics. Your colleagues are teasing you for being the “Ethics Hypocrite”.',
    responses: [
      {
        text: 'I should have avoided printing because protecting the environment is a moral duty, even for teaching.',
        answer: 'deontology',
      },
      {
        text: 'I’d argue it’s worth the paper because the learning benefits for students outweigh the environmental cost.',
        answer: 'consequentialism',
      },
      {
        text: 'I’ll admit my mistake because an ethical teacher should be honest, humble, and willing to improve.',
        answer: 'virtue',
      },
    ],
  },
]

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
