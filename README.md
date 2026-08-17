# Brina DeWeese — CV website

Personal site for Brina DeWeese, MSc: Lecturer and Data Scientist working across
economics, data science, and tourism.

Built with React + Vite. Deploys to GitHub Pages.

## Running it locally

```bash
npm install
npm run dev
```

The dev server prints a URL ending in `/CV_Website/` (that path comes from the
`base` setting, which has to match the repo name for GitHub Pages).

Other commands:

```bash
npm run build
npm run preview
```

## Editing content

**Almost everything lives in one file: [`src/data/cv.js`](src/data/cv.js).**
Experience, education, awards, skills, projects, and teaching activities are all
plain JavaScript objects there. Change the text, save, and the site updates. You
should not need to touch a component to update your CV.

The two exceptions:

- The large hero sentence is in `src/pages/Home.jsx`, because individual words
  inside it are highlighted and that needs markup.
- Section names and numbering are the `sections` array at the bottom of `cv.js`.

### Things marked TODO

`cv.js` has several `TODO (Brina)` comments where the old Wix site did not state
a fact and it would have been wrong to guess:

- **Education**: degree names are there, but awarding institutions and years are
  blank.
- **Awards**: the old site showed five achievements against four year ranges in
  an ambiguous layout, so years are blank.
- **Project years**: blank for the projects that never listed one.
- **CV download**: `profile.cvUrl` is empty, so no download button renders. The
  Wix-hosted CV is out of date, and the 2026 .docx carries your mobile number in
  the header, which is worth removing before putting it on a public page. Export
  a phone-free PDF to `public/files/brina-deweese-cv.pdf` and point `cvUrl` at it.

### The enquiry performance analysis

It names no client and quotes no figures, deliberately. That dataset contains
gross booking value, media spend, AOV, and CAC broken down by market. Whether
any of it can appear on a public site is your call, so the entry describes
method only. If you are cleared to name the client and show results, both can be
added, including a chart.

### Project source documents

Project write-ups are drawn from the PDFs in `public/files/`, which are served
from this repo so nothing depends on the old Wix site staying up.

One caveat: `the-eras-analysis.pdf` is **22.5 MB**, because it is a scanned
image-based PDF rather than text. It works, but it is a slow download on mobile.
Re-exporting it as a text PDF would cut it dramatically.

Any field left blank is simply omitted by the UI rather than rendering an empty
label.

### Adding a chart to a project

Give a project a `chart` object in `cv.js` and the detail page renders it. Leave
it off and no chart appears, so nothing is ever invented:

```js
chart: {
  kind: 'bar',              // 'bar' or 'line'
  title: 'What it shows',
  source: 'Where the numbers came from',
  xKey: 'year',
  series: [{ key: 'rate', label: 'Crime rate' }],
  data: [{ year: 2015, rate: 12 }, { year: 2016, rate: 14 }],
}
```

Recharts is code-split, so it is only downloaded on a page that actually has a
chart.

### Hosting your PDFs in the repo

The CV and project PDFs currently link to the **old Wix site**, so they break if
that site is taken down. To move them here, drop the files into `public/files/`
and change the link in `cv.js` to:

```js
href: `${import.meta.env.BASE_URL}files/your-file.pdf`
```

## Design notes

The three disciplines (economics, data science, tourism) double as the site's
categorical colour system, used consistently across tags, timeline bars, section
accents, and charts.

Those three colours were checked with a palette validator and pass every gate in
both light and dark mode, including separation under colour-vision deficiency.
Two consequences worth preserving if you change the colours:

1. A discipline colour is **never** the only thing carrying meaning. It always
   appears beside a text label, because the tourism green sits below a 3:1
   contrast ratio against the light background.
2. Light and dark mode use different shades of the same three hues, chosen for
   each background rather than flipped automatically.

Dark mode follows the operating system by default and the toggle in the header
overrides it, remembered in `localStorage`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages.

**One-time setup:** in the repo, go to Settings → Pages → Build and deployment,
and set **Source** to **GitHub Actions**. Without that the workflow cannot
publish.

The site then lives at `https://brdeweese.github.io/CV_Website/`.

The workflow copies `index.html` to `404.html`. GitHub Pages only serves static
files, so that fallback is what lets a direct link like
`/CV_Website/projects/the-eras-analysis` load instead of 404ing.

### Using a custom domain later

1. Set `base: '/'` in `vite.config.js` (the router basename follows it
   automatically).
2. Add your domain under Settings → Pages, and add a `public/CNAME` file
   containing the domain.
