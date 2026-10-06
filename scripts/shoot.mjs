// Serve dist/ and screenshot the pages for review.
// Usage: node scripts/shoot.mjs <outDir>
// Needs a built dist/ (npm run build) and Edge or Chrome installed.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] || path.join(root, 'shots');
fs.mkdirSync(out, { recursive: true });

const vite = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const srv = spawn(process.execPath, [vite, 'preview', '--port', '4180', '--strictPort', '--host', '127.0.0.1'], { cwd: root, stdio: 'ignore' });

const waitPort = () => new Promise((resolve) => {
  const t = setInterval(() => {
    const s = net.connect(4180, '127.0.0.1');
    s.on('connect', () => { s.end(); clearInterval(t); resolve(); });
    s.on('error', () => {});
  }, 400);
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browsers = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
];

(async () => {
  await waitPort();
  let puppeteer;
  try { puppeteer = require('puppeteer-core'); } catch { puppeteer = require('E:/UGHD Studios (Website)/node_modules/puppeteer-core'); }
  const exe = browsers.find((p) => fs.existsSync(p));
  console.log('browser', exe);
  const b = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const page = await b.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', (r) => errors.push('REQFAIL ' + r.url()));

  async function shoot(url, prefix, width, height, step, max = 20) {
    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await sleep(800);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(prefix, 'height', h);
    let i = 0;
    for (let y = 0; y < h && i < max; y += step) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await sleep(450);
      await page.screenshot({ path: path.join(out, `${prefix}${String(i++).padStart(2, '0')}.png`) });
    }
  }

  await shoot('http://127.0.0.1:4180/', 'd', 1440, 900, 850);
  await shoot('http://127.0.0.1:4180/', 'm', 390, 844, 800, 16);
  await shoot('http://127.0.0.1:4180/releases/erinner-mich/', 'case', 1440, 900, 850, 5);
  await shoot('http://127.0.0.1:4180/releases/time-out/', 'case2', 1440, 900, 850, 2);

  console.log('errors:', JSON.stringify(errors));
  await b.close();
  srv.kill();
  console.log(fs.readdirSync(out).join(', '));
  process.exit(0);
})().catch((e) => { console.log('ERR', e.stack); srv.kill(); process.exit(1); });
