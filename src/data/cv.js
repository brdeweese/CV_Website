/**
 * Single source of truth for every piece of content on the site.
 * Edit this file to update the site — no component changes needed.
 *
 * Content is drawn from the 2026 CV and from the five project documents in
 * `public/files/`. Where a fact was not stated in either, the field is left
 * empty and the UI omits it, rather than being filled with a guess.
 */

/** PDFs are served from the repo, so nothing depends on the old Wix site. */
const FILES = `${import.meta.env.BASE_URL}files/`

export const profile = {
  name: 'Brina DeWeese',
  credential: 'MSc',
  role: 'Lecturer & Module Lead',
  location: 'London, England',
  email: 'Brina.DeWeese@gmail.com',
  linkedin: 'https://linkedin.com/in/brina-deweese',
  github: '',

  /**
   * TODO (Brina): your CV PDF is not linked yet, deliberately.
   * The version on the old Wix site is out of date, and the current
   * Brina_DeWeese_CV_LSE_2026.docx has your mobile number in the header, which
   * you probably do not want on a public page. Export a phone-free version to
   * `public/files/brina-deweese-cv.pdf` and set this to `${FILES}brina-deweese-cv.pdf`.
   * While this is empty the download buttons are simply not rendered.
   */
  cvUrl: '',

  // NOTE: the big hero sentence is NOT here. It lives in src/pages/Home.jsx
  // because individual words inside it are highlighted, which needs markup.

  intro: [
    'I am a Lecturer and Module Lead with Master’s degrees in Data Science and Econometrics and in Tourism Management. I lead the delivery of a foundation year capstone module across five campuses, coordinating a teaching team of 12 to 15 lecturers for more than 800 students each cycle.',
    'My background is econometrics and applied data science, and it shapes how I run a programme. I build the reporting and quality assurance tools that keep delivery consistent at scale, most recently a Power BI dashboard and an automated reporting template now used by module leads on every campus.',
    'The analysis I am most confident in is the kind that survives being questioned. That usually means segmenting a dataset until a blended average stops hiding the real story, checking whether a convincing correlation still holds once seasonality and confounders are accounted for, or reporting honestly that a model fits the history well and still cannot forecast.',
  ],
}

/**
 * The three disciplines double as the site's categorical colour system.
 * Colours come from a CVD-validated three-slot palette (validated all-pairs in
 * both light and dark mode). They are ALWAYS paired with a visible text label —
 * tourism sits below 3:1 on the light surface, so colour never carries meaning
 * alone.
 */
export const disciplines = {
  economics: {
    id: 'economics',
    label: 'Economics',
    short: 'ECON',
    blurb:
      'A BSc in Economics and an MSc in Econometrics shape how I frame a question: what is actually being measured, what would count as evidence, and what a model can and cannot claim.',
  },
  data: {
    id: 'data',
    label: 'Data Science',
    short: 'DATA',
    blurb:
      'Python, SQL, and the modelling stack are where the questions get answered. The output that matters is not the model, it is the decision someone can make because of it.',
  },
  tourism: {
    id: 'tourism',
    label: 'Tourism & Teaching',
    short: 'TOUR',
    blurb:
      'An MSc in Tourism Management and IRC-funded research on industry resilience give me the sector knowledge behind what I now teach, and the programme leadership to deliver it at scale.',
  },
}

/** Headline figures. Every number here is drawn from a real, stated outcome. */
export const metrics = [
  {
    value: 800,
    suffix: '+',
    label: 'Students per delivery cycle',
    detail:
      'The foundation year capstone module I lead, delivered to a consistent standard across every cycle.',
    discipline: 'tourism',
  },
  {
    value: 5,
    label: 'Campuses coordinated',
    detail:
      'Delivery readiness, assessment design, reporting cycles, and cross-campus logistics, kept aligned to agreed timelines.',
    discipline: 'tourism',
  },
  {
    value: 15,
    label: 'Lecturers led',
    detail:
      'A teaching team of 12 to 15, supported with standardisation meetings, marking guidance, and grading comparison materials.',
    discipline: 'economics',
  },
  {
    value: 3,
    label: 'Degrees across three fields',
    detail:
      'MSc Data Science and Econometrics, MSc Tourism Management, and BSc Economics and Business.',
    discipline: 'data',
  },
]

