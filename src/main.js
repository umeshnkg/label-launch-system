import './styles.css';
import './case.css';
import { MOTION_COVERS } from './data.js';
import {
  FEATURED, LYRIC_VIDEOS, LYRIC_VIDEOS_VISIBLE, LOGOS, SERVICES,
  REVIEW_IMAGES_A, REVIEW_IMAGES_B, QUOTES, HERO_QUOTES, GOOGLE_REVIEWS_URL, FAQ,
  SPOTIFY_CANVAS_UI, YT_CARDS, REELS, WALL_A, WALL_B,
} from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Hero quote card: fades through HERO_QUOTES, holding each one long enough
   to read. Pauses on hover/focus and while the tab is hidden; with reduced
   motion it stays on the first quote. */
const heroQuotes = $('[data-hero-quotes] .hq');
if (heroQuotes) {
  heroQuotes.innerHTML = HERO_QUOTES.map((t, i) => `
    <div class="hq__item${i === 0 ? ' is-on' : ''}"${i === 0 ? '' : ' aria-hidden="true"'}>
      <q>${esc(t.q)}</q>
      <span class="hq__who">${t.google ? '<span class="hq__stars" aria-label="5 stars on Google">★★★★★</span>' : ''}<strong>${esc(t.name)}</strong>${t.role ? `, ${esc(t.role)}` : ''}</span>
    </div>`).join('');

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const items = $$('.hq__item', heroQuotes);
    const card = heroQuotes.parentElement;
    let i = 0, paused = false, timer;
    const hold = (t) => Math.min(3500 + t.q.length * 45, 9000);
    const next = () => {
      if (!paused && !document.hidden) {
        items[i].classList.remove('is-on');
        items[i].setAttribute('aria-hidden', 'true');
        i = (i + 1) % items.length;
        items[i].classList.add('is-on');
        items[i].removeAttribute('aria-hidden');
      }
      timer = setTimeout(next, hold(HERO_QUOTES[i]));
    };
    timer = setTimeout(next, hold(HERO_QUOTES[0]));
    card.addEventListener('mouseenter', () => { paused = true; });
    card.addEventListener('mouseleave', () => { paused = false; });
  }
}

/* Logo marquee: content is doubled so the loop is seamless. Scrolled from JS
   rather than CSS so hovering brakes it quickly instead of freezing it, and
   leaving picks the speed back up gently. */
