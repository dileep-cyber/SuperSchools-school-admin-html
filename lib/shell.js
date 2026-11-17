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
    { id: 'admissions', label: 'Super Leads',     icon: 'school',    title: 'Super Leads',     subtitle: 'Workspace, dashboard, tasks, reports, and teams' },
    { id: 'jobs',       label: 'Super HR',        icon: 'work',      title: 'Super HR',        subtitle: 'Teacher applications, interviews, demos, and hiring funnel' },
    { id: 'site',       label: 'Super Site',      icon: 'language',  title: 'Super Site',      subtitle: 'Build and manage your school website' },
    { id: 'community',  label: 'Super Community', icon: 'groups',    title: 'Super Community', subtitle: 'Parent engagement, announcements, and school events' },
    { id: 'connect',    label: 'Super Connect',   icon: 'forum',     title: 'Super Connect',   subtitle: 'WhatsApp dashboard, templates, campaigns, and chat' },
    { id: 'social',     label: 'Super Social',    icon: 'share',     title: 'Super Social',    subtitle: 'Social media management for your school' },
    { id: 'settings',   label: 'Super Settings',  icon: 'settings',  title: 'Super Settings',     subtitle: 'Console preferences and CRM configuration' }
  ];

  // ── Route table: (module/section) → the content page loaded in the iframe. ──
  //    Sections with no page yet resolve to null → a "coming soon" placeholder
  //    is shown in the content area (the chrome still stays put).
  const ROUTES = {
    'onboarding/setup':           'pages/onboarding/setup.html',   // 5-step school setup (full screen, shown before the dashboard)
    'school/overview':            'pages/super-school/overview.html',
    'school/school':              'pages/super-school/school.html',
    'school/reviews':             'pages/super-school/reviews.html',
    'school/mystaff':             'pages/super-school/my-team.html',
    'school/rooms':               'pages/super-school/rooms.html',
    'admissions/workspace':       'pages/super-crm/workspace.html',
    'admissions/dashboard':       'pages/super-crm/dashboard.html',
    'admissions/enquiries':       'pages/super-crm/enquiries.html',        // Table view
    'admissions/enquiries-chat':  'pages/super-crm/enquiries-chat.html',   // Chat view (header dropdown)
    'admissions/templates':       'pages/super-crm/templates.html',
    'admissions/visits/overview':     'pages/super-crm/visits.html',   // one page; the section is pushed to it
    'admissions/visits/availability': 'pages/super-crm/visits.html',
    'admissions/visits/bookings':     'pages/super-crm/visits.html',
    'jobs/overview':              'pages/super-hr/hr.html',          // Jobs Overview (dashboard)
    'jobs/jobs':                  'pages/super-hr/jobs.html',        // Jobs (listing)
    'jobs/post':                  'pages/super-hr/post-job.html',    // Post a job flow (opened from Jobs; keeps the Jobs tab active)
    'jobs/templates':             'pages/super-hr/hr-templates.html',
    'jobs/applications':          'pages/super-hr/applications.html',        // Table view
    'jobs/applications-chat':     'pages/super-hr/applications-chat.html',   // Chat view (header dropdown)
    'site/site':                  'pages/super-site/site.html',
    'community/community':        'pages/super-community/community.html',
    'connect/dashboard':          'pages/super-connect/connect.html',   // one page; the section is pushed to it
    'connect/template':           'pages/super-connect/connect.html',
    'connect/campaign':           'pages/super-connect/connect.html',
    'connect/chat':               'pages/super-connect/connect.html',
    'social/social':              'pages/super-social/social.html',
    'settings/settings':          'pages/settings/settings.html'
  };

  // ── Reverse map: a page the iframe navigated to ON ITS OWN (e.g. an
  //    enquiry row → workflow detail) → the level-1 tab to keep highlighted. ──
  const REVERSE = {
    'setup.html':             ['onboarding', null],
    'overview.html':          ['school', 'overview'],
    'school.html':            ['school', 'school'],
    'my-team.html':           ['school', 'mystaff'],
    'rooms.html':             ['school', 'rooms'],
    'reviews.html':           ['school', 'reviews'],
    'connect.html':           ['connect', null],
    'site.html':              ['site', null],
    'workspace.html':         ['admissions', 'workspace'],
    'dashboard.html':         ['admissions', 'dashboard'],
    'enquiries.html':         ['admissions', 'enquiries'],
    'enquiries-chat.html':    ['admissions', 'enquiries'],
    'templates.html':         ['admissions', 'templates'],
    'enquiry-detail.html':    ['admissions', 'enquiries'],   // candidate detail → keep Enquiries active
    'workflow.html':          ['admissions', 'enquiries'],   // detail view → keep Enquiries active
    'visits.html':            ['admissions', 'visits'],
    'bookings.html':          ['admissions', 'visits'],
    'hr.html':                ['jobs', 'overview'],
    'jobs.html':              ['jobs', 'jobs'],
    'post-job.html':          ['jobs', 'post'],
    'hr-templates.html':      ['jobs', 'templates'],
    'applications.html':      ['jobs', 'applications'],
    'applications-chat.html': ['jobs', 'applications'],
    'applicant-details.html': ['jobs', 'detail'],
    'community.html':         ['community', 'community'],
    'social.html':            ['social', 'social'],
    'settings.html':          ['settings', null]             // keep current settings sub-tab
  };

  return {
    // ── Module / section state ──────────────────────────────────────
    activePage: 'onboarding',         // a signed-in school opens the 5-step setup first (until it is finished); Save & exit and Finish land on school/overview
    signOutOpen: false,               // the Sign out confirmation dialog
    schoolSection: 'overview',        // overview | school | mystaff | rooms   (Overview = the default landing page)
    crmSection: 'dashboard',          // workspace | dashboard | enquiries | tasks | reports | visits
    hrSection: 'overview',            // overview | jobs | post (the post-a-job flow) | applications | templates
    enquiriesView: 'table',           // table | chat   (header dropdown on CRM > Enquiries; remembered)
    applicationsView: 'table',        // table | chat   (header dropdown on Super HR > Applications; remembered)
    connectSection: 'dashboard',      // dashboard | template | campaign | chat   (level-2 under Super Connect > WhatsApp)
    pageTabs: [],                     // level-1 tabs registered by the page (Super Community: school types; Super Site: Website setup / Templates)
    pageFullscreen: false,            // a page may ask for the full screen while a wizard is open (Super Site setup)
    settingsSection: 'settings',      // single landing (the settings page owns its sub-nav)
    crmVisitsSection: 'overview',     // level-2 under CRM › Visit:  overview | availability | bookings

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
    crmAutoCollapsed: false,          // true only while the sidebar is auto-hidden for a focus screen (CRM, My School)
    _focusPrev: false,                // was the previous route a focus (wide-workspace) screen?

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

    // ── Header controls registered by the embedded page (school switcher, demo role…) ──
    headerControls: [],               // [{id,label,icon,prefix,value,options:[{value,label,sub,short}]}]
    openControl: null,                // id of the control whose dropdown is open

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
    // Sign out: end the session and go back to the pre-login home (index.html).
    askSignOut() { this.signOutOpen = true; this.rightMenuOpen = false; },
    signOut() {
      this.signOutOpen = false;
      if (window.SSAuth) window.SSAuth.signOut(); else window.location.replace('index.html');
    },
    init() {
      if (typeof window === 'undefined') return;
      // The console is the post-login side: without a session (set by the login flow) go to the pre-login home.
      if (window.SSAuth && !window.SSAuth.requireAuth()) return;
      // Setup already finished for this account -> straight to the dashboard (School > Overview).
      const sess = window.SSAuth && window.SSAuth.get();
      if (sess && sess.setupDone) { this.activePage = 'school'; this.schoolSection = 'overview'; }
      const mq = window.matchMedia('(max-width: 767px)');
      this.isMobile = mq.matches;
      const upd = () => { this.isMobile = mq.matches; };
      if (mq.addEventListener) mq.addEventListener('change', upd); else mq.addListener(upd);
      try { this.sidebarCollapsed = localStorage.getItem('ssSidebarCollapsed') === '1'; } catch (e) {}
      try { this.enquiriesView = localStorage.getItem('ssEnquiriesView') === 'chat' ? 'chat' : 'table'; } catch (e) {}
      try { this.applicationsView = localStorage.getItem('ssApplicationsView') === 'chat' ? 'chat' : 'table'; } catch (e) {}
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
    // My School (the detail editor) and Post a job are FULL-SCREEN pages: sidebar, top nav and level-2 are all hidden.
    get isFullScreenPage() { return this.activePage === 'onboarding' || (this.activePage === 'school' && this.schoolSection === 'school') || (this.activePage === 'jobs' && this.hrSection === 'post') || (this.activePage === 'site' && this.pageFullscreen); },
    // The post-a-job flow owns the bottom of the screen (its own Back / Next bar), so the mobile bottom nav is hidden there too.
    get hideMobileNav() { return this.activePage === 'onboarding' || (this.activePage === 'jobs' && this.hrSection === 'post') || (this.activePage === 'site' && this.pageFullscreen); },
    get navIconClass() {
      return (this.isMobile || (this.sidebarCollapsed && !this.sidebarPeek))
        ? 'border-white/30 text-white hover:bg-white/10 hover:border-white/60'
        : 'border-slate-200 text-slate-500 hover:text-primary hover:border-primary/40 hover:bg-slate-50';
    },

    // ── Level-1 top-nav model (sub-modules of the active sidebar module) ──
    get topNavItems() {
      if (this.activePage === 'school') return [
        { id: 'overview', label: 'Overview',  kind: 'school' },
        { id: 'school',  label: 'My School', kind: 'school' },
        { id: 'reviews', label: 'Reviews',   kind: 'school' },
        { id: 'mystaff', label: 'My Staff',  kind: 'school' },
        { id: 'rooms',   label: 'Rooms',     kind: 'school' }
      ];
      if (this.activePage === 'admissions') return [
        { id: 'workspace', label: 'My Workspace', kind: 'crm' },
        { id: 'dashboard', label: 'Leads Overview', kind: 'crm' },
        { id: 'enquiries', label: 'Enquiries',    kind: 'crm' },
        { id: 'templates', label: 'Templates',    kind: 'crm' },
        { id: 'visits',    label: 'Visit',        kind: 'crm' }
      ];
      if (this.activePage === 'jobs') return [
        { id: 'overview',     label: 'Jobs Overview', kind: 'hr' },
        { id: 'jobs',         label: 'Jobs',          kind: 'hr' },
        { id: 'applications', label: 'Applications',  kind: 'hr' },
        { id: 'templates',    label: 'Templates',     kind: 'hr' }   // applicant detail opens inside Applications
      ];
      // Settings is a single landing — the settings page has its OWN rich category nav
      // (Visit Slots / WhatsApp / Calendar / Meet / Notifications / Activity Logs) in its
      // content, so a generic level-1 strip here would be redundant and non-functional.
      if (this.activePage === 'settings') return [{ id: 'settings', label: 'Settings', kind: 'self' }];
      // Community: the page registers one tab per school type of the selected school (Preschool / Day School / Boarding).
      if (this.activePage === 'community') return this.pageTabs.length
        ? this.pageTabs.map(t => ({ id: t.id, label: t.label, kind: 'page', active: !!t.active }))
        : [{ id: 'community', label: 'My Community', kind: 'self' }];
      if (this.activePage === 'connect')   return [{ id: 'connect', label: 'WhatsApp', kind: 'self' }];
      // Super Site: the page registers Website setup / Templates (no Publish tab).
      if (this.activePage === 'site') return this.pageTabs.length
        ? this.pageTabs.map(t => ({ id: t.id, label: t.label, kind: 'page', active: !!t.active }))
        : [{ id: 'site', label: 'Website setup', kind: 'self' }, { id: 'site-templates', label: 'Templates', kind: 'self-off' }];
      if (this.activePage === 'social')    return [{ id: 'social',    label: 'My Social',    kind: 'self' }];
      return [];
    },
    isTopNavActive(item) {
      if (item.kind === 'self')     return this.activePage === item.id;
      if (item.kind === 'page')     return !!item.active;
      if (item.kind === 'school')   return this.activePage === 'school' && this.schoolSection === item.id;
      if (item.kind === 'crm')      return this.activePage === 'admissions' && this.crmSection === item.id;
      if (item.kind === 'hr')       return this.activePage === 'jobs' && (this.hrSection === item.id || (item.id === 'jobs' && this.hrSection === 'post'));
      return false;
    },
    onTopNav(item) {
      if (item.kind === 'page') {       // page-owned tab: tell the page, no route change
        this.pageTabs = this.pageTabs.map(t => Object.assign({}, t, { active: t.id === item.id }));
        const f = this.$refs.contentFrame;
        try { if (f && f.contentWindow) f.contentWindow.postMessage({ type: 'ss-control', id: 'tab', value: item.id }, '*'); } catch (e) {}
        return;
      }
      // Re-entering a level-1 tab resets its level-2 selection to the first sub-tab (matches v15).
      if (item.kind === 'school')   { this.activePage = 'school'; this.schoolSection = item.id; }
      else if (item.kind === 'crm') { this.activePage = 'admissions'; this.crmSection = item.id; if (item.id === 'visits') this.crmVisitsSection = 'overview'; }
      else if (item.kind === 'hr')  { this.activePage = 'jobs'; this.hrSection = item.id; }
      // 'self' (Community / Social / Settings): single sub-module — nothing to change.
      this.navigate();
    },

    // ── Level-2 top-nav model ───────────────────────────────────────
    get showVisitsL2Nav() { return this.activePage === 'admissions' && this.crmSection === 'visits'; },
    // Generic level-2 bar: CRM > Visit (Visits / Bookings) and Super Connect > WhatsApp (Dashboard / Template / Campaign / Chat).
    get showL2Nav() { return !this.isFullScreenPage && (this.showVisitsL2Nav || this.activePage === 'connect'); },
    get connectItems() { return [ { id: 'dashboard', label: 'Dashboard' }, { id: 'template', label: 'Template' }, { id: 'campaign', label: 'Campaign' }, { id: 'chat', label: 'Chat' } ]; },
    get l2Items() { return this.activePage === 'connect' ? this.connectItems : this.l2VisitItems; },
    get l2Current() { return this.activePage === 'connect' ? this.connectSection : this.crmVisitsSection; },
    onL2(item) {
      if (this.activePage === 'connect') { this.connectSection = item.id; this.navigate(); this.pushSection(); }
      else this.onL2Visit(item);
    },
    // Tell a single-page module (Super Connect, CRM > Visit) which section to show.
    pushSection() {
      let section = null;
      if (this.activePage === 'connect') section = this.connectSection;
      else if (this.activePage === 'admissions' && this.crmSection === 'visits') section = this.crmVisitsSection;
      if (!section) return;
      const f = this.$refs.contentFrame;
      try { if (f && f.contentWindow) f.contentWindow.postMessage({ type: 'ss-section', section: section }, '*'); } catch (e) {}
    },
    get l2VisitItems()    { return [ { id: 'overview', label: 'Overview' }, { id: 'availability', label: 'Availability' }, { id: 'bookings', label: 'Bookings' } ]; },
    onL2Visit(item) { this.crmVisitsSection = item.id; this.navigate(); this.pushSection(); },

    // Page actions hoisted into the level-2 bar (right end). Clicking relays the action id to
    // the embedded page (which owns the handler) via postMessage — see runL2Action().
    get l2Actions() { return []; },   // (the Visit page now carries its own actions)
    runL2Action(id) {
      const f = this.$refs.contentFrame;
      try { if (f && f.contentWindow) f.contentWindow.postMessage({ type: 'ss-action', action: id }, '*'); } catch (e) {}
    },
    // A page asked the shell to navigate (e.g. Dashboard's "View all admissions" → Enquiries).
    goTo(module, section) {
      if (!module) return;
      this.activePage = module;
      if (module === 'admissions' && section === 'visits-availability') { this.crmSection = 'visits'; this.crmVisitsSection = 'availability'; }
      else if (module === 'admissions' && section) this.crmSection = section;
      else if (module === 'school' && section)   this.schoolSection = section;
      else if (module === 'jobs' && section)     this.hrSection = section;
      else if (module === 'connect' && section)  this.connectSection = section;
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
      if (changed && page === 'school')     this.schoolSection = 'overview';
      if (changed && page === 'admissions') this.crmSection = 'dashboard';
      if (changed && page === 'jobs')       this.hrSection = 'overview';
      if (changed && page === 'connect')    this.connectSection = 'dashboard';
      // Tapping Super Schools while on the full-screen My School page returns to Overview (mobile bottom nav).
      if (!changed && page === 'school' && this.schoolSection === 'school') this.schoolSection = 'overview';
      if (changed && page === 'settings')   this.settingsSection = 'settings';
      // Wider workspace for focus screens (Super Leads, Super HR) — see syncFocusCollapse().
      this.syncFocusCollapse(wasPeeking);
      if (wasPeeking) { clearTimeout(this.peekTimer); this.sidebarPeek = false; this.peekBlockUntil = Date.now() + 450; }
      this.rightMenuOpen = false;
      this.navigate();
    },

    // ── Focus screens: the sidebar auto-hides for a wider workspace ──
    //    Super Leads and Super HR. (The user can still open the sidebar with the toggle or by hovering its edge.)
    isFocusRoute() {
      return this.activePage === 'admissions' || this.activePage === 'jobs';
    },
    // Desktop only. Auto-collapse when ENTERING a focus screen, auto-restore when LEAVING it.
    // The flag keeps this from overriding a sidebar the user collapsed/expanded by hand, and the
    // collapse is never persisted (so a reload never starts collapsed).
    syncFocusCollapse(wasPeeking) {
      const want = this.isFocusRoute(), was = this._focusPrev;
      this._focusPrev = want;
      if (typeof window === 'undefined' || !window.matchMedia('(min-width: 768px)').matches) return;
      if (wasPeeking === undefined) wasPeeking = this.sidebarCollapsed && this.sidebarPeek;
      if (want && !was) {
        if (!this.sidebarCollapsed) {
          this.collapseSidebar(false);   // auto-collapse: do NOT persist as a user preference
          this.crmAutoCollapsed = true;
          this.pushToast('info', 'Full screen mode activated', 'Sidebar hidden for a wider workspace view.');
        }
      } else if (!want && was && this.crmAutoCollapsed && this.sidebarCollapsed && !wasPeeking) {
        this.expandSidebar();
      }
    },

    // ── Routing → content iframe + content-area spinner ─────────────
    currentRouteKey() {
      switch (this.activePage) {
        // Visit is two-level: its route also depends on the level-2 sub-tab.
        case 'onboarding': return 'onboarding/setup';
        case 'school':     return 'school/' + this.schoolSection;
        case 'admissions': return this.crmSection === 'visits'
                                  ? 'admissions/visits/' + this.crmVisitsSection
                                  : (this.crmSection === 'enquiries' && this.enquiriesView === 'chat')
                                    ? 'admissions/enquiries-chat'
                                    : 'admissions/' + this.crmSection;
        case 'jobs':       return (this.hrSection === 'applications' && this.applicationsView === 'chat') ? 'jobs/applications-chat' : 'jobs/' + this.hrSection;
        case 'community':  return 'community/community';
        case 'connect':    return 'connect/' + this.connectSection;
        case 'site':       return 'site/site';
        case 'social':     return 'social/social';
        case 'settings':   return 'settings/' + this.settingsSection;
      }
      return '';
    },
    subLabel() {
      const act = this.topNavItems.find(t => this.isTopNavActive(t));
      let lbl = act ? act.label : (this.currentPage ? this.currentPage.title : '');
      if (this.showL2Nav) { const v = this.l2Items.find(i => i.id === this.l2Current); if (v) lbl += ' · ' + v.label; }
      return lbl;
    },
    navigate() {
      // Every shell-initiated navigation starts the mobile chrome from a clean baseline.
      this.resetMobileChrome();
      this.syncFocusCollapse();
      const url = ROUTES[this.currentRouteKey()] || null;
      const frame = this.$refs.contentFrame;
      if (!url || this.frameSrc !== url) { this.headerControls = []; this.openControl = null; this.pageTabs = []; this.pageFullscreen = false; }
      if (url) {
        if (this.frameSrc === url) { this._pendingFrame = null; this.loading = false; this.placeholder = ''; this.pushSection(); return; }
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
      this.pushSection();
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
      if (d.type === 'ss-fullscreen') {
        this.pageFullscreen = !!d.on;
      } else if (d.type === 'ss-tabs') {
        this.pageTabs = Array.isArray(d.tabs) ? d.tabs : [];
      } else if (d.type === 'ss-controls') {
        this.headerControls = Array.isArray(d.controls) ? d.controls : [];
        this.openControl = null;
      } else if (d.type === 'ss-nav-start') {
        // Ignore stray starts while a placeholder (no real content) is showing.
        if (this.frameSrc) { this.loading = true; this.headerControls = []; this.openControl = null; this.pageTabs = []; this.pageFullscreen = false; }
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
        this.pushSection();
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
      this.syncFocusCollapse();
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

    // ── Header controls (see components/HeaderControls.js) ──────────
    // Shell-owned control: Table view / Chat view, shown beside the page's own controls on CRM > Enquiries.
    get viewControl() {
      const hr = this.activePage === 'jobs';
      const v = hr ? this.applicationsView : this.enquiriesView;
      return { id: 'view', label: hr ? 'Applications view' : 'Enquiries view', icon: v === 'chat' ? 'forum' : 'table_rows', value: v,
        options: [ { value: 'table', label: 'Table view', short: 'Table', sub: hr ? 'Listing and kanban' : 'Listing, kanban and map' },
                   { value: 'chat',  label: 'Chat view',  short: 'Chat',  sub: hr ? 'Message applicants, thread by thread' : 'Message parents, thread by thread' } ] };
    },
    get hasViewControl() { return (this.activePage === 'admissions' && this.crmSection === 'enquiries') || (this.activePage === 'jobs' && this.hrSection === 'applications'); },
    get allControls() { return this.hasViewControl ? this.headerControls.concat([this.viewControl]) : this.headerControls; },
    setEnquiriesView(v) {
      v = (v === 'chat') ? 'chat' : 'table';
      const hr = this.activePage === 'jobs';
      if (v === (hr ? this.applicationsView : this.enquiriesView)) return;
      if (hr) this.applicationsView = v; else this.enquiriesView = v;
      try { localStorage.setItem(hr ? 'ssApplicationsView' : 'ssEnquiriesView', v); } catch (e) {}
      this.navigate();
    },
    controlOption(c) { return (c.options || []).find(o => String(o.value) === String(c.value)) || (c.options || [])[0] || {}; },
    controlLabel(c) { if (c.groups) return c.title || c.label; const o = this.controlOption(c); return (this.isMobile && o.short) ? o.short : (o.label || ''); },
    toggleControl(id) { this.openControl = (this.openControl === id) ? null : id; },
    // Grouped controls (demo states): the button shows a fixed label, the panel lists radio groups.
    pickControl(c, value, group) {
      if (c.id === 'view') { this.openControl = null; this.setEnquiriesView(value); return; }   // shell-owned
      if (group) {
        const g = (c.groups || []).find(x => x.key === group);
        if (g) g.value = value;
      } else {
        this.openControl = null;
        if (String(c.value) === String(value)) return;
        c.value = value;                // optimistic — the page re-announces the confirmed value
      }
      const f = this.$refs.contentFrame;
      try { if (f && f.contentWindow) f.contentWindow.postMessage({ type: 'ss-control', id: c.id, value: value, group: group || null }, '*'); } catch (e) {}
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
