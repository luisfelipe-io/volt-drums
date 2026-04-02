// useRecorder.js v2 — Uses AudioEngine's MediaRecorder (webm/opus)
import { useState, useCallback, useRef } from 'react'
import { getEngine } from '../engine/AudioEngine.js'

export default function useRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [hasAudio, setHasAudio]       = useState(false)
  const [duration, setDuration]       = useState(0)
  const [exporting, setExporting]     = useState(false)
  const blobRef   = useRef(null)
  const timerRef  = useRef(null)
  const startRef  = useRef(0)

  const startRecording = useCallback(() => {
    try {
      getEngine().startRecording()
      setIsRecording(true)
      setHasAudio(false)
      setDuration(0)
      blobRef.current = null
      startRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startRef.current) / 1000))
      }, 1000)
    } catch (e) {
      console.warn('[Recorder] startRecording failed:', e)
    }
  }, [])

  const stopRecording = useCallback(async () => {
    clearInterval(timerRef.current)
    try {
      const blob = await getEngine().stopRecording()
      if (blob && blob.size > 0) {
        blobRef.current = blob
        setHasAudio(true)
      }
    } catch (e) {
      console.warn('[Recorder] stopRecording failed:', e)
    }
    setIsRecording(false)
  }, [])

  const downloadRecording = useCallback(async () => {
    if (!blobRef.current) return
    setExporting(true)
    try {
      const url = URL.createObjectURL(blobRef.current)
      const a   = document.createElement('a')
      const ts  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      a.href     = url
      a.download = `drum-sessions-${ts}.webm`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    } finally {
      setExporting(false)
    }
  }, [])

  function formatDuration(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return {
    isRecording,
    hasAudio,
    duration: formatDuration(duration),
    exporting,
    startRecording,
    stopRecording,
    downloadRecording,
  }
}
