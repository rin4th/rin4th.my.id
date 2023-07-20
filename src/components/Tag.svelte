<button
	class={`font-heading font-medium ${variant === "ghost" ? "border-none bg-cyan-200 text-cyan-900" : "shadow-sharp border-solid border-2 border-cyan-900 bg-white text-zinc-900"} rounded-lg text-sm no-underline gap-2 py-1 px-2 mt-2 mx-1 uppercase transition-property-filter duration-200 ease-out cursor-pointer`}
	tabindex="0"
	on:click={() => onClick?.()}
	on:keydown={(e) => e.key === "Enter" && onClick?.()}
>
	<slot />
</button>

<script lang="ts">
export let onClick: (() => void) | undefined = undefined;
export let variant: "ghost" | "solid" = "ghost"
</script>
