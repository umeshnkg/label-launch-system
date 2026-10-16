// Web copies for the Rollout hero, from the real deliveries. Everything lands in
// public/kit/rollout/. ffmpeg: the Jellyfin build unless FFMPEG is set.
//
//   node scripts/rollout-assets.mjs preview --id <ytId> --start <m:ss> --out <slug> [--len 5]
//       yt-dlp the official upload at <=720p into .cache/yt/<id>.mp4, cut <len> s
//       from <start>, muted, 640 px wide, <= 400 KB, plus the first frame as webp.
//   node scripts/rollout-assets.mjs poster --in <file.mp4|img> --out <name> [--at 1] [--max 640]
//       one frame as <name>.webp, longest side <max>.
//   node scripts/rollout-assets.mjs image --in <file> --out <name> --w <px> --h <px> [--kb 150]
//       cover-crop and resize to <w>x<h> webp under <kb> KB.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'public', 'kit', 'rollout');
const CACHE = path.join(root, '.cache', 'yt');
const FFMPEG = process.env.FFMPEG || 'C:/Program Files/Jellyfin/Server/ffmpeg.exe';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

const [mode, ...rest] = process.argv.slice(2);
const args = {};
for (let i = 0; i < rest.length; i += 2) args[rest[i].replace(/^--/, '')] = rest[i + 1];
const need = (k) => { if (!args[k]) { console.error(`missing --${k}`); process.exit(2); } return args[k]; };
const run = (cmd, a) => { const r = spawnSync(cmd, a, { stdio: ['ignore', 'pipe', 'pipe'] }); if (r.status !== 0) { console.error(r.stderr?.toString().split('\n').slice(-6).join('\n')); process.exit(1); } return r; };
const ff = (a) => run(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...a]);
const size = (f) => fs.statSync(f).size;
const report = (f) => console.log(`${path.relative(root, f)}  ${(size(f) / 1024).toFixed(0)} KB`);

function webpUnder(makeArgs, outFile, maxBytes, startQ = 82) {
  for (let q = startQ; q >= 40; q -= 6) {
    ff([...makeArgs(q), outFile]);
    if (size(outFile) <= maxBytes) return q;
  }
  return null;
}

if (mode === 'preview') {
  const start = need('start'), slug = need('out'), len = args.len || '5';
  const id = args.in ? null : need('id');
  const src = args.in || path.join(CACHE, `${id}.mp4`);   // --in <local master> skips yt-dlp (premieres, unlisted uploads)
  if (!fs.existsSync(src) && id) {
    console.log(`yt-dlp ${id} (video only, <=720p)`);
    run('yt-dlp', ['-f', 'bv*[height<=720][ext=mp4]/bv*[height<=720]/b[height<=720]', '-o', src, `https://www.youtube.com/watch?v=${id}`]);
  }
  const mp4 = path.join(OUT, `${slug}-preview.mp4`), webp = path.join(OUT, `${slug}-preview.webp`);
  let ok = false;
  for (const crf of [28, 30, 32, 34]) {
    ff(['-ss', start, '-i', src, '-t', len, '-an', '-vf', 'scale=640:-2', '-c:v', 'libx264', '-crf', String(crf), '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
    if (size(mp4) <= 400 * 1024) { ok = true; break; }
  }
  webpUnder((q) => ['-ss', start, '-i', src, '-frames:v', '1', '-vf', 'scale=640:-2', '-c:v', 'libwebp', '-quality', String(q)], webp, 60 * 1024);
  report(mp4); report(webp);
  if (!ok) { console.error('preview mp4 is over 400 KB even at crf 34'); process.exit(1); }
} else if (mode === 'poster') {
  const input = need('in'), name = need('out'), at = args.at || '1', max = args.max || '640';
  const out = path.join(OUT, `${name}.webp`);
  const isVideo = /\.(mp4|mov|m4v|webm)$/i.test(input);
  webpUnder((q) => [...(isVideo ? ['-ss', at] : []), '-i', input, '-frames:v', '1', '-vf', `scale=${max}:${max}:force_original_aspect_ratio=decrease`, '-c:v', 'libwebp', '-quality', String(q)], out, 90 * 1024);
  report(out);
} else if (mode === 'image') {
  const input = need('in'), name = need('out'), w = need('w'), h = need('h'), kb = Number(args.kb || 150);
  const out = path.join(OUT, `${name}.webp`);
  const q = webpUnder((qq) => ['-i', input, '-frames:v', '1', '-vf', `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}`, '-c:v', 'libwebp', '-quality', String(qq)], out, kb * 1024);
  report(out);
  if (q === null) { console.error(`could not get under ${kb} KB`); process.exit(1); }
} else {
  console.error('usage: rollout-assets.mjs preview|poster|image ...');
  process.exit(2);
}
