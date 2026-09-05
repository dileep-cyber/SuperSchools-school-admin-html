# =====================================================================
# build.ps1 — Regenerates the six module DASHBOARDS + the CRM Enquiries/
# Detail page wrappers from the three original mock-ups, into the
# Next.js-friendly folder structure:
#
#   components/   reusable UI (Sidebar, TopNav, HamburgerMenu, MobileNav,
#                 Toast, RouteLoader, AppShell)               [hand-maintained]
#   lib/          navigation.js (route model) · store.js (schoolConsole) ·
#                 charts.js                                    [hand-maintained]
#   styles/       *.css + tailwind-config.js   (shell.css IS generated below)
#   pages/<module>/  route .html (+ colocated page-logic .js) [.js hand-maintained]
#
# Page-specific BODY content is sliced byte-for-byte from the originals; only
# the shared shell wrapper + script tags + navigation wiring are added.
#
# NOT regenerated (the live files are the source of truth): everything in
# components/ and lib/, the colocated page-logic JS (enquiries.js, workflow.js,
# applications.js, applicant-details.js) and the two HR pages
# (super-hr/applications.html, super-hr/applicant-details.html).
# =====================================================================
$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)

$dl    = "C:\Users\munid\Downloads"
$dash  = Join-Path $dl "enquirires_dashboard_v29.html"
$enqF  = Join-Path $dl "enquiries_v5.html"
$wfF   = Join-Path $dl "admission_enquiry_workflow_v2_updated7.html"

$root  = Join-Path $dl "enquiry-project"
$pages = Join-Path $root "pages"
$styles = Join-Path $root "styles"

$dashLines = Get-Content -LiteralPath $dash -Encoding utf8
$enqLines  = Get-Content -LiteralPath $enqF -Encoding utf8
$wfLines   = Get-Content -LiteralPath $wfF  -Encoding utf8

function Slice($lines,$s,$e){ return ($lines[($s-1)..($e-1)]) -join "`n" }
function WriteFile($path,$text){
  $dir = Split-Path -Parent $path
  if(-not (Test-Path $dir)){ New-Item -ItemType Directory -Force $dir | Out-Null }
  [System.IO.File]::WriteAllText($path,$text,$utf8)
}

# ---------- shell.css (base the shell needs on enquiries/workflow/HR pages) ----
$base  = Slice $dashLines 46 53            # body font, x-cloak, custom-scrollbar, no-scrollbar
$toast = Slice $dashLines 1771 1777        # cfg-toast container styles
$toastM= Slice $dashLines 1786 1789        # cfg-toast mobile media
$shellCss = @"
/* shell.css — base rules the global shell needs on pages that do not load
   the full dashboard.css (enquiries, workflow, HR list/detail). Extracted
   from the original dashboard so the shell renders identically. */
$base

$toast
$toastM

/* ── Global route loader (controlled by components/RouteLoader.js) ───
   The loader stays up for a minimum, deterministic time, then is removed
   INSTANTLY (display:none) while the app content (.ss-app) fades in — so the
   loader and the page content never overlap during the navigation reload. */
