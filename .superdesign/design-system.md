# Design System - Phantom Portfolio

## Product Context & Vision
Phantom is an interactive digital archive, portfolio, and creative directory. It represents a brutalist-minimalist designer/sound artist aesthetic, merging modular analog synthesis with glass-optics physical design.

## Target Audience
Creative developers, digital artists, sound designers, agencies looking for high-end digital aesthetics.

## Branding & Styling

### Color Palette
- **Canvas/Viewport**: Solid Deep Black (`#000000`)
- **Card Base**: Pure White / Light Lavender (`rgba(255, 255, 255, 0.95)` / `#d6e0ff`)
- **Accent Elements (Tech/Synth Panels)**:
  - Electric Blue: `#0f4eff` (used for animated fluid blobs and highlights)
  - Cyan: `#00f0ff` (used for system status indicators, custom scrollbars, and oscilloscope trails)
- **Contrast Text**:
  - Dark elements (`#000000`) are used over the light shifting gradients in the poster and bio sections.
  - Light elements (`#ffffff`) are used inside the dark glass synthesizer panel.

### Typography
- **Headings (Display)**: `Syne` (brutalist, ultra-wide, geometric)
- **Body Text**: `Outfit` (clean, contemporary geometric sans-serif)
- **Monospace Code/Labels**: `Space Mono`
- **Brutalist metadata & Header**: `Riosark` (loaded via local webfont file `Riosark-Regular.ttf` with fallbacks: `Outfit`, `Space Mono`)

### Layout Constraints
- Centered vertical poster-like card (`460px` max-width, `72vh` height) floating in the center of a black screen.
- All page navigation and content sections scroll *internally* within the card.
- A custom vertical scrollbar track sits on the right margin of the card.
- Chromatic prism border (1.5px multi-stop gradient mask) surrounds the card.

## Motion & Interactions
- **3D Card Tilt**: Mouse movement tilts the card in 3D space.
- **Holographic Parallax**: Card text headers shift in the opposite direction of the tilt to create visual depth.
- **SVG Liquid Glass**: Custom `#liquid-glass-filter` SVG displacement map applied behind the text, creating realistic glass distortion of the blue-white fluid background blobs.
- **Sibling Dimming**: Hovering over a project item fades all neighboring items.
- **Audio Visualizer**: Live canvas oscilloscope displaying frequency waveforms.
- **Visual-Audio Synergy**: LFO speed slider changes both the synth frequency sweep and the swirled background blobs' animation speed.
