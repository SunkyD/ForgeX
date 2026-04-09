/* ═══════════════════════════════════════════
   FORGEX-NAV.JS — Menu mobile simplifié
   ═══════════════════════════════════════════ */
(function(){

  /* CSS minimal et robuste */
  var style = document.createElement('style');
  style.textContent = `
    .fx-burger{
      display:none;flex-direction:column;gap:6px;
      cursor:pointer;background:none;border:none;
      padding:8px;-webkit-tap-highlight-color:transparent;
    }
    .fx-burger span{
      display:block;width:26px;height:3px;
      background:#fff;border-radius:2px;
      transition:all 0.3s;pointer-events:none;
    }
    .fx-burger.open span:nth-child(1){transform:translateY(9px) rotate(45deg);background:#E8192C}
    .fx-burger.open span:nth-child(2){opacity:0}
    .fx-burger.open span:nth-child(3){transform:translateY(-9px) rotate(-45deg);background:#E8192C}

    #fx-mobile-menu{
      display:none;
      position:fixed;
      top:0;left:0;right:0;bottom:0;
      background:#05050A;
      z-index:9999;
      overflow-y:auto;
      padding-top:66px;
      -webkit-overflow-scrolling:touch;
    }
    #fx-mobile-menu.open{ display:block; }

    .fx-mobile-menu-link{
      display:block;
      font-family:sans-serif;
      font-size:18px;font-weight:700;
      letter-spacing:2px;text-transform:uppercase;
      color:#fff;text-decoration:none;
      padding:20px 28px;
      border-bottom:1px solid rgba(255,255,255,0.08);
      -webkit-tap-highlight-color:transparent;
    }
    .fx-mobile-menu-link:active{ background:rgba(232,25,44,0.15);color:#FF3D52; }
    .fx-mobile-menu-link.active{ color:#FF3D52; }

    .fx-mob-sep{ height:1px;background:rgba(255,255,255,0.12);margin:8px 0; }

    .fx-mobile-menu-bottom{
      padding:20px 28px 60px;
      display:flex;flex-direction:column;gap:12px;
    }
    .fx-mob-login{
      display:block;text-align:center;
      font-family:sans-serif;font-size:15px;font-weight:700;
      letter-spacing:2px;text-transform:uppercase;
      color:#fff;text-decoration:none;
      padding:16px;border:1px solid rgba(255,255,255,0.2);
    }
    .fx-mob-cta{
      display:block;width:100%;text-align:center;
      font-family:sans-serif;font-size:15px;font-weight:700;
      letter-spacing:2px;text-transform:uppercase;
      color:#FF3D52;background:transparent;
      border:2px solid #E8192C;padding:16px;
      cursor:pointer;-webkit-tap-highlight-color:transparent;
    }
    .fx-mob-close{
      position:absolute;top:16px;right:16px;
      width:44px;height:44px;
      background:rgba(255,255,255,0.08);border:none;
      color:#fff;font-size:22px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      border-radius:50%;-webkit-tap-highlight-color:transparent;
    }

    @media(max-width:900px){
      .fx-burger{display:flex !important}
      nav .nav-links{display:none !important}
      nav .nav-right{display:none !important}
      nav{padding:0 16px !important}
    }
    @media(min-width:901px){
      #fx-mobile-menu{display:none !important}
      .fx-burger{display:none !important}
    }
  `;
  document.head.appendChild(style);

  function fxLoggedIn(){ return typeof FX !== 'undefined' && FX.isLoggedIn(); }
  function fxUser(){ return typeof FX !== 'undefined' ? FX.getUser() : null; }

  var menu, loginEl, ctaEl, burger;

  function build(){
    var nav = document.querySelector('nav');
    if(!nav || nav.querySelector('.fx-burger')) return;

    /* Burger dans la nav */
    burger = document.createElement('button');
    burger.className = 'fx-burger';
    burger.type = 'button';
    burger.setAttribute('aria-label','Ouvrir le menu');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    /* Menu plein écran */
    menu = document.createElement('div');
    menu.id = 'fx-mobile-menu';
    menu.setAttribute('role','dialog');

    /* Bouton fermer */
    var closeBtn = document.createElement('button');
    closeBtn.className = 'fx-mob-close';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', close);
    menu.appendChild(closeBtn);

    /* Liens */
    var inner = document.createElement('div');
    inner.className = 'fx-mobile-menu-inner';

    /* Récupérer les liens de la nav desktop */
    var desktopLinks = nav.querySelectorAll('.nav-links a');
    var activePage = window.location.pathname.split('/').pop() || 'index.html';

    if(desktopLinks.length > 0){
      desktopLinks.forEach(function(a){
        var link = makeLink(a.getAttribute('href'), a.textContent.trim(), activePage);
        inner.appendChild(link);
      });
    } else {
      /* Fallback si nav-links vide */
      var defaults = [
        ['index.html','Accueil'],
        ['entrainements.html','Entraînements'],
        ['nutrition.html','Nutrition'],
        ['coaches.html','Coaches'],
        ['communaute.html','Communauté'],
        ['tarifs.html','Tarifs'],
      ];
      defaults.forEach(function(d){ inner.appendChild(makeLink(d[0],d[1],activePage)); });
    }

    /* Séparateur + Blog & FAQ */
    var sep = document.createElement('div');
    sep.className = 'fx-mob-sep';
    inner.appendChild(sep);
    inner.appendChild(makeLink('blog.html','📝 Blog', activePage));
    inner.appendChild(makeLink('faq.html','❓ FAQ', activePage));

    menu.appendChild(inner);

    /* Bottom : connexion + CTA */
    var bottom = document.createElement('div');
    bottom.className = 'fx-mobile-menu-bottom';

    loginEl = document.createElement('a');
    loginEl.className = 'fx-mob-login';
    bottom.appendChild(loginEl);

    ctaEl = document.createElement('button');
    ctaEl.className = 'fx-mob-cta';
    ctaEl.type = 'button';
    ctaEl.addEventListener('click', function(){
      close();
      window.location.href = fxLoggedIn() ? 'dashboard.html' : 'tarifs.html';
    });
    bottom.appendChild(ctaEl);
    menu.appendChild(bottom);

    document.body.appendChild(menu);

    syncAuth();
    setTimeout(syncAuth, 300);
    setTimeout(syncAuth, 1000);

    /* Ouvrir */
    burger.addEventListener('click', function(e){
      e.stopPropagation();
      menu.classList.contains('open') ? close() : open();
    });
  }

  function makeLink(href, text, activePage){
    var a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    a.className = 'fx-mobile-menu-link';
    if(href === activePage) a.classList.add('active');
    a.addEventListener('click', function(){ close(); });
    return a;
  }

  function open(){
    if(!menu || !burger) return;
    menu.classList.add('open');
    burger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close(){
    if(!menu || !burger) return;
    menu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
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

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

})();
