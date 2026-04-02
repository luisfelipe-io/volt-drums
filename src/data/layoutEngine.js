// layoutEngine.js v3 — Natural drum positioning
// ─────────────────────────────────────────────────────────────────────────────
// Uses a polar coordinate arc system based on real drum geometry:
//   • Drummer sits at the "south" of the canvas
//   • Kit arcs forward and outward like a horseshoe
//   • Each zone has named slot positions (not just a range to split)
//   • Positions derived from real drum setup conventions
// ─────────────────────────────────────────────────────────────────────────────

// ── Desktop zone definitions (viewBox 1080×520) ───────────────────────────
const D = {
  hh:       { cx:106, cy:198, r:78 },
  ride:     { cx:900, cy:198, r:96 },
  china_r:  { cx:972, cy:316, r:72 },
  snare:    { cx:258, cy:368, r:78 },
  kick_r:   { cx:548, cy:424 },
  kick_l:   { cx:414, cy:424 },
  hh_pedal: { cx:102, cy:456 },

  // Crash cymbals: left arc, right arc — positions depend on count
  crash_left:  [
    [{ cx:282, cy:108, r:86 }],                                          // 1 crash
    [{ cx:220, cy:118, r:80 }, { cx:318, cy:100, r:82 }],               // 2 crashes
    [{ cx:176, cy:126, r:74 }, { cx:264, cy:104, r:78 }, { cx:346, cy:96, r:74 }], // 3
  ],
  crash_right: [
    [{ cx:722, cy:108, r:84 }],
    [{ cx:666, cy:100, r:80 }, { cx:762, cy:108, r:80 }],
    [{ cx:626, cy:96, r:74 }, { cx:714, cy:104, r:76 }, { cx:796, cy:108, r:72 }],
  ],
  crash_far_left:  [
    [{ cx:176, cy:114, r:74 }],
    [{ cx:144, cy:120, r:70 }, { cx:216, cy:108, r:72 }],
  ],
  crash_far_right: [
    [{ cx:870, cy:104, r:72 }],
    [{ cx:842, cy:110, r:68 }, { cx:918, cy:100, r:66 }],
  ],
  splash_l: [
    [{ cx:160, cy:70, r:50 }],
    [{ cx:138, cy:74, r:46 }, { cx:196, cy:64, r:44 }],
  ],

  // Rack toms: tight arc between crashes, sized by count
  rack_tom: [
    [{ cx:490, cy:142, r:72 }],
    [{ cx:410, cy:168, r:66 }, { cx:536, cy:142, r:66 }],
    [{ cx:380, cy:174, r:62 }, { cx:482, cy:140, r:64 }, { cx:592, cy:140, r:62 }],
    [{ cx:354, cy:178, r:56 }, { cx:442, cy:148, r:58 }, { cx:530, cy:148, r:58 }, { cx:618, cy:178, r:56 }],
  ],

  bell: [
    [{ cx:648, cy:140, r:29 }],
  ],

  // Sampling pads: center-front, between snare and floor tom level
  sampling: [
    [{ cx:490, cy:288, r:58 }],
    [{ cx:374, cy:282, r:54 }, { cx:608, cy:282, r:54 }],
    [{ cx:348, cy:282, r:50 }, { cx:490, cy:280, r:52 }, { cx:632, cy:282, r:50 }],
  ],

  // Floor toms: right side, natural extension from rack toms
  floor_r: [
    [{ cx:756, cy:368, r:84 }],
    [{ cx:700, cy:362, r:78 }, { cx:836, cy:370, r:72 }],
  ],
}

// ── Monster desktop (1280×520) ─────────────────────────────────────────────
const M = {
  hh:       { cx:74, cy:192, r:66 },
  ride:     { cx:1092, cy:188, r:88 },
  china_r:  { cx:1196, cy:292, r:60 },
  snare:    { cx:254, cy:364, r:70 },
  kick_r:   { cx:590, cy:420 },
  kick_l:   { cx:462, cy:420 },
  hh_pedal: { cx:60,  cy:452 },

  crash_left: [
    [{ cx:348, cy:96, r:68 }],
    [{ cx:300, cy:104, r:64 }, { cx:380, cy:90, r:64 }],
  ],
  crash_right: [
    [{ cx:820, cy:96, r:68 }],
    [{ cx:780, cy:100, r:62 }, { cx:852, cy:90, r:62 }],
  ],
  crash_far_left: [
    [{ cx:254, cy:100, r:68 }],
    [{ cx:218, cy:108, r:64 }, { cx:286, cy:94, r:62 }],
  ],
  crash_far_right: [
    [{ cx:970, cy:96, r:66 }],
    [{ cx:936, cy:100, r:62 }, { cx:1008, cy:90, r:60 }],
  ],
  splash_l: [
    [{ cx:164, cy:86, r:46 }],
    [{ cx:146, cy:90, r:42 }, { cx:196, cy:78, r:40 }],
  ],
  rack_tom: [
    [{ cx:590, cy:126, r:60 }],
    [{ cx:510, cy:148, r:56 }, { cx:610, cy:124, r:56 }],
    [{ cx:452, cy:154, r:52 }, { cx:550, cy:126, r:54 }, { cx:650, cy:128, r:52 }],
    [{ cx:376, cy:158, r:50 }, { cx:456, cy:134, r:52 }, { cx:542, cy:122, r:52 }, { cx:628, cy:134, r:50 }],
  ],
  bell: [[{ cx:738, cy:112, r:28 }]],
  sampling: [
    [{ cx:740, cy:286, r:54 }],
    [{ cx:528, cy:280, r:50 }, { cx:752, cy:280, r:50 }],
  ],
  floor_r: [
    [{ cx:800, cy:360, r:74 }],
    [{ cx:754, cy:354, r:70 }, { cx:886, cy:362, r:66 }],
  ],
}

