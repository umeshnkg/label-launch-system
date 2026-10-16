// Check the Rollout hero in a real browser and screenshot every beat.
// Usage: node scripts/shoot-rollout.mjs [beats|behaviour|all|fallback|lcp]   (default: all)
//   fallback  renders the delivered frame of project 1 at 2x into public/kit/rollout/fallback.webp
//             (the no-JS image) and checks it shows with JavaScript off.
//   lcp       prints the largest-contentful-paint time and element at 360 x 667 on a slow phone
//             profile; set LLS_DIST_ROOT=<other checkout> to measure another build (the main baseline).
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
const mode = process.argv[2] || 'all';
const BASE = 'http://127.0.0.1:4180';

const vite = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const serveRoot = process.env.LLS_DIST_ROOT ? path.resolve(process.env.LLS_DIST_ROOT) : root;
const srv = spawn(process.execPath, [vite, 'preview', '--port', '4180', '--strictPort', '--host', '127.0.0.1'], { cwd: serveRoot, stdio: 'ignore' });
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
const errors = [];

async function newPage(b) {
  const page = await b.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  // A navigation mid-load aborts the previous page's videos; that is not a failure.
  page.on('requestfailed', (r) => { if (r.failure()?.errorText !== 'net::ERR_ABORTED') errors.push('REQFAIL ' + r.url()); });
  return page;
}
const beatOf = (page) => page.evaluate(() => document.querySelector('.rl')?.dataset.beat ?? null);
const projectOf = (page) => page.evaluate(() => document.querySelector('[data-rollout]')?.dataset.project ?? null);
const scrollToStage = (page) => page.evaluate(() => document.querySelector('[data-rollout]').scrollIntoView({ block: 'center' }));

// ROLLOUT_P=<index> shoots that project's beats instead of the first one's.
const P = Number(process.env.ROLLOUT_P || 0);

