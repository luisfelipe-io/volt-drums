// ControlBar.jsx v7 — Global velocity mode selector for samples
import { useEffect } from 'react'
import { getEngine } from '../engine/AudioEngine.js'
import { setVelocityMode } from '../engine/SampleEngine.js'

// F1-F4 shortcut keys for velocity
const VEL_MODES = [
  { id:'soft',   label:'SOFT', key:'F1' },
  { id:'medium', label:'MED',  key:'F2' },
  { id:'hard',   label:'HARD', key:'F3' },
  { id:'ffhard', label:'LOUD', key:'F4' },
]

export default function ControlBar({ volume,setVolume,reverb,setReverb,dualStick,setDualStick,velMode,setVelMode }) {
  function handleVol(e)  { setVolume(e.target.value); try{getEngine().setVolume(e.target.value/100)}catch{} }
  function handleRev(e)  { setReverb(e.target.value); try{getEngine().setReverb(e.target.value/100)}catch{} }
  function handleVel(id) { setVelMode(id); try{setVelocityMode(id)}catch{} }

  // F1-F4 shortcuts for velocity while playing
  useEffect(() => {
    function onKey(e) {
      const m = VEL_MODES.find(v => v.key === e.key)
      if (m) { e.preventDefault(); handleVel(m.id) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])  // eslint-disable-line

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
      <div className="ctrl-section ctrl-vel-section">
        <span className="ctrl-label">VEL</span>
        <div className="ctrl-vel-btns">
          {VEL_MODES.map(m=>(
            <button key={m.id}
              className={`ctrl-vel-btn${velMode===m.id?' active':''}`}
              onClick={()=>handleVel(m.id)}
              title={`Velocity: ${m.id}`}
          ><span>{m.label}</span><span className="vel-key-hint">{m.key}</span></button>
          ))}
        </div>
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
