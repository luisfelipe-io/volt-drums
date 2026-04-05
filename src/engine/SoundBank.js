// SoundBank.js — Professional Drum Synthesis v3
// Key fix: cymbals now NOISE-PRIMARY (no more church bell sine series)
// Voice-guarded: all sounds check canSpawn() before creating nodes

import { getEngine } from './AudioEngine.js'

let _noiseBuf = null
const _rr = {}
function rrNext(id, max) { _rr[id] = ((_rr[id]||0)+1)%max; return _rr[id] }

function getNoiseBuf() {
  const { ctx } = getEngine()
  if (_noiseBuf) return _noiseBuf
  const len = ctx.sampleRate * 3
  _noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = _noiseBuf.getChannelData(0)
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0
  for (let i=0;i<len;i++) {
    const w=Math.random()*2-1
    b0=.99886*b0+w*.0555179; b1=.99332*b1+w*.0750759
    b2=.96900*b2+w*.1538520; b3=.86650*b3+w*.3104856
    b4=.55000*b4+w*.5329522; b5=-.7616*b5-w*.0168980
    d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.10
    b6=w*.115926
  }
  return _noiseBuf
}

function ns() {
  const e=getEngine()
  if(!e.canSpawn()) return null
  const s=e.ctx.createBufferSource()
  s.buffer=getNoiseBuf()
  return s
}
function startGuarded(node, stop, time) {
  if(!node) return
  const e=getEngine()
  e.voiceStart()
  const t0=time||e.ctx.currentTime
  node.start(t0)
  node.stop(Math.min(stop||t0+3, t0+3))
  node.onended = () => { try { e.voiceEnd() } catch {} }
}

const G   = v   =>{ const g=getEngine().ctx.createGain(); g.gain.value=v; return g }
const P   = v   =>{ const p=getEngine().ctx.createStereoPanner(); p.pan.value=v; return p }
const OSC = (t,f)=>{ const o=getEngine().ctx.createOscillator(); o.type=t; o.frequency.value=f; return o }
const BPF = (f,q)=>{ const n=getEngine().ctx.createBiquadFilter(); n.type='bandpass'; n.frequency.value=f; n.Q.value=q; return n }
const HPF = f   =>{ const n=getEngine().ctx.createBiquadFilter(); n.type='highpass'; n.frequency.value=f; return n }
const LPF = f   =>{ const n=getEngine().ctx.createBiquadFilter(); n.type='lowpass';  n.frequency.value=f; return n }
const PKF = (f,gv,q)=>{ const n=getEngine().ctx.createBiquadFilter(); n.type='peaking'; n.frequency.value=f; n.gain.value=gv; n.Q.value=q; return n }
const HS  = (f,gv)  =>{ const n=getEngine().ctx.createBiquadFilter(); n.type='highshelf'; n.frequency.value=f; n.gain.value=gv; return n }
const ch  = (...ns)  =>{ for(let i=0;i<ns.length-1;i++) ns[i].connect(ns[i+1]) }

function makeSatCurve(k=8) {
  const n=256,c=new Float32Array(n)
  for(let i=0;i<n;i++){const x=i*2/n-1; c[i]=(Math.PI+k)*x/(Math.PI+k*Math.abs(x))}
  return c
}

function toMix(g, pan, rev) {
  const{masterBus,reverbBus}=getEngine()
  if(pan!==0){const pa=P(pan);ch(g,pa,masterBus)}else ch(g,masterBus)
  if(rev>0){const pa2=P(pan),rv=G(rev);ch(g,pa2,rv,reverbBus)}
}

const PRF={
  acoustic:  {kF:48,kD:.68,sCk:3000,sD:.22,hD:.072,rm:1.0,sat:6, vm:1.0},
  electronic:{kF:52,kD:.50,sCk:4200,sD:.15,hD:.055,rm:.50,sat:14,vm:1.05},
  heavy_elec:{kF:44,kD:.72,sCk:3500,sD:.20,hD:.060,rm:.40,sat:18,vm:1.10},
  heavy:     {kF:46,kD:.70,sCk:2800,sD:.24,hD:.076,rm:.80,sat:10,vm:1.08},
  jazz:      {kF:55,kD:.58,sCk:2400,sD:.16,hD:.095,rm:1.25,sat:3,vm:0.90},
}
const prf=p=>PRF[p]||PRF.acoustic