const track = $('[data-marquee]');
if (track) {
  const items = LOGOS.map((l) => l.img
    ? `<span class="logo"><img src="${l.img}" alt="${esc(l.text)}" loading="lazy" style="--h:${l.h || 30}" /></span>`
    : `<span class="logo">${esc(l.text)}</span>`).join('');
  track.innerHTML = items + items;

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const SPEED = 40; // px per second at full speed
    // One set's width, gap included (half of scrollWidth is a gap short and
    // would jump at the wrap).
    const measure = () => track.children[LOGOS.length].offsetLeft - track.children[0].offsetLeft;
    let loop = measure();
    new ResizeObserver(() => { loop = measure(); }).observe(track);
    let x = 0, v = 1, target = 1, last = performance.now();
    const marquee = track.parentElement;
    marquee.addEventListener('mouseenter', () => { target = 0; });
    marquee.addEventListener('mouseleave', () => { target = 1; });
    track.style.animation = 'none';
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      // Brake fast (stops in about a quarter second), accelerate softer.
      const rate = target < v ? 12 : 4;
      v += (target - v) * (1 - Math.exp(-rate * dt));
      x -= SPEED * v * dt;
      if (loop > 0 && -x >= loop) x += loop;
      track.style.transform = `translate3d(${x}px,0,0)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

/* Featured releases: each tile links to its case-study page. */
const feat = $('[data-featured]');
if (feat) {
  feat.innerHTML = FEATURED.map((r) => `
    <a class="tile" href="/releases/${r.slug}/" aria-label="${esc(r.artist)}, ${esc(r.title)}: case study">
      <span class="yt">
        <img src="${r.poster}" alt="${esc(r.artist)}: ${esc(r.title)}" loading="lazy" width="640" height="360" />
        <span class="yt__views">${esc(r.views)} views</span>
        <span class="yt__case">Case study →</span>
      </span>
      <span class="tile__meta">
        <span><b>${esc(r.artist)}</b><span>${esc(r.title)}</span></span>
        <span class="tile__year">${esc(/^([1-9]|10) days$/.test(r.turnaround) ? r.turnaround : r.client.split(',')[0])}</span>
      </span>
    </a>`).join('');
}

/* Custom lyric videos: open in the YouTube modal. */
const grid = $('[data-lyric-videos]');
if (grid) {
  grid.innerHTML = LYRIC_VIDEOS.map((r, i) => `
    <a class="tile${i >= LYRIC_VIDEOS_VISIBLE ? ' is-hidden' : ''}" href="https://www.youtube.com/watch?v=${r.id}" data-yt="${r.id}" aria-label="Play ${esc(r.artist)}, ${esc(r.title)}">
      <span class="yt">
        <img src="/thumbs/${r.id}.webp" alt="${esc(r.artist)}: ${esc(r.title)}" loading="lazy" width="640" height="360" />
        <span class="yt__play" aria-hidden="true"></span>
      </span>
      <span class="tile__meta">
        <span><b>${esc(r.artist)}</b><span>${esc(r.title)}</span></span>
        <span class="tile__year">${r.year}</span>
      </span>
    </a>`).join('');
  const more = $('[data-lyric-videos-more]');
  if (more) {
    if (LYRIC_VIDEOS.length <= LYRIC_VIDEOS_VISIBLE) more.hidden = true;
    more.addEventListener('click', () => {
      $$('.tile.is-hidden', grid).forEach((t) => t.classList.remove('is-hidden'));
      more.hidden = true;
    });
  }
}

/* Visuals wall: same marquee as the review wall. Each row is rendered twice so
   the -50% loop is seamless. Clips only play while the wall is on screen. */
const vwallA = $('[data-wall-a]');
const vwallB = $('[data-wall-b]');
const cap = (v) => `<figcaption><b>${esc(v.kind)}</b><span>${esc(v.who)}</span></figcaption>`;
if (vwallA) {
  const row = WALL_A.map((v) => `<figure class="vcard"><img src="${v.src}" alt="${esc(v.kind)}: ${esc(v.who)}" loading="lazy" width="640" height="360" />${cap(v)}</figure>`).join('');
  vwallA.innerHTML = row + row;
}
if (vwallB) {
  const row = WALL_B.map((v) => `<figure class="vcard vcard--tall"><video src="${v.video}"${v.poster ? ` poster="${v.poster}"` : ''} muted loop playsinline preload="none" aria-label="${esc(v.kind)}: ${esc(v.who)}"></video>${cap(v)}</figure>`).join('');
  vwallB.innerHTML = row + row;
  const vids = $$('video', vwallB);
  new IntersectionObserver(([e]) => {
    vids.forEach((v) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
  }, { rootMargin: '200px' }).observe(vwallB);
}

/* Services */
const svcs = $('[data-services]');
if (svcs) {
  svcs.innerHTML = SERVICES.map((s) => `
    <article class="svc">
      <div class="svc__visual">${s.video
        ? `<div class="phone"><video src="${s.video}" autoplay muted loop playsinline aria-label="${esc(s.name)} example"></video></div>`
        : `<img src="${s.img}" alt="${esc(s.name)} example" loading="lazy" />`}</div>
      <div class="svc__body">
        <span class="svc__price">from <b>${esc(s.from)}</b></span>
        <h4>${esc(s.name)}</h4>
        <p>${esc(s.line)}</p>
        <a href="#plan" data-service="${esc(s.name)}">Ask for this →</a>
      </div>
    </article>`).join('');
}

/* Blueprint: the "built for the screen" section on case pages. Pages carry a
   placeholder <section data-blueprint data-reel data-canvas data-loop>, filled
   here so generated and handwritten pages share one layout. Each phone flips
   between the app UI and the safe-area blueprint. Runs before the Canvas and
   Reels overlays so its phones get them too. */
$$('[data-blueprint]').forEach((sec) => {
  const { reel, canvas, loop } = sec.dataset;
  const face = sec.dataset.face ? JSON.parse(sec.dataset.face) : null;
  const thumbs = sec.dataset.thumbs ? sec.dataset.thumbs.split(',') : [];
  const stage = (src, label, zones) => `
    <div class="bp__stage" data-bp-stage>
      <span class="bp__ruler bp__ruler--x"><span>1080</span></span>
      <span class="bp__ruler bp__ruler--y"><span>1920</span></span>
      <div class="phone bp__phone">
        <video src="${src}" autoplay muted loop playsinline aria-label="${esc(label)}"></video>
        <span class="bp-ov" aria-hidden="true">${zones}<span class="bp-ov__safe"><b>Safe area</b></span></span>
      </div>
    </div>
    <div class="bp__toggle" role="group" aria-label="View">
      <button type="button" class="is-on" data-bp-mode="ui">On the phone</button>
      <button type="button" data-bp-mode="bp">Blueprint</button>
    </div>`;
  const zone = (cls, text) => `<span class="bp-ov__zone bp-ov__zone--${cls}"><i>${text}</i></span>`;
  const cards = [];
  if (reel) cards.push(`
    <article class="bpcard bpcard--reel">
      ${stage(reel, 'Vertical promo clip', zone('top', 'Header') + zone('side', 'Buttons') + zone('bottom', 'Caption'))}
      <h3>Made for Reels and TikTok</h3>
      <p>Words and faces clear the buttons and the caption. Designed vertical, not cropped.</p>
    </article>`);
  if (canvas) cards.push(`
    <article class="bpcard bpcard--canvas" style="--safe-r:6%;--safe-t:12%;--safe-b:38%">
      ${stage(canvas, 'Spotify Canvas loop', zone('top', 'Header') + zone('bottom', 'Player'))}
      <h3>Made for Spotify Canvas</h3>
      <p>Nothing hides under the player. Spotify's 9:16, 3 to 8 s<span data-bp-dur></span>.</p>
    </article>`);
  if (loop && canvas) cards.push(`
    <article class="bpcard bpcard--loop">
      <div class="loop">
        <div class="phone bp__phone" data-plain><video src="${canvas}" autoplay muted loop playsinline aria-label="Spotify Canvas loop" data-loop-video></video></div>
        <div class="loop__ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle class="loop__track" cx="60" cy="60" r="50" />
            <line class="loop__seam" x1="60" y1="4" x2="60" y2="16" />
            <text class="loop__label" x="60" y="-4" text-anchor="middle">loop point</text>
            <g data-loop-hand><circle class="loop__arc" cx="60" cy="60" r="50" pathLength="100" /><circle class="loop__dot" cx="60" cy="10" r="5" /></g>
          </svg>
          <div class="loop__count"><b data-loop-count>1</b><span data-loop-unit>loop</span></div>
        </div>
      </div>
      <div class="loop__frames">
        <figure><img src="/kit/loop/${loop}-last.webp" alt="Last frame of the loop" width="270" height="480" loading="lazy" /><figcaption>Last frame</figcaption></figure>
        <span class="loop__arrow" aria-hidden="true">→</span>
        <figure><img src="/kit/loop/${loop}-first.webp" alt="First frame of the loop" width="270" height="480" loading="lazy" /><figcaption>First frame</figcaption></figure>
      </div>
      <h3>A loop with no seam</h3>
      <p>Last frame hands back to the first. The whole song, no visible cut.</p>
    </article>`);
  // Face guide: a still from the Canvas with the face, eye line and mouth
  // marked inside the safe area. Coordinates come from releases.js.
  if (face) {
    const [l, t, w, h] = face.box;
    cards.push(`
    <article class="bpcard bpcard--face" style="--safe-r:6%;--safe-t:12%;--safe-b:38%">
      <div class="bp__stage">
        <span class="bp__ruler bp__ruler--x"><span>1080</span></span>
        <span class="bp__ruler bp__ruler--y"><span>1920</span></span>
        <div class="phone bp__phone face" data-plain>
          <img src="${face.still}" alt="Canvas frame with the face inside the safe area" loading="lazy" />
          <span class="face__zone face__zone--t" aria-hidden="true"></span>
          <span class="face__zone face__zone--b" aria-hidden="true"></span>
          <span class="face__safe" aria-hidden="true"></span>
          <span class="face__line" style="top:${face.eyes}%" aria-hidden="true"><i>Eye line</i></span>
          <span class="face__line face__line--mouth" style="top:${face.mouth}%" aria-hidden="true"><i>Mouth</i></span>
          <span class="face__box" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%" aria-hidden="true"><b>Face</b></span>
        </div>
      </div>
      <h3>Eyes and mouth stay clear</h3>
      <p>Eyes first, then the mouth. Both stay inside the safe area, above the player.</p>
    </article>`);
  }
  const small = cards.length;
  // Thumbnails at the three sizes YouTube shows them. One design at a time,
  // cycling, so the same image is compared across screens.
  if (thumbs.length) cards.push(`
    <article class="bpcard bpcard--thumbs">
      <div class="th" data-th>
        <figure class="th__tv"><div class="th__screen"><img src="${thumbs[0]}" alt="Thumbnail on a TV" loading="lazy" /></div><figcaption><b>TV</b> · full screen</figcaption></figure>
        <figure class="th__desk">
          <div class="th__list">
            <div class="th__row"><span></span><span class="th__lines"><i></i><i></i><i></i></span></div>
            <div class="th__row is-ours"><span><img src="${thumbs[0]}" alt="Thumbnail in the Up next list" loading="lazy" /></span><span class="th__lines"><i></i><i></i><i></i></span></div>
            <div class="th__row"><span></span><span class="th__lines"><i></i><i></i><i></i></span></div>
          </div>
          <figcaption><b>Desktop</b> · Up next sidebar</figcaption>
        </figure>
        <figure class="th__phone">
          <div class="th__feed"><span class="th__ghost"></span><span class="th__lines"><i></i><i></i></span><img src="${thumbs[0]}" alt="Thumbnail in the phone feed" loading="lazy" /><span class="th__lines"><i></i><i></i></span></div>
          <figcaption><b>Phone</b> · home feed</figcaption>
        </figure>
      </div>
      <div class="th__pick" role="group" aria-label="Thumbnail design">${thumbs.map((s, i) => `<button type="button"${i === 0 ? ' class="is-on"' : ''} data-th-src="${s}" aria-label="Design ${i + 1}"><img src="${s}" alt="" loading="lazy" /></button>`).join('')}</div>
      <h3>Thumbnails that still read at 168 pixels</h3>
      <p>Not a screenshot. Rebuilt from the video's own graphics around one idea, so it reads at sidebar size.</p>
    </article>`);
  if (!cards.length) { sec.remove(); return; }
  sec.innerHTML = `
    <div class="wrap">
      <div class="bp${cards.length === 1 ? ' bp--solo' : ''}">
        <div class="section-head">
          <span class="eyebrow">Built for the screen</span>
          ${thumbs.length
            ? `<h2 class="h2">Measured for every screen <em>it plays on.</em></h2>
          <p class="lede">Phone, desktop or TV: every file is designed for the screen it lands on.</p>`
            : `<h2 class="h2">Measured for the phone <em>it plays on.</em></h2>
          <p class="lede">Every vertical file is designed for the app it goes to and kept inside the area that app leaves free.</p>`}
        </div>
        <div class="bp__grid${small === 4 ? ' bp__grid--4' : ''}">${cards.join('')}</div>
      </div>
    </div>`;

  // Flip each phone between the app UI and the blueprint until someone picks one.
  $$('.bpcard', sec).forEach((card) => {
    const st = $('[data-bp-stage]', card);
    if (!st) return;
    const btns = $$('[data-bp-mode]', card);
    const set = (bp) => {
      st.classList.toggle('is-bp', bp);
      btns.forEach((b) => b.classList.toggle('is-on', (b.dataset.bpMode === 'bp') === bp));
    };
    const timer = setInterval(() => set(!st.classList.contains('is-bp')), 3200);
    btns.forEach((b) => b.addEventListener('click', () => { clearInterval(timer); set(b.dataset.bpMode === 'bp'); }));
  });
  const dur = $('[data-bp-dur]', sec);
  const cv = $('.bpcard--canvas video', sec);
  if (dur && cv) cv.addEventListener('loadedmetadata', () => { dur.textContent = `: this one is ${cv.duration.toFixed(1)} s`; });

  // Loop clock: the hand goes round once per loop and never jumps back.
  const lv = $('[data-loop-video]', sec);
  if (lv) {
    const hand = $('[data-loop-hand]', sec);
    const count = $('[data-loop-count]', sec);
    const unit = $('[data-loop-unit]', sec);
    let n = 1;
    let last = 0;
    const tick = () => {
      const t = lv.currentTime;
      if (t + 0.2 < last) { count.textContent = ++n; unit.textContent = 'loops, no cut'; }
      last = t;
      if (lv.duration) hand.style.transform = `rotate(${(t / lv.duration) * 360}deg)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
});

