/* =====================================================================
   shell.js — the PERSISTENT app-shell store (Alpine `appShell()`).
   ---------------------------------------------------------------------
   The shell owns the GLOBAL chrome that must never reload:
     • left sidebar  — the main modules
     • level-1 top nav — the active module's sub-modules
     • level-2 top nav — the sub-sub-tabs of the active level-1 tab (CRM › Visit)
   Module content is loaded into <iframe id="contentFrame"> (embedded mode,
   see components/AppShell.js + RouteLoader.js). Navigating swaps ONLY the
   iframe and shows a content-area spinner; the sidebar/top-nav stay put.

   Maps cleanly onto a Next.js root layout + <iframe-or-{children}> in a
   real migration (the route table below becomes the route segments).
   ===================================================================== */
function appShell() {
  // ── Sidebar modules (level-0). Labels match the v15 design exactly. ──
  const menuItems = [
    { id: 'school',     label: 'Super Schools',   icon: 'apartment', title: 'Super Schools',   subtitle: 'My School profile and visit management' },
    { id: 'admissions', label: 'Super CRM',       icon: 'school',    title: 'Super CRM',       subtitle: 'Workspace, dashboard, tasks, reports, and teams' },
    { id: 'jobs',       label: 'Super HR',        icon: 'work',      title: 'Super HR',        subtitle: 'Teacher applications, interviews, demos, and hiring funnel' },
    { id: 'community',  label: 'Super Community', icon: 'groups',    title: 'Super Community', subtitle: 'Parent engagement, announcements, and school events' },
    { id: 'social',     label: 'Super Social',    icon: 'share',     title: 'Super Social',    subtitle: 'Social media management for your school' },
    { id: 'settings',   label: 'Settings',        icon: 'settings',  title: 'Settings',        subtitle: 'Console preferences and CRM configuration' }
  ];

  // ── Route table: (module/section) → the content page loaded in the iframe. ──
  //    Sections with no page yet resolve to null → a "coming soon" placeholder
  //    is shown in the content area (the chrome still stays put).
  const ROUTES = {
    'school/school':              'pages/super-school/school.html',
    'school/mystaff':             'pages/super-school/my-team.html',
    'school/rooms':               'pages/super-school/rooms.html',
    'admissions/workspace':       'pages/super-crm/workspace.html',
    'admissions/dashboard':       'pages/super-crm/dashboard.html',
    'admissions/enquiries':       'pages/super-crm/enquiries.html',
    'admissions/visits/visits':   'pages/super-crm/visits.html',
    'admissions/visits/bookings': 'pages/super-crm/bookings.html',
    'jobs/jobs':                  'pages/super-hr/hr.html',
    'jobs/applications':          'pages/super-hr/applications.html',
    'jobs/detail':                'pages/super-hr/applicant-details.html',
    'community/community':        'pages/super-community/community.html',
    'social/social':              'pages/super-social/social.html',
    'settings/settings':          'pages/settings/settings.html'
  };

  // ── Reverse map: a page the iframe navigated to ON ITS OWN (e.g. an
  //    enquiry row → workflow detail) → the level-1 tab to keep highlighted. ──
  const REVERSE = {
    'school.html':            ['school', 'school'],
    'my-team.html':           ['school', 'mystaff'],
    'rooms.html':             ['school', 'rooms'],
    'workspace.html':         ['admissions', 'workspace'],
    'dashboard.html':         ['admissions', 'dashboard'],
    'enquiries.html':         ['admissions', 'enquiries'],
    'enquiry-detail.html':    ['admissions', 'enquiries'],   // candidate detail → keep Enquiries active
    'workflow.html':          ['admissions', 'enquiries'],   // detail view → keep Enquiries active
    'visits.html':            ['admissions', 'visits'],
    'bookings.html':          ['admissions', 'visits'],
    'hr.html':                ['jobs', 'jobs'],
    'applications.html':      ['jobs', 'applications'],
    'applicant-details.html': ['jobs', 'detail'],
    'community.html':         ['community', 'community'],
    'social.html':            ['social', 'social'],
    'settings.html':          ['settings', null]             // keep current settings sub-tab
  };

  return {
    // ── Module / section state ──────────────────────────────────────
    activePage: 'school',
    schoolSection: 'school',          // school | mystaff | rooms
    crmSection: 'dashboard',          // workspace | dashboard | enquiries | tasks | reports | visits
    hrSection: 'jobs',                // jobs | applications | detail
    settingsSection: 'settings',      // single landing (the settings page owns its sub-nav)
    crmVisitsSection: 'visits',       // level-2 under CRM › Visit:  visits | bookings

    // ── Content frame / loader state ────────────────────────────────
    frameSrc: '',
    _pendingFrame: null,              // the page a shell-initiated nav is waiting on (race guard)
    loading: true,
    placeholder: '',
    _loadTimer: null,

    // ── Sidebar collapse / hover-peek state ─────────────────────────
    sidebarCollapsed: false,
    sidebarPeek: false,
    peekTimer: null,
    peekBlockUntil: 0,
    crmAutoCollapsed: false,          // true only while the sidebar is auto-hidden for CRM

    // ── Chrome / misc UI state ──────────────────────────────────────
    isMobile: (typeof window !== 'undefined') ? window.innerWidth < 768 : false,
    rightMenuOpen: false,
    searchOpen: false,
    navSearch: '',
    mobileTopHidden: false,
    mobileBottomHidden: false,
    lastScrollY: 0,
    toasts: [],
    _toastId: 0,

    menuItems,
    rightMenuItems: [
      { label: 'My Profile', desc: 'View and edit your details', icon: 'person' },
      { label: 'Account Settings', desc: 'Preferences and security', icon: 'manage_accounts' },
      { label: 'Notifications', desc: 'Alerts and email digests', icon: 'notifications' },
      { label: 'Team & Roles', desc: 'Manage console access', icon: 'group' },
      { label: 'Billing & Plan', desc: 'Subscription and invoices', icon: 'credit_card' },
      { label: 'Appearance', desc: 'Theme and layout', icon: 'palette' },
      { label: 'Language & Region', desc: 'Locale and time zone', icon: 'language' },
      { label: 'Help & Support', desc: 'Guides and contact', icon: 'help' }
    ],

    // ── Lifecycle ───────────────────────────────────────────────────
    init() {
      if (typeof window === 'undefined') return;
      const mq = window.matchMedia('(max-width: 767px)');
      this.isMobile = mq.matches;
      const upd = () => { this.isMobile = mq.matches; };
      if (mq.addEventListener) mq.addEventListener('change', upd); else mq.addListener(upd);
      try { this.sidebarCollapsed = localStorage.getItem('ssSidebarCollapsed') === '1'; } catch (e) {}
      window.addEventListener('message', (e) => this.handleMessage(e));
      // Load the initial module into the content frame.
      this.$nextTick(() => this.navigate());
    },

    // ── Derived chrome data ─────────────────────────────────────────
    get currentPage() {
      return this.menuItems.find(i => i.id === this.activePage) || this.menuItems[0];
    },
    get mobileMenuItems() {
      // Settings lives in the hamburger drawer, so it's excluded from the bottom bar.
      return this.menuItems.filter(m => m.id !== 'settings');
    },
    get isFullScreenPage() { return false; },
    get navIconClass() {
      return (this.isMobile || (this.sidebarCollapsed && !this.sidebarPeek))
        ? 'border-white/30 text-white hover:bg-white/10 hover:border-white/60'
        : 'border-slate-200 text-slate-500 hover:text-primary hover:border-primary/40 hover:bg-slate-50';
    },

    // ── Level-1 top-nav model (sub-modules of the active sidebar module) ──
    get topNavItems() {
      if (this.activePage === 'school') return [
        { id: 'school',  label: 'My School', kind: 'school' },
        { id: 'mystaff', label: 'My Staff',  kind: 'school' },
        { id: 'rooms',   label: 'Rooms',     kind: 'school' }
      ];
      if (this.activePage === 'admissions') return [
        { id: 'workspace', label: 'My Workspace', kind: 'crm' },
        { id: 'dashboard', label: 'Dashboard',    kind: 'crm' },
        { id: 'enquiries', label: 'Enquiries',    kind: 'crm' },
        { id: 'tasks',     label: 'Tasks',        kind: 'crm' },
        { id: 'reports',   label: 'Reports',      kind: 'crm' },
        { id: 'visits',    label: 'Visit',        kind: 'crm' }
      ];
      if (this.activePage === 'jobs') return [
        { id: 'jobs',         label: 'Jobs',         kind: 'hr' },
        { id: 'applications', label: 'Applications', kind: 'hr' },
        { id: 'detail',       label: 'Lead Details', kind: 'hr' }
      ];
      // Settings is a single landing — the settings page has its OWN rich category nav
      // (Visit Slots / WhatsApp / Calendar / Meet / Notifications / Activity Logs) in its
      // content, so a generic level-1 strip here would be redundant and non-functional.
      if (this.activePage === 'settings') return [{ id: 'settings', label: 'Settings', kind: 'self' }];
      if (this.activePage === 'community') return [{ id: 'community', label: 'My Community', kind: 'self' }];
      if (this.activePage === 'social')    return [{ id: 'social',    label: 'My Social',    kind: 'self' }];
      return [];
    },
    isTopNavActive(item) {
      if (item.kind === 'self')     return this.activePage === item.id;
      if (item.kind === 'school')   return this.activePage === 'school' && this.schoolSection === item.id;
      if (item.kind === 'crm')      return this.activePage === 'admissions' && this.crmSection === item.id;
      if (item.kind === 'hr')       return this.activePage === 'jobs' && this.hrSection === item.id;
      return false;
    },
    onTopNav(item) {
      // Re-entering a level-1 tab resets its level-2 selection to the first sub-tab (matches v15).
      if (item.kind === 'school')   { this.activePage = 'school'; this.schoolSection = item.id; }
      else if (item.kind === 'crm') { this.activePage = 'admissions'; this.crmSection = item.id; if (item.id === 'visits') this.crmVisitsSection = 'visits'; }
      else if (item.kind === 'hr')  { this.activePage = 'jobs'; this.hrSection = item.id; }
      // 'self' (Community / Social / Settings): single sub-module — nothing to change.
      this.navigate();
    },

    // ── Level-2 top-nav model ───────────────────────────────────────
    get showVisitsL2Nav() { return this.activePage === 'admissions' && this.crmSection === 'visits'; },
    get l2VisitItems()    { return [ { id: 'visits', label: 'Visits' }, { id: 'bookings', label: 'Bookings' } ]; },
    onL2Visit(item) { this.crmVisitsSection = item.id; this.navigate(); },

    // Page actions hoisted into the level-2 bar (right end). Clicking relays the action id to
    // the embedded page (which owns the handler) via postMessage — see runL2Action().
    get l2Actions() {
      if (this.activePage === 'admissions' && this.crmSection === 'visits') {
        return this.crmVisitsSection === 'bookings'
          ? [ { id: 'print',  label: 'Print',  icon: 'print' },
              { id: 'export', label: 'Export', icon: 'download' },
              { id: 'new-booking', label: 'New booking', icon: 'add', primary: true } ]
          : [ { id: 'undo',  label: 'Undo',  icon: 'undo' },
              { id: 'reset', label: 'Reset', icon: 'restart_alt' },
              { id: 'publish', label: 'Publish', icon: 'publish', primary: true } ];
      }
      return [];
    },
    runL2Action(id) {
      const f = this.$refs.contentFrame;
      try { if (f && f.contentWindow) f.contentWindow.postMessage({ type: 'ss-action', action: id }, '*'); } catch (e) {}
    },
    // A page asked the shell to navigate (e.g. Dashboard's "View all admissions" → Enquiries).
    goTo(module, section) {
      if (!module) return;
      this.activePage = module;
      if (module === 'admissions' && section)    this.crmSection = section;
      else if (module === 'school' && section)   this.schoolSection = section;
      else if (module === 'jobs' && section)     this.hrSection = section;
      else if (module === 'settings' && section) this.settingsSection = section;
      this.rightMenuOpen = false;
      this.navigate();
    },

    // ── Sidebar (level-0) navigation ────────────────────────────────
    setPage(page) {
      const changed = page !== this.activePage;
      const wasPeeking = this.sidebarCollapsed && this.sidebarPeek;
      this.activePage = page;
      // Entering a module always lands on its default sub-view.
      if (changed && page === 'school')     this.schoolSection = 'school';
      if (changed && page === 'admissions') this.crmSection = 'dashboard';
      if (changed && page === 'jobs')       this.hrSection = 'jobs';
      if (changed && page === 'settings')   this.settingsSection = 'settings';
      // Wider workspace for CRM on desktop (v15): auto-collapse on enter, auto-restore on leave.
      // A flag keeps this from overriding a sidebar the user collapsed by hand.
      if (changed && typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
        if (page === 'admissions') {
          if (!this.sidebarCollapsed) {
            this.collapseSidebar(false);   // auto-collapse: do NOT persist as a user preference
            this.crmAutoCollapsed = true;
            this.pushToast('info', 'Full screen mode activated', 'Sidebar hidden for a wider workspace view.');
          }
        } else if (this.crmAutoCollapsed && this.sidebarCollapsed && !wasPeeking) {
          this.expandSidebar();
        }
      }
      if (wasPeeking) { clearTimeout(this.peekTimer); this.sidebarPeek = false; this.peekBlockUntil = Date.now() + 450; }
      this.rightMenuOpen = false;
      this.navigate();
    },

    // ── Routing → content iframe + content-area spinner ─────────────
    currentRouteKey() {
      switch (this.activePage) {
        // Visit is two-level: its route also depends on the level-2 sub-tab.
        case 'school':     return 'school/' + this.schoolSection;
        case 'admissions': return this.crmSection === 'visits'
                                  ? 'admissions/visits/' + this.crmVisitsSection
                                  : 'admissions/' + this.crmSection;
        case 'jobs':       return 'jobs/' + this.hrSection;
        case 'community':  return 'community/community';
        case 'social':     return 'social/social';
        case 'settings':   return 'settings/' + this.settingsSection;
      }
      return '';
    },
    subLabel() {
      const act = this.topNavItems.find(t => this.isTopNavActive(t));
      let lbl = act ? act.label : (this.currentPage ? this.currentPage.title : '');
      if (this.showVisitsL2Nav) { const v = this.l2VisitItems.find(i => i.id === this.crmVisitsSection); if (v) lbl += ' · ' + v.label; }
      return lbl;
    },
    navigate() {
      // Every shell-initiated navigation starts the mobile chrome from a clean baseline.
      this.resetMobileChrome();
      const url = ROUTES[this.currentRouteKey()] || null;
      const frame = this.$refs.contentFrame;
      if (url) {
        if (this.frameSrc === url) { this._pendingFrame = null; this.loading = false; this.placeholder = ''; return; }
        this.placeholder = '';
        this.loading = true;
        this.frameSrc = url;
        this._pendingFrame = url;        // the page we are now waiting on
        if (frame) frame.setAttribute('src', url);
        clearTimeout(this._loadTimer);
        this._loadTimer = setTimeout(() => { this.loading = false; this._pendingFrame = null; }, 8000);
      } else {
        clearTimeout(this._loadTimer);
        this._pendingFrame = null;
        this.loading = false;
        this.frameSrc = '';
        this.placeholder = this.subLabel() || 'Coming soon';
        if (frame) frame.setAttribute('src', 'about:blank');
      }
    },
    onFrameLoad() {
      // Reliable backstop — fires for whatever the iframe actually committed. Clearing the
      // pending guard here bounds it to the real in-flight load, so a later legitimate
      // in-frame navigation (e.g. enquiries → detail) is never mistaken for a stale message.
      clearTimeout(this._loadTimer);
      this.loading = false;
      this._pendingFrame = null;
    },
    // Normalize a path to its 'pages/…html' tail (full relative path, not just the
    // basename) so the race correlation is unambiguous even if two routes share a filename.
    _pathTail(p) {
      const s = String(p || ''); const i = s.indexOf('pages/');
      return (i >= 0 ? s.slice(i) : s.split(/[\\/]/).pop()).split('?')[0].split('#')[0].toLowerCase();
    },
    resetMobileChrome() { this.mobileTopHidden = false; this.mobileBottomHidden = false; this.lastScrollY = 0; },

    // ── Messages from the embedded module pages ─────────────────────
    handleMessage(e) {
      const d = (e && e.data) || null;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'ss-nav-start') {
        // Ignore stray starts while a placeholder (no real content) is showing.
        if (this.frameSrc) this.loading = true;
      } else if (d.type === 'ss-nav-done') {
        // Correlate with the navigation in flight: a stale message from an
        // abandoned/superseded page must NOT clear the spinner or move the tab.
        if (this._pendingFrame) {
          if (this._pathTail(d.path) !== this._pathTail(this._pendingFrame)) return; // stale — ignore
          this._pendingFrame = null;
        }
        clearTimeout(this._loadTimer);
        this.loading = false;
        this.resetMobileChrome();        // new page starts at the top
        this.syncFromPath(d.path);
      } else if (d.type === 'ss-scroll') {
        this.onContentScroll(d.y || 0);
      } else if (d.type === 'ss-navigate') {
        this.goTo(d.module, d.section);
      }
    },
    syncFromPath(path) {
      if (!path) return;
      const base = String(path).split('/').pop().split('?')[0].split('#')[0].toLowerCase();
      const m = REVERSE[base];
      if (!m) return;
      this.activePage = m[0];
      if (m[0] === 'school' && m[1])          this.schoolSection = m[1];
      else if (m[0] === 'admissions' && m[1]) this.crmSection = m[1];
      else if (m[0] === 'jobs' && m[1])       this.hrSection = m[1];
      // settings: keep the current settings sub-tab.
      const i = String(path).indexOf('pages/');
      if (i >= 0) this.frameSrc = String(path).slice(i).split('?')[0].split('#')[0];
    },
    onContentScroll(y) {
      if (!this.isMobile) return;
      const delta = y - this.lastScrollY;
      if (y <= 8) { this.mobileTopHidden = false; this.mobileBottomHidden = false; }
      else if (delta > 4) { this.mobileTopHidden = true; this.mobileBottomHidden = false; }
      else if (delta < -4) { this.mobileTopHidden = false; this.mobileBottomHidden = true; }
      this.lastScrollY = y;
    },

    // ── Top-bar utilities ───────────────────────────────────────────
    openCrmSettings() { this.setPage('settings'); },
    submitNavSearch() {
      const q = (this.navSearch || '').trim();
      if (q) this.pushToast('info', 'Search', 'Showing results for “' + q + '”.');
      this.searchOpen = false;
      this.navSearch = '';
    },
    pushToast(type, title, desc) {
      const id = (this._toastId = (this._toastId || 0) + 1);
      this.toasts.push({ id, type: type || 'info', title: title || '', desc: desc || '' });
      setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 3200);
    },

    // ── Sidebar collapse / expand / hover-peek ──────────────────────
    collapseSidebar(persist = true) {
      clearTimeout(this.peekTimer);
      this.sidebarCollapsed = true;
      this.sidebarPeek = false;
      this.crmAutoCollapsed = false;
      // Only a deliberate (manual) collapse is remembered across reloads — an
      // automatic CRM wide-workspace collapse must not stick onto other modules.
      if (persist) { try { localStorage.setItem('ssSidebarCollapsed', '1'); } catch (e) {} }
      this.peekBlockUntil = Date.now() + 450;
    },
    expandSidebar() {
      clearTimeout(this.peekTimer);
      this.sidebarCollapsed = false;
      this.sidebarPeek = false;
      this.crmAutoCollapsed = false;
      try { localStorage.setItem('ssSidebarCollapsed', '0'); } catch (e) {}
    },
    toggleSidebar() {
      if (this.sidebarCollapsed) this.expandSidebar();
      else this.collapseSidebar();
    },
    peekEnter() {
      clearTimeout(this.peekTimer);
      if (Date.now() < this.peekBlockUntil) return;
      this.peekTimer = setTimeout(() => { if (this.sidebarCollapsed) this.sidebarPeek = true; }, 150);
    },
    peekLeave() {
      clearTimeout(this.peekTimer);
      this.peekTimer = setTimeout(() => { this.sidebarPeek = false; }, 200);
    },
    sidebarEnter() {
      if (!this.sidebarCollapsed) return;
      clearTimeout(this.peekTimer);
    },
    sidebarLeave() {
      if (!this.sidebarCollapsed) return;
      clearTimeout(this.peekTimer);
      this.peekTimer = setTimeout(() => { this.sidebarPeek = false; }, 200);
    }
  };
}
