    function schoolConsole(opts) {
      opts = opts || {};
      // ── Two-level navigation model — data lives in lib/navigation.js ──
      // window.SSNav = { menuItems, subModules, moduleHome }. Keeping the route
      // config in its own module mirrors a Next.js navigation/config module and
      // gives the shell components + this store a single source of truth.
      var SSNAV = (typeof window !== 'undefined' && window.SSNav) ? window.SSNav : {};
      const menuItems = SSNAV.menuItems || [];
      const subModules = SSNAV.subModules || {};
      const moduleHome = SSNAV.moduleHome || function () { return '../super-school/school.html'; };

      // Pre-built 15-minute time options spanning 8:00 AM – 7:00 PM (inclusive).
      // Value is "HH:MM" (24h) for sorting/validation; label is "HH:MM AM/PM" for display.
      const timeOptions = [];
      for (let m = 8 * 60; m <= 19 * 60; m += 15) {
        const h24 = Math.floor(m / 60);
        const mm = m % 60;
        const period = h24 < 12 ? 'AM' : 'PM';
        const h12 = h24 === 0 ? 12 : (h24 > 12 ? h24 - 12 : h24);
        const v = String(h24).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
        const l = String(h12).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ' ' + period;
        timeOptions.push({ value: v, label: l });
      }

      // Fixed one-hour admission slots, 9 AM–5 PM (hours 9..16). Each: {h, on, max(2-10)}.
      const mkSlots = (allOn) => {
        const out = [];
        for (let hh = 9; hh <= 16; hh++) out.push({ h: hh, on: allOn, max: 2 });
        return out;
      };

      const candidates = [
        { id: 1, name: 'Shiva Kumar', mobile: '99808 33777', degree: 'B.Sc', specialization: 'Computer Science', experience: '0-2 Years', date: '10-10-2026', initials: 'SK', avatarColor: 'bg-amber-400', status: 'New Application', dist: '1.2 km', top: 25, left: 30 },
        { id: 2, name: 'Aarav Sharma', mobile: '98765 43210', degree: 'M.Tech', specialization: 'Information Tech', experience: '3-5 Years', date: '12-05-2026', initials: 'AS', avatarColor: 'bg-blue-500', status: 'New Application', dist: '4.2 km', top: 55, left: 68 },
        { id: 3, name: 'Aditi Rao', mobile: '91234 56789', degree: 'B.A. B.Ed', specialization: 'English Literature', experience: '2-4 Years', date: '15-08-2026', initials: 'AR', avatarColor: 'bg-pink-500', status: 'Interview Called', dist: '3.5 km', top: 70, left: 85 },
        { id: 4, name: 'Vikram Singh', mobile: '98888 12345', degree: 'M.Sc', specialization: 'Mathematics', experience: '5+ Years', date: '20-09-2026', initials: 'VS', avatarColor: 'bg-green-500', status: 'Interviewed', dist: '6.1 km', top: 15, left: 80 },
        { id: 5, name: 'Meera Gupta', mobile: '94444 66666', degree: 'Ph.D', specialization: 'History', experience: '8+ Years', date: '05-11-2026', initials: 'MG', avatarColor: 'bg-teal-500', status: 'Hired', dist: '2.8 km', top: 40, left: 15 },
        { id: 6, name: 'Rahul Verma', mobile: '93333 11111', degree: 'B.Ed', specialization: 'Primary Education', experience: '1-3 Years', date: '18-10-2026', initials: 'RV', avatarColor: 'bg-purple-500', status: 'Rejected', dist: '5.4 km', top: 80, left: 45 },
        { id: 7, name: 'Priya Iyer', mobile: '92222 77777', degree: 'M.A.', specialization: 'Fine Arts', experience: '4-6 Years', date: '22-11-2026', initials: 'PI', avatarColor: 'bg-indigo-500', status: 'Interview Called', dist: '0.8 km', top: 10, left: 50 },
        { id: 8, name: 'Sanjay Dutt', mobile: '91111 88888', degree: 'B.Tech', specialization: 'Mechanical', experience: '2-3 Years', date: '01-12-2026', initials: 'SD', avatarColor: 'bg-orange-500', status: 'New Application', dist: '7.2 km', top: 60, left: 20 }
      ];

      return {
        // activePage = the active MAIN module — drives the left-sidebar highlight
        //   and each dashboard's `x-if` guard (e.g. activePage === 'jobs').
        // activeSub  = the active SUB-module within that module — drives the
        //   TOP NAV BAR tabs (e.g. Admissions / Enquiries / Detail under CRM).
        // Pages initialise with schoolConsole({ module, sub }); the legacy
        // { active, label } shape is still honoured for safety.
        activePage: opts.module || opts.active || 'school',
        activeSub: opts.sub || opts.module || opts.active || 'school',
        previousPage: opts.module || opts.active || 'school',
        navLabel: opts.label || '',
        search: '',
        viewMode: 'map',
        // Persisted across pages so the global sidebar keeps its collapsed/
        // expanded state when navigating between module pages (no width jump).
        sidebarCollapsed: (function () { try { return localStorage.getItem('ssSidebarCollapsed') === '1'; } catch (e) { return false; } })(),
        sidebarPeek: false,
        peekTimer: null,
        peekBlockUntil: 0,
        rightMenuOpen: false,
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
        menuItems,
        subModules,
        candidates,
        socialKpis: [
          { label: 'Total Followers', value: '12,480', delta: '+8.2%', up: true, icon: 'group', bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Total Posts', value: '342', delta: '+4.5%', up: true, icon: 'post_add', bg: 'bg-violet-50', color: 'text-violet-600' },
          { label: 'Engagement Rate', value: '5.7%', delta: '+1.3%', up: true, icon: 'favorite', bg: 'bg-rose-50', color: 'text-rose-600' },
          { label: 'Profile Visits', value: '8,914', delta: '-2.1%', up: false, icon: 'visibility', bg: 'bg-emerald-50', color: 'text-emerald-600' }
        ],
        socialChannels: [
          { name: 'Facebook', handle: '@SuperSchools', icon: 'thumb_up', color: '#1877F2', followers: '5,240', posts: 46, growth: '+11.1%', up: true },
          { name: 'Instagram', handle: '@superschools_india', icon: 'photo_camera', color: '#E1306C', followers: '4,010', posts: 42, growth: '+5.3%', up: true },
          { name: 'YouTube', handle: 'SuperSchools', icon: 'smart_display', color: '#FF0000', followers: '2,210', posts: 45, growth: '+8.7%', up: true },
          { name: 'LinkedIn', handle: 'SuperSchools', icon: 'business_center', color: '#0A66C2', followers: '1,020', posts: 38, growth: '-1.2%', up: false }
        ],
        socialBestPost: {
          title: 'Choosing a school should not feel like decoding the internet.',
          excerpt: 'Parents are not looking for more school pages, they are looking for faster clarity.',
          platform: 'Facebook', icon: 'thumb_up', color: '#1877F2', date: '30 May 2026, 02:11 PM',
          reach: '3,205', likes: 447, comments: 62, shares: 38
        },
        socialPosts: [
          { title: 'Choosing a school should not feel like decoding the internet.', platform: 'Facebook', icon: 'thumb_up', color: '#1877F2', date: '30 May 2026', reach: '3,205', engagement: '447', status: 'Published' },
          { title: 'Parents are looking for faster clarity, not more pages.', platform: 'Instagram', icon: 'photo_camera', color: '#E1306C', date: '30 May 2026', reach: '2,968', engagement: '440', status: 'Published' },
          { title: 'Behind the scenes: a day at Green Valley International.', platform: 'YouTube', icon: 'smart_display', color: '#FF0000', date: '29 May 2026', reach: '801', engagement: '255', status: 'Published' },
          { title: 'We are hiring passionate educators for 2026-27.', platform: 'LinkedIn', icon: 'business_center', color: '#0A66C2', date: '31 May 2026', reach: 'NA', engagement: '0', status: 'Scheduled' },
          { title: 'Admissions open - early-bird window closing soon.', platform: 'Facebook', icon: 'thumb_up', color: '#1877F2', date: '01 Jun 2026', reach: 'NA', engagement: '0', status: 'Draft' }
        ],
        socialActivity: [
          { icon: 'post_add', bg: 'bg-blue-50', color: 'text-blue-600', title: 'New post published on Facebook', time: '12 minutes ago' },
          { icon: 'trending_up', bg: 'bg-emerald-50', color: 'text-emerald-600', title: 'Engagement increased by 18% this week', time: '1 hour ago' },
          { icon: 'celebration', bg: 'bg-violet-50', color: 'text-violet-600', title: 'Reached 12,000 followers milestone', time: '3 hours ago' },
          { icon: 'schedule', bg: 'bg-amber-50', color: 'text-amber-600', title: '2 posts scheduled for tomorrow', time: '5 hours ago' },
          { icon: 'comment', bg: 'bg-rose-50', color: 'text-rose-600', title: 'New comment on an Instagram post', time: 'Yesterday' }
        ],
        socialQuickActions: [
          { label: 'Create Post', icon: 'edit', primary: true },
          { label: 'Schedule Post', icon: 'schedule', primary: false },
          { label: 'View Analytics', icon: 'analytics', primary: false },
          { label: 'Manage Channels', icon: 'tune', primary: false }
        ],
        timeOptions,
        admissionPendingStatuses: [
          { name: 'New Enquiries', count: 842, desc: 'Review needed' },
          { name: 'Hot Leads', count: 615, desc: 'Follow-up due' },
          { name: 'Tour Scheduled', count: 342, desc: 'Tour pending' },
          { name: 'Cold / No Response', count: 184, desc: 'Needs callback' }
        ],
        jobPendingStatuses: [
          { name: 'New Applications', count: 238, desc: 'Awaiting review' },
          { name: 'Interview Scheduled', count: 182, desc: 'Interview pending' },
          { name: 'Interviewed', count: 156, desc: 'Feedback needed' },
          { name: 'Have Not Talked', count: 124, desc: 'Screening needed' }
        ],
        admissionConversion: { admitted: 47, total: 2101, rate: 2 },
        jobConversion: { hired: 22, total: 816, rate: 3 },
        admissionSources: [
          { name: 'Facebook Ads', total: 412, converted: 8, rate: 2 },
          { name: 'Instagram', total: 286, converted: 5, rate: 2 },
          { name: 'Website', total: 344, converted: 11, rate: 3 },
          { name: 'Referral', total: 128, converted: 9, rate: 7 },
          { name: 'Google Ads', total: 276, converted: 4, rate: 1 },
          { name: 'Campaign', total: 202, converted: 4, rate: 2 },
          { name: 'SuperSchools', total: 296, converted: 7, rate: 2 },
          { name: 'Others', total: 157, converted: 3, rate: 2 }
        ],
        jobSources: [
          { name: 'LinkedIn', total: 164, converted: 5, rate: 3 },
          { name: 'Facebook Ads', total: 96, converted: 2, rate: 2 },
          { name: 'Instagram', total: 84, converted: 2, rate: 2 },
          { name: 'Website', total: 112, converted: 3, rate: 3 },
          { name: 'Referral', total: 72, converted: 6, rate: 8 },
          { name: 'Campaign', total: 118, converted: 2, rate: 2 },
          { name: 'SuperSchools', total: 70, converted: 1, rate: 1 },
          { name: 'Others', total: 105, converted: 2, rate: 2 }
        ],
        schoolStats: [
          { label: 'Profile views', value: '1.8k' },
          { label: 'Enquiries', value: '126' },
          { label: 'Visits', value: '34' },
          { label: 'Open roles', value: '06' }
        ],
        schoolTasks: ['Verify admission fee range', 'Assign 7 overdue parent follow-ups', 'Review 5 shortlisted teacher profiles', 'Update transport availability by locality'],
        activities: [
          { icon: 'edit_note', title: 'Admission counsellor added follow-up note', time: '12 minutes ago' },
          { icon: 'event', title: 'Parent visit scheduled for Grade 1', time: '42 minutes ago' },
          { icon: 'person_check', title: 'Primary teacher candidate shortlisted', time: '1 hour ago' }
        ],
        admissionStats: [
          { label: 'New enquiries today', value: '18', delta: '+12%', icon: 'person_add', bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Follow-ups due', value: '42', delta: '+8%', icon: 'phone_in_talk', bg: 'bg-amber-50', color: 'text-amber-600' },
          { label: 'Visits scheduled', value: '15', delta: '+5%', icon: 'calendar_month', bg: 'bg-violet-50', color: 'text-violet-600' },
          { label: 'Admissions confirmed', value: '09', delta: '+3%', icon: 'verified', bg: 'bg-emerald-50', color: 'text-emerald-600' }
        ],
        admissions: [
          { id: 1, parent: 'Rohit Mehta', phone: '98765 12009', child: 'Aarohi • Grade 1', locality: 'Electronic City', source: 'Superschools', status: 'Visit Scheduled', quality: 'Hot', followup: 'Today, 4:30 PM' },
          { id: 2, parent: 'Neha Iyer', phone: '99880 45211', child: 'Kabir • Nursery', locality: 'Hosa Road', source: 'Website', status: 'Interested', quality: 'Warm', followup: 'Tomorrow, 10:00 AM' },
          { id: 3, parent: 'Arjun Rao', phone: '91234 77889', child: 'Mira • KG 2', locality: 'Begur', source: 'Walk-in', status: 'Needs Information', quality: 'Warm', followup: 'Today, 2:00 PM' },
          { id: 4, parent: 'Priya Nair', phone: '90000 13322', child: 'Vihaan • Grade 3', locality: 'HSR Layout', source: 'Referral', status: 'Application Received', quality: 'Hot', followup: 'Friday, 11:30 AM' },
          { id: 5, parent: 'Sanjay Gupta', phone: '94444 51234', child: 'Riya • Grade 5', locality: 'Bommanahalli', source: 'Social Media', status: 'Not Reachable', quality: 'Cold', followup: 'Overdue' }
        ],
        admissionPipeline: [
          { name: 'New', count: 24, width: 82 },
          { name: 'Contacted', count: 31, width: 100 },
          { name: 'Interested', count: 19, width: 62 },
          { name: 'Visit Scheduled', count: 15, width: 48 },
          { name: 'Application', count: 11, width: 36 },
          { name: 'Confirmed', count: 9, width: 30 }
        ],
        hiringStats: [
          { label: 'New applications', value: '28', icon: 'work' },
          { label: 'Shortlisted', value: '12', icon: 'how_to_reg' },
          { label: 'Interviews scheduled', value: '07', icon: 'event_available' },
          { label: 'Hires completed', value: '03', icon: 'verified' }
        ],
        communityStats: [
          { label: 'Active parents', value: '842' },
          { label: 'Posts this week', value: '12' },
          { label: 'Event RSVPs', value: '96' },
          { label: 'Open notices', value: '04' }
        ],
        events: [
          { title: 'Open House', date: '18 May 2026', note: 'Campus walkthrough for shortlisted parents.' },
          { title: 'Parent Orientation', date: '22 May 2026', note: 'New admission onboarding session.' },
          { title: 'Teacher Demo Day', date: '25 May 2026', note: 'Demo classes for shortlisted candidates.' }
        ],
        settings: [
          { title: 'Staff and ownership', desc: 'Manage counsellors, admins, and hiring coordinators.' },
          { title: 'Admissions pipeline', desc: 'Configure lead stages, quality labels, and lost reasons.' },
          { title: 'Hiring pipeline', desc: 'Configure role types, interview stages, and feedback fields.' },
          { title: 'Notifications', desc: 'Set follow-up, visit, interview, and overdue reminders.' }
        ],

        /* ========= CONFIGURATIONS ========= */
        config: {
          pageState: 'ready',
          settingsTab: 'scheduling',
          settingsTabs: [
            { id: 'scheduling',    label: 'Visit Slots',                icon: 'event_available' },
            { id: 'whatsapp',      label: 'WhatsApp',                   icon: 'chat' },
            { id: 'calendar',      label: 'Google Calendar',            icon: 'calendar_month' },
            { id: 'meet',          label: 'Google Meet',                icon: 'videocam' },
            { id: 'notifications', label: 'Notifications',              icon: 'notifications' },
            { id: 'logs',          label: 'Activity Logs',              icon: 'history' }
          ],
          toasts: [],
          _toastSeq: 0,
          whatsapp: {
            state: 'connected',
            phone: '+91 98765 43210',
            webhook: 'https://crm.superschools.in/webhooks/whatsapp/stmarys',
            apiToken: 'EAAGm0aXk...••••••••••3a9f',
            showToken: false,
            onboardingOpen: 3,
            completed: [true, true, true, false, false],
            sendingTest: false,
            testResult: null
          },
          calendar: {
            state: 'connected',
            account: 'admissions@stmarys.edu.in',
            accountName: 'Admissions Office',
            selectedCalendar: 'primary',
            autoReminder: true,
            syncEnabled: true,
            lastSynced: '2 minutes ago',
            onboardingOpen: -1,
            completed: [true, true, true, true, true, false]
          },
          meet: {
            state: 'available',
            autoGenerate: true,
            defaultDuration: 45,
            interviewType: 'all',
            generatedLink: 'https://meet.google.com/abc-defg-hij',
            copied: false
          },
          notifications: {
            state: 'idle',
            channels: { whatsapp: true, sms: false, email: true, calendar: true },
            events: {
              interview_scheduled: { whatsapp: true, sms: false, email: true, calendar: true },
              interview_rescheduled: { whatsapp: true, sms: false, email: true, calendar: true },
              interview_cancelled: { whatsapp: true, sms: true, email: true, calendar: false },
              enquiry_created: { whatsapp: false, sms: false, email: true, calendar: false },
              demo_scheduled: { whatsapp: true, sms: false, email: true, calendar: true },
              status_updated: { whatsapp: false, sms: false, email: true, calendar: false }
            },
            dirty: false
          },
          activityLogs: {
            state: 'loaded',
            items: [
              { id: 1, title: 'WhatsApp test message sent', desc: 'Delivered to +91 98765 43210 via webhook', severity: 'success', icon: 'check_circle', time: '2 min ago' },
              { id: 2, title: 'Google Calendar synced', desc: '14 events pushed, 3 events pulled from primary', severity: 'success', icon: 'sync', time: '12 min ago' },
              { id: 3, title: 'Meet link generated', desc: 'For demo class with Aditi Rao (English Lit.)', severity: 'info', icon: 'videocam', time: '38 min ago' },
              { id: 4, title: 'OAuth token refreshed', desc: 'Google Calendar token auto-rotated', severity: 'info', icon: 'autorenew', time: '2 hours ago' },
              { id: 5, title: 'Webhook delivery failed', desc: 'Retry succeeded on attempt 2/3', severity: 'warning', icon: 'warning', time: 'Yesterday' },
              { id: 6, title: 'Google Calendar connected', desc: 'admissions@stmarys.edu.in linked by Principal Sharma', severity: 'success', icon: 'link', time: '3 days ago' },
              { id: 7, title: 'Token expired', desc: 'WhatsApp Business API token rotation required', severity: 'error', icon: 'error', time: '6 days ago' }
            ]
          },
          scheduling: {
            state: 'idle',
            days: {
              mon: { enabled: true,  expanded: true,  slots: mkSlots(true)  },
              tue: { enabled: true,  expanded: false, slots: mkSlots(true)  },
              wed: { enabled: true,  expanded: false, slots: mkSlots(true)  },
              thu: { enabled: true,  expanded: false, slots: mkSlots(true)  },
              fri: { enabled: true,  expanded: false, slots: mkSlots(true)  },
              sat: { enabled: true,  expanded: false, slots: mkSlots(false) },
              sun: { enabled: false, expanded: false, slots: mkSlots(false) }
            },
            blockedDates: [
              { id: 'blk-1', date: '2026-08-15', reason: 'Independence Day' },
              { id: 'blk-2', date: '2026-10-02', reason: 'Gandhi Jayanti' }
            ],
            newBlockDate: '',
            newBlockReason: '',
            dirty: false
          }
        },

        notificationChannels: [
          { id: 'whatsapp', label: 'WhatsApp', icon: 'chat' },
          { id: 'sms',      label: 'SMS',      icon: 'sms' },
          { id: 'email',    label: 'Email',    icon: 'mail' },
          { id: 'calendar', label: 'Calendar', icon: 'event' }
        ],
        notificationEvents: [
          { id: 'interview_scheduled',   label: 'Interview scheduled',   desc: 'Notify candidate when an interview is set.' },
          { id: 'interview_rescheduled', label: 'Interview rescheduled', desc: 'Send updated date and time.' },
          { id: 'interview_cancelled',   label: 'Interview cancelled',   desc: 'Inform candidate the slot has been cancelled.' },
          { id: 'enquiry_created',       label: 'Enquiry created',       desc: 'Acknowledge parents when an enquiry comes in.' },
          { id: 'demo_scheduled',        label: 'Demo class scheduled',  desc: 'Send class details and Meet link if applicable.' },
          { id: 'status_updated',        label: 'Status updated',        desc: 'Status change in admissions or hiring pipeline.' }
        ],

        dayList: [
          { key: 'mon', label: 'Monday',    short: 'Mon' },
          { key: 'tue', label: 'Tuesday',   short: 'Tue' },
          { key: 'wed', label: 'Wednesday', short: 'Wed' },
          { key: 'thu', label: 'Thursday',  short: 'Thu' },
          { key: 'fri', label: 'Friday',    short: 'Fri' },
          { key: 'sat', label: 'Saturday',  short: 'Sat' },
          { key: 'sun', label: 'Sunday',    short: 'Sun' }
        ],

        whatsappSteps: [
          { title: 'Create WhatsApp Business account', desc: 'Set up a Meta Business account and add WhatsApp as a product. Use your school’s registered business details.' },
          { title: 'Configure provider', desc: 'Choose your Business Solution Provider (BSP) or use Cloud API directly. Note your Phone Number ID.' },
          { title: 'Verify number', desc: 'Complete Meta’s number verification by OTP. May take up to a few hours.' },
          { title: 'Setup webhook', desc: 'Point Meta to the webhook URL above and verify with the token. We’ll respond automatically to the handshake.' },
          { title: 'Send test message', desc: 'Send a template message to your own number to confirm delivery.' }
        ],
        calendarSteps: [
          { title: 'Create Google Cloud project', desc: 'In console.cloud.google.com, create a project named “Superschools CRM”.' },
          { title: 'Enable Calendar API', desc: 'In APIs & Services, enable Google Calendar API for the project.' },
          { title: 'Configure OAuth consent', desc: 'Add admissions@stmarys.edu.in as a test user and the required scopes.' },
          { title: 'Connect Google account', desc: 'Click “Connect Google account” and choose the school admin account.' },
          { title: 'Grant permissions', desc: 'Approve read/write access to your primary calendar.' },
          { title: 'Test calendar sync', desc: 'Create a sample event from the CRM and confirm it appears on Google Calendar.' }
        ],

        /* ----- Computed: WhatsApp status presentation ----- */
        get whatsappStatusLabel() {
          return ({ disconnected:'Disconnected', connecting:'Connecting…', verification_pending:'Verification pending', invalid_creds:'Invalid credentials', connected:'Connected', webhook_failed:'Webhook failed', reconnect_required:'Reconnect required' })[this.config.whatsapp.state] || '—';
        },
        get whatsappBadgeClass() {
          const s = this.config.whatsapp.state;
          if (s==='connected') return 'bg-emerald-50 text-emerald-700';
          if (s==='connecting' || s==='verification_pending') return 'bg-amber-50 text-amber-700';
          if (s==='disconnected') return 'bg-slate-100 text-slate-600';
          return 'bg-rose-50 text-rose-700';
        },
        get whatsappDotColor() {
          const s = this.config.whatsapp.state;
          if (s==='connected') return '#10B981';
          if (s==='connecting' || s==='verification_pending') return '#D97706';
          if (s==='disconnected') return '#94A3B8';
          return '#E11D48';
        },
        get whatsappDotClass() {
          return ['connecting','verification_pending','reconnect_required'].includes(this.config.whatsapp.state) ? 'is-pulse' : '';
        },
        get whatsappBannerTitle() {
          return ({ invalid_creds:'Invalid API token', webhook_failed:'Webhook verification failed', reconnect_required:'Reconnect required' })[this.config.whatsapp.state] || '';
        },
        get whatsappBannerDesc() {
          return ({
            invalid_creds: 'The API token was rejected by Meta. Generate a fresh permanent token and paste it below.',
            webhook_failed: 'Meta couldn’t reach our webhook URL during the handshake. Verify the URL is reachable and retry.',
            reconnect_required: 'Your WhatsApp session has expired. Reconnect to resume sending messages.'
          })[this.config.whatsapp.state] || '';
        },

        /* ----- Computed: Calendar status presentation ----- */
        get calendarStatusLabel() {
          return ({ disconnected:'Disconnected', oauth_loading:'Opening Google…', syncing:'Syncing', connected:'Connected', permission_denied:'Permission denied', token_expired:'Token expired', reconnect_required:'Reconnect required', sync_failed:'Sync failed' })[this.config.calendar.state] || '—';
        },
        get calendarBadgeClass() {
          const s = this.config.calendar.state;
          if (s==='connected') return 'bg-emerald-50 text-emerald-700';
          if (s==='syncing' || s==='oauth_loading') return 'bg-blue-50 text-blue-700';
          if (s==='disconnected') return 'bg-slate-100 text-slate-600';
          return 'bg-rose-50 text-rose-700';
        },
        get calendarDotColor() {
          const s = this.config.calendar.state;
          if (s==='connected') return '#10B981';
          if (s==='syncing' || s==='oauth_loading') return '#2563EB';
          if (s==='disconnected') return '#94A3B8';
          return '#E11D48';
        },
        get calendarDotClass() {
          return ['syncing','oauth_loading'].includes(this.config.calendar.state) ? 'is-pulse' : '';
        },
        get calendarBannerTitle() {
          return ({ permission_denied:'Permission denied', token_expired:'Access token expired', reconnect_required:'Reconnect required', sync_failed:'Calendar sync failed' })[this.config.calendar.state] || '';
        },
        get calendarBannerDesc() {
          return ({
            permission_denied: 'The Google account didn’t grant Calendar access. Reconnect and approve all requested scopes.',
            token_expired: 'Your OAuth token has expired. Reconnect the account to refresh access.',
            reconnect_required: 'Google revoked the active session. Reconnect to resume syncing.',
            sync_failed: 'The last sync attempt failed. Retry now, or check the activity logs for details.'
          })[this.config.calendar.state] || '';
        },

        /* ----- Computed: Meet status presentation ----- */
        get meetDisabled() {
          return this.config.meet.state === 'calendar_disconnected'
              || ['disconnected','token_expired','reconnect_required','permission_denied'].includes(this.config.calendar.state);
        },
        get meetStatusLabel() {
          if (this.meetDisabled && this.config.meet.state !== 'generating') return 'Unavailable';
          return ({ available:'Ready', generating:'Generating…', generation_failed:'Generation failed', calendar_disconnected:'Unavailable' })[this.config.meet.state] || '—';
        },
        get meetBadgeClass() {
          if (this.meetDisabled) return 'bg-slate-100 text-slate-600';
          if (this.config.meet.state==='generating') return 'bg-blue-50 text-blue-700';
          if (this.config.meet.state==='generation_failed') return 'bg-rose-50 text-rose-700';
          return 'bg-emerald-50 text-emerald-700';
        },
        get meetDotColor() {
          if (this.meetDisabled) return '#94A3B8';
          if (this.config.meet.state==='generating') return '#2563EB';
          if (this.config.meet.state==='generation_failed') return '#E11D48';
          return '#10B981';
        },
        get meetDotClass() {
          return this.config.meet.state==='generating' ? 'is-pulse' : '';
        },

        /* ----- Toast helpers ----- */
        pushToast(type, title, desc) {
          const id = ++this.config._toastSeq;
          this.config.toasts.push({ id, type, title, desc: desc || '' });
          setTimeout(() => this.dismissToast(id), 4200);
        },
        dismissToast(id) {
          this.config.toasts = this.config.toasts.filter(t => t.id !== id);
        },

        /* ----- WhatsApp actions ----- */
        connectWhatsApp() {
          this.config.whatsapp.state = 'connecting';
          setTimeout(() => {
            this.config.whatsapp.state = 'verification_pending';
            this.config.whatsapp.completed = [true, true, true, false, false];
            this.pushToast('info', 'WhatsApp connecting', 'Awaiting Meta verification.');
            setTimeout(() => {
              if (this.config.whatsapp.state === 'verification_pending') {
                this.config.whatsapp.state = 'connected';
                this.config.whatsapp.completed = [true, true, true, true, false];
                this.pushToast('success', 'WhatsApp connected', 'You can now send messages from the CRM.');
              }
            }, 1800);
          }, 900);
        },
        disconnectWhatsApp() {
          this.config.whatsapp.state = 'disconnected';
          this.config.whatsapp.completed = [false, false, false, false, false];
          this.pushToast('info', 'WhatsApp disconnected');
        },
        sendWhatsAppTest() {
          this.config.whatsapp.sendingTest = true;
          this.config.whatsapp.testResult = null;
          setTimeout(() => {
            this.config.whatsapp.sendingTest = false;
            this.config.whatsapp.testResult = 'success';
            this.config.whatsapp.completed = [true, true, true, true, true];
            this.pushToast('success', 'Test message delivered');
            setTimeout(() => { this.config.whatsapp.testResult = null; }, 4000);
          }, 1100);
        },

        /* ----- Calendar actions ----- */
        connectCalendar() {
          this.config.calendar.state = 'oauth_loading';
          this.pushToast('info', 'Opening Google sign-in');
          setTimeout(() => {
            this.config.calendar.state = 'syncing';
            setTimeout(() => {
              this.config.calendar.state = 'connected';
              this.config.calendar.lastSynced = 'just now';
              this.config.calendar.completed = [true, true, true, true, true, true];
              this.pushToast('success', 'Google Calendar connected');
            }, 1400);
          }, 1100);
        },
        disconnectCalendar() {
          this.config.calendar.state = 'disconnected';
          this.pushToast('info', 'Google Calendar disconnected');
        },
        syncCalendar() {
          if (this.config.calendar.state === 'syncing') return;
          const prev = this.config.calendar.state;
          this.config.calendar.state = 'syncing';
          setTimeout(() => {
            this.config.calendar.state = 'connected';
            this.config.calendar.lastSynced = 'just now';
            this.pushToast('success', 'Calendar synced', '17 events checked, all up to date.');
          }, 1200);
        },

        /* ----- Meet actions ----- */
        generateMeetLink() {
          if (this.meetDisabled) return;
          this.config.meet.state = 'generating';
          setTimeout(() => {
            const code = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
            this.config.meet.generatedLink = 'https://meet.google.com/' + code;
            this.config.meet.state = 'available';
            this.pushToast('success', 'Meet link generated');
          }, 1000);
        },
        copyMeetLink() {
          if (this.meetDisabled) return;
          this.copy(this.config.meet.generatedLink, 'Meet link copied');
          this.config.meet.copied = true;
          setTimeout(() => { this.config.meet.copied = false; }, 1800);
        },
        copy(text, message) {
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text);
          } catch (_) { /* no-op for simulation */ }
          this.pushToast('success', message || 'Copied to clipboard');
        },

        /* ----- Notification actions ----- */
        toggleNotifChannel(ch) {
          if (ch === 'whatsapp' && this.config.whatsapp.state !== 'connected') {
            this.pushToast('error', 'WhatsApp not connected', 'Connect WhatsApp before enabling this channel.');
            return;
          }
          this.config.notifications.channels[ch] = !this.config.notifications.channels[ch];
          this.config.notifications.dirty = true;
          this.config.notifications.state = 'idle';
        },
        toggleNotifEvent(evId, ch) {
          if (!this.config.notifications.channels[ch]) return;
          if (ch === 'whatsapp' && this.config.whatsapp.state !== 'connected') return;
          this.config.notifications.events[evId][ch] = !this.config.notifications.events[evId][ch];
          this.config.notifications.dirty = true;
          this.config.notifications.state = 'idle';
        },
        saveNotifications() {
          if (!this.config.notifications.dirty) return;
          this.config.notifications.state = 'saving';
          setTimeout(() => {
            // Simulate occasional failure (~15%)
            if (Math.random() < 0.15) {
              this.config.notifications.state = 'save_failed';
              this.pushToast('error', 'Couldn’t save preferences', 'Network error — please retry.');
            } else {
              this.config.notifications.state = 'saved';
              this.config.notifications.dirty = false;
              this.pushToast('success', 'Notification preferences saved');
            }
          }, 900);
        },
        resetNotifications() {
          this.config.notifications.channels = { whatsapp: true, sms: false, email: true, calendar: true };
          this.config.notifications.events = {
            interview_scheduled: { whatsapp: true, sms: false, email: true, calendar: true },
            interview_rescheduled: { whatsapp: true, sms: false, email: true, calendar: true },
            interview_cancelled: { whatsapp: true, sms: true, email: true, calendar: false },
            enquiry_created: { whatsapp: false, sms: false, email: true, calendar: false },
            demo_scheduled: { whatsapp: true, sms: false, email: true, calendar: true },
            status_updated: { whatsapp: false, sms: false, email: true, calendar: false }
          };
          this.config.notifications.dirty = false;
          this.config.notifications.state = 'idle';
          this.pushToast('info', 'Changes discarded');
        },

        /* ----- Visit Slots actions (fixed hourly slots) ----- */
        markSchedulingDirty() {
          this.config.scheduling.dirty = true;
          if (this.config.scheduling.state !== 'saving') this.config.scheduling.state = 'idle';
        },
        slotLabel(hh) {
          const per = (x) => (x < 12 ? 'AM' : 'PM');
          const h12 = (x) => { const v = x % 12; return v === 0 ? 12 : v; };
          if (per(hh) === per(hh + 1)) return h12(hh) + ' \u2013 ' + h12(hh + 1) + ' ' + per(hh + 1);
          return h12(hh) + ' ' + per(hh) + ' \u2013 ' + h12(hh + 1) + ' ' + per(hh + 1);
        },
        toggleExpand(dayKey) {
          // Accordion only — open/close the slots panel. Does NOT change enabled state.
          const day = this.config.scheduling.days[dayKey];
          if (!day) return;
          day.expanded = !day.expanded;
        },
        toggleDay(dayKey) {
          // Checkbox only — open/close the day for visits. Reveals slots when turned on.
          const day = this.config.scheduling.days[dayKey];
          if (!day) return;
          day.enabled = !day.enabled;
          if (day.enabled) day.expanded = true;
          this.markSchedulingDirty();
        },
        toggleSlot(dayKey, hh) {
          const day = this.config.scheduling.days[dayKey];
          if (!day || !day.enabled) return;
          const slot = day.slots.find(s => s.h === hh);
          if (!slot) return;
          slot.on = !slot.on;
          this.markSchedulingDirty();
        },
        adjustMax(dayKey, hh, delta) {
          const day = this.config.scheduling.days[dayKey];
          if (!day) return;
          const slot = day.slots.find(s => s.h === hh);
          if (!slot || !slot.on) return;
          const next = slot.max + delta;
          if (next < 2 || next > 10) return; // min 2, max 10
          slot.max = next;
          this.markSchedulingDirty();
        },
        activeSlotCount(dayKey) {
          const day = this.config.scheduling.days[dayKey];
          if (!day) return 0;
          return day.slots.filter(s => s.on).length;
        },
        applyMondayToAll() {
          const mon = this.config.scheduling.days.mon;
          if (!mon || !mon.enabled) { this.pushToast('info', 'Enable Monday first'); return; }
          this.dayList.forEach(d => {
            if (d.key === 'mon') return;
            const day = this.config.scheduling.days[d.key];
            if (!day.enabled) return; // only the open days
            day.slots = mon.slots.map(s => ({ h: s.h, on: s.on, max: s.max }));
          });
          this.markSchedulingDirty();
          this.pushToast('success', 'Successfully applied to all days');
        },
        addBlockedDate() {
          const d = this.config.scheduling.newBlockDate;
          if (!d) return;
          if (this.config.scheduling.blockedDates.some(b => b.date === d)) {
            this.pushToast('info', 'That date is already blocked');
            return;
          }
          const id = 'blk-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 5);
          this.config.scheduling.blockedDates.push({ id, date: d, reason: (this.config.scheduling.newBlockReason || '').trim() });
          this.config.scheduling.blockedDates.sort((a, b) => a.date.localeCompare(b.date));
          this.config.scheduling.newBlockDate = '';
          this.config.scheduling.newBlockReason = '';
          this.markSchedulingDirty();
        },
        removeBlockedDate(id) {
          this.config.scheduling.blockedDates = this.config.scheduling.blockedDates.filter(b => b.id !== id);
          this.markSchedulingDirty();
        },
        formatBlockDate(iso) {
          if (!iso) return '';
          const p = String(iso).split('-').map(Number);
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          return p[2] + ' ' + (months[p[1] - 1] || '') + ' ' + p[0];
        },
        saveScheduling() {
          if (!this.config.scheduling.dirty) return;
          this.config.scheduling.state = 'saving';
          setTimeout(() => {
            if (Math.random() < 0.12) {
              this.config.scheduling.state = 'save_failed';
              this.pushToast('error', 'Couldn\u2019t save slots', 'Network error \u2014 please retry.');
            } else {
              this.config.scheduling.state = 'saved';
              this.config.scheduling.dirty = false;
              this.pushToast('success', 'Visit slots updated successfully');
            }
          }, 900);
        },
        resetScheduling() {
          const mk = (allOn) => { const o = []; for (let hh = 9; hh <= 16; hh++) o.push({ h: hh, on: allOn, max: 2 }); return o; };
          this.config.scheduling.days = {
            mon: { enabled: true,  expanded: true,  slots: mk(true)  },
            tue: { enabled: true,  expanded: false, slots: mk(true)  },
            wed: { enabled: true,  expanded: false, slots: mk(true)  },
            thu: { enabled: true,  expanded: false, slots: mk(true)  },
            fri: { enabled: true,  expanded: false, slots: mk(true)  },
            sat: { enabled: true,  expanded: false, slots: mk(false) },
            sun: { enabled: false, expanded: false, slots: mk(false) }
          };
          this.config.scheduling.blockedDates = [
            { id: 'blk-1', date: '2026-08-15', reason: 'Independence Day' },
            { id: 'blk-2', date: '2026-10-02', reason: 'Gandhi Jayanti' }
          ];
          this.config.scheduling.newBlockDate = '';
          this.config.scheduling.newBlockReason = '';
          this.config.scheduling.dirty = false;
          this.config.scheduling.state = 'idle';
          this.pushToast('info', 'Changes discarded');
        },

        /* ----- Scheduling: computed values ----- */
        get enabledDaysCount() {
          return Object.values(this.config.scheduling.days).filter(d => d.enabled).length;
        },
        get schedulingSynced() {
          // Disable "Copy Monday" when Monday is off, there are no other open days,
          // or every other open day already matches Monday's hourly on/off + max config.
          const mon = this.config.scheduling.days.mon;
          if (!mon || !mon.enabled) return true;
          const sig = (day) => day.slots.map(s => s.h + ':' + (s.on ? 1 : 0) + ':' + s.max).join('|');
          const monSig = sig(mon);
          const others = this.dayList.filter(d => d.key !== 'mon' && this.config.scheduling.days[d.key].enabled);
          if (others.length === 0) return true;
          return others.every(d => sig(this.config.scheduling.days[d.key]) === monSig);
        },
        get todayISO() {
          const d = new Date();
          return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        },

        /* ----- Activity log actions ----- */
        reloadLogs() {
          const prev = this.config.activityLogs.state;
          this.config.activityLogs.state = 'loading';
          setTimeout(() => {
            this.config.activityLogs.state = 'loaded';
          }, 900);
        },
        logIconBg(sev) {
          return ({ success: 'bg-emerald-50', info: 'bg-blue-50', warning: 'bg-amber-50', error: 'bg-rose-50' })[sev] || 'bg-slate-50';
        },
        logIconColor(sev) {
          return ({ success: 'text-emerald-600', info: 'text-blue-600', warning: 'text-amber-600', error: 'text-rose-600' })[sev] || 'text-slate-500';
        },
        logBadgeClass(sev) {
          return ({ success: 'bg-emerald-50 text-emerald-700', info: 'bg-blue-50 text-blue-700', warning: 'bg-amber-50 text-amber-700', error: 'bg-rose-50 text-rose-700' })[sev] || 'bg-slate-100 text-slate-600';
        },
        get admissionPendingTotal() { return this.admissionPendingStatuses.reduce((sum, item) => sum + item.count, 0); },
        get jobPendingTotal() { return this.jobPendingStatuses.reduce((sum, item) => sum + item.count, 0); },
        get currentPage() {
          return this.menuItems.find(item => item.id === this.activePage) || this.menuItems[1];
        },
        // Sub-modules of the active main module — rendered as the top-nav tabs.
        get currentSubModules() {
          return this.subModules[this.activePage] || [];
        },
        get mobileMenuItems() {
          return this.menuItems;
        },
        get isFullScreenPage() {
          // The top navigation bar is now global: every page (including Super CRM
          // and Super HR) uses the same sidebar + tab header, so no page is fullscreen.
          return false;
        },
        get navIconClass() {
          // Utility icon buttons adapt to the header background (white when open, blue when collapsed).
          return this.sidebarCollapsed
            ? 'border-white/30 text-white hover:bg-white/10 hover:border-white/60'
            : 'border-slate-200 text-slate-500 hover:text-primary hover:border-primary/40 hover:bg-slate-50';
        },
        get filteredCandidates() {
          const query = this.search.trim().toLowerCase();
          if (!query) return this.candidates;
          return this.candidates.filter(candidate => [candidate.name, candidate.degree, candidate.specialization, candidate.status].join(' ').toLowerCase().includes(query));
        },
        // Sidebar / mobile-nav / breadcrumbs: jump to a MAIN module. Lands on
        // that module's first sub-module page (its "home").
        setPage(moduleId) {
          const url = moduleHome(moduleId);
          if (url) {
            if (window.__routeLoader) window.__routeLoader.show();
            window.location.href = url;
          }
        },
        // Top nav bar: jump to a specific SUB-module page within the active module.
        // (Clicking the already-active tab is a no-op — no needless reload.)
        goSub(sub) {
          if (sub && sub.url && sub.id !== this.activeSub) {
            if (window.__routeLoader) window.__routeLoader.show();
            window.location.href = sub.url;
          }
        },
        socialStatusClass(status) {
          const map = {
            Published: 'bg-emerald-50 text-emerald-700',
            Scheduled: 'bg-blue-50 text-blue-700',
            Draft: 'bg-slate-100 text-slate-600'
          };
          return map[status] || 'bg-slate-100 text-slate-600';
        },
        goBack() {
          this.activePage = this.previousPage && this.previousPage !== this.activePage ? this.previousPage : 'school';
          this.previousPage = 'school';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => { renderDashboardSidePyramids(); renderFunnels(); renderMobilePies(); }, 0);
        },
        // --- Sidebar collapse / expand / hover-peek ---
        collapseSidebar() {
          clearTimeout(this.peekTimer);
          this.sidebarCollapsed = true;
          this.sidebarPeek = false;
          try { localStorage.setItem('ssSidebarCollapsed', '1'); } catch (e) {}
          // Block the phantom hover-open that fires when the top-nav toggle
          // appears under the cursor right after the sidebar closes.
          this.peekBlockUntil = Date.now() + 450;
        },
        expandSidebar() {
          clearTimeout(this.peekTimer);
          this.sidebarCollapsed = false;
          this.sidebarPeek = false;
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
        },
        statusClass(status) {
          const map = {
            'Visit Scheduled': 'bg-violet-50 text-violet-700',
            'Interested': 'bg-blue-50 text-blue-700',
            'Needs Information': 'bg-amber-50 text-amber-700',
            'Application Received': 'bg-emerald-50 text-emerald-700',
            'Not Reachable': 'bg-slate-100 text-slate-600'
          };
          return map[status] || 'bg-slate-100 text-slate-600';
        },
        qualityClass(quality) {
          const map = {
            Hot: 'bg-red-50 text-red-700',
            Warm: 'bg-orange-50 text-orange-700',
            Cold: 'bg-slate-100 text-slate-600'
          };
          return map[quality] || 'bg-slate-100 text-slate-600';
        }
      };
    }