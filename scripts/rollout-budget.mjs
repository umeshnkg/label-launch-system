// Weight check for the Rollout hero: every active project's assets must exist
// under public/ and stay under budget (project 1 ≤ 3.3 MB, the old hero.mp4;
// any project ≤ 1.5 MB). Usage: npm run rollout:budget
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROLLOUT } from '../src/rollout.js';
import { activeProjects } from '../src/rollout/derive.js';
import { FEATURED } from '../src/releases.js';
import { YT_CARDS, REELS } from '../src/data.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIRST = 3_300_000, EACH = 1_500_000;
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

let projects;
try { projects = activeProjects(ROLLOUT, { FEATURED, YT_CARDS, REELS }); }
catch (e) { console.log('rollout budget: FAIL\n- ' + e.message); process.exit(1); }

const failures = [];
projects.forEach((p, i) => {
  let total = 0; const missing = [];
  for (const url of p.assets) {
    const file = path.join(root, 'public', url);
    if (!fs.existsSync(file)) { missing.push(url); continue; }
    total += fs.statSync(file).size;
  }
  const limit = i === 0 ? FIRST : EACH;
  const over = total > limit;
  console.log(`${String(i + 1).padStart(2)}. ${p.slug.padEnd(14)} ${kb(total).padStart(9)}  limit ${kb(limit)}${over ? '  OVER' : ''}${missing.length ? `  missing ${missing.length}` : ''}`);
  if (over) failures.push(`${p.slug}: ${kb(total)} over the ${kb(limit)} limit`);
  for (const m of missing) failures.push(`${p.slug}: missing ${m}`);
});
if (failures.length) { console.log('rollout budget: FAIL\n- ' + failures.join('\n- ')); process.exit(1); }
console.log('rollout budget: OK');
