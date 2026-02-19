/* ===================================
   VAISHNAV PRABHAKARAN - PORTFOLIO JS
   Animations, Interactions & Effects
   =================================== */

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

// Only run custom cursor logic on devices that support hover (desktop)
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Use transform instead of left/top — GPU only, no layout reflow
        cursor.style.transform = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px)) translateZ(0)`;
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        // Use transform instead of left/top — GPU only, no layout reflow
        cursorFollower.style.transform = `translate(calc(-50% + ${followerX}px), calc(-50% + ${followerY}px)) translateZ(0)`;
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor hover effects
    document.querySelectorAll('a, button, .pill, .project-card, .service-card, .skill-category').forEach(el => {
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

// ===== CARD GLOW (direct CSS var on card — no separate element, no compositing bleed) =====
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
        // Move glow far off-screen so it's invisible without triggering a repaint flash
        card.style.setProperty('--glow-x', '-999px');
        card.style.setProperty('--glow-y', '-999px');
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
        p.style.cssText = `
            width:${size}px; height:${size}px;
            left:${left}%; bottom:${bottom}%;
            background:${colors[Math.floor(Math.random() * colors.length)]};
            animation-duration:${duration}s;
            animation-delay:-${delay}s;
        `;
        heroBg.appendChild(p);
    }
})();


// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Scrolled class
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== HAMBURGER MENU =====
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

// Close menu on link click
navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    });
});

// ===== TYPEWRITER EFFECT =====
const typewriterEl = document.getElementById('typewriter');
const phrases = [
    'Flutter Developer',
    'CTO at Zowfity',
    'Tech Enthusiast',
    'Mobile App Creator',
    'AI Integrator',
    'Self-Taught Coder',
    'Problem Solver'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterTimeout;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    // Add blinking cursor
    // Cursor is now handled by CSS ::after pseudo-element

    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
    }

    typewriterTimeout = setTimeout(typeWriter, speed);
}

// Start typewriter after a short delay
setTimeout(typeWriter, 800);

// ===== SCROLL ANIMATIONS =====
const animateElements = document.querySelectorAll(
    '.section-header, .about-card, .about-content, .skill-category, .project-card, .service-card, .contact-card, .contact-form, .about-visual, .hero-content, .hero-visual, .tech-pills, .projects-cta'
);

// Add animate-in class to elements
animateElements.forEach((el, index) => {
    el.classList.add('animate-in');
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger animation for grid items
            const parent = entry.target.closest('.skills-grid, .projects-grid, .services-grid');
            if (parent) {
                const siblings = Array.from(parent.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animateElements.forEach(el => observer.observe(el));

// ===== SKILL BARS ANIMATION =====
const skillBars = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 200);
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        shakeForm();
        return;
    }

    if (!isValidEmail(email)) {
        document.getElementById('email').style.borderColor = '#EF4444';
        document.getElementById('email').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        setTimeout(() => {
            document.getElementById('email').style.borderColor = '';
            document.getElementById('email').style.boxShadow = '';
        }, 2000);
        return;
    }

    // Send to Google Forms
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeeu-It7wtXrr4m0XxrnINZAtBLnR9ilIiVQ8eRgR7MCA6tPA/formResponse';

    // Create FormData
    const formData = new FormData();
    formData.append('entry.2038327349', name);    // Name
    formData.append('entry.1180618213', email);   // Email
    formData.append('entry.925995251', message);  // Message

    // Add hidden fields required by Google Forms
    formData.append('fvv', '1');
    formData.append('fbzx', '-3241070635628774565');
    formData.append('pageHistory', '0');

    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    }).then(() => {
        contactForm.reset();
        submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        submitBtn.disabled = false;

        // Show Success Modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.classList.add('active');
        } else {
            // Fallback if modal missing
            formSuccess.classList.add('show');
            setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }

    }).catch((error) => {
        console.error('Error!', error.message);
        submitBtn.innerHTML = '<span>Error! Retry?</span><i class="fas fa-exclamation-circle"></i>';
        submitBtn.disabled = false;
    });
});

// Modal Logic
// Modal Logic
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');

if (closeModal && successModal) {
    console.log('Modal elements initialized'); // Debug

    closeModal.addEventListener('click', (e) => {
        console.log('Close button clicked'); // Debug
        e.preventDefault();
        e.stopPropagation();
        successModal.classList.remove('active');
    });

    // Close on click outside
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            console.log('Overlay clicked'); // Debug
            successModal.classList.remove('active');
        }
    });

    // Escape key support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
            successModal.classList.remove('active');
        }
    });

} else {
    console.error('Modal elements NOT found');
}


function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm() {
    contactForm.style.animation = 'shake 0.4s ease';
    setTimeout(() => contactForm.style.animation = '', 400);
}

// Add shake keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== PARALLAX EFFECT FOR ORBS =====
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

// ===== COUNTER ANIMATION FOR STATS =====
function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            el.textContent = target + (el.dataset.suffix || '');
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start) + (el.dataset.suffix || '');
        }
    }, 16);
}

// ===== HERO ENTRANCE ANIMATION =====
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateX(-40px)';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateX(0)';
        }, 100);
    }

    if (heroVisual) {
        heroVisual.style.opacity = '0';
        heroVisual.style.transform = 'translateX(40px)';
        setTimeout(() => {
            heroVisual.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroVisual.style.opacity = '1';
            heroVisual.style.transform = 'translateX(0)';
        }, 300);
    }
});

// ===== PILL HOVER RIPPLE =====
document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(168, 85, 247, 0.3);
      width: 10px; height: 10px;
      left: ${e.offsetX}px; top: ${e.offsetY}px;
      transform: translate(-50%, -50%) scale(0);
      animation: rippleEffect 0.5s ease-out forwards;
      pointer-events: none;
    `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleEffect {
    to { transform: translate(-50%, -50%) scale(20); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// ===== ACTIVE SECTION HIGHLIGHT =====
// Already handled in scroll event above

// ===== FORM INPUT ANIMATIONS =====
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.querySelector('label').style.color = '#A855F7';
    });
    input.addEventListener('blur', function () {
        this.parentElement.querySelector('label').style.color = '';
    });
});

console.log('%c👋 Hey there! Built with passion by Vaishnav Prabhakaran',
    'color: #A855F7; font-size: 14px; font-weight: bold; padding: 8px;');
console.log('%c🔗 GitHub: https://github.com/vaishnav7100',
    'color: #54C5F8; font-size: 12px;');
