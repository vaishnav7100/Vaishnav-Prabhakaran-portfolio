(function () {
  'use strict';
  const qs  = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => [...c.querySelectorAll(s)];

  /* ── THEME ─────────────────────────────────────────── */
  function initTheme() {
    const btn  = qs('#artThemeBtn');
    const body = document.body;
    const DARK = 'dark'; const LIGHT = 'light';
    const KEY  = 'art-theme';

    function applyTheme(t) {
      body.setAttribute('data-theme', t);
      localStorage.setItem(KEY, t);
      
      // Force synchronous repaint to fix iOS/WebKit bug where CSS vars don't update until scroll
      const y = window.scrollY;
      body.style.display = 'none';
      body.offsetHeight; // force reflow
      body.style.display = '';
      window.scrollTo(0, y);
    }
    // Load saved or default dark
    const saved = localStorage.getItem(KEY) || DARK;
    applyTheme(saved);

    if (btn) {
      btn.addEventListener('click', () => {
        const cur = body.getAttribute('data-theme');
        applyTheme(cur === DARK ? LIGHT : DARK);
      });
    }
  }

  /* ── CURSOR GLOW (premium desktop effect) ──────────── */
  function initCursorGlow() {
    const glow = qs('#artCursorGlow');
    if (!glow || window.matchMedia('(pointer:coarse)').matches) {
      if (glow) glow.style.display = 'none'; return;
    }
    let mx = -999, my = -999, cx = -999, cy = -999;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function tick() {
      cx += (mx - cx) * 0.10;
      cy += (my - cy) * 0.10;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(tick);
    })();
  }

  /* ── SCROLL REVEAL ─────────────────────────────────── */
  function initReveal() {
    const els = qsa('.reveal-up');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
    }), { threshold: 0.02, rootMargin: '0px 0px -20px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ── HERO TITLE UNDERLINE TRIGGER ──────────────────── */
  function initHeroUnderline() {
    const title = qs('.art-hero-title');
    if (!title) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) title.classList.add('vis'); });
    }, { threshold: 0.3 });
    io.observe(title);
  }

  /* ── MOBILE MENU ───────────────────────────────────── */
  function initMenu() {
    const btn   = qs('#artMenuBtn');
    const close = qs('#artMenuClose');
    const menu  = qs('#artMobileMenu');
    const links = qsa('.art-mobile-link');
    if (!btn || !menu) return;
    const open_  = () => { menu.classList.add('open'); menu.removeAttribute('aria-hidden'); document.body.style.overflow = 'hidden'; };
    const close_ = () => { menu.classList.remove('open'); menu.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; };
    btn.addEventListener('click', open_);
    if (close) close.addEventListener('click', close_);
    links.forEach(l => l.addEventListener('click', close_));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close_(); });
  }

  /* ── SMOOTH SCROLL ─────────────────────────────────── */
  function initScroll() {
    qsa('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const el = qs(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  }

  /* ── STICKY NAV SCROLL EFFECT ──────────────────────── */
  function initNavScroll() {
    const nav = qs('#artNav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 20
        ? '0 4px 24px rgba(0,0,0,.12)'
        : 'none';
    }, { passive: true });
  }

  /* ── GALLERY CONTINUOUS SCROLL + DRAG + MOMENTUM ── */
  function initGallery() {
    const track = qs('.art-track');
    const scroller = qs('.art-scroller');
    if (!track || !scroller) return;

    let offset = 0;
    let rafId = null;
    let baseSpeed = 0.8; 
    let velocity = baseSpeed;
    
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let currentDragOffset = 0;
    let lastTime = 0;
    
    function getLoopWidth() {
      if (track.children.length >= 16) {
        return track.children[8].offsetLeft - track.children[0].offsetLeft;
      }
      return track.scrollWidth / 2;
    }

    function tick() {
      const lw = getLoopWidth();
      if (lw <= 0) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      
      if (!isDragging) {
        // Friction: velocity slowly returns to baseSpeed
        velocity += (baseSpeed - velocity) * 0.04;
        offset += velocity;
      }
      
      // Loop seamlessly
      if (offset >= lw) offset -= lw;
      if (offset < 0) offset += lw;
      
      track.style.transform = `translate3d(-${offset}px, 0, 0)`;
      rafId = requestAnimationFrame(tick);
    }
    
    rafId = requestAnimationFrame(tick);

    function startDrag(x) {
      isDragging = true;
      startX = x;
      lastX = x;
      currentDragOffset = offset;
      scroller.style.cursor = 'grabbing';
      velocity = 0;
      lastTime = performance.now();
    }
    
    function moveDrag(x) {
      if (!isDragging) return;
      
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      lastTime = now;
      
      const multiplier = window.innerWidth <= 768 ? 2.2 : 1.2;
      const deltaX = (startX - x) * multiplier;
      offset = currentDragOffset + deltaX;
      
      // Calculate velocity for momentum (pixels per frame approx)
      const moveDelta = (lastX - x) * multiplier;
      velocity = (moveDelta / dt) * 16; // Normalize to 60fps
      lastX = x;
    }
    
    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      scroller.style.cursor = 'grab';
      
      // Cap max momentum to prevent crazy spinning
      if (velocity > 45) velocity = 45;
      if (velocity < -45) velocity = -45;
    }

    // Desktop Mouse Events
    scroller.addEventListener('mousedown', (e) => startDrag(e.pageX));
    window.addEventListener('mousemove', (e) => { if (isDragging) moveDrag(e.pageX); });
    window.addEventListener('mouseup', endDrag);
    scroller.addEventListener('mouseleave', endDrag); // if mouse leaves scroller while not dragging, no-op; if dragging, ends drag safely

    // Mobile Touch Events
    scroller.addEventListener('touchstart', (e) => startDrag(e.touches[0].pageX), {passive: true});
    window.addEventListener('touchmove', (e) => { if (isDragging) moveDrag(e.touches[0].pageX); }, {passive: true});
    window.addEventListener('touchend', endDrag);
    window.addEventListener('touchcancel', endDrag);
  }

  /* ── PRICE CALCULATOR ──────────────────────────────── */
  function initCalculator() {
    const sliderEl    = qs('#faceSlider');
    const faceDisp    = qs('#faceDisplay');
    const faceNote    = qs('#faceNote');
    const sizeA5      = qs('#sizeA5');
    const sizeA4      = qs('#sizeA4');
    const sizeA3      = qs('#sizeA3');
    const frameChk    = qs('#frameToggle');
    const frameHint   = qs('#frameHint');
    const calcTotal   = qs('#calcTotal');
    const bBase       = qs('#bBase');
    const bBaseLabel  = qs('#bBaseLabel');
    const bFrame      = qs('#bFrame');
    const lineFrame   = qs('#lineFrame');
    const calcBtnPr   = qs('#calcBtnPrice');
    const orderBtn    = qs('#calcOrderBtn');
    const frameLblWrap= qs('#frameLabelWrap');
    if (!sliderEl) return;

    let size  = 'a4';
    let faces = 2;
    let frame = false;
    let curRaw = 1600;

    const INR = n => '\u20B9' + n.toLocaleString('en-IN');

    function calcPrice() {
      let base = 0;
      if (size === 'a5') {
        // A5: 1 face only, Rs.600
        faces = 1;
        sliderEl.value = 1;
        sliderEl.disabled = true;
        base = 600;
        if (faceNote) faceNote.textContent = 'A5 size: 1 face only.';
        if (frameHint) frameHint.textContent = '+\u20B9150';
      } else if (size === 'a4') {
        faces = Math.min(faces, 2);
        sliderEl.disabled = false;
        if (sliderEl.value > 2) sliderEl.value = 2;
        base = faces === 1 ? 1000 : 1600;
        if (faceNote) faceNote.textContent = 'A4 size: maximum 2 faces.';
        if (frameHint) frameHint.textContent = '+\u20B9250';
      } else {
        // A3
        sliderEl.disabled = false;
        base = 900 + faces * 600;
        if (faceNote) faceNote.textContent = 'A3 size: no face limit.';
        if (frameHint) frameHint.textContent = '+\u20B9500';
      }

      // Update label to reflect any constraint changes
      const lbl = faces >= 6 ? '6+ Faces' : faces + (faces === 1 ? ' Face' : ' Faces');
      if (faceDisp) faceDisp.textContent = lbl;

      // Frame addon
      const frameAmt = frame ? (size === 'a5' ? 150 : size === 'a4' ? 250 : 500) : 0;
      const total    = base + frameAmt;

      // UI updates
      if (bBase)      bBase.textContent = INR(base);
      if (bBaseLabel) bBaseLabel.textContent = 'Base price (' + size.toUpperCase() + ', ' + faces + ' face' + (faces > 1 ? 's' : '') + ')';
      if (lineFrame)  lineFrame.style.display = frame ? 'flex' : 'none';
      if (bFrame)     bFrame.textContent = INR(frameAmt);
      if (calcBtnPr)  calcBtnPr.textContent = INR(total);

      // Animate total
      animateCount(curRaw, total);
      curRaw = total;

      // WA link
      if (orderBtn) {
        const msg = encodeURIComponent(
          'Hi! I want to order: ' + size.toUpperCase() + ' portrait, ' +
          faces + ' face' + (faces > 1 ? 's' : '') +
          (frame ? ', with frame' : '') + '. Estimated total: ' + INR(total)
        );
        orderBtn.href = 'https://wa.me/918078461246?text=' + msg;
      }
    }

    function animateCount(from, to) {
      if (!calcTotal) return;
      const dur = 550, start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      calcTotal.classList.add('bump');
      setTimeout(() => calcTotal.classList.remove('bump'), 200);
      function frame_(now) {
        const p  = Math.min((now - start) / dur, 1);
        const v  = Math.round(from + (to - from) * ease(p));
        calcTotal.textContent = INR(v);
        if (p < 1) requestAnimationFrame(frame_);
      }
      requestAnimationFrame(frame_);
    }

    // Size buttons
    [sizeA5, sizeA4, sizeA3].forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        size = btn.dataset.size;
        [sizeA5, sizeA4, sizeA3].forEach(b => b && b.classList.remove('art-size-btn--active'));
        btn.classList.add('art-size-btn--active');
        calcPrice();
      });
    });

    // Slider
    sliderEl.addEventListener('input', () => {
      let val = parseInt(sliderEl.value);
      if (size === 'a5') { val = 1; sliderEl.value = 1; }
      else if (size === 'a4' && val > 2) { val = 2; sliderEl.value = 2; }
      faces = val;
      const lbl = faces >= 6 ? '6+ Faces' : faces + (faces === 1 ? ' Face' : ' Faces');
      if (faceDisp) faceDisp.textContent = lbl;
      calcPrice();
    });

    // Frame toggle
    if (frameChk) {
      frameChk.addEventListener('change', () => {
        frame = frameChk.checked;
        if (frameLblWrap) frameLblWrap.classList.toggle('frame-on', frame);
        calcPrice();
      });
    }

    calcPrice(); // init
  }

  /* ── INIT ──────────────────────────────────────────── */
  function init() {
    initTheme();
    initCursorGlow();
    initReveal();
    initHeroUnderline();
    initMenu();
    initScroll();
    initNavScroll();
    initGallery();
    initCalculator();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
