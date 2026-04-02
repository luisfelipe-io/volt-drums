# 🥁 Drum Sessions

**A professional virtual drum kit and beat sequencer — playable in any browser, no download required.**

🔗 **Live:** [drumsessions.vercel.app](https://drumsessions.vercel.app)

---

## What is Drum Sessions?

Drum Sessions is a browser-based drum instrument designed for musicians, producers, and beatmakers who want to quickly sketch drum ideas without opening a full DAW. Think of it as a musical notepad — open it, play a beat, record it, and bring the idea wherever you need it.

---

## Features

### 🥁 5 Genre Drum Kits
| Kit | Style | Tier |
|---|---|---|
| Jazz | Warm, ride-centric 4-piece | Free |
| Classic Rock | Standard 5-piece + double kick | Free |
| Gospel / R&B | Big roomy 7-piece with cowbell | Pro |
| Metal | 12-piece double-kick monster | Pro |
| Electronic | E-kit with sampling pads | Pro |

### 🎛️ 32-Step Beat Sequencer
- Lookahead Web Audio clock for sample-accurate timing
- Swing control (0–50%)
- 8, 16, or 32 steps per pattern
- Per-step velocity (right-click a step to cycle)
- Named groove presets per kit (3 per kit)
- Save and reload your own patterns (localStorage)

### ⌨️ Keyboard Playable
Every drum has a keyboard shortcut. Two-stick limit enforced — just like a real drummer.

| Key | Drum | Key | Drum |
|---|---|---|---|
| `A` / `;` | Hi-Hat Closed | `S` / `L` | Snare |
| `Q` / `P` | Hi-Hat Open | `D` / `K` | Tom 1 |
| `W` / `O` | Crash 1 | `F` / `J` | Tom 2 |
| `R` / `U` | Ride | `G` / `H` | Floor Tom |
| `V` / `B` | Kick Right | `X` / `C` | Kick Left |
| `SPACE` | Play/Stop | `1–8` | Sampling Zones |

### ⏺ Recording
- Record your performance in real time
- Download as **WebM/Opus** (high quality, small file)
- Sync button: starts recording + sequencer simultaneously (no silence)

### 🎹 Sampling Pads
- 4 interactive zones per pad (mouse, touch, or keys 1–4 / 5–8)
- 4 sound packs: Electronic, Trap/808, Industrial, Ambient

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Audio Engine | Web Audio API (synthesized) |
| Sequencer | Web Audio lookahead clock |
| Recording | MediaRecorder API (WebM/Opus) |
| Styling | Pure CSS (no UI framework) |
| Hosting | Vercel |
| Analytics | Vercel Analytics |

---

## Running Locally

```bash
git clone https://github.com/luisfelipe-io/drumsessions.git
cd drumsessions
npm install
npm run dev        # → http://localhost:5173
npm run build      # production build
```

---

## Project Structure

```
src/
├── App.jsx                    # Root component + state
├── main.jsx                   # Entry point + Vercel Analytics
├── components/
│   ├── Header.jsx             # Top bar
│   ├── KitSVG.jsx             # SVG drum kit renderer
│   ├── DrumElement.jsx        # Per-drum SVG elements
│   ├── Hardware.jsx           # Rack, stands, hardware SVGs
│   ├── Sequencer.jsx          # 32-step grid sequencer
│   ├── ControlBar.jsx         # Vol, reverb, controls
│   ├── FeedbackModal.jsx      # User feedback (Formspree)
│   ├── FlamBadge.jsx          # Flam visual indicator
│   ├── VUMeter.jsx            # Level meter
│   ├── RemapModal.jsx         # Key remapping
│   ├── KitSelectModal.jsx     # Kit selection
│   └── SamplingPackModal.jsx  # Sound pack selector
├── data/
│   ├── presets.js             # 5 kit definitions
│   ├── beatPresets.js         # 32-step groove patterns
│   ├── defaultKeys.js         # Keyboard mappings
│   ├── layoutEngine.js        # Dynamic drum positioning
│   └── samplingPresets.js     # Sampling sound packs
├── engine/
│   ├── AudioEngine.js         # Web Audio context + voice limiter
│   └── SoundBank.js           # All drum synthesis
└── hooks/
    ├── useKeyboard.js         # Keyboard input (2-stick limit)
    ├── useRecorder.js         # Recording
    └── useSequencer.js        # Sequencer clock + state
```

---

## Sound Design

All sounds are synthesized via the Web Audio API — no audio samples required. Each instrument uses a physical-informed model with round-robin variation (4–6 per instrument) to prevent the machine-gun effect.

- **Kick:** Sub sine + punch triangle + beater click (3 layers)
- **Snare:** Membrane body + crack noise + wire sizzle (4 layers)
- **Hi-Hat:** Pure noise model (3 frequency bands)
- **Cymbals:** Noise-primary — no sine partials (eliminates church-bell sound)
- **Ride:** Warm bronze bell (~580Hz) + bow shimmer noise
- **Toms:** Coupled membrane oscillators + wood shell resonance

---

## Roadmap

- [ ] Real drum samples (CC0 / VSCO2 Community Edition)
- [ ] User accounts + cloud pattern storage
- [ ] Social sharing — export beat as audio clip
- [ ] Premium kit packs (monetization)
- [ ] MIDI input/output (Web MIDI API)
- [ ] URL-encoded pattern sharing

---

## Support

If you enjoy Drum Sessions, consider supporting development:

[![Support on PayPal](https://img.shields.io/badge/Support-PayPal-blue?logo=paypal)](https://www.paypal.com/donate/?business=3N87ZXBPN98RJ&item_name=Support+Drum+Sessions+Development&currency_code=USD)

---

## License

MIT — free to use, modify, and distribute.

---

*Built with React + Web Audio API*
