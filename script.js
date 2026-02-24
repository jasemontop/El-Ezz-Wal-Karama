// Lightweight, performant reveal + header scroll styling
const reveals = Array.from(document.querySelectorAll('.reveal'));
const header = document.querySelector('.nav');

// Respect user preference for reduced motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  // Immediately show everything and skip JS animations
  reveals.forEach(r => r.classList.add('active'));
} else {
  // Stagger delays via CSS variable then observe
  reveals.forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${i * 50}ms`);
  });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.12 });

  reveals.forEach(r => revealObserver.observe(r));

  // Observe hero to toggle header styling when scrolled past
  const hero = document.querySelector('.hero');
  if (hero && header) {
    const heroObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) header.classList.remove('nav--scrolled');
        else header.classList.add('nav--scrolled');
      });
    }, { root: null, threshold: 0, rootMargin: `-${getComputedStyle(header).height || '72px'} 0px 0px 0px` });

    heroObserver.observe(hero);
  }
}

// Fallback: if IntersectionObserver isn't available, reveal on load
if (!('IntersectionObserver' in window)) {
  reveals.forEach(r => r.classList.add('active'));
}