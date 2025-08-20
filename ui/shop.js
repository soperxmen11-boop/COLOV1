/* Colorinka UPGRADE */
import { $, on } from './utils.js';
import { sfxClick } from './audio.js';
const btnShop=$('#btnShop'); const shopPanel=$('#shopPanel'); const btnShopClose=$('#btnShopClose')||$('#shopClose');
function openShop(){ if(!shopPanel) return; shopPanel.classList.remove('hidden'); btnShop?.setAttribute('aria-expanded','true'); }
function closeShop(){ if(!shopPanel) return; shopPanel.classList.add('hidden'); btnShop?.setAttribute('aria-expanded','false'); }
document.addEventListener('DOMContentLoaded',()=>{
  on(btnShop,'click',(e)=>{e.preventDefault(); sfxClick(); openShop();});
  on(btnShopClose,'click',(e)=>{e.preventDefault(); closeShop();});
  on(shopPanel,'click',(e)=>{ if(e.target===shopPanel) closeShop(); });
});
