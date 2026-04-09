/* ═══════════════════════════════════════════════════
   FORGEX-UI.JS
   · Bouton "retour en haut" flottant
   · Calculateur 1RM (dashboard)
   · Sidebar mobile dashboard
   ═══════════════════════════════════════════════════ */
(function(){

/* ════════════════════════════════
   BOUTON RETOUR EN HAUT
════════════════════════════════ */
function initScrollTop(){
  const btn = document.createElement('button');
  btn.id = 'fx-scroll-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label','Retour en haut');
  btn.style.cssText = `
    position:fixed;bottom:28px;right:28px;z-index:500;
    width:44px;height:44px;
    background:var(--crimson,#E8192C);color:#fff;
    border:none;cursor:pointer;
    font-size:18px;font-family:monospace;font-weight:700;
    box-shadow:0 0 18px rgba(232,25,44,0.5);
    opacity:0;pointer-events:none;
    transition:opacity 0.28s,transform 0.28s;
    transform:translateY(8px);
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', function(){
    const show = window.scrollY > 320;
    btn.style.opacity = show ? '1' : '0';
    btn.style.pointerEvents = show ? 'all' : 'none';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(8px)';
  }, {passive:true});

  btn.addEventListener('click', function(){
    window.scrollTo({top:0,behavior:'smooth'});
  });
}

/* ════════════════════════════════
   CALCULATEUR 1RM (dashboard seulement)
════════════════════════════════ */
function initRM(){
  const panel = document.getElementById('panel-overview');
  if(!panel) return; /* Pas sur le dashboard */

  /* Injecter le CSS */
  const style = document.createElement('style');
  style.textContent = `
    .rm-card{background:var(--bg-card);border:1px solid var(--border-soft);padding:28px;margin-top:32px;position:relative;overflow:hidden}
    .rm-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--magenta,#C026D3),var(--led-mid,#E879F9));box-shadow:0 0 14px rgba(192,38,211,0.5)}
    .rm-title{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text-primary,#F2F0F8);margin-bottom:4px}
    .rm-sub{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted,#4A4A62);margin-bottom:20px}
    .rm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}
    @media(max-width:600px){.rm-grid{grid-template-columns:1fr 1fr}}
    .rm-field label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted,#4A4A62);display:block;margin-bottom:6px}
    .rm-input{width:100%;background:var(--bg-raised,#111120);border:1px solid var(--border-soft,rgba(255,255,255,0.08));color:var(--text-primary,#F2F0F8);font-family:'Barlow',sans-serif;font-size:15px;font-weight:300;padding:11px 14px;outline:none;transition:border-color 0.2s}
    .rm-input:focus{border-color:var(--magenta,#C026D3);box-shadow:0 0 0 2px rgba(192,38,211,0.15)}
    .rm-input::placeholder{color:var(--text-muted,#4A4A62)}
    .rm-btn{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:var(--magenta,#C026D3);color:#fff;border:none;padding:12px 24px;cursor:pointer;box-shadow:0 0 14px rgba(192,38,211,0.4);transition:all 0.2s;width:100%;margin-bottom:20px}
    .rm-btn:hover{background:var(--magenta-light,#D946EF);box-shadow:0 0 22px rgba(192,38,211,0.6)}
    .rm-results{display:none;gap:1px;background:var(--border-dim,rgba(255,255,255,0.04))}
    .rm-results.show{display:grid;grid-template-columns:repeat(5,1fr)}
    @media(max-width:600px){.rm-results.show{grid-template-columns:repeat(3,1fr)}}
    .rm-result-item{background:var(--bg-raised,#111120);padding:14px 10px;text-align:center}
    .rm-result-val{font-family:'Bebas Neue',sans-serif;font-size:26px;line-height:1;margin-bottom:3px}
    .rm-result-lbl{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted,#4A4A62)}
    .rm-formula-note{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:1px;color:var(--text-muted,#4A4A62);margin-top:12px;text-align:center}
    .rm-exo-select{width:100%;background:var(--bg-raised,#111120);border:1px solid var(--border-soft,rgba(255,255,255,0.08));color:var(--text-primary,#F2F0F8);font-family:'Barlow',sans-serif;font-size:14px;font-weight:300;padding:11px 14px;outline:none;cursor:pointer;margin-bottom:12px}
    .rm-history{margin-top:20px;display:none}
    .rm-history.show{display:block}
    .rm-history-title{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted,#4A4A62);margin-bottom:8px}
    .rm-history-list{display:flex;flex-direction:column;gap:1px;background:var(--border-dim,rgba(255,255,255,0.04));max-height:180px;overflow-y:auto}
    .rm-history-list::-webkit-scrollbar{width:3px}
    .rm-history-list::-webkit-scrollbar-thumb{background:rgba(192,38,211,0.3)}
    .rm-history-item{background:var(--bg-card,#0D0D16);padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:1px}
    .rm-history-exo{color:var(--text-secondary,#8B8A9E)}
    .rm-history-rm{color:var(--magenta-light,#D946EF);font-family:'Bebas Neue',sans-serif;font-size:18px;line-height:1}
    .rm-history-del{background:none;border:none;color:var(--text-muted,#4A4A62);cursor:pointer;font-size:12px;padding:2px;transition:color 0.2s}
    .rm-history-del:hover{color:var(--crimson,#E8192C)}
  `;
  document.head.appendChild(style);

  /* Injecter le HTML après la barre nutri */
  const nutriCard = panel.querySelector('.nutri-card');
  const insertAfter = nutriCard || panel.querySelector('.stats-grid');
  if(!insertAfter) return;

  const card = document.createElement('div');
  card.className = 'rm-card';
  card.innerHTML = `
    <div class="rm-title">⚡ Calculateur 1RM</div>
    <div class="rm-sub">Formule Epley · ton maximum théorique</div>

    <select class="rm-exo-select" id="rm-exo">
      <option value="Développé couché">🏋️ Développé couché</option>
      <option value="Squat">🦵 Squat</option>
      <option value="Soulevé de terre">💀 Soulevé de terre</option>
      <option value="Développé militaire">🎯 Développé militaire</option>
      <option value="Rowing barre">🏆 Rowing barre</option>
      <option value="Traction lestée">🦅 Traction lestée</option>
      <option value="Curl barre">💪 Curl barre</option>
      <option value="Autre exercice">⚙️ Autre exercice</option>
    </select>

    <div class="rm-grid">
      <div class="rm-field">
        <label>Poids soulevé (kg)</label>
        <input class="rm-input" type="number" id="rm-weight" placeholder="100" min="1" max="500" step="0.5">
      </div>
      <div class="rm-field">
        <label>Répétitions</label>
        <input class="rm-input" type="number" id="rm-reps" placeholder="5" min="1" max="30">
      </div>
      <div class="rm-field">
        <label>Ton poids (kg)</label>
        <input class="rm-input" type="number" id="rm-bodyweight" placeholder="80" min="30" max="200" step="0.5">
      </div>
    </div>

    <button class="rm-btn" id="rm-calc-btn">Calculer mon 1RM →</button>

    <div class="rm-results" id="rm-results">
      <div class="rm-result-item">
        <div class="rm-result-val" id="rm-100" style="color:#E8192C;text-shadow:0 0 12px rgba(232,25,44,0.6)">—</div>
        <div class="rm-result-lbl">100% · 1RM</div>
      </div>
      <div class="rm-result-item">
        <div class="rm-result-val" id="rm-90" style="color:#D946EF">—</div>
        <div class="rm-result-lbl">90% · Force</div>
      </div>
      <div class="rm-result-item">
        <div class="rm-result-val" id="rm-80" style="color:#E879F9">—</div>
        <div class="rm-result-lbl">80% · Hyper</div>
      </div>
      <div class="rm-result-item">
        <div class="rm-result-val" id="rm-70" style="color:rgba(232,121,249,0.7)">—</div>
        <div class="rm-result-lbl">70% · Volume</div>
      </div>
      <div class="rm-result-item">
        <div class="rm-result-val" id="rm-60" style="color:rgba(255,255,255,0.4)">—</div>
        <div class="rm-result-lbl">60% · Endurance</div>
      </div>
    </div>
    <div class="rm-formula-note" id="rm-note" style="display:none"></div>

    <div class="rm-history" id="rm-history">
      <div class="rm-history-title">Historique des 1RM</div>
      <div class="rm-history-list" id="rm-history-list"></div>
    </div>
  `;

  insertAfter.parentNode.insertBefore(card, insertAfter.nextSibling);

  /* ── Logique calcul ── */
  const RM_KEY = 'fx_rm_history_v1';

  function getRMHistory(){ try{ return JSON.parse(localStorage.getItem(RM_KEY)||'[]'); }catch(e){ return []; } }
  function saveRMHistory(h){ try{ localStorage.setItem(RM_KEY, JSON.stringify(h)); }catch(e){} }

  function calcRM(){
    const w = parseFloat(document.getElementById('rm-weight').value);
    const r = parseInt(document.getElementById('rm-reps').value);
    const bw = parseFloat(document.getElementById('rm-bodyweight').value);
    const exo = document.getElementById('rm-exo').value;

    if(!w || !r || r < 1){ return; }

    /* Formule Epley : 1RM = w × (1 + r/30) */
    const rm = Math.round(w * (1 + r / 30));
    const pct = [100,90,80,70,60];
    pct.forEach(function(p){
      const el = document.getElementById('rm-'+p);
      if(el) el.textContent = Math.round(rm * p / 100) + ' kg';
    });

    document.getElementById('rm-results').classList.add('show');

    /* Note avec ratio poids de corps */
    const noteEl = document.getElementById('rm-note');
    if(bw){
      const ratio = (rm/bw).toFixed(2);
      let niveau = ratio < 1 ? 'Débutant' : ratio < 1.5 ? 'Intermédiaire' : ratio < 2 ? 'Avancé' : '🔥 Elite';
      noteEl.textContent = `Formule Epley · Ratio poids de corps : ${ratio}× · Niveau : ${niveau}`;
    } else {
      noteEl.textContent = 'Formule Epley : 1RM = Poids × (1 + Reps/30)';
    }
    noteEl.style.display = 'block';

    /* Sauvegarder dans l'historique */
    const history = getRMHistory();
    history.unshift({
      exo, w, r, rm,
      date: new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short'}),
      ts: Date.now()
    });
    /* Garder max 20 entrées */
    saveRMHistory(history.slice(0,20));
    renderRMHistory();
  }

  function renderRMHistory(){
    const history = getRMHistory();
    const listEl = document.getElementById('rm-history-list');
    const histEl = document.getElementById('rm-history');
    if(!history.length){ histEl.classList.remove('show'); return; }
    histEl.classList.add('show');
    listEl.innerHTML = history.map(function(h,i){
      return `<div class="rm-history-item">
        <span class="rm-history-exo">${h.date} · ${h.exo} · ${h.w}kg × ${h.r}</span>
        <span class="rm-history-rm">${h.rm} kg</span>
        <button class="rm-history-del" data-idx="${i}">✕</button>
      </div>`;
    }).join('');
    listEl.querySelectorAll('.rm-history-del').forEach(function(btn){
      btn.addEventListener('click', function(){
        const h = getRMHistory();
        h.splice(parseInt(this.dataset.idx),1);
        saveRMHistory(h);
        renderRMHistory();
      });
    });
  }

  document.getElementById('rm-calc-btn').addEventListener('click', calcRM);
  document.getElementById('rm-reps').addEventListener('keydown', function(e){ if(e.key==='Enter') calcRM(); });
  document.getElementById('rm-weight').addEventListener('keydown', function(e){ if(e.key==='Enter') calcRM(); });
  renderRMHistory();
}

/* ════════════════════════════════
   SIDEBAR MOBILE DASHBOARD
════════════════════════════════ */
function initDashboardMobile(){
  const sidebar = document.querySelector('.sidebar');
  const dashContent = document.querySelector('.dash-content');
  if(!sidebar || !dashContent) return;

  const style = document.createElement('style');
  style.textContent = `
    @media(max-width:900px){
      .dash-layout{grid-template-columns:1fr !important}
      .sidebar{
        display:block !important;
        position:static !important;
        height:auto !important;
        overflow:visible !important;
        border-right:none !important;
        border-bottom:1px solid var(--border-dim) !important;
        padding:0 !important;
      }
      /* Masquer l'avatar sidebar sur mobile — trop de place */
      .sidebar-avatar{display:none !important}
      .sidebar-bottom{display:none !important}

      /* Transformer la sidebar en barre de navigation horizontale */
      .sidebar-nav{
        flex-direction:row !important;
        overflow-x:auto !important;
        overflow-y:hidden !important;
        padding:0 !important;
        gap:0 !important;
        scrollbar-width:none !important;
      }
      .sidebar-nav::-webkit-scrollbar{display:none}
      .sidebar-sep{display:none !important}
      .snav-item{
        border-left:none !important;
        border-bottom:2px solid transparent !important;
        padding:14px 16px !important;
        white-space:nowrap !important;
        font-size:11px !important;
        flex-shrink:0 !important;
      }
      .snav-item.active{
        border-bottom-color:var(--crimson) !important;
        border-left:none !important;
        background:transparent !important;
        color:var(--crimson-light) !important;
      }
      .snav-icon{display:none !important}
      .dash-content{padding:24px 20px !important}
      .stats-grid{grid-template-columns:repeat(2,1fr) !important}
      .profile-grid{grid-template-columns:1fr !important}
      .weight-stats-row{grid-template-columns:repeat(2,1fr) !important}
      .nutri-macros{grid-template-columns:1fr !important}
      .rm-grid{grid-template-columns:1fr 1fr !important}
      .rm-results.show{grid-template-columns:repeat(3,1fr) !important}
      .weight-input-row{grid-template-columns:1fr 1fr !important}
      .weight-input-row button{grid-column:1/-1}
      /* Bouton déconnexion mobile */
      .dash-mobile-logout{
        display:flex !important;
        align-items:center;justify-content:flex-end;
        padding:12px 20px;border-bottom:1px solid var(--border-dim);
        background:var(--bg-mid);
      }
      .dash-mobile-logout button{
        font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;
        background:none;border:1px solid var(--border-soft);color:var(--text-muted);
        padding:7px 12px;cursor:pointer;transition:all 0.2s;
      }
      .dash-mobile-logout button:hover{border-color:var(--crimson);color:var(--crimson)}
    }
    @media(min-width:901px){.dash-mobile-logout{display:none !important}}
  `;
  document.head.appendChild(style);

  /* Injecter le bouton déconnexion mobile en haut du contenu */
  const logoutDiv = document.createElement('div');
  logoutDiv.className = 'dash-mobile-logout';
  logoutDiv.innerHTML = '<button onclick="if(typeof FX!==\'undefined\')FX.logout();else window.location.href=\'index.html\'">↩ Déconnexion</button>';
  dashContent.insertBefore(logoutDiv, dashContent.firstChild);
}

/* ════════════════════════════════
   INIT
════════════════════════════════ */
function init(){
  initScrollTop();
  initRM();
  initDashboardMobile();
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
