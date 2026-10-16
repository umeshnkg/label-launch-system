// Platform overlays drawn over a phone mockup: Spotify now-playing (Canvas),
// Instagram Reels (promo clips) and Apple Music now-playing (Motion Cover).
// Pure string builders; main.js wraps .phone elements with them on the case
// pages and the homepage, and the Rollout hero draws them over posters.

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const icon = (d) => `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${d}"/></svg>`;
const SP = {
  shuffle: icon('M13.15 1.6 15.5 4l-2.35 2.4V4.7h-1.4L8.5 8l3.25 3.3h1.4V9.6L15.5 12l-2.35 2.4v-1.7h-2L7.5 9l-3.7 3.7H.5v-1.4h2.7L6.5 8 3.2 4.7H.5V3.3h3.3l3.7 3.7 3.65-3.7h2z'),
  prev: icon('M3.3 1.5v13H1.8v-13zm11 0v13L5 8z'),
  next: icon('M12.7 1.5v13h1.5v-13zm-11 0v13L11 8z'),
  repeat: icon('M4 3h8a3.5 3.5 0 0 1 0 7h-.5V8.6h.5a2.1 2.1 0 0 0 0-4.2H4v1.8L1.5 3.7 4 1.2zm8 10H4a3.5 3.5 0 0 1 0-7h.5v1.4H4a2.1 2.1 0 0 0 0 4.2h8V9.8l2.5 2.5-2.5 2.5z'),
  play: icon('M4 2.2v11.6L13.5 8z'),
};

export const spotifyOverlay = (r) => `
      <span class="sp" aria-hidden="true">
        <span class="sp__bottom">
          <span class="sp__meta"><span class="sp__text"><b>${esc(r.title)}</b><span>${esc(r.artist)}</span></span><i class="sp__add"></i></span>
          <span class="sp__bar"><i></i></span>
          <span class="sp__time"><span>0:48</span><span>-2:14</span></span>
          <span class="sp__ctrl">${SP.shuffle}${SP.prev}<span class="sp__play">${SP.play}</span>${SP.next}${SP.repeat}</span>
        </span>
      </span>`;

const ig = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
const IG = {
  heart: ig('M12 20.3s-7.6-4.6-9.4-9.3C1.4 7.8 3.6 4.3 7 4.3c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.5 4.4 6.7-1.8 4.7-9.4 9.3-9.4 9.3z'),
  comment: ig('M20.7 11.6a8.7 8.7 0 1 1-4.3-7.5 8.7 8.7 0 0 1 4.3 7.5zM20.7 20.7l-2.4-3.4'),
  send: ig('M21.5 3 2.6 10.4l7.4 3.2 3.2 7.4zM10 13.6 21.5 3'),
  camera: ig('M3 7.5h4l1.6-2.5h6.8L17 7.5h4V19H3zM12 16.3a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6z'),
};

export const reelsOverlay = (r) => `
      <span class="ig" aria-hidden="true">
        <span class="ig__top"><b>Reels</b>${IG.camera}</span>
        <span class="ig__side">${IG.heart}${IG.comment}${IG.send}<i class="ig__dots"></i></span>
        <span class="ig__bottom">
          <span class="ig__who"><img src="${r.avatar}" alt="" /><b>${esc(r.account)}</b><i>Follow</i></span>
          <span class="ig__cap">${esc(r.caption)}</span>
          <span class="ig__audio">♫ ${esc(r.audio)}</span>
        </span>
      </span>`;

export const appleOverlay = (r) => `
      <span class="am" aria-hidden="true">
        <span class="am__text"><b>${esc(r.title)}</b><span>${esc(r.artist)}</span></span>
        <span class="am__bar"><i></i></span>
        <span class="am__ctrl"><svg viewBox="0 0 16 16"><path d="M3.3 1.5v13H1.8v-13zm11 0v13L5 8z"/></svg><svg viewBox="0 0 16 16"><path d="M4 2.2v11.6L13.5 8z"/></svg><svg viewBox="0 0 16 16"><path d="M12.7 1.5v13h1.5v-13zm-11 0v13L11 8z"/></svg></span>
      </span>`;
