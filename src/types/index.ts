import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;
export type WriteUp = CollectionEntry<"writeup">;
export type Project = CollectionEntry<"project">;

export type BlogPostData = BlogPost["data"];
export type WriteUpData = WriteUp["data"];
export type ProjectData = Project["data"];

export type WriteUpPlatform = "HackTheBox" | "TryHackMe" | "PwnTillDawn" | "Other";
export type WriteUpOS = "Linux" | "Windows" | "Active Directory" | "Other";
export type WriteUpDifficulty = "Easy" | "Medium" | "Hard" | "Insane";

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface WriteUpEntry {
  slug: string;
  title: string;
  platform: WriteUpPlatform;
  os: WriteUpOS;
  difficulty: WriteUpDifficulty;
  date: Date;
  encrypted: boolean;
  writeupUrl?: string | undefined;
}

export interface WriteUpGroup {
  platform: WriteUpPlatform;
  entries: WriteUpEntry[];
}

export interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}