// ─── KICK ─────────────────────────────────────────────────────────────────────
export function playKick(v,pan,rev,profile='acoustic'){
  const T=prf(profile),{ctx}=getEngine(),t=ctx.currentTime
  const vel=v*T.vm, rr=rrNext('kick',4)
  const pv=1+[-.02,0,.01,-.01][rr]*.5, dv=[1,.97,1.03,.99][rr]

  const sub=OSC('sine',T.kF*pv),ws=ctx.createWaveShaper(),gS=G(0)
  ws.curve=makeSatCurve(T.sat)
  sub.frequency.setValueAtTime(T.kF*pv,t)
  sub.frequency.exponentialRampToValueAtTime(T.kF*.4,t+.010)
  sub.frequency.exponentialRampToValueAtTime(.001,t+T.kD*dv)
  gS.gain.setValueAtTime(0,t); gS.gain.linearRampToValueAtTime(1.45*vel,t+.004)
  gS.gain.exponentialRampToValueAtTime(.001,t+T.kD*dv)
  ch(sub,ws,gS); startGuarded(sub,t+T.kD*dv+.01,t); toMix(gS,pan,rev*.5)

  const mid=OSC('triangle',T.kF*2.2),gM=G(0)
  mid.frequency.setValueAtTime(T.kF*2.2,t); mid.frequency.exponentialRampToValueAtTime(T.kF*.65,t+.14)
  gM.gain.setValueAtTime(0,t); gM.gain.linearRampToValueAtTime(.52*vel,t+.003)
  gM.gain.exponentialRampToValueAtTime(.001,t+.20)
  ch(mid,gM); startGuarded(mid,t+.21,t); toMix(gM,pan,rev*.25)

  const n=ns(); if(n){const nf=BPF(2500+rr*100,.6),nhp=HPF(1100),ng=G(0)
  ng.gain.setValueAtTime(0,t); ng.gain.linearRampToValueAtTime(.50*vel,t+.002)
  ng.gain.exponentialRampToValueAtTime(.001,t+.04)
  ch(n,nf,nhp,ng); startGuarded(n,t+.045,t); toMix(ng,pan,0)}
}

// ─── SNARE ────────────────────────────────────────────────────────────────────
export function playSnare(v,pan,rev,profile='acoustic'){
  const T=prf(profile),{ctx}=getEngine(),t=ctx.currentTime
  const vel=v*T.vm, rr=rrNext('snare',6)
  const pv=1+[-.02,-.01,0,.01,.02,-.01][rr]

  const body=OSC('sine',185*pv),gB=G(0)
  body.frequency.setValueAtTime(190*pv,t); body.frequency.exponentialRampToValueAtTime(150,t+.06)
  gB.gain.setValueAtTime(0,t); gB.gain.linearRampToValueAtTime(.68*vel,t+.002)
  gB.gain.exponentialRampToValueAtTime(.001,t+.075)
  ch(body,gB); startGuarded(body,t+.08,t); toMix(gB,pan,rev*.45)

  const n1=ns(); if(n1){const f1=BPF(T.sCk*.98+rr*40,.40),f2=HPF(1500),n1g=G(0)
  n1g.gain.setValueAtTime(0,t); n1g.gain.linearRampToValueAtTime(1.1*vel,t+.002)
  n1g.gain.exponentialRampToValueAtTime(.001,t+T.sD)
  ch(n1,f1,f2,n1g); startGuarded(n1,t+T.sD+.01,t); toMix(n1g,pan,rev)}

  const n2=ns(); if(n2){const hp=HPF(5500+rr*180),pk=PKF(9000,4.5,1.3),n2g=G(0)
  n2g.gain.setValueAtTime(0,t); n2g.gain.linearRampToValueAtTime(.44*vel,t+.004)
  n2g.gain.exponentialRampToValueAtTime(.001,t+T.sD*1.6)
  ch(n2,hp,pk,n2g); startGuarded(n2,t+T.sD*1.6+.01,t); toMix(n2g,pan,rev*.5)}
}

