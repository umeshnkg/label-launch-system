// Single source of content for the landing page lists.
// Views were read from YouTube on 2026-10-06 (yt-dlp). Refresh before a big push.
// Only work confirmed in the Dropbox deliveries folder is listed here.
export { FEATURED, FEATURED_TOTAL_VIEWS } from './releases.js';

// Custom lyric videos: everything confirmed ours that is not a featured case study.
// Order is display order: the first six mix genres and languages on purpose,
// so the grid is not all German dance. Views stay in the data but the grid does
// not show them; the case studies carry the numbers.
export const LYRIC_VIDEOS = [
  { id: '6gbtaJV1ox0', artist: 'her fever', title: 'So Hollow', views: '3K', year: 2026 },
  { id: 'gm5fhMlQu-c', artist: 'Riki Lindhome', title: "Don't Google Mommy", views: '586K', year: 2024 },
  { id: 'lnr4zx_3izg', artist: 'Innovibrations', title: 'Still Got My Name', views: '165K', year: 2025 },
  { id: 'E9GSXYo80Sc', artist: 'HBz x Laurenz x Layrz', title: 'Jaqueline', views: '316K', year: 2024 },
  { id: 'cpiW5QDmYAo', artist: 'Tash Blake', title: 'Heaven Can Wait', views: '28K', year: 2025 },
  { id: 'aJk5qiITxB0', artist: 'Bria Lee', title: "Doesn't Feel Like Christmas", views: '42K', year: 2021 },
  { id: 'oTiX2jPFCJY', artist: 'HBz x BassWar & CaoX', title: 'Believe', views: '295K', year: 2024 },
  { id: 'ev7003CXmAE', artist: 'Ely Oaks x Minelli', title: 'Fantasy', views: '204K', year: 2023 },
  { id: 'vS0etuxv4X8', artist: 'Riki Lindhome', title: 'Bio Dad', views: '78K', year: 2026 },
  { id: 'wTLUuwmxzgg', artist: 'Joe Bermudez & Dana McKeon', title: 'Daydream Therapy', views: '52K', year: 2025 },
  { id: '1lWOmJ_n6Gw', artist: 'Riki Lindhome', title: 'So Long Farewell', views: '30K', year: 2024 },
  { id: 'OHTzpZo8G6A', artist: 'LUNAX', title: 'One Last Kiss For Christmas', views: '29K', year: 2024 },
  { id: 'tcLgfJuZFlo', artist: 'Micha von der Rampe', title: 'Bierzeltkinder', views: '24K', year: 2025 },
  { id: 'W27LebNfddY', artist: 'John Stea', title: 'Shattered Garden', views: '24K', year: 2024 },
  { id: '4MKNSiOm9sw', artist: 'Riki Lindhome', title: 'Middle Age Love', views: '23K', year: 2024 },
  { id: 'izLr1nPvdWQ', artist: 'Dual Diagnosis ft. Merkules', title: 'Thrice As Hard', views: '22K', year: 2025 },
  { id: 'fYIrojE_OmM', artist: 'Divi Roxx Kids', title: 'Rock It Out', views: '16K', year: 2026 },
  { id: 'S665D-9YCB8', artist: 'Jay Ray', title: 'Leave The Past', views: '13K', year: 2025 },
  { id: 'zKJDAxIE7Ac', artist: 'Chad Prather', title: 'Famous Again', views: '13K', year: 2024 },
  { id: 'aD5-9vEIrBU', artist: 'Christian Anderson Band', title: 'As Iron Sharpens', views: '10K', year: 2023 },
];
export const LYRIC_VIDEOS_VISIBLE = 6;

