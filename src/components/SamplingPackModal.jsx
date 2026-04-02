// SamplingPackModal.jsx — Choose sound pack for sampling pads
import SAMPLING_PACKS from '../data/samplingPresets.js'

export default function SamplingPackModal({ open, onClose, currentPack, onSelect }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{width:520}}>
        <h2>SAMPLING PAD SOUNDS</h2>
        <div className="modal-sub">ESCOLHA O PACK DE SONS PARA OS PADS DE SAMPLING</div>
        <div className="spd-grid">
          {SAMPLING_PACKS.map(pack=>(
            <div key={pack.id}
              className={`spd-card${pack.id===currentPack?' active':''}`}
              onClick={()=>{onSelect(pack.id);onClose()}}
            >
              <div className="spd-icon">{pack.icon}</div>
              <div className="spd-info">
                <div className="spd-name">{pack.name.toUpperCase()}</div>
                <div className="spd-desc">{pack.description}</div>
              </div>
              <div className="spd-zones">
                {pack.zones.map((z,i)=>(
                  <div key={i} className="spd-zone-chip"
                    style={{background:pack.colors[i]||'rgba(80,80,90,.15)',border:`1px solid ${pack.colors[i]||'transparent'}`}}>
                    {pack.labels[i]}
                  </div>
                ))}
              </div>
              {pack.id===currentPack&&(
                <div className="spd-active-badge">● ATIVO</div>
              )}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <div className="modal-hint">Cada zona (1-4) toca um som diferente do pack selecionado</div>
          <button className="m-btn primary" onClick={onClose}>FECHAR</button>
        </div>
      </div>
    </div>
  )
}
