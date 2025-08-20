
// ui/particles.js — bright stars & shapes moving randomly
(function(){
  const CANVAS_ID = 'bg-canvas';
  function createCanvas(){
    let c = document.getElementById(CANVAS_ID);
    if (c) return c;
    c = document.createElement('canvas');
    c.id = CANVAS_ID;
    Object.assign(c.style, {
      position:'fixed', inset:'0', width:'100vw', height:'100vh',
      zIndex: '-1', pointerEvents:'none'
    });
    document.body.appendChild(c);
    return c;
  }
  function starPath(ctx, r){
    ctx.moveTo(r,0);
    for(let i=0;i<5;i++){
      ctx.lineTo(Math.cos((18+72*i)*Math.PI/180)*r, -Math.sin((18+72*i)*Math.PI/180)*r);
      ctx.lineTo(Math.cos((54+72*i)*Math.PI/180)*r*0.5, -Math.sin((54+72*i)*Math.PI/180)*r*0.5);
    }
  }
  const COLORS = ['#ff6ec7','#ffd166','#06d6a0','#118ab2','#ef476f','#8dff6e','#7b61ff','#00f5d4'];
  let ctx, W, H, particles=[], running=true;
  function init(){
    const c = createCanvas();
    ctx = c.getContext('2d');
    const resize = ()=>{
      W = c.width = window.innerWidth * devicePixelRatio;
      H = c.height = window.innerHeight * devicePixelRatio;
    };
    resize(); window.addEventListener('resize', resize);

    const N = Math.min(140, Math.floor((window.innerWidth*window.innerHeight)/9000));
    particles = Array.from({length:N}).map(()=>{
      const t = ['circle','star','triangle'][Math.floor(Math.random()*3)];
      const r = (Math.random()*8+4) * devicePixelRatio;
      const speed = (Math.random()*0.6+0.2) * devicePixelRatio;
      return {
        t, r,
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()*2-1)*speed,
        vy: (Math.random()*2-1)*speed,
        a: Math.random()*Math.PI*2,
        va: (Math.random()*0.02-0.01),
        color: COLORS[Math.floor(Math.random()*COLORS.length)],
        glow: Math.random()*0.8+0.4
      };
    });

    const step = ()=>{
      if(!running) return;
      ctx.clearRect(0,0,W,H);
      particles.forEach(p=>{
        p.x += p.vx; p.y += p.vy; p.a += p.va;
        if (p.x < -50) p.x = W+50; if (p.x > W+50) p.x = -50;
        if (p.y < -50) p.y = H+50; if (p.y > H+50) p.y = -50;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 18 * p.glow;
        ctx.beginPath();
        if(p.t==='circle'){
          ctx.arc(0,0,p.r,0,Math.PI*2);
        }else if(p.t==='triangle'){
          ctx.moveTo(0,-p.r); ctx.lineTo(p.r, p.r); ctx.lineTo(-p.r, p.r); ctx.closePath();
        }else{ // star
          starPath(ctx, p.r); ctx.closePath();
        }
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(step);
    };
    step();

    document.addEventListener('visibilitychange', ()=>{
      running = (document.visibilityState === 'visible');
      if (running) requestAnimationFrame(step);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
