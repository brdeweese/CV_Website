/**
 * Fails the build if a standalone activity under /labs has stopped shipping.
 *
 * The Introduction to Excel activity is a single self-contained page that is
 * sent out as a direct link, so its address has to keep working across every
 * future deploy. The site links to it from three places and nothing in the
 * build would complain if the file simply went missing: the links would
 * compile, the page would deploy, and the link would 404 silently.
 *
 * So this runs after the build and checks both ends. Every /labs/ address the
 * built bundle mentions has to exist in dist, and the addresses that have
 * already been handed out have to be among them.
 *
 * Runs as the build's postbuild step, which means a GitHub Actions deploy
 * stops here rather than publishing a broken link.
 */

import fs from 'node:fs'
import path from 'node:path'

const DIST = 'dist'
const BASE = '/CV_Website/'

/* Addresses that have been sent to someone and can never move. The redirect is
   on the list because an earlier version of the activity was published there. */
const PROMISED = [
  { dir: 'introduction-to-excel', minBytes: 50_000 },
  { dir: 'care-and-stay', minBytes: 300, redirectsTo: 'introduction-to-excel' },
]

const problems = []

/** Every labs address the compiled app asks for. */
function linkedLabs() {
  const found = new Set()
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        /* The labs pages are themselves full of markup; scanning them would
           only find their own address. */
        if (full.split(path.sep).join('/') === `${DIST}/labs`) continue
        walk(full)
        continue
      }
      if (!/\.(js|html|css)$/.test(e.name)) continue
      const src = fs.readFileSync(full, 'utf8')
      for (const m of src.matchAll(/labs\/([a-z0-9-]+)\//g)) found.add(m[1])
    }
  }
  walk(DIST)
  return found
}

function checkPage(dir, minBytes) {
  const file = path.join(DIST, 'labs', dir, 'index.html')
  if (!fs.existsSync(file)) {
    problems.push(`missing: ${file}`)
    return null
  }
  const html = fs.readFileSync(file, 'utf8')
  const bytes = Buffer.byteLength(html)
  if (bytes < minBytes) {
    problems.push(
      `too small to be the activity: ${file} is ${bytes} bytes, expected at least ${minBytes}`,
    )
  }
  return html
}

for (const { dir, minBytes, redirectsTo } of PROMISED) {
  const html = checkPage(dir, minBytes)
  if (!html) continue
  /* Relative, so it survives the base path changing. */
  if (redirectsTo && !html.includes(`../${redirectsTo}/`)) {
    problems.push(`${dir} no longer redirects to ${redirectsTo}`)
  }
}

/* The activity itself: it has to be the activity, and it has to stay offline
   and anonymous, because it is published at a bare address with no site
   around it. */
const excel = fs.existsSync(path.join(DIST, 'labs/introduction-to-excel/index.html'))
  ? fs.readFileSync(path.join(DIST, 'labs/introduction-to-excel/index.html'), 'utf8')
  : ''
if (excel) {
  if (!/<h1[^>]*>\s*Introduction to Excel\s*</.test(excel)) {
    problems.push('the activity page has lost its Introduction to Excel heading')
  }
  if (!excel.includes('invented for teaching')) {
    problems.push('the activity page has lost the note saying the reviews are invented')
  }
  /* A page that reaches out would be loading something that may not be there,
     and the whole point of the file is that it works from the address alone. */
  for (const [re, what] of [
    [/<script[^>]+\bsrc\s*=/i, 'an external script'],
    [/<link[^>]+\bhref\s*=\s*["']https?:/i, 'an external stylesheet'],
    [/\b(fetch|XMLHttpRequest|importScripts)\s*\(/, 'a network call'],
  ]) {
    if (re.test(excel)) problems.push(`the activity page now has ${what} in it`)
  }
}

/* Anything the app links to and the build does not ship. */
const promised = new Set(PROMISED.map((p) => p.dir))
for (const dir of linkedLabs()) {
  if (!fs.existsSync(path.join(DIST, 'labs', dir, 'index.html'))) {
    problems.push(`the site links to ${BASE}labs/${dir}/ but dist has no such page`)
  } else if (!promised.has(dir)) {
    /* Not a failure. A new activity simply has not been added to the list of
       addresses that must survive, which is worth saying out loud once. */
    console.log(
      `note: ${BASE}labs/${dir}/ ships but is not on the list of promised addresses`,
    )
  }
}

if (problems.length) {
  console.error('\nThe standalone activities under /labs did not survive this build:\n')
  for (const p of problems) console.error(`  - ${p}`)
  console.error('\nThese addresses have been sent out and have to keep working.\n')
  process.exit(1)
}

console.log(`labs check passed: ${PROMISED.map((p) => p.dir).join(', ')}`)
