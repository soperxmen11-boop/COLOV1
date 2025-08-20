
// ui/timer.js — visual 60s round timer (syncs by starting on first attempt)
(function(){
  const DURATION = 60000; // 60s
  let started = false;
  let startAt = 0;
  let rafId = 0;

  function ensureBar(){
    let bar = document.getElementById('kp-timer');
    if (!bar){
      bar = document.createElement('div');
      bar.id = 'kp-timer';
      bar.innerHTML = '<div class="fill"></div><div class="label">60s</div>';
      document.body.appendChild(bar);
    }
    return bar;
  }

  function start(){
    if (started) return;
    started = true;
    startAt = Date.now();
    const bar = ensureBar();
    bar.classList.remove('hidden');
    tick();
  }

  function stop(){
    started = false;
    if (rafId) /* Colorinka UPGRADE: cancel RAF removed */
    const bar = document.getElementById('kp-timer');
    if (bar) bar.classList.add('hidden');
  }

  function tick(){
    const now = Date.now();
    const elapsed = Math.min(now - startAt, DURATION);
    const remain = Math.max(0, DURATION - elapsed);
    const pct = (elapsed / DURATION) * 100;
    const bar = document.getElementById('kp-timer');
    if (bar){
      const fill = bar.querySelector('.fill');
      const label = bar.querySelector('.label');
      if (fill) fill.style.width = pct + '%';
      if (label) label.textContent = Math.ceil(remain/1000) + 's';
    }
    if (elapsed < DURATION){
      rafId = requestAnimationFrame(tick);
    } else {
      stop();
    }
  }

  // Detect first attempt (like achievements detectors) to sync the start
  function bindDetectors(){
    document.addEventListener('click', (e)=>{
      const el = e.target.closest('[data-correct]');
      if (!el) return;
      if (!started) start();
    }, true);

    const obs = new MutationObserver((muts)=>{
      muts.forEach(m=>{
        if (m.type==='attributes' && m.attributeName==='class'){
          const el = m.target;
          if (!(el instanceof HTMLElement)) return;
          const now = el.className||'';
          if (!started && (now.includes('correct') || now.includes('wrong'))) start();
        }
      });
    });
    obs.observe(document.body, {subtree:true, attributes:true, attributeFilter:['class']});
  }

  // Expose for manual control if needed
  window.KPTimer = { start, stop };

  function init(){
    const bar = ensureBar();
    bar.classList.add('hidden');
    bindDetectors();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
