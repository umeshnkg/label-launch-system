import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BEATS, ROUND_MS, cuesFor, createRunner } from '../src/rollout/timeline.js';

function fakeClock() {
  let t = 0; const timers = new Map(); let id = 0;
  return {
    now: () => t,
    setTimer: (fn, ms) => { timers.set(++id, { at: t + ms, fn }); return id; },
    clearTimer: (i) => timers.delete(i),
    advance(ms) {
      const end = t + ms;
      for (;;) {
        const next = [...timers.entries()].filter(([, x]) => x.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        t = next[1].at; timers.delete(next[0]); next[1].fn();
      }
      t = end;
    },
    pending: () => timers.size,
  };
}

const project = { boards: [{}, {}, {}], pick: 1, note: 'x'.repeat(40), tiles: { reels: [{}, {}, {}], verticals: [{}, {}], thumbs: ['a', 'b', 'c'], banner: null } };

test('beats cover 20 s in order', () => {
  assert.equal(ROUND_MS, 20000);
  assert.deepEqual(Object.values(BEATS).map((b) => b[0]), [0, 2500, 7500, 13500, 18000]);
});

test('cuesFor: sorted, beats at their starts, pick on the picked board, end at 20000', () => {
  const cues = cuesFor(project);
  assert.ok(cues.every((c, i) => i === 0 || c.at >= cues[i - 1].at));
  assert.deepEqual(cues.filter((c) => c.type === 'beat').map((c) => [c.name, c.at]), [['notification', 0], ['directions', 2500], ['preview', 7500], ['delivered', 13500], ['clear', 18000]]);
  assert.deepEqual(cues.find((c) => c.type === 'pick'), { at: 6600, type: 'pick', i: 1 });
  assert.equal(cues.at(-1).type, 'end'); assert.equal(cues.at(-1).at, 20000);
  assert.equal(cues.filter((c) => c.type === 'note').length, 20);
  assert.deepEqual(cues.filter((c) => c.type === 'tc').map((c) => c.at), [7500, 8500, 9500, 10500, 11500, 12500]);
  assert.equal(cues.filter((c) => c.type === 'tile').length, 1 + 3 + 2 + 1);
});

test('cuesFor: no pick → approve press on the last board; tiles pop 120 ms apart', () => {
  const cues = cuesFor({ ...project, pick: undefined, boards: [{}, {}] });
  assert.ok(!cues.some((c) => c.type === 'pick'));
  assert.ok(cues.some((c) => c.type === 'press' && c.at === 6600 && c.anchor === '.rl-board[data-i="1"] .rl-ok'));
  const tiles = cuesFor(project).filter((c) => c.type === 'tile').map((c) => c.at);
  assert.deepEqual(tiles.slice(0, 3), [13700, 13820, 13940]);
});

test('runner fires cues in order and ends', () => {
  const clk = fakeClock(); const seen = [];
  const r = createRunner({ cues: cuesFor(project), apply: (c) => seen.push(c.type), ...clk });
  r.start(); clk.advance(20000);
  assert.equal(seen[0], 'beat'); assert.equal(seen.at(-1), 'end'); assert.equal(r.state(), 'done');
});

test('runner resumes from the paused elapsed time', () => {
  const clk = fakeClock(); const seen = [];
  const r = createRunner({ cues: cuesFor(project), apply: (c) => seen.push([c.type, clk.now()]), ...clk });
  r.start(); clk.advance(3000); r.pause();
  assert.equal(r.elapsed(), 3000); assert.equal(clk.pending(), 0);
  clk.advance(600000); r.resume();            // ten minutes hidden
  const before = seen.length; clk.advance(100);
  assert.equal(seen.length, before);          // nothing bursts
  clk.advance(4500);
  assert.ok(seen.some(([t, at]) => t === 'beat' && at === 600000 + 3000 + 4500));  // preview beat lands at 7500 ms of round time
});

test('skip cancels pending cues', () => {
  const clk = fakeClock(); const seen = [];
  const r = createRunner({ cues: cuesFor(project), apply: (c) => seen.push(c.type), ...clk });
  r.start(); clk.advance(1000); r.skip();
  assert.equal(clk.pending(), 0); assert.equal(r.state(), 'done');
  const n = seen.length; clk.advance(20000); assert.equal(seen.length, n);
});
