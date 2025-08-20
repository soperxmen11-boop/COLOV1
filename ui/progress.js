
// ui/progress.js — Score + Levels with auto-detection for correct answers
(function(){
  function $(s, r=document){ return r.querySelector(s); }
  function $all(s, r=document){ return Array.from(r.querySelectorAll(s)); }

  const STORE_KEY = 'kp-progress-state-v1';
  const DEFAULTS = { score: 0, level: 1, correctCount: 0, perLevel: 5, pointsPerCorrect: 10 };

  let state = load() || DEFAULTS;

  function load(){
    try{ return JSON.parse(sessionStorage.getItem(STORE_KEY) || ''); }catch(_){ return null; }
  }
  function save(){ try{ sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); }catch(_){ } }

  function ensureUI(){
    if ($('#kp-progress')) return;
    const box = document.createElement('div');
    box.id = 'kp-progress';
    box.innerHTML = `
      <div class="pill level">📶 <span>Level</span> <span class="val" id="kpLevelVal">1</span></div>
      <div class="pill score">🏆 <span>Score</span> <span class="val" id="kpScoreVal">0</span></div>
    `;
    document.body.appendChild(box);
  }

  function render(){
    ensureUI();
    const lv = $('#kpLevelVal'), sc = $('#kpScoreVal');
    if (lv) lv.textContent = state.level;
    if (sc) sc.textContent = state.score;
  }

  function addScore(points){
    state.score = Math.max(0, state.score + (points|0));
    render(); save();
    // pulse score
    const sc = $('#kpScoreVal'); if (sc){ sc.classList.remove('kp-pulse'); void sc.offsetWidth; sc.classList.add('kp-pulse'); }
  }

  function addCorrect(){
    addScore(state.pointsPerCorrect);
    state.correctCount += 1;
    if (state.correctCount >= state.perLevel){
      state.correctCount = 0;
      state.level += 1;
      render(); save();
      const lv = $('#kpLevelVal'); if (lv){ lv.classList.remove('kp-pulse'); void lv.offsetWidth; lv.classList.add('kp-pulse'); }
      if (window.KPSfx && typeof KPSfx.correct === 'function'){ try{ KPSfx.correct(); }catch(_){ } }
    }
  }

  // Detect correct answers (by data-correct and .correct class like our effects)
  function bindDetectors(){
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-correct]');
      if (!btn) return;
      if (btn.getAttribute('data-correct') === '1'){ addCorrect(); }
    }, true);

    const obs = new MutationObserver((muts)=>{
      muts.forEach(m=>{
        const el = m.target;
        if (el instanceof HTMLElement && el.classList && el.classList.contains('correct')){ addCorrect(); }
        if (m.addedNodes) m.addedNodes.forEach(n=>{
          if (n instanceof HTMLElement && n.classList && n.classList.contains('correct')){ addCorrect(); }
        });
      });
    });
    obs.observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['class']});
  }

  function reset(){ state = {...DEFAULTS}; render(); save(); }

  // public API
  window.KPProgress = {
    addScore, addCorrect, reset,
    setLevel: (n)=>{ state.level = Math.max(1, n|0); render(); save(); },
    setScore: (n)=>{ state.score = Math.max(0, n|0); render(); save(); },
    getState: ()=> ({...state})
  };

  function init(){
    ensureUI(); render(); bindDetectors();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
