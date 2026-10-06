// Turns a dark-on-light logo image into a white silhouette PNG with alpha,
// trimmed to its content, for the grey logo marquee.
// Usage: node scripts/logo-from-luminance.mjs <input> <name> [threshold-contrast]
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FF = '"C:/Program Files/Jellyfin/Server/ffmpeg.exe"';
const FP = '"C:/Program Files/Jellyfin/Server/ffprobe.exe"';
const [, , input, name, contrastArg] = process.argv;
if (!input || !name) { console.log('usage: logo-from-luminance.mjs <input> <name>'); process.exit(1); }
const contrast = contrastArg || '6';
const run = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const outDir = path.join(root, 'public', 'logos');
const tmp = path.join(root, 'public', 'logos', `_${name}-pre.png`);

// Alpha from inverted luminance (dark pixels become opaque), colour forced to white.
run(`${FF} -y -v error -i "${input}" -filter_complex "[0:v]format=rgb24,scale=800:-2,split[a][b];[a]format=gray,negate,eq=contrast=${contrast}[al];[b]format=rgba,lutrgb=r=255:g=255:b=255[w];[w][al]alphamerge" "${tmp}"`);

const [w, h] = run(`${FP} -v error -show_entries stream=width,height -of csv=p=0 "${tmp}"`).trim().split(',').map(Number);
const raw = execSync(`${FF} -v error -i "${tmp}" -f rawvideo -pix_fmt rgba pipe:1`, { maxBuffer: 200 * 1024 * 1024 });
let top = h, bot = 0, left = w, right = 0;
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  if (raw[(y * w + x) * 4 + 3] > 60) { if (y < top) top = y; if (y > bot) bot = y; if (x < left) left = x; if (x > right) right = x; }
}
const m = 4;
const x0 = Math.max(0, left - m), y0 = Math.max(0, top - m);
const cw = Math.min(w - x0, right - left + 1 + 2 * m), ch = Math.min(h - y0, bot - top + 1 + 2 * m);
run(`${FF} -y -v error -i "${tmp}" -vf crop=${cw}:${ch}:${x0}:${y0} "${path.join(outDir, name + '.png')}"`);
fs.unlinkSync(tmp);
console.log(`${name}.png ${cw}x${ch}`);