// ─── HI-HAT ── pure noise model, no oscillators
// Real hi-hats are 90% noise. The metallic "quality" comes from
// resonant bandpass shaping and how fast the noise decays.
export function playHihat(open,v,pan,rev,profile='acoustic'){
  const T=prf(profile),{ctx}=getEngine(),t=ctx.currentTime
  const vel=v*T.vm
  const rr=rrNext(open?'ohat':'hhat',4)
  // Subtle RR variations in decay and tone
  const decMul=[1,.96,1.04,.98][rr]
  const dec = open
    ? (.40+Math.random()*.06)*decMul
    : (T.hD+Math.random()*.010)*decMul

  // ── Band A: metallic "chick" (low-mid narrow band) ──────────────────────
  // This is the physical vibration of the metal — the "musical" part
  // Closed: prominent. Open: quieter (overshadowed by the wash).
  const n1=ns(); if(n1){
    const bp=BPF(open?380:420, open?.9:1.2)   // narrow resonant band ~400Hz
    const lp=LPF(1800)
    const gA=G(0)
    gA.gain.setValueAtTime(0,t)
    gA.gain.linearRampToValueAtTime((open?.18:.42)*vel, t+.001)
    gA.gain.exponentialRampToValueAtTime(.001, t+(open?.040:.055))
    ch(n1,bp,lp,gA); startGuarded(n1,t+(open?.045:.060),t)
    toMix(gA,pan,0)
  }

  // ── Band B: mid-range sizzle (2–6kHz) ───────────────────────────────────
  // This is the primary texture — the "wash" that defines open vs closed
  const n2=ns(); if(n2){
    const h1=HPF(open?2200:4500)
    const h2=BPF(open?4500:7500, open?.30:.45)
    const lp=LPF(16000)
    const gB=G(0)
    gB.gain.setValueAtTime(0,t)
    gB.gain.linearRampToValueAtTime((open?.72:.62)*vel, t+.001)
    gB.gain.exponentialRampToValueAtTime(.001, t+dec)
    ch(n2,h1,h2,lp,gB); startGuarded(n2,t+dec+.01,t)
    toMix(gB,pan, open?rev*.35:rev*.04)
  }

  // ── Band C: high air (>10kHz, very brief for closed) ────────────────────
  const n3=ns(); if(n3){
    const hp=HPF(open?9000:11000)
    const gC=G(0)
    gC.gain.setValueAtTime(0,t)
    gC.gain.linearRampToValueAtTime((open?.22:.28)*vel, t+.001)
    gC.gain.exponentialRampToValueAtTime(.001, t+dec*(open?.60:.42))
    ch(n3,hp,gC); startGuarded(n3,t+dec*(open?.62:.44),t)
    toMix(gC,pan,0)
  }
}

export function playChick(v,pan,rev){
  const{ctx}=getEngine(),t=ctx.currentTime
  const n=ns(); if(!n) return
  const h1=HPF(6500),h2=BPF(11000,.55),ng=G(0)
  ng.gain.setValueAtTime(0,t); ng.gain.linearRampToValueAtTime(.40*v*.78,t+.002)
  ng.gain.exponentialRampToValueAtTime(.001,t+.040)
  ch(n,h1,h2,ng); startGuarded(n,t+.043,t); toMix(ng,pan,0)
}

