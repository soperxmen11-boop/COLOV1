/* Colorinka UPGRADE */
import { $, on } from './utils.js';
const statsBtn=$('#btnStats'); const statsPanel=$('#statsPanel');
let inGame=false;
export function setInGame(flag){ inGame=!!flag; if(statsBtn?.dataset.inGameDisabled==='true'){ statsBtn.disabled=inGame; statsBtn.setAttribute('aria-disabled',String(inGame)); } }
function openStats(){ if(inGame) return; statsPanel?.classList.remove('hidden'); }
function closeStats(){ statsPanel?.classList.add('hidden'); }
document.addEventListener('DOMContentLoaded',()=>{
  on(statsBtn,'click',(e)=>{e.preventDefault(); openStats();});
  on($('#statsClose'),'click',(e)=>{e.preventDefault(); closeStats();});
});
