import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().default(false),
  }),
});

const writeupCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    platform: z.enum(["HackTheBox", "TryHackMe", "PwnTillDawn", "Other"]),
    os: z.enum(["Linux", "Windows", "Active Directory", "Other"]),
    difficulty: z.enum(["Easy", "Medium", "Hard", "Insane"]),
    date: z.coerce.date(),
    encrypted: z.boolean().default(true),
    writeupUrl: z.string().optional(),
  }),
});

const projectCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    previewImage: z.string().default("/images/project-placeholder.png"),
    techStack: z.array(z.string()),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    featured: z.boolean().default(false),
    date: z.coerce.date(),
  }),
});

export const collections = {
  blog: blogCollection,
  writeup: writeupCollection,
  project: projectCollection,
};
