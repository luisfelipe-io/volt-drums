// defaultKeys.js v2 — Space bar removed from kick (now = sequencer)
// Sampling pad zones: 1-4 for pad 1, 5-8 for pad 2

const DEFAULT_KEYS = {
  // ── Kick & Pedals (foot — space removed, now = sequencer play/pause) ──────
  kick_r:      ['v', 'b'],   // RIGHT kick — V is right of X on keyboard
  kick_l:      ['x', 'c'],   // LEFT kick
  hihat_pedal: ['z', null],  // left pinky — left foot sim

  // ── Home row — most ergonomic ─────────────────────────────────────────────
  snare:       ['s', 'l'],
  hihat:       ['a', ';'],
  tom1:        ['d', 'k'],
  tom2:        ['f', 'j'],
  floortom:    ['g', 'h'],
  floortom2:   ['n', 'm'],

  // ── Upper row — cymbals ───────────────────────────────────────────────────
  openhat:     ['q', 'p'],
  crash1:      ['w', 'o'],
  crash2:      ['e', 'i'],
  crash3:      ['4', '7'],
  ride:        ['r', 'u'],
  tom3:        ['t', 'y'],

  // ── Rare / extras ─────────────────────────────────────────────────────────
  tom4:        ['3', '8'],
  china:       ['2', '9'],
  china2:      ['0', null],
  splash:      ["'", null],   // apostrophe key
  splash2:     ['-', null],
  cowbell:     ['\\', null],

  // ── Sampling pad zones (number row — intuitive pad layout) ────────────────
  // Pad 1 zones: 1=TL, 2=TR, 3=BL, 4=BR
  // Pad 2 zones: 5=TL, 6=TR, 7=BL, 8=BR
  // These are handled separately in App.jsx (not via useKeyboard)
  sampling1:   ['1', '5'],   // primary key triggers zone 0; see samplingKeys below
  sampling2:   ['2', '6'],
}

// Sampling zone keyboard map: key → { padId, zone }
// Used in App.jsx global keydown handler
export const SAMPLING_KEYS = {
  '1': {padId:'sampling1',zone:0},
  '2': {padId:'sampling1',zone:1},
  '3': {padId:'sampling1',zone:2},
  '4': {padId:'sampling1',zone:3},
  '5': {padId:'sampling2',zone:0},
  '6': {padId:'sampling2',zone:1},
  '7': {padId:'sampling2',zone:2},
  '8': {padId:'sampling2',zone:3},
}

export default DEFAULT_KEYS
