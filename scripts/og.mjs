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
