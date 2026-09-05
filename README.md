# Enquiry Project — SuperSchools Console

A multi-module admin console with a **persistent app shell**. The chrome —
**left sidebar** (main modules), **level-1 top nav** (the active module's
sub-modules) and **level-2 top nav** (the active level-1 tab's sub-tabs) — is
**global**: it lives in `index.html` and never reloads. Each module's page is
loaded into a content **`<iframe>`**; navigating swaps **only** the iframe and
shows a spinner **over the content area**, while the sidebar + top nav stay put.
The sidebar can be collapsed / expanded with the top-left icon (and hover-peeks
when collapsed).

The codebase keeps a **Next.js-friendly layout** (`components/`, `lib/`,
`styles/`, `pages/`) so it can be migrated to React/Next.js with minimal
reshuffling — see [`MIGRATION.md`](./MIGRATION.md).

## Folder structure

```
enquiry-project/
├── index.html                          # the PERSISTENT SHELL: sidebar + L1/L2 top nav + content <iframe>
├── components/                         # reusable UI (injected into every CONTENT page)
│   ├── Sidebar.js                      #   left nav rail (main modules) — standalone pages only
│   ├── TopNav.js                       #   top bar (active module's sub-modules) — standalone pages only
│   ├── HamburgerMenu.js                #   right-side account drawer
│   ├── MobileNav.js                    #   mobile bottom nav
│   ├── Toast.js                        #   global toast stack
│   ├── RouteLoader.js                  #   loader + EMBED BRIDGE (postMessage nav/scroll to the shell)
│   └── AppShell.js                     #   mounts the chrome; in an iframe it HIDES it (embedded mode)
├── lib/                                # shared data + logic
│   ├── shell.js                        #   appShell() — the SHELL store: route table + spinner + L1/L2 nav
│   ├── crm-store.js                    #   window.CRM — the ONE shared CRM dataset (enquiries/staff/bookings)
│   ├── navigation.js                   #   legacy route model for standalone pages (window.SSNav)
│   ├── store.js                        #   schoolConsole() — Alpine state + behaviour (content pages)
│   └── charts.js                       #   funnel / pyramid / pie renderers
├── styles/
│   ├── tailwind-config.js              #   Tailwind theme (brand colours)
│   ├── dashboard.css                   #   the six module dashboards
│   ├── shell.css                       #   base the shell needs on list/detail pages (GENERATED)
│   ├── enquiries.css                   #   CRM + HR list pages
│   └── workflow.css                    #   CRM + HR detail pages
├── pages/                              # routes — one folder per main module (loaded into the shell iframe)
│   ├── super-school/   school.html   my-team.html(My Staff)   rooms.html(Rooms)
│   ├── super-crm/      workspace.html  dashboard.html  enquiries.html  visits.html  bookings.html
│   │                   crm.html·workflow.html (legacy, unrouted)   enquiries.js  workflow.js
│   ├── super-hr/       hr.html   applications.html  applications.js   applicant-details.html  applicant-details.js
│   ├── super-community/ community.html
│   ├── super-social/   social.html
│   └── settings/       settings.html
│   # workspace/dashboard/enquiries/visits/bookings/my-team/rooms are SELF-CONTAINED embedded
│   # mockups (own Tailwind/Alpine; they carry the embed bridge, not the schoolConsole shell).
├── _build/
│   ├── build.ps1                       # regenerates the dashboard + CRM page wrappers
│   ├── test-flows.mjs                  # static flow test  — `node _build/test-flows.mjs`
│   ├── cdp-test.mjs                    # shell behaviour test — `node _build/cdp-test.mjs`
│   ├── store-test.cjs                  # CRM store unit test — `node _build/store-test.cjs`
│   ├── crm-integ.mjs                   # CRM cross-page integration — `node _build/crm-integ.mjs`
│   └── enq-test.mjs                    # enquiries interaction test — `node _build/enq-test.mjs`
├── README.md
└── MIGRATION.md                        # how this maps to a Next.js project
```

Page-specific logic (`enquiries.js`, `workflow.js`, `applications.js`,
`applicant-details.js`) is **colocated** with its route HTML (App-Router style).

## The persistent shell (`index.html` + `lib/shell.js`)

`index.html` is the only page the browser ever loads. It renders the **global
chrome** and a content `<iframe>`, driven by the `appShell()` store in
`lib/shell.js`:

- **Sidebar** iterates `menuItems` — the six main modules. Active = `activePage`.
  Clicking calls `setPage(id)` → loads that module's default page in the iframe.
- **Level-1 top nav** iterates `topNavItems` — the active module's sub-modules.
  Clicking calls `onTopNav(tab)`. Level-1 is **always** shown.
- **Level-2 top nav** is **derived from level-1**: it appears only for
  `Super CRM › Visit` (`Visits / Bookings`) via `showVisitsL2Nav`. `Super Schools ›
  My Staff` has no level-2 bar — that page carries its own title + action row.
- A **route table** (`ROUTES` in `lib/shell.js`) maps `module/section` →
  the content page loaded in the iframe. Sections with no page yet resolve to a
  "coming soon" placeholder in the content area (the chrome still stays put).
- Navigating sets the iframe `src` and shows a **content-area spinner** (never a
  full-screen one); the sidebar + top nav never reload.

## Embedded mode (how content pages render inside the shell)

The content pages in `pages/` are unchanged. When one is loaded inside the
shell's iframe, `components/AppShell.js` detects the frame (`window.top !==
window.self`) and **skips injecting the page's own sidebar / top nav / mobile
nav / drawer**, so only its content shows (no double chrome).
`components/RouteLoader.js` then bridges the page to the shell via `postMessage`:

- `beforeunload → {type:'ss-nav-start'}` — the shell shows its content-area spinner.
- `DOM ready / load → {type:'ss-nav-done', path}` — the shell hides the spinner and
  syncs the active tab (so an enquiry-row → detail navigation keeps **Enquiries**
  highlighted).
- `content scroll → {type:'ss-scroll', y}` — the shell auto-hides the mobile chrome.

A page's primary actions live in the shell's **level-2 bar** (right end): clicking one
sends `shell → page {type:'ss-action', action}` and the page runs the matching handler
(e.g. Visits' Publish/Undo/Reset, Bookings' New booking, My Staff's Add/Import/Export).
A page can also drive routing with `page → shell {type:'ss-navigate', module, section}`
(e.g. the Dashboard's "View all admissions" → Enquiries).

Opened **standalone** (outside the shell), every page still renders its own full
chrome exactly as before — the legacy behaviour is untouched.

The sidebar's collapsed/expanded state persists across reloads (localStorage) **only
when you collapse it by hand**; the automatic **Super CRM** wide-workspace collapse is
transient and auto-restores on leaving, so reloading into the default module never
starts collapsed.

## Intentional deviations from the isolated v15 mock

The nav chrome is reproduced from `side_and_top_nav_v15.html` verbatim, with three
deliberate corrections (the visual result is identical or better):

- **Level-2 bar is `md:static`** (the mock had it `fixed`-only, which left a ~48px gap
  below the level-2 bar on desktop). Now the content sits flush under it at every breakpoint.
- **Level-2 active tab uses colour/weight only** (no underline bar) — matching the mock's
  level-2 styling. The level-1 underline is kept (the mock has it).
- **Settings is a single level-1 tab.** The mock's generic General/Profile/Notifications/
  Security strip doesn't match the real settings page, which ships its own rich category
  nav (Visit Slots / WhatsApp / Calendar / Meet / Notifications / Activity Logs) inside the
  content — so a duplicate, non-functional level-1 strip is replaced with one honest
  "Settings" landing that lets the page own its sub-navigation.

## Shared Super CRM data (`lib/crm-store.js`)

The Super CRM sub-modules are **interlinked through one dataset**. `lib/crm-store.js`
(`window.CRM`) is the single source of truth — **enquiries, staff (the "My Team"
directory) and visit bookings** — persisted in `localStorage` (key `ss_crm_store_v1`)
and anchored to a fixed reference "today". Every Super CRM page (My Workspace,
Dashboard, Enquiries, Enquiry detail, Visits, Bookings) plus Super Schools' My Team
reads its data from `CRM.*` and routes every create/edit/status-change through it,
so a change in one sub-module shows up in all the others:

- **Dashboard** funnel / sources / staff-conversion / lost-reasons and **My Workspace**
  queues are **derived** from the same enquiries (nothing is hand-aggregated).
- **Staff** is shared: the same people are the enquiry **assignees**, the Dashboard
  **counsellors**, the **My Team** roster, and the **Visits/Bookings hosts**. Adding a
  member in My Team makes them selectable as a host; deleting one reassigns their
  enquiries. Staff metrics (leads/conversion) are computed from real enquiry assignments.
- **Empty → data:** `CRM.clearAll()` empties the store (every page shows its empty
  state); `CRM.reset()` restores the demo data; adding records repopulates the views.

Pages keep their own render shape via adapter getters (`CRM.enquiriesAsRows()`,
`CRM.workspaceRecords()`/`workspaceOps()`, `CRM.dashboardData(period)`,
`CRM.staffMembers()`, `CRM.staffDirectory()`, `CRM.bookings()`, …). In a Next.js port
this is the data layer (a store/queries module) the route components import.

## Running

Open `index.html` in a browser. Tailwind, Alpine, and the fonts load from their
CDNs, so an internet connection is required.

## Testing

```powershell
node _build/test-flows.mjs      # static checks  — exit 0 = all green
node _build/cdp-test.mjs        # shell behaviour — drives the shell in headless Chrome
node _build/store-test.cjs      # CRM store unit  — seed/adapters/derivations/mutations/empty→data
node _build/crm-integ.mjs       # CRM cross-page  — same data everywhere; edits propagate between sub-modules
node _build/enq-test.mjs        # enquiries       — row→detail navigation + mobile list scroll
```
`test-flows.mjs` validates JS syntax, every asset/link/navigation target, the
component wiring on each page, the legacy navigation model, and the shell's route
table. `cdp-test.mjs` launches headless Chrome (CDP) and asserts the live
behaviour — sidebar / level-1 / level-2 navigation swaps **only** the content
iframe (with a spinner), the chrome stays put, the sidebar collapses, the active
tab stays in sync, and **no JS errors occur** — and writes screenshots of every
key state at desktop / tablet / mobile to `_build/shots/`.

## Rebuilding

`_build/build.ps1` regenerates the six dashboards + CRM Enquiries/Detail page wrappers
from the three original mock-ups, into the per-module folders. Everything in
`components/` and `lib/`, the colocated page-logic JS, and the two HR pages are
hand-maintained and **not** regenerated.

```powershell
pwsh -File _build/build.ps1
```
