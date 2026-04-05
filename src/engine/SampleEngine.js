// SampleEngine.js v2
// Fixes vs v1:
//   - Cymbals excluded (VCSL orchestral cymbals = wrong sound for drum kit)
//   - Separate sample voice budget (max 14, own counter)
//   - Per-instrument hard time limit + fade-out (prevents voice accumulation)
//   - Global velocity mode: user picks soft/medium/hard/ffhard
//   - Reverb hard-capped at 4% for samples (tight, dry sound)
//   - Round-robin only within same tier, not across tiers

import { getEngine } from './AudioEngine.js'

// ── Global velocity mode ────────────────────────────────────────────────────
let _velMode = 'medium'
export function setVelocityMode(mode) { _velMode = mode }
export function getVelocityMode()     { return _velMode }

// ── Sample voice budget (independent from synthesis) ────────────────────────
let _sVoices = 0
const MAX_S_VOICES = 14

// ── Per-instrument envelope (hard stop + fade) ──────────────────────────────
const ENV = {
  kick:      { dur: 0.55, fade: 0.70 },
  snare:     { dur: 0.35, fade: 0.65 },
  hihat:     { dur: 0.18, fade: 0.60 },
  openhat:   { dur: 0.50, fade: 0.65 },
  chick:     { dur: 0.10, fade: 0.70 },
  tom1:      { dur: 0.50, fade: 0.70 },
  tom2:      { dur: 0.55, fade: 0.70 },
  tom3:      { dur: 0.55, fade: 0.70 },
  tom4:      { dur: 0.60, fade: 0.70 },
  floortom:  { dur: 0.65, fade: 0.72 },
  floortom2: { dur: 0.65, fade: 0.72 },
}

// ── Sample manifest ─────────────────────────────────────────────────────────
// Cymbals (crash, ride, splash, china, cowbell) = null → always synthesis
// pitchShift derives extra toms from 2 source sets

const MANIFEST = {
  kick: {
    folder: 'kick',
    vel: { soft:'kick_soft_1.ogg', medium:'kick_medium_1.ogg', hard:'kick_hard_1.ogg', ffhard:'kick_ffhard_1.ogg' },
    alt: { soft:'kick_soft_2.ogg', medium:'kick_medium_2.ogg', hard:'kick_hard_2.ogg', ffhard:'kick_ffhard_2.ogg' },
  },
  snare: {
    folder: 'snare',
    vel: { soft:'snare_soft_1.ogg', medium:'snare_medium_1.ogg', hard:'snare_hard_1.ogg', ffhard:'snare_ffhard_1.ogg' },
    alt: { soft:'snare_soft_2.ogg', medium:'snare_medium_2.ogg', hard:'snare_hard_2.ogg', ffhard:'snare_ffhard_2.ogg' },
  },
  hihat: {
    folder: 'hihat_closed',
    vel: { soft:'hihat_closed_soft_1.ogg', medium:'hihat_closed_medium_1.ogg', hard:'hihat_closed_hard_1.ogg', ffhard:'hihat_closed_ffhard_1.ogg' },
    alt: { soft:'hihat_closed_soft_2.ogg', medium:'hihat_closed_medium_2.ogg', hard:'hihat_closed_hard_2.ogg', ffhard:'hihat_closed_ffhard_2.ogg' },
  },
  openhat: {
    folder: 'hihat_open',
    vel: { soft:'hihat_open_1.ogg', medium:'hihat_open_loose_1.ogg', hard:'hihat_open_2.ogg', ffhard:'hihat_open_loose_2.ogg' },
  },
  chick: {
    folder: 'hihat_foot',
    vel: { soft:'hihat_foot_1.ogg', medium:'hihat_foot_1.ogg', hard:'hihat_foot_2.ogg', ffhard:'hihat_foot_2.ogg' },
  },
  tom1: {
    folder: 'tom1',
    vel: { soft:'tom1_soft_1.ogg', medium:'tom1_medium_1.ogg', hard:'tom1_hard_1.ogg', ffhard:'tom1_hard_2.ogg' },
    alt: { soft:'tom1_soft_2.ogg', medium:'tom1_medium_2.ogg', hard:'tom1_hard_2.ogg', ffhard:'tom1_hard_1.ogg' },
  },
  tom2: {
    folder: 'tom2',
    vel: { soft:'tom2_soft_1.ogg', medium:'tom2_medium_1.ogg', hard:'tom2_hard_1.ogg', ffhard:'tom2_hard_2.ogg' },
    alt: { soft:'tom2_soft_2.ogg', medium:'tom2_medium_2.ogg', hard:'tom2_hard_2.ogg', ffhard:'tom2_hard_1.ogg' },
  },
  tom3:      { folder:'tom2', pitch:0.84, vel:{ soft:'tom2_soft_1.ogg', medium:'tom2_medium_1.ogg', hard:'tom2_hard_1.ogg', ffhard:'tom2_hard_2.ogg' } },
  tom4:      { folder:'tom2', pitch:0.72, vel:{ soft:'tom2_soft_2.ogg', medium:'tom2_medium_2.ogg', hard:'tom2_hard_2.ogg', ffhard:'tom2_hard_1.ogg' } },
  floortom: {
    folder: 'floortom',
    vel: { soft:'floortom_soft_1.ogg', medium:'floortom_medium_1.ogg', hard:'floortom_hard_1.ogg', ffhard:'floortom_ffhard_1.ogg' },
    alt: { soft:'floortom_soft_1.ogg', medium:'floortom_medium_2.ogg', hard:'floortom_hard_2.ogg', ffhard:'floortom_ffhard_1.ogg' },
  },
  floortom2: { folder:'floortom', pitch:0.82, vel:{ soft:'floortom_soft_1.ogg', medium:'floortom_medium_2.ogg', hard:'floortom_hard_2.ogg', ffhard:'floortom_ffhard_1.ogg' } },
  // Cymbals → null = synthesis only
  crash:null, splash:null, china:null, ride:null, cowbell:null,
}

