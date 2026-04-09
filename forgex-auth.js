/* ═══════════════════════════════════════════════════════
   FORGEX-AUTH.JS — Système d'authentification ForgeX
   Inclure dans TOUTES les pages avec <script src="forgex-auth.js">
   ═══════════════════════════════════════════════════════ */
(function(w){
  'use strict';

  const K_SESSION  = 'fx_session_v1';
  const K_ACCOUNTS = 'fx_accounts_v1';
  const K_TOPICS   = 'fx_topics_v1';
  const K_REPLIES  = 'fx_replies_v1';

  function load(k){ try{ return JSON.parse(localStorage.getItem(k)||'null'); }catch(e){ return null; } }
  function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

  function hash(str){
    let h=5381;
    for(let i=0;i<str.length;i++) h=((h<<5)+h)^str.charCodeAt(i), h=h&0xffffffff;
    return h.toString(16);
  }

  const COLORS=['#E8192C','#C026D3','#E879F9','#2563eb','#16a34a','#d97706','#7c3aed','#dc2626','#059669','#ea580c'];
  function avatarColor(name){
    let h=0; for(let c of (name||'?')) h=(h*31+c.charCodeAt(0))&0xffff;
    return COLORS[h%COLORS.length];
  }

  /* SESSION */
  function getSession(){ return load(K_SESSION); }
  function isLoggedIn(){ const s=getSession(); return !!(s&&s.pseudo&&s.expires>Date.now()); }
  function getUser(){ const s=getSession(); return s?s.pseudo:null; }
  function createSession(pseudo){ save(K_SESSION,{pseudo,expires:Date.now()+7*24*60*60*1000}); }
  function logout(){ localStorage.removeItem(K_SESSION); window.location.href='index.html'; }

  /* COMPTES */
  function getAccounts(){ return load(K_ACCOUNTS)||{}; }
  function saveAccounts(a){ save(K_ACCOUNTS,a); }
  function getAccount(pseudo){ return getAccounts()[pseudo]||null; }
  function updateAccount(pseudo,data){
    const a=getAccounts(); if(!a[pseudo]) return;
    Object.assign(a[pseudo],data); saveAccounts(a);
  }

  function register(pseudo,password,email){
    pseudo=(pseudo||'').trim();
    if(pseudo.length<3) return {ok:false,err:'Pseudo trop court (3 car. min)'};
    if(!password||password.length<8) return {ok:false,err:'Mot de passe trop court (8 car. min)'};
    const accounts=getAccounts();
    if(accounts[pseudo]) return {ok:false,err:'Ce pseudo est déjà pris'};
    const now=new Date();
    accounts[pseudo]={
      password:hash(password), email:email||'',
      createdAt:Date.now(),
      joinDate:now.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}),
      plan:'Starter', objectif:'', niveau:'Débutant', bio:'',
      stats:{topics:0,replies:0}
    };
    saveAccounts(accounts);
    createSession(pseudo);
    return {ok:true};
  }

  function login(pseudo,password){
    pseudo=(pseudo||'').trim();
    const accounts=getAccounts();
    if(!accounts[pseudo]) return {ok:false,err:'Pseudo introuvable'};
    if(accounts[pseudo].password!==hash(password)) return {ok:false,err:'Mot de passe incorrect'};
    createSession(pseudo);
    return {ok:true};
  }

  /* TOPICS */
  function getUserTopics(){ return load(K_TOPICS)||[]; }
  function saveUserTopics(t){ save(K_TOPICS,t); }
  function addTopic(topic){
    const topics=getUserTopics(); topics.push(topic); saveUserTopics(topics);
    const a=getAccounts();
    if(a[topic.author]){ a[topic.author].stats=a[topic.author].stats||{}; a[topic.author].stats.topics=(a[topic.author].stats.topics||0)+1; saveAccounts(a); }
  }

  /* REPLIES */
  function getReplies(){ return load(K_REPLIES)||{}; }
  function saveReplies(r){ save(K_REPLIES,r); }
  function addReply(topicId,reply){
    const r=getReplies(); if(!r[topicId]) r[topicId]=[]; r[topicId].push(reply); saveReplies(r);
    const a=getAccounts();
    if(a[reply.author]){ a[reply.author].stats=a[reply.author].stats||{}; a[reply.author].stats.replies=(a[reply.author].stats.replies||0)+1; saveAccounts(a); }
  }

  /* NAV PATCH */
  function patchNav(){
    const user=getUser();
    const loginEl=document.getElementById('nav-login-lnk')||document.querySelector('.nav-login');
    const ctaEl=document.getElementById('nav-cta-btn')||document.querySelector('.nav-cta');
    if(user){
      if(loginEl){ loginEl.textContent='👤 '+user; loginEl.setAttribute('href','dashboard.html'); loginEl.style.color='var(--crimson-light)'; }
      if(ctaEl){ ctaEl.textContent='Mon espace →'; ctaEl.onclick=function(e){ e.preventDefault(); window.location.href='dashboard.html'; }; }
    } else {
      if(loginEl){ loginEl.textContent='Connexion'; loginEl.setAttribute('href','login.html'); loginEl.style.color=''; }
      if(ctaEl){ ctaEl.textContent='Commencer →'; ctaEl.onclick=function(e){ e.preventDefault(); window.location.href='tarifs.html'; }; }
    }
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',patchNav); }
  else { patchNav(); }

  w.FX={ isLoggedIn,getUser,getSession,login,register,logout,getAccount,updateAccount,getAccounts,getUserTopics,saveUserTopics,addTopic,getReplies,saveReplies,addReply,avatarColor,patchNav,hash };

})(window);

/* ── Fallback de sécurité — évite les ReferenceError si le fichier charge mal ── */
if(typeof window.FX === 'undefined'){
  window.FX = {
    isLoggedIn:function(){ return false; },
    getUser:function(){ return null; },
    getSession:function(){ return null; },
    login:function(){ return {ok:false,err:'Auth non disponible'}; },
    register:function(){ return {ok:false,err:'Auth non disponible'}; },
    logout:function(){ window.location.href='index.html'; },
    getAccount:function(){ return null; },
    updateAccount:function(){},
    getAccounts:function(){ return {}; },
    getUserTopics:function(){ return []; },
    saveUserTopics:function(){},
    addTopic:function(){},
    getReplies:function(){ return {}; },
    saveReplies:function(){},
    addReply:function(){},
    avatarColor:function(){ return '#E8192C'; },
    patchNav:function(){},
    hash:function(s){ return s; }
  };
}