// ─── CRASH — NOISE-PRIMARY (was: sine partials = church bell) ──────────────────
export function playCrash(v,pan,rev,profile='acoustic'){
  const T=prf(profile),{ctx}=getEngine(),t=ctx.currentTime
  const vel=v*T.vm, rr=rrNext('crash',4)
  const dec=1.1*(T.rm)*[1,.94,1.06,.97][rr]*(0.9+Math.random()*.15)

  // Main wash — broadband pink noise, shaped
  const n1=ns(); if(n1){const f1=BPF(3400+rr*80,.28),hp=HPF(1600),lp=LPF(16000),g1=G(0)
  g1.gain.setValueAtTime(0,t); g1.gain.linearRampToValueAtTime(.90*vel,t+.018)
  g1.gain.exponentialRampToValueAtTime(.001,t+dec)
  ch(n1,f1,hp,lp,g1); startGuarded(n1,t+dec+.1,t); toMix(g1,pan,rev*T.rm)}

  // High shimmer
  const n2=ns(); if(n2){const hp2=HPF(7200),pk2=PKF(11500,3.5,1.4),g2=G(0)
  g2.gain.setValueAtTime(0,t); g2.gain.linearRampToValueAtTime(.42*vel,t+.006)
  g2.gain.exponentialRampToValueAtTime(.001,t+dec*.55)
  ch(n2,hp2,pk2,g2); startGuarded(n2,t+dec*.56,t); toMix(g2,pan,rev*T.rm*.5)}

  // Low-mid body
  const n3=ns(); if(n3){const b3=BPF(1100+rr*60,.50),g3=G(0)
  g3.gain.setValueAtTime(0,t); g3.gain.linearRampToValueAtTime(.30*vel,t+.008)
  g3.gain.exponentialRampToValueAtTime(.001,t+dec*.45)
  ch(n3,b3,g3); startGuarded(n3,t+dec*.46,t); toMix(g3,pan,rev*T.rm*.7)}

  // 3 short detuned oscillators just for "color" (fast decay, quiet)
  if(getEngine().canSpawn()){
    [680,1040,1560].forEach((f,i)=>{
      const fD=f*(1+(Math.random()*.04-.02))
      const o=OSC('sine',fD),g=G(0)
      const d=.065-i*.015
      g.gain.setValueAtTime(.055*vel,t); g.gain.exponentialRampToValueAtTime(.001,t+d)
      ch(o,g); startGuarded(o,t+d+.01,t); toMix(g,pan,0)
    })
  }
}

// ─── SPLASH ──────────────────────────────────────────────────────────────────
export function playSplash(v,pan,rev){
  const{ctx}=getEngine(),t=ctx.currentTime
  const dec=.55+Math.random()*.08

  const n1=ns(); if(n1){const f1=BPF(4200,.30),hp=HPF(2200),g1=G(0)
  g1.gain.setValueAtTime(0,t); g1.gain.linearRampToValueAtTime(.75*v,t+.010)
  g1.gain.exponentialRampToValueAtTime(.001,t+dec)
  ch(n1,f1,hp,g1); startGuarded(n1,t+dec+.05,t); toMix(g1,pan,rev*.65)}

  const n2=ns(); if(n2){const hp2=HPF(8500),g2=G(0)
  g2.gain.setValueAtTime(0,t); g2.gain.linearRampToValueAtTime(.35*v,t+.004)
  g2.gain.exponentialRampToValueAtTime(.001,t+dec*.5)
  ch(n2,hp2,g2); startGuarded(n2,t+dec*.51,t); toMix(g2,pan,rev*.4)}
}

// ─── CHINA — PURE NOISE, trashier character than crash
export function playChina(v,pan,rev,profile='acoustic'){
  const T=prf(profile),{ctx}=getEngine(),t=ctx.currentTime
  const vel=v*T.vm, dec=1.1*T.rm

  // Main wash — HPF higher than crash, creates "trashy" open tone
  const n1=ns(); if(n1){
    const h1=HPF(3800)
    const bpx=BPF(7500,.20)  // wide, not resonant
    const g=G(0)
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.82*vel,t+.016)
    g.gain.exponentialRampToValueAtTime(.001,t+dec)
    ch(n1,h1,bpx,g); startGuarded(n1,t+dec+.05,t); toMix(g,pan,rev*T.rm)
  }

  // High brittle shimmer
  const n2=ns(); if(n2){
    const hp2=HPF(11000), g=G(0)
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.38*vel,t+.006)
    g.gain.exponentialRampToValueAtTime(.001,t+dec*.45)
    ch(n2,hp2,g); startGuarded(n2,t+dec*.46,t); toMix(g,pan,0)
  }
  // NO oscillators — they created the "bottle" sound
}

