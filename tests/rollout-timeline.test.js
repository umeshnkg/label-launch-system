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

const project = { notification: { chips: ['master.wav', '6 photos', 'In 6 weeks'] }, boards: [{}, {}, {}], pick: 1, note: 'x'.repeat(40), tiles: { reels: [{}, {}, {}], verticals: [{}, {}], thumbs: ['a', 'b', 'c'], banner: null } };

test('beats cover 22.5 s in order', () => {
  assert.equal(ROUND_MS, 22500);
  assert.deepEqual(Object.values(BEATS).map((b) => b[0]), [0, 5000, 10000, 16000, 20500]);
});

test('cuesFor: sorted, beats at their starts, pick on the picked board, end at 22500', () => {
  const cues = cuesFor(project);
  assert.ok(cues.every((c, i) => i === 0 || c.at >= cues[i - 1].at));
  assert.deepEqual(cues.filter((c) => c.type === 'beat').map((c) => [c.name, c.at]), [['notification', 0], ['directions', 5000], ['preview', 10000], ['delivered', 16000], ['clear', 20500]]);
  assert.deepEqual(cues.find((c) => c.type === 'pick'), { at: 9100, type: 'pick', i: 1 });
  assert.equal(cues.at(-1).type, 'end'); assert.equal(cues.at(-1).at, 22500);
  assert.equal(cues.filter((c) => c.type === 'note').length, 20);
  assert.deepEqual(cues.filter((c) => c.type === 'tc').map((c) => c.at), [10000, 11000, 12000, 13000, 14000, 15000]);
  assert.equal(cues.filter((c) => c.type === 'tile').length, 1 + 3 + 2 + 1);
});

test('cuesFor: no pick → one centred Approve under the boards; tiles pop 120 ms apart', () => {
  const cues = cuesFor({ ...project, pick: undefined, boards: [{}, {}] });
  assert.ok(!cues.some((c) => c.type === 'pick'));
  assert.ok(cues.some((c) => c.type === 'press' && c.at === 9100 && c.anchor === '.rl-boards .rl-ok'));
  const tiles = cuesFor(project).filter((c) => c.type === 'tile').map((c) => c.at);
  assert.deepEqual(tiles.slice(0, 3), [16200, 16320, 16440]);
});

test('cuesFor: no Approve on the preview; Download ends the kit; the studio cursor clears the due date', () => {
  const cues = cuesFor(project);
  assert.ok(!cues.some((c) => c.type === 'approve'));
  assert.ok(!cues.some((c) => typeof c.anchor === 'string' && c.anchor.includes('.rl-preview .rl-ok')));
  assert.deepEqual(cues.filter((c) => c.type === 'download').map((c) => c.at), [19500]);
  const click = cues.filter((c) => c.type === 'cursor' && c.who === 'studio' && c.anchor === '.rl-ntf');
  assert.ok(click.length && click.every((c) => c.fx >= 0.9 && c.fy >= 0.75));
});

test('cuesFor: beat 1 reads every tag, rests longest on the release date, then the directions appear', () => {
  const cues = cuesFor(project);
  const chips = cues.filter((c) => c.type === 'chip' && c.i >= 0);
  assert.deepEqual(chips.map((c) => c.i), [0, 1, 2]);
  const lastStart = chips.at(-1).at, clear = cues.find((c) => c.type === 'chip' && c.i === -1).at;
  assert.ok(clear - lastStart > chips[1].at - chips[0].at);       // the date gets the longest look
  assert.ok(chips.every((c) => c.at < BEATS.notification[1]));
  assert.ok(!cues.some((c) => c.type === 'spread' || c.type === 'gather'));
  assert.equal(cues.find((c) => c.type === 'show' && c.target === 'boards').at, BEATS.directions[0]);
});

test('runner fires cues in order and ends', () => {
  const clk = fakeClock(); const seen = [];
  const r = createRunner({ cues: cuesFor(project), apply: (c) => seen.push(c.type), ...clk });
  r.start(); clk.advance(22500);
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
  clk.advance(7000);
  assert.ok(seen.some(([t, at]) => t === 'beat' && at === 600000 + 3000 + 7000));  // preview beat lands at 10000 ms of round time
});