async function beats(b) {
  const page = await newPage(b);
  for (const beat of ['notification', 'directions', 'preview', 'delivered']) {
    for (const [w, h, tag] of [[1280, 800, 'd'], [360, 667, 'm']]) {
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await page.goto(`${BASE}/?rollout=beat:${beat}&p=${P}`, { waitUntil: 'networkidle0', timeout: 60000 });
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
      const hero = await page.$('.hero');
      await hero.screenshot({ path: path.join(out, `${P ? `p${P}-` : ''}${beat}-${tag}.png`) });
    }
  }
  // Phone fold: headline, lede, stage and the main CTA all on screen together, stage edge to edge.
  for (const [w, h] of [[360, 667], [390, 844]]) {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto(`${BASE}/?rollout=beat:notification`, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForSelector('.rl', { timeout: 8000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(300);
    const r = await page.evaluate(() => {
      const bottom = (sel) => { const el = document.querySelector(sel); return el ? Math.round(el.getBoundingClientRect().bottom) : null; };
      const rl = document.querySelector('.rl').getBoundingClientRect();
      return { h1: bottom('.hero h1'), lede: bottom('.hero .lede'), stage: Math.round(rl.bottom), cta: bottom('.hero__cta .btn'), stageW: Math.round(rl.width), vw: document.documentElement.clientWidth };
    });
    const limit = h + 40;
    for (const [k, v] of Object.entries({ h1: r.h1, lede: r.lede, stage: r.stage, cta: r.cta })) check(v !== null && v <= limit, `fold@${w}x${h}: ${k} bottom ${v} > ${limit}`);
    check(Math.abs(r.stageW - (r.vw - 40)) <= 2, `fold@${w}x${h}: stage width ${r.stageW}, expected ${r.vw - 40} (20 px gutters)`);
    const hero = await page.$('.hero');
    await hero.screenshot({ path: path.join(out, `fold-${w}.png`) });
  }
  await page.close();
}

async function behaviour(b) {
  // Advances through the beats on its own.
  let page = await newPage(b);
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 60000 });
  await scrollToStage(page);
  const started = await page.waitForSelector('.rl[data-beat="notification"]', { timeout: 8000 }).catch(() => null);
  check(started, 'advance: the stage never started');
  if (started) {
    const t0 = Date.now();
    const expect = [[1000, 'notification'], [4000, 'directions'], [9000, 'preview'], [15000, 'delivered']];
    for (const [ms, beat] of expect) {
      await sleep(Math.max(0, t0 + ms - Date.now()));
      const got = await beatOf(page);
      check(got === beat, `advance: at ${ms} ms beat is "${got}", expected "${beat}"`);
    }
    const firstProject = await projectOf(page);
    check(!!firstProject, 'advance: [data-rollout] has no data-project');

    // Skip: a double tap produces one stage, restarted at the notification.
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 60000 });
    await scrollToStage(page);
    await page.waitForSelector('.rl[data-beat="notification"]', { timeout: 8000 });
    await sleep(4000);
    const before = await projectOf(page);
    const box = await (await page.$('.rl')).boundingBox();   // the stage is replaced on skip, so click by coordinates
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    await page.mouse.click(cx, cy); await sleep(50); await page.mouse.click(cx, cy);
    await sleep(500);
    const after = await projectOf(page);
    const count = await page.evaluate(() => document.querySelectorAll('.rl').length);
    const beat = await beatOf(page);
    check(count === 1, `skip: ${count} stages after a double tap`);
    check(beat === 'notification', `skip: beat is "${beat}" after a tap, expected "notification"`);
    const projects = await page.evaluate(() => Number(document.querySelector('[data-rollout]')?.dataset.projects || 0));
    if (projects > 1) check(after !== before, `skip: project did not change (${before} → ${after})`);
    // Keyboard: the hidden real button skips too.
    await sleep(3000);
    check((await beatOf(page)) === 'directions', 'skip: round did not continue after the tap');
    await page.focus('.rl-skip');
    await page.keyboard.press('Enter');
    await sleep(300);
    check((await beatOf(page)) === 'notification', 'skip: Enter on .rl-skip did not restart the round');
  }
  await page.close();

  // Reduced motion: final frame, no cursors, a Next button.
  page = await newPage(b);
  await page.setViewport({ width: 1280, height: 800 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 60000 });
  await scrollToStage(page);
  const rm = await page.waitForSelector('.rl[data-beat="delivered"]', { timeout: 5000 }).catch(() => null);
  check(rm, 'reduced motion: no .rl[data-beat="delivered"]');
  if (rm) {
    const r = await page.evaluate(() => ({
      cursors: document.querySelectorAll('.rl-cur.is-on').length,
      next: !!document.querySelector('.rl-next'),
      approved: !!document.querySelector('.rl-kit .rl-ok.is-approved'),
      project: document.querySelector('[data-rollout]').dataset.project,
    }));
    check(r.cursors === 0, `reduced motion: ${r.cursors} cursors on`);
    check(r.next, 'reduced motion: no .rl-next button');
    check(r.approved, 'reduced motion: kit Approve is not in the approved state');
    if (r.next) {
      await page.click('.rl-next'); await sleep(300);
      const r2 = await page.evaluate(() => ({ stages: document.querySelectorAll('.rl').length, beat: document.querySelector('.rl')?.dataset.beat }));
      check(r2.stages === 1 && r2.beat === 'delivered', `reduced motion: after Next, ${r2.stages} stages at beat "${r2.beat}"`);
    }
    const hero = await page.$('.hero');
    await hero.screenshot({ path: path.join(out, 'reduced-motion-d.png') });
  }
  await page.close();

  // Save-data: no mp4 is requested, the timecode still runs.
  page = await newPage(b);
  await page.setViewport({ width: 1280, height: 800 });
  await page.evaluateOnNewDocument(() => { Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true }); });
  const mp4s = [];
  await page.setRequestInterception(true);
  page.on('request', (req) => { if (req.url().endsWith('.mp4')) mp4s.push(req.url()); req.continue(); });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 60000 });
  await scrollToStage(page);
  const sd = await page.waitForSelector('.rl[data-beat="notification"]', { timeout: 8000 }).catch(() => null);
  check(sd, 'save-data: the stage never started');
  if (sd) {
    const t0 = Date.now();
    await sleep(Math.max(0, t0 + 8000 - Date.now()));
    const tc1 = await page.evaluate(() => document.querySelector('.rl-tc')?.textContent);
    await sleep(Math.max(0, t0 + 10000 - Date.now()));
    const tc2 = await page.evaluate(() => document.querySelector('.rl-tc')?.textContent);
    // Only the hero's clips count; the rest of the homepage autoplays its own videos.
    const previewSrc = await page.evaluate(() => document.querySelector('.rl-preview video')?.dataset.src || '');
    const heroMp4s = mp4s.filter((u) => u.includes('/kit/rollout/') || (previewSrc && u.endsWith(previewSrc)));
    check(heroMp4s.length === 0, `save-data: ${heroMp4s.length} hero mp4 requests (${heroMp4s.join(', ')})`);
    check(tc1 && tc2 && tc1 !== tc2, `save-data: timecode did not move (${tc1} → ${tc2})`);
  }
  await page.close();
}

