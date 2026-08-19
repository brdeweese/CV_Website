/**
 * Segment figures behind the funnel and the market comparison.
 *
 * The funnel is stated per 100 enquiries, which is the natural basis: of every
 * 100 enquiries, this many reach a quote and this many become a booking.
 *
 * Order value and acquisition cost are the real figures in GBP. An index with
 * the UK pinned at 100 was tried and abandoned: it reads as though the UK books
 * are worth 100 pounds, which is worse than showing nothing. These are real
 * commercial numbers for a real operator, shown unattributed.
 *
 * Keys are market|client: All, UK or US, then All, New or Repeat.
 */

export const FUNNEL_SEGMENTS = {
  "All|All": {
    "e2q": 51.3,
    "q2b": 25.6,
    "e2b": 13.1
  },
  "All|New": {
    "e2q": 42.9,
    "q2b": 15.3,
    "e2b": 6.6
  },
  "All|Repeat": {
    "e2q": 66,
    "q2b": 37.2,
    "e2b": 24.6
  },
  "UK|All": {
    "e2q": 50.9,
    "q2b": 26.9,
    "e2b": 13.7
  },
  "UK|New": {
    "e2q": 43.5,
    "q2b": 17.1,
    "e2b": 7.4
  },
  "UK|Repeat": {
    "e2q": 63.8,
    "q2b": 38.7,
    "e2b": 24.7
  },
  "US|All": {
    "e2q": 52.2,
    "q2b": 22.4,
    "e2b": 11.7
  },
  "US|New": {
    "e2q": 41.2,
    "q2b": 10.8,
    "e2b": 4.4
  },
  "US|Repeat": {
    "e2q": 71.2,
    "q2b": 33.9,
    "e2b": 24.1
  }
}

export const MARKET_SEGMENTS = {
  "All": {
    "aov": {
      "UK": 15997,
      "US": 20939
    },
    "cac": {
      "UK": 894,
      "US": 1647
    }
  },
  "New": {
    "aov": {
      "UK": 12266,
      "US": 15330
    },
    "cac": {
      "UK": 1057,
      "US": 1881
    }
  },
  "Repeat": {
    "aov": {
      "UK": 17961,
      "US": 22703
    },
    "cac": {
      "UK": 478,
      "US": 993
    }
  }
}
