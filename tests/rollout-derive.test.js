import { test } from 'node:test';
import assert from 'node:assert/strict';
import { releaseHorizon, notificationFor, kitTiles, resolveProject, validateProject, activeProjects } from '../src/rollout/derive.js';
import { ROLLOUT } from '../src/rollout.js';
import { FEATURED } from '../src/releases.js';
import { YT_CARDS, REELS } from '../src/data.js';

const deps = { FEATURED, YT_CARDS, REELS };

test('releaseHorizon: Paradise is 6 weeks; short gaps are days; missing is Date set', () => {
  assert.equal(releaseHorizon('2025-02-21', '2025-04-03'), 'In 6 weeks');
  assert.equal(releaseHorizon('2026-09-01', '2026-09-10'), 'In 9 days');
  assert.equal(releaseHorizon('2026-09-01', '2026-09-02'), 'In 1 day');
  assert.equal(releaseHorizon(undefined, '2026-09-02'), 'Date set');
  assert.equal(releaseHorizon('2026-09-02', '2026-09-01'), 'Date set');
});

test('notificationFor: heading follows the input level, chips end with the horizon, icon follows the input', () => {
  const n = notificationFor({ artist: 'LUNAX ft. CERES', title: 'Paradise', ordered: '2025-02-21', released: '2025-04-03' }, { input: 'song+images', files: ['master.wav', '6 photos'], inputImages: ['/a.webp', '/b.webp'], inputCount: 7 });
  assert.equal(n.heading, 'New track + images'); assert.equal(n.line2, 'LUNAX ft. CERES, Paradise');
  assert.deepEqual(n.chips, ['master.wav', '6 photos', 'In 6 weeks']);
  assert.deepEqual(n.icon, { kind: 'stack', images: ['/a.webp', '/b.webp'], count: 7 });
  assert.equal(notificationFor({ artist: 'A', title: 'B' }, { input: 'song', files: [] }).heading, 'New track');
  const c = notificationFor({ artist: 'A', title: 'B', cover: '/c.webp' }, { input: 'song+cover', files: [] });
  assert.equal(c.heading, 'New track + cover art'); assert.deepEqual(c.icon, { kind: 'cover', images: ['/c.webp'], count: null });
});

test('kitTiles: Paradise gives 3 reels posters alternating badges, 2 canvases, 3 thumbs, no banner', () => {
  const r = FEATURED.find((x) => x.slug === 'paradise');
  const t = kitTiles(r, { motionCover: { poster: '/kit/canvas-paradise-neutral-poster.webp' } }, REELS);
  assert.equal(t.reels.length, 3);
  assert.deepEqual(t.reels.map((x) => x.badge), ['instagram', 'tiktok', 'instagram']);
  assert.deepEqual(t.verticals.map((x) => x.badge), ['spotify', 'spotify', 'apple']);
  assert.equal(t.thumbs.length, 3); assert.equal(t.banner, null);
  assert.deepEqual(t.counts, { clips: 6, canvases: 3, thumbs: 3 });
});

test('resolveProject + validateProject: the Paradise entry is valid and lists its assets', () => {
  const p = resolveProject(ROLLOUT[0], deps);
  assert.equal(p.slug, 'paradise'); assert.equal(p.ytId, 'sf4xhkoMCvw');
  assert.equal(p.thumb, '/thumbs/sf4xhkoMCvw.webp');
  assert.ok(p.assets.includes(p.preview.video)); assert.ok(p.assets.every((u) => u.startsWith('/')));
  assert.deepEqual(validateProject(p), []);
});

test('validateProject rejects lines that would wrap at 360 px', () => {
  const p = resolveProject(ROLLOUT[0], deps);
  const bad = { ...p, notification: { ...p.notification, line2: 'HBz x 2 Engel & Charlie, Erinner mich (Official)' } };
  assert.ok(validateProject(bad).some((m) => /line2/.test(m)));
  const bad2 = { ...p, notification: { ...p.notification, chips: ['Paradise_master_final_v3.wav', '6 photos', 'In 6 weeks'] } };
  assert.ok(validateProject(bad2).some((m) => /chips/.test(m)));
});

test('activeProjects skips off entries and throws on an invalid one', () => {
  const list = activeProjects([{ ...ROLLOUT[0], on: false }], deps);
  assert.equal(list.length, 0);
  const broken = { ...ROLLOUT[0], story: { ...ROLLOUT[0].story, boards: [ROLLOUT[0].story.boards[0]] } };
  assert.throws(() => activeProjects([broken], deps), /rollout: paradise: .*boards/);
});

test('every active project validates', () => {
  for (const p of activeProjects(ROLLOUT, deps)) assert.deepEqual(validateProject(p), [], p.slug);
});
