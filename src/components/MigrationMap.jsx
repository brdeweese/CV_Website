import { useRef, useEffect, useState, useCallback } from 'react';
import { feature } from 'topojson-client';
import worldTopo from 'world-atlas/countries-110m.json';
import { RAW, AGE_BANDS } from '../data/projects/immigrationRaw.js';

// ── Config ─────────────────────────────────────────────────────────────────────
const SCALE_FACTOR        = 10;
const DRAW_SPEED          = 0.07;
const SLOW_SPEED          = 0.04;  // tutorial arcs: ~25 frames each
const QUARTER_DRAW_BUDGET = 25;    // draw-in window for all quarters except Q1
const Q1_BUDGET           = 240;   // Q1 window incl. tutorial intro (~4s at 60fps)
const HOLD_QUARTER        = 3;
const FADE_SPEED          = 0.04;
const ARC_ALPHA           = 0.18;

// Outline and marker ink. The original hard-coded a navy that disappears on a
// dark surface, so it is read from CSS instead and refreshed on theme change.
let INK_SOLID = '#1e3a8a';
let INK_LINE  = 'rgba(30,58,138,0.80)';
let FEM_RGB   = '216,27,127';
let MALE_RGB  = '42,120,214';

const START_YEAR   = 2013;
const NUM_QUARTERS = RAW.length;
const NUM_YEARS    = 13;

// ── Era definitions (year-index relative to START_YEAR) ────────────────────────
const ERA_BANDS = [
  { s:4,  e:7,  color:'#ef4444', bgOp:0.10, barOp:0.22, label:"Trump's 1st Term", tc:'#991b1b' },
  { s:7,  e:8,  color:'#6b7280', bgOp:0.16, barOp:0.42, label:'COVID-19',          tc:'#374151' },
  { s:8,  e:11, color:'#2563eb', bgOp:0.08, barOp:0.18, label:'Biden Era',          tc:'#2563eb' },
  { s:12, e:12, color:'#ef4444', bgOp:0.10, barOp:0.22, label:"Trump's 2nd Term",  tc:'#991b1b' },
];

const KEY_YEARS = [
  { yi:4,  label:'Trump\nInaugurated', color:'#dc2626', row:0 },
  { yi:7,  label:'COVID-19',           color:'#9ca3af', row:1 },
  { yi:8,  label:'Biden\nInaugurated', color:'#2563eb', row:0 },
  { yi:12, label:'Trump 2nd\nTerm',    color:'#dc2626', row:1 },
];

function getPoliticalEra(yi) {
  const m = ERA_BANDS.filter(e => yi >= e.s && yi <= e.e && e.label !== 'COVID-19');
  return m.length ? m[m.length-1] : null;
}
function isCovid(yi) {
  const c = ERA_BANDS.find(e => e.label === 'COVID-19');
  return c ? (yi >= c.s && yi <= c.e) : false;
}

// year-index → first quarter-index of that year
function yiToQi(yi) { return yi * 4; }

// ── Country data ───────────────────────────────────────────────────────────────
const _countries = feature(worldTopo, worldTopo.objects.countries);
const _usa = _countries.features.find(f => String(f.id) === '840');
const _uk  = _countries.features.find(f => String(f.id) === '826');
function getPolys(f) {
  if (!f?.geometry) return [];
  const { type, coordinates } = f.geometry;
  return type === 'Polygon' ? [coordinates] : type === 'MultiPolygon' ? coordinates : [];
}

// ── Projections ────────────────────────────────────────────────────────────────
function projUSA(lat, lon, W, H) {
  // Zone width derived from height so the outline stays proportional at any canvas width.
  // Physical USA ratio at ~37°N: cos(37°)×59° / 26° ≈ 1.81:1 (wide:tall).
  const x = W * 0.03  + ((lon + 125) / 59) * (H * 0.326);  // 0.18 × 1.81
  const y = H * 0.48  + ((50 - lat)  / 26) * (H * 0.18);
  return [x, y];
}
function projUK(lat, lon, W, H) {
  const x = W * 0.87  + ((lon + 8)  / 10) * (W * 0.10);
  const y = H * 0.36  + ((61 - lat) / 12) * (H * 0.35);
  return [x, y];
}

