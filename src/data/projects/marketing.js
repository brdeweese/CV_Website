/**
 * Derived figures from the enquiry performance analysis.
 *
 * DELIBERATELY RELATIVE. Everything here is a share, a rate, or a percentage
 * difference. No absolute revenue, media spend, order value, or acquisition
 * cost appears, and the client is not named, so the findings are shown without
 * publishing anyone's commercial data. If you are ever cleared to show the
 * absolutes, they can be swapped in without touching the charts.
 */

/**
 * Share held by new versus repeat clients, in percent.
 * Ordered so the story reads left to right: the spend goes one way, the
 * revenue comes back the other.
 */
export const CLIENT_MIX = [
  { stage: 'Media spend', new: 84.6, repeat: 15.4 },
  { stage: 'Enquiries', new: 63.5, repeat: 36.5 },
  { stage: 'Bookings', new: 31.8, repeat: 68.2 },
  { stage: 'Revenue', new: 23.7, repeat: 76.3 },
]

/** Conversion rates through the funnel, in percent. */
export const CONVERSION = [
  { stage: 'Enquiry to quote', new: 42.9, repeat: 66.0 },
  { stage: 'Quote to booking', new: 15.3, repeat: 37.2 },
  { stage: 'Enquiry to booking', new: 6.6, repeat: 24.6 },
]

/**
 * The US market measured against the UK, as a percentage difference.
 * Positive means the US is higher.
 */
export const MARKET_VS_UK = [
  { metric: 'Order value', pct: 31 },
  { metric: 'Acquisition cost', pct: 84 },
  { metric: 'Conversion rate', pct: -15 },
]
