import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://vickvey.github.io",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    // Astro 7's default Markdown engine (Sätteri) doesn't run remark/rehype plugins;
    // the unified processor is needed for remark-math + rehype-katex.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
