<div class="text-left rounded z-[2] overflow-hidden shadow-lg bg-stone-700 ">
  <a
		rel="prefetch"
        {href}
        class="rid grid-rows-[4rem_2rem_8rem_2rem] text-zinc-600 no-underline p-4 h-full"
	>
    <div class="px-6 py-4">
        <div class="text-left font-bold text-xl mb-2 text-white hover:text-cyan-500">{title}</div>
        <div class="font-heading flex gap-1 items-center justify-self-start text-sm text-zinc-700">
            <CalendarIcon className="w-5 h-5 block -mt-1"/>
            <span class="date__label text-white">
            {date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })}
            </span>
        </div>
        <p class="text-left font-serif leading-normal mb-4 text-lg text-white">
            {@html description}
        </p>
        <div class="text-left px-2 pt-4 pb-2">
            {#each tags as tag}
                <Tag># {tag}</Tag>
            {/each}
        </div>
    </div>
  </a>
</div>
<script lang="ts">
    import CalendarIcon from "~/icons/CalendarIcon.svelte";
    import Tag from "~/components/Tag.svelte";
    
    export let title: string;
    export let description: string;
    export let href: string;
    export let date: Date;
    export let tags: string[];
</script>    