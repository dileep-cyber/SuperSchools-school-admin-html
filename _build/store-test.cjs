// store-test.cjs — unit tests for lib/crm-store.js (Node, mock localStorage). Run: node _build/store-test.cjs
const _ls = {}; global.localStorage = { getItem: (k) => (k in _ls ? _ls[k] : null), setItem: (k, v) => { _ls[k] = String(v); }, removeItem: (k) => { delete _ls[k]; } };
const CRM = require('../lib/crm-store.js');
let pass = 0, fail = 0; const fails = [];
const ok = (m) => { pass++; };
const bad = (m) => { fail++; fails.push(m); console.log('  ✗ ' + m); };
const A = (c, m) => c ? ok(m) : bad(m);
const sum = (a) => a.reduce((s, x) => s + x, 0);

// ── seed loaded + persisted ──
A(!CRM.isEmpty(), 'store seeded (not empty)');
A(CRM.staff().length === 12, 'staff seeded = 12 (got ' + CRM.staff().length + ')');
A(CRM.enquiries().length === 28, 'enquiries seeded = 28 (got ' + CRM.enquiries().length + ')');
A(!!_ls['ss_crm_store_v1'], 'seed persisted to localStorage');

// ── adapter shapes ──
const row = CRM.enquiriesAsRows()[0];
A(row.n && row.p && row.s && /\d{2}-\d{2}-\d{4}/.test(row.d) && row.st && row.pi, 'enquiriesAsRows shape (n,p,s,d=DD-MM-YYYY,st,pi)');
A(CRM.enquiriesAsRows().length === CRM.enquiries().length, 'rows count == enquiries count');
const wr = CRM.workspaceRecords()[0];
A(wr.n && wr.st && 'assignee' in wr, 'workspaceRecords shape');

// ── consistency: every assignee is a real active staff name ──
const names = CRM.staffNames();
const allAssigneesValid = CRM.enquiries().every((e) => !e.assignee || names.includes(e.assignee));
A(allAssigneesValid, 'every enquiry assignee is a real staff name (single source of truth)');

// ── dashboard derives from enquiries, internally consistent ──
const d = CRM.dashboardData('month');
A(d.funnel.length === 7, 'dashboard funnel has 7 stages');
const admitted = d.funnel.find((f) => f.label === 'Admitted Closed').value;
const closed = d.funnel.find((f) => f.label === 'Closed').value;
const monthEnq = CRM.enquiries().filter((e) => e.enquiryDate >= '2026-05-07');
A(admitted === monthEnq.filter((e) => e.status === 'Admission Confirmed').length, 'funnel Admitted == Admission Confirmed count (month)');
A(sum(d.lost.map((l) => l.value)) === closed, 'lost reasons sum == funnel Closed value');
A(d.staff.length >= 1 && d.staff.every((s) => names.includes(s.name)), 'dashboard staff are real staff');
A(d.sources.length >= 1 && sum(d.sources.map((s) => s.total)) === monthEnq.length, 'sources total == month enquiry count');
// period differs
A(CRM.dashboardData('day').funnel.reduce((s, f) => s + f.value, 0) <= CRM.dashboardData('month').funnel.reduce((s, f) => s + f.value, 0), 'day total <= month total');

// ── workspace ops derive from real dates ──
const ops = CRM.workspaceOps();
const opVals = Object.values(ops);
A(opVals.some((o) => o.new), 'workspace OPS has new-today items');
A(opVals.some((o) => o.visit), 'workspace OPS has visits-today items');
A(opVals.some((o) => o.followUp && o.followUp.days < 0), 'workspace OPS has overdue follow-ups');
A(opVals.some((o) => o.followUp && o.followUp.days === 0), 'workspace OPS has due-today follow-ups');

