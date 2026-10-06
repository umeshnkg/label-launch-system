import './styles.css';
import {
  FEATURED, LYRIC_VIDEOS, LYRIC_VIDEOS_VISIBLE, LOGOS, SERVICES,
  REVIEW_IMAGES_A, REVIEW_IMAGES_B, QUOTES, GOOGLE_REVIEWS_URL, FAQ,
} from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Logo marquee: content is doubled so the loop is seamless. */
const track = $('[data-marquee]');
if (track) {
  const items = LOGOS.map((l) => l.img
    ? `<span class="logo"><img src="${l.img}" alt="${esc(l.text)}" loading="lazy" style="height:${l.h || 30}px" /></span>`
    : `<span class="logo">${esc(l.text)}</span>`).join('');
  track.innerHTML = items + items;
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
        <span class="tile__year">${esc(r.turnaround)}</span>
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
        ${r.views ? `<span class="yt__views">${esc(r.views)} views</span>` : ''}
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

/* Lead form */
const formWrap = $('[data-lead]');
if (formWrap) {
  const form = $('form', formWrap);
  const err = $('.form__error', formWrap);
  const done = $('.form__done', formWrap);
  // "Ask for this" links on service cards preselect the interest field.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-service]');
    if (!a) return;
    const sel = $('select[name=service]', form);
    if (sel) {
      const opt = Array.from(sel.options).find((o) => o.value === a.dataset.service);
      if (opt) sel.value = opt.value;
    }
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    payload.page = location.pathname;
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
      const low = payload.budget === 'Under $1,000';
      const first = esc(payload.name.trim().split(' ')[0]);
      done.innerHTML = low
        ? `<h3 class="h3">Thanks, ${first}.</h3><p class="muted" style="margin-top:10px">For budgets under $1,000 the better fit is Make Lyric Video, our designed lyric video packages from $199. <a class="link" href="https://www.makelyricvideo.com/pro">See the Pro packages</a>. We have your note too and will reply if a kit makes sense.</p>`
        : `<h3 class="h3">Thanks, ${first}.</h3><p class="muted" style="margin-top:10px">We reply within 24 hours with a plan and a price for your release window. Check your inbox for a note from us.</p>`;
      formWrap.classList.add('is-done');
    } catch {
      err.textContent = 'Something went wrong. Email contact@lyricvideo.tv and we will take it from there.';
      btn.disabled = false; btn.textContent = 'Send my release';
    }
  });
}

/* Current year in footer */
$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
