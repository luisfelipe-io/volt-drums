// DrumElement.jsx v3 — Improved stick SVG, sampling zones with keys

import SAMPLING_PACKS from '../data/samplingPresets.js'
import { SAMPLING_KEYS } from '../data/defaultKeys.js'

function CymbalEl({ drum, keyStr }) {
  const { cx, cy, r } = drum
  const clipId = `cc-${drum.id}`
  const rings = r < 56 ? [.92,.76,.58] : [.94,.82,.70,.57,.43,.30]
  return (
    <g id={drum.id} className="drum-group">
      <circle cx={cx+1.5} cy={cy+3} r={r+4} fill="#000" opacity=".60"/>
      <circle cx={cx} cy={cy} r={r+1} fill="#080808" stroke="#131313" strokeWidth="2"/>
      <circle cx={cx} cy={cy} r={r} fill="url(#cymGrad)" stroke="#181818" strokeWidth="1.2"/>
      <clipPath id={clipId}><circle cx={cx} cy={cy} r={r}/></clipPath>
      <circle cx={cx} cy={cy} r={r} fill="url(#cymDot)" clipPath={`url(#${clipId})`}/>
      {rings.map(f=><circle key={f} cx={cx} cy={cy} r={r*f} fill="none" stroke="#181818" strokeWidth={f>.7?"1.3":"0.9"}/>)}
      <circle cx={cx} cy={cy} r={r*.9} fill="none" stroke="rgba(20,20,20,.5)" strokeWidth="7"/>
      <circle cx={cx} cy={cy} r={r*.97} fill="none" stroke="rgba(80,80,90,.11)" strokeWidth="2" className="rim-idle"/>
      <circle cx={cx} cy={cy} r={r*.19} fill="#0d0d0d" stroke="#1c1c1c" strokeWidth="2"/>
      <circle cx={cx} cy={cy} r={r*.12} fill="#090909"/>
      <circle cx={cx-r*.04} cy={cy-r*.04} r={r*.05} fill="rgba(32,32,32,.5)"/>
      <circle cx={cx} cy={cy} r={r*.035} fill="#060606" stroke="#111" strokeWidth=".8"/>
      <text x={cx} y={cy+r+13} textAnchor="middle" fill="#1e1e24" fontSize="8" fontFamily="JetBrains Mono,Share Tech Mono,monospace" letterSpacing="1">{keyStr}</text>
      <text x={cx} y={cy+r+22} textAnchor="middle" fill="#161618" fontSize="6" fontFamily="JetBrains Mono,Share Tech Mono,monospace" letterSpacing="1">{drum.label}</text>
    </g>
  )
}

function PadEl({ drum, keyStr }) {
  const { cx, cy, r } = drum
  const clipId = `cp-${drum.id}`
  const lugCount = r > 68 ? 12 : 10
  const lugs = Array.from({length:lugCount},(_,i)=>{
    const a=(i/lugCount)*Math.PI*2-Math.PI/2
    return {x:cx+Math.cos(a)*r*.99,y:cy+Math.sin(a)*r*.99,a}
  })
  return (
    <g id={drum.id} className="drum-group">
      <circle cx={cx+1} cy={cy+2.5} r={r+4} fill="#000" opacity=".55"/>
      <circle cx={cx} cy={cy} r={r} fill="url(#shellGrad)" stroke="#1c1c1c" strokeWidth="3"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#202020" strokeWidth="2"/>
      <circle cx={cx} cy={cy} r={r-3} fill="none" stroke="rgba(40,40,45,.4)" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r={r*.93} fill="none" stroke="rgba(0,200,255,0.18)" strokeWidth="2" className="rim-idle"/>
      <circle cx={cx} cy={cy} r={r*.93} fill="none" stroke="rgba(0,200,255,0.04)" strokeWidth="6"/>
      <clipPath id={clipId}><circle cx={cx} cy={cy} r={r*.895}/></clipPath>
      <circle cx={cx} cy={cy} r={r*.895} fill="url(#meshGrad)"/>
      <circle cx={cx} cy={cy} r={r*.895} fill="url(#meshPat)" clipPath={`url(#${clipId})`}/>
      <circle cx={cx} cy={cy} r={r*.60} fill="none" stroke="rgba(100,100,110,.08)" strokeWidth=".8"/>
      <circle cx={cx} cy={cy} r={r*.35} fill="none" stroke="rgba(100,100,110,.06)" strokeWidth=".7"/>
      <circle cx={cx} cy={cy} r={r*.06} fill="rgba(65,65,70,.3)"/>
      {lugs.map((l,i)=>(
        <g key={i}>
          <circle cx={l.x} cy={l.y} r={r*.033} fill="#0d0d0d" stroke="#1a1a1c" strokeWidth=".6"/>
          <circle cx={l.x-Math.cos(l.a)*.4} cy={l.y-Math.sin(l.a)*.4} r={r*.016} fill="rgba(32,32,36,.5)"/>
        </g>
      ))}
      <text x={cx} y={cy+6} textAnchor="middle" fill="rgba(50,50,58,0.55)" fontSize="13" fontFamily="Orbitron,monospace" fontWeight="700" letterSpacing="2">{keyStr}</text>
      <text x={cx} y={cy+20} textAnchor="middle" fill="rgba(42,42,48,0.5)" fontSize="6.5" fontFamily="JetBrains Mono,Share Tech Mono,monospace" letterSpacing="2">{drum.label}</text>
    </g>
  )
}

