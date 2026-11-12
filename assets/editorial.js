/* PROOF editorial prototype. Plain JavaScript, no build step or tracking. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const readPreference = key => { try { return sessionStorage.getItem(key); } catch (_) { return null; } };
  const savePreference = (key, value) => { try { sessionStorage.setItem(key, value); } catch (_) {} };
  const motionButton = document.getElementById('motion-toggle');
  const stored = readPreference('proof-motion');
  let motion = !reduced.matches && stored !== 'off';
  function setMotion(enabled, persist = false) {
    motion = Boolean(enabled);
    root.dataset.motion = motion ? 'on' : 'off';
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', String(motion));
      motionButton.innerHTML = '<span class="dot" aria-hidden="true"></span>Motion ' + (motion ? 'on' : 'off');
    }
    if (!motion) document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
    if (persist) savePreference('proof-motion', motion ? 'on' : 'off');
    window.dispatchEvent(new CustomEvent('proof:motion', { detail: motion }));
  }
  setMotion(motion);
  motionButton?.addEventListener('click', () => setMotion(!motion, true));
  reduced.addEventListener('change', event => setMotion(!event.matches));

  const header = document.getElementById('site-header');
  let scheduled = false;
  function updateScroll() {
    header?.classList.toggle('is-scrolled', window.scrollY > 20);
    if (document.body.classList.contains('case-page')) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty('--read', Math.max(0, Math.min(100, window.scrollY / max * 100)) + '%');
    }
  }
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { updateScroll(); scheduled = false; });
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: .05, rootMargin: '0px 0px -15px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));

  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const main = document.getElementById('main');
  function closeMenu(restore = false) {
    if (!menu || !menuToggle) return;
    menu.classList.remove('open'); menu.inert = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflow = ''; if (main) main.inert = false;
    if (restore) menuToggle.focus();
  }
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    if (!open) { closeMenu(true); return; }
    menu.classList.add('open'); menu.inert = false;
    menuToggle.setAttribute('aria-expanded', 'true'); menuToggle.setAttribute('aria-label', 'Close navigation');
    document.body.style.overflow = 'hidden'; if (main) main.inert = true;
    menu.querySelector('a')?.focus();
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (!menu?.classList.contains('open')) return;
    if (event.key === 'Escape') closeMenu(true);
    if (event.key === 'Tab') {
      const items = [menuToggle, ...menu.querySelectorAll('a')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });

  function openDialog(dialog) {
    if (!dialog) return;
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
    dialog.showModal(); document.body.classList.add('modal-open'); dialog.scrollTop = 0;
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
    });
  });
  document.getElementById('notes-open')?.addEventListener('click', () => openDialog(document.getElementById('notes-dialog')));
  document.getElementById('hide-tools')?.addEventListener('click', () => document.body.classList.add('tools-hidden'));
  document.getElementById('show-tools')?.addEventListener('click', () => document.body.classList.remove('tools-hidden'));

  const galleryData = document.getElementById('gallery-data');
  if (galleryData) {
    let gallery;
    try { gallery = JSON.parse(galleryData.textContent); } catch (_) { gallery = []; }
    let current = 0;
    const dialog = document.getElementById('image-dialog');
    const image = document.getElementById('viewer-image');
    const previous = document.getElementById('viewer-prev');
    const next = document.getElementById('viewer-next');
    function show(index) {
      if (!gallery.length) return;
      current = (index + gallery.length) % gallery.length;
      image.src = typeof window.proofAsset === 'function' ? window.proofAsset(gallery[current].src) : gallery[current].src; image.alt = gallery[current].alt;
      document.getElementById('viewer-caption').textContent = gallery[current].alt;
      document.getElementById('viewer-counter').textContent = 'Project imagery / ' + String(current + 1).padStart(2, '0') + ' of ' + String(gallery.length).padStart(2, '0');
      previous.disabled = next.disabled = gallery.length < 2;
    }
    document.querySelectorAll('[data-gallery-index]').forEach(button => button.addEventListener('click', () => { show(Number(button.dataset.galleryIndex)); openDialog(dialog); }));
    previous?.addEventListener('click', () => show(current - 1));
    next?.addEventListener('click', () => show(current + 1));
    dialog?.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    });
  }

  const collection = document.getElementById('project-collection');
  if (collection) {
    const items = [...collection.querySelectorAll('.collection-item')];
    document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
      let count = 0;
      items.forEach(item => { const visible = filter === 'all' || item.dataset.group === filter; item.hidden = !visible; if (visible) { count++; item.classList.add('in-view'); } });
      document.getElementById('filter-status').textContent = 'Showing ' + count + (count === 1 ? ' project.' : ' projects.');
    }));
    function setView(view) {
      collection.classList.toggle('list-view', view === 'list');
      collection.classList.toggle('sheet-view', view === 'sheet');
      document.querySelectorAll('[data-view]').forEach(button => { const active = button.dataset.view === view; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
      savePreference('proof-work-view', view);
    }
    setView(['list','sheet'].includes(readPreference('proof-work-view')) ? readPreference('proof-work-view') : 'images');
    document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
  }
  document.querySelectorAll('.service').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) document.querySelectorAll('.service').forEach(other => { if (other !== detail) other.open = false; });
  }));
})();
