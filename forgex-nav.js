/* ═══════════════════════════════════════════
   FORGEX-NAV.JS — Hamburger menu mobile
   Version corrigée — fonctionne sur iOS Safari
   ═══════════════════════════════════════════ */
(function(){

  const style = document.createElement('style');
  style.textContent = `
    .fx-burger{
      display:none;flex-direction:column;justify-content:center;gap:5px;
      cursor:pointer;background:none;border:none;padding:8px;z-index:400;
      -webkit-tap-highlight-color:transparent;touch-action:manipulation;
    }
    .fx-burger span{
      display:block;width:24px;height:2px;
      background:rgba(255,255,255,0.6);border-radius:1px;
      transition:all 0.28s cubic-bezier(0.4,0,0.2,1);
      pointer-events:none;
    }
    .fx-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);background:#E8192C}
    .fx-burger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
    .fx-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);background:#E8192C}

    .fx-mobile-menu{
      position:fixed;top:66px;left:0;right:0;bottom:0;
      z-index:350;
      background:rgba(5,5,10,0.98);
      -webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);
      overflow-y:auto;-webkit-overflow-scrolling:touch;
      transform:translateX(100%);
      transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);
      display:none;
    }
    .fx-mobile-menu.ready{display:block}
    .fx-mobile-menu.open{transform:translateX(0)}

    .fx-mobile-menu-inner{
      padding:8px 0;
      border-bottom:1px solid rgba(255,255,255,0.06);
    }
    .fx-mobile-menu a{
      font-family:'Barlow Condensed',sans-serif;
      font-size:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
      color:rgba(242,240,248,0.6);text-decoration:none;
      display:block;padding:16px 28px;
      border-bottom:1px solid rgba(255,255,255,0.04);
      -webkit-tap-highlight-color:transparent;touch-action:manipulation;
      transition:color 0.2s,background 0.2s;
    }
    .fx-mobile-menu a:active,.fx-mobile-menu a:hover{
      color:#F2F0F8;background:rgba(232,25,44,0.08);
    }
    .fx-mobile-menu a.active{color:#FF3D52}
    .fx-sep{height:1px;background:rgba(255,255,255,0.06);margin:8px 0}
    .fx-mobile-menu-bottom{
      padding:20px 28px 40px;display:flex;flex-direction:column;gap:10px;
    }
    .fx-mob-login{
      font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;
      letter-spacing:2px;text-transform:uppercase;
      color:rgba(242,240,248,0.6);text-decoration:none;
      background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);
      padding:14px;text-align:center;display:block;
      -webkit-tap-highlight-color:transparent;
    }
    .fx-mob-cta{
      font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;
      letter-spacing:2px;text-transform:uppercase;
      color:#FF3D52;background:transparent;
      border:1px solid #E8192C;padding:14px;cursor:pointer;
      box-shadow:0 0 12px rgba(232,25,44,0.2);
      -webkit-tap-highlight-color:transparent;touch-action:manipulation;
      width:100%;
    }
    .fx-mob-cta:active{background:#E8192C;color:#fff}

    @media(max-width:900px){
      .fx-burger{display:flex !important}
      nav .nav-links{display:none !important}
      nav .nav-right{display:none !important}
      nav{padding:0 20px !important}
    }
  `;
  document.head.appendChild(style);

  function fxLoggedIn(){ return typeof FX !== 'undefined' && FX.isLoggedIn(); }
  function fxUser(){ return typeof FX !== 'undefined' ? FX.getUser() : null; }

  var menuOpen = false;

  function inject(){
    var nav = document.querySelector('nav');
    if(!nav || nav.querySelector('.fx-burger')) return;

    /* ── Bouton hamburger ── */
    var burger = document.createElement('button');
    burger.className = 'fx-burger';
    burger.setAttribute('aria-label','Menu');
    burger.setAttribute('type','button');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    /* ── Menu mobile ── */
    var menu = document.createElement('div');
    menu.className = 'fx-mobile-menu';
    menu.id = 'fx-mobile-menu';

    /* Liens nav */
    var inner = document.createElement('div');
    inner.className = 'fx-mobile-menu-inner';

    var navLinks = nav.querySelectorAll('.nav-links a');
    navLinks.forEach(function(a){
      var link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      if(a.classList.contains('active')) link.classList.add('active');
      link.addEventListener('click', function(){ closeMenu(); });
      inner.appendChild(link);
    });

    /* Séparateur + Blog & FAQ */
    var sep = document.createElement('div');
    sep.className = 'fx-sep';
    inner.appendChild(sep);

    var extras = [{href:'blog.html',text:'📝 Blog'},{href:'faq.html',text:'❓ FAQ'}];
    extras.forEach(function(item){
      var already = Array.from(navLinks).some(function(a){ return a.href&&a.href.indexOf(item.href)>-1; });
      if(already) return;
      var link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.text;
      link.addEventListener('click', function(){ closeMenu(); });
      inner.appendChild(link);
    });

    /* Dropdown links si présents */
    var dropLinks = nav.querySelectorAll('.nav-dropdown a');
    dropLinks.forEach(function(a){
      var already = Array.from(inner.querySelectorAll('a')).some(function(l){ return l.href===a.href; });
      if(already) return;
      var link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      link.addEventListener('click', function(){ closeMenu(); });
      inner.appendChild(link);
    });

    menu.appendChild(inner);

    /* Bottom : login + cta */
    var bottom = document.createElement('div');
    bottom.className = 'fx-mobile-menu-bottom';

    var loginEl = document.createElement('a');
    loginEl.className = 'fx-mob-login';
    loginEl.id = 'fx-mob-login-lnk';
    bottom.appendChild(loginEl);

    var ctaEl = document.createElement('button');
    ctaEl.className = 'fx-mob-cta';
    ctaEl.id = 'fx-mob-cta-btn';
    ctaEl.setAttribute('type','button');
    ctaEl.addEventListener('click', function(){
      closeMenu();
      window.location.href = fxLoggedIn() ? 'dashboard.html' : 'tarifs.html';
    });
    bottom.appendChild(ctaEl);
    menu.appendChild(bottom);

    document.body.appendChild(menu);

    /* Rendre visible après insertion dans le DOM */
    requestAnimationFrame(function(){
      menu.classList.add('ready');
    });

    /* ── Sync auth ── */
    function syncNav(){
      if(fxLoggedIn()){
        var user = fxUser();
        loginEl.textContent = '👤 ' + user;
        loginEl.href = 'dashboard.html';
        loginEl.style.color = '#FF3D52';
        ctaEl.textContent = 'Mon espace →';
      } else {
        loginEl.textContent = 'Connexion';
        loginEl.href = 'login.html';
        loginEl.style.color = '';
        ctaEl.textContent = 'Commencer →';
      }
    }
    syncNav();
    setTimeout(syncNav, 100);
    setTimeout(syncNav, 500);

    /* ── Toggle ── */
    burger.addEventListener('click', function(e){
      e.stopPropagation();
      e.preventDefault();
      menuOpen ? closeMenu() : openMenu();
    });

    /* Touch sur burger (iOS) */
    burger.addEventListener('touchend', function(e){
      e.preventDefault();
      e.stopPropagation();
      menuOpen ? closeMenu() : openMenu();
    }, {passive:false});

    /* Fermer en cliquant sur l'overlay */
    menu.addEventListener('click', function(e){
      if(e.target === menu) closeMenu();
    });

    document.addEventListener('keydown', function(e){
      if(e.key==='Escape') closeMenu();
    });
  }

  function openMenu(){
    menuOpen = true;
    var burger = document.querySelector('.fx-burger');
    var menu = document.getElementById('fx-mobile-menu');
    if(burger) burger.classList.add('open');
    if(menu) menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu(){
    menuOpen = false;
    var burger = document.querySelector('.fx-burger');
    var menu = document.getElementById('fx-mobile-menu');
    if(burger) burger.classList.remove('open');
    if(menu) menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
