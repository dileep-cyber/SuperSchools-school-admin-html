/* =====================================================================
   AppShell — composes the global chrome.
   ---------------------------------------------------------------------
   Injects the Sidebar, TopNav, MobileNav + HamburgerMenu, and Toast
   components into the four data-shell placeholders present in every page,
   synchronously while the document parses (before the deferred Alpine
   bundle runs), so Alpine binds the freshly-injected shell in one pass.

   EMBEDDED MODE — when a page runs inside the persistent shell's
   <iframe> (index.html), the global sidebar + top nav live in the SHELL,
   not the page. So here we DETECT the iframe (window.top !== window.self)
   and skip injecting the page's own sidebar / top-nav / mobile-nav /
   account drawer, hide the per-page route loader, and reveal the content
   instantly. Only the content (+ in-page toasts) remains. Opened
   standalone, the page still renders its own full chrome unchanged.

   Component markup lives in components/*.js (window.SS.components.*).
   Route-loader behaviour lives in components/RouteLoader.js.
   In a Next.js port this is the root layout (app/layout) that renders
   <Sidebar/> <TopNav/> <MobileNav/> <HamburgerMenu/> <Toast/> around {children}.
   ===================================================================== */
(function () {
  'use strict';
  var C = (window.SS && window.SS.components) || {};
  var EMBED = (function () { try { return window.top !== window.self; } catch (e) { return true; } })();

  function mount(selector, html) {
    var el = document.querySelector(selector);
    if (el && typeof html === 'string') { el.outerHTML = html; }
  }

  if (EMBED) {
    // The shell provides the chrome — strip the page's own copy and show only content.
    var docEl = document.documentElement;
    docEl.classList.add('ss-embed');
    var st = document.createElement('style');
    st.setAttribute('data-ss-embed', '');
    st.textContent =
      'html.ss-embed [data-shell="sidebar"],' +
      'html.ss-embed [data-shell="header"],' +
      'html.ss-embed [data-shell="chrome-inner"]{display:none !important;}' +
      'html.ss-embed .ss-app{opacity:1 !important;}' +
      'html.ss-embed #routeLoader{display:none !important;}' +
      'html.ss-embed main > section{padding-bottom:0 !important;}';
    (document.head || docEl).appendChild(st);
    // Only the global toast stack is still useful inside the frame.
    mount('[data-shell="chrome-outer"]', C.Toast);
    return;
  }

  // Standalone page — inject the full chrome (unchanged legacy behaviour).
  mount('[data-shell="sidebar"]',      C.Sidebar);
  mount('[data-shell="header"]',       C.TopNav);
  mount('[data-shell="chrome-inner"]', (C.MobileNav || '') + (C.HamburgerMenu || ''));
  mount('[data-shell="chrome-outer"]', C.Toast);
})();
