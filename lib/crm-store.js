/* =====================================================================
   crm-store.js — the SINGLE shared data store for the Super CRM module.
   ---------------------------------------------------------------------
   One source of truth for ENQUIRIES, STAFF (the "My Team" directory) and
   visit BOOKINGS, persisted in localStorage and shared by every Super CRM
   sub-module (My Workspace, Dashboard, Enquiries, Enquiry detail, Visits,
   Bookings) plus the Super Schools "My Team" page. Pages read their data
   through shape-specific ADAPTER getters (so each page keeps its own render
   shape) and route every create/edit/status-change through this store, so a
   change in one sub-module shows up in all the others.

   Derived views (Dashboard funnel/sources/staff-conversion/lost-reasons,
   My Workspace queues, staff metrics) are COMPUTED from the same enquiries —
   nothing is hand-aggregated. The store seeds itself once, can be reset to
   the seed, or cleared to EMPTY (so every page's empty→data lifecycle works).

   API (window.CRM):
     today()                              fixed reference date 'YYYY-MM-DD'
     isEmpty()                            true when there are no enquiries & no staff
     reset() / clearAll() / seedDemo()    lifecycle (reseed / empty / fill)
     onChange(fn) / offChange(fn)         subscribe to any mutation
     // staff
     staff() staffActive() staffById(id) staffByName(n) staffNames() staffDirectory()
     addStaff(p) updateStaff(id,p) removeStaff(id, reassignToId|null) setStaff(arr)
     staffMembers()                       My-Team-shaped, metrics derived from enquiries
     // enquiries
     enquiries() enquiry(id) addEnquiry(p) updateEnquiry(id,p) setEnquiryStatus(id,st)
     enquiriesAsRows()                    Enquiries-list shape (n,p,s,d,st,...)
     enquiryDetail(id)                    Detail-page view of one enquiry
     // derived
     dashboardData(period)                {funnel,sources,lost,staff} for a period
     workspaceRecords() workspaceOps()    My Work records + OPS overlay
     workspaceTargets(staffName)          daily target tuples
     // bookings
     bookings() addBooking(p) updateBooking(id,p)
   ===================================================================== */
