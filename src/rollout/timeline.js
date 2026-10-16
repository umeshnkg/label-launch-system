// The Rollout's clock: one 22.5-second round per project as a sorted list of
// cues, and a runner that plays them, pauses without bursting, and skips.
// Pure: the renderer (render.js) turns cues into DOM changes.

export const ROUND_MS = 22500;
export const BEATS = {
  notification: [0, 5000],
  directions: [5000, 10000],
  preview: [10000, 16000],
  delivered: [16000, 20500],
  clear: [20500, 22500],
};

const NOTE_MS_PER_CHAR = 35;
// Buttons are clicked near their right edge so the cursor never hides the label.
const BTN = { fx: 0.86, fy: 0.7 };
const TILE_GAP = 120;
// Everything after beat 1 runs on the original 20-second plan, shifted by D.
const D = BEATS.directions[0] - 2500;

export function cuesFor(project) {
  const cues = [];
  const at = (t, cue) => cues.push({ at: t, ...cue });
  const boards = project.boards || [];
  const tiles = project.tiles || {};
  const chips = project.notification?.chips || [];

  // Beat 1: the notification drops in. The studio cursor reads it slowly, tag
  // by tag (the files, then the release date, which it rests on longest),
  // then clicks the notification's empty corner. The notification leaves and
  // the visual directions appear in its place.
  const NTF = { anchor: '.rl-ntf', fx: 0.94, fy: 0.8 };
  at(BEATS.notification[0], { type: 'beat', name: 'notification' });
  at(200, { type: 'show', target: 'ntf' });
  if (chips.length) {
    // The last (release-date) chip gets a double share of the reading time.
    const unit = 2800 / (chips.length + 1);
    chips.forEach((_, i) => {
      const t = 1000 + i * unit;
      at(t, { type: 'cursor', who: 'studio', anchor: `.rl-ntf__l3 i:nth-child(${i + 1})`, fx: 0.5, fy: 1, show: true });
      at(t + 200, { type: 'chip', i });
    });
  }
  at(3900, { type: 'chip', i: -1 });
  at(3900, { type: 'cursor', who: 'studio', ...NTF, show: true });
  at(4300, { type: 'press', anchor: '.rl-ntf' });
  at(4700, { type: 'cursor', who: 'studio', ...NTF, show: false });

  // Beat 2: the visual directions appear; the client browses, then picks one
  // or approves the set.
  at(BEATS.directions[0], { type: 'beat', name: 'directions' });
  at(D + 2500, { type: 'hide', target: 'ntf' });
  at(D + 2500, { type: 'show', target: 'boards' });
  const step = boards.length ? 3000 / boards.length : 3000;
  boards.forEach((_, i) => {
    at(D + 3600 + i * step, { type: 'cursor', who: 'client', anchor: `.rl-board[data-i="${i}"]`, show: true });
    at(D + 3600 + i * step, { type: 'hover', i });
  });
  if (project.pick !== undefined) {
    at(D + 6400, { type: 'cursor', who: 'client', anchor: `.rl-board[data-i="${project.pick}"]`, show: true });
    at(D + 6600, { type: 'pick', i: project.pick });
  } else {
    at(D + 6400, { type: 'cursor', who: 'client', anchor: '.rl-boards .rl-ok', ...BTN, show: true });
    at(D + 6600, { type: 'press', anchor: '.rl-boards .rl-ok' });
  }

  // Beat 3: the preview plays, the client clicks the frame, a note types, v2.
  // No Approve here: the comment is the action.
  at(BEATS.preview[0], { type: 'beat', name: 'preview' });
  at(D + 7500, { type: 'hide', target: 'boards' });
  at(D + 7500, { type: 'show', target: 'preview' });
  at(D + 7500, { type: 'video', action: 'play' });
  for (let k = 0; k < 6; k++) at(D + 7500 + k * 1000, { type: 'tc', k });
  at(D + 8600, { type: 'cursor', who: 'client', anchor: '.rl-preview__scr', show: true });
  at(D + 9100, { type: 'press', anchor: '.rl-preview__scr' });
  const note = project.note || '';
  const noteCues = Math.ceil(note.length / 2);
  for (let j = 1; j <= noteCues; j++) at(D + 9300 + (j * 2 - 1) * NOTE_MS_PER_CHAR, { type: 'note', chars: Math.min(j * 2, note.length) });
  const sendAt = D + 9300 + note.length * NOTE_MS_PER_CHAR + 300;
  at(sendAt, { type: 'send' });
  at(sendAt + 300, { type: 'v2' });
  at(D + 12900, { type: 'cursor', who: 'client', anchor: '.rl-note', show: false });

  // Beat 4: the kit lands, the client downloads it (confetti).
  at(BEATS.delivered[0], { type: 'beat', name: 'delivered' });
  at(D + 13500, { type: 'hide', target: 'preview' });
  at(D + 13500, { type: 'video', action: 'pause' });
  at(D + 13500, { type: 'show', target: 'kit' });
  const tileCount = 1 + (tiles.reels?.length || 0) + (tiles.verticals?.length || 0) + (tiles.thumbs?.length ? 1 : 0) + (tiles.banner ? 1 : 0);
  for (let i = 0; i < tileCount; i++) at(D + 13700 + i * TILE_GAP, { type: 'tile', i });
  at(D + 16200, { type: 'cursor', who: 'client', anchor: '.rl-kit .rl-ok', ...BTN, show: true });
  at(D + 17000, { type: 'download' });

  // Beat 5: clear.
  at(BEATS.clear[0], { type: 'beat', name: 'clear' });
  at(D + 18000, { type: 'cursor', who: 'client', anchor: '.rl-kit .rl-ok', show: false });
  // The kit stays up until the confetti has mostly landed.
  at(D + 19100, { type: 'hide', target: 'kit' });
  at(ROUND_MS, { type: 'end' });

  return cues.sort((a, b) => a.at - b.at);
}

export function createRunner({ cues, apply, now = () => performance.now(), setTimer = (fn, ms) => setTimeout(fn, ms), clearTimer = (id) => clearTimeout(id) }) {
  let state = 'idle';
  let startedAt = 0;      // clock time the round (re)started from, minus elapsed
  let pausedElapsed = 0;  // elapsed at the moment of pause
  let timers = [];

  const clearAll = () => { timers.forEach((id) => clearTimer(id)); timers = []; };
  const elapsed = () => (state === 'running' ? now() - startedAt : pausedElapsed);

  const schedule = (from) => {
    clearAll();
    startedAt = now() - from;
    for (const cue of cues) {
      if (cue.at < from) continue;
      const id = setTimer(() => {
        apply(cue);
        if (cue.type === 'end') { state = 'done'; pausedElapsed = cue.at; clearAll(); }
      }, cue.at - from);
      timers.push(id);
    }
  };

  return {
    start() { if (state === 'running') return; state = 'running'; schedule(0); },
    pause() { if (state !== 'running') return; pausedElapsed = now() - startedAt; clearAll(); state = 'paused'; },
    resume() { if (state !== 'paused') return; state = 'running'; schedule(pausedElapsed); },
    skip() { clearAll(); pausedElapsed = elapsed(); state = 'done'; },
    stop() { clearAll(); pausedElapsed = elapsed(); state = 'done'; },
    elapsed,
    state: () => state,
  };
}