// ── staff metrics derive from enquiries ──
const members = CRM.staffMembers();
const ananya = members.find((m) => m.name === 'Ananya Sharma');
const ananyaLeads = CRM.enquiries().filter((e) => e.assignee === 'Ananya Sharma').length;
A(ananya && ananya.metrics.all.leads === ananyaLeads, 'staffMembers metrics.all.leads == real assigned count');

// ── bookings link to enquiries + hosts are staff ──
const bks = CRM.bookings();
A(bks.length >= 1 && bks.every((b) => CRM.enquiry(b.enquiryId)), 'every booking links to a real enquiry');
A(bks.every((b) => b.assignedTo === 'Self' || names.includes(b.assignedTo)), 'booking hosts are real staff (or Self)');

// ── MUTATION propagates: change a status → dashboard reflects it ──
const target = CRM.enquiries().find((e) => e.status === 'Application Pending');
const beforeAdm = CRM.dashboardData('month').funnel.find((f) => f.label === 'Admitted Closed').value;
CRM.setEnquiryStatus(target.id, 'Admission Confirmed');
const afterAdm = CRM.dashboardData('month').funnel.find((f) => f.label === 'Admitted Closed').value;
A(afterAdm === beforeAdm + 1, 'setEnquiryStatus → dashboard Admitted count +1 (cross-view propagation)');
A(CRM.enquiry(target.id).status === 'Admission Confirmed', 'status persisted on the enquiry');

// ── add enquiry shows everywhere ──
const n0 = CRM.enquiries().length;
const ne = CRM.addEnquiry({ parentName: 'Test Parent', studentName: 'Test Child', mobile: '90000 00000', source: 'Walk-in', assignee: 'Rohit Kumar', status: 'New Enquiry' });
A(CRM.enquiries().length === n0 + 1 && CRM.enquiriesAsRows().some((r) => r.id === ne.id), 'addEnquiry appears in list rows');

// ── staff: add + remove-with-reassign rewrites enquiry assignees ──
const s0 = CRM.staff().length;
const ns = CRM.addStaff({ name: 'New Counsellor', role: 'Admissions Counsellor', mobile: '9888800000' });
A(CRM.staff().length === s0 + 1, 'addStaff adds a member');
const rohit = CRM.staffByName('Rohit Kumar');
const rohitLeads0 = CRM.enquiries().filter((e) => e.assignee === 'Rohit Kumar').length;
CRM.removeStaff(rohit.id, ns.id);
A(CRM.enquiries().filter((e) => e.assignee === 'New Counsellor').length >= rohitLeads0 && !CRM.staffByName('Rohit Kumar'), 'removeStaff reassigns that staff\'s enquiries to the target');

// ── EMPTY → DATA lifecycle ──
CRM.clearAll();
A(CRM.isEmpty(), 'clearAll → store empty');
A(CRM.enquiries().length === 0 && CRM.staff().length === 0 && CRM.bookings().length === 0, 'all collections empty');
A(CRM.dashboardData('month').funnel.every((f) => f.value === 0), 'empty store → dashboard funnel all zero');
A(CRM.staffMembers().length === 0 && Object.keys(CRM.workspaceOps()).length === 0, 'empty store → no staff members, no workspace ops');
const e1 = CRM.addEnquiry({ parentName: 'First Lead', studentName: 'Kid', mobile: '91111 11111', status: 'New Enquiry', source: 'SuperSchools', enquiryDate: CRM.today() });
A(CRM.enquiries().length === 1 && CRM.dashboardData('day').funnel.find((f) => f.label === 'New Enquiry').value === 1, 'empty→data: first enquiry populates the dashboard');
CRM.reset();
A(CRM.enquiries().length === 28 && CRM.staff().length === 12, 'reset → reseeded');

console.log('\n===== crm-store unit test =====');
console.log('Passed: ' + pass + '\nFailed: ' + fail);
if (fails.length) { console.log('\nFAILURES:'); fails.forEach((f) => console.log('  ✗ ' + f)); process.exit(1); }
console.log('\nRESULT: PASS ✓'); process.exit(0);
