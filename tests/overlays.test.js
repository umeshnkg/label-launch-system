import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spotifyOverlay, reelsOverlay, appleOverlay, esc } from '../src/overlays.js';

test('spotify overlay carries title, artist, bar, time and five controls', () => {
  const h = spotifyOverlay({ title: 'Paradise', artist: 'LUNAX ft. CERES' });
  assert.match(h, /^\s*<span class="sp" aria-hidden="true">/);
  assert.match(h, /<b>Paradise<\/b><span>LUNAX ft\. CERES<\/span>/);
  assert.match(h, /sp__bar/); assert.match(h, /0:48/); assert.match(h, /-2:14/);
  assert.equal((h.match(/<svg /g) || []).length, 5);
});

test('reels overlay carries account, avatar, caption, audio', () => {
  const h = reelsOverlay({ account: 'LUNAX', avatar: '/channels/lunax.jpg', caption: 'Paradise, out now', audio: 'LUNAX, CERES · Paradise' });
  assert.match(h, /class="ig"/); assert.match(h, /src="\/channels\/lunax\.jpg"/);
  assert.match(h, /<b>LUNAX<\/b><i>Follow<\/i>/); assert.match(h, /♫ LUNAX, CERES · Paradise/);
});

test('apple overlay carries title, artist, bar and three controls', () => {
  const h = appleOverlay({ title: 'Paradise', artist: 'LUNAX' });
  assert.match(h, /class="am"/); assert.match(h, /am__bar/);
  assert.equal((h.match(/<svg /g) || []).length, 3);
});

test('esc escapes the five HTML characters', () => {
  assert.equal(esc(`<a href="x">&'`), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
});
