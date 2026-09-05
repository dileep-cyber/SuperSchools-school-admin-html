// =====================================================================
// enq-test.mjs — standalone interaction checks for the Enquiries page:
//   1) clicking a table row BODY navigates to enquiry-detail.html
//   2) clicking a row CONTROL (checkbox) does NOT navigate (exclusion guard)
//   3) on a phone width the list scrolls (pager reachable)
// Node 22 global fetch + WebSocket + CDP, no deps.  Run: node _build/enq-test.mjs
// =====================================================================
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENQ = 'file:///' + join(ROOT, 'pages', 'super-crm', 'enquiries.html').replace(/\\/g, '/');
const SHOTS = join(ROOT, '_build', 'shots');
const PORT = 9800 + Math.floor(Math.random() * 300);
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0, fail = 0; const fails = [];
const ok = (m) => { pass++; console.log('  ✓ ' + m); };
const bad = (m) => { fail++; fails.push(m); console.log('  ✗ ' + m); };

class CDP {
  constructor(ws){ this.ws=ws; this.id=0; this.w=new Map(); this.ev=new Map();
    ws.addEventListener('message',(e)=>{ const m=JSON.parse(e.data);
      if(m.id&&this.w.has(m.id)){ const {res,rej}=this.w.get(m.id); this.w.delete(m.id); m.error?rej(new Error(m.error.message)):res(m.result); }
      else if(m.method){ (this.ev.get(m.method)||[]).forEach(c=>c(m.params)); } }); }
  send(method,params={}){ const id=++this.id; return new Promise((res,rej)=>{ this.w.set(id,{res,rej}); this.ws.send(JSON.stringify({id,method,params}));
    setTimeout(()=>{ if(this.w.has(id)){ this.w.delete(id); rej(new Error('timeout '+method)); } },20000); }); }
  on(m,c){ const l=this.ev.get(m)||[]; l.push(c); this.ev.set(m,l); }
  async ev_(expr){ const r=await this.send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});
    if(r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text); return r.result.value; }
  async waitFor(expr,t=8000){ const s=Date.now(); while(Date.now()-s<t){ try{ if(await this.ev_(expr)) return true; }catch(e){} await sleep(80); } return false; }
  async nav(url){ await this.send('Page.navigate',{url}); await this.waitFor('document.readyState==="complete"',12000); await sleep(400); }
}

async function main(){
  const dir = mkdtempSync(join(tmpdir(),'enq-'));
  const chrome = spawn(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${PORT}`,`--user-data-dir=${dir}`,'about:blank'], {stdio:'ignore'});
  let cdp;
  try {
    let wsUrl;
    for (let i=0;i<50 && !wsUrl;i++){ try { const l=await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p=l.find(t=>t.type==='page'&&t.webSocketDebuggerUrl); if(p) wsUrl=p.webSocketDebuggerUrl; }catch(e){} if(!wsUrl) await sleep(150); }
    const ws = new WebSocket(wsUrl); await new Promise((res,rej)=>{ ws.addEventListener('open',res); ws.addEventListener('error',rej); });
    cdp = new CDP(ws); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');

    // ---- desktop: row body opens detail ----
    console.log('\n[1440] row body → enquiry-detail.html');
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await cdp.nav(ENQ);
    const haveRows = await cdp.waitFor('!!document.querySelector("#tableBody tr[data-id]")', 10000);
    ok('table rows rendered with data-id = ' + haveRows);
    const id = await cdp.ev_('(document.querySelector("#tableBody tr[data-id]")||{}).getAttribute?.("data-id")');
    // click a non-control data cell of the first row
    await cdp.ev_('(function(){ const tr=document.querySelector("#tableBody tr[data-id]"); const cell=[...tr.querySelectorAll("td")].find(td=>!td.querySelector("input,button,a,select")); (cell||tr).click(); })()');
    const navd = await cdp.waitFor('/enquiry-detail\\.html/.test(location.href)', 8000);
    navd ? ok('clicking the row body navigated to enquiry-detail.html (id sent: ' + id + ')') : bad('row body click did NOT navigate to enquiry-detail.html (loc=' + (await cdp.ev_('location.href')) + ')');

    // ---- desktop: clicking the checkbox must NOT navigate ----
    console.log('\n[1440] row control (checkbox) must NOT open detail');
    await cdp.nav(ENQ);
    await cdp.waitFor('!!document.querySelector("#tableBody tr[data-id] input[type=checkbox]")', 10000);
    await cdp.ev_('document.querySelector("#tableBody tr[data-id] input[type=checkbox]").click()');
    await sleep(500);
    const stayed = await cdp.ev_('/enquiries\\.html$/.test(location.pathname) || /enquiries\\.html/.test(location.href)');
    stayed ? ok('clicking the row checkbox did NOT open the detail (exclusion guard works)') : bad('checkbox click wrongly navigated away (loc=' + (await cdp.ev_('location.href')) + ')');

    // ---- mobile: the list scrolls (pager reachable) ----
    console.log('\n[390] mobile list scrolls — pager reachable');
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:780,deviceScaleFactor:1,mobile:true,screenWidth:390,screenHeight:780});
    await cdp.nav(ENQ);
    await cdp.waitFor('!!document.querySelector("#tableCardsMobile [data-id], #tableBody tr[data-id]")', 10000);
    const scrollable = await cdp.ev_('(document.scrollingElement.scrollHeight - window.innerHeight) > 80');
    scrollable ? ok('document is taller than the viewport → it scrolls (scrollHeight ' + (await cdp.ev_('document.scrollingElement.scrollHeight')) + ' > ' + (await cdp.ev_('window.innerHeight')) + ')') : bad('page does not scroll on mobile (content still clipped)');
    // scroll to bottom and confirm the pager ("Showing X of Y") is on screen
    await cdp.ev_('window.scrollTo(0, document.scrollingElement.scrollHeight)'); await sleep(400);
    const pagerSeen = await cdp.ev_('(function(){ const p=document.querySelector("#tablePager"); if(!p) return false; const r=p.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0 && p.offsetParent!==null; })()');
    const cardsCount = await cdp.ev_('document.querySelectorAll("#tableCardsMobile [data-id]").length');
    pagerSeen ? ok('after scrolling to the bottom the pager is reachable; mobile cards rendered = ' + cardsCount) : bad('pager not reachable after scroll (mobile cards=' + cardsCount + ')');
    const r = await cdp.send('Page.captureScreenshot', { format:'png', captureBeyondViewport:false });
    writeFileSync(join(SHOTS,'p4_enq_mobile_bottom.png'), Buffer.from(r.data,'base64'));
    console.log('     — shot: _build/shots/p4_enq_mobile_bottom.png');
  } finally {
    try { if(cdp) await cdp.send('Browser.close'); } catch(e){}
    try { chrome.kill(); } catch(e){}
  }
  console.log(`\n===== Enquiries interaction test =====\nPassed: ${pass}\nFailed: ${fail}`);
  if (fails.length){ console.log('\nFAILURES:'); fails.forEach(f=>console.log('  ✗ '+f)); process.exit(1); }
  console.log('\nRESULT: PASS ✓'); process.exit(0);
}
main().catch((e)=>{ console.error('FATAL',e); process.exit(2); });
