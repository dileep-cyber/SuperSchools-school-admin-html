/* =====================================================================
   MobileNav — the fixed bottom navigation bar shown on small screens
   (lists the main modules). Injected (with HamburgerMenu) into
   <div data-shell="chrome-inner">. Maps to <MobileNav/> in a Next.js port.
   ===================================================================== */
window.SS = window.SS || {}; window.SS.components = window.SS.components || {};
window.SS.components.MobileNav = `    <nav x-show="!isFullScreenPage" class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant h-16 flex items-center justify-between px-1 z-50 pb-1 shadow-[0_-8px_20px_rgba(15,23,42,0.06)]" aria-label="Mobile navigation">
      <template x-for="item in mobileMenuItems" :key="item.id">
        <button type="button" @click="setPage(item.id)" class="flex flex-1 min-w-0 flex-col items-center justify-center h-12 rounded-xl transition-colors px-0.5" :class="activePage === item.id ? 'text-primary' : 'text-on-surface-variant'" :aria-label="item.label">
          <span class="material-symbols-outlined text-[22px]" x-text="item.icon"></span>
          <span class="text-[9.5px] mt-0.5 leading-none text-center truncate max-w-full" :class="activePage === item.id ? 'font-semibold' : 'font-medium'" x-text="item.label"></span>
        </button>
      </template>
    </nav>`;
