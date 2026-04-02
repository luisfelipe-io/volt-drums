// Sequencer.jsx v7
// Mobile fixes:
//   - Toggle button always visible (larger touch target)
//   - Expanded panel uses position:fixed covering full viewport
//   - Close button prominent at top
//   - Auto-close when play starts

import { useState, useEffect } from 'react'
import BEAT_PRESETS from '../data/beatPresets.js'

const STEP_COUNTS   = [8, 16, 32]
const SEQ_TYPES     = ['kick','foot','pad','cymbal','bell','sampling']
const DEFAULT_STEPS = 16

export default function Sequencer({ seq, activeItems, onRecordSync, presetId, isRecording }) {
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [desktopCollapsed, setDeskCollapsed] = useState(false)
  const [activeGroove, setActiveGroove]     = useState(null)
  const [saveModalOpen, setSaveModalOpen]   = useState(false)
  const [saveName, setSaveName]             = useState('')
  const [savedNames, setSavedNames]         = useState(() => seq.getSavedPatternNames())

  seq.activeItemsRef.current = activeItems

  // Auto-close mobile overlay when seq starts playing
  useEffect(() => {
    if (seq.playing && mobileOpen) setMobileOpen(false)
  }, [seq.playing])

  // Space = play/pause
  useEffect(() => {
    function onKey(e) {
      if (e.key !== ' ') return
      if (['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName)) return
      e.preventDefault(); e.stopImmediatePropagation()
      seq.toggle()
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [seq.toggle])

  const seqItems = activeItems.filter(d => !d.sharedSvg && SEQ_TYPES.includes(d.type))
  const kitGrooves = BEAT_PRESETS[presetId] || []

  function loadGroove(preset) { setActiveGroove(preset.name); seq.loadPreset(preset) }
  function handleClear() { seq.clearPattern(); seq.setStepCount(DEFAULT_STEPS); setActiveGroove(null) }

  function handleSave() {
    const name = saveName.trim(); if (!name) return
    if (seq.savePattern(name)) {
      setSavedNames(seq.getSavedPatternNames()); setSaveName(''); setSaveModalOpen(false)
    }
  }
  function handleLoad(name) { seq.loadSavedPattern(name); setActiveGroove(null) }
  function handleDelete(name) { seq.deleteSavedPattern(name); setSavedNames(seq.getSavedPatternNames()) }

  function stepClass(drumId, step) {
    const a = seq.patterns[drumId]?.[step], c = seq.currentStep === step
    return `seq-step${a?' active':''}${c?' current':''}${a&&c?' active-current':''}`
  }
  function velColor(drumId, step) {
    const v = seq.velocity?.[`${drumId}_${step}`] ?? 100
    if (v >= 120) return 'var(--step-vel-ff)'
    if (v >= 90)  return 'var(--step-active)'
    if (v >= 70)  return 'var(--step-vel-med)'
    return 'var(--step-vel-lo)'
  }

  // ── Transport bar ─────────────────────────────────────────────────────────
  const transportRow = (
    <div className="seq-transport">
      <div className="seq-transport-left">
        <button className={`seq-play-btn${seq.playing?' playing':''}`}
          onClick={seq.toggle} title="Play / Stop  (Space)">
          {seq.playing ? '■' : '▶'}
        </button>
        <button
          className={`seq-rec-sync-btn${seq.playing && isRecording?' active':''}`}
          onClick={onRecordSync}
          title={seq.playing && isRecording ? 'Stop recording + sequencer' : 'Start recording + sequencer simultaneously'}
        >{seq.playing && isRecording ? '■ REC' : '⏺+▶'}</button>
        <div className="seq-bpm-control">
          <span className="seq-label">BPM</span>
          <input type="range" min={40} max={280} value={seq.bpm}
            onChange={e => seq.setBpm(Number(e.target.value))} className="seq-bpm-slider"/>
          <span className="seq-bpm-value">{seq.bpm}</span>
        </div>
        <div className="seq-swing-control">
          <span className="seq-label">SWING</span>
          <input type="range" min={0} max={50} value={seq.swing}
            onChange={e => seq.setSwing(Number(e.target.value))} className="seq-bpm-slider"/>
          <span className="seq-val">{seq.swing}%</span>
        </div>
        <div className="seq-steps-control">
          <span className="seq-label">STEPS</span>
          <div className="seq-steps-btns">
            {STEP_COUNTS.map(n => (
              <button key={n} className={`seq-steps-btn${seq.stepCount===n?' active':''}`}
                onClick={() => seq.setStepCount(n)}>{n}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="seq-transport-right">
        {kitGrooves.length > 0 && <>
          <span className="seq-label seq-label-sm">GROOVES</span>
          {kitGrooves.map(g => (
            <button key={g.name}
              className={`seq-preset-btn${activeGroove===g.name?' active-groove':''}`}
              onClick={() => loadGroove(g)}>{g.name}</button>
          ))}
        </>}
        {savedNames.length > 0 && (
          <div className="seq-saved-wrap">
            <span className="seq-label seq-label-sm">SAVED</span>
            {savedNames.map(name => (
              <div key={name} className="seq-saved-item">
                <button className="seq-preset-btn" onClick={() => handleLoad(name)}>{name}</button>
                <button className="seq-saved-del" onClick={() => handleDelete(name)}>×</button>
              </div>
            ))}
          </div>
        )}
        <button className="seq-preset-btn" onClick={() => setSaveModalOpen(true)} title="Save pattern">💾</button>
        <button className="seq-preset-btn danger" onClick={handleClear}>CLR</button>
        <button
          className="seq-collapse-btn seq-collapse-inline"
          onClick={() => setDeskCollapsed(v => !v)}
          title={desktopCollapsed ? 'Expand sequencer' : 'Collapse sequencer'}
        >{desktopCollapsed ? '▲' : '▼'}</button>
      </div>
    </div>
  )

  // ── Grid ──────────────────────────────────────────────────────────────────
  const gridSection = (
    <div className="seq-scroll-wrapper">
      <div className="seq-grid">
        <div className="seq-row seq-header-row">
          <div className="seq-row-label"/>
          <div className="seq-steps-header">
            {Array.from({ length: seq.stepCount }, (_, i) => (
              <div key={i}
                className={`seq-step-num${seq.currentStep===i?' current':''}${i%4===0?' beat':''}`}>
                {i%4===0 ? i/4+1 : '·'}
              </div>
            ))}
          </div>
        </div>
        {seqItems.map(drum => (
          <div key={drum.id} className="seq-row">
            <div className="seq-row-label">
              <span className="seq-row-name">{drum.label}</span>
              <button className="seq-row-clear" onClick={() => seq.clearPattern(drum.id)}>×</button>
            </div>
            <div className="seq-steps">
              {Array.from({ length: seq.stepCount }, (_, step) => (
                <button key={step}
                  className={stepClass(drum.id, step)}
                  onPointerDown={e => { if (e.button===2) return; seq.toggleStep(drum.id, step) }}
                  onContextMenu={e => {
                    e.preventDefault()
                    const k=`${drum.id}_${step}`, cur=seq.velocity?.[k]??100
                    seq.setStepVelocity(drum.id,step,cur>=120?60:cur>=90?127:cur>=70?100:80)
                  }}
                  style={seq.patterns[drum.id]?.[step]?{'--step-color':velColor(drum.id,step)}:{}}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* ═══ DESKTOP ═══════════════════════════════════════════════════════ */}
      <div className={`sequencer-panel seq-desktop${desktopCollapsed?' collapsed':''}`}>
        {transportRow}
        {!desktopCollapsed && gridSection}
      </div>

      {/* ═══ MOBILE ════════════════════════════════════════════════════════ */}
      <div className="seq-mobile">
        {/* Always-visible compact bar */}
        <div className="seq-mobile-bar">
          {/* Play/stop */}
          <button className={`seq-play-btn${seq.playing?' playing':''}`}
            onClick={seq.toggle} style={{flexShrink:0}}>
            {seq.playing ? '■' : '▶'}
          </button>

          {/* BPM + beat indicator — tap to open */}
          <button className="seq-mobile-info" onClick={() => setMobileOpen(true)}>
            <span className="seq-bpm-value">{seq.bpm}</span>
            <span className="seq-label" style={{marginLeft:4,fontSize:7}}>BPM</span>
            {seq.playing && (
              <span className="seq-mobile-beats">
                {Array.from({length:4},(_,i)=>(
                  <span key={i}
                    className={`seq-beat-dot${
                      Math.floor(((seq.currentStep||0) % seq.stepCount) / (seq.stepCount/4)) === i
                        ? ' active' : ''
                    }`}
                  />
                ))}
              </span>
            )}
            {activeGroove && <span className="seq-mobile-groove-name">{activeGroove}</span>}
          </button>

          {/* Open sequencer button — large, always visible */}
          <button
            className="seq-mobile-open-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sequencer"
          >
            ☰ SEQ
          </button>
        </div>
      </div>

      {/* ═══ MOBILE FULL-SCREEN OVERLAY ════════════════════════════════════ */}
      {mobileOpen && (
        <div className="seq-mobile-overlay" onClick={e => {
          // Close if tapping the backdrop (not the content)
          if (e.target === e.currentTarget) setMobileOpen(false)
        }}>
          <div className="seq-mobile-overlay-panel">
            {/* Header with close */}
            <div className="seq-mobile-overlay-header">
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <button
                  className={`seq-play-btn${seq.playing?' playing':''}`}
                  onClick={() => { seq.toggle(); if(!seq.playing) setMobileOpen(false) }}
                  style={{width:44,height:44,fontSize:16}}>
                  {seq.playing ? '■' : '▶'}
                </button>
                <span className="seq-mobile-overlay-title">SEQUENCER</span>
              </div>
              <button
                className="seq-mobile-close-btn"
                onClick={() => setMobileOpen(false)}
                aria-label="Close sequencer">
                ✕ CLOSE
              </button>
            </div>

            {/* Full scrollable content */}
            <div className="seq-mobile-overlay-content">
              {transportRow}
              {gridSection}
            </div>
          </div>
        </div>
      )}

      {/* Save modal */}
      {saveModalOpen && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSaveModalOpen(false)}>
          <div className="modal" style={{width:360}}>
            <h2>SAVE PATTERN</h2>
            <div className="modal-sub">ENTER A NAME FOR THIS PATTERN</div>
            <input type="text" className="save-pattern-input"
              placeholder="e.g. My Jazz Groove" value={saveName}
              onChange={e=>setSaveName(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter')handleSave()}} autoFocus/>
            <div className="modal-footer">
              <button className="m-btn" onClick={()=>setSaveModalOpen(false)}>CANCEL</button>
              <button className="m-btn primary" onClick={handleSave}>SAVE</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