// Visuals wall: two floating rows of real deliverables, no view counts.
// Row A is 16:9 stills, row B is vertical clips (Canvases and promo cuts).
// Picked from the smaller releases on purpose, so the range shows beyond the
// German case studies. Canvas web copies come from the MLV Spotify Canvas guide.
export const WALL_A = [
  { src: '/thumbs/6gbtaJV1ox0.webp', kind: 'Lyric video', who: 'her fever, So Hollow' },
  { src: '/kit/rockitout-thumb-11.webp', kind: 'Thumbnail', who: 'Divi Roxx Kids, Rock It Out' },
  { src: '/kit/paradise-styleframes.webp', kind: 'Style frames', who: 'LUNAX ft. CERES, Paradise' },
  { src: '/thumbs/lnr4zx_3izg.webp', kind: 'Lyric video', who: 'Innovibrations, Still Got My Name' },
  { src: '/kit/biodad-thumb-1.webp', kind: 'Thumbnail', who: 'Riki Lindhome, Bio Dad' },
  { src: '/thumbs/I5Rfl6UbPzw.webp', kind: 'Lyric video', who: 'Leonardo Aguilar, Le Voy a Pedir a Dios' },
  { src: '/thumbs/aJk5qiITxB0.webp', kind: 'Lyric video', who: "Bria Lee, Doesn't Feel Like Christmas" },
  { src: '/kit/paradise-moodboard.webp', kind: 'Mood board', who: 'LUNAX ft. CERES, Paradise' },
  { src: '/thumbs/cpiW5QDmYAo.webp', kind: 'Lyric video', who: 'Tash Blake, Heaven Can Wait' },
  { src: '/kit/rockitout-thumb-07.webp', kind: 'Thumbnail', who: 'Divi Roxx Kids, Rock It Out' },
  { src: '/thumbs/izLr1nPvdWQ.webp', kind: 'Lyric video', who: 'Dual Diagnosis ft. Merkules, Thrice As Hard' },
  { src: '/thumbs/gm5fhMlQu-c.webp', kind: 'Lyric video', who: "Riki Lindhome, Don't Google Mommy" },
];
export const WALL_B = [
  { video: '/kit/wall/tyra-underwater.mp4', poster: '/kit/wall/tyra-underwater.jpg', kind: 'Spotify Canvas', who: 'TYRA, Underwater' },
  { video: '/kit/rockitout-short.mp4', poster: '/kit/rockitout-thumb-05.webp', kind: 'Vertical trailer', who: 'Divi Roxx Kids, Rock It Out' },
  { video: '/kit/wall/yvonne-kidd-rockstar.mp4', poster: '/kit/wall/yvonne-kidd-rockstar.jpg', kind: 'Spotify Canvas', who: 'Yvonne Kidd, ROCKSTAR' },
  { video: '/kit/canvas-leonardo.mp4', kind: 'Spotify Canvas', who: 'Leonardo Aguilar' },
  { video: '/kit/wall/joe-bermudez-tug-of-war.mp4', poster: '/kit/wall/joe-bermudez-tug-of-war.jpg', kind: 'Spotify Canvas', who: 'Joe Bermudez, Tug of War' },
  { video: '/kit/rockitout-teaser.mp4', kind: 'Teaser', who: 'Divi Roxx Kids, Rock It Out' },
  { video: '/kit/wall/rachel-holt-ammunition.mp4', poster: '/kit/wall/rachel-holt-ammunition.jpg', kind: 'Spotify Canvas', who: 'Rachel Holt, Ammunition' },
  { video: '/kit/canvas-paradise.mp4', kind: 'Spotify Canvas', who: 'LUNAX ft. CERES, Paradise' },
];

// Logo marquee. Image logos are white-on-transparent PNGs cut from the
// lyricvideo.tv strip and greyed with CSS. Text entries become images once
// the clean files arrive in public/logos/.
// Kept to the big internationals plus the German labels, since outreach is
// mostly German.
export const LOGOS = [
  { text: 'Sony Music', img: '/logos/sony-music.png', h: 48 },
  { text: 'Four Music', img: '/logos/four-music.png', h: 32 },
  { text: 'Warner Records', img: '/logos/warner-records.png', h: 30 },
  { text: 'Jinx Music', img: '/logos/jinx-music.png', h: 30 },
  { text: "Spinnin' Records", img: '/logos/spinnin-records.png', h: 46 },
  { text: 'Beat Dealer Records', img: '/logos/beat-dealer-records.png', h: 40 },
  { text: 'Madnesstic', img: '/logos/madnesstic.svg', h: 26 },
];

// Site-wide: every phone mockup that plays a Spotify Canvas gets Spotify's
// now-playing overlay (title, artist, progress bar, controls). Title and artist
// come from the FEATURED entry whose `canvas` matches the video file, or from
// data-title / data-artist on the .phone element. false turns it off everywhere.
export const SPOTIFY_CANVAS_UI = true;