.route-loader{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:#F6F8FC;}
.route-loader.is-hidden{display:none;}
.route-loader__box{display:flex;flex-direction:column;align-items:center;gap:14px;}
.route-loader__spinner{width:46px;height:46px;border-radius:9999px;border:4px solid #DCE8FF;border-top-color:#284CA5;animation:routeSpin .7s linear infinite;}
.route-loader__text{font-size:13px;font-weight:600;color:#284CA5;letter-spacing:.01em;}
@keyframes routeSpin{to{transform:rotate(360deg);}}
.ss-app{opacity:0;}
.ss-ready .ss-app{opacity:1;transition:opacity .35s ease;}
"@
WriteFile (Join-Path $styles "shell.css") $shellCss
"styles/shell.css written"

# ---------- Shared markup fragments ----------
$LOADER_DIV = @'
  <div id="routeLoader" class="route-loader" role="status" aria-live="polite" aria-label="Loading">
    <div class="route-loader__box"><div class="route-loader__spinner"></div><div class="route-loader__text">Loading&hellip;</div></div>
  </div>
'@

# Shared chrome scripts loaded by EVERY page (order matters: navigation -> store,
# components -> AppShell). Page-specific logic (if any) is appended after these.
$SHELL_SCRIPTS = @'
  <script src="../../lib/navigation.js"></script>
  <script src="../../lib/store.js"></script>
  <script src="../../lib/charts.js"></script>
  <script src="../../components/Sidebar.js"></script>
  <script src="../../components/TopNav.js"></script>
  <script src="../../components/MobileNav.js"></script>
  <script src="../../components/HamburgerMenu.js"></script>
  <script src="../../components/Toast.js"></script>
  <script src="../../components/RouteLoader.js"></script>
  <script src="../../components/AppShell.js"></script>
'@
$ALPINE = @'
  <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.x.x/dist/cdn.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
'@

# ---------- Dashboard module pages ----------
$DASH_HEAD = @"
<!DOCTYPE html>
<html class="light" lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{TITLE}} &middot; SuperSchools Console</title>
  <script src="https://cdn.tailwindcss.com?plugins=forms,typography,container-queries"></script>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script src="../../styles/tailwind-config.js"></script>
  <link rel="stylesheet" href="../../styles/dashboard.css" />
</head>
<body class="bg-slate-200 text-slate-900 min-h-screen" x-data="schoolConsole({ module: '{{MODULE}}', sub: '{{SUB}}' })">
$LOADER_DIV
  <div class="ss-app min-h-screen h-screen w-full flex bg-mobile-background md:bg-background relative">
    <div data-shell="sidebar"></div>
    <main class="flex-1 flex flex-col overflow-hidden bg-mobile-background md:bg-background">
      <div data-shell="header"></div>
      <section class="flex-1 custom-scrollbar overflow-y-auto" :class="isFullScreenPage ? 'pb-0' : 'pb-20 md:pb-0'">
        <div class="w-full" :class="isFullScreenPage ? 'min-h-full px-5 py-4 md:px-10 md:py-5 lg:px-[56px]' : 'px-5 py-5 md:px-10 md:py-6 lg:px-[56px] lg:py-8'">
          <div x-show="!isFullScreenPage" class="lg:hidden mb-4 relative">
            <input class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-primary focus:border-primary text-slate-700 shadow-sm" placeholder="Search" type="text" x-model="search" />
            <span class="material-icons-outlined absolute left-3 text-slate-400 text-lg top-1/2 -translate-y-1/2">search</span>
          </div>
"@

$DASH_FOOT = @"
        </div>
      </section>
    </main>
    <div data-shell="chrome-inner"></div>
  </div>
  <div data-shell="chrome-outer"></div>

$SHELL_SCRIPTS
$ALPINE
</body>
</html>
"@

# file / folder / module(sidebar id) / sub(active top-nav tab) / title / slice range
$modules = @(
  @{ file='school.html';    folder='super-school';    module='school';     sub='school';     title='Super School';    s=1955; e=2016 },
  @{ file='crm.html';       folder='super-crm';       module='admissions'; sub='admissions'; title='Super CRM';        s=2018; e=2093 },
  @{ file='hr.html';        folder='super-hr';        module='jobs';       sub='jobs';       title='Super HR';         s=2095; e=2137 },
  @{ file='community.html'; folder='super-community'; module='community';  sub='community';  title='Super Community';  s=2139; e=2153 },
  @{ file='social.html';    folder='super-social';    module='social';     sub='social';     title='Super Social';     s=2155; e=2356 },
  @{ file='settings.html';  folder='settings';        module='settings';   sub='settings';   title='Settings';         s=2358; e=3178 }
)
foreach($m in $modules){
  $content = Slice $dashLines $m.s $m.e
  if($m.module -eq 'admissions'){
    $content = $content.Replace(
      '<button type="button" class="rounded-full bg-primary hover:bg-primary-hover text-white px-5 py-2 text-sm font-medium shadow-[0_10px_22px_rgba(40,76,165,.18)] inline-flex items-center gap-2 transition-all hover:-translate-y-0.5">View All Admissions',
      '<button type="button" @click="window.location.href=''enquiries.html''" class="rounded-full bg-primary hover:bg-primary-hover text-white px-5 py-2 text-sm font-medium shadow-[0_10px_22px_rgba(40,76,165,.18)] inline-flex items-center gap-2 transition-all hover:-translate-y-0.5">View All Admissions')
  }
  if($m.module -eq 'jobs'){
    $content = $content.Replace(
      '<button type="button" class="rounded-full bg-primary hover:bg-primary-hover text-white px-5 py-2 text-sm font-medium shadow-[0_10px_22px_rgba(40,76,165,.18)] inline-flex items-center gap-2 transition-all hover:-translate-y-0.5">View All Jobs',
      '<button type="button" @click="window.location.href=''applications.html''" class="rounded-full bg-primary hover:bg-primary-hover text-white px-5 py-2 text-sm font-medium shadow-[0_10px_22px_rgba(40,76,165,.18)] inline-flex items-center gap-2 transition-all hover:-translate-y-0.5">View All Jobs')
  }
  $head = $DASH_HEAD.Replace('{{TITLE}}',$m.title).Replace('{{MODULE}}',$m.module).Replace('{{SUB}}',$m.sub)
  $page = $head + "`n" + $content + "`n" + $DASH_FOOT
  WriteFile (Join-Path $pages (Join-Path $m.folder $m.file)) $page
  "{0,-30} <- dashboard lines {1}-{2}" -f ($m.folder + '/' + $m.file),$m.s,$m.e
}

# ---------- Enquiries page (CRM list -> pages/super-crm/enquiries.html) ----------
$enqBody = Slice $enqLines 32 641
$enqBody = $enqBody.Replace('<div class="flex h-screen flex-col overflow-hidden">','<div class="flex min-h-0 flex-1 flex-col overflow-hidden">')
$enqBody = $enqBody.Replace('<main class="flex min-h-0 flex-1">','<div class="flex min-h-0 flex-1">').Replace('</main>','</div>')
$enqBody = $enqBody.Replace('<li><a href="#" class="transition hover:text-[#284CA5]">Home</a></li>','<li><a href="../super-school/school.html" class="transition hover:text-[#284CA5]">Home</a></li>')
$enqBody = $enqBody.Replace('<li><a href="#" class="transition hover:text-[#284CA5]">Admissions</a></li>','<li><a href="crm.html" class="transition hover:text-[#284CA5]">Admissions</a></li>')
$ENQ = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admission Enquiries &mdash; SuperSchools</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="../../styles/tailwind-config.js"></script>
  <link rel="stylesheet" href="../../styles/shell.css" />
  <link rel="stylesheet" href="../../styles/enquiries.css" />
</head>
<body class="bg-slate-200 text-slate-900 min-h-screen font-['Inter'] antialiased" x-data="schoolConsole({ module: 'admissions', sub: 'enquiries' })">
$LOADER_DIV
  <div class="ss-app min-h-screen h-screen w-full flex bg-mobile-background md:bg-background relative">
    <div data-shell="sidebar"></div>
    <main class="flex-1 flex flex-col overflow-hidden bg-[#F6F8FC]">
      <div data-shell="header"></div>
{{CONTENT}}
    </main>
    <div data-shell="chrome-inner"></div>
  </div>
  <div data-shell="chrome-outer"></div>

$SHELL_SCRIPTS
  <script src="enquiries.js"></script>
$ALPINE
</body>
</html>
"@
WriteFile (Join-Path $pages "super-crm\enquiries.html") $ENQ.Replace('{{CONTENT}}',$enqBody)
"super-crm/enquiries.html      <- enquiries lines 32-641"

# ---------- Workflow page (CRM detail -> pages/super-crm/workflow.html) ----------
$wfBody = Slice $wfLines 304 549
$wfBody = $wfBody.Replace('<main class="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-6 xl:px-[50px] xl:py-6">','<div class="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-6 xl:px-[50px] xl:py-6">')
$wfBody = $wfBody.Replace('</main>','</div>')
$wfBody = $wfBody.Replace('<li><a href="index.html" class="transition hover:text-[#284CA5]">Home</a></li>','<li><a href="../super-school/school.html" class="transition hover:text-[#284CA5]">Home</a></li>')
$wfBody = $wfBody.Replace('<li><a href="index.html#admissions" class="transition hover:text-[#284CA5]">Admissions</a></li>','<li><a href="crm.html" class="transition hover:text-[#284CA5]">Admissions</a></li>')
$WF = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Aarav Sharma &mdash; Admission Enquiry Workflow &middot; SuperSchools</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="../../styles/tailwind-config.js"></script>
  <link rel="stylesheet" href="../../styles/shell.css" />
  <link rel="stylesheet" href="../../styles/workflow.css" />
</head>
<body class="bg-slate-200 text-slate-900 min-h-screen antialiased" x-data="schoolConsole({ module: 'admissions', sub: 'detail' })">
$LOADER_DIV
  <div class="ss-app min-h-screen h-screen w-full flex bg-mobile-background md:bg-background relative">
    <div data-shell="sidebar"></div>
    <main class="flex-1 flex flex-col overflow-hidden bg-[#F6F8FC]">
      <div data-shell="header"></div>
      <section class="flex-1 custom-scrollbar overflow-y-auto">
{{CONTENT}}
      </section>
    </main>
    <div data-shell="chrome-inner"></div>
  </div>
  <div data-shell="chrome-outer"></div>

$SHELL_SCRIPTS
  <script src="workflow.js"></script>
$ALPINE
</body>
</html>
"@
WriteFile (Join-Path $pages "super-crm\workflow.html") $WF.Replace('{{CONTENT}}',$wfBody)
"super-crm/workflow.html       <- workflow lines 304-549"

# ---------- Root entry redirect ----------
$index = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=pages/super-school/school.html" />
  <title>SuperSchools Console</title>
</head>
<body>
  <p>Redirecting to the <a href="pages/super-school/school.html">SuperSchools Console</a>&hellip;</p>
  <script>window.location.replace('pages/super-school/school.html');</script>
</body>
</html>
'@
WriteFile (Join-Path $root "index.html") $index
"index.html written"
"BUILD COMPLETE"
