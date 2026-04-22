/* ===================================================
   MADIOP PORTFOLIO - main.js
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const cursor = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');

  if (window.innerWidth > 900) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
      setTimeout(() => {
        cursorRing.style.left = e.clientX + 'px';
        cursorRing.style.top  = e.clientY + 'px';
      }, 80);
    });
    document.querySelectorAll('a, button, .project-card, .value-item, .contact-link').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── NAV SCROLL ── */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  });

  /* ── ACTIVE NAV LINK ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* ── HAMBURGER ── */
  const hamburger = document.querySelector('.hamburger');
  const navLinksEl = document.querySelector('.nav-links');
  hamburger?.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinksEl.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translateY(9px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-9px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  /* ── INTERSECTION OBSERVER — REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ── SKILL BARS ── */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
          fill.classList.add('animated');
        });
      }
    });
  }, { threshold: 0.3 });

  const skillSection = document.querySelector('#skills');
  if (skillSection) skillObserver.observe(skillSection);

  /* ── SMOOTH NAV CLICK ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        navLinksEl?.classList.remove('open');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── CONTACT FORM ── */
  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '✓ Message envoyé !';
    btn.style.background = '#6B8F71';
    btn.style.borderColor = '#6B8F71';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.borderColor = '';
      form.reset();
    }, 3000);
  });

  /* ── HERO STATS COUNTER ── */
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Math.round(start) + (el.dataset.suffix || '');
      if (start >= target) clearInterval(timer);
    }, 16);
  }

  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stat-number[data-count]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count), 1200);
      });
      heroObserver.disconnect();
    }
  }, { threshold: 0.5 });

  const heroSection = document.querySelector('#hero');
  if (heroSection) heroObserver.observe(heroSection);

  /* ── STAGGERED FADE FOR PROJECT CARDS ── */
  const projectCards = document.querySelectorAll('.project-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 120);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.7s ease, transform 0.7s ease, border-color 0.4s, box-shadow 0.4s';
    cardObserver.observe(card);
  });

  /* ── KENTE PATTERN ANIMATION ── */
  const kente = document.querySelector('.about-kente');
  if (kente) {
    let angle = 0;
    setInterval(() => {
      angle = (angle + 0.3) % 360;
      kente.style.filter = `hue-rotate(${angle * 0.1}deg)`;
    }, 50);
  }

  /* ── TYPEWRITER EFFECT ── */
  const typeEl = document.querySelector('.hero-role');
  if (typeEl) {
    const roles = [
      'Développeur Logiciel',
      'Passionné de Tech Africaine',
      'Innovateur Social',
      'Bâtisseur de Solutions',
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let waiting = false;

    function typeRole() {
      const current = roles[roleIndex];
      if (waiting) return;

      if (!deleting) {
        typeEl.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length) {
          deleting = true; waiting = true;
          setTimeout(() => { waiting = false; }, 2200);
        }
      } else {
        typeEl.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
    }
    setInterval(typeRole, deleting ? 55 : 80);
  }

});
