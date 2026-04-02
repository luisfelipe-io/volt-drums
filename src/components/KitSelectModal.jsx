import PRESETS from '../data/presets.js'

export default function KitSelectModal({ open, onClose, currentPresetId, onSelect }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{width:680}}>
        <h2>SELECT KIT</h2>
        <div className="modal-sub">CHOOSE YOUR DRUM KIT — CHANGES ARE APPLIED INSTANTLY</div>
        <div className="kit-grid">
          {PRESETS.map(p=>(
            <div key={p.id}
              className={`kit-card${p.id===currentPresetId?' active':''}`}
              onClick={()=>{onSelect(p.id);onClose()}}>
              {p.tier==='premium'&&(
                <div style={{position:'absolute',top:10,right:10,fontFamily:'var(--font-mono)',fontSize:7,letterSpacing:2,color:'var(--led-amber)',border:'1px solid rgba(255,179,0,.25)',padding:'1px 5px',borderRadius:2}}>PRO</div>
              )}
              <div className="kit-name">{p.name.toUpperCase()}</div>
              <div className="kit-desc">{p.description}</div>
              <div className="kit-tags">{p.tags.map(t=><span key={t} className="kit-tag">{t}</span>)}</div>
              {p.id===currentPresetId&&<div style={{marginTop:8,fontFamily:'var(--font-mono)',fontSize:7,letterSpacing:3,color:'var(--accent)'}}>● ACTIVE</div>}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <div className="modal-hint">PRO kits require a subscription</div>
          <button className="m-btn primary" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  )
}
