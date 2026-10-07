// Featured releases: one case-study page each at /releases/<slug>/.
// Only releases at or near a million views belong here. Everything smaller
// lives in LYRIC_VIDEOS (src/data.js) and opens in the YouTube modal.
//
// Dates: "ordered" is the ClickUp order date, "delivered" the final master in
// Dropbox, "released" the YouTube upload date. Views and likes were read with
// yt-dlp on 2026-10-06. Social clip views are not tracked by us, so the stats
// only show YouTube.

export const FEATURED = [
  {
    slug: 'erinner-mich',
    id: 'fbTbUaMrmBM',
    artist: 'HBz x 2 Engel & Charlie',
    title: 'Erinner mich',
    client: 'Jinx Music',
    label: 'Released on the HBz channel',
    genre: 'German dance',
    views: '19.5M', viewsNum: 19545291, likes: '95K',
    ordered: '2023-12-22', preview: '2023-12-27', delivered: '2024-01-10', released: '2024-01-12',
    turnaround: '19 days',
    poster: '/kit/erinner-mich-thumb.webp',
    canvas: '/kit/canvas-erinner-mich.mp4',
    loop: true, // seamless: last frame matches the first (checked 2026-10-07)
    gallery: ['/kit/erinner-mich-thumb.webp', '/kit/erinner-thumb-2.webp', '/kit/erinner-thumb-5.webp', '/kit/erinner-thumb-7.webp'],
    requirement: 'A lyric video that could carry a German dance single on YouTube for months, plus a two-week social countdown the label could run without a designer on call.',
    deliverables: [
      'Official lyric video, ProRes master and 1080p YouTube master',
      '7 thumbnail designs, one with the label logos',
      '14 social clips: teasers and promos in Story, Feed and Square formats, with and without artwork and release date',
      '2 Spotify Canvas versions',
      '2-week rollout plan',
    ],
    summary: 'The most-watched upload on the HBz channel. One lyric video, delivered with a fourteen-clip social pack and a Canvas, nineteen days after the order.',
    description: 'Case study: the official lyric video for HBz x 2 Engel & Charlie "Erinner mich", 19.5 million views on YouTube. Delivered in 19 days with 14 social clips, 7 thumbnails, 2 Spotify Canvas loops and a two-week rollout plan.',
  },
  {
    slug: 'time-out',
    id: 'C7N_52T1Hm8',
    artist: 'HBz, KREMIK',
    title: 'Time out',
    client: 'HBz',
    label: 'Released on the HBz channel',
    genre: 'German dance',
    views: '5.5M', viewsNum: 5468750, likes: '23K',
    ordered: '2023-06-06', preview: '2023-06-13', delivered: '2023-06-15', released: '2023-06-16',
    turnaround: '9 days',
    poster: '/thumbs/C7N_52T1Hm8.webp',
    canvas: '/kit/canvas-time-out.mp4',
    canvasSpec: false, // the web copy is 2:3, not 9:16, so no Canvas blueprint panel
    vertical: '/kit/timeout-story.mp4',
    gallery: [],
    social: { views: '86K', note: '3 promo Shorts on the HBz channel', ids: ['em2oU3foGPk', 'jX194D5MGjY', 's0Cn51IlzAo'] },
    requirement: 'A premium lyric video with a release pack, nine days before the upload date, plus loops the duo could run on stage.',
    deliverables: [
      'Official lyric video, ProRes master and 1080p YouTube master',
      '6 Instagram promo clips: Feed and Story, in Coming Soon, Cover Only and Out Now versions',
      'Spotify Canvas',
      '2 title-and-logo loops, one with an alpha channel for live visuals',
      'Text-only alpha version and background-only version for the live show',
    ],
    summary: 'Ordered on a Tuesday, delivered the Thursday of the following week, released the day after. Five and a half million views since.',
    description: 'Case study: the official lyric video for HBz and KREMIK "Time out", 5.5 million views on YouTube. Delivered in 9 days with six Instagram promo clips, a Spotify Canvas and live-show loops.',
  },
  {
    slug: 'blau',
    id: 'HB_1_rdhets',
    artist: 'Harris & Ford x 2 Engel & Charlie',
    title: 'Blau',
    client: 'Jinx Music',
    label: 'Released on the Harris & Ford channel',
    genre: 'German dance',
    views: '1.6M', viewsNum: 1616608, likes: '14K',
    ordered: '2024-03-15', preview: '', delivered: '2024-04-04', released: '2024-04-05',
    turnaround: '20 days',
    poster: '/thumbs/HB_1_rdhets.webp',
    vertical: '/kit/blau-vertical.mp4',
    gallery: ['/kit/blau-thumb-01.webp', '/kit/blau-thumb-02.webp', '/kit/blau-thumb-red.webp'],
    social: { views: '134K', note: '2 promo Shorts on the Harris & Ford channel', ids: ['SDFr7SWHdbM', 'rClTLwrCk5Y'] },
    requirement: 'A lyric video for a festival-season single, with a thumbnail set in several colourways so the channel could pick the one that matched the artwork rollout.',
    deliverables: [
      'Official lyric video, ProRes 422 master',
      '8 thumbnail designs: two layouts in five colourways',
      '6 promo clips: 10-second and 30-second teasers, Instagram vertical in Coming Soon, Out Now, no-text and V2 cuts',
    ],
    summary: 'Two thumbnail layouts, five colourways, six promo cuts and the lyric video, twenty days from order to master.',
    description: 'Case study: the official lyric video for Harris & Ford x 2 Engel & Charlie "Blau", 1.6 million views on YouTube. Delivered in 20 days with eight thumbnail designs and six promo clips.',
  },
  {
    slug: 'bittersweet-goodbye',
    id: 'PLmlJR7hXsg',
    artist: 'HBz x Jerome x Robin White',
    title: 'Bittersweet Goodbye',
    client: 'Madnesstic Media, HBz management',
    label: 'Released on the HBz channel',
    genre: 'Dance pop',
    views: '1.1M', viewsNum: 1108697, likes: '7K',
    ordered: '2024-07-27', preview: '', delivered: '2024-08-02', released: '2024-08-09',
    turnaround: '6 days',
    poster: '/thumbs/PLmlJR7hXsg.webp',
    canvas: '/kit/canvas-bittersweet.mp4',
    gallery: [],
    requirement: 'A lyric video inside a week, then a story pack and Canvas designs for the countdown to the Friday release.',
    deliverables: [
      'Official lyric video, 1080p master',
      '4 story clips: two cuts, each in Out Friday and Out Now versions',
      '3 Spotify Canvas designs',
    ],
    summary: 'Six days from order to the finished video, with the promo pack following five days later for the Friday release.',
    description: 'Case study: the official lyric video for HBz x Jerome x Robin White "Bittersweet Goodbye", 1.1 million views on YouTube. Delivered in 6 days with four story clips and three Spotify Canvas designs.',
  },
  {
    slug: 'geiles-leben',
    id: 'B8zmwvwls8s',
    artist: 'HBz x Stevio x 2 Engel & Charlie',
    title: 'Geiles Leben',
    client: 'Madnesstic Media, HBz management',
    label: 'Released on the HBz channel',
    genre: 'German dance',
    views: '987K', viewsNum: 986926, likes: '9K',
    ordered: '2024-09-16', preview: '', delivered: '2024-09-23', released: '2024-09-27',
    turnaround: '7 days',
    poster: '/thumbs/B8zmwvwls8s.webp',
    gallery: [],
    requirement: 'A lyric video for a Glasperlenspiel cover with two story clips, delivered in a week so the label could premiere on the Friday.',
    deliverables: [
      'Official lyric video, 1080p master',
      '2 story clips for Instagram and TikTok',
    ],
    summary: 'Seven days, one lyric video, two story clips, and just under a million views.',
    description: 'Case study: the official lyric video for HBz x Stevio x 2 Engel & Charlie "Geiles Leben", close to a million views on YouTube. Delivered in 7 days with two story clips.',
  },
  {
    slug: 'masochist',
    id: 'IrJFtY_qtxE',
    artist: '2 Engel & Charlie x FiNCH',
    title: 'Masochist',
    client: 'Jinx Music',
    label: 'Released on the FiNCH channel',
    genre: 'German rap and dance',
    views: '953K', viewsNum: 952718, likes: '9K',
    ordered: '2023-07-26', preview: '2023-08-05', delivered: '2023-08-17', released: '2023-08-17',
    turnaround: '22 days',
    poster: '/thumbs/IrJFtY_qtxE.webp',
    canvas: '/kit/canvas-masochist.mp4',
    loop: true, // seamless: last frame matches the first (checked 2026-10-07)
    gallery: [],
    requirement: 'A lyric video for a rap and dance collaboration released on the rapper’s own channel, with a teaser set in Story and Feed formats for both artists to post.',
    deliverables: [
      'Official lyric video, ProRes master',
      '10 social teasers: Story and Feed, in Coming Soon, Out Now and no-text versions',
      'Spotify Canvas loop',
      '2-week rollout plan',
    ],
    summary: 'Ten teasers for two artists, a Canvas loop and the lyric video, delivered on the morning of the release.',
    description: 'Case study: the official lyric video for 2 Engel & Charlie x FiNCH "Masochist", close to a million views on YouTube. Delivered in 22 days with ten social teasers and a Spotify Canvas loop.',
  },
  {
    slug: 'le-voy-a-pedir-a-dios',
    id: 'I5Rfl6UbPzw',
    artist: 'Leonardo Aguilar',
    title: 'Le Voy a Pedir a Dios',
    client: 'Machin Records',
    label: 'Released on the Leonardo Aguilar channel',
    genre: 'Mexican regional',
    views: '665K', viewsNum: 664836, likes: '4K',
    ordered: '2025-04-25', preview: '', delivered: '2025-07-07', released: '2025-07-10',
    turnaround: '3 days early', turnaroundLabel: 'Delivered before release',
    poster: '/thumbs/I5Rfl6UbPzw.webp',
    canvas: '/kit/canvas-leonardo.mp4',
    loop: true, // seamless: last frame matches the first (checked 2026-10-07)
    gallery: [],
    requirement: 'A lyric video for a romantic regional single about a couple everyone judges, with promo clips in coming-soon and out-now versions and a Canvas, all timed to a July release date.',
    deliverables: [
      'Official lyric video, 1080p master',
      '3 extended promo clips: plain, Coming Soon and Out Now versions',
      'Verse promo clip for Reels and TikTok',
      'Spotify Canvas loop',
      '2-week rollout plan',
    ],
    summary: 'A Spanish-language single for a label that works on short notice. Lyric video, four promo clips and a Canvas, in the channel three days before release.',
    description: 'Case study: the official lyric video for Leonardo Aguilar "Le Voy a Pedir a Dios", 665K views on YouTube. Delivered three days before release with four promo clips, a Spotify Canvas and a two-week rollout plan.',
  },
  {
    slug: 'paradise',
    id: 'sf4xhkoMCvw',
    artist: 'LUNAX ft. CERES',
    title: 'Paradise',
    client: 'Beat Dealer Records',
    label: 'Released on the LUNAX channel',
    genre: 'Dance pop',
    views: '388K', viewsNum: 388309, likes: '2K',
    ordered: '2025-02-21', preview: '', delivered: '2025-03-21', released: '2025-04-03',
    turnaround: '25 days',
    poster: '/thumbs/sf4xhkoMCvw.webp',
    canvas: '/kit/canvas-paradise.mp4',
    loop: true, // seamless: last frame matches the first (checked 2026-10-07)
    // First 9 s of promo Short kJTRyFmAHDQ (LUNAX channel), muted.
    vertical: '/kit/paradise-teaser.mp4',
    gallery: ['/kit/paradise-moodboard.webp', '/kit/paradise-styleframes.webp', '/kit/paradise-thumb-1.webp', '/kit/paradise-thumb-2.webp', '/kit/paradise-thumb-3.webp'],

    // ---- Visual case study (pilot). Any release can opt in by adding these. ----
    // One line under the title: the selling point, not the summary.
    promise: 'One song in. Fifteen files out, one look, each made for the screen it plays on.',
    // Before: what the label sent (Umesh, 2026-10-08: audio, lyrics, a set of photos).
    input: ['Master audio', 'Lyrics', 'A set of photos'],
    inputNote: 'Photos are optional. The song alone is enough to start.',
    // After: the kit, as mockups. n = number of files. Web copies of the
    // Dropbox delivery (Promo Materials, Spotify Canvas), 2026-10-08. The
    // Motion Covers were re-exports of the Canvases, and the rollout plan is
    // not a selling point, so neither is shown.
    kit: [
      { type: 'yt', label: 'Lyric video', n: 1, img: '/thumbs/sf4xhkoMCvw.webp' },
      { type: 'pack', ui: 'reels', label: 'Promo clips', n: 6, unit: 'cuts', items: [
        { video: '/kit/paradise-teaser.mp4', poster: '/kit/paradise-teaser-poster.webp', label: 'Teaser, Coming Soon' },
        { video: '/kit/paradise-promo-teaser.mp4', poster: '/kit/paradise-promo-teaser-poster.webp', label: 'Teaser' },
        { video: '/kit/paradise-promo-teaser-now.mp4', poster: '/kit/paradise-promo-teaser-now-poster.webp', label: 'Teaser, Out Now' },
        { video: '/kit/paradise-promo-trailer.mp4', poster: '/kit/paradise-promo-trailer-poster.webp', label: 'Trailer' },
        { video: '/kit/paradise-promo-trailer-soon.mp4', poster: '/kit/paradise-promo-trailer-soon-poster.webp', label: 'Trailer, Coming Soon' },
        { video: '/kit/paradise-promo-trailer-now.mp4', poster: '/kit/paradise-promo-trailer-now-poster.webp', label: 'Trailer, Out Now' },
      ] },
      { type: 'pack', ui: 'spotify', label: 'Spotify Canvas', n: 3, unit: 'versions', items: [
        { video: '/kit/canvas-paradise-lunax.mp4', poster: '/kit/canvas-paradise-lunax-poster.webp', label: 'LUNAX' },
        { video: '/kit/canvas-paradise-ceres.mp4', poster: '/kit/canvas-paradise-ceres-poster.webp', label: 'CERES' },
        { video: '/kit/canvas-paradise-neutral.mp4', poster: '/kit/canvas-paradise-neutral-poster.webp', label: 'Neutral' },
      ] },
      { type: 'ab', label: 'Thumbnails', n: 3, unit: 'designs', items: ['/kit/paradise-thumb-1.webp', '/kit/paradise-thumb-2.webp', '/kit/paradise-thumb-3.webp'] },
      { type: 'look', label: 'The look', n: 2, unit: 'boards', items: ['/kit/paradise-moodboard.webp', '/kit/paradise-styleframes.webp'] },
    ],
    // One look: where the palette came from, and where it went. Dot positions
    // are percentages of each image, measured with PIL on 2026-10-08. The photo
    // gives the blue light and the black jacket; the references give the rest.
    look: {
      // LUNAX: the blue light on her braids and the black jacket, then her
      // cream jacket. CERES: her red dress and hair. Yellow is the one colour
      // that came from the references (Assets/q.png has no usable yellow).
      photos: [
        { src: '/kit/paradise-lunax-photo.webp', ar: '429 / 760', label: 'LUNAX', dots: [{ x: 61, y: 16, c: '#3ebfd5' }, { x: 49, y: 65, c: '#09212b' }] },
        { src: '/kit/paradise-ceres-photo.webp', ar: '372 / 760', label: 'CERES', dots: [{ x: 39, y: 42, c: '#fe3864' }] },
        { src: '/kit/paradise-lunax-photo-2.webp', ar: '670 / 760', label: 'LUNAX', dots: [{ x: 68, y: 51, c: '#f5f3ef' }] },
      ],
      refs: '/kit/paradise-moodboard.webp',
      refDots: [{ x: 43, y: 65, c: '#f6e80b' }],
      palette: ['#fe3864', '#f6e80b', '#3ebfd5', '#09212b', '#f5f3ef'],
      outputs: [
        { img: '/kit/paradise-thumb-2.webp', label: 'Lyric video' },
        { video: '/kit/canvas-paradise-lunax.mp4', poster: '/kit/canvas-paradise-lunax-poster.webp', label: 'Canvas' },
        { video: '/kit/paradise-teaser.mp4', poster: '/kit/paradise-teaser-poster.webp', label: 'Promo clip' },
        { img: '/kit/paradise-thumb-1.webp', label: 'Thumbnail' },
      ],
    },
    // Process: steps, never days. optional: true draws a dashed step that the
    // Rush toggle removes.
    // Titles only: the images carry the message. Mood board and style frames
    // are one step because the label approves them together.
    process: [
      { title: 'Brief', brief: true },
      { title: 'The look', img2: ['/kit/paradise-moodboard.webp', '/kit/paradise-styleframes.webp'], optional: true, stamp: true },
      // 0:40 to 0:48 of the finished video (YouTube 720p), as the preview.
      { title: 'First cut', video: '/kit/paradise-firstcut.mp4', poster: '/kit/paradise-firstcut-poster.webp', player: true, stamp: true },
      { title: 'Preview + teaser', video: '/kit/paradise-teaser.mp4', tag: 'Teaser out' },
      { title: 'Final + kit', folder: true },
    ],
    thumbs: ['/kit/paradise-thumb-2.webp', '/kit/paradise-thumb-1.webp', '/kit/paradise-thumb-3.webp'],
    // Face guide on a Canvas still (3.0 s). Percentages of the 9:16 frame,
    // measured on a 10x20 grid: box = [left, top, width, height].
    face: { still: '/kit/paradise-canvas-face.webp', box: [59, 33, 28, 19], eyes: 40.5, mouth: 47 },
    // Karin, 2025-03-14, thread "AW: AW: LUNAX (feat. CERES) - Paradise"; Google review 2025-03-24.
    quotes: [
      { kind: 'email', q: 'Our team watched the video and we all think it’s amazing! We really love it!', name: 'Karin Wir', role: 'Product & Artist Manager, Beat Dealer Records', subject: 'AW: AW: LUNAX (feat. CERES) - Paradise', when: 'Mar 14, 2025' },
      { kind: 'google', q: 'Always a good partner!', name: 'Karin Wir', role: 'Beat Dealer Records', stars: 5 },
    ],
    // ClickUp: two Beat Dealer orders, Nov 2024 and Feb 2025.
    repeat: { line: 'Beat Dealer came back for LUNAX.', releases: [
      { id: 'OHTzpZo8G6A', title: 'One Last Kiss For Christmas', year: 2024 },
      { id: 'sf4xhkoMCvw', title: 'Paradise ft. CERES', year: 2025, current: true },
    ] },
    social: { views: '9K', note: '3 promo Shorts on the LUNAX channel', ids: ['xGYOPmxqMgo', 'kJTRyFmAHDQ', '_8hnlaHSae4'] },
    requirement: 'A lyric video and release pack for a dance single shared by two artists: mood board and style frames first, then a Canvas for each artist, the Apple Motion Cover and a thumbnail set.',
    deliverables: [
      'Mood board and style frames, approved before animation',
      'Official lyric video, ProRes and MP4 masters',
      '6 promo clips: teaser and trailer, each in plain, Coming Soon and Out Now versions',
      '3 Spotify Canvas versions: LUNAX, CERES and neutral',
      '2 Apple Motion Covers',
      '3 thumbnail designs',
      '2-week rollout plan',
    ],
    summary: 'The full pack for a two-artist single: mood board, style frames, lyric video, six promo clips, three Canvases, two Motion Covers and three thumbnails.',
    description: 'Case study: the official lyric video for LUNAX ft. CERES "Paradise", 388K views on YouTube. Delivered in 25 days with six promo clips, three Spotify Canvas versions, two Apple Motion Covers and three thumbnails.',
  },
];

export const FEATURED_TOTAL_VIEWS = '30M';
