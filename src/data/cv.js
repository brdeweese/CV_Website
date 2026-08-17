/**
 * Single source of truth for every piece of content on the site.
 * Edit this file to update the site — no component changes needed.
 *
 * NOTE ON PDF LINKS: the `href` values below currently point at files hosted on
 * the old Wix site. They will break if that site is taken down. To self-host,
 * drop the PDFs into `public/files/` and change the href to
 * `${import.meta.env.BASE_URL}files/your-file.pdf`.
 */

const WIX_FILES = 'https://f77742c6-6778-46e9-907e-2c7bd4e39077.filesusr.com/ugd/'

export const profile = {
  name: 'Brina DeWeese',
  credential: 'MSc',
  role: 'Lecturer & Data Scientist',
  location: 'London, England',
  email: 'Brina.DeWeese@gmail.com',
  cvUrl: `${WIX_FILES}aceff2_c61ffe87a9c3469aa3b4ed4a04e068c5.pdf`,
  // Add these when you have them; the UI hides any link left as an empty string.
  linkedin: '',
  github: '',
  scholar: '',

  // NOTE: the big hero sentence is NOT here. It lives in src/pages/Home.jsx
  // because individual words inside it are highlighted, which needs markup.
  // Edit it there.

  intro: [
    'I am a Lecturer and Data Scientist with Master’s degrees in Data Science and Econometrics and in Tourism Management. My expertise lies in harnessing Python, Excel, and advanced analytics to extract meaningful insights from complex datasets and transform them into actionable strategies that drive marketing success and optimise business outcomes.',
    'Alongside my technical and analytical work, I design and deliver lectures in business and tourism, integrating data-driven tools and industry insights into curriculum design. My analytical strengths extend to econometric modelling and enhancing operational efficiencies through data-driven decision making, while my lecturing experience reflects my ability to engage, educate, and inspire students.',
  ],
}

/**
 * The three disciplines double as the site's categorical colour system.
 * Colours come from a CVD-validated three-slot palette (validated all-pairs in
 * both light and dark mode). They are ALWAYS paired with a visible text label —
 * aqua sits below 3:1 on the light surface, so colour never carries meaning alone.
 */
export const disciplines = {
  economics: {
    id: 'economics',
    label: 'Economics',
    short: 'ECON',
    blurb:
      'A BSc in Economics and an MSc in Econometrics underpin how I frame a question: what is actually being measured, what would count as evidence, and what the model can and cannot claim.',
  },
  data: {
    id: 'data',
    label: 'Data Science',
    short: 'DATA',
    blurb:
      'Python, SQL, and the analytics stack are where the questions get answered. The output that matters is not the model, it is the decision someone can make because of it.',
  },
  tourism: {
    id: 'tourism',
    label: 'Tourism',
    short: 'TOUR',
    blurb:
      'An MSc in Tourism Management and doctoral research on industry resilience give me the sector knowledge to know which patterns in the data are meaningful and which are noise.',
  },
}

/** Headline figures. Every number here is drawn from real, stated outcomes. */
export const metrics = [
  {
    value: 54,
    suffix: '%',
    label: 'Increase in memberships',
    detail:
      'Ran a full visitor survey at The Lodge Space, analysed the results, and implemented the targeted growth strategy that followed.',
    discipline: 'data',
  },
  {
    value: 300,
    prefix: '+',
    label: 'Social followers in month one',
    detail:
      'Achieved through a content and engagement strategy built on a custom post-performance tracker.',
    discipline: 'data',
  },
  {
    value: 3,
    label: 'Degrees across three fields',
    detail:
      'BSc Economics, MSc Data Science & Econometrics, and MSc Tourism Management — the combination the rest of this site is built on.',
    discipline: 'economics',
  },
  {
    value: 2,
    label: 'National awards',
    detail:
      'The Irish Research Council Scholarship from the Government of Ireland, and the IvenTUre prize for an AR tourism business plan.',
    discipline: 'tourism',
  },
]

