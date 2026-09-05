/* =====================================================================
   navigation.js — the app's route / navigation model (single source of truth)
   ---------------------------------------------------------------------
   - LEFT SIDEBAR = the main modules (SSNav.menuItems).
   - TOP NAV BAR  = the sub-modules of the active module (SSNav.subModules[id]).
   Every sub-module is its own page; `url` is written relative to any
   pages/<module-folder>/ directory (sibling folders share depth).

   In a Next.js port this is a plain config module imported by the root
   layout + the Sidebar/TopNav components. For the vanilla build it is
   exposed as window.SSNav and consumed by lib/store.js + components/.
   ===================================================================== */
(function () {
  'use strict';

  var subModules = {
    school: [
      { id: 'school', label: 'My School', url: '../super-school/school.html' }
    ],
    admissions: [
      { id: 'admissions', label: 'Admissions', url: '../super-crm/crm.html' },
      { id: 'enquiries',  label: 'Enquiries',  url: '../super-crm/enquiries.html' },
      { id: 'detail',     label: 'Detail',     url: '../super-crm/workflow.html' }
    ],
    jobs: [
      { id: 'jobs',             label: 'Jobs',              url: '../super-hr/hr.html' },
      { id: 'applications',     label: 'Applications',      url: '../super-hr/applications.html' },
      { id: 'applicantDetails', label: 'Applicant Details', url: '../super-hr/applicant-details.html' }
    ],
    community: [
      { id: 'community', label: 'My Community', url: '../super-community/community.html' }
    ],
    social: [
      { id: 'social', label: 'My Social', url: '../super-social/social.html' }
    ],
    settings: [
      { id: 'settings', label: 'My Settings', url: '../settings/settings.html' }
    ]
  };

  // The sidebar lands you on a module's first sub-module page ("module home").
  function moduleHome(moduleId) {
    var subs = subModules[moduleId];
    return (subs && subs[0]) ? subs[0].url : '../super-school/school.html';
  }

  var menuItems = [
    { id: 'school', label: 'Super School', icon: 'apartment', title: 'Super School', subtitle: 'School profile, performance, and operating status' },
    { id: 'admissions', label: 'Super CRM', icon: 'school', title: 'Super CRM', subtitle: 'Parent enquiries, visits, follow-ups, and conversion pipeline' },
    { id: 'jobs', label: 'Super HR', icon: 'work', title: 'Super HR', subtitle: 'Teacher applications, interviews, demos, and hiring funnel' },
    { id: 'community', label: 'Super Community', icon: 'groups', title: 'Super Community', subtitle: 'Parent engagement, announcements, and school events' },
    { id: 'social', label: 'Super Social', icon: 'share', title: 'Super Social', subtitle: 'Social media management for your school' },
    { id: 'settings', label: 'Settings', icon: 'settings', title: 'Settings', subtitle: 'Console preferences and CRM configuration' }
  ];

  window.SSNav = { menuItems: menuItems, subModules: subModules, moduleHome: moduleHome };
})();
