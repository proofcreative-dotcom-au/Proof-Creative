(() => {
  'use strict';
  if (window.__pcReveal) return;
  window.__pcReveal = true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const style = document.createElement('style');
  style.textContent = [
    '[data-rv] { opacity: 0; transform: translateY(18px); transition: opacity 450ms cubic-bezier(0.22,1,0.36,1), transform 450ms cubic-bezier(0.22,1,0.36,1); transition-delay: var(--rv-delay, 0ms); will-change: opacity, transform; }',
    '[data-rv="in"] { opacity: 1 !important; transform: translateY(0) !important; }'
  ].join('\n');
  document.head.appendChild(style);

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.setAttribute('data-rv', 'in'); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  const tag = (el, delay) => {
    if (el.hasAttribute('data-rv')) return;
    if (delay) el.style.setProperty('--rv-delay', delay + 'ms');
    el.setAttribute('data-rv', '');
    io.observe(el); // fires immediately for already-visible targets
  };

  const scan = () => {
    document.querySelectorAll('section[data-screen-label], main > nav, footer').forEach((sec) => {
      const grids = sec.querySelectorAll(':scope [style*="grid-template-columns"]');
      let gridChildren = [];
      grids.forEach((g) => { gridChildren = gridChildren.concat(Array.from(g.children)); });
      if (gridChildren.length > 1) {
        Array.from(sec.children).forEach((child) => {
          if (child.querySelector('[style*="grid-template-columns"]') || child.matches('[style*="grid-template-columns"]')) return;
          tag(child, 0);
        });
        gridChildren.forEach((item, i) => tag(item, Math.min(i, 4) * 60));
      } else {
        tag(sec, 0);
      }
    });
  };

  // Safety net: any tagged element still hidden 3s after its tag is force-shown.
  const failsafe = () => {
    document.querySelectorAll('[data-rv=""]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.setAttribute('data-rv', 'in');
    });
  };

  const start = () => {
    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 8000);
    setTimeout(failsafe, 1200);
    setTimeout(failsafe, 4000);
    window.addEventListener('scroll', failsafe, { passive: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
