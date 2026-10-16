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

  // Super Girl (Divi Roxx Kids, IROXX). No case page, so the record lives here.
  // Boards are the treatment's Moodboard and Character Design pages. The label
  // sent the song with the existing Starchild character (two sheets). Dates:
  // ClickUp order created 2026-08-16, release due 2026-10-23 (the YouTube
  // premiere is scheduled, the upload is listed on the channel but not public
  // on 2026-10-16). Title and card follow the label's own upload title.
  { on: true, record: {
    slug: 'supergirl', id: 'LJlX5L_cDVs', title: 'Super Girl', artist: 'Divi Roxx Kids',
    ordered: '2026-08-16', released: '2026-10-23',
    kit: [
      { type: 'yt', n: 1 },
      { type: 'pack', ui: 'reels', n: 4, unit: 'cuts', items: [
        { poster: '/kit/rollout/supergirl-promo-1.webp', label: 'Teaser' },
        { poster: '/kit/rollout/supergirl-promo-2.webp', label: 'Teaser, with lyrics' },
        { poster: '/kit/rollout/supergirl-promo-3.webp', label: 'Promo, Out Now' },
      ] },
      { type: 'ab', n: 7, items: ['/kit/rollout/supergirl-thumb-1.webp', '/kit/rollout/supergirl-thumb-2.webp', '/kit/rollout/supergirl-thumb-3.webp'] },
    ],
    reel: { account: 'Divi Roxx Kids', avatar: '/channels/divi-roxx-kids.jpg', caption: 'Super Girl, out now', audio: 'Divi Roxx Kids · Super Girl' },
  }, story: {
    input: 'song+images', files: ['master.wav', '2 sheets'],
    inputImages: ['/kit/rollout/supergirl-sheet-1.webp', '/kit/rollout/supergirl-sheet-2.webp'], inputCount: 3,
    boards: [
      { img: '/kit/rollout/supergirl-board-a.webp', palette: ['#6a3fc0', '#ff5fa2', '#ffd23f', '#2fb6c8', '#f6f1ff'], source: 'delivery', label: 'Mood board' },
      { img: '/kit/rollout/supergirl-board-b.webp', palette: ['#7b4fcf', '#ffcf5a', '#2b1b3d', '#c9a3ff', '#f1ede8'], source: 'delivery', label: 'Character' },
    ],
    // No pick: one costume was designed from the reference; the label approved it.
    preview: { video: '/kit/rollout/supergirl-preview.mp4', poster: '/kit/rollout/supergirl-preview.webp' },
    note: 'Love it. Can the cape catch more light in the chorus?', noteSource: 'illustrative',
    change: { weight: ['500', '800'], swatch: ['#6a3fc0', '#ff5fa2'] },
  } },

  // La Cuerda (CHIP MANTRA, 2023). Off: no public YouTube upload was found on
  // 2026-10-16, so the card uses a placeholder id and the delivered thumbnail.
  // Flip `on` and set the real `id` when the video is public. Boards are two
  // pages of the illustrated storyboard (Storyboard_V2.pdf). No ClickUp task
  // was found, so the release tag reads "Date set".
  { on: false, record: {
    slug: 'la-cuerda', id: 'la-cuerda-lyric', title: 'La Cuerda', artist: 'CHIP MANTRA',
    thumb: '/kit/rollout/lacuerda-thumb-1.webp',
    kit: [
      { type: 'yt', n: 1 },
      { type: 'pack', ui: 'reels', n: 4, unit: 'cuts', items: [
        { poster: '/kit/rollout/lacuerda-promo-story-soon.webp', label: 'Story, Coming Soon' },
        { poster: '/kit/rollout/lacuerda-promo-story-now.webp', label: 'Story, Out Now' },
        { poster: '/kit/rollout/lacuerda-promo-feed-now.webp', label: 'Feed, Out Now' },
      ] },
      { type: 'pack', ui: 'spotify', n: 2, unit: 'versions', items: [
        { poster: '/kit/rollout/lacuerda-canvas-1.webp', label: 'Canvas' },
        { poster: '/kit/rollout/lacuerda-canvas-2.webp', label: 'Canvas, title' },
      ] },
      { type: 'ab', n: 7, items: ['/kit/rollout/lacuerda-thumb-1.webp', '/kit/rollout/lacuerda-thumb-2.webp', '/kit/rollout/lacuerda-thumb-3.webp'] },
    ],
    reel: { account: 'CHIP MANTRA', avatar: '/kit/rollout/lacuerda-canvas-1.webp', caption: 'La Cuerda, out now', audio: 'CHIP MANTRA · La Cuerda' },
  }, story: {
    input: 'song', files: ['LaCuerda.wav'],
    boards: [
      { img: '/kit/rollout/lacuerda-board-a.webp', palette: ['#111111', '#ffffff', '#e5261f', '#7a7a7a', '#2a2a2a'], source: 'delivery', label: 'Storyboard 1' },
      { img: '/kit/rollout/lacuerda-board-b.webp', palette: ['#111111', '#e5261f', '#ffffff', '#2a2a2a', '#7a7a7a'], source: 'delivery', label: 'Storyboard 2' },
    ],
    preview: { video: '/kit/rollout/lacuerda-preview.mp4', poster: '/kit/rollout/lacuerda-preview.webp' },
    note: 'Perfect. One more frame with the whale?', noteSource: 'illustrative',
    change: { weight: ['500', '800'], swatch: ['#ffffff', '#e5261f'] },
  } },

  // Bio Dad (Riki Lindhome). Animated lyric video delivered 2026-05-27 with the
  // cover, 7 thumbnails, 2 teasers, 3 trailers and 3 Out Now clips. The lyric
  // video is not on her channel yet (2026-10-16; her live-action comedy video
  // vS0etuxv4X8 is), so the YouTube card shows the delivered thumbnail design
  // and the delivery's title under a placeholder id; swap `id` and `thumb` for
  // the real upload when she posts it. Dates: ClickUp order 2026-02-13, the
  // song's release 2026-03-23. Boards: the treatment's Main Character and
  // Style Frames pages (the PDF copies; replace with originals if Umesh has them).
  { on: true, record: {
    slug: 'bio-dad', id: 'bio-dad-lyric', title: 'Bio Dad', artist: 'Riki Lindhome',
    ordered: '2026-02-13', released: '2026-03-23',
    thumb: '/kit/rollout/biodad-thumb-1.webp', cover: '/kit/rollout/biodad-cover.webp',
    kit: [
      { type: 'yt', n: 1 },
      { type: 'pack', ui: 'reels', n: 8, unit: 'cuts', items: [
        { poster: '/kit/rollout/biodad-promo-1.webp', label: 'Teaser 1' },
        { poster: '/kit/rollout/biodad-promo-2.webp', label: 'Teaser 2' },
        { poster: '/kit/rollout/biodad-promo-3.webp', label: 'Out Now' },
      ] },
      { type: 'ab', n: 7, items: ['/kit/rollout/biodad-thumb-1.webp', '/kit/rollout/biodad-thumb-2.webp', '/kit/rollout/biodad-thumb-3.webp'] },
    ],
    reel: { account: 'Riki Lindhome', avatar: '/channels/riki-lindhome.jpg', caption: 'Bio Dad, out now', audio: 'Riki Lindhome · Bio Dad' },
  }, story: {
    input: 'song+cover', files: ['BioDad.wav', 'cover.jpg'],
    boards: [
      { img: '/kit/rollout/biodad-board-a.webp', palette: ['#d7262f', '#f5d36b', '#f7e3c6', '#2b2b2b', '#ffffff'], source: 'delivery', label: 'Character' },
      { img: '/kit/rollout/biodad-board-b.webp', palette: ['#d7262f', '#ffd98a', '#6fa8dc', '#2b2b2b', '#fff7e6'], source: 'delivery', label: 'Style frames' },
    ],
    // No pick: the character and the four style frames were approved as the look.
    preview: { video: '/kit/rollout/biodad-preview.mp4', poster: '/kit/rollout/biodad-preview.webp' },
    note: 'This is great. Could the stork look a little more worried?', noteSource: 'illustrative',
    change: { weight: ['500', '800'], swatch: ['#f5d36b', '#d7262f'] },
  } },

  // I'M FREE (J McAllister, AI animation, 2025). Off: the ClickUp order is "on
  // hold" and no public upload exists (2026-10-16). Board A is a site-made tile
  // of the project's own mural mood board references (source: 'site', to be
  // saved into the project's Dropbox folder, see ClickUp); board B tiles four
  // delivered character stills. The delivery has no thumbnails, so the card
  // uses the stills board. ClickUp order created 2025-07-07; no release date.
  { on: false, record: {
    slug: 'im-free', id: 'imfree-lyric', title: "I'M FREE", artist: 'J McAllister',
    ordered: '2025-07-07',
    thumb: '/kit/rollout/imfree-board-b.webp',
    kit: [
      { type: 'yt', n: 1 },
      { type: 'pack', ui: 'reels', n: 30, unit: 'cuts', items: [
        { poster: '/kit/rollout/imfree-promo-1.webp', label: 'Coming Soon 1' },
        { poster: '/kit/rollout/imfree-promo-2.webp', label: 'Coming Soon 2' },
        { poster: '/kit/rollout/imfree-promo-3.webp', label: 'Coming Soon 3' },
      ] },
    ],
    reel: { account: 'J McAllister', avatar: '/kit/rollout/imfree-promo-1.webp', caption: "I'M FREE, coming soon", audio: "J McAllister · I'M FREE" },
  }, story: {
    input: 'song', files: ['ImFree.wav'],
    boards: [
      { img: '/kit/rollout/imfree-board-a.webp', palette: ['#2f3344', '#a33909', '#c3b293', '#7a4343', '#fbf1e2'], source: 'site', label: 'Mood board' },
      { img: '/kit/rollout/imfree-board-b.webp', palette: ['#a33909', '#3d2410', '#9c7f5b', '#91acb5', '#e6dbc4'], source: 'delivery', label: 'Characters' },
    ],
    preview: { video: '/kit/rollout/imfree-preview.mp4', poster: '/kit/rollout/imfree-preview.webp' },
    note: 'Love the mural. Can James look up in the last shot?', noteSource: 'illustrative',
    change: { weight: ['500', '800'], swatch: ['#91acb5', '#a33909'] },
  } },

  // Rock It Out (Divi Roxx Kids, IROXX). Off by default: Umesh finds it
  // near-identical to Super Girl (2026-10-16); flip `on` to rotate it. The
  // only project with a real pick: the treatment offered four costumes and the
  // purple studded jacket (board index 2 here) is the one in the finished
  // video; the stage holds four boards, so costume four is left out. Dates:
  // ClickUp order 2026-08-16, due 2026-10-16. The YouTube video fYIrojE_OmM
  // reported "not available" to yt-dlp on 2026-10-16 (it had 19,966 views on
  // 2026-10-07); the card keeps the site's existing entry.
  { on: false, record: {
    slug: 'rock-it-out', id: 'fYIrojE_OmM', title: 'Rock It Out', artist: 'Divi Roxx Kids',
    ordered: '2026-08-16', released: '2026-10-16',
    banner: '/kit/rollout/rockitout-banner.webp',
    kit: [
      { type: 'yt', n: 1 },
      { type: 'pack', ui: 'reels', n: 3, unit: 'cuts', items: [
        { poster: '/kit/rollout/rockitout-promo-short.webp', label: 'Short trailer', video: '/kit/rockitout-short.mp4' },
        { poster: '/kit/rollout/rockitout-promo-teaser.webp', label: 'Teaser', video: '/kit/rockitout-teaser.mp4' },
      ] },
      { type: 'ab', n: 11, items: ['/kit/rollout/rockitout-thumb-01.webp', '/kit/rollout/rockitout-thumb-02.webp', '/kit/rollout/rockitout-thumb-05.webp'] },
    ],
  }, story: {
    input: 'song+images', files: ['master.wav', '2 sheets'],
    inputImages: ['/kit/rollout/rockitout-sheet-1.webp', '/kit/rollout/rockitout-sheet-2.webp'], inputCount: 3,
    boards: [
      { img: '/kit/rollout/rockitout-board-a.webp', palette: ['#A6E02F', '#FF8904', '#FF22BD', '#C22BFF', '#0FCBF5'], source: 'delivery', label: 'Mood board' },
      { img: '/kit/rollout/rockitout-costume-1.webp', palette: ['#FF8904', '#A6E02F', '#FF22BD', '#0FCBF5', '#C22BFF'], source: 'delivery', label: 'Costume A' },
      { img: '/kit/rollout/rockitout-costume-2.webp', palette: ['#C22BFF', '#0b0b0c', '#FF22BD', '#0FCBF5', '#A6E02F'], source: 'delivery', label: 'Costume B' },
      { img: '/kit/rollout/rockitout-costume-3.webp', palette: ['#FF22BD', '#A6E02F', '#0FCBF5', '#FF8904', '#f5f5f5'], source: 'delivery', label: 'Costume C' },
    ],
    pick: 2,
    preview: { video: '/kit/rollout/rockitout-preview.mp4', poster: '/kit/rollout/rockitout-preview.webp' },
    note: 'So fun. Can the lightning hit on the chorus?', noteSource: 'illustrative',
    change: { weight: ['500', '800'], swatch: ['#0FCBF5', '#FF22BD'] },
  } },
];
