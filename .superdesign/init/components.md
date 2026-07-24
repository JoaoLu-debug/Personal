# Shared UI Components - Phantom Portfolio

Since this is a vanilla HTML/CSS/JS project, there are no separate component files. Reusable UI primitives are defined as HTML classes and styled in `style.css`.

## 1. Glass Panel (`.glass-panel`)
- **Description**: Acrylic glass panel with isolated SVG liquid blur filter and chromatic border.
- **HTML Pattern**:
```html
<div class="glass-panel">
  <!-- Content goes here -->
</div>
```
- **CSS Implementation**:
```css
.glass-panel {
  position: relative;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(0, 0, 0, 0.045);
  border-radius: 24px;
  z-index: 1;
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.025),
    inset 1px 1px 1px rgba(255, 255, 255, 0.9),
    inset -1px -1px 1px rgba(0, 0, 0, 0.03);
}

.glass-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: -10;
  backdrop-filter: url("#liquid-glass-filter") blur(6px);
}
```

## 2. Project Item (`.project-item`)
- **Description**: List item in the portfolio grid with hover details and sibling dimming transitions.
- **HTML Pattern**:
```html
<div class="project-item">
  <div class="project-meta font-mono">01 / CATEGORY</div>
  <h3 class="project-title">Title</h3>
  <p class="project-desc">Description (reveals on hover)</p>
  <div class="project-tags font-mono">
    <span>TAG1</span><span>TAG2</span>
  </div>
</div>
```

## 3. Contact Link (`.contact-link`)
- **Description**: Minimalist, card-style link button with sliding translation on hover.
- **HTML Pattern**:
```html
<a href="#" class="contact-link">
  <span class="link-label font-mono">LABEL</span>
  <span class="link-val">Value / Link</span>
</a>
```
