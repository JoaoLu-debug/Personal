document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const cardWrapper = document.getElementById('card-wrapper');
  const card = document.getElementById('portfolio-card');
  const scrollContainer = document.getElementById('scroll-container');
  const scrollThumb = document.getElementById('scrollbar-thumb');
  const turbulence = document.querySelector('#liquid-glass-filter feTurbulence');
  
  // Synth UI Elements
  const synthToggle = document.getElementById('synth-toggle');
  const btnText = document.getElementById('btn-text');
  const scopeCanvas = document.getElementById('scope-canvas');
  const scopeFallback = document.getElementById('scope-fallback');
  const sliderFreq = document.getElementById('slider-freq');
  const sliderLfo = document.getElementById('slider-lfo');
  const sliderQ = document.getElementById('slider-q');
  
  const valFreq = document.getElementById('val-freq');
  const valLfo = document.getElementById('val-lfo');
  const valQ = document.getElementById('val-q');

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
    
    // Apply transform to card
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Apply opposite parallax translations to texts/graphics inside the card for depth
    const posterTitle = card.querySelector('.poster-main-title');
    const posterTopRight = card.querySelector('.poster-top-right');
    const posterBottomRight = card.querySelector('.poster-bottom-right');
    
    if (posterTitle) posterTitle.style.transform = `translate3d(${normX * -15}px, ${normY * -15}px, 20px)`;
    if (posterTopRight) posterTopRight.style.transform = `translate3d(${normX * -8}px, ${normY * -8}px, 10px)`;
    if (posterBottomRight) posterBottomRight.style.transform = `translate3d(${normX * -10}px, ${normY * -10}px, 10px)`;
    
    // Track cursor for spotlight effects
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  });

  cardWrapper.addEventListener('mouseleave', () => {
    isMoving = false;
    // Smooth reset
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    
    const posterTitle = card.querySelector('.poster-main-title');
    const posterTopRight = card.querySelector('.poster-top-right');
    const posterBottomRight = card.querySelector('.poster-bottom-right');
    
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


  // --- 4. WEB AUDIO AMBIENT SYNTHESIZER ---
  let audioCtx = null;
  let synthActive = false;
  let osc1 = null;
  let osc2 = null;
  let lfo = null;
  let lfoGain = null;
  let biquadFilter = null;
  let delayNode = null;
  
  // Feedback nodes for spatial depth
  let delayFeedback = null;
  let masterGain = null;
  let analyser = null;
  let dataArray = null;
  let scopeCtx = scopeCanvas.getContext('2d');
  let animationFrameId = null;

  // Initialize Web Audio pipeline
  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Oscillators (Detuned for rich chorus texture)
    osc1 = audioCtx.createOscillator();
    osc2 = audioCtx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    
    // Low frequencies for a deep drone
    osc1.frequency.value = 55; // A1
    osc2.frequency.value = 55.4; // Slightly detuned
    
    // Filter (Cutoff modulated by sliders and LFO)
    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = 'lowpass';
    biquadFilter.frequency.value = parseFloat(sliderFreq.value);
    biquadFilter.Q.value = parseFloat(sliderQ.value);
    
    // Low Frequency Oscillator (Wobble modulation)
    lfo = audioCtx.createOscillator();
    lfoGain = audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = parseFloat(sliderLfo.value);
    lfoGain.gain.value = 350; // Pitch/cutoff modulation depth
    
    // Connect LFO to filter frequency
    lfo.connect(lfoGain);
    lfoGain.connect(biquadFilter.frequency);
    
    // Space Delay Line
    delayNode = audioCtx.createDelay(1.0);
    delayFeedback = audioCtx.createGain();
    
    delayNode.delayTime.value = 0.45; // 450ms delay
    delayFeedback.gain.value = 0.45;  // Feedback gain
    
    // Master Volume
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0; // Start silent for fade-in
    
    // Analyser Node for visualizer
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    // CONNECTIONS:
    // Oscillators -> Filter -> Master Gain -> Destination
    osc1.connect(biquadFilter);
    osc2.connect(biquadFilter);
    
    // Feed filter to delay loop
    biquadFilter.connect(delayNode);
    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode); // feedback loop
    
    // Mix dry (filter) and wet (delay) outputs
    biquadFilter.connect(masterGain);
    delayNode.connect(masterGain);
    
    // Gain to analyser & speakers
    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
    
    // Start sound generation
    osc1.start();
    osc2.start();
    lfo.start();
  }

  // Draw oscilloscope output to Canvas
  function drawOscilloscope() {
    if (!synthActive) return;
    
    animationFrameId = requestAnimationFrame(drawOscilloscope);
    analyser.getByteTimeDomainData(dataArray);
    
    // Retro phosphor trailing glow clear
    scopeCtx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    scopeCtx.fillRect(0, 0, scopeCanvas.width, scopeCanvas.height);
    
    scopeCtx.lineWidth = 2.5;
    
    // Color linked to filter frequency value
    const freqRatio = (parseFloat(sliderFreq.value) - 80) / 2420;
    const gColor = Math.floor(100 + freqRatio * 155);
    scopeCtx.strokeStyle = `rgb(0, ${gColor}, 255)`;
    scopeCtx.shadowBlur = 8;
    scopeCtx.shadowColor = `rgba(0, ${gColor}, 255, 0.5)`;
    
    scopeCtx.beginPath();
    
    const sliceWidth = scopeCanvas.width * 1.0 / dataArray.length;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * scopeCanvas.height / 2;
      
      if (i === 0) {
        scopeCtx.moveTo(x, y);
      } else {
        scopeCtx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    scopeCtx.lineTo(scopeCanvas.width, scopeCanvas.height / 2);
    scopeCtx.stroke();
    scopeCtx.shadowBlur = 0; // reset
  }

  // Toggle Audio Engine
  function toggleSynth() {
    if (!synthActive) {
      // Start Synth
      synthActive = true;
      synthToggle.classList.add('active');
      btnText.textContent = 'MUTE AUDIO ENGINE';
      scopeFallback.style.opacity = '0';
      
      // Enable slider inputs
      sliderFreq.removeAttribute('disabled');
      sliderLfo.removeAttribute('disabled');
      sliderQ.removeAttribute('disabled');
      
      if (!audioCtx) {
        initAudio();
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      // Linear fade-in to prevent initial speaker clicks
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.3);
      
      // Sync Canvas sizing and start drawing
      resizeCanvas();
      drawOscilloscope();
    } else {
      // Mute Synth
      synthActive = false;
      synthToggle.classList.remove('active');
      btnText.textContent = 'INITIALIZE AUDIO PATCH';
      scopeFallback.style.opacity = '1';
      
      // Disable inputs
      sliderFreq.setAttribute('disabled', 'true');
      sliderLfo.setAttribute('disabled', 'true');
      sliderQ.setAttribute('disabled', 'true');
      
      if (masterGain && audioCtx) {
        // Fast fade-out
        masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
        setTimeout(() => {
          if (!synthActive && audioCtx) {
            audioCtx.suspend();
          }
        }, 200);
      }
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    }
  }

  // Slider adjustments handlers
  sliderFreq.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valFreq.textContent = `${val} Hz`;
    
    if (biquadFilter && audioCtx) {
      // Smooth parameter transition (ramping) to avoid audio pops
      biquadFilter.frequency.setTargetAtTime(val, audioCtx.currentTime, 0.05);
    }
  });

  sliderLfo.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valLfo.textContent = `${val} Hz`;
    
    if (lfo && audioCtx) {
      lfo.frequency.setTargetAtTime(val, audioCtx.currentTime, 0.05);
    }
    
    // DYNAMIC INTERACTION SYNERGY:
    // Speed up background fluid blobs animations relative to LFO speed
    const baseSpeed1 = 25;
    const baseSpeed2 = 30;
    const baseSpeed3 = 20;
    
    // Scale speed: high speed value = short animation duration
    const scaleFactor = 3 / val; // LFO default is 3
    
    document.documentElement.style.setProperty('--blob-speed-1', `${baseSpeed1 * scaleFactor}s`);
    document.documentElement.style.setProperty('--blob-speed-2', `${baseSpeed2 * scaleFactor}s`);
    document.documentElement.style.setProperty('--blob-speed-3', `${baseSpeed3 * scaleFactor}s`);
  });

  sliderQ.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valQ.textContent = val.toFixed(1);
    
    if (biquadFilter && audioCtx) {
      biquadFilter.Q.setTargetAtTime(val, audioCtx.currentTime, 0.05);
    }
  });

  // Keep Canvas resolution matching container size
  function resizeCanvas() {
    if (scopeCanvas) {
      scopeCanvas.width = scopeCanvas.clientWidth;
      scopeCanvas.height = scopeCanvas.clientHeight;
    }
  }
  

  window.addEventListener('resize', resizeCanvas);
  synthToggle.addEventListener('click', toggleSynth);
});
