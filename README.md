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
- `releases/<slug>/index.html`: one case-study page per featured release. Eight are generated from `src/releases.js` by `scripts/gen-releases.mjs` (runs on `npm run gen`, `dev` and `prebuild`). `releases/rock-it-out/index.html` is handwritten.

`vite.config.js` picks up every `releases/*/index.html` on disk.

## Content

- `src/releases.js` holds the featured case studies (YouTube id, client, dates, turnaround, deliverables, promo Shorts). `src/data.js` holds the rest: smaller lyric videos, logo wall, services, review screenshots, quotes, FAQ. Edit here, not in the HTML.
- Views were read with yt-dlp on 2026-10-06. Refresh before a push.
- `public/thumbs/<id>.webp` are the YouTube thumbnails (640w). `public/kit/` holds the client kit images and the two Canvas loops. `public/docs/` has the Launch Playbook and Release Cheat Sheet PDFs.
- `public/hero.mp4` is a 28-second muted excerpt of the studio demo reel, cropped to remove the yellow progress bar. Replace with the Label Launch Kit trailer when it is rendered (keep it under ~5 MB, 1280 wide, no audio).

## Logos

`public/logos/` holds white-on-transparent PNGs (and one SVG) that CSS greys down in the marquee. Entries without `img` render as text. To add one, drop a white silhouette into `public/logos/` and set `img` and `h` (display height in px) on that entry in `LOGOS` in `src/data.js`. `scripts/logo-from-luminance.mjs` turns a dark-on-light logo into a trimmed white PNG.

## Lead form

`functions/api/lead.js` is a Cloudflare Pages Function. It creates a ClickUp task in the "fresh leads" list and emails a copy through Resend. Environment variables (Cloudflare Pages settings, and `.dev.vars` locally):

- `CLICKUP_API_TOKEN`, `CLICKUP_LIST_ID`
- `RESEND_API_KEY` (optional), `LEAD_NOTIFY_EMAIL` (default contact@lyricvideo.tv)

The sender is `noreply@labellaunchsystem.com`; the domain is verified in Resend (account umeshnkg) with the DKIM TXT, the `rsend`/`send` CNAMEs and a DMARC TXT in Cloudflare DNS. Delivery errors show in Pages -> deployment -> Functions -> Real-time logs. Leads with budget "Under $1,000" are tagged `route-to-mlv` and the thank-you message points to makelyricvideo.com/pro.

## Deploy

Same setup as ughdstudios.com: GitHub `main` -> Cloudflare Pages, auto-deploy on push.

- Repo: https://github.com/umeshnkg/label-launch-system (pushed 2026-10-06).
- Cloudflare Pages: Workers & Pages -> Create -> Pages -> Import an existing Git repository -> `umeshnkg/label-launch-system`. Framework preset Vite, build command `npm run build`, output directory `dist`, production branch `main`. `.node-version` pins Node 22.
- Environment variables (Settings -> Variables and Secrets, production): the four listed above. Copy the ClickUp and Resend values from the ughd-studios Pages project; the ClickUp list is the same "fresh leads" list.
- Domain: labellaunchsystem.com is registered at Porkbun. Add the site to Cloudflare, switch the Porkbun nameservers to the two Cloudflare ones, then Pages -> Custom domains -> add `labellaunchsystem.com` and `www.labellaunchsystem.com`.
- After the first deploy, submit `https://labellaunchsystem.com/sitemap.xml` in Search Console.
- Screenshots of the built site: `node scripts/shoot.mjs <outDir>` (headless Edge, needs `vite preview` port 4180 free).

## Copy rules

No em dashes. No "Kind regards". The DIY site is always "Make Lyric Video". Big-name credits use "has worked with". Every number on the page must trace to a source in the brief at `UG Brain/plan/label-launch-system-site/`.
