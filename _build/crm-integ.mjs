// =====================================================================
// crm-integ.mjs — cross-page integration test for the shared CRM store.
// Proves: (1) every CRM sub-module renders WITH the shared data, (2) a
// mutation in one page persists and is seen by another (same-origin
// localStorage), (3) staff added in My Team flow to Visits/Bookings,
// (4) the empty→data lifecycle works on each page. Restores demo data at end.
// Node 22 global fetch+WebSocket+CDP. Run: node _build/crm-integ.mjs
// =====================================================================
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const U = (p) => 'file:///' + join(ROOT, 'pages', p).replace(/\\/g, '/');
const PORT = 9100 + Math.floor(Math.random() * 600);
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0, fail = 0; const fails = [];
const ok = (m) => { pass++; console.log('  ✓ ' + m); };
const bad = (m) => { fail++; fails.push(m); console.log('  ✗ ' + m); };
const A = (c, m) => c ? ok(m) : bad(m);

class CDP {
  constructor(ws){ this.ws=ws; this.id=0; this.w=new Map();
    ws.addEventListener('message',(e)=>{ const m=JSON.parse(e.data); if(m.id&&this.w.has(m.id)){ const {res,rej}=this.w.get(m.id); this.w.delete(m.id); m.error?rej(new Error(m.error.message)):res(m.result);} }); }
  send(method,params={}){ const id=++this.id; return new Promise((res,rej)=>{ this.w.set(id,{res,rej}); this.ws.send(JSON.stringify({id,method,params})); setTimeout(()=>{ if(this.w.has(id)){ this.w.delete(id); rej(new Error('timeout '+method)); } },20000); }); }
  async ev(expr){ const r=await this.send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true}); if(r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text); return r.result.value; }
  async waitFor(expr,t=10000){ const s=Date.now(); while(Date.now()-s<t){ try{ if(await this.ev(expr)) return true; }catch(e){} await sleep(90);} return false; }
  async go(url){ await this.send('Page.navigate',{url}); await this.waitFor('document.readyState==="complete"',12000); await this.waitFor('!!window.CRM',8000); await sleep(500); }
}

