// Generates releases/<slug>/index.html from src/releases.js.
// Run with `npm run gen` (also runs before every build).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FEATURED } from '../src/releases.js';
import { LOGOS, YT_CARDS, GOOGLE_REVIEWS_URL } from '../src/data.js';

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

// Days are only shown when they sell: ten days or fewer from order to delivery.
const isFast = (r) => { const m = /^(\d+) days$/.exec(r.turnaround || ''); return !!m && +m[1] <= 10; };
const short = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

const ICON = {
  audio: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // Facts row. Black on purpose: the only red on the page is the accent.
  yt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M23 7.2a2.9 2.9 0 0 0-2-2C19.2 4.7 12 4.7 12 4.7s-7.2 0-9 .5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 .5 12a30 30 0 0 0 .5 4.8 2.9 2.9 0 0 0 2 2c1.8.5 9 .5 9 .5s7.2 0 9-.5a2.9 2.9 0 0 0 2-2 30 30 0 0 0 .5-4.8 30 30 0 0 0-.5-4.8zM9.8 15.4V8.6l5.9 3.4z"/></svg>',
  files: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7.5 12 3l9 4.5-9 4.5z"/><path d="M3 7.5V16l9 4.5 9-4.5V7.5"/><path d="M12 12v8.5"/></svg>',
  // Formats: a landscape frame behind a phone. Approve: the button the label
  // clicks, with the cursor on it.
  formats: '<svg viewBox="0 0 28 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="5" width="18" height="12" rx="2.5"/><rect x="15" y="1" width="12" height="22" rx="3" fill="var(--bg)"/><path d="M19 19h4" stroke-linecap="round"/></svg>',
  approve: '<svg viewBox="0 0 30 24" aria-hidden="true"><rect x="1" y="3" width="24" height="13" rx="6.5" fill="currentColor"/><path d="M8 9.5l3 3 6.5-6.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12.5l9 4.2-4 1.1-1.3 4.2z" fill="#fff" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  cursor: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l14 8.2-6.2 1.4L9.6 19.5z" fill="#fff" stroke="#0b0b0c" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  // What the label sent.
  sheet: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2.5h8l5 5V21a.5.5 0 0 1-.5.5h-12A.5.5 0 0 1 6 21z"/><path d="M14 2.5v5h5M9 12h7M9 15.5h7M9 19h4"/></svg>',
  photos: '<svg viewBox="0 0 28 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="1.5" y="5.5" width="17" height="14" rx="2"/><path d="M6.5 2.5h17a2 2 0 0 1 2 2v12.5"/><path d="M1.5 16l5-4.5 4 3.5 3-2.5 5 4.5"/><circle cx="13.5" cy="9.5" r="1.6"/></svg>',
};

// The approve button, as the label sees it. In the process track the cursor
// comes in and clicks it when the section scrolls into view; `done` shows the
// clicked state straight away.
const approve = (done) => `<span class="ok${done ? ' is-done' : ''}" aria-label="Approved by the label"><i class="ok__btn">${ICON.check}<em>Approve</em><em>Approved</em></i>${ICON.cursor.replace('<svg ', '<svg class="ok__cur" ')}</span>`;

