/* A signed-in visitor on a pre-login page sees "Go to dashboard" instead of "School sign in". */
(function () {
  if (!window.SSAuth || !window.SSAuth.isAuthed()) return;
  document.querySelectorAll('a[href$="login/login.html"]').forEach(function (a) {
    a.setAttribute('href', window.SSAuth.url('console.html'));
    var s = a.querySelector('span') || a;
    if (/sign in|log in/i.test(s.textContent)) s.textContent = 'Go to dashboard';
  });
})();

/* Shared header-menu behaviour for every Superschools pre-login page.
   Hover opens; click pins open; click again closes; scrolling closes; Esc / outside click closes.
   The menu stays open while the pointer is on the menu name OR its panel (with a bridge across the gap). */
(function () {
  var css = document.createElement("style");
  css.textContent =
    ".mn__top[aria-expanded='true']::before{content:'';position:absolute;left:-16px;right:-16px;top:100%;height:34px}" +
    ".mn__head--off,.dg__off{cursor:default;pointer-events:none}.dg__off{display:block;padding:10px 12px;opacity:.9}" +
    ".mn__panel{z-index:200}" +
    ".mn__foot p{margin:0;line-height:1.6}.mn__foot .dg__off{display:inline;padding:0;opacity:1;color:var(--color-ink-3)}";
  document.head.appendChild(css);

  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  var menus = [];
  document.querySelectorAll("[data-mn]").forEach(function (old) {
    var m = old.cloneNode(true);           /* clone drops the older per-page listeners */
    old.parentNode.replaceChild(m, old);
    menus.push(m);
  });

  function set(m, on) {
    m.querySelector(".mn__top").setAttribute("aria-expanded", on ? "true" : "false");
    m.querySelector(".mn__panel").hidden = !on;
    if (!on) m._pin = false;
  }
  function closeAll(except) { menus.forEach(function (x) { if (x !== except) { clearTimeout(x._t); set(x, false); } }); }

  menus.forEach(function (m) {
    var b = m.querySelector(".mn__top"), p = m.querySelector(".mn__panel");
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = b.getAttribute("aria-expanded") === "true";
      if (open && m._pin) { set(m, false); return; }      /* pinned -> click closes */
      closeAll(m); set(m, true); m._pin = true;            /* closed or hover-open -> click pins */
    });
    m.addEventListener("mouseenter", function () {
      if (!fine.matches) return;
      clearTimeout(m._t);
      if (b.getAttribute("aria-expanded") !== "true") { closeAll(m); set(m, true); }
    });
    m.addEventListener("mouseleave", function () {
      if (!fine.matches || m._pin) return;
      clearTimeout(m._t); m._t = setTimeout(function () { set(m, false); }, 300);
    });
    p.addEventListener("click", function (e) { if (e.target.closest("a[href]")) closeAll(); });
    m.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAll(); b.focus(); } });
  });

  document.addEventListener("click", function (e) { if (!e.target.closest("[data-mn]")) closeAll(); });
  var lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    if (Math.abs(window.scrollY - lastY) > 2) closeAll();
    lastY = window.scrollY;
  }, { passive: true });
})();
