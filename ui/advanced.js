(function(){
  function $(s,r=document){return r.querySelector(s)}
  function $all(s,r=document){return Array.from(r.querySelectorAll(s))}
  function placeMascot(){
    if($('.kp-mascot')) return;
    const img=document.createElement('img');
    img.src='assets/icons/mascot.svg'; img.className='kp-mascot';
    document.body.appendChild(img);
  }
  function glowify(){
    const selectors = ['#mainMenu button', '#menu button', '.menu button', '#startBtn', '.start', '.play'];
    const list = [];
    selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => list.push(el)));
    list.filter(el => !el.closest('.kp-modal')).forEach(el => el.classList.add('kp-glow-btn'));
}
  function setupTransitions(){
    const menu=$('#mainMenu')||$('#menu')||$('.menu');
    const game=$('#game')||$('#gameArea')||$('#playground')||$('.game');
    if(menu) menu.classList.add('kp-screen');
    if(game){ game.classList.add('kp-screen'); if(menu) game.classList.add('kp-out'); }
    $all('#startBtn,.start,.play,button[data-action="start"]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        if(menu) menu.classList.add('kp-out');
        if(game){ game.classList.remove('kp-out'); game.classList.add('kp-in'); }
      });
    });
  }
  function prettySettings(){
    const settings=$('#settingsPanel')||$('#settings')||$('[data-panel="settings"]');
    if(!settings) return; if(settings.closest('.kp-modal')) return;
    const modal=document.createElement('div'); modal.className='kp-modal';
    const card=document.createElement('div'); card.className='kp-card';
    settings.parentNode.insertBefore(modal,settings);
    modal.appendChild(card); card.appendChild(settings);
    $all('#settingsBtn,.settings,[data-action="settings"]').forEach(b=>{
      b.addEventListener('click',(e)=>{e.preventDefault(); modal.classList.toggle('open');});
    });
    modal.addEventListener('click',(e)=>{ if(e.target===modal) modal.classList.remove('open'); });
  }
  function init(){ if(window.__ADV_UI_INIT__) return; window.__ADV_UI_INIT__=1; placeMascot(); glowify(); setupTransitions(); prettySettings(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();