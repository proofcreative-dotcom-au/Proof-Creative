/* PROOF / Edition 03. Real assets, native scrolling and progressive motion. */
(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const motion = () => root.dataset.motion !== 'off' && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const asset = path => typeof window.proofAsset === 'function' ? window.proofAsset(path) : path;
  const readSession = key => { try { return sessionStorage.getItem(key); } catch (_) { return null; } };
  const storeSession = (key, value) => { try { sessionStorage.setItem(key, value); } catch (_) {} };
  const removeSession = key => { try { sessionStorage.removeItem(key); } catch (_) {} };
  let transitioning = false;
  const pointer = document.querySelector('.project-pointer');

  // A directed page change, never a pretend loading screen.
  const arrived = window.PROOF_ENTERING || readSession('proof-edition-arriving');
  removeSession('proof-edition-arriving');
  if (arrived && motion()) {
    const label = document.getElementById('transition-label');
    if (label) label.textContent = body.dataset.projectTitle || (body.classList.contains('work-page') ? 'The project index.' : 'Creative thinking, precisely realised.');
    body.classList.add('page-entering');
    setTimeout(() => body.classList.remove('page-entering'), 200);
  }
  const navigate = (href, animate = false) => {
    if (typeof window.proofNavigate === 'function') window.proofNavigate(href, { animate });
    else window.location.assign(href);
  };
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.hasAttribute('download') || anchor.target === '_blank') return;
    const href = anchor.getAttribute('href');
    if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href) || !href.split('#')[0].endsWith('.html')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (transitioning) return;
    // Ordinary navigation and CTAs are immediate. Only a project image gets
    // the short signature transition, on pointer devices with motion enabled.
    const projectLink = anchor.matches('.hero-image-button,.work-image,.collection-image,.next-link,.archive-card');
    const useTransition = motion() && fine.matches && projectLink;
    if (!useTransition) {
      removeSession('proof-edition-arriving');
      navigate(href, false);
      return;
    }
    transitioning = true;
    pointer?.classList.remove('visible');
    storeSession('proof-edition-arriving', '1');
    body.classList.add('page-leaving');
    setTimeout(() => navigate(href, true), 140);
    // Fail open on cancelled navigation or restored browser history.
    setTimeout(() => { transitioning = false; body.classList.remove('page-leaving'); }, 650);
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) { transitioning = false; body.classList.remove('page-leaving','page-entering'); }
  });

  // A contextual image hint accompanies, but never replaces, the native cursor.
  let pointerFrame = 0, px = 0, py = 0;
  document.addEventListener('pointermove', event => {
    if (!pointer || !fine.matches || !motion() || transitioning || document.querySelector('dialog[open]')) return;
    const target = event.target.closest('[data-pointer]');
    if (!target) { pointer.classList.remove('visible'); return; }
    pointer.querySelector('span').textContent = target.dataset.pointer;
    px = Math.min(event.clientX + 20, window.innerWidth - 190);
    py = Math.min(event.clientY + 20, window.innerHeight - 70);
    pointer.classList.add('visible');
    if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
      pointer.style.transform = `translate3d(${px}px,${py}px,0)`;
      pointerFrame = 0;
    });
  }, { passive: true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) pointer?.classList.remove('visible'); });
  document.addEventListener('keydown', () => pointer?.classList.remove('visible'));
  window.addEventListener('scroll', () => pointer?.classList.remove('visible'), { passive: true });
  document.querySelectorAll('[data-depth]').forEach(frame => {
    frame.addEventListener('pointermove', event => {
      if (!fine.matches || !motion()) return;
      const r = frame.getBoundingClientRect();
      frame.style.setProperty('--depth-x', `${(event.clientX-r.left-r.width/2)/r.width*12}px`);
      frame.style.setProperty('--depth-y', `${(event.clientY-r.top-r.height/2)/r.height*12}px`);
    }, { passive: true });
    frame.addEventListener('pointerleave', () => {
      frame.style.setProperty('--depth-x','0px'); frame.style.setProperty('--depth-y','0px');
    });
  });

  // Footer is a quiet final reveal, not a looping logo animation.
  const revealNodes = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: .06 });
    revealNodes.forEach(node => observer.observe(node));
  } else revealNodes.forEach(node => node.classList.add('in-view'));

  // Registration aperture and running film number follow the native scroll sequence.
  const feature = document.querySelector('.cinematic-feature');
  if (feature) {
    const frames = [...feature.querySelectorAll('.feature-frame')];
    const number = feature.querySelector('.film-index');
    const sync = () => {
      const index = Math.max(0, frames.findIndex(f => f.classList.contains('active')));
      number.textContent = String(index+1).padStart(2,'0');
    };
    const observer = new MutationObserver(sync);
    frames.forEach(f => observer.observe(f,{attributes:true,attributeFilter:['class']}));
    sync();
  }

  // Sticky chapter links show where the reader is, without moving the scroll position.
  const chapters = document.querySelector('.chapter-sticky');
  const chapterLinks = chapters ? [...chapters.querySelectorAll('a[data-chapter]')] : [];
  const storySections = chapterLinks.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  let scrollFrame = 0;
  function scrollUpdate() {
    if (feature && window.innerWidth > 760 && motion()) {
      const r = feature.getBoundingClientRect();
      const approaching = clamp((window.innerHeight-r.top) / window.innerHeight,0,1);
      feature.style.setProperty('--aperture',`${Math.round(42*(1-approaching))}px`);
    }
    if (chapters && storySections.length) {
      const headerHeight = document.getElementById('site-header')?.offsetHeight || 88;
      const threshold = headerHeight + chapters.offsetHeight + 90;
      let active = 0;
      storySections.forEach((section,index) => { if (section.getBoundingClientRect().top <= threshold) active=index; });
      chapterLinks.forEach((a,index) => {
        a.classList.toggle('active',index===active);
        if (index===active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
      });
      const first = storySections[0].getBoundingClientRect();
      const last = storySections[storySections.length-1].getBoundingClientRect();
      const progress = clamp((threshold-first.top) / Math.max(1,last.bottom-first.top),0,1);
      chapters.style.setProperty('--story-progress',`${progress*100}%`);
    }
  }
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame=requestAnimationFrame(() => { scrollUpdate(); scrollFrame=0; });
  }, {passive:true});
  window.addEventListener('resize',scrollUpdate);
  scrollUpdate();

  // A short native horizontal rail. Mouse wheel and touch behavior are not hijacked.
  const rail = document.querySelector('.archive-rail');
  if (rail) {
    const prev = document.querySelector('[data-rail="prev"]');
    const next = document.querySelector('[data-rail="next"]');
    const update = () => { prev.disabled=rail.scrollLeft<4; next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-4; };
    [prev,next].forEach(button => button.addEventListener('click',() => {
      const distance = (rail.querySelector('.archive-card')?.getBoundingClientRect().width || rail.clientWidth)*1.06;
      rail.scrollBy({left:button===prev?-distance:distance,behavior:motion()?'smooth':'instant'});
    }));
    rail.addEventListener('scroll',update,{passive:true}); window.addEventListener('resize',update);update();
  }

  // Index layout changes use a bounded FLIP treatment and preserve keyboard focus.
  const collection = document.getElementById('project-collection');
  if (collection) {
    document.querySelectorAll('[data-view],[data-filter]').forEach(control => {
      control.addEventListener('click', () => {
        if (!motion()) return;
        const before = new Map([...collection.querySelectorAll('.collection-item')].filter(x => !x.hidden).map(x => [x,x.getBoundingClientRect()]));
        requestAnimationFrame(() => {
          [...collection.querySelectorAll('.collection-item')].filter(x => !x.hidden).forEach((item,i) => {
            const now=item.getBoundingClientRect(),previous=before.get(item);
            const dx=previous?clamp(previous.left-now.left,-120,120):0;
            const dy=previous?clamp(previous.top-now.top,-80,80):20;
            item.animate([{transform:`translate(${dx}px,${dy}px)`,opacity:.45},{transform:'translate(0,0)',opacity:1}],{duration:480,delay:Math.min(i*18,100),easing:'cubic-bezier(.16,1,.3,1)'});
          });
        });
      }, {capture:true});
    });
  }

  // Maker's view: magnify the exact source pixel under the inspection point.
  const stage = document.getElementById('loupe-stage');
  if (stage) {
    const image = document.getElementById('maker-image');
    const glass = stage.querySelector('.loupe-glass');
    const lens = stage.querySelector('.loupe-lens');
    const toggle = document.getElementById('inspect-toggle');
    const plates = [
      {src:'assets/gin-detail.webp',alt:'Close-up of Proof Gin\'s label with the original wordmark and fine construction lines',name:'The mark',caption:'Label study'},
      {src:'assets/construction.webp',alt:'The original Proof wordmark construction study on tracing paper',name:'The construction',caption:'Identity construction'},
      {src:'assets/gin-angled.webp',alt:'The supplied angled view of the Proof Gin bottle and label',name:'The form',caption:'Bottle study'}
    ];
    let pinned=false, hovering=false, nx=.55, ny=.53, plate=0;
    function positionLens(){
      if(!image.naturalWidth || !image.naturalHeight) return;
      const width=stage.clientWidth,height=stage.clientHeight,half=lens.offsetWidth/2;
      const x=clamp(nx*width,half+4,width-half-4),y=clamp(ny*height,half+4,height-half-4);
      stage.style.setProperty('--lens-x',`${x}px`);stage.style.setProperty('--lens-y',`${y}px`);
      const scale=Math.min(width/image.naturalWidth,height/image.naturalHeight);
      const dw=image.naturalWidth*scale,dh=image.naturalHeight*scale;
      const ox=(width-dw)/2,oy=(height-dh)/2;
      glass.style.backgroundImage=`url("${image.currentSrc || image.src}")`;
      glass.style.backgroundSize=`${dw*2}px ${dh*2}px`;
      glass.style.backgroundPosition=`${half-(x-ox)*2}px ${half-(y-oy)*2}px`;
    }
    function show(){
      stage.classList.toggle('inspecting',pinned||hovering);
      toggle.setAttribute('aria-pressed',String(pinned));
      toggle.innerHTML=pinned?'Close detail <span aria-hidden="true">\u00d7</span>':'Inspect detail <span aria-hidden="true">+</span>';
      positionLens();
    }
    function locate(event){
      const r=stage.getBoundingClientRect();nx=clamp((event.clientX-r.left)/r.width,0,1);ny=clamp((event.clientY-r.top)/r.height,0,1);positionLens();
    }
    stage.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse' && fine.matches){hovering=true;locate(event);show();}});
    stage.addEventListener('pointermove',event=>{if(event.pointerType==='mouse' && fine.matches)locate(event);},{passive:true});
    stage.addEventListener('pointerleave',()=>{hovering=false;show();});
    stage.addEventListener('click',event=>{locate(event);pinned=true;show();});
    toggle.addEventListener('click',()=>{pinned=!pinned;hovering=false;show();});
    stage.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();pinned=false;hovering=false;show();return;}
      if(event.key==='Enter'||event.key===' '){event.preventDefault();pinned=!pinned;hovering=false;show();return;}
      if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
        event.preventDefault();pinned=true;
        if(event.key==='ArrowLeft')nx-=.055;if(event.key==='ArrowRight')nx+=.055;
        if(event.key==='ArrowUp')ny-=.055;if(event.key==='ArrowDown')ny+=.055;
        nx=clamp(nx,0,1);ny=clamp(ny,0,1);show();
      }
    });
    document.querySelectorAll('[data-plate]').forEach(button=>button.addEventListener('click',()=>{
      plate=Number(button.dataset.plate);
      document.querySelectorAll('[data-plate]').forEach(b=>{const on=b===button;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
      stage.classList.add('plate-changing');
      image.src=asset(plates[plate].src);image.alt=plates[plate].alt;
      document.getElementById('maker-image-label').textContent=String(plate+1).padStart(2,'0')+' / '+plates[plate].name;
      document.getElementById('maker-plate').textContent='Plate '+String(plate+1).padStart(2,'0')+' / '+plates[plate].caption;
      const finish=()=>{positionLens();stage.classList.remove('plate-changing');};
      if(image.decode)image.decode().then(finish).catch(finish);else finish();
    }));
    image.addEventListener('load',positionLens);window.addEventListener('resize',positionLens);show();
  }

  document.getElementById('replay-opening')?.addEventListener('click',()=>{
    window.scrollTo({top:0,behavior:'instant'});
    body.classList.add('replaying');
    requestAnimationFrame(()=>requestAnimationFrame(()=>body.classList.remove('replaying')));
  });
  window.addEventListener('proof:motion',()=>{
    if (!motion()) {
      pointer?.classList.remove('visible');
      body.classList.remove('page-entering','page-leaving');
      revealNodes.forEach(node=>node.classList.add('in-view'));
    }
    scrollUpdate();
  });
})();