// ── Cache ───────────────────────────────────────────────────────────────────
const _cache   = {}
const _loading = {}
const _failed  = new Set()
const _rrFlip  = {}   // soundId → bool, alternates primary/alt each hit

let _ready = false
const _readyCbs = []

async function loadSample(path) {
  if (_cache[path])      return _cache[path]
  if (_loading[path])    return _loading[path]
  if (_failed.has(path)) return null

  _loading[path] = (async () => {
    try {
      const res = await fetch(path)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const ab  = await res.arrayBuffer()
      const buf = await getEngine().ctx.decodeAudioData(ab)
      _cache[path] = buf
      return buf
    } catch {
      _failed.add(path)
      return null
    } finally {
      delete _loading[path]
    }
  })()

  return _loading[path]
}

// ── Preload ─────────────────────────────────────────────────────────────────
const PRIORITY = new Set(['kick','snare','hihat','openhat','chick'])

export async function preloadSamples(onProgress) {
  const seen = new Set()
  const priority = []
  const rest     = []

  for (const [id, def] of Object.entries(MANIFEST)) {
    if (!def) continue
    for (const map of [def.vel, def.alt].filter(Boolean)) {
      for (const file of Object.values(map)) {
        const path = `/samples/${def.folder}/${file}`
        if (seen.has(path)) continue
        seen.add(path)
        if (PRIORITY.has(id)) priority.push(path)
        else                   rest.push(path)
      }
    }
  }

  const total = priority.length + rest.length
  let done = 0
  const tick = () => { done++; onProgress?.(Math.min(1, done/total), done, total) }

  await Promise.all(priority.map(p => loadSample(p).then(tick)))
  _ready = true
  _readyCbs.forEach(cb => cb())
  _readyCbs.length = 0

  // Background: batches of 4
  for (let i = 0; i < rest.length; i += 4)
    await Promise.all(rest.slice(i, i+4).map(p => loadSample(p).then(tick)))
}

export function onReady(cb) { _ready ? cb() : _readyCbs.push(cb) }
export function isReady()   { return _ready }

// ── Play ────────────────────────────────────────────────────────────────────
export function playSample(soundId, vel, pan, revSend) {
  // vel param: 0.0-1.0. Map to tier, falling back to global _velMode.
  // This lets sequencer per-step velocity override the global mode.
  function velToTier(v) {
    if (v <= 0.00) return _velMode   // no vel provided → use global
    if (v <= 0.28) return 'soft'
    if (v <= 0.60) return 'medium'
    if (v <= 0.82) return 'hard'
    return 'ffhard'
  }
  const def = MANIFEST[soundId]
  if (!def) return false          // cymbal/cowbell → synthesis

  if (_sVoices >= MAX_S_VOICES) return false  // budget full

  // Select file: global vel mode + round-robin alt
  const tier   = velToTier(vel)
  const useAlt = def.alt ? (_rrFlip[soundId] = !(_rrFlip[soundId]||false)) : false
  const file   = (useAlt ? def.alt?.[tier] : def.vel?.[tier]) || def.vel?.medium
  if (!file) return false

  const path = `/samples/${def.folder}/${file}`
  const buf  = _cache[path]
  if (!buf) { loadSample(path); return false }   // not cached yet → synthesis fallback

  const { ctx, masterBus, reverbBus } = getEngine()
  const t   = ctx.currentTime
  const env = ENV[soundId] || { dur: 0.40, fade: 0.65 }

  const src = ctx.createBufferSource()
  src.buffer = buf
  if (def.pitch) src.playbackRate.value = def.pitch

  // Gain with fade-out envelope
  const g = ctx.createGain()
  g.gain.setValueAtTime(1.0, t)
  g.gain.setValueAtTime(1.0, t + env.dur * env.fade)
  g.gain.linearRampToValueAtTime(0, t + env.dur)

  // Reverb: hard cap 4% — samples must stay dry and tight
  const rv = Math.min((revSend || 0) * 0.25, 0.04)

  if (pan !== 0) {
    const p = ctx.createStereoPanner(); p.pan.value = pan
    src.connect(g); g.connect(p); p.connect(masterBus)
    if (rv > 0) {
      const p2 = ctx.createStereoPanner(); p2.pan.value = pan
      const rvg = ctx.createGain(); rvg.gain.value = rv
      g.connect(p2); p2.connect(rvg); rvg.connect(reverbBus)
    }
  } else {
    src.connect(g); g.connect(masterBus)
    if (rv > 0) {
      const rvg = ctx.createGain(); rvg.gain.value = rv
      g.connect(rvg); rvg.connect(reverbBus)
    }
  }

  _sVoices++
  src.start(t)
  src.stop(t + env.dur + 0.01)
  src.onended = () => { _sVoices = Math.max(0, _sVoices - 1) }

  return true
}

export function hasSample(soundId) {
  return soundId in MANIFEST && MANIFEST[soundId] !== null
}
