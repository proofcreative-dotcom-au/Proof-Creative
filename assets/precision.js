/* Edition 09: explicit navigation feedback. Native links remain functional. */
(() => {
 'use strict';
 const root = document.documentElement;
 const body = document.body;
 const nav = [...document.querySelectorAll('[data-nav-item]')];
 const current = body.dataset.page || location.pathname.split('/').pop() || 'index.html';
 const motion = () => root.dataset.motion !== 'off' && !matchMedia('(prefers-reduced-motion: reduce)').matches;
 function select(group, transient = false) {
  nav.forEach(a => {
   const active = a.dataset.navItem === group && !!group;
   a.classList.toggle('active',active);
   if(active) a.setAttribute('aria-current',a.getAttribute('href')===current?'page':(current==='index.html'?'location':'true'));
   else a.removeAttribute('aria-current');
   if(transient) a.classList.toggle('nav-engaged',active);
  });
 }
 select(body.dataset.navGroup || '');
 nav.forEach(a => a.addEventListener('click',event => {
  if(event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
  a.classList.add('nav-engaged');
  setTimeout(()=>a.classList.remove('nav-engaged'),350);
  const href=a.getAttribute('href'), parts=href.split('#');
  if(parts[0]!==current)return;
  const target=parts[1]?document.getElementById(parts[1]):document.getElementById('main');
  if(!target)return;
  event.preventDefault();
  select(a.dataset.navItem,true);
  if(parts[1])target.scrollIntoView({behavior:motion()?'smooth':'instant',block:'start'});
  else window.scrollTo({top:0,behavior:motion()?'smooth':'instant'});
  // Move keyboard focus to the destination without a second scroll jump.
  if(event.detail===0){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
 }));
 if(current==='index.html') {
  const expertise=document.getElementById('expertise');let pending=false;
  const update=()=>{pending=false;if(!expertise)return;const r=expertise.getBoundingClientRect(),y=(document.getElementById('site-header')?.offsetHeight||88)+110;select(r.top<=y&&r.bottom>y?'expertise':'');};
  window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});
  window.addEventListener('resize',update);update();
 }
})();