// Site-wide: every phone mockup that plays one of these vertical promo clips
// gets a simplified Instagram Reels overlay (account, caption, audio, buttons).
// Keyed by video src. Add a clip here and every .phone playing it picks it up.
export const REELS = {
  '/kit/rockitout-short.mp4': { account: 'Divi Roxx Kids', avatar: '/channels/divi-roxx-kids.jpg', caption: 'Rock It Out, out now', audio: 'Divi Roxx Kids · Rock It Out' },
  '/kit/timeout-story.mp4': { account: 'HBz', avatar: '/channels/hbz.jpg', caption: 'Time out, out now', audio: 'HBz, KREMIK · Time out' },
  '/kit/paradise-teaser.mp4': { account: 'LUNAX', avatar: '/channels/lunax.jpg', caption: 'Paradise, out 04/04', audio: 'LUNAX, CERES · Paradise' },
  '/kit/blau-vertical.mp4':{ account: 'Harris & Ford', avatar: '/channels/harris-ford.jpg', caption: 'Blau, out now', audio: 'Harris & Ford x 2 Engel & Charlie · Blau' },
};

// Site-wide: every phone mockup that plays one of these clips gets an Apple
// Music now-playing frame, with the clip as the animated artwork (3:4).
// Keyed by video src. The TYRA file is the 3:4 Motion Cover delivered Sep 2025.
export const MOTION_COVERS = {
  '/kit/tyra-motion-cover.mp4': { title: 'Warning Signs', artist: 'TYRA' },
};

// Site-wide: every spotlight-style YouTube frame (an element with
// data-ytcard="<video id>") becomes a YouTube watch card: thumbnail on top,
// then channel avatar, video title, channel name and a big view count.
// Not used in the release grids. Titles and channels are exactly as on YouTube
// (yt-dlp, 2026-10-07); views come from FEATURED, or `views` here if the video
// is not featured. Avatars are saved in public/channels.
export const YT_CARDS = {
  fbTbUaMrmBM: { title: 'HBz x 2 Engel & Charlie - Erinner mich (Official Lyric Video)', channel: 'HBz', avatar: '/channels/hbz.jpg' },
  C7N_52T1Hm8: { title: 'HBz, KREMIK - Time out (Official Lyric Video)', channel: 'HBz', avatar: '/channels/hbz.jpg' },
  HB_1_rdhets: { title: 'HARRIS & FORD x 2 ENGEL & CHARLIE - BLAU (OFFICIAL VIDEO)', channel: 'Harris & Ford', avatar: '/channels/harris-ford.jpg' },
  PLmlJR7hXsg: { title: 'HBz x Jerome x Robin White - Bittersweet Goodbye (Official Lyric Video)', channel: 'HBz', avatar: '/channels/hbz.jpg' },
  B8zmwvwls8s: { title: 'HBz x Stevio x 2 Engel & Charlie - GEILES LEBEN', channel: 'HBz', avatar: '/channels/hbz.jpg' },
  IrJFtY_qtxE: { title: '2 ENGEL & CHARLiE X FiNCH - MASOCHiST (LYRiC ViDEO)', channel: 'FiNCH', avatar: '/channels/finch.jpg' },
  I5Rfl6UbPzw: { title: 'Leonardo Aguilar - Le Voy a Pedir a Dios (Official Lyric Video)', channel: 'LeonardoAguilarOficial', avatar: '/channels/leonardo-aguilar.jpg' },
  sf4xhkoMCvw: { title: 'LUNAX - Paradise (feat. CERES) (Official Video)', channel: 'LUNAX', avatar: '/channels/lunax.jpg' },
  // Views read from the watch page on 2026-10-07: 19,966.
  fYIrojE_OmM: { title: 'Divi Roxx Kids - Starchild Rock It Out Official Lyric Video', channel: 'Divi Roxx Kids', avatar: '/channels/divi-roxx-kids.jpg', views: '20K' },
  // Super Girl: premiere scheduled (ClickUp due 2026-10-23); title as listed on the channel 2026-10-16. Rollout hero only.
  LJlX5L_cDVs: { title: 'Every Girl Has a Superpower: Super Girl  (Official Music Video)', channel: 'Divi Roxx Kids', avatar: '/channels/divi-roxx-kids.jpg' },
};

// Individual deliverables, sold on their own. PRICES ARE DRAFTS to confirm
// with Umesh (see the brief). "from" is the number shown.
export const SERVICES = [
  { key: 'lyric-video', name: 'Custom lyric video', from: '$1,500', line: 'Designed for the song. 1080p and broadcast masters, two revision rounds, ten business days.', img: '/thumbs/C7N_52T1Hm8.webp' },
  { key: 'visualizer', name: 'Audio visualizer', from: '$600', line: 'Your artwork brought to life with the lyrics on top. The fastest way to put a single on YouTube properly.', img: '/thumbs/sf4xhkoMCvw.webp' },
  { key: 'cover-art', name: 'Cover artwork', from: '$400', line: 'Single or album cover with the crops every platform asks for, built to match the video.', img: '/kit/biodad-cover.webp' },
  { key: 'promo-pack', name: 'Promo clip pack', from: '$700', line: 'One teaser, two trailers and three vertical cuts, in coming-soon and out-now versions.', video: '/kit/rockitout-short.mp4' },
];
// Thumbnails, Canvases and brand guidelines are not sold on their own
// (Umesh, 2026-10-08): they come with the kit.

