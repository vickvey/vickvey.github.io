import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: file("src/data/projects.json"),
  schema: ({ image }) =>
    z.object({
      /** Display order, ascending (collection order is otherwise alphabetical by id) */
      order: z.number(),
      title: z.string(),
      duration: z.string(),
      description: z.string(),
      keywords: z.array(z.string()).min(1),
      image: image(),
      guide: z.string().optional(),
      /** PDF under /public/pdfs, opened in the in-page viewer */
      reportPdf: z.string().startsWith("/pdfs/").optional(),
      slidesPdf: z.string().startsWith("/pdfs/").optional(),
      /** External write-up (e.g. a README) opened in a new tab */
      reportUrl: z.url().optional(),
      github: z.url(),
    }),
});

const experience = defineCollection({
  loader: file("src/data/experience.json"),
  schema: z.object({
    /** Display order, ascending. Order 1 is the current role (used by the hero). */
    order: z.number(),
    title: z.string(),
    organization: z.string(),
    location: z.string().optional(),
    duration: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).min(1),
  }),
});

export const collections = { blog, projects, experience };
