// useKeyboard.js v3
// Space is EXCLUDED (handled by Sequencer).
// 2-stick limit enforced. Sampling zone keys handled in App.jsx.

import { useEffect, useRef } from 'react'

const PEDAL_IDS   = new Set(['kick_r','kick_l','hihat_pedal'])
const IGNORE_KEYS = new Set([' '])  // handled elsewhere

export default function useKeyboard(activeDrums, keyMap, dualStick, onHit) {
  const held       = useRef(new Set())
  const stickKeys  = useRef(new Set())
  const onHitRef   = useRef(onHit)
  onHitRef.current = onHit

  useEffect(() => {
    if (!activeDrums?.length) return

    const lookup = {}
    for (const drum of activeDrums) {
      const keys = keyMap[drum.id] || []
      if (keys[0] != null && !IGNORE_KEYS.has(keys[0]))
        lookup[keys[0]] = { drumId: drum.id, side: 'primary' }
      if (dualStick && keys[1] != null && !IGNORE_KEYS.has(keys[1]))
        lookup[keys[1]] = { drumId: drum.id, side: 'secondary' }
    }

    function onDown(e) {
      if (e.key === 'Tab') e.preventDefault()
      const k = e.key.toLowerCase()
      if (IGNORE_KEYS.has(k)) return
      if (held.current.has(k)) return
      held.current.add(k)

      const entry = lookup[k]
      if (!entry) return

      const isPedal = PEDAL_IDS.has(entry.drumId)
      if (!isPedal) {
        if (stickKeys.current.size >= 2) return
        stickKeys.current.add(k)
      }
      onHitRef.current(entry.drumId, entry.side)
    }
    function onUp(e) {
      const k = e.key.toLowerCase()
      held.current.delete(k)
      stickKeys.current.delete(k)
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      stickKeys.current.clear()
    }
  }, [activeDrums, keyMap, dualStick])
}
