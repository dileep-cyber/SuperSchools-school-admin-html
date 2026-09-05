// Admission enquiry data. Field codes preserved for internal compatibility:
// n=Parent Name, p=Mobile, s=Student Name, d=Enquiry Date,
// e=Age of Child, dist=Distance, st=Status, source=Source, av=Parent Initials.
// gradeApplied=Grade Applying, acadYear=Academic Year.
// Additional fields: curriculum, city, area, gender, tourScheduled, amenities.
const applications = [
  {id:'1', n:'Rakesh Sharma', p:'99808 33777', s:'Aarav Sharma', d:'10-10-2026', e:'4-5 years', dist:'1.2 km', distBucket:'0-5 Km', st:'New Enquiry', source:'SuperSchools', av:'RS', gradeApplied:'LKG', acadYear:'2026-27', curriculum:'CBSE', city:'Bengaluru', area:'Indiranagar', gender:'Male', tourScheduled:'No', amenities:['Transport','Daycare','Smart Classroom'], distanceTravel:'Within 5 km'},
  {id:'2', n:'Priya Sharma', p:'98765 43210', s:'Ananya Sharma', d:'15-05-2026', e:'6-8 years', dist:'4.2 km', distBucket:'0-5 Km', st:'Interested', source:'Instagram', av:'PS', gradeApplied:'Grade 1-5', acadYear:'2026-27', curriculum:'ICSE', city:'Bengaluru', area:'Koramangala', gender:'Female', tourScheduled:'Yes', amenities:['Transport','Library','Sports'], distanceTravel:'Within 5 km'},
  {id:'3', n:'Sneha Rao', p:'91234 56789', s:'Vihaan Rao', d:'10-06-2026', e:'3-4 years', dist:'3.5 km', distBucket:'0-5 Km', st:'Visit / Revisit Scheduled', source:'Website', av:'SR', gradeApplied:'Nursery', acadYear:'2027-28', curriculum:'CBSE', city:'Bengaluru', area:'HSR Layout', gender:'Male', tourScheduled:'Yes', amenities:['Daycare','Playground'], distanceTravel:'Within 5 km'},
  {id:'4', n:'Vikram Singh', p:'99887 76655', s:'Aanya Singh', d:'20-08-2026', e:'10-12 years', dist:'6.1 km', distBucket:'5-10 Km', st:'Visit Completed', source:'Referral', av:'VS', gradeApplied:'Grade 6-8', acadYear:'2026-27', curriculum:'IB', city:'Bengaluru', area:'Whitefield', gender:'Female', tourScheduled:'Yes', amenities:['Transport','STEM Lab','Sports','Music & Arts'], distanceTravel:'Within 10 km'},
  {id:'5', n:'Meera Gupta', p:'97788 99001', s:'Ishaan Gupta', d:'28-11-2026', e:'12-14 years', dist:'2.8 km', distBucket:'0-5 Km', st:'Admission Confirmed', source:'Google Ads', av:'MG', gradeApplied:'Grade 9-10', acadYear:'2026-27', curriculum:'CBSE', city:'Bengaluru', area:'Jayanagar', gender:'Male', tourScheduled:'Yes', amenities:['Library','STEM Lab','Sports'], distanceTravel:'Within 5 km'},
  {id:'6', n:'Karan Iyer', p:'95554 33221', s:'Diya Iyer', d:'25-09-2026', e:'2-3 years', dist:'0.8 km', distBucket:'0-5 Km', st:'Contacted', source:'Walk-in', av:'KI', gradeApplied:'Nursery', acadYear:'2027-28', curriculum:'Montessori', city:'Bengaluru', area:'Indiranagar', gender:'Female', tourScheduled:'No', amenities:['Daycare','Playground'], distanceTravel:'Within 2 km'},
  {id:'7', n:'Rohan Kapoor', p:'94433 22110', s:'Aryan Kapoor', d:'02-11-2026', e:'8-10 years', dist:'12.4 km', distBucket:'10-20 Km', st:'New Enquiry', source:'SuperSchools', av:'RK', gradeApplied:'Grade 6-8', acadYear:'2027-28', curriculum:'CBSE', city:'Bengaluru', area:'Electronic City', gender:'Male', tourScheduled:'No', amenities:['Transport','Smart Classroom','Sports'], distanceTravel:'Within 15 km'},
  {id:'8', n:'Sana Nair', p:'91122 33445', s:'Reyansh Nair', d:'14-11-2026', e:'4-5 years', dist:'21.6 km', distBucket:'20+ Km', st:'Follow-up Required', source:'WhatsApp', av:'SN', gradeApplied:'UKG', acadYear:'2026-27', curriculum:'ICSE', city:'Bengaluru', area:'Devanahalli', gender:'Male', tourScheduled:'No', amenities:['Transport','Daycare'], distanceTravel:'More than 15 km'},
  {id:'9', n:'Arjun Mehta', p:'93344 55667', s:'Kiara Mehta', d:'20-11-2026', e:'6-8 years', dist:'7.2 km', distBucket:'5-10 Km', st:'Application Pending', source:'Website', av:'AM', gradeApplied:'Grade 1-5', acadYear:'2026-27', curriculum:'CBSE', city:'Bengaluru', area:'Bellandur', gender:'Female', tourScheduled:'Yes', amenities:['Transport','Library','Music & Arts'], distanceTravel:'Within 10 km'},
  {id:'10', n:'Kavita Khan', p:'98777 55555', s:'Aarush Khan', d:'28-12-2026', e:'Below 2 years', dist:'4.8 km', distBucket:'0-5 Km', st:'Admission Confirmed', source:'SuperSchools', av:'KK', gradeApplied:'Playgroup', acadYear:'2027-28', curriculum:'Montessori', city:'Bengaluru', area:'BTM Layout', gender:'Male', tourScheduled:'Yes', amenities:['Daycare','Playground'], distanceTravel:'Within 5 km'},
  {id:'11', n:'Ramesh Verma', p:'93333 11111', s:'Saanvi Verma', d:'18-10-2026', e:'10-12 years', dist:'18.6 km', distBucket:'10-20 Km', st:'Closed', source:'Referral', av:'RV', gradeApplied:'Grade 6-8', acadYear:'2028-29', curriculum:'State Board', city:'Bengaluru', area:'Yelahanka', gender:'Female', tourScheduled:'No', amenities:['Transport'], distanceTravel:'Within 15 km'},
  {id:'12', n:'Zara Malik', p:'97777 44444', s:'Inaya Malik', d:'02-01-2027', e:'14-16 years', dist:'22.3 km', distBucket:'20+ Km', st:'Closed', source:'Google Ads', av:'ZM', gradeApplied:'Grade 11-12', acadYear:'2026-27', curriculum:'IGCSE', city:'Bengaluru', area:'Sarjapur', gender:'Female', tourScheduled:'No', amenities:['Transport','STEM Lab','Music & Arts'], distanceTravel:'No Preference'},
  {id:'13', n:'Naveen Joshi', p:'96666 12345', s:'Aadhya Joshi', d:'06-01-2027', e:'8-10 years', dist:'9.4 km', distBucket:'5-10 Km', st:'Interested', source:'Phone Enquiry', av:'NJ', gradeApplied:'Grade 6-8', acadYear:'2027-28', curriculum:'CBSE', city:'Bengaluru', area:'Marathahalli', gender:'Female', tourScheduled:'No', amenities:['Transport','Smart Classroom','Sports','Library'], distanceTravel:'Within 10 km'},
  {id:'14', n:'Imran Das', p:'95555 67890', s:'Veer Das', d:'09-01-2027', e:'12-14 years', dist:'14.2 km', distBucket:'10-20 Km', st:'Visit / Revisit Scheduled', source:'Newspaper Ad', av:'ID', gradeApplied:'Grade 9-10', acadYear:'2026-27', curriculum:'ICSE', city:'Bengaluru', area:'Hebbal', gender:'Male', tourScheduled:'Yes', amenities:['Transport','STEM Lab','Library'], distanceTravel:'Within 15 km'},
  {id:'15', n:'Sunita Reddy', p:'94432 11875', s:'Anika Reddy', d:'22-01-2027', e:'4-5 years', dist:'3.1 km', distBucket:'0-5 Km', st:'New Enquiry', source:'SuperSchools', av:'SR', gradeApplied:'LKG', acadYear:'2027-28', curriculum:'CBSE', city:'Bengaluru', area:'Sarjapur Road', gender:'Female', tourScheduled:'No', amenities:['Daycare','Playground'], distanceTravel:'Within 5 km'},
  {id:'16', n:'Prakash Nair', p:'96611 88234', s:'Dhruv Nair', d:'25-01-2027', e:'8-10 years', dist:'8.7 km', distBucket:'5-10 Km', st:'New Enquiry', source:'Referral', av:'PN', gradeApplied:'Grade 6-8', acadYear:'2027-28', curriculum:'CBSE', city:'Bengaluru', area:'JP Nagar', gender:'Male', tourScheduled:'No', amenities:['Transport','Sports','Library'], distanceTravel:'Within 10 km'},
  {id:'17', n:'Divya Menon', p:'93301 56478', s:'Tara Menon', d:'28-01-2027', e:'6-8 years', dist:'6.4 km', distBucket:'5-10 Km', st:'New Enquiry', source:'Instagram', av:'DM', gradeApplied:'Grade 1-5', acadYear:'2026-27', curriculum:'ICSE', city:'Bengaluru', area:'Sadashivanagar', gender:'Female', tourScheduled:'No', amenities:['Transport','Smart Classroom'], distanceTravel:'Within 10 km'}
]
const rows = applications;
const kanbanLoadMoreRows = [
  {id:'k15', n:'Nisha Patel', p:'98880 11223', s:'Avni Patel', d:'12-01-2027', e:'2-3 years', dist:'5.6 km', distBucket:'5-10 Km', st:'New Enquiry', source:'Facebook Ads', av:'NP', gradeApplied:'Nursery', acadYear:'2027-28', curriculum:'Montessori', city:'Bengaluru', area:'Banashankari', gender:'Female', tourScheduled:'No', amenities:['Daycare'], distanceTravel:'Within 10 km'},
  {id:'k16', n:'Manish Rao', p:'97770 44556', s:'Arjun Rao', d:'15-01-2027', e:'14-16 years', dist:'11.8 km', distBucket:'10-20 Km', st:'New Enquiry', source:'SuperSchools', av:'MR', gradeApplied:'Grade 11-12', acadYear:'2026-27', curriculum:'CBSE', city:'Bengaluru', area:'Rajajinagar', gender:'Male', tourScheduled:'No', amenities:['Transport','STEM Lab','Sports'], distanceTravel:'Within 15 km'},
  {id:'k17', n:'Pooja Choudhary', p:'92233 41566', s:'Riya Choudhary', d:'30-01-2027', e:'5-6 years', dist:'4.3 km', distBucket:'0-5 Km', st:'New Enquiry', source:'Phone Enquiry', av:'PC', gradeApplied:'Grade 1-5', acadYear:'2027-28', curriculum:'CBSE', city:'Bengaluru', area:'Vijayanagar', gender:'Female', tourScheduled:'No', amenities:['Transport','Playground'], distanceTravel:'Within 5 km'},
  {id:'k18', n:'Suresh Pillai', p:'91100 67234', s:'Arnav Pillai', d:'01-02-2027', e:'10-12 years', dist:'9.2 km', distBucket:'5-10 Km', st:'Contacted', source:'SuperSchools', av:'SP', gradeApplied:'Grade 6-8', acadYear:'2027-28', curriculum:'CBSE', city:'Bengaluru', area:'Kengeri', gender:'Male', tourScheduled:'No', amenities:['Transport','Sports'], distanceTravel:'Within 10 km'}
]
const statusList = ['New Enquiry','Contacted','Follow-up Required','Interested','Visit / Revisit Scheduled','Visit Completed','Application Pending','Admission Confirmed','Closed'];
// ── Pagination state ─────────────────────────────────────────────────
const PAGE_SIZE = 10;
let tablePage = 1;
let mapPage   = 1;
const gradeAppliedOptions = ['Playgroup','Nursery','LKG','UKG','Grade 1-5','Grade 6-8','Grade 9-10','Grade 11-12'];
const academicYearOptions = ['2026-27','2027-28','2028-29'];
const tableColumns = [
  {key:'candidate',label:'Parent Name'}, {key:'phone',label:'Mobile Number'},
  {key:'specialization',label:'Student Name'}, {key:'gradeApplied',label:'Grade Applying'},
  {key:'date',label:'Enquiry Date'}, {key:'exp',label:'Age of Child'}, {key:'distance',label:'Distance'}, {key:'travelPref',label:'Travel Pref.'}, {key:'source',label:'Source'}
];
const qualificationOptions = ['Daycare','Pre-Nursery','Nursery','LKG','UKG','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'];
// Internal: previously curriculum was dependent on qualification. For admissions, curriculum is independent.
// These arrays are kept for backward compatibility with form helpers but both return the same full list.
const diplomaSpecializations = ['CBSE','ICSE','IB','IGCSE','State Board','Montessori','Cambridge'];
const degreeSpecializations = ['CBSE','ICSE','IB','IGCSE','State Board','Montessori','Cambridge'];
const curriculumOptions = ['CBSE','ICSE','IB','IGCSE','State Board','Montessori','Cambridge'];
const ageGroupOptions = ['Below 2 years','2-3 years','3-4 years','4-5 years','5-6 years','6-8 years','8-10 years','10-12 years','12-14 years','14-16 years','16+ years'];
const cityOptions = ['Bengaluru','Mumbai','Delhi','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad'];
const amenityOptions = ['Transport','Daycare','Smart Classroom','Playground','Library','STEM Lab','Sports','Music & Arts','Swimming Pool','Cafeteria','CCTV Security','Air-conditioned Classrooms'];
const sourceOptions = ['SuperSchools','Walk-in','Referral','Website','Facebook Ads','Instagram','Google Ads','WhatsApp','Phone Enquiry','Newspaper Ad','Others'];
const filterConfig = [
  {key:'dateRange', label:'Date Range', type:'dateRange'},
  {key:'status', label:'Status', type:'multi', items:statusList},
  {key:'gradeApplied', label:'Grade Applying', type:'multi', items:gradeAppliedOptions},
  {key:'acadYear', label:'Academic Year', type:'multi', items:academicYearOptions},
  {key:'distance', label:'Distance', type:'multi', items:['0-5 Km','5-10 Km','10-20 Km','20+ Km']},
  {key:'source', label:'Source', type:'multi', items:sourceOptions}
];
function getSpecializationOptions(){
  // Curriculum is independent of applying class for admissions — always return full list.
  return curriculumOptions;
}
function getActiveFilterConfig(){
  // No dependent filters for admissions — return full config as-is.
  return filterConfig;
}
function normalizeDependentFilters(){
  // No-op: admission filters are independent of each other.
}
let currentView = 'table';
let pending = {query:'', fromDate:'', toDate:'', status:[], gradeApplied:[], acadYear:[], distance:[], source:[]};
let applied = {query:'', fromDate:'', toDate:'', status:[], gradeApplied:[], acadYear:[], distance:[], source:[]};
let visibleColumns = tableColumns.map(c=>c.key);
let visibleStatuses = [...statusList];
let kanbanBatch = 1;
let kanbanLoading = false;
let kanbanEndToastShown = false; // reset each time kanbanBatch resets to 1
const KANBAN_BATCH_SIZE = 8;
let draftVisibleColumns = [...visibleColumns];
let draftVisibleStatuses = [...visibleStatuses];
let sidebarCollapsed = false;
let selectedIds = new Set();
let sortState = {key:null, dir:null};
let openFilterPanels = new Set();
let savedFilters = [];
try { savedFilters = JSON.parse(localStorage.getItem('ssSavedFilters') || '[]'); } catch(e) { savedFilters = []; }

const $ = id => document.getElementById(id);
const esc = str => String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function formatDateDisplay(value){
  const v = String(value || '');
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : v;
}
function parseDateDisplay(value){
  const v = String(value || '').trim();
  const m = v.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if(m) return `${m[3]}-${m[2]}-${m[1]}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '';
}
function formatDateTyping(value){
  const digits = String(value || '').replace(/\D/g,'').slice(0,8);
  if(digits.length <= 2) return digits;
  if(digits.length <= 4) return `${digits.slice(0,2)}-${digits.slice(2)}`;
  return `${digits.slice(0,2)}-${digits.slice(2,4)}-${digits.slice(4)}`;
}
function dateRangeFieldHtml(key, label, scope){
  const display = formatDateDisplay(pending[key] || '');
  return `<div class="relative flex h-9 items-center rounded-lg border border-[#E2E8F0] bg-white px-3 transition focus-within:border-[#284CA5]"><span class="mr-3 w-[34px] shrink-0 text-[12px] font-semibold text-[#475569]">${label}</span><input data-filter-key="${key}" data-filter-type="dateText" data-filter-scope="${scope}" type="text" inputmode="numeric" maxlength="10" value="${esc(display)}" placeholder="dd-mm-yyyy" class="min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] text-[#334155] placeholder:text-[#94A3B8] outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none" /><button type="button" data-calendar-open="${key}" data-calendar-scope="${scope}" class="ml-2 grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-md text-[#64748B] transition hover:bg-[#EFF4FF] hover:text-[#284CA5]" aria-label="Open ${label.toLowerCase()} date calendar"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></button></div>`;
}
function dateRangeFieldsHtml(scope){
  return `<div class="grid grid-cols-1 gap-2">${dateRangeFieldHtml('fromDate','From',scope)}${dateRangeFieldHtml('toDate','To',scope)}</div>`;
}
const distValue = r => Number(String(r.dist).replace(/[^0-9.]/g,'')) || 0;

function avatarColorClass(av){
  const colors = {
    SK:'bg-[#F59E0B]', AS:'bg-[#3B82F6]', AR:'bg-[#EC4899]', VS:'bg-[#10B981]', PI:'bg-[#6366F1]',
    RK:'bg-[#64748B]', SN:'bg-[#14B8A6]', AM:'bg-[#F97316]', MG:'bg-[#14B8A6]', KK:'bg-[#0EA5E9]',
    RV:'bg-[#8B5CF6]', ZM:'bg-[#10B981]', DJ:'bg-[#8B5CF6]', SD:'bg-[#F97316]', NJ:'bg-[#3B82F6]', ID:'bg-[#6366F1]', NJ:'bg-[#3B82F6]', ID:'bg-[#6366F1]'
  };
  return colors[av] || 'bg-[#3B82F6]';
}
function avatarHtml(av, size='h-[34px] w-[34px]'){
  return `<div class="grid ${size} shrink-0 place-items-center rounded-full ${avatarColorClass(av)} text-[11px] font-bold tracking-[0.3px] text-white">${esc(av)}</div>`;
}
function avatarPinClass(av){
  const colors = {
    SK:'bg-[#F59E0B]', AS:'bg-[#3B82F6]', AR:'bg-[#EC4899]', VS:'bg-[#10B981]', PI:'bg-[#6366F1]',
    RK:'bg-[#64748B]', SN:'bg-[#14B8A6]', AM:'bg-[#F97316]', MG:'bg-[#14B8A6]', KK:'bg-[#0EA5E9]',
    RV:'bg-[#8B5CF6]', ZM:'bg-[#10B981]', DJ:'bg-[#8B5CF6]', SD:'bg-[#F97316]'
  };
  return colors[av] || 'bg-[#3B82F6]';
}
function kanbanHeaderClass(st){
  const m={
    'New Enquiry':              'bg-[#F3E8FF] border-[#DDD6FE] text-[#7C3AED]',
    'Contacted':                'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]',
    'Follow-up Required':       'bg-[#FFEDD5] border-[#FED7AA] text-[#C2410C]',
    'Interested':               'bg-[#CCFBF1] border-[#99F6E4] text-[#0D9488]',
    'Visit / Revisit Scheduled':'bg-[#CFFAFE] border-[#A5F3FC] text-[#0E7490]',
    'Visit Completed':          'bg-[#EEF2FF] border-[#C7D2FE] text-[#4F46E5]',
    'Application Pending':      'bg-[#FEF9C3] border-[#FEF08A] text-[#854D0E]',
    'Admission Confirmed':      'bg-[#D1FAE5] border-[#A7F3D0] text-[#059669]',
    'Closed':                   'bg-[#F1F5F9] border-[#E2E8F0] text-[#64748B]'
  };
  return m[st]||'bg-white border-[#E2E8F0] text-[#334155]';
}
function kanbanBadgeClass(st){
  const m={
    'New Enquiry':              'border-[#DDD6FE] bg-[#FAF5FF] text-[#7C3AED]',
    'Contacted':                'border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]',
    'Follow-up Required':       'border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C]',
    'Interested':               'border-[#99F6E4] bg-[#F0FDFA] text-[#0D9488]',
    'Visit / Revisit Scheduled':'border-[#A5F3FC] bg-[#ECFEFF] text-[#0E7490]',
    'Visit Completed':          'border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5]',
    'Application Pending':      'border-[#FEF08A] bg-[#FEFCE8] text-[#854D0E]',
    'Admission Confirmed':      'border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]',
    'Closed':                   'border-[#E2E8F0] bg-white text-[#64748B]'
  };
  return m[st]||'border-[#E2E8F0] bg-white text-[#334155]';
}

function statusHtml(st){ return `<div class="mt-1 text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#284CA5]">${esc(st)}</div>`; }
function contactIconsHtml(isSelected){
  // When the row is selected (bg-[#DCE8FF]), the icon containers must match that background
  // to avoid white patches. We use transparent bg + a subtler icon colour in the selected state.
  const waBg   = isSelected ? 'bg-[#C5DAFF] hover:bg-[#B0CAFF]' : 'bg-[#ECFDF5] hover:bg-[#D1FAE5]';
  const waText = isSelected ? 'text-[#1A6B4A]' : 'text-[#059669]';
  const callBg   = isSelected ? 'bg-[#C5DAFF] hover:bg-[#B0CAFF]' : 'bg-[#EFF4FF] hover:bg-[#DCE8FF]';
  const callText = isSelected ? 'text-[#1E3C7E]' : 'text-[#284CA5]';
  return `<span class="inline-flex items-center gap-1"><button type="button" class="inline-grid h-5 w-5 place-items-center rounded-full ${waBg} ${waText} transition" aria-label="WhatsApp"><svg class="h-[17px] w-[17px]" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4.5A11.4 11.4 0 0 0 6.4 22l-1.2 5 5.1-1.3A11.4 11.4 0 1 0 16 4.5Z"/><path d="M11.7 10.6c.2-.5.4-.6.8-.6h.7c.2 0 .5.1.6.5l.9 2.1c.1.3.1.6-.1.8l-.6.7c-.2.2-.2.5 0 .8.7 1.3 1.8 2.3 3.1 3 .3.2.6.2.8-.1l.8-.9c.2-.2.5-.3.8-.2l2.1 1c.3.1.5.4.5.7 0 .7-.3 1.4-.8 1.8-.6.5-1.5.7-2.6.5-2-.4-3.9-1.4-5.5-3-1.6-1.5-2.6-3.4-3-5.2-.2-.9.1-1.6.5-2Z"/></svg></button><button type="button" class="inline-grid h-5 w-5 place-items-center rounded-full ${callBg} ${callText} transition" aria-label="Call"><svg class="h-[13px] w-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.19a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.61.62A2 2 0 0 1 22 16.92z"/></svg></button></span>`;
}
function statusDisplayLabel(st){ return st; }
function checkboxHtml(id, label='Select item'){
  const checked = selectedIds.has(String(id)) ? 'checked' : '';
  return `<input data-select-id="${esc(id)}" type="checkbox" ${checked} aria-label="${esc(label)}" class="h-4 w-4 cursor-pointer rounded border-[#BFD3FF] accent-[#284CA5] focus:ring-[#284CA5]" />`;
}
function colHidden(key){ return visibleColumns.includes(key) ? '' : 'hidden'; }

