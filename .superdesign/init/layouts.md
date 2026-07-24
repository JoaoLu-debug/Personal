# Layouts - Phantom Portfolio

The layouts are structured in `index.html` and styled in `style.css`.

## 1. Page Container & Card Wrapper
- **File**: `index.html` (root)
- **Description**: Centers the card in the viewport over the ambient glowing background.
- **Source HTML**:
```html
<main class="page-container">
  <div class="card-wrapper" id="card-wrapper">
    <!-- Card Metadata Header -->
    <div class="card-metadata-header">
      <span class="meta-label">PHANTOM // ARCHIVE</span>
      <span class="meta-status">SYSTEM ACTIVE</span>
      <span class="meta-date">EST. 27-3-15</span>
    </div>
    
    <!-- Central Card -->
    <article class="glass-panel portfolio-card" id="portfolio-card">
       <!-- Scroll Container inside the card -->
       <div class="card-scroll-container" id="scroll-container">
         <!-- Content sections scroll internally here -->
       </div>
    </article>

    <!-- Custom Scrollbar -->
    <div class="card-scrollbar-track">
      <div class="card-scrollbar-thumb" id="scrollbar-thumb"></div>
    </div>
  </div>
</main>
```

## 2. Card Metadata Header (`.card-metadata-header`)
- **File**: `index.html`
- **Description**: Floating bar above the card containing system details and status in Riosark typeface.
- **Source CSS**:
```css
.card-metadata-header {
  width: 92%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  color: var(--text-muted-light);
  font-family: var(--font-riosark);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  opacity: 0.7;
  pointer-events: none;
}
```