test('skip cancels pending cues', () => {
  const clk = fakeClock(); const seen = [];
  const r = createRunner({ cues: cuesFor(project), apply: (c) => seen.push(c.type), ...clk });
  r.start(); clk.advance(1000); r.skip();
  assert.equal(clk.pending(), 0); assert.equal(r.state(), 'done');
  const n = seen.length; clk.advance(22500); assert.equal(seen.length, n);
});

// Version 2 (src/rollout/version.js): the send, no preview beat.
import { BEATS_V2, ROUND_MS_V2, beatsFor } from '../src/rollout/timeline.js';
import { ROLLOUT_VERSION, pickVersion } from '../src/rollout/version.js';

test('v2: three beats plus clear, 16.5 s, no preview cues at all', () => {
  assert.equal(ROUND_MS_V2, 16500);
  assert.equal(beatsFor(2), BEATS_V2); assert.equal(beatsFor(1), BEATS);
  const cues = cuesFor(project, 2);
  assert.ok(cues.every((c, i) => i === 0 || c.at >= cues[i - 1].at));
  assert.deepEqual(cues.filter((c) => c.type === 'beat').map((c) => [c.name, c.at]), [['notification', 0], ['directions', 5000], ['delivered', 10000], ['clear', 14500]]);
  assert.ok(!cues.some((c) => ['video', 'tc', 'note', 'v2'].includes(c.type) || c.target === 'preview' || c.target === 'ntf'));
  assert.equal(cues.at(-1).type, 'end'); assert.equal(cues.at(-1).at, 16500);
  assert.equal(cues.filter((c) => c.type === 'tile').length, 1 + 3 + 2 + 1);
});

test('v2: the client looks over every file and the release tag, then presses Send inside beat 1', () => {
  const cues = cuesFor(project, 2);
  const looks = cues.filter((c) => c.type === 'file' && c.i >= 0).map((c) => c.i);
  assert.deepEqual(looks, [0, 1, 2]);   // master.wav, 6 photos, release tag
  const press = cues.find((c) => c.type === 'press' && c.anchor === '.rl-send__btn');
  const sent = cues.find((c) => c.type === 'sent');
  assert.ok(press && sent && press.at < sent.at && sent.at < BEATS_V2.notification[1]);
  assert.ok(cues.filter((c) => c.type === 'cursor').every((c) => c.who === 'client'));
  assert.ok(cues.find((c) => c.type === 'hide' && c.target === 'send').at > sent.at && cues.find((c) => c.type === 'hide' && c.target === 'send').at <= BEATS_V2.directions[0]);
  const dl = cues.find((c) => c.type === 'reveal' && c.anchor === '.rl-kit .rl-ok'), lastTile = cues.filter((c) => c.type === 'tile').at(-1);
  assert.ok(dl.at > lastTile.at);
});

test('v1 is untouched by default; the version switch and ?rv override', () => {
  assert.deepEqual(cuesFor(project), cuesFor(project, 1));
  assert.ok([1, 2].includes(ROLLOUT_VERSION));
  assert.equal(pickVersion('?rv=1'), 1); assert.equal(pickVersion('?a=b&rv=2'), 2);
  assert.equal(pickVersion('?rv=9'), ROLLOUT_VERSION); assert.equal(pickVersion(''), ROLLOUT_VERSION);
});

test('v2: every button is revealed after its stage graphics and before the cursor reaches it', () => {
  const cues = cuesFor({ ...project, pick: undefined }, 2);
  for (const sel of ['.rl-send__btn', '.rl-boards .rl-ok', '.rl-kit .rl-ok']) {
    const shown = cues.find((c) => c.type === 'reveal' && c.anchor === sel);
    const reached = cues.find((c) => c.type === 'cursor' && c.anchor === sel && c.show);
    assert.ok(shown && reached && shown.at < reached.at, sel);
  }
  const lastLook = cues.filter((c) => c.type === 'file' && c.i >= 0).at(-1);
  assert.ok(cues.find((c) => c.type === 'reveal' && c.anchor === '.rl-send__btn').at > lastLook.at);
});