// ─── RIDE — noise body + subtle bell, NOT a Christmas bell
// The noise wash is the dominant character of a ride cymbal
export function playRide(v,pan,rev,profile='acoustic'){
  const T=prf(profile),{ctx}=getEngine(),t=ctx.currentTime
  const vel=v*T.vm, rr=rrNext('ride',4)
  const pitchVar=[1,.985,1.012,.993][rr]

  // ── Bell tone: warm bronze character (~500-900Hz, NOT 2800Hz) ───────────
  // A real 20" ride bell resonates around 500-800Hz, giving a warm "ping"
  // not a high glassy ring. Using 3 harmonics for natural complexity.
  const bellBase = 580 * pitchVar  // warm bronze fundamental
  const bellData = [
    { f: bellBase,       amp: .22, dec: .55*T.rm },
    { f: bellBase*1.68,  amp: .10, dec: .38*T.rm },
    { f: bellBase*2.95,  amp: .05, dec: .22*T.rm },
  ]
  bellData.forEach(({f,amp,dec}) => {
    if(!getEngine().canSpawn()) return
    const o=OSC('sine', f*(1+Math.random()*.005))
    const gO=G(0)
    gO.gain.setValueAtTime(0,t)
    gO.gain.linearRampToValueAtTime(amp*vel, t+.003)
    gO.gain.exponentialRampToValueAtTime(.001, t+dec)
    ch(o,gO); startGuarded(o,t+dec+.01,t)
    toMix(gO, pan, rev*T.rm*.4)
  })

  // ── Bow shimmer: mid noise (1.5–5kHz = the "musical" ride range) ────────
  const n1=ns(); if(n1){
    const h1=HPF(1500)
    const pk=PKF(3200, 3.0, 1.8)   // warm peak in mid range
    const lp=LPF(8000)              // cut harsh highs — makes it warm
    const g=G(0)
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.55*vel,t+.012)
    g.gain.exponentialRampToValueAtTime(.001,t+0.65*T.rm)
    ch(n1,h1,pk,lp,g); startGuarded(n1,t+0.70*T.rm,t)
    toMix(g,pan,rev*T.rm*.65)
  }

  // ── Air shimmer: high noise (adds "presence" without being tinny) ────────
  const n2=ns(); if(n2){
    const h2=HPF(5500), lp2=LPF(12000), g=G(0)
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.22*vel,t+.006)
    g.gain.exponentialRampToValueAtTime(.001,t+0.30*T.rm)
    ch(n2,h2,lp2,g); startGuarded(n2,t+0.32*T.rm,t)
    toMix(g,pan, rev*T.rm*.25)
  }

  // ── Stick attack: brief click ────────────────────────────────────────────
  const n3=ns(); if(n3){
    const bp=BPF(3500,.8), g=G(0)
    g.gain.setValueAtTime(.35*vel,t); g.gain.exponentialRampToValueAtTime(.001,t+.024)
    ch(n3,bp,g); startGuarded(n3,t+.026,t); toMix(g,pan,0)
  }
}

