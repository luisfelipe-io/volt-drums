// App.jsx v7 — No add-ons, custom kit placeholder, sampling zone keys, rec+seq sync

import { useState, useCallback, useRef, useEffect } from 'react'
import PRESETS from './data/presets.js'
import DEFAULT_KEYS, { SAMPLING_KEYS } from './data/defaultKeys.js'
import { playSound, playSamplingZone } from './engine/SoundBank.js'
import { ensureEngine, getEngine } from './engine/AudioEngine.js'
import { triggerFlam } from './components/FlamBadge.jsx'
import SAMPLING_PACKS, { DEFAULT_SAMPLING_PACK } from './data/samplingPresets.js'
import useKeyboard from './hooks/useKeyboard.js'
import useRecorder from './hooks/useRecorder.js'
import useSequencer from './hooks/useSequencer.js'

import Header from './components/Header.jsx'
import KitSVG from './components/KitSVG.jsx'
import ControlBar from './components/ControlBar.jsx'
import Sequencer from './components/Sequencer.jsx'
import FlamBadge from './components/FlamBadge.jsx'
import RemapModal from './components/RemapModal.jsx'
import KitSelectModal from './components/KitSelectModal.jsx'
import SamplingPackModal from './components/SamplingPackModal.jsx'
import FeedbackModal from './components/FeedbackModal.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import { preloadSamples, playSample, hasSample } from './engine/SampleEngine.js'

const HIT_DURATION = 380
const PEDAL_IDS = new Set(['kick_r','kick_l','hihat_pedal'])

