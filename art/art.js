(function () {
  'use strict';
  const qs  = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => [...c.querySelectorAll(s)];

  /* â”€â”€ THEME â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initTheme() {
    const btn  = qs('#artThemeBtn');
    const body = document.body;
    const DARK = 'dark'; const LIGHT = 'light';
    const KEY  = 'art-theme';

    function applyTheme(t) {
      body.setAttribute('data-theme', t);
      localStorage.setItem(KEY, t);
      // No display:none hack â€” it caused scroll-to-top on theme toggle.
      // Modern browsers apply data-theme CSS var changes without any forced reflow.
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

  /* â”€â”€ CURSOR GLOW (premium desktop effect) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€ SCROLL REVEAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initReveal() {
    const els = qsa('.reveal-up');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
    }), { threshold: 0.02, rootMargin: '0px 0px -20px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* â”€â”€ HERO TITLE UNDERLINE TRIGGER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initHeroUnderline() {
    const title = qs('.art-hero-title');
    if (!title) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) title.classList.add('vis'); });
    }, { threshold: 0.3 });
    io.observe(title);
  }

  /* â”€â”€ MOBILE MENU â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* ── SCROLL PROGRESS BAR ───────────────────────────── */
  function initScrollProgress() {

    const bar = qs('#artScrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* â”€â”€ ANIMATED STAT COUNTERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initStatCounters() {
    const stats = qsa('[data-count]');
    if (!stats.length) return;
    const ease = t => 1 - Math.pow(1 - t, 3);
    function animateStat(el) {
      const target = parseInt(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const dur = 1400, start = performance.now();
      // Keep the child .art-stat-plus if present
      const plus = el.querySelector('.art-stat-plus');
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const v = Math.round(ease(p) * target);
        el.childNodes[0].nodeValue = prefix + v;
        if (plus) el.appendChild(plus); // keep + at end
        if (suffix && !el.dataset.suffixAdded) {
          el.childNodes[0].nodeValue = prefix + v + suffix;
        }
        if (p < 1) requestAnimationFrame(tick);
        else el.childNodes[0].nodeValue = prefix + target + (suffix || '');
      }
      requestAnimationFrame(tick);
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateStat(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    stats.forEach(el => io.observe(el));
  }

  /* â”€â”€ GALLERY HOVER PAUSE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  // Exposed as a flag that initGallery reads (set before initGallery runs)
  let _galleryPaused = false;
  function initGalleryPause() {
    const scroller = qs('.art-scroller');
    const wrap = qs('#artGalleryWrap');
    if (!scroller && !wrap) return;
    const el = wrap || scroller;
    el.addEventListener('mouseenter', () => { _galleryPaused = true; });
    el.addEventListener('mouseleave', () => { _galleryPaused = false; });
  }

  /* â”€â”€ ACTIVE NAV LINK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initActiveNav() {
    const links = qsa('.art-nav-link');
    if (!links.length) return;
    const sections = ['gallery','pricing','calculator','process'].map(id => qs('#' + id)).filter(Boolean);
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('art-nav-link--active'));
          const active = links.find(l => l.getAttribute('href') === '#' + e.target.id);
          if (active) active.classList.add('art-nav-link--active');
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => io.observe(s));
  }

  /* â”€â”€ FLOATING WHATSAPP CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initFloatWA() {
    const btn = qs('#artFloatWA');
    const hero = qs('.art-hero');
    if (!btn || !hero) return;
    const io = new IntersectionObserver(entries => {
      // Show button when hero is no longer visible
      btn.classList.toggle('visible', !entries[0].isIntersecting);
    }, { threshold: 0.1 });
    io.observe(hero);
  }

  /* â”€â”€ SLIDER FILLED TRACK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function updateSliderFill(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 1;
    const max = parseFloat(slider.max) || 6;
    const val = parseFloat(slider.value) || min;
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--slider-fill', pct + '%');
  }

  /* â”€â”€ GALLERY CONTINUOUS SCROLL + DRAG (LERP PHYSICS) â”€â”€ */
  function initGallery() {
    const track = qs('.art-track');
    const scroller = qs('.art-scroller');
    if (!track || !scroller) return;

    let cachedLoopWidth = 0;
    function updateLoopWidth() {
      if (track.children.length >= 16) {
        cachedLoopWidth = track.children[8].offsetLeft - track.children[0].offsetLeft;
      } else {
        cachedLoopWidth = track.scrollWidth / 2;
      }
    }
    updateLoopWidth();
    setTimeout(updateLoopWidth, 500);
    window.addEventListener('resize', updateLoopWidth, {passive: true});

    scroller.style.overflow = 'hidden';
    
    let targetOffset = 0;
    let offset = 0;
    let isDragging = false;
    let startX = 0;
    let dragStartOffset = 0;

    function tick() {
      const lw = cachedLoopWidth;
      if (lw > 0) {
        if (!isDragging && !_galleryPaused) {
          targetOffset += 0.35;
        }
        const lerpFactor = isDragging ? 1.0 : 0.07;
        offset += (targetOffset - offset) * lerpFactor;
        if (offset >= lw) { offset -= lw; targetOffset -= lw; dragStartOffset -= lw; }
        else if (offset < 0) { offset += lw; targetOffset += lw; dragStartOffset += lw; }
        track.style.transform = `translate3d(-${offset.toFixed(1)}px, 0, 0)`;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    function startDrag(x) { isDragging = true; startX = x; dragStartOffset = targetOffset; scroller.style.cursor = 'grabbing'; }
    function moveDrag(x) { if (!isDragging) return; const delta = (startX - x) * (window.innerWidth <= 768 ? 2.0 : 1.5); targetOffset = dragStartOffset + delta; }
    function endDrag() { isDragging = false; scroller.style.cursor = 'grab'; }

    scroller.addEventListener('mousedown', e => { e.preventDefault(); startDrag(e.pageX); });
    window.addEventListener('mousemove', e => moveDrag(e.pageX));
    window.addEventListener('mouseup', endDrag);
    scroller.addEventListener('mouseleave', endDrag);
    scroller.addEventListener('touchstart', e => startDrag(e.touches[0].pageX), {passive: true});
    window.addEventListener('touchmove', e => moveDrag(e.touches[0].pageX), {passive: true});
    window.addEventListener('touchend', endDrag);
    window.addEventListener('touchcancel', endDrag);
  }

  /* â”€â”€ PRICE CALCULATOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
    if (!sliderEl) return;

    let size  = 'a4';
    let faces = 2;
    let frame = false;
    let curRaw = 2200;

    const INR = n => '\u20B9' + n.toLocaleString('en-IN');

    function calcPrice() {
      let base = 0;
      if (size === 'a5') {
        faces = 1; sliderEl.value = 1; sliderEl.disabled = true;
        base = 1000;
        if (faceNote) faceNote.textContent = 'A5 size: 1 face only.';
        if (frameHint) frameHint.textContent = '+\u20B9150';
      } else if (size === 'a4') {
        faces = Math.min(faces, 2); sliderEl.disabled = false;
        if (sliderEl.value > 2) sliderEl.value = 2;
        base = faces === 1 ? 1400 : 2200;
        if (faceNote) faceNote.textContent = 'A4 size: maximum 2 faces.';
        if (frameHint) frameHint.textContent = '+\u20B9250';
      } else {
        faces = Math.min(faces, 6); sliderEl.max = 6; sliderEl.disabled = false;
        if (parseInt(sliderEl.value) > 6) sliderEl.value = 6;
        base = 2000 + (faces - 1) * 700;
        if (faceNote) faceNote.textContent = 'A3 size: maximum 6 faces.';
        if (frameHint) frameHint.textContent = '+\u20B9500';
      }
      updateSliderFill(sliderEl);
      const lbl = faces === 1 ? '1 Face' : faces + ' Faces';
      if (faceDisp) faceDisp.textContent = lbl;
      const frameAmt = frame ? (size === 'a5' ? 150 : size === 'a4' ? 250 : 500) : 0;
      const total    = base + frameAmt;
      if (bBase)      bBase.textContent = INR(base);
      if (bBaseLabel) bBaseLabel.textContent = 'Base price (' + size.toUpperCase() + ', ' + faces + ' face' + (faces > 1 ? 's' : '') + ')';
      if (lineFrame)  lineFrame.style.display = frame ? 'flex' : 'none';
      if (bFrame)     bFrame.textContent = INR(frameAmt);
      if (calcBtnPr)  calcBtnPr.textContent = INR(total);
      animateCount(curRaw, total); curRaw = total;
      if (orderBtn) {
        const msg = encodeURIComponent('Hi! I want to order: ' + size.toUpperCase() + ' portrait, ' + faces + ' face' + (faces > 1 ? 's' : '') + (frame ? ', with frame' : '') + '. Estimated total: ' + INR(total));
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
        const p = Math.min((now - start) / dur, 1);
        calcTotal.textContent = INR(Math.round(from + (to - from) * ease(p)));
        if (p < 1) requestAnimationFrame(frame_);
      }
      requestAnimationFrame(frame_);
    }

    [sizeA5, sizeA4, sizeA3].forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        size = btn.dataset.size;
        [sizeA5, sizeA4, sizeA3].forEach(b => b && b.classList.remove('art-size-btn--active'));
        btn.classList.add('art-size-btn--active');
        calcPrice();
      });
    });

    sliderEl.addEventListener('input', () => {
      let val = parseInt(sliderEl.value);
      if (size === 'a5') { val = 1; sliderEl.value = 1; }
      else if (size === 'a4' && val > 2) { val = 2; sliderEl.value = 2; }
      else if (size === 'a3' && val > 6) { val = 6; sliderEl.value = 6; }
      faces = val;
      const lbl = faces >= 6 ? '6 Faces' : faces + (faces === 1 ? ' Face' : ' Faces');
      if (faceDisp) faceDisp.textContent = lbl;
      updateSliderFill(sliderEl);
      calcPrice();
    });

    const frameWrap = qs('#frameWrapLabel');
    if (frameChk) {
      frameChk.addEventListener('change', () => {
        frame = frameChk.checked;
        if (frameWrap) frameWrap.classList.toggle('frame-active', frame);
        calcPrice();
      });
    }

    updateSliderFill(sliderEl); // init fill
    calcPrice();
  }

  /* â”€â”€ INIT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function init() {
    initTheme();
    initCursorGlow();
    initReveal();
    initHeroUnderline();
    initMenu();
    initScroll();
    initNavScroll();
    initScrollProgress();
    initStatCounters();
    initGalleryPause();
    initGallery();
    initActiveNav();
    initFloatWA();
    initCalculator();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
