// =====================================================================
// test-flows.mjs — Static integration test for the Enquiry project
// (Next.js-friendly layout: components/ + lib/ + styles/ + pages/).
// Validates:
//   1. node --check on every JS file (components/, lib/, styles/, pages/).
//   2. Every local asset/link ref in every page resolves on disk.
//   3. Every cross-page link (href + window.location.href, incl. inside the
//      colocated page-logic JS) resolves.
//   4. The navigation model in lib/navigation.js is internally consistent:
//      every sub-module url resolves; every page's { module, sub } exists.
//   5. index.html redirect target resolves.
//   6. Component wiring: every page loads the shared shell scripts + AppShell.
// Run:  node _build/test-flows.mjs        (exit 0 = all green)
// =====================================================================
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = join(ROOT, 'pages');
const NAV_FILE = join(ROOT, 'lib', 'navigation.js');

let pass = 0, fail = 0;
const failures = [];
const ok = () => { pass++; };
const bad = (m) => { fail++; failures.push(m); };
const rel = (p) => relative(ROOT, p).replace(/\\/g, '/');

const SKIP_DIRS = new Set(['_build', 'node_modules', '.git']);
function walk(dir, ext) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p, ext));
    else if (!ext || name.endsWith(ext)) out.push(p);
  }
  return out;
}

// Shared chrome scripts that every page is expected to load (basenames).
const SHARED_JS = new Set([
  'navigation.js', 'store.js', 'charts.js', 'tailwind-config.js', 'crm-store.js',
  'Sidebar.js', 'TopNav.js', 'MobileNav.js', 'HamburgerMenu.js',
  'Toast.js', 'RouteLoader.js', 'AppShell.js'
]);
const REQUIRED_ON_EVERY_PAGE = ['lib/navigation.js', 'lib/store.js', 'components/AppShell.js', 'components/Sidebar.js', 'components/TopNav.js'];

// ---- 1. JS syntax ---------------------------------------------------
const jsFiles = walk(ROOT, '.js');
for (const f of jsFiles) {
  try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); ok(); }
  catch (e) { bad(`SYNTAX  ${rel(f)} :: ${String(e.stderr || e).split('\n')[0]}`); }
}

// ---- helpers --------------------------------------------------------
const isLocalRef = (r) => {
  if (!r) return false;
  if (/^(https?:|\/\/|data:|mailto:|tel:|#|javascript:)/i.test(r)) return false;
  const clean = r.split('?')[0].split('#')[0];
  return clean.startsWith('../') || clean.startsWith('./') || /\.(html|css|js)$/i.test(clean);
};
const resolveRef = (fromFile, ref) => resolve(dirname(fromFile), ref.split('?')[0].split('#')[0]);

const htmlPages = walk(PAGES, '.html');

// Map each page-specific JS basename -> set of owning page folders.
const jsOwner = {};
for (const h of htmlPages) {
  const html = readFileSync(h, 'utf8');
  for (const m of html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)) {
    const src = m[1];
    if (!isLocalRef(src)) continue;
    const base = src.split('/').pop();
    if (SHARED_JS.has(base)) continue;
    (jsOwner[base] ||= new Set()).add(dirname(h));
  }
}

// ---- 2 & 3 & 6. Per-page checks ------------------------------------
for (const h of htmlPages) {
  const html = readFileSync(h, 'utf8');
  // local src/href resolution
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const ref = m[1];
    if (!isLocalRef(ref)) continue;
    const target = resolveRef(h, ref);
    if (existsSync(target)) ok();
    else bad(`LINK    ${rel(h)} -> "${ref}" (missing: ${rel(target)})`);
  }
  // window.location.href = '...html'
  for (const m of html.matchAll(/window\.location\.href\s*=\s*['"]([^'"]+\.html[^'"]*)['"]/g)) {
    const ref = m[1];
    const target = resolveRef(h, ref);
    if (existsSync(target)) ok();
    else bad(`NAV     ${rel(h)} -> "${ref}" (missing: ${rel(target)})`);
  }
  // component wiring: legacy schoolConsole pages load the shared shell scripts;
  // self-contained embedded mockups instead carry the embed bridge (RouteLoader.js).
  if (html.includes('schoolConsole(')) {
    for (const req of REQUIRED_ON_EVERY_PAGE) {
      if (html.includes(req)) ok();
      else bad(`SHELL   ${rel(h)} does not load ${req}`);
    }
  } else {
    if (html.includes('components/RouteLoader.js')) ok();
    else bad(`EMBED   ${rel(h)} (self-contained) does not load the embed bridge components/RouteLoader.js`);
  }
}

// ---- nav targets inside colocated page-logic JS --------------------
for (const [base, folders] of Object.entries(jsOwner)) {
  for (const folder of folders) {
    const jsPath = join(folder, base);
    if (!existsSync(jsPath)) { bad(`JSREF   ${rel(folder)}/${base} referenced by a page but missing`); continue; }
    const js = readFileSync(jsPath, 'utf8');
    for (const m of js.matchAll(/location\.href\s*=\s*['"]([^'"]+\.html[^'"]*)['"]/g)) {
      const ref = m[1];
      if (/^https?:/i.test(ref)) continue;
      const target = resolve(folder, ref.split('?')[0]);
      if (existsSync(target)) ok();
      else bad(`NAV-JS  ${rel(folder)}/${base} -> "${ref}" (missing: ${rel(target)})`);
    }
  }
}

// ---- 4. Navigation model (lib/navigation.js) -----------------------
function extractBalanced(src, marker) {
  const start = src.indexOf(marker);
  if (start < 0) return null;
  const open = src.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) return src.slice(open, i + 1); }
  }
  return null;
}
const model = {};
if (!existsSync(NAV_FILE)) {
  bad(`MODEL   lib/navigation.js not found`);
} else {
  const navJs = readFileSync(NAV_FILE, 'utf8');
  const subBlock = extractBalanced(navJs, 'subModules =');
  if (!subBlock) bad('MODEL   could not locate subModules in lib/navigation.js');
  else {
    const subUrls = [];
    for (const mm of subBlock.matchAll(/(\w+):\s*\[([\s\S]*?)\]/g)) {
      const moduleId = mm[1];
      const subs = [];
      for (const sm of mm[2].matchAll(/\{[^}]*?\bid:\s*'([^']+)'[^}]*?\burl:\s*'([^']+)'[^}]*?\}/g)) {
        subs.push(sm[1]);
        subUrls.push({ moduleId, subId: sm[1], url: sm[2] });
      }
      model[moduleId] = subs;
    }
    const anyPageFolder = join(PAGES, 'super-crm'); // representative sibling depth
    for (const { moduleId, subId, url } of subUrls) {
      const target = resolve(anyPageFolder, url.split('?')[0]);
      if (existsSync(target)) ok();
      else bad(`MODEL   subModules.${moduleId}/${subId} url "${url}" -> missing ${rel(target)}`);
    }
  }
}