function rowDateValue(r){
  const parts = String(r.d).split('-');
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : '';
}
function passesAppliedFilters(r){
  const q = applied.query.trim().toLowerCase();
  const matchesQ = !q || [r.n,r.p,r.s].some(v=>String(v).toLowerCase().includes(q));
  const rowDate = rowDateValue(r);
  return matchesQ &&
    (!applied.fromDate || rowDate >= applied.fromDate) &&
    (!applied.toDate || rowDate <= applied.toDate) &&
    (!applied.status.length || applied.status.includes(r.st)) &&
    (!applied.gradeApplied.length || applied.gradeApplied.includes(r.gradeApplied)) &&
    (!applied.acadYear.length || applied.acadYear.includes(r.acadYear)) &&
    (!applied.distance.length || applied.distance.includes(r.distBucket)) &&
    (!applied.source.length || applied.source.includes(r.source));
}
function sortValue(row, key){
  const map = {
    candidate: row.n,
    phone: row.p,
    specialization: row.s,
    gradeApplied: row.gradeApplied,
    date: rowDateValue(row),
    exp: row.e,
    distance: distValue(row),
    source: row.source,
    travelPref: row.distanceTravel || ''
  };
  return map[key] ?? '';
}
function sortRowsIfNeeded(result){
  if(!sortState.key || !sortState.dir) return result;
  return [...result].sort((a,b)=>{
    const av = sortValue(a, sortState.key);
    const bv = sortValue(b, sortState.key);
    if(typeof av === 'number' || typeof bv === 'number') return sortState.dir === 'asc' ? Number(av)-Number(bv) : Number(bv)-Number(av);
    return sortState.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });
}
function updateSortIcons(){
  document.querySelectorAll('[data-sort-icon]').forEach(icon=>{
    const key = icon.dataset.sortIcon;
    icon.textContent = sortState.key === key ? (sortState.dir === 'asc' ? '↑' : sortState.dir === 'desc' ? '↓' : '↕') : '↕';
  });
}
function getFiltered(){
  return sortRowsIfNeeded(rows.filter(passesAppliedFilters));
}
function getFilteredKanbanExtra(){
  return sortRowsIfNeeded(kanbanLoadMoreRows.filter(passesAppliedFilters));
}
function getKanbanDisplayedData(data){
  return kanbanBatch === 1 ? data : [...data, ...getFilteredKanbanExtra()];
}

function cloneFilters(state){ return JSON.parse(JSON.stringify(state)); }
function hasAnyPendingFilter(){
  return Boolean((pending.query && pending.query.trim()) || pending.fromDate || pending.toDate || pending.status.length || pending.gradeApplied.length || pending.acadYear.length || pending.distance.length || pending.source.length);
}
function normalizeFiltersForCompare(state){
  const copy = cloneFilters(state);
  ['status','gradeApplied','acadYear','distance','source'].forEach(k=>{ copy[k] = [...(copy[k] || [])].sort(); });
  return JSON.stringify(copy);
}
function isPendingFilterAlreadySaved(){
  const current = normalizeFiltersForCompare(pending);
  return savedFilters.some(f => normalizeFiltersForCompare(f.filters) === current);
}
function updateContextualSaveButton(){
  const btn = $('saveFilterBtn');
  if(!btn) return;
  btn.classList.toggle('hidden', !hasAnyPendingFilter() || isPendingFilterAlreadySaved());
}
function persistSavedFilters(){ localStorage.setItem('ssSavedFilters', JSON.stringify(savedFilters)); }
function renderSavedFiltersInto(listEl, scope){
  if(!listEl) return;
  const activeFilterKey = normalizeFiltersForCompare(applied);
  if(!savedFilters.length){
    listEl.innerHTML = '<div class="rounded-lg px-2 py-2 text-[13px] text-[#64748B]">No saved filters</div>';
    return;
  }
  const attr = scope === 'drawer' ? 'data-saved-filter-mobile' : 'data-saved-filter';
  const delAttr = scope === 'drawer' ? 'data-delete-saved-filter-mobile' : 'data-delete-saved-filter';
  listEl.innerHTML = savedFilters.map(f=>{
    const active = normalizeFiltersForCompare(f.filters) === activeFilterKey;
    return `<button type="button" ${attr}="${esc(f.id)}" class="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-[13px] transition ${active?'bg-[#284CA5] text-white hover:bg-[#203F8D]':'text-[#0F172A] hover:bg-[#DCE8FF] hover:text-[#0F172A]'}"><span class="min-w-0 truncate">${esc(f.name)}</span><span ${delAttr}="${esc(f.id)}" class="grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-full ${active?'text-white hover:bg-white/15 hover:text-white':'text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#DC2626]'} transition" aria-label="Delete saved filter"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span></button>`;
  }).join('');
}

