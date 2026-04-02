// Hardware.jsx — SVG rack, stands, cables, electronics module
// CHANGES v4: fully adaptive to active drum positions (no hardcoded rack X)
// Reads drum positions from activeItems to place stands, rack bar, and arms.

export default function Hardware({ activeItems, viewBox }) {
  const vbW = parseInt(viewBox?.split(' ')[2] || 1080)
  const vbH = parseInt(viewBox?.split(' ')[3] || 520)

  const find = (id) => activeItems.find(d => d.id === id)
  const hh       = find('hihat')
  const hhped    = find('hihat_pedal')
  const ride     = find('ride')
  const china    = find('china')
  const china2   = find('china2')
  const crash1   = find('crash1')
  const crash2   = find('crash2')
  const crash3   = find('crash3')
  const floortom = find('floortom')
  const floortom2= find('floortom2')
  const snare    = find('snare')
  const cowbell  = find('cowbell')

  // Compute rack bar span from leftmost to rightmost crash/tom
  const toms = activeItems.filter(d => d.type==='pad' && d.id.startsWith('tom'))
  const crashes = activeItems.filter(d => d.type==='cymbal' && d.id.startsWith('crash'))
  const rackItems = [...toms, ...crashes]
  const rackX1 = rackItems.length ? Math.min(...rackItems.map(d=>d.cx)) - 30 : 250
  const rackX2 = rackItems.length ? Math.max(...rackItems.map(d=>d.cx)) + 30 : 820

  const s  = { stroke:'#0d0d0d', strokeWidth:'3.5', strokeLinecap:'round', fill:'none' }
  const sl = { ...s, strokeWidth:'2.5' }
  const sc = { ...s, strokeWidth:'2' }

  return (
    <>
      {/* ── Main horizontal rack bar ── */}
      <rect x={rackX1} y={50} width={rackX2-rackX1} height={9} rx={4.5} fill="#0f0f0f" stroke="#1c1c1c" strokeWidth=".8"/>
      <rect x={rackX1} y={50} width={rackX2-rackX1} height={3} rx={3} fill="rgba(55,55,55,.25)"/>
      {/* Vertical uprights */}
      <rect x={rackX1} y={50} width={9} height={62} rx={4.5} fill="#0d0d0d" stroke="#191919" strokeWidth=".8"/>
      <rect x={rackX2-9} y={50} width={9} height={62} rx={4.5} fill="#0d0d0d" stroke="#191919" strokeWidth=".8"/>

      {/* ── Electronics module (fixed left side) ── */}
      <rect x={18} y={168} width={78} height={118} rx={4} fill="#0a0a0a" stroke="#181818" strokeWidth="1.5"/>
      <rect x={18} y={168} width={78} height={4} rx={2} fill="rgba(0,100,120,.25)"/>
      <rect x={24} y={176} width={50} height={22} rx={2} fill="#040812" stroke="#0d1524" strokeWidth="1"/>
      <text x={49} y={190} textAnchor="middle" fill="rgba(0,212,255,.28)" fontSize="5.5" fontFamily="Share Tech Mono" letterSpacing="2">VOLT DSP</text>
      {Array.from({length:5},(_,i)=>(
        <rect key={i} x={26+i*10} y={179} width={7} height={5} rx={1} fill={Math.random()>.35?'rgba(0,255,120,.5)':'#050a06'}/>
      ))}
      {[28,42,56,70].map(kx=>(
        <g key={kx}>
          <circle cx={kx} cy={210} r={5} fill="#0d0d0d" stroke="#1c1c1c" strokeWidth="1"/>
          <circle cx={kx} cy={209.5} r={1.8} fill="#222"/>
          <line x1={kx} y1={205} x2={kx} y2={208} stroke="rgba(100,152,180,.38)" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      ))}
      <rect x={24} y={222} width={50} height={12} rx={1.5} fill="#050505" stroke="#141414" strokeWidth=".8"/>
      <text x={49} y={231} textAnchor="middle" fill="#1a1a1a" fontSize="5" fontFamily="Share Tech Mono" letterSpacing="2">NITRO MAX</text>

      {/* ── Hi-hat stand + arm from rack ── */}
      {hh && <>
        <path d={`M${hh.cx} ${hh.cy+hh.r+4} L${hh.cx} ${(hhped?.cy||452)-10}`} {...s}/>
        <line x1={hh.cx-22} y1={(hhped?.cy||452)+14} x2={hh.cx+22} y2={(hhped?.cy||452)+14} {...s}/>
        <line x1={hh.cx-22} y1={(hhped?.cy||452)+28} x2={hh.cx} y2={(hhped?.cy||452)+14} {...sl}/>
        <line x1={hh.cx+22} y1={(hhped?.cy||452)+28} x2={hh.cx} y2={(hhped?.cy||452)+14} {...sl}/>
        <path d={`M${rackX1+10} 55 Q${rackX1} 72 ${hh.cx+8} ${hh.cy-hh.r-4}`} {...sl}/>
      </>}

      {/* ── Crash1 stand ── */}
      {crash1 && <>
        <path d={`M${crash1.cx} ${crash1.cy+crash1.r+4} L${crash1.cx-12} ${vbH-52}`} {...s}/>
        <line x1={crash1.cx-34} y1={vbH-62} x2={crash1.cx+10} y2={vbH-62} {...s}/>
        {/* Arm from rack */}
        <path d={`M${rackX1+20} 55 Q${rackX1+15} 78 ${crash1.cx} ${crash1.cy-crash1.r-4}`} {...sl}/>
      </>}

      {/* ── Crash2 stand ── */}
      {crash2 && <>
        <path d={`M${crash2.cx} ${crash2.cy+crash2.r+4} L${crash2.cx+12} ${vbH-52}`} {...s}/>
        <line x1={crash2.cx-8} y1={vbH-62} x2={crash2.cx+32} y2={vbH-62} {...s}/>
        <path d={`M${rackX2-20} 55 Q${rackX2-15} 78 ${crash2.cx} ${crash2.cy-crash2.r-4}`} {...sl}/>
      </>}

      {/* ── Crash3 stand (monster only) ── */}
      {crash3 && <>
        <path d={`M${crash3.cx} ${crash3.cy+crash3.r+4} L${crash3.cx+14} ${vbH-52}`} {...s}/>
        <line x1={crash3.cx-6} y1={vbH-62} x2={crash3.cx+34} y2={vbH-62} {...s}/>
      </>}

      {/* ── Tom mounting arms from rack ── */}
      {toms.map(tom => (
        <path key={tom.id} d={`M${Math.min(Math.max(tom.cx,rackX1+15),rackX2-15)} 56 Q${tom.cx} 90 ${tom.cx} ${tom.cy-tom.r-4}`} {...sl}/>
      ))}

      {/* ── Ride stand ── */}
      {ride && <>
        <path d={`M${ride.cx} ${ride.cy+ride.r+5} L${ride.cx} ${vbH-56}`} {...s}/>
        <line x1={ride.cx-26} y1={vbH-68} x2={ride.cx+26} y2={vbH-68} {...s}/>
        <line x1={ride.cx-26} y1={vbH-48} x2={ride.cx} y2={vbH-68} {...sl}/>
        <line x1={ride.cx+26} y1={vbH-48} x2={ride.cx} y2={vbH-68} {...sl}/>
      </>}

      {/* ── China stands ── */}
      {china && <>
        <path d={`M${china.cx} ${china.cy+china.r+4} L${china.cx} ${vbH-56}`} {...s}/>
        <line x1={china.cx-22} y1={vbH-66} x2={china.cx+22} y2={vbH-66} {...s}/>
      </>}
      {china2 && <>
        <path d={`M${china2.cx} ${china2.cy+china2.r+4} L${china2.cx} ${vbH-56}`} {...s}/>
        <line x1={china2.cx-20} y1={vbH-66} x2={china2.cx+20} y2={vbH-66} {...s}/>
      </>}

      {/* ── Snare stand (tripod) ── */}
      {snare && <>
        <line x1={snare.cx-16} y1={vbH-50} x2={snare.cx} y2={snare.cy+snare.r+8} {...sl}/>
        <line x1={snare.cx+16} y1={vbH-50} x2={snare.cx} y2={snare.cy+snare.r+8} {...sl}/>
        <line x1={snare.cx} y1={snare.cy+snare.r+8} x2={snare.cx} y2={vbH-46} {...sl}/>
      </>}

      {/* ── Floor tom legs (3-point) ── */}
      {floortom && <>
        <line x1={floortom.cx-floortom.r*.78} y1={vbH-52} x2={floortom.cx-floortom.r*.38} y2={floortom.cy+floortom.r+4} {...sl}/>
        <line x1={floortom.cx} y1={vbH-46} x2={floortom.cx} y2={floortom.cy+floortom.r+4} {...sl}/>
        <line x1={floortom.cx+floortom.r*.78} y1={vbH-52} x2={floortom.cx+floortom.r*.38} y2={floortom.cy+floortom.r+4} {...sl}/>
      </>}
      {floortom2 && <>
        <line x1={floortom2.cx-floortom2.r*.78} y1={vbH-52} x2={floortom2.cx-floortom2.r*.38} y2={floortom2.cy+floortom2.r+4} {...sl}/>
        <line x1={floortom2.cx} y1={vbH-46} x2={floortom2.cx} y2={floortom2.cy+floortom2.r+4} {...sl}/>
        <line x1={floortom2.cx+floortom2.r*.78} y1={vbH-52} x2={floortom2.cx+floortom2.r*.38} y2={floortom2.cy+floortom2.r+4} {...sl}/>
      </>}

      {/* ── Cowbell mount arm ── */}
      {cowbell && <path d={`M${cowbell.cx} ${cowbell.cy+cowbell.r+4} L${cowbell.cx+4} ${cowbell.cy+40}`} {...sc}/>}

      {/* ── Double kick connecting rod ── */}
      {(() => {
        const kr = find('kick_r'), kl = find('kick_l')
        if (!kr || !kl) return null
        const midX = (kr.cx + kl.cx)/2
        return <>
          <rect x={midX-18} y={kl.cy-22} width={36} height={7} rx={3.5} fill="#0c0c0c" stroke="#181818" strokeWidth="1"/>
          <circle cx={midX-15} cy={kl.cy-18.5} r={3} fill="#141414" stroke="#1e1e1e" strokeWidth=".8"/>
          <circle cx={midX+15} cy={kl.cy-18.5} r={3} fill="#141414" stroke="#1e1e1e" strokeWidth=".8"/>
        </>
      })()}

      {/* ── Cable from module to kit ── */}
      <path d="M62 286 Q88 310 104 360" fill="none" stroke="#0a0a12" strokeWidth="2.5" strokeLinecap="round"/>
    </>
  )
}