/* Packs in the case hero: the front phone always plays; hovering the tile
   spreads the deck and plays every clip, so the whole pack is seen moving. */
$$('.kt .pack').forEach((pack) => {
  const vids = $$('video', pack);
  const tile = pack.closest('.kt');
  tile.addEventListener('mouseenter', () => vids.forEach((v) => v.play().catch(() => {})));
  tile.addEventListener('mouseleave', () => vids.forEach((v, i) => { if (i) v.pause(); }));
});

/* Thumbnail sizes card: cycle the designs until someone picks one. */
$$('.bpcard--thumbs').forEach((card) => {
  const imgs = $$('[data-th] img', card);
  const btns = $$('[data-th-src]', card);
  let i = 0;
  const show = (n) => {
    i = n;
    imgs.forEach((im) => { im.src = btns[n].dataset.thSrc; });
    btns.forEach((b, j) => b.classList.toggle('is-on', j === n));
  };
  const timer = setInterval(() => show((i + 1) % btns.length), 3000);
  btns.forEach((b, j) => b.addEventListener('click', () => { clearInterval(timer); show(j); }));
});

/* Case study modules: play the before/after and process animations once,
   when each comes into view. */
{
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.3 });
  $$('[data-ba], [data-process], [data-look]').forEach((el) => io.observe(el));
}