// ---- 5. Persistent shell (index.html + lib/shell.js) ---------------
const indexHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');
// 5a. The shell must load its store and host a content iframe + appShell store.
indexHtml.includes('lib/shell.js') ? ok() : bad('SHELL   index.html does not load lib/shell.js');
indexHtml.includes('x-ref="contentFrame"') ? ok() : bad('SHELL   index.html has no content <iframe x-ref="contentFrame">');
indexHtml.includes('x-data="appShell()"') ? ok() : bad('SHELL   index.html does not bind x-data="appShell()"');
// 5b. Every route-table URL in lib/shell.js must resolve on disk.
const SHELL_FILE = join(ROOT, 'lib', 'shell.js');
if (!existsSync(SHELL_FILE)) {
  bad('SHELL   lib/shell.js not found');
} else {
  const shellJs = readFileSync(SHELL_FILE, 'utf8');
  const routesBlock = extractBalanced(shellJs, 'ROUTES =');
  if (!routesBlock) bad('SHELL   could not locate ROUTES in lib/shell.js');
  else {
    let routeCount = 0;
    for (const m of routesBlock.matchAll(/'[^']+':\s*'([^']+\.html)'/g)) {
      routeCount++;
      const target = resolve(ROOT, m[1]);
      if (existsSync(target)) ok();
      else bad(`SHELL   route url "${m[1]}" -> missing ${rel(target)}`);
    }
    routeCount > 0 ? ok() : bad('SHELL   ROUTES table parsed no entries');
  }
  // 5c. Every REVERSE basename (used to sync the active tab) must be a real page.
  const allBasenames = new Set(htmlPages.map((h) => h.split(/[\\/]/).pop()));
  for (const m of shellJs.matchAll(/'([a-z-]+\.html)':\s*\[/g)) {
    allBasenames.has(m[1]) ? ok() : bad(`SHELL   REVERSE entry "${m[1]}" has no matching page on disk`);
  }
}

// ---- each LEGACY page's { module, sub } exists in the model; each EMBEDDED page is in a shell route ----
const shellRoutesSrc = existsSync(SHELL_FILE) ? readFileSync(SHELL_FILE, 'utf8') : '';
for (const h of htmlPages) {
  const html = readFileSync(h, 'utf8');
  const init = html.match(/schoolConsole\(\{([^}]*)\}\)/);
  if (!init) {
    // Self-contained embedded mockup — must be referenced by a shell route in lib/shell.js.
    const base = h.split(/[\\/]/).pop();
    shellRoutesSrc.includes(base)
      ? ok()
      : bad(`ROUTE   ${rel(h)} (embedded) is not referenced by any shell route in lib/shell.js`);
    continue;
  }
  const body = init[1];
  const moduleId = (body.match(/module:\s*'([^']+)'/) || body.match(/active:\s*'([^']+)'/) || [])[1];
  const subId = (body.match(/sub:\s*'([^']+)'/) || [])[1];
  if (!moduleId) { bad(`INIT    ${rel(h)} init missing module/active`); continue; }
  if (!model[moduleId]) { bad(`INIT    ${rel(h)} module '${moduleId}' not in navigation model`); continue; }
  if (subId && !model[moduleId].includes(subId)) {
    bad(`INIT    ${rel(h)} sub '${subId}' not under '${moduleId}' (have: ${model[moduleId].join(', ')})`);
  } else ok();
}

// ---- report ---------------------------------------------------------
console.log('\n===== Enquiry project — static flow test =====');
console.log(`JS files checked : ${jsFiles.length}`);
console.log(`HTML pages       : ${htmlPages.length}`);
console.log(`Nav model modules: ${Object.keys(model).length} (${Object.entries(model).map(([k, v]) => k + ':' + v.length).join(', ')})`);
console.log(`Assertions passed: ${pass}`);
console.log(`Assertions failed: ${fail}`);
if (failures.length) {
  console.log('\n--- FAILURES ---');
  for (const f of failures) console.log('  ✗ ' + f);
  console.log('\nRESULT: FAIL');
  process.exit(1);
} else {
  console.log('\nRESULT: PASS ✓  (pages, links, assets, components and nav-model all resolve)');
  process.exit(0);
}
