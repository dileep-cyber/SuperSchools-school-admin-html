/* =====================================================================
   auth.js — the session for the whole app (pre-login AND post-login).
   ---------------------------------------------------------------------
   A verified login stores a session cookie (`ss_session`, path=/, 7 days,
   SameSite=Lax). Sign out deletes it. Everything else reads it:
     • index.html          — routes: session → console.html, none → pre-login home
     • pages/pre-login/*   — a logged-in visitor sees "Go to dashboard" instead of "School sign in"
     • console.html        — requires a session (otherwise back to index.html); the school comes from it
   When cookies are unavailable (file://) it falls back to localStorage so the prototype still works.
   In the Next.js port this is the auth cookie + middleware.
   ===================================================================== */
(function () {
  'use strict';
  var NAME = 'ss_session', DAYS = 7;
  var script = document.currentScript;
  var ROOT = script && script.src ? script.src.replace(/lib\/auth\.js(\?.*)?$/, '') : '';
  var useCookie = (function () {
    try {
      if (location.protocol === 'file:') return false;
      document.cookie = 'ss_probe=1; path=/; SameSite=Lax';
      var ok = document.cookie.indexOf('ss_probe=1') >= 0;
      document.cookie = 'ss_probe=; path=/; max-age=0';
      return ok;
    } catch (e) { return false; }
  })();

  function readCookie() {
    var m = document.cookie.match(new RegExp('(?:^|;\s*)' + NAME + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function parse(raw) {
    if (!raw) return null;
    try {
      var s = JSON.parse(raw);
      if (!s || typeof s !== 'object' || !s.contact) return null;
      if (s.exp && Date.now() > s.exp) return null;
      return s;
    } catch (e) { return null; }
  }

  var SSAuth = {
    ROOT: ROOT,
    url: function (p) { return ROOT + p; },
    /* session = { contact, type, school, schoolName } */
    set: function (session) {
      var s = {};
      for (var k in session) s[k] = session[k];
      s.at = Date.now(); s.exp = s.at + DAYS * 864e5;
      var raw = JSON.stringify(s);
      if (useCookie) document.cookie = NAME + '=' + encodeURIComponent(raw) + '; path=/; max-age=' + DAYS * 86400 + '; SameSite=Lax';
      else { try { localStorage.setItem(NAME, raw); } catch (e) {} }
      /* the console's school selection follows the session */
      try { localStorage.setItem('ssSchool', /sunrise/i.test(s.schoolName || '') ? 'sunrise' : 'green-valley'); } catch (e) {}
      return s;
    },
    /* merge fields into the live session, e.g. { setupDone: true } once the 5-step setup is finished */
    update: function (patch) {
      var cur = SSAuth.get(); if (!cur) return null;
      for (var k in patch) cur[k] = patch[k];
      var raw = JSON.stringify(cur);
      if (useCookie) document.cookie = NAME + '=' + encodeURIComponent(raw) + '; path=/; max-age=' + DAYS * 86400 + '; SameSite=Lax';
      else { try { localStorage.setItem(NAME, raw); } catch (e) {} }
      return cur;
    },
    get: function () { return parse(useCookie ? readCookie() : (function () { try { return localStorage.getItem(NAME); } catch (e) { return null; } })()); },
    isAuthed: function () { return !!SSAuth.get(); },
    clear: function () {
      if (useCookie) document.cookie = NAME + '=; path=/; max-age=0; SameSite=Lax';
      try { localStorage.removeItem(NAME); localStorage.removeItem('ssAuth'); } catch (e) {}
    },
    /* post-login pages: no session -> the pre-login home */
    requireAuth: function () { if (!SSAuth.isAuthed()) { location.replace(ROOT + 'index.html'); return false; } return true; },
    /* pre-login login page: already signed in -> the console */
    redirectIfAuthed: function () { if (SSAuth.isAuthed()) { location.replace(ROOT + 'console.html'); return true; } return false; },
    signOut: function () { SSAuth.clear(); location.replace(ROOT + 'index.html'); }
  };
  window.SSAuth = SSAuth;
})();
