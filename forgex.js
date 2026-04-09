(function(){
'use strict';

/* ══════════════════════════════════════════
   PATCH CSS — fonds transparents
══════════════════════════════════════════ */
function patchCSS(){
  const s=document.createElement('style');
  s.textContent=`
    #fx-canvas{position:fixed!important;top:0;left:0;width:100%!important;height:100%!important;z-index:0!important;pointer-events:none!important;}
    body>*:not(#fx-canvas):not(#fx-overlay):not(#fx-transition){position:relative;z-index:1;}
    body{background:#05050A!important;}
    body::before{content:'';position:fixed;inset:0;z-index:0;
      background-image:linear-gradient(rgba(232,25,44,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,25,44,0.025) 1px,transparent 1px);
      background-size:44px 44px;pointer-events:none;}
    body::after{content:'';position:fixed;inset:0;z-index:0;
      background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.016) 2px,rgba(0,0,0,0.016) 4px);
      pointer-events:none;}
    .hero,.hero-left,.section,.split,.split-l,.split-section{background:transparent!important;}
    .section.alt,.split-r,.pricing,.ticker,.page-hero,.plans-section,.compare-section,.faq-section,.login-left,.login-right{background:rgba(5,5,10,0.40)!important;backdrop-filter:blur(4px)!important;}
    .cta{background:rgba(5,5,10,0.50)!important;backdrop-filter:blur(5px)!important;}
    footer{background:rgba(5,5,10,0.68)!important;backdrop-filter:blur(8px)!important;}
    nav{background:rgba(5,5,10,0.80)!important;backdrop-filter:blur(20px)!important;}
    .mod,.prog,.pcard,.plan-card,.chart,.hstat{background:rgba(10,10,20,0.58)!important;backdrop-filter:blur(12px)!important;}
    .mod:hover,.prog:hover,.pcard:hover,.plan-card:hover{background:rgba(15,15,28,0.74)!important;}
    .pcard.feat,.plan-card.featured{background:rgba(20,12,32,0.82)!important;}
    .modules-grid,.progs,.pricing-grid,.hstats{background:rgba(255,255,255,0.022)!important;}
  `;
  document.head.appendChild(s);
}

/* ══════════════════════════════════════════
   CANVAS — Particules cosmiques (Peptoids)
══════════════════════════════════════════ */
function initCanvas(){
  if(document.getElementById('fx-canvas'))return;
  var canvas=document.createElement('canvas');
  canvas.id='fx-canvas';
  document.body.insertBefore(canvas,document.body.firstChild);
  var ctx=canvas.getContext('2d');
  var W,H,particles=[],stars=[],shootingStars=[];
  var mouse={x:-9999,y:-9999};
  var REPEL=120,ATTRACT=200;
  function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
  window.addEventListener('resize',resize); resize();
  window.addEventListener('mousemove',function(e){ mouse.x=e.clientX; mouse.y=e.clientY; });
  for(var i=0;i<180;i++) stars.push({x:Math.random()*2000,y:Math.random()*2000,r:Math.random()*1.2,a:Math.random()});
  function mkP(){
    var cols=['rgba(232,25,44,','rgba(192,38,211,','rgba(232,121,249,'];
    var c=cols[Math.floor(Math.random()*cols.length)];
    return {x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,r:Math.random()*2+0.5,a:Math.random()*0.5+0.1,color:c,pulse:Math.random()*Math.PI*2,burst:false,life:1};
  }
  for(var j=0;j<60;j++) particles.push(mkP());
  window.addEventListener('click',function(e){
    if(e.target.closest('a,button,input,label,select,textarea'))return;
    for(var k=0;k<12;k++){
      var b=mkP(); b.x=e.clientX; b.y=e.clientY;
      var a=(Math.PI*2/12)*k, sp=2+Math.random()*3;
      b.vx=Math.cos(a)*sp; b.vy=Math.sin(a)*sp; b.r=Math.random()*3+1; b.a=0.9; b.burst=true; b.life=1;
      particles.push(b);
    }
  });
  function mkStar(){ var a=Math.PI/6+Math.random()*Math.PI/6,sp=12+Math.random()*10; return {x:Math.random()*W*1.2,y:Math.random()*H*0.4,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,len:80+Math.random()*120,life:1,decay:0.012+Math.random()*0.01}; }
  function scheduleStar(){ setTimeout(function(){ shootingStars.push(mkStar()); scheduleStar(); },4000+Math.random()*5000); }
  scheduleStar();
  var t=0;
  function draw(){
    ctx.clearRect(0,0,W,H); t+=0.008;
    stars.forEach(function(s){ ctx.beginPath(); ctx.arc(s.x%W,s.y%H,s.r,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,'+(s.a*(0.4+0.3*Math.sin(t*0.3+s.x)))+')'; ctx.fill(); });
    for(var si=shootingStars.length-1;si>=0;si--){
      var ss=shootingStars[si]; ss.x+=ss.vx; ss.y+=ss.vy; ss.life-=ss.decay;
      if(ss.life<=0||ss.x>W+200||ss.y>H+200){ shootingStars.splice(si,1); continue; }
      var mag=Math.sqrt(ss.vx*ss.vx+ss.vy*ss.vy);
      var tx=ss.x-(ss.vx/mag)*ss.len, ty=ss.y-(ss.vy/mag)*ss.len;
      var g=ctx.createLinearGradient(ss.x,ss.y,tx,ty);
      g.addColorStop(0,'rgba(255,255,255,'+ss.life+')'); g.addColorStop(0.3,'rgba(232,150,220,'+(ss.life*0.6)+')'); g.addColorStop(1,'rgba(192,38,211,0)');
      ctx.beginPath(); ctx.moveTo(ss.x,ss.y); ctx.lineTo(tx,ty); ctx.strokeStyle=g; ctx.lineWidth=1.5*ss.life; ctx.stroke();
      ctx.beginPath(); ctx.arc(ss.x,ss.y,2*ss.life,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,'+ss.life+')'; ctx.fill();
    }
    for(var pi=particles.length-1;pi>=0;pi--){
      var p=particles[pi];
      if(p.burst){ p.life-=0.025; p.vx*=0.96; p.vy*=0.96; if(p.life<=0){ particles.splice(pi,1); continue; } p.a=p.life*0.9; }
      var dx=mouse.x-p.x, dy=mouse.y-p.y, dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<REPEL&&dist>0){ var f=(REPEL-dist)/REPEL; p.vx-=(dx/dist)*f*0.8; p.vy-=(dy/dist)*f*0.8; }
      else if(dist<ATTRACT&&dist>REPEL){ var pl=(dist-REPEL)/(ATTRACT-REPEL); p.vx+=(dx/dist)*pl*0.1; p.vy+=(dy/dist)*pl*0.1; }
      p.vx*=0.98; p.vy*=0.98; p.x+=p.vx; p.y+=p.vy; p.pulse+=0.03;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      var al=p.a*(0.6+0.4*Math.sin(p.pulse));
      if(dist<REPEL){ ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-p.vx*8,p.y-p.vy*8); ctx.strokeStyle=p.color+(al*0.4)+')'; ctx.lineWidth=p.r*0.6; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.color+al+')'; ctx.fill();
      var gr=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
      gr.addColorStop(0,p.color+(al*0.3)+')'); gr.addColorStop(1,p.color+'0)');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*5,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill();
    }
    if(mouse.x>0){ var glow=ctx.createRadialGradient(mouse.x,mouse.y,0,mouse.x,mouse.y,80); glow.addColorStop(0,'rgba(232,25,44,0.06)'); glow.addColorStop(1,'rgba(232,25,44,0)'); ctx.beginPath(); ctx.arc(mouse.x,mouse.y,80,0,Math.PI*2); ctx.fillStyle=glow; ctx.fill(); }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════
   TRANSITION ENTRE PAGES
   Rideau noir + barre LED qui balaye l'écran
══════════════════════════════════════════ */
function initTransitions(){
  if(document.getElementById('fx-transition'))return;

  /* Injecter le style */
  const style=document.createElement('style');
  style.textContent=`
    /* ── RIDEAU DE TRANSITION ── */
    #fx-transition{
      position:fixed; inset:0; z-index:99999;
      pointer-events:none;
      display:flex; align-items:center; justify-content:center;
    }

    /* Deux panneaux qui s'ouvrent / se ferment */
    .fx-panel{
      position:absolute; top:0; bottom:0; width:50%;
      background:#05050A;
      transition:transform 0.55s cubic-bezier(0.76,0,0.24,1);
    }
    .fx-panel-l{ left:0; transform:translateX(-100%); }
    .fx-panel-r{ right:0; transform:translateX(100%); }

    /* État FERME (sortie de page) */
    #fx-transition.closing .fx-panel-l{ transform:translateX(0); }
    #fx-transition.closing .fx-panel-r{ transform:translateX(0); }

    /* Barre LED au centre quand fermé */
    .fx-ledbar{
      position:absolute; top:50%; left:0; right:0;
      height:2px; transform:translateY(-50%);
      background:linear-gradient(90deg,transparent,#E8192C 20%,#E879F9 50%,#C026D3 80%,transparent);
      box-shadow:0 0 18px rgba(232,25,44,0.9),0 0 40px rgba(192,38,211,0.7);
      opacity:0;
      transition:opacity 0.2s;
    }
    #fx-transition.closing .fx-ledbar{ opacity:1; transition:opacity 0.15s 0.2s; }

    /* Logo au centre */
    .fx-logo{
      position:relative; z-index:2;
      font-family:'Bebas Neue',sans-serif;
      font-size:52px; letter-spacing:12px;
      color:rgba(242,240,248,0.0);
      transition:color 0.3s 0.2s;
      pointer-events:none;
    }
    .fx-logo em{ font-style:normal; color:rgba(232,25,44,0.0); transition:color 0.3s 0.2s; }
    #fx-transition.closing .fx-logo{ color:rgba(242,240,248,0.08); }
    #fx-transition.closing .fx-logo em{ color:rgba(232,25,44,0.22); }

    /* Entrée de page — fade + slide */
    body.fx-entering{
      animation: fxPageIn 0.6s cubic-bezier(0.4,0,0.2,1) both;
    }
    @keyframes fxPageIn{
      0%  { opacity:0; transform:translateY(20px); }
      100%{ opacity:1; transform:translateY(0); }
    }
  `;
  document.head.appendChild(style);

  /* Créer le rideau */
  const el=document.createElement('div');
  el.id='fx-transition';
  el.innerHTML=`
    <div class="fx-panel fx-panel-l"></div>
    <div class="fx-panel fx-panel-r"></div>
    <div class="fx-ledbar"></div>
    <div class="fx-logo">FORGE<em>X</em></div>
  `;
  document.body.appendChild(el);

  /* Entrée : animer la page au chargement */
  document.body.classList.add('fx-entering');

  /* Clic sur lien interne → fermer le rideau puis naviguer */
  document.addEventListener('click',function(e){
    /* Ne pas intercepter si c'est un bouton, card, ou élément interactif non-lien */
    if(e.target.closest('[onclick]')) return;
    if(e.target.closest('button:not([data-nav])')) return;

    const a=e.target.closest('a[href]');
    if(!a) return;
    const h=a.getAttribute('href');
    if(!h||h.startsWith('#')||h.startsWith('mailto:')||h.startsWith('tel:')||a.target==='_blank') return;
    if(h.startsWith('http')&&!h.includes(window.location.hostname)) return;

    e.preventDefault();
    el.classList.add('closing');
    setTimeout(function(){ window.location.href=h; },620);
  });
}

/* ══════════════════════════════════════════
   FONDU AU SCROLL — sections qui apparaissent
   Chaque section fade-in + slide-up
   quand elle entre dans le viewport
══════════════════════════════════════════ */
function initScrollFade(){
  const style=document.createElement('style');
  style.textContent=`
    /* Éléments à animer au scroll */
    .fx-fade{
      opacity: 0;
      transform: translateY(40px);
      transition:
        opacity  0.75s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .fx-fade.visible{
      opacity: 1;
      transform: translateY(0);
    }

    /* Variante : slide depuis la gauche */
    .fx-fade-left{
      opacity:0;
      transform:translateX(-40px);
      transition:opacity 0.75s cubic-bezier(0.4,0,0.2,1),transform 0.75s cubic-bezier(0.4,0,0.2,1);
    }
    .fx-fade-left.visible{ opacity:1; transform:translateX(0); }

    /* Variante : slide depuis la droite */
    .fx-fade-right{
      opacity:0;
      transform:translateX(40px);
      transition:opacity 0.75s cubic-bezier(0.4,0,0.2,1),transform 0.75s cubic-bezier(0.4,0,0.2,1);
    }
    .fx-fade-right.visible{ opacity:1; transform:translateX(0); }
  `;
  document.head.appendChild(style);

  /* Appliquer les classes aux bons éléments */
  const fadeUp=[
    '.s-head','.section-header',
    '.ticker',
    '.modules-grid','.mod',
    '.progs','.prog',
    '.pricing-grid','.pcard','.plan-card',
    '.cta',
    '.faq-item',
    '.compare-table','.compare-title-wrap',
    '.faq-title-wrap',
    '.page-hero',
    '.plans-section > *',
    '.hero-eyebrow','.hero-h1','.hero-sub','.hero-actions',
    '.feats','.chart',
    '.foot-top','.foot-btm',
  ];

  const fadeLeft=['.split-l','.ll-content','.login-left'];
  const fadeRight=['.split-r','.login-right .login-form-wrap'];

  function applyFade(selectors,cls){
    selectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el,i){
        if(!el.classList.contains('fx-fade')&&
           !el.classList.contains('fx-fade-left')&&
           !el.classList.contains('fx-fade-right')){
          el.classList.add(cls);
          /* Décalage en cascade léger pour les grilles */
          el.style.transitionDelay=(i%6)*0.08+'s';
        }
      });
    });
  }

  applyFade(fadeUp,'fx-fade');
  applyFade(fadeLeft,'fx-fade-left');
  applyFade(fadeRight,'fx-fade-right');

  /* Observer */
  const obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.08, rootMargin:'0px 0px -30px 0px'});

  document.querySelectorAll('.fx-fade,.fx-fade-left,.fx-fade-right')
    .forEach(function(el){ obs.observe(el); });
}

/* ══ INIT ══ */
function init(){
  patchCSS();
  initTransitions();
  initScrollFade();
}

document.readyState==='loading'
  ?document.addEventListener('DOMContentLoaded',init)
  :init();

})();