export const experience = [
  {
    id: 'gbs',
    start: 2025,
    end: null, // null = present
    role: 'Lecturer',
    org: 'Global Banking School',
    location: 'London, England',
    discipline: 'tourism',
    summary:
      'Designing and delivering tourism and business modules that pair theory with applied, data-literate practice.',
    points: [
      'Design and deliver lectures on tourism and business, covering both theoretical knowledge and applied practice.',
      'Use interactive methods and gamification to drive engagement and learning.',
      'Integrate data tools (Python, Excel, Power BI) and industry insights into teaching.',
      'Consistently exceed KPIs for attendance, satisfaction, and pass rates.',
      'Mentor students with feedback, career guidance, and skills development.',
    ],
  },
  {
    id: 'lodge',
    start: 2024,
    end: 2024,
    role: 'Marketing Strategist',
    org: 'The Lodge Space',
    location: 'London, England',
    discipline: 'data',
    summary:
      'Owned the analytics behind acquisition and retention, from survey design through to the dashboard leadership used to steer strategy.',
    points: [
      'Formulated and executed marketing strategies focused on customer retention and acquisition, substantially improving engagement metrics across all platforms.',
      'Conducted a comprehensive visitor survey, analysed the results, and implemented targeted growth strategies that led to a 54% increase in memberships.',
      'Grew social media following by 300 in the first month through strategic content and engagement tactics.',
      'Developed a social media tracker to analyse post performance and turn those insights into a growth strategy.',
      'Created and maintained a marketing analytics dashboard to monitor strategy impact, supporting dynamic adjustments.',
      'Optimised social channels and websites for SEO, increasing visibility and traffic.',
    ],
  },
  {
    id: 'irc',
    start: 2021,
    end: 2023,
    role: 'Researcher',
    org: 'Irish Research Council',
    location: 'Dublin, Ireland',
    discipline: 'economics',
    summary:
      'Doctoral research into the economic resilience of the Irish tourism industry through periods of adversity.',
    points: [
      'Led research on business resilience in the Irish tourism industry, focusing on economic resilience and sustainability.',
      'Conducted a detailed literature review on business and economic resilience relevant to public policy and economic consulting.',
      'Created a conceptual framework analysing how business resilience evolves before, during, and after economic disruptions.',
      'Communicated complex resilience theory through clear, visually engaging reports and presentations.',
    ],
  },
  {
    id: 'imvizar',
    start: 2022,
    end: 2023,
    role: 'Growth & Development Executive',
    org: 'Imvizar',
    location: 'Dublin, Ireland',
    discipline: 'tourism',
    summary:
      'Business development for an augmented reality tourism start-up, across trade shows, market analysis, and executive reporting.',
    points: [
      'Coordinated and managed company exhibits at ExCeL London, AVEA Ireland, and Museums Connection Paris.',
      'Represented the company at industry events, ensuring a professional and engaging presence.',
      'Planned marketing initiatives and leveraged referral networks to drive business development.',
      'Evaluated market trends and recommended marketing budget allocations to top management.',
      'Completed monthly reports supporting executive decision making.',
      'Developed short and long-term sales objectives and strategic plans to meet market needs.',
    ],
  },
]

/**
 * TODO (Brina): your old site listed the three degrees but never named the
 * awarding institutions or the years. Rather than guess, `org`, `start`, and
 * `end` are left blank — the UI simply omits whatever is empty. Fill these in
 * and they appear automatically.
 */
export const education = [
  {
    id: 'msc-tourism',
    start: null,
    end: null,
    degree: 'MSc Tourism Management',
    org: '',
    discipline: 'tourism',
    note: 'Master’s Class Representative, Technological University Dublin',
  },
  {
    id: 'msc-data',
    start: null,
    end: null,
    degree: 'MSc Data Science & Econometrics',
    org: '',
    discipline: 'data',
    note: '',
  },
  {
    id: 'bsc-econ',
    start: null,
    end: null,
    degree: 'BSc Economics',
    org: '',
    discipline: 'economics',
    note: 'Vice President, Economics Club, University of Kansas · Dean’s List Honor Roll',
  },
]

/**
 * TODO (Brina): your old site showed five achievements beside only four year
 * ranges (2021 · 2019–2020 · 2016–2018 · 2015–2018) in a layout that made the
 * pairing ambiguous, so `year` is left blank rather than guessed. The UI omits
 * an empty year. Fill in the correct ones and they appear.
 */
export const awards = [
  {
    year: '',
    title: 'Irish Research Council Scholarship',
    detail: 'Awarded by the Government of Ireland.',
    discipline: 'economics',
  },
  {
    year: '',
    title: 'IvenTUre Awardee',
    detail:
      'Awarded the IvenTUre prize for an augmented reality tourism development business plan.',
    discipline: 'tourism',
  },
  {
    year: '',
    title: 'Master’s Class Representative',
    detail: 'Technological University Dublin.',
    discipline: 'tourism',
  },
  {
    year: '',
    title: 'Vice President, Economics Club',
    detail: 'University of Kansas.',
    discipline: 'economics',
  },
  {
    year: '',
    title: 'Dean’s List Honor Roll',
    detail: 'University of Kansas.',
    discipline: 'economics',
  },
]

