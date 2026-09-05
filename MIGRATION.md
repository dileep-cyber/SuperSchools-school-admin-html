# Migrating to Next.js

This project is intentionally structured to map cleanly onto a Next.js (App Router)
project. It is currently a **static, multi-page Alpine.js** app (no build step); the
folder layout, the extracted `components/`, and the `lib/` data/state modules are the
pieces you carry over. The main work in a real migration is rewriting the Alpine
templates (`x-data` / `x-for` / `x-show` / `x-text`) as React JSX.

## File-by-file mapping

| This project                                  | Next.js (App Router)                                              |
|-----------------------------------------------|-------------------------------------------------------------------|
| `components/Sidebar.js`                        | `components/Sidebar.tsx`                                          |
| `components/TopNav.js`                         | `components/TopNav.tsx`                                           |
| `components/HamburgerMenu.js`                  | `components/HamburgerMenu.tsx`                                    |
| `components/MobileNav.js`                      | `components/MobileNav.tsx`                                        |
| `components/Toast.js`                          | `components/Toast.tsx`                                            |
| `components/RouteLoader.js`                    | `components/RouteLoader.tsx` + `app/loading.tsx`                  |
| `components/AppShell.js`                       | `app/layout.tsx` (renders the shell around `{children}`)         |
| `lib/navigation.js` (`window.SSNav`)           | `lib/navigation.ts` (plain exported `menuItems` / `subModules`)   |
| `lib/store.js` (`schoolConsole()`)             | `lib/store.ts` (Zustand/Context) or per-page hooks                |
| `lib/charts.js`                                | `lib/charts.ts` (or a `<Chart/>` component)                       |
| `styles/*.css`                                 | `styles/*.css` (or CSS modules)                                  |
| `styles/tailwind-config.js`                    | `tailwind.config.js` (root) + real Tailwind build                |
| `pages/super-school/school.html`              | `app/super-school/page.tsx`                                       |
| `pages/super-crm/crm.html`                    | `app/super-crm/page.tsx`                                          |
| `pages/super-crm/enquiries.html` (+ `.js`)    | `app/super-crm/enquiries/page.tsx`                                |
| `pages/super-crm/workflow.html` (+ `.js`)     | `app/super-crm/detail/page.tsx`                                   |
| `pages/super-hr/hr.html`                      | `app/super-hr/page.tsx`                                           |
| `pages/super-hr/applications.html` (+ `.js`)  | `app/super-hr/applications/page.tsx`                              |
| `pages/super-hr/applicant-details.html`(+`.js`)| `app/super-hr/applicant-details/page.tsx`                        |
| `pages/super-community/community.html`        | `app/super-community/page.tsx`                                    |
| `pages/super-social/social.html`             | `app/super-social/page.tsx`                                       |
| `pages/settings/settings.html`               | `app/settings/page.tsx`                                           |
| `index.html` (redirect)                        | `app/page.tsx` → `redirect('/super-school')`                      |

## Concept mapping

- **Shell injection** — today `AppShell.js` replaces `data-shell="…"` placeholders. In
  Next.js this becomes `app/layout.tsx` rendering `<Sidebar/> <TopNav/> <MobileNav/>
  <HamburgerMenu/> <Toast/>` around `{children}`. No placeholders needed.
- **Two-level nav** — `lib/navigation.js` already isolates `menuItems` + `subModules`.
  Export them from `lib/navigation.ts` and import into the layout/components. The active
  module/sub becomes `usePathname()` instead of the `{ module, sub }` x-data prop.
- **Navigation + loader** — full-document reloads disappear; Next.js client navigation is
  instant. `RouteLoader`'s timed overlay becomes `app/loading.tsx` (App-Router Suspense)
  or a small route-change effect. The `.ss-app` / `.ss-ready` fade is no longer needed.
- **State** — `schoolConsole()` in `lib/store.js` is one big Alpine object. Port it to a
  Zustand store or React context; the data arrays (candidates, admissions, config, …)
  move as-is; the getters become selectors and the methods become actions.
- **Templates** — Alpine directives convert directly:
  `x-for` → `.map()`, `x-show`/`x-if` → `&&` / ternary, `x-text` → `{value}`,
  `:class` → `className={clsx(...)}`, `@click` → `onClick`, `x-model` → controlled input.
- **Page logic** — the colocated `*.js` (enquiries/workflow/applications/applicant-details)
  is vanilla DOM code; reimplement each as the page component's hooks/handlers.

## Suggested order

1. `npx create-next-app` with Tailwind; copy `styles/*.css`, port `tailwind-config.js`.
2. Move `lib/navigation.js` → `lib/navigation.ts` (export consts).
3. Build `app/layout.tsx` from `AppShell.js` + the `components/*` markup (as JSX).
4. Port the store (`lib/store.js`) to Zustand/Context.
5. Recreate routes under `app/<module>/…/page.tsx`, porting each page's markup + logic.
6. Replace the loader with `app/loading.tsx`; delete the `.ss-app`/`.ss-ready` shim.
