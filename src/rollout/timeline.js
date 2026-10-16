// The Rollout's clock: one 20-second round per project as a sorted list of
// cues, and a runner that plays them, pauses without bursting, and skips.
// Pure: the renderer (render.js) turns cues into DOM changes.

export const ROUND_MS = 20000;
export const BEATS = {
  notification: [0, 2500],
  directions: [2500, 7500],
  preview: [7500, 13500],
  delivered: [13500, 18000],
  clear: [18000, 20000],
};

const NOTE_MS_PER_CHAR = 35;
const TILE_GAP = 120;

export function cuesFor(project) {
  const cues = [];
  const at = (t, cue) => cues.push({ at: t, ...cue });
  const boards = project.boards || [];
  const tiles = project.tiles || {};

  // Beat 1: the notification drops in, the studio cursor clicks it.
  at(BEATS.notification[0], { type: 'beat', name: 'notification' });
  at(200, { type: 'show', target: 'ntf' });
  at(1200, { type: 'cursor', who: 'studio', anchor: '.rl-ntf', show: true });
  at(2000, { type: 'press', anchor: '.rl-ntf' });
  at(2400, { type: 'cursor', who: 'studio', anchor: '.rl-ntf', show: false });

  // Beat 2: boards fan out, the client browses, picks one or approves the last.
  at(BEATS.directions[0], { type: 'beat', name: 'directions' });
  at(2500, { type: 'hide', target: 'ntf' });
  at(2500, { type: 'show', target: 'boards' });
  const step = boards.length ? 3000 / boards.length : 3000;
  boards.forEach((_, i) => {
    at(3600 + i * step, { type: 'cursor', who: 'client', anchor: `.rl-board[data-i="${i}"]`, show: true });
    at(3600 + i * step, { type: 'hover', i });
  });
  if (project.pick !== undefined) {
    at(6400, { type: 'cursor', who: 'client', anchor: `.rl-board[data-i="${project.pick}"]`, show: true });
    at(6600, { type: 'pick', i: project.pick });
  } else {
    const last = Math.max(boards.length - 1, 0);
    at(6400, { type: 'cursor', who: 'client', anchor: `.rl-board[data-i="${last}"] .rl-ok`, show: true });
    at(6600, { type: 'press', anchor: `.rl-board[data-i="${last}"] .rl-ok` });
  }

  // Beat 3: the preview plays, the client clicks the frame, a note types, v2, Approve.
  at(BEATS.preview[0], { type: 'beat', name: 'preview' });
  at(7500, { type: 'hide', target: 'boards' });
  at(7500, { type: 'show', target: 'preview' });
  at(7500, { type: 'video', action: 'play' });
  for (let k = 0; k < 6; k++) at(7500 + k * 1000, { type: 'tc', k });
  at(8600, { type: 'cursor', who: 'client', anchor: '.rl-preview__scr', show: true });
  at(9100, { type: 'press', anchor: '.rl-preview__scr' });
  const note = project.note || '';
  const noteCues = Math.ceil(note.length / 2);
  for (let j = 1; j <= noteCues; j++) at(9300 + (j * 2 - 1) * NOTE_MS_PER_CHAR, { type: 'note', chars: Math.min(j * 2, note.length) });
  const sendAt = 9300 + note.length * NOTE_MS_PER_CHAR + 300;
  at(sendAt, { type: 'send' });
  at(sendAt + 300, { type: 'v2' });
  at(12700, { type: 'cursor', who: 'client', anchor: '.rl-preview .rl-ok', show: true });
  at(13100, { type: 'approve', beat: 'preview' });

  // Beat 4: the kit lands, one Approve.
  at(BEATS.delivered[0], { type: 'beat', name: 'delivered' });
  at(13500, { type: 'hide', target: 'preview' });
  at(13500, { type: 'video', action: 'pause' });
  at(13500, { type: 'show', target: 'kit' });
  const tileCount = 1 + (tiles.reels?.length || 0) + (tiles.verticals?.length || 0) + (tiles.thumbs?.length ? 1 : 0) + (tiles.banner ? 1 : 0);
  for (let i = 0; i < tileCount; i++) at(13700 + i * TILE_GAP, { type: 'tile', i });
  at(16200, { type: 'cursor', who: 'client', anchor: '.rl-kit .rl-ok', show: true });
  at(17000, { type: 'approve', beat: 'delivered' });

  // Beat 5: clear.
  at(BEATS.clear[0], { type: 'beat', name: 'clear' });
  at(18000, { type: 'cursor', who: 'client', anchor: '.rl-kit .rl-ok', show: false });
  at(18000, { type: 'hide', target: 'kit' });
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