/* Facts row: each figure counts up from zero the first time it is seen.
   The final text is in the HTML, so no JS and reduced motion both show it. */
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const fmtN = (n) => n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'K' : String(Math.round(n));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target;
    const end = +el.dataset.count;
    const done = el.textContent;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1300);
      const k = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? fmtN(end * k) : done;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => io.observe(el));
}

/* Process track: Standard / Rush. Rush folds the optional steps away. */
$$('[data-process]').forEach((sec) => {
  const track = $('.pt', sec);
  const btns = $$('[data-pt-mode]', sec);
  btns.forEach((b) => b.addEventListener('click', () => {
    const rush = b.dataset.ptMode === 'rush';
    track.classList.toggle('is-rush', rush);
    btns.forEach((x) => x.classList.toggle('is-on', x === b));
    $$('[data-pt-note]', sec).forEach((n) => { n.hidden = (n.dataset.ptNote === 'rush') !== rush; });
  }));
});

/* Spotify Canvas: any .phone playing a Canvas loop gets the now-playing
   overlay, so it reads as Spotify and not just a vertical clip. Runs after the
   services grid so its phones are included. */
if (SPOTIFY_CANVAS_UI) {
  const bySrc = Object.fromEntries(FEATURED.filter((r) => r.canvas).map((r) => [r.canvas, r]));
  const icon = (d) => `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${d}"/></svg>`;
  const ICONS = {
    shuffle: icon('M13.15 1.6 15.5 4l-2.35 2.4V4.7h-1.4L8.5 8l3.25 3.3h1.4V9.6L15.5 12l-2.35 2.4v-1.7h-2L7.5 9l-3.7 3.7H.5v-1.4h2.7L6.5 8 3.2 4.7H.5V3.3h3.3l3.7 3.7 3.65-3.7h2z'),
    prev: icon('M3.3 1.5v13H1.8v-13zm11 0v13L5 8z'),
    next: icon('M12.7 1.5v13h1.5v-13zm-11 0v13L11 8z'),
    repeat: icon('M4 3h8a3.5 3.5 0 0 1 0 7h-.5V8.6h.5a2.1 2.1 0 0 0 0-4.2H4v1.8L1.5 3.7 4 1.2zm8 10H4a3.5 3.5 0 0 1 0-7h.5v1.4H4a2.1 2.1 0 0 0 0 4.2h8V9.8l2.5 2.5-2.5 2.5z'),
    play: icon('M4 2.2v11.6L13.5 8z'),
  };
  $$('.phone:not([data-plain])').forEach((p) => {
    const r = p.dataset.title ? p.dataset : bySrc[$('video', p)?.getAttribute('src')];
    if (!r) return;
    p.classList.add('phone--canvas');
    p.insertAdjacentHTML('beforeend', `
      <span class="sp" aria-hidden="true">
        <span class="sp__bottom">
          <span class="sp__meta"><span class="sp__text"><b>${esc(r.title)}</b><span>${esc(r.artist)}</span></span><i class="sp__add"></i></span>
          <span class="sp__bar"><i></i></span>
          <span class="sp__time"><span>0:48</span><span>-2:14</span></span>
          <span class="sp__ctrl">${ICONS.shuffle}${ICONS.prev}<span class="sp__play">${ICONS.play}</span>${ICONS.next}${ICONS.repeat}</span>
        </span>
      </span>`);
  });
}