function renderSavedFilters(){
  renderSavedFiltersInto($('savedFiltersList'), 'side');
  renderSavedFiltersInto($('savedFiltersMobileList'), 'drawer');
  updateContextualSaveButton();
  if(typeof updateDrawerSaveButton === 'function') updateDrawerSaveButton();
}
function openSaveFilterModal(){
  const modal = $('saveFilterModal');
  const input = $('saveFilterName');
  if(!modal || !input) return;
  input.value = '';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(()=>input.focus(), 0);
}
function closeSaveFilterModal(){
  const modal = $('saveFilterModal');
  if(!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}
function saveCurrentFilter(){
  const input = $('saveFilterName');
  if(!input) return;
  const name = input.value.trim();
  if(!name) { input.focus(); return; }
  if(isPendingFilterAlreadySaved()) { closeSaveFilterModal(); updateContextualSaveButton(); return; }
  savedFilters.push({id:String(Date.now()), name, filters:cloneFilters(pending)});
  persistSavedFilters();
  renderSavedFilters();
  closeSaveFilterModal();
}
function applySavedFilter(id){
  const saved = savedFilters.find(f=>String(f.id) === String(id));
  if(!saved) return;
  if(isSavedFilterCurrentlySelected(saved)){
    clearSavedFilterSelection();
    return;
  }
  pending = cloneFilters(saved.filters);
  applied = cloneFilters(saved.filters);
  selectedIds.clear();
  kanbanBatch = 1; kanbanEndToastShown = false;
  if($('sideSearch')) $('sideSearch').value = pending.query || '';
  if($('topSearch')) $('topSearch').value = pending.query || '';
  if($('drawerSearch')) $('drawerSearch').value = pending.query || '';
  renderAllFilterGroups();
  renderSavedFilters();
  showSkeletonThenRender();
}
function deleteSavedFilter(id){
  savedFilters = savedFilters.filter(f=>String(f.id) !== String(id));
  persistSavedFilters();
  renderSavedFilters();
}
function closeSavedFiltersDropdown(){
  const panel = $('savedFiltersPanel');
  if(panel) panel.classList.add('hidden');
}
function clearSavedFilterSelection(){
  pending = {query:'', fromDate:'', toDate:'', status:[], gradeApplied:[], acadYear:[], distance:[], source:[]};
  applied = cloneFilters(pending);
  selectedIds.clear();
  kanbanBatch = 1; kanbanEndToastShown = false;
  if($('sideSearch')) $('sideSearch').value = '';
  if($('topSearch')) $('topSearch').value = '';
  if($('drawerSearch')) $('drawerSearch').value = '';
  renderAllFilterGroups();
  renderSavedFilters();
  renderAll();
}
function isSavedFilterCurrentlySelected(saved){
  return normalizeFiltersForCompare(applied) === normalizeFiltersForCompare(saved.filters);
}

let activeDateRangeTrigger = null;
let activeCalendarField = null;
let activeCalendarScope = null;
let calendarMonthDate = new Date();
function dateToISO(date){
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}
function isoToDate(value){
  const m = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? new Date(Number(m[1]), Number(m[2])-1, Number(m[3])) : null;
}
function updateDateTextField(key, scope){
  document.querySelectorAll(`[data-filter-key="${key}"][data-filter-type="dateText"][data-filter-scope="${scope}"]`).forEach(input=>{
    input.value = formatDateDisplay(pending[key] || '');
  });
}
function positionDateRangeCalendar(trigger){
  const pop = $('dateRangeCalendar');
  if(!pop || !trigger) return;
  pop.classList.remove('hidden');
  pop.style.visibility = 'hidden';
  pop.style.left = '0px';
  pop.style.top = '0px';
  const gap = 8;
  const margin = 10;
  const tr = trigger.getBoundingClientRect();
  const pw = pop.offsetWidth || 278;
  const ph = pop.offsetHeight || 310;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = tr.left;
  if(left + pw > vw - margin) left = tr.right - pw;
  if(left < margin) left = margin;
  if(left + pw > vw - margin) left = Math.max(margin, vw - pw - margin);
  let top = tr.bottom + gap;
  if(top + ph > vh - margin) top = tr.top - ph - gap;
  if(top < margin) top = Math.max(margin, vh - ph - margin);
  pop.style.left = `${left}px`;
  pop.style.top = `${top}px`;
  pop.style.visibility = 'visible';
}
function renderDateRangeCalendar(){
  const daysEl = $('calendarDays');
  if(!daysEl) return;
  const year = calendarMonthDate.getFullYear();
  const month = calendarMonthDate.getMonth();
  const label = calendarMonthDate.toLocaleDateString('en-US', {month:'long', year:'numeric'});
  if($('calendarMonthLabel')) $('calendarMonthLabel').textContent = label;
  const monthSelect = $('calendarMonthSelect');
  if(monthSelect){
    const monthNames = Array.from({length:12}, (_,i)=>new Date(2000,i,1).toLocaleDateString('en-US',{month:'short'}));
    if(!monthSelect.options.length) monthSelect.innerHTML = monthNames.map((name,i)=>`<option value="${i}">${name}</option>`).join('');
    monthSelect.value = String(month);
  }
  const yearSelect = $('calendarYearSelect');
  if(yearSelect){
    const startYear = year - 10;
    yearSelect.innerHTML = Array.from({length:21}, (_,i)=>startYear+i).map(y=>`<option value="${y}">${y}</option>`).join('');
    yearSelect.value = String(year);
  }
  if($('calendarFieldLabel')) $('calendarFieldLabel').textContent = activeCalendarField === 'toDate' ? 'To date' : 'From date';
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const selected = pending[activeCalendarField] || '';
  const today = dateToISO(new Date());
  let html = '';
  for(let i=0;i<firstDay;i++) html += '<span class="h-8"></span>';
  for(let d=1; d<=lastDate; d++){
    const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isSelected = iso === selected;
    const isToday = iso === today;
    html += `<button type="button" data-calendar-day="${iso}" class="grid h-8 w-8 place-items-center rounded-full text-[12px] font-semibold transition ${isSelected?'bg-[#284CA5] text-white hover:bg-[#203F8D]':isToday?'bg-[#EFF4FF] text-[#284CA5] ring-1 ring-inset ring-[#BFD3FF] hover:bg-[#DCE8FF]':'text-[#334155] hover:bg-[#DCE8FF] hover:text-[#284CA5]'}">${d}</button>`;
  }
  daysEl.innerHTML = html;
}
function openDateRangeCalendar(trigger, fieldKey, scope){
  activeDateRangeTrigger = trigger;
  activeCalendarField = fieldKey;
  activeCalendarScope = scope;
  let selectedDate;
  if(scope === 'addlead'){
    const input = document.getElementById(fieldKey);
    const iso = input ? parseDateDisplay(input.value) : '';
    selectedDate = iso ? isoToDate(iso) : null;
  } else {
    selectedDate = isoToDate(pending[fieldKey]);
  }
  calendarMonthDate = selectedDate || new Date();
  calendarMonthDate = new Date(calendarMonthDate.getFullYear(), calendarMonthDate.getMonth(), 1);
  renderDateRangeCalendar();
  positionDateRangeCalendar(trigger);
}
function closeDateRangeCalendar(){
  const pop = $('dateRangeCalendar');
  if(pop) pop.classList.add('hidden');
  activeDateRangeTrigger = null;
  activeCalendarField = null;
  activeCalendarScope = null;
}
function setCalendarDate(value){
  if(activeCalendarScope === 'addlead'){
    const input = document.getElementById(activeCalendarField);
    if(input){
      input.value = value ? formatDateDisplay(value) : '';
      // Notify listeners (e.g., DOB → child age handler) of the programmatic update
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    closeDateRangeCalendar();
    return;
  }
  if(!activeCalendarField) return;
  pending[activeCalendarField] = value || '';
  if(activeCalendarScope) updateDateTextField(activeCalendarField, activeCalendarScope);
  updateContextualSaveButton();
  closeDateRangeCalendar();
}
function clearDateRangeCalendar(){
  setCalendarDate('');
}

function renderFilterGroups(targetEl){
  const container = targetEl || $('filterGroups');
  if(!container) return;
  const isDrawer = container.id === 'drawerFilterGroups';
  const scope = isDrawer ? 'drawer' : 'side';
  // Both desktop sidebar and drawer use the same collapsible accordion pattern with shared openFilterPanels state
  container.innerHTML = getActiveFilterConfig().map(group => {
    const open = openFilterPanels.has(group.key);
    return `
    <div class="min-w-[190px] rounded-xl border border-[#E2E8F0] bg-white">
      <button type="button" data-filter-toggle="${esc(group.key)}" data-filter-scope="${scope}" class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${open?'bg-[#EFF4FF] text-[#284CA5]':'text-[#334155] hover:bg-[#EFF4FF] hover:text-[#284CA5]'}">
        <span>${esc(group.label)}</span><svg class="h-4 w-4 text-[#64748B] transition ${open?'rotate-180':''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div data-filter-panel="${esc(group.key)}" data-filter-scope="${scope}" class="${open?'':'hidden '}space-y-1 border-t border-[#EEF2F7] p-[10px]">
        ${group.type === 'search' ? `<input data-filter-key="${esc(group.key)}" data-filter-type="search" data-filter-scope="${scope}" type="search" value="${esc(pending[group.key])}" placeholder="${esc(group.placeholder || 'Search')}" class="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] text-[#334155] outline-none transition placeholder:text-[#64748B] focus:border-[#BFD3FF]" />` : group.type === 'dateRange' ? dateRangeFieldsHtml(scope) : group.type === 'date' ? `<input data-filter-key="${esc(group.key)}" data-filter-type="date" data-filter-scope="${scope}" type="date" value="${esc(pending[group.key])}" class="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] text-[#334155] outline-none transition focus:border-[#BFD3FF]" />` : group.items.map(item => {
          const checked = group.type === 'single' ? pending[group.key] === item : pending[group.key].includes(item);
          return `<label class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[13px] transition ${checked ? 'bg-[#DCE8FF] text-[#284CA5]' : 'text-[#0F172A] hover:bg-[#DCE8FF] hover:text-[#0F172A]'}">
            <input data-filter-key="${esc(group.key)}" data-filter-type="${esc(group.type)}" data-filter-scope="${scope}" value="${esc(item)}" type="${group.type === 'single' ? 'radio' : 'checkbox'}" name="filter-${esc(scope)}-${esc(group.key)}" ${checked?'checked':''} class="h-4 w-4 cursor-pointer rounded border-[#BFD3FF] accent-[#284CA5] focus:ring-[#284CA5]" />
            <span>${esc(item)}</span>
          </label>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
  container.querySelectorAll(`[data-filter-toggle][data-filter-scope="${scope}"]`).forEach(btn=>btn.addEventListener('click',()=>{
    const key = btn.dataset.filterToggle;
    if(openFilterPanels.has(key)) openFilterPanels.delete(key); else openFilterPanels.add(key);
    // Sync open/closed state across both scopes (desktop + drawer) so they stay consistent
    renderAllFilterGroups();
  }));
  container.querySelectorAll(`[data-filter-key][data-filter-scope="${scope}"]`).forEach(input=>{
    const eventName = (input.dataset.filterType === 'search' || input.dataset.filterType === 'date' || input.dataset.filterType === 'dateText') ? 'input' : 'change';
    input.addEventListener(eventName,()=>{
      const key = input.dataset.filterKey;
      if(input.dataset.filterType === 'dateText') {
        const formatted = formatDateTyping(input.value);
        input.value = formatted;
        pending[key] = formatted.length === 10 ? parseDateDisplay(formatted) : '';
        const native = input.parentElement ? input.parentElement.querySelector('input[type="date"]') : null;
        if(native) native.value = pending[key] || '';
      }
      else if(input.dataset.filterType === 'dateNative') {
        pending[key] = input.value;
        const text = input.parentElement ? input.parentElement.querySelector('[data-filter-type="dateText"]') : null;
        if(text) text.value = formatDateDisplay(input.value || '');
      }
      else if(input.dataset.filterType === 'search' || input.dataset.filterType === 'date') pending[key] = input.value;
      else if(input.dataset.filterType === 'single') pending[key] = input.checked ? input.value : '';
      else pending[key] = input.checked ? [...pending[key], input.value] : pending[key].filter(v=>v!==input.value);
      if(key === 'qualification') normalizeDependentFilters();
      if(input.dataset.filterType === 'search') { if($('topSearch')) $('topSearch').value = input.value; if($('sideSearch')) $('sideSearch').value = input.value; if($('drawerSearch')) $('drawerSearch').value = input.value; }
      updateContextualSaveButton();
      if(input.dataset.filterType !== 'search' && input.dataset.filterType !== 'date' && input.dataset.filterType !== 'dateText') renderAllFilterGroups();
    });
  });
}

function renderAllFilterGroups(){
  renderFilterGroups($('filterGroups'));
  if($('drawerFilterGroups') && !$('filtersOverlay').classList.contains('hidden')) renderFilterGroups($('drawerFilterGroups'));
}

function updateBulkBarLayout(){
  const bar = $('bulkBar');
  const panel = $('contentPanel');
  if(!bar || !panel) return;
  const rect = panel.getBoundingClientRect();
  bar.style.left = `${rect.left}px`;
  bar.style.right = 'auto';
  bar.style.width = `${rect.width}px`;
}
function syncSelectionUI(data){
  updateBulkBarLayout();
  const total = data.length;
  const totalSelected = selectedIds.size;
  const allGlobalSelected = total > 0 && data.every(r => selectedIds.has(String(r.id)));

  // ── Table select-all header checkbox ──────────────────────────────
  const tablePageNum = Math.max(1, Math.min(tablePage, Math.ceil(total / PAGE_SIZE) || 1));
  const tableStart = (tablePageNum - 1) * PAGE_SIZE;
  const tablePageData = data.slice(tableStart, tableStart + PAGE_SIZE);
  const tablePageIds = tablePageData.map(r=>String(r.id));
  const tableSelectedOnPage = tablePageIds.filter(id=>selectedIds.has(id)).length;
  if($('selectAllTable')){
    $('selectAllTable').checked = tablePageIds.length > 0 && tableSelectedOnPage === tablePageIds.length;
    $('selectAllTable').indeterminate = tableSelectedOnPage > 0 && tableSelectedOnPage < tablePageIds.length;
    // Also show checked (not indeterminate) when ALL records globally selected
    if(allGlobalSelected){ $('selectAllTable').checked = true; $('selectAllTable').indeterminate = false; }
  }

  // ── Map select-all header checkbox ────────────────────────────────
  const mapPageNum = Math.max(1, Math.min(mapPage, Math.ceil(total / PAGE_SIZE) || 1));
  const mapStart = (mapPageNum - 1) * PAGE_SIZE;
  const mapPageData = data.slice(mapStart, mapStart + PAGE_SIZE);
  const mapPageIds = mapPageData.map(r=>String(r.id));
  const mapSelectedOnPage = mapPageIds.filter(id=>selectedIds.has(id)).length;
  if($('selectAllMap')){
    $('selectAllMap').checked = mapPageIds.length > 0 && mapSelectedOnPage === mapPageIds.length;
    $('selectAllMap').indeterminate = mapSelectedOnPage > 0 && mapSelectedOnPage < mapPageIds.length;
    if(allGlobalSelected){ $('selectAllMap').checked = true; $('selectAllMap').indeterminate = false; }
  }

  // ── Kanban column checkboxes ───────────────────────────────────────
  const kanbanSelectionData = currentView === 'kanban' ? getKanbanDisplayedData(data) : data;
  document.querySelectorAll('[data-status-select]').forEach(cb=>{
    const sRows = kanbanSelectionData.filter(r=>r.st === cb.dataset.statusSelect).map(r=>String(r.id));
    const count = sRows.filter(id=>selectedIds.has(id)).length;
    cb.checked = sRows.length>0 && count === sRows.length;
    cb.indeterminate = count > 0 && count < sRows.length;
  });

  // ── Selection counts ───────────────────────────────────────────────
  if($('bulkCount')) $('bulkCount').textContent = totalSelected;
  if($('inlineBulkCount')) $('inlineBulkCount').textContent = totalSelected;

  // ── "Select All" button: disable (dim) when all records already selected ─
  ['selectAllGlobalBtn','inlineSelectAllGlobalBtn'].forEach(id=>{
    const btn = $(id);
    if(!btn) return;
    if(allGlobalSelected){
      btn.disabled = true;
      btn.classList.add('opacity-40','cursor-not-allowed');
    } else {
      btn.disabled = false;
      btn.classList.remove('opacity-40','cursor-not-allowed');
    }
  });

  // ── Show/hide bulk bar and inline bulk header ──────────────────────
  if($('normalHeaderCopy')) $('normalHeaderCopy').classList.toggle('hidden', totalSelected > 0);
  if($('inlineBulkHeader')) {
    $('inlineBulkHeader').classList.toggle('hidden', totalSelected === 0);
    $('inlineBulkHeader').classList.toggle('flex', totalSelected > 0);
  }
  if($('normalToolbarActions')) $('normalToolbarActions').classList.toggle('hidden', totalSelected > 0);
  if($('inlineBulkActions')) {
    $('inlineBulkActions').classList.toggle('hidden', totalSelected === 0);
    $('inlineBulkActions').classList.toggle('flex', totalSelected > 0);
  }
}

function renderPager(targetId, pageVar, total){
  const el = $(targetId);
  if(!el) return;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(pageVar, totalPages);
  const startItem = Math.min((page - 1) * PAGE_SIZE + 1, total);
  const endItem   = Math.min(page * PAGE_SIZE, total);
  const isTable = (targetId === 'tablePager');
  const countText = total > 0 ? `${startItem}–${endItem} of ${total}` : '0 records';
  // Compact layout: count text + ~20px gap + < P > controls — all right-aligned
  el.innerHTML = `
    <span class="text-[13px] text-[#64748B]">Showing ${countText}</span>
    <div class="flex items-center gap-1">
      <button type="button" data-goto-page="${page - 1}" data-pager="${targetId}" class="grid h-8 w-8 place-items-center rounded-lg border border-[#D7E4FF] bg-white text-[#64748B] transition hover:bg-[#EFF4FF] hover:text-[#284CA5] ${page <= 1 ? 'pointer-events-none opacity-40' : ''}" aria-label="Previous page">‹</button>
      <span class="grid h-8 min-w-[2rem] place-items-center rounded-lg border border-[#284CA5] bg-[#284CA5] px-2 text-xs font-semibold text-white">${page}</span>
      <button type="button" data-goto-page="${page + 1}" data-pager="${targetId}" class="grid h-8 w-8 place-items-center rounded-lg border border-[#D7E4FF] bg-white text-[#64748B] transition hover:bg-[#EFF4FF] hover:text-[#284CA5] ${page >= totalPages ? 'pointer-events-none opacity-40' : ''}" aria-label="Next page">›</button>
    </div>`;
  // Bind page click handlers — briefly show pagination skeleton for smooth page-change feel
  el.querySelectorAll('[data-goto-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dest = Number(btn.dataset.gotoPage);
      if(dest < 1 || dest > totalPages) return;
      showPaginationSkeleton();
      if(isTable){ tablePage = dest; }
      else        { mapPage   = dest; }
      setTimeout(()=>{ renderAll(); }, 300);
    });
  });
}

function renderTable(data){
  const total = data.length;
  tablePage = Math.max(1, Math.min(tablePage, Math.ceil(total / PAGE_SIZE) || 1));
  const start = (tablePage - 1) * PAGE_SIZE;
  const pageData = data.slice(start, start + PAGE_SIZE);
  document.querySelectorAll('[data-col-head]').forEach(th=>th.classList.toggle('hidden', !visibleColumns.includes(th.dataset.colHead)));

  // Empty-state handling
  if(total === 0){
    const hasFilters = applied.status.length || applied.gradeApplied.length || applied.acadYear.length || applied.distance.length || applied.source.length || applied.query || applied.fromDate || applied.toDate;
    const emptyIcon = hasFilters
      ? `<svg class="mx-auto mb-3 h-10 w-10 text-[#CBD5E1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`
      : `<svg class="mx-auto mb-3 h-10 w-10 text-[#CBD5E1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    const emptyTitle = hasFilters ? 'No matching results' : (applications.length === 0 ? 'No enquiries yet' : 'No enquiries found');
    const emptyDesc  = hasFilters ? 'Try adjusting or clearing your filters to see more results.' : (applications.length === 0 ? 'Add your first admission enquiry using the "New Enquiry" button.' : 'No data available for the current view.');
    $('tableBody').innerHTML = `<tr><td colspan="20"><div class="flex flex-col items-center justify-center py-16 text-center">${emptyIcon}<p class="text-[15px] font-semibold text-[#334155]">${emptyTitle}</p><p class="mt-1 text-[13px] text-[#64748B]">${emptyDesc}</p></div></td></tr>`;
    const mobileCards = $('tableCardsMobile');
    if(mobileCards) mobileCards.innerHTML = `<div class="flex flex-col items-center justify-center py-14 text-center">${emptyIcon}<p class="text-[15px] font-semibold text-[#334155]">${emptyTitle}</p><p class="mt-1 text-[13px] text-[#64748B]">${emptyDesc}</p></div>`;
    renderPager('tablePager', 1, 0);
    updateSortIcons();
    return;
  }

  $('tableBody').innerHTML = pageData.map(r => {
    const sel = selectedIds.has(String(r.id));
    return `<tr data-row-id="${r.id}" class="cursor-pointer transition ${sel ? 'bg-[#DCE8FF] hover:bg-[#DCE8FF]' : 'hover:bg-[#EFF4FF]'}">
      <td class="border-b border-[#E2E8F0] px-3 py-3 align-middle">${checkboxHtml(r.id, 'Select ' + r.n)}</td>
      <td class="${colHidden('candidate')} border-b border-[#E2E8F0] px-3 py-3"><div><div class="font-semibold text-[#0F172A]">${esc(r.n)}</div>${statusHtml(r.st)}</div></td>
      <td class="${colHidden('phone')} border-b border-[#E2E8F0] px-3 py-3 text-[#334155]"><div class="flex w-[150px] items-center justify-between gap-3"><span class="min-w-[92px] tabular-nums">${esc(r.p)}</span>${contactIconsHtml(sel)}</div></td>
      <td class="${colHidden('specialization')} border-b border-[#E2E8F0] px-3 py-3 text-[#334155]">${esc(r.s)}</td>
      <td class="${colHidden('gradeApplied')} border-b border-[#E2E8F0] px-3 py-3 text-[#334155]">${esc(r.gradeApplied||'—')}</td>
      <td class="${colHidden('date')} border-b border-[#E2E8F0] px-3 py-3 text-[#334155]">${esc(r.d)}</td>
      <td class="${colHidden('exp')} border-b border-[#E2E8F0] px-3 py-3 text-[#334155]">${esc(r.e)}</td>
      <td class="${colHidden('distance')} border-b border-[#E2E8F0] px-3 py-3 text-[#334155]">${esc(r.dist)}</td>
      <td class="${colHidden('travelPref')} border-b border-[#E2E8F0] px-3 py-3 text-[#334155]">${esc(r.distanceTravel||'—')}</td>
      <td class="${colHidden('source')} border-b border-[#E2E8F0] px-3 py-3 text-[#334155]">${esc(r.source)}</td>
    </tr>`;
  }).join('');
  renderMobileCards(pageData);
  renderPager('tablePager', tablePage, total);
  updateSortIcons();
}

function renderMobileCards(data){
  const el = $('tableCardsMobile');
  if(!el) return;
  if(!data.length){
    el.innerHTML = `<div class="flex min-h-[200px] items-center justify-center px-4 py-12 text-center text-[13px] text-[#64748B]">No enquiries match your filters</div>`;
    return;
  }
  // Reuse the same card row as the Map left-side list for visual consistency
  el.innerHTML = data.map(mapCardRowHtml).join('');
}

function renderKanban(data){
  const activeStatuses = statusList.filter(s => visibleStatuses.includes(s));
  const extraData = getFilteredKanbanExtra();
  const visibleData = getKanbanDisplayedData(data);
  const canLoadMore = kanbanBatch === 1 && extraData.length > 0;
  $('kanbanBoard').className = 'flex min-w-full flex-nowrap gap-3';
  $('kanbanBoard').innerHTML = activeStatuses.map(st => {
    const items = visibleData.filter(r => r.st === st);
    const ids = items.map(r=>String(r.id));
    const selectedCount = ids.filter(id=>selectedIds.has(id)).length;
    const checked = ids.length>0 && selectedCount === ids.length ? 'checked' : '';
    const countLabel = selectedCount > 0 ? `${selectedCount}/${items.length}` : `${items.length}`;
    return `<section class="flex min-h-[420px] w-[200px] min-w-[200px] flex-none flex-col">
      <div class="flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold whitespace-nowrap ${kanbanHeaderClass(st)}">
        <label class="flex min-w-0 items-center gap-2"><input data-status-select="${esc(st)}" type="checkbox" ${checked} class="h-4 w-4 cursor-pointer rounded border-[#BFD3FF] accent-[#284CA5] focus:ring-[#284CA5]" aria-label="Select ${esc(st)} enquiries" /><span class="truncate">${esc(statusDisplayLabel(st))}</span></label>
        <span class="shrink-0 rounded-full border px-2 py-0.5 text-[11px] whitespace-nowrap ${kanbanBadgeClass(st)}">${countLabel}</span>
      </div>
      <div data-kanban-col-scroll class="min-h-0 flex-1 space-y-2 overflow-y-auto pt-2 scroll-smooth">
        ${items.length ? items.map(r => {
          const kSel = selectedIds.has(String(r.id));
          return `<article data-row-id="${r.id}" class="cursor-pointer rounded-xl border p-3 transition ${kSel ? 'border-[#91B2FF] bg-[#DCE8FF] shadow-[0_3px_10px_rgba(40,76,165,0.14)]' : 'border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] hover:bg-[#EFF4FF] hover:shadow-[0_3px_10px_rgba(15,23,42,0.08)]'}">
          <div class="flex items-start gap-2.5"><div class="pt-1">${checkboxHtml(r.id, 'Select ' + r.n)}</div><div class="min-w-0 flex-1"><div class="truncate text-[13px] font-semibold text-[#0F172A]">${esc(r.n)}</div><div class="mt-0.5 flex w-full items-center justify-between gap-2 text-[11px] text-[#64748B] whitespace-nowrap"><span class="shrink-0">${esc(r.p)}</span>${contactIconsHtml(kSel)}</div></div></div>
          <div class="mt-3 space-y-1.5 text-xs text-[#334155] whitespace-nowrap"><div class="truncate font-medium">${esc(r.gradeApplied||'—')}</div><div class="truncate">${esc(r.s)}</div><div class="truncate">${esc(r.e)}</div></div>
          <div class="mt-3 flex items-center justify-between gap-4 border-t border-[#EEF2F7] pt-2 text-[11px] text-[#64748B] whitespace-nowrap"><span>${esc(r.d)}</span><span>${esc(r.dist)}</span></div>
        </article>`;
        }).join('') : `<div class="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-[#BFD3FF] bg-[#F1F6FF] px-3 py-4 text-center text-[12px] font-medium text-[#64748B] whitespace-nowrap">No enquiries</div>`}
      </div>
    </section>`;
  }).join('');
  // Toggle dedicated loader element below the board
  const loaderEl = $('kanbanLoader');
  if(loaderEl){
    loaderEl.classList.toggle('hidden', !kanbanLoading);
    loaderEl.classList.toggle('flex', kanbanLoading);
  }
  const scrollEl = $('kanbanScroll');
  if(scrollEl){ scrollEl.dataset.canLoadMore = canLoadMore ? 'true' : 'false'; }
  // Bind scroll listeners on each column for infinite scroll trigger
  if(typeof attachKanbanColumnScrollListeners === 'function') attachKanbanColumnScrollListeners();
}

function mapCardRowHtml(r, i){
  const mSel = selectedIds.has(String(r.id));
  return `<div data-row-id="${r.id}" class="flex cursor-pointer items-start gap-3 border-b border-[#EEF2F7] px-4 py-3 transition ${mSel ? 'bg-[#DCE8FF]' : (i===1?'bg-[#F1F6FF]':'bg-white hover:bg-[#EFF4FF]')}"><span class="hidden md:inline-flex items-center">${checkboxHtml(r.id, 'Select ' + r.n)}</span><div class="min-w-0 flex-1"><div class="truncate text-[13px] font-semibold text-[#0F172A]">${esc(r.n)}</div><div class="mt-0.5 flex items-center justify-between gap-2"><span class="truncate text-[11px] text-[#64748B]">${esc(r.s)} · ${esc(r.gradeApplied||'—')}</span>${contactIconsHtml(mSel)}</div><div class="mt-0.5 truncate text-[11px] text-[#64748B]"><span class="font-semibold text-[#284CA5]">${esc(r.st)}</span> · ${esc(r.e)} · ${esc(r.dist)}</div></div></div>`;
}

function renderMap(data){
  const total = data.length;
  mapPage = Math.max(1, Math.min(mapPage, Math.ceil(total / PAGE_SIZE) || 1));
  const start = (mapPage - 1) * PAGE_SIZE;
  const pageData = data.slice(start, start + PAGE_SIZE);
  $('mapCount').textContent = `${total} Enquir${total === 1 ? 'y' : 'ies'}`;

  if(total === 0){
    const hasFilters = applied.status.length || applied.gradeApplied.length || applied.acadYear.length || applied.distance.length || applied.source.length || applied.query || applied.fromDate || applied.toDate;
    const emptyTitle = hasFilters ? 'No matching results' : 'No enquiries found';
    const emptyDesc  = hasFilters ? 'Try adjusting or clearing your filters.' : 'Add a new enquiry to see it here.';
    $('mapList').innerHTML = `<div class="flex flex-col items-center justify-center py-10 text-center"><svg class="mx-auto mb-3 h-9 w-9 text-[#CBD5E1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><p class="text-[14px] font-semibold text-[#334155]">${emptyTitle}</p><p class="mt-1 text-[12px] text-[#64748B]">${emptyDesc}</p></div>`;
    $('mapPins').innerHTML = '';
    renderPager('mapPager', 1, 0);
    return;
  }

  $('mapList').innerHTML = pageData.map(mapCardRowHtml).join('');
  const posClasses = ['left-[46%] top-[18%]','left-[69%] top-[20%]','left-[82%] top-[26%]','left-[38%] top-[30%]','left-[54%] top-[39%]','left-[33%] top-[42%]','left-[48%] top-[55%]','left-[36%] top-[60%]','left-[58%] top-[75%]','left-[72%] top-[62%]','left-[28%] top-[82%]','left-[80%] top-[74%]'];
  renderPager('mapPager', mapPage, total);
  $('mapPins').innerHTML = pageData.map((r,i)=>`<div class="group absolute ${posClasses[i%posClasses.length]} -translate-x-1/2 -translate-y-full">
    <button type="button" class="grid h-4 w-4 place-items-center rounded-full border-[3px] border-white bg-[#284CA5] shadow-[0_2px_8px_rgba(40,76,165,0.24)] transition hover:scale-105" aria-label="${esc(r.n)}"></button>
    <div class="pointer-events-none absolute left-1/2 top-[-12px] z-20 w-64 -translate-x-1/2 -translate-y-full rounded-2xl border border-[#D7E4FF] bg-white p-3 opacity-0 shadow-[0_12px_32px_rgba(15,23,42,0.16)] transition duration-150 group-hover:opacity-100">
      <div class="min-w-0"><div class="truncate text-sm font-semibold text-[#0F172A]">${esc(r.n)}</div><div class="mt-1 flex items-center justify-between gap-2"><span class="truncate text-xs text-[#64748B]">${esc(r.s)} · ${esc(r.gradeApplied||'—')}</span>${contactIconsHtml()}</div><div class="mt-1 truncate text-xs text-[#64748B]"><span class="font-semibold text-[#284CA5]">${esc(r.st)}</span> · ${esc(r.e)} · ${esc(r.dist)}</div></div>
    </div>
  </div>`).join('');
}

function renderColumnsMenu(){
  const isKanban = currentView === 'kanban';
  $('columnsTitle').textContent = isKanban ? 'Visible statuses' : 'Visible columns';
  const options = isKanban ? statusList.map(s=>({key:s,label:statusDisplayLabel(s)})) : tableColumns;
  const selected = isKanban ? draftVisibleStatuses : draftVisibleColumns;
  $('columnsOptions').innerHTML = options.map(o => {
    const active = selected.includes(o.key);
    return `<label class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[13px] transition ${active ? 'bg-[#DCE8FF] text-[#284CA5]' : 'text-[#0F172A] hover:bg-[#DCE8FF] hover:text-[#0F172A]'}"><input data-col-option="${esc(o.key)}" type="checkbox" ${active?'checked':''} class="h-4 w-4 cursor-pointer rounded border-[#BFD3FF] accent-[#284CA5] focus:ring-[#284CA5]" /><span>${esc(o.label)}</span></label>`;
  }).join('');
  document.querySelectorAll('[data-col-option]').forEach(input=>input.addEventListener('change',()=>{
    const key = input.dataset.colOption;
    const list = isKanban ? draftVisibleStatuses : draftVisibleColumns;
    if(!input.checked && list.length <= 2){ input.checked = true; $('minMsg').classList.remove('hidden'); setTimeout(()=>$('minMsg').classList.add('hidden'),1800); return; }
    if(isKanban) draftVisibleStatuses = input.checked ? [...draftVisibleStatuses,key] : draftVisibleStatuses.filter(k=>k!==key);
    else draftVisibleColumns = input.checked ? [...draftVisibleColumns,key] : draftVisibleColumns.filter(k=>k!==key);
    renderColumnsMenu();
  }));
}


function updateColumnsButtonState(){
  const btn = $('columnsBtn');
  if(!btn) return;
  btn.className = 'inline-flex h-10 items-center gap-2 rounded-xl border border-[#D7E4FF] bg-white px-4 text-[13px] font-semibold text-[#284CA5] transition hover:bg-[#EFF4FF]';
}

function setView(view){
  currentView = view;
  if(view === 'kanban') kanbanBatch = 1; kanbanEndToastShown = false;
  document.querySelectorAll('.view-section').forEach(el=>{ el.classList.add('hidden'); el.classList.remove('flex'); });
  const activeView = $(`${view}View`);
  activeView.classList.remove('hidden'); activeView.classList.add('flex');
  document.querySelectorAll('.view-btn').forEach(btn=>{
    const active = btn.dataset.viewBtn === view;
    btn.className = active ? 'view-btn group relative grid h-8 w-8 place-items-center rounded-lg bg-[#284CA5] text-white transition' : 'view-btn group relative grid h-8 w-8 place-items-center rounded-lg text-[#64748B] transition hover:bg-[#EFF4FF] hover:text-[#284CA5]';
  });
  $('viewTitle').textContent = view === 'table' ? 'Admission Enquiries' : view === 'kanban' ? 'Admissions Pipeline' : 'Enquiry Map';
  $('viewSub').textContent = view === 'table' ? 'Review, filter, and manage parent admission enquiries.' : view === 'kanban' ? 'Track enquiries by admission status.' : 'View enquiry distribution by location.';
  const columnsWrap = $('columnsBtn') ? $('columnsBtn').closest('.relative') : null;
  if(columnsWrap) columnsWrap.style.display = (view === 'map') ? 'none' : '';
  if($('columnsBtnText')) $('columnsBtnText').textContent = view === 'kanban' ? 'Choose Status' : 'Choose Columns';
  updateColumnsButtonState();
  if(view === 'map') $('columnsMenu').classList.add('hidden');
  draftVisibleColumns = [...visibleColumns]; draftVisibleStatuses = [...visibleStatuses];
  renderColumnsMenu(); renderAll();
}
function renderAll(resetPages){
  if(resetPages){ tablePage = 1; mapPage = 1; }
  const data = getFiltered();
  renderTable(data); renderKanban(data); renderMap(data); syncSelectionUI(data);
}

function skeletonRowHtml(){
  return `<tr class="animate-pulse"><td class="border-b border-[#E2E8F0] px-3 py-3"><div class="h-4 w-4 rounded bg-[#E2E8F0]"></div></td><td class="border-b border-[#E2E8F0] px-3 py-3"><div class="h-4 w-28 rounded bg-[#E2E8F0]"></div></td><td class="border-b border-[#E2E8F0] px-3 py-3"><div class="h-4 w-24 rounded bg-[#E2E8F0]"></div></td><td class="border-b border-[#E2E8F0] px-3 py-3"><div class="h-4 w-20 rounded bg-[#E2E8F0]"></div></td><td class="border-b border-[#E2E8F0] px-3 py-3"><div class="h-4 w-20 rounded bg-[#E2E8F0]"></div></td><td class="border-b border-[#E2E8F0] px-3 py-3"><div class="h-4 w-16 rounded bg-[#E2E8F0]"></div></td><td class="border-b border-[#E2E8F0] px-3 py-3"><div class="h-4 w-10 rounded bg-[#E2E8F0]"></div></td><td class="border-b border-[#E2E8F0] px-3 py-3"><div class="h-4 w-14 rounded bg-[#E2E8F0]"></div></td><td class="border-b border-[#E2E8F0] px-3 py-3"><div class="h-4 w-16 rounded bg-[#E2E8F0]"></div></td></tr>`;
}
function skeletonCardHtml(){
  return `<div class="flex animate-pulse items-start gap-3 border-b border-[#EEF2F7] bg-white px-4 py-3"><div class="h-4 w-4 rounded bg-[#E2E8F0]"></div><div class="min-w-0 flex-1 space-y-2"><div class="h-4 w-32 rounded bg-[#E2E8F0]"></div><div class="h-3 w-48 rounded bg-[#E2E8F0]"></div><div class="h-3 w-36 rounded bg-[#E2E8F0]"></div></div></div>`;
}
function skeletonKanbanCardHtml(){
  return `<div class="animate-pulse rounded-xl border border-[#E2E8F0] bg-white p-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"><div class="mb-2 h-3 w-24 rounded bg-[#E2E8F0]"></div><div class="h-3 w-16 rounded bg-[#E2E8F0]"></div></div>`;
}
// ── Skeleton helpers ─────────────────────────────────────────────────
// Full-table skeleton — used only for initial load and pagination page changes
function showSkeleton(){
  if($('tableBody')) $('tableBody').innerHTML = Array(8).fill(skeletonRowHtml()).join('');
  const mobileCards = $('tableCardsMobile');
  if(mobileCards) mobileCards.innerHTML = Array(6).fill(skeletonCardHtml()).join('');
  const mapList = $('mapList');
  if(mapList) mapList.innerHTML = Array(6).fill(skeletonCardHtml()).join('');
  const board = $('kanbanBoard');
  if(board){
    board.innerHTML = statusList.map(st=>`<section class="flex min-h-[420px] w-[200px] min-w-[200px] flex-none flex-col"><div class="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFD] px-3 py-2.5"><div class="h-3 w-20 animate-pulse rounded bg-[#E2E8F0]"></div><div class="h-4 w-6 animate-pulse rounded-full bg-[#E2E8F0]"></div></div><div class="min-h-0 flex-1 space-y-2 pt-2">${Array(3).fill(skeletonKanbanCardHtml()).join('')}</div></section>`).join('');
  }
}
// Pagination skeleton — only replaces table/map body rows, keeps pager intact
function showPaginationSkeleton(){
  if($('tableBody')) $('tableBody').innerHTML = Array(PAGE_SIZE).fill(skeletonRowHtml()).join('');
  const mobileCards = $('tableCardsMobile');
  if(mobileCards) mobileCards.innerHTML = Array(Math.min(PAGE_SIZE, 6)).fill(skeletonCardHtml()).join('');
  const mapList = $('mapList');
  if(mapList) mapList.innerHTML = Array(Math.min(PAGE_SIZE, 6)).fill(skeletonCardHtml()).join('');
  const tablePager = $('tablePager'), mapPager = $('mapPager');
  if(tablePager) tablePager.innerHTML = `<span class="h-4 w-32 animate-pulse rounded bg-[#E2E8F0]"></span><div class="flex items-center gap-1"><span class="h-8 w-8 animate-pulse rounded-lg bg-[#E2E8F0]"></span><span class="h-8 w-8 animate-pulse rounded-lg bg-[#E2E8F0]"></span><span class="h-8 w-8 animate-pulse rounded-lg bg-[#E2E8F0]"></span></div>`;
  if(mapPager)   mapPager.innerHTML   = tablePager ? tablePager.innerHTML : '';
}
function showSkeletonThenRender(){
  showSkeleton();
  setTimeout(()=>{ renderAll(); updateFiltersBadge(); }, 2000);
}

renderAllFilterGroups(); renderSavedFilters(); renderColumnsMenu(); renderAll(); updateColumnsButtonState();
if($('closeDateRangeCalendar')) $('closeDateRangeCalendar').addEventListener('click', closeDateRangeCalendar);
if($('clearDateRangeCalendar')) $('clearDateRangeCalendar').addEventListener('click', clearDateRangeCalendar);
document.addEventListener('click',(e)=>{
  const calendarBtn = e.target.closest('[data-calendar-open]');
  if(calendarBtn){
    e.preventDefault();
    e.stopPropagation();
    openDateRangeCalendar(calendarBtn, calendarBtn.dataset.calendarOpen, calendarBtn.dataset.calendarScope || 'side');
    return;
  }
  const dayBtn = e.target.closest('[data-calendar-day]');
  if(dayBtn){
    e.preventDefault();
    setCalendarDate(dayBtn.dataset.calendarDay);
    return;
  }
  const pop=$('dateRangeCalendar');
  if(pop && !pop.classList.contains('hidden') && !pop.contains(e.target)) closeDateRangeCalendar();
});
if($('closeDateRangeCalendar')) $('closeDateRangeCalendar').addEventListener('click', closeDateRangeCalendar);
if($('clearDateRangeCalendar')) $('clearDateRangeCalendar').addEventListener('click', clearDateRangeCalendar);
if($('todayDateRangeCalendar')) $('todayDateRangeCalendar').addEventListener('click', ()=>setCalendarDate(dateToISO(new Date())));
if($('calendarPrevMonth')) $('calendarPrevMonth').addEventListener('click', (e)=>{ e.stopPropagation(); calendarMonthDate = new Date(calendarMonthDate.getFullYear(), calendarMonthDate.getMonth()-1, 1); renderDateRangeCalendar(); positionDateRangeCalendar(activeDateRangeTrigger); });
if($('calendarNextMonth')) $('calendarNextMonth').addEventListener('click', (e)=>{ e.stopPropagation(); calendarMonthDate = new Date(calendarMonthDate.getFullYear(), calendarMonthDate.getMonth()+1, 1); renderDateRangeCalendar(); positionDateRangeCalendar(activeDateRangeTrigger); });
if($('calendarMonthSelect')) $('calendarMonthSelect').addEventListener('change', (e)=>{ e.stopPropagation(); calendarMonthDate = new Date(calendarMonthDate.getFullYear(), Number(e.target.value), 1); renderDateRangeCalendar(); positionDateRangeCalendar(activeDateRangeTrigger); });
if($('calendarYearSelect')) $('calendarYearSelect').addEventListener('change', (e)=>{ e.stopPropagation(); calendarMonthDate = new Date(Number(e.target.value), calendarMonthDate.getMonth(), 1); renderDateRangeCalendar(); positionDateRangeCalendar(activeDateRangeTrigger); });
window.addEventListener('resize',()=>{ if(activeDateRangeTrigger) positionDateRangeCalendar(activeDateRangeTrigger); });
window.addEventListener('scroll',()=>{ if(activeDateRangeTrigger) positionDateRangeCalendar(activeDateRangeTrigger); }, true);
document.querySelectorAll('[data-view-btn]').forEach(btn => btn.addEventListener('click',()=>setView(btn.dataset.viewBtn)));
$('columnsBtn').addEventListener('click',()=>{ const opening = $('columnsMenu').classList.contains('hidden'); if(opening){ draftVisibleColumns = [...visibleColumns]; draftVisibleStatuses = [...visibleStatuses]; renderColumnsMenu(); } $('columnsMenu').classList.toggle('hidden'); });
$('closeColumns').addEventListener('click',()=>$('columnsMenu').classList.add('hidden'));
$('selectAllColumns').addEventListener('click',()=>{ if(currentView==='kanban') draftVisibleStatuses=[...statusList]; else draftVisibleColumns=tableColumns.map(c=>c.key); renderColumnsMenu(); });
$('applyColumns').addEventListener('click',()=>{ if(currentView==='kanban'){ visibleStatuses=[...draftVisibleStatuses]; kanbanBatch = 1; kanbanEndToastShown = false; } else visibleColumns=[...draftVisibleColumns]; renderAll(); renderColumnsMenu(); updateColumnsButtonState(); $('columnsMenu').classList.add('hidden'); });
$('applyBtn').addEventListener('click',()=>{ applied = JSON.parse(JSON.stringify(pending)); selectedIds.clear(); kanbanBatch = 1; kanbanEndToastShown = false; updateContextualSaveButton(); renderAll(true); });
$('resetBtn').addEventListener('click',()=>{ pending = {query:'', fromDate:'', toDate:'', status:[], gradeApplied:[], acadYear:[], distance:[], source:[]}; applied = JSON.parse(JSON.stringify(pending)); kanbanBatch = 1; kanbanEndToastShown = false; if($('sideSearch')) $('sideSearch').value=''; if($('topSearch')) $('topSearch').value=''; if($('drawerSearch')) $('drawerSearch').value=''; renderAllFilterGroups(); renderSavedFilters(); updateContextualSaveButton(); selectedIds.clear(); renderAll(); });
if($('saveFilterBtn')) $('saveFilterBtn').addEventListener('click', openSaveFilterModal);
if($('cancelSaveFilter')) $('cancelSaveFilter').addEventListener('click', closeSaveFilterModal);
if($('confirmSaveFilter')) $('confirmSaveFilter').addEventListener('click', saveCurrentFilter);
if($('saveFilterName')) $('saveFilterName').addEventListener('keydown',e=>{ if(e.key==='Enter') saveCurrentFilter(); if(e.key==='Escape') closeSaveFilterModal(); });
if($('saveFilterModal')) $('saveFilterModal').addEventListener('click',e=>{ if(e.target.id === 'saveFilterModal') closeSaveFilterModal(); });
if($('toggleSavedFilters')) $('toggleSavedFilters').addEventListener('click',()=>{
  const panel = $('savedFiltersPanel');
  const btn = $('toggleSavedFilters');
  if(!panel || !btn) return;
  const willOpen = panel.classList.contains('hidden');
  panel.classList.toggle('hidden', !willOpen);
  btn.setAttribute('aria-label', willOpen ? 'Close saved filters' : 'Saved filters');
});
if($('savedFiltersList')) $('savedFiltersList').addEventListener('click',e=>{
  const del = e.target.closest('[data-delete-saved-filter]');
  if(del){ e.stopPropagation(); deleteSavedFilter(del.dataset.deleteSavedFilter); return; }
  const saved = e.target.closest('[data-saved-filter]');
  if(saved) applySavedFilter(saved.dataset.savedFilter);
});
if($('sideSearch')) $('sideSearch').addEventListener('input',e=>{ pending.query=e.target.value; if($('topSearch')) $('topSearch').value=e.target.value; if($('drawerSearch')) $('drawerSearch').value=e.target.value; updateContextualSaveButton(); });
if($('clearSideSearch')) $('clearSideSearch').addEventListener('click',()=>{ pending.query=''; if($('sideSearch')) $('sideSearch').value=''; if($('topSearch')) $('topSearch').value=''; if($('drawerSearch')) $('drawerSearch').value=''; updateContextualSaveButton(); });
if($('topSearch')) $('topSearch').addEventListener('input',e=>{ pending.query=e.target.value; if($('sideSearch')) $('sideSearch').value=e.target.value; if($('drawerSearch')) $('drawerSearch').value=e.target.value; updateContextualSaveButton(); });
document.querySelectorAll('[data-sort-key]').forEach(head=>head.addEventListener('click',()=>{
  const key = head.dataset.sortKey;
  sortState = sortState.key === key ? {key, dir: sortState.dir === 'asc' ? 'desc' : sortState.dir === 'desc' ? null : 'asc'} : {key, dir:'asc'};
  if(!sortState.dir) sortState = {key:null, dir:null};
  renderAll(true); // reset to page 1 on sort change
}));
$('collapseBtn').addEventListener('click',()=>{
  sidebarCollapsed = !sidebarCollapsed;
  $('sidebar').className = sidebarCollapsed ? 'z-30 hidden max-h-[59px] w-full shrink-0 flex-col overflow-visible rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all duration-200 xl:flex xl:h-full xl:max-h-none xl:w-[52px]' : 'z-30 hidden max-h-[46vh] w-full shrink-0 flex-col rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all duration-200 xl:flex xl:h-full xl:max-h-none xl:w-[236px]';
  $('sidebarHeader').className = sidebarCollapsed ? 'flex items-center justify-center border-b border-[#EEF2F7] p-[10px]' : 'relative flex items-center justify-between border-b border-[#EEF2F7] p-[10px]';
  // Toggle sidebar-copy elements.
  // savedFiltersPanel is sidebar-copy but has its OWN hidden state managed by toggleSavedFilters.
  // When collapsing: hide everything (including savedFiltersPanel).
  // When expanding: restore non-panel elements, but leave savedFiltersPanel as-is so it
  // doesn't appear unless the user explicitly opens it.
  document.querySelectorAll('.sidebar-copy').forEach(el=>{
    if(el.id === 'savedFiltersPanel'){
      if(sidebarCollapsed) el.classList.add('hidden'); // always hide on collapse
      // on expand: intentionally do nothing — preserves panel's own closed/open state
    } else {
      el.classList.toggle('hidden', sidebarCollapsed);
    }
  });
  const collapsedBtns = $('sidebarCollapsedBtns');
  if(collapsedBtns) collapsedBtns.classList.toggle('hidden', !sidebarCollapsed);
  if(sidebarCollapsed && collapsedBtns) collapsedBtns.classList.add('flex');
  if(!sidebarCollapsed && collapsedBtns) collapsedBtns.classList.remove('flex');
});

// ── Collapsed sidebar quick-action buttons ─────────────────────────
// Filters → expand sidebar only (no saved-filters panel)
if($('collapsedExpandFiltersBtn')) $('collapsedExpandFiltersBtn').addEventListener('click', ()=>{
  if(sidebarCollapsed) $('collapseBtn').click();
  // Ensure saved filters panel stays closed
  const panel = $('savedFiltersPanel');
  if(panel && !panel.classList.contains('hidden')) panel.classList.add('hidden');
});

// Saved Filters → expand sidebar AND open the saved filters panel
if($('collapsedSavedFiltersExpandBtn')) $('collapsedSavedFiltersExpandBtn').addEventListener('click', ()=>{
  if(sidebarCollapsed) $('collapseBtn').click();
  // collapseBtn expansion preserves panel state (hidden); open it explicitly now
  setTimeout(()=>{
    const panel = $('savedFiltersPanel');
    if(panel && panel.classList.contains('hidden')) $('toggleSavedFilters').click();
  }, 0);
});

// Search → expand sidebar and immediately focus the search input
if($('collapsedSearchBtn')) $('collapsedSearchBtn').addEventListener('click', ()=>{
  if(sidebarCollapsed) $('collapseBtn').click();
  // Ensure saved filters panel stays closed
  const panel = $('savedFiltersPanel');
  if(panel && !panel.classList.contains('hidden')) panel.classList.add('hidden');
  // Focus search input; brief timeout ensures the sidebar is visible and search rendered
  setTimeout(()=>{
    const searchEl = $('sideSearch');
    if(searchEl){ searchEl.focus(); searchEl.select(); }
  }, 50);
});
document.addEventListener('change',(e)=>{
  const item = e.target.closest('[data-select-id]');
  if(item){ item.checked ? selectedIds.add(String(item.dataset.selectId)) : selectedIds.delete(String(item.dataset.selectId)); renderAll(); return; }
  if(e.target && (e.target.id === 'selectAllTable' || e.target.id === 'selectAllMap')){
    const data = getFiltered();
    const total = data.length;
    // Determine which page's records to select
    if(e.target.id === 'selectAllTable'){
      const page = Math.max(1, Math.min(tablePage, Math.ceil(total / PAGE_SIZE) || 1));
      const start = (page - 1) * PAGE_SIZE;
      const pageData = data.slice(start, start + PAGE_SIZE);
      if(e.target.checked) pageData.forEach(r=>selectedIds.add(String(r.id)));
      else pageData.forEach(r=>selectedIds.delete(String(r.id)));
    } else {
      const page = Math.max(1, Math.min(mapPage, Math.ceil(total / PAGE_SIZE) || 1));
      const start = (page - 1) * PAGE_SIZE;
      const pageData = data.slice(start, start + PAGE_SIZE);
      if(e.target.checked) pageData.forEach(r=>selectedIds.add(String(r.id)));
      else pageData.forEach(r=>selectedIds.delete(String(r.id)));
    }
    renderAll(); return;
  }
  const statusCb = e.target.closest('[data-status-select]');
  if(statusCb){ const data = getKanbanDisplayedData(getFiltered()).filter(r=>r.st === statusCb.dataset.statusSelect); if(statusCb.checked) data.forEach(r=>selectedIds.add(String(r.id))); else data.forEach(r=>selectedIds.delete(String(r.id))); renderAll(); }
});
if($('clearSelectionText')) $('clearSelectionText').addEventListener('click',()=>{ selectedIds.clear(); renderAll(); });
if($('inlineClearSelectionText')) $('inlineClearSelectionText').addEventListener('click',()=>{ selectedIds.clear(); renderAll(); });
// "Select all N records" — selects every record in the filtered dataset across all pages
function handleSelectAllGlobal(){
  const data = getFiltered();
  data.forEach(r => selectedIds.add(String(r.id)));
  renderAll();
}
if($('selectAllGlobalBtn')) $('selectAllGlobalBtn').addEventListener('click', handleSelectAllGlobal);
if($('inlineSelectAllGlobalBtn')) $('inlineSelectAllGlobalBtn').addEventListener('click', handleSelectAllGlobal);
if($('inlineUpdateStatusBtn')) $('inlineUpdateStatusBtn').addEventListener('click', openStatusUpdateModal);

function tryTriggerKanbanLoadMore(el){
  if(currentView !== 'kanban' || kanbanLoading) return;
  // If all data already loaded, show "reached end" toast once on the next near-bottom scroll
  if(kanbanBatch > 1){
    if(!kanbanEndToastShown && el.scrollTop + el.clientHeight >= el.scrollHeight - 40){
      kanbanEndToastShown = true;
      showToast("You've reached the end.", 'info');
    }
    return;
  }
  const scrollEl = $('kanbanScroll');
  if(!scrollEl || scrollEl.dataset.canLoadMore !== 'true') return;
  // Near-bottom check: trigger when within 40px of the column's bottom edge
  if(el.scrollTop + el.clientHeight >= el.scrollHeight - 40){
    kanbanLoading = true;
    renderAll();
    // Show loading spinner for ~2 seconds, then reveal additional cards
    setTimeout(()=>{ kanbanBatch = 2; kanbanLoading = false; renderAll(); }, 2000);
  }
}
function attachKanbanColumnScrollListeners(){
  document.querySelectorAll('[data-kanban-col-scroll]').forEach(col=>{
    if(col.dataset.scrollBound === '1') return;
    col.dataset.scrollBound = '1';
    col.addEventListener('scroll', ()=>tryTriggerKanbanLoadMore(col));
  });
}
// Outer kanbanScroll: only trigger load-more on VERTICAL scroll.
// Horizontal lane scrolling should never trigger infinite loading.
let _lastKanbanScrollTop = 0;
if($('kanbanScroll')) $('kanbanScroll').addEventListener('scroll', ()=>{
  const el = $('kanbanScroll');
  const newTop = el.scrollTop;
  const scrolledVertically = newTop !== _lastKanbanScrollTop;
  _lastKanbanScrollTop = newTop;
  // Guard: skip if this scroll event came from horizontal movement only
  if(scrolledVertically) tryTriggerKanbanLoadMore(el);
});

document.addEventListener('click',(e)=>{
  if($('columnsMenu') && !$('columnsMenu').contains(e.target) && !$('columnsBtn').contains(e.target)) $('columnsMenu').classList.add('hidden');
});

// ============================================================
// Mobile/Tablet Filters Drawer (< 1280px)
// ============================================================
function countActiveAppliedFilters(){
  let count = 0;
  if(applied.query && applied.query.trim()) count++;
  if(applied.fromDate || applied.toDate) count++;
  ['status','gradeApplied','acadYear','distance','source'].forEach(k=>{ if(applied[k] && applied[k].length) count++; });
  return count;
}
function updateFiltersBadge(){
  const btn = $('openFiltersDrawer');
  if(!btn) return;
  const active = countActiveAppliedFilters() > 0;
  if(active){
    btn.classList.remove('border-[#D7E4FF]','bg-white','text-[#284CA5]','hover:bg-[#EFF4FF]');
    btn.classList.add('border-[#284CA5]','bg-[#284CA5]','text-white','hover:bg-[#3659C3]');
  } else {
    btn.classList.remove('border-[#284CA5]','bg-[#284CA5]','text-white','hover:bg-[#3659C3]');
    btn.classList.add('border-[#D7E4FF]','bg-white','text-[#284CA5]','hover:bg-[#EFF4FF]');
  }
}
function updateDrawerSaveButton(){
  const btn = $('drawerSaveFilterBtn');
  if(!btn) return;
  btn.classList.toggle('hidden', !hasAnyPendingFilter() || isPendingFilterAlreadySaved());
}
// Wrap updateContextualSaveButton to also refresh drawer-side save button visibility
const _origUpdateContextualSaveButton = updateContextualSaveButton;
updateContextualSaveButton = function(){ _origUpdateContextualSaveButton(); updateDrawerSaveButton(); };

function openFiltersDrawer(){
  const overlay = $('filtersOverlay');
  const backdrop = $('filtersBackdrop');
  const drawer = $('filtersDrawer');
  if(!overlay || !backdrop || !drawer) return;
  // Sync pending with currently-applied state so the drawer always opens in a consistent state
  pending = cloneFilters(applied);
  if($('drawerSearch')) $('drawerSearch').value = pending.query || '';
  renderFilterGroups($('drawerFilterGroups'));
  renderSavedFilters();
  updateDrawerSaveButton();
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.body.style.overflow = 'hidden';
  // Trigger transitions on next frame
  requestAnimationFrame(()=>{
    backdrop.classList.remove('opacity-0');
    backdrop.classList.add('opacity-100');
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
  });
}
function closeFiltersDrawer(){
  const overlay = $('filtersOverlay');
  const backdrop = $('filtersBackdrop');
  const drawer = $('filtersDrawer');
  if(!overlay || !backdrop || !drawer) return;
  backdrop.classList.add('opacity-0');
  backdrop.classList.remove('opacity-100');
  drawer.classList.add('translate-x-full');
  drawer.classList.remove('translate-x-0');
  setTimeout(()=>{
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    document.body.style.overflow = '';
  }, 200);
}

if($('openFiltersDrawer')) $('openFiltersDrawer').addEventListener('click', openFiltersDrawer);
if($('closeFiltersDrawer')) $('closeFiltersDrawer').addEventListener('click', closeFiltersDrawer);
if($('filtersBackdrop')) $('filtersBackdrop').addEventListener('click', closeFiltersDrawer);
document.addEventListener('keydown',(e)=>{ if(e.key === 'Escape' && $('filtersOverlay') && !$('filtersOverlay').classList.contains('hidden')) closeFiltersDrawer(); });

if($('drawerSearch')) $('drawerSearch').addEventListener('input',e=>{ pending.query=e.target.value; if($('sideSearch')) $('sideSearch').value=e.target.value; if($('topSearch')) $('topSearch').value=e.target.value; updateContextualSaveButton(); });
if($('clearDrawerSearch')) $('clearDrawerSearch').addEventListener('click',()=>{ pending.query=''; if($('drawerSearch')) $('drawerSearch').value=''; if($('sideSearch')) $('sideSearch').value=''; if($('topSearch')) $('topSearch').value=''; updateContextualSaveButton(); });

if($('drawerApplyBtn')) $('drawerApplyBtn').addEventListener('click',()=>{
  applied = JSON.parse(JSON.stringify(pending));
  selectedIds.clear();
  kanbanBatch = 1; kanbanEndToastShown = false;
  updateContextualSaveButton();
  renderAll();
  updateFiltersBadge();
  renderSavedFilters();
  closeFiltersDrawer();
});
if($('drawerResetBtn')) $('drawerResetBtn').addEventListener('click',()=>{
  pending = {query:'', fromDate:'', toDate:'', status:[], gradeApplied:[], acadYear:[], distance:[], source:[]};
  applied = JSON.parse(JSON.stringify(pending));
  kanbanBatch = 1; kanbanEndToastShown = false;
  selectedIds.clear();
  if($('sideSearch')) $('sideSearch').value='';
  if($('topSearch')) $('topSearch').value='';
  if($('drawerSearch')) $('drawerSearch').value='';
  renderAllFilterGroups();
  renderSavedFilters();
  updateContextualSaveButton();
  renderAll();
  updateFiltersBadge();
});
if($('drawerSaveFilterBtn')) $('drawerSaveFilterBtn').addEventListener('click', openSaveFilterModal);

if($('toggleSavedFiltersMobile')) $('toggleSavedFiltersMobile').addEventListener('click',()=>{
  const panel = $('savedFiltersMobilePanel');
  if(!panel) return;
  panel.classList.toggle('hidden');
  if(!panel.classList.contains('hidden')) renderSavedFilters();
});
if($('savedFiltersMobileList')) $('savedFiltersMobileList').addEventListener('click',e=>{
  const del = e.target.closest('[data-delete-saved-filter-mobile]');
  if(del){ e.stopPropagation(); deleteSavedFilter(del.dataset.deleteSavedFilterMobile); renderSavedFilters(); return; }
  const saved = e.target.closest('[data-saved-filter-mobile]');
  if(saved){ applySavedFilter(saved.dataset.savedFilterMobile); updateFiltersBadge(); closeFiltersDrawer(); }
});

// Hook into Apply/Reset on desktop sidebar so badge stays accurate
const _origApplyBtn = $('applyBtn');
if(_origApplyBtn) _origApplyBtn.addEventListener('click', updateFiltersBadge);
const _origResetBtn = $('resetBtn');
if(_origResetBtn) _origResetBtn.addEventListener('click', updateFiltersBadge);

// Close drawer automatically if viewport grows past xl (1280px)
const xlMql = window.matchMedia('(min-width: 1280px)');
const handleXlChange = (e)=>{ if(e.matches && $('filtersOverlay') && !$('filtersOverlay').classList.contains('hidden')) closeFiltersDrawer(); };
if(xlMql.addEventListener) xlMql.addEventListener('change', handleXlChange); else if(xlMql.addListener) xlMql.addListener(handleXlChange);

window.addEventListener('resize', updateBulkBarLayout);
// Initial badge state
updateFiltersBadge();

// ── Status Update Flow ────────────────────────────────────────────────────────

let pendingStatus = null; // status chosen in the modal before applying
let statusUpdateInProgress = false;
let deleteActionInProgress = false;
const ACTION_LOADING_DELAY = 1200;
const ACTION_SUCCESS_VISIBLE_DELAY = 450;

function actionSpinnerIcon(){
  return `<svg class="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z"></path></svg>`;
}
function actionSuccessIcon(){
  return `<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
}
function setActionButtonState(btn, state, label){
  if(!btn) return;
  btn.innerHTML = state === 'loading' ? `${actionSpinnerIcon()}<span>${label}</span>` : state === 'success' ? `${actionSuccessIcon()}<span>${label}</span>` : label;
  btn.style.opacity = (state === 'loading' || state === 'success') ? '1' : '';
}
function setStatusModalControlsDisabled(disabled){
  const cancelBtn = $('cancelStatusUpdate');
  const closeBtn = document.querySelector('#statusUpdateModal button[onclick="closeStatusUpdateModal()"]');
  if(cancelBtn) cancelBtn.disabled = disabled;
  if(closeBtn) closeBtn.disabled = disabled;
  document.querySelectorAll('#statusOptionsList [data-status-option]').forEach(btn => { btn.disabled = disabled; });
}
function resetStatusUpdateButton(){
  const applyBtn = $('applyStatusUpdate');
  if(!applyBtn) return;
  applyBtn.classList.add('bg-[#284CA5]','hover:bg-[#203F8D]');
  applyBtn.classList.remove('bg-[#059669]');
  setActionButtonState(applyBtn, 'idle', 'Update');
  applyBtn.disabled = !pendingStatus || isSameStatusAsSelected(pendingStatus);
}
function resetDeleteConfirmButton(label='Delete'){
  const btn = $('confirmDeleteBtn');
  if(!btn) return;
  btn.classList.add('bg-[#D54545]','hover:bg-[#C84040]');
  btn.classList.remove('bg-[#059669]');
  btn.disabled = false;
  setActionButtonState(btn, 'idle', label);
}

function showToast(msg, type){
  const toast = $('toastNotification');
  const msgEl = $('toastMessage');
  const iconWrap = $('toastIconWrap');
  const inner = $('toastInner');
  if(!toast || !msgEl || !inner) return;
  const isError   = type === 'error';
  const isInfo    = type === 'info';
  // Success — bg #EEFFFE, border #359694, text/icon #359694
  // Error   — bg #FFF3F3, border #D54545, text/icon #D54545
  // Info    — bg #EFF4FF, border #284CA5, text/icon #284CA5
  const bgColor     = isError ? 'bg-[#FFF3F3]'    : isInfo ? 'bg-[#EFF4FF]'    : 'bg-[#EEFFFE]';
  const borderColor = isError ? 'border-[#D54545]' : isInfo ? 'border-[#284CA5]' : 'border-[#359694]';
  const textColor   = isError ? 'text-[#D54545]'   : isInfo ? 'text-[#284CA5]'   : 'text-[#359694]';
  inner.className = `flex w-fit items-center gap-2 rounded-[8px] border px-3 py-2 pointer-events-auto shadow-[0_10px_28px_rgba(15,23,42,0.12)] ${bgColor} ${borderColor}`;
  msgEl.className = `text-[13px] font-medium leading-[20px] whitespace-normal ${textColor}`;
  msgEl.textContent = msg;
  if(iconWrap){
    if(isError){
      iconWrap.innerHTML = `<svg class="h-4 w-4 ${textColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12.01" y2="16.5"/></svg>`;
    } else if(isInfo){
      iconWrap.innerHTML = `<svg class="h-4 w-4 ${textColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    } else {
      iconWrap.innerHTML = `<svg class="h-4 w-4 ${textColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
    }
  }
  if(toast._hideTimer) clearTimeout(toast._hideTimer);
  toast.classList.remove('opacity-0','translate-y-3');
  toast.classList.add('opacity-100','translate-y-0');
  toast._hideTimer = setTimeout(()=>{ hideToast(); }, 3000);
}
function hideToast(){
  const toast = $('toastNotification');
  if(!toast) return;
  if(toast._hideTimer) clearTimeout(toast._hideTimer);
  toast.classList.add('opacity-0','translate-y-3');
  toast.classList.remove('opacity-100','translate-y-0');
}

// ── Delete Confirmation Flow ──────────────────────────────────────────────────

// ── Reusable confirmation dialog (shared with delete flow) ──
let pendingConfirmContext = null; // { action: 'delete-apps' | 'remove-file' }
function openConfirmDialog(opts){
  if(deleteActionInProgress) return;
  const { title, body, confirmLabel='Confirm', cancelLabel='Cancel', action } = opts || {};
  const h = $('deleteConfirmHeading');
  const p = $('deleteConfirmBody');
  const btn = $('confirmDeleteBtn');
  const cancelBtn = $('cancelDeleteConfirm');
  if(h) h.textContent = title;
  if(p) p.textContent = body;
  resetDeleteConfirmButton(confirmLabel);
  if(btn) btn.disabled = false;
  if(cancelBtn){ cancelBtn.textContent = cancelLabel; cancelBtn.disabled = false; }
  pendingConfirmContext = { action, confirmLabel };
  const modal = $('deleteConfirmModal');
  if(modal){ modal.classList.remove('hidden'); modal.classList.add('flex'); }
}
function openDeleteConfirmModal(){
  if(deleteActionInProgress) return;
  const count = selectedIds.size;
  if(count === 0){ showToast('Select at least one enquiry to delete.', 'error'); return; }
  openConfirmDialog({
    title: `Delete Enquir${count===1?'y':'ies'}?`,
    body: `You're about to permanently delete ${count} selected enquir${count===1?'y':'ies'}. This action cannot be undone.`,
    confirmLabel: 'Delete',
    action: 'delete-apps'
  });
}
function openRemoveFileConfirmModal(){
  openConfirmDialog({
    title: 'Remove uploaded file?',
    body: 'This uploaded PDF will be removed and extracted details may be lost.',
    confirmLabel: 'Remove File',
    action: 'remove-file'
  });
}
function closeDeleteConfirmModal(force=false){
  if(deleteActionInProgress && !force) return;
  const modal = $('deleteConfirmModal');
  if(modal){ modal.classList.add('hidden'); modal.classList.remove('flex'); }
}
function executeDelete(){
  if(deleteActionInProgress) return;
  const idsToDelete = [...selectedIds];
  if(!idsToDelete.length){ closeDeleteConfirmModal(true); showToast('No enquiries selected for deletion.', 'error'); return; }
  const confirmBtn = $('confirmDeleteBtn');
  const cancelBtn  = $('cancelDeleteConfirm');
  deleteActionInProgress = true;
  if(confirmBtn) confirmBtn.disabled = true;
  if(cancelBtn) cancelBtn.disabled = true;
  setActionButtonState(confirmBtn, 'loading', 'Deleting...');

  setTimeout(()=>{
    idsToDelete.forEach(id => {
      const idx = applications.findIndex(a => String(a.id) === String(id));
      if(idx !== -1) applications.splice(idx, 1);
      const kidx = kanbanLoadMoreRows.findIndex(a => String(a.id) === String(id));
      if(kidx !== -1) kanbanLoadMoreRows.splice(kidx, 1);
    });
    selectedIds.clear();
    renderAll();
    updateFiltersBadge();

    if(confirmBtn){
      // Keep the original delete button color during the success state.
      confirmBtn.classList.add('bg-[#D54545]','hover:bg-[#C84040]');
      setActionButtonState(confirmBtn, 'success', 'Deleted');
    }

    setTimeout(()=>{
      deleteActionInProgress = false;
      closeDeleteConfirmModal(true);
      if(cancelBtn) cancelBtn.disabled = false;
      resetDeleteConfirmButton('Delete');
      showToast(`${idsToDelete.length} enquir${idsToDelete.length===1?'y':'ies'} deleted successfully`, 'success');
    }, ACTION_SUCCESS_VISIBLE_DELAY);
  }, ACTION_LOADING_DELAY);
}