// ── Seeded pseudo-random ───────────────────────────────────────────────────────
function sr(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// ── Arc geometry ───────────────────────────────────────────────────────────────
function arcGeom(seed, W, H) {
  const sx0 = W * 0.03 + H * 0.147, sy0 = H * 0.553;  // geographic centre of continental USA
  // Arc endpoints sit at the arrowhead base (H*0.065 ≈ 30*dpr left of tip at W*0.920)
  const ex0 = W * 0.920 - H * 0.065, ey0 = H * 0.550;
  const midX = (sx0 + ex0) / 2;
  const topY  = Math.min(sy0, ey0);
  const arcH  = H * (0.04 + sr(seed)   * 0.58);
  const cpX   = midX + (sr(seed+1) - 0.5) * W * 0.06;
  const cpY   = topY - arcH;
  const jsy   = (sr(seed+2) - 0.5) * H * 0.045;
  const jey   = (sr(seed+3) - 0.5) * H * 0.045;
  return { sx: sx0, sy: sy0 + jsy, cpX, cpY, ex: ex0, ey: ey0 + jey };
}

function drawArc(ctx, g, prog, lw, colour) {
  const steps = Math.max(3, Math.round(prog * 48));
  ctx.beginPath(); ctx.moveTo(g.sx, g.sy);
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * prog, it = 1 - t;
    ctx.lineTo(
      it*it*g.sx + 2*it*t*g.cpX + t*t*g.ex,
      it*it*g.sy + 2*it*t*g.cpY + t*t*g.ey,
    );
  }
  ctx.strokeStyle = colour; ctx.lineWidth = lw; ctx.stroke();
}

// ── Data helper ────────────────────────────────────────────────────────────────
function quarterCounts(qi, gF, bF) {
  const rec = RAW[qi];
  if (!rec) return { fRaw:0, mRaw:0, nF:0, nM:0 };
  const sF = gF !== 'Male', sM = gF !== 'Female';
  const idx = bF
    ? bF.map(b => AGE_BANDS.indexOf(b)).filter(i => i >= 0)
    : AGE_BANDS.map((_, i) => i);
  const fRaw = sF ? idx.reduce((s, bi) => s + (rec.f[bi] ?? 0), 0) : 0;
  const mRaw = sM ? idx.reduce((s, bi) => s + (rec.m[bi] ?? 0), 0) : 0;
  return {
    fRaw, mRaw,
    nF: Math.max(0, Math.round(fRaw / SCALE_FACTOR)),
    nM: Math.max(0, Math.round(mRaw / SCALE_FACTOR)),
  };
}

