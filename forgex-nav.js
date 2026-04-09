(function(){

/* CSS injecté */
var style = document.createElement('style');
style.textContent = `
  .fxbtn{
    display:none!important;
    flex-direction:column;gap:6px;
    background:#111;border:1px solid #333;
    padding:10px 12px;cursor:pointer;
    position:relative;z-index:99999;
    -webkit-tap-highlight-color:transparent;
    min-width:44px;min-height:44px;
    align-items:center;justify-content:center;
  }
  .fxbtn span{
    display:block;width:22px;height:2px;
    background:#fff;pointer-events:none;
  }
  @media(max-width:900px){
    .fxbtn{display:flex!important}
    nav .nav-links{display:none!important}
    nav .nav-right{display:none!important}
    nav{padding:0 12px!important}
  }

  #fxoverlay{
    display:none;
    position:fixed;
    inset:0;
    width:100vw;height:100vh;
    background:#050508;
    z-index:999999;
    overflow-y:scroll;
    -webkit-overflow-scrolling:touch;
    top:0;left:0;right:0;bottom:0;
  }
  #fxoverlay.show{display:block!important}

  #fxoverlay ul{
    list-style:none;margin:0;padding:80px 0 0;
  }
  #fxoverlay ul li a{
    display:block;
    color:#fff!important;
    font-size:22px;font-weight:800;
    letter-spacing:3px;text-transform:uppercase;
    text-decoration:none!important;
    padding:20px 28px;
    border-bottom:1px solid #1a1a2e;
    font-family:Arial,sans-serif;
  }
  #fxoverlay ul li a:active,
  #fxoverlay ul li a:focus{
    background:#E8192C22;
    color:#FF3D52!important;
  }
  #fxclose{
    position:fixed;
    top:14px;right:14px;
    z-index:9999999;
    width:48px;height:48px;
    background:#222;border:2px solid #444;
    color:#fff;font-size:24px;
    cursor:pointer;border-radius:8px;
    display:none;
    align-items:center;justify-content:center;
    -webkit-tap-highlight-color:transparent;
    font-family:Arial,sans-serif;
    line-height:1;
  }
  #fxclose.show{display:flex!important}

  #fxoverlay .fxbottom{
    padding:24px 28px 80px;
    display:flex;flex-direction:column;gap:12px;
    border-top:1px solid #1a1a2e;
    margin-top:16px;
  }
  #fxoverlay .fxbottom a,
  #fxoverlay .fxbottom button{
    display:block;width:100%;
    text-align:center;
    font-size:16px;font-weight:700;
    letter-spacing:2px;text-transform:uppercase;
    padding:16px 20px;
    font-family:Arial,sans-serif;
    cursor:pointer;
    -webkit-tap-highlight-color:transparent;
    text-decoration:none;
  }
  #fxoverlay .fxbottom a{
    color:#fff!important;
    border:1px solid #333;
    background:#111;
    box-sizing:border-box;
  }
  #fxoverlay .fxbottom button{
    color:#FF3D52;
    border:2px solid #E8192C;
    background:none;
  }
`;
document.head.appendChild(style);

/* ── Overlay ── */
var overlay = document.createElement('div');
overlay.id = 'fxoverlay';

var closeBtn = document.createElement('button');
closeBtn.id = 'fxclose';
closeBtn.textContent = '✕';
closeBtn.type = 'button';
document.body.appendChild(closeBtn);

/* ── Liste de liens ── */
var ul = document.createElement('ul');

var PAGES = [
  ['index.html','Accueil'],
  ['entrainements.html','Entraînements'],
  ['nutrition.html','Nutrition'],
  ['coaches.html','Coaches'],
  ['communaute.html','Communauté'],
  ['tarifs.html','Tarifs'],
  ['blog.html','Blog'],
  ['faq.html','FAQ'],
];

var cur = (window.location.pathname.split('/').pop()||'index.html');

PAGES.forEach(function(p){
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.href = p[0];
  a.textContent = p[1];
  if(p[0] === cur) a.style.color = '#FF3D52';
  a.addEventListener('click', fermer);
  li.appendChild(a);
  ul.appendChild(li);
});

overlay.appendChild(ul);

/* ── Auth bottom ── */
var bottom = document.createElement('div');
bottom.className = 'fxbottom';

var aLogin = document.createElement('a');
aLogin.id = 'fx-mob-la';
bottom.appendChild(aLogin);

var btnCta = document.createElement('button');
btnCta.type = 'button';
btnCta.id = 'fx-mob-cta';
btnCta.addEventListener('click', function(){
  fermer();
  var ok = typeof FX!=='undefined' && FX.isLoggedIn();
  window.location.href = ok ? 'dashboard.html' : 'tarifs.html';
});
bottom.appendChild(btnCta);
overlay.appendChild(bottom);
document.body.appendChild(overlay);

/* ── Burger dans la nav ── */
function injectBurger(){
  var nav = document.querySelector('nav');
  if(!nav || nav.querySelector('.fxbtn')) return;
  var btn = document.createElement('button');
  btn.className = 'fxbtn';
  btn.type = 'button';
  btn.setAttribute('aria-label','Menu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    overlay.classList.contains('show') ? fermer() : ouvrir();
  });
  nav.appendChild(btn);
}

function ouvrir(){
  overlay.classList.add('show');
  closeBtn.classList.add('show');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  syncAuth();
}

function fermer(){
  overlay.classList.remove('show');
  closeBtn.classList.remove('show');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', fermer);

function syncAuth(){
  var la = document.getElementById('fx-mob-la');
  var ct = document.getElementById('fx-mob-cta');
  if(!la || !ct) return;
  var ok = typeof FX!=='undefined' && FX.isLoggedIn();
  var u  = ok && typeof FX!=='undefined' ? FX.getUser() : null;
  la.textContent = u ? '👤 '+u : 'Connexion';
  la.href = u ? 'dashboard.html' : 'login.html';
  ct.textContent = u ? 'Mon espace →' : 'Commencer →';
}

/* ── Init ── */
function init(){
  injectBurger();
  syncAuth();
  setTimeout(syncAuth, 500);
  setTimeout(syncAuth, 1500);
}

document.readyState==='loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();

})();
