// =====================================================================
// cdp-test.mjs — drives the persistent shell in headless Chrome (CDP)
// and asserts the live navigation behaviour: sidebar / level-1 / level-2
// nav swap ONLY the content iframe (with a spinner), the chrome stays put,
// the sidebar collapses, and the active tab stays in sync. Also captures
// screenshots of every key state at desktop / tablet / mobile.
//
// No npm deps — uses Node 22's global fetch + global WebSocket + CDP.
// Run:  node _build/cdp-test.mjs
// =====================================================================
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = join(ROOT, '_build', 'shots');
if (!existsSync(SHOTS)) mkdirSync(SHOTS, { recursive: true });
const INDEX_URL = 'file:///' + join(ROOT, 'index.html').replace(/\\/g, '/');
const PORT = 9333 + Math.floor(Math.random() * 400);
const CHROME = process.env.CHROME ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0, fail = 0; const failures = [];
const ok = (m) => { pass++; console.log('  ✓ ' + m); };
const bad = (m) => { fail++; failures.push(m); console.log('  ✗ ' + m); };
const assert = (cond, m) => cond ? ok(m) : bad(m);

// ---- tiny CDP client -------------------------------------------------
class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.waiters = new Map(); this.events = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.waiters.has(msg.id)) {
        const { resolve, reject } = this.waiters.get(msg.id); this.waiters.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method) {
        const list = this.events.get(msg.method) || []; list.forEach((cb) => cb(msg.params));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.waiters.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => { if (this.waiters.has(id)) { this.waiters.delete(id); reject(new Error('timeout ' + method)); } }, 20000);
    });
  }
  on(method, cb) { const l = this.events.get(method) || []; l.push(cb); this.events.set(method, l); }
  async eval(expression) {
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error('eval error: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r.result.value;
  }
  async waitFor(expression, { timeout = 8000, interval = 80 } = {}) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try { if (await this.eval(expression)) return true; } catch (e) {}
      await sleep(interval);
    }
    return false;
  }
}

async function getJson(path) {
  const res = await fetch(`http://127.0.0.1:${PORT}${path}`);
  return res.json();
}

async function connectPage() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await getJson('/json');
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch (e) {}
    await sleep(150);
  }
  throw new Error('Could not find a page target on CDP port ' + PORT);
}

// Helper script injected into the page to read state + click real DOM nodes.
const HELPER = `
window.__t = {
  S(){ return Alpine.$data(document.querySelector('[x-data]')); },
  state(){ const $=this.S(); return { ap:$.activePage, cs:$.crmSection, ss:$.schoolSection, hr:$.hrSection, set:$.settingsSection,
    loading:$.loading, frameSrc:$.frameSrc, placeholder:$.placeholder, collapsed:$.sidebarCollapsed, peek:$.sidebarPeek,
    showVisitsL2:$.showVisitsL2Nav, crmVisits:$.crmVisitsSection,
    iframeSrc:(document.querySelector('iframe')||{}).getAttribute && document.querySelector('iframe').getAttribute('src') }; },
  clickSidebar(label){ const b=[...document.querySelectorAll('aside nav button')].find(x=>x.getAttribute('aria-label')===label); if(b){b.click();return true;} return false; },
  clickTop(label){ const b=[...document.querySelectorAll('header nav button')].find(x=>x.textContent.trim()===label); if(b){b.click();return true;} return false; },
  vis(x){ return x.getClientRects().length > 0; },  // visible incl. position:fixed (offsetParent is null for fixed)
  clickL2(label){ const b=[...document.querySelectorAll('main > div nav button')].find(x=>x.textContent.trim()===label && this.vis(x)); if(b){b.click();return true;} return false; },
  l2ActionIds(){ return this.S().l2Actions.map(a=>a.id); },
  clickL2Action(label){ const b=[...document.querySelectorAll('main > div button[aria-label]')].find(x=>x.getAttribute('aria-label')===label && this.vis(x)); if(b){b.click();return true;} return false; },
  navMsg(module,section){ window.postMessage({type:'ss-navigate', module, section}, '*'); },
  l2TopClass(){ const d=[...document.querySelectorAll('main > div')].find(x=>this.vis(x) && x.querySelector('nav[aria-label$="sub-navigation"]')); return d ? (d.className.match(/top-\\d+/)||[''])[0] : ''; },
  toggle(){ this.S().toggleSidebar(); },
  frameLoaded(){ try { const f=document.querySelector('iframe'); return !!(f && f.contentDocument && f.contentDocument.querySelector('[x-data]')); } catch(e){ return false; } }
};
true;`;

