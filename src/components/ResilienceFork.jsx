import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * The resilience categorisation, drawn as the journey in the research's own
 * Figure 1: Original State, down the preparedness arrow, into Adversity, and
 * then the fork. Backwards-thinking returns to the state it started from;
 * forwards-thinking carries on to a new one.
 *
 * A plane makes the trip. It is two-tone leaving the Original State, it breaks
 * on impact, and the two halves become two planes: the green one flies the
 * return arc and picks its burgundy back up on the way, ending exactly as it
 * started. The burgundy one flies on and deepens, ending somewhere it has not
 * been before.
 *
 * ON THE COLOURS. Green against burgundy cannot be made colourblind-safe:
 * normal vision separates them easily (delta-E 29) but deuteranopia collapses
 * them to delta-E 3, and no restepping fixes it, because it is the hue pair
 * itself. They are kept because they are the author's, and because nothing here
 * rests on telling them apart: the two planes are on separate paths, travelling
 * in opposite directions, under their own labels. The transformation is carried
 * a second way as well, by how completely each plane is filled, which survives
 * both colourblindness and greyscale printing.
 */

const VB = { w: 920, h: 430 }

const NODES = {
  origin: { x: 430, y: 66, r: 46, label: ['Original', 'State'] },
  adversity: { x: 430, y: 336, r: 46, label: ['Adversity'] },
  future: { x: 812, y: 336, r: 46, label: ['New', 'state'] },
}

/* The three journeys. Each is sampled with getPointAtLength, so the plane
   follows the drawn line exactly rather than a second copy of the maths. */
const PATHS = {
  fall: `M ${NODES.origin.x} ${NODES.origin.y + NODES.origin.r + 6} L ${NODES.adversity.x} ${NODES.adversity.y - NODES.adversity.r - 8}`,
  back: `M ${NODES.adversity.x - 36} ${NODES.adversity.y - 28} C 250 300, 132 288, 132 208 C 132 128, 268 74, ${NODES.origin.x - NODES.origin.r - 8} ${NODES.origin.y}`,
  forward: `M ${NODES.adversity.x + NODES.adversity.r + 6} ${NODES.adversity.y} L ${NODES.future.x - NODES.future.r - 8} ${NODES.future.y}`,
}

/* Paper-plane silhouette, nose at +x, split along its centreline so the two
   halves can be coloured independently. */
const PLANE_TOP = 'M20 0 L-15 -13 L-8 0 Z'
const PLANE_BOT = 'M20 0 L-8 0 L-15 13 Z'

const T = { fall: [0, 0.3], impact: [0.3, 0.4], branch: [0.42, 1] }
const RUN_MS = 6200

const DEFS = [
  {
    id: 'prep',
    term: 'Preparedness',
    detail: 'Detecting critical developments inside the firm and in its environment.',
  },
  {
    id: 'adv',
    term: 'Adversity',
    detail: 'Accepting the adversity, then implementing solutions. Both paths get this far.',
  },
  {
    id: 'adapt',
    term: 'Adaptation and innovation',
    detail: 'Reflection and learning, then change. Only one of the two paths goes here.',
  },
]

const BRANCHES = [
  {
    id: 'back',
    name: 'Backwards-thinking resilience',
    tone: 'back',
    caption:
      'Emphasis is placed on bouncing back, on returning to a certain pre-existing state of equilibrium. The Latin resilio, from which resilience derives, means to jump back. Learning can still occur here; change is not implemented.',
  },
  {
    id: 'fwd',
    name: 'Forwards-thinking resilience',
    tone: 'fwd',
    caption:
      'Turning challenges into opportunities for growth and innovation, with the intent of creating a superior performance than was previously being experienced. It carries its own risk: innovations can cause their own disruptions, and Duchek reports that two out of three change initiatives fail.',
  },
]

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const span = ([a, b], t) => clamp01((t - a) / (b - a))
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => {
  const [x, y] = [hex(a), hex(b)]
  return (
    '#' +
    x.map((v, i) => Math.round(v + (y[i] - v) * clamp01(t)).toString(16).padStart(2, '0')).join('')
  )
}

