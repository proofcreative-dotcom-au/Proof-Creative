/* Edition 05: optional image crossfades and native service chapter navigation.
   All service copy is present and readable without this script. */
(() => {
  'use strict';
  const entries = [...document.querySelectorAll('[data-expertise]')];
  const selectors = [...document.querySelectorAll('[data-study]')];
  const plates = [...document.querySelectorAll('[data-expertise-plate]')];
  const caption = document.getElementById('expertise-study-label');
  const labels = ['01 / Packaging study', '02 / Identity applications', '03 / Design development'];
  let selected = 0;
  let requested = 0;
  function commitStudy(index) {
    if (!Number.isInteger(index) || index < 0 || index >= plates.length) return;
    selected = index;
    plates.forEach((image, i) => {
      image.classList.toggle('active', i === selected);
      image.setAttribute('aria-hidden', String(i !== selected));
    });
    selectors.forEach((button, i) => {
      button.classList.toggle('active', i === selected);
      button.setAttribute('aria-pressed', String(i === selected));
    });
    if (caption) caption.textContent = labels[selected];
  }
  function selectStudy(index) {
    if (!Number.isInteger(index) || index < 0 || index >= plates.length) return;
    requested = index;
    const img = plates[index]; img.loading = 'eager';
    if (img.complete && img.naturalWidth) { commitStudy(index); return; }
    const ready = img.decode ? img.decode() : new Promise(resolve => img.addEventListener('load', resolve, { once: true }));
    ready.then(() => { if (requested === index) commitStudy(index); }).catch(() => {});
  }
  const study = document.querySelector('.expertise-plates');
  if (study && 'IntersectionObserver' in window) {
    const warm = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      plates.forEach(img => { img.loading='eager'; if(img.decode) img.decode().catch(() => {}); });
      warm.disconnect();
    }, { rootMargin: '600px' });
    warm.observe(study);
  }
  selectors.forEach(button => button.addEventListener('click', () => selectStudy(Number(button.dataset.study))));
  entries.forEach(entry => {
    entry.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') selectStudy(Number(entry.dataset.expertise));
    });
    entry.addEventListener('focusin', () => selectStudy(Number(entry.dataset.expertise)));
  });

  // Use normal anchors. Only the active marker follows the scroll position.
  const chapters = [...document.querySelectorAll('.service-chapters a[href^="#"]')];
  const targets = chapters.map(a => document.getElementById(a.getAttribute('href').slice(1)));
  let scheduled = false;
  function updateChapters() {
    scheduled = false;
    if (!chapters.length) return;
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.service-chapters');
    const threshold = (header?.offsetHeight || 88) + (nav?.offsetHeight || 67) + 48;
    let current = -1;
    targets.forEach((target, i) => {
      if (target && target.getBoundingClientRect().top <= threshold) current = i;
    });
    chapters.forEach((a, i) => {
      a.classList.toggle('active', i === current);
      if (i === current) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }
  if (chapters.length) {
    window.addEventListener('scroll', () => {
      if (!scheduled) { scheduled = true; requestAnimationFrame(updateChapters); }
    }, {passive:true});
    window.addEventListener('resize', updateChapters);
    updateChapters();
  }
})();
