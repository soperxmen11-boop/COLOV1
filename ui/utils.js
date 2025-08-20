/* Colorinka UPGRADE */
export const $=(sel,root=document)=>root.querySelector(sel);
export const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
export const on=(el,ev,cb,opts)=>el&&el.addEventListener(ev,cb,opts);
export const off=(el,ev,cb,opts)=>el&&el.removeEventListener(ev,cb,opts);
export const session={get:(k,d=null)=>{try{return JSON.parse(sessionStorage.getItem(k))??d;}catch{return d;}},set:(k,v)=>sessionStorage.setItem(k,JSON.stringify(v))};
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

/* COLORINKA UPGRADE: ui sfx */
function playUiSfx(type){
  try{
    if(window.gameSettings && window.gameSettings.sfx===false) return;
    let src='';
    if(type==='click') src='assets/sfx/ui/ui-click.mp3';
    if(type==='popup') src='assets/sfx/ui/ui-popup.mp3';
    if(src){
      const a=new Audio(src); a.volume=0.6; a.play().catch(()=>{});
    }
  }catch(e){}
}
// Attach to all buttons
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('button, .btn').forEach(btn=>{
    btn.addEventListener('click',()=>playUiSfx('click'));
  });
});
// Hook for popups open/close
window.addEventListener('openPopup',()=>playUiSfx('popup'));
window.addEventListener('closePopup',()=>playUiSfx('popup'));
