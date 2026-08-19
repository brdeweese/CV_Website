// Age bands in display order
export const AGE_BANDS = ['<18', '18-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'];

// Quarterly data: f = female counts per age band, m = male counts per age band
// Band order matches AGE_BANDS above: [<18, 18-24, 25-29, 30-34, 35-39, 40-44, 45-49, 50-54, 55-59, 60+]
// 0 = data suppressed / not reported that quarter
export const RAW = [
  { q: 'Q1 2013', f: [7,423,447,295,165,103,62,46,26,16],  m: [11,184,247,214,134,88,66,50,35,40]  },
  { q: 'Q2 2013', f: [6,323,345,207,115,53,58,36,19,27],   m: [7,125,190,162,95,80,49,41,21,32]   },
  { q: 'Q3 2013', f: [11,252,356,194,127,83,56,34,23,28],  m: [10,151,233,160,122,91,66,52,23,35]  },
  { q: 'Q4 2013', f: [7,599,451,309,114,82,45,34,27,27],   m: [0,231,273,185,98,76,67,36,26,26]   },
  { q: 'Q1 2014', f: [11,316,347,173,93,94,48,38,19,12],   m: [9,131,162,167,92,65,44,32,19,29]   },
  { q: 'Q2 2014', f: [0,179,162,118,56,43,20,17,9,10],     m: [0,60,97,73,47,41,17,31,8,11]       },
  { q: 'Q3 2014', f: [11,354,489,318,151,116,78,54,27,13], m: [23,173,281,246,122,111,73,57,42,31] },
  { q: 'Q4 2014', f: [16,688,553,348,148,88,77,50,20,32],  m: [12,249,283,238,115,115,83,61,36,29] },
  { q: 'Q1 2015', f: [21,409,462,297,160,88,60,44,27,11],  m: [10,157,246,199,152,85,78,49,35,31]  },
  { q: 'Q2 2015', f: [11,350,350,239,114,61,46,34,26,16],  m: [14,144,191,165,116,60,63,50,25,19]  },
  { q: 'Q3 2015', f: [15,308,331,220,127,76,59,27,19,20],  m: [17,133,215,184,118,93,64,43,23,26]  },
  { q: 'Q4 2015', f: [10,579,460,242,139,70,55,34,19,9],   m: [5,178,266,192,105,74,59,34,29,27]   },
  { q: 'Q1 2016', f: [11,385,451,305,153,92,67,37,29,21],  m: [5,147,271,211,143,103,83,43,43,23]  },
  { q: 'Q2 2016', f: [24,303,359,209,113,67,54,43,21,14],  m: [7,148,185,135,86,74,64,38,24,18]   },
  { q: 'Q3 2016', f: [9,308,429,272,138,108,72,33,33,9],   m: [13,148,296,228,166,136,95,58,30,26] },
  { q: 'Q4 2016', f: [8,546,537,287,135,83,51,46,29,10],   m: [8,182,263,217,138,85,68,48,44,21]   },
  { q: 'Q1 2017', f: [15,359,398,225,132,83,63,49,25,12],  m: [6,131,217,184,114,86,88,66,52,32]   },
  { q: 'Q2 2017', f: [10,358,396,252,144,77,66,51,17,11],  m: [11,157,223,199,121,73,70,55,32,21]  },
  { q: 'Q3 2017', f: [13,345,443,277,137,79,64,34,28,16],  m: [20,150,247,244,118,102,66,57,53,30] },
  { q: 'Q4 2017', f: [6,582,492,253,119,71,62,32,21,16],   m: [9,192,218,194,130,71,69,50,34,28]   },
  { q: 'Q1 2018', f: [17,425,452,247,153,82,67,44,21,15],  m: [7,172,256,201,115,83,73,58,30,22]   },
  { q: 'Q2 2018', f: [0,374,406,257,132,72,51,37,26,17],   m: [9,158,197,183,127,83,85,30,41,14]   },
  { q: 'Q3 2018', f: [5,318,476,268,149,66,66,30,37,19],   m: [20,155,270,216,150,63,86,45,38,20]  },
  { q: 'Q4 2018', f: [21,505,601,372,221,130,83,63,53,21], m: [20,212,349,255,182,130,92,82,50,47] },
  { q: 'Q1 2019', f: [21,473,576,363,223,122,99,79,57,22], m: [12,156,296,262,196,154,98,68,73,44] },
  { q: 'Q2 2019', f: [22,535,607,389,220,181,117,69,58,33],m: [23,192,321,271,186,135,110,80,67,42]},
  { q: 'Q3 2019', f: [32,501,660,412,219,169,140,83,37,37],m: [33,231,365,324,213,128,117,87,64,44]},
  { q: 'Q4 2019', f: [16,575,505,329,153,123,79,58,33,32], m: [25,153,232,225,132,111,85,67,54,29] },
  { q: 'Q1 2020', f: [14,428,516,339,178,125,59,53,35,21], m: [14,178,241,252,166,99,84,76,38,32]  },
  { q: 'Q2 2020', f: [0,102,101,80,53,21,20,15,7,9],       m: [0,34,34,29,30,17,17,16,10,9]        },
  { q: 'Q3 2020', f: [18,169,230,224,125,101,68,54,30,14], m: [16,48,105,168,110,74,76,59,24,20]   },
  { q: 'Q4 2020', f: [17,213,314,195,123,79,62,33,29,14],  m: [17,91,182,142,105,75,59,57,46,33]   },
  { q: 'Q1 2021', f: [8,83,225,159,80,44,41,33,24,19],     m: [11,45,131,143,87,52,28,46,17,10]    },
  { q: 'Q2 2021', f: [33,122,306,233,143,86,76,68,38,21],  m: [20,63,150,169,102,84,61,66,41,27]   },
  { q: 'Q3 2021', f: [67,483,652,416,262,165,137,99,38,41],m: [39,187,289,277,187,122,116,75,44,47]},
  { q: 'Q4 2021', f: [51,763,787,499,246,152,110,84,41,48],m: [50,267,341,286,180,113,97,81,75,58] },
  { q: 'Q1 2022', f: [49,979,879,469,233,133,75,78,42,32], m: [35,320,359,285,162,97,80,59,47,39]  },
  { q: 'Q2 2022', f: [30,576,492,328,154,137,72,58,27,34], m: [41,234,227,208,122,111,75,60,41,40] },
  { q: 'Q3 2022', f: [60,855,819,397,288,151,102,76,56,56],m: [55,340,443,319,201,166,98,80,66,61] },
  { q: 'Q4 2022', f: [28,1039,826,383,199,115,76,64,48,40],m: [42,343,322,264,180,104,83,66,44,47] },
  { q: 'Q1 2023', f: [44,789,664,407,201,141,84,69,53,38], m: [29,250,287,225,154,120,79,59,51,62] },
  { q: 'Q2 2023', f: [49,547,573,332,184,111,72,56,35,54], m: [32,239,253,190,132,90,71,56,29,65]  },
  { q: 'Q3 2023', f: [48,757,756,416,236,167,105,67,49,45],m: [52,309,390,261,174,142,105,65,64,69]},
  { q: 'Q4 2023', f: [37,1077,712,357,207,113,74,49,56,20],m: [30,325,291,242,151,102,65,58,42,42] },
  { q: 'Q1 2024', f: [38,642,583,321,190,115,61,50,34,30], m: [33,242,265,203,151,104,62,81,38,48] },
  { q: 'Q2 2024', f: [39,534,558,308,183,117,90,49,44,50], m: [49,220,277,184,141,128,87,61,44,51] },
  { q: 'Q3 2024', f: [57,699,666,331,211,114,97,72,43,34], m: [55,271,339,252,191,128,96,84,46,47] },
  { q: 'Q4 2024', f: [43,1135,769,384,186,115,79,51,31,48],m: [34,413,306,245,149,111,82,62,43,59] },
  { q: 'Q1 2025', f: [43,655,599,382,193,115,74,58,42,48], m: [36,230,263,220,154,112,71,60,31,65] },
  { q: 'Q2 2025', f: [65,555,535,388,254,173,98,71,46,50], m: [46,252,244,224,192,124,90,70,72,56] },
  { q: 'Q3 2025', f: [51,807,703,445,289,171,122,71,57,58],m: [48,365,357,271,206,175,114,88,41,61]},
  { q: 'Q4 2025', f: [38,1150,707,426,226,138,70,59,55,40],m: [39,368,287,226,182,138,88,49,49,67] },
  { q: 'Q1 2026', f: [40,668,623,358,208,112,82,54,57,54], m: [31,241,260,216,164,123,83,57,59,67] },
];

