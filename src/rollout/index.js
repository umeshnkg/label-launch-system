// Mounts the Rollout into the hero: plays one project after another, pauses
// when the stage is off-screen or the tab is hidden, skips on tap, and falls
// back to a still for reduced-motion and to posters for save-data visitors.
import { cuesFor, createRunner, BEATS } from './timeline.js';
import { renderProject, applyCue } from './render.js';

const prefetched = new Set();
function prefetch(project, saveData) {
  for (const url of project.assets || []) {
    if (prefetched.has(url)) continue;
    if (url.endsWith('.mp4') && saveData) continue;
    prefetched.add(url);
    if (url.endsWith('.mp4')) {
      const l = document.createElement('link'); l.rel = 'prefetch'; l.as = 'video'; l.href = url; document.head.append(l);
    } else { const i = new Image(); i.src = url; }
  }
}

/* Apply every cue of the round before `untilMs`, skipping the ones that need time. */
function applyUntil(stage, project, untilMs) {
  for (const cue of cuesFor(project)) {
    if (cue.at >= untilMs) break;
    if (cue.type === 'video' || cue.type === 'cursor') continue;
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
} = {}) {
  const n = projects?.length || 0;
  if (!root || !n) return null;
  root.dataset.projects = String(n);

  let idx = 0, stage = null, runner = null, swapping = false, inView = false, destroyed = false;
  let hidden = typeof document !== 'undefined' && document.hidden;

  const place = (p) => {
    if (stage) stage.remove();
    stage = renderProject(p);
    if (saveData) stage.dataset.nomp4 = '1';
    root.prepend(stage);
    root.dataset.project = p.slug;
    return stage;
  };

  // Dev view: /?rollout=beat:<name> freezes project 0 at the end of that beat.
  const m = typeof location !== 'undefined' && location.search.match(/rollout=beat:(\w+)/);
  if (m && BEATS[m[1]]) {
    place(projects[0]);
    for (const cue of cuesFor(projects[0])) { if (cue.at >= BEATS[m[1]][1]) break; if (cue.type !== 'video') applyCue(stage, cue); }
    return { next() {}, pause() {}, resume() {}, destroy() { stage?.remove(); } };
  }

  // Reduced motion: the delivered frame, no cursors, a real Next button.
  if (reducedMotion) {
    const showStill = () => { place(projects[idx]); applyUntil(stage, projects[idx], BEATS.clear[0]); };
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'rl-next'; btn.textContent = 'Next';
    btn.addEventListener('click', (e) => { e.stopPropagation(); idx = (idx + 1) % n; showStill(); });
    root.append(btn);
    showStill();
    return { next() { btn.click(); }, pause() {}, resume() {}, destroy() { destroyed = true; stage?.remove(); btn.remove(); } };
  }

  const play = () => {
    if (!runner || destroyed || hidden || !inView) return;
    if (runner.state() === 'idle') runner.start();
    else if (runner.state() === 'paused') runner.resume();
  };

  const show = (i) => {
    const p = projects[i];
    place(p);
    runner = createRunner({
      cues: cuesFor(p),
      apply: (cue) => {
        applyCue(stage, cue);
        if (cue.type === 'beat' && cue.name === 'preview') prefetch(projects[(i + 1) % n], saveData);
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
      if (inView) play(); else runner?.pause();
    }
  }, { threshold: [0, 0.3, 0.6] });
  io.observe(root);

  const onVis = () => { hidden = document.hidden; if (hidden) runner?.pause(); else play(); };
  document.addEventListener('visibilitychange', onVis);

  show(idx);

  return {
    next,
    pause() { runner?.pause(); },
    resume() { play(); },
    destroy() { destroyed = true; runner?.stop(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); stage?.remove(); skipBtn.remove(); },
  };
}
