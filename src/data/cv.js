/**
 * Single source of truth for every piece of content on the site.
 * Edit this file to update the site — no component changes needed.
 *
 * Content is drawn from the 2026 CV and from the five project documents in
 * `public/files/`. Where a fact was not stated in either, the field is left
 * empty and the UI omits it, rather than being filled with a guess.
 */

/** PDFs are served from the repo, so nothing depends on the old Wix site. */
import {
  IMMIGRATION_AGE_GAP,
  IMMIGRATION_QUARTERLY,
  IMMIGRATION_RATIO,
} from './projects/immigration.js'
import { BTC_METRICS, BTC_MODELS } from './projects/bitcoin.js'
import { CLIENT_MIX, MARKET_VS_UK } from './projects/marketing.js'

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
   * The phone-free export. The earlier .docx carried a mobile number in its
   * header, so it was deliberately never published; this version carries only
   * the email, the city, and the two profile links. Empty would hide the
   * download buttons rather than render a dead one.
   */
  cvUrl: `${FILES}brina-deweese-cv-2026.pdf`,

  // NOTE: the big hero sentence is NOT here. It lives in src/pages/Home.jsx
  // because individual words inside it are highlighted, which needs markup.

  intro: [
    'I am a Lecturer and Module Lead with Master’s degrees in Data Science and Econometrics and in Tourism Management. I lead the delivery of a foundation year capstone module across five campuses, coordinating a teaching team of 12 to 15 lecturers for more than 800 students each cycle.',
    'My background is in economics, econometrics, and applied data science. I am particularly interested in doughnut economics and its practical, quantitative application to managing a tourism destination.',
    'I enjoy solving puzzles using research, data, and applied theory, and I enjoy a well-constructed dashboard that showcases data in a meaningful and impactful way. A well-made graph can tell a story.',
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
      'Economics provides the frameworks and theories for examining how governments, businesses, and people behave. Econometrics provides the statistical methods to measure those effects and test whether they hold. I hold a BSc in Economics and Business and an MSc in Data Science and Econometrics.',
  },
  data: {
    id: 'data',
    label: 'Data Science',
    short: 'DATA',
    blurb:
      'Data science covers collecting, cleaning, modelling, and presenting data. I work mainly in Python, R, and SQL, using regression, time series, and machine learning methods. I visualise in seaborn and matplotlib, and build reporting in Power BI, Excel, Quarto, and HTML data dashboards.',
  },
  tourism: {
    id: 'tourism',
    label: 'Tourism & Teaching',
    short: 'TOUR',
    blurb:
      'Tourism management covers destination planning, industry structure, and the economic and social impacts of visitors. I hold an MSc in Tourism Management and completed Irish Research Council funded research on resilience in the tourism sector. I now lecture in the subject and lead a foundation year capstone module across five campuses.',
  },
}