export const POLITICAL_EVENTS = [
  { quarter: 'Q4 2016', label: 'Trump Elected (1st)', abbr: 'T1 Elected',    color: '#ef4444', type: 'election',      row: 0 },
  { quarter: 'Q1 2017', label: 'Trump Inaugurated (1st)', abbr: 'T1 Inaug.', color: '#dc2626', type: 'inauguration',  row: 1 },
  { quarter: 'Q1 2020', label: 'COVID-19 Pandemic',  abbr: 'COVID-19',       color: '#f97316', type: 'pandemic',      row: 0 },
  { quarter: 'Q4 2020', label: 'Biden Elected',      abbr: 'Biden Elect.',   color: '#22c55e', type: 'election',      row: 1 },
  { quarter: 'Q1 2021', label: 'Biden Inaugurated',  abbr: 'Biden Inaug.',   color: '#16a34a', type: 'inauguration',  row: 0 },
  { quarter: 'Q4 2024', label: 'Trump Re-elected (2nd)', abbr: 'T2 Elected', color: '#ef4444', type: 'election',      row: 1 },
  { quarter: 'Q1 2025', label: 'Trump Inaugurated (2nd)', abbr: 'T2 Inaug.', color: '#dc2626', type: 'inauguration',  row: 0 },
];

// Helper: sum values in an array, optionally filtered to specific indices
function sumBands(arr, indices) {
  if (!indices) return arr.reduce((s, v) => s + v, 0);
  return indices.reduce((s, i) => s + (arr[i] ?? 0), 0);
}

