// KitSVG.jsx v3 — Improved stick SVG, seq visual feedback, layout engine integration

import { useRef, useEffect, useState } from 'react'
import Hardware from './Hardware.jsx'
import DrumElement from './DrumElement.jsx'
import { computeLayout, getViewBox } from '../data/layoutEngine.js'

const Z_ORDER = { kick:0,foot:1,pad:2,sampling:3,bell:4,cymbal:5 }
const NS = 'http://www.w3.org/2000/svg'
const FX  = { pad:'#00d4ff',cymbal:'#aabbc0',kick:'#ff6020',bell:'#d0a030',foot:'#00d4ff',sampling:'#8855ff' }

function KitDefs() {
  return (
    <defs>
      <pattern id="meshPat" x="0" y="0" width="7" height="7" patternUnits="userSpaceOnUse">
        <path d="M0,0 L7,7 M7,0 L0,7" stroke="rgba(155,155,165,0.16)" strokeWidth=".5" strokeLinecap="square"/>
      </pattern>
      <pattern id="cymDot" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="1" fill="rgba(22,22,22,0.85)"/>
      </pattern>
      <radialGradient id="meshGrad" cx="38%" cy="32%" r="74%">
        <stop offset="0%" stopColor="#c8c8c8"/><stop offset="65%" stopColor="#b4b4b4"/><stop offset="100%" stopColor="#9e9e9e"/>
      </radialGradient>
      <radialGradient id="cymGrad" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#191919"/><stop offset="100%" stopColor="#0a0a0a"/>
      </radialGradient>
      <radialGradient id="shellGrad" cx="30%" cy="20%" r="85%">
        <stop offset="0%" stopColor="#191919"/><stop offset="100%" stopColor="#070707"/>
      </radialGradient>
      <radialGradient id="vigGrad" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(0,0,2,0.80)"/>
      </radialGradient>
      <radialGradient id="stageGrad" cx="50%" cy="65%" r="55%">
        <stop offset="0%" stopColor="#0e0e0e"/><stop offset="100%" stopColor="#040404"/>
      </radialGradient>
      <pattern id="hexGrid" x="0" y="0" width="40" height="46" patternUnits="userSpaceOnUse">
        <path d="M20 2 L38 12 L38 32 L20 42 L2 32 L2 12 Z" fill="none" stroke="#0a0a0d" strokeWidth=".5"/>
      </pattern>
      {/* Stick gradient */}
      <linearGradient id="stickGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#daa040"/><stop offset="40%" stopColor="#c08028"/><stop offset="100%" stopColor="#7a4014"/>
      </linearGradient>
    </defs>
  )
}

function KitBg({ viewBox }) {
  const [,,w,h] = viewBox.split(' ').map(Number)
  return (
    <>
      <rect width={w} height={h} fill="#060606"/>
      <rect width={w} height={h} fill="url(#stageGrad)"/>
      <rect width={w} height={h} fill="url(#hexGrid)" opacity=".6"/>
      {Array.from({length:Math.floor(w/54)+1},(_,i)=><line key={`v${i}`} x1={i*54} y1={0} x2={i*54} y2={h} stroke="#0a0a0a" strokeWidth=".35"/>)}
      {Array.from({length:Math.floor(h/54)+1},(_,i)=><line key={`h${i}`} x1={0} y1={i*54} x2={w} y2={i*54} stroke="#0a0a0a" strokeWidth=".35"/>)}
      <rect width={w} height={h} fill="url(#vigGrad)"/>
    </>
  )
}

