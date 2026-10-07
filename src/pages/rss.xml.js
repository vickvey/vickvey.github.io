import rss from "@astrojs/rss";
import { getPosts } from "../lib/blog";

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: "Vivek Kumar — Blog",
    description: "Notes on data science, machine learning, remote sensing and quantitative finance.",
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${p.id}/`,
    })),
  });
}
