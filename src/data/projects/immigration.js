/**
 * US nationals registering for a UK National Insurance number, by quarter and
 * by age band. Source: UK Home Office / DWP Stat-Xplore.
 *
 * Generated from the source dashboard's dataset (53 quarters, Q1 2013 to
 * Q1 2026). `female`/`male` are counts; `pct` is how many percent more
 * women than men registered in that age band across the whole period, so a
 * negative value means more men than women.
 */

export const IMMIGRATION_QUARTERLY = [
  {"q":"Q1 2013","female":1590,"male":1069},
  {"q":"Q2 2013","female":1189,"male":802},
  {"q":"Q3 2013","female":1164,"male":943},
  {"q":"Q4 2013","female":1695,"male":1018},
  {"q":"Q1 2014","female":1151,"male":750},
  {"q":"Q2 2014","female":614,"male":385},
  {"q":"Q3 2014","female":1611,"male":1159},
  {"q":"Q4 2014","female":2020,"male":1221},
  {"q":"Q1 2015","female":1579,"male":1042},
  {"q":"Q2 2015","female":1247,"male":847},
  {"q":"Q3 2015","female":1202,"male":916},
  {"q":"Q4 2015","female":1617,"male":969},
  {"q":"Q1 2016","female":1551,"male":1072},
  {"q":"Q2 2016","female":1207,"male":779},
  {"q":"Q3 2016","female":1411,"male":1196},
  {"q":"Q4 2016","female":1732,"male":1074},
  {"q":"Q1 2017","female":1361,"male":976},
  {"q":"Q2 2017","female":1382,"male":962},
  {"q":"Q3 2017","female":1436,"male":1087},
  {"q":"Q4 2017","female":1654,"male":995},
  {"q":"Q1 2018","female":1523,"male":1017},
  {"q":"Q2 2018","female":1372,"male":927},
  {"q":"Q3 2018","female":1434,"male":1063},
  {"q":"Q4 2018","female":2070,"male":1419},
  {"q":"Q1 2019","female":2035,"male":1359},
  {"q":"Q2 2019","female":2231,"male":1427},
  {"q":"Q3 2019","female":2290,"male":1606},
  {"q":"Q4 2019","female":1903,"male":1113},
  {"q":"Q1 2020","female":1768,"male":1180},
  {"q":"Q2 2020","female":408,"male":196},
  {"q":"Q3 2020","female":1033,"male":700},
  {"q":"Q4 2020","female":1079,"male":807},
  {"q":"Q1 2021","female":716,"male":570},
  {"q":"Q2 2021","female":1126,"male":783},
  {"q":"Q3 2021","female":2360,"male":1383},
  {"q":"Q4 2021","female":2781,"male":1548},
  {"q":"Q1 2022","female":2969,"male":1483},
  {"q":"Q2 2022","female":1908,"male":1159},
  {"q":"Q3 2022","female":2860,"male":1829},
  {"q":"Q4 2022","female":2818,"male":1495},
  {"q":"Q1 2023","female":2490,"male":1316},
  {"q":"Q2 2023","female":2013,"male":1157},
  {"q":"Q3 2023","female":2646,"male":1631},
  {"q":"Q4 2023","female":2702,"male":1348},
  {"q":"Q1 2024","female":2064,"male":1227},
  {"q":"Q2 2024","female":1972,"male":1242},
  {"q":"Q3 2024","female":2324,"male":1509},
  {"q":"Q4 2024","female":2841,"male":1504},
  {"q":"Q1 2025","female":2209,"male":1242},
  {"q":"Q2 2025","female":2235,"male":1370},
  {"q":"Q3 2025","female":2774,"male":1726},
  {"q":"Q4 2025","female":2909,"male":1493},
  {"q":"Q1 2026","female":2256,"male":1301},
]

export const IMMIGRATION_AGE_GAP = [
  {"band":"<18","pct":10.3},
  {"band":"18-24","pct":162.5},
  {"band":"25-29","pct":100.5},
  {"band":"30-34","pct":44.7},
  {"band":"35-39","pct":20.2},
  {"band":"40-44","pct":5},
  {"band":"45-49","pct":-4.3},
  {"band":"50-54","pct":-10.9},
  {"band":"55-59","pct":-16.3},
  {"band":"60+","pct":-27},
]
