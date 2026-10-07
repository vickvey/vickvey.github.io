# vickvey.github.io

Personal portfolio and blog, built with [Astro](https://astro.build) + Tailwind CSS v4 and deployed to GitHub Pages.

```bash
npm install
npm run dev       # http://localhost:4321 (drafts are visible)
npm run build     # type-check + static build into dist/
npm run preview   # serve the production build
```

## Where things live

| To change…                          | Edit                                              |
| ----------------------------------- | ------------------------------------------------- |
| Name, tagline, email, GitHub, CV    | `src/data/profile.json`                           |
| About section                       | `src/data/about.json`                             |
| Experience / Projects               | `src/data/experience.json`, `src/data/projects.json` (schemas in `src/content.config.ts`) |
| Skills / Achievements / Education   | `src/data/skills.json`, `achievements.json`, `education.json` |
| Project screenshots                 | `src/assets/images/projects/` (optimised at build) |
| PDFs (CV, reports)                  | `public/pdfs/` → reference as `/pdfs/<file>.pdf`  |
| Look and feel                       | `src/components/*.astro`, `src/styles/global.css` |

`order` in `experience.json` / `projects.json` controls display order; experience `order: 1` is treated as the current role and shown in the hero.

## Writing a blog post

Create `src/content/blog/<slug>.md`:

```md
---
title: "My post"
description: "One-line summary used in the list, RSS and link previews."
date: 2026-10-07
tags: [ml, remote-sensing]
draft: false   # true = visible in `npm run dev` only
---

Markdown here. Fenced code blocks are syntax-highlighted.
```

The filename becomes the URL (`/blog/<slug>/`). Push to `main` and it is live.

### Math

LaTeX is rendered to static HTML at build time with KaTeX (no client-side JS):

```md
Inline: $\bar{x} = \frac{1}{n}\sum_i x_i$

$$
S = \frac{\mathbb{E}[R_p - R_f]}{\sigma_p}
$$
```

Write a literal dollar sign as `\$`. Math needs the `unified` Markdown processor
(configured in `astro.config.mjs`), because Astro 7's default engine does not run remark/rehype plugins.

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/` to GitHub Pages.
In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