(function () {
  'use strict';

  var KEY = 'ss_crm_store_v1';
  var TODAY = '2026-06-05';                 // single reference "today" for the whole module
  var LISTENERS = [];

  // ── date helpers (all local 'YYYY-MM-DD', no UTC drift) ──────────────
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function parseISO(iso) { var p = String(iso).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmtISO(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function isoMinus(days) { var d = parseISO(TODAY); d.setDate(d.getDate() - days); return fmtISO(d); }
  function isoPlus(days) { return isoMinus(-days); }
  function dayDiff(isoA, isoB) { return Math.round((parseISO(isoA) - parseISO(isoB)) / 86400000); }
  function toDMY(iso) { var p = String(iso).split('-'); return p[2] + '-' + p[1] + '-' + p[0]; }
  function initials(name) { return String(name || '').trim().split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase(); }
  function uid(prefix) { return (prefix || 'X') + Math.random().toString(36).slice(2, 9); }

  var AV_COLORS = ['bg-amber-400', 'bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-teal-500', 'bg-purple-500', 'bg-indigo-500', 'bg-orange-500', 'bg-rose-500', 'bg-cyan-500'];
  function avColor(i) { return AV_COLORS[i % AV_COLORS.length]; }
  function distBucketOf(km) { return km <= 5 ? '0-5 Km' : km <= 10 ? '5-10 Km' : km <= 20 ? '10-20 Km' : '20+ Km'; }
  function travelOf(km) { return km <= 2 ? 'Within 2 km' : km <= 5 ? 'Within 5 km' : km <= 10 ? 'Within 10 km' : km <= 15 ? 'Within 15 km' : 'More than 15 km'; }

  // ── canonical vocabularies ──────────────────────────────────────────
  var STATUSES = ['New Enquiry', 'Contacted', 'Visit / Revisit Scheduled', 'Visit Completed', 'Application Pending', 'Admission Confirmed', 'Closed'];
  var FUNNEL = [
    { label: 'New Enquiry', from: ['New Enquiry'], color: '#7DB7FF' },
    { label: 'Contacted', from: ['Contacted'], color: '#A58AF2' },
    { label: 'Visit / Revisit Scheduled', from: ['Visit / Revisit Scheduled'], color: '#F2B24E' },
    { label: 'Visit Completed', from: ['Visit Completed'], color: '#5BC8D6' },
    { label: 'Application Pending', from: ['Application Pending'], color: '#E6C944' },
    { label: 'Closed', from: ['Closed'], color: '#EC7F7F' },
    { label: 'Admitted Closed', from: ['Admission Confirmed'], color: '#5FD48C' }
  ];
  var SOURCE_COLORS = {
    'SuperSchools': '#4259AC', 'School Website': '#F4A93C', 'Walk-in': '#8E97A6', 'Phone Call': '#0E7490',
    'WhatsApp': '#25D366', 'Referral': '#B255C2', 'Facebook': '#5B9BD5', 'Instagram': '#57BB63',
    'Google Search': '#E8554E', 'Education Fair': '#1FC7B6', 'Offline Campaign': '#C2410C', 'Other': '#94A3B8'
  };
  var LOST_REASONS = ['Not interested', 'Chose another school', 'Fees too high', 'Location issues', 'No response from parent', 'Duplicate enquiry'];
  var LOST_COLORS = ['#9f1239', '#be123c', '#e11d48', '#fb7185', '#fda4af', '#fecdd3'];
  var INTERESTS = ['Very Interested', 'Interested', 'Undecided', 'Not Interested'];
  var ROLES_LEAD = ['School Owner', 'Principal', 'Admissions Manager', 'Admissions Counsellor', 'Front Office'];

  // ── SEED ────────────────────────────────────────────────────────────
  function seedStaff() {
    var rows = [
      ['Ananya Sharma', 'Admissions Counsellor', '9845011001', 'Active', true],
      ['Rohit Kumar', 'Admissions Counsellor', '9845011002', 'Active', false],
      ['Priya Nair', 'Admissions Counsellor', '9845011003', 'Active', true],
      ['Kavya Reddy', 'Admissions Manager', '9845011004', 'Active', true],
      ['Arjun Mehta', 'Admissions Counsellor', '9845011005', 'Active', false],
      ['Ramya Krishnan', 'Admissions Manager', '9845011006', 'Active', true],
      ['Aditya Nair', 'Front Office', '9845011007', 'Active', true],
      ['Meera Pillai', 'Front Office', '9845011008', 'Active', true],
      ['Sneha Iyer', 'Academic Coordinator', '9845011009', 'Active', false],
      ['Karan Mehta', 'Principal', '9845011010', 'Active', false],
      ['Divya Menon', 'Marketing', '9845011011', 'Active', false],
      ['Imran Khan', 'Accounts', '9845011012', 'Inactive', false]
    ];
    return rows.map(function (r, i) {
      return {
        id: 'S' + pad(i + 1), name: r[0], role: r[1], mobile: r[2],
        email: r[0].toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/).join('.') + '@greenwoodschool.edu',
        status: r[3], isHost: !!r[4], lastActive: isoMinus(i % 7)
      };
    });
  }

  // compact enquiry spec:
  // [parent, child, mobile, status, source, assigneeIdx(0-4), interest, grade, area, age, curriculum, acadYear, distKm, dOff, op]
  // op (optional): {visit:[type,state,dOff], follow:[dOff,note], close:reasonIdx}
  function seedEnquiries() {
    var A = ['Ananya Sharma', 'Rohit Kumar', 'Priya Nair', 'Kavya Reddy', 'Arjun Mehta'];
    var S = STATUSES;
    var rows = [
      ['Rakesh Sharma', 'Aarav Sharma', '99808 33777', 0, 'SuperSchools', 0, 0, 'LKG', 'Indiranagar', '4-5 years', 'CBSE', '2026-27', 1.2, 0, { follow: [2, 'Send fee details, then call back'] }],
      ['Sunita Reddy', 'Anika Reddy', '94432 11875', 0, 'SuperSchools', 4, 2, 'LKG', 'Sarjapur Road', '4-5 years', 'CBSE', '2027-28', 3.1, 0, {}],
      ['Prakash Nair', 'Dhruv Nair', '96611 88234', 0, 'Referral', 0, 0, 'Grade 6-8', 'JP Nagar', '8-10 years', 'CBSE', '2027-28', 8.7, 0, {}],
      ['Rohan Kapoor', 'Aryan Kapoor', '94433 22110', 0, 'SuperSchools', 1, 0, 'Grade 6-8', 'Electronic City', '8-10 years', 'CBSE', '2027-28', 12.4, 1, {}],
      ['Divya Menon', 'Tara Menon', '93301 56478', 0, 'Instagram', 1, 1, 'Grade 1-5', 'Sadashivanagar', '6-8 years', 'ICSE', '2026-27', 6.4, 1, {}],
      ['Nisha Patel', 'Avni Patel', '98880 11223', 0, 'Facebook', 2, 2, 'Nursery', 'Banashankari', '2-3 years', 'Montessori', '2027-28', 5.6, 3, {}],
      ['Manish Rao', 'Arjun Rao', '97770 44556', 0, 'SuperSchools', 3, 0, 'Grade 11-12', 'Rajajinagar', '14-16 years', 'CBSE', '2026-27', 11.8, 4, {}],
      ['Priya Sharma', 'Ananya Sharma', '98765 43210', 1, 'Instagram', 1, 1, 'Grade 1-5', 'Koramangala', '6-8 years', 'ICSE', '2026-27', 4.2, 2, { follow: [0, 'Wanted fee structure — share brochure'] }],
      ['Karan Iyer', 'Diya Iyer', '95554 33221', 1, 'Walk-in', 0, 2, 'Nursery', 'Indiranagar', '2-3 years', 'Montessori', '2027-28', 0.8, 3, { follow: [2, 'Post-discussion decision check'] }],
      ['Sana Nair', 'Reyansh Nair', '91122 33445', 1, 'WhatsApp', 2, 1, 'UKG', 'Devanahalli', '4-5 years', 'ICSE', '2026-27', 21.6, 4, { follow: [-2, 'Called once, no answer — retry on WhatsApp'] }],
      ['Naveen Joshi', 'Aadhya Joshi', '96666 12345', 1, 'Phone Call', 2, 0, 'Grade 6-8', 'Marathahalli', '8-10 years', 'CBSE', '2027-28', 9.4, 6, {}],
      ['Suresh Pillai', 'Arnav Pillai', '91100 67234', 1, 'SuperSchools', 0, 2, 'Grade 6-8', 'Kengeri', '10-12 years', 'CBSE', '2027-28', 9.2, 8, { follow: [0, 'Discussed transport — confirm decision'] }],
      ['Sneha Rao', 'Vihaan Rao', '91234 56789', 2, 'School Website', 2, 2, 'Nursery', 'HSR Layout', '3-4 years', 'CBSE', '2027-28', 3.5, 9, { visit: ['Campus Tour', 'Confirmed', 0] }],
      ['Imran Das', 'Veer Das', '95555 67890', 2, 'Offline Campaign', 3, 1, 'Grade 9-10', 'Hebbal', '12-14 years', 'ICSE', '2026-27', 14.2, 10, { visit: ['Re-visit', 'Pending', 0] }],
      ['Anil Kapoor', 'Sara Kapoor', '93455 11882', 2, 'Referral', 4, 0, 'Grade 1-5', 'Whitefield', '6-8 years', 'IB', '2026-27', 7.1, 12, { visit: ['Campus Tour', 'Confirmed', 1] }],
      ['Geeta Rao', 'Nikhil Rao', '93311 22556', 2, 'Google Search', 1, 1, 'Grade 6-8', 'Bellandur', '10-12 years', 'CBSE', '2027-28', 6.8, 14, {}],
      ['Vikram Singh', 'Aanya Singh', '99887 76655', 3, 'Referral', 3, 0, 'Grade 6-8', 'Whitefield', '10-12 years', 'IB', '2026-27', 6.1, 16, { visit: ['Campus Tour', 'Visited', 2] }],
      ['Farah Khan', 'Zoya Khan', '97712 44556', 3, 'Education Fair', 0, 1, 'LKG', 'Frazer Town', '4-5 years', 'ICSE', '2026-27', 5.2, 18, {}],
      ['Deepak Joshi', 'Ria Joshi', '98220 33114', 3, 'SuperSchools', 2, 0, 'Grade 1-5', 'Jayanagar', '6-8 years', 'CBSE', '2026-27', 4.0, 22, {}],
      ['Arjun Mehta', 'Kiara Mehta', '93344 55667', 4, 'School Website', 3, 2, 'Grade 1-5', 'Bellandur', '6-8 years', 'CBSE', '2026-27', 7.2, 20, { follow: [-4, 'Application form pending — remind to submit'] }],
      ['Pooja Choudhary', 'Riya Choudhary', '92233 41566', 4, 'Phone Call', 4, 1, 'Grade 1-5', 'Vijayanagar', '5-6 years', 'CBSE', '2027-28', 4.3, 24, {}],
      ['Lakshmi Iyer', 'Aadya Iyer', '93120 55667', 4, 'Referral', 0, 0, 'Nursery', 'Malleshwaram', '3-4 years', 'CBSE', '2026-27', 3.3, 27, {}],
      ['Meera Gupta', 'Ishaan Gupta', '97788 99001', 5, 'Google Search', 4, 1, 'Grade 9-10', 'Jayanagar', '12-14 years', 'CBSE', '2026-27', 2.8, 28, {}],
      ['Kavita Khan', 'Aarush Khan', '98777 55555', 5, 'SuperSchools', 4, 0, 'Playgroup', 'BTM Layout', 'Below 2 years', 'Montessori', '2027-28', 4.8, 34, {}],
      ['Sanjay Verma', 'Myra Verma', '93388 11220', 5, 'Walk-in', 1, 0, 'Grade 1-5', 'Rajajinagar', '6-8 years', 'CBSE', '2026-27', 5.9, 41, {}],
      ['Ramesh Verma', 'Saanvi Verma', '93333 11111', 6, 'Referral', 0, 3, 'Grade 6-8', 'Yelahanka', '10-12 years', 'State Board', '2028-29', 18.6, 12, { close: 1 }],
      ['Zara Malik', 'Inaya Malik', '97777 44444', 6, 'Google Search', 1, 3, 'Grade 11-12', 'Sarjapur', '14-16 years', 'IGCSE', '2026-27', 22.3, 20, { close: 0 }],
      ['Mohan Das', 'Ira Das', '92210 88334', 6, 'WhatsApp', 2, 3, 'Grade 1-5', 'Hebbal', '6-8 years', 'ICSE', '2027-28', 16.4, 25, { close: 2 }]
    ];
    return rows.map(function (r, i) {
      var op = r[14] || {};
      var status = STATUSES[r[3]];
      var enquiryDate = isoMinus(r[13]);
      var visit = null, follow = null, closeReason = null;
      if (op.visit) visit = { type: op.visit[0], state: op.visit[1], date: isoPlus(op.visit[2]), time: '11:00 AM', host: null };
      if (op.follow) follow = { dueDate: isoPlus(op.follow[0]), note: op.follow[1] };
      if (typeof op.close === 'number') closeReason = LOST_REASONS[op.close];
      var km = r[12];
      return {
        id: String(i + 1), parentName: r[0], studentName: r[1], mobile: r[2], status: status,
        source: r[4], assignee: A[r[5]], parentInterest: INTERESTS[r[6]], gradeApplied: r[7], area: r[8],
        age: r[9], curriculum: r[10], acadYear: r[11], distanceKm: km, distanceBucket: distBucketOf(km),
        travelPref: travelOf(km), city: 'Bengaluru', gender: (i % 2 ? 'Female' : 'Male'),
        tourScheduled: visit ? 'Yes' : 'No', amenities: ['Transport', 'Daycare'].slice(0, (i % 3) + 1),
        initials: initials(r[0]), avatarColor: avColor(i), enquiryDate: enquiryDate,
        closeReason: closeReason, followUp: follow, visit: visit, notes: [], activity: []
      };
    });
  }

  function seedBookings(enq, staff) {
    // bookings are scheduled visits — link each to an enquiry that has a visit
    var hosts = staff.filter(function (s) { return s.isHost && s.status === 'Active'; }).map(function (s) { return s.name; });
    var withVisit = enq.filter(function (e) { return e.visit; });
    return withVisit.map(function (e, i) {
      var st = e.visit.state === 'Visited' ? 'completed' : e.visit.state === 'Confirmed' ? 'confirmed' : 'pending';
      return {
        id: 'VB-' + pad(i + 1), enquiryId: e.id, parentName: e.parentName, parentPhone: '91' + e.mobile.replace(/\D/g, ''),
        childName: e.studentName, childAge: parseFloat((e.age.match(/\d+/) || [4])[0]), admissionType: 'day school',
        date: e.visit.date, hour: 10 + (i % 5), status: st, parentNotes: '', adminNotes: '', communications: [],
        assignedTo: hosts[i % hosts.length] || 'Self', source: 'website', cancelReason: null,
        followUp: { required: false, dueDate: null, note: '', completed: false, completedAt: null },
        applicationSubmitted: false, isReturnVisitor: false, previousBookingId: null, bookedAt: e.enquiryDate + 'T09:00:00'
      };
    });
  }

  function buildSeed() {
    var staff = seedStaff();
    var enq = seedEnquiries();
    return { v: 1, staff: staff, enquiries: enq, bookings: seedBookings(enq, staff) };
  }

  // ── state + persistence ─────────────────────────────────────────────
  var state = load();

  function load() {
    try {
      var raw = (typeof localStorage !== 'undefined') && localStorage.getItem(KEY);
      if (raw) { var p = JSON.parse(raw); if (p && p.staff && p.enquiries) return p; }
    } catch (e) {}
    var seed = buildSeed();
    persist(seed);
    return seed;
  }
  function persist(s) {
    try { if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  function commit() {
    persist(state);
    for (var i = 0; i < LISTENERS.length; i++) { try { LISTENERS[i](state); } catch (e) {} }
    try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('crm:change')); } catch (e) {}
  }
  // cross-iframe: another sub-module wrote the store → reload + notify
  try {
    if (typeof window !== 'undefined') window.addEventListener('storage', function (e) {
      if (e.key === KEY && e.newValue) { try { state = JSON.parse(e.newValue); } catch (x) {} for (var i = 0; i < LISTENERS.length; i++) { try { LISTENERS[i](state); } catch (x) {} } }
    });
  } catch (e) {}

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // ── derived helpers ─────────────────────────────────────────────────
  function periodStart(period) {
    if (period === 'day') return TODAY;
    if (period === 'week') return isoMinus(6);
    return isoMinus(29); // month
  }
  function inPeriod(e, period) { return e.enquiryDate >= periodStart(period) && e.enquiryDate <= TODAY; }

  // ── public API ──────────────────────────────────────────────────────
  var CRM = {
    today: function () { return TODAY; },
    statuses: function () { return STATUSES.slice(); },
    lostReasons: function () { return LOST_REASONS.slice(); },
    interests: function () { return INTERESTS.slice(); },

    isEmpty: function () { return state.enquiries.length === 0 && state.staff.length === 0; },
    reset: function () { state = buildSeed(); commit(); },
    seedDemo: function () { if (state.enquiries.length === 0 && state.staff.length === 0) { state = buildSeed(); commit(); } },
    clearAll: function () { state = { v: 1, staff: [], enquiries: [], bookings: [] }; commit(); },
    onChange: function (fn) { if (typeof fn === 'function') LISTENERS.push(fn); },
    offChange: function (fn) { LISTENERS = LISTENERS.filter(function (f) { return f !== fn; }); },

    // ── STAFF ─────────────────────────────────────────────────────────
    staff: function () { return clone(state.staff); },
    staffActive: function () { return clone(state.staff.filter(function (s) { return s.status === 'Active'; })); },
    staffById: function (id) { var s = state.staff.find(function (x) { return x.id === id; }); return s ? clone(s) : null; },
    staffByName: function (n) { var s = state.staff.find(function (x) { return x.name === n; }); return s ? clone(s) : null; },
    staffNames: function () { return state.staff.filter(function (s) { return s.status === 'Active'; }).map(function (s) { return s.name; }); },
    staffDirectory: function () { return state.staff.filter(function (s) { return s.status === 'Active'; }).map(function (s) { return { name: s.name, role: s.role }; }); },
    setStaff: function (arr) { state.staff = clone(arr || []); commit(); },
    addStaff: function (p) {
      var s = { id: uid('S'), name: p.name, role: p.role || 'Viewer', mobile: p.mobile || '', email: p.email || '', status: p.status || 'Active', isHost: !!p.isHost, lastActive: TODAY };
      state.staff.unshift(s); commit(); return clone(s);
    },
    updateStaff: function (id, p) { var s = state.staff.find(function (x) { return x.id === id; }); if (s) { Object.keys(p || {}).forEach(function (k) { s[k] = p[k]; }); commit(); } return s ? clone(s) : null; },
    removeStaff: function (id, reassignToId) {
      var leaving = state.staff.find(function (x) { return x.id === id; });
      if (leaving && reassignToId) { var to = state.staff.find(function (x) { return x.id === reassignToId; }); if (to) state.enquiries.forEach(function (e) { if (e.assignee === leaving.name) e.assignee = to.name; }); }
      else if (leaving) { state.enquiries.forEach(function (e) { if (e.assignee === leaving.name) e.assignee = null; }); }
      state.staff = state.staff.filter(function (x) { return x.id !== id; }); commit();
    },
    // My-Team-shaped: metrics DERIVED from real enquiry assignments
    staffMembers: function () {
      var enq = state.enquiries;
      var period = function (mem, frac) {
        var leadsAll = enq.filter(function (e) { return e.assignee === mem.name; });
        var convAll = leadsAll.filter(function (e) { return e.status === 'Admission Confirmed'; });
        var leads = Math.round(leadsAll.length * frac), converted = Math.round(convAll.length * frac);
        return { leads: leads, converted: converted };
      };
      return state.staff.map(function (m) {
        var all = period(m, 1);
        return { id: m.id, name: m.name, role: m.role, mobile: m.mobile, email: m.email, status: m.status, lastActive: m.lastActive,
          metrics: { all: all, quarter: period(m, 0.6), month: period(m, 0.3) } };
      });
    },

    // ── ENQUIRIES ─────────────────────────────────────────────────────
    enquiries: function () { return clone(state.enquiries); },
    enquiry: function (id) { var e = state.enquiries.find(function (x) { return String(x.id) === String(id); }); return e ? clone(e) : null; },
    addEnquiry: function (p) {
      var km = +p.distanceKm || 0;
      var e = {
        id: uid('E'), parentName: p.parentName || p.n || '', studentName: p.studentName || p.s || '', mobile: p.mobile || p.p || '',
        status: p.status || p.st || 'New Enquiry', source: p.source || 'Other', assignee: p.assignee || null,
        parentInterest: p.parentInterest || p.pi || 'Undecided', gradeApplied: p.gradeApplied || '', area: p.area || '',
        age: p.age || p.e || '', curriculum: p.curriculum || '', acadYear: p.acadYear || '', distanceKm: km, distanceBucket: p.distanceBucket || distBucketOf(km),
        travelPref: p.travelPref || p.distanceTravel || travelOf(km), city: p.city || 'Bengaluru', gender: p.gender || '', tourScheduled: p.tourScheduled || 'No',
        amenities: p.amenities || [], initials: initials(p.parentName || p.n || ''), avatarColor: avColor(state.enquiries.length),
        enquiryDate: p.enquiryDate || TODAY, closeReason: p.closeReason || null, followUp: p.followUp || null, visit: p.visit || null, notes: [], activity: []
      };
      state.enquiries.unshift(e); commit(); return clone(e);
    },
    updateEnquiry: function (id, p) { var e = state.enquiries.find(function (x) { return String(x.id) === String(id); }); if (e) { Object.keys(p || {}).forEach(function (k) { e[k] = p[k]; }); commit(); } return e ? clone(e) : null; },
    removeEnquiry: function (id) { var n = state.enquiries.length; state.enquiries = state.enquiries.filter(function (x) { return String(x.id) !== String(id); }); state.bookings = state.bookings.filter(function (b) { return String(b.enquiryId) !== String(id); }); if (state.enquiries.length !== n) commit(); },
    setEnquiryStatus: function (id, st) { return CRM.updateEnquiry(id, { status: st }); },
    // Enquiries-list shape (the page's `applications` rows)
    enquiriesAsRows: function () {
      return state.enquiries.map(function (e) {
        return { id: e.id, n: e.parentName, p: e.mobile, s: e.studentName, d: toDMY(e.enquiryDate), e: e.age,
          dist: e.distanceKm + ' km', distBucket: e.distanceBucket, st: e.status, source: e.source, av: e.initials,
          gradeApplied: e.gradeApplied, acadYear: e.acadYear, curriculum: e.curriculum, city: e.city, area: e.area,
          gender: e.gender, tourScheduled: e.tourScheduled, amenities: e.amenities, distanceTravel: e.travelPref,
          pi: e.parentInterest, assignee: e.assignee || '' };
      });
    },
    enquiryDetail: function (id) { return CRM.enquiry(id); },

    // ── DERIVED: Dashboard ────────────────────────────────────────────
    dashboardData: function (period) {
      period = period || 'month';
      var rows = state.enquiries.filter(function (e) { return inPeriod(e, period); });
      var funnel = FUNNEL.map(function (f) { return { label: f.label, color: f.color, value: rows.filter(function (e) { return f.from.indexOf(e.status) >= 0; }).length }; });
      var srcMap = {}; rows.forEach(function (e) { srcMap[e.source] = (srcMap[e.source] || 0) + 1; });
      var sources = Object.keys(srcMap).sort(function (a, b) { return srcMap[b] - srcMap[a]; }).map(function (n) { return { name: n, color: SOURCE_COLORS[n] || '#94A3B8', total: srcMap[n] }; });
      var lost = LOST_REASONS.map(function (r, i) { return { label: r, color: LOST_COLORS[i], value: rows.filter(function (e) { return e.status === 'Closed' && e.closeReason === r; }).length }; });
      var staff = state.staff.filter(function (s) { return ROLES_LEAD.indexOf(s.role) >= 0; }).map(function (s, i) {
        var handled = rows.filter(function (e) { return e.assignee === s.name; }).length;
        var admits = rows.filter(function (e) { return e.assignee === s.name && e.status === 'Admission Confirmed'; }).length;
        return { name: s.name, initials: initials(s.name), color: avColor(i), handled: handled, admits: admits, rate: handled ? +(admits / handled * 100).toFixed(1) : 0 };
      }).sort(function (a, b) { return b.handled - a.handled; });
      return { funnel: funnel, sources: sources, lost: lost, staff: staff };
    },

    // ── DERIVED: My Workspace ─────────────────────────────────────────
    workspaceRecords: function () {
      return state.enquiries.map(function (e) {
        return { id: e.id, n: e.parentName, p: e.mobile, s: e.studentName, e: e.age, st: e.status, source: e.source,
          av: e.initials, gradeApplied: e.gradeApplied, acadYear: e.acadYear, curriculum: e.curriculum, area: e.area,
          pi: e.parentInterest, assignee: e.assignee || '' };
      });
    },
    // OPS overlay keyed by enquiry id, computed from real dates relative to today
    workspaceOps: function () {
      var ops = {};
      state.enquiries.forEach(function (e) {
        var o = {};
        if (e.enquiryDate === TODAY && e.status === 'New Enquiry') o.new = true;
        if (e.visit && e.visit.date === TODAY) o.visit = { type: e.visit.type, state: e.visit.state };
        if (e.followUp && e.followUp.dueDate) { o.followUp = { days: dayDiff(e.followUp.dueDate, TODAY), note: e.followUp.note }; }
        if (Object.keys(o).length) ops[e.id] = o;
      });
      return ops;
    },
    workspaceTargets: function (staffName) {
      // achieved counts derive from enquiries; goals are simple per-staff config
      var names = staffName && staffName !== 'All' ? [staffName] : CRM.staffNames();
      var enq = state.enquiries;
      var sum = { enq: [0, 0], vis: [0, 0], adm: [0, 0] };
      names.forEach(function (n) {
        var mine = enq.filter(function (e) { return e.assignee === n; });
        sum.enq[0] += mine.length; sum.enq[1] += 20;
        sum.vis[0] += mine.filter(function (e) { return e.visit; }).length; sum.vis[1] += 10;
        sum.adm[0] += mine.filter(function (e) { return e.status === 'Admission Confirmed'; }).length; sum.adm[1] += 3;
      });
      return sum;
    },

    // ── BOOKINGS ──────────────────────────────────────────────────────
    bookings: function () { return clone(state.bookings); },
    addBooking: function (p) { var b = Object.assign({ id: 'VB-' + uid(''), enquiryId: null, communications: [], status: 'confirmed' }, p); state.bookings.unshift(b); commit(); return clone(b); },
    updateBooking: function (id, p) { var b = state.bookings.find(function (x) { return x.id === id; }); if (b) { Object.keys(p || {}).forEach(function (k) { b[k] = p[k]; }); commit(); } return b ? clone(b) : null; },
    setBookings: function (arr) { state.bookings = clone(arr || []); commit(); }
  };

  if (typeof window !== 'undefined') window.CRM = CRM;
  if (typeof module !== 'undefined' && module.exports) module.exports = CRM;
})();
