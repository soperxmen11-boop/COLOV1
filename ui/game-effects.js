
// ui/game-effects.js — stars on correct only (no backgrounds)
(function(){
  function starBurst(x, y, n=3){
    for (let i=0;i<n;i++){
      const s = document.createElement('div');
      s.className = 'kp-star'; s.textContent = '⭐';
      s.style.left = (x + (Math.random()*24-12)) + 'px';
      s.style.top  = (y + (Math.random()*10-5)) + 'px';
      document.body.appendChild(s);
      setTimeout(()=> s.remove(), 1300);
    }
  }

  // By data-correct attribute
  function bindByAttribute(){
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-correct]');
      if (!btn) return;
      if (btn.getAttribute('data-correct') !== '1') return;
      const r = btn.getBoundingClientRect();
      starBurst(r.left + r.width/2, r.top + r.height/2, 3);
    }, true);
  }

  // Also by .correct class mutations (for modes that toggle classes)
  function bindByClass(){
    const obs = new MutationObserver((muts)=>{
      muts.forEach(m=>{
        const el = m.target;
        if (el instanceof HTMLElement && el.classList && el.classList.contains('correct')){
          const r = el.getBoundingClientRect();
          starBurst(r.left + r.width/2, r.top + r.height/2, 3);
        }
        m.addedNodes && m.addedNodes.forEach(n=>{
          if (n instanceof HTMLElement && n.classList && n.classList.contains('correct')){
            const r = n.getBoundingClientRect();
            starBurst(r.left + r.width/2, r.top + r.height/2, 3);
          }
        });
      });
    });
    obs.observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['class']});
  }

  function init(){
    bindByAttribute();
    bindByClass();
    // expose API if needed
    window.KPEffects = { starBurst };
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