// ─── TOMS ─────────────────────────────────────────────────────────────────────
const TOM_S={tom1:{f1:252,f2:112,f3:380,dec:.30,sh:.28},tom2:{f1:195,f2:88,f3:295,dec:.36,sh:.26},tom3:{f1:162,f2:74,f3:248,dec:.40,sh:.24},tom4:{f1:138,f2:64,f3:215,dec:.44,sh:.22},floortom:{f1:128,f2:60,f3:200,dec:.52,sh:.20}}
export function playTom(id,v,pan,rev,profile='acoustic'){
  const T=prf(profile),{ctx}=getEngine(),t=ctx.currentTime
  const vel=v*T.vm, S=TOM_S[id]||TOM_S.tom1
  const rr=rrNext(id,6), pv=1+[-.02,-.01,0,.01,.02,-.015][rr], dv=[1,.97,1.03,.99,1.01,.96][rr]

  const o1=OSC('sine',S.f1*pv),g1=G(0)
  o1.frequency.setValueAtTime(S.f1*pv,t); o1.frequency.exponentialRampToValueAtTime(S.f2,t+S.dec*dv)
  g1.gain.setValueAtTime(0,t); g1.gain.linearRampToValueAtTime(1.05*vel,t+.004)
  g1.gain.exponentialRampToValueAtTime(.001,t+S.dec*dv)
  ch(o1,g1); startGuarded(o1,t+S.dec*dv+.01,t); toMix(g1,pan,rev)

  const o2=OSC('sine',S.f3*pv),g2=G(0)
  o2.frequency.setValueAtTime(S.f3*pv,t); o2.frequency.exponentialRampToValueAtTime(S.f3*.7,t+S.dec*.4)
  g2.gain.setValueAtTime(0,t); g2.gain.linearRampToValueAtTime(.28*vel,t+.003)
  g2.gain.exponentialRampToValueAtTime(.001,t+S.dec*.4)
  ch(o2,g2); startGuarded(o2,t+S.dec*.42,t); toMix(g2,pan,rev*.55)

  const o3=OSC('triangle',S.f1*.7*pv),g3=G(0)
  o3.frequency.setValueAtTime(S.f1*.7*pv,t); o3.frequency.exponentialRampToValueAtTime(S.f1*.35,t+S.dec*.5*dv)
  g3.gain.setValueAtTime(0,t); g3.gain.linearRampToValueAtTime(S.sh*vel,t+.005)
  g3.gain.exponentialRampToValueAtTime(.001,t+S.dec*.5*dv)
  ch(o3,g3); startGuarded(o3,t+S.dec*.52*dv,t); toMix(g3,pan,rev*.45)

  const n=ns(); if(n){const nf=BPF(S.f1*1.2,2.2),ng=G(0)
  ng.gain.setValueAtTime(0,t); ng.gain.linearRampToValueAtTime(.35*vel,t+.002)
  ng.gain.exponentialRampToValueAtTime(.001,t+.040)
  ch(n,nf,ng); startGuarded(n,t+.043,t); toMix(ng,pan,0)}
}

export function playCowbell(v,pan,rev){
  const{ctx}=getEngine(),t=ctx.currentTime
  ;[562,845,1124].forEach((f,i)=>{
    const o=OSC('square',f),lp=LPF(f*1.8),g=G(0)
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime((.22-i*.07)*v,t+.002)
    g.gain.exponentialRampToValueAtTime(.001,t+.55-i*.1)
    ch(o,lp,g); startGuarded(o,t+.57-i*.1,t); toMix(g,pan,rev)
  })
}

export function playSound(soundId,v,pan,rev,profile='acoustic'){
  // Try sample engine first — falls back to synthesis if not loaded or unavailable
  try {
    const { playSample, hasSample } = window.__sampleEngine || {}
    if (playSample && hasSample && hasSample(soundId)) {
      if (playSample(soundId, v, pan, rev)) return
      // playSample returns false → sample not cached yet → fall through to synthesis
    }
  } catch {}

  // Synthesis fallback
  switch(soundId){
    case 'kick':     return playKick(v,pan,rev,profile)
    case 'snare':    return playSnare(v,pan,rev,profile)
    case 'hihat':    return playHihat(false,v,pan,rev,profile)
    case 'openhat':  return playHihat(true,v,pan,rev,profile)
    case 'chick':    return playChick(v,pan,rev)
    case 'crash':    return playCrash(v,pan,rev,profile)
    case 'splash':   return playSplash(v,pan,rev)
    case 'china':    return playChina(v,pan,rev,profile)
    case 'ride':     return playRide(v,pan,rev,profile)
    case 'tom1':     return playTom('tom1',v,pan,rev,profile)
    case 'tom2':     return playTom('tom2',v,pan,rev,profile)
    case 'tom3':     return playTom('tom3',v,pan,rev,profile)
    case 'tom4':     return playTom('tom4',v,pan,rev,profile)
    case 'floortom': return playTom('floortom',v,pan,rev,profile)
    case 'cowbell':  return playCowbell(v,pan,rev)
  }
}

