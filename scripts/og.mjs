// Renders the social share cards (Open Graph / X / LinkedIn / WhatsApp previews)
// to public/og/*.jpg at 1200x630 with headless Edge.
// Usage: node scripts/og.mjs            -> homepage card + one card per case study
//        node scripts/og.mjs --concepts -> also writes every homepage concept (og/concept-*.jpg)
// The homepage card is the concept named in HOME. Re-run after changing releases.js.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { FEATURED } from '../src/releases.js';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const out = path.join(pub, 'og');
fs.mkdirSync(out, { recursive: true });

// Which concept is the live homepage card.
const HOME = 'wall';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Logo file -> height in px, tuned so they read at the same visual weight.
const LOGOS = [['sony-music.png', 44], ['four-music.png', 32], ['warner-records.png', 28], ['spinnin-records.png', 36], ['jinx-music.png', 22], ['madnesstic.svg', 30]];
const logoImgs = (n = LOGOS.length) => LOGOS.slice(0, n).map(([f, h]) => `<img src="logos/${f}" style="height:${h}px">`).join('');
const WALL = [
  'kit/erinner-mich-thumb.webp', 'thumbs/C7N_52T1Hm8.webp', 'kit/blau-thumb-red.webp',
  'thumbs/IrJFtY_qtxE.webp', 'kit/paradise-thumb-2.webp', 'thumbs/PLmlJR7hXsg.webp',
  'thumbs/I5Rfl6UbPzw.webp', 'thumbs/E9GSXYo80Sc.webp', 'kit/rockitout-thumb-11.webp',
  'thumbs/ev7003CXmAE.webp', 'thumbs/gm5fhMlQu-c.webp', 'kit/biodad-cover.webp',
];

