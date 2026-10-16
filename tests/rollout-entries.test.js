import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { resolveProject, validateProject } from '../src/rollout/derive.js';
import { ROLLOUT } from '../src/rollout.js';
import { FEATURED } from '../src/releases.js';
import { YT_CARDS, REELS } from '../src/data.js';

const deps = { FEATURED, YT_CARDS, REELS };
const pub = path.resolve('public');

// Every entry, on or off, must validate and point at files that exist, so a
// project can be switched on without surprises.
test('every ROLLOUT entry validates and its assets exist (previews may still be in production)', () => {
  for (const entry of ROLLOUT) {
    const p = resolveProject(entry, deps);
    assert.deepEqual(validateProject(p), [], p.slug);
    const missing = p.assets.filter((u) => !fs.existsSync(path.join(pub, u)) && !u.includes('-preview.'));
    assert.deepEqual(missing, [], `${p.slug}: missing files`);
  }
});