export default function App() {
  const [presetId, setPresetId] = useState('rock')
  const preset = PRESETS.find(p=>p.id===presetId)||PRESETS[0]
  const activeItems = preset.essential

  const [keyMap, setKeyMap] = useState(()=>{
    try{const s=localStorage.getItem('vd-km');if(s)return JSON.parse(s)}catch{}
    return {...DEFAULT_KEYS}
  })
  useEffect(()=>{localStorage.setItem('vd-km',JSON.stringify(keyMap))},[keyMap])

  // Preload samples on mount
  useEffect(()=>{
    window.__sampleEngine = { playSample, hasSample }
    preloadSamples((ratio, loaded, total) => {
      setLoadingProgress(ratio)
      setLoadedCount(loaded)
      setTotalCount(total)
      if (ratio >= 1) setLoadingDone(true)
    }).then(()=>setLoadingDone(true)).catch(()=>setLoadingDone(true))
  }, [])

  const [samplingPack, setSamplingPack] = useState(DEFAULT_SAMPLING_PACK)
  const [volume, setVolume]   = useState(80)
  const [reverb, setReverb]   = useState(38)
  const [dualStick, setDualStick] = useState(true)
  const [velMode, setVelMode]     = useState('medium')

  const [hitDisplay, setHitDisplay]         = useState('')
  const [hitDisplayActive, setHitDA]        = useState(false)
  const [hitCount, setHitCount]             = useState(0)
  const [hitStates, setHitStates]           = useState({})

  const hitTimerRef = useRef(null)
  const hitTimers   = useRef({})
  const lastHT      = useRef({})
  const touchSticks = useRef(new Set())

  const [showRemap,    setShowRemap]    = useState(false)
  const [showKit,      setShowKit]      = useState(false)
  const [showSampling, setShowSampling] = useState(false)
  const [showFeedback, setShowFeedback]   = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingDone, setLoadingDone]         = useState(false)
  const [loadedCount, setLoadedCount]         = useState(0)
  const [totalCount, setTotalCount]           = useState(0)
  const [showCustom,   setShowCustom]   = useState(false)

  const recorder = useRecorder()

  // ── Flash helper ──────────────────────────────────────────────────────────
  const flashDrum = useCallback((drumId, side) => {
    setHitStates(prev=>({...prev,[drumId]:side}))
    clearTimeout(hitTimers.current[drumId])
    hitTimers.current[drumId]=setTimeout(()=>{
      setHitStates(prev=>{const n={...prev};delete n[drumId];return n})
    }, HIT_DURATION)
  },[])

  // ── Core hit ──────────────────────────────────────────────────────────────
  const fireHit = useCallback((drumId,side='primary',zone=0,vel=-1)=>{
    const drum=activeItems.find(d=>d.id===drumId); if(!drum) return
    const now=performance.now()
    const dt=now-(lastHT.current[drumId]||0)
    if(dt>5&&dt<32) triggerFlam()
    lastHT.current[drumId]=now
    const velocity=vel>0?vel:dt<120?Math.min(1,.82+dt/1000):.78+Math.random()*.24
    if(drum.type==='sampling'){
      const pack=SAMPLING_PACKS.find(p=>p.id===samplingPack)||SAMPLING_PACKS[0]
      playSamplingZone(pack.zones[zone]||pack.zones[0],velocity,drum.pan,drum.revSend)
    } else {
      playSound(drum.soundId,velocity,drum.pan,drum.revSend,preset.soundProfile)
    }
    setHitCount(c=>c+1)
    setHitDisplay(drum.type==='sampling'?`${drum.name} Z${zone+1}`:drum.name)
    setHitDA(true)
    clearTimeout(hitTimerRef.current)
    hitTimerRef.current=setTimeout(()=>{setHitDisplay('');setHitDA(false)},580)
    flashDrum(drumId,side)
  },[activeItems,preset.soundProfile,samplingPack,flashDrum])

  // ── Sequencer scheduled hit ────────────────────────────────────────────────
  const scheduleHit = useCallback((drumId,audioTime,vel)=>{
    const drum=activeItems.find(d=>d.id===drumId); if(!drum) return
    try{
      const{ctx}=getEngine()
      const ms=Math.max(0,(audioTime-ctx.currentTime)*1000)
      setTimeout(()=>{
        if(drum.type==='sampling'){
          const pack=SAMPLING_PACKS.find(p=>p.id===samplingPack)||SAMPLING_PACKS[0]
          playSamplingZone(pack.zones[0],vel,drum.pan,drum.revSend)
        } else {
          playSound(drum.soundId,vel,drum.pan,drum.revSend,preset.soundProfile)
        }
      },ms)
      setTimeout(()=>flashDrum(drumId,'seq'),ms)
    }catch{}
  },[activeItems,preset.soundProfile,samplingPack,flashDrum])

  const seq = useSequencer(activeItems, scheduleHit)

  // ── Record + Seq sync — toggle: start both or stop both ──────────────────
  function handleRecordSync() {
    ensureEngine()
    if (seq.playing && recorder.isRecording) {
      seq.stop()
      recorder.stopRecording()
    } else {
      recorder.startRecording()
      seq.play()
    }
  }

  // ── Mouse/touch ──────────────────────────────────────────────────────────
  const handleHit = useCallback((drumId,side='primary',zone=0)=>{
    ensureEngine()
    if(!PEDAL_IDS.has(drumId)){
      if(touchSticks.current.size>=2&&!touchSticks.current.has(drumId)) return
      touchSticks.current.add(drumId)
      setTimeout(()=>touchSticks.current.delete(drumId),150)
    }
    fireHit(drumId,side,zone)
  },[fireHit])

  const handleKeyHit = useCallback((drumId,side)=>{ensureEngine();fireHit(drumId,side,0)},[fireHit])
  useKeyboard(activeItems,keyMap,dualStick,handleKeyHit)

  // ── Sampling zone global keys (1-8) ─────────────────────────────────────
  // Uses a held-key Set to prevent machine-gun effect on key repeat
  const heldSamplingKeys = useRef(new Set())
  useEffect(()=>{
    function onKeyDown(e){
      const entry=SAMPLING_KEYS[e.key]
      if(!entry) return
      // Ignore key-repeat (e.repeat=true) and already-held keys
      if(e.repeat) return
      if(heldSamplingKeys.current.has(e.key)) return
      heldSamplingKeys.current.add(e.key)
      const drum=activeItems.find(d=>d.id===entry.padId)
      if(!drum) return
      e.preventDefault()
      ensureEngine()
      fireHit(entry.padId,'primary',entry.zone)
    }
    function onKeyUp(e){
      heldSamplingKeys.current.delete(e.key)
    }
    window.addEventListener('keydown',onKeyDown)
    window.addEventListener('keyup',onKeyUp)
    return()=>{
      window.removeEventListener('keydown',onKeyDown)
      window.removeEventListener('keyup',onKeyUp)
    }
  },[activeItems,fireHit])

  function handlePresetChange(id){setPresetId(id);setHitStates({});seq.stop()}

  const hasSampling=activeItems.some(d=>d.type==='sampling')

  return (
    <div className="app" onPointerDown={()=>ensureEngine()}>
      <Header
        presetName={preset.name.toUpperCase()}
        presetTier={preset.tier}
        accentColor={preset.accentColor}
        hitCount={hitCount}
        hitDisplay={hitDisplay}
        hitDisplayActive={hitDisplayActive}
        recorder={recorder}
        hasSampling={hasSampling}
        samplingPackName={SAMPLING_PACKS.find(p=>p.id===samplingPack)?.name}
        onOpenKit={()=>setShowKit(true)}
        onOpenRemap={()=>setShowRemap(true)}
        onOpenCustomKit={()=>setShowCustom(true)}
        onOpenSampling={()=>setShowSampling(true)}
        onOpenFeedback={()=>setShowFeedback(true)}
      />
      <div className="body-row">
        <div className="center-col">
          <main>
            <KitSVG preset={preset} activeItems={activeItems} hitStates={hitStates}
              keyMap={keyMap} dualStick={dualStick} onHit={handleHit} samplingPack={samplingPack}/>
          </main>
          <ControlBar volume={volume} setVolume={setVolume} reverb={reverb} setReverb={setReverb} dualStick={dualStick} setDualStick={setDualStick} velMode={velMode} setVelMode={setVelMode}/>
          <Sequencer seq={seq} activeItems={activeItems} onRecordSync={handleRecordSync} presetId={presetId} isRecording={recorder.isRecording}/>
        </div>
      </div>
      <FlamBadge/>

      {showRemap&&<RemapModal open onClose={()=>setShowRemap(false)} drums={activeItems} keyMap={keyMap} setKeyMap={setKeyMap}/>}
      {showKit&&<KitSelectModal open onClose={()=>setShowKit(false)} currentPresetId={presetId} onSelect={handlePresetChange}/>}
      {showSampling&&<SamplingPackModal open onClose={()=>setShowSampling(false)} currentPack={samplingPack} onSelect={setSamplingPack}/>}
      {showFeedback&&<FeedbackModal open onClose={()=>setShowFeedback(false)}/>}

      {/* Custom Kit — coming soon modal */}
      {showCustom&&(
        <div className="modal-overlay" onClick={()=>setShowCustom(false)}>
          <div className="modal" style={{width:400,textAlign:'center'}}>
            <div style={{fontSize:32,marginBottom:12}}>🥁</div>
            <h2>CUSTOM KIT BUILDER</h2>
            <div className="modal-sub" style={{marginBottom:20}}>EM BREVE — RECURSO PREMIUM</div>
            <p style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.6,marginBottom:20}}>
              Monte sua bateria do zero: escolha cada instrumento, ajuste a posição, customize os sons.
              Este recurso estará disponível em breve para assinantes.
            </p>
            <button className="m-btn primary" onClick={()=>setShowCustom(false)}>ENTENDIDO</button>
          </div>
        </div>
      )}
    </div>
  )
}
