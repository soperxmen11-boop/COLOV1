/* Colorinka UPGRADE */
import { $, $$, on, session } from './utils.js';
const DEFAULTS={duration:60};
let state=Object.assign({},DEFAULTS,session.get('settings',{}));
function save(){ session.set('settings',state); } /* Colorinka UPGRADE */
export function getDuration(){ const n=Number(state.duration); return Number.isFinite(n)&&n>0?n:DEFAULTS.duration; }
export function setDuration(sec){ const n=Number(sec); if(!Number.isFinite(n)||n<=0) return; state.duration=n; save(); reflectUI(); }
function reflectUI(){ const holders=[$('#durationValue'),$('[data-setting="duration-value"]')].filter(Boolean); holders.forEach(el=>el.textContent=String(getDuration())); $$('.duration-option,[data-duration]').forEach(btn=>{ const v=Number(btn.dataset.duration); if(!Number.isFinite(v)) return; const active=v===getDuration(); btn.classList.toggle('is-active',active); btn.setAttribute('aria-pressed',String(active)); }); }
function bindUI(){ const panel=$('#settingsPanel')||document.body; on(panel,'click',(e)=>{ const el=e.target.closest('[data-duration]'); if(!el) return; const v=Number(el.dataset.duration); if(Number.isFinite(v)) setDuration(v); }); panel.addEventListener('change',(e)=>{ const t=e.target; if(t&&t.name==='duration'&&t.type==='radio'&&t.checked){ const v=Number(t.value); if(Number.isFinite(v)) setDuration(v); } }, true); }
document.addEventListener('DOMContentLoaded',()=>{ if(!state.duration) state.duration=DEFAULTS.duration; reflectUI(); bindUI(); });
