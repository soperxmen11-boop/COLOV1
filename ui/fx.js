
// ui/fx.js — effects API + auto-hook via data-correct
(function(){
  function $(s, r=document){ return r.querySelector(s); }
  function rand(a,b){ return Math.random()*(b-a)+a; }
  const COLORS = ['#fff','#ff6ec7','#ffd166','#06d6a0','#118ab2','#ef476f','#8dff6e','#7b61ff','#00f5d4'];

  function burst(where){
    const host = typeof where==='string' ? $(where) : (where || document.body);
    if(!host) return;
    const box = document.createElement('div'); box.className='kp-burst'; box.style.zIndex=10;
    for(let i=0;i<18;i++){
      const p=document.createElement('div'); p.className='p';
      p.style.background = COLORS[Math.floor(Math.random()*COLORS.length)];
      p.style.setProperty('--dx', `${rand(-160,160)}px`);
      p.style.setProperty('--dy', `${rand(-120,120)}px`);
      box.appendChild(p);
    }
    host.appendChild(box);
    setTimeout(()=>box.remove(), 900);
  }
  function shake(where){
    const host = typeof where==='string' ? $(where) : (where || document.body);
    if(!host) return; host.classList.add('kp-wrong'); setTimeout(()=> host.classList.remove('kp-wrong'), 420);
  }
  function scoreBump(sel){ const el = $(sel); if(!el) return; el.classList.add('kp-score-bump'); setTimeout(()=>el.classList.remove('kp-score-bump'), 360); }

  window.KPFx = { burst, shake, scoreBump };

  // Auto-hook: buttons with data-correct="1|0"
  document.addEventListener('click', (e)=>{
    const b = e.target.closest('[data-correct]');
    if(!b) return;
    if (b.getAttribute('data-correct')==='1'){ if (window.KPSfx) KPSfx.correct(); burst('#gameArea') || burst(); }
    else { if (window.KPSfx) KPSfx.wrong(); shake('#gameArea') || shake(); }
  });
})();