// Before / after: what the label sent, and the kit that came back. Sits in
// the hero of a visual case page, so it returns the block without a section.
function beforeAfter(r) {
  if (!r.kit) return '';
  const files = r.kit.reduce((s, k) => s + k.n, 0);
  const bars = Array.from({ length: 36 }, (_, i) => `<i style="--h:${(22 + 70 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.45))).toFixed(0)}%;--d:${(i % 9) * 70}ms"></i>`).join('');
  // Each tile is a mockup of where the file lives: a YouTube watch card, a
  // fanned pack of phones (hover spreads it), a thumbnail test, the look.
  const yc = YT_CARDS[r.id] || {};
  const tile = (k, i) => {
    const cls = { yt: 'kt--yt', pack: k.ui === 'reels' ? 'kt--promo' : 'kt--canvas', ab: 'kt--ab', look: 'kt--look' }[k.type] || '';
    let inner = '';
    if (k.type === 'yt') inner = `
              <a class="kt__yt" href="https://www.youtube.com/watch?v=${r.id}" data-yt="${r.id}" aria-label="Play ${esc(r.title)}">
                <span class="kt__ytframe"><img src="${k.img}" alt="${esc(r.artist)}, ${esc(r.title)}" loading="lazy" /><span class="yt__play"></span></span>
                <span class="kt__ytinfo"><img src="${yc.avatar || ''}" alt="" /><span><b>${esc(yc.title || `${r.artist} - ${r.title}`)}</b><small>${esc(yc.channel || r.artist)} · ${esc(r.views)} views</small></span></span>
              </a>`;
    else if (k.type === 'pack') inner = `
              <div class="pack pack--${k.ui}" style="--n:${k.items.length}">
                ${k.items.map((it, j) => `<figure class="pack__item" style="--i:${j}"><div class="phone"${j ? ' data-plain' : k.ui === 'spotify' ? ` data-title="${esc(r.title)}" data-artist="${esc(r.artist)}"` : ''}><video src="${it.video}" poster="${it.poster}" muted loop playsinline${j ? ' preload="none"' : ' autoplay preload="metadata"'} aria-label="${esc(it.label)}"></video></div><figcaption>${esc(it.label)}</figcaption></figure>`).join('\n                ')}
              </div>`;
    else if (k.type === 'ab') inner = `
              <div class="ab">
                <span class="ab__head"><b>Test &amp; compare</b><i>Ready to test</i></span>
                <span class="ab__row">${k.items.map((s, j) => `<span class="ab__v" style="--j:${j}"><img src="${s}" alt="Thumbnail design ${j + 1}" loading="lazy" /><b>${'ABC'[j]}</b></span>`).join('')}</span>
              </div>`;
    else if (k.type === 'look') inner = `
              <div class="lk"><img src="${k.items[0]}" alt="Mood board" loading="lazy" /><img src="${k.items[1]}" alt="Style frames" loading="lazy" />${approve(true)}</div>`;
    return `<figure class="kt ${cls}" style="--i:${i}">${inner}<figcaption><b>${esc(k.label)}</b>${k.unit ? `<span>${k.n} ${esc(k.unit)}</span>` : ''}</figcaption></figure>`;
  };
  return `
      <div class="ba" data-ba>
        <div class="ba__before">
          <span class="ba__tag">In</span>
          <div class="ba__file">
            <span class="ba__icon">${ICON.audio}</span>
            <div><b>${esc(r.title)}.wav</b><span>${esc(r.artist)}</span></div>
          </div>
          <div class="ba__wave" aria-hidden="true">${bars}</div>
          <ul class="ba__in">${(r.input || []).map((x) => `<li>${ICON.check}${esc(x)}</li>`).join('')}</ul>
          ${r.inputNote ? `<p class="ba__note">${esc(r.inputNote)}</p>` : ''}
        </div>
        <div class="ba__arrow" aria-hidden="true"><span></span></div>
        <div class="ba__after">
          <span class="ba__tag ba__tag--after">Out · ${files} files</span>
          <div class="ba__kit">
            ${r.kit.map(tile).join('\n            ')}
          </div>
        </div>
      </div>`;
}

// Hero of a visual case page: who, one line, the before/after, four figures.
function visualHero(r, logo) {
  const files = r.kit.reduce((s, k) => s + k.n, 0);
  const approvals = r.process ? r.process.filter((s) => s.stamp).length : 0;
  const facts = [
    [r.viewsNum, r.views, 'YouTube views', ICON.yt],
    [files, String(files), 'Files delivered', ICON.files],
    [r.kit.length, String(r.kit.length), 'Formats, each made for its screen', ICON.formats],
    [approvals, String(approvals), 'Sign-offs before the final', ICON.approve],
  ];
  return `
  <header class="case-hero case-hero--visual">
    <div class="wrap">
      <div class="case-who">
        <span class="eyebrow">Case study</span>
        ${logo ? `<span class="case-who__label"><img src="${logo.img}" alt="" />${esc(r.client)}</span>` : `<span class="case-who__label">${esc(r.client)}</span>`}
      </div>
      <h1 class="h2 case-title">${esc(r.artist)}, <em>"${esc(r.title)}"</em></h1>
      <p class="promise">${esc(r.promise || r.summary)}</p>
      ${beforeAfter(r)}
      <ul class="facts">
        ${facts.map(([n, txt, label, icon]) => `<li><span class="facts__icon">${icon}</span><span class="facts__text"><b data-count="${n}">${esc(txt)}</b><small>${esc(label)}</small></span></li>`).join('\n        ')}
      </ul>
    </div>
  </header>`;
}