export const experience = [
  {
    id: 'gbs',
    start: 2025,
    startMonth: 2, // February 2025
    end: null, // null = present
    role: 'Lecturer & Module Lead',
    org: 'Global Banking School',
    location: 'London, England',
    discipline: 'tourism',
    summary:
      'Leading end-to-end delivery of a foundation year capstone module across five campuses, for a teaching team of 12 to 15 and more than 800 students each cycle.',
    points: [
      'Lead and coordinate a team of 12 to 15 lecturers across five campuses in the end-to-end delivery of a foundation year capstone module to 800+ students, ensuring consistent quality, standards, and delivery timelines throughout each cycle.',
      'Run standardisation meetings and produce marking guidance, grading comparison materials, and assessment checklists to maintain consistent delivery standards across teaching teams and campuses.',
      'Coordinate delivery readiness and manage multiple concurrent priorities, including assessment design, reporting cycles, and cross-campus logistics, working closely with academic and operational stakeholders.',
      'Support delivery across in-person teaching and online, Moodle-based components, tracking completion and engagement data to maintain quality across formats.',
      'Built a Power BI dashboard and an automated Excel reporting template adopted by all module lead staff across five campuses, giving leadership back approximately two hours per week previously spent on manual reporting.',
      'Designed and delivered training for fellow lecturers on using gamification and AI tools appropriately in the classroom, raising staff confidence with new technology across teaching teams.',
    ],
  },
  {
    id: 'stenn',
    start: 2024,
    end: 2025,
    endMonth: 1, // Ended January 2025, immediately before the lecturing role began
    role: 'Marketing Data Analyst',
    org: 'Stenn',
    orgNote: 'Fintech',
    location: 'London, England',
    discipline: 'data',
    summary:
      'Turned marketing and customer data into decisions senior stakeholders could act on, and automated the reporting behind it.',
    points: [
      'Coordinated with senior stakeholders across the business to translate marketing and customer data into strategic decision making, working to agreed reporting timelines.',
      'Built data pipelines and automated reporting processes, including a flagging system to identify report-ready periods, reducing manual overhead and improving delivery consistency.',
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
      'IRC-funded research into the resilience of the Irish tourism sector, producing a literature review and an original conceptual framework applicable to policy and industry.',
    points: [
      'Awarded IRC funding to research business resilience in the Irish tourism sector, producing a comprehensive literature review and a proposed conceptual framework applicable to policy and industry.',
      'Developed a theory of resilience categorisation distinguishing backwards-thinking resilience, which aims to return to a prior state, from forwards-thinking resilience, which treats disruption as a route to adaptation and growth.',
      'Produced written research outputs and presentations communicating findings to academic and industry audiences.',
    ],
  },
  {
    id: 'imvizar',
    start: 2022,
    end: 2023,
    role: 'Growth & Development Executive',
    org: 'Imvizar',
    orgNote: 'AR start-up',
    location: 'Dublin, Ireland',
    discipline: 'tourism',
    summary:
      'Business development for an augmented reality tourism start-up, combining market analysis with client-facing communication.',
    points: [
      'Delivered consultative, client-facing pitches to prospective clients, combining data-driven market analysis with clear stakeholder communication.',
      'Analysed market trends and customer data to guide budget allocation and strategic planning for an early-stage technology company.',
    ],
  },
]

/**
 * TODO (Brina): your CV gives the institutions and grades but not the years.
 * The MSc Data Science and Econometrics dates are taken from your dissertation
 * title page (2023–2024). The other two are blank rather than guessed, and the
 * UI omits whatever is empty.
 */
export const education = [
  {
    id: 'msc-data',
    start: 2023,
    end: 2024,
    degree: 'MSc Data Science and Econometrics',
    org: 'Goldsmiths, University of London',
    discipline: 'data',
    note: 'First Class, Distinction',
  },
  {
    id: 'msc-tourism',
    start: null,
    end: null,
    degree: 'MSc Tourism Management',
    org: 'Technological University Dublin, Ireland',
    discipline: 'tourism',
    note: 'Irish Research Council Scholar · Master’s Class Representative',
  },
  {
    id: 'bsc-econ',
    start: null,
    end: null,
    degree: 'BSc Economics and Business',
    org: 'University of Kansas, USA',
    discipline: 'economics',
    note: 'First Class, Distinction · Vice President, Economics Club · Dean’s List Honor Roll',
  },
]

/**
 * TODO (Brina): the year ranges shown on your old site could not be matched to
 * these reliably, so `year` is blank. The UI omits an empty year.
 */
export const awards = [
  {
    year: '',
    title: 'Irish Research Council Scholarship',
    detail: 'Awarded by the Government of Ireland to fund tourism resilience research.',
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
    group: 'Programming & Data',
    discipline: 'data',
    items: [
      'Python',
      'R',
      'SQL',
      'Pandas',
      'NumPy',
      'Statsmodels',
      'Beautiful Soup',
      'Jupyter',
      'Google Colab',
    ],
  },
  {
    group: 'Modelling & Machine Learning',
    discipline: 'economics',
    items: [
      'ARIMA',
      'ARDL',
      'Random forests',
      'Gradient boosting',
      'KNN',
      'scikit-learn',
      'XGBoost',
      'OLS regression',
      'Forward selection',
      'Sentiment analysis',
    ],
  },
  {
    group: 'Reporting & BI',
    discipline: 'data',
    items: [
      'Power BI',
      'Excel',
      'Dashboard design',
      'Process automation',
      'KPI tracking & reporting',
    ],
  },
  {
    group: 'Programme & Delivery',
    discipline: 'tourism',
    items: [
      'Multi-site coordination',
      'Team leadership',
      'Quality standardisation',
      'Assessment design',
      'Delivery readiness',
      'Blended delivery',
      'Moodle',
    ],
  },
  {
    group: 'Stakeholder & Communication',
    discipline: 'tourism',
    items: [
      'Academic & operational liaison',
      'Client-facing communication',
      'Staff training & upskilling',
      'Public presentation',
    ],
  },
  {
    group: 'Research',
    discipline: 'economics',
    items: [
      'Literature review',
      'Conceptual framework development',
      'Policy & report writing',
      'Survey design',
      'Web scraping',
    ],
  },
]

/**
 * TODO (Brina): your 2026 CV lists only these two. The old Wix site also had
 * Google Ads Display and Google Ads Search certifications. Add them back if you
 * still want them shown.
 */
export const certifications = [
  'Python for Data Science (Codecademy)',
  'Teacher Training (Udemy)',
]

/**
 * Projects. `slug` drives the detail page URL (/projects/:slug).
 * Set `draft: true` on an entry to keep it in this file but off the site.
 *
 * Everything below is written from the actual source documents in
 * `public/files/` or, for the enquiry analysis, from its source code. Check the
 * emphasis is what you want, but the facts and findings are drawn from the work
 * itself rather than inferred from a title.
 *
 * ADDING A CHART: give a project a `chart` object and the detail page renders
 * it. Leave it off and no chart appears.
 *   chart: {
 *     kind: 'bar' | 'line',
 *     title: 'What the chart shows',
 *     source: 'Where the numbers came from',
 *     xKey: 'model',
 *     series: [{ key: 'r2', label: 'R²' }],
 *     data: [{ model: 'ARIMA', r2: 0.8 }, ...],
 *   }
 */
export const projects = [
  {
    slug: 'new-gold-rush-bitcoin',
    title: 'The New Gold Rush',
    subtitle:
      'Modelling Bitcoin volatility with economic indicators and free sentiment analysis',
    discipline: 'economics',
    year: '2024',
    kind: 'MSc dissertation',
    summary:
      'My MSc dissertation, asking whether Bitcoin can be forecast using only freely available data. It compares ARIMA, ARDL, random forests, and linear regression, and finds that the models which fit history best are the ones that fail hardest at forecasting.',
    body: [
      'Supervised by Dr V L Raju Chinthalapati in the Computing Department at Goldsmiths, University of London, this dissertation set out to build and compare predictive models for Bitcoin prices using data anyone can access for free, combining economic indicators with sentiment analysis.',
      'The comparison covers ARIMA, ARDL, random forests, and linear regression, and evaluates each one twice: in-sample against the history it was trained on, and out-of-sample against data it had never seen. That second evaluation is the whole point. Random forests and linear regression perform well within the historical data and then overfit badly, struggling to predict forward. ARIMA and a scaled ARDL model are less impressive in-sample and considerably more reliable out-of-sample.',
      'The conclusion is a methodological one rather than a trading one. In a market as volatile as Bitcoin, a model reported only on in-sample fit will look far better than it is, and hybrid approaches are the more promising direction. It is a result that argues against its own most flattering numbers, which is the part I would defend.',
    ],
    methods: [
      'Python',
      'ARIMA',
      'ARDL',
      'Random forests',
      'Linear regression',
      'Sentiment analysis',
      'Time series',
      'In-sample vs out-of-sample evaluation',
    ],
    links: [
      {
        label: 'Read the dissertation',
        href: `${FILES}new-gold-rush-bitcoin-dissertation.pdf`,
      },
    ],
  },
  {
    slug: 'cost-of-living-crime-chicago',
    title: 'Will We Eat the Rich If We Run Out of Cake?',
    subtitle: 'Analysing the cost of living’s impact on crime rates in the City of Chicago',
    discipline: 'economics',
    year: '',
    kind: 'Econometric study',
    summary:
      'An end-to-end study of whether cost-of-living pressure moves crime rates in Chicago between 2010 and 2022, built from a scraped cost-of-living series and a 1.8 million row crime dataset.',
    body: [
      'The question is old enough that Confucius has a line about it, and the study opens there deliberately: do economic conditions drive criminal behaviour, and if so, which conditions and which crimes? National-level research had found that consumer price movements predict financially motivated crime, but costs and crime both vary enormously between American cities, so a national finding does not automatically hold for any particular one.',
      'The pipeline was built in Python: cost-of-living indicators web-scraped from Numbeo, combined with a 1.8 million row Chicago crimes dataset, with feature engineering and imputation benchmarked against US inflation data to fill gaps defensibly. Crimes were grouped into drug-related, economically motivated, violent, and vulnerable populations categories so the analysis could ask which kinds of crime respond, rather than treating crime as one undifferentiated total.',
      'Analysis ran from correlation through OLS regression to random forests, gradient boosting, and KNN, with forward selection used to identify which cost-of-living factors actually carry each crime category. Some categories model very well, with adjusted R² up to 0.96, and predictors as concrete as restaurant meal price, home purchase price, and monthly net salary. Others, notably one category at 0.41, do not.',
      'Gradient boosting produced the lowest error across most crime categories, but the honest conclusion is that the mean squared errors remain far too large for the predictive model to be trusted. There simply is not enough training data at this granularity. Reporting that plainly, rather than presenting the best-looking model as a success, is the finding I stand behind.',
    ],
    methods: [
      'Python',
      'Web scraping',
      'Feature engineering',
      'Data imputation',
      'Correlation analysis',
      'OLS regression',
      'Forward selection',
      'Random forests',
      'Gradient boosting',
      'KNN',
    ],
    links: [
      {
        label: 'Read the full study',
        href: `${FILES}cost-of-living-crime-chicago.pdf`,
      },
      {
        label: 'Read the short version',
        href: `${FILES}cost-of-living-crime-chicago-summary.pdf`,
      },
    ],
  },
  {
    slug: 'tourism-resilience',
    title: 'Forwards and Backwards Thinking',
    subtitle: 'Resilience in the post-pandemic tourism industry',
    discipline: 'tourism',
    year: '',
    kind: 'Funded research',
    summary:
      'Irish Research Council funded research building a theory of resilience categorisation, separating resilience that aims to restore the old state from resilience that treats disruption as a route to growth.',
    body: [
      '“Resilience” is used across engineering, ecology, psychology, and business to mean noticeably different things, and that ambiguity matters when the word is doing policy work. This research dissects the term across those disciplines and reframes it for tourism organisations, where the post-pandemic recovery made the distinction urgent.',
      'The central contribution is a categorisation. Backwards-thinking resilience emphasises bouncing back, returning to a pre-existing state. The Latin root, resilio, literally means to jump back, and engineering definitions carry that sense directly. Forwards-thinking resilience holds that adapting to and exploiting change matters more than recovering, treating disruption as an opportunity to reach a better position than the one held before.',
      'The categorisation was introduced in the literature in 2021 but had barely been researched, with little written on what motivates an organisation toward one or the other. That gap is what the work addresses, examining business resilience frameworks and resilience measurement to build a lens through which tourism business resilience can actually be assessed rather than merely asserted.',
    ],
    methods: [
      'Literature review',
      'Conceptual framework development',
      'Theory building',
      'Policy writing',
      'Qualitative synthesis',
    ],
    links: [
      {
        label: 'Read the research',
        href: `${FILES}forwards-and-backwards-thinking-resilience.pdf`,
      },
    ],
  },
  {
    slug: 'the-eras-analysis',
    title: 'The Eras Analysis',
    subtitle: 'Analysing Taylor Swift’s discography and tour revenues',
    discipline: 'data',
    year: '',
    kind: 'Data analysis',
    summary:
      'Three linked questions about what makes a song popular, whether re-recordings outperform the originals, and whether album popularity actually translates into tour revenue. The last answer is the interesting one.',
    body: [
      'The study asks how song features affect popularity, how the re-recorded “Taylor’s Version” albums compare with their originals, and how album popularity relates to tour earnings. Swift is an unusually good case study for this because the re-recordings create something rare in cultural data: a near-controlled comparison of the same songs released twice under different circumstances.',
      'Song attributes including danceability, energy, and valence came from a Spotify API dataset, and tour figures for the Eras, Reputation, 1989, and Fearless tours were web-scraped from CNN and Statista to cover revenue, ticket sales, and show counts.',
      'No single song characteristic dominantly drives popularity, which is itself worth stating given how often one is claimed to. The re-recordings score higher in popularity than their originals, pointing at nostalgia and artist branding rather than the music having changed. The third question is where the neat story breaks down: tour revenue has risen noticeably over the years, but that rise does not track the popularity of the albums the tours feature, so the relationship between recorded popularity and live earnings is more complicated than it first appears.',
      'The write-up is candid about its own limits. Spotify popularity scores are algorithmic and updated continuously, so they capture recent trends better than historical reception, and the tour data skews toward North American figures.',
    ],
    methods: [
      'Python',
      'Web scraping',
      'Spotify API data',
      'Correlation analysis',
      'Data visualisation',
      'Exploratory analysis',
    ],
    links: [
      {
        label: 'Read the full analysis',
        href: `${FILES}the-eras-analysis.pdf`,
      },
    ],
  },
  /**
   * !! CONFIDENTIALITY CHECK BEFORE PUBLISHING !!
   * This is the Audley work in ~/GitHub/marketing-task. The client is NOT named
   * here and NO figures are quoted, deliberately: that dataset contains gross
   * booking value, media spend, AOV, and CAC broken down by market. Publishing
   * any of it on a public site is your call to make, not mine to assume.
   */
  {
    slug: 'enquiry-performance-analysis',
    title: 'Enquiry Performance Analysis',
    subtitle:
      'Where a luxury travel operator should invest its marketing budget, and where the obvious answer is wrong',
    discipline: 'data',
    year: '2025',
    kind: 'Commercial analytics',
    summary:
      'A full-year analysis of a tour operator’s enquiry funnel, from first enquiry through quote to booking, delivered as a self-contained interactive dashboard.',
    body: [
      'The commercial question was simple to state and easy to get wrong: which markets and channels deserve more budget? A surface reading of acquisition cost points one way. Segmenting the funnel properly points another.',
      'The analysis follows every enquiry through to booking, split by market, by new versus repeat client, by device, and by channel. Separating new from repeat clients matters more than any other cut here, because blending them hides both the true cost of winning a client and the true value of keeping one. A market that looks expensive on blended numbers can be a young, high-value market worth investing in rather than cutting.',
      'The paid media finding is the one I would defend hardest. A straight correlation between paid enquiries and total bookings looks convincing, but once seasonality is accounted for the relationship largely disappears: both series simply rise and fall together across the year. Treating that correlation as a delayed lift from paid activity would have justified spend the data does not support.',
      'A logistic regression fitted on a training split and scored on held-out data ranks what genuinely predicts a booking, with coefficients reported as odds ratios against a baseline so the output reads as “how much does this change the odds” rather than as an opaque score.',
      'The deliverable is a dashboard with seven views, written as plain HTML, CSS, and JavaScript with a small custom SVG chart library and no external dependencies, so it opens from a file with no install and no server.',
    ],
    methods: [
      'Python',
      'Logistic regression',
      'Odds ratios',
      'Train/test validation',
      'Attribution modelling',
      'Seasonality control',
      'Funnel analysis',
      'Cohort segmentation',
      'JavaScript',
      'SVG',
    ],
    links: [],
  },
  {
    slug: 'technology-in-the-classroom',
    title: 'Technology in the Classroom',
    subtitle:
      'Training lecturers to use gamification and AI well, and building data literacy into tourism teaching',
    discipline: 'tourism',
    year: '2025',
    kind: 'Curriculum design',
    summary:
      'A training initiative for fellow lecturers on using gamification and AI tools appropriately, alongside the activity suite that puts the approach into practice with students.',
    body: [
      'Tourism and business students do not arrive expecting to write code, and telling them they need to rarely works. The approach here is to lead with a question they already care about and let the tool be the thing that answers it. The Coding Practice with AI worksheet introduces Python through tourism data, so the point of the lesson is what you can find out once you know how to frame the question well.',
      'Not every activity is technical. The escape room sequence turns the Tourism Area Life Cycle and stakeholder impact analysis into timed team puzzles students solve to earn their break. Gap in the Market pushes them to justify an idea with evidence rather than instinct. The crossword worksheets carry a full Harvard reference list, so students practise academic sourcing while they revise definitions.',
      'The other half is training the staff. I designed and delivered sessions for fellow lecturers on using gamification and AI tools appropriately in the classroom, which raised technology confidence across teaching teams as well as student engagement. Making the case to colleagues and to faculty leadership is a different skill from teaching students, and the argument has to be concrete: which tool, for which learning outcome, and what students walk away able to do.',
    ],
    methods: [
      'Curriculum design',
      'Staff training',
      'Gamification',
      'Python',
      'Power BI',
      'Assessment design',
      'Academic referencing',
    ],
    links: [{ label: 'See all the activities', href: '#teaching', internal: true }],
  },
  {
    slug: 'module-feedback-sentiment-classifier',
    title: 'Module Feedback Sentiment Classifier',
    subtitle: 'Turning open-text student feedback into something a teaching team can act on',
    discipline: 'data',
    year: '2025',
    kind: 'Applied NLP',
    summary:
      'A Python natural language classifier that reads open-text student feedback for sentiment and recurring themes, used to brief lecturers on where to focus module improvements.',
    body: [
      'Open-text student feedback is the most useful data a module collects and the least likely to be read properly, because it arrives in volume at exactly the point in the cycle when nobody has time. Star ratings get reported instead, which tell you that something is wrong without telling you what.',
      'This classifier, built in Python in Google Colab, reads the free-text responses for sentiment and for recurring themes, so the output is not a score but a shortlist of what students actually raised and how strongly. That shortlist is what I brief lecturers on, which turns end-of-module feedback from a compliance exercise into a specific set of things to change.',
    ],
    methods: ['Python', 'Google Colab', 'Natural language processing', 'Sentiment analysis', 'Thematic analysis'],
    links: [],
  },
]

/**
 * What the site actually renders. Anything flagged `draft: true` is withheld,
 * so a half-written entry can sit in the file without appearing publicly.
 */
export const visibleProjects = projects.filter((p) => !p.draft)

/** Lecturing activities, from the teaching examples. */
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
    title: 'Teach With Tech Training',
    discipline: 'data',
    description:
      'Training for administration, lecturers, and deans on integrating technology into the classroom to enhance learning, improve engagement, and build digital skills students carry into their careers.',
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
