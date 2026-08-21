(function () {
  'use strict';

  const qs  = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => [...c.querySelectorAll(s)];

  /* ── SCROLL REVEAL ─────────────────────────────────── */
  function initReveal() {
    const els = qsa('.reveal-up');
    if (!els.length) return;

    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.02, rootMargin: '0px 0px -20px 0px' }
    );
    els.forEach(el => io.observe(el));

    // Trigger hero entrance animation smoothly on load
  }

  /* ── COUNTER ANIMATION ─────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1100, start = performance.now();
    (function tick(now) {
      const prog = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (prog < 1) requestAnimationFrame(tick);
    })(start);
  }

  function initCounters() {
    const els = qsa('.stat-val[data-count]');
    if (!els.length) return;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
      }),
      { threshold: 0.5 }
    );
    els.forEach(el => io.observe(el));
  }

  /* ── MENU OVERLAY ──────────────────────────────────── */
  function initMenu() {
    const btn     = qs('#menuBtn');
    const closeBtn= qs('#menuCloseBtn');
    const overlay = qs('#menuOverlay');
    const links   = qsa('.menu-link');
    if (!btn || !overlay) return;

    function open() {
      overlay.classList.add('open');
      overlay.removeAttribute('aria-hidden');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      links.forEach((l, i) => l.style.transitionDelay = `${0.04 + i * 0.04}s`);
    }
    function close() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      links.forEach(l => l.style.transitionDelay = '');
    }

    btn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    links.forEach(l => l.addEventListener('click', close));
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
  }

  /* ── ACCORDION ─────────────────────────────────────── */
  function initAccordion() {
    const triggers = qsa('.acc-trigger');
    if (!triggers.length) return;
    triggers.forEach(t => {
      const bodyId = t.getAttribute('aria-controls');
      const body = qs('#' + bodyId);
      if (!body) return;
      t.addEventListener('click', () => {
        const open = t.getAttribute('aria-expanded') === 'true';
        // close all
        triggers.forEach(x => {
          x.setAttribute('aria-expanded', 'false');
          const b = qs('#' + x.getAttribute('aria-controls'));
          if (b) b.classList.remove('open');
        });
        // toggle this one
        if (!open) {
          t.setAttribute('aria-expanded', 'true');
          body.classList.add('open');
        }
      });
    });
  }

  /* ── RESUME MODAL ──────────────────────────────────── */
  function initResume() {
    const modal    = qs('#resumeModal');
    const closeBtn = qs('#resumeCloseBtn');
    const iframe   = qs('#resumeIframe');
    const loading  = qs('#resumeLoading');
    const triggers = qsa('#heroResumeBtn, #aboutResumeBtn, #menuResumeBtn, #footerResumeBtn');
    if (!modal) return;

    let loaded = false;

    function open() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (!loaded && iframe) {
        iframe.src = iframe.dataset.src;
        loaded = true;
        if (loading) loading.style.display = 'flex';
        iframe.addEventListener('load', () => { if (loading) loading.style.display = 'none'; }, { once: true });
      }
    }
    function close() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    triggers.forEach(b => b.addEventListener('click', e => { e.preventDefault(); open(); }));
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  }

  /* ── CONTACT FORM ──────────────────────────────────── */
  function initForm() {
    const form     = qs('#contactForm');
    const btn      = qs('#submitBtn');
    const okEl     = qs('#formSuccess');
    const sModal   = qs('#successModal');
    const closeBtn = qs('#closeModal');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name  = qs('#cf-name', form);
      const email = qs('#cf-email', form);
      const msg   = qs('#cf-message', form);
      let valid = true;

      [name, email, msg].forEach(f => {
        if (!f?.value.trim()) { markError(f); valid = false; }
        else clearError(f);
      });
      if (email && !isEmail(email.value)) { markError(email); valid = false; }
      if (!valid) return;

      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const fd = new FormData(form);
        const res = await fetch('https://formspree.io/f/xpwrnpzk', {
          method: 'POST', body: fd, headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          if (okEl) okEl.classList.add('show');
          if (sModal) { sModal.classList.add('open'); document.body.style.overflow = 'hidden'; }
          setTimeout(() => okEl?.classList.remove('show'), 5000);
        } else { throw new Error('fail'); }
      } catch {
        window.location.href =
          `mailto:vaishnavprabhakaran@gmail.com?subject=Portfolio%20Inquiry&body=${encodeURIComponent(msg?.value || '')}`;
      } finally {
        btn.textContent = orig;
        btn.disabled = false;
      }
    });

    if (closeBtn && sModal) {
      closeBtn.addEventListener('click', () => { sModal.classList.remove('open'); document.body.style.overflow = ''; });
      sModal.addEventListener('click', e => { if (e.target === sModal) { sModal.classList.remove('open'); document.body.style.overflow = ''; } });
    }
  }

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function markError(el) {
    if (!el) return;
    el.style.borderColor = '#EF4444';
    el.style.boxShadow = '0 0 0 3px rgba(239,68,68,.14)';
    setTimeout(() => clearError(el), 2000);
    el.focus();
  }
  function clearError(el) {
    if (!el) return;
    el.style.borderColor = '';
    el.style.boxShadow = '';
  }

  /* ── ACTIVE NAV LINK ───────────────────────────────── */
  function initActiveNav() {
    const sections = qsa('section[id]');
    const links = qsa('.nav-link');
    if (!sections.length || !links.length) return;

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            links.forEach(l => l.classList.remove('active'));
            const a = qs(`.nav-link[href="#${e.target.id}"]`);
            if (a) a.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(s => io.observe(s));
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

  /* ── THEME TOGGLE ─────────────────────────────────── */
  function initTheme() {
    const toggleBtn = qs('#themeToggle');
    const storedTheme = localStorage.getItem('theme');

    const initialTheme = storedTheme || 'light';
    setTheme(initialTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
      });
    }
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  /* ── ART COMMISSIONS GALLERY ──────────────────────── */
  function initCommissions() {
    const track = qs('#scrollerTrack');
    if (!track) return;

    // The CSS keyframe animation handles the auto-scroll.
    // We enhance it with a scroll-driven parallax offset.
    let lastScrollY = window.scrollY;
    let parallaxOffset = 0;
    let targetOffset = 0;
    let rafId = null;
    const SPEED = 0.06;       // lerp factor — lower = smoother
    const SCROLL_FACTOR = 0.4; // how much scroll translates to px shift

    function tick() {
      const scrollDelta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      targetOffset += scrollDelta * SCROLL_FACTOR;
      // Lerp toward target
      parallaxOffset += (targetOffset - parallaxOffset) * SPEED;
      // Clamp so it doesn't drift too far
      targetOffset *= 0.92;
      // Apply as an additional CSS variable for the parallax extra push
      track.style.setProperty('--parallax', `${parallaxOffset.toFixed(2)}px`);
      rafId = requestAnimationFrame(tick);
    }

    // Inject the CSS variable into the animation when it's in view
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          lastScrollY = window.scrollY;
          if (!rafId) rafId = requestAnimationFrame(tick);
        } else {
          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        }
      });
    }, { threshold: 0.01 });

    const wrap = qs('#commissionsGalleryWrap');
    if (wrap) io.observe(wrap);

    // Patch the animation to incorporate the parallax offset
    // We do this by updating the animation via a dynamic style injection
    const style = document.createElement('style');
    style.textContent = `
      @keyframes portraitScroll {
        from { transform: translateX(calc(0px + var(--parallax, 0px))); }
        to   { transform: translateX(calc(-50% + var(--parallax, 0px))); }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── INIT ──────────────────────────────────────────── */
  function init() {
    initTheme();
    initReveal();
    initCounters();
    initMenu();
    initAccordion();
    initResume();
    initForm();
    initActiveNav();
    initScroll();
    initCommissions();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();

