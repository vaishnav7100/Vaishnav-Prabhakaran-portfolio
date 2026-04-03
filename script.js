/* ===================================
   VAISHNAV PRABHAKARAN - PORTFOLIO JS
   Advanced Animations & Interactions
   =================================== */

// ===== READING PROGRESS BAR =====
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
});

// ===== HERO PARTICLE CANVAS =====
(function initParticleCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = -1000, mouseY = -1000;
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Mouse attraction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.x += dx * 0.008;
        this.y += dy * 0.008;
        this.alpha = Math.min(this.alpha + 0.02, 0.8);
      } else {
        this.alpha = Math.max(this.alpha - 0.005, 0.1);
      }
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${this.alpha})`;
      ctx.fill();
    }
  }

  const count = Math.min(80, Math.floor(w * h / 12000));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px)) translateZ(0)`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.transform = `translate(calc(-50% + ${followerX}px), calc(-50% + ${followerY}px)) translateZ(0)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .pill, .project-card, .service-card, .skill-category, .faq-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursorFollower.style.width = '50px';
      cursorFollower.style.height = '50px';
      cursorFollower.style.borderColor = 'rgba(168, 85, 247, 0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursorFollower.style.width = '36px';
      cursorFollower.style.height = '36px';
      cursorFollower.style.borderColor = 'rgba(168, 85, 247, 0.5)';
    });
  });
}

// ===== CARD GLOW =====
document.querySelectorAll('.glass-card').forEach(card => {
  let rafId = null;
  let px = -999, py = -999;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    px = e.clientX - rect.left;
    py = e.clientY - rect.top;
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        card.style.setProperty('--glow-x', px + 'px');
        card.style.setProperty('--glow-y', py + 'px');
        rafId = null;
      });
    }
  });
  card.addEventListener('mouseleave', () => {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    card.style.setProperty('--glow-x', '-999px');
    card.style.setProperty('--glow-y', '-999px');
  });
});

// ===== 3D TILT EFFECT =====
document.querySelectorAll('[data-tilt]').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform 0.5s ease';
    setTimeout(() => el.style.transition = '', 500);
  });
});

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== FLOATING HERO PARTICLES =====
(function spawnParticles() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  const colors = ['rgba(168,85,247,0.6)', 'rgba(59,130,246,0.5)', 'rgba(6,182,212,0.5)'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const bottom = Math.random() * 40;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 8;
    p.style.cssText = `width:${size}px;height:${size}px;left:${left}%;bottom:${bottom}%;background:${colors[Math.floor(Math.random() * colors.length)]};animation-duration:${duration}s;animation-delay:-${delay}s;`;
    heroBg.appendChild(p);
  }
})();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinksContainer.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ===== TYPEWRITER =====
const typewriterEl = document.getElementById('typewriter');
const phrases = ['Flutter Developer', 'Web Developer', 'Tech Enthusiast', 'Mobile App Creator', 'AI Integrator', 'Problem Solver'];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typeWriter() {
  const currentPhrase = phrases[phraseIndex];
  if (isDeleting) {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }
  let speed = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === currentPhrase.length) { speed = 2000; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; speed = 400; }
  setTimeout(typeWriter, speed);
}
setTimeout(typeWriter, 800);

// ===== SCROLL ANIMATIONS (data-animate) =====
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const parent = entry.target.closest('.skills-grid, .projects-grid, .services-grid, .process-timeline, .testimonials-track');
      if (parent) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.1}s`;
      }
      entry.target.classList.add('visible');
      animateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el));

// Also observe section headers for the underline animation
document.querySelectorAll('.section-header').forEach(el => {
  if (!el.hasAttribute('data-animate')) {
    animateObserver.observe(el);
  }
});

// ===== SKILL BARS =====
const skillBars = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const width = bar.getAttribute('data-width');
      setTimeout(() => bar.style.width = width + '%', 200);
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(bar => skillObserver.observe(bar));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObserver.observe(el));

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) { shakeForm(); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('email').style.borderColor = '#EF4444';
    document.getElementById('email').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    setTimeout(() => {
      document.getElementById('email').style.borderColor = '';
      document.getElementById('email').style.boxShadow = '';
    }, 2000);
    return;
  }

  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeeu-It7wtXrr4m0XxrnINZAtBLnR9ilIiVQ8eRgR7MCA6tPA/formResponse';
  const formData = new FormData();
  formData.append('entry.2038327349', name);
  formData.append('entry.1180618213', email);
  formData.append('entry.925995251', message);
  formData.append('fvv', '1');
  formData.append('fbzx', '-3241070635628774565');
  formData.append('pageHistory', '0');

  submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
  submitBtn.disabled = true;

  fetch(GOOGLE_FORM_URL, { method: 'POST', body: formData, mode: 'no-cors' }).then(() => {
    contactForm.reset();
    submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    submitBtn.disabled = false;
    const successModal = document.getElementById('successModal');
    if (successModal) successModal.classList.add('active');
    else { formSuccess.classList.add('show'); setTimeout(() => formSuccess.classList.remove('show'), 5000); }
  }).catch((error) => {
    console.error('Error!', error.message);
    submitBtn.innerHTML = '<span>Error! Retry?</span><i class="fas fa-exclamation-circle"></i>';
    submitBtn.disabled = false;
  });
});

function shakeForm() {
  contactForm.style.animation = 'shake 0.4s ease';
  setTimeout(() => contactForm.style.animation = '', 400);
}

// Modal
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');
if (closeModal && successModal) {
  closeModal.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); successModal.classList.remove('active'); });
  successModal.addEventListener('click', (e) => { if (e.target === successModal) successModal.classList.remove('active'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && successModal.classList.contains('active')) successModal.classList.remove('active'); });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== PARALLAX ORBS =====
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');
  if (orb1) orb1.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
  if (orb3) orb3.style.transform = `translate(${x * 0.4}px, ${-y * 0.4}px)`;
});

// ===== HERO ENTRANCE =====
window.addEventListener('load', () => {
  const heroContent = document.querySelector('.hero-content');
  const heroVisual = document.querySelector('.hero-visual');
  if (heroContent) {
    heroContent.style.opacity = '0'; heroContent.style.transform = 'translateX(-40px)';
    setTimeout(() => { heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease'; heroContent.style.opacity = '1'; heroContent.style.transform = 'translateX(0)'; }, 100);
  }
  if (heroVisual) {
    heroVisual.style.opacity = '0'; heroVisual.style.transform = 'translateX(40px)';
    setTimeout(() => { heroVisual.style.transition = 'opacity 0.8s ease, transform 0.8s ease'; heroVisual.style.opacity = '1'; heroVisual.style.transform = 'translateX(0)'; }, 300);
  }
});

// ===== PILL RIPPLE =====
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(168,85,247,0.3);width:10px;height:10px;left:${e.offsetX}px;top:${e.offsetY}px;transform:translate(-50%,-50%) scale(0);animation:rippleEffect 0.5s ease-out forwards;pointer-events:none;`;
    this.style.position = 'relative'; this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// ===== FORM INPUT ANIMATIONS =====
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
  input.addEventListener('focus', function () { this.parentElement.querySelector('label').style.color = '#A855F7'; });
  input.addEventListener('blur', function () { this.parentElement.querySelector('label').style.color = ''; });
});

// Inject keyframes
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
  @keyframes rippleEffect { to{transform:translate(-50%,-50%) scale(20);opacity:0} }
`;
document.head.appendChild(dynamicStyles);

console.log('%c👋 Hey there! Built with passion by Vaishnav Prabhakaran', 'color: #A855F7; font-size: 14px; font-weight: bold; padding: 8px;');