// Screenshot wall. Two rows, scrolling opposite ways.
export const REVIEW_IMAGES_A = [
  'ig-21savage', 'email-riki-lindhome', 'google-tyra', 'ig-jvke', 'email-jack-tempchin', 'google-johnny-vitulli', 'ig-studio-one', 'email-karin-wir', 'google-john-stea', 'ig-melissa-bailey', 'email-richard-kraft', 'google-jason-jennings',
];
export const REVIEW_IMAGES_B = [
  'google-91-sound-studios', 'ig-jay-ray', 'email-david-asmussen', 'google-eliza-cooper', 'ig-pedro-monteiro', 'email-joe-bermudez', 'google-rita-deen', 'ig-brewster-bee', 'email-lamontt-blackshire', 'google-lost-soul', 'ig-matthew-balling', 'google-christian-anderson', 'trustpilot-dskayler', 'google-karin-wir', 'ig-mr-hyde',
];

// Where "Verified on Google" links go. Replace with the Google Business
// Profile review link when Umesh sends it.
export const GOOGLE_REVIEWS_URL = 'https://g.page/r/CcH3m06LiYjrEAE/review';

export const QUOTES = [
  { quote: 'I have been working with Umesh since 2017 and can only recommend his services. His quality and creativity are the best you can get. He will always know how to top his previous work.', name: 'TYRA', role: 'Artist', source: 'Google review', stars: 5 },
  { quote: 'Oh my gosh this is amazing!!! You went so above and beyond and it’s just wonderful!!', name: 'Riki Lindhome', role: 'Artist, actor and comedian', source: 'Email' },
  { quote: 'Brought my song to life and delivered an impeccable visual display. I honestly couldn’t be happier. First rate!', name: 'Johnny Vitulli', role: 'Artist', source: 'Google review', stars: 5 },
  { quote: 'Our team watched the video and we all think it’s amazing! We really love it!', name: 'Karin Wir', role: 'Beat Dealer Records', source: 'Email' },
  { quote: 'They not only captured the essence of the song, but artistically and visually elevated it to new levels.', name: 'John Stea', role: 'Songwriter', source: 'Google review', stars: 5 },
  { quote: 'Just watched the video!!! It’s really great. I love it. It’s dope man.', name: '21 Savage', role: 'Artist', source: 'Instagram' },
  { quote: 'Communicated quickly and delivered our video in the time he said he would. I am super impressed with the work and will be using him again in the future.', name: 'Jason Jennings', role: 'Artist', source: 'Google review', stars: 5 },
  { quote: 'My wife saw it and said “Genius” and I agree. You have made the song and the record great with this video. It is a work of art!', name: 'Jack Tempchin', role: 'Songwriter, “Peaceful Easy Feeling”', source: 'Email' },
  { quote: 'This will be seen by millions of people too! Today the song got added to Spotify’s biggest new dance playlist. This looks amazing!!', name: 'Studio One Agency', role: 'Management', source: 'Instagram' },
  { quote: 'Incredibly professional work. Their video images are first class. Being a writer and director, I always look for production quality and am impressed with the cinematic feel of these videos.', name: 'David Asmussen', role: 'Writer and director', source: 'Email' },
  { quote: 'Yeah, I think it’s my best one so far. I’m really happy with it.', name: 'JVKE', role: 'Artist', source: 'Instagram' },
  { quote: 'Always a good partner!', name: 'Karin Wir', role: 'Beat Dealer Records', source: 'Google review', stars: 5 },
];