function KickEl({ drum, keyStr }) {
  const { cx, cy } = drum
  return (
    <g id={drum.id} className="drum-group">
      <rect x={cx-56} y={cy-28} width={112} height={21} rx="3" fill="#090909" stroke="#191919" strokeWidth="1.5"/>
      {Array.from({length:9},(_,i)=>(
        <rect key={i} x={cx-48+i*11} y={cy-24} width={9} height={13} rx="1.5" fill="rgba(16,16,16,.6)" stroke="rgba(22,22,22,.8)" strokeWidth=".5"/>
      ))}
      <rect x={cx-56} y={cy-28} width={112} height={4} rx="2" fill="#0f0f0f" stroke="#1a1a1a" strokeWidth=".8"/>
      <line x1={cx} y1={cy-28} x2={cx} y2={cy-52} stroke="#0d0d0d" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx={cx} cy={cy-52} r={7.5} fill="#0b0b0b" stroke="#181818" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy-52} r={3.5} fill="rgba(16,16,16,.8)"/>
      <circle cx={cx} cy={cy-50} r={3} fill="#090909"/>
      <path d={`M${cx} ${cy-26} Q${cx+14} ${cy-6} ${cx} ${cy}`} fill="none" stroke="#0d0d0d" strokeWidth="1.6" strokeDasharray="3,2.5" strokeLinecap="round"/>
      {Array.from({length:5},(_,i)=>(
        <path key={i} d={`M${cx-54} ${cy-22+i*5.5} Q${cx-50} ${cy-19+i*5.5} ${cx-54} ${cy-16+i*5.5}`} fill="none" stroke="#111" strokeWidth="1"/>
      ))}
      <rect x={cx-52} y={cy-7} width={104} height={3.5} rx="2" fill="rgba(255,96,32,0.10)" className="rim-idle"/>
      <rect x={cx-25} y={cy-18} width={50} height={9} rx="1.5" fill="#060606" stroke="#121212" strokeWidth=".6"/>
      <text x={cx} y={cy-11} textAnchor="middle" fill="#181818" fontSize="5.5" fontFamily="Orbitron,monospace" letterSpacing="3">VOLT</text>
      <text x={cx} y={cy+3} textAnchor="middle" fill="#1a1a1e" fontSize="7.5" fontFamily="JetBrains Mono,Share Tech Mono,monospace" letterSpacing="2">{keyStr}</text>
      <text x={cx} y={cy+14} textAnchor="middle" fill="#131315" fontSize="6" fontFamily="JetBrains Mono,Share Tech Mono,monospace" letterSpacing="2">{drum.label}</text>
    </g>
  )
}

function FootEl({ drum, keyStr }) {
  const { cx, cy } = drum
  return (
    <g id={drum.id} className="drum-group">
      <ellipse cx={cx} cy={cy} rx={40} ry={11} fill="#070707" stroke="#161616" strokeWidth="1.5"/>
      <ellipse cx={cx} cy={cy-1} rx={36} ry={8.5} fill="none" stroke="#131313" strokeWidth="1"/>
      {[36,28,20,12].map((rx,i)=>(
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={8.5-i*1.8} fill="none" stroke="rgba(18,18,18,.5)" strokeWidth=".5"/>
      ))}
      <rect x={cx-34} y={cy-2} width={68} height={4.5} rx="2" fill="rgba(0,212,255,0.07)" className="rim-idle"/>
      <text x={cx} y={cy+4} textAnchor="middle" fill="#1a1a22" fontSize="7.5" fontFamily="Orbitron,monospace" fontWeight="700">{keyStr}</text>
      <text x={cx} y={cy+15} textAnchor="middle" fill="#121216" fontSize="5.5" fontFamily="JetBrains Mono,Share Tech Mono,monospace" letterSpacing="1">{drum.label}</text>
    </g>
  )
}

function BellEl({ drum, keyStr }) {
  const { cx, cy, r } = drum
  return (
    <g id={drum.id} className="drum-group">
      <path d={`M${cx-r} ${cy+r*.6} L${cx-r*.7} ${cy-r} L${cx+r*.7} ${cy-r} L${cx+r} ${cy+r*.6} Z`} fill="#0d0d0d" stroke="#1c1c1c" strokeWidth="1.5"/>
      <ellipse cx={cx} cy={cy-r*.15} rx={r*.25} ry={r*.2} fill="#060606" stroke="#121212" strokeWidth="1"/>
      {[-r*.17,r*.17].map((ox,i)=>(
        <rect key={i} x={cx+ox-r*.06} y={cy+r*.1} width={r*.12} height={r*.28} rx={r*.04} fill="#060606"/>
      ))}
      <path d={`M${cx-r*.9} ${cy+r*.4} L${cx-r*.6} ${cy-r*.9} L${cx+r*.6} ${cy-r*.9} L${cx+r*.9} ${cy+r*.4}`} fill="none" stroke="rgba(180,140,40,.13)" strokeWidth="1.5" className="rim-idle"/>
      <text x={cx} y={cy+r*.8} textAnchor="middle" fill="#1a1a1e" fontSize="6.5" fontFamily="Orbitron,monospace" fontWeight="700">{keyStr}</text>
      <text x={cx} y={cy+r*1.45} textAnchor="middle" fill="#131314" fontSize="5.5" fontFamily="JetBrains Mono,Share Tech Mono,monospace" letterSpacing="1">{drum.label}</text>
    </g>
  )
}

