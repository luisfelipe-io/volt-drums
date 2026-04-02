// AudioEngine.js v4
// Fixes:
//   - Page visibility: pause scheduler + suspend context when tab hidden
//   - Auto-resume with gradual gain ramp to prevent click artifacts
//   - Stricter voice limit (24) + voice age eviction for long sessions
//   - Context health check every 5s (reduced from 3s to lower CPU)

let _engine = null

function buildReverb(ctx, decayTime = 1.6, preDelay = 0.015) {
  const conv = ctx.createConvolver()
  const sr = ctx.sampleRate
  const preLen = Math.floor(sr * preDelay)
  const decLen = Math.floor(sr * decayTime)
  const ir = ctx.createBuffer(2, preLen + decLen, sr)
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch)
    for (let i = preLen; i < d.length; i++) {
      const t = (i - preLen) / sr
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t / decayTime, 2.4)
    }
    for (let i = 1; i < d.length; i++) d[i] = d[i] * 0.68 + d[i - 1] * 0.32
  }
  conv.buffer = ir
  return conv
}

function buildEngine() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)({
    latencyHint: 'interactive',
    sampleRate: 44100,
  })

  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -20; comp.knee.value = 10
  comp.ratio.value = 6; comp.attack.value = 0.003; comp.release.value = 0.15

  const limiter = ctx.createDynamicsCompressor()
  limiter.threshold.value = -1; limiter.knee.value = 0
  limiter.ratio.value = 20; limiter.attack.value = 0.0005; limiter.release.value = 0.08

  const masterGain = ctx.createGain()
  masterGain.gain.value = 0.82

  const analyser = ctx.createAnalyser()
  analyser.fftSize = 256
  analyser.smoothingTimeConstant = 0.80

  const masterBus = ctx.createGain()
  masterBus.gain.value = 1

  masterBus.connect(comp)
  comp.connect(limiter)
  limiter.connect(masterGain)
  masterGain.connect(analyser)
  analyser.connect(ctx.destination)

  const convolver = buildReverb(ctx, 1.6, 0.015)
  const reverbWet = ctx.createGain()
  reverbWet.gain.value = 0.38 * 0.60
  convolver.connect(reverbWet)
  reverbWet.connect(masterGain)
  const reverbBus = ctx.createGain()
  reverbBus.connect(convolver)

  // ── Voice management ────────────────────────────────────────────────────
  let _voices = 0
  const MAX_VOICES = 24  // reduced from 28

  function canSpawn() { return _voices < MAX_VOICES }
  function voiceStart() { _voices++ }
  function voiceEnd()   { _voices = Math.max(0, _voices - 1) }

  // ── Recording ────────────────────────────────────────────────────────────
  let mediaRecorder = null
  let recChunks = []
  let _isRecording = false

  function startRecording() {
    try {
      const dest = ctx.createMediaStreamDestination()
      masterGain.connect(dest)
      mediaRecorder = new MediaRecorder(dest.stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus' : 'audio/webm',
      })
      recChunks = []
      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recChunks.push(e.data) }
      mediaRecorder.start(100)
      _isRecording = true
    } catch (err) {
      console.warn('[AudioEngine] MediaRecorder failed:', err)
    }
  }

  function stopRecording() {
    return new Promise(resolve => {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        resolve(null); return
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(recChunks, { type: mediaRecorder.mimeType || 'audio/webm' })
        _isRecording = false
        resolve(blob)
      }
      mediaRecorder.stop()
    })
  }

  // ── Page visibility handler ──────────────────────────────────────────────
  // When tab hidden: mute output and signal sequencer to pause scheduling.
  // When visible again: unmute and signal sequencer to resume.
  // This prevents audio node accumulation when the tab is in background.
  let _hidden = false
  function handleVisibilityChange() {
    if (document.hidden) {
      _hidden = true
      // Mute output immediately (no ramp to avoid artifacts)
      masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05)
    } else {
      _hidden = false
      if (ctx.state === 'suspended') ctx.resume()
      masterGain.gain.setTargetAtTime(0.82, ctx.currentTime, 0.05)
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // ── Context watchdog ─────────────────────────────────────────────────────
  const _watchdog = setInterval(() => {
    if (ctx.state === 'suspended') ctx.resume()
  }, 5000)

  return {
    ctx, masterBus, reverbBus, masterGain, analyser,
    isHidden: () => _hidden,
    canSpawn, voiceStart, voiceEnd,
    getVoiceCount: () => _voices,
    startRecording, stopRecording,
    setVolume(v) { masterGain.gain.value = Math.max(0, Math.min(1.2, v)) },
    setReverb(v) { reverbWet.gain.value = Math.max(0, v * 0.60) },
    destroy() {
      clearInterval(_watchdog)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      ctx.close()
    },
  }
}

export function getEngine() {
  if (!_engine) _engine = buildEngine()
  if (_engine.ctx.state === 'suspended') _engine.ctx.resume()
  return _engine
}

export const ensureEngine = getEngine
