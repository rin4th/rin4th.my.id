<script lang="ts">
  interface SerializedPost {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    coverImage?: string | undefined;
  }

  interface Props {
    posts: SerializedPost[];
    allTags: string[];
  }

  let { posts }: Props = $props();

  let searchQuery = $state("");

  // Read initial tag from URL and pre-populate search
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const tagParam = url.searchParams.get("tag");
    if (tagParam) searchQuery = `#${tagParam}`;
  }

  const filtered = $derived.by(() => {
    let result = posts;
    const q = searchQuery.trim();

    if (q.startsWith("#")) {
      const tagQuery = q.slice(1).toLowerCase();
      if (tagQuery) {
        result = result.filter((p) =>
          p.tags.some((t) => t.toLowerCase().includes(tagQuery))
        );
      }
    } else if (q) {
      const lower = q.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.excerpt.toLowerCase().includes(lower),
      );
    }

    return result;
  });

  function formatDate(iso: string) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  }
</script>

<!-- Search bar -->
<div class="mb-6">
  <div class="relative">
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
      class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
      style="color: #71717a;"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input
      type="text"
      placeholder="Search post or #tag"
      bind:value={searchQuery}
      class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
      style="background: #252525; border: 1px solid #333; color: #f4f4f5; font-family: inherit;"
    />
  </div>
</div>

<!-- Results count -->
<p class="text-sm mb-5" style="color: #71717a;">
  {filtered.length} post{filtered.length !== 1 ? "s" : ""}
  {searchQuery ? "found" : "total"}
</p>

<!-- Post list -->
{#if filtered.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each filtered as post}
      <article
        class="group relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style="background: #252525; border: 1px solid #333;"
      >
        {#if post.coverImage}
          <div class="h-40 overflow-hidden" style="background: #2d2d2d;">
            <img
              src={post.coverImage}
              alt={post.title}
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        {/if}

        <div class="p-5">
          {#if post.tags.length > 0}
            <div class="flex flex-wrap gap-1.5 mb-3">
              {#each post.tags.slice(0, 3) as tag}
                <span
                  class="px-2 py-0.5 rounded text-xs font-mono"
                  style="background: rgba(163,230,53,0.08); color: #a3e635; border: 1px solid rgba(163,230,53,0.2);"
                >
                  #{tag}
                </span>
              {/each}
            </div>
          {/if}

          <h3 class="font-bold text-base mb-2 leading-snug line-clamp-2" style="color: #f4f4f5;">
            <a href={`/blog/${post.slug}`} class="stretched-link">
              {post.title}
            </a>
          </h3>

          <p class="text-sm mb-4 line-clamp-2 leading-relaxed" style="color: #a1a1aa;">
            {post.excerpt}
          </p>

          <div class="text-xs font-mono" style="color: #71717a;">
            {formatDate(post.date)}
          </div>
        </div>

        <!-- Hover accent -->
        <div
          class="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
          style="background: #a3e635;"
        ></div>
      </article>
    {/each}
  </div>
{:else}
  <div class="text-center py-20">
    <p class="text-2xl mb-2">🔍</p>
    <p class="font-medium mb-1" style="color: #f4f4f5;">No posts found</p>
    <p class="text-sm" style="color: #71717a;">
      Try a different search term or remove the tag filter.
    </p>
  </div>
{/if}

<style>
  .stretched-link::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
  }
</style>
