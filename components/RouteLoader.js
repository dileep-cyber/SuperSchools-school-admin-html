/* =====================================================================
   RouteLoader — the navigation loader + shell bridge.
   ---------------------------------------------------------------------
   STANDALONE: each module/sub-module is its own page, so navigating
   reloads the document. The loader markup is rendered INLINE as the first
   <body> child of every page (so it paints instantly, before any script
   runs). This controller keeps the loader up for a minimum, deterministic
   time (MIN_VISIBLE_MS), then removes it INSTANTLY and fades the app
   content in (the .ss-app / .ss-ready rules in styles) — so the loader and
   the page content never overlap.

   EMBEDDED (inside index.html's <iframe>): the SHELL owns the spinner,
   which covers ONLY the content area while the chrome stays put. So here
   we reveal the page content immediately and instead drive the shell's
   spinner via postMessage:
     • beforeunload → {type:'ss-nav-start'}  (cover the content area)
     • DOM ready / load → {type:'ss-nav-done', path}  (hide + sync the active tab)
     • content scroll → {type:'ss-scroll', y}  (mobile chrome auto-hide)
   Maps to <RouteLoader/> + a small effect/provider in a Next.js port.
   ===================================================================== */
window.SS = window.SS || {}; window.SS.components = window.SS.components || {};
window.SS.components.RouteLoader =
  '<div id="routeLoader" class="route-loader" role="status" aria-live="polite" aria-label="Loading">' +
  '<div class="route-loader__box"><div class="route-loader__spinner"></div>' +
  '<div class="route-loader__text">Loading…</div></div></div>';

(function () {
  'use strict';
  var docEl = document.documentElement;
  function loaderEl() { return document.getElementById('routeLoader'); }

  var EMBED = (function () { try { return window.top !== window.self; } catch (e) { return true; } })();

  // ── Embedded mode: bridge navigation/scroll to the parent shell. ──
  if (EMBED) {
    function post(msg) { try { window.parent.postMessage(msg, '*'); } catch (e) {} }

    // Reveal the page content immediately — the shell's spinner already
    // covered the gap; the per-page loader is redundant inside the frame.
    docEl.classList.add('ss-ready');
    var el = loaderEl(); if (el) el.classList.add('is-hidden');

    function announceReady() { post({ type: 'ss-nav-done', path: location.pathname }); }
    if (document.readyState === 'interactive' || document.readyState === 'complete') announceReady();
    else document.addEventListener('DOMContentLoaded', announceReady);
    window.addEventListener('load', announceReady);

    // Outgoing navigation inside the frame (e.g. enquiry row → detail page):
    // ask the shell to show its content-area spinner.
    window.addEventListener('beforeunload', function () { post({ type: 'ss-nav-start' }); });

    // Forward content scroll so the shell can auto-hide the mobile chrome.
    var scrollPending = false;
    document.addEventListener('scroll', function (e) {
      var t = e.target;
      var y = (t && typeof t.scrollTop === 'number')
        ? t.scrollTop
        : (document.scrollingElement ? document.scrollingElement.scrollTop : (window.pageYOffset || 0));
      if (scrollPending) return;
      scrollPending = true;
      requestAnimationFrame(function () { scrollPending = false; post({ type: 'ss-scroll', y: y || 0 }); });
    }, true);

    // Minimal API so the page's setPage/goSub (normally hidden here) is harmless.
    window.__routeLoader = { show: function () { post({ type: 'ss-nav-start' }); }, hide: function () {} };
    return;
  }

  // ── Standalone mode: the original timed full-screen loader. ──
  var MIN_VISIBLE_MS = 1300;            // keep the loader up at least this long
  var startedAt = Date.now();

  function coverNow() {                 // entering a navigation: re-cover content
    docEl.classList.remove('ss-ready');
    var el = loaderEl(); if (el) el.classList.remove('is-hidden');
  }
  function revealNow() {                // remove loader instantly, fade content in
    var el = loaderEl(); if (el) el.classList.add('is-hidden');
    docEl.classList.add('ss-ready');
  }
  function revealAfterMin() {           // honour the minimum visible time
    var elapsed = Date.now() - startedAt;
    setTimeout(revealNow, Math.max(0, MIN_VISIBLE_MS - elapsed));
  }

  // Public API used by the store (setPage / goSub) and any manual callers.
  window.__routeLoader = { show: coverNow, hide: revealNow };

  if (document.readyState === 'complete') { revealAfterMin(); }
  else { window.addEventListener('load', revealAfterMin); }
  // Back/forward (bfcache) restore only — reveal instantly. On a NORMAL initial
  // load pageshow also fires (persisted === false); we must NOT reveal there, or
  // it would pre-empt revealAfterMin() and defeat the minimum visible time.
  window.addEventListener('pageshow', function (e) { if (e && e.persisted) revealNow(); });
  window.addEventListener('beforeunload', coverNow);   // outgoing navigation
  setTimeout(revealNow, 6000);                         // safety net
})();