export default function ResilienceFork() {
  const [reduced, setReduced] = useState(false)
  const [runId, setRunId] = useState(0)
  const [focus, setFocus] = useState(null)

  const fallRef = useRef(null)
  const backRef = useRef(null)
  const fwdRef = useRef(null)
  const planeRef = useRef(null)
  const greenRef = useRef(null)
  const burgRef = useRef(null)
  const crackRef = useRef(null)
  /* The theme watcher repaints the frame that is already on screen, so these
     three are how it reaches the running animation without restarting it. */
  const colorsRef = useRef(null)
  const readColorsRef = useRef(null)
  const frameRef = useRef(null)
  const lastTRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const fall = fallRef.current
    const back = backRef.current
    const fwd = fwdRef.current
    if (!fall || !back || !fwd) return undefined

    /* Read fresh rather than once: the tokens change with the theme, and the
       light burgundy sits at 1.3:1 on the dark surface. */
    const readColors = () => {
      const cs = window.getComputedStyle(fall.ownerSVGElement)
      const pick = (name, fallback) => cs.getPropertyValue(name).trim() || fallback
      colorsRef.current = {
        GREEN: pick('--rf-green', '#1b8f5f'),
        BURG: pick('--rf-burgundy', '#8c2740'),
        DEEP: pick('--rf-burgundy-deep', '#5e1526'),
        PALE: pick('--rf-pale', '#d3d8d4'),
      }
    }
    readColors()
    readColorsRef.current = readColors

    const L = { fall: fall.getTotalLength(), back: back.getTotalLength(), fwd: fwd.getTotalLength() }

    /* Place a group on a path and turn it to face the direction of travel. */
    const put = (el, path, len, u, scale) => {
      const d = clamp01(u) * len
      const p = path.getPointAtLength(d)
      const q = path.getPointAtLength(Math.min(len, d + 1.5))
      const a = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI
      el.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${a}) scale(${scale})`)
    }

    const paint = (el, top, bottom) => {
      el.querySelector('.rf-plane-top').setAttribute('fill', top)
      el.querySelector('.rf-plane-bot').setAttribute('fill', bottom)
    }

    const frame = (t) => {
      lastTRef.current = t
      const { GREEN, BURG, DEEP, PALE } = colorsRef.current
      const whole = planeRef.current
      const green = greenRef.current
      const burg = burgRef.current
      const crack = crackRef.current
      if (!whole || !green || !burg) return

      const flying = t < T.impact[0]
      whole.style.opacity = flying ? '1' : '0'
      green.style.opacity = flying ? '0' : '1'
      burg.style.opacity = flying ? '0' : '1'

      if (flying) {
        put(whole, fall, L.fall, ease(span(T.fall, t)), 1)
        paint(whole, GREEN, BURG)
        if (crack) crack.style.opacity = '0'
        return
      }

      /* Impact: the node takes the hit and the plane comes apart. */
      if (crack) crack.style.opacity = String(Math.min(1, span(T.impact, t) * 3))

      const b = ease(span(T.branch, t))

      /* The green half flies the return arc and picks its burgundy back up,
         arriving exactly as it left. Fill completeness carries the same story
         for anyone who cannot separate the two hues. */
      put(green, back, L.back, b, 0.7 + 0.3 * b)
      paint(green, GREEN, mix(PALE, BURG, b))

      /* The burgundy half flies on and deepens. */
      put(burg, fwd, L.fwd, b, 0.7 + 0.45 * b)
      paint(burg, mix(PALE, BURG, Math.min(1, b * 1.6)), mix(BURG, DEEP, b))
    }

    frameRef.current = frame

    if (reduced) {
      frame(1)
      return undefined
    }

    let raf = 0
    let settled = false
    const t0 = performance.now()
    const finish = () => {
      if (settled) return
      settled = true
      frame(1)
    }
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / RUN_MS)
      frame(t)
      if (t < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    frame(0)
    raf = requestAnimationFrame(tick)
    /* rAF is throttled to nothing in a background tab and absent in some
       embedded browsers; without this the plane never leaves. */
    const failsafe = setTimeout(finish, RUN_MS + 500)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(failsafe)
    }
  }, [reduced, runId])

  useEffect(() => {
    const repaint = () => {
      readColorsRef.current?.()
      frameRef.current?.(lastTRef.current)
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', repaint)
    const mo = new MutationObserver(repaint)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      mq.removeEventListener('change', repaint)
      mo.disconnect()
    }
  }, [])

  const replay = useCallback(() => setRunId((n) => n + 1), [])
  const dim = (id) => (focus && focus !== id ? 'true' : undefined)

  return (
    <figure className="rfork">
      <figcaption className="rfork-head">
        <h3 className="rfork-title">Where the two definitions diverge</h3>
        <p className="rfork-sub">
          Both readings need an adversity and both prepare for it. What separates them is
          where they go afterwards.
        </p>
      </figcaption>

      <div className="rfork-plot">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          role="img"
          aria-label="A plane leaves the Original State, breaks on the Adversity, and splits: one half returns to the Original State, the other flies on to a New state"
        >
          <defs>
            <marker
              id="rfArrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" className="rf-arrowhead" />
            </marker>
          </defs>

          <path
            ref={fallRef}
            className="rf-route rf-route--fall"
            d={PATHS.fall}
            markerEnd="url(#rfArrow)"
          />
          <g data-tone="back" data-dim={dim('back')}>
            <path
              ref={backRef}
              className="rf-route rf-route--branch"
              d={PATHS.back}
            />
          </g>
          <g data-tone="fwd" data-dim={dim('fwd')}>
            <path
              ref={fwdRef}
              className="rf-route rf-route--branch"
              d={PATHS.forward}
            />
          </g>

          {/* Nodes are deliberately neutral: the green and the burgundy belong
              to the plane, and a coloured node would compete with it. */}
          {Object.entries(NODES).map(([k, n]) => (
            <g className="rf-node" key={k}>
              <circle cx={n.x} cy={n.y} r={n.r} />
              {n.label.map((line, i) => (
                <text
                  key={line}
                  x={n.x}
                  y={n.y + (i - (n.label.length - 1) / 2) * 17 + 5}
                  textAnchor="middle"
                >
                  {line}
                </text>
              ))}
            </g>
          ))}

          {/* The break, revealed on impact. */}
          <g ref={crackRef} className="rf-crack" style={{ opacity: 0 }}>
            <path
              /* Upper-left quadrant only: a crack through the middle of the
                 node would run straight across its label. */
              d={`M ${NODES.adversity.x - 14} ${NODES.adversity.y - 42} l -14 12 l 10 9 l -16 11`}
            />
            <circle cx={NODES.adversity.x - 48} cy={NODES.adversity.y - 40} r="3" />
            <circle cx={NODES.adversity.x + 32} cy={NODES.adversity.y - 46} r="2.5" />
            <circle cx={NODES.adversity.x - 6} cy={NODES.adversity.y - 62} r="2" />
          </g>

          <g className="rf-routelabel">
            <text x={NODES.origin.x + 14} y={(NODES.origin.y + NODES.adversity.y) / 2}>
              Preparedness
            </text>
          </g>
          <g className="rf-routelabel" data-tone="fwd" data-dim={dim('fwd')}>
            <text
              x={(NODES.adversity.x + NODES.future.x) / 2}
              y={NODES.adversity.y - 20}
              textAnchor="middle"
            >
              Forwards-thinking resilience
            </text>
            <text
              x={(NODES.adversity.x + NODES.future.x) / 2}
              y={NODES.adversity.y + 32}
              textAnchor="middle"
            >
              Adaptation and innovation
            </text>
          </g>
          <g className="rf-routelabel" data-tone="back" data-dim={dim('back')}>
            <text x={258} y={196} textAnchor="middle">
              Return to original state
            </text>
            <text x={258} y={216} textAnchor="middle">
              Backwards-thinking resilience
            </text>
          </g>

          <g ref={planeRef} className="rf-plane">
            <path className="rf-plane-top" d={PLANE_TOP} />
            <path className="rf-plane-bot" d={PLANE_BOT} />
          </g>
          <g ref={greenRef} className="rf-plane" data-dim={dim('back')} style={{ opacity: 0 }}>
            <path className="rf-plane-top" d={PLANE_TOP} />
            <path className="rf-plane-bot" d={PLANE_BOT} />
          </g>
          <g ref={burgRef} className="rf-plane" data-dim={dim('fwd')} style={{ opacity: 0 }}>
            <path className="rf-plane-top" d={PLANE_TOP} />
            <path className="rf-plane-bot" d={PLANE_BOT} />
          </g>
        </svg>
      </div>

      <div className="rfork-defs">
        {DEFS.map((d) => (
          <div className="rfork-def" key={d.id}>
            <p className="rfork-term">{d.term}</p>
            <p className="rfork-detail">{d.detail}</p>
          </div>
        ))}
      </div>

      <div className="rfork-controls">
        <div className="rfork-picks" role="group" aria-label="Focus a path">
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              type="button"
              className="rfork-pick"
              data-tone={b.tone}
              aria-pressed={focus === b.id}
              onClick={() => setFocus(focus === b.id ? null : b.id)}
            >
              <span className="rfork-swatch" data-tone={b.tone} />
              {b.name}
            </button>
          ))}
        </div>
        <button type="button" className="rfork-replay" onClick={replay}>
          Replay
        </button>
      </div>

      {BRANCHES.filter((b) => !focus || focus === b.id).map((b) => (
        <p className="rfork-caption" key={b.id} data-tone={b.tone}>
          <b>{b.name}</b>
          {b.caption}
        </p>
      ))}

      <p className="rfork-foot">
        After the categorisation in Weking, P&eacute;rez and Schaffer (2021), with the stages
        from Duchek (2019). A diagram of the argument, not measured data.
      </p>
    </figure>
  )
}