async function shot(cdp, name) {
  await sleep(450);
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(join(SHOTS, name), Buffer.from(r.data, 'base64'));
  console.log('     — shot: _build/shots/' + name);
}

async function setViewport(cdp, w, h, mobile) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: !!mobile, screenWidth: w, screenHeight: h });
}

async function gotoFresh(cdp, w, h, mobile) {
  await setViewport(cdp, w, h, mobile);
  await cdp.send('Page.navigate', { url: INDEX_URL });
  await cdp.waitFor('!!(window.Alpine && document.querySelector("[x-data]") && Alpine.$data(document.querySelector("[x-data]")))', { timeout: 12000 });
  await cdp.eval(HELPER);
  // Deterministic starting point per phase: clear the persisted sidebar state
  // (collapse persistence is a real feature — proven in the desktop phase — but
  // we don't want it leaking the collapsed state into the tablet default shot).
  await cdp.eval('(function(){ try{localStorage.removeItem("ssSidebarCollapsed")}catch(e){} var $=__t.S(); $.sidebarCollapsed=false; $.sidebarPeek=false; $.crmAutoCollapsed=false; })()');
  await cdp.waitFor('__t.frameLoaded() && !__t.state().loading', { timeout: 12000 });
}

async function main() {
  const userDir = mkdtempSync(join(tmpdir(), 'ss-cdp-'));
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--no-default-browser-check', '--disable-background-timer-throttling',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${userDir}`, 'about:blank'
  ], { stdio: 'ignore' });

  let cdp;
  try {
    const wsUrl = await connectPage();
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
    cdp = new CDP(ws);
    // Capture uncaught exceptions + console.error from the shell (and same-process frames).
    const jsErrors = [];
    cdp.on('Runtime.exceptionThrown', (p) => {
      const d = p.exceptionDetails || {};
      jsErrors.push('EXCEPTION: ' + (d.exception?.description || d.text || JSON.stringify(d)).split('\n')[0]);
    });
    cdp.on('Runtime.consoleAPICalled', (p) => {
      if (p.type !== 'error') return;
      const txt = (p.args || []).map((a) => a.value || a.description || a.unserializableValue || '').join(' ');
      jsErrors.push('console.error: ' + txt);
    });
    await cdp.send('Page.enable'); await cdp.send('Runtime.enable');

    // ============ DESKTOP 1440 ============
    console.log('\n[desktop 1440] initial load');
    await gotoFresh(cdp, 1440, 900, false);
    let s = await cdp.eval('__t.state()');
    assert(s.ap === 'school' && s.ss === 'school', 'initial module = Super Schools / My School');
    assert(/super-school\/school\.html$/.test(s.frameSrc), 'content iframe = school.html (' + s.frameSrc + ')');
    assert(s.loading === false, 'spinner cleared after initial load');
    assert(s.collapsed === false, 'sidebar open initially');
    await shot(cdp, 'v1_desktop_school.png');

    console.log('\n[desktop] click sidebar -> Super CRM (auto wide-workspace collapse)');
    const afterClick = await cdp.eval('(function(){ __t.clickSidebar("Super CRM"); return __t.state(); })()');
    assert(afterClick.loading === true, 'spinner shows immediately on nav (content-area only)');
    assert(/super-crm\/dashboard\.html$/.test(afterClick.frameSrc), 'iframe src switched to dashboard.html synchronously');
    await cdp.waitFor('!__t.state().loading && __t.frameLoaded()');
    s = await cdp.eval('__t.state()');
    assert(s.ap === 'admissions' && s.cs === 'dashboard', 'active module = Super CRM / Dashboard');
    assert(s.collapsed === true, 'sidebar auto-collapsed for CRM wide workspace');
    await shot(cdp, 'v2_desktop_crm_dashboard.png');

    console.log('\n[desktop] level-1 tab -> Enquiries');
    assert(await cdp.eval('__t.clickTop("Enquiries")'), 'found + clicked Enquiries tab');
    await cdp.waitFor('!__t.state().loading && /enquiries\\.html$/.test(__t.state().frameSrc)');
    s = await cdp.eval('__t.state()');
    assert(s.cs === 'enquiries' && /super-crm\/enquiries\.html$/.test(s.frameSrc), 'content swapped to enquiries.html, Enquiries active');
    await shot(cdp, 'v3_desktop_crm_enquiries.png');

    console.log('\n[desktop] level-1 tab -> My Workspace (loads workspace.html)');
    assert(await cdp.eval('__t.clickTop("My Workspace")'), 'found + clicked My Workspace tab');
    await cdp.waitFor('!__t.state().loading && /workspace\\.html$/.test(__t.state().frameSrc)');
    assert(/super-crm\/workspace\.html$/.test((await cdp.eval('__t.state()')).frameSrc), 'My Workspace loads workspace.html');
    await shot(cdp, 'p1_desktop_crm_workspace.png');

    console.log('\n[desktop] level-1 tab -> Visit (shows level-2 nav + loads visits.html)');
    assert(await cdp.eval('__t.clickTop("Visit")'), 'found + clicked Visit tab');
    await cdp.waitFor('__t.state().showVisitsL2 === true && !__t.state().loading && /visits\\.html$/.test(__t.state().frameSrc)');
    s = await cdp.eval('__t.state()');
    assert(s.showVisitsL2 === true, 'level-2 nav (Visits / Bookings) is shown under Visit');
    assert(/super-crm\/visits\.html$/.test(s.frameSrc), 'Visit › Visits loads visits.html (' + s.frameSrc + ')');
    await shot(cdp, 'v4_desktop_crm_visit_L2.png');

    console.log('\n[desktop] level-2 toggle -> Bookings then back to Visits (each loads its page)');
    assert(await cdp.eval('__t.clickL2("Bookings")'), 'clicked level-2 Bookings');
    await cdp.waitFor('__t.state().crmVisits === "bookings" && !__t.state().loading && /bookings\\.html$/.test(__t.state().frameSrc)');
    assert(/super-crm\/bookings\.html$/.test((await cdp.eval('__t.state()')).frameSrc), 'Bookings loads bookings.html');
    await shot(cdp, 'p2_desktop_crm_bookings.png');
    assert(await cdp.eval('__t.clickL2("Visits")'), 'clicked level-2 Visits');
    await cdp.waitFor('__t.state().crmVisits === "visits" && !__t.state().loading && /visits\\.html$/.test(__t.state().frameSrc)');
    assert(/super-crm\/visits\.html$/.test((await cdp.eval('__t.state()')).frameSrc), 'Visits loads visits.html (toggle both ways)');

    console.log('\n[desktop] sidebar -> Super Schools, then level-1 My Staff / Rooms (no level-2)');
    await cdp.eval('__t.clickSidebar("Super Schools")');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "school"');
    s = await cdp.eval('__t.state()');
    assert(s.collapsed === false, 'leaving CRM auto-restored the sidebar (it was auto-collapsed)');
    assert(await cdp.eval('__t.clickTop("My Staff")'), 'clicked My Staff tab');
    await cdp.waitFor('!__t.state().loading && /my-team\\.html$/.test(__t.state().frameSrc)');
    s = await cdp.eval('__t.state()');
    assert(/super-school\/my-team\.html$/.test(s.frameSrc), 'My Staff loads my-team.html (' + s.frameSrc + ')');
    assert((await cdp.eval('__t.l2TopClass()')) === '', 'My Staff has NO level-2 bar (the page carries its own title + action row)');
    await shot(cdp, 'v5_desktop_school_mystaff.png');

    assert(await cdp.eval('__t.clickTop("Rooms")'), 'clicked the new Rooms tab');
    await cdp.waitFor('!__t.state().loading && /rooms\\.html$/.test(__t.state().frameSrc)');
    s = await cdp.eval('__t.state()');
    assert(s.ss === 'rooms' && /super-school\/rooms\.html$/.test(s.frameSrc), 'Rooms loads rooms.html (' + s.frameSrc + ')');
    assert((await cdp.eval('__t.l2TopClass()')) === '', 'Rooms has no level-2 bar either');
    await shot(cdp, 'v5b_desktop_school_rooms.png');

    console.log('\n[desktop] level-2 ACTION buttons (hoisted into the L2 bar, relayed to the page)');
    await cdp.eval('__t.clickSidebar("Super CRM")');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "admissions"');
    await cdp.eval('__t.clickTop("Visit")');
    await cdp.waitFor('__t.state().showVisitsL2 && !__t.state().loading');
    assert(JSON.stringify(await cdp.eval('__t.l2ActionIds()')) === JSON.stringify(['undo', 'reset', 'publish']), 'Visit › Visits L2 bar exposes Undo / Reset / Publish actions');
    assert(await cdp.eval('__t.clickL2Action("Publish")'), 'Publish L2 action present + click relays without error');
    await cdp.eval('__t.clickL2("Bookings")');
    await cdp.waitFor('__t.state().crmVisits === "bookings" && !__t.state().loading');
    assert(JSON.stringify(await cdp.eval('__t.l2ActionIds()')) === JSON.stringify(['print', 'export', 'new-booking']), 'Visit › Bookings L2 bar exposes Print / Export / New booking actions');

    console.log('\n[desktop] ss-navigate: a page can ask the shell to open another section');
    await cdp.eval('__t.navMsg("admissions","enquiries")');
    await cdp.waitFor('!__t.state().loading && /enquiries\\.html$/.test(__t.state().frameSrc)');
    assert((await cdp.eval('__t.state()')).cs === 'enquiries', 'ss-navigate({admissions,enquiries}) routed the shell to Enquiries (Dashboard "View all admissions")');

    console.log('\n[desktop] sidebar -> Super HR (Jobs page)');
    await cdp.eval('__t.clickSidebar("Super HR")');
    await cdp.waitFor('!__t.state().loading && /hr\\.html$/.test(__t.state().frameSrc)');
    s = await cdp.eval('__t.state()');
    assert(s.ap === 'jobs' && s.hr === 'jobs', 'active module = Super HR / Jobs');
    await shot(cdp, 'v6_desktop_hr_jobs.png');

    console.log('\n[desktop] manual sidebar collapse toggle (header turns blue)');
    await cdp.eval('__t.toggle()');
    await cdp.waitFor('__t.state().collapsed === true');
    assert((await cdp.eval('__t.state()')).collapsed === true, 'manual toggle collapsed the sidebar');
    await shot(cdp, 'v7_desktop_hr_collapsed.png');
    await cdp.eval('__t.toggle()');
    await cdp.waitFor('__t.state().collapsed === false');
    assert((await cdp.eval('__t.state()')).collapsed === false, 'manual toggle re-opened the sidebar');

    console.log('\n[desktop] active-state sync: open an enquiry detail inside the frame');
    await cdp.eval('__t.clickSidebar("Super CRM")');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "admissions"');
    await cdp.eval('__t.clickTop("Enquiries")');
    await cdp.waitFor('!__t.state().loading && /enquiries\\.html$/.test(__t.state().frameSrc)');
    // Navigate the iframe to the detail page (simulating an enquiry-row click — which in the
    // real page runs INSIDE the frame, so its own relative `location.href='workflow.html?id='`
    // resolves correctly and posts the same ss-nav-start/done messages we drive here absolutely).
    const WORKFLOW_URL = INDEX_URL.replace(/index\.html$/, 'pages/super-crm/workflow.html') + '?id=1';
    await cdp.eval('document.querySelector("iframe").contentWindow.location.href = ' + JSON.stringify(WORKFLOW_URL));
    await cdp.waitFor('/workflow\\.html/.test(__t.state().frameSrc)', { timeout: 12000 });
    s = await cdp.eval('__t.state()');
    assert(s.ap === 'admissions' && s.cs === 'enquiries', 'detail view keeps Enquiries tab active (reverse sync)');
    assert(/workflow\.html/.test(s.frameSrc), 'shell knows the iframe is on workflow.html (' + s.frameSrc + ')');

    console.log('\n[desktop] remaining modules load: Settings / Community / Social');
    await cdp.eval('__t.clickSidebar("Settings")');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "settings"');
    assert(/settings\/settings\.html$/.test((await cdp.eval('__t.state()')).frameSrc), 'Settings loads settings.html');
    assert(await cdp.eval('[...document.querySelectorAll("header nav button")].length === 1 && [...document.querySelectorAll("header nav button")][0].textContent.trim() === "Settings"'), 'Settings has a single honest level-1 tab (page owns its own category nav)');
    await cdp.eval('__t.clickSidebar("Super Community")');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "community"');
    assert(/super-community\/community\.html$/.test((await cdp.eval('__t.state()')).frameSrc), 'Super Community loads community.html');
    await cdp.eval('__t.clickSidebar("Super Social")');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "social"');
    assert(/super-social\/social\.html$/.test((await cdp.eval('__t.state()')).frameSrc), 'Super Social loads social.html');

    console.log('\n[desktop] placeholder → real page transition (CRM Tasks → Dashboard)');
    await cdp.eval('__t.clickSidebar("Super CRM")');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "admissions"');
    assert(await cdp.eval('__t.clickTop("Tasks")'), 'clicked Tasks (no page)');
    await cdp.waitFor('!!__t.state().placeholder && __t.state().cs === "tasks"');
    assert(!!(await cdp.eval('__t.state()')).placeholder, 'Tasks (still unbuilt) shows placeholder (no spinner stuck)');
    assert((await cdp.eval('__t.state()')).loading === false, 'placeholder route clears the spinner');
    await cdp.eval('__t.clickTop("Dashboard")');
    await cdp.waitFor('!__t.state().loading && /dashboard\\.html$/.test(__t.state().frameSrc)');
    s = await cdp.eval('__t.state()');
    assert(!s.placeholder && /dashboard\.html$/.test(s.frameSrc), 'placeholder → real page: dashboard loads, placeholder cleared');

    console.log('\n[desktop] REGRESSION: rapid navigation — stale message must not clobber the new tab/spinner');
    // Reset to a clean module, then fire two navigations back-to-back (no settle in between).
    await cdp.eval('__t.clickSidebar("Super Schools")');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "school"');
    // Fire two navigations back-to-back, then deliver a STALE ss-nav-done from the abandoned
    // dashboard.html synchronously (while enquiries.html is still in flight) — it must be ignored.
    const race = await cdp.eval('(function(){' +
      ' const $=__t.S();' +
      ' $.setPage("admissions"); $.onTopNav({ id:"enquiries", label:"Enquiries", kind:"crm" });' +
      ' const csNow=$.crmSection, srcNow=$.frameSrc, loadingNow=$.loading, pendingNow=$._pendingFrame;' +
      ' $.handleMessage({ data:{ type:"ss-nav-done", path:"/x/pages/super-crm/dashboard.html" } });' +
      ' return { csNow, srcNow, loadingNow, pendingNow, csAfter:$.crmSection, srcAfter:$.frameSrc, loadingAfter:$.loading };' +
      '})()');
    assert(race.csNow === 'enquiries' && /enquiries\.html$/.test(race.srcNow) && race.loadingNow === true, 'rapid CRM→Enquiries: shell waits on enquiries.html with the spinner up');
    assert(race.csAfter === 'enquiries' && /enquiries\.html$/.test(race.srcAfter) && race.loadingAfter === true, 'stale dashboard.html ss-nav-done is IGNORED (tab stays Enquiries, spinner stays up)');
    await cdp.waitFor('!__t.state().loading && /enquiries\\.html$/.test(__t.state().frameSrc)');
    assert((await cdp.eval('__t.state()')).cs === 'enquiries', 'after settle, content is Enquiries (race resolved correctly)');
    // And a legitimate in-frame nav (pending already cleared by the real load) must STILL sync.
    const inframe = await cdp.eval('(function(){ const $=__t.S(); $.handleMessage({ data:{ type:"ss-nav-done", path:"/x/pages/super-crm/workflow.html" } }); return { cs:$.crmSection, src:$.frameSrc }; })()');
    assert(inframe.cs === 'enquiries' && /workflow\.html$/.test(inframe.src), 'legitimate in-frame nav (workflow) is accepted & synced (not wrongly rejected)');

    console.log('\n[desktop] REGRESSION: CRM auto-collapse is NOT persisted; manual collapse IS');
    await gotoFresh(cdp, 1440, 900, false);
    await cdp.eval('__t.clickSidebar("Super CRM")');
    await cdp.waitFor('__t.state().collapsed === true');
    assert((await cdp.eval('localStorage.getItem("ssSidebarCollapsed")')) !== '1', 'auto-collapse for CRM is not written to localStorage');
    await cdp.eval('__t.S().expandSidebar(); __t.S().collapseSidebar()'); // manual collapse
    assert((await cdp.eval('localStorage.getItem("ssSidebarCollapsed")')) === '1', 'a manual collapse IS persisted to localStorage');

    console.log('\n[desktop] REGRESSION: level-2 selection resets when its level-1 tab is re-entered');
    await cdp.eval('__t.clickSidebar("Super CRM")');
    await cdp.waitFor('!__t.state().loading');
    await cdp.eval('__t.clickTop("Visit")');
    await cdp.waitFor('__t.state().showVisitsL2 === true');
    await cdp.eval('__t.clickL2("Bookings")');
    await cdp.waitFor('__t.state().crmVisits === "bookings"');
    await cdp.eval('__t.clickTop("Dashboard")');           // leave Visit
    await cdp.waitFor('__t.state().showVisitsL2 === false');
    await cdp.eval('__t.clickTop("Visit")');               // re-enter Visit
    await cdp.waitFor('__t.state().showVisitsL2 === true');
    assert((await cdp.eval('__t.state()')).crmVisits === 'visits', 're-entering Visit resets level-2 to Visits (not stale Bookings)');

    console.log('\n[desktop] overlays: search + account drawer open/close');
    await cdp.eval('[...document.querySelectorAll("header button")].find(b=>b.getAttribute("aria-label")==="Search").click()');
    await cdp.waitFor('__t.S().searchOpen === true');
    assert((await cdp.eval('__t.S().searchOpen')) === true, 'search overlay opens');
    await cdp.eval('__t.S().searchOpen = false');
    await cdp.eval('[...document.querySelectorAll("header button")].find(b=>b.getAttribute("aria-label")==="Open menu").click()');
    await cdp.waitFor('__t.S().rightMenuOpen === true');
    assert((await cdp.eval('__t.S().rightMenuOpen')) === true, 'account drawer opens');
    await cdp.eval('__t.S().rightMenuOpen = false');

    // ============ TABLET 768 ============
    console.log('\n[tablet 768] initial load');
    await gotoFresh(cdp, 768, 1024, false);
    s = await cdp.eval('__t.state()');
    assert(/school\.html$/.test(s.frameSrc), 'tablet: school content loaded');
    await shot(cdp, 'v8_tablet_school.png');
    await cdp.eval('__t.clickSidebar("Super CRM")');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "admissions"');
    await shot(cdp, 'v9_tablet_crm.png');

    // ============ MOBILE 390 ============
    console.log('\n[mobile 390] initial load (blue header, bottom nav, no sidebar)');
    await gotoFresh(cdp, 390, 844, true);
    s = await cdp.eval('__t.state()');
    assert(/school\.html$/.test(s.frameSrc), 'mobile: school content loaded');
    await shot(cdp, 'v10_mobile_school.png');
    // mobile chrome auto-hide: the embedded page forwards content scroll via postMessage.
    await cdp.eval('__t.S().lastScrollY = 0; window.postMessage({ type: "ss-scroll", y: 200 }, "*")');
    await cdp.waitFor('__t.S().mobileTopHidden === true');
    assert((await cdp.eval('__t.S().mobileTopHidden')) === true, 'mobile: scroll down hides the top bar (scroll bridge)');
    await cdp.eval('window.postMessage({ type: "ss-scroll", y: 40 }, "*")');
    await cdp.waitFor('__t.S().mobileTopHidden === false && __t.S().mobileBottomHidden === true');
    assert((await cdp.eval('__t.S().mobileBottomHidden')) === true, 'mobile: scroll up reveals top bar / hides bottom bar');
    await cdp.eval('window.postMessage({ type: "ss-scroll", y: 0 }, "*")');
    await cdp.waitFor('!__t.S().mobileTopHidden && !__t.S().mobileBottomHidden');
    assert(true, 'mobile: back at top → both bars visible');
    // mobile bottom nav switch to CRM
    assert(await cdp.eval('[...document.querySelectorAll("nav[aria-label=\\"Mobile navigation\\"] button")].some(b=>b.getAttribute("aria-label")==="Super CRM")'), 'mobile bottom nav has Super CRM');
    await cdp.eval('[...document.querySelectorAll("nav[aria-label=\\"Mobile navigation\\"] button")].find(b=>b.getAttribute("aria-label")==="Super CRM").click()');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "admissions"');
    s = await cdp.eval('__t.state()');
    assert(s.ap === 'admissions', 'mobile bottom nav switched module to Super CRM');
    await shot(cdp, 'v11_mobile_crm.png');
    // mobile Super Schools -> Rooms (three level-1 tabs, no level-2 bar)
    await cdp.eval('[...document.querySelectorAll("nav[aria-label=\\"Mobile navigation\\"] button")].find(b=>b.getAttribute("aria-label")==="Super Schools").click()');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "school"');
    await cdp.eval('__t.clickTop("Rooms")');
    await cdp.waitFor('!__t.state().loading && /rooms\\.html$/.test(__t.state().frameSrc)');
    assert((await cdp.eval('__t.l2TopClass()')) === '', 'mobile: Super Schools has no level-2 bar');
    await shot(cdp, 'v12_mobile_school_rooms.png');
    // #7 mobile sticky: with a level-2 bar present (CRM › Visit), scrolling down hides L1 and sticks L2 to the very top.
    await cdp.eval('[...document.querySelectorAll("nav[aria-label=\\"Mobile navigation\\"] button")].find(b=>b.getAttribute("aria-label")==="Super CRM").click()');
    await cdp.waitFor('!__t.state().loading && __t.state().ap === "admissions"');
    await cdp.eval('__t.clickTop("Visit")');
    await cdp.waitFor('__t.state().showVisitsL2 === true && !__t.state().loading');
    await cdp.eval('__t.S().lastScrollY = 0; window.postMessage({ type: "ss-scroll", y: 300 }, "*")');
    await cdp.waitFor('__t.S().mobileTopHidden === true');
    assert((await cdp.eval('__t.l2TopClass()')) === 'top-0', 'mobile #7: scrolling down sticks the level-2 bar to top-0 (L1 hidden)');
    await shot(cdp, 'p3_mobile_visit_sticky.png');
    await cdp.eval('window.postMessage({ type: "ss-scroll", y: 0 }, "*")');
    await cdp.waitFor('!__t.S().mobileTopHidden');
    assert((await cdp.eval('__t.l2TopClass()')) === 'top-14', 'mobile #7: back at top, level-2 bar sits under the 56px level-1 header (top-14)');

    // Final guard: no uncaught JS exceptions / console errors during the whole run.
    console.log('\n[all] no JavaScript errors during the run');
    assert(jsErrors.length === 0, 'zero JS exceptions / console errors' + (jsErrors.length ? ' (' + jsErrors.slice(0, 6).join(' | ') + ')' : ''));
  } finally {
    try { if (cdp) await cdp.send('Browser.close'); } catch (e) {}
    try { chrome.kill(); } catch (e) {}
  }

  console.log('\n===== CDP behaviour test =====');
  console.log(`Passed: ${pass}`);
  console.log(`Failed: ${fail}`);
  if (failures.length) { console.log('\n--- FAILURES ---'); failures.forEach((f) => console.log('  ✗ ' + f)); console.log('\nRESULT: FAIL'); process.exit(1); }
  console.log('\nRESULT: PASS ✓'); process.exit(0);
}

main().catch((e) => { console.error('FATAL', e); process.exit(2); });
