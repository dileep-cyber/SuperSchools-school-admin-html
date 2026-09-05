export const meta = {
  name: 'shell-adversarial-review',
  description: 'Adversarially review the persistent-shell nav refactor for real bugs and requirement gaps',
  phases: [
    { title: 'Review', detail: 'four independent lenses read the implementation' },
    { title: 'Verify', detail: 'adversarially confirm each finding is a real defect' }
  ]
};

const PROJECT = 'C:\\Users\\Gosuper\\Downloads\\enquiry-project';
const REF = 'C:\\Users\\Gosuper\\Downloads\\side_and_top_nav_v15.html';

const CONTEXT = `
You are reviewing a refactor of a multi-module admin console (static Alpine.js + Tailwind CDN).

WHAT CHANGED: a PERSISTENT SHELL was introduced so the global navigation never reloads.
- ${PROJECT}\\index.html  — the shell: v15 sidebar + level-1 top nav + level-2 top nav + a content <iframe> + spinner + drawer + search + toast. Bound to x-data="appShell()".
- ${PROJECT}\\lib\\shell.js  — appShell() store: ROUTES table (module/section -> content page), REVERSE map (loaded page -> active tab), navigate(), setPage(), onTopNav(), L2 handlers, syncFromPath(), handleMessage() (postMessage from the iframe), sidebar collapse/peek, mobile scroll auto-hide.
- ${PROJECT}\\components\\AppShell.js  — when a content page runs INSIDE the iframe (window.top !== window.self) it SKIPS injecting the page's own sidebar/topnav/mobilenav/drawer and injects embed CSS; standalone it injects the full chrome as before.
- ${PROJECT}\\components\\RouteLoader.js  — in embedded mode it reveals content instantly and bridges to the shell via postMessage: beforeunload -> {type:'ss-nav-start'}, DOM ready/load -> {type:'ss-nav-done', path}, scroll -> {type:'ss-scroll', y}. Standalone it keeps the original timed full-screen loader.

THE REFERENCE DESIGN (must be pixel-faithful): ${REF} (a standalone v15 nav shell; its content area is intentionally empty).
A representative content page: ${PROJECT}\\pages\\super-school\\school.html (loaded into the iframe; it loads lib/store.js, components/*.js, AppShell.js, RouteLoader.js).

USER REQUIREMENTS (the bar):
1. Replace the old sidebar + top header with the v15 nav (level-1 AND level-2), pixel-perfect.
2. Navigating between modules (via sidebar / level-1 / level-2) must swap ONLY the inner content with a spinner; the sidebar + top nav are GLOBAL and stay visible.
3. The sidebar opens/closes via the top-left icon (collapse/expand, hover-peek when collapsed); level-1 is common/global; level-2 is derived from level-1.
4. No bugs.

Already verified by an automated headless-Chrome test (43 assertions, all green): initial load, all 6 sidebar modules load, level-1 tabs swap content, both level-2 navs toggle both directions, sidebar auto-collapse for CRM + manual toggle, content-area spinner on nav, reverse active-tab sync on in-frame detail navigation, placeholder routes, placeholder->real transition, search + drawer overlays, mobile scroll auto-hide, desktop/tablet/mobile — and ZERO console/JS errors.

YOUR JOB: find REAL defects the automated test could have MISSED — race conditions, edge cases, requirement gaps, pixel/responsive deviations from v15, broken states, or interactions that exist in the source but are not handled. Report ONLY concrete, actionable issues that would cause incorrect behavior or a visible defect. Do NOT report style nits, hypotheticals, or things already covered. Read the files yourself before reporting.`;

const FINDINGS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'severity', 'file', 'location', 'description', 'expected'],
        properties: {
          title: { type: 'string' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          file: { type: 'string' },
          location: { type: 'string', description: 'function / line / selector' },
          description: { type: 'string', description: 'the concrete bug and how it manifests' },
          expected: { type: 'string', description: 'what correct behavior should be' }
        }
      }
    }
  }
};

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['isReal', 'severity', 'reasoning'],
  properties: {
    isReal: { type: 'boolean' },
    severity: { type: 'string', enum: ['high', 'medium', 'low'] },
    reasoning: { type: 'string' },
    fix: { type: 'string', description: 'concrete suggested fix if real' }
  }
};