/** Headline figures. Every number here is drawn from a real, stated outcome. */
export const metrics = [
  {
    value: 800,
    suffix: '+',
    label: 'Students per delivery cycle',
    detail:
      'The foundation year capstone module I lead, across all five campuses.',
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
      'Translated marketing and customer data for senior stakeholders, and automated the reporting behind it.',
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
      'Matplotlib',
      'Seaborn',
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
      'Quarto',
      'HTML dashboards',
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
    // The 30-day out-of-sample forecast leads the page.
    hero: 'btc',
    title: 'The New Gold Rush',
    subtitle:
      'Comparing econometric and machine learning models for Bitcoin prices using only freely accessible data',
    intro: [
      'Bitcoin emerged as a unique financial asset in 2009 and has since attracted immense interest from both individual and institutional investors. Valued at around $1 in 2009, it grew to over $73,000 by 2024. Despite its growing acceptance, Bitcoin remains an exceptionally volatile asset, with price fluctuations that can be drastic and unexpected, often attributed to sentiment and macroeconomic changes.',
      'Much of the existing research predicts Bitcoin prices using sentiment drawn from platforms like Twitter and Reddit, but that data is difficult to access or comes with a price tag. This project aims to create a predictive model that determines Bitcoin prices by integrating only data that can be accessed for free: common economic indicators, and free sentiment data provided by augmento.ai.',
    ],
    discipline: 'economics',
    year: '2024',
    kind: 'MSc dissertation',
    layout: 'visual',
    summary:
      'My MSc dissertation. A comparative predictive framework for Bitcoin prices using ARIMA, ARDL, Random Forests, and Linear Regression, built entirely from data that can be accessed without cost.',
    takeaways: [
      'The Random Forest model demonstrated strong predictive power within the training dataset, with a very high R-squared indicating a near-perfect fit. Those same results pointed to significant overfitting, which compromised its effectiveness in forecasting future prices.',
      'The ARIMA and Scaled ARDL models emerged as the most reliable when predicting prices outside the dataset, with ARIMA slightly outperforming Scaled ARDL. Despite its linear nature, ARIMA captured overall trends with minimal noise.',
      'ARIMA and Scaled ARDL provided the most balanced performance across in-sample and out-of-sample predictions, suggesting that a combination of econometric methods with proper adjustments may be the most effective approach.',
      'The study demonstrates the feasibility of using freely accessible data to build predictive models, while also highlighting the limitations that come with relying solely on such sources.',
    ],
    visuals: [
      {
        kind: 'race',
        title: 'Out-of-sample forecast error, 30 days beyond the training data',
        source: 'Lower is better. Switch metric to re-rank',
        metrics: BTC_METRICS,
        data: BTC_MODELS,
        unitNote: 'MAE and RMSE in USD, MSE in USD squared',
        note: 'Random Forest and ARDL carry three and a half to four times the error of the leading models. ARIMA leads on mean absolute error and Scaled ARDL on the squared-error metrics, so the ranking depends on which measure is used.',
      },
    ],
    body: [
      'Supervised by Dr V L Raju Chinthalapati at Goldsmiths, University of London. Each model was fitted on the historical series and then asked to forecast 30 days beyond it, so in-sample fit and out-of-sample accuracy could be judged separately.',
      'The Linear Regression model outperformed the ARDL model within the training dataset, though it too showed signs of overfitting. The Random Forest model, despite its strong performance in training, struggled with erratic and non-representative predictions when applied to unseen data, underlining the challenges of applying machine learning techniques in highly volatile financial markets where overfitting is a persistent issue.',
      'The integration of sentiment analysis alongside traditional economic indicators offered valuable insights into Bitcoin price movements. However, further refinement is needed to fully leverage sentiment data, particularly in volatile environments where investor sentiment can shift rapidly.',
      'Moving forward, the integration of hybrid models, advanced scaling techniques, and more refined sentiment analysis presents a promising direction for future research.',
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
    // The forward-selection results lead the page.
    hero: 'cake',
    layout: 'visual',
    title: 'Will We Eat the Rich If We Run Out of Cake?',
    subtitle: 'Analysing the cost of living’s impact on crime rates in the City of Chicago',
    discipline: 'economics',
    year: '',
    kind: 'Econometric study',
    summary:
      'An end-to-end study of whether cost of living factors are associated with crime rates in Chicago between 2010 and 2022, built from a scraped cost of living series and a 1.8 million row crime dataset.',
    body: [
      'Criminal behaviour has long been a subject of fascination and debate, from Robin Hood to the question of whether you would steal a loaf of bread to feed your family. The question of what influences crime rates is not a new one. 2,600 years ago Confucius identified that inequality and insecurity are more dangerous to rulers than poverty, and the French Revolution followed the socio-economic frustrations of the peasant class: between 1741 and 1785 the real cost of living surged by 62%, and in 1789 real wages fell by 25% while the price of bread rose by 88%.',
      'Modern America shows a similar pattern. In 1980 the annual cost of living was around $25,000 against an average salary of $19,500. By 2022 the cost of living had reached $60,000, a 140% increase, while the average salary had grown to $55,000. Salary growth has not kept pace. So do fluctuations in the cost of living lead to changes in crime rates, and at what point do today’s American peasants metaphorically storm the Bastille if the proverbial cake becomes unaffordable?',
      'National research indicates that fluctuations in consumer prices strongly predict financially motivated crime in the United States, but costs and crime vary significantly between cities. Rosenfeld (2018) examined 17 US cities and found that in Chicago the influence of inflation on acquisitive crime was not statistically significant, which makes Chicago an interesting case study and points to the need to examine alternative crime types and diverse cost of living factors.',
      'The pipeline was built in Python: cost of living indicators web-scraped from Numbeo, combined with a 1.8 million row Chicago crimes dataset, with feature engineering and imputation benchmarked against US inflation data. Crimes were grouped into drug-related, economically motivated, miscellaneous, property-related, public, violent, and vulnerable populations categories, so the analysis could ask which kinds of crime respond to which cost of living factors.',
      'The study revealed significant negative correlations between economic indicators such as average rent, restaurant meal price, drink price and grocery costs, and drug-related, economically motivated, miscellaneous and property-related crime. Higher average monthly net salaries were also inversely correlated with crime rates, suggesting that improved economic conditions could lead to a decrease in crime. The mortgage interest rate ran the other way, positively correlated with crime in every category measured. Caution must be exercised in interpreting these correlations, as establishing causality requires more in-depth research.',
      'Model fit varied sharply by category, from an adjusted R² of 0.96 for property-related crime down to 0.41 for public crime. Despite challenges including reliance on crowdsourced data, discrepancies in government crime data, limited training data and high mean squared errors, the project constructed a Gradient Boosting Regressor to forecast changes in crime rates in response to cost of living fluctuations. Predictive power was constrained by those limitations, so the model is a foundation for future refinement, and the findings can still serve city planners, policymakers, and community organisations as a basis for targeted crime prevention.',
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
    // The categorisation is the contribution, so the diagram of it leads.
    hero: 'resilience',
    layout: 'visual',
    title: 'Forwards and Backwards Thinking',
    subtitle: 'Resilience in the post-pandemic tourism industry',
    discipline: 'tourism',
    year: '',
    kind: 'Funded research',
    summary:
      'Irish Research Council funded research establishing a categorisation of resilience for tourism organisations, separating models that aim to return to a pre-existing state from models that turn challenges into opportunities for growth, and arguing that existing resilience frameworks need separating to account for both.',
    body: [
      'The research dissects the multidisciplinary usage of “resilience” and frames that usage in the tourism organisational construct, establishing a categorisation of resilience, exploring business resilience frameworks, and examining a means of measuring resilience. Tourism is an industry that is highly susceptible to adversity, which increases the importance of understanding resilience as it relates to tourism.',
      'Across disciplines the core principles of resilience remain the same, and the definitions divide into two categories. Backwards-thinking resilience models and definitions focus on returning to a pre-existing state of equilibrium. Forwards-thinking resilience models and definitions focus on turning challenges into opportunities for growth and innovation, thereby creating a superior performance than was previously being experienced. This means of categorisation was introduced in 2021 by Weking, Pérez and Schaffer, though it has not been widely explored.',
      'Both categories share more than they divide on. Every definition necessitates adversity or a stressor: simply put, there has to be a reason for resilience to take place. Both include preparedness, and both include recovery, though backwards-thinking definitions treat recovery as bouncing back to previously achieved normality while forwards-thinking definitions treat it as exploiting the stressor to achieve more than was achieved before. The Latin word from which resilience derives, resilio, means to jump back (Klein, Nicholls and Thomalla, 2003), which is the sense engineering definitions carry directly.',
      'Innovation is often discussed as a necessity for forwards-thinking resilience, though Euchner (2019) flips the argument, holding that resilience is essential for innovation because innovation can itself be disruptive. Innovation carries inherent risk: Zhang, Long and von Schaewen (2021) find technological innovation effective for organisational resilience while acknowledging it can disrupt existing processes, and Duchek (2019) notes that two out of three business change initiatives fail. This is not to say that forwards-thinking businesses are more likely to succeed, and both perspectives are equally valuable to examine.',
      'The adaptation phase appears to be what separates forwards and backwards-thinking businesses. Both go through the preparation or anticipation phase, and both attempt to survive and cope through adversity, but only forwards-thinking businesses attempt to change and adapt. On that basis I argue that Duchek’s framework requires separation in order to account for the two approaches. Hepfer and Lawrence’s resilience segmentation combined with Duchek’s model, taking into consideration both backwards and forwards resilience, would provide a better understanding of business resilience.',
      'Several gaps remain. There is little information on the motivation behind forwards-thinking and backwards-thinking resilience methods. Organisational resilience literature does not include a framework that explicitly recognises the distinction. And though resilience is an important concept in tourism, there has yet to be a specific definition of tourism business resilience presented.',
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
    // The album popularity comparison leads the page.
    hero: 'eras',
    layout: 'visual',
    title: 'The Eras Analysis',
    subtitle:
      'Exploratory analysis and era-matched data visualisation across Taylor Swift’s discography and tours',
    discipline: 'data',
    year: '',
    kind: 'Data analysis',
    summary:
      'An exploratory data visualisation project across Taylor Swift’s discography, covering song features and popularity, original versus re-recorded album popularity, and album popularity against tour revenue. Each chart is coloured to match the album or era it represents.',
    body: [
      'This research into Taylor Swift’s discography addresses how her songs’ attributes impact their popularity, the comparative popularity of her original and re-recorded albums, and the relationship between album popularity and tour earnings. It is exploratory, and the design of the visuals carries as much of the work as the analysis: each chart is coloured to correspond with the album or era it represents, so the palette shifts from Fearless through Reputation to The Eras Tour and every figure reads as part of a cohesive set.',
      'Song attributes came from a Spotify API dataset, and tour figures for the Eras, Reputation, 1989, and Fearless tours were web-scraped from CNN and Statista to cover revenue, ticket sales, and show counts.',
      'No single attribute dominantly determines a song’s popularity in isolation. Instead, the popularity of a song appears to be the result of a complex combination of various characteristics. Attributes like energy, acousticness, and loudness show significant correlations with popularity, yet their predictive power is not absolute, as evidenced by the presence of high-energy but less popular songs.',
      'The strongest correlation with popularity emerges from whether a song is labelled as “Taylor’s Version”. The Taylor’s Version albums consistently exhibit strong popularity scores, surpassing their original counterparts, and all four appear in the top 10 albums. This could be attributed to the growing fan base of Taylor Swift over time, the novelty and added value of exclusive new songs in the re-releases, and the nostalgia factor associated with revisiting and re-experiencing these albums.',
      'There is not a straightforward correlation between the popularity of an album and the revenue generated from its corresponding tour. Tour revenue has increased significantly over the years, with a dramatic jump between the Reputation Tour and The Eras Tour, but this rise does not exactly mirror the trends in album popularity. The steady increase in tour revenue, despite fluctuations in album popularity, underscores that factors like the artist’s brand evolution, fan loyalty, and live performance quality play a significant role in tour success.',
      'The popularity scores used represent current aggregate scores, not a reflection of the albums’ popularity at the time of the tour, which matters for interpreting that last finding. Pricing strategies, tour venue sizes, tour length, and marketing were not utilised or discussed in this research, and each would affect revenue.',
    ],
    methods: [
      'Python',
      'Web scraping',
      'Spotify API data',
      'Correlation analysis',
      'Data visualisation',
      'Exploratory analysis',
      'Colour palette design',
    ],
    links: [
      {
        label: 'Read the full analysis',
        href: `${FILES}the-eras-analysis.pdf`,
      },
    ],
  },
  /**
   * The client is NOT named anywhere on this page. Order value and acquisition
   * cost ARE shown in pounds on the market comparison, because an index with
   * the UK pinned at 100 read as a price rather than a reference and made the
   * chart meaningless. Revenue and media spend totals are still withheld;
   * everything else on the page stays a share or a rate.
   */
  {
    slug: 'marketing-performance-dashboard',
    // The funnel and the market comparison from the original dashboard lead.
    hero: 'marketing',
    title: 'Marketing Performance Dashboard',
    subtitle:
      'Tracking the marketing funnel and weighing average order value against acquisition cost, by customer type and market',
    discipline: 'data',
    year: '2025',
    kind: 'Interactive dashboard',
    layout: 'visual',
    summary:
      'A year of enquiry data for a luxury travel operator, followed from first enquiry to booking. Around 85% of media spend is aimed at new clients; repeat clients produce 76% of revenue.',
    takeaways: [
      'Repeat clients are 36% of enquiries and 76% of revenue.',
      'Around 85% of media spend is aimed at new clients, who produce 24% of revenue.',
      'Each US booking is worth 31% more than a UK one and costs 84% more to acquire.',
      'The attribution model is flawed. All cost is assigned to a single channel, so any per-channel efficiency figure should be treated as unreliable.',
    ],
    visuals: [
      {
        kind: 'groupedBar',
        title: 'Media spend and revenue by client type',
        source: 'Share held by each client type, %',
        xKey: 'stage',
        unit: '%',
        series: [
          { key: 'new', label: 'New clients' },
          { key: 'repeat', label: 'Repeat clients' },
        ],
        data: CLIENT_MIX,
        note: 'The first and last groups are the contrast: 85% of spend is aimed at new clients, and 76% of revenue arrives from repeat ones.',
      },
      {
        kind: 'diverging',
        title: 'The US against the UK',
        source: 'Percentage difference, UK as the baseline',
        xKey: 'metric',
        valueKey: 'pct',
        valueLabel: 'Difference vs UK',
        unit: '%',
        data: MARKET_VS_UK,
        note: 'More expensive to acquire and slower to convert, but worth more per booking.',
      },
    ],
    body: [
      'A full year of enquiry data, followed from first enquiry through quote to booking, delivered as a self-contained dashboard of seven views. The client is not named.',
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
    slug: 'usa-to-uk-migration',
    // Renders the animated map from the original dashboard as the lead visual.
    hero: 'migration',
    title: 'US to UK Migration Dashboard',
    subtitle: '',
    intro: [
      'The figures are National Insurance number registrations by US nationals, published by the UK Home Office and the DWP through Stat-Xplore.',
      'A National Insurance number is required in order to work in the UK, so these registrations are used here as a proxy for Americans moving over to work.',
      'Across 53 quarters, from the start of 2013 to the start of 2026, 156,924 Americans registered. Among 18 to 34 year olds, close to twice as many were women. That ratio crossed two to one in 2021 and has stayed above it every year since.',
    ],
    discipline: 'economics',
    year: '2026',
    kind: 'Interactive dashboard',
    layout: 'visual',
    summary:
      'Every US national who registered for a UK National Insurance number from 2013 to 2026. Among young working-age adults, close to twice as many women as men.',
    takeaways: [
      'Among young working-age adults, 18 to 34, close to twice as many women as men moved from the US to the UK. The ratio crossed two to one in 2021 and has stayed there since.',
      'Women outnumbered men in all 53 quarters measured.',
      'It reverses with age. From 45 upward more men arrive than women, ending 27% more men among the over-60s.',
    ],
    visuals: [
      {
        kind: 'line',
        title: 'Women per man, ages 18 to 34',
        source: 'By calendar year. 2026 is excluded as only one quarter exists so far',
        xKey: 'year',
        zeroBased: false,
        yFormat: 'ratio',
        refLine: { y: 2, label: 'Twice as many women' },
        series: [{ key: 'ratio', label: 'Women per man', color: 'var(--fem)' }],
        data: IMMIGRATION_RATIO,
        note: 'Between 1.78 and 1.96 through the 2010s, crossing 2.0 in 2021 and holding above it every year since.',
      },
      {
        kind: 'line',
        title: 'Female registrations exceed male in all 53 quarters',
        source: 'US nationals registering for a UK National Insurance number. UK Home Office / DWP Stat-Xplore',
        xKey: 'q',
        xInterval: 3,
        xFormat: 'year',
        series: [
          { key: 'female', label: 'Female', color: 'var(--fem)' },
          { key: 'male', label: 'Male', color: 'var(--male)' },
        ],
        data: IMMIGRATION_QUARTERLY,
        note: 'The female line sits above the male line in all 53 quarters. Registrations follow a repeating within-year cycle: the second quarter is the lowest in 9 of the 13 complete years, and the fourth quarter the highest in 7.',
      },
      {
        kind: 'diverging',
        title: 'The gap reverses with age',
        source: 'Percentage more women than men registered, by age band',
        xKey: 'band',
        valueKey: 'pct',
        valueLabel: 'More women than men',
        unit: '%',
        posColor: 'var(--fem)',
        negColor: 'var(--male)',
        data: IMMIGRATION_AGE_GAP,
        note: 'Pink is a female majority, blue a male one. The headline figure is produced almost entirely by the under-35s.',
      },
    ],
    body: [
      'The dashboard is built in React. The map, the trend and the age breakdown all recompute against whichever age bands and gender are selected, so the size of the gap depends on which ages you include.',
    ],
    methods: [
      'React',
      'Data visualisation',
      'Dashboard design',
      'Cohort analysis',
      'Time series',
      'Public data',
    ],
    links: [],
  },
  {
    slug: 'technology-in-the-classroom',
    title: 'Technology in the Classroom',
    subtitle:
      'Teaching staff to use AI and digital tools, and the classroom games that put them into practice',
    discipline: 'tourism',
    year: '2025',
    kind: 'Curriculum design',
    summary:
      'Teach with Tech, a training session for fellow lecturers on bringing AI, Canva, Wix, and Trello into teaching and assessment, alongside the gamified activities I run with students.',
    body: [
      'Today’s travellers are tech-savvy and expect a seamless, personalised, and convenient travel experience, which makes a strong understanding of technology vital for anyone building a career in tourism. Digital tools are essential in the tourism and business industries, digital skills strengthen students’ CVs and employability, and the job market is more competitive than ever. As educators we have to keep up with the technologies our students will meet at work, AI included, or we cannot prepare them to enter that workforce.',
      'The session opens with two shows of hands. First: who has used Canva, Wix, Trello, ChatGPT, Tableau or Power BI, Mailchimp, or Excel in their career or their personal time. Then the same list again, but in your classroom or your assessments. The gap between the two answers is the argument. We are teachers now, but we have always been excellent learners, so the point is to learn and adapt so that our students can achieve.',
      'AI is here to stay and is rapidly transforming many industries, including education. Rather than fearing it, teachers can embrace it as a tool to enhance teaching and assessment. The session works through three examples: role play, where ChatGPT acts as a prospective client questioning a student’s ecotourism company on its sustainability and CSR policies; a business plan build, where students invent a tourism business themselves before using AI for branding, financial projections, and customer scenarios; and data science basics in Google Colab, where students plot seasonality, run a correlation and a linear regression on tourism data, and compare predicted revenue against actual.',
      'Canva, Wix, and Trello each come with a worked assessment. Students build a branding and marketing package in Canva, a multi-page destination website in Wix covering history, tourism impacts, and responsible tourism, and a Trello board marked on how they organised and tracked the project as well as on what they delivered.',
      'Not every activity is technical. The escape room sequence turns the Tourism Area Life Cycle and stakeholder impact analysis into timed team puzzles students solve to earn their break. Gap in the Market requires them to justify an idea with evidence and research. The crossword worksheets carry a full Harvard reference list, so students practise academic sourcing while they revise definitions.',
      'The aim is to equip students with the digital tools and technologies they will encounter professionally, building the confidence to adapt, thrive, and lead in a technology-driven world.',
    ],
    methods: [
      'Curriculum design',
      'Staff training',
      'Gamification',
      'Python',
      'Power BI',
      'Assessment design',
      'Academic referencing',
      'AI in education',
      'Google Colab',
      'Canva',
      'Wix',
      'Trello',
    ],
    links: [
      { label: 'Download the Teach with Tech deck', href: `${FILES}teach-with-tech.pdf` },
      { label: 'Teach with Tech resources', href: 'https://brinadeweese.wixsite.com/teachtech' },
      { label: 'See all the activities', href: '#teaching', internal: true },
    ],
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
      'Modules collect star ratings and open-text responses. The ratings give a score. The open text gives the reasons behind the score, and it arrives in volume at the end of the cycle.',
      'This classifier, built in Python in Google Colab, reads the free-text responses for sentiment and for recurring themes. It returns a shortlist of the themes students raised and how strongly they raised them. I use that shortlist to brief lecturers on where to focus module improvements.',
    ],
    methods: ['Python', 'Google Colab', 'Natural language processing', 'Sentiment analysis', 'Thematic analysis'],
    links: [],
  },
]

/**
 * What the site actually renders. Anything flagged `draft: true` is withheld,
 * so a half-written entry can sit in the file without appearing publicly.
 */
/**
 * Display order, independent of how the entries happen to sit in the array
 * above. Change the order here rather than shuffling large objects around.
 * Anything not listed falls to the end.
 */
const PROJECT_ORDER = [
  'usa-to-uk-migration',
  'marketing-performance-dashboard',
  'new-gold-rush-bitcoin',
  'cost-of-living-crime-chicago',
  'the-eras-analysis',
  'tourism-resilience',
  'technology-in-the-classroom',
  'module-feedback-sentiment-classifier',
]

export const visibleProjects = projects
  .filter((p) => !p.draft)
  .sort((a, b) => {
    const rank = (slug) => {
      const i = PROJECT_ORDER.indexOf(slug)
      return i === -1 ? Number.MAX_SAFE_INTEGER : i
    }
    return rank(a.slug) - rank(b.slug)
  })

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
