// The Rollout: the homepage hero. One 20-second round per project, in this
// order; `on: false` keeps a project built but out of the rotation.
//
// An entry is either { slug } (facts pulled from FEATURED in releases.js) or
// { record } (a project with no case page; same fields as a FEATURED entry).
// `story` is what the hero shows that the case page does not:
//   input        'song' | 'song+cover' | 'song+images' | 'song+photo'  (the notification icon)
//   files        what the client actually sent: the audio file plus a plain
//                label for any assets ('Cover artwork', '6 photos', 'Artist photo').
//                Never list something we made. (never let a line wrap at 360 px:
//                the derive test enforces heading ≤ 24, line2 ≤ 34, chips ≤ 30 chars)
//   inputImages  1 or 2 photos fanned behind the icon when input is song+images
//   inputCount   the red file count on that icon
//   boards       2 to 4 real boards from the treatment or delivery, with palette;
//                `from` = the client's file a board was built from (shown as an
//                inset with an arrow, e.g. the cover the character came from)
//   pick         index of the board the client chose; omit when they approved the look
//   preview      the 4 to 6 s muted clip + poster under public/kit/rollout/
//   note         the one-line client note (illustrative unless noteSource says a thread)
//   change       what v2 visibly changes: a type weight pair and a swatch pair
//   motionCover  optional Apple Music tile for the kit (hero only)
// Version 2 only (src/rollout/version.js), ignored by version 1:
//   fileNames    the names under the big file icons, as real files ('coverart.jpeg');
//                defaults to `files`
//   inputFocus   object-position per inputImage so faces stay in the square icon
//   sendImages   square, face-framed images for the stack instead of inputImages
//   boards[].fromCrop  a 3:4 crop of the `from` file framed on the person, set
//                next to the cartoon (no caption, no arrow); fromPlace: 'in' sits
//                it inside the board's empty left margin instead of on the edge
//   releaseTag   overrides the computed release tag (Umesh's call per project)
//   wave         28 loudness values (0.15..1) of the real master, drawn on the audio file icon
//   reelPick     indices of the reel posters to show when some look alike
//                (Umesh, 2026-10-20: never two identical; one Instagram, one TikTok)
//   mockCanvases ONE 9:16 Spotify Canvas mockup for a project that had none
//                (Umesh, 2026-10-20: every kit shows Canvases). Cut from the
//                project's own preview frames, saved as <slug>-canvas-mock-N.webp.
// Rules: every file is from that project's Dropbox folder; no names on cursors;
// no view counts or dates; the release tag is computed from ordered/released.
// Design: E:\Obsidian Vaults\UG Brain\plan\label-launch-system-site\02-hero-rollout-animation-design.md

