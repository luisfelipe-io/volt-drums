// samplingPresets.js — Sound packs for sampling pad zones
// Each pack defines 4 sound IDs (one per zone: TL, TR, BL, BR)
// and visual accent colors + short labels per zone.

export const SAMPLING_PACKS = [
  {
    id: 'electronic',
    name: 'Electronic',
    icon: '⚡',
    description: 'Punchy synthesized e-kit hits',
    // Zone order: TL=0, TR=1, BL=2, BR=3
    zones: ['spd_e_kick', 'spd_e_snare', 'spd_e_hit', 'spd_e_bass'],
    colors: [
      'rgba(0,180,255,0.22)',
      'rgba(0,100,220,0.20)',
      'rgba(60,220,255,0.18)',
      'rgba(0,60,200,0.16)',
    ],
    labels: ['KICK', 'SNR', 'HIT', 'BASS'],
  },
  {
    id: 'trap',
    name: 'Trap / 808',
    icon: '🔥',
    description: 'Deep 808 subs and trap percussion',
    zones: ['spd_t_808', 'spd_t_clap', 'spd_t_hat', 'spd_t_perc'],
    colors: [
      'rgba(255,60,20,0.22)',
      'rgba(200,30,0,0.20)',
      'rgba(255,130,40,0.18)',
      'rgba(180,20,0,0.16)',
    ],
    labels: ['808', 'CLAP', 'HAT', 'PERC'],
  },
  {
    id: 'industrial',
    name: 'Industrial',
    icon: '⚙',
    description: 'Harsh metallic textures and distortion',
    zones: ['spd_i_metal', 'spd_i_snap', 'spd_i_grain', 'spd_i_harsh'],
    colors: [
      'rgba(190,180,140,0.20)',
      'rgba(150,140,100,0.18)',
      'rgba(210,200,150,0.18)',
      'rgba(120,110,80,0.16)',
    ],
    labels: ['METAL', 'SNAP', 'GRAIN', 'HARSH'],
  },
  {
    id: 'ambient',
    name: 'Ambient',
    icon: '🌊',
    description: 'Atmospheric pads and tonal hits',
    zones: ['spd_a_pad', 'spd_a_swell', 'spd_a_bell', 'spd_a_shimmer'],
    colors: [
      'rgba(80,200,180,0.20)',
      'rgba(50,160,210,0.18)',
      'rgba(140,230,210,0.18)',
      'rgba(30,100,160,0.16)',
    ],
    labels: ['PAD', 'SWELL', 'BELL', 'SHIM'],
  },
]

export const DEFAULT_SAMPLING_PACK = 'electronic'
export default SAMPLING_PACKS
