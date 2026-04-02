// FlamBadge.jsx — Shows "⚡ FLAM" when two hits on same drum occur within 30ms
import { useEffect, useRef, useCallback } from 'react'

let _trigger = null
export function triggerFlam() { if (_trigger) _trigger() }

export default function FlamBadge() {
  const ref = useRef(null)

  const trigger = useCallback(() => {
    if (!ref.current) return
    ref.current.classList.remove('show')
    void ref.current.getBoundingClientRect()
    ref.current.classList.add('show')
  }, [])

  useEffect(() => { _trigger = trigger; return () => { _trigger = null } }, [trigger])

  return <div className="flam-badge" ref={ref}>⚡ FLAM</div>
}
