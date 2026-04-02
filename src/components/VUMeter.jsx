// VUMeter.jsx v2 — Starts after first user interaction
import { useEffect, useRef } from 'react'
import { getEngine } from '../engine/AudioEngine.js'

export default function VUMeter() {
  const canvasRef = useRef(null)
  const frameRef  = useRef(null)
  const activeRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx2d = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const BARS = 24

    function draw() {
      frameRef.current = requestAnimationFrame(draw)
      // Guard: only draw if engine context is running
      let engine
      try { engine = getEngine() } catch { return }
      if (engine.ctx.state !== 'running') return

      const data = new Uint8Array(engine.analyser.frequencyBinCount)
      engine.analyser.getByteFrequencyData(data)

      ctx2d.clearRect(0, 0, W, H)
      const bw = Math.floor(W / BARS) - 1
      for (let i = 0; i < BARS; i++) {
        const idx = Math.floor(i / BARS * data.length * 0.55)
        const h   = Math.max(1, (data[idx] / 255) * (H - 2))
        const br  = h / (H - 2)
        ctx2d.fillStyle = br > .72
          ? `rgba(255,96,32,${.5 + br * .5})`
          : br > .4
          ? `rgba(100,152,180,${.4 + br * .5})`
          : `rgba(50,60,70,${.12 + br * .35})`
        ctx2d.fillRect(i * (bw + 1), H - h - 1, bw, h)
      }
    }

    function start() {
      if (activeRef.current) return
      activeRef.current = true
      draw()
    }

    // Start on first interaction
    window.addEventListener('pointerdown', start, { once: true })
    window.addEventListener('keydown', start, { once: true })

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
  }, [])

  return (
    <canvas ref={canvasRef} width={152} height={32} className="vu"/>
  )
}