/* Instagram Reels: any .phone playing a clip listed in REELS gets a simplified
   Reels overlay, so a promo clip reads as a post and not just a vertical video. */
{
  const ig = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const IG = {
    heart: ig('M12 20.3s-7.6-4.6-9.4-9.3C1.4 7.8 3.6 4.3 7 4.3c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.5 4.4 6.7-1.8 4.7-9.4 9.3-9.4 9.3z'),
    comment: ig('M20.7 11.6a8.7 8.7 0 1 1-4.3-7.5 8.7 8.7 0 0 1 4.3 7.5zM20.7 20.7l-2.4-3.4'),
    send: ig('M21.5 3 2.6 10.4l7.4 3.2 3.2 7.4zM10 13.6 21.5 3'),
    camera: ig('M3 7.5h4l1.6-2.5h6.8L17 7.5h4V19H3zM12 16.3a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6z'),
  };
  $$('.phone:not([data-plain])').forEach((p) => {
    const r = REELS[$('video', p)?.getAttribute('src')];
    if (!r) return;
    p.classList.add('phone--reel');
    p.insertAdjacentHTML('beforeend', `
      <span class="ig" aria-hidden="true">
        <span class="ig__top"><b>Reels</b>${IG.camera}</span>
        <span class="ig__side">${IG.heart}${IG.comment}${IG.send}<i class="ig__dots"></i></span>
        <span class="ig__bottom">
          <span class="ig__who"><img src="${r.avatar}" alt="" /><b>${esc(r.account)}</b><i>Follow</i></span>
          <span class="ig__cap">${esc(r.caption)}</span>
          <span class="ig__audio">♫ ${esc(r.audio)}</span>
        </span>
      </span>`);
  });
}