// ═══ SAMPLING PAD ZONES ══════════════════════════════════════════════════════
function spdOut(g,pan,rev){
  const{masterBus,reverbBus}=getEngine()
  if(pan!==0){const pa=P(pan);ch(g,pa,masterBus)}else ch(g,masterBus)
  if(rev>0){const pa2=P(pan),rv=G(rev);ch(g,pa2,rv,reverbBus)}
}
function spd_e_kick(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;const o=OSC('sine',90),g=G(0);o.frequency.setValueAtTime(90,t);o.frequency.exponentialRampToValueAtTime(.001,t+.28);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1.3*v,t+.003);g.gain.exponentialRampToValueAtTime(.001,t+.28);ch(o,g);startGuarded(o,t+.30,t);spdOut(g,p,r);const n=ns();if(n){const nf=BPF(2800,.5),ng=G(0);ng.gain.setValueAtTime(0,t);ng.gain.linearRampToValueAtTime(.35*v,t+.002);ng.gain.exponentialRampToValueAtTime(.001,t+.045);ch(n,nf,ng);startGuarded(n,t+.048,t);spdOut(ng,p,0)}}
function spd_e_snare(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;const o=OSC('triangle',220),g=G(0);o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(160,t+.05);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.6*v,t+.002);g.gain.exponentialRampToValueAtTime(.001,t+.065);ch(o,g);startGuarded(o,t+.07,t);spdOut(g,p,r*.5);const n=ns();if(n){const f1=BPF(4500,.4),f2=HPF(2000),gn=G(0);gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(.9*v,t+.002);gn.gain.exponentialRampToValueAtTime(.001,t+.15);ch(n,f1,f2,gn);startGuarded(n,t+.16,t);spdOut(gn,p,r)}}
function spd_e_hit(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;const o=OSC('square',440),lp=LPF(2200),g=G(0);o.frequency.setValueAtTime(440,t);o.frequency.exponentialRampToValueAtTime(180,t+.12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.55*v,t+.002);g.gain.exponentialRampToValueAtTime(.001,t+.12);ch(o,lp,g);startGuarded(o,t+.13,t);spdOut(g,p,r*.6)}
function spd_e_bass(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;const o=OSC('sawtooth',65),lp=LPF(600),g=G(0);o.frequency.setValueAtTime(65,t);o.frequency.exponentialRampToValueAtTime(42,t+.35);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1.0*v,t+.004);g.gain.exponentialRampToValueAtTime(.001,t+.35);ch(o,lp,g);startGuarded(o,t+.36,t);spdOut(g,p,r*.4)}
function spd_t_808(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;const o=OSC('sine',55),g=G(0);o.frequency.setValueAtTime(55,t);o.frequency.exponentialRampToValueAtTime(.001,t+.9);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1.5*v,t+.004);g.gain.exponentialRampToValueAtTime(.001,t+.9);ch(o,g);startGuarded(o,t+.92,t);spdOut(g,p,r*.3)}
function spd_t_clap(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;for(let i=0;i<3;i++){const d=i*.009,n=ns();if(!n)continue;const f1=BPF(2800+i*400,.35),f2=HPF(1800),g=G(0);g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(.8*v,t+d+.002);g.gain.exponentialRampToValueAtTime(.001,t+d+.08+i*.02);ch(n,f1,f2,g);startGuarded(n,t+d+.10+i*.02,t+d);spdOut(g,p,r*.8)}}
function spd_t_hat(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;const n=ns();if(!n)return;const h1=HPF(9000),h2=BPF(14000,.4),g=G(0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.5*v,t+.001);g.gain.exponentialRampToValueAtTime(.001,t+.04);ch(n,h1,h2,g);startGuarded(n,t+.042,t);spdOut(g,p,0)}
function spd_t_perc(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;const o=OSC('triangle',320),g=G(0);o.frequency.setValueAtTime(320,t);o.frequency.exponentialRampToValueAtTime(180,t+.08);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.7*v,t+.002);g.gain.exponentialRampToValueAtTime(.001,t+.08);ch(o,g);startGuarded(o,t+.085,t);spdOut(g,p,r*.5)}
function spd_i_metal(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;[2800,4200,6100].forEach((f,i)=>{const o=OSC('sawtooth',f*(1+(Math.random()*.02-.01))),lp=LPF(f*2.5),g=G(0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime((.16-i*.04)*v,t+.002);g.gain.exponentialRampToValueAtTime(.001,t+.28-i*.05);ch(o,lp,g);startGuarded(o,t+.30,t);spdOut(g,p,r*.7)})}
function spd_i_snap(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;const n=ns();if(!n)return;const f1=BPF(3500,.3),ws=ctx.createWaveShaper(),g=G(0);ws.curve=makeSatCurve(20);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1.0*v,t+.002);g.gain.exponentialRampToValueAtTime(.001,t+.10);ch(n,f1,ws,g);startGuarded(n,t+.11,t);spdOut(g,p,r*.4)}
function spd_i_grain(v,p,r){const e=getEngine();const{ctx}=e,t=ctx.currentTime;for(let i=0;i<6;i++){if(!e.canSpawn())break;const d=i*.006+Math.random()*.004,n=ns();if(!n)continue;const hf=HPF(3000+Math.random()*4000),g=G(0);g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(.22*v,t+d+.002);g.gain.exponentialRampToValueAtTime(.001,t+d+.018);ch(n,hf,g);startGuarded(n,t+d+.022,t+d);spdOut(g,p+(Math.random()-.5)*.3,0)}}
function spd_i_harsh(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;const n1=ns();if(n1){const h1=HPF(2500),g1=G(0);g1.gain.setValueAtTime(0,t);g1.gain.linearRampToValueAtTime(.9*v,t+.001);g1.gain.exponentialRampToValueAtTime(.001,t+.08);ch(n1,h1,g1);startGuarded(n1,t+.082,t);spdOut(g1,p,r*.2)}if(e.canSpawn()){const n2=ns();if(n2){const h2=HPF(7000),g2=G(0);g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(.5*v,t+.001);g2.gain.exponentialRampToValueAtTime(.001,t+.12);ch(n2,h2,g2);startGuarded(n2,t+.122,t);spdOut(g2,p,0)}}}
function spd_a_pad(v,p,r){const e=getEngine();const{ctx}=e,t=ctx.currentTime;[80,120,160].forEach((f,i)=>{if(!e.canSpawn())return;const o=OSC('sine',f),g=G(0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime((.3-i*.08)*v,t+.08);g.gain.exponentialRampToValueAtTime(.001,t+1.2);ch(o,g);startGuarded(o,t+1.22,t);spdOut(g,p,r)})}
function spd_a_swell(v,p,r){const e=getEngine();const{ctx}=e,t=ctx.currentTime;[280,420,560].forEach((f,i)=>{if(!e.canSpawn())return;const o=OSC('sine',f*(1+i*.005)),lp=LPF(1200),g=G(0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime((.25-i*.06)*v,t+.12);g.gain.exponentialRampToValueAtTime(.001,t+.85);ch(o,lp,g);startGuarded(o,t+.86,t);spdOut(g,p,r)})}
function spd_a_bell(v,p,r){const e=getEngine();const{ctx}=e,t=ctx.currentTime;[1400,2200,3100].forEach((f,i)=>{if(!e.canSpawn())return;const o=OSC('sine',f),g=G(0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime((.22-i*.06)*v,t+.003);g.gain.exponentialRampToValueAtTime(.001,t+.65-i*.12);ch(o,g);startGuarded(o,t+.67-i*.12,t);spdOut(g,p,r*1.1)})}
function spd_a_shimmer(v,p,r){const e=getEngine();if(!e.canSpawn())return;const{ctx}=e,t=ctx.currentTime;const n=ns();if(!n)return;const h1=HPF(8000),h2=BPF(12000,.3),g=G(0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.45*v,t+.04);g.gain.exponentialRampToValueAtTime(.001,t+.6);ch(n,h1,h2,g);startGuarded(n,t+.62,t);spdOut(g,p,r*1.3)}

const SPD_MAP={spd_e_kick,spd_e_snare,spd_e_hit,spd_e_bass,spd_t_808,spd_t_clap,spd_t_hat,spd_t_perc,spd_i_metal,spd_i_snap,spd_i_grain,spd_i_harsh,spd_a_pad,spd_a_swell,spd_a_bell,spd_a_shimmer}
export function playSamplingZone(id,v,pan,rev){const fn=SPD_MAP[id];if(fn)fn(v,pan,rev);else console.warn('[SoundBank] Unknown:',id)}
