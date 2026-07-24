# Extractable Components - Phantom Portfolio

These are the reusable layout blocks in our project that can be extracted as draft components.

## 1. HeroPoster
- Source: `index.html` (lines 70-114)
- Category: layout
- Description: Large typographic poster replica with title "Phantom" and club/event metadata labels.
- Extractable props: title (string, default: "Phantom"), subtitle (string, default: "De—\nVision\n012")
- Hardcoded: All positioning CSS, label placements.

## 2. ResonanceLab
- Source: `index.html` (lines 178-228)
- Category: basic
- Description: Interactive ambient sound synthesizer with oscillators controls and a canvas visualizer scope.
- Extractable props: activeState (boolean, default: false), baseFreq (number, default: 880)
- Hardcoded: CSS styling, synth-panel wrapper.
