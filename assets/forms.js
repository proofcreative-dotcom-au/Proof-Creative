/* Production forms. Endpoint IDs are preserved from the supplied original site.
   Formspree is the primary delivery path. HubSpot receives a secondary CRM copy
   only after confirmed Formspree success. No API secret is used in the browser. */
(() => {
 'use strict';
 const HUBSPOT='https://api.hsforms.com/submissions/v3/integration/submit/443370178/385040a1-12c8-4aa1-987a-044a6a2f17ab';
 const PROD_HOSTS=['proofcreative.com.au','www.proofcreative.com.au'];
 const isProduction=PROD_HOSTS.includes(location.hostname)&&location.protocol==='https:';
 const clean=value=>String(value||'').trim();
 async function crmCopy(data,kind){
  const val=n=>clean(data.get(n));
  let message=val('message');
  if(kind==='proof_check') message='PROOF CHECK enquiry\nReview fee: A$1,250 + GST\n\n'+message;
  if(val('product_link'))message+='\n\nProduct / website: '+val('product_link');
  if(val('reference_link'))message+='\nPackaging images: '+val('reference_link');
  const fields=[
   {name:'firstname',value:val('name')},{name:'email',value:val('email')},
   {name:'phone',value:val('phone')},{name:'company',value:val('company')},
   {name:'project_type',value:kind==='proof_check'?'Packaging / Design Realisation':val('type')},
   {name:'indicative_budget',value:val('budget')},{name:'about_the_project',value:message}
  ].filter(f=>f.value);
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
  try{
   const response=await fetch(HUBSPOT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields,context:{pageUri:location.href,pageName:document.title}}),signal:controller.signal});
   if(!response.ok)console.warn('CRM copy was not accepted. The primary enquiry was already accepted by Formspree.');
  }catch(_){console.warn('CRM copy could not be confirmed. The primary enquiry was already accepted by Formspree.');}
  finally{clearTimeout(timeout);}
 }
 document.querySelectorAll('form[data-proof-form]').forEach(form=>{
  const kind=form.dataset.proofForm;const button=form.querySelector('[type=submit]');
  const status=form.querySelector('.form-status');
  const originalButton=button.innerHTML;let pending=false,completed=false;
  function announce(message,type){status.textContent=message;status.dataset.status=type;status.focus({preventScroll:true});}
  form.addEventListener('submit',async event=>{
   event.preventDefault();
   if(pending||completed)return;
   if(!form.reportValidity())return;
   if(!isProduction){
    announce('Local preview only. Nothing has been sent. The enquiry form becomes active on proofcreative.com.au. You can contact carl@proofcreative.com.au directly.','preview');return;
   }
   const data=new FormData(form);
   if(clean(data.get('_gotcha'))){announce('Please check your details and try again.','error');return;}
   pending=true;button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='Sending...';
   status.textContent='';status.removeAttribute('data-status');
   const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
   try{
    const response=await fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'},signal:controller.signal});
    if(!response.ok){
     let problem='The enquiry was not accepted. Please check your details or email carl@proofcreative.com.au.';
     try{const result=await response.json();if(Array.isArray(result.errors))problem=result.errors.map(e=>e.message).filter(Boolean).join(' ')||problem;}catch(_){}
     throw new Error(problem);
    }
    completed=true;
    announce(kind==='proof_check'?'Thanks, your PROOF CHECK enquiry has been sent. Carl will confirm the scope, fee and timing before you book.':'Thanks, your enquiry has been sent. Carl will be in touch to discuss the next steps.','success');
    form.reset();button.textContent='Enquiry sent';button.disabled=true;
    // Tracking follows confirmed delivery, never merely a click or validation event.
    if(typeof window.gtag==='function')window.gtag('event','generate_lead',{form_name:kind,form_location:kind==='proof_check'?'proof_check_page':'enquiry_page'});
    if(typeof window.clarity==='function')window.clarity('event','generate_lead');
    void crmCopy(data,kind);
   }catch(error){
    const uncertain=error.name==='AbortError'||error instanceof TypeError;
    announce(uncertain?'We could not confirm delivery. Your details are still here. Please email carl@proofcreative.com.au or call +61 494 805 533 before resubmitting.':error.message,'error');
    button.innerHTML=originalButton;button.disabled=false;
   }finally{clearTimeout(timeout);pending=false;button.removeAttribute('aria-busy');}
  });
 });
})();
