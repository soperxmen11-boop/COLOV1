/* Colorinka UPGRADE */
export const $=(sel,root=document)=>root.querySelector(sel);
export const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
export const on=(el,ev,cb,opts)=>el&&el.addEventListener(ev,cb,opts);
export const off=(el,ev,cb,opts)=>el&&el.removeEventListener(ev,cb,opts);
export const session={get:(k,d=null)=>{try{return JSON.parse(sessionStorage.getItem(k))??d;}catch{return d;}},set:(k,v)=>sessionStorage.setItem(k,JSON.stringify(v))};
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