export const skills = [
  {
    group: 'Programming',
    discipline: 'data',
    items: ['Python', 'R', 'SQL'],
  },
  {
    group: 'Analysis & Visualisation',
    discipline: 'data',
    items: [
      'NumPy',
      'Pandas',
      'Statsmodels',
      'Seaborn',
      'Matplotlib',
      'Beautiful Soup',
      'Excel',
      'Power BI',
      'Jupyter',
      'Spyder',
    ],
  },
  {
    group: 'Machine Learning',
    discipline: 'data',
    items: ['scikit-learn', 'XGBoost'],
  },
  {
    group: 'Econometrics',
    discipline: 'economics',
    items: [
      'Econometric modelling',
      'Regression analysis',
      'Resilience frameworks',
      'Survey design',
    ],
  },
  {
    group: 'Marketing & Growth',
    discipline: 'tourism',
    items: ['SEO', 'Google Ads', 'Campaign analytics', 'Canva', 'Flodesk'],
  },
  {
    group: 'Platforms & Tools',
    discipline: 'tourism',
    items: ['Jira', 'Moodle', 'Skedda', 'Momence', 'Microsoft Suite'],
  },
]

export const certifications = [
  'Python 3 Course Certification',
  'Google Ads Display Certification',
  'Google Ads Search Certification',
]

/**
 * Projects. `slug` drives the detail page URL (/projects/:slug).
 *
 * !! REVIEW BEFORE PUBLISHING !!
 * Your old site showed these projects as images plus a PDF link, with no
 * written descriptions. The `summary`, `body`, and `methods` fields below are
 * therefore drafted from the titles alone and are placeholders describing what
 * the work probably involved. Read each one and correct it — especially
 * `methods`, which lists tools you may not have used on that specific project.
 *
 * Four further PDFs were linked on the old projects page that could not be
 * identified from the images. Add them as new entries here:
 *   aceff2_d81f650cf045487db8fed9b8297ed65b.pdf
 *   aceff2_34b11610d09545ad90b2fd6eb2e2354a.pdf
 *   aceff2_2ac1339f29ba432cb914c045d9111765.pdf
 *   aceff2_03ef9a5bd36f4e76bc825aa7989fe92b.pdf
 *
 * ADDING A CHART: give a project a `chart` object and the detail page renders it.
 * Leave `chart` undefined and no chart appears — nothing is ever invented for you.
 *   chart: {
 *     kind: 'bar' | 'line',
 *     title: 'What the chart shows',
 *     source: 'Where the numbers came from',
 *     xKey: 'year',
 *     series: [{ key: 'rate', label: 'Crime rate' }],
 *     data: [{ year: 2015, rate: 12 }, ...],
 *   }
 */
