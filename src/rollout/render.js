// The Rollout stage: builds the DOM for one project and applies timeline cues
// to it. No timers here except the 400 ms "pressed" release.
import '../rollout.css';
import { esc, spotifyOverlay, reelsOverlay, appleOverlay } from '../overlays.js';

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

function boards(list, pick) {
  const n = list.length;
  return `<div class="rl-boards" style="--n:${n}">${list.map((b, i) => `
    <div class="rl-board" data-i="${i}" style="--i:${i}">
      ${lazy(b.img)}
      ${b.label ? `<span class="rl-board__nm">${esc(b.label)}</span>` : ''}
      <span class="rl-chk" aria-hidden="true">✓</span>
      <span class="rl-board__pal">${(b.palette || []).map((c) => `<i style="background:${esc(c)}"></i>`).join('')}</span>
      ${pick === undefined && i === n - 1 ? '<span class="rl-ok">Approve</span>' : ''}
    </div>`).join('')}
  </div>`;
}

function preview(p) {
  const ch = p.change || { weight: ['500', '800'], swatch: ['#888', '#888'] };
  return `<div class="rl-preview">
    <div class="rl-preview__col">
      <div class="rl-preview__scr">
        <video muted playsinline preload="none" data-src="${p.preview.video}" data-poster="${p.preview.poster}"></video>
        ${lazy(p.preview.poster, 'rl-preview__poster')}
        <span class="rl-preview__lb">30-second preview</span>
        <span class="rl-preview__v2">v2</span>
        <span class="rl-pin"></span>
      </div>
      <div class="rl-preview__ctl"><span class="rl-tc">0:12 / 0:30</span><span class="rl-tr"><i style="width:40%"></i></span></div>
    </div>
    <div class="rl-preview__side">
      <div class="rl-note"><b class="rl-note__who">Label / Client</b><span class="rl-note__txt" data-note="${esc(p.note || '')}"></span><span class="rl-note__send">Send</span></div>
      <div class="rl-rev"><span class="rl-rev__w"><em style="font-weight:${esc(ch.weight[0])}">Aa</em><s>→</s><em style="font-weight:${esc(ch.weight[1])}">Aa</em></span><span class="rl-rev__s"><i style="background:${esc(ch.swatch[0])}"></i><s>→</s><i style="background:${esc(ch.swatch[1])}"></i></span></div>
      <span class="rl-ok">Approve</span>
    </div>
  </div>`;
}

function kit(p) {
  const t = p.tiles;
  let ti = 0;
  const tile = (cls, inner) => `<div class="rl-tile ${cls}" data-t="${ti++}">${inner}</div>`;
  const ytc = tile('rl-ytc', `
      <div class="rl-ytc__th">${lazy(p.thumb)}${badge('youtube')}</div>
      <div class="rl-ytc__meta">${p.avatar ? lazy(p.avatar, 'rl-ytc__av') : ''}<span><b>${esc(p.ytTitle)}</b><em>${esc(p.channel)}</em></span></div>`);
  const reelsHtml = t.reels.map((r, i) => tile(`rl-phone phone--reel rl-phone--${i}`, `${lazy(r.poster)}${reelsOverlay(t.reel)}${badge(r.badge)}`)).join('');
  const vertHtml = t.verticals.map((v, i) => v.kind === 'motion'
    ? tile(`rl-phone phone--apple rl-phone--${i}`, `${lazy(v.poster, 'rl-phone__art')}${appleOverlay({ title: p.title, artist: p.artist })}${badge(v.badge)}`)
    : tile(`rl-phone phone--canvas rl-phone--${i}`, `${lazy(v.poster)}${spotifyOverlay({ title: p.title, artist: p.artist })}${badge(v.badge)}`)).join('');
  const thumbsHtml = t.thumbs.length ? tile('rl-thumbs', t.thumbs.map((s, i) => lazy(s, `rl-thumbs__i rl-thumbs__i--${i}`)).join('') + badge('youtube')) : '';
  const bnrHtml = t.banner ? tile('rl-bnr', `${lazy(t.banner)}${badge('youtube')}`) : '';
  const motion = t.verticals.some((v) => v.kind === 'motion');
  return `<div class="rl-kit">
    ${ytc}
    <div class="rl-stack rl-stack--reels">${reelsHtml}</div>
    ${t.reels.length ? `<span class="rl-lbl rl-lbl--reels">Promo clips · ${t.counts.clips}</span>` : ''}
    <div class="rl-stack rl-stack--vert">${vertHtml}</div>
    ${t.verticals.length ? `<span class="rl-lbl rl-lbl--vert">${t.counts.canvases ? `Canvas · ${t.counts.canvases}` : ''}${t.counts.canvases && motion ? ' · ' : ''}${motion ? 'Motion cover' : ''}</span>` : ''}
    ${thumbsHtml}
    ${t.thumbs.length ? `<span class="rl-lbl rl-lbl--thumbs">Thumbnails · ${t.counts.thumbs}</span>` : ''}
    ${bnrHtml}
    <span class="rl-ok">Approve</span>
  </div>`;
}

