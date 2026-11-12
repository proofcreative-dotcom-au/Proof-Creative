/* Local, accessible before/after comparison. No automatic reveal. */
(() => {
  'use strict';
  document.querySelectorAll('[data-identity-compare]').forEach(stage => {
    const figure = stage.closest('.identity-comparison');
    const input = stage.querySelector('.comparison-range');
    if (!figure || !input || stage.dataset.ready === 'true') return;
    stage.dataset.ready = 'true';
    const buttons = [...figure.querySelectorAll('[data-compare-value]')];
    let pointer = null;
    const setValue = raw => {
      const number = Number(raw);
      const value = Math.round(Math.max(0, Math.min(100, Number.isFinite(number) ? number : 50)));
      input.value = String(value);
      stage.style.setProperty('--split', value + '%');
      input.setAttribute('aria-valuetext', value === 0 ? 'New identity fully visible' : value === 100 ? 'Previous identity fully visible' : value + '% previous identity, ' + (100-value) + '% new identity');
      buttons.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.compareValue) === value)));
    };
    const setFromPointer = event => {
      const rect = stage.getBoundingClientRect();
      if (rect.width) setValue((event.clientX - rect.left) / rect.width * 100);
    };
    input.addEventListener('input', () => setValue(input.value));
    input.addEventListener('pointerdown', event => {
      if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
      // Keep vertical touch scrolling available while allowing horizontal dragging.
      event.preventDefault();
      pointer = {id:event.pointerId, x:event.clientX, y:event.clientY, dragging:event.pointerType !== 'touch'};
      input.setPointerCapture(event.pointerId);
      if (pointer.dragging) { input.focus({preventScroll:true}); stage.classList.add('is-dragging'); setFromPointer(event); }
    });
    input.addEventListener('pointermove', event => {
      if (!pointer || event.pointerId !== pointer.id) return;
      const dx = Math.abs(event.clientX-pointer.x), dy = Math.abs(event.clientY-pointer.y);
      if (!pointer.dragging && dx > 5 && dx > dy) { pointer.dragging = true; stage.classList.add('is-dragging'); }
      if (pointer.dragging) setFromPointer(event);
    });
    const finish = (event, cancelled) => {
      if (!pointer || event.pointerId !== pointer.id) return;
      if (!cancelled && (pointer.dragging || (Math.abs(event.clientX-pointer.x)<6 && Math.abs(event.clientY-pointer.y)<6))) setFromPointer(event);
      if (input.hasPointerCapture(event.pointerId)) input.releasePointerCapture(event.pointerId);
      pointer = null;stage.classList.remove('is-dragging');
    };
    input.addEventListener('pointerup', event => finish(event,false));
    input.addEventListener('pointercancel', event => finish(event,true));
    input.addEventListener('lostpointercapture', () => {pointer = null;stage.classList.remove('is-dragging');});
    buttons.forEach(b => b.addEventListener('click', () => setValue(b.dataset.compareValue)));
    figure.classList.add('comparison-ready');setValue(input.value);
  });
})();
