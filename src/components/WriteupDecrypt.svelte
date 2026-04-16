<script lang="ts">
  interface Props {
    ciphertext: string;
    iv: string;
    salt: string;
  }

  let { ciphertext, iv, salt }: Props = $props();

  let password = $state("");
  let decryptedHtml = $state<string | null>(null);
  let error = $state<string | null>(null);
  let decrypting = $state(false);

  function base64ToBytes(b64: string): Uint8Array {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  }

  async function decrypt() {
    if (decrypting || !password) return;
    decrypting = true;
    error = null;

    try {
      const saltBytes = base64ToBytes(salt);
      const ivBytes = base64ToBytes(iv);
      const ctBytes = base64ToBytes(ciphertext);

      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"],
      );

      const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"],
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBytes },
        key,
        ctBytes,
      );

      decryptedHtml = new TextDecoder().decode(decrypted);
    } catch {
      error = "Incorrect password.";
    } finally {
      decrypting = false;
    }
  }
</script>

{#if decryptedHtml}
  <div class="prose max-w-none">
    {@html decryptedHtml}
  </div>
{:else}
  <div
    class="flex flex-col items-center justify-center py-20 rounded-2xl"
    style="background: #1e1e1e; border: 1px solid #333;"
  >
    <!-- Lock icon -->
    <div class="mb-5" style="color: #a3e635;">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>

    <p class="font-bold text-lg mb-1" style="color: #f4f4f5;">Encrypted Writeup</p>
    <p class="text-sm mb-6" style="color: #71717a;">Enter the password to read this writeup.</p>

    <div class="flex flex-col items-center gap-3 w-full max-w-xs">
      <div class="flex gap-2 w-full">
        <input
          type="password"
          placeholder="Password"
          bind:value={password}
          onkeydown={(e) => e.key === "Enter" && decrypt()}
          class="flex-1 px-3 py-2 rounded-lg text-sm font-mono outline-none"
          style="background: #252525; border: 1px solid {error ? '#ef4444' : '#3d3d3d'}; color: #f4f4f5; font-family: 'IBM Plex Mono', monospace;"
        />
        <button
          onclick={decrypt}
          disabled={decrypting || !password}
          class="px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200"
          style="background: rgba(163,230,53,0.15); color: #a3e635; border: 1px solid rgba(163,230,53,0.4); cursor: {decrypting || !password ? 'not-allowed' : 'pointer'}; opacity: {decrypting || !password ? '0.6' : '1'};"
        >
          {decrypting ? "..." : "Unlock"}
        </button>
      </div>

      {#if error}
        <p class="text-xs font-mono" style="color: #ef4444;">{error}</p>
      {/if}
    </div>
  </div>
{/if}
