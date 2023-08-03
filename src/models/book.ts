import type { CollectionEntry } from "astro:content";

export type BookMeta = CollectionEntry<"books">["data"];
export type Book = CollectionEntry<"books">;