// Process: steps, not days. Optional steps are dashed and drop out in Rush.
function processTrack(r) {
  if (!r.process) return '';
  const media = (s) => {
    // Brief: what the label sent, as icons.
    if (s.brief) {
      const ic = (x) => /audio|master|wav/i.test(x) ? ICON.audio : /lyric/i.test(x) ? ICON.sheet : /photo|image|picture/i.test(x) ? ICON.photos : ICON.files;
      return `<div class="pt__in">${(r.input || []).map((x) => `<span>${ic(x)}<i>${esc(x)}</i></span>`).join('')}</div>`;
    }
    // Final: the whole pack in one bundle (video, thumbnail, one phone per pack).
    if (s.folder) {
      const yt = r.kit.find((k) => k.type === 'yt');
      const ab = r.kit.find((k) => k.type === 'ab');
      const packs = r.kit.filter((k) => k.type === 'pack');
      return `<span class="pt__bundle">${yt ? `<img class="pt__bundle-yt" src="${yt.img}" alt="" loading="lazy" />` : ''}${ab ? `<img class="pt__bundle-th" src="${ab.items[0]}" alt="" loading="lazy" />` : ''}${packs.map((p, j) => `<span class="phone pt__bundle-ph" data-plain style="--j:${j}"><img src="${p.items[0].poster}" alt="" loading="lazy" /></span>`).join('')}</span>`;
    }
    if (s.img2) return `<span class="pt__two"><img src="${s.img2[0]}" alt="Mood board" loading="lazy" /><img src="${s.img2[1]}" alt="Style frames" loading="lazy" /></span>`;
    // First cut: a few seconds of the real preview, playing.
    if (s.player) return `<span class="pt__player"><video src="${s.video}" poster="${s.poster}" muted loop playsinline autoplay preload="metadata" aria-label="${esc(s.title)}"></video><i class="pt__bar"><i></i></i><em>0:30</em></span>`;
    if (s.video) return `<div class="phone pt__phone"><video src="${s.video}" muted loop playsinline autoplay preload="metadata" aria-label="${esc(s.title)}"></video></div>`;
    return `<img src="${s.img}" alt="${esc(s.title)}" loading="lazy" />`;
  };
  return `
  <section class="section section--tight section--card" data-process>
    <div class="wrap">
      <div class="section-head section-head--row">
        <div>
          <span class="eyebrow">How it was made</span>
          <h2 class="h2">The label signs off <em>at every step.</em></h2>
        </div>
        <div class="pt__toggle" role="group" aria-label="Schedule">
          <button type="button" class="is-on" data-pt-mode="std">Standard</button>
          <button type="button" data-pt-mode="rush">Rush</button>
        </div>
      </div>
      <ol class="pt">
        ${r.process.map((s, i) => `<li class="pt__step${s.optional ? ' pt__step--opt' : ''}" style="--i:${i}">
          <div class="pt__media">${media(s)}${s.stamp ? approve(false) : ''}${s.tag ? `<span class="pt__tag">${esc(s.tag)}</span>` : ''}</div>
          <span class="pt__dot"></span>
          <h3><small>${String(i + 1).padStart(2, '0')}</small>${esc(s.title)}</h3>
        </li>`).join('\n        ')}
      </ol>
      <p class="pt__note" data-pt-note="std">The dashed step is optional. Story-led videos add storyboards and character design there.</p>
      <p class="pt__note" data-pt-note="rush" hidden>Rush skips it: first cut in about two days, the video in about four.</p>
    </div>
  </section>`;
}

