# Label Launch System (labellaunchsystem.com)

Landing page for the Label Launch System: release visuals for labels, managers and artists.
Static Vite site, vanilla JS, no framework. Deploys to Cloudflare Pages from GitHub `main`.
Design reference: usefastlane.ai (white, one accent, pill nav, spotlight, sticky process).

## Run

```bash
npm install
npm run dev        # http://localhost:5180
npm run dev:full   # Vite behind wrangler pages dev, so /api/lead works locally (needs .dev.vars)
npm run build      # production build -> dist/
npm run preview    # serve dist/ on http://localhost:4180
```

## Pages

- `index.html`: the landing page.
- `releases/rock-it-out/index.html`: the case-study page for Divi Roxx Kids "Rock It Out".

Both are registered in `vite.config.js`.

## Content

- `src/data.js` holds the lists: releases (YouTube id, artist, title, views, year), logo wall, testimonials, FAQ. Edit here, not in the HTML.
- Views were read with yt-dlp on 2026-10-04. Refresh before a push.
- `public/thumbs/<id>.webp` are the YouTube thumbnails (640w). `public/kit/` holds the client kit images and the two Canvas loops. `public/docs/` has the Launch Playbook and Release Cheat Sheet PDFs.
- `public/hero.mp4` is a 28-second muted excerpt of the studio demo reel, cropped to remove the yellow progress bar. Replace with the Label Launch Kit trailer when it is rendered (keep it under ~5 MB, 1280 wide, no audio).

## Logos

The marquee renders text wordmarks until the logo files exist. To switch one to an image, drop a monochrome SVG or PNG into `public/logos/` and add `img: '/logos/<file>'` to that entry in `LOGOS` in `src/data.js`.

## Lead form

`functions/api/lead.js` is a Cloudflare Pages Function. It creates a ClickUp task in the "fresh leads" list and emails a copy through Resend. Environment variables (Cloudflare Pages settings, and `.dev.vars` locally):

- `CLICKUP_API_TOKEN`, `CLICKUP_LIST_ID`
- `RESEND_API_KEY` (optional), `LEAD_NOTIFY_EMAIL` (default contact@lyricvideo.tv)

The sender is `noreply@ughdstudios.com` until labellaunchsystem.com is verified in Resend. Leads with budget "Under $2,500" are tagged `route-to-mlv` and the thank-you message points to makelyricvideo.com/pro.

## Deploy

1. Push to GitHub, connect the repo in Cloudflare Pages (build command `npm run build`, output `dist`).
2. Add the environment variables above.
3. Point labellaunchsystem.com at Cloudflare (Porkbun nameservers or CNAME), add the custom domain in Pages.
4. Replace `public/og.jpg` with a 1200x630 image if the generated one is swapped out.

## Copy rules

No em dashes. No "Kind regards". The DIY site is always "Make Lyric Video". Big-name credits use "has worked with". Every number on the page must trace to a source in the brief at `UG Brain/plan/label-launch-system-site/`.
