// The Rollout stage: builds the DOM for one project and applies timeline cues
// to it. No timers here except the 400 ms "pressed" release.
import '../rollout.css';
import { esc, spotifyOverlay, reelsOverlay, appleOverlay } from '../overlays.js';
import { BEATS } from './timeline.js';

const CURSOR = '<svg viewBox="0 0 14 18" aria-hidden="true"><path d="M1 1 L1 15 L4.6 11.6 L7.4 17 L9.6 16 L6.9 10.6 L12 10.6 Z"/></svg>';
const BADGES = {
  youtube: '<svg viewBox="0 0 12 12"><path d="M3.5 2.5 9.5 6 3.5 9.5Z" fill="#fff"/></svg>',
  spotify: '<svg viewBox="0 0 12 12"><path d="M2.6 4.3c2.6-.8 5.3-.5 7.3.9M3 6.3c2.1-.6 4.3-.4 6 .7M3.4 8.2c1.6-.5 3.3-.3 4.6.5" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round"/></svg>',
  instagram: '<svg viewBox="0 0 12 12"><rect x="1.5" y="1.5" width="9" height="9" rx="2.6" stroke="#fff" stroke-width="1.1" fill="none"/><circle cx="6" cy="6" r="2.1" stroke="#fff" stroke-width="1.1" fill="none"/><circle cx="8.8" cy="3.3" r=".7" fill="#fff"/></svg>',
  tiktok: '<svg viewBox="0 0 12 12"><path d="M6.6 1.5v6.2a1.7 1.7 0 1 1-1.7-1.7" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M6.6 1.5c.2 1.4 1.1 2.3 2.6 2.5" stroke="#25f4ee" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>',
  apple: '<svg viewBox="0 0 12 12"><path d="M4.4 9.2V3.6l4.6-1v5.6" stroke="#fff" stroke-width="1.1" fill="none" stroke-linejoin="round"/><circle cx="3.3" cy="9.2" r="1.2" fill="#fff"/><circle cx="7.9" cy="8.2" r="1.2" fill="#fff"/></svg>',
};

/* A platform tag pinned on the bottom-right edge of a piece (CSS places it). */
export const badge = (kind) => `<span class="rl-bg rl-bg--${kind}" aria-hidden="true">${BADGES[kind] || ''}</span>`;

const DOWNLOAD = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.6v6.2M3.3 5.2 6 7.9l2.7-2.7M2.2 10.4h7.6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CONFETTI_FALLBACK = ['#e11d2a', '#0b0b0c', '#16a34a', '#f5b800', '#3b82f6'];

// The four-step strip along the bottom of the stage. Each segment fills while
// its beat plays, so a visitor reads the process without any other copy.
const STEPS = [
  ['notification', 'Send us your song'],
  ['directions', 'Get visual directions'],
  ['preview', '30-sec preview'],
  ['delivered', 'Final delivery'],
];
const STEP_ORDER = STEPS.map(([b]) => b);
function steps() {
  return `<div class="rl-steps">${STEPS.map(([beat, label]) => `
    <div class="rl-step" data-step="${beat}" style="--d:${BEATS[beat][1] - BEATS[beat][0]}ms"><span class="rl-step__bar"><i></i></span><span class="rl-step__t">${label}</span></div>`).join('')}
  </div>`;
}

const WAVE = '<span class="rl-ntf__wave">' + [4, 10, 7, 14, 5, 9, 4].map((h) => `<b style="--h:${h}"></b>`).join('') + '</span>';
// Beat 1's images load with the page. Everything later carries data-src and is
// hydrated by the mount after the page's load event, so the stage never
// competes with the hero's own paint on a slow connection.
const img = (src, cls = '') => `<img src="${src}" alt="" ${cls ? `class="${cls}"` : ''} loading="eager" decoding="async" />`;
const lazy = (src, cls = '') => `<img data-src="${src}" alt="" ${cls ? `class="${cls}"` : ''} decoding="async" fetchpriority="low" />`;

/* Give every deferred image (and the preview's poster) its real source. */
export function hydrate(stage) {
  stage.querySelectorAll('img[data-src]').forEach((i) => { i.src = i.dataset.src; i.removeAttribute('data-src'); });
  const v = stage.querySelector('video[data-poster]');
  if (v) { v.poster = v.dataset.poster; v.removeAttribute('data-poster'); }
}

