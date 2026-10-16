// The Rollout: the homepage hero. One 20-second round per project, in this
// order; `on: false` keeps a project built but out of the rotation.
//
// An entry is either { slug } (facts pulled from FEATURED in releases.js) or
// { record } (a project with no case page; same fields as a FEATURED entry).
// `story` is what the hero shows that the case page does not:
//   input        'song' | 'song+cover' | 'song+images'  (the notification icon)
//   files        short chips on the notification (never let a line wrap at 360 px:
//                the derive test enforces heading ≤ 24, line2 ≤ 34, chips ≤ 30 chars)
//   inputImages  1 or 2 photos fanned behind the icon when input is song+images
//   inputCount   the red file count on that icon
//   boards       2 to 4 real boards from the treatment or delivery, with palette
//   pick         index of the board the client chose; omit when they approved the look
//   preview      the 4 to 6 s muted clip + poster under public/kit/rollout/
//   note         the one-line client note (illustrative unless noteSource says a thread)
//   change       what v2 visibly changes: a type weight pair and a swatch pair
//   motionCover  optional Apple Music tile for the kit (hero only)
// Rules: every file is from that project's Dropbox folder; no names on cursors;
// no view counts or dates; the release tag is computed from ordered/released.
// Design: E:\Obsidian Vaults\UG Brain\plan\label-launch-system-site\02-hero-rollout-animation-design.md

export const ROLLOUT = [
  { slug: 'paradise', on: true, story: {
    input: 'song+images', files: ['master.wav', '6 photos'],
    inputImages: ['/kit/paradise-lunax-photo.webp', '/kit/paradise-ceres-photo.webp'], inputCount: 7,
    boards: [
      { img: '/kit/paradise-moodboard.webp', palette: ['#fe3864', '#f6e80b', '#3ebfd5', '#09212b', '#f5f3ef'], source: 'delivery', label: 'Mood board' },
      { img: '/kit/paradise-styleframes.webp', palette: ['#3ebfd5', '#09212b', '#fe3864', '#f5f3ef', '#f6e80b'], source: 'delivery', label: 'Style frames' },
    ],
    // No pick: Beat Dealer approved the mood board and style frames together.
    preview: { video: '/kit/rollout/paradise-preview.mp4', poster: '/kit/rollout/paradise-preview.webp' },
    note: 'This is cool. Can we try a bolder font and the red for the chorus?', noteSource: 'illustrative',
    change: { weight: ['500', '800'], swatch: ['#3ebfd5', '#fe3864'] },
    // Delivered Apple Motion Cover (2 in Dropbox); shown in the hero only, the case page leaves them out.
    motionCover: { poster: '/kit/canvas-paradise-neutral-poster.webp' },
  } },
];
