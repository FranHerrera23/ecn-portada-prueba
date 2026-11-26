/* ECN: first 90 seconds from source 01:10, explicit pause preference persists. */
(()=>{
 const button=document.querySelector('[data-hero-music]'); if(!button)return;
 const words={es:['Activar música','Pausar música','No se pudo cargar el audio'],ru:['Включить музыку','Выключить музыку','Не удалось загрузить аудио'],en:['Play music','Pause music','Audio could not load']}[document.documentElement.lang]||['Play music','Pause music','Audio could not load'];
 const audio=new Audio('/assets/mundo/hero-guitar-v08.mp3'); audio.loop=true;audio.preload='metadata';audio.volume=.3;
 let preference='on',busy=false,interacted=false;
 try{preference=localStorage.getItem('ecn:hero-music')||'on'}catch{}
 const label=button.querySelector('span');
 const update=()=>{button.setAttribute('aria-pressed',String(!audio.paused));label.textContent=words[audio.paused?0:1];button.dataset.state=audio.paused?'paused':'playing'};
 const play=async()=>{if(busy)return;busy=true;try{await audio.play()}catch{update()}finally{busy=false}};
 const removeFallback=()=>{document.removeEventListener('pointerdown',fallback);document.removeEventListener('keydown',fallback)};
 const fallback=e=>{if(preference==='off'||e.target.closest('[data-hero-music]'))return;if(e.type==='keydown'&&!['Enter',' '].includes(e.key))return;interacted=true;removeFallback();play()};
 button.addEventListener('click',()=>{removeFallback();interacted=true;if(audio.paused){preference='on';play()}else{preference='off';audio.pause()}try{localStorage.setItem('ecn:hero-music',preference)}catch{}});
 ['play','pause','ended'].forEach(e=>audio.addEventListener(e,update));
 audio.addEventListener('error',()=>{label.textContent=words[2];button.dataset.state='error'});
 let resume=false;
 document.addEventListener('visibilitychange',()=>{if(document.hidden){resume=!audio.paused;audio.pause()}else if(resume&&preference!=='off'){resume=false;play()}});
 addEventListener('pagehide',()=>{audio.pause();removeFallback()});
 update();
 if(preference!=='off'){play();document.addEventListener('pointerdown',fallback);document.addEventListener('keydown',fallback)}
 window.ECNMusic={audio,get preference(){return preference}};
})();