function notification(n) {
  const icon = n.icon || { kind: 'song', images: [], count: null };
  const extra = icon.kind === 'cover' && icon.images[0] ? img(icon.images[0], 'rl-ntf__cover')
    : icon.kind === 'stack' ? icon.images.map((s, i) => img(s, `rl-ntf__photo rl-ntf__photo--${i}`)).join('') + (icon.count ? `<span class="rl-ntf__count">${icon.count}</span>` : '')
    : '';
  const chips = n.chips.map((c, i) => `<i${i === n.chips.length - 1 ? ' class="is-hot"' : ''}>${esc(c)}</i>`).join('');
  return `<div class="rl-ntf">
    <span class="rl-ntf__ico" data-kind="${icon.kind}">${WAVE}${extra}</span>
    <span class="rl-ntf__txt">
      <span class="rl-ntf__l1">${esc(n.heading)}<span>now</span></span>
      <span class="rl-ntf__l2">${esc(n.line2)}</span>
      <span class="rl-ntf__l3">${chips}</span>
    </span>
  </div>`;
}

// When the client approves the whole set (no single pick), one Approve sits
// centred under the row of boards rather than on the last board.
function boards(list, pick) {
  const n = list.length;
  return `<div class="rl-boards" style="--n:${n}"><div class="rl-boards__row">${list.map((b, i) => `
    <div class="rl-board" data-i="${i}" style="--i:${i}">
      ${lazy(b.img)}
      ${b.label ? `<span class="rl-board__nm">${esc(b.label)}</span>` : ''}
      ${b.from ? `<span class="rl-board__from">${lazy(b.from)}<svg viewBox="0 0 24 14" aria-hidden="true"><path d="M2 7h17M14 2l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>` : ''}
      <span class="rl-chk" aria-hidden="true">✓</span>
      <span class="rl-board__pal">${(b.palette || []).map((c) => `<i style="background:${esc(c)}"></i>`).join('')}</span>
    </div>`).join('')}
    </div>
    ${pick === undefined ? '<span class="rl-ok">Approve</span>' : ''}
  </div>`;
}

// The preview sits centred. The client clicks the frame and the comment box
// pops up over the video, just above and right of the pin.
function preview(p) {
  return `<div class="rl-preview">
    <div class="rl-preview__col">
      <div class="rl-preview__scr">
        <div class="rl-preview__media">
          <video muted playsinline loop preload="none" data-src="${p.preview.video}" data-poster="${p.preview.poster}"></video>
          ${lazy(p.preview.poster, 'rl-preview__poster')}
        </div>
        <span class="rl-preview__lb">30-second preview</span>
        <span class="rl-preview__v2">v2</span>
        <span class="rl-pin"></span>
        <div class="rl-note"><b class="rl-note__who">Label / Client</b><span class="rl-note__txt" data-note="${esc(p.note || '')}"></span><span class="rl-note__send">Send</span></div>
      </div>
      <div class="rl-preview__ctl"><span class="rl-tc">0:12 / 0:30</span><span class="rl-tr"><i style="width:40%"></i></span></div>
    </div>
  </div>`;
}

function kit(p) {
  const t = p.tiles;
  let ti = 0;
  const tile = (cls, inner) => `<div class="rl-tile ${cls}" data-t="${ti++}">${inner}</div>`;
  const master = p.cardKind === 'master';
  const ytc = tile(`rl-ytc${master ? ' rl-ytc--master' : ''}`, `
      <div class="rl-ytc__th">${lazy(p.thumb)}${master ? '' : badge('youtube')}</div>
      <div class="rl-ytc__meta">${!master && p.avatar ? lazy(p.avatar, 'rl-ytc__av') : ''}<span><b>${esc(p.ytTitle)}</b><em>${master ? 'Lyric video, master delivered' : esc(p.channel)}</em></span></div>`);
  const reelsHtml = t.reels.map((r, i) => tile(`rl-phone phone--reel rl-phone--${i}`, `${lazy(r.poster)}${reelsOverlay(t.reel)}${badge(r.badge)}`)).join('');
  const vertHtml = t.verticals.map((v, i) => v.kind === 'motion'
    ? tile(`rl-phone phone--apple rl-phone--${i}`, `${lazy(v.poster, 'rl-phone__art')}${appleOverlay({ title: p.title, artist: p.artist })}${badge(v.badge)}`)
    : tile(`rl-phone phone--canvas rl-phone--${i}`, `${lazy(v.poster)}${spotifyOverlay({ title: p.title, artist: p.artist })}${badge(v.badge)}`)).join('');
  const thumbsHtml = t.thumbs.length ? tile('rl-thumbs', t.thumbs.map((s, i) => lazy(s, `rl-thumbs__i rl-thumbs__i--${i}`)).join('') + badge('youtube')) : '';
  const bnrHtml = t.banner ? tile('rl-bnr', `${lazy(t.banner)}${badge('youtube')}`) : '';
  // Centred composition, no captions: the pieces explain themselves.
  // Promo clips left, the YouTube card in the middle with thumbnails and
  // banner under it, Canvas / Motion cover right, Download below.
  return `<div class="rl-kit">
    <div class="rl-kit__row">
      <div class="rl-stack rl-stack--reels">${reelsHtml}</div>
      <div class="rl-kit__mid">${ytc}${thumbsHtml || bnrHtml ? `<div class="rl-kit__sub">${thumbsHtml}${bnrHtml}</div>` : ''}</div>
      <div class="rl-stack rl-stack--vert">${vertHtml}</div>
    </div>
    <span class="rl-ok">${DOWNLOAD}Download</span>
  </div>`;
}