export const projects = [
  {
    slug: 'cost-of-living-crime-chicago',
    title: 'Will We Eat the Rich If We Run Out of Cake?',
    subtitle:
      'Analysing the cost of living’s impact on crime rates in the City of Chicago',
    discipline: 'economics',
    year: '', // TODO (Brina): add the year — not stated on the old site.
    kind: 'Econometric study',
    summary:
      'An econometric examination of whether cost-of-living pressure moves crime rates in Chicago, combining public crime records with economic indicators.',
    body: [
      'This study tests a question that sits squarely between economics and public policy: when the cost of living rises, does crime follow? Chicago offers an unusually rich public dataset, which makes it a strong candidate for testing the relationship empirically rather than anecdotally.',
      'The work involved assembling crime records alongside cost-of-living and economic indicators, cleaning and aligning the series, and building regression models to isolate the relationship while controlling for confounding factors.',
    ],
    methods: ['Python', 'Pandas', 'Statsmodels', 'Regression analysis', 'Data cleaning'],
    links: [
      {
        label: 'Read the full study',
        href: `${WIX_FILES}aceff2_d31ac8e6aa18459db8809a078709e44a.pdf`,
      },
    ],
  },
  {
    slug: 'the-eras-analysis',
    title: 'The Eras Analysis',
    subtitle: 'An analytical examination of Taylor Swift’s discography',
    discipline: 'data',
    year: '', // TODO (Brina): add the year — not stated on the old site.
    kind: 'Data analysis',
    summary:
      'A structured analysis of a discography spanning nearly two decades, treating a cultural dataset with the same rigour as an economic one.',
    body: [
      'Cultural datasets are an excellent teaching vehicle: the subject is familiar, so the analysis itself becomes the thing people focus on. This project examines how the character of a body of work shifts across eras, using audio and release metadata as the underlying signal.',
      'The approach mirrors any other applied analysis: source the data, define what a meaningful comparison actually looks like, then let the results push back on the initial hypothesis.',
    ],
    methods: ['Python', 'Pandas', 'Seaborn', 'Matplotlib', 'Exploratory analysis'],
    links: [
      {
        label: 'Read the full analysis',
        href: `${WIX_FILES}aceff2_cb830d95f0d046dfb8501b471195baff.pdf`,
      },
    ],
  },
  {
    slug: 'marketing-analytics-tracker',
    title: 'Marketing Campaign Tracker & Analytics',
    subtitle: 'A live dashboard for measuring campaign performance',
    discipline: 'data',
    year: '2024',
    kind: 'Applied analytics',
    summary:
      'The tracker and dashboard built at The Lodge Space to measure what marketing activity actually moved, and to adjust strategy while campaigns were still running.',
    body: [
      'Most marketing reporting arrives too late to change anything. This tracker was built to close that gap: post-level performance data feeding a dashboard that leadership could read at a glance, so strategy could be adjusted mid-campaign rather than post-mortem.',
      'The same instrumentation underpinned the visitor survey analysis that led to a 54% increase in memberships, and the content strategy that added 300 social followers in the first month.',
    ],
    methods: ['Excel', 'Dashboard design', 'Campaign analytics', 'Survey analysis', 'SEO'],
    links: [
      {
        label: 'Open the interactive tracker',
        href: 'https://docs.google.com/spreadsheets/d/1L_cPZcr1UvMmJM2pAncC_YcVvaBmTH0KJyM-DzWaSEg/edit?usp=sharing',
      },
    ],
  },
  {
    slug: 'women-of-wolverhampton',
    title: 'Women of Wolverhampton',
    subtitle: 'Volunteer data analysis and visualisation for a women’s group',
    discipline: 'data',
    year: '', // TODO (Brina): add the year — not stated on the old site.
    kind: 'Volunteer analytics',
    summary:
      'Volunteered to help a community women’s group make sense of their own data, and to present it in a form they could act on and share.',
    body: [
      'Community organisations often collect a great deal of data and have no capacity to analyse it. This project involved taking that raw material, analysing it, and building visualisations the group could use in their own reporting and advocacy.',
    ],
    methods: ['Data analysis', 'Data visualisation', 'Reporting'],
    links: [
      {
        label: 'View the work',
        href: `${WIX_FILES}aceff2_e09ab3ef8b604deab630a4526045abab.pdf`,
      },
    ],
  },
  {
    slug: 'teach-with-technology',
    title: 'Teach with Technology',
    subtitle: 'Integrating technology into higher education teaching',
    discipline: 'tourism',
    year: '2025',
    kind: 'Pedagogy',
    summary:
      'A presentation and set of worked examples showing administration, lecturers, and deans how classroom technology can lift engagement and build digital skills.',
    body: [
      'Built for an audience of administration, lecturers, and deans, this presentation makes the case for classroom technology in concrete terms: which tools, for which learning outcome, and what students gain that they would not otherwise.',
      'The accompanying activities put the argument into practice — see the teaching section for the full set.',
    ],
    methods: ['Curriculum design', 'Educational technology', 'Presentation'],
    links: [{ label: 'See the activities', href: '#teaching', internal: true }],
  },
]

/** Lecturing activities, taken from the teaching examples page. */
export const teaching = [
  {
    title: 'Gap in the Market',
    discipline: 'tourism',
    description:
      'A worksheet helping students identify unmet industry needs while building creativity and critical thinking. It also strengthens data literacy by requiring evidence and research to justify their ideas.',
  },
  {
    title: 'Introduction to Data Science',
    discipline: 'data',
    description:
      'A Coding Practice with AI worksheet introducing tourism students to data science and Python in an accessible way. Using tourism data, it shows how AI can support analysis, and what students can accomplish once they know how to frame the right questions.',
  },
  {
    title: 'Escape Room: Butler’s Curve',
    discipline: 'tourism',
    description:
      'The first puzzle in a team-based escape room game. Pin the Tail on Butler’s Curve challenged students to correctly place the stages of the Tourism Area Life Cycle, combining competition with applied learning.',
  },
  {
    title: 'Escape Room: Impacts & Stakeholders',
    discipline: 'tourism',
    description:
      'The second puzzle, a tourism impacts and stakeholder matching activity where students linked impacts to the stakeholders they affect. Encourages teamwork, critical thinking, and applying theory to practice.',
  },
  {
    title: 'Crossword Puzzles',
    discipline: 'economics',
    description:
      'Worksheets that make key definitions more engaging and memorable. Each puzzle draws on real academic sources with a full Harvard reference list, reinforcing subject knowledge and proper academic practice together.',
  },
  {
    title: 'Teach With Tech Presentation',
    discipline: 'data',
    description:
      'A presentation for administration, lecturers, and deans on integrating a variety of technologies into the classroom to enhance learning, improve engagement, and build digital skills students carry into their careers.',
  },
]

export const sections = [
  { id: 'about', label: 'About', number: '01' },
  { id: 'work', label: 'Experience', number: '02' },
  { id: 'projects', label: 'Projects', number: '03' },
  { id: 'teaching', label: 'Teaching', number: '04' },
  { id: 'background', label: 'Background', number: '05' },
  { id: 'contact', label: 'Contact', number: '06' },
]
