/* Article and process navigation. Live enquiries are handled in forms.js. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (window.matchMedia('(max-width: 720px)').matches) document.body.classList.add('tools-hidden');
  const safeText = (el, message) => { if (el) el.textContent = message; };

  const links = [...document.querySelectorAll('.article-aside nav a[href^="#"]')];
  const targets = links.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
  const steps = [...document.querySelectorAll('.process-step')];
  let frame = 0;
  const update = () => {
    frame = 0;
    if (targets.length) {
      let active = 0;
      targets.forEach((t, i) => { if (t.getBoundingClientRect().top < 190) active = i; });
      links.forEach((l, i) => { l.classList.toggle('active', i === active); if (i === active) l.setAttribute('aria-current','location'); else l.removeAttribute('aria-current'); });
    }
    if (steps.length) {
      let active = 0;
      steps.forEach((t, i) => { if (t.getBoundingClientRect().top < window.innerHeight * .42) active = i; });
      steps.forEach((s, i) => s.classList.toggle('is-current', i === active));
      root.style.setProperty('--route-progress', ((active + 1) / steps.length * 100) + '%');
    }
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, {passive:true});
  window.addEventListener('resize', update);
  update();
})();