export function renderProject(p) {
  const el = document.createElement('div');
  el.className = 'rl';
  el.dataset.slug = p.slug;
  el.dataset.beat = '';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    ${notification(p.notification)}
    ${boards(p.boards, p.pick)}
    ${preview(p)}
    ${kit(p)}
    <div class="rl-cur rl-cur--studio">${CURSOR}<span class="rl-cur__tag">Studio</span></div>
    <div class="rl-cur rl-cur--client">${CURSOR}<span class="rl-cur__tag">Label / Client</span></div>`;
  return el;
}

const TARGETS = { ntf: '.rl-ntf', boards: '.rl-boards', preview: '.rl-preview', kit: '.rl-kit' };
const STATE_CLASSES = ['is-in', 'is-on', 'is-hover', 'is-picked', 'is-gone', 'is-open', 'is-sent', 'is-v2', 'is-approved', 'is-pressed'];

function moveCursor(stage, who, anchorSel, show) {
  const cur = stage.querySelector(`.rl-cur--${who}`);
  if (!cur) return;
  const anchor = stage.querySelector(anchorSel);
  if (anchor) {
    const s = stage.getBoundingClientRect(), a = anchor.getBoundingClientRect();
    const x = ((a.left - s.left + a.width * 0.58) / s.width) * 100;
    const y = ((a.top - s.top + a.height * 0.6) / s.height) * 100;
    cur.style.setProperty('--x', `${x.toFixed(2)}%`);
    cur.style.setProperty('--y', `${y.toFixed(2)}%`);
  }
  cur.classList.toggle('is-on', !!show);
}

export function applyCue(stage, cue) {
  const q = (s) => stage.querySelector(s);
  const qa = (s) => Array.from(stage.querySelectorAll(s));
  switch (cue.type) {
    case 'beat': stage.dataset.beat = cue.name; break;
    case 'show': q(TARGETS[cue.target])?.classList.add('is-in'); break;
    case 'hide': q(TARGETS[cue.target])?.classList.remove('is-in'); break;
    case 'cursor': moveCursor(stage, cue.who, cue.anchor, cue.show); break;
    case 'press': {
      const el = q(cue.anchor);
      if (!el) break;
      el.classList.add('is-pressed');
      setTimeout(() => el.classList.remove('is-pressed'), 400);
      break;
    }
    case 'hover': qa('.rl-board').forEach((b) => b.classList.toggle('is-hover', +b.dataset.i === cue.i)); break;
    case 'pick': qa('.rl-board').forEach((b) => { const me = +b.dataset.i === cue.i; b.classList.toggle('is-picked', me); b.classList.toggle('is-gone', !me); b.classList.remove('is-hover'); }); break;
    case 'note': {
      const txt = q('.rl-note__txt');
      if (!txt) break;
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
    case 'approve': {
      const ok = q(cue.beat === 'preview' ? '.rl-preview .rl-ok' : '.rl-kit .rl-ok');
      if (!ok) break;
      ok.classList.add('is-pressed');
      setTimeout(() => ok.classList.replace('is-pressed', 'is-approved'), 400);
      break;
    }
    case 'video': {
      const v = q('.rl-preview video');
      if (!v || stage.dataset.nomp4 === '1') break;
      if (cue.action === 'play') {
        if (!v.getAttribute('src')) v.src = v.dataset.src;
        const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
        stage.classList.add('is-playing');
      } else { v.pause(); stage.classList.remove('is-playing'); }
      break;
    }
    case 'tile': q(`.rl-tile[data-t="${cue.i}"]`)?.classList.add('is-in'); break;
    case 'end': {
      stage.dataset.beat = '';
      stage.classList.remove('is-v2', 'is-playing');
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
