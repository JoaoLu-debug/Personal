document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const cardWrapper = document.getElementById('card-wrapper');
  const card = document.getElementById('portfolio-card');
  const scrollContainer = document.getElementById('scroll-container');
  const scrollThumb = document.getElementById('scrollbar-thumb');
  const turbulence = document.querySelector('#liquid-glass-filter feTurbulence');
  


  // --- 1. 3D TILT & PARALLAX EFFECT ---
  let isMoving = false;

  function onPointerMove(clientX, clientY) {
    isMoving = true;
    const rect = cardWrapper.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
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
  }

  function onPointerLeave() {
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
  }

  // Mouse Listeners
  cardWrapper.addEventListener('mousemove', (e) => {
    onPointerMove(e.clientX, e.clientY);
  });

  cardWrapper.addEventListener('mouseleave', () => {
    onPointerLeave();
  });

  // Touch Listeners
  cardWrapper.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  cardWrapper.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  cardWrapper.addEventListener('touchend', () => {
    onPointerLeave();
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
    if (window.innerWidth <= 768) return; // Disable on mobile to save GPU
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
  let mousePos = { x: -9999, y: -9999 }; // Default far off-screen so letters start condensed

  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });

  // Track touches globally for typography pressure
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      mousePos.x = e.touches[0].clientX;
      mousePos.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      mousePos.x = e.touches[0].clientX;
      mousePos.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mousePos.x = -9999;
    mousePos.y = -9999;
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

  // --- 4. ASYNC FORM SUBMISSION (AJAX / FETCH) & MODAL FEEDBACK ---
  const budgetForm = document.getElementById('budget-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const modalOverlay = document.getElementById('feedback-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalActionBtn = document.getElementById('modal-action-btn');
  const modalIconContainer = document.getElementById('modal-icon-container');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');

  function openModal({ type, title, message, buttonText }) {
    if (!modalOverlay) return;

    modalIconContainer.className = `modal-icon-wrapper ${type}`;
    if (type === 'success') {
      modalIconContainer.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else {
      modalIconContainer.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
    }

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalActionBtn.textContent = buttonText;

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalActionBtn) modalActionBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  if (budgetForm) {
    budgetForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!budgetForm.checkValidity()) {
        budgetForm.reportValidity();
        return;
      }

      const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
      const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;

      // Loading state
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-flex';

      const payload = {
        nome: budgetForm.querySelector('[name="nome"]')?.value || '',
        email: budgetForm.querySelector('[name="email"]')?.value || '',
        telefone: budgetForm.querySelector('[name="telefone"]')?.value || 'Não informado',
        mensagem: budgetForm.querySelector('[name="mensagem"]')?.value || '',
        _captcha: "false",
        _subject: "Novo Pedido de Orçamento - Ergo Web",
        _template: "table"
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/ergosites.web@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && (data.success === "true" || data.success === true)) {
          budgetForm.reset();
          openModal({
            type: 'success',
            title: 'Solicitação Enviada!',
            message: 'Recebemos seu pedido de orçamento com sucesso! Entraremos em contato em breve.',
            buttonText: 'Entendido'
          });
        } else if (data.message && data.message.toLowerCase().includes('activation')) {
          openModal({
            type: 'error',
            title: 'Confirmação no Gmail Necessária',
            message: 'O FormSubmit enviou um e-mail com o assunto "Activate Form" para ergosites.web@gmail.com. Clique no link do e-mail uma única vez para liberar o recebimento de mensagens!',
            buttonText: 'Entendido'
          });
        } else {
          throw new Error(data.message || `Status ${response.status}`);
        }
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        openModal({
          type: 'error',
          title: 'Falha no Envio',
          message: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.',
          buttonText: 'Tentar Novamente'
        });
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }
});