const BASE = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; position: relative; }
  .brand { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 22px; letter-spacing: -0.01em; }
  .mark { width: 30px; height: 30px; border-radius: 8px; background: #0b0b0c; position: relative; flex: none; }
  .mark::after { content: ''; position: absolute; width: 9px; height: 9px; border-radius: 50%; background: #e5261f; top: 5px; right: 5px; }
  .dark .mark { background: #fff; }
  em { font-style: normal; color: #e5261f; }
  .url { font-size: 20px; font-weight: 600; opacity: .7; }
  .logos { display: flex; align-items: center; gap: 30px; }
  .logos img { width: auto; opacity: .9; }
  .light .logos img { filter: invert(1); opacity: .7; }
`;

const page = (body, css, theme = 'dark') => `<!doctype html><html><head><meta charset="utf-8">
<base href="${pathToFileURL(pub).href}/">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${BASE}${css}</style></head><body class="${theme}">${body}</body></html>`;

const CONCEPTS = {
  // A. Wall of real work on the right, the promise on the left. Dark.
  wall: () => page(`
    <div class="glow"></div>
    <div class="left">
      <div class="brand"><span class="mark"></span>Label Launch System</div>
      <h1>Every visual your release needs.<br><em>Delivered in 10&nbsp;days.</em></h1>
      <p>Cover art, lyric video, Canvas, Reels and thumbnails. One look across every format.</p>
      <div class="foot"><span class="url">labellaunchsystem.com</span></div>
    </div>
    <div class="wall">${[0, 1, 2].map((c) => `<div class="col c${c}">${WALL.filter((_, i) => i % 3 === c).concat(WALL.filter((_, i) => i % 3 === c)).map((s) => `<img src="${s}">`).join('')}</div>`).join('')}</div>
  `, `
    body { background: #0b0b0c; color: #fff; }
    .glow { position: absolute; left: -200px; bottom: -260px; width: 700px; height: 600px; background: radial-gradient(closest-side, rgba(229,38,31,.35), transparent); }
    .left { position: absolute; left: 64px; top: 58px; bottom: 54px; width: 640px; display: flex; flex-direction: column; z-index: 2; }
    h1 { margin-top: 64px; font-size: 56px; line-height: 1.04; letter-spacing: -0.035em; font-weight: 800; }
    p { margin-top: 26px; font-size: 24px; line-height: 1.4; color: #b9bac0; max-width: 500px; }
    .foot { margin-top: auto; }
    .wall { position: absolute; right: -70px; top: -120px; width: 560px; height: 900px; display: flex; gap: 14px; transform: rotate(8deg); }
    .wall::before { content: ''; position: absolute; inset: 0; z-index: 2; background: linear-gradient(90deg, #0b0b0c 0%, rgba(11,11,12,0) 22%); }
    .col { flex: 1; display: flex; flex-direction: column; gap: 14px; }
    .c1 { margin-top: -90px; } .c2 { margin-top: -40px; }
    .col img { width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 12px; }
  `),

  // B. One release, every format: landscape thumb + Canvas phone + promo phone. Light, Fastlane look.
  kit: () => page(`
    <div class="left">
      <div class="brand"><span class="mark"></span>Label Launch System</div>
      <h1>One song in.<br><em>Every visual out.</em></h1>
      <p>Cover art, the full video and every cut for social and streaming, delivered in 10&nbsp;days.</p>
      <div class="foot"><span class="url">labellaunchsystem.com</span></div>
    </div>
    <div class="stage">
      <img class="yt" src="kit/paradise-thumb-2.webp">
      <div class="phone p1"><img src="kit/canvas-paradise-lunax-poster.webp"></div>
      <div class="phone p2"><img src="kit/paradise-promo-teaser-poster.webp"></div>
      <span class="tag t1">YouTube</span><span class="tag t2">Spotify Canvas</span><span class="tag t3">Reels</span>
    </div>
  `, `
    body { background: #fff; color: #0b0b0c; }
    body::before { content: ''; position: absolute; right: -120px; top: -160px; width: 760px; height: 760px; border-radius: 50%; background: #fdecea; }
    .left { position: absolute; left: 64px; top: 58px; bottom: 54px; width: 500px; display: flex; flex-direction: column; }
    h1 { margin-top: 70px; font-size: 76px; line-height: 1; letter-spacing: -0.045em; font-weight: 800; }
    p { margin-top: 26px; font-size: 24px; line-height: 1.4; color: #55565c; max-width: 450px; }
    .foot { margin-top: auto; }
    .stage { position: absolute; right: 40px; top: 70px; width: 600px; height: 500px; }
    .yt { position: absolute; left: 0; top: 70px; width: 470px; border-radius: 16px; box-shadow: 0 30px 60px rgba(0,0,0,.22); }
    .phone { position: absolute; width: 190px; aspect-ratio: 9/19; border-radius: 30px; background: #0b0b0c; padding: 7px; box-shadow: 0 30px 60px rgba(0,0,0,.3); }
    .phone img { width: 100%; height: 100%; object-fit: cover; border-radius: 24px; }
    .p1 { right: 70px; top: 40px; transform: rotate(5deg); }
    .p2 { right: 230px; top: 150px; width: 160px; transform: rotate(-6deg); }
    .tag { position: absolute; background: #0b0b0c; color: #fff; font-weight: 600; font-size: 16px; padding: 8px 14px; border-radius: 999px; }
    .t1 { left: 14px; top: 30px; } .t2 { right: 20px; top: 0; background: #e5261f; } .t3 { right: 260px; bottom: 8px; }
  `, 'light'),

  // C. Proof first: the biggest number we can stand behind, with the label logos.
  proof: () => page(`
    <img class="bg" src="kit/erinner-mich-thumb.webp">
    <div class="shade"></div>
    <div class="inner">
      <div class="brand"><span class="mark"></span>Label Launch System</div>
      <div class="big"><b>19.5M</b><span>views on one lyric video we made:<br>HBz x 2 Engel &amp; Charlie, "Erinner mich"</span></div>
      <h1>Every visual your release needs, <em>delivered in 10 days.</em></h1>
      <div class="row"><div class="logos">${logoImgs(5)}</div><span class="url">labellaunchsystem.com</span></div>
    </div>
  `, `
    body { background: #0b0b0c; color: #fff; }
    .bg { position: absolute; right: 0; top: 0; height: 100%; width: 75%; object-fit: cover; }
    .shade { position: absolute; inset: 0; background: linear-gradient(90deg, #0b0b0c 30%, rgba(11,11,12,.75) 60%, rgba(11,11,12,.35) 100%), linear-gradient(0deg, #0b0b0c 0%, transparent 35%); }
    .inner { position: absolute; inset: 58px 64px 50px; display: flex; flex-direction: column; }
    .big { margin-top: 44px; display: flex; align-items: center; gap: 22px; }
    .big b { font-size: 132px; font-weight: 900; letter-spacing: -0.05em; line-height: .9; color: #e5261f; }
    .big span { font-size: 24px; line-height: 1.3; color: #d4d5da; font-weight: 500; }
    h1 { margin-top: 26px; font-size: 44px; line-height: 1.1; letter-spacing: -0.03em; font-weight: 800; max-width: 760px; }
    .row { margin-top: auto; display: flex; align-items: center; justify-content: space-between; }
  `),

  // D. Type only, white, like the site hero. Logos as the proof strip.
  type: () => page(`
    <div class="brand"><span class="mark"></span>Label Launch System</div>
    <h1>Every visual your release needs, delivered in <em>10&nbsp;days.</em></h1>
    <p>Cover art · Lyric video · Spotify Canvas · Reels · Thumbnails · Trailers</p>
    <div class="row"><span class="cap">Has worked with</span><div class="logos">${logoImgs()}</div></div>
  `, `
    body { background: #fff; color: #0b0b0c; padding: 58px 64px; display: flex; flex-direction: column; }
    body::after { content: ''; position: absolute; right: 64px; top: 58px; width: 22px; height: 22px; border-radius: 50%; background: #e5261f; box-shadow: 0 0 0 10px #fdecea; }
    h1 { margin-top: 56px; font-size: 80px; line-height: 1; letter-spacing: -0.045em; font-weight: 800; max-width: 1000px; }
    p { margin-top: 28px; font-size: 24px; color: #55565c; font-weight: 500; }
    .row { margin-top: auto; padding-top: 26px; border-top: 1px solid #e6e6e8; display: flex; align-items: center; gap: 30px; }
    .cap { font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #8a8b91; white-space: nowrap; }
  `, 'light'),
};

// Round 2 (2026-10-08): fewer words, numbers as the shape people recognise first.
// Shared pieces: a thin wall strip of real work, a stat strip, a giant number.
const strip = (n = 3) => `<div class="strip">${[0, 1].map((c) => `<div class="col">${WALL.slice(c * 6, c * 6 + 6).concat(WALL.slice(c * 6, c * 6 + n)).map((s) => `<img src="${s}">`).join('')}</div>`).join('')}</div>`;
const stats = (items) => `<div class="stats2">${items.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('')}</div>`;
const R2 = `
  .in { position: absolute; inset: 58px 64px 54px; display: flex; flex-direction: column; z-index: 2; }
  h1 { font-weight: 900; letter-spacing: -0.05em; line-height: .95; }
  .foot { margin-top: auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
  .strip { position: absolute; right: -40px; top: -140px; width: 420px; height: 950px; display: flex; gap: 12px; transform: rotate(8deg); }
  .strip::before { content: ''; position: absolute; inset: 0; z-index: 2; background: linear-gradient(90deg, #0b0b0c 0%, rgba(11,11,12,0) 35%); }
  .light .strip::before { background: linear-gradient(90deg, #fff 0%, rgba(255,255,255,0) 35%); }
  .strip .col { flex: 1; display: flex; flex-direction: column; gap: 12px; }
  .strip .col + .col { margin-top: -70px; }
  .strip img { width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 10px; }
  .stats2 { display: flex; gap: 34px; }
  .stats2 b { display: block; font-size: 40px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; }
  .stats2 b em { color: #e5261f; }
  .stats2 span { display: block; margin-top: 6px; font-size: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; opacity: .6; }
  .dark { background: #0b0b0c; color: #fff; }
  .light { background: #fff; color: #0b0b0c; }
`;
Object.assign(CONCEPTS, {
  // 1. Music in. Visuals out. + giant 10 days.
  musicin: () => page(`
    <div class="in">
      <div class="brand"><span class="mark"></span>Label Launch System</div>
      <h1 style="margin-top:70px;font-size:118px">Music in.<br><em>Visuals out.</em></h1>
      <div class="foot"><span class="url">labellaunchsystem.com</span></div>
    </div>
    <div class="big"><b>10</b><span>days</span></div>
  `, R2 + `
    .big { position: absolute; right: 64px; bottom: 40px; text-align: right; }
    .big { right: 56px; bottom: 50px; }
    .big b { display: block; font-size: 330px; font-weight: 900; letter-spacing: -0.08em; line-height: .78; color: #e5261f; }
    .big span { display: block; font-size: 56px; font-weight: 900; letter-spacing: -0.04em; color: #fff; margin-top: 10px; }
  `),

  // 2. Numbers as the headline: 1 song. Every visual. 10 days.
  onesong: () => page(`
    <div class="in">
      <div class="brand"><span class="mark"></span>Label Launch System</div>
      <h1 class="n" style="margin-top:46px"><span><em>1</em> song.</span><span>Every visual.</span><span><em>10</em> days.</span></h1>
      <div class="foot"><span class="url">labellaunchsystem.com</span></div>
    </div>
    ${strip()}
  `, R2 + `
    h1.n { font-size: 92px; display: flex; flex-direction: column; gap: 6px; }
    h1.n em { font-size: 1.15em; }
  `),

  // 3. Turn one song into a full rollout + stat strip. Light.
  rollout: () => page(`
    <div class="in">
      <div class="brand"><span class="mark"></span>Label Launch System</div>
      <h1 style="margin-top:50px;font-size:104px;max-width:1000px">Turn one song into a <em>full&nbsp;rollout.</em></h1>
      <div class="foot">${stats([['<em>10</em>', 'Days'], ['19.5M', 'Views, one video'], ['800+', 'Projects']])}<span class="url">labellaunchsystem.com</span></div>
    </div>
  `, R2 + `
    body::after { content: ''; position: absolute; right: 64px; top: 58px; width: 22px; height: 22px; border-radius: 50%; background: #e5261f; box-shadow: 0 0 0 10px #fdecea; }
    .foot { border-top: 1px solid #e6e6e8; padding-top: 26px; }
  `, 'light'),

  // 4. Visual partner for labels + stats, wall strip. Dark.
  partner: () => page(`
    <div class="in">
      <div class="brand"><span class="mark"></span>Label Launch System</div>
      <h1 style="margin-top:50px;font-size:92px;max-width:700px">The visual partner<br><em>for labels.</em></h1>
      <div class="foot">${stats([['<em>10</em>', 'Days'], ['19.5M', 'Views'], ['10+', 'Years']])}</div>
    </div>
    ${strip()}
  `, R2),

  // 5. Proof as headline: 19.5M views. One song.
  views: () => page(`
    <img class="bg" src="kit/erinner-mich-thumb.webp">
    <div class="shade"></div>
    <div class="in">
      <div class="brand"><span class="mark"></span>Label Launch System</div>
      <h1 style="margin-top:40px"><em class="m">19.5M</em><span class="s">views from one song's visuals.<br>Yours next, in <em>10 days.</em></span></h1>
      <div class="foot"><span class="url">labellaunchsystem.com</span></div>
    </div>
  `, R2 + `
    .bg { position: absolute; right: 0; top: 0; height: 100%; width: 70%; object-fit: cover; }
    .shade { position: absolute; inset: 0; background: linear-gradient(90deg, #0b0b0c 35%, rgba(11,11,12,.7) 65%, rgba(11,11,12,.3) 100%); }
    .m { display: block; font-size: 210px; letter-spacing: -0.06em; line-height: .85; }
    .s { display: block; margin-top: 22px; font-size: 48px; letter-spacing: -0.035em; line-height: 1.05; font-weight: 800; }
  `),

  // 6. Speed as a question. Light, giant red 10.
  releasein: () => page(`
    <div class="in">
      <div class="brand"><span class="mark"></span>Label Launch System</div>
      <h1 style="margin-top:60px;font-size:80px;max-width:640px">Release in <em>10&nbsp;days?</em><br>Every visual, ready.</h1>
      <div class="foot"><span class="url">labellaunchsystem.com</span></div>
    </div>
    <div class="ten">10</div>
  `, R2 + `
    .ten { position: absolute; right: 40px; font-size: 470px; font-weight: 900; letter-spacing: -0.08em; line-height: .8; color: #e5261f; bottom: 40px; }
  `, 'light'),

  // 7. One song. Full rollout. With the format list as the second line of shapes.
  formats: () => page(`
    <div class="in">
      <div class="brand"><span class="mark"></span>Label Launch System</div>
      <h1 style="margin-top:46px;font-size:100px">One song.<br><em>Full rollout.</em></h1>
      <div class="chips">${['Cover', 'Lyric video', 'Canvas', 'Reels', 'Thumbnails', 'Trailers'].map((c) => `<span>${c}</span>`).join('')}</div>
      <div class="foot"><span class="url">labellaunchsystem.com</span><span class="days"><em>10</em> days</span></div>
    </div>
  `, R2 + `
    .chips { margin-top: 34px; display: flex; flex-wrap: wrap; gap: 10px; max-width: 900px; }
    .chips span { border: 2px solid rgba(255,255,255,.25); border-radius: 999px; padding: 9px 18px; font-size: 21px; font-weight: 700; }
    .days { font-size: 64px; font-weight: 900; letter-spacing: -0.05em; line-height: .9; }
  `),
});

// One card per case study: the release artwork, the artist and the view count.
const caseCard = (r) => page(`
  <div class="art"><img src="${r.poster.replace(/^\//, '')}"></div>
  <div class="left">
    <div class="brand"><span class="mark"></span>Label Launch System</div>
    <span class="eyebrow">Release case study</span>
    <h1>${esc(r.artist)}<br><em>"${esc(r.title)}"</em></h1>
    <div class="stats"><div><b>${esc(r.views)}</b><span>${esc(r.viewsLabel || 'YouTube views')}</span></div><div><b>${esc(r.client)}</b><span>Client</span></div></div>
    <span class="url">labellaunchsystem.com</span>
  </div>
`, `
  body { background: #0b0b0c; color: #fff; }
  .art { position: absolute; right: 0; top: 0; width: 640px; height: 630px; }
  .art img { width: 100%; height: 100%; object-fit: cover; }
  .art::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, #0b0b0c 0%, rgba(11,11,12,.0) 40%); }
  .left { position: absolute; left: 64px; top: 58px; bottom: 54px; width: 540px; display: flex; flex-direction: column; }
  .eyebrow { margin-top: 64px; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #e5261f; }
  h1 { margin-top: 14px; font-size: ${Math.max(r.artist.length, r.title.length + 2) > 20 ? 44 : 56}px; line-height: 1.06; letter-spacing: -0.035em; font-weight: 800; }
  .stats { margin-top: 30px; display: flex; gap: 40px; }
  .stats { max-width: 560px; }
  .stats b { display: block; font-size: ${r.client.length > 14 ? 30 : 40}px; font-weight: 800; letter-spacing: -0.03em; }
  .stats span { white-space: nowrap; font-size: 17px; color: #9c9da3; font-weight: 500; }
  .url { margin-top: auto; }
`);

const browsers = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
];

let puppeteer;
try { puppeteer = require('puppeteer-core'); } catch { puppeteer = require('E:/UGHD Studios (Website)/node_modules/puppeteer-core'); }
const b = await puppeteer.launch({ executablePath: browsers.find((p) => fs.existsSync(p)), headless: true, args: ['--allow-file-access-from-files'] });
const tab = await b.newPage();
await tab.setViewport({ width: 1200, height: 630 });

async function render(html, file) {
  // Loaded from a file:// page so the <base> can reach public/.
  const tmp = path.join(os.tmpdir(), 'lls-og.html');
  fs.writeFileSync(tmp, html);
  await tab.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0', timeout: 60000 });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: path.join(out, file), type: 'jpeg', quality: 88 });
  console.log('og/' + file, Math.round(fs.statSync(path.join(out, file)).size / 1024) + ' KB');
}

if (process.argv.includes('--concepts')) for (const k of Object.keys(CONCEPTS)) await render(CONCEPTS[k](), `concept-${k}.jpg`);
await render(CONCEPTS[HOME](), 'home.jpg');
for (const r of FEATURED) await render(caseCard(r), `${r.slug}.jpg`);
await render(caseCard({ poster: '/kit/rockitout-thumb-11.webp', artist: 'Divi Roxx Kids', title: 'Rock It Out', views: '20 files', viewsLabel: 'Delivered for one single', client: 'Divi Roxx Kids' }), 'rock-it-out.jpg');

// App and browser icons from public/favicon.svg. The touch icon is full-bleed (iOS rounds it).
const svg = fs.readFileSync(path.join(pub, 'favicon.svg'), 'utf8');
for (const [file, size, bleed] of [['apple-touch-icon.png', 180, true], ['icon-192.png', 192], ['icon-512.png', 512], ['favicon-48.png', 48]]) {
  await tab.setViewport({ width: size, height: size });
  await tab.setContent(`<style>*{margin:0}body{width:${size}px;height:${size}px;overflow:hidden;background:${bleed ? '#0b0b0c' : 'transparent'}}svg{width:100%;height:100%;display:block}</style>${bleed ? svg.replace('rx="8"', 'rx="0"') : svg}`);
  await tab.screenshot({ path: path.join(pub, file), omitBackground: !bleed });
  console.log(file);
}
await b.close();