// ── Mobile (640×480) ───────────────────────────────────────────────────────
const MOB = {
  hh:       { cx:62, cy:162, r:60 },
  ride:     { cx:534, cy:164, r:72 },
  china_r:  { cx:578, cy:248, r:54 },
  snare:    { cx:150, cy:288, r:60 },
  kick_r:   { cx:326, cy:346 },
  kick_l:   { cx:244, cy:346 },
  hh_pedal: { cx:56,  cy:370 },

  crash_left: [
    [{ cx:158, cy:76, r:64 }],
    [{ cx:124, cy:84, r:58 }, { cx:192, cy:68, r:60 }],
    [{ cx:100, cy:90, r:54 }, { cx:158, cy:72, r:56 }, { cx:204, cy:66, r:52 }],
  ],
  crash_right: [
    [{ cx:426, cy:76, r:62 }],
    [{ cx:390, cy:72, r:58 }, { cx:460, cy:78, r:58 }],
    [{ cx:364, cy:70, r:52 }, { cx:420, cy:74, r:54 }, { cx:472, cy:78, r:52 }],
  ],
  crash_far_left:  [[{ cx:86,  cy:82, r:56 }], [{ cx:72, cy:88, r:52 }, { cx:116, cy:76, r:50 }]],
  crash_far_right: [[{ cx:560, cy:80, r:52 }], [{ cx:534, cy:82, r:48 }, { cx:590, cy:74, r:46 }]],
  splash_l: [[{ cx:88, cy:50, r:38 }], [{ cx:74, cy:54, r:34 }, { cx:112, cy:46, r:32 }]],
  rack_tom: [
    [{ cx:296, cy:104, r:56 }],
    [{ cx:244, cy:122, r:50 }, { cx:316, cy:104, r:50 }],
    [{ cx:218, cy:128, r:46 }, { cx:286, cy:102, r:48 }, { cx:352, cy:102, r:46 }],
    [{ cx:200, cy:132, r:42 }, { cx:256, cy:108, r:44 }, { cx:310, cy:108, r:44 }, { cx:366, cy:132, r:42 }],
  ],
  bell: [[{ cx:382, cy:104, r:22 }]],
  sampling: [
    [{ cx:292, cy:222, r:46 }],
    [{ cx:222, cy:218, r:42 }, { cx:360, cy:218, r:42 }],
  ],
  floor_r: [
    [{ cx:448, cy:282, r:64 }],
    [{ cx:418, cy:278, r:58 }, { cx:498, cy:286, r:54 }],
  ],
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getViewBox(presetId, isMobile) {
  if (isMobile)              return '0 0 640 480'
  if (presetId === 'metal')  return '0 0 1280 520'
  return '0 0 1080 520'
}

export function computeLayout(activeItems, isMobile, presetId) {
  const tables = isMobile ? MOB : (presetId === 'metal' ? M : D)
  const result = {}

  // Group drawable items by zone
  const byZone = {}
  for (const item of activeItems) {
    if (item.sharedSvg) continue
    const z = item.zone
    if (!z) continue
    if (!byZone[z]) byZone[z] = []
    byZone[z].push(item)
  }

  for (const [zoneName, items] of Object.entries(byZone)) {
    const table = tables[zoneName]
    if (!table) continue

    // Fixed position (single object, not array of arrays)
    if (!Array.isArray(table)) {
      items.forEach(item => { result[item.id] = { ...table } })
      continue
    }

    const n = items.length
    // Clamp to available slot counts
    const maxSlots = table.length
    const positions = table[Math.min(n, maxSlots) - 1] || table[maxSlots - 1]
    if (!positions) continue

    items.forEach((item, i) => {
      result[item.id] = { ...positions[Math.min(i, positions.length - 1)] }
    })
  }

  return result
}
