// presets.js v4 — Genre kits, each realistic and distinct
// soundProfile drives synthesis character (SoundBank.js prf() mapping)
// Kit positions use zone system (layoutEngine.js)

const PRESETS = [

  // ─── JAZZ ──────────────────────────────────────────────────────────────────
  // Classic 4-piece: bass drum, snare, hi-hat, ride. NO crash on every beat.
  // The ride IS the main timekeeping cymbal in jazz.
  {
    id:'jazz',
    tags:['4-piece','brushes','ride-centric'], name:'Jazz', tier:'free',
    description:'4-piece jazz kit. Ride-centric, warm and open.',
    soundProfile:'jazz', accentColor:'#c8a050',
    essential:[
      {id:'kick_r',     zone:'kick_r',      type:'kick',   soundId:'kick',    name:'Kick',          label:'KICK', pan:0,    revSend:.16},
      {id:'snare',      zone:'snare',       type:'pad',    soundId:'snare',   name:'Snare',         label:'SNRE', pan:-.12, revSend:.40},
      {id:'hihat',      zone:'hh',          type:'cymbal', soundId:'hihat',   name:'Hi-Hat Closed', label:'HH',   pan:-.72, revSend:.08},
      {id:'openhat',    zone:'hh',          type:'cymbal', soundId:'openhat', name:'Hi-Hat Open',   label:'HH O', pan:-.72, revSend:.22, sharedSvg:'hihat'},
      {id:'hihat_pedal',zone:'hh_pedal',    type:'foot',   soundId:'chick',   name:'HH Foot',       label:'HH F', pan:-.72, revSend:.04},
      {id:'ride',       zone:'ride',        type:'cymbal', soundId:'ride',    name:'Ride',          label:'RIDE', pan:.80,  revSend:.32},
      {id:'crash1',     zone:'crash_left',  type:'cymbal', soundId:'crash',   name:'Crash',         label:'CRSH', pan:-.58, revSend:.30},
      {id:'tom1',       zone:'rack_tom',    type:'pad',    soundId:'tom1',    name:'Tom',           label:'TOM',  pan:-.28, revSend:.32},
      {id:'floortom',   zone:'floor_r',     type:'pad',    soundId:'floortom',name:'Floor Tom',     label:'FLOR', pan:.55,  revSend:.35},
    ],
  },

  // ─── CLASSIC ROCK ─────────────────────────────────────────────────────────
  // Standard 5-piece. Double kick. Crash on beat 1. Hi-hat for timekeeping.
  {
    id:'rock',
    tags:['5-piece','double kick','open'], name:'Classic Rock', tier:'free',
    description:'5-piece rock kit. Punchy, open, double kick.',
    soundProfile:'acoustic', accentColor:'#00d4ff',
    essential:[
      {id:'kick_r',     zone:'kick_r',      type:'kick',   soundId:'kick',    name:'Kick R',        label:'KCK', pan:-.02, revSend:.10},
      {id:'kick_l',     zone:'kick_l',      type:'kick',   soundId:'kick',    name:'Kick L',        label:'KCK', pan:.02,  revSend:.10},
      {id:'snare',      zone:'snare',       type:'pad',    soundId:'snare',   name:'Snare',         label:'SNRE',pan:-.12, revSend:.28},
      {id:'hihat',      zone:'hh',          type:'cymbal', soundId:'hihat',   name:'Hi-Hat Closed', label:'HH',  pan:-.72, revSend:.06},
      {id:'openhat',    zone:'hh',          type:'cymbal', soundId:'openhat', name:'Hi-Hat Open',   label:'HH O',pan:-.72, revSend:.12, sharedSvg:'hihat'},
      {id:'hihat_pedal',zone:'hh_pedal',    type:'foot',   soundId:'chick',   name:'HH Foot',       label:'HH F',pan:-.72, revSend:.03},
      {id:'crash1',     zone:'crash_left',  type:'cymbal', soundId:'crash',   name:'Crash 1',       label:'CR1', pan:-.60, revSend:.25},
      {id:'crash2',     zone:'crash_right', type:'cymbal', soundId:'crash',   name:'Crash 2',       label:'CR2', pan:.52,  revSend:.25},
      {id:'ride',       zone:'ride',        type:'cymbal', soundId:'ride',    name:'Ride',          label:'RIDE',pan:.80,  revSend:.20},
      {id:'tom1',       zone:'rack_tom',    type:'pad',    soundId:'tom1',    name:'Tom 1',         label:'TM1', pan:-.36, revSend:.26},
      {id:'tom2',       zone:'rack_tom',    type:'pad',    soundId:'tom2',    name:'Tom 2',         label:'TM2', pan:.08,  revSend:.26},
      {id:'floortom',   zone:'floor_r',     type:'pad',    soundId:'floortom',name:'Floor Tom',     label:'FLR', pan:.58,  revSend:.28},
    ],
  },

  // ─── GOSPEL / R&B ─────────────────────────────────────────────────────────
  // 7-piece, big and roomy. 3 toms, cowbell, 2 crashes, splash.
  // Heavy groove feel. Open hi-hats prominent.
  {
    id:'gospel',
    tags:['7-piece','gospel','3 toms','cowbell'], name:'Gospel / R&B', tier:'premium',
    description:'7-piece gospel kit. Big, roomy and soulful.',
    soundProfile:'acoustic', accentColor:'#e8a830',
    essential:[
      {id:'kick_r',     zone:'kick_r',      type:'kick',   soundId:'kick',    name:'Kick R',        label:'KCK', pan:-.02, revSend:.12},
      {id:'kick_l',     zone:'kick_l',      type:'kick',   soundId:'kick',    name:'Kick L',        label:'KCK', pan:.02,  revSend:.12},
      {id:'snare',      zone:'snare',       type:'pad',    soundId:'snare',   name:'Snare',         label:'SNRE',pan:-.14, revSend:.38},
      {id:'hihat',      zone:'hh',          type:'cymbal', soundId:'hihat',   name:'Hi-Hat Closed', label:'HH',  pan:-.75, revSend:.10},
      {id:'openhat',    zone:'hh',          type:'cymbal', soundId:'openhat', name:'Hi-Hat Open',   label:'HH O',pan:-.75, revSend:.20, sharedSvg:'hihat'},
      {id:'hihat_pedal',zone:'hh_pedal',    type:'foot',   soundId:'chick',   name:'HH Foot',       label:'HH F',pan:-.75, revSend:.04},
      {id:'splash',     zone:'splash_l',    type:'cymbal', soundId:'splash',  name:'Splash',        label:'SPLS',pan:-.80, revSend:.22},
      {id:'crash1',     zone:'crash_left',  type:'cymbal', soundId:'crash',   name:'Crash 1',       label:'CR1', pan:-.65, revSend:.30},
      {id:'crash2',     zone:'crash_right', type:'cymbal', soundId:'crash',   name:'Crash 2',       label:'CR2', pan:.55,  revSend:.30},
      {id:'ride',       zone:'ride',        type:'cymbal', soundId:'ride',    name:'Ride',          label:'RIDE',pan:.80,  revSend:.25},
      {id:'cowbell',    zone:'bell',        type:'bell',   soundId:'cowbell', name:'Cowbell',       label:'BELL',pan:.50,  revSend:.14},
      {id:'tom1',       zone:'rack_tom',    type:'pad',    soundId:'tom1',    name:'Tom 1',         label:'TM1', pan:-.42, revSend:.30},
      {id:'tom2',       zone:'rack_tom',    type:'pad',    soundId:'tom2',    name:'Tom 2',         label:'TM2', pan:-.04, revSend:.30},
      {id:'tom3',       zone:'rack_tom',    type:'pad',    soundId:'tom3',    name:'Tom 3',         label:'TM3', pan:.34,  revSend:.30},
      {id:'floortom',   zone:'floor_r',     type:'pad',    soundId:'floortom',name:'Floor Tom 1',   label:'FL1', pan:.50,  revSend:.32},
      {id:'floortom2',  zone:'floor_r',     type:'pad',    soundId:'floortom2',name:'Floor Tom 2',  label:'FL2', pan:.68,  revSend:.32},
    ],
  },

  // ─── METAL ────────────────────────────────────────────────────────────────
  // Double kick essential. China, 4 toms, 3 crashes. Tight and aggressive.
  {
    id:'metal',
    tags:['double kick','china','4 toms','aggressive'], name:'Metal', tier:'premium',
    description:'Full metal kit. Double kick, china, 4 rack toms.',
    soundProfile:'heavy', accentColor:'#ff4422',
    essential:[
      {id:'kick_r',     zone:'kick_r',          type:'kick',   soundId:'kick',    name:'Kick R',        label:'KCK', pan:-.04, revSend:.06},
      {id:'kick_l',     zone:'kick_l',          type:'kick',   soundId:'kick',    name:'Kick L',        label:'KCK', pan:.04,  revSend:.06},
      {id:'snare',      zone:'snare',           type:'pad',    soundId:'snare',   name:'Snare',         label:'SNRE',pan:-.16, revSend:.20},
      {id:'hihat',      zone:'hh',              type:'cymbal', soundId:'hihat',   name:'Hi-Hat Closed', label:'HH',  pan:-.80, revSend:.04},
      {id:'openhat',    zone:'hh',              type:'cymbal', soundId:'openhat', name:'Hi-Hat Open',   label:'HH O',pan:-.80, revSend:.08, sharedSvg:'hihat'},
      {id:'hihat_pedal',zone:'hh_pedal',        type:'foot',   soundId:'chick',   name:'HH Foot',       label:'HH F',pan:-.80, revSend:.02},
      {id:'crash1',     zone:'crash_far_left',  type:'cymbal', soundId:'crash',   name:'Crash 1',       label:'CR1', pan:-.65, revSend:.18},
      {id:'crash2',     zone:'crash_left',      type:'cymbal', soundId:'crash',   name:'Crash 2',       label:'CR2', pan:-.42, revSend:.18},
      {id:'crash3',     zone:'crash_right',     type:'cymbal', soundId:'crash',   name:'Crash 3',       label:'CR3', pan:.50,  revSend:.18},
      {id:'china',      zone:'crash_far_right', type:'cymbal', soundId:'china',   name:'China',         label:'CHN', pan:.72,  revSend:.14},
      {id:'ride',       zone:'ride',            type:'cymbal', soundId:'ride',    name:'Ride',          label:'RIDE',pan:.82,  revSend:.16},
      {id:'tom1',       zone:'rack_tom',        type:'pad',    soundId:'tom1',    name:'Tom 1',         label:'TM1', pan:-.44, revSend:.20},
      {id:'tom2',       zone:'rack_tom',        type:'pad',    soundId:'tom2',    name:'Tom 2',         label:'TM2', pan:-.18, revSend:.20},
      {id:'tom3',       zone:'rack_tom',        type:'pad',    soundId:'tom3',    name:'Tom 3',         label:'TM3', pan:.12,  revSend:.20},
      {id:'tom4',       zone:'rack_tom',        type:'pad',    soundId:'tom4',    name:'Tom 4',         label:'TM4', pan:.36,  revSend:.20},
      {id:'floortom',   zone:'floor_r',         type:'pad',    soundId:'floortom',name:'Floor Tom 1',   label:'FL1', pan:.50,  revSend:.22},
      {id:'floortom2',  zone:'floor_r',         type:'pad',    soundId:'floortom2',name:'Floor Tom 2',  label:'FL2', pan:.66,  revSend:.22},
    ],
  },

  // ─── ELECTRONIC ───────────────────────────────────────────────────────────
  // E-kit. Tight, clicky, no room reverb. Sampling pads. China for texture.
  {
    id:'electronic',
    tags:['e-kit','sampling','tight','modern'], name:'Electronic', tier:'premium',
    description:'E-kit with sampling pads. Tight and modern.',
    soundProfile:'electronic', accentColor:'#8855ff',
    essential:[
      {id:'kick_r',     zone:'kick_r',      type:'kick',    soundId:'kick',    name:'Kick R',        label:'KCK', pan:-.02, revSend:.04},
      {id:'kick_l',     zone:'kick_l',      type:'kick',    soundId:'kick',    name:'Kick L',        label:'KCK', pan:.02,  revSend:.04},
      {id:'snare',      zone:'snare',       type:'pad',     soundId:'snare',   name:'Snare',         label:'SNRE',pan:-.14, revSend:.18},
      {id:'hihat',      zone:'hh',          type:'cymbal',  soundId:'hihat',   name:'Hi-Hat Closed', label:'HH',  pan:-.72, revSend:.04},
      {id:'openhat',    zone:'hh',          type:'cymbal',  soundId:'openhat', name:'Hi-Hat Open',   label:'HH O',pan:-.72, revSend:.08, sharedSvg:'hihat'},
      {id:'hihat_pedal',zone:'hh_pedal',    type:'foot',    soundId:'chick',   name:'HH Foot',       label:'HH F',pan:-.72, revSend:.02},
      {id:'crash1',     zone:'crash_left',  type:'cymbal',  soundId:'crash',   name:'Crash 1',       label:'CR1', pan:-.62, revSend:.16},
      {id:'crash2',     zone:'crash_right', type:'cymbal',  soundId:'crash',   name:'Crash 2',       label:'CR2', pan:.54,  revSend:.16},
      {id:'china',      zone:'china_r',     type:'cymbal',  soundId:'china',   name:'China',         label:'CHN', pan:.88,  revSend:.12},
      {id:'ride',       zone:'ride',        type:'cymbal',  soundId:'ride',    name:'Ride',          label:'RIDE',pan:.80,  revSend:.16},
      {id:'tom1',       zone:'rack_tom',    type:'pad',     soundId:'tom1',    name:'Tom 1',         label:'TM1', pan:-.40, revSend:.18},
      {id:'tom2',       zone:'rack_tom',    type:'pad',     soundId:'tom2',    name:'Tom 2',         label:'TM2', pan:-.02, revSend:.18},
      {id:'tom3',       zone:'rack_tom',    type:'pad',     soundId:'tom3',    name:'Tom 3',         label:'TM3', pan:.36,  revSend:.18},
      {id:'floortom',   zone:'floor_r',     type:'pad',     soundId:'floortom',name:'Floor Tom',     label:'FLR', pan:.56,  revSend:.20},
      {id:'sampling1',  zone:'sampling',    type:'sampling',soundId:'sampling',name:'Pad 1',         label:'PAD1',pan:-.20, revSend:.08},
      {id:'sampling2',  zone:'sampling',    type:'sampling',soundId:'sampling',name:'Pad 2',         label:'PAD2',pan:.20,  revSend:.08},
    ],
  },
]

export default PRESETS
