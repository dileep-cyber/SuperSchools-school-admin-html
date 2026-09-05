/* =====================================================================
   Sidebar — left navigation rail listing the MAIN modules (menuItems).
   Injected by components/AppShell.js into <div data-shell="sidebar">.
   State/behaviour (activePage, setPage, sidebar collapse) lives in
   lib/store.js (schoolConsole). Maps to <Sidebar/> in a Next.js port.
   ===================================================================== */
window.SS = window.SS || {}; window.SS.components = window.SS.components || {};
window.SS.components.Sidebar = `    <button type="button" @click="toggleSidebar()" @mouseenter="peekEnter()" @mouseleave="peekLeave()"
      class="hidden md:inline-flex absolute top-2.5 left-3.5 z-50 w-11 h-11 rounded-xl items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-300 ease-in-out focus:outline-none"
      :aria-label="sidebarCollapsed ? 'Open sidebar' : 'Collapse sidebar'" :title="sidebarCollapsed ? 'Open sidebar' : 'Collapse sidebar'">
      <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.25" y="4.25" width="17.5" height="15.5" rx="3" stroke="currentColor" stroke-width="1.8"/>
        <line x1="9" y1="4.5" x2="9" y2="19.5" stroke="currentColor" stroke-width="1.8"/>
        <path d="M12.6 9.1 L15.7 12 L12.6 14.9 Z" fill="currentColor"/>
      </svg>
    </button>
    <aside x-show="!isFullScreenPage"
      @mouseenter="sidebarEnter()" @mouseleave="sidebarLeave()"
      :class="(!sidebarCollapsed || sidebarPeek) ? 'w-[72px]' : 'w-0'"
      class="hidden md:flex bg-[#284CA5] flex-col flex-shrink-0 h-full overflow-hidden transition-all duration-300 ease-in-out">
      <div class="w-[72px] flex-shrink-0 flex flex-col items-center pt-[76px] pb-4 h-full">
        <nav class="flex-1 min-h-0 flex flex-col items-stretch w-full px-1.5 space-y-6 overflow-y-auto no-scrollbar" aria-label="Primary navigation">
          <template x-for="item in menuItems" :key="item.id">
            <button type="button" @click="setPage(item.id)" class="flex flex-col items-center group w-full px-1 focus:outline-none" :aria-label="item.label">
              <div class="w-11 h-11 rounded-lg flex items-center justify-center transition-all" :class="activePage === item.id ? 'bg-white shadow-sm text-primary' : 'bg-[#4368C3] text-white/90 group-hover:text-white group-hover:bg-[#4B70CD]'">
                <span class="material-symbols-outlined text-[28px]" x-text="item.icon"></span>
              </div>
              <span class="text-white text-[11px] mt-1 text-center leading-tight" :class="activePage === item.id ? 'font-medium' : ''" x-text="item.label"></span>
            </button>
          </template>
        </nav>
      </div>
    </aside>`;
