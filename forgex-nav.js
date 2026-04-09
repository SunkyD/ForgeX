/* ═══════════════════════════════════════════
   FORGEX-NAV.JS — Hamburger menu mobile
   ═══════════════════════════════════════════ */
(function(){

  /* ── CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    .fx-burger{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:8px;z-index:300}
    .fx-burger span{display:block;width:22px;height:2px;background:rgba(255,255,255,0.5);border-radius:1px;transition:all 0.3s cubic-bezier(0.4,0,0.2,1)}
    .fx-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);background:#E8192C}
    .fx-burger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
    .fx-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);background:#E8192C}

    .fx-mobile-menu{display:none;position:fixed;top:66px;left:0;right:0;z-index:199;background:rgba(5,5,10,0.98);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.06);transform:translateY(-8px);opacity:0;pointer-events:none;transition:opacity 0.25s ease,transform 0.25s cubic-bezier(0.4,0,0.2,1)}
    .fx-mobile-menu.open{opacity:1;transform:translateY(0);pointer-events:all}
    .fx-mobile-menu-inner{padding:20px 28px 4px;display:flex;flex-direction:column;gap:2px}
    .fx-mobile-menu a{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(242,240,248,0.55);text-decoration:none;padding:13px 0;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:space-between;transition:color 0.2s}
    .fx-mobile-menu a:hover,.fx-mobile-menu a.active{color:#F2F0F8}
    .fx-mobile-menu a.active::after{content:'';width:6px;height:6px;border-radius:50%;background:#E8192C;box-shadow:0 0 8px #E8192C}
    .fx-mobile-menu-bottom{padding:16px 28px 24px;display:flex;gap:12px;border-top:1px solid rgba(255,255,255,0.04);margin-top:8px}
    .fx-mob-login{flex:1;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(242,240,248,0.55);text-decoration:none;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);padding:11px;text-align:center;transition:all 0.2s}
    .fx-mob-login:hover{color:#F2F0F8;background:rgba(255,255,255,0.08)}
    .fx-mob-cta{flex:1;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#FF3D52;background:transparent;border:1px solid #E8192C;padding:11px;cursor:pointer;box-shadow:0 0 10px rgba(232,25,44,0.18);transition:all 0.2s}
    .fx-mob-cta:hover{background:#E8192C;color:#fff}

    @media(max-width:900px){
      .fx-burger{display:flex !important}
      nav .nav-links{display:none !important}
      nav .nav-right{display:none !important}
      nav{padding:0 24px !important}
      .fx-mobile-menu{display:block}
    }
  `;
  document.head.appendChild(style);

  function fxLoggedIn(){ return typeof FX !== 'undefined' && FX.isLoggedIn(); }
  function fxUser(){ return typeof FX !== 'undefined' ? FX.getUser() : null; }

  function inject(){
    const nav = document.querySelector('nav');
    if(!nav || nav.querySelector('.fx-burger')) return;

    /* Bouton hamburger */
    const burger = document.createElement('button');
    burger.className = 'fx-burger';
    burger.setAttribute('aria-label','Menu');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    /* Récupérer liens desktop */
    const navLinks = nav.querySelectorAll('.nav-links a');
    const navLogin = document.getElementById('nav-login-lnk') || nav.querySelector('.nav-login');

    /* Construire menu mobile */
    const menu = document.createElement('div');
    menu.className = 'fx-mobile-menu';
    menu.id = 'fx-mobile-menu';

    const inner = document.createElement('div');
    inner.className = 'fx-mobile-menu-inner';

    /* Liens nav normaux */
    navLinks.forEach(function(a){
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      if(a.classList.contains('active')) link.classList.add('active');
      link.addEventListener('click', closeMenu);
      inner.appendChild(link);
    });

    /* Ajouter Blog et FAQ s'ils existent dans le dropdown desktop */
    const dropdownLinks = nav.querySelectorAll('.nav-dropdown li a');
    if(dropdownLinks.length){
      /* Séparateur */
      const sep = document.createElement('div');
      sep.style.cssText = 'height:1px;background:rgba(255,255,255,0.04);margin:4px 0';
      inner.appendChild(sep);
      dropdownLinks.forEach(function(a){
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = a.textContent.trim();
        link.addEventListener('click', closeMenu);
        inner.appendChild(link);
      });
    } else {
      /* Fallback : ajouter Blog et FAQ directement si pas de dropdown */
      var extraLinks = [
        {href:'blog.html', text:'📝 Blog'},
        {href:'faq.html',  text:'❓ FAQ'}
      ];
      var sep = document.createElement('div');
      sep.style.cssText = 'height:1px;background:rgba(255,255,255,0.04);margin:4px 0';
      inner.appendChild(sep);
      extraLinks.forEach(function(item){
        /* Éviter les doublons */
        var already = Array.from(navLinks).some(function(a){ return a.href.includes(item.href); });
        if(already) return;
        var link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.text;
        link.addEventListener('click', closeMenu);
        inner.appendChild(link);
      });
    }
    menu.appendChild(inner);

    /* Bottom : login + cta */
    const bottom = document.createElement('div');
    bottom.className = 'fx-mobile-menu-bottom';

    const loginEl = document.createElement('a');
    loginEl.className = 'fx-mob-login';
    loginEl.id = 'fx-mob-login-lnk';
    bottom.appendChild(loginEl);

    const ctaEl = document.createElement('button');
    ctaEl.className = 'fx-mob-cta';
    ctaEl.id = 'fx-mob-cta-btn';
    ctaEl.addEventListener('click', function(){
      window.location.href = fxLoggedIn() ? 'dashboard.html' : 'tarifs.html';
    });
    bottom.appendChild(ctaEl);
    menu.appendChild(bottom);
    document.body.appendChild(menu);

    /* Sync état connexion */
    function syncNav(){
      const loggedIn = fxLoggedIn();
      const user = fxUser();
      if(loggedIn && user){
        loginEl.textContent = '👤 ' + user;
        loginEl.href = 'dashboard.html';
        loginEl.style.color = '#FF3D52';
        ctaEl.textContent = 'Mon espace →';
      } else {
        loginEl.textContent = navLogin ? navLogin.textContent.trim() : 'Connexion';
        loginEl.href = 'login.html';
        loginEl.style.color = '';
        ctaEl.textContent = 'Commencer →';
      }
    }

    syncNav();
    /* Re-sync après que tout soit chargé */
    setTimeout(syncNav, 50);
    setTimeout(syncNav, 300);

    /* Toggle burger */
    burger.addEventListener('click', function(e){
      e.stopPropagation();
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    /* Fermer en cliquant dehors */
    document.addEventListener('click', function(e){
      if(!nav.contains(e.target) && !menu.contains(e.target)) closeMenu();
    });

    /* Fermer sur Escape */
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeMenu();
    });
  }

  function openMenu(){
    document.querySelector('.fx-burger')?.classList.add('open');
    document.getElementById('fx-mobile-menu')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu(){
    document.querySelector('.fx-burger')?.classList.remove('open');
    document.getElementById('fx-mobile-menu')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Injecter après le DOM */
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
