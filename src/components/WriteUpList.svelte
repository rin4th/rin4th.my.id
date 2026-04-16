<script lang="ts">
  import type { WriteUpGroup, WriteUpEntry, WriteUpOS } from "@/types";
  import { onMount } from "svelte";

  interface Props {
    groups: WriteUpGroup[];
  }

  let { groups }: Props = $props();

  type OSFilter = WriteUpOS | "All";
  let activeOsFilter = $state<OSFilter>("All");
  let expandedPlatforms = $state<Set<string>>(new Set(groups.map((g) => g.platform)));

  const difficultyColors: Record<string, string> = {
    Easy: "#22c55e",
    Medium: "#f59e0b",
    Hard: "#ef4444",
    Insane: "#a855f7",
  };

  const difficultyBg: Record<string, string> = {
    Easy: "rgba(34,197,94,0.1)",
    Medium: "rgba(245,158,11,0.1)",
    Hard: "rgba(239,68,68,0.1)",
    Insane: "rgba(168,85,247,0.1)",
  };

  const platformColors: Record<string, string> = {
    HackTheBox: "#9fef00",
    TryHackMe: "#ff0000",
    PwnTillDawn: "#7c3aed",
    Other: "#a1a1aa",
  };

  const filteredGroups = $derived.by(() => {
    if (activeOsFilter === "All") return groups;
    return groups
      .map((g) => ({
        ...g,
        entries: g.entries.filter((e) => e.os === activeOsFilter),
      }))
      .filter((g) => g.entries.length > 0);
  });

  function togglePlatform(platform: string) {
    const next = new Set(expandedPlatforms);
    if (next.has(platform)) {
      next.delete(platform);
    } else {
      next.add(platform);
    }
    expandedPlatforms = next;
  }

  onMount(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ os: OSFilter }>).detail;
      activeOsFilter = detail.os;
    };
    window.addEventListener("writeup-filter", handler);
    return () => window.removeEventListener("writeup-filter", handler);
  });

  function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  }
</script>

<div class="space-y-4">
  {#if filteredGroups.length === 0}
    <div class="text-center py-16 rounded-xl border" style="background: #252525; border-color: #333;">
      <p class="text-xl mb-2">🔍</p>
      <p class="font-medium mb-1" style="color: #f4f4f5;">No writeups found</p>
      <p class="text-sm" style="color: #71717a;">Try a different OS filter.</p>
    </div>
  {:else}
    {#each filteredGroups as group}
      <div class="rounded-xl border overflow-hidden" style="background: #252525; border-color: #333;">
        <!-- Platform header -->
        <button
          onclick={() => togglePlatform(group.platform)}
          class="w-full flex items-center justify-between px-5 py-4 transition-colors duration-200"
          style="background: #2d2d2d; border: none; cursor: pointer; text-align: left;"
        >
          <div class="flex items-center gap-3">
            <span
              class="w-2.5 h-2.5 rounded-full"
              style="background: {platformColors[group.platform] ?? '#a1a1aa'};"
            ></span>
            <span class="font-bold text-sm" style="color: #f4f4f5; font-family: inherit;">
              {group.platform}
            </span>
            <span
              class="text-xs px-2 py-0.5 rounded font-mono"
              style="background: rgba(163,230,53,0.08); color: #a3e635; border: 1px solid rgba(163,230,53,0.2);"
            >
              {group.entries.length}
            </span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="color: #71717a; transition: transform 0.2s; transform: rotate({expandedPlatforms.has(group.platform) ? '180deg' : '0deg'});"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <!-- Entries -->
        {#if expandedPlatforms.has(group.platform)}
          <div>
            {#each group.entries as entry, i}
              <div
                class="px-5 py-3.5 flex items-center gap-3"
                style="border-top: 1px solid #333; {i % 2 === 1 ? 'background: rgba(255,255,255,0.01);' : ''}"
              >
                <!-- OS icon indicator -->
                <div class="w-1 h-8 rounded-full flex-shrink-0" style="background: {entry.os === 'Linux' ? '#22c55e' : entry.os === 'Windows' ? '#3b82f6' : '#f59e0b'};"></div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-medium text-sm truncate" style="color: #f4f4f5;">
                      {entry.title}
                    </span>
                    <!-- Difficulty badge -->
                    <span
                      class="text-xs font-mono px-2 py-0.5 rounded flex-shrink-0"
                      style="color: {difficultyColors[entry.difficulty]}; background: {difficultyBg[entry.difficulty]}; border: 1px solid {difficultyColors[entry.difficulty]}33;"
                    >
                      {entry.difficulty}
                    </span>
                    <!-- Lock badge for encrypted entries -->
                    {#if entry.encrypted}
                      <span
                        class="text-xs font-mono px-1.5 py-0.5 rounded flex-shrink-0 inline-flex items-center gap-1"
                        style="background: rgba(113,113,122,0.1); color: #71717a; border: 1px solid #3d3d3d;"
                        title="Password protected"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </span>
                    {/if}
                  </div>
                  <p class="text-xs mt-0.5" style="color: #71717a;">
                    {entry.os} · {formatDate(entry.date)}
                  </p>
                </div>

                <!-- Action column -->
                <div class="flex-shrink-0">
                  {#if entry.writeupUrl}
                    <a
                      href={entry.writeupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200"
                      style="background: rgba(163,230,53,0.08); color: #a3e635; border: 1px solid rgba(163,230,53,0.25); text-decoration: none;"
                    >
                      View
                    </a>
                  {:else}
                    <a
                      href={`/writeup/${entry.slug}`}
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200"
                      style="background: rgba(163,230,53,0.12); color: #a3e635; border: 1px solid rgba(163,230,53,0.3); text-decoration: none;"
                    >
                      View
                    </a>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>
