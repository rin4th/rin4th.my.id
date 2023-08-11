import { defineConfig } from "astro/config";
import Unocss from "unocss/astro";
import path from "node:path";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
	integrations: [Unocss(), svelte(), mdx(), image({ serviceEntryPoint: "@astrojs/image/sharp" })],
	site: "https://rin4th.my.id",
	vite: {
		resolve: {
			alias: {
				"~/*": path.resolve("src"),
			},
		},
		ssr: {
			external: ["svgo"],
		},
	},
});