/* ═══════════════════════════════════════════
   FORGEX-NAV.JS — Hamburger menu mobile
   Compatible iOS Safari / Android Chrome
   ═══════════════════════════════════════════ */
(function(){

  var style = document.createElement('style');
  style.textContent = `
    .fx-burger{
      display:none;flex-direction:column;justify-content:center;gap:5px;
      cursor:pointer;background:none;border:none;padding:10px;z-index:400;
      -webkit-tap-highlight-color:transparent;touch-action:manipulation;
      min-width:44px;min-height:44px;
    }
    .fx-burger span{
      display:block;width:24px;height:2px;
      background:rgba(255,255,255,0.7);border-radius:2px;
      transition:all 0.28s ease;pointer-events:none;
    }
    .fx-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);background:#E8192C}
    .fx-burger.open span:nth-child(2){opacity:0}
    .fx-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);background:#E8192C}

    /* Menu — toujours dans le DOM, caché par défaut */
    .fx-mobile-menu{
      position:fixed;
      top:66px;left:0;right:0;bottom:0;
      z-index:350;
      background:rgba(5,5,10,0.97);
      overflow-y:auto;-webkit-overflow-scrolling:touch;
      visibility:hidden;opacity:0;
      transition:opacity 0.25s ease,visibility 0.25s ease;
    }
    .fx-mobile-menu.open{
      visibility:visible;opacity:1;
    }
    .fx-mobile-menu-inner{ padding:8px 0; }
    .fx-mobile-menu-link{
      font-family:'Barlow Condensed',sans-serif;
      font-size:17px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
      color:rgba(242,240,248,0.65);text-decoration:none;
      display:block;padding:18px 28px;
      border-bottom:1px solid rgba(255,255,255,0.05);
      -webkit-tap-highlight-color:transparent;touch-action:manipulation;
    }
    .fx-mobile-menu-link:active,.fx-mobile-menu-link.active{
      color:#FF3D52;background:rgba(232,25,44,0.08);
    }
    .fx-mob-sep{height:1px;background:rgba(255,255,255,0.07);margin:6px 0}
    .fx-mobile-menu-bottom{
      padding:20px 28px 48px;
      display:flex;flex-direction:column;gap:12px;
      border-top:1px solid rgba(255,255,255,0.07);
    }
    .fx-mob-login{
      font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;
      letter-spacing:2px;text-transform:uppercase;color:rgba(242,240,248,0.6);
      text-decoration:none;background:rgba(255,255,255,0.05);
      border:1px solid rgba(255,255,255,0.1);padding:15px;text-align:center;display:block;
      -webkit-tap-highlight-color:transparent;
    }
    .fx-mob-cta{
      font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;
      letter-spacing:2px;text-transform:uppercase;
      color:#FF3D52;background:transparent;
      border:2px solid #E8192C;padding:15px;cursor:pointer;
      -webkit-tap-highlight-color:transparent;touch-action:manipulation;
      width:100%;font-size:14px;
    }
    .fx-mob-cta:active{background:#E8192C;color:#fff}

    @media(max-width:900px){
      .fx-burger{display:flex !important}
      nav .nav-links{display:none !important}
      nav .nav-right{display:none !important}
      nav{padding:0 16px !important}
    }
    @media(min-width:901px){
      .fx-mobile-menu{display:none !important}
    }
  `;
  document.head.appendChild(style);

  function fxLoggedIn(){ return typeof FX !== 'undefined' && FX.isLoggedIn(); }
  function fxUser(){ return typeof FX !== 'undefined' ? FX.getUser() : null; }

  var menuOpen = false;
  var burger, menu, loginEl, ctaEl;

  function build(){
    var nav = document.querySelector('nav');
    if(!nav || nav.querySelector('.fx-burger')) return;

    /* Burger */
    burger = document.createElement('button');
    burger.className = 'fx-burger';
    burger.setAttribute('aria-label','Menu');
    burger.setAttribute('type','button');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    /* Menu */
    menu = document.createElement('div');
    menu.className = 'fx-mobile-menu';
    menu.id = 'fx-mobile-menu';

    /* Liens */
    var inner = document.createElement('div');
    inner.className = 'fx-mobile-menu-inner';

    /* Pages principales */
    var pages = [
      {href:'index.html',      text:'Accueil'},
      {href:'entrainements.html', text:'Entraînements'},
      {href:'nutrition.html',  text:'Nutrition'},
      {href:'coaches.html',    text:'Coaches'},
      {href:'communaute.html', text:'Communauté'},
      {href:'tarifs.html',     text:'Tarifs'},
    ];

    /* Récupérer les liens existants pour marquer l'actif */
    var navLinks = nav.querySelectorAll('.nav-links a');
    var activePath = window.location.pathname.split('/').pop()||'index.html';

    /* Utiliser les liens du nav desktop si disponibles */
    var linkList = navLinks.length > 0
      ? Array.from(navLinks).map(function(a){ return {href:a.getAttribute('href'), text:a.textContent.trim()}; })
      : pages;

    linkList.forEach(function(item){
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;
      a.className = 'fx-mobile-menu-link';
      if(item.href === activePath || (activePath==='' && item.href==='index.html')){
        a.classList.add('active');
      }
      a.addEventListener('click', function(){ closeMenu(); });
      inner.appendChild(a);
    });

    /* Séparateur + Blog & FAQ */
    var sep = document.createElement('div');
    sep.className = 'fx-mob-sep';
    inner.appendChild(sep);

    [{href:'blog.html',text:'📝 Blog'},{href:'faq.html',text:'❓ FAQ'}].forEach(function(item){
      var exists = linkList.some(function(l){ return l.href===item.href; });
      if(exists) return;
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;
      a.className = 'fx-mobile-menu-link';
      a.addEventListener('click', function(){ closeMenu(); });
      inner.appendChild(a);
    });

    menu.appendChild(inner);

    /* Bottom */
    var bottom = document.createElement('div');
    bottom.className = 'fx-mobile-menu-bottom';

    loginEl = document.createElement('a');
    loginEl.className = 'fx-mob-login';
    bottom.appendChild(loginEl);

    ctaEl = document.createElement('button');
    ctaEl.className = 'fx-mob-cta';
    ctaEl.setAttribute('type','button');
    bottom.appendChild(ctaEl);

    menu.appendChild(bottom);
    document.body.appendChild(menu);

    syncAuth();
    setTimeout(syncAuth, 200);
    setTimeout(syncAuth, 800);

    /* Events burger — click ET touchstart pour iOS */
    function toggle(e){
      e.preventDefault();
      e.stopPropagation();
      menuOpen ? closeMenu() : openMenu();
    }
    burger.addEventListener('click', toggle);
    burger.addEventListener('touchstart', function(e){
      e.preventDefault();
      menuOpen ? closeMenu() : openMenu();
    }, {passive:false});

    ctaEl.addEventListener('click', function(){
      closeMenu();
      window.location.href = fxLoggedIn() ? 'dashboard.html' : 'tarifs.html';
    });

    /* Fermer en cliquant sur le fond */
    menu.addEventListener('click', function(e){
      if(e.target === menu) closeMenu();
    });
  }

  function syncAuth(){
    if(!loginEl || !ctaEl) return;
    if(fxLoggedIn()){
      loginEl.textContent = '👤 ' + fxUser();
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

  function openMenu(){
    menuOpen = true;
    if(burger) burger.classList.add('open');
    if(menu)   menu.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative'; /* iOS fix */
  }

  function closeMenu(){
    menuOpen = false;
    if(burger) burger.classList.remove('open');
    if(menu)   menu.classList.remove('open');
    document.body.style.overflow = '';
    document.body.style.position = '';
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

})();
