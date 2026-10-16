// Check the Rollout hero in a real browser and screenshot every beat.
// Usage: node scripts/shoot-rollout.mjs [fallback|lcp]
// Needs a built dist/ (npm run build) and Edge or Chrome installed.
// Exits 1 on any console error, failed request or failed assertion.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'shots', 'rollout');
fs.mkdirSync(out, { recursive: true });
const mode = process.argv[2] || 'beats';
const BASE = 'http://127.0.0.1:4180';

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

const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };

(async () => {
  await waitPort();
  const exe = browsers.find((p) => fs.existsSync(p));
  const b = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const page = await b.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', (r) => errors.push('REQFAIL ' + r.url()));

  const hero = async () => page.$('.hero');
  const shot = async (name) => { const h = await hero(); await h.screenshot({ path: path.join(out, name) }); };

  if (mode === 'beats') {
    for (const beat of ['notification', 'directions', 'preview', 'delivered']) {
      for (const [w, h, tag] of [[1280, 800, 'd'], [360, 667, 'm']]) {
        await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
        await page.goto(`${BASE}/?rollout=beat:${beat}`, { waitUntil: 'networkidle0', timeout: 60000 });
        const found = await page.waitForSelector(`.rl[data-beat="${beat}"]`, { timeout: 8000 }).catch(() => null);
        check(found, `${beat}@${tag}: no .rl[data-beat="${beat}"]`);
        if (!found) continue;
        await sleep(900);
        const r = await page.evaluate((beatName) => {
          const rl = document.querySelector('.rl');
          const box = rl.getBoundingClientRect();
          const res = { ratio: box.width / box.height, wraps: [], okText: null, chkVisible: 0 };
          if (beatName === 'notification') {
            for (const sel of ['.rl-ntf__l1', '.rl-ntf__l2', '.rl-ntf__l3']) {
              const el = rl.querySelector(sel);
              if (!el) { res.wraps.push(`${sel} missing`); continue; }
              if (el.scrollWidth > el.clientWidth + 1) res.wraps.push(`${sel} overflows ${el.scrollWidth}>${el.clientWidth}`);
              if (el.getBoundingClientRect().height > parseFloat(getComputedStyle(el).lineHeight) * 1.6) res.wraps.push(`${sel} wraps`);
            }
          }
          if (beatName === 'delivered') {
            const ok = rl.querySelector('.rl-kit .rl-ok');
            res.okText = ok ? ok.textContent.trim() : null;
            res.chkVisible = [...rl.querySelectorAll('.rl-chk')].filter((c) => getComputedStyle(c).opacity !== '0' && getComputedStyle(c).display !== 'none' && c.offsetParent).length;
          }
          return res;
        }, beat);
        check(Math.abs(r.ratio - 16 / 9) < 0.02, `${beat}@${tag}: stage ratio ${r.ratio.toFixed(3)} is not 16:9`);
        check(r.wraps.length === 0, `${beat}@${tag}: ${r.wraps.join(', ')}`);
        if (beat === 'delivered') {
          check(r.okText === 'Approve', `delivered@${tag}: button reads "${r.okText}", expected "Approve"`);
          check(r.chkVisible === 0, `delivered@${tag}: ${r.chkVisible} check marks visible`);
        }
        await shot(`${beat}-${tag}.png`);
      }
    }
  }

  await b.close();
  srv.kill();
  if (errors.length) failures.push('browser errors: ' + JSON.stringify(errors));
  if (failures.length) { console.log('rollout: FAIL\n- ' + failures.join('\n- ')); process.exit(1); }
  console.log('rollout: OK');
  process.exit(0);
})().catch((e) => { console.log('ERR', e.stack); srv.kill(); process.exit(1); });