// Returns chart-ready data for the trend chart
export function getTrendData(activeBands) {
  const indices = activeBands
    ? activeBands.map(b => AGE_BANDS.indexOf(b)).filter(i => i !== -1)
    : null;

  return RAW.map(({ q, f, m }) => {
    const female = sumBands(f, indices);
    const male   = sumBands(m, indices);
    return { quarter: q, female, male, total: female + male };
  });
}

// Returns aggregated totals per age band (all quarters combined)
export function getAgeBandTotals(activeBands) {
  const activeSet = activeBands ? new Set(activeBands) : null;

  return AGE_BANDS.map((band, i) => {
    if (activeSet && !activeSet.has(band)) return null;
    const female = RAW.reduce((s, { f }) => s + f[i], 0);
    const male   = RAW.reduce((s, { m }) => s + m[i], 0);
    return { band, female, male, total: female + male };
  }).filter(Boolean);
}

// Returns gender gap data per quarter (totals across selected bands)
export function getGenderGapData(activeBands) {
  return getTrendData(activeBands).map(({ quarter, female, male }) => ({
    quarter,
    female,
    male,
    gap: female - male,
    pct: male > 0 ? Math.round(((female - male) / male) * 100) : 0,
  }));
}

// Returns per-age-band average gap across all quarters
export function getAgeBandGapTotals() {
  return AGE_BANDS.map((band, i) => {
    const female = RAW.reduce((s, { f }) => s + f[i], 0);
    const male   = RAW.reduce((s, { m }) => s + m[i], 0);
    return { band, female, male, gap: female - male };
  });
}

// Summary statistics for the stats cards
export function getSummaryStats(activeBands) {
  const trend = getTrendData(activeBands);
  const totalFemale = trend.reduce((s, d) => s + d.female, 0);
  const totalMale   = trend.reduce((s, d) => s + d.male, 0);
  const total       = totalFemale + totalMale;

  const peakQ = trend.reduce((best, d) => d.total > best.total ? d : best, trend[0]);
  const peakGapQ = trend.reduce((best, d) => (d.female - d.male) > (best.female - best.male) ? d : best, trend[0]);
  const latest = trend[trend.length - 1];

  return {
    total,
    totalFemale,
    totalMale,
    femalePct: total > 0 ? ((totalFemale / total) * 100).toFixed(1) : 0,
    peakQuarter: peakQ.quarter,
    peakTotal: peakQ.total,
    peakGapQuarter: peakGapQ.quarter,
    peakGap: peakGapQ.female - peakGapQ.male,
    latestQuarter: latest.quarter,
    latestTotal: latest.total,
  };
}