// Hero quote stack. Verbatim from emails, DMs and Google reviews (… marks a cut
// inside one message); <m>…</m> wraps the phrase the highlighter marks.
// Attribution is always two lines: name (role) over org when there is one,
// otherwise name over role ("Artist", or "Major artist" for a famous name).
// hl = which part is highlighted: 'org' (the label or company), 'name' (the
// reviewer is the company or the famous name), 'name+org' (name plus credit
// line), 'role' (the credential). Plain artists get no attribution highlight.
// src: 'google' only for reviews still live on the Google profile (they get the
// stars); 'email' shows the envelope; 'instagram' shows nothing on the right.
// date (optional, e.g. 'Mar 2025') prints next to the envelope once verified in Gmail.
// Order is rotation order: label and industry voices first. The Fitz Madison
// side (Ken Steorts, Margo Fitzgerald) is out: that partnership ended 2026-10-05.
// Source notes: UG Brain/plan/label-launch-system-site/hero-quotes.md
export const HERO_QUOTES = [
  { q: 'Our team watched the video and we all think it’s <m>amazing</m>! We really love it!', name: 'Karin Wir', role: 'Product & Artist Manager', org: 'Beat Dealer Records', hl: 'org', src: 'email' },
  { q: 'You guys really <m>out did yourselves</m> … my competitors will begin reaching out to you guys.', name: 'Divinity Roxx', role: '2x Grammy-nominated artist', hl: 'role', src: 'email' },
  { q: 'Next time we have something, <m>I know who my first address is</m> ;)', name: 'Till Mintye', role: 'Artist Management', org: 'Madnesstic Media', hl: 'org', src: 'email' },
  { q: 'It is <m>utterly fantastic</m>!! … Could not be more happy.', name: 'Richard Kraft', org: 'Kraft Engel Management, Los Angeles', hl: 'org', src: 'email' },
  { q: 'You have made them great with this video. It is <m>a work of art</m>!', name: 'Jack Tempchin', role: 'Songwriter', org: '“Peaceful Easy Feeling” (Eagles)', hl: 'name+org', src: 'email' },
  { q: 'His quality and creativity are <m>the best you can get</m>!', name: 'TYRA', role: 'Artist', src: 'google' },
  { q: '<m>Always a good partner</m>!', name: 'Karin Wir', org: 'Beat Dealer Records', hl: 'org', src: 'google' },
  { q: 'Today the song got added to <m>Spotify’s biggest new dance playlist</m>.', name: 'Studio One Agency', role: 'Artist management', hl: 'name', src: 'instagram' },
  { q: 'Has plenty of ideas for <m>dynamic and appealing visuals</m>, which help retain audience attention.', name: '91 Sound Studios', role: 'Recording studio', hl: 'name', src: 'google' },
  { q: 'Just watched the video!!! <m>It’s really great</m>.', name: '21 Savage', role: 'Major artist', src: 'instagram' },
  { q: 'He communicated quickly and <m>delivered our video in the time he said he would</m>.', name: 'Jason Jennings', role: 'Artist', src: 'google' },
  { q: 'You have done <m>every lyric video for me for years</m>!', name: 'Melissa Bailey', role: 'Singer-songwriter', src: 'instagram' },
  { q: 'Will <m>DEFINITELY recommend</m> you to others!', name: 'Richard Kraft', org: 'Kraft Engel Management, Los Angeles', hl: 'org', src: 'email' },
  { q: 'Yeah, I think it’s <m>my best one so far</m>. I’m really happy with it.', name: 'JVKE', role: 'Major artist', src: 'instagram' },
  { q: 'Wow. … You are <m>A1, top-tier talent</m>.', name: 'Lamontt Blackshire', role: 'Music producer', src: 'email' },
  { q: 'The lyric video for “LUNAX x CERES - Paradise” … which we <m>really loved</m>.', name: 'Natalie Foerster', role: 'Marketing & Product Manager', org: 'Beat Dealer Records', hl: 'org', src: 'email' },
  { q: 'Oh my gosh this is <m>amazing</m>!!! You went so above and beyond and it’s just wonderful!!', name: 'Riki Lindhome', role: 'Actor, comedian and artist', src: 'email' },
  { q: 'They really listened to my ideas and helped <m>bring the visuals I had in my head to life</m>.', name: 'Yvonne Kidd', role: 'Artist', src: 'google' },
  { q: 'Its <m>soooooo good</m>! I’m getting so much great feedback!', name: 'Divinity Roxx', role: '2x Grammy-nominated artist', hl: 'role', src: 'email' },
  { q: 'My opinion in three words: <m>stunning, stunning and stunning</m>.', name: 'John Stea', role: 'Songwriter', src: 'email' },
  { q: '<m>Great work. We love it.</m>', name: 'David Wessel', role: 'Manager', org: 'HBz', hl: 'org', src: 'email' },
  { q: 'The end result was <m>professional and high quality</m>.', name: 'Philip Paulsen', role: 'Artist', src: 'google' },
  { q: 'He really <m>brought my song to life</m> and delivered an impeccable visual display.', name: 'Johnny Vitulli', role: 'Artist', src: 'google' },
  { q: 'Everyone in my circle is <m>completely ecstatic</m> about the recent production of “Ask Your Phone”!', name: 'Robert Benedict', role: 'Artist', src: 'email' },
  { q: '<m>We need you again</m> :)', name: 'Till Mintye', role: 'Artist Management', org: 'Madnesstic Media', hl: 'org', src: 'email' },
  { q: 'Honestly I’m <m>still amazed</m> of this lyric video! It’s just so amazing.', name: 'Jay Ray', role: 'Artist', src: 'instagram' },
  { q: '<m>Very easy to work with</m>! I definitely recommend!', name: 'Lost Soul Productions', role: 'Production company', hl: 'name', src: 'google' },
  { q: 'Everyone I’ve shown the lyric video to <m>flips over it</m>!!', name: 'Brewster Bee', role: 'Artist', src: 'instagram' },
  { q: 'Umesh! <m>SOLID MAN</m>! You do great work! … I know we will be doing more business!', name: 'Lamontt Blackshire', role: 'Music producer', src: 'email' },
  { q: 'You’re definitely going to be <m>my good to go guy</m> for this sort of thing moving forward', name: 'Joe Bermudez', role: 'DJ', src: 'email' },
  { q: 'Seriously, the video is <m>beautifully done and beyond my expectations</m>.', name: 'John Stea', role: 'Songwriter', src: 'email' },
  { q: 'You do <m>exceptional work</m>!!', name: 'Dan Ruprecht', role: 'Artist', src: 'email' },
  { q: '<m>AH-MAZING WORK</m>! You are the BEST!', name: 'Divinity Roxx', role: '2x Grammy-nominated artist', hl: 'role', src: 'email' },
  { q: 'I def will be <m>coming back for more</m>. Very happy.', name: 'IAMOBAS', role: 'Artist', src: 'email' },
  { q: '<m>We love it</m>!! Thank you so much.', name: 'Eliza Cooper', org: 'Lighthouse Church', hl: 'org', src: 'email' },
];