/* Apple Motion Cover: any .phone playing a clip listed in MOTION_COVERS gets
   an Apple Music now-playing frame, with the clip as the animated artwork. */
{
  $$('.phone:not([data-plain])').forEach((p) => {
    const r = MOTION_COVERS[$('video', p)?.getAttribute('src')];
    if (!r) return;
    p.classList.add('phone--apple');
    p.insertAdjacentHTML('beforeend', `
      <span class="am" aria-hidden="true">
        <span class="am__text"><b>${esc(r.title)}</b><span>${esc(r.artist)}</span></span>
        <span class="am__bar"><i></i></span>
        <span class="am__ctrl"><svg viewBox="0 0 16 16"><path d="M3.3 1.5v13H1.8v-13zm11 0v13L5 8z"/></svg><svg viewBox="0 0 16 16"><path d="M4 2.2v11.6L13.5 8z"/></svg><svg viewBox="0 0 16 16"><path d="M12.7 1.5v13h1.5v-13zm-11 0v13L11 8z"/></svg></span>
      </span>`);
  });
}

/* YouTube watch card: wraps any [data-ytcard] frame (spotlights, case-page
   headers) in a white card with the info row YouTube shows under a video. */
const viewsById = Object.fromEntries(FEATURED.map((r) => [r.id, r.views]));
$$('[data-ytcard]').forEach((el) => {
  const id = el.dataset.ytcard;
  const v = YT_CARDS[id];
  if (!v) return;
  const views = v.views || viewsById[id];
  const card = document.createElement('div');
  card.className = 'ytcard';
  el.replaceWith(card);
  card.append(el);
  card.insertAdjacentHTML('beforeend', `
    <div class="ytcard__info">
      <img class="ytcard__avatar" src="${v.avatar}" alt="" width="40" height="40" loading="lazy" />
      <div class="ytcard__text"><b>${esc(v.title)}</b><span>${esc(v.channel)}</span></div>
      ${views ? `<div class="ytcard__views"><b>${esc(views)}</b><span>views</span></div>` : ''}
    </div>`);
});

