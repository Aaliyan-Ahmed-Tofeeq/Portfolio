'use strict';

/* ── Loader ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add('hidden');
  }, 800);
});


/* ── Custom Cursor ──────────────────────────────────────── */
(function initCursor() {

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  let mouseX = 0;
  let mouseY = 0;

  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(animateRing);
  }

  animateRing();

  const hoverElements = document.querySelectorAll(
    'a, button, input, textarea, .project-card, .tech-pill'
  );

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });

    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

})();


/* ── Sticky Navbar ─────────────────────────────────────── */
(function initNavbar() {

  const nav = document.getElementById('navbar');
  if (!nav) return;

  function handleScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

})();


/* ── Mobile Nav ─────────────────────────────────────────── */
(function initMobileNav() {

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  links.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

})();


/* ── Active Nav Links ───────────────────────────────────── */
(function initActiveLinks() {

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(link => {

        const href = link.getAttribute('href');
        if (!href) return;

        const id = href.replace('#', '');

        link.classList.toggle(
          'active',
          id === entry.target.id
        );

      });

    });

  }, {
    rootMargin: '-40% 0px -55% 0px'
  });

  sections.forEach(section => observer.observe(section));

})();


/* ── Scroll Reveal ─────────────────────────────────────── */
(function initReveal() {

  const elements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    });

  }, {
    threshold: 0.12
  });

  elements.forEach(el => observer.observe(el));

})();


/* ── Typing Animation ──────────────────────────────────── */
(function initTyping() {

  const roleText = document.getElementById('roleText');
  if (!roleText) return;

  const roles = [
    'Frontend Developer',
    'UI Engineer',
    'Creative Coder',
    'Freelancer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {

    const currentRole = roles[roleIndex];

    if (!deleting) {

      roleText.textContent = currentRole.slice(0, charIndex++);
      if (charIndex > currentRole.length) {
        deleting = true;
        setTimeout(type, 1400);
        return;
      }

    } else {

      roleText.textContent = currentRole.slice(0, charIndex--);

      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
      }
    }

    setTimeout(type, deleting ? 45 : 90);
  }

  type();

})();


/* ── Skill Bars ─────────────────────────────────────────── */
(function initSkillBars() {

  const bars = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const fill = entry.target;
      const pct = fill.style.getPropertyValue('--pct') || '0%';

      fill.style.width = pct;
      observer.unobserve(fill);
    });

  }, {
    threshold: 0.3
  });

  bars.forEach(bar => observer.observe(bar));

})();


/* ── Contact Form ───────────────────────────────────────── */
(function initContactForm() {

  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  if (!nameInput || !emailInput || !messageInput || !submitBtn) return;

  function validate(input, errorEl, testFn, msg) {
    if (!input || !errorEl) return false;

    const isValid = testFn(input.value.trim());

    input.classList.toggle('error', !isValid);
    errorEl.textContent = isValid ? '' : msg;

    return isValid;
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const okName = validate(nameInput, nameError, v => v.length >= 2, 'Please enter your name.');
    const okEmail = validate(emailInput, emailError, isEmail, 'Please enter a valid email.');
    const okMessage = validate(messageInput, messageError, v => v.length >= 10, 'Message must be at least 10 characters.');

    if (!okName || !okEmail || !okMessage) return;

    submitBtn.disabled = true;

    const label = submitBtn.querySelector('.btn-label');
    const originalText = label?.textContent || 'Send';

    if (label) label.textContent = 'Sending...';

    await new Promise(resolve => setTimeout(resolve, 1200));

    const whatsappNumber = '923454105434';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput?.value?.trim() || '';
    const message = messageInput.value.trim();

    const draftMessage =
`😊 *Hello Aaliyan Developer,*

👤 *Name:* ${name}
📧 *Email:* ${email}
📌 *Subject:* ${subject || 'General Inquiry'}

💬 *Message:*
${message}

✨ Looking forward to discussing this project with you.`;

    const whatsappURL =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(draftMessage.slice(0, 900))}`;

    window.open(whatsappURL, '_blank');

    if (successMsg) {
      successMsg.textContent = '✓ Message prepared successfully.';
    }

    form.reset();

    if (label) label.textContent = originalText;

    submitBtn.disabled = false;

    setTimeout(() => {
      if (successMsg) successMsg.textContent = '';
    }, 5000);

  });

  [nameInput, emailInput, messageInput].forEach(input => {
    if (!input) return;

    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });

})();


/* ── Smooth Scroll ─────────────────────────────────────── */
(function initSmoothScroll() {

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener('click', (e) => {

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight =
        document.getElementById('navbar')?.offsetHeight || 70;

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        navHeight;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });

    });

  });

})();


/* ── Parallax Orbs ─────────────────────────────────────── */
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


/* ── Footer Year ───────────────────────────────────────── */
(function initFooterYear() {

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();


/* ── Project Card Tilt ─────────────────────────────────── */
(function initCardTilt() {

  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {

    card.addEventListener('mousemove', (e) => {

      const rect = card.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rotateY =
        ((e.clientX - centerX) / rect.width) * 10;

      const rotateX =
        ((centerY - e.clientY) / rect.height) * 10;

      card.style.transform =
        `perspective(1000px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         translateY(-6px)`;

    });

    card.addEventListener('mouseleave', () => {
      card.style.transform =
        'perspective(1000px) rotateX(0) rotateY(0)';
    });

  });

})();
