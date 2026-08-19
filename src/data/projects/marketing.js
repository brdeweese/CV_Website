/**
 * Derived figures from the enquiry performance analysis.
 *
 * DELIBERATELY RELATIVE. Everything here is a share, a rate, or a ratio. No
 * absolute revenue, media spend, order value, or acquisition cost appears, and
 * the client is not named, so the analytical findings are shown without
 * publishing anyone's commercial numbers. If you are ever cleared to show the
 * absolutes, they can be swapped in without touching the charts.
 */

/** Share of the year's total held by new versus repeat clients, in percent. */
export const CLIENT_MIX = [
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
 * The US market measured against the UK, as a percentage difference. Positive
 * means the US is higher. Expressed as a difference rather than in currency so
 * no actual order value or acquisition cost is published.
 */
export const MARKET_VS_UK = [
  { metric: 'Order value', pct: 31 },
  { metric: 'Acquisition cost', pct: 84 },
  { metric: 'Conversion rate', pct: -15 },
]
