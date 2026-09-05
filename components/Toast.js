/* =====================================================================
   Toast — the global toast/notification stack (driven by config.toasts in
   the store; pushToast() adds entries). Injected into
   <div data-shell="chrome-outer">. Maps to <Toast/> in a Next.js port.
   ===================================================================== */
window.SS = window.SS || {}; window.SS.components = window.SS.components || {};
window.SS.components.Toast = `  <!-- Global toast stack (for Configurations actions) -->
  <div class="cfg-toast-stack" aria-live="polite" aria-atomic="true">
    <template x-for="toast in config.toasts" :key="toast.id">
      <div class="cfg-toast" :class="'is-' + toast.type" role="status">
        <span class="material-symbols-outlined text-[16px] flex-shrink-0"
              x-text="toast.type==='success' ? 'check_circle' : toast.type==='error' ? 'error' : 'info'"></span>
        <div class="min-w-0">
          <p class="text-[13px] font-medium leading-[20px]" x-text="toast.title"></p>
          <p x-show="toast.desc" class="text-[12px] leading-tight opacity-80" x-text="toast.desc"></p>
        </div>
      </div>
    </template>
  </div>`;
