/**
 * Average Spotify popularity per album, for the fourteen albums in the
 * comparison.
 *
 * Computed from taylor_swift_spotify.csv, the same 530-track export the
 * analysis used, by averaging the per-track popularity score within each
 * album. Not read off the chart image: the ordering and every value reproduce
 * the original figure.
 *
 * `tv` marks the re-recordings. It drives which instrument the bar grows out
 * of, so the distinction the analysis is about is carried by shape rather than
 * by colour, and survives both colourblindness and a greyscale print.
 *
 * `era` picks the album's own colour. Fourteen hues cannot be validated as a
 * categorical set and are not being asked to be: every bar is named on the
 * axis, so the colour identifies the era it belongs to rather than carrying
 * the reading on its own.
 */

export const ALBUMS = [
  {
    id: 'reputation',
    label: 'reputation',
    avg: 82.93,
    tracks: 15,
    era: 'reputation',
    tv: false,
  },
  { id: 'lover', label: 'Lover', avg: 82.61, tracks: 18, era: 'lover', tv: false },
  {
    id: '1989tv',
    label: '1989 (TV) deluxe',
    full: "1989 (Taylor's Version) [Deluxe]",
    avg: 79.82,
    tracks: 22,
    era: 'nineteen89',
    tv: true,
  },
  {
    id: 'speaknowtv',
    label: 'Speak Now (TV)',
    full: "Speak Now (Taylor's Version)",
    avg: 79.32,
    tracks: 22,
    era: 'speakNow',
    tv: true,
  },
  {
    id: 'redtv',
    label: 'Red (TV)',
    full: "Red (Taylor's Version)",
    avg: 74.27,
    tracks: 30,
    era: 'red',
    tv: true,
  },
  {
    id: 'evermore',
    label: 'evermore (deluxe)',
    full: 'evermore (deluxe version)',
    avg: 72.76,
    tracks: 17,
    era: 'evermore',
    tv: false,
  },
  {
    id: 'fearlesstv',
    label: 'Fearless (TV)',
    full: "Fearless (Taylor's Version)",
    avg: 71.62,
    tracks: 26,
    era: 'fearless',
    tv: true,
  },
  {
    id: 'midnights',
    label: 'Midnights (Til Dawn)',
    full: 'Midnights (The Til Dawn Edition)',
    avg: 69.61,
    tracks: 23,
    era: 'midnights',
    tv: false,
  },
  {
    id: '1989',
    label: '1989 (deluxe)',
    full: '1989 (Deluxe Edition)',
    avg: 67.16,
    tracks: 19,
    era: 'nineteen89',
    tv: false,
  },
  { id: 'debut', label: 'Taylor Swift', avg: 63.13, tracks: 15, era: 'debut', tv: false },
  {
    id: 'folklore',
    label: 'folklore: long pond',
    full: 'folklore: the long pond studio sessions (from the Disney+ special) [deluxe edition]',
    avg: 56.29,
    tracks: 34,
    era: 'folklore',
    tv: false,
  },
  {
    id: 'speaknow',
    label: 'Speak Now (deluxe)',
    full: 'Speak Now (Deluxe Edition)',
    avg: 52.8,
    tracks: 20,
    era: 'speakNow',
    tv: false,
  },
  {
    id: 'red',
    label: 'Red (deluxe)',
    full: 'Red (Deluxe Edition)',
    avg: 47.86,
    tracks: 22,
    era: 'red',
    tv: false,
  },
  {
    id: 'fearless',
    label: 'Fearless (platinum)',
    full: 'Fearless Platinum Edition',
    avg: 45.95,
    tracks: 19,
    era: 'fearless',
    tv: false,
  },
]

/**
 * The four albums that exist in both forms. Every re-recording outscores the
 * original it replaced, which is the analysis's second finding, so the pairs
 * are worth naming rather than leaving the reader to spot them.
 */
export const PAIRS = [
  { era: 'fearless', original: 'fearless', tv: 'fearlesstv' },
  { era: 'speakNow', original: 'speaknow', tv: 'speaknowtv' },
  { era: 'red', original: 'red', tv: 'redtv' },
  { era: 'nineteen89', original: '1989', tv: '1989tv' },
]