export const FAQ = [
  {
    q: 'How much does it cost?',
    a: 'The Release Kit starts at $2,500 for one single. The Launch System starts at $5,000 when the single needs a custom concept, animation or your own footage. A Campaign of three releases is $12,000. On their own, cover artwork starts at $400 and a custom lyric video at $1,500. You get the exact number in writing before you pay anything.',
  },
  {
    q: 'How fast can you deliver?',
    a: 'Ten business days from the day we have your master and lyrics, for the full kit. A lyric video on its own can be faster. Tell us the release window first and we plan backwards from it. Rush delivery is available, so ask before you book the premiere.',
  },
  {
    q: 'What do you need from us?',
    a: 'The final master as a WAV, the lyrics, the single artwork if it exists, the release window, and any references or brand rules. If you have no artwork yet, we design it.',
  },
  {
    q: 'What happens if we do not like the preview?',
    a: 'On Day 5 you watch a 30-second preview. If it is not right, we revise it on our time. If you want to stop there, you get a full refund. Once you approve the preview we build the full video, with two free revision rounds for small changes.',
  },
  {
    q: 'Who owns the files?',
    a: 'You do. Every file is yours to post, broadcast and monetise, with no watermark. We ask for an optional “Video by” line in the description and nothing else.',
  },
  {
    q: 'Do you use AI?',
    a: 'Where it serves the concept, yes. Artwork, environments and some elements can come from AI tools under our direction. The animation, typography, timing and edit are done by people. We tell you exactly where AI was used so your YouTube disclosure is correct.',
  },
  {
    q: 'Can we buy just one thing?',
    a: 'Yes, the four pieces labels ask for on their own: a custom lyric video, an audio visualizer, cover artwork or a promo clip pack. Thumbnails, Canvases and the Playbook come with the kit. The kit is cheaper than buying the parts, but nobody is forced into it.',
  },
  {
    q: 'How do we pay?',
    a: 'Half to start and half at preview approval, by card or bank transfer. Pay the full amount upfront and take 10% off. Extra revision rounds beyond the two included are quoted before we start, usually from $200.',
  },
  {
    q: 'We are an artist, not a label. Can we book?',
    a: 'Yes, if you have a release window and a budget from $1,000. Under that, Make Lyric Video’s Pro packages are the better fit and we will point you there.',
  },
];
