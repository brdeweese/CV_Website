/**
 * The Coding Practice with AI worksheet, as a runnable notebook.
 *
 * Every number on the page is derived here from the raw dataset in the
 * worksheet, rather than transcribed from its printed output. The correlation
 * matrix, the three month moving average, the spending per visit column and
 * both January 2020 forecasts are computed the same way the Python does, so
 * the chart and the notebook output cannot drift apart from the data.
 *
 * Sources for the data, as given on the worksheet:
 *   Salas, E.B. (2025) England: Monthly mean temperature 2025, Statista.
 *   Horsfield, G. (2020) Overseas travel and tourism: November and December
 *   2019 provisional results, Office for National Statistics.
 */

export const MONTHS = [
  'Dec-18',
  'Jan-19',
  'Feb-19',
  'Mar-19',
  'Apr-19',
  'May-19',
  'Jun-19',
  'Jul-19',
  'Aug-19',
  'Sep-19',
  'Oct-19',
  'Nov-19',
  'Dec-19',
]

export const TEMPERATURE = [6.5, 3.8, 6.5, 7.7, 8.8, 11, 14.2, 17.5, 17, 14.1, 10, 6.1, 5.6]

export const VISITS = [
  28.66, 26.93, 22.54, 30.09, 31.33, 33.31, 35.81, 40.12, 41.68, 31.79, 34.3, 29.2, 32.1,
]

export const SPENDING = [
  16.74, 14.63, 11.54, 16.46, 16.64, 21.39, 24.29, 28.76, 31.44, 24.1, 23.2, 19.4, 23.1,
]

/** Overseas visitors to the UK in January 2020: 3 million, so 30 in 100k units. */
export const ACTUAL_JAN_20 = 30.0

export const SERIES = [
  { key: 'temperature', label: 'Temperature (°C)', values: TEMPERATURE },
  { key: 'visits', label: 'Tourist visits (100k)', values: VISITS },
  { key: 'spending', label: 'Spending (£100m)', values: SPENDING },
]

/* ---- The maths the notebook does ------------------------------------------ */

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length

function pearson(a, b) {
  const ma = mean(a)
  const mb = mean(b)
  let p = 0
  let qa = 0
  let qb = 0
  for (let i = 0; i < a.length; i++) {
    p += (a[i] - ma) * (b[i] - mb)
    qa += (a[i] - ma) ** 2
    qb += (b[i] - mb) ** 2
  }
  return p / Math.sqrt(qa * qb)
}

/** df[[...]].corr(), as a 3x3 matrix in the order of SERIES. */
export const CORRELATION = SERIES.map((row) =>
  SERIES.map((col) => pearson(row.values, col.values)),
)

/** df["Spending_by_Overseas_Residents_100m"] / df["Overseas_Visits_to_UK_100k"] */
export const SPEND_PER_VISIT = VISITS.map((v, i) => SPENDING[i] / v)

/** .rolling(window=3).mean(), so the first two months have no value. */
export const MOVING_AVERAGE = VISITS.map((_, i) =>
  i < 2 ? null : (VISITS[i] + VISITS[i - 1] + VISITS[i - 2]) / 3,
)

/** LinearRegression().fit(month_number, visits), then predict month 14. */
function linearTrend() {
  const x = VISITS.map((_, i) => i + 1)
  const mx = mean(x)
  const my = mean(VISITS)
  let num = 0
  let den = 0
  for (let i = 0; i < x.length; i++) {
    num += (x[i] - mx) * (VISITS[i] - my)
    den += (x[i] - mx) ** 2
  }
  const slope = num / den
  return { slope, intercept: my - slope * mx }
}

const TREND = linearTrend()

/** The fitted line across the observed months, for drawing. */
export const TREND_LINE = VISITS.map((_, i) => TREND.intercept + TREND.slope * (i + 1))

export const LIN_FORECAST = TREND.intercept + TREND.slope * 14
export const MA_FORECAST = (VISITS[10] + VISITS[11] + VISITS[12]) / 3

