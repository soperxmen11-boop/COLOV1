(()=>{
  // ---------- Helpers ----------
  const $=id=>document.getElementById(id);
  const show = id => { document.querySelectorAll('.page').forEach(p=>p.classList.remove('active')); $(id).classList.add('active'); };

  function toast(t){ const x=document.createElement('div'); x.className='toast'; x.textContent=t; document.getElementById('toasts').appendChild(x); setTimeout(()=>x.remove(),2200); }

  // ---------- Navigation (isolated) ----------
  document.addEventListener('click', e=>{
    const btn=e.target.closest('[data-nav]');
    if(!btn) return;
    const page=btn.getAttribute('data-nav');
    show(page);
    if(page==='colorPage'){ start('color'); }
    if(page==='mascotPage'){ start('mascot'); }
  });
  show('homePage'); // default

  // ---------- Audio ----------
  let musicVol=parseFloat(localStorage.getItem('cm_music')||'0.18');
  let sfxVol=parseFloat(localStorage.getItem('cm_sfx')||'0.5');
  $('volMusic').value=musicVol; $('volSfx').value=sfxVol;
  $('volMusic').oninput=e=>{ musicVol=parseFloat(e.target.value); localStorage.setItem('cm_music',musicVol); setBg(); };
  $('volSfx').oninput=e=>{ sfxVol=parseFloat(e.target.value); localStorage.setItem('cm_sfx',sfxVol); };
  let muted=false; $('btnMute').onclick=()=>{ muted=!muted; $('btnMute').textContent=muted?'🔇':'🔊'; setBg(); };

  const sfx={};
  ['bg_menu','bg_game','click','coin','yay','error','switch'].forEach(n=>{ const a=new Audio('audio/'+n+'.wav'); a.loop=(n==='bg_menu'||n==='bg_game'); sfx[n]=a; });
  function play(n){ if(muted||!sfx[n]) return; try{ sfx[n].currentTime=0; sfx[n].volume = (n.startsWith('bg')?musicVol:sfxVol); sfx[n].play(); }catch(_){} }
  function stopBg(){ ['bg_menu','bg_game'].forEach(k=>{ try{sfx[k].pause()}catch(_){}}); }
  function setBg(){ ['bg_menu','bg_game'].forEach(k=>{ if(sfx[k]) sfx[k].volume=muted?0:musicVol; }); }
  addEventListener('pointerdown', ()=>{ stopBg(); play('bg_menu'); }, {once:true});

  // ---------- Settings & Theme ----------
  const durationSel=$('duration'), diffSel=$('difficulty'), themeSel=$('theme'), voiceSel=$('voice');
  themeSel.value = localStorage.getItem('cm_theme') || 'blue';
  themeSel.onchange = () => { localStorage.setItem('cm_theme', themeSel.value); toast('Theme: '+themeSel.value); play('switch'); };
  voiceSel.value = localStorage.getItem('cm_voice') || 'en';
  voiceSel.onchange = () => localStorage.setItem('cm_voice', voiceSel.value);

  // ---------- Shop ----------
  let coins = Number(localStorage.getItem('cm_coins')||0); const coinsEl=$('coins'); function setCoins(v){ coins=v; localStorage.setItem('cm_coins',coins); coinsEl.textContent=coins; } setCoins(coins);
  const SHOP=[
    {id:'th_purple', name:'Theme: Purple', emoji:'🟪', type:'theme', value:'purple', price:15},
    {id:'th_teal', name:'Theme: Teal', emoji:'🟩', type:'theme', value:'teal', price:15},
    {id:'m_panda', name:'Mascot: Panda', emoji:'🐼', type:'mascot', value:'🐼', price:12},
    {id:'m_peng', name:'Mascot: Penguin', emoji:'🐧', type:'mascot', value:'🐧', price:12}
  ];
  const unlocked = JSON.parse(localStorage.getItem('cm_unlocked')||'{}');
  function renderShop(){
    const g=$('shopGrid'); g.innerHTML='';
    SHOP.forEach(it=>{
      const el=document.createElement('div'); el.className='shop-item'+(unlocked[it.id]?' unlocked':'');
      el.innerHTML=`<div class="emoji">${it.emoji}</div><b>${it.name}</b><div class="price">🪙 ${it.price}</div><button class="btn">${unlocked[it.id]?'Use':'Unlock'}</button>`;
      el.querySelector('button').onclick=()=>{
        if(unlocked[it.id]){
          if(it.type==='theme'){ themeSel.value=it.value; themeSel.dispatchEvent(new Event('change')); }
          if(it.type==='mascot'){ localStorage.setItem('cm_def_mascot_txt', it.value); toast('Mascot set '+it.value); }
        }else{
          if(coins>=it.price){ setCoins(coins-it.price); unlocked[it.id]=true; localStorage.setItem('cm_unlocked', JSON.stringify(unlocked)); renderShop(); toast('Unlocked!'); play('coin'); }
          else { toast('Not enough coins'); play('error'); }
        }
      };
      g.appendChild(el);
    });
  }
  renderShop();

  // ---------- Game Data ----------
  const COLORS=[{en:'Red',hex:'#ef4444'},{en:'Blue',hex:'#3b82f6'},{en:'Yellow',hex:'#facc15'},{en:'Green',hex:'#22c55e'},{en:'Orange',hex:'#f97316'},{en:'Purple',hex:'#8b5cf6'},{en:'Pink',hex:'#fb7185'},{en:'Brown',hex:'#a16207'},{en:'Black',hex:'#111827'},{en:'White',hex:'#f3f4f6'},{en:'Gray',hex:'#9ca3af'},{en:'Cyan',hex:'#06b6d4'},{en:'Magenta',hex:'#d946ef'},{en:'Turquoise',hex:'#14b8a6'},{en:'Beige',hex:'#f5f5dc'},{en:'Gold',hex:'#f59e0b'},{en:'Silver',hex:'#9ca3af'},{en:'Maroon',hex:'#7f1d1d'},{en:'Olive',hex:'#6b8e23'},{en:'Navy',hex:'#1e3a8a'},{en:'Lime',hex:'#84cc16'},{en:'Teal',hex:'#14b8a6'},{en:'Indigo',hex:'#4338ca'},{en:'Violet',hex:'#7c3aed'},{en:'Peach',hex:'#fec5b7'}];
  const MASCOTS=[{en:'Lion',emoji:'🦁'},{en:'Monkey',emoji:'🐵'},{en:'Cat',emoji:'🐱'},{en:'Dog',emoji:'🐶'},{en:'Panda',emoji:'🐼'},{en:'Owl',emoji:'🦉'},{en:'Penguin',emoji:'🐧'},{en:'Bunny',emoji:'🐇'},{en:'Tiger',emoji:'🐯'},{en:'Elephant',emoji:'🐘'},{en:'Giraffe',emoji:'🦒'},{en:'Zebra',emoji:'🦓'},{en:'Bear',emoji:'🐻'},{en:'Fox',emoji:'🦊'},{en:'Wolf',emoji:'🐺'},{en:'Koala',emoji:'🐨'},{en:'Kangaroo',emoji:'🦘'},{en:'Deer',emoji:'🦌'},{en:'Hippopotamus',emoji:'🦛'},{en:'Rhinoceros',emoji:'🦏'},{en:'Dolphin',emoji:'🐬'},{en:'Whale',emoji:'🐳'},{en:'Shark',emoji:'🦈'},{en:'Turtle',emoji:'🐢'},{en:'Octopus',emoji:'🐙'},{en:'Seal',emoji:'🦭'},{en:'Frog',emoji:'🐸'},{en:'Crocodile',emoji:'🐊'},{en:'Eagle',emoji:'🦅'},{en:'Parrot',emoji:'🦜'},{en:'Flamingo',emoji:'🦩'},{en:'Peacock',emoji:'🦚'},{en:'Duck',emoji:'🦆'},{en:'Chicken',emoji:'🐔'},{en:'Horse',emoji:'🐴'},{en:'Cow',emoji:'🐮'},{en:'Sheep',emoji:'🐑'},{en:'Goat',emoji:'🐐'},{en:'Pig',emoji:'🐷'},{en:'Squirrel',emoji:'🐿️'},{en:'Bat',emoji:'🦇'},{en:'Bee',emoji:'🐝'},{en:'Butterfly',emoji:'🦋'},{en:'Ant',emoji:'🐜'},{en:'Ladybug',emoji:'🐞'},{en:'Mouse',emoji:'🐭'},{en:'Hedgehog',emoji:'🦔'},{en:'Lizard',emoji:'🦎'},{en:'Snake',emoji:'🐍'},{en:'Chameleon',emoji:'🦎'},{en:'Crab',emoji:'🦀'},{en:'Lobster',emoji:'🦞'},{en:'Jellyfish',emoji:'🎐'},{en:'Starfish',emoji:'⭐'}];

  // ---------- Game Core ----------
  let mode='color', time=60, level=1, score=0, best=Number(localStorage.getItem('cm_best_en')||0), pair=null, timer=null, paused=true;
  function hud(){ if(mode==='color'){ $('level').textContent=level; $('time').textContent=Math.ceil(time); $('score').textContent=score; $('best').textContent=best; } else { $('levelM').textContent=level; $('timeM').textContent=Math.ceil(time); $('scoreM').textContent=score; } }

  function speak(name){
    const lang=localStorage.getItem('cm_voice')||'en'; if(lang==='off') return;
    if('speechSynthesis' in window){ const u=new SpeechSynthesisUtterance(name); u.lang=(lang==='ar'?'ar-SA':'en-US'); window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }
  }

  function nextRound(){
    if(mode==='color'){
      const w=COLORS[Math.floor(Math.random()*COLORS.length)];
      const match=Math.random()<0.55;
      const c= match ? w : COLORS[Math.floor(Math.random()*COLORS.length)];
      pair={word:w,color:c};
      $('promptWord').textContent=w.en.toUpperCase();
      $('colorBox').style.background=c.hex;
      speak(c.en);
    } else {
      const w=MASCOTS[Math.floor(Math.random()*MASCOTS.length)];
      const match=Math.random()<0.55;
      const m= match ? w : MASCOTS[Math.floor(Math.random()*MASCOTS.length)];
      pair={word:w,mascot:m};
      $('promptMascot').textContent=w.en.toUpperCase();
      $('emojiBox').textContent=m.emoji;
      speak(w.en);
    }
  }

  function tick(){ if(paused) return; time-=1; hud(); if(time<=0){ endGame(); } }

  function endGame(){
    paused=true; clearInterval(timer); play('bg_menu');
    best=Math.max(best,score); localStorage.setItem('cm_best_en', best);
    toast('Time up! Score: '+score); show('homePage');
  }

  function answer(isMatch){
    if(paused||time<=0) return;
    let ok=false;
    if(mode==='color'){ ok = (pair.word.en===pair.color.en); }
    else { ok = (pair.word.emoji===pair.mascot.emoji); }
    const fb = mode==='color' ? $('feedback') : $('feedbackM');
    if(isMatch===ok){ score++;

// AUTO data-correct mapping for FX hooks
try{
  if (typeof isMatch !== 'undefined') {
    if (typeof btnYes !== 'undefined' && btnYes) btnYes.setAttribute('data-correct', isMatch ? '1':'0');
    if (typeof btnNo  !== 'undefined' && btnNo ) btnNo.setAttribute('data-correct',  isMatch ? '0':'1');
  }
  if (typeof isCorrect !== 'undefined') {
    if (typeof btnYesM !== 'undefined' && btnYesM) btnYesM.setAttribute('data-correct', isCorrect ? '1':'0');
    if (typeof btnNoM  !== 'undefined' && btnNoM ) btnNoM.setAttribute('data-correct',  isCorrect ? '0':'1');
  }
} catch(e){ console.warn('data-correct mapping skipped', e); }

 setCoins(coins+1); play('coin'); fb.textContent='Correct!'; fb.style.color='#22c55e'; }
    else { fb.textContent='Wrong!'; fb.style.color='#ef4444'; play('error'); }
    setTimeout(()=>fb.textContent='', 600);
    hud(); nextRound();
  }

  $('btnYes').onclick=()=>answer(true);
  $('btnNo').onclick=()=>answer(false);
  $('btnYesM').onclick=()=>answer(true);
  $('btnNoM').onclick=()=>answer(false);
  $('btnRestart').onclick=()=>start('color');
  $('btnRestartM').onclick=()=>start('mascot');
  window.addEventListener('keydown', e=>{ if(e.code==='ArrowRight'||e.code==='Enter'){answer(true)} if(e.code==='ArrowLeft'){answer(false)} });

  function start(which){
    mode=which; time=parseInt($('duration').value)||60; level=1; score=0; hud(); nextRound();
    paused=false; clearInterval(timer); timer=setInterval(tick, 1000);
    stopBg(); play('bg_game');
  }

  // ---------- Leaderboard (local) ----------
  function renderLB(){ const lb=JSON.parse(localStorage.getItem('cm_lb')||'[]'); const ol=$('lbList'); ol.innerHTML=''; lb.forEach(e=>{ const li=document.createElement('li'); li.textContent=`[${e.mode}] Score ${e.score} • L${e.level} • ${new Date(e.ts).toLocaleDateString()}`; ol.appendChild(li); }); }
  function addLB(entry){ const lb=JSON.parse(localStorage.getItem('cm_lb')||'[]'); lb.push(entry); lb.sort((a,b)=>b.score-a.score); if(lb.length>10) lb.pop(); localStorage.setItem('cm_lb', JSON.stringify(lb)); renderLB(); }
})();