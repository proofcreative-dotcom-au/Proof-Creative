/* Proof Creative production interactions. No design-review controls. */
(() => {
 'use strict';
 const opener=document.querySelector('.stationery-open');
 const dialog=document.getElementById('stationery-dialog');
 if(opener && dialog){
  opener.addEventListener('click',()=>{
   if(typeof dialog.showModal!=='function') {window.open('assets/studio/proof-business-cards.jpg','_blank','noopener');return;}
   dialog.showModal();document.body.classList.add('modal-open');
  });
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener.focus({preventScroll:true});});
 }
 // Keep the useful accessibility choice after removing the prototype toolbar.
 const button=document.querySelector('.footer-motion');
 if(button){
  function sync(){const on=document.documentElement.dataset.motion!=='off';button.textContent=on?'Motion on':'Motion off';button.setAttribute('aria-pressed',String(on));}
  button.addEventListener('click',()=>{
   const enabled=document.documentElement.dataset.motion==='off';
   document.documentElement.dataset.motion=enabled?'on':'off';
   try{sessionStorage.setItem('proof-motion',enabled?'on':'off');}catch(_){}
   if(!enabled)document.querySelectorAll('.reveal,[data-reveal]').forEach(el=>el.classList.add('in-view'));
   window.dispatchEvent(new CustomEvent('proof:motion',{detail:enabled}));sync();
  });
  window.addEventListener('proof:motion',sync);sync();
 }
})();
