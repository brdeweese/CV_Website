/**
 * The six classroom activities, drawn small.
 *
 * Each one shows what its activity looks like, so a tile says what it is before
 * the label is read. They live here rather than beside one of the places that
 * uses them, because both the project page and the home page need the same set.
 */

/* ---- The drawings on the activity tiles ----------------------------------- */

function MiniImpacts() {
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      {[8, 26, 44].map((y, i) => (
        <g key={y}>
          <rect className="tt-mFill" x="8" y={y} width="62" height="14" rx="7" />
          <rect
            className={`tt-mTint tt-mTint--${i}`}
            x="76"
            y={y}
            width="36"
            height="14"
            rx="7"
          />
        </g>
      ))}
    </svg>
  )
}

function MiniButler() {
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      <path className="tt-mAxis" d="M12 8V54H110" />
      <path className="tt-mCurve" d="M16 50C36 48 48 34 66 24C82 15 96 13 104 13" />
      <path className="tt-mLead" d="M66 24V40" />
      <circle className="tt-mDot" cx="66" cy="24" r="4.5" />
      <rect className="tt-mBox" x="44" y="40" width="44" height="12" rx="5" />
    </svg>
  )
}

function MiniCrossword() {
  const cells = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [1, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
  ]
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      {cells.map(([c, r]) => (
        <rect
          key={`${c}-${r}`}
          className="tt-mCell"
          x={18 + c * 17}
          y={8 + r * 17}
          width="15"
          height="15"
          rx="2"
        />
      ))}
      <text className="tt-mLetter" x={18 + 1 * 17 + 7.5} y={8 + 7.5 + 4}>
        D
      </text>
      <text className="tt-mLetter" x={18 + 2 * 17 + 7.5} y={8 + 2 * 17 + 7.5 + 4}>
        A
      </text>
    </svg>
  )
}

function MiniTrolley() {
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      <path className="tt-mAxis" d="M8 38H112" />
      <path className="tt-mAxis" d="M54 38C74 40 88 48 112 54" />
      <path className="tt-mLead" d="M54 38L64 22" />
      <circle className="tt-mDot" cx="64" cy="22" r="4.5" />
      <rect className="tt-mCar" x="8" y="24" width="26" height="14" rx="3" />
      <circle className="tt-mWheel" cx="16" cy="39" r="3.5" />
      <circle className="tt-mWheel" cx="27" cy="39" r="3.5" />
    </svg>
  )
}

function MiniTrade() {
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      <g className="tt-mPaper tt-mPaper--0" transform="translate(26 34) rotate(-12)">
        <rect x="-14" y="-14" width="28" height="28" rx="3" />
      </g>
      <g className="tt-mPaper tt-mPaper--1" transform="translate(60 26) rotate(8)">
        <path d="M0 -16L14 10H-14Z" />
      </g>
      <g className="tt-mPaper tt-mPaper--2" transform="translate(94 36)">
        <circle r="14" />
      </g>
      <path className="tt-mArc" d="M28 12C46 2 64 2 80 10" />
    </svg>
  )
}

function MiniPython() {
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      <path className="tt-mAxis" d="M40 10V54H112" />
      <path className="tt-mCurve" d="M46 46C58 44 66 30 78 26C90 22 100 20 108 18" />
      <path className="tt-mLead" d="M46 36C58 34 70 40 82 34C94 28 100 34 108 30" />
      <circle className="tt-mDot" cx="22" cy="32" r="11" />
      <path className="tt-mPlay" d="M18.5 27L27 32L18.5 37Z" />
    </svg>
  )
}

export const GAME_ART = [
  { id: 'python', name: 'Coding practice with AI', Art: MiniPython },
  { id: 'butler', name: "Pin the tail on Butler's curve", Art: MiniButler },
  { id: 'impacts', name: 'Sort the impact', Art: MiniImpacts },
  { id: 'crossword', name: 'Key word crossword', Art: MiniCrossword },
  { id: 'trolley', name: 'The ethical dilemma', Art: MiniTrolley },
  { id: 'trade', name: 'The international trade game', Art: MiniTrade },
]
