/**
 * Out-of-sample forecast error by model, from the MSc dissertation
 * "The New Gold Rush" (Figures 19 and 20). Each model was fitted on the
 * historical data, then asked to predict 30 days it had never seen.
 *
 * Lower is better on all three metrics.
 *   mae  Mean absolute error, in USD
 *   rmse Root mean squared error, in USD
 *   mse  Mean squared error, in USD squared (hence the very large numbers)
 */
export const BTC_MODELS = [
  { model: 'ARIMA', mae: 2596.01, rmse: 3148.56, mse: 9913447 },
  { model: 'Scaled ARDL', mae: 2678.04, rmse: 3078.59, mse: 9477730 },
  { model: 'Linear Regression', mae: 3662.73, rmse: 4408.68, mse: 19436490 },
  { model: 'ARDL', mae: 9202.01, rmse: 9420.56, mse: 88746870 },
  { model: 'Random Forest', mae: 10867.28, rmse: 11672.69, mse: 136251600 },
]

export const BTC_METRICS = [
  { key: 'mae', label: 'MAE', hint: 'Mean absolute error, USD' },
  { key: 'rmse', label: 'RMSE', hint: 'Root mean squared error, USD' },
  { key: 'mse', label: 'MSE', hint: 'Mean squared error, USD²' },
]