function SamplingEl({ drum, keyStr, samplingPack, onZoneHit }) {
  const pack = SAMPLING_PACKS.find(p=>p.id===samplingPack)||SAMPLING_PACKS[0]
  const { cx, cy, r } = drum
  const w=r*2.4, h=r*2.0
  const x0=cx-w/2, y0=cy-h/2
  const hw=w/2-4, hh=h/2-4
  // Find zone keys from SAMPLING_KEYS
  const zoneKeyLabels = Array.from({length:4},(_,zone)=>{
    const entry = Object.entries(SAMPLING_KEYS).find(([,v])=>v.padId===drum.id&&v.zone===zone)
    return entry?entry[0].toUpperCase():String(zone+1)
  })
  const zones=[
    {x:x0+3,y:y0+3,w:hw,h:hh,zone:0},
    {x:cx+2, y:y0+3,w:hw,h:hh,zone:1},
    {x:x0+3,y:cy+2,w:hw,h:hh,zone:2},
    {x:cx+2, y:cy+2,w:hw,h:hh,zone:3},
  ]
  return (
    <g id={drum.id}>
      <rect x={x0+2} y={y0+3} width={w} height={h} rx="4" fill="#000" opacity=".52"/>
      <rect x={x0} y={y0} width={w} height={h} rx="4" fill="#0a0a0a" stroke="#1c1c1c" strokeWidth="1.8"/>
      <rect x={x0+3} y={y0+3} width={w-6} height={h-6} rx="2.5" fill="url(#shellGrad)"/>
      <line x1={cx} y1={y0+4} x2={cx} y2={y0+h-4} stroke="#161618" strokeWidth="1.2"/>
      <line x1={x0+4} y1={cy} x2={x0+w-4} y2={cy} stroke="#161618" strokeWidth="1.2"/>
      {zones.map(z=>(
        <g key={z.zone} className="drum-group"
          onPointerDown={e=>{e.stopPropagation();e.preventDefault();onZoneHit(drum.id,z.zone)}}>
          <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="2" fill={pack.colors[z.zone]||'rgba(80,80,90,.12)'}/>
          <text x={z.x+z.w/2} y={z.y+z.h*0.45} textAnchor="middle"
            fill="rgba(255,255,255,.18)" fontSize={r*.2}
            fontFamily="JetBrains Mono,monospace" letterSpacing="1">{pack.labels[z.zone]||String(z.zone+1)}</text>
          <text x={z.x+z.w/2} y={z.y+z.h*0.75} textAnchor="middle"
            fill="rgba(255,255,255,.10)" fontSize={r*.15}
            fontFamily="JetBrains Mono,monospace">{zoneKeyLabels[z.zone]}</text>
        </g>
      ))}
      <rect x={x0} y={y0} width={w} height={h} rx="4" fill="none" stroke="rgba(136,85,255,0.16)" strokeWidth="2" className="rim-idle"/>
      <text x={cx} y={y0+h+12} textAnchor="middle" fill="#1e1e25" fontSize="8.5" fontFamily="JetBrains Mono,Share Tech Mono,monospace" letterSpacing="1">{keyStr}</text>
      <text x={cx} y={y0+h+22} textAnchor="middle" fill="#161618" fontSize="6" fontFamily="JetBrains Mono,Share Tech Mono,monospace" letterSpacing="1">{drum.label} — {pack.name.toUpperCase()}</text>
    </g>
  )
}

export default function DrumElement({ drum, keyMap, dualStick, samplingPack, onZoneHit }) {
  const keys = keyMap[drum.id]||[]
  const k0 = keys[0]===' '?'SPC':(keys[0]||'?').toUpperCase()
  const k1 = keys[1]===' '?'SPC':(keys[1]||'').toUpperCase()
  const keyStr = dualStick&&k1 ? `${k0}/${k1}` : k0

  switch(drum.type){
    case 'cymbal':   return <CymbalEl   drum={drum} keyStr={keyStr}/>
    case 'pad':      return <PadEl      drum={drum} keyStr={keyStr}/>
    case 'kick':     return <KickEl     drum={drum} keyStr={keyStr}/>
    case 'foot':     return <FootEl     drum={drum} keyStr={keyStr}/>
    case 'bell':     return <BellEl     drum={drum} keyStr={keyStr}/>
    case 'sampling': return <SamplingEl drum={drum} keyStr={keyStr} samplingPack={samplingPack} onZoneHit={onZoneHit}/>
    default: return null
  }
}
