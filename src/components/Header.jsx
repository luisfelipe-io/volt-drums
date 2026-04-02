import VUMeter from './VUMeter.jsx'
import { useState } from 'react'

export default function Header({
  presetName, presetTier, accentColor,
  hitCount, hitDisplay, hitDisplayActive,
  recorder, hasSampling, samplingPackName,
  onOpenKit, onOpenRemap, onOpenCustomKit, onOpenSampling, onOpenFeedback,
}) {
  const [menu, setMenu] = useState(false)
  const { isRecording, hasAudio, duration, startRecording, stopRecording, downloadRecording } = recorder
  const handleRec = () => isRecording ? stopRecording() : startRecording()
  const isPremium = presetTier === 'premium'

  return (
    <header className="header">
      {/* Brand */}
      <div className="header-section">
        <span className="brand-name">DRUM SESSIONS</span>
        <button className="kit-name-btn" onClick={onOpenKit}>
          {presetName}
          {isPremium && <span style={{fontSize:7,color:'var(--led-amber)',marginLeft:3}}>PRO</span>}
          {' '}▾
        </button>
      </div>

      {/* VU Meter */}
      <div className="header-section desktop-only">
        <VUMeter/>
      </div>

      {/* Status */}
      <div className="header-section grow">
        <div className="led-row">
          <div className={`led-dot${isRecording?' recording':''}`}/>
        </div>
        <div className={`status-text${hitDisplayActive?' active':''}`}>
          {hitDisplayActive ? hitDisplay : 'READY'}
        </div>
      </div>

      {/* Hit counter */}
      <div className="header-section desktop-only" style={{gap:6}}>
        <div className="hit-count">{String(hitCount).padStart(6,'0')}</div>
      </div>

      {/* Recording buttons */}
      <div className="header-section desktop-only" style={{gap:5}}>
        <button className={`h-btn rec${isRecording?' recording':''}`} onClick={handleRec}>
          {isRecording ? `■ ${duration}` : '● REC'}
        </button>
        {hasAudio && !isRecording && (
          <button className="h-btn primary" onClick={downloadRecording}>⬇ WAV</button>
        )}
      </div>

      {/* Action buttons */}
      <div className="header-section desktop-only" style={{gap:5}}>
        {hasSampling && (
          <button className="h-btn spd" onClick={onOpenSampling}>▦ {samplingPackName}</button>
        )}
        <button className="h-btn" onClick={onOpenRemap}>KEYS</button>
        <button className="h-btn" onClick={onOpenCustomKit} title="Build your own kit">+ CUSTOM</button>
        <button className="h-btn" onClick={onOpenKit}>KITS</button>
        <button className="h-btn feedback-btn" onClick={onOpenFeedback} title="Send feedback">✉ FEEDBACK</button>
      </div>

      {/* Support button */}
      <div className="header-section desktop-only" style={{paddingLeft:8}}>
        <a
          href="https://www.paypal.com/donate/?business=3N87ZXBPN98RJ&no_recurring=0&item_name=Support+Drum+Sessions+Development&currency_code=USD"
          target="_blank" rel="noopener noreferrer"
          className="h-btn donate-btn" title="Support Drum Sessions development">
          ♥ SUPPORT
        </a>
      </div>

      {/* Mobile */}
      <div className="header-section mobile-only" style={{marginLeft:'auto',gap:5}}>
        <button
          className={`h-btn rec${isRecording?' recording':''}${hasAudio&&!isRecording?' primary':''}`}
          onClick={hasAudio&&!isRecording ? downloadRecording : handleRec}>
          {hasAudio&&!isRecording?'⬇':isRecording?`■ ${duration}`:'●'}
        </button>
        <div className="mobile-menu-wrap">
          <button className="h-btn" onClick={()=>setMenu(v=>!v)}>{menu?'✕':'≡'}</button>
          {menu && (
            <div className="mobile-menu" onClick={()=>setMenu(false)}>
              <button className="h-btn" onClick={onOpenKit}>🥁 Kits</button>
              <button className="h-btn" onClick={onOpenCustomKit}>+ Custom Kit</button>
              {hasSampling && (
                <button className="h-btn" onClick={onOpenSampling}>▦ Sampling Sounds</button>
              )}
              <button className="h-btn" onClick={onOpenRemap}>⌨ Key Mapping</button>
              <button className="h-btn feedback-btn" onClick={onOpenFeedback}>✉ Send Feedback</button>
              <a
                href="https://www.paypal.com/donate/?business=3N87ZXBPN98RJ&no_recurring=0&item_name=Support+Drum+Sessions+Development&currency_code=USD"
                target="_blank" rel="noopener noreferrer"
                className="h-btn donate-btn">♥ Support Project</a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
