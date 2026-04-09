(function(){
  var s = document.createElement('style');
  s.textContent = `
    .fxb{display:none;flex-direction:column;gap:5px;background:none;border:none;padding:10px;cursor:pointer;z-index:10000;-webkit-tap-highlight-color:transparent}
    .fxb span{display:block;width:25px;height:3px;background:#fff;border-radius:2px;pointer-events:none}
    .fxb.o span:nth-child(1){transform:translateY(8px) rotate(45deg);background:#E8192C}
    .fxb.o span:nth-child(2){opacity:0}
    .fxb.o span:nth-child(3){transform:translateY(-8px) rotate(-45deg);background:#E8192C}
    #fxm{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:#07070F;z-index:9998;padding-top:70px;overflow-y:auto}
    #fxm.o{display:block}
    #fxm a{display:block;color:#fff;font-size:20px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:18px 24px;border-bottom:1px solid rgba(255,255,255,0.1)}
    #fxm a:active{background:rgba(232,25,44,0.2)}
    #fxm .fxc{padding:20px 24px;display:flex;flex-direction:column;gap:12px;margin-top:8px}
    #fxm .fxc a{border:1px solid rgba(255,255,255,0.2);text-align:center;font-size:15px;padding:15px;border-bottom:none}
    #fxm .fxc .fxr{color:#FF3D52;border-color:#E8192C;background:none;cursor:pointer;font-family:inherit;width:100%}
    .fxX{position:fixed;top:14px;right:16px;z-index:9999;background:rgba(255,255,255,0.1);border:none;color:#fff;width:40px;height:40px;font-size:20px;cursor:pointer;border-radius:50%;display:none;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent}
    .fxX.o{display:flex}
    @media(max-width:900px){.fxb{display:flex!important}nav .nav-links{display:none!important}nav .nav-right{display:none!important}nav{padding:0 16px!important}}
    @media(min-width:901px){#fxm,.fxb,.fxX{display:none!important}}
  `;
  document.head.appendChild(s);

  function go(){
    var nav = document.querySelector('nav');
    if(!nav) return;

    /* Burger */
    var b = document.createElement('button');
    b.className = 'fxb'; b.type = 'button';
    b.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(b);

    /* Bouton X */
    var x = document.createElement('button');
    x.className = 'fxX'; x.type='button'; x.textContent='✕';
    document.body.appendChild(x);

    /* Menu */
    var m = document.createElement('div');
    m.id = 'fxm';

    var links = [
      ['index.html','🏠 Accueil'],
      ['entrainements.html','🏋️ Entraînements'],
      ['nutrition.html','🥗 Nutrition'],
      ['coaches.html','🤖 Coaches'],
      ['communaute.html','💬 Communauté'],
      ['tarifs.html','⚡ Tarifs'],
      ['blog.html','📝 Blog'],
      ['faq.html','❓ FAQ'],
    ];

    /* Lire les liens du nav desktop si dispo */
    var dl = nav.querySelectorAll('.nav-links a');
    if(dl.length > 2){
      links = [];
      dl.forEach(function(a){ links.push([a.getAttribute('href'), a.textContent.trim()]); });
      links.push(['blog.html','📝 Blog'],['faq.html','❓ FAQ']);
    }

    var cur = location.pathname.split('/').pop()||'index.html';
    links.forEach(function(l){
      var a = document.createElement('a');
      a.href = l[0]; a.textContent = l[1];
      if(l[0]===cur) a.style.color='#FF3D52';
      a.addEventListener('click', close);
      m.appendChild(a);
    });

    /* Auth bottom */
    var c = document.createElement('div');
    c.className = 'fxc';

    var li = document.createElement('a');
    li.id = 'fxm-login'; li.className = 'fxm-la';
    c.appendChild(li);

    var ct = document.createElement('button');
    ct.className = 'fxr'; ct.type='button';
    ct.addEventListener('click',function(){ close(); window.location.href = isOk()?'dashboard.html':'tarifs.html'; });
    c.appendChild(ct);
    m.appendChild(c);
    document.body.appendChild(m);

    sync(); setTimeout(sync,400); setTimeout(sync,1200);

    function open(){ m.classList.add('o'); b.classList.add('o'); x.classList.add('o'); document.body.style.overflow='hidden'; }
    function close(){ m.classList.remove('o'); b.classList.remove('o'); x.classList.remove('o'); document.body.style.overflow=''; }

    b.addEventListener('click', function(e){ e.stopPropagation(); m.classList.contains('o')?close():open(); });
    x.addEventListener('click', close);

    function isOk(){ return typeof FX!=='undefined'&&FX.isLoggedIn(); }
    function sync(){
      var u = isOk()&&typeof FX!=='undefined'?FX.getUser():null;
      li.textContent = u?'👤 '+u:'Connexion';
      li.href = u?'dashboard.html':'login.html';
      ct.textContent = u?'Mon espace →':'Commencer →';
    }
  }

  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',go):go();
})();
