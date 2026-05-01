/* ═══════════════════════════════════════════════════════════
   ALEX MERCER — PORTFOLIO
   script.js  |  Interactions, animations, utilities
   ─────────────────────────────────────────────────────────── */

'use strict';

/* ── Loader ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Small delay so the bar animation is visible at least once
  setTimeout(() => loader.classList.add('hidden'), 800);
});


/* ── Custom Cursor ──────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let ringX = 0, ringY = 0;
  let mouseX = 0, mouseY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with lag
  function movRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(movRing);
  }
  movRing();

  // Enlarge ring on interactive elements
  const hoverEls = document.querySelectorAll('a, button, [role="button"], input, textarea, .project-card, .tech-pill');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();


/* ── Sticky Navbar ──────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 20);
    lastY = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Mobile Nav Toggle ──────────────────────────────────── */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  links.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ── Active Nav Link Highlight ──────────────────────────── */
(function initActiveLinks() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href').replace('#', '');
          link.classList.toggle('active', href === entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ── Scroll Reveal ──────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


/* ── Typing Animation ───────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('roleText');
  if (!el) return;

  const roles = ['Developer', 'Designer', 'Problem Solver', 'Full-Stack Engineer', 'Open Source Contributor'];
  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let pausing  = false;

  function type() {
    const current = roles[roleIdx];

    if (pausing) return;

    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === current.length) {
        // Pause at full word
        pausing = true;
        setTimeout(() => {
          pausing  = false;
          deleting = true;
          tick();
        }, 1800);
        return;
      }
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === 0) {
        deleting  = false;
        roleIdx   = (roleIdx + 1) % roles.length;
      }
    }

    tick();
  }

  function tick() {
    const speed = deleting ? 45 : 90;
    setTimeout(type, speed);
  }

  tick();
})();


/* ── Skill Bar Animation ────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.style.getPropertyValue('--pct');
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ── Contact Form Validation ────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  if (!form) return;

  const nameInput    = form.querySelector('#name');
  const emailInput   = form.querySelector('#email');
  const messageInput = form.querySelector('#message');
  const submitBtn    = form.querySelector('#submitBtn');
  const successMsg   = form.querySelector('#formSuccess');

  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  function validate(input, errorEl, testFn, msg) {
    const ok = testFn(input.value.trim());
    input.classList.toggle('error', !ok);
    errorEl.textContent = ok ? '' : msg;
    return ok;
  }

  function isEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const okName    = validate(nameInput,    nameError,    v => v.length >= 2,    'Please enter your name.');
    const okEmail   = validate(emailInput,   emailError,   v => isEmail(v),       'Please enter a valid email.');
    const okMessage = validate(messageInput, messageError, v => v.length >= 10,   'Message must be at least 10 characters.');

    if (!okName || !okEmail || !okMessage) return;

    // Simulate send (replace with your actual endpoint)
    submitBtn.disabled = true;
    const label = submitBtn.querySelector('.btn-label');
    const origLabel = label.textContent;
    label.textContent = 'Sending…';

    await new Promise(r => setTimeout(r, 1400));

    successMsg.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
    form.reset();
    label.textContent = origLabel;
    submitBtn.disabled = false;

    // Clear success message after 6s
    setTimeout(() => { successMsg.textContent = ''; }, 6000);
  });

  // Live validation on blur
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('blur', () => input.classList.remove('error'));
  });
})();


/* ── Smooth Scroll for anchor links ─────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 68;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── Parallax orbs (subtle) ─────────────────────────────── */
(function initParallax() {
  const orb1 = document.querySelector('.orb--1');
  const orb2 = document.querySelector('.orb--2');
  if (!orb1 || !orb2) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orb1.style.transform = `translateY(${y * 0.12}px)`;
    orb2.style.transform = `translateY(${-y * 0.08}px)`;
  }, { passive: true });
})();


/* ── Footer year ────────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ── Project card tilt on hover (desktop) ───────────────── */
(function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;   // skip touch

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -4;
      const tiltY  = dx *  4;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
