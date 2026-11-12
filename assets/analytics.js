/* Existing analytics IDs restored from the supplied production source.
   Never run tracking on file previews, localhost, or staging hosts. */
(() => {
 'use strict';
 if(location.protocol!=='https:'||!['proofcreative.com.au','www.proofcreative.com.au'].includes(location.hostname))return;
 if(navigator.doNotTrack==='1'||window.doNotTrack==='1')return;
 window.dataLayer=window.dataLayer||[];
 window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
 window.gtag('js',new Date());
 window.gtag('config','G-BBBW6MDG21');
 const ga=document.createElement('script');ga.async=true;ga.src='https://www.googletagmanager.com/gtag/js?id=G-BBBW6MDG21';document.head.appendChild(ga);
 window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments);};
 const clarity=document.createElement('script');clarity.async=true;clarity.src='https://www.clarity.ms/tag/z0i3a489xn';document.head.appendChild(clarity);
 document.addEventListener('click',event=>{
  const a=event.target.closest('a[href]');if(!a)return;
  const href=a.getAttribute('href');
  if(href.includes('enquiry.html'))window.gtag('event','cta_click',{button_text:a.textContent.replace(/\s+/g,' ').trim().slice(0,60),page_path:location.pathname});
  if(href.startsWith('tel:'))window.gtag('event','phone_click',{page_path:location.pathname});
 });
})();
