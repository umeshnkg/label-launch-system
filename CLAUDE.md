# Label Launch System site: project guide

Landing page for labellaunchsystem.com. Vite static multipage, vanilla JS, Cloudflare Pages.
Brief, teardown, proof inventory and Umesh's decisions: `E:\Obsidian Vaults\UG Brain\plan\label-launch-system-site\00-fastlane-teardown-and-site-brief.md`. Read it before changing copy or packages.

## Rules
- One accent colour: change `--accent` in `src/styles.css`, nothing else. No yellow on this site.
- Copy: no em dashes, no "Kind regards", the DIY product is "Make Lyric Video", big names are "has worked with".
- Every number (views, counts, prices) must be traceable to the brief. Views come from yt-dlp, not memory.
- Only work confirmed in the Dropbox deliveries folder goes in `FEATURED` (src/releases.js) or `LYRIC_VIDEOS` (src/data.js).
- Never commit `.dev.vars`. Push only when Umesh asks (every push to `main` deploys to Cloudflare Pages).

## Commands
- `npm run gen` (case pages) · `npm run dev` (port 5180) · `npm run build` · `npm run preview` (port 4180) · `npm run dev:full` (wrangler + Function) · `node scripts/shoot.mjs <dir>` (screenshots)

## Structure
- `index.html` landing · `releases/<slug>/index.html` case studies (8 generated from `src/releases.js` by `scripts/gen-releases.mjs`; `rock-it-out` is handwritten)
- `src/releases.js` featured case studies · `src/data.js` other lists (lyric videos, logos, services, reviews, FAQ) · `src/main.js` behaviour · `src/styles.css` tokens + layout
- Repo: github.com/umeshnkg/label-launch-system -> Cloudflare Pages (same method as ughdstudios.com)
- `functions/api/lead.js` lead form -> ClickUp + Resend
- `public/thumbs` YouTube thumbs · `public/kit` client kit images + Canvas loops · `public/docs` PDFs · `public/hero.mp4` hero loop
