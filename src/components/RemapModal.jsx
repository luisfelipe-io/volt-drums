// RemapModal.jsx — Keyboard remap interface
// Click instrument row → press key → assigns primary → press again for secondary
import { useState, useEffect, useCallback } from 'react'

export default function RemapModal({ open, onClose, drums, keyMap, setKeyMap }) {
  const [selectedId, setSelectedId] = useState(null)
  const [slot, setSlot] = useState('primary') // 'primary' | 'secondary'
  const [status, setStatus] = useState('— selecione um instrumento acima —')

  function selectDrum(id) {
    setSelectedId(id)
    setSlot('primary')
    const d = drums.find(x => x.id === id)
    setStatus(`→ tecla PRIMARY para: ${d?.name || id}`)
  }

  function resetAll() {
    import('../data/defaultKeys.js').then(({ default: DEFAULT_KEYS }) => {
      setKeyMap({ ...DEFAULT_KEYS })
      setStatus('✓ mapeamento padrão restaurado')
    })
  }

  useEffect(() => {
    if (!open || !selectedId) return

    function handleKey(e) {
      if (e.key === 'Escape') { onClose(); return }
      e.preventDefault()
      const k = e.key === ' ' ? ' ' : e.key.toLowerCase()
      if (k === 'enter') {
        if (slot === 'primary') {
          setSlot('secondary')
          const d = drums.find(x => x.id === selectedId)
          setStatus(`→ tecla SECONDARY para: ${d?.name || selectedId} (Enter para pular)`)
        } else {
          setSelectedId(null)
          setStatus('— selecione um instrumento —')
        }
        return
      }
      setKeyMap(prev => {
        const next = {}
        for (const id of Object.keys(prev)) {
          const arr = [...(prev[id] || [])]
          // Remove this key from any other slot
          for (let s = 0; s < arr.length; s++) { if (arr[s] === k) arr[s] = null }
          next[id] = arr
        }
        const target = [...(next[selectedId] || [])]
        target[slot === 'primary' ? 0 : 1] = k
        next[selectedId] = target
        return next
      })
      const display = k === ' ' ? 'SPACE' : k.toUpperCase()
      if (slot === 'primary') {
        setSlot('secondary')
        setStatus(`✓ PRIMARY: ${display} — agora pressione SECONDARY (Enter para pular)`)
      } else {
        setStatus(`✓ SECONDARY: ${display} — instrumento mapeado`)
        setSelectedId(null)
      }
    }

    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [open, selectedId, slot, drums, setKeyMap, onClose])

  if (!open) return null

  const drawableDrums = drums.filter(d => !d.sharedSvg)

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>KEY MAPPING</h2>
        <div className="modal-sub">SELECIONE UM INSTRUMENTO → PRESSIONE UMA TECLA</div>
        <div className="remap-grid">
          {drawableDrums.map(d => {
            const keys = keyMap[d.id] || []
            const p = keys[0] === ' ' ? 'SPACE' : (keys[0] || '—').toUpperCase()
            const s = keys[1] === ' ' ? 'SPACE' : (keys[1] || '—').toUpperCase()
            return (
              <div
                key={d.id}
                className={`remap-row${selectedId === d.id ? ' sel' : ''}`}
                onClick={() => selectDrum(d.id)}
              >
                <div className={`remap-icon${d.type === 'cymbal' ? ' cym' : ''}`}>
                  {d.type === 'cymbal' ? '◎' : d.type === 'kick' ? '●' : d.type === 'foot' ? '⊙' : d.type === 'sampling' ? '▦' : '◉'}
                </div>
                <div>
                  <div className="remap-name">{d.name}</div>
                  <div className="remap-keys">
                    PRI: <span>{p}</span> · SEC: <span>{s}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="modal-footer">
          <div id="remapStatus" style={{ fontFamily: 'var(--font-m)', fontSize: 8, letterSpacing: 2, color: selectedId ? 'var(--accent)' : 'var(--text)', flex: 1 }}>
            {status}
          </div>
          <button className="m-btn" onClick={resetAll}>RESET</button>
          <button className="m-btn primary" onClick={onClose}>FECHAR</button>
        </div>
      </div>
    </div>
  )
}