// Wire Delete button (overlay) → open confirm dialog
document.addEventListener('click', e => {
  const btn = e.target.closest('[aria-label="Delete"]');
  if(btn) openDeleteConfirmModal();
});
if($('cancelDeleteConfirm')) $('cancelDeleteConfirm').addEventListener('click', ()=>{
  const ctx = pendingConfirmContext;
  pendingConfirmContext = null;
  closeDeleteConfirmModal();
  // For discard: "Continue Editing" — just close, no toast
  // For file-remove or delete: show cancel toast
  if(ctx && (ctx.action === 'discard-lead')) return;
  if(!ctx || ctx.action !== 'remove-file') showToast('Delete action cancelled', 'error');
});
if($('confirmDeleteBtn')) $('confirmDeleteBtn').addEventListener('click', ()=>{
  const ctx = pendingConfirmContext;
  pendingConfirmContext = null;
  if(ctx && ctx.action === 'discard-lead'){
    closeDeleteConfirmModal();
    closeAddLeadPage();
  } else if(ctx && ctx.action === 'remove-file'){
    closeDeleteConfirmModal();
    resetAutoFillFile();
    showToast('Uploaded file removed.', 'success');
  } else {
    // delete-apps: executeDelete manages its own modal lifecycle (keeps open for loading UX)
    executeDelete();
  }
});
if($('deleteConfirmModal')) $('deleteConfirmModal').addEventListener('click', e => {
  if(e.target.id === 'deleteConfirmModal') closeDeleteConfirmModal();
});

