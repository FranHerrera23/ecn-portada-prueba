const lang=document.documentElement.lang;
const words={es:{saving:'Guardando…',newsletter:'Tu suscripción quedó registrada.',consultation:'Tu consulta quedó registrada. El equipo responderá al correo indicado; todavía no hay una reserva ni un cobro.',error:'No pudimos guardar la solicitud. Revisa tu conexión e inténtalo de nuevo.',count:'lecturas',empty:'No hay lecturas con estos filtros.'},ru:{saving:'Сохраняем…',newsletter:'Подписка зарегистрирована.',consultation:'Заявка сохранена. Команда ответит на указанную почту. Это ещё не запись и не оплата.',error:'Не удалось сохранить заявку. Проверьте соединение и повторите попытку.',count:'статей',empty:'По этим условиям статей нет.'},en:{saving:'Saving…',newsletter:'Your subscription has been registered.',consultation:'Your enquiry has been registered. The team will reply by email; no session is booked and no payment has been taken.',error:'We couldn’t save your request. Check your connection and try again.',count:'readings',empty:'No readings match these filters.'}}[lang]??{};
for(const form of document.querySelectorAll('[data-newsletter-form],[data-consultation-form]')){
 let requestId;
 form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;const status=form.querySelector('[role=status]'),button=form.querySelector('button[type=submit]');if(button.disabled)return;button.disabled=true;status.textContent=words.saving;
 const newsletter=form.hasAttribute('data-newsletter-form');const values=Object.fromEntries(new FormData(form));requestId??=crypto.randomUUID();
 try{const response=await fetch(newsletter?'/api/revista-subscribe':'/api/course-payment-help',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newsletter?{email:values.email,consent:values.consent==='on',language:lang}:{email:values.email,social:values.social,language:lang,kind:form.dataset.consultationKind||'private-lessons',requestId})});if(!response.ok)throw Error('request');status.textContent=newsletter?words.newsletter:(form.dataset.consultationKind==='creators'?({es:'Tu consulta quedó registrada. El equipo responderá al correo indicado.',ru:'Заявка сохранена. Команда ответит на указанную почту.',en:'Your enquiry has been registered. The team will reply by email.'}[lang]):words.consultation);form.reset();requestId=undefined;}
 catch{status.textContent=words.error;}finally{button.disabled=false;}
 });
}
const controls=['reading-search','reading-language','reading-format','reading-topic'].map(id=>document.getElementById(id));
if(controls.every(Boolean)){
 const cards=[...document.querySelectorAll('[data-reading]')],status=document.getElementById('reading-count');
 const normal=s=>s.toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
 const keys=['q','language','format','topic'];
 const restore=()=>{const params=new URL(location.href).searchParams;controls.forEach((control,i)=>{control.value=params.get(keys[i])||'';});};
 const apply=(save=true)=>{const [query,language,format,topic]=controls.map(c=>c.value);const terms=normal(query.trim()).split(/\s+/).filter(Boolean);let count=0;for(const card of cards){const search=normal(card.textContent+' '+(card.dataset.search||'')+' '+card.getAttribute('href'));const match=terms.every(term=>search.includes(term))&&(!language||card.dataset.language===language)&&(!format||card.dataset.format===format)&&(!topic||card.dataset.topic===topic);card.hidden=!match;if(match)count++;}status.textContent=count?count+' '+(count===1?({es:'lectura',ru:'материал',en:'reading'}[lang]||words.count):words.count):words.empty;
  if(save){const url=new URL(location.href);controls.forEach((control,i)=>{if(control.value)url.searchParams.set(keys[i],control.value);else url.searchParams.delete(keys[i]);});history.replaceState(history.state,'',url);}
 };
 controls.forEach(c=>c.addEventListener('input',()=>apply()));
 document.getElementById('reading-clear')?.addEventListener('click',()=>{controls.forEach(c=>c.value='');apply();controls[0].focus();});
 window.addEventListener('popstate',()=>{restore();apply(false);});restore();apply(false);
}
