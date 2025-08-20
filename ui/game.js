/* KIDS PRO UPGRADE (fallback) */
import { $, clamp } from './utils.js';
import { musicStart, musicStop, sfxClick } from './audio.js';
import { setInGame } from './stats.js';
import { getDuration } from './settings.js';
/* KIDS PRO UPGRADE: round seconds removed */ /* KIDS PRO UPGRADE */
const barFill = document.querySelector('.timer-bar__fill');
const popup = document.getElementById('endPopup');
const popupTitle = document.getElementById('endPopupTitle');
const popupSubtitle = document.getElementById('endPopupSubtitle');
let score=0, roundActive=false, startTs=0, rafId=null;
/* KIDS PRO UPGRADE: progress bar removed */
/* KIDS PRO UPGRADE: timer loop removed */
export function addScore(d=1){ if(!roundActive) return; score+=d; }
export function startRound(){
  ROUND_SECONDS = (typeof getDuration==='function' ? getDuration() : 60);
 if(roundActive) return; ROUND_SECONDS=getDuration(); score=0; roundActive=true; setInGame(true); startTs=performance.now(); /* KIDS PRO UPGRADE: cancel RAF removed */ musicStart(); /* KIDS PRO UPGRADE: RAF removed */   startTs = performance.now();
  try{ cancelAnimationFrame(rafId);}catch{}
  setCircleProgress(ROUND_SECONDS);
  rafId = requestAnimationFrame(loop);
}
function endRound(){
  /* KIDS PRO UPGRADE: stop circle timer */
  try{ cancelAnimationFrame(rafId);}catch{};
 if(!roundActive) return; roundActive=false; setInGame(false); /* KIDS PRO UPGRADE: cancel RAF removed */ musicStop(); const passed=score>=10; if(popup){ popupTitle.textContent=passed?'Mission Passed':'Game Over'; popupSubtitle.textContent=`Score: ${score}`; popup.classList.remove('hidden'); } }
function closeEndPopup(){ popup?.classList.add('hidden'); }
document.addEventListener('DOMContentLoaded',()=>{ const btnStart=document.getElementById('btnStart'); const btnEndClose=document.getElementById('endPopupClose'); btnStart?.addEventListener('click',(e)=>{e.preventDefault(); sfxClick(); closeEndPopup(); startRound();}); btnEndClose?.addEventListener('click',(e)=>{e.preventDefault(); closeEndPopup();}); });

/* KIDS PRO UPGRADE: circle timer helpers */
function setCircleProgress(remaining){
  const total = ROUND_SECONDS || 60;
  const pct = Math.max(0, Math.min(1, remaining / total));
  const CIRC = 339.292;
  const offset = CIRC * (1 - pct);
  if (circleFg){ 
    circleFg.style.strokeDashoffset = String(offset);
    circleFg.classList.remove('ok','warn','crit');
    if (pct <= 0.20) circleFg.classList.add('crit');
    else if (pct <= 0.50) circleFg.classList.add('warn');
    else circleFg.classList.add('ok');
  }
  if (timerLabel){ timerLabel.textContent = String(Math.ceil(remaining)); }
}
function loop(now){
  const elapsed = (now - startTs)/1000;
  const rem = Math.max(0, ROUND_SECONDS - elapsed);
  setCircleProgress(rem);
  if (rem <= 0){ try{ cancelAnimationFrame(rafId); }catch{}; endRound(); return; }
  rafId = requestAnimationFrame(loop);
}

/* KIDS PRO UPGRADE: FX helper */
window.kpFX = (function(){
  function addOnce(el, cls, ms=400){
    if(!el) return;
    el.classList.add(cls);
    setTimeout(()=>el.classList.remove(cls), ms);
  }
  function confettiFrom(el, count=16){
    try{
      const rect = el.getBoundingClientRect();
      let layer = document.querySelector('.kp-confetti-layer');
      if(!layer){
        layer = document.createElement('div');
        layer.className = 'kp-confetti-layer';
        document.body.appendChild(layer);
      }
      for(let i=0;i<count;i++){
        const p = document.createElement('div');
        p.className='kp-confetti';
        const colors=['#FFD54F','#4587FF','#2ED5A2','#FFFFFF'];
        p.style.background = colors[i%colors.length];
        p.style.left = (rect.left + rect.width/2) + 'px';
        p.style.top  = (rect.top + rect.height/2) + 'px';
        layer.appendChild(p);
        const dx = (Math.random()*2-1)*80;
        const dy = - (40 + Math.random()*80);
        const rot= (Math.random()*360);
        const dur= 600 + Math.random()*500;
        p.animate([
          { transform:`translate(0,0) rotate(0deg)`, opacity:1 },
          { transform:`translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity:0 }
        ], { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }).onfinish = ()=> p.remove();
      }
      setTimeout(()=>{ if(layer && !layer.children.length) layer.remove(); }, 1400);
    }catch(e){}
  }
  return {
    correct(el){ addOnce(el,'kp-correct',280); confettiFrom(el,16); },
    wrong(el){ addOnce(el,'kp-wrong',380); }
  };
})();