// Outcome: what the label said, and whether they came back.
function outcome(r) {
  if (!r.quotes && !r.repeat) return '';
  // Each quote is drawn as the thing it came from: an email, a Google review.
  const initials = (s) => s.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const quotes = (r.quotes || []).map((q) => q.kind === 'google' ? `
          <figure class="oc__card oc__card--google">
            <span class="oc__head"><i class="oc__avatar">${esc(initials(q.name)[0])}</i><span><b>${esc(q.name)}</b><small>${esc(q.role)}</small></span><span class="oc__g" aria-hidden="true">G</span></span>
            <span class="stars" aria-label="${q.stars || 5} stars">${'★'.repeat(q.stars || 5)}</span>
            <blockquote>${esc(q.q)}</blockquote>
            <figcaption><a class="link" href="${GOOGLE_REVIEWS_URL}" target="_blank" rel="noopener">Google review, verified ↗</a></figcaption>
          </figure>` : `
          <figure class="oc__card oc__card--mail">
            <span class="oc__head"><i class="oc__avatar">${esc(initials(q.name))}</i><span><b>${esc(q.name)}</b><small>${esc(q.role)}</small></span>${q.when ? `<small class="oc__when">${esc(q.when)}</small>` : ''}</span>
            ${q.subject ? `<span class="oc__subject">${esc(q.subject)}</span>` : ''}
            <blockquote>${esc(q.q)}</blockquote>
            <figcaption>Email to the studio</figcaption>
          </figure>`).join('');
  const rep = r.repeat ? `
        <div class="oc__repeat">
          <span class="eyebrow">Repeat client</span>
          <h3 class="h3">${esc(r.repeat.line)}</h3>
          <ol class="oc__chain">
            ${r.repeat.releases.map((x) => `<li${x.current ? ' class="is-current"' : ''}><a href="https://www.youtube.com/watch?v=${x.id}" data-yt="${x.id}"><img src="/thumbs/${x.id}.webp" alt="${esc(x.title)}" loading="lazy" /></a><b>${esc(x.title)}</b><span>${x.year}${x.current ? ' · this case' : ''}</span></li>`).join('\n            ')}
          </ol>
        </div>` : '';
  return `
  <section class="section section--tight">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">The label's verdict</span>
        <h2 class="h2">What they said, <em>and what they did next.</em></h2>
      </div>
      <div class="oc">
        <div class="oc__stack">${quotes}
        </div>${rep}
      </div>
      ${r.kit ? '<p class="case-note">Views read from YouTube on October 6, 2026.</p>' : ''}
    </div>
  </section>`;
}

// One look: the palette comes from the artist's photo and the references,
// then shows up in every file. Dot and chip positions come from releases.js.
function oneLook(r) {
  const L = r.look;
  if (!L) return '';
  // Colour-picker dots: hover (or focus) shows the hex.
  let n = 0;
  const dots = (list) => list.map((d) => `<span class="look__dot" style="--x:${d.x}%;--y:${d.y}%;--c:${d.c};--i:${n++}" tabindex="0"><i>${d.c}</i></span>`).join('');
  return `
  <section class="section section--tight section--card" data-look>
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">One look</span>
        <h2 class="h2">Their photos set the palette. <em>Every file keeps it.</em></h2>
      </div>
      <div class="look">
        <div class="look__from">
          <div class="look__photos">
            ${L.photos.map((p) => `<figure class="look__photo"><span class="look__img" style="--ar:${p.ar}"><img src="${p.src}" alt="${esc(p.label)}, photo from the label" loading="lazy" />${dots(p.dots)}</span><figcaption>${esc(p.label)}</figcaption></figure>`).join('\n            ')}
          </div>
          <figure class="look__refs"><img src="${L.refs}" alt="Mood board references" loading="lazy" />${dots(L.refDots)}<figcaption>References</figcaption></figure>
        </div>
        <div class="look__pal" aria-label="Palette">${L.palette.map((c, i) => `<i style="--c:${c};--i:${i}"></i>`).join('')}<span>One palette</span></div>
        <div class="look__to">
          ${L.outputs.map((o) => `<figure class="look__out${o.video ? ' look__out--phone' : ''}">${o.video
            ? `<div class="phone" data-plain><video src="${o.video}"${o.poster ? ` poster="${o.poster}"` : ''} muted loop playsinline autoplay preload="metadata" aria-label="${esc(o.label)}"></video></div>`
            : `<img src="${o.img}" alt="${esc(o.label)}" loading="lazy" />`}<figcaption>${esc(o.label)}</figcaption></figure>`).join('\n          ')}
        </div>
      </div>
    </div>
  </section>`;
}

