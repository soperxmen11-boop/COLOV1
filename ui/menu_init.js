(function(){const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
document.addEventListener('DOMContentLoaded',()=>{const home=document.getElementById('homePage');if(!home)return;
if(!document.getElementById('ui-bg')){const bg=document.createElement('div');bg.id='ui-bg';document.body.appendChild(bg);}
const shell=document.createElement('div');shell.id='homeShell';shell.innerHTML=`
  <div id="homeHeader">
    <div class="brand">Colorinka</div>
    <button id="burger" aria-label="Open menu" title="Menu">☰</button>
  </div>
  <div id="choiceGrid">
    <div id="cardColor" class="big-card" role="button" tabindex="0"><div class="ico">🎨</div><div>Color Match</div></div>
    <div id="cardMascot" class="big-card" role="button" tabindex="0"><div class="ico">🐾</div><div>Mascot Match</div></div>
  </div>
  <div id="sideOverlay"></div>
  <aside id="sideDrawer" aria-label="Side menu"><h3>Menu</h3><div id="sideList"></div></aside>`;
home.prepend(shell);

    // audio + glow hooks
    function attachGlowAndClick(el){
      if(!el) return;
      el.classList.add('btn-glow');
      el.addEventListener('click', ()=>{
        if (window.KPAudio){ KPAudio.startIfNeeded(); KPAudio.click(); }
        el.classList.remove('trigger');
        // trigger reflow
        void el.offsetWidth;
        el.classList.add('trigger');
      });
    }
    attachGlowAndClick($('#cardColor'));
    attachGlowAndClick($('#cardMascot'));

const allBtns=$$('#homePage .menu .menu-btn');const colorBtn=allBtns.find(b=>/color/i.test(b.textContent));
const mascotBtn=allBtns.find(b=>/mascot/i.test(b.textContent));const others=allBtns.filter(b=>b!==colorBtn&&b!==mascotBtn);
const hook=(card,btn)=>{if(!btn||!card)return;const act=()=>btn.click();card.addEventListener('click',act);
card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}})};
hook($('#cardColor'),colorBtn);hook($('#cardMascot'),mascotBtn);
const sideList=$('#sideList');others.forEach(b=>{const c=b.cloneNode(true);c.classList.add('from-drawer');sideList.appendChild(c);});
const drawer=$('#sideDrawer'),overlay=$('#sideOverlay'),burger=$('#burger');
function openDrawer(){drawer.classList.add('open');overlay.classList.add('show');}
function closeDrawer(){drawer.classList.remove('open');overlay.classList.remove('show');}
burger.addEventListener('click',openDrawer);overlay.addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();});});})();