/* ECN V07. Progressive motion; content remains readable without scripts. */
(() => {
 const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
 let lenis=null,context=null;
 const setup=()=>{
  if(reduce.matches||!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  context=gsap.context(()=>{
   if(window.Lenis&&fine.matches){
    lenis=new Lenis({duration:1.45,smoothWheel:true,wheelMultiplier:.8,syncTouch:false,anchors:false,prevent:n=>n.closest?.('dialog,textarea,select,[data-lenis-prevent]')});
    lenis.on('scroll',ScrollTrigger.update);
    const tick=t=>lenis?.raf(t*1000);gsap.ticker.add(tick);
    contextCleanup=()=>gsap.ticker.remove(tick);
   }
   document.querySelectorAll('main>.section,main>.newsletter-v4,.natali-chapter,.natali-archive,.private-v3,main>article>section,main>article>.prose,.intro,.reading-grid,.module-grid-v5').forEach(section=>{
    const children=[...section.children].filter(el=>!el.matches('script,.scene-track,.proof-grid,.testimonial-archive-v6'));
    if(section.getBoundingClientRect().top<innerHeight*.8)return;
    gsap.fromTo(children,{y:22,opacity:1},{y:0,opacity:1,ease:'none',stagger:.06,scrollTrigger:{trigger:section,start:'top 96%',end:'top 72%',scrub:.75,invalidateOnRefresh:true}});
   });
   if(innerWidth>760)document.querySelectorAll('.hero-day-photo img,.private-v3>.photo img').forEach(img=>{
    gsap.fromTo(img,{scale:1.04,yPercent:-1.5},{scale:1.04,yPercent:1.5,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:1}});
   });
  });
 };
 let contextCleanup=()=>{};
 const clean=()=>{contextCleanup();context?.revert();context=null;lenis?.destroy();lenis=null;};
 setup();reduce.addEventListener('change',()=>{clean();setup();});
 document.addEventListener('click',event=>{
  const a=event.target.closest('a[href^="#"]');if(!a||event.defaultPrevented)return;
  const id=a.hash.slice(1),target=document.getElementById(decodeURIComponent(id));if(!target)return;
  event.preventDefault();
  const offset=[...document.querySelectorAll('.top,.product-nav')].reduce((n,e)=>n+e.getBoundingClientRect().height,0)+22;
  const top=target.getBoundingClientRect().top+scrollY-offset;
  if(lenis)lenis.scrollTo(top,{duration:1.25});else scrollTo({top,behavior:reduce.matches?'instant':'smooth'});
  history.replaceState(null,'',a.hash);target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
 });
 const dialog=document.getElementById('main-menu');
 if(dialog)new MutationObserver(()=>dialog.open?lenis?.stop():lenis?.start()).observe(dialog,{attributes:true,attributeFilter:['open']});
 const refresh=()=>{lenis?.resize();window.ScrollTrigger?.refresh();};
 document.addEventListener('toggle',refresh,true);document.fonts?.ready.then(refresh);
 document.querySelectorAll('img').forEach(i=>{if(!i.complete)i.addEventListener('load',refresh,{once:true});});
 const grid=document.querySelector('.reading-grid');
 if(grid)new MutationObserver(()=>{grid.classList.toggle('is-filtered',[...grid.children].some(c=>c.hidden));refresh();}).observe(grid,{subtree:true,attributes:true,attributeFilter:['hidden']});
 document.querySelectorAll('.languages a').forEach(a=>{if(a.lang===root.lang)a.setAttribute('aria-current','true');});
 window.ECNExperience={version:'7',refresh,get smooth(){return !!lenis;},get reduced(){return reduce.matches;}};
 addEventListener('pagehide',clean);addEventListener('pageshow',event=>{if(event.persisted){clean();setup();refresh();}});
})();

/* Native horizontal overflow: never reinterpret vertical wheel or touch gestures. */
for(const track of document.querySelectorAll('.scene-track')){
 track.removeAttribute('data-lenis-prevent');
 track.addEventListener('keydown',e=>{
  if(e.target!==track||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();const step=track.firstElementChild.getBoundingClientRect().width+24;
  const left=e.key==='Home'?0:e.key==='End'?track.scrollWidth:track.scrollLeft+(e.key==='ArrowRight'?step:-step);
  track.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 });
}
const demo=document.querySelector('[data-campus-demo]');
if(demo){
 const buttons=[...demo.querySelectorAll('[data-demo-view]')],panels=[...demo.querySelectorAll('[data-demo-panel]')];
 function show(name){buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demoView===name)));panels.forEach(p=>p.hidden=p.dataset.demoPanel!==name);window.ECNExperience?.refresh();}
 buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.demoView)));
 demo.querySelector('[data-demo-resume]')?.addEventListener('click',()=>{show('lessons');demo.querySelector('[data-demo-panel="lessons"] h2').focus({preventScroll:true});});
 const parts=[...demo.querySelectorAll('[data-demo-part]')];
 parts.forEach(b=>b.addEventListener('click',()=>{parts.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));demo.querySelector('[data-demo-part-label]').textContent=b.textContent;}));
}