// ── Improved drumstick SVG ──────────────────────────────────────────────────
// Uses a proper tapered path to look like a real drumstick
function buildStickPath(x1,y1,x2,y2,tipR=4) {
  // Vector from tip to butt
  const dx=x2-x1, dy=y2-y1
  const len=Math.sqrt(dx*dx+dy*dy)
  const nx=-dy/len, ny=dx/len  // normal
  // Width varies from tipR at tip to butR at butt
  const butR=7.5
  // 4-point trapezoid path
  const pts=[
    [x1+nx*tipR, y1+ny*tipR],
    [x2+nx*butR, y2+ny*butR],
    [x2-nx*butR, y2-ny*butR],
    [x1-nx*tipR, y1-ny*tipR],
  ]
  return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]} L${pts[2][0]},${pts[2][1]} L${pts[3][0]},${pts[3][1]} Z`
}

function StickOverlay({ drum }) {
  if (drum.type==='kick'||drum.type==='foot'||drum.type==='sampling') return null
  const { id, cx, cy, r=65, type } = drum
  const tipY = cy-(type==='cymbal'?r*.12:r*.08)
  const sl   = type==='cymbal'?70:62
  // Tip and butt positions for each stick
  const tipLX=cx-11, tipRX=cx+11
  const buttLX=cx-22, buttLY=tipY-sl
  const buttRX=cx+22, buttRY=tipY-sl

  return (
    <g className="stick-group">
      {/* Left stick */}
      <g className="stickL" id={`stk-${id}-L`}
        style={{transformOrigin:`${tipLX}px ${tipY}px`}}>
        <path d={buildStickPath(tipLX,tipY,buttLX,buttLY,3.5)}
          fill="url(#stickGrad)" opacity=".92"/>
        {/* Tip ball */}
        <circle cx={tipLX} cy={tipY} r={5} fill="#e8c060" opacity=".90"/>
        {/* Tape wrap lines */}
        {[.25,.35,.45].map(t=>{
          const wx=tipLX+(buttLX-tipLX)*t, wy=tipY+(buttLY-tipY)*t
          const dx=buttLX-tipLX, dy=buttLY-tipY
          const len=Math.sqrt(dx*dx+dy*dy)
          const nx=-dy/len*3.5*(1-t*.3), ny=dx/len*3.5*(1-t*.3)
          return <line key={t} x1={wx-nx} y1={wy-ny} x2={wx+nx} y2={wy+ny} stroke="#c07020" strokeWidth="1.5" opacity=".6"/>
        })}
        {/* Butt cap */}
        <circle cx={buttLX} cy={buttLY} r={6.5} fill="#6a3810" opacity=".85"/>
      </g>
      {/* Right stick */}
      <g className="stickR" id={`stk-${id}-R`}
        style={{transformOrigin:`${tipRX}px ${tipY}px`}}>
        <path d={buildStickPath(tipRX,tipY,buttRX,buttRY,3.5)}
          fill="url(#stickGrad)" opacity=".92"/>
        <circle cx={tipRX} cy={tipY} r={5} fill="#e8c060" opacity=".90"/>
        {[.25,.35,.45].map(t=>{
          const wx=tipRX+(buttRX-tipRX)*t, wy=tipY+(buttRY-tipY)*t
          const dx=buttRX-tipRX, dy=buttRY-tipY
          const len=Math.sqrt(dx*dx+dy*dy)
          const nx=-dy/len*3.5*(1-t*.3), ny=dx/len*3.5*(1-t*.3)
          return <line key={t} x1={wx-nx} y1={wy-ny} x2={wx+nx} y2={wy+ny} stroke="#c07020" strokeWidth="1.5" opacity=".6"/>
        })}
        <circle cx={buttRX} cy={buttRY} r={6.5} fill="#6a3810" opacity=".85"/>
      </g>
    </g>
  )
}

export default function KitSVG({ preset, activeItems, hitStates, keyMap, dualStick, onHit, samplingPack }) {
  const fxRef = useRef(null)
  const [isMobile, setIsMobile] = useState(()=>window.innerWidth<768)
  useEffect(()=>{
    const fn=()=>setIsMobile(window.innerWidth<768)
    window.addEventListener('resize',fn)
    return ()=>window.removeEventListener('resize',fn)
  },[])

  const layoutMap = computeLayout(activeItems, isMobile, preset.id)
  const withPos = activeItems.map(d=>({
    ...d,
    cx: layoutMap[d.id]?.cx ?? d.cx ?? 0,
    cy: layoutMap[d.id]?.cy ?? d.cy ?? 0,
    r:  layoutMap[d.id]?.r  ?? d.r  ?? 60,
  }))

  const viewBox = getViewBox(preset.id, isMobile)

  useEffect(()=>{
    for(const [drumId, side] of Object.entries(hitStates)){
      if(!side) continue
      const drum = withPos.find(d=>d.id===drumId); if(!drum) continue
      const svgId = drum.sharedSvg||drumId
      const el = document.getElementById(svgId); if(!el) continue
      const cls = drum.type==='cymbal'?'hit-cymbal':drum.type==='kick'?'hit-kick':drum.type==='bell'?'hit-bell':drum.type==='sampling'?'hit-sampling':'hit-pad'
      el.classList.remove('hit-pad','hit-cymbal','hit-kick','hit-bell','hit-sampling')
      void el.getBoundingClientRect(); el.classList.add(cls)
      // Sticks: skip for seq hits, foot hits, kick hits, sampling
      const isSeq = side==='seq'
      if(!isSeq && drum.type!=='kick'&&drum.type!=='foot'&&drum.type!=='sampling'){
        const s=document.getElementById(`stk-${svgId}-${side==='secondary'?'R':'L'}`)
        if(s){s.classList.remove('play');void s.getBoundingClientRect();s.classList.add('play');s.addEventListener('animationend',()=>s.classList.remove('play'),{once:true})}
      }
      if(fxRef.current){ripple(fxRef.current,drum);particles(fxRef.current,drum,isMobile?3:5)}
    }
  },[hitStates])

  const drawables = [...withPos].filter(d=>!d.sharedSvg).sort((a,b)=>(Z_ORDER[a.type]||0)-(Z_ORDER[b.type]||0))

  return (
    <div className="kit-scroll-wrapper">
      <svg id="kit" viewBox={viewBox} xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet" style={{touchAction:'none',cursor:'default'}}>
        <KitDefs/>
        <g id="k-bg"><KitBg viewBox={viewBox}/></g>
        <g id="k-hw"><Hardware activeItems={withPos} viewBox={viewBox}/></g>
        <g id="k-drums">
          {drawables.map(drum=>(
            drum.type==='sampling' ? (
              <DrumElement key={drum.id} drum={drum} keyMap={keyMap} dualStick={dualStick}
                samplingPack={samplingPack} onZoneHit={(id,zone)=>onHit(id,'primary',zone)}/>
            ) : (
              <g key={drum.id} onPointerDown={e=>{e.preventDefault();onHit(drum.id,'primary',0)}}>
                <DrumElement drum={drum} keyMap={keyMap} dualStick={dualStick}/>
              </g>
            )
          ))}
        </g>
        <g id="k-sticks">{drawables.map(d=><StickOverlay key={d.id} drum={d}/>)}</g>
        <g id="k-fx" ref={fxRef}/>
      </svg>
    </div>
  )
}

function ripple(c,drum){
  const{cx,cy,r=60,type}=drum,col=FX[type]||'#00d4ff'
  const el=document.createElementNS(NS,'circle')
  el.setAttribute('cx',cx);el.setAttribute('cy',cy)
  el.setAttribute('fill','none');el.setAttribute('stroke',col);el.setAttribute('stroke-width','1.5')
  c.appendChild(el)
  const t0=performance.now(),dur=460,mr=r*1.15
  ;(function f(now){const p=Math.min((now-t0)/dur,1);el.setAttribute('r',4+(mr-4)*p);el.setAttribute('opacity',(1-p)*.78);p<1?requestAnimationFrame(f):el.remove()})(t0)
}
function particles(c,drum,n=5){
  const{cx,cy,type}=drum,col=FX[type]||'#00d4ff'
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2,sp=14+Math.random()*30
    const vx=Math.cos(a)*sp,vy=Math.sin(a)*sp
    const dot=document.createElementNS(NS,'circle')
    dot.setAttribute('cx',cx);dot.setAttribute('cy',cy)
    dot.setAttribute('r',1.1+Math.random()*1.6);dot.setAttribute('fill',col)
    c.appendChild(dot)
    const t0=performance.now(),dur=220+Math.random()*180
    ;(function f(now){const p=Math.min((now-t0)/dur,1);dot.setAttribute('cx',cx+vx*p);dot.setAttribute('cy',cy+vy*p);dot.setAttribute('opacity',1-p);p<1?requestAnimationFrame(f):dot.remove()})(t0)
  }
}