function openStatusUpdateModal(){
  if(statusUpdateInProgress) return;
  const modal = $('statusUpdateModal');
  if(!modal) return;
  if(selectedIds.size === 0){ showToast('Select at least one enquiry to update.', 'error'); return; }
  pendingStatus = null;
  statusUpdateInProgress = false;
  const count = selectedIds.size;
  const subtitle = $('statusUpdateSubtitle');
  if(subtitle) subtitle.textContent = `Select a new status for ${count} selected enquir${count===1?'y':'ies'}.`;
  renderStatusOptions();
  setStatusModalControlsDisabled(false);
  resetStatusUpdateButton();
  const applyBtn = $('applyStatusUpdate');
  if(applyBtn) applyBtn.disabled = true;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeStatusUpdateModal(force=false){
  if(statusUpdateInProgress && !force) return;
  const modal = $('statusUpdateModal');
  if(!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  pendingStatus = null;
}

function getSelectedAppStatuses(){
  return [...selectedIds].map(id => {
    const r = applications.find(a => String(a.id) === String(id));
    if(r) return r.st;
    const rk = kanbanLoadMoreRows.find(a => String(a.id) === String(id));
    return rk ? rk.st : null;
  }).filter(Boolean);
}

function isSameStatusAsSelected(targetStatus){
  const statuses = getSelectedAppStatuses();
  if(!statuses.length) return false;
  const allSame = statuses.every(s => s === statuses[0]);
  if(!allSame) return false; // mixed statuses — always allow update
  return statuses[0] === targetStatus;
}

function renderStatusOptions(){
  const list = $('statusOptionsList');
  if(!list) return;
  list.innerHTML = statusList.map(st => {
    const active = pendingStatus === st;
    return `<button type="button" data-status-option="${esc(st)}" ${statusUpdateInProgress ? 'disabled' : ''} class="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-left text-[13px] transition ${active?'bg-[#DCE8FF] text-[#284CA5] font-semibold hover:bg-[#C5D9FF]':'text-[#0F172A] hover:bg-[#DCE8FF] hover:text-[#0F172A]'} disabled:cursor-not-allowed disabled:opacity-50">
      <span>${esc(st)}</span>
      ${active ? `<svg class="h-4 w-4 shrink-0 text-[#284CA5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>` : ''}
    </button>`;
  }).join('');
  list.querySelectorAll('[data-status-option]').forEach(btn => {
    btn.addEventListener('click', () => {
      if(statusUpdateInProgress) return;
      pendingStatus = btn.dataset.statusOption;
      renderStatusOptions();
      const applyBtn = $('applyStatusUpdate');
      if(applyBtn){
        applyBtn.disabled = isSameStatusAsSelected(pendingStatus);
      }
    });
  });
}

function applyStatusUpdate(){
  if(statusUpdateInProgress) return;
  if(!pendingStatus) return;
  if(isSameStatusAsSelected(pendingStatus)) return;
  const chosenStatus = pendingStatus;
  const idsToUpdate = [...selectedIds];
  const applyBtn  = $('applyStatusUpdate');
  const cancelBtn = $('cancelStatusUpdate');

  statusUpdateInProgress = true;
  if(applyBtn) applyBtn.disabled = true;
  if(cancelBtn) cancelBtn.disabled = true;
  setStatusModalControlsDisabled(true);
  setActionButtonState(applyBtn, 'loading', 'Updating...');

  setTimeout(() => {
    idsToUpdate.forEach(id => {
      const r = applications.find(a => String(a.id) === String(id));
      if(r) r.st = chosenStatus;
      const rk = kanbanLoadMoreRows.find(a => String(a.id) === String(id));
      if(rk) rk.st = chosenStatus;
    });
    selectedIds.clear();
    renderAll();
    updateFiltersBadge();

    if(applyBtn){
      // Keep the original update button color during the success state.
      applyBtn.classList.add('bg-[#284CA5]','hover:bg-[#203F8D]');
      setActionButtonState(applyBtn, 'success', 'Updated');
    }

    setTimeout(() => {
      statusUpdateInProgress = false;
      closeStatusUpdateModal(true);
      setStatusModalControlsDisabled(false);
      resetStatusUpdateButton();
      showToast('Status updated successfully', 'success');
    }, ACTION_SUCCESS_VISIBLE_DELAY);
  }, ACTION_LOADING_DELAY);
}

if($('updateStatusBtn')) $('updateStatusBtn').addEventListener('click', openStatusUpdateModal);
if($('cancelStatusUpdate')) $('cancelStatusUpdate').addEventListener('click', ()=>{
  if(statusUpdateInProgress) return;
  closeStatusUpdateModal();
  showToast('Status update cancelled', 'error');
});
if($('applyStatusUpdate')) $('applyStatusUpdate').addEventListener('click', applyStatusUpdate);
if($('statusUpdateModal')) $('statusUpdateModal').addEventListener('click', e => { if(e.target.id === 'statusUpdateModal') closeStatusUpdateModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && $('statusUpdateModal') && !$('statusUpdateModal').classList.contains('hidden')) closeStatusUpdateModal(); });


function setupAdaptiveTooltips(){
  const tooltipButtons = document.querySelectorAll('button.group.relative');
  tooltipButtons.forEach(btn => {
    const tip = btn.querySelector('span');
    if(!tip || tip.dataset.adaptiveTooltip === '1') return;
    tip.dataset.adaptiveTooltip = '1';
    tip.className = 'pointer-events-none fixed z-[9999] hidden whitespace-nowrap rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[11px] font-semibold leading-none text-[#334155] shadow-[0_8px_20px_rgba(15,23,42,0.12)]';
    tip.style.maxWidth = '180px';
    tip.style.minHeight = '24px';
    tip.style.boxSizing = 'border-box';
    const show = () => {
      tip.style.margin = '0';
      tip.style.transform = 'none';
      tip.style.visibility = 'hidden';
      tip.classList.remove('hidden');
      tip.style.display = 'inline-flex';
      tip.style.alignItems = 'center';
      tip.style.width = 'max-content';
      const gap = 8;
      const pad = 8;
      const r = btn.getBoundingClientRect();
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const fitsX = x => x >= pad && x + tw <= vw - pad;
      const fitsY = y => y >= pad && y + th <= vh - pad;
      let x = r.left + (r.width - tw) / 2;
      let y = r.bottom + gap;
      if(!(fitsX(x) && fitsY(y))){
        y = r.top - th - gap;
      }
      if(!(fitsX(x) && fitsY(y))){
        x = r.right + gap;
        y = r.top + (r.height - th) / 2;
      }
      if(!(fitsX(x) && fitsY(y))){
        x = r.left - tw - gap;
        y = r.top + (r.height - th) / 2;
      }
      x = Math.max(pad, Math.min(x, vw - tw - pad));
      y = Math.max(pad, Math.min(y, vh - th - pad));
      tip.style.left = `${x}px`;
      tip.style.top = `${y}px`;
      tip.style.visibility = 'visible';
    };
    const hide = () => {
      tip.classList.add('hidden');
      tip.style.display = 'none';
      tip.style.visibility = '';
    };
    btn.addEventListener('mouseenter', show);
    btn.addEventListener('focus', show);
    btn.addEventListener('mouseleave', hide);
    btn.addEventListener('blur', hide);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
  });
}

// ═══════════════════════════════════════════════════════════════════
// ADD LEAD — Dedicated Page Flow (simplified, with multi-select & uploads)
// ═══════════════════════════════════════════════════════════════════

function todayFormatted(){
  const d = new Date();
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// ── Dropdown sources ────────────────────────────────────────────────
function populateQualificationDropdown(){
  const s = $('alQualification'); if(!s) return;
  s.innerHTML = '<option value="">Select qualification</option>' +
    qualificationOptions.map(o=>`<option>${o}</option>`).join('');
}
function populateStatusDropdown(){
  const s = $('alStatus'); if(!s) return;
  s.innerHTML = statusList.map((o,i)=>`<option${i===0?' selected':''}>${o}</option>`).join('');
}

// ── Add Lead: Home City dropdown population ─────────────────────────
function populateHomeCityDropdown(){
  const s = $('alHomeCity'); if(!s) return;
  const prev = s.value;
  s.innerHTML = '<option value="">Select city</option>' +
    cityOptions.map(o=>`<option${o===prev?' selected':''}>${o}</option>`).join('');
}

// ── Add Lead: Parent Details — Relation-driven conditional rendering ─
const RELATION_FIELD_VISIBILITY = {
  'Father':      { relationName:false, fatherName:true,  motherName:true,  fatherMobile:false, motherMobile:true  },
  'Mother':      { relationName:false, fatherName:true,  motherName:true,  fatherMobile:true,  motherMobile:false },
  'Uncle':       { relationName:true,  fatherName:true,  motherName:true,  fatherMobile:true,  motherMobile:true  },
  'Aunt':        { relationName:true,  fatherName:true,  motherName:true,  fatherMobile:true,  motherMobile:true  },
  'Siblings':    { relationName:true,  fatherName:true,  motherName:true,  fatherMobile:true,  motherMobile:true  },
  'Grandparent': { relationName:true,  fatherName:true,  motherName:true,  fatherMobile:true,  motherMobile:true  }
};
function updateRelationFields(){
  const sel = $('alRelation'); if(!sel) return;
  const v = sel.value;
  const cfg = RELATION_FIELD_VISIBILITY[v] || { relationName:false, fatherName:false, motherName:false, fatherMobile:false, motherMobile:false };

  // ── Always wipe every relation-dependent field when relation changes ──
  // This prevents stale values from a previously selected relation from
  // leaking into the newly selected relation's visible fields.
  ['alRelationName','alFatherName','alMotherName','alFatherMobile','alMotherMobile'].forEach(id=>{
    const el = $(id); if(el) el.value = '';
  });
  ['alRelationNameErr','alFatherNameErr','alMotherNameErr','alFatherMobileErr','alMotherMobileErr'].forEach(id=>setFieldError(id, false));
  ['alRelationName','alFatherName','alMotherName','alFatherMobile','alMotherMobile'].forEach(id=>setInputBorder(id, false));

  // Relation field itself: full-width row when no value, single column once selected
  const relWrap = $('alRelationWrap');
  if(relWrap) relWrap.classList.toggle('sm:col-span-2', !v);
  // Toggle conditional wrappers
  const toggle = (id, show) => { const el = $(id); if(el) el.classList.toggle('hidden', !show); };
  toggle('alRelationNameWrap', cfg.relationName);
  toggle('alFatherNameWrap',   cfg.fatherName);
  toggle('alMotherNameWrap',   cfg.motherName);
  toggle('alFatherMobileWrap', cfg.fatherMobile);
  toggle('alMotherMobileWrap', cfg.motherMobile);
  // Update the "Selected Relation Name" label
  const lbl = $('alRelationNameLabel');
  if(lbl) lbl.textContent = cfg.relationName && v ? `${v} Name` : 'Relation Name';
  // Show required (*) marker on the specific name field that is mandatory for this relation
  const fReqMark = $('alFatherNameReqMark'), mReqMark = $('alMotherNameReqMark');
  if(fReqMark) fReqMark.classList.toggle('hidden', v !== 'Father');
  if(mReqMark) mReqMark.classList.toggle('hidden', v !== 'Mother');
  balanceGridOrphans($('parentDetailsGrid'));
}

// ── Grid orphan-balancer ────────────────────────────────────────────
// In a 2-column grid (sm:grid-cols-2), if visible single-column items end
// with one leftover (no partner on the row), expand it to full width.
// This includes orphans that are followed by a full-width (sm:col-span-2) item
// OR that are at the very end of the visible list.
// Dynamically-added spans are tagged with data-cs2Dynamic to avoid clobbering
// statically-authored full-width items (textarea, etc.).
function balanceGridOrphans(gridEl){
  if(!gridEl) return;
  // Remove any prior dynamically-added col-span-2
  Array.from(gridEl.children).forEach(c => {
    if(c.dataset.cs2Dynamic === '1'){
      c.classList.remove('sm:col-span-2');
      delete c.dataset.cs2Dynamic;
    }
  });
  // Walk visible children in DOM order.
  // Track the current "pending single" item — the first of a potential pair.
  // When we encounter a full-width item while colInRow===1, the pending item is orphaned.
  // When we reach end of list while colInRow===1, the pending item is orphaned.
  const visible = Array.from(gridEl.children).filter(c => !c.classList.contains('hidden'));
  let colInRow = 0;      // 0 = start of row; 1 = first item placed
  let pendingSingle = null;
  function expandOrphan(el){
    el.classList.add('sm:col-span-2');
    el.dataset.cs2Dynamic = '1';
  }
  for(const c of visible){
    const isFull = c.classList.contains('sm:col-span-2');
    if(isFull){
      // A full-width item starts its own row.
      // If there's a single item waiting for a partner, it's now orphaned.
      if(colInRow === 1 && pendingSingle) expandOrphan(pendingSingle);
      colInRow = 0;
      pendingSingle = null;
    } else {
      if(colInRow === 0){
        colInRow = 1;
        pendingSingle = c;          // waiting to see if a partner follows
      } else {
        colInRow = 0;               // pair complete — row filled
        pendingSingle = null;
      }
    }
  }
  // After the last item: if there's still a pending single, it's orphaned
  if(colInRow === 1 && pendingSingle) expandOrphan(pendingSingle);
}

// ── Admission-type-driven conditional logic ────────────────────────
// DOB is used only for validation/record-keeping, not UI control.
const PRESCHOOL_GRADES = ['Playgroup','Pre-Nursery','Nursery','LKG','UKG'];
const DAY_SCHOOL_GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'];

// parseDobToDate — kept for DOB format/date validation only
// ── Indian mobile number validator ──────────────────────────────────
// Rules: exactly 10 digits, first digit must be 6-9, digits only.
function isValidIndianMobile(value){
  const digits = String(value).replace(/\D/g, '');
  return digits.length === 10 && /^[6-9]/.test(digits);
}

function parseDobToDate(str){
  if(!str) return null;
  const m = String(str).trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if(!m) return null;
  const dd = +m[1], mm = +m[2], yyyy = +m[3];
  const d = new Date(yyyy, mm-1, dd);
  if(d.getFullYear() !== yyyy || d.getMonth() !== mm-1 || d.getDate() !== dd) return null;
  if(d > new Date()) return null; // not in future
  return d;
}

function populateGradeAppliedFromType(admissionType){
  const sel = $('alGradeApplied'); if(!sel) return;
  const prev = sel.value;
  let options, placeholder;
  if(admissionType === 'Preschool'){
    options = PRESCHOOL_GRADES; placeholder = 'Select preschool grade';
  } else if(admissionType === 'Day School' || admissionType === 'Boarding School'){
    options = DAY_SCHOOL_GRADES; placeholder = 'Select grade';
  } else {
    options = []; placeholder = 'Select admission type first';
  }
  sel.innerHTML = `<option value="">${placeholder}</option>` +
    options.map(o=>`<option${o===prev?' selected':''}>${o}</option>`).join('');
  if(prev && !options.includes(prev)) sel.value = '';
}

function applyAdmissionTypeVisibility(admissionType){
  const gradeWrap    = $('alGradeAppliedWrap');
  const daycare      = $('alDaycareWrap');
  const hostel       = $('alHostelWrap');
  const transport    = $('alTransportWrap');
  const distanceWrap = $('alDistanceWrap');
  const hasType = !!admissionType;
  const isPreschool = admissionType === 'Preschool';
  const isDay       = admissionType === 'Day School';
  const isBoarding  = admissionType === 'Boarding School';
  if(gradeWrap)    gradeWrap.classList.toggle('hidden', !hasType);
  if(daycare)      daycare.classList.toggle('hidden',   !isPreschool);
  if(hostel)       hostel.classList.toggle('hidden',    !isBoarding);
  // Transport shown for Preschool and Day School (not Boarding — hostel residents don't commute)
  if(transport)    transport.classList.toggle('hidden',  !(isPreschool || isDay));
  // Distance shown for Preschool and Day School; not relevant for Boarding
  if(distanceWrap) distanceWrap.classList.toggle('hidden', !(isPreschool || isDay));
  // Clear values of fields being hidden
  if(!isPreschool){ document.querySelectorAll('input[name="alDaycare"]').forEach(r=>r.checked=false); }
  if(!isBoarding){  document.querySelectorAll('input[name="alHostel"]').forEach(r=>r.checked=false); }
  if(!isPreschool && !isDay){ document.querySelectorAll('input[name="alTransport"]').forEach(r=>r.checked=false); }
  if(!hasType){
    const ga = $('alGradeApplied'); if(ga) ga.value = '';
    setFieldError('alGradeAppliedErr', false); setSelectBorder('alGradeApplied', false);
  }
  if(isBoarding){
    const d = $('alDistance'); if(d){ d.value = ''; d.dispatchEvent(new Event('change')); }
    setFieldError('alDistanceErr', false); setSelectBorder('alDistance', false);
  }
  // Rebalance grids: admission-type changes affect both Step 2 (GradeApplied wrap)
  // and Step 3 (the four preference fields), so balance both.
  balanceGridOrphans($('childDetailsGrid'));
  balanceGridOrphans($('prefsNotesGrid'));
}

function updateAdmissionTypeFields(){
  const sel = $('alAdmissionType');
  const admissionType = sel ? (sel.value || '') : '';
  populateGradeAppliedFromType(admissionType);
  applyAdmissionTypeVisibility(admissionType);
  if(admissionType){ setFieldError('alAdmissionTypeErr', false); setSelectBorder('alAdmissionType', false); }
}

// DOB age range — used for validation only, not UI control
const DOB_AGE_MIN = 1, DOB_AGE_MAX = 20;
function computeDobAgeYears(dob){
  if(!dob) return null;
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if(m < 0 || (m === 0 && now.getDate() < dob.getDate())) years--;
  return Math.max(0, years);
}

// DOB handler — validation/record keeping only, no UI logic
function updateChildDobField(){
  const dobInput = $('alDob');
  const dobStr = dobInput ? (dobInput.value || '').trim() : '';
  const dob = parseDobToDate(dobStr);
  if(dobStr){ setFieldError('alDobErr', false); }
  if(dob){
    const age = computeDobAgeYears(dob);
    const ageOutOfRange = age < DOB_AGE_MIN || age > DOB_AGE_MAX;
    const ageErrEl = $('alDobAgeErr');
    if(ageErrEl && ageOutOfRange){
      ageErrEl.textContent = age < DOB_AGE_MIN
        ? 'Child age should be at least 1 year.'
        : 'Child age should be below 20 years.';
    }
    setFieldError('alDobAgeErr', ageOutOfRange);
    setInputBorder('alDob', ageOutOfRange);
  } else {
    setFieldError('alDobAgeErr', false);
    if(!dobStr) setInputBorder('alDob', false);
  }
}


// ── Specialisation dependency (legacy — curriculum is now always shown, no dependency) ──
function getFormSpecializations(qual){
  return curriculumOptions;
}
function updateFormSpecialization(){
  const sSel = $('alSpecialization');
  const wrap = $('alSpecializationField');
  if(!sSel || !wrap) return;
  wrap.classList.remove('hidden');
  const prev = sSel.value;
  sSel.innerHTML = '<option value="">Select curriculum</option>' +
    curriculumOptions.map(o=>`<option${o===prev?' selected':''}>${o}</option>`).join('');
  updateQELayout();
}

// ── Legacy Q&E layout function — safe no-op since qeGrid element no longer exists ──
function updateQELayout(){
  const grid = $('qeGrid');
  if(!grid) return;
  // Previous teacher-form grid logic intentionally removed
}

// ── Multi-select dropdown component ─────────────────────────────────
const multiSelectState = {}; // { containerId: { options:[], selected:[], max:5 } }

const LANGUAGE_OPTIONS = ['English','Hindi','Tamil','Telugu','Kannada','Malayalam','Marathi','Gujarati','Bengali','Punjabi','Urdu','Odia','Assamese','Tulu','Bhojpuri','Haryanvi','Rajasthani','Chhattisgarhi'];
const CERTIFICATION_OPTIONS = ['Drawing & Painting','Reading','Music','Dance','Sports','Coding','Robotics','Storytelling','Puzzles & Logic','Outdoor Play','Arts & Crafts','Singing','Chess','Swimming','Yoga','Drama / Theatre','Public Speaking','Cycling','Cooking','Gardening'];
const SKILL_OPTIONS = ['Transport','Daycare','Smart Classroom','Playground','Library','STEM Lab','Sports','Music & Arts','Swimming Pool','Cafeteria','CCTV Security','Air-conditioned Classrooms','Medical Room','Counsellor','Robotics Lab','Computer Lab','Auditorium','Activity Centre'];

function buildMultiSelectDropdown(container, options, max, placeholder){
  if(!container || container.dataset.msInited === '1') return;
  container.dataset.msInited = '1';
  const id = container.dataset.multiSelect || container.id;
  multiSelectState[id] = { options, selected: [], max, placeholder };
  container.classList.add('ms-wrap','relative');
  // Trigger
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'ms-trigger flex min-h-10 w-full items-start justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-left text-[13px] text-[#334155] outline-none transition focus:border-[#284CA5] hover:border-[#BFD3FF]';
  trigger.innerHTML = `<div class="ms-chips flex min-w-0 flex-1 flex-wrap items-center gap-1"></div><svg class="ms-chevron h-3.5 w-3.5 shrink-0 self-center text-[#64748B] transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
  container.appendChild(trigger);
  // Popover
  const menu = document.createElement('div');
  menu.className = 'ms-menu absolute left-0 top-[calc(100%+4px)] z-40 hidden w-full max-h-[280px] overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-[0_12px_32px_rgba(15,23,42,0.12)]';
  container.appendChild(menu);
  // Render chips inside trigger
  function renderChips(){
    const wrap = trigger.querySelector('.ms-chips');
    const sel = multiSelectState[id].selected;
    if(!sel.length){
      wrap.innerHTML = `<span class="py-1 text-[13px] text-[#94A3B8]">${esc(placeholder || 'Select')}</span>`;
      return;
    }
    wrap.innerHTML = sel.map(v=>`<span class="inline-flex items-center gap-1 rounded-md bg-[#EFF4FF] px-2 py-0.5 text-[12px] font-medium text-[#284CA5]"><span class="max-w-[160px] truncate">${esc(v)}</span><span data-ms-chip-remove="${esc(v)}" class="grid h-3.5 w-3.5 cursor-pointer place-items-center rounded-full hover:bg-[#DCE8FF]" aria-label="Remove"><svg class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span></span>`).join('');
    wrap.querySelectorAll('[data-ms-chip-remove]').forEach(b=>{
      b.addEventListener('click',e=>{
        e.stopPropagation();
        const v = b.dataset.msChipRemove;
        multiSelectState[id].selected = multiSelectState[id].selected.filter(x=>x!==v);
        renderChips();
        if(!menu.classList.contains('hidden')) renderMenu();
      });
    });
  }
  // Render popover options
  function renderMenu(){
    const st = multiSelectState[id];
    const limitReached = st.selected.length >= st.max;
    menu.innerHTML = `<div class="px-2 pb-2 pt-1 text-[11px] font-medium text-[#64748B]">${st.selected.length} / ${st.max} selected</div><div class="space-y-0.5">` + st.options.map(o=>{
      const checked = st.selected.includes(o);
      const disabled = !checked && limitReached;
      return `<label class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[13px] transition ${checked ? 'bg-[#DCE8FF] text-[#284CA5]' : disabled?'text-[#94A3B8] cursor-not-allowed':'text-[#0F172A] hover:bg-[#DCE8FF] hover:text-[#0F172A]'}"><input data-ms-opt="${esc(o)}" type="checkbox" ${checked?'checked':''} ${disabled?'disabled':''} class="h-4 w-4 cursor-pointer rounded border-[#BFD3FF] accent-[#284CA5] focus:ring-[#284CA5]" /><span class="min-w-0 flex-1 truncate">${esc(o)}</span></label>`;
    }).join('') + '</div>';
    menu.querySelectorAll('[data-ms-opt]').forEach(inp=>{
      inp.addEventListener('change',()=>{
        const v = inp.dataset.msOpt;
        const st = multiSelectState[id];
        if(inp.checked){
          if(st.selected.length >= st.max){ inp.checked = false; showToast(`You can only select up to ${st.max} items.`, 'info'); return; }
          if(!st.selected.includes(v)) st.selected.push(v);
        } else {
          st.selected = st.selected.filter(x=>x!==v);
        }
        renderChips();
        renderMenu();
      });
    });
  }
  function open(){
    document.querySelectorAll('.ms-menu:not(.hidden), .cs-menu:not(.hidden)').forEach(m=>{ if(m!==menu) m.classList.add('hidden'); });
    renderMenu();
    menu.classList.remove('hidden');
    trigger.querySelector('.ms-chevron').classList.add('rotate-180');
  }
  function close(){
    menu.classList.add('hidden');
    trigger.querySelector('.ms-chevron').classList.remove('rotate-180');
  }
  trigger.addEventListener('click', e=>{ e.preventDefault(); e.stopPropagation(); if(menu.classList.contains('hidden')) open(); else close(); });
  document.addEventListener('click', e=>{ if(!container.contains(e.target)) close(); });
  // Expose for external set/get
  container._ms = {
    set(values){ multiSelectState[id].selected = Array.isArray(values) ? values.filter(v => multiSelectState[id].options.includes(v)).slice(0, multiSelectState[id].max) : []; renderChips(); if(!menu.classList.contains('hidden')) renderMenu(); },
    get(){ return [...multiSelectState[id].selected]; },
    clear(){ multiSelectState[id].selected = []; renderChips(); if(!menu.classList.contains('hidden')) renderMenu(); }
  };
  renderChips();
}

function initAddLeadMultiSelects(){
  const langC = document.getElementById('alLanguagesContainer');
  if(langC) buildMultiSelectDropdown(langC, LANGUAGE_OPTIONS, 5, 'Select languages');
  const skillC = document.getElementById('alSkillsContainer');
  if(skillC) buildMultiSelectDropdown(skillC, SKILL_OPTIONS, 8, 'Select amenities');
  const certC = document.getElementById('alCertificationsContainer');
  if(certC) buildMultiSelectDropdown(certC, CERTIFICATION_OPTIONS, 5, 'Select interests');
}

// ── Validation ──────────────────────────────────────────────────────
function setFieldError(errId, show){ const el = $(errId); if(!el) return; el.classList.toggle('hidden', !show); }
function setInputBorder(inputId, hasError){
  const inp = $(inputId); if(!inp) return;
  const wrapper = inp.closest('.al-field') || inp;
  if(wrapper === inp){
    if(hasError){ inp.classList.add('border-[#DC2626]'); inp.classList.remove('border-[#E2E8F0]'); }
    else { inp.classList.remove('border-[#DC2626]'); inp.classList.add('border-[#E2E8F0]'); }
  } else {
    if(hasError){ wrapper.classList.add('border-[#DC2626]'); wrapper.classList.remove('border-[#E2E8F0]'); }
    else { wrapper.classList.remove('border-[#DC2626]'); wrapper.classList.add('border-[#E2E8F0]'); }
  }
}
function setSelectBorder(id, hasError){
  const sel = $(id); if(!sel) return;
  const wrap = sel.parentElement;
  const trigger = wrap ? wrap.querySelector('.cs-trigger') : null;
  const target = trigger || sel;
  if(hasError){ target.classList.add('border-[#DC2626]'); target.classList.remove('border-[#E2E8F0]'); }
  else { target.classList.remove('border-[#DC2626]'); target.classList.add('border-[#E2E8F0]'); }
}
// ── Step 1 validation: Parent Details only ──────────────────────────
function validateAddLeadStep1(){
  const relation = ($('alRelation') ? $('alRelation').value || '' : '').trim();
  const homeCity = ($('alHomeCity') ? $('alHomeCity').value || '' : '').trim();
  const homeAddress = ($('alHomeAddress') ? $('alHomeAddress').value || '' : '').trim();
  const cfg = RELATION_FIELD_VISIBILITY[relation] || null;

  // Relation (required)
  const relationErr = !relation;
  setFieldError('alRelationErr', relationErr); setSelectBorder('alRelation', relationErr);

  // Relation Name (Uncle/Aunt/Siblings/Grandparent) — required when shown
  let relNameErr = false;
  if(cfg && cfg.relationName){
    const v = ($('alRelationName') ? $('alRelationName').value || '' : '').trim();
    relNameErr = !v;
  }
  setFieldError('alRelationNameErr', relNameErr); setInputBorder('alRelationName', relNameErr);

  // Per-relation name validation:
  // Father → Father Name required; Mother → Mother Name required; others → optional
  let fatherNameErr = false, motherNameErr = false;
  if(relation === 'Father' && cfg && cfg.fatherName){
    const v = ($('alFatherName') ? $('alFatherName').value || '' : '').trim();
    fatherNameErr = !v;
  }
  if(relation === 'Mother' && cfg && cfg.motherName){
    const v = ($('alMotherName') ? $('alMotherName').value || '' : '').trim();
    motherNameErr = !v;
  }
  setFieldError('alFatherNameErr', fatherNameErr); setInputBorder('alFatherName', fatherNameErr);
  setFieldError('alMotherNameErr', motherNameErr); setInputBorder('alMotherName', motherNameErr);
  // Mobile fields optional, but if entered must be a valid Indian 10-digit number
  let fatherMobileErr = false, motherMobileErr = false;
  const fatherMobileRaw = ($('alFatherMobile') ? $('alFatherMobile').value || '' : '');
  const motherMobileRaw = ($('alMotherMobile') ? $('alMotherMobile').value || '' : '');
  if(fatherMobileRaw.trim()) fatherMobileErr = !isValidIndianMobile(fatherMobileRaw);
  if(motherMobileRaw.trim()) motherMobileErr = !isValidIndianMobile(motherMobileRaw);
  setFieldError('alFatherMobileErr', fatherMobileErr); setInputBorder('alFatherMobile', fatherMobileErr);
  setFieldError('alMotherMobileErr', motherMobileErr); setInputBorder('alMotherMobile', motherMobileErr);

  // Home City (required)
  const homeCityErr = !homeCity;
  setFieldError('alHomeCityErr', homeCityErr); setSelectBorder('alHomeCity', homeCityErr);
  // Clear Home Address error (now optional)
  setFieldError('alHomeAddressErr', false); setInputBorder('alHomeAddress', false);

  return !relationErr && !relNameErr && !fatherNameErr && !motherNameErr && !fatherMobileErr && !motherMobileErr && !homeCityErr;
}

// ── Step 2 validation: Child Details only ───────────────────────────
function validateAddLeadStep2(){
  const childName = ($('alStudentName') ? $('alStudentName').value || '' : '').trim();
  const dobStr = ($('alDob') ? $('alDob').value || '' : '').trim();
  const dob = parseDobToDate(dobStr);
  const admissionType = ($('alAdmissionType') ? $('alAdmissionType').value || '' : '').trim();
  const gradeApplied = ($('alGradeApplied') ? $('alGradeApplied').value || '' : '').trim();

  // Child Full Name (required)
  const childErr = !childName;
  setFieldError('alStudentNameErr', childErr); setInputBorder('alStudentName', childErr);

  // DOB is now optional — clear any prior mandatory error (age-range live feedback still
  // comes from updateChildDobField, but we no longer block progression on empty DOB)
  setFieldError('alDobErr', false); setFieldError('alDobAgeErr', false); setInputBorder('alDob', false);

  // Admission Type (required)
  const typeErr = !admissionType;
  setFieldError('alAdmissionTypeErr', typeErr); setSelectBorder('alAdmissionType', typeErr);

  // Seeking Admission For (required when admission type is selected)
  const gradeErr = !!admissionType && !gradeApplied;
  setFieldError('alGradeAppliedErr', gradeErr); setSelectBorder('alGradeApplied', gradeErr);

  // Academic Year is now OPTIONAL — clear any prior error
  setFieldError('alAcadYearErr', false); setSelectBorder('alAcadYear', false);

  return !childErr && !typeErr && !gradeErr;
}

// ── Step 3 validation: Preferences & Notes ─────────────────────────
function validateAddLeadStep3(){
  // Distance Willing to Travel is now optional — clear any prior error
  setFieldError('alDistanceErr', false); setSelectBorder('alDistance', false);
  // Enquiry message and all preference radios remain optional
  return true;
}

function validateAddLeadForm(){
  const ok1 = validateAddLeadStep1();
  const ok2 = validateAddLeadStep2();
  const ok3 = validateAddLeadStep3();
  return ok1 && ok2 && ok3;
}


// ── Reset state ─────────────────────────────────────────────────────
function resetAddLeadPage(){
  // Text inputs / textareas across all sections
  [
    'alRelationName','alFatherName','alMotherName','alFatherMobile','alMotherMobile','alHomeAddress',
    'alStudentName','alDob','alCurrentSchool','alEnquiryMessage'
  ].forEach(id=>{ const el = $(id); if(el) el.value = ''; });
  // Selects — dispatch change so custom dropdown triggers re-render their placeholder
  populateHomeCityDropdown();
  ['alRelation','alHomeCity','alGender','alAdmissionType','alGradeApplied','alAcadYear','alDistance'].forEach(id=>{
    const sel = $(id);
    if(!sel) return;
    sel.value = '';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });
  // Radio groups (Daycare / Hostel / Transport)
  document.querySelectorAll('input[name="alDaycare"], input[name="alHostel"], input[name="alTransport"]').forEach(r=>{ r.checked = false; });
  // Conditional visibility — reset based on no relation / no admission type
  updateRelationFields();
  updateAdmissionTypeFields();
  // Clear all error states
  [
    'alRelationErr','alRelationNameErr','alFatherNameErr','alMotherNameErr','alFatherMobileErr','alMotherMobileErr',
    'alHomeCityErr','alHomeAddressErr','alStudentNameErr','alDobErr','alDobAgeErr',
    'alAdmissionTypeErr','alGradeAppliedErr','alAcadYearErr','alDistanceErr'
  ].forEach(id=>setFieldError(id, false));
  [
    'alRelationName','alFatherName','alMotherName','alFatherMobile','alMotherMobile',
    'alHomeAddress','alStudentName','alDob'
  ].forEach(id=>setInputBorder(id, false));
  ['alRelation','alHomeCity','alGender','alAdmissionType','alGradeApplied','alAcadYear','alDistance'].forEach(id=>setSelectBorder(id, false));
}

// ── CV upload pill state ────────────────────────────────────────────
let uploadedCvFile = null; // shared between auto-fill and CV section
let uploadedCertFiles = []; // array of File-like {name,size}
const MAX_CERT_FILES = 3;

function formatFileSize(bytes){
  if(typeof bytes !== 'number' || isNaN(bytes)) return '';
  if(bytes < 1024) return bytes + ' B';
  if(bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(2) + ' MB';
}

function setAutoFillFile(file){
  const btn = $('autoFillBtn');
  const card = $('autoFillFileCard');
  const nameEl = $('autoFillFileName');
  const sizeEl = $('autoFillFileSize');
  if(file){
    if(btn) btn.classList.add('hidden');
    if(card){ card.classList.remove('hidden'); card.classList.add('flex'); }
    if(nameEl) nameEl.textContent = file.name;
    if(sizeEl) sizeEl.textContent = formatFileSize(file.size) + ' · Uploaded';
  } else {
    if(btn) btn.classList.remove('hidden');
    if(card){ card.classList.add('hidden'); card.classList.remove('flex'); }
  }
}

function resetAutoFillFile(){
  // Restore the upload button, clear the file, hide info banner, and reset CV pill
  setAutoFillFile(null);
  uploadedCvFile = null;
  setCvUploadedFile(null);
  const inp = $('autoFillPdfInput'); if(inp) inp.value = '';
  const cvInp = $('cvFileInput'); if(cvInp) cvInp.value = '';
  const banner = $('pdfInfoBanner'); if(banner){ banner.classList.add('hidden'); banner.classList.remove('flex'); }
}

function setCvUploadedFile(file){
  uploadedCvFile = file;
  const empty = $('cvUploadEmpty');
  const pill = $('cvUploadPill');
  const name = $('cvFileName');
  if(file){
    if(empty) empty.classList.add('hidden');
    if(pill){ pill.classList.remove('hidden'); pill.classList.add('flex'); }
    if(name) name.textContent = file.name;
  } else {
    if(empty) empty.classList.remove('hidden');
    if(pill){ pill.classList.add('hidden'); pill.classList.remove('flex'); }
  }
}
function resetCvUpload(){ setCvUploadedFile(null); const inp = $('cvFileInput'); if(inp) inp.value=''; }
function resetCertUpload(){
  uploadedCertFiles = [];
  const list = $('certList'); if(list){ list.innerHTML = ''; list.classList.add('hidden'); }
  const inp = $('certFileInput'); if(inp) inp.value='';
}
function addCertFile(file){
  uploadedCertFiles.push(file);
  renderCertList();
}
function removeCertFile(idx){
  uploadedCertFiles.splice(idx, 1);
  renderCertList();
}
function renderCertList(){
  const list = $('certList'); if(!list) return;
  if(!uploadedCertFiles.length){ list.innerHTML = ''; list.classList.add('hidden'); return; }
  list.classList.remove('hidden');
  list.innerHTML = uploadedCertFiles.map((f,i)=>`<div class="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] px-3 py-2"><div class="flex items-center gap-2 min-w-0"><svg class="h-4 w-4 shrink-0 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg><span class="min-w-0 truncate text-[12px] font-medium text-[#334155]">${esc(f.name)}</span></div><button type="button" data-cert-remove="${i}" class="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[#64748B] transition hover:bg-[#FEE2E2] hover:text-[#DC2626]" aria-label="Remove file"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>`).join('');
  list.querySelectorAll('[data-cert-remove]').forEach(btn=>btn.addEventListener('click',()=>removeCertFile(Number(btn.dataset.certRemove))));
}

// ── Open / close page ──────────────────────────────────────────────
function openAddLeadPage(){
  const page = $('addLeadPage'); if(!page) return;
  resetAddLeadPage();
  page.classList.remove('hidden');
  page.classList.add('flex');
  document.body.style.overflow = 'hidden';
  initAddLeadCustomDropdowns();
  initAddLeadMultiSelects();
  goToAddLeadStep(1);
}
function closeAddLeadPage(){
  const page = $('addLeadPage'); if(!page) return;
  // Close any portal dropdown menus that may still be open inside the dialog
  document.querySelectorAll('.cs-menu:not(.hidden)').forEach(m => m.classList.add('hidden'));
  page.classList.add('hidden');
  page.classList.remove('flex');
  document.body.style.overflow = '';
}

// ── Dirty-state check: returns true if user has entered any form data ─
function isAddLeadFormDirty(){
  const textFields = [
    'alRelationName','alFatherName','alMotherName','alFatherMobile','alMotherMobile',
    'alHomeAddress','alStudentName','alCurrentSchool','alDob','alEnquiryMessage'
  ];
  if(textFields.some(id => { const el = $(id); return el && el.value.trim(); })) return true;
  const selectFields = ['alRelation','alHomeCity','alGender','alAdmissionType','alGradeApplied','alAcadYear','alDistance'];
  if(selectFields.some(id => { const el = $(id); return el && el.value; })) return true;
  if(document.querySelectorAll(
    'input[name="alDaycare"]:checked, input[name="alHostel"]:checked, input[name="alTransport"]:checked'
  ).length > 0) return true;
  return false;
}

// ── Guarded close: checks dirty state before closing ────────────────
function maybeCloseAddLeadPage(){
  if(isAddLeadFormDirty()){
    // Reuse the shared deleteConfirmModal with discard-lead action
    openConfirmDialog({
      title: 'Discard changes?',
      body: 'You may lose the entered details if you close this form.',
      confirmLabel: 'Discard',
      cancelLabel: 'Continue Editing',
      action: 'discard-lead'
    });
  } else {
    closeAddLeadPage();
  }
}

// ── Step navigation (reusable step-dialog pattern) ─────────────────
let _addLeadStep = 1;
function goToAddLeadStep(n){
  _addLeadStep = n >= 1 && n <= 3 ? n : 1;
  // Toggle panes — only the active one is shown
  [['alStep1',1],['alStep2',2],['alStep3',3]].forEach(([id,num])=>{
    const el = $(id); if(el) el.classList.toggle('hidden', _addLeadStep !== num);
  });
  // Update step indicator visuals
  document.querySelectorAll('#addLeadStepNav .al-step').forEach(stepEl => {
    const stepNum = Number(stepEl.dataset.step);
    const bubble = stepEl.querySelector('.al-step-bubble');
    const label = stepEl.querySelector('.al-step-label');
    const isActive = stepNum === _addLeadStep;
    const isDone = stepNum < _addLeadStep;
    if(bubble){
      bubble.classList.remove('bg-[#284CA5]','text-white','border-[#284CA5]','bg-white','text-[#64748B]','border-[#E2E8F0]','bg-[#EFF4FF]','text-[#284CA5]');
      if(isActive){ bubble.classList.add('bg-[#284CA5]','text-white','border-[#284CA5]'); bubble.textContent = String(stepNum); }
      else if(isDone){ bubble.classList.add('bg-[#EFF4FF]','text-[#284CA5]','border-[#284CA5]'); bubble.innerHTML = '<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'; }
      else { bubble.classList.add('bg-white','text-[#64748B]','border-[#E2E8F0]'); bubble.textContent = String(stepNum); }
    }
    if(label){
      label.classList.remove('text-[#0F172A]','text-[#284CA5]','text-[#64748B]');
      if(isActive) label.classList.add('text-[#0F172A]');
      else if(isDone) label.classList.add('text-[#284CA5]');
      else label.classList.add('text-[#64748B]');
    }
  });
  // Update aria + sub-title
  const stepNav = $('addLeadStepNav'); if(stepNav) stepNav.setAttribute('aria-valuenow', String(_addLeadStep));
  const sub = $('addLeadDialogSub');
  const labels = {1:'Parent details', 2:'Child details', 3:'Preferences & notes'};
  if(sub) sub.textContent = `Step ${_addLeadStep} of 3 — ${labels[_addLeadStep] || ''}`;
  // Footer: Back hidden on step 1, Next on steps 1-2, Save on step 3 only
  const backBtn = $('addLeadBackBtn'), nextBtn = $('addLeadNextBtn'), saveBtn = $('addLeadSave');
  if(backBtn) backBtn.classList.toggle('invisible', _addLeadStep === 1);
  if(nextBtn){
    const showNext = _addLeadStep < 3;
    nextBtn.classList.toggle('hidden', !showNext); nextBtn.classList.toggle('inline-flex', showNext);
  }
  if(saveBtn){
    const showSave = _addLeadStep === 3;
    saveBtn.classList.toggle('hidden', !showSave); saveBtn.classList.toggle('inline-flex', showSave);
  }
  // Scroll body to top when changing steps
  const body = document.querySelector('#addLeadPage .al-dialog .min-h-0.flex-1');
  if(body) body.scrollTop = 0;
}
function addLeadNextStep(){
  if(_addLeadStep === 1){
    if(!validateAddLeadStep1()) return;
    goToAddLeadStep(2);
  } else if(_addLeadStep === 2){
    if(!validateAddLeadStep2()) return;
    goToAddLeadStep(3);
  }
}
function addLeadBackStep(){
  if(_addLeadStep === 2) goToAddLeadStep(1);
  else if(_addLeadStep === 3) goToAddLeadStep(2);
}

// ── Custom dropdown helper (reused from prior change) ───────────────
const _csCleanups = new WeakMap();
function buildCustomSelectForNativeSelect(sel){
  if(!sel || sel.dataset.csInited === '1') return;
  sel.dataset.csInited = '1';
  sel.classList.add('sr-only');
  sel.setAttribute('tabindex','-1');
  sel.setAttribute('aria-hidden','true');
  const wrap = sel.parentElement;
  if(!wrap) return;
  wrap.classList.add('cs-wrap');
  const oldChevron = wrap.querySelector('svg.pointer-events-none');
  if(oldChevron) oldChevron.remove();
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'cs-trigger flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-left text-[13px] text-[#334155] outline-none transition focus:border-[#284CA5] hover:border-[#BFD3FF]';
  trigger.innerHTML = `<span class="cs-label min-w-0 flex-1 truncate"></span><svg class="h-3.5 w-3.5 shrink-0 text-[#64748B] transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
  // Menu is portalled to <body> with position:fixed so it escapes every overflow ancestor
  // (dialog body scroll, rounded-corner clip, etc.) and never gets cut off.
  const menu = document.createElement('div');
  menu.className = 'cs-menu fixed z-[80] hidden rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-[0_12px_32px_rgba(15,23,42,0.18)]';
  menu.setAttribute('role','listbox');
  // Inner scroller — only this scrolls when option count exceeds available height
  const scroller = document.createElement('div');
  scroller.className = 'cs-menu-scroll overflow-y-auto overscroll-contain';
  menu.appendChild(scroller);
  wrap.appendChild(trigger);
  document.body.appendChild(menu);
  function getPlaceholderLabel(){
    const first = sel.options[0];
    return first && !first.value ? first.textContent : 'Select';
  }
  function renderTrigger(){
    const labelEl = trigger.querySelector('.cs-label');
    const val = sel.value;
    if(val){
      const o = Array.from(sel.options).find(x => x.value === val);
      labelEl.textContent = o ? o.textContent : val;
      labelEl.classList.remove('text-[#94A3B8]');
      labelEl.classList.add('text-[#334155]');
    } else {
      labelEl.textContent = getPlaceholderLabel();
      labelEl.classList.remove('text-[#334155]');
      labelEl.classList.add('text-[#94A3B8]');
    }
  }
  function renderMenu(){
    const usable = Array.from(sel.options).filter(o => o.value !== '');
    scroller.innerHTML = '<div class="space-y-0.5">' + usable.map(o => {
      const active = o.value === sel.value;
      // `whitespace-normal break-words` so long option labels wrap instead of truncate
      return `<button type="button" data-cs-val="${esc(o.value)}" role="option" aria-selected="${active}" class="flex w-full cursor-pointer items-start justify-between gap-2 rounded-lg px-2 py-2 text-left text-[13px] transition ${active?'bg-[#DCE8FF] text-[#284CA5] font-semibold hover:bg-[#C5D9FF]':'text-[#0F172A] hover:bg-[#DCE8FF] hover:text-[#0F172A]'}"><span class="min-w-0 flex-1 whitespace-normal break-words leading-snug">${esc(o.textContent)}</span>${active?'<svg class="h-3.5 w-3.5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>':''}</button>`;
    }).join('') + '</div>' || `<div class="px-2 py-2 text-[12px] text-[#94A3B8]">No options</div>`;
    scroller.querySelectorAll('[data-cs-val]').forEach(btn=>{
      btn.addEventListener('click', () => {
        sel.value = btn.dataset.csVal;
        sel.dispatchEvent(new Event('change', { bubbles:true }));
        renderTrigger();
        close();
      });
    });
  }
  function positionMenu(){
    const rect = trigger.getBoundingClientRect();
    // If trigger has no dimensions (not visible / dialog closing), don't position
    if(!rect.width && !rect.height) return;
    const gap = 6;            // visual gap between trigger and menu
    const margin = 8;         // minimum margin from viewport / dialog edge
    const preferred = 280;    // ideal menu height
    const minViable = 140;    // need at least this much below before flipping up
    // Default bounds = viewport
    let topBound = margin;
    let bottomBound = window.innerHeight - margin;
    let leftBound = margin;
    let rightBound = window.innerWidth - margin;
    // If trigger is inside a dialog (.al-dialog), tighten bounds to the dialog rect
    // so the dropdown never visually overflows the dialog edges.
    const dialog = trigger.closest('.al-dialog');
    if(dialog){
      const dlgRect = dialog.getBoundingClientRect();
      topBound    = Math.max(topBound,    dlgRect.top    + margin);
      bottomBound = Math.min(bottomBound, dlgRect.bottom - margin);
      leftBound   = Math.max(leftBound,   dlgRect.left   + margin);
      rightBound  = Math.min(rightBound,  dlgRect.right  - margin);
    }
    const spaceBelow = bottomBound - rect.bottom;
    const spaceAbove = rect.top - topBound;
    // Flip upward when below is too cramped AND above has more room
    const goUp = (spaceBelow < minViable) && (spaceAbove > spaceBelow);
    const maxH = Math.max(120, Math.min(preferred, goUp ? spaceAbove : spaceBelow));
    // Horizontal: match trigger width, but clamp into bounds so right edge never overflows
    let left = rect.left;
    const width = rect.width;
    if(left + width > rightBound) left = Math.max(leftBound, rightBound - width);
    if(left < leftBound) left = leftBound;
    menu.style.left = left + 'px';
    menu.style.width = width + 'px';
    if(goUp){
      menu.style.top = 'auto';
      menu.style.bottom = (window.innerHeight - rect.top + gap) + 'px';
    } else {
      menu.style.bottom = 'auto';
      menu.style.top = (rect.bottom + gap) + 'px';
    }
    const FOUR_OPT_HEIGHT = 150; // 4 options × ~36px + 3 × 2px gap ≈ 150px visible
    scroller.style.maxHeight = Math.min(FOUR_OPT_HEIGHT, Math.max(80, maxH - 16)) + 'px';
  }
  function open(){
    document.querySelectorAll('.cs-menu:not(.hidden), .ms-menu:not(.hidden)').forEach(m=>{ if(m!==menu) m.classList.add('hidden'); });
    renderMenu();
    menu.classList.remove('hidden');
    positionMenu();
    trigger.querySelector('svg').classList.add('rotate-180');
    window.addEventListener('scroll', repositionOrClose, true);
    window.addEventListener('resize', repositionOrClose);
  }
  function close(){
    menu.classList.add('hidden');
    trigger.querySelector('svg').classList.remove('rotate-180');
    window.removeEventListener('scroll', repositionOrClose, true);
    window.removeEventListener('resize', repositionOrClose);
  }
  function repositionOrClose(e){
    if(menu.classList.contains('hidden')) return;
    // Scroll inside the menu itself shouldn't trigger reposition
    if(e && e.target && menu.contains(e.target)) return;
    positionMenu();
  }
  trigger.addEventListener('click', e=>{ e.preventDefault(); e.stopPropagation(); if(menu.classList.contains('hidden')) open(); else close(); });
  // Click anywhere outside the trigger AND outside the (portalled) menu closes it
  const docHandler = (e)=>{ if(!wrap.contains(e.target) && !menu.contains(e.target)) close(); };
  document.addEventListener('click', docHandler);
  sel.addEventListener('change', ()=>{ renderTrigger(); if(!menu.classList.contains('hidden')){ renderMenu(); positionMenu(); } });
  const mo = new MutationObserver(()=>{ renderTrigger(); if(!menu.classList.contains('hidden')){ renderMenu(); positionMenu(); } });
  mo.observe(sel, { childList: true });
  _csCleanups.set(sel, ()=>{
    document.removeEventListener('click', docHandler);
    window.removeEventListener('scroll', repositionOrClose, true);
    window.removeEventListener('resize', repositionOrClose);
    mo.disconnect();
    if(menu.parentElement) menu.parentElement.removeChild(menu);
  });
  renderTrigger();
}
function initAddLeadCustomDropdowns(){
  ['alRelation','alHomeCity','alGender','alAdmissionType','alGradeApplied','alAcadYear','alDistance'].forEach(id=>{
    const sel = document.getElementById(id);
    if(sel) buildCustomSelectForNativeSelect(sel);
  });
}

// ── Auto-Fill PDF flow ──────────────────────────────────────────────
const pdfDummyData = {
  // Parent Details
  fatherName:'Rakesh Kumar Sharma', motherName:'Priya Sharma',
  fatherMobile:'9876543210', motherMobile:'9123456780',
  email:'rakesh.sharma@email.com', occupation:'Software Engineer',
  address:'12, 2nd Cross, 5th Main, Indiranagar', city:'Bengaluru', state:'Karnataka', pincode:'560038',
  languages:['English','Hindi','Kannada'],
  // Child Profile
  childName:'Aarav Sharma', gender:'Male', dob:'15-06-2020',
  currentSchool:'Little Stars Pre-school', currentClass:'Nursery',
  interests:['Drawing & Painting','Reading','Outdoor Play','Music'],
  specialNeeds:'',
  // Admission Preferences
  qualification:'LKG', specialization:'CBSE',
  experience:'4-5 years',
  preferredCity:'Bengaluru', preferredArea:'Indiranagar',
  distance:'0-5 Km', budget:'₹1 - 1.5 Lakh / year', transport:'Yes',
  amenities:['Transport','Smart Classroom','Playground','Library','Sports'],
  // Enquiry Information
  source:'SuperSchools',
  summaryHeading:'Parent walked in for an LKG admission enquiry',
  summary:'Parent visited the website via SuperSchools and is keen on a CBSE school near Indiranagar. Child currently in Nursery at Little Stars. Interested in transport facility and a strong sports programme. Wants to schedule a school tour within the next week.'
};
function prefillFromPdf(){
  const d = pdfDummyData;
  const set = (id, v)=>{ const el = $(id); if(el && v !== undefined) el.value = v; };
  // Parent Details
  set('alName', d.fatherName); set('alMotherName', d.motherName);
  set('alMobile', d.fatherMobile); set('alMotherMobile', d.motherMobile);
  set('alEmail', d.email); set('alOccupation', d.occupation);
  set('alAddress', d.address); set('alCity', d.city);
  set('alState', d.state); set('alPincode', d.pincode);
  // Child Profile
  set('alStudentName', d.childName); set('alDob', d.dob);
  set('alCurrentSchool', d.currentSchool); set('alCurrentClass', d.currentClass);
  set('alSpecialNeeds', d.specialNeeds);
  const genderSel = $('alGender'); if(genderSel){ genderSel.value = d.gender; genderSel.dispatchEvent(new Event('change')); }
  // Admission Preferences
  const qSel = $('alQualification'); if(qSel){ qSel.value = d.qualification; qSel.dispatchEvent(new Event('change')); updateFormSpecialization(); }
  const sSel = $('alSpecialization'); if(sSel){ sSel.value = d.specialization; sSel.dispatchEvent(new Event('change')); }
  const expSel = $('alExperience'); if(expSel){ expSel.value = d.experience; expSel.dispatchEvent(new Event('change')); }
  set('alPreferredCity', d.preferredCity); set('alPreferredArea', d.preferredArea);
  const distSel = $('alDistance'); if(distSel){ distSel.value = d.distance; distSel.dispatchEvent(new Event('change')); }
  const budSel = $('alBudget'); if(budSel){ budSel.value = d.budget; budSel.dispatchEvent(new Event('change')); }
  const transSel = $('alTransport'); if(transSel){ transSel.value = d.transport; transSel.dispatchEvent(new Event('change')); }
  // Enquiry Information
  const srcSel = $('alSource'); if(srcSel){ srcSel.value = d.source; srcSel.dispatchEvent(new Event('change')); }
  set('alSummaryHeading', d.summaryHeading);
  set('alSummary', d.summary);
  // Multi-selects
  const langC = document.getElementById('alLanguagesContainer'); if(langC && langC._ms) langC._ms.set(d.languages);
  const skillC = document.getElementById('alSkillsContainer'); if(skillC && skillC._ms) skillC._ms.set(d.amenities);
  const certC = document.getElementById('alCertificationsContainer'); if(certC && certC._ms) certC._ms.set(d.interests);
}
function openAutoFillModal(){
  const modal = $('autoFillPdfModal'); if(!modal) return;
  const zone = $('autoFillPdfDropzone'); if(zone) zone.classList.remove('hidden');
  const loader = $('autoFillPdfLoader'); if(loader){ loader.classList.add('hidden'); loader.classList.remove('flex'); }
  const pb = $('autoFillPdfProgressBar'); if(pb) pb.style.width = '0%';
  const inp = $('autoFillPdfInput'); if(inp) inp.value = '';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}
function closeAutoFillModal(){
  const modal = $('autoFillPdfModal'); if(!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}
function handleAutoFillPdfFile(file){
  if(!file) return;
  if(file.type !== 'application/pdf'){ showToast('Only PDF files are supported.', 'error'); return; }
  if(file.size > 5*1024*1024){ showToast('File size must be under 5 MB.', 'error'); return; }
  const zone = $('autoFillPdfDropzone');
  const loader = $('autoFillPdfLoader');
  const pb = $('autoFillPdfProgressBar');
  if(zone) zone.classList.add('hidden');
  if(loader){ loader.classList.remove('hidden'); loader.classList.add('flex'); }
  if(pb) pb.style.width = '0%';
  const steps = [15,35,55,72,85,95,100];
  let si = 0;
  const tick = ()=>{
    if(si < steps.length){ if(pb) pb.style.width = steps[si++] + '%'; }
    if(si < steps.length) setTimeout(tick, si < 4 ? 600 : 800);
    else {
      setTimeout(()=>{
        closeAutoFillModal();
        prefillFromPdf();
        // Sync CV upload pill with the same file
        setCvUploadedFile(file);
        setAutoFillFile(file);
        const banner = $('pdfInfoBanner'); if(banner){ banner.classList.remove('hidden'); banner.classList.add('flex'); }
        showToast('PDF extracted successfully. Please verify the details.', 'success');
      }, 400);
    }
  };
  setTimeout(tick, 300);
}

// ── Save ────────────────────────────────────────────────────────────
function saveAddLead(){
  if(!validateAddLeadForm()) return;
  const relation = ($('alRelation').value || '').trim();
  const cfg = RELATION_FIELD_VISIBILITY[relation] || null;
  const relationName = ($('alRelationName').value || '').trim();
  const fatherName = ($('alFatherName').value || '').trim();
  const motherName = ($('alMotherName').value || '').trim();
  const fatherMobile = ($('alFatherMobile').value || '').trim();
  const motherMobile = ($('alMotherMobile').value || '').trim();
  const homeCity = ($('alHomeCity').value || '').trim();
  const homeAddress = ($('alHomeAddress').value || '').trim();
  const childName = ($('alStudentName').value || '').trim();
  const dobStr = ($('alDob').value || '').trim();
  const gender = ($('alGender').value || '').trim();
  const gradeApplied = ($('alGradeApplied').value || '').trim();
  const acadYear = ($('alAcadYear').value || '').trim();
  const admissionType = ($('alAdmissionType').value || '').trim();
  const distanceVal = ($('alDistance').value || '').trim();
  const enquiryMsg = ($('alEnquiryMessage').value || '').trim();
  const dob = parseDobToDate(dobStr);
  // DOB is for record-keeping only; no age computation needed in the save flow
  // Determine primary contact name + mobile based on relation
  let primaryName = '';
  let primaryMobile = '';
  if(relation === 'Father'){
    primaryName = fatherName;
    primaryMobile = motherMobile; // father's mobile is the implicit source contact; show secondary
  } else if(relation === 'Mother'){
    primaryName = motherName;
    primaryMobile = fatherMobile;
  } else {
    primaryName = relationName || fatherName || motherName;
    primaryMobile = fatherMobile || motherMobile;
  }
  const initials = (primaryName || childName).split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase() || '??';
  const today = new Date();
  const dd = String(today.getDate()).padStart(2,'0');
  const mm = String(today.getMonth()+1).padStart(2,'0');
  const yyyy = today.getFullYear();
  const newLead = {
    id: Date.now(),
    n: primaryName || '\u2014',
    av: initials,
    p: primaryMobile || '\u2014',
    s: childName || '\u2014',
    e: dobStr || '\u2014',
    d: `${dd}-${mm}-${yyyy}`,
    dist: '\u2014',
    distBucket: '',
    st: statusList[0],
    source: 'Walk-in',
    gradeApplied: gradeApplied || '',
    acadYear: acadYear || '',
    admissionType: admissionType || '',
    city: homeCity || '',
    area: homeAddress || '',
    gender: gender || '',
    tourScheduled: '',
    amenities: [],
    // Extra fields
    relation: relation,
    fatherName: fatherName, motherName: motherName,
    fatherMobile: fatherMobile, motherMobile: motherMobile,
    dob: dobStr,
    distanceTravel: distanceVal || '',
    enquiryMessage: enquiryMsg || ''
  };
  applications.unshift(newLead);
  renderAll();
  closeAddLeadPage();
  setTimeout(()=>{ showToast('Admission enquiry added successfully.', 'success'); }, 80);
}

// ── Event wiring ────────────────────────────────────────────────────
// ── Live error clearing: remove error state immediately when user modifies a field ─
// Validation still runs in full on Next / Save — this only gives instant feedback
// that the error state has been acknowledged and the user is now editing.
function wireClearOnChange(){
  // Text / tel inputs — clear their specific error on any keystroke
  [
    ['alRelationName', 'alRelationNameErr'],
    ['alFatherName',   'alFatherNameErr'  ],
    ['alMotherName',   'alMotherNameErr'  ],
    ['alHomeAddress',  'alHomeAddressErr' ],
    ['alStudentName',  'alStudentNameErr' ],
  ].forEach(([id, errId]) => {
    const el = $(id); if(!el) return;
    el.addEventListener('input', () => { setFieldError(errId, false); setInputBorder(id, false); });
  });

  // Mobile inputs — live Indian number validation:
  // clear error while typing, re-validate on each keystroke when field has content.
  ['alFatherMobile','alMotherMobile'].forEach(id => {
    const el = $(id), errId = id + 'Err'; if(!el) return;
    el.addEventListener('input', () => {
      const raw = el.value;
      if(!raw.trim()){
        // Field emptied — clear any prior error
        setFieldError(errId, false); setInputBorder(id, false);
      } else {
        // Validate as user types; show error as soon as value is non-empty and invalid
        const invalid = !isValidIndianMobile(raw);
        setFieldError(errId, invalid); setInputBorder(id, invalid);
      }
    });
  });

  // Native <select> elements — clear their specific error when the user picks any option.
  // These fire from both direct native interaction and from the custom portal dropdown
  // (which dispatches `new Event('change', { bubbles:true })` on the underlying native select).
  [
    ['alRelation',     'alRelationErr'     ],
    ['alHomeCity',     'alHomeCityErr'     ],
    ['alAdmissionType','alAdmissionTypeErr'],
    ['alGradeApplied', 'alGradeAppliedErr' ],
    ['alDistance',     'alDistanceErr'     ],
  ].forEach(([id, errId]) => {
    const el = $(id); if(!el) return;
    el.addEventListener('change', () => { setFieldError(errId, false); setSelectBorder(id, false); });
  });

  // DOB field — alDobErr (required) is already cleared inside updateChildDobField()
  // via `if(dobStr){ setFieldError('alDobErr', false); }`. The age-range error
  // (alDobAgeErr) is maintained live by that same handler so no extra wiring needed.
}

if($('addLeadBtn')) $('addLeadBtn').addEventListener('click', openAddLeadPage);
// Ellipsis breadcrumb popover toggle (kept for breadcrumb UI on the main page)
if($('bcEllipsis')) $('bcEllipsis').addEventListener('click', (e)=>{
  e.stopPropagation();
  const m = $('bcEllipsisMenu'); if(!m) return;
  const willOpen = m.classList.contains('hidden');
  m.classList.toggle('hidden');
  $('bcEllipsis').setAttribute('aria-expanded', String(willOpen));
});
document.addEventListener('click', (e)=>{
  const m = $('bcEllipsisMenu');
  if(!m || m.classList.contains('hidden')) return;
  if(!e.target.closest('#bcEllipsis') && !e.target.closest('#bcEllipsisMenu')){
    m.classList.add('hidden');
    if($('bcEllipsis')) $('bcEllipsis').setAttribute('aria-expanded','false');
  }
});
if($('addLeadSave')) $('addLeadSave').addEventListener('click', saveAddLead);
// Step dialog: Back / Next
if($('addLeadNextBtn')) $('addLeadNextBtn').addEventListener('click', addLeadNextStep);
if($('addLeadBackBtn')) $('addLeadBackBtn').addEventListener('click', addLeadBackStep);
// Close with dirty-check (X button, breadcrumbs, Esc, backdrop)
if($('addLeadCloseBtn')) $('addLeadCloseBtn').addEventListener('click', maybeCloseAddLeadPage);
if($('addLeadBreadcrumb')) $('addLeadBreadcrumb').addEventListener('click', maybeCloseAddLeadPage);
if($('bcHome')) $('bcHome').addEventListener('click', maybeCloseAddLeadPage);
if($('bcAdmissions')) $('bcAdmissions').addEventListener('click', maybeCloseAddLeadPage);
if($('bcAdmissionsPopover')) $('bcAdmissionsPopover').addEventListener('click', ()=>{
  const m = $('bcEllipsisMenu'); if(m) m.classList.add('hidden');
  maybeCloseAddLeadPage();
});
// Click on dialog backdrop closes (with dirty check)
if($('addLeadPage')) $('addLeadPage').addEventListener('click', (e)=>{ if(e.target && e.target.id === 'addLeadPage') maybeCloseAddLeadPage(); });
// Esc key: if shared confirm modal is showing (for discard-lead), close it (= Continue Editing)
// Otherwise if add-lead dialog is open, try to close with dirty check
document.addEventListener('keydown', (e)=>{
  if(e.key !== 'Escape') return;
  const confirmModal = $('deleteConfirmModal');
  if(confirmModal && !confirmModal.classList.contains('hidden')){
    if(pendingConfirmContext && pendingConfirmContext.action === 'discard-lead'){
      pendingConfirmContext = null;
      closeDeleteConfirmModal();
    }
    return;
  }
  const page = $('addLeadPage');
  if(page && !page.classList.contains('hidden')) maybeCloseAddLeadPage();
});
// Clicking the discard confirm modal's backdrop is "Continue Editing" (handled by deleteConfirmModal's own click handler)
// Relation → conditional parent fields
if($('alRelation')) $('alRelation').addEventListener('change', updateRelationFields);
// DOB — validation/record keeping only, no UI logic
if($('alDob')) $('alDob').addEventListener('input', updateChildDobField);
// Admission Type → controls grade options + conditional field visibility
if($('alAdmissionType')) $('alAdmissionType').addEventListener('change', updateAdmissionTypeFields);
// Wire all validated fields to clear their error immediately when the user edits them
wireClearOnChange();

// Auto-fill modal
if($('autoFillBtn')) $('autoFillBtn').addEventListener('click', openAutoFillModal);
if($('autoFillRemoveBtn')) $('autoFillRemoveBtn').addEventListener('click', openRemoveFileConfirmModal);
if($('closeAutoFillPdf')) $('closeAutoFillPdf').addEventListener('click', closeAutoFillModal);
if($('autoFillPdfModal')) $('autoFillPdfModal').addEventListener('click', e=>{ if(e.target.id==='autoFillPdfModal') closeAutoFillModal(); });
if($('autoFillPdfInput')) $('autoFillPdfInput').addEventListener('change', function(){ if(this.files && this.files[0]) handleAutoFillPdfFile(this.files[0]); });
(function(){
  const zone = $('autoFillPdfDropzone'); if(!zone) return;
  zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.classList.add('border-[#284CA5]','bg-[#EFF4FF]'); });
  zone.addEventListener('dragleave', ()=>{ zone.classList.remove('border-[#284CA5]','bg-[#EFF4FF]'); });
  zone.addEventListener('drop', e=>{
    e.preventDefault(); zone.classList.remove('border-[#284CA5]','bg-[#EFF4FF]');
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    handleAutoFillPdfFile(file);
  });
})();

// CV upload (bottom section)
if($('cvFileInput')) $('cvFileInput').addEventListener('change', function(){
  const file = this.files && this.files[0]; if(!file) return;
  if(file.type !== 'application/pdf'){ showToast('Only PDF files are supported.', 'error'); this.value=''; return; }
  if(file.size > 5*1024*1024){ showToast('File size must be under 5 MB.', 'error'); this.value=''; return; }
  setCvUploadedFile(file);
  showToast(`"${file.name}" uploaded.`, 'success');
});
if($('removeCvFile')) $('removeCvFile').addEventListener('click', ()=>{ resetCvUpload(); showToast('CV removed.', 'error'); });
(function(){
  const zone = $('cvUploadEmpty'); if(!zone) return;
  zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.classList.add('border-[#284CA5]','bg-[#EFF4FF]'); });
  zone.addEventListener('dragleave', ()=>{ zone.classList.remove('border-[#284CA5]','bg-[#EFF4FF]'); });
  zone.addEventListener('drop', e=>{
    e.preventDefault(); zone.classList.remove('border-[#284CA5]','bg-[#EFF4FF]');
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if(!file || file.type !== 'application/pdf'){ showToast('Only PDF files are supported.', 'error'); return; }
    if(file.size > 5*1024*1024){ showToast('File size must be under 5 MB.', 'error'); return; }
    setCvUploadedFile(file); showToast(`"${file.name}" uploaded.`, 'success');
  });
})();

// Certificate uploads (max 3)
if($('certFileInput')) $('certFileInput').addEventListener('change', function(){
  const files = this.files; if(!files || !files.length) return;
  let limitHit = false;
  Array.from(files).forEach(file=>{
    if(uploadedCertFiles.length >= MAX_CERT_FILES){ limitHit = true; return; }
    if(file.type !== 'application/pdf'){ showToast(`"${file.name}" is not a PDF.`, 'error'); return; }
    if(file.size > 5*1024*1024){ showToast(`"${file.name}" exceeds 5 MB.`, 'error'); return; }
    addCertFile(file);
  });
  if(limitHit) showToast(`You can upload up to ${MAX_CERT_FILES} certificate PDFs.`, 'error');
  this.value='';
});
(function(){
  const zone = $('certUploadZone'); if(!zone) return;
  zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.classList.add('border-[#284CA5]','bg-[#EFF4FF]'); });
  zone.addEventListener('dragleave', ()=>{ zone.classList.remove('border-[#284CA5]','bg-[#EFF4FF]'); });
  zone.addEventListener('drop', e=>{
    e.preventDefault(); zone.classList.remove('border-[#284CA5]','bg-[#EFF4FF]');
    const files = e.dataTransfer && e.dataTransfer.files;
    if(!files) return;
    let limitHit = false;
    Array.from(files).forEach(file=>{
      if(uploadedCertFiles.length >= MAX_CERT_FILES){ limitHit = true; return; }
      if(file.type !== 'application/pdf'){ showToast(`"${file.name}" is not a PDF.`, 'error'); return; }
      if(file.size > 5*1024*1024){ showToast(`"${file.name}" exceeds 5 MB.`, 'error'); return; }
      addCertFile(file);
    });
    if(limitHit) showToast(`You can upload up to ${MAX_CERT_FILES} certificate PDFs.`, 'error');
  });
})();

// Escape closes auto-fill modal or page
document.addEventListener('keydown', e=>{
  if(e.key !== 'Escape') return;
  const autoFill = $('autoFillPdfModal');
  if(autoFill && !autoFill.classList.contains('hidden')){ closeAutoFillModal(); return; }
  const page = $('addLeadPage');
  if(page && !page.classList.contains('hidden')) closeAddLeadPage();
});

// Init
setupAdaptiveTooltips();
populateQualificationDropdown();
populateStatusDropdown();
const apDate = $('alAppliedDate'); if(apDate) apDate.value = todayFormatted();

/* ============================================================
   Candidate row -> Admission Enquiry Workflow (multi-page nav)
   Clicking a candidate entry in any view (table row, mobile list,
   kanban card, map list) opens that enquiry's workflow page.
   Clicks on the row's own controls (checkbox, WhatsApp / Call
   buttons, links, form fields) are ignored so they keep working.
   ============================================================ */
document.addEventListener('click', (e) => {
  if (e.target.closest('input, button, a, label, select, textarea')) return;
  const row = e.target.closest('[data-row-id]');
  if (!row) return;
  window.location.href = 'workflow.html?id=' + encodeURIComponent(row.getAttribute('data-row-id'));
});
