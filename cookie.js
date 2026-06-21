/**
 * Casa Bèrnia — Cookie Consent + Performance
 * GDPR-compliant | Blokkeert GA + Facebook tot toestemming
 */
(function () {
  'use strict';

  /* ── 1. STIJLEN ──────────────────────────────────────────── */
  var css = `
    #cb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9998;backdrop-filter:blur(2px)}
    #cb-modal{display:none;position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#fff;border-top:3px solid #9a7b3f;padding:1.5rem 2rem 1.8rem;font-family:'Jost',sans-serif;font-size:.88rem;color:#2a2a2a;box-shadow:0 -4px 24px rgba(0,0,0,.18)}
    #cb-modal.show,#cb-overlay.show{display:block}
    #cb-modal h3{font-family:'Cormorant Garamond',serif;font-size:1.25rem;margin:0 0 .5rem;color:#231408}
    #cb-modal p{margin:0 0 .9rem;line-height:1.6;max-width:72ch}
    #cb-modal a{color:#9a7b3f;text-decoration:underline}
    .cb-cats{display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:1rem}
    .cb-cat{display:flex;align-items:center;gap:.45rem;font-weight:500;cursor:pointer}
    .cb-cat input{width:16px;height:16px;accent-color:#9a7b3f;cursor:pointer}
    .cb-actions{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:.5rem}
    .cb-btn{padding:.55rem 1.4rem;border:none;cursor:pointer;border-radius:2px;font-family:'Jost',sans-serif;font-size:.85rem;font-weight:500;letter-spacing:.05em;transition:background .2s,color .2s}
    .cb-accept{background:#9a7b3f;color:#fff}.cb-accept:hover{background:#7a6030}
    .cb-save{background:#e8e0d5;color:#2a2a2a}.cb-save:hover{background:#d0c5b5}
    .cb-reject{background:transparent;color:#666;border:1px solid #ccc}.cb-reject:hover{background:#f5f5f5}
    #cb-revoke{position:fixed;bottom:1rem;left:1rem;z-index:9997;background:#9a7b3f;color:#fff;border:none;border-radius:50%;width:42px;height:42px;cursor:pointer;font-size:1.1rem;box-shadow:0 2px 8px rgba(0,0,0,.25);display:none;align-items:center;justify-content:center}
    #cb-revoke.show{display:flex}
    @media(max-width:600px){#cb-modal{padding:1.2rem 1rem 1.4rem}.cb-cats{gap:.8rem}}
  `;

  /* ── 2. HTML INJECTEREN ──────────────────────────────────── */
  function inject() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var html = `
      <div id="cb-overlay"></div>
      <div id="cb-modal" role="dialog" aria-modal="true" aria-labelledby="cb-title">
        <h3 id="cb-title">🍪 Wij gebruiken cookies</h3>
        <p>Deze website gebruikt cookies om uw ervaring te verbeteren. Noodzakelijke cookies zijn altijd actief.
        Analytische cookies (Google Analytics) en sociale media-inhoud worden alleen geladen met uw toestemming.
        Meer info in ons <a href="/privacybeleid.html">privacybeleid</a>.</p>
        <div class="cb-cats">
          <label class="cb-cat"><input type="checkbox" checked disabled> Noodzakelijk (altijd actief)</label>
          <label class="cb-cat"><input type="checkbox" id="cb-chk-analytics"> Analytisch (Google Analytics)</label>
          <label class="cb-cat"><input type="checkbox" id="cb-chk-social"> Sociale media (Facebook)</label>
        </div>
        <div class="cb-actions">
          <button class="cb-btn cb-accept" id="cb-accept">Alles accepteren</button>
          <button class="cb-btn cb-save"   id="cb-save">Opslaan &amp; sluiten</button>
          <button class="cb-btn cb-reject" id="cb-reject">Alleen noodzakelijk</button>
        </div>
      </div>
      <button id="cb-revoke" title="Cookievoorkeuren" aria-label="Cookievoorkeuren beheren">🍪</button>
    `;
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    bindEvents();
  }

  /* ── 3. LOGICA ───────────────────────────────────────────── */
  var modal, overlay, revoke, chkA, chkS;

  function bindEvents() {
    modal   = document.getElementById('cb-modal');
    overlay = document.getElementById('cb-overlay');
    revoke  = document.getElementById('cb-revoke');
    chkA    = document.getElementById('cb-chk-analytics');
    chkS    = document.getElementById('cb-chk-social');

    // Vul huidige voorkeur in
    chkA.checked = localStorage.getItem('cb_analytics') === '1';
    chkS.checked = localStorage.getItem('cb_social')    === '1';

    document.getElementById('cb-accept').onclick = function () {
      chkA.checked = chkS.checked = true;
      save();
    };
    document.getElementById('cb-reject').onclick = function () {
      chkA.checked = chkS.checked = false;
      save();
    };
    document.getElementById('cb-save').onclick = save;
    revoke.onclick  = show;
    overlay.onclick = hide;
  }

  function show() {
    modal.classList.add('show');
    overlay.classList.add('show');
    revoke.classList.remove('show');
  }
  function hide() {
    modal.classList.remove('show');
    overlay.classList.remove('show');
    revoke.classList.add('show');
  }
  function save() {
    localStorage.setItem('cb_set', '1');
    localStorage.setItem('cb_analytics', chkA.checked ? '1' : '0');
    localStorage.setItem('cb_social',    chkS.checked ? '1' : '0');
    if (chkA.checked) enableGA();
    if (chkS.checked) loadSocial(); else blockSocial();
    hide();
  }

  /* ── 4. GOOGLE ANALYTICS ─────────────────────────────────── */
  function enableGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-G68LR4V7BK';
    document.head.appendChild(s);
    s.onload = function () {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-G68LR4V7BK');
    };
  }

  /* ── 5. FACEBOOK IFRAMES (PERFORMANCE + CONSENT) ─────────── */
  // Vervang Facebook iframes door placeholders — laad alleen na toestemming
  function blockSocial() {
    document.querySelectorAll('iframe[src*="facebook.com"], iframe[data-fb]').forEach(function (f) {
      if (!f.dataset.fbSrc) f.dataset.fbSrc = f.src;
      f.src = 'about:blank';
      f.classList.add('fb-blocked');
    });
  }
  function loadSocial() {
    document.querySelectorAll('iframe[data-fb-src], iframe[data-fbSrc]').forEach(function (f) {
      var src = f.dataset.fbSrc || f.dataset['fb-src'];
      if (src) f.src = src;
    });
  }

  /* ── 6. INIT ─────────────────────────────────────────────── */
  // Blokkeer FB iframes meteen bij laden (performance + privacy)
  document.querySelectorAll('iframe[src*="facebook.com"]').forEach(function (f) {
    f.dataset.fbSrc = f.src;
    f.src = 'about:blank';
  });

  // Herstel vorige keuze zonder banner te tonen
  if (localStorage.getItem('cb_set') === '1') {
    if (localStorage.getItem('cb_analytics') === '1') enableGA();
    document.addEventListener('DOMContentLoaded', function () {
      inject();
      if (localStorage.getItem('cb_social') === '1') loadSocial();
      revoke = document.getElementById('cb-revoke');
      if (revoke) revoke.classList.add('show');
      pageFix();
    });
  } else {
    // Eerste bezoek — banner tonen
    document.addEventListener('DOMContentLoaded', function () {
      inject();
      setTimeout(show, 700);
      pageFix();
    });
  }

  /* ── 7. PAGINA-HERSTEL (als hoofd-JS crasht door afgekapt bestand) ── */
  function pageFix() {
    // Footer jaar
    var fy = document.getElementById('footYear');
    if (fy && !fy.textContent.trim()) fy.textContent = new Date().getFullYear();

    // .reveal elementen: wacht 400ms — als hoofd-JS werkt zijn ze al zichtbaar
    setTimeout(function () {
      var els = document.querySelectorAll('.reveal');
      var anyVisible = false;
      els.forEach(function (el) {
        if (parseFloat(window.getComputedStyle(el).opacity) > 0.1) anyVisible = true;
      });
      if (!anyVisible && els.length > 0) {
        // Hoofd-JS werkt niet → maak alles direct zichtbaar
        els.forEach(function (el) { el.classList.add('visible'); });
      }
    }, 400);

    // Mobile menu (als hoofd-JS niet draait)
    var burger = document.getElementById('burgerBtn');
    var mobileNav = document.getElementById('mobileNav');
    var mobileClose = document.getElementById('mobileNavClose');
    if (burger && mobileNav && !burger.__cbBound) {
      burger.__cbBound = true;
      burger.onclick = function () { mobileNav.classList.add('open'); };
      if (mobileClose) mobileClose.onclick = function () { mobileNav.classList.remove('open'); };
    }

    // Nav scroll effect
    var nav = document.getElementById('mainNav');
    if (nav && !window.__cbNavBound) {
      window.__cbNavBound = true;
      window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 60);
      });
    }
  }

})();