/* Review wall */
const wallA = $('[data-reviews-a]');
const wallB = $('[data-reviews-b]');
const cards = (list) => list.map((n) => `<figure class="rcard"><img src="/reviews/${n}.webp" alt="Client message" loading="lazy" /></figure>`).join('');
if (wallA) wallA.innerHTML = cards(REVIEW_IMAGES_A) + cards(REVIEW_IMAGES_A);
if (wallB) wallB.innerHTML = cards(REVIEW_IMAGES_B) + cards(REVIEW_IMAGES_B);

const quotes = $('[data-quotes]');
if (quotes) {
  quotes.innerHTML = QUOTES.map((t) => `
    <article class="tcard">
      ${t.stars ? `<div class="stars" aria-label="${t.stars} stars">${'★'.repeat(t.stars)}</div>` : ''}
      <p>${esc(t.quote)}</p>
      <footer>
        <div><b>${esc(t.name)}</b><span>${esc(t.role)}</span></div>
        <span class="src">${t.source === 'Google review'
          ? `<a href="${GOOGLE_REVIEWS_URL}" target="_blank" rel="noopener">Verified on Google ↗</a>`
          : esc(t.source)}</span>
      </footer>
    </article>`).join('');
}
$$('[data-google-url]').forEach((a) => { a.href = GOOGLE_REVIEWS_URL; });

/* FAQ */
const faq = $('[data-faq]');
if (faq) {
  faq.innerHTML = FAQ.map((f) => `
    <details>
      <summary>${esc(f.q)}</summary>
      <div class="a">${esc(f.a)}</div>
    </details>`).join('');
}

/* YouTube modal (click any [data-yt]) */
const modal = $('[data-modal]');
if (modal) {
  const box = $('.modal__box', modal);
  const open = (id) => {
    box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.classList.remove('is-open');
    box.innerHTML = '';
    document.body.style.overflow = '';
  };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-yt]');
    if (t) { e.preventDefault(); open(t.dataset.yt); }
    if (e.target.closest('[data-modal-close]')) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* Process: sticky visual swap + a progress line that fills with the scroll. */
