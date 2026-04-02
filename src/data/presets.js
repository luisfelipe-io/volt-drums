// presets.js v3 — Genre-based kits, no add-ons (custom kit = paid feature)
// Each kit is self-contained and realistic for its musical genre.
// Instruments use zone system (layoutEngine.js distributes positions).

const PRESETS = [
  // ─── 1. JAZZ ──────────────────────────────────────────────────────────────
  // Minimal 4-piece. Brushes/mallets feel. Ride-centric. Open, warm.
  {
    id:'jazz', name:'Jazz', tier:'free',
    description:'4-piece brush kit. Warm, open and ride-centric.',
    soundProfile:'jazz', accentColor:'#c8a050',
    tags:['4-piece','brushes','warm','open'],
    essential:[
      {id:'hihat',      zone:'hh',         type:'cymbal', soundId:'hihat',   name:'Hi-Hat Closed',label:'HH CL',pan:-.72,revSend:.10},
      {id:'openhat',    zone:'hh',         type:'cymbal', soundId:'openhat', name:'Hi-Hat Open',  label:'HH OP',pan:-.72,revSend:.18,sharedSvg:'hihat'},
      {id:'ride',       zone:'ride',       type:'cymbal', soundId:'ride',    name:'Ride',         label:'RIDE', pan:.80,revSend:.28},
      {id:'crash1',     zone:'crash_left', type:'cymbal', soundId:'crash',   name:'Crash',        label:'CRASH',pan:-.55,revSend:.30},
      {id:'snare',      zone:'snare',      type:'pad',    soundId:'snare',   name:'Snare',        label:'SNARE',pan:-.12,revSend:.35},
      {id:'tom1',       zone:'rack_tom',   type:'pad',    soundId:'tom1',    name:'Tom 1',        label:'TOM 1',pan:-.30,revSend:.32},
      {id:'floortom',   zone:'floor_r',    type:'pad',    soundId:'floortom',name:'Floor Tom',    label:'FLOOR',pan:.58,revSend:.35},
      {id:'kick_r',     zone:'kick_r',     type:'kick',   soundId:'kick',    name:'Kick',         label:'KICK', pan:0,  revSend:.12},
      {id:'hihat_pedal',zone:'hh_pedal',   type:'foot',   soundId:'chick',   name:'HH Foot',      label:'HH FT',pan:-.72,revSend:.04},
    ],
  },

  // ─── 2. CLASSIC ROCK ──────────────────────────────────────────────────────
  // Standard 5-piece. Ludwig/Pearl feel. Punchy, mid-heavy. Double kick.
  {
    id:'rock', name:'Classic Rock', tier:'free',
    description:'Standard 5-piece. Punchy, open and timeless.',
    soundProfile:'acoustic', accentColor:'#00d4ff',
    tags:['5-piece','standard','double kick'],
    essential:[
      {id:'hihat',      zone:'hh',          type:'cymbal', soundId:'hihat',   name:'Hi-Hat Closed',label:'HH CL',pan:-.72,revSend:.08},
      {id:'openhat',    zone:'hh',          type:'cymbal', soundId:'openhat', name:'Hi-Hat Open',  label:'HH OP',pan:-.72,revSend:.14,sharedSvg:'hihat'},
      {id:'crash1',     zone:'crash_left',  type:'cymbal', soundId:'crash',   name:'Crash 1',      label:'CRS 1',pan:-.62,revSend:.26},
      {id:'crash2',     zone:'crash_right', type:'cymbal', soundId:'crash',   name:'Crash 2',      label:'CRS 2',pan:.54,revSend:.26},
      {id:'ride',       zone:'ride',        type:'cymbal', soundId:'ride',    name:'Ride',         label:'RIDE', pan:.80,revSend:.22},
      {id:'tom1',       zone:'rack_tom',    type:'pad',    soundId:'tom1',    name:'Tom 1',        label:'TOM 1',pan:-.36,revSend:.28},
      {id:'tom2',       zone:'rack_tom',    type:'pad',    soundId:'tom2',    name:'Tom 2',        label:'TOM 2',pan:.06,revSend:.28},
      {id:'snare',      zone:'snare',       type:'pad',    soundId:'snare',   name:'Snare',        label:'SNARE',pan:-.12,revSend:.28},
      {id:'floortom',   zone:'floor_r',     type:'pad',    soundId:'floortom',name:'Floor Tom',    label:'FLOOR',pan:.60,revSend:.30},
      {id:'kick_r',     zone:'kick_r',      type:'kick',   soundId:'kick',    name:'Kick R',       label:'KCK R',pan:-.02,revSend:.10},
      {id:'kick_l',     zone:'kick_l',      type:'kick',   soundId:'kick',    name:'Kick L',       label:'KCK L',pan:.02,revSend:.10},
      {id:'hihat_pedal',zone:'hh_pedal',    type:'foot',   soundId:'chick',   name:'HH Foot',      label:'HH FT',pan:-.72,revSend:.04},
    ],
  },

  // ─── 3. GOSPEL / R&B ──────────────────────────────────────────────────────
  // Big, roomy, 7-piece. Huge snare, 3 toms. Cowbell often. More crashes.
  {
    id:'gospel', name:'Gospel / R&B', tier:'premium',
    description:'Big, roomy gospel kit. Wide stereo, deep snare.',
    soundProfile:'acoustic', accentColor:'#e8a830',
    tags:['7-piece','gospel','big room','3 toms'],
    essential:[
      {id:'hihat',      zone:'hh',          type:'cymbal', soundId:'hihat',   name:'Hi-Hat Closed',label:'HH CL',pan:-.75,revSend:.10},
      {id:'openhat',    zone:'hh',          type:'cymbal', soundId:'openhat', name:'Hi-Hat Open',  label:'HH OP',pan:-.75,revSend:.18,sharedSvg:'hihat'},
      {id:'splash',     zone:'splash_l',    type:'cymbal', soundId:'splash',  name:'Splash',       label:'SPLS', pan:-.80,revSend:.22},
      {id:'crash1',     zone:'crash_left',  type:'cymbal', soundId:'crash',   name:'Crash 1',      label:'CRS 1',pan:-.65,revSend:.30},
      {id:'crash2',     zone:'crash_right', type:'cymbal', soundId:'crash',   name:'Crash 2',      label:'CRS 2',pan:.55,revSend:.30},
      {id:'cowbell',    zone:'bell',        type:'bell',   soundId:'cowbell', name:'Cowbell',      label:'BELL', pan:.55,revSend:.16},
      {id:'ride',       zone:'ride',        type:'cymbal', soundId:'ride',    name:'Ride',         label:'RIDE', pan:.80,revSend:.25},
      {id:'tom1',       zone:'rack_tom',    type:'pad',    soundId:'tom1',    name:'Tom 1',        label:'TOM 1',pan:-.42,revSend:.30},
      {id:'tom2',       zone:'rack_tom',    type:'pad',    soundId:'tom2',    name:'Tom 2',        label:'TOM 2',pan:-.04,revSend:.30},
      {id:'tom3',       zone:'rack_tom',    type:'pad',    soundId:'tom3',    name:'Tom 3',        label:'TOM 3',pan:.34,revSend:.30},
      {id:'snare',      zone:'snare',       type:'pad',    soundId:'snare',   name:'Snare',        label:'SNARE',pan:-.14,revSend:.35},
      {id:'floortom',   zone:'floor_r',     type:'pad',    soundId:'floortom',name:'Floor Tom 1',  label:'FLR 1',pan:.50,revSend:.32},
      {id:'floortom2',  zone:'floor_r',     type:'pad',    soundId:'floortom',name:'Floor Tom 2',  label:'FLR 2',pan:.70,revSend:.32},
      {id:'kick_r',     zone:'kick_r',      type:'kick',   soundId:'kick',    name:'Kick R',       label:'KCK R',pan:-.02,revSend:.12},
      {id:'kick_l',     zone:'kick_l',      type:'kick',   soundId:'kick',    name:'Kick L',       label:'KCK L',pan:.02,revSend:.12},
      {id:'hihat_pedal',zone:'hh_pedal',    type:'foot',   soundId:'chick',   name:'HH Foot',      label:'HH FT',pan:-.75,revSend:.04},
    ],
  },

  // ─── 4. METAL ─────────────────────────────────────────────────────────────
  // Aggressive. Double kick essential. China, 4 toms, 3 crashes. Tight & compressed.
  {
    id:'metal', name:'Metal', tier:'premium',
    description:'Massive metal kit. Double kick, china and 4 rack toms.',
    soundProfile:'heavy', accentColor:'#ff4422',
    tags:['12-piece','double kick','china','4 toms','metal'],
    viewBox:'0 0 1280 520',
    essential:[
      {id:'hihat',      zone:'hh',              type:'cymbal', soundId:'hihat',   name:'Hi-Hat Closed',label:'HH CL',pan:-.80,revSend:.05},
      {id:'openhat',    zone:'hh',              type:'cymbal', soundId:'openhat', name:'Hi-Hat Open',  label:'HH OP',pan:-.80,revSend:.08,sharedSvg:'hihat'},
      {id:'splash',     zone:'splash_l',        type:'cymbal', soundId:'splash',  name:'Splash',       label:'SPLS', pan:-.72,revSend:.12},
      {id:'crash1',     zone:'crash_far_left',  type:'cymbal', soundId:'crash',   name:'Crash 1',      label:'CRS 1',pan:-.62,revSend:.20},
      {id:'crash2',     zone:'crash_left',      type:'cymbal', soundId:'crash',   name:'Crash 2',      label:'CRS 2',pan:-.40,revSend:.20},
      {id:'tom1',       zone:'rack_tom',        type:'pad',    soundId:'tom1',    name:'Tom 1',        label:'TOM 1',pan:-.44,revSend:.22},
      {id:'tom2',       zone:'rack_tom',        type:'pad',    soundId:'tom2',    name:'Tom 2',        label:'TOM 2',pan:-.18,revSend:.22},
      {id:'tom3',       zone:'rack_tom',        type:'pad',    soundId:'tom3',    name:'Tom 3',        label:'TOM 3',pan:.12,revSend:.22},
      {id:'tom4',       zone:'rack_tom',        type:'pad',    soundId:'tom4',    name:'Tom 4',        label:'TOM 4',pan:.36,revSend:.22},
      {id:'crash3',     zone:'crash_right',     type:'cymbal', soundId:'crash',   name:'Crash 3',      label:'CRS 3',pan:.52,revSend:.20},
      {id:'china',      zone:'crash_far_right', type:'cymbal', soundId:'china',   name:'China',        label:'CHINA',pan:.74,revSend:.16},
      {id:'ride',       zone:'ride',            type:'cymbal', soundId:'ride',    name:'Ride',         label:'RIDE', pan:.82,revSend:.18},
      {id:'china2',     zone:'china_r',         type:'cymbal', soundId:'china',   name:'China 2',      label:'CHN 2',pan:.90,revSend:.16},
      {id:'snare',      zone:'snare',           type:'pad',    soundId:'snare',   name:'Snare',        label:'SNARE',pan:-.16,revSend:.22},
      {id:'floortom',   zone:'floor_r',         type:'pad',    soundId:'floortom',name:'Floor Tom 1',  label:'FLR 1',pan:.52,revSend:.24},
      {id:'floortom2',  zone:'floor_r',         type:'pad',    soundId:'floortom',name:'Floor Tom 2',  label:'FLR 2',pan:.68,revSend:.24},
      {id:'kick_r',     zone:'kick_r',          type:'kick',   soundId:'kick',    name:'Kick R',       label:'KCK R',pan:-.04,revSend:.06},
      {id:'kick_l',     zone:'kick_l',          type:'kick',   soundId:'kick',    name:'Kick L',       label:'KCK L',pan:.04,revSend:.06},
      {id:'hihat_pedal',zone:'hh_pedal',        type:'foot',   soundId:'chick',   name:'HH Foot',      label:'HH FT',pan:-.80,revSend:.02},
    ],
  },

  // ─── 5. ELECTRONIC ────────────────────────────────────────────────────────
  // E-kit with sampling pads. Tight, clicky. Tech Signature inspired.
  {
    id:'electronic', name:'Electronic', tier:'premium',
    description:'Tight e-kit with sampling pads. For modern production.',
    soundProfile:'electronic', accentColor:'#8855ff',
    tags:['electronic','sampling','e-kit','progressive'],
    essential:[
      {id:'hihat',      zone:'hh',          type:'cymbal',  soundId:'hihat',   name:'Hi-Hat Closed',label:'HH CL',pan:-.72,revSend:.05},
      {id:'openhat',    zone:'hh',          type:'cymbal',  soundId:'openhat', name:'Hi-Hat Open',  label:'HH OP',pan:-.72,revSend:.10,sharedSvg:'hihat'},
      {id:'crash1',     zone:'crash_left',  type:'cymbal',  soundId:'crash',   name:'Crash 1',      label:'CRS 1',pan:-.62,revSend:.18},
      {id:'crash2',     zone:'crash_right', type:'cymbal',  soundId:'crash',   name:'Crash 2',      label:'CRS 2',pan:.54,revSend:.18},
      {id:'china',      zone:'china_r',     type:'cymbal',  soundId:'china',   name:'China',        label:'CHINA',pan:.88,revSend:.15},
      {id:'ride',       zone:'ride',        type:'cymbal',  soundId:'ride',    name:'Ride',         label:'RIDE', pan:.80,revSend:.18},
      {id:'tom1',       zone:'rack_tom',    type:'pad',     soundId:'tom1',    name:'Tom 1',        label:'TOM 1',pan:-.40,revSend:.20},
      {id:'tom2',       zone:'rack_tom',    type:'pad',     soundId:'tom2',    name:'Tom 2',        label:'TOM 2',pan:-.02,revSend:.20},
      {id:'tom3',       zone:'rack_tom',    type:'pad',     soundId:'tom3',    name:'Tom 3',        label:'TOM 3',pan:.36,revSend:.20},
      {id:'snare',      zone:'snare',       type:'pad',     soundId:'snare',   name:'Snare',        label:'SNARE',pan:-.14,revSend:.20},
      {id:'floortom',   zone:'floor_r',     type:'pad',     soundId:'floortom',name:'Floor Tom',    label:'FLOOR',pan:.56,revSend:.22},
      {id:'sampling1',  zone:'sampling',    type:'sampling',soundId:'sampling',name:'Sampling Pad 1',label:'SPD 1',pan:-.20,revSend:.10},
      {id:'sampling2',  zone:'sampling',    type:'sampling',soundId:'sampling',name:'Sampling Pad 2',label:'SPD 2',pan:.20,revSend:.10},
      {id:'kick_r',     zone:'kick_r',      type:'kick',    soundId:'kick',    name:'Kick R',       label:'KCK R',pan:-.02,revSend:.06},
      {id:'kick_l',     zone:'kick_l',      type:'kick',    soundId:'kick',    name:'Kick L',       label:'KCK L',pan:.02,revSend:.06},
      {id:'hihat_pedal',zone:'hh_pedal',    type:'foot',    soundId:'chick',   name:'HH Foot',      label:'HH FT',pan:-.72,revSend:.02},
    ],
  },
]

export default PRESETS
