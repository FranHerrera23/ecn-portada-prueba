/* Public interactions only. Account state belongs to the authenticated campus. */
(() => {
 const lang=document.documentElement.lang;
 const words={es:['Escuchar la guitarra','Detener la guitarra','No se pudo reproducir','Enlace copiado','Copia la dirección del navegador'],ru:['Послушать гитару','Остановить гитару','Не удалось воспроизвести','Ссылка скопирована','Скопируйте адрес из строки браузера'],en:['Listen to the guitar','Stop the guitar','Audio unavailable','Link copied','Copy the address from your browser']}[lang]||[];
 const menu=document.getElementById('main-menu'),trigger=document.getElementById('menu-open');
 if(menu&&trigger){
  trigger.setAttribute('aria-controls',menu.id);
  trigger.addEventListener('click',()=>{menu.showModal();trigger.setAttribute('aria-expanded','true');});
  menu.querySelector('[data-close]')?.addEventListener('click',()=>menu.close());
  menu.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');trigger.focus({preventScroll:true});});
  menu.addEventListener('click',event=>{
   const rect=menu.getBoundingClientRect();
   if(event.target===menu&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))menu.close();
   if(event.target.closest('a')?.getAttribute('href')?.startsWith('#'))menu.close();
  });
 }
 let media={};try{media=JSON.parse(document.getElementById('media-data')?.textContent||'{}');}catch{}
 if(media.audio){
  const audio=new Audio(media.audio);audio.preload='none';
  const buttons=[...document.querySelectorAll('[data-sound]')];
  const update=()=>buttons.forEach(button=>{button.setAttribute('aria-pressed',String(!audio.paused));const label=button.querySelector('span');if(label)label.textContent=words[audio.paused?0:1];});
  ['play','pause','ended'].forEach(event=>audio.addEventListener(event,update));
  buttons.forEach(button=>button.addEventListener('click',async()=>{if(audio.paused){try{await audio.play();}catch{const label=button.querySelector('span');if(label)label.textContent=words[2];}}else audio.pause();}));
 }
 if(!document.querySelector('script[src="/reader.js"]')){
  document.querySelectorAll('[data-print]').forEach(button=>button.addEventListener('click',()=>window.print()));
  document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);button.textContent=words[3];}catch{button.textContent=words[4];}}));
 }
})();
