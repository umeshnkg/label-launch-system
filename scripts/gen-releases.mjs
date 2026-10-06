// Generates releases/<slug>/index.html from src/releases.js.
// Run with `npm run gen` (also runs before every build).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FEATURED } from '../src/releases.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (iso) => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

const NAV = `
  <nav class="nav" aria-label="Main">
    <a class="brand" href="/"><span class="brand__mark" aria-hidden="true"></span>Label Launch System</a>
    <div class="nav__links">
      <a href="/#work">Work</a>
      <a href="/#kit">The Kit</a>
      <a href="/#process">Process</a>
      <a href="/#packages">Packages</a>
      <a href="/#faq">FAQ</a>
    </div>
    <a class="btn btn--sm" href="/#plan">Plan your release <span class="arrow">→</span></a>
  </nav>`;

const FOOTER = `
  <footer class="footer">
    <div class="wrap">
      <div class="footer__grid">
        <div>
          <a class="brand footer__brand" href="/"><span class="brand__mark" aria-hidden="true"></span>Label Launch System</a>
          <p style="margin-top:12px;max-width:380px">Release visuals for labels, managers and artists. A UGHD Studios, Inc. production, Delaware, USA.</p>
          <p style="margin-top:10px">© <span data-year></span> UGHD Studios, Inc.</p>
        </div>
        <div>
          <b class="footer__brand">Studio</b>
          <ul>
            <li><a href="https://ughdstudios.com">UGHD Studios</a></li>
            <li><a href="https://www.lyricvideo.tv">LyricVideo.tv</a></li>
            <li><a href="https://www.makelyricvideo.com">Make Lyric Video</a></li>
          </ul>
        </div>
        <div>
          <b class="footer__brand">Contact</b>
          <ul>
            <li><a href="mailto:contact@lyricvideo.tv">contact@lyricvideo.tv</a></li>
            <li><a href="tel:+16062274600">+1 (606) 227 4600</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  <div class="modal" data-modal aria-hidden="true">
    <div class="modal__backdrop" data-modal-close></div>
    <div class="modal__box"></div>
    <button class="modal__close" type="button" data-modal-close aria-label="Close">×</button>
  </div>
  <script type="module" src="/src/main.js"></script>`;

function page(r, idx) {
  const prev = FEATURED[(idx + FEATURED.length - 1) % FEATURED.length];
  const next = FEATURED[(idx + 1) % FEATURED.length];
  const url = `https://labellaunchsystem.com/releases/${r.slug}/`;
  const titleTag = `${r.artist}, "${r.title}": ${r.views} views | Label Launch System`;
  const phone = r.canvas || r.vertical
    ? `<div class="phone phone--lg"><video src="${r.vertical || r.canvas}" autoplay muted loop playsinline aria-label="${esc(r.vertical ? 'Vertical promo clip' : 'Spotify Canvas loop')}"></video></div>`
    : '';
  const gallery = r.gallery.length
    ? `
  <section class="section section--tight section--card">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Visual breakdown</span>
        <h2 class="h2">The frames the label <em>could pick from.</em></h2>
      </div>
      <div class="gallery">
        ${r.gallery.map((g, i) => `<img src="${g}" alt="${esc(r.title)} design ${i + 1}" loading="lazy" />`).join('\n        ')}
      </div>
    </div>
  </section>` : '';
  const timeline = [
    ['Ordered', r.ordered],
    r.preview ? ['Preview approved', r.preview] : null,
    ['Kit delivered', r.delivered],
    ['Released', r.released],
  ].filter(Boolean);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(titleTag)}</title>
  <meta name="description" content="${esc(r.description)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(`${r.artist}, ${r.title}: ${r.views} views`)}" />
  <meta property="og:description" content="${esc(r.summary)}" />
  <meta property="og:image" content="https://labellaunchsystem.com${r.poster}" />
  <meta property="og:url" content="${url}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230b0b0c'/%3E%3Ccircle cx='23' cy='9' r='4' fill='%23e5261f'/%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400..700;1,14..32,400..600&display=swap" rel="stylesheet" />
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `${r.artist} - ${r.title} (Official Lyric Video)`,
    description: r.description,
    thumbnailUrl: `https://labellaunchsystem.com${r.poster}`,
    uploadDate: r.released,
    embedUrl: `https://www.youtube-nocookie.com/embed/${r.id}`,
    interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/WatchAction', userInteractionCount: r.viewsNum },
    producer: { '@type': 'Organization', name: 'UGHD Studios, Inc.', url: 'https://labellaunchsystem.com/' },
  })}
  </script>