async function main(){
  const dir=mkdtempSync(join(tmpdir(),'crm-'));
  const chrome=spawn(CHROME,['--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${PORT}`,`--user-data-dir=${dir}`,'about:blank'],{stdio:'ignore'});
  let cdp;
  try {
    let wsUrl; for(let i=0;i<60&&!wsUrl;i++){ try{ const l=await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p=l.find(t=>t.type==='page'&&t.webSocketDebuggerUrl); if(p)wsUrl=p.webSocketDebuggerUrl; }catch(e){} if(!wsUrl)await sleep(150);}
    const ws=new WebSocket(wsUrl); await new Promise((res,rej)=>{ws.addEventListener('open',res);ws.addEventListener('error',rej);});
    cdp=new CDP(ws); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
    const consoleErr=[]; cdp.send('Runtime.enable');
    // capture exceptions
    const ws2=null;

    // ---- ensure a clean seeded store ----
    await cdp.go(U('super-crm/enquiries.html'));
    await cdp.ev('window.CRM.reset()'); await sleep(200);

    console.log('\n[render with data] every sub-module shows the shared dataset');
    A(await cdp.ev('window.CRM.enquiries().length') === 28, 'enquiries.html: CRM has 28 seed enquiries');
    A(await cdp.waitFor('document.querySelectorAll("#tableBody tr[data-id], #tableCardsMobile [data-id]").length > 0'), 'enquiries.html: list renders rows from the store');

    await cdp.go(U('super-crm/dashboard.html'));
    A(await cdp.waitFor('document.querySelector("#funnelSvg") && document.querySelector("#funnelSvg").innerHTML.length > 50'), 'dashboard.html: funnel SVG drew from the store');
    const dashEnq = await cdp.ev('window.CRM.dashboardData("month").funnel.reduce((s,f)=>s+f.value,0)');
    A(dashEnq > 0, 'dashboard.html: month funnel has real totals (' + dashEnq + ')');

    await cdp.go(U('super-crm/workspace.html'));
    A(await cdp.ev('window.CRM.enquiries().length') === 28, 'workspace.html: same 28 enquiries');
    A(await cdp.waitFor('document.body.textContent.includes("Daily target progress")'), 'workspace.html: rendered');

    await cdp.go(U('super-school/my-team.html'));
    A(await cdp.ev('window.CRM.staff().length') === 12, 'my-team.html: CRM has 12 seed staff');
    A(await cdp.waitFor('document.querySelectorAll("tbody tr").length > 0 || document.querySelectorAll("[data-id]").length>0'), 'my-team.html: team table renders');

    // ---- (2) MUTATION PERSISTS ACROSS PAGES ----
    console.log('\n[cross-page propagation] status change in Enquiries shows in Dashboard');
    await cdp.go(U('super-crm/enquiries.html'));
    const before = await cdp.ev('window.CRM.dashboardData("month").funnel.find(f=>f.label==="Admitted Closed").value');
    // pick a month enquiry not already admitted and confirm it (simulate the bulk Update-Status action's store call)
    const changed = await cdp.ev('(function(){ const e=window.CRM.enquiries().find(e=>e.enquiryDate>="2026-05-07" && e.status!=="Admission Confirmed"); window.CRM.setEnquiryStatus(e.id,"Admission Confirmed"); return e.id; })()');
    await cdp.go(U('super-crm/dashboard.html'));
    const after = await cdp.ev('window.CRM.dashboardData("month").funnel.find(f=>f.label==="Admitted Closed").value');
    A(after === before + 1, 'dashboard reflects the Enquiries status change after navigation (' + before + '→' + after + ')');

    // ---- (3) STAFF flows My Team → Visits/Bookings ----
    console.log('\n[staff sharing] add in My Team → appears in Visits host search + Bookings assignees');
    await cdp.go(U('super-school/my-team.html'));
    await cdp.ev('window.CRM.addStaff({ name:"Integ Host", role:"Front Office", mobile:"9870000000", status:"Active" })');
    await cdp.go(U('super-crm/visits.html'));
    A(await cdp.ev('window.CRM.staffDirectory().some(s=>s.name==="Integ Host")'), 'visits: new staff is in the host directory');
    await cdp.go(U('super-crm/bookings.html'));
    A(await cdp.ev('window.CRM.staffNames().includes("Integ Host")'), 'bookings: new staff is a selectable assignee');

    // ---- (4) EMPTY → DATA ----
    console.log('\n[empty → data] clear the store, pages show empty states, then repopulate');
    await cdp.go(U('super-crm/enquiries.html'));
    await cdp.ev('window.CRM.clearAll()');
    await cdp.go(U('super-crm/enquiries.html'));
    A(await cdp.ev('window.CRM.enquiries().length') === 0, 'store cleared');
    A(await cdp.waitFor('document.querySelectorAll("#tableBody tr[data-id], #tableCardsMobile [data-id]").length === 0', 6000), 'enquiries.html: no rows when empty');
    await cdp.go(U('super-crm/dashboard.html'));
    A(await cdp.ev('window.CRM.dashboardData("month").funnel.every(f=>f.value===0)'), 'dashboard: funnel all zero when empty');
    await cdp.go(U('super-school/my-team.html'));
    A(await cdp.ev('window.CRM.staff().length') === 0, 'my-team: no staff when empty');
    // repopulate one enquiry and confirm it shows
    await cdp.go(U('super-crm/enquiries.html'));
    await cdp.ev('window.CRM.addEnquiry({ parentName:"Fresh Lead", studentName:"Kid", mobile:"91111 22222", status:"New Enquiry", source:"SuperSchools", assignee:null, enquiryDate: window.CRM.today() })');
    await cdp.go(U('super-crm/enquiries.html'));
    A(await cdp.ev('window.CRM.enquiries().length') === 1, 'empty→data: one enquiry added');
    // count just the canonical table-body rows (the same enquiry also renders as a mobile card, so the
    // combined selector would double-count); #tableBody rows exist in the DOM at any width.
    A(await cdp.waitFor('document.querySelectorAll("#tableBody tr[data-id]").length === 1', 6000), 'enquiries.html: the one new enquiry renders');

    // ---- restore demo data ----
    await cdp.ev('window.CRM.reset()');
    A(await cdp.ev('window.CRM.enquiries().length') === 28, 'store reset to demo data for delivery');
  } finally {
    try { if(cdp) await cdp.send('Browser.close'); } catch(e){}
    try { chrome.kill(); } catch(e){}
  }
  console.log('\n===== CRM cross-page integration =====\nPassed: ' + pass + '\nFailed: ' + fail);
  if(fails.length){ console.log('\nFAILURES:'); fails.forEach(f=>console.log('  ✗ '+f)); process.exit(1); }
  console.log('\nRESULT: PASS ✓'); process.exit(0);
}
main().catch((e)=>{ console.error('FATAL',e); process.exit(2); });
