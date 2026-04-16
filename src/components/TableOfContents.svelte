<script lang="ts">
  import type { TocHeading } from "@/types";
  import { onMount } from "svelte";

  interface Props {
    headings: TocHeading[];
  }

  let { headings }: Props = $props();

  let activeSlug = $state<string>("");

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSlug = entry.target.id;
          }
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      },
    );

    headings.forEach(({ slug }) => {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  });

  function scrollTo(slug: string) {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
</script>

<nav
  class="rounded-xl p-4 sticky top-24"
  style="background: #252525; border: 1px solid #333;"
  aria-label="Table of contents"
>
  <h2 class="text-xs font-mono font-semibold tracking-widest uppercase mb-4" style="color: #a3e635;">
    ▸ Contents
  </h2>

  <ol class="space-y-1">
    {#each headings as heading}
      <li style="padding-left: {(heading.depth - 1) * 12}px;">
        <button
          onclick={() => scrollTo(heading.slug)}
          class="w-full text-left text-xs leading-relaxed transition-colors duration-200 py-0.5 truncate block"
          style="
            color: {activeSlug === heading.slug ? '#a3e635' : '#71717a'};
            background: transparent;
            border: none;
            cursor: pointer;
            font-weight: {activeSlug === heading.slug ? '600' : '400'};
            font-family: inherit;
          "
        >
          {#if heading.depth === 2}
            <span style="color: #3d3d3d; margin-right: 4px;">—</span>
          {:else if heading.depth === 3}
            <span style="color: #3d3d3d; margin-right: 4px;">··</span>
          {/if}
          {heading.text}
        </button>
      </li>
    {/each}
  </ol>
</nav>