</head>
<body>
${NAV}

  <header class="case-hero">
    <div class="wrap">
      <span class="eyebrow">Release case study · ${esc(r.genre)}</span>
      <h1 class="h2" style="margin-top:14px;font-size:clamp(36px,6vw,66px)">${esc(r.artist)}, <em>"${esc(r.title)}"</em></h1>
      <p class="lede" style="margin-top:16px;max-width:640px">${esc(r.summary)}</p>
      <div class="statgrid">
        <div class="statgrid__item"><b>${esc(r.views)}</b><span>YouTube views, Oct 2026</span></div>
        <div class="statgrid__item"><b>${esc(r.turnaround)}</b><span>${esc(r.turnaroundLabel || 'Order to delivery')}</span></div>
        <div class="statgrid__item"><b>${r.deliverables.length}</b><span>Deliverable groups</span></div>
        ${r.social
          ? `<div class="statgrid__item"><b>${esc(r.social.views)}</b><span>Promo clip views, ${esc(r.social.note)}</span></div>`
          : `<div class="statgrid__item"><b>${esc(r.likes)}</b><span>Likes on YouTube</span></div>`}
      </div>
      <div class="case-meta">
        <div><b>Client</b>${esc(r.client)}</div>
        <div><b>Channel</b>${esc(r.label)}</div>
        <div><b>Ordered</b>${fmt(r.ordered)}</div>
        <div><b>Delivered</b>${fmt(r.delivered)}</div>
        <div><b>Released</b>${fmt(r.released)}</div>
      </div>
      <div class="spot__media" style="margin-top:36px;grid-template-columns:1fr ${phone ? '150px' : ''}">
        <a class="yt" href="https://www.youtube.com/watch?v=${r.id}" data-yt="${r.id}" aria-label="Play ${esc(r.title)}">
          <img src="${r.poster}" alt="${esc(r.artist)}, ${esc(r.title)}, official lyric video" width="960" height="540" />
          <span class="yt__play" aria-hidden="true"></span>
          <span class="yt__views">${esc(r.views)} views</span>
        </a>
        ${phone}
      </div>
    </div>
  </header>

  <section class="section section--tight">
    <div class="wrap">
      <div class="spot" style="align-items:start">
        <div>
          <span class="eyebrow">The brief</span>
          <h2 class="h3" style="margin-top:12px">${esc(r.requirement)}</h2>
        </div>
        <div>
          <span class="eyebrow">What shipped</span>
          <ul class="list">
            ${r.deliverables.map((d) => `<li>${esc(d)}</li>`).join('\n            ')}
          </ul>
        </div>
      </div>
    </div>
  </section>
${gallery}
  <section class="section section--tight">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Timeline</span>
        <h2 class="h2">From order to <em>release day.</em></h2>
      </div>
      <div class="timeline">
        ${timeline.map(([k, v]) => `<div class="card"><div class="dot"></div><h3>${esc(k)}</h3><p>${fmt(v)}</p></div>`).join('\n        ')}
      </div>
      <p class="small muted" style="margin-top:22px">Views and likes are read from YouTube on the date shown. Promo clip views count the release’s promo posts on the artist’s own YouTube channel${r.social ? ` (${r.social.ids.map((id) => `<a class="link" href="https://www.youtube.com/shorts/${id}" target="_blank" rel="noopener">${id}</a>`).join(', ')})` : ''}. Instagram and TikTok views are not tracked.</p>
    </div>
  </section>

  <section class="section section--card">
    <div class="wrap center">
      <span class="eyebrow">Your single next</span>
      <h2 class="h2" style="margin-top:14px">Same team, <em>your release window.</em></h2>
      <p class="lede" style="margin:18px auto 0">Send the song and the date. We reply within 24 hours with a plan and a price in writing.</p>
      <div style="margin-top:28px"><a class="btn btn--accent" href="/#plan">Plan your release</a></div>
      <p class="small muted" style="margin-top:36px">
        <a href="/releases/${prev.slug}/" style="text-decoration:underline">← ${esc(prev.artist)}, ${esc(prev.title)}</a>
        &nbsp;·&nbsp;
        <a href="/releases/${next.slug}/" style="text-decoration:underline">${esc(next.artist)}, ${esc(next.title)} →</a>
      </p>
    </div>
  </section>
${FOOTER}
</body>
</html>
`;
}

let n = 0;
FEATURED.forEach((r, i) => {
  const dir = path.join(root, 'releases', r.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(r, i));
  n++;
});
console.log(`generated ${n} release pages`);
