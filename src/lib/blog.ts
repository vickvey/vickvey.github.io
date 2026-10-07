import { getCollection } from "astro:content";

/** Published posts, newest first. Drafts show up in `astro dev` only. */
export const getPosts = async () => {
  const posts = await getCollection("blog", ({ data }) => !import.meta.env.PROD || !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
};

export const readingTime = (body = "") => Math.max(1, Math.round(body.split(/\s+/).length / 220));

export const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