const LENSES = [
  { key: 'routing-state', prompt: `${CONTEXT}\n\nLENS: shell.js routing & state logic. Scrutinize lib/shell.js: navigate() (the frameSrc "already loaded" guard, the placeholder branch, the about:blank handling, the 8s safety timer), setPage() (default-section reset, the crmAutoCollapsed flag interaction with manual collapse, leaving CRM), onTopNav()/onL2Visit()/onL2Staff(), handleMessage()/syncFromPath() (loops? wrong tab? frameSrc desync? settings keeps sub-tab?), currentRouteKey(), and re-entrancy / double-click / rapid-navigation races. Report real defects.` },
  { key: 'embed-bridge', prompt: `${CONTEXT}\n\nLENS: the embed bridge correctness. Scrutinize components/AppShell.js and components/RouteLoader.js and how they interact with a real content page (read pages/super-school/school.html and note script order: RouteLoader.js runs BEFORE AppShell.js). Consider: standalone vs embedded both correct? Does the per-page loader ever double up with the shell spinner? Are ss-nav-start/done/scroll posted at the right times (initial load, internal nav, error pages)? Does hiding [data-shell] break any page layout? Does the content page's own schoolConsole store cause issues in the frame? Edge: page opened standalone still works? Report real defects.` },
  { key: 'pixel-responsive', prompt: `${CONTEXT}\n\nLENS: pixel & responsive fidelity vs the v15 reference. Compare index.html's sidebar + level-1 header + level-2 header markup/classes against ${REF}. The shell intentionally made the level-2 bar md:static (v15 had it fixed-only, which left a desktop gap). Check: header/sidebar/L2 classes, z-index ordering, the iframe sizing & section paddings (pt-12 / pt-[88px] for L2, md:pl-[72px] for sidebar, pb-20 mobile), fixed vs static at each breakpoint, the toggle button, mobile blue-header logic, any visual regression or overlap. Report real deviations or layout defects.` },
  { key: 'requirements-coverage', prompt: `${CONTEXT}\n\nLENS: requirement & interaction coverage. Enumerate every interaction/state the v15 reference (${REF}) and the user requirements imply, and check the shell handles each: every sidebar module, every level-1 tab (incl. My Workspace/Tasks/Reports/Visit/Lead Details), both level-2 navs both directions, sidebar collapse/expand/hover-peek/pin, mobile bottom nav, drawer, search, notifications/create/settings icons, the "spinner only over content / chrome stays" guarantee in ALL nav paths. Find anything present in the source/requirements but MISSING or mishandled in the shell. Report real gaps.` }
];

const reviewed = await pipeline(
  LENSES,
  (lens) => agent(lens.prompt, { label: 'review:' + lens.key, phase: 'Review', schema: FINDINGS_SCHEMA })
    .then((r) => ({ key: lens.key, findings: (r && r.findings) || [] })),
  (res) => parallel(((res && res.findings) || []).map((f) => () =>
    agent(`${CONTEXT}\n\nAdversarially VERIFY this reported finding by reading the actual code. Decide if it is a REAL defect that would cause incorrect behavior or a visible defect. Default to isReal=false if it is speculative, already handled, a style nit, or you cannot confirm it from the code. Be strict.\n\nFINDING:\n${JSON.stringify(f, null, 2)}`,
      { label: 'verify:' + res.key, phase: 'Verify', schema: VERDICT_SCHEMA })
      .then((v) => ({ finding: f, verdict: v }))
      .catch(() => null)
  )).then((vs) => ({ key: res.key, verified: vs.filter(Boolean) }))
);

const confirmed = [];
for (const r of reviewed.filter(Boolean)) {
  for (const v of r.verified) {
    if (v && v.verdict && v.verdict.isReal) confirmed.push({ lens: r.key, ...v.finding, verdict: v.verdict });
  }
}
confirmed.sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.verdict.severity] - { high: 0, medium: 1, low: 2 }[b.verdict.severity]));

log(`Confirmed defects: ${confirmed.length}`);
return { confirmedCount: confirmed.length, confirmed };