/* ---- The notebook cells ---------------------------------------------------- */

/**
 * `kind` is what running the cell produces: a dataframe, a chart or a printed
 * matrix. The code is the worksheet's, shortened only where a line would have
 * wrapped on a phone.
 */
export const CELLS = [
  {
    id: 'data',
    n: 1,
    part: 'Part 1',
    title: 'Create your dataset',
    kind: 'frame',
    code: `import pandas as pd

data = {
    "Month": ["Dec-18", "Jan-19", "Feb-19", "Mar-19", "Apr-19",
              "May-19", "Jun-19", "Jul-19", "Aug-19", "Sep-19",
              "Oct-19", "Nov-19", "Dec-19"],
    "Average_Temperature_Celsius": [6.5, 3.8, 6.5, 7.7, 8.8, 11,
        14.2, 17.5, 17, 14.1, 10, 6.1, 5.6],
    "Overseas_Visits_to_UK_100k": [28.66, 26.93, 22.54, 30.09,
        31.33, 33.31, 35.81, 40.12, 41.68, 31.79, 34.3, 29.2, 32.1],
    "Spending_by_Overseas_Residents_100m": [16.74, 14.63, 11.54,
        16.46, 16.64, 21.39, 24.29, 28.76, 31.44, 24.1, 23.2,
        19.4, 23.1]
}

df = pd.DataFrame(data)
df`,
  },
  {
    id: 'lines',
    n: 2,
    part: 'Part 2',
    title: 'Line chart',
    kind: 'lines',
    code: `import matplotlib.pyplot as plt

plt.figure(figsize=(12, 6))
plt.plot(df["Month"], df["Average_Temperature_Celsius"],
         label="Temperature (°C)", color="steelblue")
plt.plot(df["Month"], df["Overseas_Visits_to_UK_100k"],
         label="Tourist Visits (100k)", color="hotpink")
plt.plot(df["Month"], df["Spending_by_Overseas_Residents_100m"],
         label="Spending (£100m)", color="purple")
plt.xticks(rotation=45)
plt.title("Trends in Temperature, Tourist Visits, and Spending")
plt.legend()
plt.tight_layout()
plt.show()`,
  },
  {
    id: 'corr',
    n: 3,
    part: 'Part 5',
    title: 'Correlation',
    kind: 'matrix',
    code: `correlation = df[["Average_Temperature_Celsius",
                  "Overseas_Visits_to_UK_100k",
                  "Spending_by_Overseas_Residents_100m"]].corr()
print(correlation)`,
  },
  {
    id: 'forecast',
    n: 4,
    part: 'Parts 6 and 7',
    title: 'Forecast January 2020, then check it',
    kind: 'forecast',
    code: `from sklearn.linear_model import LinearRegression
import numpy as np

df["Month_Number"] = range(1, len(df) + 1)
X = df[["Month_Number"]].values
y = df["Overseas_Visits_to_UK_100k"].values

lin_model = LinearRegression()
lin_model.fit(X, y)
lin_forecast = float(lin_model.predict(np.array([[14]])))

df["Three_Month_MA"] = df["Overseas_Visits_to_UK_100k"] \\
    .rolling(window=3).mean()
ma_forecast = float(df["Overseas_Visits_to_UK_100k"].tail(3).mean())

# The actual figure for January 2020 was 3 million, so 30 here
plt.plot("Jan-20", 30.0, marker="o", label="Actual Jan 2020")
plt.plot("Jan-20", lin_forecast, marker="x",
         label="Linear trend forecast")
plt.plot("Jan-20", ma_forecast, marker="x",
         label="Three month MA forecast")
plt.show()`,
  },
]

/** Her challenge prompts, which are the point of the worksheet. */
export const AI_PROMPTS = [
  'How can I add number labels above the bars in my chart?',
  'How can I make the temperature line red and the spending line green in matplotlib?',
  'How do I make a pie chart in Python showing spending by month?',
]
