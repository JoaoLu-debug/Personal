# Design System - Phantom Portfolio

## Product Context & Vision
Phantom is an interactive digital archive, portfolio, and creative service directory. It represents a brutalist-minimalist web developer and video editor aesthetic, merging high-performance custom Web Engineering with cinematic post-production and motion design.

## Target Audience
Tech startups, design agencies, creative studios, and brands looking for custom web interfaces and story-driven video production.

## Branding & Styling

### Color Palette
- **Canvas/Viewport**: Solid Deep Black (`#000000`)
- **Card Base**: Pure White / Light Lavender (`rgba(255, 255, 255, 0.95)` / `#d6e0ff`)
- **Accent Elements (Tech/AV Panels)**:
  - Electric Blue: `#0f4eff` (used for animated fluid blobs and highlights)
  - Cyan: `#00f0ff` (used for system status indicators, custom scrollbars, and oscilloscope trails)
- **Contrast Text**:
  - Dark elements (`#000000`) are used over the light shifting gradients in the poster, bio, and works sections.
  - Light elements (`#ffffff`) are used inside the dark glass AV patch panel.

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
- **Sibling Dimming**: Hovering over a project item highlights it and dims all neighboring items.
- **AV Tech Showcase**: An interactive audio patch synthesizer demonstrating Web Audio API capabilities and real-time canvas oscilloscope rendering.
- **Visual-Audio Synergy**: LFO speed slider changes both the synth frequency sweep and the swirled background blobs' animation speed.