// ── Drawing ────────────────────────────────────────────────────────────────────
function drawScene(canvas, dims, lines) {
  const { W, H, dpr } = dims;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  // USA outline
  ctx.save();
  ctx.beginPath(); ctx.rect(W * 0.03, 0, H * 0.40, H); ctx.clip();
  if (_usa) {
    getPolys(_usa).forEach(poly => poly.forEach(ring => {
      ctx.beginPath(); let pen = false;
      for (const [lon, lat] of ring) {
        const [x, y] = projUSA(lat, lon, W, H);
        pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true;
      }
      ctx.strokeStyle = INK_LINE; ctx.lineWidth = 1.3 * dpr; ctx.stroke();
    }));
  }
  ctx.restore();

  // UK outline
  ctx.save();
  ctx.beginPath(); ctx.rect(W * 0.85, 0, W * 0.15, H); ctx.clip();
  if (_uk) {
    getPolys(_uk).forEach(poly => poly.forEach(ring => {
      ctx.beginPath(); let pen = false;
      for (const [lon, lat] of ring) {
        const [x, y] = projUK(lat, lon, W, H);
        pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true;
      }
      ctx.strokeStyle = INK_LINE; ctx.lineWidth = 1.3 * dpr; ctx.stroke();
    }));
  }
  ctx.restore();

  // Arcs — interleaved female/male render so colors blend evenly rather than
  // one color always painting over the other
  const fL = lines.filter(l => l.drawP >= 0.005 && l.type === 'f');
  const mL = lines.filter(l => l.drawP >= 0.005 && l.type === 'm');
  const maxLen = Math.max(fL.length, mL.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < fL.length) {
      const l = fL[i];
      const alpha = l.status === 'fading' ? (l.opacity * ARC_ALPHA).toFixed(2) : ARC_ALPHA.toFixed(2);
      drawArc(ctx, arcGeom(l.seed, W, H), l.drawP, 0.95 * dpr, `rgba(${FEM_RGB},${alpha})`);
    }
    if (i < mL.length) {
      const l = mL[i];
      const alpha = l.status === 'fading' ? (l.opacity * ARC_ALPHA).toFixed(2) : ARC_ALPHA.toFixed(2);
      drawArc(ctx, arcGeom(l.seed, W, H), l.drawP, 0.95 * dpr, `rgba(${MALE_RGB},${alpha})`);
    }
  }

  // Departure dot
  const dsx = W * 0.03 + H * 0.147, dsy = H * 0.553;
  ctx.fillStyle = INK_SOLID;
  ctx.beginPath(); ctx.arc(dsx, dsy, 16 * dpr, 0, Math.PI * 2); ctx.fill();

  // Arrival arrowhead
  const dex = W * 0.920, dey = H * 0.550;
  const asz = 30 * dpr;
  ctx.fillStyle = INK_SOLID;
  ctx.beginPath();
  ctx.moveTo(dex,       dey);
  ctx.lineTo(dex - asz, dey - asz * 0.55);
  ctx.lineTo(dex - asz, dey + asz * 0.55);
  ctx.closePath();
  ctx.fill();
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function MigrationMap({ gender, activeBands, setCurrentQuarterIdx }) {
  // Keep the canvas ink in step with the theme. The map paints to a bitmap, so
  // it cannot inherit CSS colours the way the rest of the page does.
  const inkHostRef = useRef(null);
  useEffect(() => {
    const read = () => {
      const el = inkHostRef.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      const solid = cs.getPropertyValue('--map-ink').trim();
      const line = cs.getPropertyValue('--map-ink-line').trim();
      const fem = cs.getPropertyValue('--fem-rgb').trim();
      const male = cs.getPropertyValue('--male-rgb').trim();
      if (solid) INK_SOLID = solid;
      if (line) INK_LINE = line;
      if (fem) FEM_RGB = fem.replace(/\s+/g, '');
      if (male) MALE_RGB = male.replace(/\s+/g, '');
    };
    read();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener?.('change', read);
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      mq.removeEventListener?.('change', read);
      mo.disconnect();
    };
  }, []);

  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const tlRef      = useRef(null);
  const isDragging = useRef(false);
  const propRef    = useRef({ gender, activeBands });

  useEffect(() => { propRef.current = { gender, activeBands }; }, [gender, activeBands]);

  useEffect(() => {
    const A = animRef.current;
    if (A.quarterIdx === undefined) return;
    rebuildForFilters(A, gender, activeBands);
  }, [gender, activeBands]); // eslint-disable-line

  function rebuildForFilters(A, gF, bF) {
    const { nF, nM, fRaw, mRaw } = quarterCounts(A.quarterIdx, gF, bF);
    A.lines = [];
    A.seedCtr = 0;
    for (let i = 0; i < nF; i++) A.lines.push({ type:'f', seed:A.seedCtr++, drawP:1, opacity:1, status:'alive', delay:0, speed:DRAW_SPEED });
    for (let i = 0; i < nM; i++) A.lines.push({ type:'m', seed:A.seedCtr++, drawP:1, opacity:1, status:'alive', delay:0, speed:DRAW_SPEED });
    A.fRaw = fRaw; A.mRaw = mRaw;
  }

  const animRef = useRef({
    playing:       true,
    manual:        false,
    quarterIdx:    0,
    lines:         [],
    seedCtr:       0,
    frameInYr:     0,
    quarterFrames: 0,
    holdCD:        0,
    tutMaleA:      0,
    tutFemA:       0,
    fRaw:          0,
    mRaw:          0,
    dims:          { W:800, H:480, dpr:1 },
  });

  const [ui, setUi] = useState({
    quarterIdx:0, playing:true, fRaw:0, mRaw:0, tutMaleA:0, tutFemA:0,
  });

  function applyDelta(A, nF, nM) {
    const aliveF = A.lines.filter(l => l.type==='f' && (l.status==='alive'||l.status==='drawing'));
    const aliveM = A.lines.filter(l => l.type==='m' && (l.status==='alive'||l.status==='drawing'));
    const addF = Math.max(0, nF - aliveF.length);
    const addM = Math.max(0, nM - aliveM.length);
    const totalNew = addF + addM;

    const drawFrames = Math.ceil(1 / DRAW_SPEED);
    const spread = totalNew > 1 ? Math.max(0, QUARTER_DRAW_BUDGET - drawFrames) : 0;
    let arcIdx = 0;
    const getDelay = () => totalNew > 1
      ? Math.round((arcIdx++ / (totalNew - 1)) * spread)
      : (arcIdx++, 0);

    // Fade excess arcs of each gender
    if (addF <= 0) aliveF.slice(nF).forEach(l => { l.status = 'fading'; });
    if (addM <= 0) aliveM.slice(nM).forEach(l => { l.status = 'fading'; });

    // Add new arcs interleaved (f, m, f, m…) so arc heights are spread across both colors
    const maxAdd = Math.max(addF, addM);
    for (let i = 0; i < maxAdd; i++) {
      if (i < addF) A.lines.push({ type:'f', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:getDelay(), speed:DRAW_SPEED });
      if (i < addM) A.lines.push({ type:'m', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:getDelay(), speed:DRAW_SPEED });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function updateDims() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W   = canvas.offsetWidth  * dpr;
      const H   = canvas.offsetHeight * dpr;
      if (!W || !H) return;
      canvas.width = W; canvas.height = H;
      animRef.current.dims = { W, H, dpr };
    }
    updateDims();

    // Seed Q1 2013 tutorial
    const A = animRef.current;
    const { gender:gF, activeBands:bF } = propRef.current;
    const { nF, nM, fRaw, mRaw } = quarterCounts(0, gF, bF);
    A.fRaw = fRaw; A.mRaw = mRaw;
    // Tutorial intro: first male line draws slowly, then first female, then the
    // remaining arcs burst in — all timed to fit within Q1_BUDGET frames.
    if (nM > 0) A.lines.push({ type:'m', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:0,   speed:SLOW_SPEED });
    if (nF > 0) A.lines.push({ type:'f', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:60,  speed:SLOW_SPEED });
    const nBurst = Math.max(0, nM-1) + Math.max(0, nF-1);
    let bi = 0;
    const burstDelay = () => nBurst > 1 ? Math.round(120 + (bi++ / (nBurst-1)) * 60) : (bi++, 120);
    for (let i = 1; i < nM; i++) A.lines.push({ type:'m', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:burstDelay(), speed:SLOW_SPEED, accel:0.03, maxSpeed:0.8 });
    for (let i = 1; i < nF; i++) A.lines.push({ type:'f', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:burstDelay(), speed:SLOW_SPEED, accel:0.03, maxSpeed:0.8 });

    let uiCtr = 0;
    function tick() {
      rafRef.current = requestAnimationFrame(tick);
      const { gender:gF, activeBands:bF } = propRef.current;
      const A = animRef.current;

      if (A.playing && !A.manual) {
        A.frameInYr++;
        A.quarterFrames++;

        A.lines.forEach(l => {
          if (l.status === 'drawing') {
            if (l.delay > 0) { l.delay--; return; }
            if (l.accel !== undefined) l.speed = Math.min(l.maxSpeed, l.speed + l.accel);
            l.drawP = Math.min(1, l.drawP + l.speed);
            if (l.drawP >= 1) l.status = 'alive';
          }
          if (l.status === 'fading') l.opacity = Math.max(0, l.opacity - FADE_SPEED);
        });
        A.lines = A.lines.filter(l => !(l.status==='fading' && l.opacity<=0));

        // Tutorial label opacity — only active during Q1
        // Male popup:   fade in at frame 8,  fade out at frame 60
        // Female popup: fade in at frame 68, fade out at frame 120
        if (A.quarterIdx === 0) {
          const qf = A.quarterFrames;
          if (qf >= 8   && qf < 60)  A.tutMaleA = Math.min(1, A.tutMaleA + 0.05);
          else                        A.tutMaleA = Math.max(0, A.tutMaleA - 0.05);
          if (qf >= 68  && qf < 120) A.tutFemA  = Math.min(1, A.tutFemA  + 0.05);
          else                        A.tutFemA  = Math.max(0, A.tutFemA  - 0.05);
        }

        const budget = A.quarterIdx === 0 ? Q1_BUDGET : QUARTER_DRAW_BUDGET;
        const readyToHold = A.quarterFrames >= budget;

        if (readyToHold) {
          if (A.holdCD===0) A.holdCD = HOLD_QUARTER;
          A.holdCD = Math.max(0, A.holdCD - 1);
          if (A.holdCD===0) {
            if (A.quarterIdx < NUM_QUARTERS-1) {
              A.quarterIdx++;
              A.quarterFrames = 0;
              const c = quarterCounts(A.quarterIdx, gF, bF);
              A.fRaw = c.fRaw; A.mRaw = c.mRaw;
              applyDelta(A, c.nF, c.nM);
              setCurrentQuarterIdx(A.quarterIdx);
            } else {
              A.playing = false;
            }
          }
        }

        if (++uiCtr >= 6) {
          uiCtr = 0;
          setUi({ quarterIdx:A.quarterIdx, playing:A.playing, fRaw:A.fRaw, mRaw:A.mRaw,
                  tutMaleA:A.tutMaleA, tutFemA:A.tutFemA });
        }
      }

      drawScene(canvas, A.dims, A.lines);
    }

    tick();
    const ro = new ResizeObserver(updateDims);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []); // eslint-disable-line

  // ── Timeline scrubbing ────────────────────────────────────────────────────────
  function jumpToQuarter(qi) {
    const A = animRef.current;
    qi = Math.max(0, Math.min(NUM_QUARTERS-1, qi));
    A.playing = false; A.manual = true; A.quarterIdx = qi; A.holdCD = 0;
    const { gender:gF, activeBands:bF } = propRef.current;
    rebuildForFilters(A, gF, bF);
    setCurrentQuarterIdx(qi);
    const c = quarterCounts(qi, gF, bF);
    setUi(prev => ({ ...prev, quarterIdx:qi, playing:false, fRaw:c.fRaw, mRaw:c.mRaw }));
  }

  function posToQuarter(clientX) {
    const rect = tlRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.round(Math.max(0, Math.min(1, (clientX-rect.left)/rect.width)) * (NUM_QUARTERS-1));
  }

  const onTLMove = useCallback((e) => { if (isDragging.current) jumpToQuarter(posToQuarter(e.clientX)); }, []); // eslint-disable-line
  const onTLUp   = useCallback(() => { isDragging.current = false; }, []);
  useEffect(() => {
    window.addEventListener('mousemove', onTLMove);
    window.addEventListener('mouseup',   onTLUp);
    return () => { window.removeEventListener('mousemove', onTLMove); window.removeEventListener('mouseup', onTLUp); };
  }, [onTLMove, onTLUp]);

  // ── Play / Pause / Restart ────────────────────────────────────────────────────
  function handlePlayPause() {
    const A = animRef.current;
    if (A.playing && !A.manual) {
      A.playing = false; setUi(p => ({...p, playing:false}));
    } else {
      A.playing = true; A.manual = false;
      if (A.quarterIdx >= NUM_QUARTERS-1) {
        A.quarterIdx=0; A.lines=[]; A.seedCtr=0; A.holdCD=0;
        A.frameInYr=0; A.quarterFrames=0; A.tutMaleA=0; A.tutFemA=0;
        const { gender:gF, activeBands:bF } = propRef.current;
        const { nF, nM } = quarterCounts(0, gF, bF);
        const c = quarterCounts(0, gF, bF); A.fRaw=c.fRaw; A.mRaw=c.mRaw;
        if (nM > 0) A.lines.push({ type:'m', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:0,   speed:SLOW_SPEED });
        if (nF > 0) A.lines.push({ type:'f', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:60,  speed:SLOW_SPEED });
        const nBurst = Math.max(0, nM-1) + Math.max(0, nF-1);
        let bi = 0;
        const burstDelay = () => nBurst > 1 ? Math.round(120 + (bi++ / (nBurst-1)) * 60) : (bi++, 120);
        for (let i = 1; i < nM; i++) A.lines.push({ type:'m', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:burstDelay(), speed:SLOW_SPEED, accel:0.03, maxSpeed:0.8 });
        for (let i = 1; i < nF; i++) A.lines.push({ type:'f', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:burstDelay(), speed:SLOW_SPEED, accel:0.03, maxSpeed:0.8 });
      }
      setUi(p => ({...p, playing:true}));
    }
  }

  function handleRestart() {
    const A = animRef.current;
    A.quarterIdx=0; A.lines=[]; A.seedCtr=0;
    A.holdCD=0; A.frameInYr=0; A.quarterFrames=0; A.playing=true; A.manual=false;
    A.tutMaleA=0; A.tutFemA=0;
    const { gender:gF, activeBands:bF } = propRef.current;
    const { nF, nM, fRaw, mRaw } = quarterCounts(0, gF, bF);
    A.fRaw=fRaw; A.mRaw=mRaw;
    // Frame 0–60:   male tutorial arc draws + popup visible for ~1 second
    // Frame 60–120: female tutorial arc draws + popup visible for ~1 second
    // Frame 120–:   remaining arcs burst in (60-frame spread)
    if (nM > 0) A.lines.push({ type:'m', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:0,   speed:SLOW_SPEED });
    if (nF > 0) A.lines.push({ type:'f', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:60,  speed:SLOW_SPEED });
    const nBurst = Math.max(0, nM-1) + Math.max(0, nF-1);
    let bi = 0;
    const burstDelay = () => nBurst > 1 ? Math.round(120 + (bi++ / (nBurst-1)) * 60) : (bi++, 120);
    for (let i = 1; i < nM; i++) A.lines.push({ type:'m', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:burstDelay(), speed:SLOW_SPEED, accel:0.03, maxSpeed:0.8 });
    for (let i = 1; i < nF; i++) A.lines.push({ type:'f', seed:A.seedCtr++, drawP:0, opacity:1, status:'drawing', delay:burstDelay(), speed:SLOW_SPEED, accel:0.03, maxSpeed:0.8 });
    setCurrentQuarterIdx(0);
    setUi({ quarterIdx:0, playing:true, fRaw, mRaw, tutMaleA:0, tutFemA:0 });
  }

  const yi           = Math.floor(ui.quarterIdx / 4);
  const year         = START_YEAR + yi;
  const quarterLabel = `Q${(ui.quarterIdx % 4) + 1}`;
  const polEra       = getPoliticalEra(yi);
  const covidActive  = isCovid(yi);
  const showF        = gender !== 'Male';
  const showM        = gender !== 'Female';
  const barPct       = (ui.quarterIdx / Math.max(NUM_QUARTERS-1, 1)) * 100;

  const cardBg = polEra
    ? `${polEra.color}${Math.round(polEra.bgOp * 255).toString(16).padStart(2,'0')}`
    : 'transparent';

  return (
    <div
      className="mmap" ref={inkHostRef}
      style={{ backgroundColor: cardBg, transition:'background-color 0.7s ease' }}
    >
      {/* ── Visualization panel ── */}
      <div className="mmap-stage">

        {/* Year + quarter — top centre */}
        <div className="mmap-year">
          <div className="mmap-year-num">{year}</div>
          <div className="mmap-year-q">{quarterLabel}</div>
        </div>

        {/* Era badges — top right */}
        <div className="mmap-eras">
          {polEra && (
            <div className="mmap-era"
              style={{ backgroundColor:polEra.color+'22', color:polEra.tc, border:`1px solid ${polEra.color}55` }}>
              {polEra.label}
            </div>
          )}
          {covidActive && (
            <div className="mmap-era"
              style={{ backgroundColor:'#6b728022', color:'#374151', border:'1px solid #6b728055' }}>
              COVID-19
            </div>
          )}
        </div>

        {/* Controls — top left */}
        <div className="mmap-controls">
          <button onClick={handlePlayPause}
            className="mmap-btn"
            title={ui.playing ? 'Pause' : 'Play'}>
            {ui.playing
              ? <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="4" height="12" rx="1"/><rect x="8" y="1" width="4" height="12" rx="1"/></svg>
              : <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><polygon points="2,1 12,7 2,13"/></svg>}
          </button>
          <button onClick={handleRestart}
            className="mmap-btn"
            title="Restart from 2013">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2 7a5 5 0 1 0 1-3.1M2 4V7h3"/>
            </svg>
          </button>
        </div>

        {/* Tutorial labels — visible only during Q1 intro */}
        {ui.tutMaleA > 0.04 && (
          <div className="mmap-tut"
            style={{ top:'48%', left:'30%', transform:'translate(-50%,-40px)', opacity:ui.tutMaleA, transition:'opacity 0.15s' }}>
            <div className="mmap-tut-inner">
              <div className="mmap-swatch" style={{ height:2, background:'var(--male)' }}/>
              <span className="mmap-tut-text">= 10 male immigrants</span>
            </div>
          </div>
        )}
        {ui.tutFemA > 0.04 && (
          <div className="mmap-tut"
            style={{ top:'52%', left:'38%', transform:'translate(-50%,-20px)', opacity:ui.tutFemA, transition:'opacity 0.15s' }}>
            <div className="mmap-tut-inner">
              <div className="mmap-swatch" style={{ height:2, background:'var(--fem)' }}/>
              <span className="mmap-tut-text">= 10 female immigrants</span>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="mmap-canvas" />

        {/* Country labels */}
        <div className="mmap-country mmap-country--usa">USA</div>
        <div className="mmap-country mmap-country--uk">🇬🇧 UK</div>

        {/* Counts */}
        <div className="mmap-counts">
          {showF && (
            <div className="mmap-count mmap-count--f">
              <p className="mmap-count-label">Female {quarterLabel} {year}</p>
              <p className="mmap-count-value">{ui.fRaw.toLocaleString()}</p>
            </div>
          )}
          {showM && (
            <div className="mmap-count mmap-count--m">
              <p className="mmap-count-label">Male {quarterLabel} {year}</p>
              <p className="mmap-count-value">{ui.mRaw.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mmap-legend">
          <div className="mmap-legend-title">USA → UK</div>
          {showF && <div className="mmap-legend-row"><div className="mmap-swatch" style={{ background:'var(--fem)', height:2 }}/><span className="mmap-legend-name">Female</span></div>}
          {showM && <div className="mmap-legend-row"><div className="mmap-swatch" style={{ background:'var(--male)', height:2 }}/><span className="mmap-legend-name">Male</span></div>}
          <div className="mmap-legend-note">1 arc ≈ 10 people</div>
        </div>
      </div>

      {/* ── Year timeline ── */}
      <div className="mmap-timeline">
        <div className="mmap-tl-head">
          <span>{START_YEAR}</span>
          <span className="mmap-tl-now">{year} {quarterLabel}</span>
          <span>2025</span>
        </div>

        <div className="mmap-tl-marks mmap-tl-marks--top">
          {KEY_YEARS.filter(k => k.row===0).map(k => (
            <div key={k.yi} className="mmap-tl-mark"
              style={{ left:`${(yiToQi(k.yi) / (NUM_QUARTERS-1)) * 100}%` }}>
              {k.label.split('\n').map((ln,i) => (
                <div key={i} className="mmap-tl-mark-line" style={{ color:k.color }}>{ln}</div>
              ))}
            </div>
          ))}
        </div>

        <div ref={tlRef}
          className="mmap-tl-track"
          onMouseDown={e => { isDragging.current=true; jumpToQuarter(posToQuarter(e.clientX)); }}
          onClick={e => jumpToQuarter(posToQuarter(e.clientX))}
          onTouchStart={e => jumpToQuarter(posToQuarter(e.touches[0].clientX))}
          onTouchMove={e  => jumpToQuarter(posToQuarter(e.touches[0].clientX))}>

          {ERA_BANDS.map(e => (
            <div key={e.label} className="mmap-tl-era"
              style={{
                left:`${(yiToQi(e.s) / (NUM_QUARTERS-1)) * 100}%`,
                width:`${((e.e - e.s + 1) * 4 / (NUM_QUARTERS-1)) * 100}%`,
                backgroundColor:e.color, opacity:e.barOp, borderRadius:4,
              }}/>
          ))}

          {Array.from({ length:NUM_YEARS }, (_,i) => (
            <div key={i} className="mmap-tl-year"
              style={{ left:`${(yiToQi(i) / (NUM_QUARTERS-1)) * 100}%`, transform:'translateX(-50%)' }}>
              <span className="mmap-tl-year-label">{START_YEAR+i}</span>
            </div>
          ))}

          <div className="mmap-tl-playhead" style={{ left:`${barPct}%` }}>
            <div className="mmap-tl-needle"/>
            <div className="mmap-tl-knob"/>
          </div>
        </div>

        <div className="mmap-tl-marks mmap-tl-marks--bottom">
          {KEY_YEARS.filter(k => k.row===1).map(k => (
            <div key={k.yi} className="mmap-tl-mark"
              style={{ left:`${(yiToQi(k.yi) / (NUM_QUARTERS-1)) * 100}%` }}>
              {k.label.split('\n').map((ln,i) => (
                <div key={i} className="mmap-tl-mark-line" style={{ color:k.color }}>{ln}</div>
              ))}
            </div>
          ))}
        </div>

        <div className="mmap-tl-legend">
          {[
            { color:'#ef4444', label:"Trump's Terms" },
            { color:'#6b7280', label:'COVID-19' },
            { color:'#2563eb', label:'Biden Era' },
          ].map(e => (
            <span key={e.label} className="mmap-tl-legend-item">
              <span className="mmap-tl-legend-swatch" style={{ backgroundColor:e.color, opacity:0.75 }}/>
              {e.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