function page(r, idx) {
  const prev = FEATURED[(idx + FEATURED.length - 1) % FEATURED.length];
  const next = FEATURED[(idx + 1) % FEATURED.length];
  const url = `https://labellaunchsystem.com/releases/${r.slug}/`;
  const titleTag = `${r.artist}, "${r.title}": ${r.views} views | Label Launch System`;
  const phone = r.canvas || r.vertical
    ? `<div class="phone phone--lg"><video src="${r.vertical || r.canvas}" autoplay muted loop playsinline aria-label="${esc(r.vertical ? 'Vertical promo clip' : 'Spotify Canvas loop')}"></video></div>`
    : '';
  const gallery = r.gallery.length && !r.process
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
  // "Built for the screen" section, rendered by main.js. Only the parts this
  // release has: a vertical promo clip, a 9:16 Canvas, a seamless Canvas loop.
  const bpCanvas = r.canvas && r.canvasSpec !== false ? r.canvas : '';
  const blueprint = r.vertical || bpCanvas
    ? `
  <section class="section section--tight" data-blueprint data-reel="${r.vertical || ''}" data-canvas="${bpCanvas}" data-loop="${r.loop && bpCanvas ? r.slug : ''}"${r.face ? ` data-face="${esc(JSON.stringify(r.face))}"` : ''}${r.thumbs ? ` data-thumbs="${r.thumbs.join(',')}"` : ''}></section>` : '';
  const fast = isFast(r);
  const logo = LOGOS.find((l) => l.img && r.client.startsWith(l.text));
  const chips = [[r.views, 'YouTube views, Oct 2026']];
  if (fast || r.turnaroundLabel) chips.push([r.turnaround, r.turnaroundLabel || 'Order to delivery']);
  chips.push(r.kit ? [r.kit.reduce((s, k) => s + k.n, 0), 'Files delivered, one look'] : [r.deliverables.length, 'Deliverable groups']);
  chips.push(r.social ? [r.social.views, `Promo clip views, ${r.social.note}`] : [r.likes, 'Likes on YouTube']);
  if (chips.length < 4) chips.push(r.kit ? [r.kit.length, 'Formats, each made for its platform'] : r.social ? [r.likes, 'Likes on YouTube'] : [r.label.replace('Released on the ', '').replace(' channel', ''), 'Released on this channel']);
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
${r.kit ? visualHero(r, logo) : `
  <header class="case-hero">
    <div class="wrap">
      <span class="eyebrow">Release case study · ${esc(r.genre)}</span>
      ${logo ? `<div class="labelbadge"><img src="${logo.img}" alt="" /><span>For <b>${esc(r.client)}</b></span></div>` : ''}
      <h1 class="h2" style="margin-top:14px;font-size:clamp(36px,6vw,66px)">${esc(r.artist)}, <em>"${esc(r.title)}"</em></h1>
      <p class="lede" style="margin-top:16px;max-width:640px">${esc(r.summary)}</p>
      <div class="statgrid">
        ${chips.map(([b, s]) => `<div class="statgrid__item"><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join('\n        ')}
      </div>
      <div class="case-meta">
        <div><b>Client</b>${esc(r.client)}</div>
        <div><b>Channel</b>${esc(r.label)}</div>
        ${fast ? `<div><b>Ordered</b>${fmt(r.ordered)}</div>
        <div><b>Delivered</b>${fmt(r.delivered)}</div>` : ''}
        <div><b>Released</b>${fmt(r.released)}</div>
      </div>
      <div class="spot__media" style="margin-top:36px;grid-template-columns:1fr ${phone ? '150px' : ''}">
        <a class="yt" href="https://www.youtube.com/watch?v=${r.id}" data-yt="${r.id}" data-ytcard="${r.id}" aria-label="Play ${esc(r.title)}">
          <img src="${r.poster}" alt="${esc(r.artist)}, ${esc(r.title)}, official lyric video" width="960" height="540" />
          <span class="yt__play" aria-hidden="true"></span>
        </a>
        ${phone}
      </div>
    </div>
  </header>`}

${processTrack(r)}${r.kit ? '' : `
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
  </section>`}
${oneLook(r)}
${blueprint}
${gallery}
${outcome(r)}${r.kit ? '' : `
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
  </section>`}

  <section class="section section--card">
    <div class="wrap center">
      <span class="eyebrow">Your single next</span>
      <h2 class="h2" style="margin-top:14px">Same team, <em>your release window.</em></h2>
      <p class="lede" style="margin:18px auto 0">Send the song and the date. A plan and a price in writing within 24 hours.</p>
      <div style="margin-top:28px"><a class="btn btn--accent" href="/#plan">Plan your release</a></div>
      <nav class="casenav" aria-label="More case studies">
        <a class="casenav__card" href="/releases/${prev.slug}/"><img src="${prev.poster}" alt="" loading="lazy" /><span><small>← Previous</small><b>${esc(prev.artist)}</b><em>${esc(prev.title)}</em></span></a>
        <a class="casenav__card casenav__card--next" href="/releases/${next.slug}/"><img src="${next.poster}" alt="" loading="lazy" /><span><small>Next →</small><b>${esc(next.artist)}</b><em>${esc(next.title)}</em></span></a>
      </nav>
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
