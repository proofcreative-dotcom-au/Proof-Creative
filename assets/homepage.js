/* Homepage motion: three supplied photographs, not a generated 3D animation. */
(() => {
  'use strict';
  const feature = document.getElementById('feature');
  const sticky = document.querySelector('.feature-sticky');
  const header = document.getElementById('site-header');
  if (!feature || !sticky || !header) return;
  const frames = [...document.querySelectorAll('.feature-frame')];
  const steps = [...document.querySelectorAll('.feature-step')];
  const captions = ['The complete expression.', 'An identity, in another form.', 'The proof is in the detail.'];
  let current = 0, scheduled = false;
  const pinned = () => window.innerWidth > 760 && document.documentElement.dataset.motion !== 'off';
  function showFrame(index) {
    if (index < 0 || index >= frames.length) return;
    current = index;
    frames.forEach((frame, i) => { frame.classList.toggle('active', i === index); frame.setAttribute('aria-hidden', String(i !== index)); });
    steps.forEach((step, i) => { step.classList.toggle('active', i === index); step.setAttribute('aria-pressed', String(i === index)); });
    document.getElementById('frame-caption').textContent = captions[index];
    document.getElementById('frame-counter').textContent = String(index + 1).padStart(2, '0') + ' / 03';
  }
  function update() {
    if (!pinned()) return;
    const range = Math.max(1, feature.offsetHeight - sticky.offsetHeight);
    const progress = Math.max(0, Math.min(1, (-feature.getBoundingClientRect().top + header.offsetHeight) / range));
    const index = Math.min(2, Math.floor(progress * 3));
    if (index !== current) showFrame(index);
    feature.style.setProperty('--progress', progress * 100 + '%');
  }
  window.addEventListener('scroll', () => { if (scheduled) return; scheduled = true; requestAnimationFrame(() => { update(); scheduled = false; }); }, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('proof:motion', update);
  steps.forEach((button, index) => button.addEventListener('click', () => {
    if (!pinned()) { showFrame(index); return; }
    const start = feature.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    const range = Math.max(1, feature.offsetHeight - sticky.offsetHeight);
    window.scrollTo({ top: start + range * (index + .25) / 3, behavior: 'smooth' });
  }));
  update();
})();
