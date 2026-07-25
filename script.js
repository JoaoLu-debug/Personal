document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const cardWrapper = document.getElementById('card-wrapper');
  const card = document.getElementById('portfolio-card');
  const scrollContainer = document.getElementById('scroll-container');
  const scrollThumb = document.getElementById('scrollbar-thumb');
  const turbulence = document.querySelector('#liquid-glass-filter feTurbulence');
  


  // --- 1. 3D TILT & PARALLAX EFFECT ---
  let isMoving = false;

  cardWrapper.addEventListener('mousemove', (e) => {
    isMoving = true;
    const rect = cardWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    
    // Normalize coordinates (-0.5 to 0.5)
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    // Rotate values (max 12 degrees)
    const rotateX = normY * -12;
    const rotateY = normX * 12;
    
    // Apply opposite parallax translations to texts/graphics inside the card for depth
    const posterTitle = card.querySelector('.poster-main-title');
    const posterTopRight = card.querySelector('.poster-top-right');
    const posterBottomRight = card.querySelector('.poster-bottom-right');
    
    // Quick transition for responsive mouse tracking
    card.style.transition = 'transform 0.08s cubic-bezier(0.25, 1, 0.5, 1)';
    if (posterTitle) posterTitle.style.transition = 'transform 0.08s cubic-bezier(0.25, 1, 0.5, 1)';
    if (posterTopRight) posterTopRight.style.transition = 'transform 0.08s cubic-bezier(0.25, 1, 0.5, 1)';
    if (posterBottomRight) posterBottomRight.style.transition = 'transform 0.08s cubic-bezier(0.25, 1, 0.5, 1)';

    // Apply transform to card
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    if (posterTitle) posterTitle.style.transform = `translate3d(${normX * -15}px, ${normY * -15}px, 20px)`;
    if (posterTopRight) posterTopRight.style.transform = `translate3d(${normX * -8}px, ${normY * -8}px, 10px)`;
    if (posterBottomRight) posterBottomRight.style.transform = `translate3d(${normX * -10}px, ${normY * -10}px, 10px)`;
    
    // Track cursor for spotlight effects
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  });

  cardWrapper.addEventListener('mouseleave', () => {
    isMoving = false;
    
    const posterTitle = card.querySelector('.poster-main-title');
    const posterTopRight = card.querySelector('.poster-top-right');
    const posterBottomRight = card.querySelector('.poster-bottom-right');

    // Smooth, slow reset transitions (no snap)
    card.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    if (posterTitle) posterTitle.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    if (posterTopRight) posterTopRight.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    if (posterBottomRight) posterBottomRight.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';

    // Reset positions slowly and elegantly
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (posterTitle) posterTitle.style.transform = 'translate3d(0, 0, 0)';
    if (posterTopRight) posterTopRight.style.transform = 'translate3d(0, 0, 0)';
    if (posterBottomRight) posterBottomRight.style.transform = 'translate3d(0, 0, 0)';
  });


  // --- 2. CUSTOM SCROLLBAR INDICATOR ---
  function updateScrollbar() {
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;
    const scrollTop = scrollContainer.scrollTop;
    
    // Calculate ratio of scroll progress
    const scrollPercent = scrollTop / (scrollHeight - clientHeight || 1);
    
    // Calculate thumb height (proportional to visible content)
    const trackHeight = scrollContainer.offsetHeight * 0.8; // 80% track height
    const thumbHeight = Math.max(30, (clientHeight / scrollHeight) * trackHeight);
    
    scrollThumb.style.height = `${thumbHeight}px`;
    
    // Translate thumb vertically
    const maxScroll = trackHeight - thumbHeight;
    const thumbPosition = scrollPercent * maxScroll;
    scrollThumb.style.transform = `translateY(${thumbPosition}px)`;
  }

  // Bind scrollbar updates
  scrollContainer.addEventListener('scroll', updateScrollbar);
  window.addEventListener('resize', updateScrollbar);
  updateScrollbar(); // Init sizing


  // --- 3. LIQUID GLASS SHIMMER ANIMATION ---
  let baseFreqX = 0.015;
  let baseFreqY = 0.015;
  let shimmerTime = 0;

  function animateGlassRefraction() {
    shimmerTime += 0.01;
    
    // Modulate base frequencies subtly with sine waves
    const currentX = baseFreqX + Math.sin(shimmerTime) * 0.002;
    const currentY = baseFreqY + Math.cos(shimmerTime * 0.8) * 0.002;
    
    if (turbulence) {
      turbulence.setAttribute('baseFrequency', `${currentX} ${currentY}`);
    }
    requestAnimationFrame(animateGlassRefraction);
  }
  animateGlassRefraction();




  // --- PRESSURE-SENSITIVE VARIABLE TYPOGRAPHY ---
  const letters = document.querySelectorAll('.pressure-heading span');
  let mousePos = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });

  function updatePressureTypography() {
    letters.forEach(letter => {
      const rect = letter.getBoundingClientRect();
      const letterCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      const dist = Math.sqrt(
        Math.pow(mousePos.x - letterCenter.x, 2) + 
        Math.pow(mousePos.y - letterCenter.y, 2)
      );

      const maxDist = 300;
      const proximity = Math.max(0, Math.min(1, (maxDist - dist) / maxDist));

      // Interpolate wght from 200 to 900 (Mona Sans weight range) and wdth from 75 to 125
      const wght = 200 + (proximity * 700);
      const wdth = 75 + (proximity * 50);

      letter.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}`;
    });
    requestAnimationFrame(updatePressureTypography);
  }

  // Only run if the heading exists on the page
  if (letters.length > 0) {
    updatePressureTypography();
  }
});
