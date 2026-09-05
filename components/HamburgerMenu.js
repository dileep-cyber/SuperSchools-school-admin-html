/* =====================================================================
   HamburgerMenu — the right-side account/menu drawer opened by the
   hamburger button in TopNav (rightMenuOpen). Injected (with MobileNav)
   into <div data-shell="chrome-inner">. Maps to <HamburgerMenu/> /
   <AccountDrawer/> in a Next.js port.
   ===================================================================== */
window.SS = window.SS || {}; window.SS.components = window.SS.components || {};
window.SS.components.HamburgerMenu = `    <!-- Right-side menu drawer (opens from the hamburger; options are visual only) -->
    <div x-show="rightMenuOpen" x-cloak class="fixed inset-0 z-[70]" @keydown.escape.window="rightMenuOpen = false">
      <div x-show="rightMenuOpen" x-transition.opacity.duration.300ms @click="rightMenuOpen = false" class="absolute inset-0 bg-slate-900/40"></div>
      <aside x-show="rightMenuOpen"
        x-transition:enter="transition transform ease-out duration-300" x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0"
        x-transition:leave="transition transform ease-in duration-300" x-transition:leave-start="translate-x-0" x-transition:leave-end="translate-x-full"
        class="absolute top-0 right-0 h-full w-[88%] max-w-[360px] bg-white shadow-2xl flex flex-col" role="dialog" aria-modal="true" aria-label="Account menu">
        <!-- Drawer header: profile -->
        <div class="flex items-center gap-3 p-5 border-b border-slate-200 flex-shrink-0">
          <div class="w-12 h-12 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 bg-primary-soft flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-[26px]">account_circle</span>
          </div>
          <div class="min-w-0">
            <p class="font-semibold text-slate-900 truncate">Green Valley Admin</p>
            <p class="text-xs text-slate-500 truncate">admin@greenvalley.edu</p>
          </div>
          <button type="button" @click="rightMenuOpen = false" class="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors flex-shrink-0" aria-label="Close menu">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <!-- Drawer options -->
        <nav class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1" aria-label="Account options">
          <template x-for="opt in rightMenuItems" :key="opt.label">
            <button type="button" class="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-slate-50 transition-colors group/opt">
              <span class="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0 group-hover/opt:bg-primary-soft group-hover/opt:text-primary transition-colors">
                <span class="material-symbols-outlined text-[20px]" x-text="opt.icon"></span>
              </span>
              <span class="flex-1 min-w-0">
                <span class="block text-sm font-medium text-slate-800 truncate group-hover/opt:text-primary transition-colors" x-text="opt.label"></span>
                <span class="block text-xs text-slate-400 truncate" x-text="opt.desc"></span>
              </span>
              <span class="material-symbols-outlined text-[18px] text-slate-300 flex-shrink-0">chevron_right</span>
            </button>
          </template>
        </nav>
        <!-- Drawer footer: sign out -->
        <div class="p-3 border-t border-slate-200 flex-shrink-0">
          <button type="button" class="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors">
            <span class="material-symbols-outlined text-[20px]">logout</span> Sign out
          </button>
        </div>
      </aside>
    </div>`;
