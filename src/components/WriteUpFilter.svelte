<script lang="ts">
  import type { WriteUpOS } from "@/types";

  type OSFilter = WriteUpOS | "All";

  const filters: OSFilter[] = ["All", "Linux", "Windows", "Active Directory"];

  // Shared state via custom event
  let activeFilter = $state<OSFilter>("All");

  function setFilter(f: OSFilter) {
    activeFilter = f;
    // Dispatch custom event to communicate with WriteUpList
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("writeup-filter", { detail: { os: f } }),
      );
    }
  }

  const filterStyles: Record<OSFilter, string> = {
    All: "#a3e635",
    Linux: "#22c55e",
    Windows: "#3b82f6",
    "Active Directory": "#f59e0b",
  };
</script>

<div
  class="rounded-xl border p-4"
  style="background: #252525; border-color: #333;"
>
  <h2
    class="text-xs font-mono font-semibold tracking-widest uppercase mb-4"
    style="color: #a3e635;"
  >
    ▸ Filter by OS
  </h2>

  <div class="flex flex-col gap-2">
    {#each filters as f}
      <button
        onclick={() => setFilter(f)}
        class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left"
        style="
          background: {activeFilter === f ? `rgba(${f === 'All' ? '163,230,53' : f === 'Linux' ? '34,197,94' : f === 'Windows' ? '59,130,246' : '245,158,11'},0.12)` : '#2d2d2d'};
          border: 1px solid {activeFilter === f ? filterStyles[f] : '#3d3d3d'};
          color: {activeFilter === f ? filterStyles[f] : '#a1a1aa'};
          cursor: pointer;
          font-family: inherit;
        "
      >
        <span
          class="w-2 h-2 rounded-full flex-shrink-0"
          style="background: {filterStyles[f]}; opacity: {activeFilter === f ? 1 : 0.4};"
        ></span>
        {f}
      </button>
    {/each}
  </div>
</div>
