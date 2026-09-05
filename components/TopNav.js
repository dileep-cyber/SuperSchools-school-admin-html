/* =====================================================================
   TopNav — top navigation bar. Shows the SUB-modules of the ACTIVE main
   module (currentSubModules), e.g. Super CRM => Admissions · Enquiries ·
   Detail. Also holds the utility icons + the hamburger button that opens
   HamburgerMenu. Injected into <div data-shell="header">. Maps to
   <TopNav/> in a Next.js port. State/behaviour: lib/store.js.
   ===================================================================== */
window.SS = window.SS || {}; window.SS.components = window.SS.components || {};
window.SS.components.TopNav = `      <header :class="sidebarCollapsed ? 'bg-[#284CA5] border-[#284CA5] text-white' : 'bg-white border-slate-200 text-slate-900'" class="h-16 flex items-center flex-shrink-0 z-30 px-3 sm:px-4 lg:px-6 sticky top-0 md:static border-b transition-colors duration-300 ease-in-out">
        <!-- Top navigation bar — shows the SUB-modules of the ACTIVE main module. -->
        <div :class="sidebarCollapsed ? 'md:pl-16' : ''" class="flex items-center w-full gap-2 sm:gap-3 min-w-0 h-full transition-all duration-300 ease-in-out">
          <!-- Horizontal sub-module tabs (left padding clears the absolute toggle when collapsed) -->
          <nav class="flex-1 min-w-0 flex items-stretch h-full overflow-x-auto no-scrollbar" aria-label="Section navigation">
            <template x-for="tab in currentSubModules" :key="tab.id">
              <button type="button" @click="goSub(tab)" class="relative h-full inline-flex items-center px-3 lg:px-4 text-sm whitespace-nowrap transition-colors focus:outline-none"
                :class="activeSub === tab.id
                  ? (sidebarCollapsed ? 'text-white font-semibold' : 'text-primary font-semibold')
                  : (sidebarCollapsed ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-800')">
                <span x-text="tab.label"></span>
                <span x-show="activeSub === tab.id" :class="sidebarCollapsed ? 'bg-white' : 'bg-primary'" class="absolute left-2 right-2 lg:left-3 lg:right-3 bottom-0 h-[2.5px] rounded-t-full"></span>
              </button>
            </template>
          </nav>
          <!-- Utility icon buttons (colours adapt to header background) -->
          <div class="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button type="button" @click="pushToast('info','Search','Global search coming soon.')" :class="navIconClass" class="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors focus:outline-none" aria-label="Search">
              <span class="material-symbols-outlined text-[20px]">search</span>
            </button>
            <button type="button" @click="pushToast('info','Create new','Quick create coming soon.')" :class="navIconClass" class="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors focus:outline-none" aria-label="Create new">
              <span class="material-symbols-outlined text-[20px]">add</span>
            </button>
            <button type="button" @click="setPage('settings')" :class="navIconClass" class="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors focus:outline-none" aria-label="Settings">
              <span class="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <button type="button" @click="pushToast('info','Notifications','You have 1 new notification.')" :class="navIconClass" class="relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors focus:outline-none" aria-label="Notifications">
              <span class="material-symbols-outlined text-[20px]">notifications</span>
              <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2" :class="sidebarCollapsed ? 'ring-[#284CA5]' : 'ring-white'"></span>
            </button>
            <button type="button" @click="rightMenuOpen = true" :class="navIconClass" class="inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors focus:outline-none" aria-label="Open menu" title="Menu">
              <span class="material-symbols-outlined text-[20px]">menu</span>
            </button>
          </div>
        </div>
      </header>`;
