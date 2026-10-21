// Which Rollout plays in the hero. Both versions stay built; only this switch
// picks one, so going back is a one-line change.
//   1  the original (to 2026-10-20): macOS-style notification, then directions,
//      the 30-second preview, the kit. Four steps, 22.5 s.
//   2  (2026-10-20) the client sends the song: big iOS-style file icons with
//      their names, the release tag, one green Send the Label / Client cursor
//      clicks. The 30-second preview stage is off. Three steps, 16.5 s.
// To revert: set ROLLOUT_VERSION = 1. To compare without a deploy, add ?rv=1
// or ?rv=2 to the URL (works with the dev view too).
export const ROLLOUT_VERSION = 2;
export const VERSIONS = [1, 2];

// Version 2's audio file icon. 'app' = Apple's Music app icon (to 2026-10-21).
// 'page-*' = the macOS Finder document: a white page with the folded corner,
// the opening app's real icon on it and the format along the bottom.
// '-sm' shrinks a dark app icon; 'wave' draws the song's real loudness (story.wave).
// Preview any of them with ?audio=<name>.
export const AUDIO_ICONS = ['app', 'page-music', 'page-quicktime', 'page-logic', 'page-blank',
  'page-itunes', 'page-quicktime-sm', 'page-logic-sm', 'page-wave', 'page-wave-pink', 'page-music-wave'];
export const AUDIO_ICON = 'page-itunes';   // Umesh's pick 2026-10-21
export function pickAudioIcon(search = '') {
  const m = /[?&]audio=([\w-]+)/.exec(search);
  return m && AUDIO_ICONS.includes(m[1]) ? m[1] : AUDIO_ICON;
}

// Version 2's single-image files (cover art, artist photo): 'icon' = rounded
// app-style square (to 2026-10-21); 'page-fill' / 'page-inset' / 'page-label' =
// on the macOS document page; 'thumb' = Finder's bordered thumbnail. ?image= to preview.
export const IMAGE_ICONS = ['icon', 'page-fill', 'page-inset', 'page-label', 'thumb'];
export const IMAGE_ICON = 'thumb';   // Umesh's pick 2026-10-21: Finder thumbnail, white border, natural shape
export function pickImageIcon(search = '') {
  const m = /[?&]image=([\w-]+)/.exec(search);
  return m && IMAGE_ICONS.includes(m[1]) ? m[1] : IMAGE_ICON;
}

export function pickVersion(search = '') {
  const m = /[?&]rv=(\d+)/.exec(search);
  const v = m ? Number(m[1]) : ROLLOUT_VERSION;
  return VERSIONS.includes(v) ? v : ROLLOUT_VERSION;
}