export const ROLLOUT = [
  { slug: 'paradise', on: true, story: {
    input: 'song+images', files: ['master.wav', '6 photos'],
    wave: [0.31,  0.54,  0.52,  0.63,  0.62,  0.61,  0.7,  0.99,  0.93,  0.99,  0.94,  0.87,  0.89,  0.97,  0.72,  0.61,  0.48,  0.63,  0.65,  0.61,  0.67,  0.99,  0.92,  0.99,  0.96,  1.0,  1.0,  0.15],   // loudness of the real master, 28 slices (v2 audio icon)
    inputImages: ['/kit/paradise-lunax-photo.webp', '/kit/paradise-ceres-photo.webp'], inputCount: 7,
    inputFocus: ['50% 6%', '62% 10%'],
    reelPick: [0, 1],   // the three Paradise reel posters look the same: one Instagram, one TikTok
    // v2's stack: the client's own cut-outs (Rendered/Assets r.png, 13.png), face-framed; Umesh's pick 2026-10-20.
    sendImages: ['/kit/rollout/paradise-photo-lunax-r.webp', '/kit/rollout/paradise-photo-ceres-13.webp'],
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
  // Input: the song and the Starchild Vol. I cover artwork (the painted
  // Starchild in her purple hoodie; the file is the album cover published on
  // divinityroxx.com). Boards: the treatment's Moodboard page and the superhero
  // half of its Character Design page, which turned the cover's Starchild into
  // Super Girl (Supergirl Video Treatment.pdf, pages 4 and 5). Dates:
  // ClickUp order created 2026-08-16, release due 2026-10-23 (the YouTube
  // premiere is scheduled, the upload is listed on the channel but not public
  // on 2026-10-16). Title and card follow the label's own upload title.
  { on: true, record: {
    slug: 'supergirl', id: 'LJlX5L_cDVs', title: 'Super Girl', artist: 'Divi Roxx Kids',
    ordered: '2026-08-16', released: '2026-10-23', cover: '/kit/rollout/supergirl-cover.webp',
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
    input: 'song+cover', files: ['master.wav', 'Cover art'], fileNames: ['master.wav', 'Cover Art.jpeg'], reelPick: [0, 2],
    inputFocus: ['74% 45%'],   // the Starchild girl's face, for the tall page crop
    wave: [0.52,  0.53,  0.51,  0.59,  0.7,  0.72,  0.7,  0.89,  0.97,  1.0,  0.81,  0.89,  0.79,  0.57,  0.61,  0.74,  0.74,  0.78,  0.81,  0.94,  0.78,  0.82,  0.84,  0.43,  0.46,  0.49,  0.54,  0.15],   // loudness of the real master, 28 slices (v2 audio icon)
    boards: [
      { img: '/kit/rollout/supergirl-board-moodboard.webp', palette: ['#6a3fc0', '#ff5fa2', '#ffd23f', '#2fb6c8', '#f6f1ff'], source: 'treatment', label: 'Mood board' },
      { img: '/kit/rollout/supergirl-board-character.webp', palette: ['#7b4fcf', '#ffcf5a', '#2b1b3d', '#c9a3ff', '#f1ede8'], source: 'treatment', label: 'Character', from: '/kit/rollout/supergirl-cover.webp', fromCrop: '/kit/rollout/supergirl-cover-crop.webp', fromPlace: 'in' },
    ],
    mockCanvases: ['/kit/rollout/supergirl-canvas-mock-1.webp'],
    // No pick: one superhero design was built from the cover; the label approved it.
    preview: { video: '/kit/rollout/supergirl-preview.mp4', poster: '/kit/rollout/supergirl-preview.webp' },
    note: 'Love it. Can the cape catch more light in the chorus?', noteSource: 'illustrative',
    change: { weight: ['500', '800'], swatch: ['#6a3fc0', '#ff5fa2'] },
  } },

  // La Cuerda (CHIP MANTRA, 2023). Off: no public YouTube upload was found on
  // 2026-10-16, so the kit shows a "master delivered" card (our thumbnail, the
  // delivery's title, no channel). Flip `on`, set the real `id` and drop
  // `unpublished` when the video is public. Boards are two
  // pages of the illustrated storyboard (Storyboard_V2.pdf). No ClickUp task
  // was found, so the release tag reads "Date set".
  { on: false, record: {
    slug: 'la-cuerda', id: 'la-cuerda-lyric', unpublished: true, title: 'La Cuerda', artist: 'CHIP MANTRA',
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
  // vS0etuxv4X8 is), so the kit shows a "master delivered" card: our thumbnail
  // design and the delivery's title, no channel, no YouTube badge. Set `id` to
  // the upload and drop `unpublished` and `thumb` when she posts it. Dates:
  // ClickUp order 2026-02-13, the
  // song's release 2026-03-23. Input: the song and one photo of Riki, the
  // reference the cartoon character was drawn from (treatment page 3). Boards:
  // the treatment's Main Character, Storyboard Graphics and Style Frames pages
  // (Riki Lindhome - Bio Dad - Lyric Video Treatment.pdf, pages 3 to 5). The
  // treatment has no mood board page.
  { on: true, record: {
    slug: 'bio-dad', id: 'bio-dad-lyric', unpublished: true, title: 'Bio Dad', artist: 'Riki Lindhome',
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
    input: 'song+photo', files: ['BioDad.wav', '1 photo'], fileNames: ['BioDad.wav', 'Artist Photo.jpeg'], releaseTag: 'In 3 weeks',
    wave: [0.32,  0.41,  0.46,  0.51,  0.65,  0.71,  0.68,  0.74,  0.6,  0.86,  0.84,  0.76,  0.68,  0.77,  0.97,  1.0,  0.95,  0.86,  0.8,  0.98,  0.91,  0.66,  0.57,  0.19,  0.15,  0.31,  0.62,  0.63],   // loudness of the real master, 28 slices (v2 audio icon)
    inputImages: ['/kit/rollout/biodad-ref-photo.webp'], inputCount: 2,
    inputFocus: ['38% 12%'],
    // Canvas mock: a text-free scene from Rendered/Clips/1min_30sec.mp4 (12 s), Umesh's pick 2026-10-21.
    mockCanvases: ['/kit/rollout/biodad-canvas-carry.webp'],
    boards: [
      { img: '/kit/rollout/biodad-board-character.webp', palette: ['#d7262f', '#f5d36b', '#f7e3c6', '#2b2b2b', '#ffffff'], source: 'treatment', label: 'Character', from: '/kit/rollout/biodad-ref-photo.webp', fromCrop: '/kit/rollout/biodad-ref-crop.webp', fromPlace: 'in' },
      { img: '/kit/rollout/biodad-board-storyboard.webp', palette: ['#2b2b2b', '#8a8a8a', '#d7262f', '#f5d36b', '#ffffff'], source: 'treatment', label: 'Storyboard' },
      { img: '/kit/rollout/biodad-board-styleframes.webp', palette: ['#d7262f', '#ffd98a', '#6fa8dc', '#2b2b2b', '#fff7e6'], source: 'treatment', label: 'Style frames' },
    ],
    // No pick: the character, storyboard and style frames were approved as the look.
    preview: { video: '/kit/rollout/biodad-preview.mp4', poster: '/kit/rollout/biodad-preview.webp' },
    note: 'This is great. Could the stork look a little more worried?', noteSource: 'illustrative',
    change: { weight: ['500', '800'], swatch: ['#f5d36b', '#d7262f'] },
  } },

  // Bittersweet Goodbye (HBz x Jerome x Robin White, 2024). The label sent the
  // song and their PAROOKAVILLE event footage; we cut the lyric video over it.
  // Local project: E:\UGHD Studios 2024\HBz - Bittersweet Goodbye. Input
  // stills are text-free frames of their footage (Story Clip #1, see below);
  // there was no treatment, so the boards are frames of the delivered look
  // (style frames grid: 0:47, 0:50, 1:02, 1:35; key frame: 1:45). Reel posters
  // are two frames of Story Clip #2 (3.2 s and 6 s), Umesh's picks 2026-10-20; the Canvas is the delivered Design 1. Dates from the
  // case page (ordered 2024-07-27, released 2024-08-09).
  { on: true, record: {
    slug: 'bittersweet-goodbye', id: 'PLmlJR7hXsg', title: 'Bittersweet Goodbye', artist: 'HBz',   // full credit HBz x Jerome x Robin White is too long for v1's notification line
    ordered: '2024-07-27', released: '2024-08-09',
    kit: [
      { type: 'yt', n: 1 },
      { type: 'pack', ui: 'reels', n: 4, unit: 'cuts', items: [
        { poster: '/kit/rollout/bittersweet-promo-1.webp', label: 'Story clip 2, "We\'ll say a bittersweet"' },
        { poster: '/kit/rollout/bittersweet-promo-2.webp', label: 'Story clip 2, "Tonight"' },
      ] },
      { type: 'pack', ui: 'spotify', n: 3, unit: 'versions', items: [
        { poster: '/kit/rollout/bittersweet-canvas.webp', label: 'Canvas' },
      ] },
    ],
    reel: { account: 'HBz', avatar: '/channels/hbz.jpg', caption: 'Bittersweet Goodbye, out Friday', audio: 'HBz, Jerome, Robin White · Bittersweet Goodbye' },
  }, story: {
    input: 'song+clips', files: ['master.wav', 'Clips'], fileNames: ['Bittersweet.wav', 'Event Clips.mp4'], releaseTag: 'In 5 days',
    wave: [0.32,  0.28,  0.37,  0.48,  0.49,  0.52,  0.58,  0.54,  0.54,  0.45,  0.67,  1.0,  0.95,  1.0,  0.76,  0.41,  0.43,  0.5,  0.6,  0.62,  0.6,  0.51,  0.53,  0.99,  0.93,  0.98,  0.88,  0.15],   // loudness of the real master, 28 slices (v2 audio icon)
    inputImages: ['/kit/rollout/bittersweet-clip-1.webp', '/kit/rollout/bittersweet-clip-2.webp'],
    // Stack: Story Clip #1 at 6 s (lights and flames) in front, 9.5 s (arms up under the sign) behind; Umesh's picks 2026-10-21.
    inputFocus: ['50% 32%', '50% 30%'],
    boards: [
      { img: '/kit/rollout/bittersweet-board-styleframes.webp', palette: ['#1c1a22', '#5b4a7a', '#f2f0f5', '#f2c230', '#33b8b0'], source: 'delivery', label: 'Style frames' },
      { img: '/kit/rollout/bittersweet-board-keyframe.webp', palette: ['#16151b', '#4a3d63', '#f5f5f7', '#33b8b0', '#c9b8e8'], source: 'delivery', label: 'Key frame' },
    ],
    preview: { video: '/kit/rollout/bittersweet-preview.mp4', poster: '/kit/rollout/bittersweet-preview.webp' },
    note: 'Love it. Can the chorus words hit harder on the drop?', noteSource: 'illustrative',
    change: { weight: ['500', '800'], swatch: ['#33b8b0', '#f2c230'] },
  } },

  // I'M FREE (J McAllister, AI animation, 2025). Off: the ClickUp order is "on
  // hold" and no public upload exists (2026-10-16). Board A is a site-made tile
  // of the project's own mural mood board references (source: 'site', to be
  // saved into the project's Dropbox folder, see ClickUp); board B tiles four
  // delivered character stills. The delivery has no thumbnails, so the card
  // uses the stills board. ClickUp order created 2025-07-07; no release date.
  { on: false, record: {
    slug: 'im-free', id: 'imfree-lyric', unpublished: true, title: "I'M FREE", artist: 'J McAllister',
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
    input: 'song', files: ['master.wav'],
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
