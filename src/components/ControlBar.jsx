// ControlBar.jsx v6 — Minimal DAW-style controls
import { useRef } from 'react'
import { getEngine } from '../engine/AudioEngine.js'

export default function ControlBar({ volume,setVolume,reverb,setReverb,dualStick,setDualStick }) {
  function handleVol(e) {
    setVolume(e.target.value)
    try { getEngine().setVolume(e.target.value/100) } catch {}
  }
  function handleRev(e) {
    setReverb(e.target.value)
    try { getEngine().setReverb(e.target.value/100) } catch {}
  }

  return (
    <div className="ctrl-bar">
      <div className="ctrl-section">
        <span className="ctrl-label">VOL</span>
        <input type="range" min={0} max={100} value={volume} onChange={handleVol} className="ctrl-slider"/>
        <span className="ctrl-value">{volume}</span>
      </div>
      <div className="ctrl-section">
        <span className="ctrl-label">REV</span>
        <input type="range" min={0} max={100} value={reverb} onChange={handleRev} className="ctrl-slider"/>
        <span className="ctrl-value">{reverb}</span>
      </div>
      <div className="ctrl-section grow"/>
      <div className="ctrl-section" style={{gap:8}}>
        <div className="ctrl-toggle" onClick={()=>setDualStick(v=>!v)}>
          <span className="ctrl-label" style={{minWidth:'auto'}}>DUAL STICK</span>
          <div className={`tog${dualStick?' on':''}`}><div className="tog-th"/></div>
        </div>
      </div>
    </div>
  )
}
