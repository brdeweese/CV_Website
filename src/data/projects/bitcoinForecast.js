/**
 * The 30-day out-of-sample forecast window, 23 May to 21 June 2024.
 *
 * Transcribed verbatim from cell 162 of "Dissertaion 2 Simplified.ipynb", the
 * cell that produced the actual-vs-predicted chart in the dissertation. ARIMA
 * and ARDL were fitted in R and their forecasts pasted into that notebook,
 * which is why all six series live in one hand-built dictionary there.
 *
 * Checked rather than trusted: recomputing MAE and RMSE from these series
 * reproduces the notebook's own metrics table to the cent for all five models.
 */

/** Day one of the forecast window. Every point is one day after the last. */
export const BTC_START = '2024-05-23'

export const BTC_ACTUAL = [
  67929.5625, 68526.10156, 69265.94531, 68518.09375, 69394.55469, 68296.21875,
  67578.09375, 68364.99219, 67491.41406, 67706.9375, 67751.60156, 68804.78125,
  70567.76563, 71082.82031, 70757.16406, 69342.58594, 69305.77344, 69647.99219,
  69512.28125, 67332.03125, 68241.1875, 66756.39844, 66011.09375, 66191,
  66639.04688, 66490.29688, 65140.74609, 64960.29688, 64828.65625, 64096.19922,
]

/**
 * Reveal order is worst forecaster to best, so the sequence ends on the two
 * models the dissertation concludes with. `key` matches BTC_MODELS in
 * bitcoin.js, which is where the error figures come from.
 */
export const BTC_FORECASTS = [
  {
    key: 'Random Forest',
    tone: 'rf',
    note: 'Fitted the training data almost perfectly, then produced the highest forecast error of any model tested.',
    values: [
      67527.89, 64965.55, 63295.51, 64921.25, 63320.21, 53888.84, 53896.35,
      53908.67, 54368.43, 54365.15, 53747.38, 53973.45, 58821.3, 58821.3,
      53973.45, 53973.45, 58821.3, 53973.45, 53973.45, 53973.45, 53648.34,
      53648.34, 53648.34, 58821.3, 59120.79, 58495.34, 53648.34, 53867.6,
      58715.45, 58389.49,
    ],
  },
  {
    key: 'ARDL',
    tone: 'ardl',
    note: 'Tracks the right shape but sits roughly ten thousand dollars low for the whole window.',
    values: [
      57347.09, 57975.49, 58128.83, 57977.89, 58171.41, 58251.57, 58572.49,
      58547.74, 58562.64, 58567.94, 58524.84, 58523.4, 58612.26, 58696.53,
      58746.69, 58788.18, 58810.87, 58819.61, 58845.05, 58891.07, 58940.08,
      58986.46, 59028.04, 59061, 59089.83, 59122.47, 59160.09, 59200.28,
      59241.16, 59280.48,
    ],
  },
  {
    key: 'Linear Regression',
    tone: 'lr',
    note: 'A straight line upward. The real price fell over the same period, so the gap widens every day.',
    values: [
      69989, 70095.30908, 70201.74016, 70308.2934, 70414.9689, 70521.7668,
      70628.68724, 70735.73034, 70842.89624, 70950.18506, 71057.59693,
      71165.13199, 71272.79037, 71380.5722, 71488.4776, 71596.50672,
      71704.65968, 71812.93661, 71921.33765, 72029.86293, 72138.51258,
      72247.28673, 72356.18552, 72465.20908, 72574.35753, 72683.63102,
      72793.02968, 72902.55364, 73012.20302, 73121.97798,
    ],
  },
  {
    key: 'Scaled ARDL',
    tone: 'sardl',
    note: 'The same ARDL model after scaling. The correction lifts it into the range the price actually traded in.',
    values: [
      64096.2, 64798.56, 64969.94, 64801.24, 65017.53, 65107.13, 65465.82,
      65438.15, 65454.81, 65460.73, 65412.56, 65410.95, 65510.27, 65604.45,
      65660.52, 65706.89, 65732.25, 65742.02, 65770.45, 65821.89, 65876.67,
      65928.51, 65974.98, 66011.82, 66044.04, 66080.52, 66122.57, 66167.49,
      66213.18, 66257.13,
    ],
  },
  {
    key: 'ARIMA',
    tone: 'arima',
    note: 'Lowest average error of the five. Linear, but it holds the level the price spent most of the month near.',
    values: [
      70026.42, 70051.52, 70076.63, 70101.73, 70126.84, 70151.94, 70177.04,
      70202.15, 70227.25, 70252.36, 70277.46, 70302.57, 70327.67, 70352.78,
      70377.88, 70402.99, 70428.09, 70453.2, 70478.3, 70503.41, 70528.51,
      70553.62, 70578.72, 70603.82, 70628.93, 70654.03, 70679.14, 70704.24,
      70729.35, 70754.45,
    ],
  },
]
