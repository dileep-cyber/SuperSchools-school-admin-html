/* =====================================================================
   HeaderControls — lets an EMBEDDED page put controls into the shell's top
   header instead of drawing them inside the page.
   ---------------------------------------------------------------------
   The global top header lives in index.html (appShell()). A page registers:

   1) DROPDOWN CONTROLS (before the search icon) — school switcher, demo role…
        SSHeader.set([{
          id: 'school',                 // unique per control
          label: 'Select school',       // heading of the dropdown panel
          icon: 'school',               // Material Symbol shown on the button
          prefix: 'Demo',               // optional small tag before the value (>= md screens)
          value: 'green-valley',        // currently selected option value
          options: [{ value, label, sub, short }]   // short = label used on narrow screens
        }]);
        SSHeader.on('school', function (value) { ... });

      A control may instead carry several radio GROUPS (used for demo states):
        { id:'demo', label:'Demo states', icon:'tune', prefix:'Demo', title:'States',
          groups:[{ key:'list', title:'Page', value:'loaded', options:[{value,label}] }, ...] }
        SSHeader.on('demo', function (value, groupKey) { ... });

   2) LEVEL-1 TABS (replace the module's top-nav tabs) — e.g. community types
        SSHeader.setTabs([{ id:'preschool', label:'Preschool Community', active:true }]);
        SSHeader.on('tab', function (id) { ... });

   3) SECTION (shell level-2 nav -> page), e.g. Super Connect dashboard/template…
        SSHeader.onSection(function (section) { ... });

   Transport: page -> shell  {type:'ss-controls', controls} / {type:'ss-tabs', tabs}
              shell -> page  {type:'ss-control', id, value, group} / {type:'ss-section', section}
   Standalone (not in the shell) this is a harmless no-op.
   Maps to a context/provider in a Next.js port.
   ===================================================================== */
(function () {
  'use strict';
  var handlers = {};
  var sectionFn = null;
  var lastControls = [], lastTabs = null, lastSection = null;
  var EMBED = (function () { try { return window.top !== window.self; } catch (e) { return true; } })();

  // Plain-JSON copy: reactive proxies (Alpine/Vue) cannot be structured-cloned by postMessage.
  function plain(v) { try { return JSON.parse(JSON.stringify(v)); } catch (e) { return v; } }
  function post(msg) { try { window.parent.postMessage(plain(msg), '*'); } catch (e) {} }
  function send() {
    post({ type: 'ss-controls', controls: lastControls });
    if (lastTabs) post({ type: 'ss-tabs', tabs: lastTabs });
  }

  window.SSHeader = {
    set: function (controls) { lastControls = plain(controls || []); if (EMBED) post({ type: 'ss-controls', controls: lastControls }); },
    setTabs: function (tabs) { lastTabs = plain(tabs || []); if (EMBED) post({ type: 'ss-tabs', tabs: lastTabs }); },
    on: function (id, fn) { handlers[id] = fn; },
    // ask the shell to hide its sidebar / top bar while a wizard is open (the page then shows its own header)
    fullscreen: function (on) { if (EMBED) post({ type: 'ss-fullscreen', on: !!on }); },
    onSection: function (fn) { sectionFn = fn; if (lastSection && fn) fn(lastSection); }
  };

  window.addEventListener('message', function (e) {
    var d = e && e.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === 'ss-control' && handlers[d.id]) handlers[d.id](d.value, d.group);
    else if (d.type === 'ss-section') { lastSection = d.section; if (sectionFn) sectionFn(d.section); }
    else if (d.type === 'ss-controls-request' && EMBED) send();
  });
  // Re-announce once the page is fully loaded, in case the shell mounted after the first send.
  if (EMBED) window.addEventListener('load', send);
})();