const steps = $$('[data-step]');
const stepsWrap = $('[data-steps]');
const fill = $('[data-steps-fill]');
const visualHost = $('[data-step-visuals]');
if (steps.length) {
  // Clone each step's visual template into the sticky frame (desktop) and
  // into the step itself (mobile), so the markup lives once in the HTML.
  steps.forEach((s, i) => {
    const tpl = $('template', s);
    if (!tpl) return;
    if (visualHost) {
      const v = document.createElement('div');
      v.className = 'pv' + (i === 0 ? ' is-active' : '');
      v.appendChild(tpl.content.cloneNode(true));
      visualHost.appendChild(v);
    }
    const m = document.createElement('div');
    m.className = 'step__mobile';
    const mv = document.createElement('div');
    mv.className = 'pv';
    mv.appendChild(tpl.content.cloneNode(true));
    m.appendChild(mv);
    s.appendChild(m);
  });
  const visuals = visualHost ? $$('.pv', visualHost) : [];
  let activeIdx = 0;
  const setActive = (i) => {
    if (i === activeIdx) return;
    activeIdx = i;
    steps.forEach((s, j) => s.classList.toggle('is-active', j === i));
    visuals.forEach((v, j) => v.classList.toggle('is-active', j === i));
  };
  steps[0].classList.add('is-active');
  const update = () => {
    if (!stepsWrap) return;
    const r = stepsWrap.getBoundingClientRect();
    const mid = window.innerHeight * 0.5;
    const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    if (fill) fill.style.height = (p * 100) + '%';
    let act = 0;
    steps.forEach((s, i) => {
      const dot = s.getBoundingClientRect().top + parseFloat(getComputedStyle(s).paddingTop) + 16;
      const passed = dot <= mid;
      s.classList.toggle('is-passed', passed);
      if (passed) act = i;
    });
    setActive(act);
  };
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

/* Outreach links: /?ref=<who> on the links in Umesh's emails and LinkedIn
   messages. Remembered for the visit so the tag survives a detour through a
   case page; the lead Function marks the task as outreach. */
const outreach = (() => {
  const p = new URLSearchParams(location.search);
  try {
    if (p.get('ref')) sessionStorage.setItem('lls_ref', JSON.stringify({ ref: p.get('ref').slice(0, 80) }));
    return JSON.parse(sessionStorage.getItem('lls_ref') || 'null');
  } catch { return null; }
})();

/* Lead form */
const formWrap = $('[data-lead]');
if (formWrap) {
  const form = $('form', formWrap);
  const err = $('.form__error', formWrap);
  const done = $('.form__done', formWrap);
  // "Ask for this" links on service cards record which service the lead came from.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-service]');
    if (a) $('input[name=service]', form).value = a.dataset.service;
  });
  // "How did you find us?": the text box only shows for "Other".
  const other = $('.picks__other', form);
  form.addEventListener('change', (e) => {
    if (e.target.name !== 'source') return;
    other.hidden = e.target.value !== 'Other';
    if (!other.hidden) other.focus();
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    payload.page = location.pathname;
    if (outreach?.ref) payload.ref = outreach.ref;
    if (payload.source === 'Other' && payload.sourceOther?.trim()) payload.source = `Other: ${payload.sourceOther.trim()}`;
    delete payload.sourceOther;
    if (!payload.name?.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email || '')) {
      err.textContent = 'Please add your name and a valid email.';
      return;
    }
    err.textContent = '';
    const btn = $('button[type=submit]', form);
    btn.disabled = true; btn.textContent = 'Sending';
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('bad status');
      // The Function only hands back a phone number for leads it rates warm or hot.
      const { contact } = await res.json().catch(() => ({}));
      const first = esc(payload.name.trim().split(' ')[0]);
      done.innerHTML = `<h3 class="h3">Thanks, ${first}.</h3><p class="muted" style="margin-top:10px">A confirmation is on its way to ${esc(payload.email.trim())}. Umesh replies within 24 hours with a plan, a delivery date and a price for your release. If the confirmation does not arrive, email <a class="link" href="mailto:contact@lyricvideo.tv">contact@lyricvideo.tv</a> and we will take it from there.</p>`
        + (contact?.phone ? `<p class="muted" style="margin-top:10px">Urgent release? Call or text <a class="link" href="tel:${esc(contact.tel)}">${esc(contact.phone)}</a>.</p>` : '');
      formWrap.classList.add('is-done');
    } catch {
      err.textContent = 'Something went wrong. Email contact@lyricvideo.tv and we will take it from there.';
      btn.disabled = false; btn.textContent = 'Send my release';
    }
  });
}

/* Quick plan popup. Every link to #plan opens the form in a popup instead of
   scrolling to the bottom. The one form is moved into the popup while it is
   open and put back afterwards, so #plan still works for people who scroll. */
const leadbox = $('[data-leadbox]');
if (leadbox && formWrap) {
  const slot = $('[data-leadbox-slot]', leadbox);
  const home = formWrap.parentNode;
  const next = formWrap.nextSibling;
  let lastFocus = null;
  const open = () => {
    lastFocus = document.activeElement;
    slot.appendChild(formWrap);
    leadbox.classList.add('is-open');
    leadbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('input[name=name]', formWrap)?.focus({ preventScroll: true }), 60);
  };
  const close = () => {
    if (!leadbox.classList.contains('is-open')) return;
    leadbox.classList.remove('is-open');
    leadbox.setAttribute('aria-hidden', 'true');
    home.insertBefore(formWrap, next);
    document.body.style.overflow = '';
    lastFocus?.focus?.({ preventScroll: true });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#plan"]');
    if (a) { e.preventDefault(); open(); return; }
    if (e.target.closest('[data-leadbox-close]')) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* Back to top: shows once the hero is out of view. */
const totop = $('[data-totop]');
if (totop) {
  const toggle = () => totop.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.9);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* Current year in footer */
$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
