(() => {
  'use strict';

  const WHATSAPP_NUMBER = '972502271520';

  // ponytail: self-check - fails loudly if any CTA points to the wrong number
  function assertWhatsAppLinks() {
    const links = document.querySelectorAll('a[href*="wa.me"]');
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (!href.includes(`wa.me/${WHATSAPP_NUMBER}`)) {
        throw new Error(`WhatsApp link mismatch: expected ${WHATSAPP_NUMBER}, got ${href}`);
      }
    });
    console.assert(links.length >= 3, `Expected at least 3 WhatsApp CTAs, found ${links.length}`);
  }

  // --- Intersection Observer: fade-in animations ---
  const animElements = document.querySelectorAll('.anim-fade-up');

  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-visible');
          animObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  animElements.forEach((el) => animObserver.observe(el));

  // --- Dot navigation: highlight active section ---
  const sections = document.querySelectorAll('.section');
  const dots = document.querySelectorAll('.dot-nav .dot');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          dots.forEach((dot) => {
            dot.classList.toggle('active', dot.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // --- Smooth scroll for dot nav clicks ---
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(dot.dataset.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Parallax-lite: move glows on scroll ---
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const glows = document.querySelectorAll('.hero-glow, .section-glow');
        glows.forEach((glow) => {
          const parent = glow.parentElement;
          if (!parent) return;
          const rect = parent.getBoundingClientRect();
          const offset = (rect.top + rect.height / 2) / window.innerHeight;
          glow.style.transform = `translateY(${offset * 20}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // --- Hide scroll hint after first scroll ---
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    let hidden = false;
    window.addEventListener('scroll', () => {
      if (!hidden && window.scrollY > 100) {
        scrollHint.style.opacity = '0';
        hidden = true;
      }
    });
  }

  // --- Sticky WhatsApp button: show after scrolling past hero ---
  const stickyBtn = document.getElementById('sticky-whatsapp');
  const hero = document.getElementById('hero');

  if (stickyBtn && hero) {
    const stickyObserver = new IntersectionObserver(
      ([entry]) => {
        stickyBtn.classList.toggle('visible', !entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    stickyObserver.observe(hero);
  }

  // --- Card hover glow ---
  const cards = document.querySelectorAll('.learn-card, .audience-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(
        300px circle at ${x}px ${y}px,
        rgba(13, 148, 136, 0.06),
        #ffffff
      )`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  assertWhatsAppLinks();
})();
