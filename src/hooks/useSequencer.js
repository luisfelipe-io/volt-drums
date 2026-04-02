// useSequencer.js v2 — Web Audio lookahead clock + localStorage persistence
import { useRef, useState, useCallback, useEffect } from 'react'
import { getEngine } from '../engine/AudioEngine.js'

const LOOKAHEAD_MS  = 25
const SCHEDULE_SEC  = 0.10
const DEFAULT_STEPS = 16
const STORAGE_KEY   = 'vd-patterns'

export default function useSequencer(activeItems, onScheduleHit) {
  const [playing, setPlaying]       = useState(false)
  const [stepCount, setStepCountS]  = useState(DEFAULT_STEPS)
  const [currentStep, setCurrentStep] = useState(-1)
  const [bpm, setBpmS]              = useState(120)
  const [swing, setSwingS]          = useState(0)
  const [patterns, setPatterns]     = useState({})
  const [velocity, setVelocity]     = useState({})

  const playingRef   = useRef(false)
  const stepCountRef = useRef(DEFAULT_STEPS)
  const bpmRef       = useRef(120)
  const swingRef     = useRef(0)
  const patternsRef  = useRef({})
  const velocityRef  = useRef({})
  const nextNoteRef  = useRef(0)
  const nextStepRef  = useRef(0)
  const schedulerRef = useRef(null)
  const prevStepRef  = useRef(-1)
  const onHitRef     = useRef(onScheduleHit)
  const activeRef    = useRef([])

  onHitRef.current   = onScheduleHit
  patternsRef.current= patterns
  velocityRef.current= velocity
  bpmRef.current     = bpm
  swingRef.current   = swing
  stepCountRef.current = stepCount
  activeRef.current  = activeItems

  function stepDur(step) {
    const base = 60 / bpmRef.current / 4  // 16th note in seconds
    const sAmt = (swingRef.current / 100) * base * 0.5
    return step % 2 === 0 ? base - sAmt : base + sAmt
  }

  function scheduler() {
    try {
      const engine = getEngine()
      const { ctx } = engine
      // Pause scheduling when tab is hidden to prevent audio buildup
      if (engine.isHidden && engine.isHidden()) {
        schedulerRef.current = setTimeout(scheduler, LOOKAHEAD_MS * 4)
        return
      }
      while (nextNoteRef.current < ctx.currentTime + SCHEDULE_SEC) {
        const step = nextStepRef.current
        const time = nextNoteRef.current
        const pat = patternsRef.current
        for (const [drumId, steps] of Object.entries(pat)) {
          if (steps[step]) {
            const velKey = `${drumId}_${step}`
            const v = (velocityRef.current[velKey] ?? 100) / 127
            onHitRef.current(drumId, time, v)
          }
        }
        nextNoteRef.current += stepDur(step)
        nextStepRef.current = (step + 1) % stepCountRef.current
      }
      // Update visual step
      const vis = ((nextStepRef.current - 1) + stepCountRef.current) % stepCountRef.current
      if (vis !== prevStepRef.current) {
        prevStepRef.current = vis
        setCurrentStep(vis)
      }
    } catch (e) {
      console.warn('[Sequencer] scheduler error:', e)
    }
    schedulerRef.current = setTimeout(scheduler, LOOKAHEAD_MS)
  }

  const play = useCallback(() => {
    try {
      const { ctx } = getEngine()
      if (ctx.state === 'suspended') ctx.resume()
      nextNoteRef.current = ctx.currentTime + 0.04
      nextStepRef.current = 0
      prevStepRef.current = -1
      playingRef.current  = true
      setPlaying(true)
      scheduler()
    } catch (e) { console.warn('[Sequencer] play error:', e) }
  }, [])

  const stop = useCallback(() => {
    clearTimeout(schedulerRef.current)
    playingRef.current = false
    setPlaying(false)
    setCurrentStep(-1)
    prevStepRef.current = -1
  }, [])

  const toggle = useCallback(() => {
    if (playingRef.current) stop(); else play()
  }, [play, stop])

  // Restart if playing when BPM changes
  useEffect(() => {
    if (playingRef.current) { stop(); setTimeout(play, 60) }
  }, [bpm])

  // ── Setters that sync refs ───────────────────────────────────────────────
  const setBpm   = useCallback(v => { bpmRef.current=v;   setBpmS(v)   }, [])
  const setSwing = useCallback(v => { swingRef.current=v; setSwingS(v) }, [])

  const setStepCount = useCallback(n => {
    setStepCountS(n)
    stepCountRef.current = n
    setPatterns(prev => {
      const next = {}
      for (const [id, steps] of Object.entries(prev)) {
        const arr = Array(n).fill(false)
        steps.forEach((v, i) => { if (i < n) arr[i] = v })
        next[id] = arr
      }
      return next
    })
  }, [])

  // ── Pattern editing ──────────────────────────────────────────────────────
  const toggleStep = useCallback((drumId, step) => {
    setPatterns(prev => {
      const steps = [...(prev[drumId] || Array(stepCountRef.current).fill(false))]
      while (steps.length < stepCountRef.current) steps.push(false)
      steps[step] = !steps[step]
      return { ...prev, [drumId]: steps }
    })
  }, [])

  const setStepVelocity = useCallback((drumId, step, vel) => {
    setVelocity(prev => ({ ...prev, [`${drumId}_${step}`]: vel }))
  }, [])

  const clearPattern = useCallback((drumId) => {
    if (drumId) {
      setPatterns(prev => ({ ...prev, [drumId]: Array(stepCountRef.current).fill(false) }))
    } else {
      setPatterns({})
      setVelocity({})
    }
  }, [])

  // ── Load a named preset ──────────────────────────────────────────────────
  const loadPreset = useCallback((preset) => {
    const n = preset.steps && Object.values(preset.steps)[0]?.length || DEFAULT_STEPS
    const newN = n
    setStepCountS(newN)
    stepCountRef.current = newN
    setBpm(preset.bpm || 120)
    setSwing(preset.swing || 0)
    const newPat = {}
    const activeIds = new Set(activeRef.current.map(d => d.id))
    for (const [id, steps] of Object.entries(preset.steps || {})) {
      if (!activeIds.has(id)) continue
      const arr = Array(newN).fill(false)
      steps.forEach((v, i) => { if (i < newN) arr[i] = Boolean(v) })
      newPat[id] = arr
    }
    setPatterns(newPat)
  }, [])

  // ── localStorage persistence ─────────────────────────────────────────────
  const savePattern = useCallback((name) => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      saved[name] = { bpm, swing, stepCount, patterns, velocity }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
      return true
    } catch { return false }
  }, [bpm, swing, stepCount, patterns, velocity])

  const loadSavedPattern = useCallback((name) => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      const data = saved[name]
      if (!data) return false
      setBpm(data.bpm || 120)
      setSwing(data.swing || 0)
      setStepCount(data.stepCount || DEFAULT_STEPS)
      setPatterns(data.patterns || {})
      setVelocity(data.velocity || {})
      return true
    } catch { return false }
  }, [])

  const getSavedPatternNames = useCallback(() => {
    try {
      return Object.keys(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'))
    } catch { return [] }
  }, [])

  const deleteSavedPattern = useCallback((name) => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      delete saved[name]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
      return true
    } catch { return false }
  }, [])

  return {
    playing, currentStep, bpm, setBpm,
    swing, setSwing,
    stepCount, setStepCount,
    patterns, setPatterns, toggleStep, setStepVelocity,
    clearPattern, loadPreset,
    toggle, play, stop,
    velocity,
    savePattern, loadSavedPattern, getSavedPatternNames, deleteSavedPattern,
    activeItemsRef: activeRef,
  }
}