async function fallback(b) {
  const page = await newPage(b);
  await page.setViewport({ width: 1120, height: 800, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/?rollout=beat:delivered&p=0`, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForSelector('.rl[data-beat="delivered"]', { timeout: 8000 });
  await sleep(1200);
  const rl = await page.$('.rl');
  const file = path.join(root, 'public', 'kit', 'rollout', 'fallback.webp');
  await rl.screenshot({ path: file, type: 'webp', quality: 82 });
  console.log(`fallback -> ${path.relative(root, file)} ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
  // With JavaScript off the <noscript> image must show (served from the build, so copy it into dist too).
  fs.mkdirSync(path.join(root, 'dist', 'kit', 'rollout'), { recursive: true });
  fs.copyFileSync(file, path.join(root, 'dist', 'kit', 'rollout', 'fallback.webp'));
  const p2 = await newPage(b);
  await p2.setJavaScriptEnabled(false);
  await p2.setViewport({ width: 1280, height: 800 });
  await p2.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 60000 });
  const shown = await p2.evaluate(() => { const i = document.querySelector('[data-rollout] img'); return i ? { w: i.naturalWidth, h: i.getBoundingClientRect().height } : null; });
  check(shown && shown.w > 0 && shown.h > 100, `fallback: no-JS image not shown (${JSON.stringify(shown)})`);
  await p2.close();
  await page.close();
}

async function lcp(b) {
  const page = await newPage(b);
  await page.evaluateOnNewDocument(() => {
    window.__lcp = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp.push({ t: e.startTime, el: e.element ? e.element.tagName + (e.element.className ? '.' + String(e.element.className).split(' ')[0] : '') : '?', size: e.size }); }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.setViewport({ width: 360, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.goto(`${BASE}/`, { waitUntil: 'load', timeout: 120000 });
  await sleep(6000);
  const entries = await page.evaluate(() => window.__lcp);
  const last = entries.at(-1);
  console.log(`lcp ${serveRoot === root ? 'branch' : 'main'}: ${last ? `${Math.round(last.t)} ms on ${last.el}` : 'no entry'}  (${entries.map((e) => `${Math.round(e.t)}:${e.el}`).join(' > ')})`);
  await page.close();
}

(async () => {
  await waitPort();
  const exe = browsers.find((p) => fs.existsSync(p));
  const b = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  if (mode === 'beats' || mode === 'all') await beats(b);
  if (mode === 'behaviour' || mode === 'all') await behaviour(b);
  if (mode === 'fallback') await fallback(b);
  if (mode === 'lcp') await lcp(b);
  await b.close();
  srv.kill();
  if (errors.length) failures.push('browser errors: ' + JSON.stringify(errors));
  if (failures.length) { console.log('rollout: FAIL\n- ' + failures.join('\n- ')); process.exit(1); }
  console.log('rollout: OK');
  process.exit(0);
})().catch((e) => { console.log('ERR', e.stack); srv.kill(); process.exit(1); });
