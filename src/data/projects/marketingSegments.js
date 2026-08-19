/**
 * Segment figures behind the funnel and the market comparison.
 *
 * DELIBERATELY RELATIVE, like the rest of this project. The funnel is stated
 * per 100 enquiries, and order value and acquisition cost are indexed with the
 * UK at 100. That is exactly what both visuals encode anyway, since each scales
 * against its own maximum, so nothing is lost by not printing the absolutes.
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
      "UK": 100,
      "US": 131
    },
    "cac": {
      "UK": 100,
      "US": 184
    }
  },
  "New": {
    "aov": {
      "UK": 100,
      "US": 125
    },
    "cac": {
      "UK": 100,
      "US": 178
    }
  },
  "Repeat": {
    "aov": {
      "UK": 100,
      "US": 126
    },
    "cac": {
      "UK": 100,
      "US": 208
    }
  }
}
