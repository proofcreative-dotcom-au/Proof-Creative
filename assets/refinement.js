/* Genuine-source logo fallback. No tracking, remote widget, or review-count API. */
(() => {
 'use strict';
 document.querySelectorAll('[data-client-logo="sunshine"]').forEach(img => {
  const fallback=img.parentElement.querySelector('.client-logo-fallback');
  const failed=()=>{img.hidden=true;fallback.hidden=false;};
  const loaded=()=>{if(img.naturalWidth){img.hidden=false;fallback.hidden=true;}else failed();};
  img.addEventListener('error',failed);img.addEventListener('load',loaded);
  if(img.complete)loaded();
 });
})();

/* Fit every complete mark at one shared height per testimonial section.
   This accounts for empty borders, the fine Sunshine sunburst and narrow screens. */
(() => {
 'use strict';
 const sections=[...document.querySelectorAll('.client-perspectives')];
 if(!sections.length)return;
 function size(section){
  const images=[...section.querySelectorAll('img.client-logo')];
  let height=80;
  for(const img of images){
   const width=img.naturalWidth||Number(img.getAttribute('width'));
   const sourceHeight=img.naturalHeight||Number(img.getAttribute('height'));
   const available=img.parentElement.clientWidth;
   const scale=img.classList.contains('sunshine-logo')?1.9:1;
   if(width>0&&sourceHeight>0&&available>0)height=Math.min(height,available*sourceHeight/(width*scale));
  }
  // The same variable drives all marks, so a wide logo cannot silently shrink alone.
  height=Math.max(1,Math.floor(height*100)/100);
  const value=height+'px';
  if(section.style.getPropertyValue('--client-logo-height')!==value)section.style.setProperty('--client-logo-height',value);
 }
 let raf=0;
 function update(){raf=0;sections.forEach(size);}
 function schedule(){if(!raf)raf=requestAnimationFrame(update);}
 sections.forEach(section=>{
  section.querySelectorAll('img.client-logo').forEach(img=>img.addEventListener('load',schedule));
 });
 if('ResizeObserver' in window){
  const observer=new ResizeObserver(schedule);
  sections.forEach(section=>section.querySelectorAll('.client-logo-wrap').forEach(el=>observer.observe(el)));
 }
 window.addEventListener('resize',schedule,{passive:true});
 schedule();
})();