export function renderProject(p) {
  const el = document.createElement('div');
  el.className = 'rl';
  el.dataset.slug = p.slug;
  el.dataset.beat = '';
  // The confetti on Download uses the chosen direction's palette.
  const chosen = (p.boards || [])[p.pick ?? (p.boards || []).length - 1];
  el.dataset.palette = (chosen?.palette || []).join(',');
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    ${notification(p.notification)}
    ${boards(p.boards, p.pick)}
    ${preview(p)}
    ${kit(p)}
    ${steps()}
    <div class="rl-cur rl-cur--studio">${CURSOR}<span class="rl-cur__tag">Studio</span></div>
    <div class="rl-cur rl-cur--client">${CURSOR}<span class="rl-cur__tag">Label / Client</span></div>`;
  return el;
}

const TARGETS = { ntf: '.rl-ntf', boards: '.rl-boards', preview: '.rl-preview', kit: '.rl-kit' };
const STATE_CLASSES = ['is-in', 'is-on', 'is-done', 'is-hover', 'is-picked', 'is-gone', 'is-open', 'is-sent', 'is-v2', 'is-approved', 'is-pressed'];

// fx/fy: where on the anchor the cursor tip lands (fractions of its box).
function moveCursor(stage, who, anchorSel, show, fx = 0.58, fy = 0.6) {
  const cur = stage.querySelector(`.rl-cur--${who}`);
  if (!cur) return;
  const anchor = stage.querySelector(anchorSel);
  if (anchor) {
    const s = stage.getBoundingClientRect(), a = anchor.getBoundingClientRect();
    const x = ((a.left - s.left + a.width * fx) / s.width) * 100;
    const y = ((a.top - s.top + a.height * fy) / s.height) * 100;
    cur.style.setProperty('--x', `${x.toFixed(2)}%`);
    cur.style.setProperty('--y', `${y.toFixed(2)}%`);
  }
  cur.classList.toggle('is-on', !!show);
}

/* Download confetti: pieces launch up from across the button, slow at the
   top, then fall and flutter out, in the release's palette. */
function confetti(stage, from) {
  if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = stage.getBoundingClientRect(), a = from.getBoundingClientRect();
  if (!s.width) return;
  // Near-white palette colours vanish on the white stage, so they're left out.
  const light = (c) => { const m = /^#?([0-9a-f]{6})$/i.exec(c.trim()); if (!m) return false; const n = parseInt(m[1], 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 225; };
  const pal = (stage.dataset.palette || '').split(',').filter((c) => c && !light(c));
  const colors = pal.length >= 3 ? [...pal, '#e11d2a'] : CONFETTI_FALLBACK;
  const box = document.createElement('div');
  box.className = 'rl-confetti';
  box.style.left = `${(((a.left - s.left) / s.width) * 100).toFixed(2)}%`;
  box.style.top = `${(((a.top - s.top + a.height * 0.4) / s.height) * 100).toFixed(2)}%`;
  box.style.width = `${((a.width / s.width) * 100).toFixed(2)}%`;
  const rnd = (lo, hi) => lo + Math.random() * (hi - lo);
  let html = '';
  for (let i = 0; i < 120; i++) {
    const x0 = rnd(5, 95);                          // % across the button
    const dx = (x0 - 50) * 0.8 + rnd(-24, 24);      // cqw, fans wide across the stage
    const up = -rnd(16, 40);                        // cqw, launch height
    const fall = rnd(22, 38);                       // cqw, fall past the start
    const round = Math.random() < 0.3;
    const w = round ? rnd(0.6, 0.9) : rnd(0.7, 1.2);
    html += `<i class="${round ? 'is-dot' : ''}" style="left:${x0.toFixed(1)}%;--dx:${dx.toFixed(1)}cqw;--up:${up.toFixed(1)}cqw;--fall:${fall.toFixed(1)}cqw;--r:${Math.round(rnd(-540, 540))}deg;--c:${colors[i % colors.length]};--w:${w.toFixed(2)}cqw;--t:${Math.round(rnd(1500, 2300))}ms;--dl:${Math.round(rnd(0, 120))}ms"></i>`;
  }
  box.innerHTML = html;
  stage.append(box);
  setTimeout(() => box.remove(), 2700);
}

export function applyCue(stage, cue) {
  const q = (s) => stage.querySelector(s);
  const qa = (s) => Array.from(stage.querySelectorAll(s));
  switch (cue.type) {
    case 'beat': {
      stage.dataset.beat = cue.name;
      // Earlier steps full, this one filling; on 'clear' every step is full.
      const k = STEP_ORDER.indexOf(cue.name);
      qa('.rl-step').forEach((s, i) => {
        s.classList.toggle('is-done', k === -1 ? cue.name === 'clear' : i < k);
        s.classList.toggle('is-on', i === k);
      });
      break;
    }
    case 'show': q(TARGETS[cue.target])?.classList.add('is-in'); break;
    case 'hide': q(TARGETS[cue.target])?.classList.remove('is-in'); break;
    case 'cursor': moveCursor(stage, cue.who, cue.anchor, cue.show, cue.fx, cue.fy); break;
    case 'press': {
      const el = q(cue.anchor);
      if (!el) break;
      el.classList.add('is-pressed');
      setTimeout(() => el.classList.remove('is-pressed'), 400);
      break;
    }
    case 'chip': qa('.rl-ntf__l3 i').forEach((c, j) => c.classList.toggle('is-hover', j === cue.i)); break;
    case 'hover': qa('.rl-board').forEach((b) => b.classList.toggle('is-hover', +b.dataset.i === cue.i)); break;
    case 'pick': qa('.rl-board').forEach((b) => { const me = +b.dataset.i === cue.i; b.classList.toggle('is-picked', me); b.classList.toggle('is-gone', !me); b.classList.remove('is-hover'); }); break;
    case 'note': {
      const txt = q('.rl-note__txt');
      if (!txt) break;
      stage.classList.add('is-noted');
      q('.rl-note')?.classList.add('is-open');
      txt.textContent = (txt.dataset.note || '').slice(0, cue.chars);
      break;
    }
    case 'tc': {
      const sec = 12 + cue.k;
      const tc = q('.rl-tc'); if (tc) tc.textContent = `0:${String(sec).padStart(2, '0')} / 0:30`;
      const bar = q('.rl-tr i'); if (bar) bar.style.width = `${((sec / 30) * 100).toFixed(1)}%`;
      break;
    }
    case 'send': q('.rl-note')?.classList.add('is-sent'); break;
    case 'v2': stage.classList.add('is-v2'); break;
    case 'download': {
      const ok = q('.rl-kit .rl-ok');
      if (!ok) break;
      ok.classList.add('is-pressed');
      confetti(stage, ok);
      setTimeout(() => ok.classList.replace('is-pressed', 'is-approved'), 400);
      break;
    }
    case 'video': {
      const v = q('.rl-preview video');
      if (!v || stage.dataset.nomp4 === '1') break;
      if (cue.action === 'play') {
        if (!v.getAttribute('src')) v.src = v.dataset.src;
        // The poster stays on top until the clip is actually running.
        v.addEventListener('playing', () => stage.classList.add('is-playing'), { once: true });
        const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
      } else { v.pause(); stage.classList.remove('is-playing'); }
      break;
    }
    case 'tile': q(`.rl-tile[data-t="${cue.i}"]`)?.classList.add('is-in'); break;
    case 'end': {
      stage.dataset.beat = '';
      stage.classList.remove('is-v2', 'is-playing', 'is-noted');
      stage.querySelectorAll('.rl-confetti').forEach((c) => c.remove());
      qa('.' + STATE_CLASSES.join(', .')).forEach((el) => el.classList.remove(...STATE_CLASSES));
      const txt = q('.rl-note__txt'); if (txt) txt.textContent = '';
      const tc = q('.rl-tc'); if (tc) tc.textContent = '0:12 / 0:30';
      const bar = q('.rl-tr i'); if (bar) bar.style.width = '40%';
      const v = q('.rl-preview video'); if (v) { v.pause(); try { v.currentTime = 0; } catch { /* not loaded */ } }
      break;
    }
    default: break;
  }
}
