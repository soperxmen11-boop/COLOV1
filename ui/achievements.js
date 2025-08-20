
// ui/achievements.js — Full achievements system + popups + sounds via WebAudio
(function(){
  const KEY = 'kp-achievements-v1';
  const ACHVS = [
    {id:'beginner', name:'Beginner', desc:'First correct answer', test:(s)=> s.totalCorrect>=1},
    {id:'quick5', name:'Quick Thinker', desc:'5 correct in a row', test:(s)=> s.streak>=5},
    {id:'master10', name:'Master Learner', desc:'10 correct in a row', test:(s)=> s.streak>=10},
    {id:'level5', name:'Level Up Hero', desc:'Reach Level 5', test:(s)=> (window.KPProgress?.getState()?.level||1) >= 5 },
    {id:'color20', name:'Color Champion', desc:'20 correct in Color mode', test:(s)=> s.colorCorrect>=20},
    {id:'mascot20', name:'Mascot Master', desc:'20 correct in Mascot mode', test:(s)=> s.mascotCorrect>=20},
    {id:'perfect', name:'Perfectionist', desc:'Finish a round with 0 mistakes', test:(s)=> s.roundEnded && s.roundWrong===0 && s.roundAttempts>=10},
    {id:'explorer', name:'Explorer', desc:'Play both modes', test:(s)=> s.playedColor && s.playedMascot},
    {id:'combo50', name:'Combo Kid', desc:'Reach 50 score in one round', test:(s)=> s.roundScore>=50},
    {id:'legend10', name:'Legend', desc:'Reach Level 10', test:(s)=> (window.KPProgress?.getState()?.level||1) >= 10 }
  ];

  let store = load() || { unlocked: {} };
  const ROUND_MS = 60000; // 60 seconds cooldown before showing stats
let session = { totalCorrect:0, streak:0, colorCorrect:0, mascotCorrect:0, playedColor:false, playedMascot:false,
                  roundAttempts:0, roundWrong:0, roundScore:0, roundEnded:false, mode:null, inRound:false, roundTimerId:null, roundStartAt:0, roundEndAt:0 };

  function load(){
    try{ return JSON.parse(localStorage.getItem(KEY) || ''); }catch(_){ return null; }
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(store)); }catch(_){ } }

  // WebAudio tiny sounds (no assets)
  function playDing(){
    try{
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type='triangle'; o.frequency.value=880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime+0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.25);
      o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+0.26);
    }catch(_){}
  }

  function toast(msg){
    let t = document.querySelector('.kp-toast');
    if (!t){
      t = document.createElement('div'); t.className='kp-toast';
      document.body.appendChild(t);
    }
    t.innerHTML = `<span class="kp-badge">🏅 ${msg}</span>`;
    t.classList.add('show');
    playDing();
    setTimeout(()=> t.classList.remove('show'), 1600);
  }

  
  function armRoundTimer(){ /* Colorinka UPGRADE: round stats timer removed */ }catch(_){} }
      \1 try{ kpFX.wrong && kpFX.wrong(event?.currentTarget || this); }catch(e){}; \2 \3catch(_){} }
      // reset for next round
      session.inRound = false; session.roundAttempts = 0; session.roundWrong = 0; session.roundScore = 0; session.streak = 0;
      session.roundTimerId = null;
    }, ROUND_MS);
  }

  function checkAll(){
    for (const a of ACHVS){
      if (store.unlocked[a.id]) continue;
      if (a.test(session)){
        store.unlocked[a.id] = Date.now();
        save();
        toast(`${a.name}`);
      }
    }
  }

  // Mode detection helpers
  function setMode(m){
    session.mode = m;
    if (m==='color') session.playedColor = true;
    if (m==='mascot') session.playedMascot = true;
  }
  // Public small API others can call if needed
  window.KPAchv = { setMode };

  // Correct/Wrong detectors
  function bindDetectors(){
    document.addEventListener('click', (e)=>{ const el = e.target.closest('[data-correct]');
      if (!el) return;
      armRoundTimer();
      session.roundAttempts++;
      if (el.getAttribute('data-correct') === '1'){
        session.totalCorrect++; session.streak++; 
        if (session.mode==='color') session.colorCorrect++;
        if (session.mode==='mascot') session.mascotCorrect++;
        session.roundScore = window.KPProgress?.getState()?.score || session.roundScore;
      } \1 try{ kpFX.wrong && kpFX.wrong(event?.currentTarget || this); }catch(e){}; \2 \3
      checkAll();
      checkEndRound();
    }, true);

    // class-based (for Mascot)
    const obs = new MutationObserver((muts)=>{
      muts.forEach(m=>{
        const el = m.target;
        if (el instanceof HTMLElement && el.classList && (el.classList.contains('correct') || el.classList.contains('wrong'))){ armRoundTimer();
          session.roundAttempts++;
          if (el.classList.contains('correct')){
            session.totalCorrect++; session.streak++;
            if (session.mode==='color') session.colorCorrect++;
            if (session.mode==='mascot') session.mascotCorrect++;
            session.roundScore = window.KPProgress?.getState()?.score || session.roundScore;
          } \1 try{ kpFX.wrong && kpFX.wrong(event?.currentTarget || this); }catch(e){}; \2 \3
          checkAll();
          checkEndRound();
        }
      });
    });
    obs.observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['class']});
  }

  // Round end after 10 attempts
  function checkEndRound(){ /* end handled by 60s timer */ }

  // Achievements modal listing
  function ensureAchvModal(){
    let modal = document.getElementById('kp-achv');
    if (modal) return modal;
    modal = document.createElement('div'); modal.id='kp-achv'; modal.className='kp-modal';
    modal.innerHTML = `<div class="kp-card" style="position:relative;">
      <button class="kp-close" aria-label="Close">✖</button>
      <div style="font-weight:900; font-size:22px; display:flex; align-items:center; gap:8px;">🏅 Achievements</div>
      <div class="kp-achv-list"></div>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e)=>{ if (e.target===modal || e.target.classList.contains('kp-close')) modal.classList.remove('open'); });
    return modal;
  }

  function openAchvModal(){
    const modal = ensureAchvModal();
    const list = modal.querySelector('.kp-achv-list');
    list.innerHTML='';
    ACHVS.forEach(a=>{
      const unlocked = !!store.unlocked[a.id];
      const div = document.createElement('div');
      div.className='kp-achv-card';
      div.innerHTML = `<div class="title">${a.name} ${unlocked? '✅':''}</div><div class="desc">${a.desc}</div>`;
      list.appendChild(div);
    });
    modal.classList.add('open');
  }

  // Bind optional menu buttons if exist
  function bindMenu(){
    const sels = ['#achievementsBtn', '.achievements', '[data-action="achievements"]'];
    sels.forEach(sel => document.querySelectorAll(sel).forEach(b=>{
      if (b.dataset.kpAchvBound) return;
      b.dataset.kpAchvBound='1'; b.addEventListener('click', (e)=>{ e.preventDefault(); openAchvModal(); });
    }));
  }

  // Stats modal
  function ensureStats(){ /* Colorinka UPGRADE: stats UI removed */ return null; });
    // actions
    modal.querySelector('#stAchv').addEventListener('click', openAchvModal);
    modal.querySelector('#stRetry').addEventListener('click', ()=> location.reload());
    modal.querySelector('#stMenu').addEventListener('click', ()=> { (window.KPNav && KPNav.goMenu)? KPNav.goMenu() : location.href = '#menu'; });
    return modal;
  }

  function openStats(){ /* Colorinka UPGRADE: stats UI removed */ }

  // Level Up sound (hook KPProgress)
  function hookLevelUpSound(){
    // Monkey-patch KPProgress.setLevel if exists to play a sound on increase
    const P = window.KPProgress;
    if (!P) return;
    const orig = P.setLevel;
    P.setLevel = function(n){
      const prev = (P.getState && P.getState().level) || 1;
      const res = orig.call(P, n);
      const now = (P.getState && P.getState().level) || n;
      if (now > prev) playDing();
      return res;
    }
  }

  // Mode inference from clicks (optional but helps explorer/color/mascot counters)
  function bindMode(){
    document.addEventListener('click', (e)=>{
      const b = e.target.closest('button, [data-action]');
      if (!b) return;
      const t = (b.getAttribute('data-action') || b.id || b.className || b.textContent || '').toLowerCase();
      if (t.includes('color')) setMode('color');
      else if (t.includes('mascot')) setMode('mascot');
    }, true);
  }

  function init(){
    bindDetectors();
    bindMenu();
    bindMode();
    hookLevelUpSound();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


// Colorinka UPGRADE: global guard to disable KPStats if present
window.KPStats = window.KPStats || {};
window.KPStats.open = function(){ /* disabled */ };
