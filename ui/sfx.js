
// ui/sfx.js — tiny WebAudio SFX (correct/wrong/click)
(function(){
  let ctx, gain;
  function ensure(){
    if (!ctx){ ctx = new (window.AudioContext||window.webkitAudioContext)(); gain = ctx.createGain(); gain.gain.value=.35; gain.connect(ctx.destination); }
  }
  function blip(a,b,t){
    ensure();
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine'; o.frequency.value=a;
    g.gain.setValueAtTime(.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.6, ctx.currentTime+.02);
    g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+t);
    o.connect(g); g.connect(gain);
    o.start(); o.frequency.exponentialRampToValueAtTime(b, ctx.currentTime + t*.9);
    o.stop(ctx.currentTime + t);
  }
  function correct(){ blip(880,1320,.18); }
  function wrong(){ blip(220,110,.22); }
  function click(){ blip(900,600,.08); }
  window.KPSfx = { correct, wrong, click };
})();
