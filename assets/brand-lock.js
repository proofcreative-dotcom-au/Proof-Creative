/* Edition 09: one approved type palette. No headline switch or stored overrides. */
(()=>{'use strict';const root=document.documentElement;
root.dataset.proofType='barlow';root.dataset.proofIcons='on';root.dataset.headline='instrument';
function fitHero(){const h=document.getElementById('hero-title');if(!h)return;h.style.removeProperty('font-size');const w=h.clientWidth,lines=[...h.querySelectorAll('.word-line>span')],widest=Math.max(0,...lines.map(e=>e.getBoundingClientRect().width));if(w>0&&widest>w){h.style.fontSize=(Math.floor(parseFloat(getComputedStyle(h).fontSize)*w/widest*100)/100)+'px';}}
function notify(){const faces=document.fonts?[...document.fonts]:[],needs=['Barlow','Barlow Condensed','Instrument Sans'];const missing=needs.filter(n=>!faces.some(f=>f.family.replace(/["']/g,'')===n&&f.status==='loaded'));try{parent.postMessage({channel:'proof-brand-review',type:'fonts',headline:'instrument',loaded:!missing.length,missing},'*');}catch(e){}}
window.ProofBrandReview={notify,fitHero};requestAnimationFrame(()=>{fitHero();notify();});
if(document.fonts){document.fonts.ready.then(()=>{fitHero();notify();});document.fonts.addEventListener('loadingdone',()=>{fitHero();notify();});}
window.addEventListener('resize',fitHero,{passive:true});
const fold=document.querySelector('.proof-fold');if(fold&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&root.dataset.motion!=='off'){setTimeout(()=>{if(root.dataset.motion==='off')return;fold.classList.add('fold-arrival');fold.addEventListener('animationend',()=>fold.classList.remove('fold-arrival'),{once:true});},650);}

})();
