<script lang="ts">
  interface NavLink {
    label: string;
    href: string;
  }

  interface Props {
    navLinks: NavLink[];
  }

  let { navLinks }: Props = $props();

  let open = $state(false);

  function toggle() {
    open = !open;
  }

  function close() {
    open = false;
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }
</script>

<!-- Hamburger button -->
<button
  onclick={toggle}
  class="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-1.5 transition-colors duration-200"
  style="background: transparent; border: none; cursor: pointer; color: #a1a1aa;"
  aria-label="Toggle menu"
  aria-expanded={open}
>
  <span
    class="block w-5 h-0.5 transition-all duration-300 origin-center"
    style="background: currentColor; transform: {open ? 'rotate(45deg) translateY(6px)' : 'none'};"
  ></span>
  <span
    class="block w-5 h-0.5 transition-all duration-300"
    style="background: currentColor; opacity: {open ? 0 : 1};"
  ></span>
  <span
    class="block w-5 h-0.5 transition-all duration-300 origin-center"
    style="background: currentColor; transform: {open ? 'rotate(-45deg) translateY(-6px)' : 'none'};"
  ></span>
</button>

<!-- Overlay -->
{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    use:portal
    class="fixed inset-0 z-40"
    style="background: rgba(0,0,0,0.5);"
    onclick={close}
  ></div>

  <!-- Menu panel -->
  <div
    use:portal
    class="fixed top-0 right-0 h-auto w-full z-50 flex flex-col"
    style="background: #252525; border-left: 1px solid #333;"
  >
    <!-- Close button -->
    <div class="flex items-center justify-between p-4 border-b" style="border-color: #333;">
      <span class="font-mono font-bold" style="color: #a3e635;">~/rin4th</span>
      <button
        onclick={close}
        style="background: transparent; border: none; cursor: pointer; color: #71717a;"
        aria-label="Close menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Nav links -->
    <nav class="flex flex-col p-4 gap-1">
      {#each navLinks as link}
        <a
          href={link.href}
          onclick={close}
          class="px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
          style="color: #a1a1aa; text-decoration: none;"
        >
          <span style="color: #a3e635; font-family: monospace; margin-right: 8px;">$</span>
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
{/if}
