  /* ════════════════ STATUS DICTIONARY ════════════════ */
  const STATUS_LIST = ['New Application','Screening','Shortlisted','Interview Scheduled','Interviewed','Demo Scheduled','Offer Released','Hired','Rejected'];
  const STATUS_STYLES = {
    'New Application':           { color:'#1D4ED8', bg:'#DBEAFE', border:'#93C5FD' },
    'Screening':                { color:'#0369A1', bg:'#E0F2FE', border:'#7DD3FC' },
    'Shortlisted':              { color:'#6D28D9', bg:'#EDE9FE', border:'#C4B5FD' },
    'Interview Scheduled':      { color:'#4338CA', bg:'#E0E7FF', border:'#A5B4FC' },
    'Interviewed':              { color:'#0F766E', bg:'#CCFBF1', border:'#5EEAD4' },
    'Demo Scheduled':           { color:'#B45309', bg:'#FEF3C7', border:'#FDE68A' },
    'Offer Released':           { color:'#C2410C', bg:'#FFEDD5', border:'#FDBA74' },
    'Hired':                    { color:'#15803D', bg:'#DCFCE7', border:'#86EFAC' },
    'Rejected':                 { color:'#B91C1C', bg:'#FEE2E2', border:'#FCA5A5' }
  };

  /* ════════════════ WORKFLOW DEFINITION ════════════════
     The linear hiring lifecycle. Each milestone has a single
     pending task, a recommendation, and a primary completion action
     that auto-advances to the next status. */
  const WORKFLOW = [
    { key:'new',        status:'New Application',            railLabel:'New',         taskTitle:'Make first contact with the candidate',  taskShort:'First contact made',
      recommend:'Call or WhatsApp the candidate to introduce the school and answer their first questions.',
      cta:'Mark contact made', icon:'phone' },
    { key:'contacted',  status:'Screening',                 railLabel:'Screening',   taskTitle:'Screen the application & confirm fit', taskShort:'Candidate screened',
      recommend:'Review the resume, discuss subject, position and experience, then confirm the candidate is a fit.',
      cta:'Mark as shortlisted', icon:'msg' },
    { key:'interested', status:'Shortlisted',               railLabel:'Shortlisted', taskTitle:'Schedule an interview',               taskShort:'Interview scheduled',
      recommend:'Set up an interview slot for the candidate so the panel can assess them before deciding.',
      cta:'Schedule interview', icon:'calendar', action:'schedule' },
    { key:'visit',      status:'Interview Scheduled',       railLabel:'Interview',   taskTitle:'Conduct the interview',               taskShort:'Interview completed',
      recommend:'Host the candidate on the scheduled date, then mark the interview completed.',
      cta:'Mark interview completed', icon:'building' },
    { key:'visited',    status:'Interviewed',               railLabel:'Interviewed', taskTitle:'Release the offer',                   taskShort:'Offer released',
      recommend:'Finalise the assessment and prepare the offer for the candidate.',
      cta:'Release offer', icon:'doc' },
    { key:'application', status:'Offer Released',            railLabel:'Offer',       taskTitle:'Confirm the hire',                    taskShort:'Candidate hired',
      recommend:'Verify documents and acceptance, then confirm the hire.',
      cta:'Confirm hire', icon:'check' },
    { key:'confirmed',  status:'Hired',                     railLabel:'Hired',       taskTitle:'Candidate hired',                     taskShort:'Hired',
      recommend:'This application is complete — the candidate is hired. No further workflow action is needed.',
      terminal:true, icon:'trophy' },
  ];
  const WF_STATUS = WORKFLOW.map(w=>w.status);
  const IDX_VISIT = 3, IDX_VISITED = 4, IDX_LAST = WORKFLOW.length-1;
  function wfIndexOf(st){ return WF_STATUS.indexOf(st); }

  /* ════════════════ STATE ════════════════ */
  let workflowIndex = 3;                 // furthest active milestone (mirrors initial "Interview Scheduled")
  let currentStatus = 'Interview Scheduled';
  let completedTasks = new Set([0,1,2]); // stages already finished
  let scheduledTour = { date: 'Tomorrow, 28 May 2026', time: '11:00 AM' };
  let followup = null;                   // active follow-up pauses progression
  let closeReason = null;                // reason captured when an application is closed
  let preCloseStatus = null;             // active status to restore when reopening
  let preCloseFollowup = null;           // pending follow-up to restore when reopening
  let closeReasonValue = null;           // reason chosen in the Close dialog (custom dropdown)

  let busy = false;                      // guards against duplicate rapid actions

  const SLOTS_CONFIGURED = true;
  const ALL_SLOTS    = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM'];
  const BOOKED_SLOTS = ['9:00 AM','10:00 AM'];
  let selectedSlot = null;

  const CLOSE_REASONS = ['Not a fit for the role','Accepted another offer','Salary expectations too high','Location issue','No response from candidate','Position filled elsewhere','Duplicate application','Other reason'];

  const FEED_ICONS = {
    calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    arrow:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    phone:'<path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25 1.12.37 2.32.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z"/>',
    inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    check:'<path d="M20 6 9 17l-5-5"/>',
    bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    x:'<path d="M18 6 6 18M6 6l12 12"/>',
    building:'<path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1"/>',
    doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
    trophy:'<path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 0-3 3"/>',
    flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22V15"/>',
    pause:'<path d="M10 4H6v16h4zM18 4h-4v16h4z"/>',
    refresh:'<path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 4v5h5"/>'
  };

  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function shorten(s,n){ return s.length>n?s.slice(0,n-1)+'…':s; }

  /* ════════════════ STATUS PILL + OVERRIDE LIST ════════════════ */
  function renderStatusList(){
    const el=document.getElementById('statusList'); if(!el) return;
    el.innerHTML = STATUS_LIST.map(s=>{
      return `<button class="dp-item ${s===currentStatus?'active':''}" onclick="overrideStatus('${s.replace(/'/g,"\\'")}')">${s}</button>`;
    }).join('');
  }

  function updateStatusPill(){
    const pill=document.getElementById('statusPill'); const s=STATUS_STYLES[currentStatus]||STATUS_STYLES['New Application'];
    document.getElementById('statusValue').textContent=currentStatus;
    pill.style.color=s.color; pill.style.background=s.bg; pill.style.borderColor=s.border;
  }

  /* ════════════════ GUIDED WORKFLOW RENDER ════════════════ */
  function progressPct(){ return Math.round((workflowIndex/IDX_LAST)*100); }

  function renderGuidedWorkflow(){
    const closed    = currentStatus==='Rejected';
    const confirmed = workflowIndex>=IDX_LAST && !closed;
    const pct = progressPct();

    const badge=document.getElementById('wfProgressBadge');
    if(closed)         badge.innerHTML=`<span class="wf-progress-badge" style="color:#B91C1C;background:#FEE2E2;border-color:#FCA5A5">${pct}%</span>`;
    else if(confirmed) badge.innerHTML='<span class="wf-progress-badge" style="color:#15803D;background:#DCFCE7;border-color:#86EFAC">100%</span>';
    else               badge.innerHTML=`<span class="wf-progress-badge">${pct}%</span>`;
    const hc=document.getElementById('wfHeaderClose'); if(hc) hc.style.display=(closed||confirmed)?'none':'inline-flex';

    renderRail(closed, false, confirmed);
    renderFocus(closed, confirmed, false);
  }

  function renderRail(closed, paused, confirmed){
    const el=document.getElementById('wfRail'); if(!el) return;
    el.className='wf-rail'+(closed?' closed':'');
    el.innerHTML=WORKFLOW.map((w,i)=>{
      const isDone = i<workflowIndex || (confirmed && i===workflowIndex);   // final step ticks once Admitted is reached
      let cls='wf-node';
      if(isDone) cls+=' done';
      else if(i===workflowIndex) cls+= paused?' paused':' current';
      const lineL = i===0?'':`<span class="wf-line" style="left:0;right:50%;${(i-1)<workflowIndex?'background:var(--brand)':''}"></span>`;
      const lineR = i===WORKFLOW.length-1?'':`<span class="wf-line" style="left:50%;right:0;${i<workflowIndex?'background:var(--brand)':''}"></span>`;
      let inner;
      if(isDone) inner='<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
      else if(i===workflowIndex && paused) inner='<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'+FEED_ICONS.pause+'</svg>';
      else inner=(i+1);
      return `<button class="${cls}" onclick="railClick(${i})" title="${esc(w.status)}">${lineL}${lineR}<span class="wf-dot">${inner}</span><span class="wf-node-label">${w.railLabel}</span></button>`;
    }).join('');
  }

  function railClick(i){
    if(currentStatus==='Rejected'){ showToast('Reopen the application to change stages', true); return; }
    if(i===workflowIndex && !followup){ showToast('This is the current stage'); return; }
    overrideStatus(WORKFLOW[i].status);
  }

  function chipsHTML(){
    const done=[...completedTasks].filter(i=>i<=IDX_LAST).sort((a,b)=>a-b);
    if(!done.length) return '';
    return `<div class="wf-chips"><span class="text-[11px] font-semibold uppercase tracking-[.4px] text-[#94A3B8]">Completed &amp; locked</span>${done.map(i=>`<span class="wf-chip" title="${esc(WORKFLOW[i].taskTitle)}"><svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>${WORKFLOW[i].railLabel}</span>`).join('')}</div>`;
  }

  function closeBtnHTML(){
    return `<button class="wf-override wf-close" onclick="openCloseModal()"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>Close application</button>`;
  }

  function renderFocus(closed, confirmed, paused){
    const el=document.getElementById('wfFocus'); if(!el) return;
    if(closed){ el.innerHTML=focusClosed(); return; }
    if(paused){ el.innerHTML=focusPaused(); return; }
    if(confirmed){ el.innerHTML=focusConfirmed(); return; }
    el.innerHTML=focusActive();
  }

  function focusActive(){
    const stage=WORKFLOW[workflowIndex];
    const next = workflowIndex<IDX_LAST ? WORKFLOW[workflowIndex+1].status : '—';
    const sp=STATUS_STYLES[currentStatus]||STATUS_STYLES['New Application'];
    const nextCol = STATUS_STYLES[next] ? STATUS_STYLES[next].color : '#0F172A';
    return `<div class="wf-focus">
      <div class="wf-focus-grid">
        <div class="wf-cell"><span class="wf-k">Current status</span><span class="wf-v"><span class="inline-flex items-center gap-1.5"><span class="status-dot" style="background:${sp.color}"></span>${currentStatus}</span></span></div>
        <div class="wf-cell accent"><span class="wf-k">Current pending task</span><span class="wf-v">${stage.taskTitle}</span></div>
        <div class="wf-cell"><span class="wf-k">Next status after completion</span><span class="wf-v" style="color:${nextCol}">${next}</span></div>
      </div>
      <div class="wf-recommend"><span class="grid h-5 w-5 shrink-0 place-items-center rounded-md" style="background:var(--brand-soft);color:var(--brand)"><svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></span><span><b style="color:#1E293B">Recommended next step — </b>${stage.recommend}</span></div>
      <div class="wf-actions">
        <button class="wf-cta" onclick="completeCurrentTask()"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>${stage.cta}</button>
        ${wfVisitHTML()}
        ${wfFollowupHTML()}
      </div>
    </div>`;
  }

  /* Interview + follow-up folded into the Guided Workflow as compact actions beside Close (no separate cards) */
  function wfVisitHTML(){
    const ic=`<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FEED_ICONS.building}</svg>`;
    const reIco=`<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FEED_ICONS.refresh}</svg>`;
    if(workflowIndex===IDX_VISIT){
      return `<span class="wf-chip-action indigo" title="Interview on ${esc(scheduledTour.date)} at ${esc(scheduledTour.time)}"><span class="wf-chip-meta">${ic}Interview · ${esc(scheduledTour.date)}, ${esc(scheduledTour.time)}</span><button class="wf-chip-btn no-print" title="Reschedule interview" onclick="openScheduleTourModal('reschedule')">${reIco}</button><button class="wf-chip-btn no-print" title="Cancel interview" onclick="cancelVisit()"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${FEED_ICONS.x}</svg></button></span>`;
    }
    if(workflowIndex>=IDX_VISITED){
      return `<span class="wf-chip-action slate" title="Interviewed ${esc(scheduledTour.date)} — schedule a follow-up round if needed"><span class="wf-chip-meta">${ic}Interview done · ${esc(scheduledTour.date)}</span><button class="wf-chip-btn no-print" title="Schedule another round" onclick="openScheduleTourModal('revisit')">${reIco}</button></span>`;
    }
    if(WORKFLOW[workflowIndex].action==='schedule') return '';   // Shortlisted: the prominent primary CTA already schedules
    return `<button class="wf-override no-print" onclick="openScheduleTourModal('schedule')">${ic}Schedule interview</button>`;
  }

  function wfFollowupHTML(){
    const ic=`<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FEED_ICONS.bell}</svg>`;
    if(followup){
      const overdue = followup.dateISO && followup.dateISO < formatDateISO(new Date());
      const cls = overdue ? 'red' : 'amber';
      const label = (overdue ? 'Overdue · ' : 'Follow-up · ') + esc(followup.date);
      const tip = (overdue ? 'Follow-up overdue' : 'Follow-up pending') + (followup.note ? ' — '+esc(shorten(followup.note,60)) : '');
      return `<span class="wf-chip-action ${cls}" title="${tip}"><span class="wf-chip-meta">${ic}${label}</span><button class="wf-chip-btn done no-print" title="Mark follow-up done" onclick="completeFollowup()"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></button><button class="wf-chip-btn no-print" title="Edit / reschedule follow-up" onclick="openFollowupModal()"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></button></span>`;
    }
    return `<button class="wf-override no-print" onclick="openFollowupModal()">${ic}Add follow-up</button>`;
  }

  function cancelVisit(){
    closeDropdowns();
    if(currentStatus==='Rejected'){ showToast('Reopen the application to manage the interview', true); return; }
    if(workflowIndex!==IDX_VISIT){ showToast('No scheduled interview to cancel'); return; }
    completedTasks=new Set([0,1]); workflowIndex=2; currentStatus='Shortlisted';
    renderAll();
    addActivity('Interview cancelled',{icon:'x',accent:true,meta:'Reverted to “Shortlisted” — reschedule when ready'});
    showToast('Interview cancelled · status moved to “Shortlisted”');
  }

  function focusPaused(){
    const stage=WORKFLOW[workflowIndex];
    return `<div class="wf-focus">
      <div class="wf-banner paused"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg" style="background:#FEF3C7;color:#B45309"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FEED_ICONS.pause}</svg></span><div><p class="font-semibold">Workflow paused — follow-up pending</p><p class="mt-0.5 text-[12.5px] leading-relaxed">Follow-up due <b>${followup.date}</b>${followup.note?` · ${esc(shorten(followup.note,60))}`:''}. Complete it to resume at “${stage.status}”.</p></div></div>
      <div class="wf-actions">
        <button class="wf-cta green" onclick="completeFollowup()"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Mark follow-up done &amp; resume</button>
        <button class="wf-override" onclick="openFollowupModal()"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>Edit follow-up</button>
        ${closeBtnHTML()}
      </div>
    </div>`;
  }

  function focusConfirmed(){
    return `<div class="wf-focus">
      <div class="wf-banner success"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg" style="background:#DCFCE7;color:#16A34A"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FEED_ICONS.trophy}</svg></span><div><p class="font-semibold">Candidate hired — workflow complete 🎉</p><p class="mt-0.5 text-[12.5px] leading-relaxed">All stages are done. No further workflow action is required for this application.</p></div></div>
    </div>`;
  }

  function focusClosed(){
    const reasonLine = closeReason ? `<p class="mt-1 text-[12px] font-semibold text-[#B91C1C]">Reason: ${esc(closeReason)}</p>` : '';
    return `<div class="wf-focus">
      <div class="wf-banner closed"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg" style="background:#FEE2E2;color:#B91C1C"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FEED_ICONS.x}</svg></span><div><p class="font-semibold">Application closed — workflow stopped</p><p class="mt-0.5 text-[12.5px] leading-relaxed">Progression is disabled. Reopen the application to resume from where it left off.</p>${reasonLine}</div></div>
      <div class="wf-actions">
        <button class="wf-cta" onclick="reopenEnquiry()"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${FEED_ICONS.refresh}</svg>Reopen application</button>
      </div>
    </div>`;
  }

  function scrollToWorkflow(){ document.getElementById('guidedWorkflowSection')?.scrollIntoView({behavior:'smooth',block:'start'}); }
  function scrollToNotes(){ document.getElementById('notesSection')?.scrollIntoView({behavior:'smooth',block:'start'}); }

  /* ════════════════ NEXT-UP HEADER HINT ════════════════ */
  function nextUpHTML(){
    if(currentStatus==='Rejected')         return tag('#94A3B8','x', closeReason ? ('Application closed — '+closeReason+'. Reopen to resume.') : 'Application closed — reopen to resume the workflow.');
    if(workflowIndex>=IDX_LAST)            return tag('#15803D','trophy','Candidate hired — workflow complete.');
    const stage=WORKFLOW[workflowIndex];
    const col=(STATUS_STYLES[currentStatus]||{}).color||'#284CA5';
    return tag(col, stage.icon, `${stage.taskTitle}.`, 'Go to task','scrollToWorkflow()');
  }
  function tag(color, icon, text, btnLabel, btnAction){
    const ic=FEED_ICONS[icon]||FEED_ICONS.arrow;
    return `<span class="grid h-6 w-6 shrink-0 place-items-center rounded-md" style="background:${color}1A;color:${color}"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ic}</svg></span>
      <span class="min-w-0 truncate font-medium text-[#334155]"><span class="text-[#94A3B8]">Next:</span> ${text}</span>
      ${btnLabel?`<button class="no-print ml-1 shrink-0 rounded-md px-1.5 py-0.5 text-[12px] font-semibold text-[#284CA5] transition hover:bg-[#EFF4FF]" onclick="${btnAction}">${btnLabel}</button>`:''}`;
  }
  function renderNextUp(){ const el=document.getElementById('nextUp'); if(el) el.innerHTML=nextUpHTML(); }

  /* ════════════════ PENDING FOLLOW-UP HIGHLIGHT (top profile) ════════════════ */
  function renderFollowupHighlight(){
    const el=document.getElementById('followupHighlight'); if(!el) return;
    if(followup && currentStatus!=='Rejected'){
      el.style.display='';
      el.innerHTML=`<div class="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2">
        <span class="flex min-w-0 items-center gap-2">
          <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#FFEDD5] text-[#C2410C]"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FEED_ICONS.bell}</svg></span>
          <span class="min-w-0">
            <span class="block text-[10.5px] font-semibold uppercase tracking-[0.5px] text-[#9A3412]">Follow-up pending</span>
            <span class="block truncate text-[13px] font-semibold text-[#7C2D12]">${followup.date}${followup.note?` · <span class="font-medium text-[#9A3412]">${esc(shorten(followup.note,60))}</span>`:''}</span>
          </span>
        </span>
        <span class="no-print ml-auto flex shrink-0 items-center gap-1.5">
          <button onclick="completeFollowup()" class="inline-flex h-7 items-center gap-1 rounded-lg bg-[#16A34A] px-2.5 text-[12px] font-semibold text-white transition hover:bg-[#15803D]"><svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Done</button>
          <button onclick="openFollowupModal()" class="inline-flex h-7 items-center rounded-lg border border-[#FED7AA] bg-white px-2.5 text-[12px] font-semibold text-[#C2410C] transition hover:bg-[#FFF7ED]">Edit</button>
        </span>
      </div>`;
    } else {
      el.style.display='none'; el.innerHTML='';
    }
  }

  /* ════════════════ CENTRAL RENDER ════════════════ */
  function renderAll(){
    updateStatusPill();
    renderStatusList();
    renderGuidedWorkflow();   /* visit + follow-up panels render inside the workflow focus area */
  }

  /* ════════════════ TASK COMPLETION + AUTO PROGRESSION ════════════════ */
  function completeCurrentTask(){
    closeDropdowns();
    if(currentStatus==='Rejected'){ showToast('Application is closed — reopen it to continue', true); return; }
    const stage=WORKFLOW[workflowIndex];
    if(stage.terminal){ showToast('Candidate already hired — no further action needed'); return; }
    if(busy) return;                                  // guard duplicate rapid clicks
    if(stage.action==='schedule'){ openScheduleTourModal('schedule'); return; } // advance happens on confirm
    advanceWorkflow();
  }

  function advanceWorkflow(){
    if(workflowIndex>=IDX_LAST) return;
    busy=true;
    const stage=WORKFLOW[workflowIndex];
    completedTasks.add(workflowIndex);
    workflowIndex++;
    currentStatus=WORKFLOW[workflowIndex].status;
    renderAll();
    const to=currentStatus;
    if(to==='Hired') addActivity('Candidate hired',{icon:'trophy',accent:true});
    else addActivity('Task completed: '+stage.taskTitle,{icon:'check',accent:true,meta:'Stage advanced to “'+to+'”'});
    showToast('✓ '+stage.taskShort+' · moved to “'+to+'”');
    setTimeout(()=>{ busy=false; }, 350);
  }

  function reopenEnquiry(){
    if(currentStatus!=='Rejected') return;
    const resume = preCloseStatus || WORKFLOW[workflowIndex].status;   // restore previous active state (fallback: current stage)
    currentStatus = resume;
    followup = preCloseFollowup || null;                               // restore any pending follow-up
    closeReason = null; preCloseStatus = null; preCloseFollowup = null;
    renderAll();
    addActivity('Application reopened',{icon:'refresh',accent:true,meta:'Resumed at “'+resume+'”'});
    showToast('Application reopened · resumed at “'+resume+'”');
  }

  /* ════════════════ MANUAL OVERRIDE ════════════════ */
  function overrideStatus(value){
    closeDropdowns();
    const prev=currentStatus;
    if(value===prev){ showToast('Already at “'+value+'”'); return; }
    if(value==='Rejected'){ openCloseModal(); return; }                  // route to the close-reason flow

    currentStatus=value;
    const idx=wfIndexOf(value);
    if(idx>=0){
      workflowIndex=idx;
      completedTasks=new Set();
      for(let i=0;i<idx;i++) completedTasks.add(i);
      if(value==='Hired'){ for(let i=0;i<IDX_LAST;i++) completedTasks.add(i); }
    }
    /* 'Rejected' keeps workflowIndex so the application can be reopened in place. Follow-up is independent of status. */
    renderAll();
    addActivity('Status manually overridden by admin',{icon:'flag',accent:true,meta:prev+' → '+value});
    showToast('Overridden by admin · '+prev+' → '+value);
  }

  /* ════════════════ CLOSE APPLICATION (with reason) ════════════════ */
  function openCloseModal(){
    if(currentStatus==='Rejected'){ showToast('Application is already closed'); return; }
    closeReasonValue=null;
    renderCloseForm(document.getElementById('closeContent'));
    renderCloseReasonPanel();
    document.getElementById('closeModal').classList.add('open'); lockBodyScroll();
  }
  function closeCloseModal(){ closeDropdowns(); document.getElementById('closeModal')?.classList.remove('open'); unlockBodyScrollIfAllClosed(); }
  function handleCloseOverlayClick(e){ if(e.target===document.getElementById('closeModal')) closeCloseModal(); }
  function updateCloseBtn(){ const btn=document.getElementById('closeConfirmBtn'); if(btn) btn.disabled=!closeReasonValue; }
  function renderCloseReasonPanel(){
    const el=document.getElementById('closeReasonList'); if(!el) return;
    el.innerHTML=CLOSE_REASONS.map(r=>`<button class="dp-item ${r===closeReasonValue?'active':''}" onclick="pickCloseReason('${r.replace(/'/g,"\\'")}')">${esc(r)}</button>`).join('');
  }
  function pickCloseReason(r){
    closeReasonValue=r;
    const lbl=document.getElementById('closeReasonValue');
    if(lbl){ lbl.textContent=r; lbl.classList.remove('text-[#94A3B8]'); lbl.classList.add('text-[#334155]'); }
    renderCloseReasonPanel();
    updateCloseBtn();
    closeDropdowns();
  }
  function renderCloseForm(container){
    const placeholder = closeReasonValue || 'Select a reason…';
    container.innerHTML=`<div class="px-5 pt-5 pb-5"><div class="mb-4 flex items-center justify-between"><h3 class="text-[15px] font-semibold text-[#0F172A]">Close Application</h3><button onclick="closeCloseModal()" class="grid h-7 w-7 place-items-center rounded-lg text-[#64748B] transition hover:bg-[#EEF2F7] hover:text-[#0F172A]"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
      <div class="mb-4 flex items-start gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5"><svg class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B91C1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg><p class="text-[12px] text-[#B91C1C]">Closing stops the workflow. You can reopen this application later to resume from the current stage.</p></div>
      <div class="mb-5"><label class="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.5px] text-[#475569]">Reason for closing</label>
        <button type="button" id="closeReasonTrigger" onclick="toggleDropdown('closeReasonPanel', event)" class="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-white pl-3 pr-2 text-[13px] outline-none transition hover:border-[#D7E4FF] focus:border-[#BFD3FF] focus:ring-2 focus:ring-[#DCE8FF]"><span id="closeReasonValue" class="${closeReasonValue?'text-[#334155]':'text-[#94A3B8]'}">${esc(placeholder)}</span><svg class="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>
      </div>
      <div class="flex gap-2 border-t border-[#EEF2F7] pt-4"><button onclick="closeCloseModal()" class="h-9 flex-1 rounded-xl border border-[#E2E8F0] bg-white text-[13px] font-semibold text-[#475569] transition hover:bg-[#EFF4FF] hover:text-[#284CA5]">Cancel</button><button id="closeConfirmBtn" onclick="confirmCloseEnquiry()" ${closeReasonValue?'':'disabled'} class="h-9 flex-1 rounded-xl bg-[#DC2626] text-[13px] font-semibold text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-40">Close application</button></div></div>`;
  }
  function confirmCloseEnquiry(){
    const reason=closeReasonValue;
    if(!reason){ showToast('Please select a reason to close', true); return; }
    if(currentStatus!=='Rejected'){ preCloseStatus=currentStatus; preCloseFollowup=followup; }  // remember where to resume
    closeReason=reason; currentStatus='Rejected';                                                // workflowIndex preserved for in-place reopen
    closeCloseModal();
    renderAll();
    addActivity('Application closed',{icon:'x',accent:true,meta:'Reason: '+reason});
    showToast('Application closed · '+reason);
  }

  /* ════════════════ SCHEDULE / CALENDAR ════════════════ */
  function lockBodyScroll(){ document.body.style.overflow='hidden'; }
  function unlockBodyScrollIfAllClosed(){ const s=document.getElementById('scheduleTourModal')?.classList.contains('open'); const c=document.getElementById('calendarModal')?.classList.contains('open'); const f=document.getElementById('followupModal')?.classList.contains('open'); const x=document.getElementById('closeModal')?.classList.contains('open'); if(!s&&!c&&!f&&!x) document.body.style.overflow=''; }

  function openScheduleTourModal(mode){
    if(currentStatus==='Rejected'){ showToast('Reopen the application to schedule an interview', true); return; }
    if(workflowIndex>=IDX_LAST){ showToast('Candidate hired — interview scheduling is not required'); return; }
    selectedSlot=null; const content=document.getElementById('scheduleTourContent');
    content.dataset.mode=mode;
    if(!SLOTS_CONFIGURED) renderEmptyState(content); else renderScheduleForm(content,mode);
    document.getElementById('scheduleTourModal').classList.add('open'); lockBodyScroll();
  }
  function closeScheduleTourModal(){ document.getElementById('scheduleTourModal').classList.remove('open'); closeCalendarModal(); unlockBodyScrollIfAllClosed(); }
  function handleModalOverlayClick(e){ if(e.target===document.getElementById('scheduleTourModal')) closeScheduleTourModal(); }

  const CAL_W=320, CAL_GAP=8;
  function openCalendarModal(event){ if(event) event.stopPropagation(); const m=document.getElementById('calendarModal'); m.classList.add('open'); lockBodyScroll(); const trigger=(event&&event.currentTarget)||document.getElementById('calTrigger'); requestAnimationFrame(()=>positionCalendar(trigger)); }
  function positionCalendar(trigger){ const c=document.getElementById('calContainer'); if(!c||!trigger) return; const tr=trigger.getBoundingClientRect(); const vw=innerWidth, vh=innerHeight, calH=c.offsetHeight||380; let left=tr.right-CAL_W; if(left<CAL_GAP) left=tr.left; if(left+CAL_W>vw-CAL_GAP) left=vw-CAL_W-CAL_GAP; if(left<CAL_GAP) left=Math.max(CAL_GAP,(vw-CAL_W)/2); let top=tr.bottom+CAL_GAP; if(top+calH>vh-CAL_GAP) top=tr.top-calH-CAL_GAP; if(top<CAL_GAP) top=Math.max(CAL_GAP,(vh-calH)/2); c.style.left=Math.round(left)+'px'; c.style.top=Math.round(top)+'px'; }
  function closeCalendarModal(){ const m=document.getElementById('calendarModal'); if(m) m.classList.remove('open'); closeCalPickers(); unlockBodyScrollIfAllClosed(); }
  function handleCalModalOverlayClick(e){ if(e.target===document.getElementById('calendarModal')) closeCalendarModal(); }

  function renderEmptyState(container){
    container.innerHTML=`<div class="px-5 py-5"><div class="mb-4 flex items-center justify-between"><h3 class="text-[15px] font-semibold text-[#0F172A]">Schedule Interview</h3><button onclick="closeScheduleTourModal()" class="grid h-7 w-7 place-items-center rounded-lg text-[#64748B] transition hover:bg-[#EEF2F7] hover:text-[#0F172A]"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div><div class="rounded-xl border border-[#EEF2F7] bg-[#FAFBFD] px-4 py-8 text-center"><div class="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-[#F1F5F9]"><svg class="h-6 w-6 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div><p class="text-[13.5px] font-semibold text-[#0F172A]">Interview slots are not configured</p><p class="mt-1.5 text-[12.5px] leading-relaxed text-[#64748B]">Configure available interview timings in Settings before scheduling.</p><button onclick="closeScheduleTourModal()" class="mt-4 inline-flex h-9 items-center gap-2 rounded-xl bg-[#284CA5] px-4 text-[13px] font-semibold text-white transition hover:bg-[#203F8D]">Go to Settings</button></div></div>`;
  }

  function openVisitCalendar(event){ calOnPick=(iso)=>{ const tv=document.getElementById('calTriggerValue'); if(tv) tv.textContent=formatDatePretty(iso); selectedSlot=null; renderSlots(iso,null); }; openCalendarModal(event); }

  function renderScheduleForm(container, mode){
    const isReschedule=mode==='reschedule', isRevisit=mode==='revisit';
    const heading=isRevisit?'Schedule Another Round':(isReschedule?'Reschedule Interview':'Schedule Interview');
    const today=new Date(); const todayStr=formatDateISO(today); const preDate=todayStr;
    container.innerHTML=`<div class="px-5 pt-5 pb-5"><div class="mb-4 flex items-center justify-between"><h3 class="text-[15px] font-semibold text-[#0F172A]">${heading}</h3><button onclick="closeScheduleTourModal()" class="grid h-7 w-7 place-items-center rounded-lg text-[#64748B] transition hover:bg-[#EEF2F7] hover:text-[#0F172A]"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
      ${isReschedule?`<div class="mb-4 flex items-start gap-2 rounded-lg border border-[#FDE68A] bg-[#FEFCE8] px-3 py-2.5"><svg class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A16207]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg><p class="text-[12px] text-[#A16207]">Currently scheduled: <span class="font-semibold">${scheduledTour.date}, ${scheduledTour.time}</span></p></div>`:''}
      ${isRevisit?`<div class="mb-4 flex items-start gap-2 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2.5"><svg class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#16A34A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><p class="text-[12px] text-[#166534]">Previous interview completed. Scheduling another round moves the workflow back to “Interview Scheduled”.</p></div>`:''}
      <div class="mb-4"><label class="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.5px] text-[#475569]">Interview Date</label><button type="button" id="calTrigger" onclick="openVisitCalendar(event)" class="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-white pl-3 pr-1.5 text-[13px] text-[#334155] outline-none transition hover:border-[#D7E4FF] focus:border-[#BFD3FF] focus:ring-2 focus:ring-[#DCE8FF]"><span id="calTriggerValue">Select date</span><span class="grid h-6 w-6 place-items-center text-[#94A3B8]"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span></button></div>
      <div class="mb-5"><label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.5px] text-[#475569]">Available Time Slots</label><div id="slotGrid" class="flex flex-wrap gap-2"></div><p class="mt-1.5 text-[11px] text-[#94A3B8]">Greyed slots are already booked</p></div>
      <div class="flex gap-2 border-t border-[#EEF2F7] pt-4"><button onclick="closeScheduleTourModal()" class="h-9 flex-1 rounded-xl border border-[#E2E8F0] bg-white text-[13px] font-semibold text-[#475569] transition hover:bg-[#EFF4FF] hover:text-[#284CA5]">Cancel</button><button onclick="confirmTourSchedule('${mode}')" class="h-9 flex-1 rounded-xl bg-[#284CA5] text-[13px] font-semibold text-white transition hover:bg-[#203F8D]">${isRevisit?'Confirm Round':(isReschedule?'Confirm Reschedule':'Confirm Schedule')}</button></div></div>`;
    initCalendar('calContainer',preDate,todayStr);
    renderSlots(preDate, isReschedule?scheduledTour.time:null);
  }

  function renderSlots(dateStr, preSelect){ const grid=document.getElementById('slotGrid'); if(!grid) return; if(preSelect&&!selectedSlot) selectedSlot=preSelect; grid.innerHTML=ALL_SLOTS.map(slot=>{ const booked=BOOKED_SLOTS.includes(slot); const active=slot===selectedSlot; return `<button class="slot-chip${active?' selected':''}" ${booked?'disabled':`onclick="selectSlot('${slot}')"`}>${slot}</button>`; }).join(''); }
  function selectSlot(slot){ selectedSlot=slot; renderSlots(calSelectedDate,slot); }

  function confirmTourSchedule(mode){
    if(!selectedSlot){ showToast('Please select a time slot', true); return; }
    if(!calSelectedDate){ showToast('Please select a date', true); return; }
    scheduledTour={ date:formatDatePretty(calSelectedDate), time:selectedSlot }; selectedSlot=null;
    closeScheduleTourModal();

    if(mode==='revisit'){
      // Another round moves the workflow back to the "Interview Scheduled" stage.
      completedTasks=new Set([0,1,2]); workflowIndex=IDX_VISIT; currentStatus='Interview Scheduled'; followup=null;
      renderAll();
      addActivity('Another interview round scheduled',{accent:true,icon:'calendar',meta:scheduledTour.date+', '+scheduledTour.time});
      showToast('Another round scheduled · moved back to “Interview Scheduled”');
      return;
    }

    const advancing = workflowIndex<IDX_VISIT;   // scheduling completes the "Shortlisted" stage
    if(advancing){ completedTasks=new Set([0,1,2]); workflowIndex=IDX_VISIT; }
    if(currentStatus!=='Rejected') currentStatus='Interview Scheduled';
    renderAll();
    const verb = mode==='reschedule' ? 'Interview rescheduled' : 'Interview scheduled';
    addActivity(verb,{accent:true,icon:'calendar',meta:scheduledTour.date+', '+scheduledTour.time});
    showToast(advancing ? '✓ Interview scheduled · moved to “Interview Scheduled”' : (verb+' · '+scheduledTour.date+', '+scheduledTour.time));
  }

  /* Calendar widget */
  const MONTH_NAMES=['January','February','March','April','May','June','July','August','September','October','November','December'];
  let calViewYear=null, calViewMonth=null, calSelectedDate=null, calMinDate=null, calTargetId=null, calOnPick=null;
  function formatDateISO(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function formatDatePretty(iso){ if(!iso) return ''; try{ return new Date(iso+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}); }catch(_){ return iso; } }
  function parseISO(iso){ const[y,m,d]=iso.split('-').map(Number); return new Date(y,m-1,d); }
  function initCalendar(targetId, initialISO, minISO){ calTargetId=targetId; calMinDate=minISO?parseISO(minISO):new Date(new Date().setHours(0,0,0,0)); const start=initialISO?parseISO(initialISO):new Date(); calViewYear=start.getFullYear(); calViewMonth=start.getMonth(); calSelectedDate=initialISO||formatDateISO(start); renderCalendar(); const tv=document.getElementById('calTriggerValue'); if(tv) tv.textContent=formatDatePretty(calSelectedDate); }
  function renderCalendar(){ const target=document.getElementById(calTargetId); if(!target) return; const firstDayIndex=new Date(calViewYear,calViewMonth,1).getDay(); const daysInMonth=new Date(calViewYear,calViewMonth+1,0).getDate(); const daysInPrev=new Date(calViewYear,calViewMonth,0).getDate(); const todayISO=formatDateISO(new Date()); let cells=''; for(let i=firstDayIndex-1;i>=0;i--) cells+=`<button class="cal-day outside" disabled>${daysInPrev-i}</button>`; for(let d=1;d<=daysInMonth;d++){ const iso=formatDateISO(new Date(calViewYear,calViewMonth,d)); const isToday=iso===todayISO; const isSelected=iso===calSelectedDate; const isPast=new Date(calViewYear,calViewMonth,d)<calMinDate; const cls=['cal-day']; if(isToday&&!isSelected) cls.push('today'); if(isSelected) cls.push('selected'); cells+=`<button class="${cls.join(' ')}" ${isPast?'disabled':`onclick="calPickDay('${iso}')"`}>${d}</button>`; } const used=firstDayIndex+daysInMonth; for(let i=1;i<=42-used;i++) cells+=`<button class="cal-day outside" disabled>${i}</button>`; const minY=calMinDate.getFullYear(), minM=calMinDate.getMonth(); const prevDisabled=(calViewYear<minY)||(calViewYear===minY&&calViewMonth<=minM); target.innerHTML=`<div class="cal-widget"><div class="cal-header"><button class="cal-nav" onclick="calPrev()" ${prevDisabled?'disabled':''}><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button><div class="cal-title"><div class="relative"><button class="cal-title-btn" onclick="toggleCalPicker('month',event)">${MONTH_NAMES[calViewMonth]}<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button></div><div class="relative"><button class="cal-title-btn" onclick="toggleCalPicker('year',event)">${calViewYear}<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button></div></div><button class="cal-nav" onclick="calNext()"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button></div><div class="cal-weekdays"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div><div class="cal-days">${cells}</div></div>`; }
  function calPrev(){ closeCalPickers(); if(calViewMonth===0){ calViewMonth=11; calViewYear--; } else calViewMonth--; renderCalendar(); }
  function calNext(){ closeCalPickers(); if(calViewMonth===11){ calViewMonth=0; calViewYear++; } else calViewMonth++; renderCalendar(); }
  function calPickDay(iso){ closeCalPickers(); calSelectedDate=iso; renderCalendar(); if(typeof calOnPick==='function') calOnPick(iso); closeCalendarModal(); }
  function toggleCalPicker(type,event){ event.stopPropagation(); const ex=document.getElementById('calPickerPanel'); if(ex){ ex.remove(); return; } closeCalPickers(); const panel=document.createElement('div'); panel.className='cal-picker-panel'; panel.id='calPickerPanel'; panel.addEventListener('click',e=>e.stopPropagation()); if(type==='month'){ panel.innerHTML=MONTH_NAMES.map((m,i)=>`<button class="${i===calViewMonth?'active':''}" onclick="setCalMonth(${i})">${m}</button>`).join(''); } else { const cy=new Date().getFullYear(); const years=[]; for(let y=cy;y<=cy+6;y++) years.push(y); panel.innerHTML=years.map(y=>`<button class="${y===calViewYear?'active':''}" onclick="setCalYear(${y})">${y}</button>`).join(''); } event.currentTarget.parentElement.appendChild(panel); }
  function setCalMonth(m){ calViewMonth=m; closeCalPickers(); renderCalendar(); }
  function setCalYear(y){ calViewYear=y; closeCalPickers(); renderCalendar(); }
  function closeCalPickers(){ document.querySelectorAll('.cal-picker-panel').forEach(p=>p.remove()); }

  /* ════════════════ FOLLOW-UP MODAL ════════════════ */
  let followupDraftDate=null;
  function openFollowupModal(){
    if(currentStatus==='Rejected'){ showToast('Reopen the application to set a follow-up', true); return; }
    renderFollowupForm(document.getElementById('followupContent')); document.getElementById('followupModal').classList.add('open'); lockBodyScroll();
  }
  function closeFollowupModal(){ document.getElementById('followupModal').classList.remove('open'); closeCalendarModal(); unlockBodyScrollIfAllClosed(); }
  function handleFollowupOverlayClick(e){ if(e.target===document.getElementById('followupModal')) closeFollowupModal(); }
  function openFollowupCalendar(event){ calOnPick=(iso)=>{ followupDraftDate=iso; const tv=document.getElementById('followupDateValue'); if(tv) tv.textContent=formatDatePretty(iso); }; openCalendarModal(event); }
  function renderFollowupForm(container){
    followupDraftDate=followup?followup.dateISO:null; const today=formatDateISO(new Date());
    const dateLabel=followupDraftDate?formatDatePretty(followupDraftDate):'Select date'; const noteVal=followup?(followup.note||''):''; const isUpdate=!!followup;
    container.innerHTML=`<div class="px-5 pt-5 pb-5"><div class="mb-4 flex items-center justify-between"><h3 class="text-[15px] font-semibold text-[#0F172A]">${isUpdate?'Update Follow-up':'Add Follow-up'}</h3><button onclick="closeFollowupModal()" class="grid h-7 w-7 place-items-center rounded-lg text-[#64748B] transition hover:bg-[#EEF2F7] hover:text-[#0F172A]"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
      <div class="mb-4 flex items-start gap-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5"><svg class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B45309]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FEED_ICONS.bell}</svg><p class="text-[12px] text-[#92400E]">A follow-up is a reminder to reconnect with the candidate. It is tracked separately and does not change the application status.</p></div>
      <div class="mb-4"><label class="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.5px] text-[#475569]">Follow-up Date</label><button type="button" id="followupDateTrigger" onclick="openFollowupCalendar(event)" class="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-white pl-3 pr-1.5 text-[13px] text-[#334155] outline-none transition hover:border-[#D7E4FF] focus:border-[#BFD3FF] focus:ring-2 focus:ring-[#DCE8FF]"><span id="followupDateValue">${dateLabel}</span><span class="grid h-6 w-6 place-items-center text-[#94A3B8]"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span></button></div>
      <div class="mb-5"><label class="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.5px] text-[#475569]">Reminder Note</label><textarea id="followupNote" rows="3" placeholder="e.g. Call candidate to discuss salary expectations and confirm interview slot" class="w-full resize-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#334155] outline-none transition placeholder:text-[#94A3B8] focus:border-[#BFD3FF] focus:ring-2 focus:ring-[#DCE8FF]">${esc(noteVal)}</textarea></div>
      <div class="flex gap-2 border-t border-[#EEF2F7] pt-4"><button onclick="closeFollowupModal()" class="h-9 flex-1 rounded-xl border border-[#E2E8F0] bg-white text-[13px] font-semibold text-[#475569] transition hover:bg-[#EFF4FF] hover:text-[#284CA5]">Cancel</button><button onclick="saveFollowup()" class="h-9 flex-1 rounded-xl bg-[#284CA5] text-[13px] font-semibold text-white transition hover:bg-[#203F8D]">${isUpdate?'Update':'Save'}</button></div></div>`;
    initCalendar('calContainer', followupDraftDate||today, today);
  }
  function saveFollowup(){
    if(!followupDraftDate){ showToast('Please select a follow-up date', true); return; }
    const note=(document.getElementById('followupNote')?.value||'').trim(); const isUpdate=!!followup;
    followup={ dateISO:followupDraftDate, date:formatDatePretty(followupDraftDate), note };
    closeFollowupModal();
    addActivity(isUpdate?'Follow-up updated':'Follow-up added',{meta:followup.date,accent:true,icon:'bell'});
    renderAll();
    showToast(isUpdate?'Follow-up updated':'Follow-up added');
  }
  function completeFollowup(){
    if(!followup) return;
    const done=followup; followup=null;
    renderAll();
    addActivity('Follow-up completed',{meta:done.date,accent:true,icon:'check'});
    showToast('Follow-up completed');
  }

  /* ════════════════ DROPDOWN POSITIONING ════════════════ */
  function closeDropdowns(){ document.querySelectorAll('.dropdown-panel').forEach(p=>p.classList.remove('open')); }
  function toggleDropdown(panelId, event){ event.stopPropagation(); const panel=document.getElementById(panelId); const trigger=event.currentTarget; const isOpen=panel.classList.contains('open'); closeDropdowns(); if(isOpen) return; panel.style.visibility='hidden'; panel.classList.add('open'); const rect=trigger.getBoundingClientRect(); const pw=panel.offsetWidth, ph=panel.offsetHeight, m=12; let top=rect.bottom+6, left=rect.left; if(left+pw>innerWidth-m) left=innerWidth-pw-m; if(left<m) left=m; if(top+ph>innerHeight-m) top=rect.top-ph-6; panel.style.top=top+'px'; panel.style.left=left+'px'; panel.style.visibility=''; }

  /* ════════════════ MISC ════════════════ */
  let toastTimer;
  function showToast(msg, warn){ const t=document.getElementById('toast'); document.getElementById('toastMsg').textContent=msg; t.classList.toggle('warn', !!warn); t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2800); }
  function copyLink(){ navigator.clipboard.writeText(location.href).catch(()=>{}); document.getElementById('morePanel')?.classList.remove('open'); showToast('Link copied to clipboard'); }
  function downloadPDF(){ document.getElementById('morePanel')?.classList.remove('open'); showToast('Preparing PDF…'); setTimeout(()=>print(),300); }
  function logContact(channel){ addActivity(`${channel} contact opened`,{icon:channel==='Call'?'phone':channel==='Email'?'inbox':'msg'}); }
  function editToast(section){ showToast(section+' — inline editing opens here'); }

  document.addEventListener('click',()=>{ closeDropdowns(); closeCalPickers(); });
  window.addEventListener('resize',()=>{ closeDropdowns(); closeCalPickers(); if(document.getElementById('calendarModal')?.classList.contains('open')){ const t=document.getElementById('calTrigger'); if(t) positionCalendar(t); } });
  document.addEventListener('keydown',(e)=>{ if(e.key!=='Escape') return; closeDropdowns(); if(document.getElementById('calendarModal')?.classList.contains('open')){ closeCalendarModal(); return; } if(document.getElementById('closeModal')?.classList.contains('open')){ closeCloseModal(); return; } if(document.getElementById('followupModal')?.classList.contains('open')){ closeFollowupModal(); return; } closeScheduleTourModal(); });

    /* ═════════════════════════════════════════════════════
       Activity timeline
    ═════════════════════════════════════════════════════ */
    function nowLabel() {
      const d = new Date(); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2,'0');
      const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
      return `Today, ${h}:${m} ${ap}`;
    }
    let activityLog = [
      { title:'Interview scheduled · Tomorrow, 28 May 2026, 11:00 AM', time:'Today, 11:24 AM', meta:'Auto-advanced: Shortlisted → Interview Scheduled', accent:true },
      { title:'Marked as Shortlisted', time:'Yesterday, 4:10 PM', meta:'Auto-advanced: Screening → Shortlisted' },
      { title:'Candidate contacted', time:'Yesterday, 10:05 AM', meta:'Auto-advanced: New Application → Screening' },
      { title:'Application created', time:'25 May 2026, 9:30 AM', meta:'Received via SuperSchools', muted:true }
    ];

    function renderActivity() {
      const c = document.getElementById('activityTimeline');
      const scroll = document.getElementById('activityScroll');
      if (!c) return;
      if (activityLog.length === 0) {
        c.className = '';
        if (scroll) { scroll.classList.remove('overflow-y-auto'); scroll.classList.add('overflow-hidden'); }
        c.innerHTML = `
          <div class="flex flex-col items-center justify-center py-8 text-center">
            <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F5F9]"><svg class="h-5 w-5 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
            <p class="text-[13px] font-medium text-[#475569]">No activity yet</p>
            <p class="mt-1 text-[12px] text-[#94A3B8]">Status changes, notes, and actions will appear here.</p>
          </div>`;
        return;
      }
      c.className = 'timeline pr-1';
      if (scroll) { scroll.classList.remove('overflow-hidden'); scroll.classList.add('overflow-y-auto'); }
      c.innerHTML = activityLog.map(a => {
        const meta = a.meta ? `<p class="text-[11.5px] text-[#94A3B8]">${a.meta} · ${a.time}</p>` : `<p class="text-[11.5px] text-[#94A3B8]">${a.time}</p>`;
        return `<div class="timeline-item${a.muted ? ' muted' : ''}${a.accent ? ' accent' : ''}">
          <p class="text-[12.5px] font-semibold text-[#0F172A]">${a.title}</p>${meta}</div>`;
      }).join('');
    }
    function addActivity(title, opts = {}) {
      activityLog.unshift({ title, time: opts.time || nowLabel(), meta: opts.meta || null, accent: opts.accent, muted: opts.muted });
      renderActivity();
    }

    /* ═════════════════════════════════════════════════════
       Notes
    ═════════════════════════════════════════════════════ */
    let notes = [
      { id:1, author:'Priya Menon', av:'PM', avBg:'#FEF3C7', avCol:'#92400E', text:'Spoke with Ananya — strong Mathematics background and keen to take a PGT role. Currently teaching at Vidya Mandir, Koramangala. Confirmed 6 years experience and asked about the demo class format. Interview scheduled for tomorrow at 11 AM.', time:'Today, 11:24 AM', editing:false },
      { id:2, author:'Arjun Shah', av:'AS', avBg:'#DBE1FF', avCol:'#284CA5', text:'Application looks strong — candidate confirmed availability for the 2026-27 academic year and shared a solid lesson-planning sample. Lives close-by in Indiranagar. Worth prioritizing for an interview this week.', time:'Yesterday, 5:42 PM', editing:false }
    ];
    let noteNextId = 3;
    function renderNotes() {
      const list = document.getElementById('notesList'); const count = document.getElementById('notesCount');
      if (!list) return;
      if (count) count.textContent = `${notes.length} note${notes.length !== 1 ? 's' : ''}`;
      if (notes.length === 0) {
        list.innerHTML = `
          <div class="flex flex-col items-center justify-center px-4 py-8 text-center">
            <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F5F9]"><svg class="h-5 w-5 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></div>
            <p class="text-[13px] font-medium text-[#475569]">No notes added yet</p><p class="mt-1 text-[12px] text-[#94A3B8]">Use the field below to add the first note.</p>
          </div>`;
        return;
      }
      list.innerHTML = notes.map(n => `
        <div class="group flex gap-3 px-4 py-4 sm:px-5">
          <div class="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold" style="background:${n.avBg};color:${n.avCol}">${n.av}</div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <div class="flex items-baseline gap-2"><span class="text-[12.5px] font-semibold text-[#0F172A]">${n.author}</span><span class="text-[11.5px] text-[#94A3B8]">${n.time}</span></div>
              <div class="no-print flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onclick="editNote(${n.id})" title="Edit note" class="grid h-6 w-6 place-items-center rounded-md text-[#94A3B8] hover:bg-[#EFF4FF] hover:text-[#284CA5] transition"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></button>
                <button onclick="deleteNote(${n.id})" title="Delete note" class="grid h-6 w-6 place-items-center rounded-md text-[#94A3B8] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
              </div>
            </div>
            ${n.editing ? `
              <div class="mt-2">
                <textarea id="editInput-${n.id}" rows="3" class="w-full resize-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#334155] outline-none focus:border-[#284CA5] focus:ring-2 focus:ring-[#DCE8FF]">${n.text}</textarea>
                <div class="mt-2 flex gap-2"><button onclick="saveEditNote(${n.id})" class="h-8 rounded-lg bg-[#284CA5] px-3 text-[12px] font-semibold text-white transition hover:bg-[#203F8D]">Save</button><button onclick="cancelEditNote(${n.id})" class="h-8 rounded-lg border border-[#E2E8F0] bg-white px-3 text-[12px] font-semibold text-[#475569] transition hover:bg-[#F1F5F9]">Cancel</button></div>
              </div>` : `<p class="mt-1 text-[13px] leading-relaxed text-[#334155]">${n.text}</p>`}
          </div>
        </div>`).join('<div class="h-px bg-[#EEF2F7]"></div>');
    }
    function updateAddNoteBtn() { const input = document.getElementById('noteInput'), btn = document.getElementById('addNoteBtn'); if (input && btn) btn.disabled = !input.value.trim(); }
    function addNote() {
      const input = document.getElementById('noteInput'); const text = input?.value.trim();
      if (!text) return;
      notes.unshift({ id: noteNextId++, author:'Priya Menon', av:'PM', avBg:'#FEF3C7', avCol:'#92400E', text, time:'Just now', editing:false });
      input.value = ''; updateAddNoteBtn(); renderNotes();
      addActivity('Note added by Priya M.');
    }
    function editNote(id) { notes = notes.map(n => ({ ...n, editing: n.id === id })); renderNotes(); document.getElementById(`editInput-${id}`)?.focus(); }
    function saveEditNote(id) { const val = document.getElementById(`editInput-${id}`)?.value.trim(); if (!val) return; notes = notes.map(n => n.id === id ? { ...n, text: val, time: n.time.replace(' (edited)', '') + ' (edited)', editing:false } : n); renderNotes(); addActivity('Note edited by Priya M.'); }
    function cancelEditNote(id) { notes = notes.map(n => ({ ...n, editing:false })); renderNotes(); }
    function deleteNote(id) { notes = notes.filter(n => n.id !== id); renderNotes(); addActivity('Note deleted'); }

    /* ═════════════════════════════════════════════════════
       Parent details
    ═════════════════════════════════════════════════════ */
    const parentData = { relation:'Mother', motherName:'Lakshmi Iyer', motherMobile:'+91 98765 43210', fatherName:'Ramesh Iyer', fatherMobile:'+91 98765 12345', homeCity:'Bengaluru, Karnataka', homeAddress:'Flat 402, Sunshine Apartments, 4th Cross, Indiranagar' };
    function pdPair(label, value) {
      const empty = !value || value === '—'; const valClass = empty ? 'text-[#94A3B8]' : '';
      return `<div class="dg-label">${label}</div><div class="dg-value ${valClass}">${empty ? '—' : value}</div>`;
    }
    function renderParentDetails() {
      const grid = document.getElementById('parentDetailsGrid'); if (!grid) return;
      const rel = parentData.relation;
      const relationRow = `<div class="dg-label">Emergency Contact Relation</div><div class="dg-value">${rel}</div><div class="dg-empty"></div><div class="dg-empty"></div>`;
      let conditionalRows = '';
      if (rel === 'Father') {
        conditionalRows = pdPair('Father Name', parentData.fatherName) + pdPair('Father Mobile Number', parentData.fatherMobile) + pdPair('Mother Name', parentData.motherName) + pdPair('Mother Mobile Number', parentData.motherMobile);
      } else if (rel === 'Mother') {
        conditionalRows = pdPair('Mother Name', parentData.motherName) + pdPair('Mother Mobile Number', parentData.motherMobile) + pdPair('Father Name', parentData.fatherName) + pdPair('Father Mobile Number', parentData.fatherMobile);
      } else {
        conditionalRows = pdPair(`${rel} Name`, parentData.relationName) + pdPair('Father Name', parentData.fatherName) + pdPair('Father Mobile Number', parentData.fatherMobile) + pdPair('Mother Name', parentData.motherName) + pdPair('Mother Mobile Number', parentData.motherMobile);
      }
      const commonRows = pdPair('Home City', parentData.homeCity) + pdPair('Home Address', parentData.homeAddress);
      grid.innerHTML = relationRow + conditionalRows + commonRows;
    }

    /* ── Accordion ── */
    function toggleAccordion(id) {
      const body = document.getElementById('accordion-' + id); const icon = document.getElementById('accordion-icon-' + id);
      if (!body) return;
      if (body.style.maxHeight === '0px') {
        body.style.maxHeight = body.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(0deg)';
        const cleanup = () => { if (body.style.maxHeight !== '0px') body.style.maxHeight = 'none'; body.removeEventListener('transitionend', cleanup); };
        body.addEventListener('transitionend', cleanup);
      } else {
        body.style.maxHeight = body.scrollHeight + 'px'; body.offsetHeight; body.style.maxHeight = '0px';
        if (icon) icon.style.transform = 'rotate(-90deg)';
      }
    }

  /* ══════════════ INLINE DETAILS EDIT ══════════════
     Form schema, options, conditional logic and validation are collected verbatim
     from enquiries_v5.html (Add Enquiry 3-step dialog). Edit happens inline inside
     each Details accordion — no popup/dialog. */
  const ED_REL_OPTS = ['Father','Mother','Uncle','Aunt','Siblings','Grandparent'];
  const ED_REL_VIS = {
    'Father':      { relationName:false, fatherName:true,  motherName:true,  fatherMobile:false, motherMobile:true  },
    'Mother':      { relationName:false, fatherName:true,  motherName:true,  fatherMobile:true,  motherMobile:false },
    'Uncle':       { relationName:true,  fatherName:true,  motherName:true,  fatherMobile:true,  motherMobile:true  },
    'Aunt':        { relationName:true,  fatherName:true,  motherName:true,  fatherMobile:true,  motherMobile:true  },
    'Siblings':    { relationName:true,  fatherName:true,  motherName:true,  fatherMobile:true,  motherMobile:true  },
    'Grandparent': { relationName:true,  fatherName:true,  motherName:true,  fatherMobile:true,  motherMobile:true  }
  };
  const ED_CITY    = ['Bengaluru','Mumbai','Delhi','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad'];
  const ED_CURRIC  = ['Science','Mathematics','Languages','Humanities','Administration','Sports','Computer'];
  const ED_GENDER  = ['Male','Female','Prefer not to say'];
  const ED_ACAD    = ['2026-27','2027-28','2028-29'];
  const ED_ADM     = ['Teaching','Coordination','Support Staff'];
  const ED_PRESCHOOL_GRADES = ['Sports Coach','Librarian','Lab Assistant','Counsellor'];
  const ED_DAY_GRADES = ['PRT','TGT','PGT','Coordinator','Vice Principal','Sports Coach','Librarian','Lab Assistant','Counsellor'];
  const ED_DIST    = ['Within 2 km','Within 5 km','Within 10 km','Within 15 km','More than 15 km','No Preference'];

  /* Editable data — initialised from the values currently displayed */
  const childData = { childName:'Ananya Iyer', dob:'15-03-1992', age:'34 years', gender:'Female',
    acadYear:'2026-27', admissionType:'Teaching', gradeApplied:'PGT', currentSchool:'Vidya Mandir, Koramangala (Maths Faculty)' };
  const prefsData = { curriculum:['Science','Mathematics'], city:'Bengaluru', area:'Indiranagar, HSR Layout, Koramangala',
    distance:'Within 5 km', transport:'Yes', hostel:'No' };
  const msgData = { message:`Hi, I'm applying for the PGT Mathematics position for the 2026–27 academic year. I have 6 years of experience teaching senior-secondary Mathematics under the CBSE and ICSE curricula, currently at Vidya Mandir, Koramangala. I live in Indiranagar and prefer a school within 5 km. I'm comfortable with smart-class delivery, lesson planning and exam preparation, and would be glad to take a demo class at your convenience. Please get in touch at your earliest convenience.` };
  if(typeof parentData==='object' && parentData){ if(parentData.relationName===undefined) parentData.relationName=''; }

  /* ── small helpers (mirror enquiries_v5 validation behaviour) ── */
  function edEsc(s){ return esc(String(s==null?'':s)); }
  function edDigits(s){ return String(s||'').replace(/\D/g,''); }
  function edValidMobile(v){ const d=edDigits(v); return d.length===10 && /^[6-9]/.test(d); }
  function edLocalMobile(v){ const d=edDigits(v); return d.length>10 ? d.slice(-10) : d; }
  function edParseDob(str){
    if(!str) return null;
    const m=String(str).trim().match(/^(\d{2})-(\d{2})-(\d{4})$/); if(!m) return null;
    const dd=+m[1], mm=+m[2], yy=+m[3], d=new Date(yy,mm-1,dd);
    if(d.getFullYear()!==yy||d.getMonth()!==mm-1||d.getDate()!==dd) return null;
    if(d>new Date()) return null; return d;
  }
  function edAgeYears(str){ const d=edParseDob(str); if(!d) return null;
    const n=new Date(); let y=n.getFullYear()-d.getFullYear(); const mo=n.getMonth()-d.getMonth();
    if(mo<0||(mo===0&&n.getDate()<d.getDate())) y--; return Math.max(0,y); }
  function edDobPretty(str){ const d=edParseDob(str); return d? d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : (str||''); }
  function edVal(id){ const el=document.getElementById(id); return el?(el.value||'').trim():''; }
  function edRadio(name){ const r=document.querySelector('input[name="'+name+'"]:checked'); return r?r.value:''; }
  function edErr(id,show){ const e=document.getElementById(id); if(e) e.classList.toggle('hidden',!show); }
  function edMark(id,bad){ const el=document.getElementById(id); if(!el) return;
    const t = el.tagName==='SELECT' ? el : (el.closest('[data-edwrap]')||el);
    if(bad){ t.classList.add('border-[#DC2626]'); t.classList.remove('border-[#E2E8F0]'); }
    else { t.classList.remove('border-[#DC2626]'); t.classList.add('border-[#E2E8F0]'); } }

  /* ── control builders (match enquiries_v5 field styling) ── */
  const EDCHEV='<svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  function edInput(id,val,ph){ return '<div data-edwrap class="flex h-10 items-center rounded-xl border border-[#E2E8F0] bg-white px-3 transition focus-within:border-[#284CA5]"><input id="'+id+'" type="text" value="'+edEsc(val)+'" placeholder="'+edEsc(ph||'')+'" class="min-w-0 flex-1 bg-transparent text-[13px] text-[#334155] placeholder:text-[#94A3B8] outline-none border-0 ring-0 focus:outline-none focus-visible:outline-none"></div>'; }
  function edSelect(id,opts,val,ph,onchange){
    const o='<option value="">'+edEsc(ph||'Select')+'</option>'+opts.map(x=>'<option'+(x===val?' selected':'')+'>'+edEsc(x)+'</option>').join('');
    return '<div class="relative"><select id="'+id+'"'+(onchange?' onchange="'+onchange+'"':'')+' class="h-10 w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white pl-3 pr-8 text-[13px] text-[#334155] outline-none transition focus:border-[#284CA5]">'+o+'</select>'+EDCHEV+'</div>'; }
  function edYesNo(name,val){ const r=(v)=>'<label class="inline-flex cursor-pointer items-center gap-2"><input type="radio" name="'+name+'" value="'+v+'"'+(val===v?' checked':'')+' class="h-4 w-4 cursor-pointer accent-[#284CA5]"><span class="text-[13px] text-[#334155]">'+v+'</span></label>';
    return '<div class="flex h-10 items-center gap-5 rounded-xl border border-[#E2E8F0] bg-white px-3">'+r('Yes')+r('No')+'</div>'; }
  function edTextarea(id,val,ph){ return '<div data-edwrap class="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 transition focus-within:border-[#284CA5]"><textarea id="'+id+'" rows="4" placeholder="'+edEsc(ph||'')+'" class="w-full resize-none bg-transparent text-[13px] leading-relaxed text-[#334155] placeholder:text-[#94A3B8] outline-none border-0 ring-0 focus:outline-none focus-visible:outline-none">'+edEsc(val)+'</textarea></div>'; }
  function edField(label,control,o){ o=o||{}; return '<div class="'+(o.span2?'sm:col-span-2 ':'')+'min-w-0"'+(o.wrapId?' id="'+o.wrapId+'"':'')+'><label class="mb-1.5 flex items-center gap-1 text-[12px] font-semibold text-[#334155]">'+label+(o.req?'<span class="text-[#DC2626]">*</span>':'')+(o.optional?'<span class="ml-1 text-[11px] font-normal text-[#94A3B8]">(optional)</span>':'')+'</label>'+control+(o.errId?'<p id="'+o.errId+'" class="mt-1 hidden text-[11px] text-[#DC2626]">'+(o.errMsg||'')+'</p>':'')+'</div>'; }
  function edGrid(inner){ return '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">'+inner+'</div>'; }
  function edActions(acc){ return '<div class="mt-4 flex items-center justify-end gap-2"><button type="button" onclick="cancelEdit(\''+acc+'\')" class="inline-flex h-9 items-center rounded-xl border border-[#E2E8F0] bg-white px-4 text-[13px] font-semibold text-[#475569] transition hover:bg-[#F1F5F9]">Cancel</button><button type="button" onclick="saveEdit(\''+acc+'\')" class="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#284CA5] px-4 text-[13px] font-semibold text-white transition hover:bg-[#203F8D]"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Save</button></div>'; }

  /* ── CANDIDATE DETAILS ── */
  function renderChildView(){ const c=childData, g=document.getElementById('view-child'); if(!g) return;
    const row=(l,v)=>'<div class="dg-label">'+l+'</div><div class="dg-value'+(!v?' text-[#94A3B8]':'')+'">'+(!v?'—':edEsc(v))+'</div>';
    g.innerHTML = row('Candidate Name',c.childName)+row('Date of Birth',edDobPretty(c.dob))+row('Age',c.age)+row('Gender',c.gender)
      +row('Joining Year',c.acadYear)+row('Position Applied',c.gradeApplied)+row('Role Category',c.admissionType)
      +row('Current Institution',c.currentSchool)+'<div class="dg-empty"></div><div class="dg-empty"></div>'; }
  function edGradesFor(t){ return t==='Preschool'?ED_PRESCHOOL_GRADES:(t?ED_DAY_GRADES:[]); }
  function edGradePh(t){ return t==='Preschool'?'Select support role':(t?'Select position':'Select role category first'); }
  function buildChildEdit(){ const c=childData;
    const inner =
      edField('Candidate Full Name', edInput('edChildName',c.childName,"Enter candidate's full name"), {req:true,errId:'edChildNameErr',errMsg:'Candidate name is required.'})
    + edField('Date of Birth', edInput('edDob',c.dob,'dd-mm-yyyy'), {optional:true})
    + edField('Gender', edSelect('edGender',ED_GENDER,c.gender,'Select gender'), {})
    + edField('Joining Year', edSelect('edAcadYear',ED_ACAD,c.acadYear,'Select joining year'), {})
    + edField('Role Category', edSelect('edAdmType',ED_ADM,c.admissionType,'Select role category','edChildTypeChange()'), {req:true,errId:'edAdmTypeErr',errMsg:'Please select a role category.'})
    + edField('Position Applied', edSelect('edGrade',edGradesFor(c.admissionType),c.gradeApplied,edGradePh(c.admissionType)), {req:true,wrapId:'edGradeWrap',errId:'edGradeErr',errMsg:'Please select the position the candidate is applying for.'})
    + edField('Current Institution Name', edInput('edCurrentSchool',c.currentSchool,'Enter current institution name'), {});
    document.getElementById('edit-child').innerHTML = edGrid(inner)+edActions('child-details'); }
  function edChildTypeChange(){ const t=edVal('edAdmType'), sel=document.getElementById('edGrade'); if(!sel) return;
    const opts=edGradesFor(t), prev=sel.value;
    sel.innerHTML='<option value="">'+edEsc(edGradePh(t))+'</option>'+opts.map(o=>'<option'+(o===prev?' selected':'')+'>'+edEsc(o)+'</option>').join('');
    if(prev && !opts.includes(prev)) sel.value='';
    if(t){ edErr('edAdmTypeErr',false); edMark('edAdmType',false); } }
  function validateChild(){ const name=edVal('edChildName'), type=edVal('edAdmType'), grade=edVal('edGrade');
    const e1=!name; edErr('edChildNameErr',e1); edMark('edChildName',e1);
    const e2=!type; edErr('edAdmTypeErr',e2); edMark('edAdmType',e2);
    const e3=!!type&&!grade; edErr('edGradeErr',e3); edMark('edGrade',e3);
    return !e1&&!e2&&!e3; }
  function commitChild(){ const c=childData;
    c.childName=edVal('edChildName'); c.dob=edVal('edDob'); c.gender=edVal('edGender'); c.acadYear=edVal('edAcadYear');
    c.admissionType=edVal('edAdmType'); c.gradeApplied=edVal('edGrade'); c.currentSchool=edVal('edCurrentSchool');
    const a=edAgeYears(c.dob); if(a!=null) c.age=a+' year'+(a===1?'':'s');
    renderChildView(); }

  /* ── PARENT DETAILS (view reuses renderParentDetails) ── */
  function edRelApplyVis(){ const v=edVal('edRelation'); const cfg=ED_REL_VIS[v]||{relationName:false,fatherName:false,motherName:false,fatherMobile:false,motherMobile:false};
    const tog=(id,sh)=>{const el=document.getElementById(id); if(el) el.classList.toggle('hidden',!sh);};
    tog('edRelNameWrap',cfg.relationName); tog('edFatherNameWrap',cfg.fatherName); tog('edMotherNameWrap',cfg.motherName);
    tog('edFatherMobileWrap',cfg.fatherMobile); tog('edMotherMobileWrap',cfg.motherMobile);
    const lbl=document.getElementById('edRelNameLabel'); if(lbl) lbl.textContent=(cfg.relationName&&v)?(v+' Name'):'Relation Name';
    const fr=document.getElementById('edFatherReq'), mr=document.getElementById('edMotherReq');
    if(fr) fr.classList.toggle('hidden', v!=='Father'); if(mr) mr.classList.toggle('hidden', v!=='Mother'); }
  function edRelationChange(){
    ['edRelName','edFatherName','edMotherName','edFatherMobile','edMotherMobile'].forEach(id=>{const el=document.getElementById(id); if(el) el.value='';});
    ['edRelNameErr','edFatherNameErr','edMotherNameErr','edFatherMobileErr','edMotherMobileErr'].forEach(id=>edErr(id,false));
    ['edRelName','edFatherName','edMotherName','edFatherMobile','edMotherMobile'].forEach(id=>edMark(id,false));
    edRelApplyVis(); const v=edVal('edRelation'); if(v){ edErr('edRelationErr',false); edMark('edRelation',false); } }
  function buildParentEdit(){ const p=parentData;
    const cityPre = ED_CITY.find(c=>p.homeCity && p.homeCity.indexOf(c)===0) || (ED_CITY.includes(p.homeCity)?p.homeCity:'');
    const inner =
      edField('Emergency Contact Relation', edSelect('edRelation',ED_REL_OPTS,p.relation,'Select emergency contact relation','edRelationChange()'), {req:true,span2:true,errId:'edRelationErr',errMsg:'Relation is required.'})
    + edField('<span id="edRelNameLabel">Relation Name</span>', edInput('edRelName',p.relationName,'Enter full name'), {req:true,wrapId:'edRelNameWrap',errId:'edRelNameErr',errMsg:'Name is required.'})
    + edField('Father Name<span id="edFatherReq" class="ml-0.5 hidden text-[#DC2626]">*</span>', edInput('edFatherName',p.fatherName,"Enter father's full name"), {wrapId:'edFatherNameWrap',errId:'edFatherNameErr',errMsg:'Father name is required.'})
    + edField('Mother Name<span id="edMotherReq" class="ml-0.5 hidden text-[#DC2626]">*</span>', edInput('edMotherName',p.motherName,"Enter mother's full name"), {wrapId:'edMotherNameWrap',errId:'edMotherNameErr',errMsg:'Mother name is required.'})
    + edField('Father Mobile Number', edInput('edFatherMobile',edLocalMobile(p.fatherMobile),"Enter father's mobile number"), {wrapId:'edFatherMobileWrap',errId:'edFatherMobileErr',errMsg:'Enter a valid 10-digit mobile number.'})
    + edField('Mother Mobile Number', edInput('edMotherMobile',edLocalMobile(p.motherMobile),"Enter mother's mobile number"), {wrapId:'edMotherMobileWrap',errId:'edMotherMobileErr',errMsg:'Enter a valid 10-digit mobile number.'})
    + edField('Home City', edSelect('edHomeCity',ED_CITY,cityPre,'Select city'), {req:true,errId:'edHomeCityErr',errMsg:'Home city is required.'})
    + edField('Home Address', edInput('edHomeAddress',p.homeAddress,'Enter full home address'), {optional:true});
    document.getElementById('edit-parent').innerHTML = edGrid(inner)+edActions('parent-details'); }
  function validateParent(){ const rel=edVal('edRelation'), city=edVal('edHomeCity'), cfg=ED_REL_VIS[rel]||null;
    const er=!rel; edErr('edRelationErr',er); edMark('edRelation',er);
    let ern=false; if(cfg&&cfg.relationName) ern=!edVal('edRelName'); edErr('edRelNameErr',ern); edMark('edRelName',ern);
    let ef=false,em=false;
    if(rel==='Father'&&cfg&&cfg.fatherName) ef=!edVal('edFatherName');
    if(rel==='Mother'&&cfg&&cfg.motherName) em=!edVal('edMotherName');
    edErr('edFatherNameErr',ef); edMark('edFatherName',ef); edErr('edMotherNameErr',em); edMark('edMotherName',em);
    let efm=false,emm=false; const fm=edVal('edFatherMobile'), mm=edVal('edMotherMobile');
    if(fm) efm=!edValidMobile(fm); if(mm) emm=!edValidMobile(mm);
    edErr('edFatherMobileErr',efm); edMark('edFatherMobile',efm); edErr('edMotherMobileErr',emm); edMark('edMotherMobile',emm);
    const ec=!city; edErr('edHomeCityErr',ec); edMark('edHomeCity',ec);
    return !er&&!ern&&!ef&&!em&&!efm&&!emm&&!ec; }
  function commitParent(){ const p=parentData;
    p.relation=edVal('edRelation'); p.relationName=edVal('edRelName');
    p.fatherName=edVal('edFatherName'); p.motherName=edVal('edMotherName');
    p.fatherMobile=edVal('edFatherMobile'); p.motherMobile=edVal('edMotherMobile');
    p.homeCity=edVal('edHomeCity'); p.homeAddress=edVal('edHomeAddress');
    renderParentDetails(); }

  /* ── APPLICATION DETAILS ── */
  function renderPrefsView(){ const p=prefsData, g=document.getElementById('view-prefs'); if(!g) return;
    const disp=(v)=>{ const empty=(!v||(Array.isArray(v)&&!v.length)); return '<div class="dg-value'+(empty?' text-[#94A3B8]':'')+'">'+(empty?'—':edEsc(Array.isArray(v)?v.join(', '):v))+'</div>'; };
    const row=(l,v)=>'<div class="dg-label">'+l+'</div>'+disp(v);
    g.innerHTML = row('Department',p.curriculum)+row('Preferred City',p.city)+row('Preferred Area',p.area)
      +row('Distance Willing to Travel',p.distance)+row('Transport Requirement',p.transport)+row('Relocation Willingness',p.hostel); }
  function buildPrefsEdit(){ const p=prefsData;
    const curric='<div data-edwrap class="flex flex-wrap gap-x-4 gap-y-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5">'+
      ED_CURRIC.map(c=>'<label class="inline-flex cursor-pointer items-center gap-2"><input type="checkbox" name="edCurric" value="'+edEsc(c)+'"'+(p.curriculum.includes(c)?' checked':'')+' class="h-4 w-4 cursor-pointer accent-[#284CA5]"><span class="text-[13px] text-[#334155]">'+edEsc(c)+'</span></label>').join('')+'</div>';
    const inner =
      edField('Department', curric, {span2:true,optional:true})
    + edField('Preferred City', edSelect('edPrefCity',ED_CITY,p.city,'Select city'), {})
    + edField('Preferred Area', edInput('edPrefArea',p.area,'e.g. Indiranagar, HSR Layout'), {optional:true})
    + edField('Distance Willing to Travel', edSelect('edDistance',ED_DIST,p.distance,'Select distance'), {})
    + edField('Transport Requirement', edYesNo('edTransport',p.transport), {})
    + edField('Relocation Willingness', edYesNo('edHostel',p.hostel), {});
    document.getElementById('edit-prefs').innerHTML = edGrid(inner)+edActions('admission-prefs'); }
  function validatePrefs(){ return true; }
  function commitPrefs(){ const p=prefsData;
    p.curriculum=Array.from(document.querySelectorAll('input[name="edCurric"]:checked')).map(x=>x.value);
    p.city=edVal('edPrefCity'); p.area=edVal('edPrefArea'); p.distance=edVal('edDistance');
    const t=edRadio('edTransport'); if(t) p.transport=t; const h=edRadio('edHostel'); if(h) p.hostel=h;
    renderPrefsView(); }

  /* ── APPLICATION MESSAGE ── */
  function renderMessageView(){ const el=document.getElementById('view-message'); if(el) el.textContent=msgData.message||''; }
  function buildMessageEdit(){ document.getElementById('edit-message').innerHTML = edTextarea('edMessage',msgData.message,'Enter the application message / notes')+edActions('enquiry-message'); }
  function validateMessage(){ return true; }
  function commitMessage(){ const el=document.getElementById('edMessage'); msgData.message=el?(el.value||'').trim():msgData.message; renderMessageView(); }

  /* ── dispatcher ── */
  const ED_ACC = {
    'child-details':  { view:'view-child',        edit:'edit-child',   build:buildChildEdit,  post:null,           validate:validateChild,  commit:commitChild,  label:'Candidate details' },
    'parent-details': { view:'parentDetailsGrid', edit:'edit-parent',  build:buildParentEdit, post:edRelApplyVis,  validate:validateParent, commit:commitParent, label:'Contact details' },
    'admission-prefs':{ view:'view-prefs',         edit:'edit-prefs',   build:buildPrefsEdit,  post:null,           validate:validatePrefs,  commit:commitPrefs,  label:'Application details' },
    'enquiry-message':{ view:'view-message',       edit:'edit-message', build:buildMessageEdit,post:null,           validate:validateMessage,commit:commitMessage,label:'Application message' }
  };
  function edEnsureOpen(acc){ const b=document.getElementById('accordion-'+acc), i=document.getElementById('accordion-icon-'+acc);
    if(b) b.style.maxHeight='none'; if(i) i.style.transform='rotate(0deg)'; }
  function enterEdit(acc){ const cfg=ED_ACC[acc]; if(!cfg) return;
    cfg.build(); if(cfg.post) cfg.post();
    const v=document.getElementById(cfg.view), e=document.getElementById(cfg.edit);
    if(v) v.classList.add('hidden'); if(e) e.classList.remove('hidden'); edEnsureOpen(acc); }
  function cancelEdit(acc){ const cfg=ED_ACC[acc]; if(!cfg) return;
    const v=document.getElementById(cfg.view), e=document.getElementById(cfg.edit);
    if(e){ e.classList.add('hidden'); e.innerHTML=''; } if(v) v.classList.remove('hidden'); edEnsureOpen(acc); }
  function saveEdit(acc){ const cfg=ED_ACC[acc]; if(!cfg) return;
    if(!cfg.validate()){ showToast('Please fix the highlighted fields', true); return; }
    cfg.commit();
    const v=document.getElementById(cfg.view), e=document.getElementById(cfg.edit);
    if(e){ e.classList.add('hidden'); e.innerHTML=''; } if(v) v.classList.remove('hidden'); edEnsureOpen(acc);
    addActivity(cfg.label+' updated',{icon:'flag',accent:true}); showToast(cfg.label+' updated'); }


  /* ════════════════ INIT (merged) ════════════════ */
  renderParentDetails();   /* v2 reference grid */
  renderChildView(); renderPrefsView(); renderMessageView();   /* inline-edit views */
  renderNotes();           /* v2 notes */
  renderActivity();        /* v2 activity timeline (sink for workflow events) */
  renderAll();             /* v3 engine: header status, guided workflow, visit + follow-up cards */