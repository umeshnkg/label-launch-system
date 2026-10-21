// Mounts the Rollout into the hero: plays one project after another, pauses
// when the stage is off-screen or the tab is hidden, skips on tap, and falls
// back to a still for reduced-motion and to posters for save-data visitors.
import { cuesFor, createRunner, BEATS, beatsFor } from './timeline.js';
import { renderProject, applyCue, hydrate } from './render.js';

/* Later-beat images load after the page's own load event (or at once if it
   has already fired), so the hero's first paint is never starved by them. */
function hydrateWhenLoaded(stage) {
  if (typeof document === 'undefined' || document.readyState === 'complete') { hydrate(stage); return; }
  window.addEventListener('load', () => hydrate(stage), { once: true });
}

const prefetched = new Set();
function prefetch(project, saveData, version = 1) {
  // Version 2 shows no preview, so its clip and poster are never fetched.
  const skip = version === 2 ? [project.preview?.video, project.preview?.poster] : [];
  for (const url of project.assets || []) {
    if (skip.includes(url)) continue;
    if (prefetched.has(url)) continue;
    if (url.endsWith('.mp4') && saveData) continue;
    prefetched.add(url);
    if (url.endsWith('.mp4')) {
      const l = document.createElement('link'); l.rel = 'prefetch'; l.as = 'video'; l.href = url; document.head.append(l);
    } else { const i = new Image(); i.src = url; }
  }
}

/* Apply every cue of the round before `untilMs`, skipping the ones that need time. */
function applyUntil(stage, project, untilMs, version = 1) {
  for (const cue of cuesFor(project, version)) {
    if (cue.at >= untilMs) break;
    if (cue.type === 'video' || cue.type === 'cursor' || cue.type === 'download') continue;
    applyCue(stage, cue);
  }
  // Pressed states release on a timer; settle them now.
  stage.querySelectorAll('.is-pressed').forEach((el) => el.classList.remove('is-pressed'));
  stage.querySelectorAll('.rl-ok').forEach((el) => { if (el.closest('.rl-kit') && stage.dataset.beat === 'delivered') el.classList.add('is-approved'); });
}

export function mountRollout(root, {
  projects,
  reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  saveData = !!(navigator.connection && navigator.connection.saveData) || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-data: reduce)').matches),
  version = 1,   // see version.js
} = {}) {
  const BEATS_ = beatsFor(version);
  const n = projects?.length || 0;
  if (!root || !n) return null;
  root.dataset.projects = String(n);
  // Version 1 was designed for a 2:1 stage (rollout.css sets 2.4:1 for version 2).
  if (version !== 2 && typeof document !== 'undefined') { document.documentElement.style.setProperty('--rollout-ar', '2 / 1'); document.documentElement.style.setProperty('--rollout-k', '2'); document.documentElement.style.setProperty('--rollout-ar-m', '16 / 9'); }

  let idx = 0, stage = null, runner = null, swapping = false, inView = false, destroyed = false;
  let hidden = typeof document !== 'undefined' && document.hidden;

  const place = (p) => {
    if (stage) stage.remove();
    stage = renderProject(p, version);
    if (saveData) stage.dataset.nomp4 = '1';
    root.prepend(stage);
    root.dataset.project = p.slug;
    hydrateWhenLoaded(stage);
    return stage;
  };

  // Dev view: /?rollout=beat:<name>[&p=<index>] freezes a project at the end of that beat.
  const m = typeof location !== 'undefined' && location.search.match(/rollout=beat:(\w+)/);
  if (m && BEATS_[m[1]]) {
    const pi = Math.min(n - 1, Math.max(0, Number((location.search.match(/[?&]p=(\d+)/) || [])[1] || 0)));
    place(projects[pi]);
    for (const cue of cuesFor(projects[pi], version)) { if (cue.at >= BEATS_[m[1]][1]) break; if (cue.type !== 'video') applyCue(stage, cue); }
    return { next() {}, pause() {}, resume() {}, destroy() { stage?.remove(); } };
  }

  // Reduced motion: the delivered frame, no cursors, a real Next button.
  if (reducedMotion) {
    const showStill = () => { place(projects[idx]); applyUntil(stage, projects[idx], BEATS_.clear[0], version); };
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'rl-next'; btn.textContent = 'Next';
    btn.addEventListener('click', (e) => { e.stopPropagation(); idx = (idx + 1) % n; showStill(); });
    root.append(btn);
    showStill();
    return { next() { btn.click(); }, pause() {}, resume() {}, destroy() { destroyed = true; stage?.remove(); btn.remove(); } };
  }

  // The preview clip follows the round: it stops when the round pauses and
  // picks up again on resume (the cues restart it at the beat's start anyway).
  const video = () => stage?.querySelector('.rl-preview video');
  const pause = () => { runner?.pause(); video()?.pause(); stage?.classList.add('is-paused'); };
  const play = () => {
    if (!runner || destroyed || hidden || !inView) return;
    stage?.classList.remove('is-paused');
    if (runner.state() === 'idle') runner.start();
    else if (runner.state() === 'paused') {
      runner.resume();
      const v = video();
      if (v && stage.dataset.beat === 'preview' && !saveData && v.getAttribute('src')) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
    }
  };

  const show = (i) => {
    const p = projects[i];
    place(p);
    runner = createRunner({
      cues: cuesFor(p, version),
      apply: (cue) => {
        applyCue(stage, cue);
        if (cue.type === 'beat' && cue.name === 'preview') prefetch(projects[(i + 1) % n], saveData);
        // Version 2 has no preview beat; the next project loads during the directions.
        if (version === 2 && cue.type === 'beat' && cue.name === 'directions') prefetch(projects[(i + 1) % n], saveData, version);
        if (cue.type === 'end' && !destroyed) setTimeout(() => { if (!destroyed && runner && runner.state() === 'done') { idx = (i + 1) % n; show(idx); } }, 0);
      },
    });
    play();
  };

  const next = () => {
    if (swapping || destroyed) return;
    swapping = true;
    runner?.skip();
    idx = (idx + 1) % n;
    show(idx);
    setTimeout(() => { swapping = false; }, 350);
  };

  const skipBtn = document.createElement('button');
  skipBtn.type = 'button'; skipBtn.className = 'rl-skip'; skipBtn.textContent = 'Next project';
  skipBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  root.append(skipBtn);
  root.addEventListener('click', (e) => { if (e.target !== skipBtn) next(); });

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      inView = e.intersectionRatio >= 0.3;
      if (inView) play(); else pause();
    }
  }, { threshold: [0, 0.3, 0.6] });
  io.observe(root);

  const onVis = () => { hidden = document.hidden; if (hidden) pause(); else play(); };
  document.addEventListener('visibilitychange', onVis);

  show(idx);

  return {
    next,
    pause,
    resume() { play(); },
    destroy() { destroyed = true; runner?.stop(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); stage?.remove(); skipBtn.remove(); },
  };
}
