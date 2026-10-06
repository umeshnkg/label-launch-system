// Single source of content for the landing page lists.
// Views were read from YouTube on 2026-10-06 (yt-dlp). Refresh before a big push.
// Only work confirmed in the Dropbox deliveries folder is listed here.
export { FEATURED, FEATURED_TOTAL_VIEWS } from './releases.js';

// Custom lyric videos: everything confirmed ours that is not a featured case study.
export const LYRIC_VIDEOS = [
  { id: 'gm5fhMlQu-c', artist: 'Riki Lindhome', title: "Don't Google Mommy", views: '586K', year: 2024 },
  { id: 'E9GSXYo80Sc', artist: 'HBz x Laurenz x Layrz', title: 'Jaqueline', views: '316K', year: 2024 },
  { id: 'oTiX2jPFCJY', artist: 'HBz x BassWar & CaoX', title: 'Believe', views: '295K', year: 2024 },
  { id: 'ev7003CXmAE', artist: 'Ely Oaks x Minelli', title: 'Fantasy', views: '204K', year: 2023 },
  { id: 'lnr4zx_3izg', artist: 'Innovibrations', title: 'Still Got My Name', views: '165K', year: 2025 },
  { id: 'vS0etuxv4X8', artist: 'Riki Lindhome', title: 'Bio Dad', views: '78K', year: 2026 },
  { id: 'wTLUuwmxzgg', artist: 'Joe Bermudez & Dana McKeon', title: 'Daydream Therapy', views: '52K', year: 2025 },
  { id: 'aJk5qiITxB0', artist: 'Bria Lee', title: "Doesn't Feel Like Christmas", views: '42K', year: 2021 },
  { id: '1lWOmJ_n6Gw', artist: 'Riki Lindhome', title: 'So Long Farewell', views: '30K', year: 2024 },
  { id: 'OHTzpZo8G6A', artist: 'LUNAX', title: 'One Last Kiss For Christmas', views: '29K', year: 2024 },
  { id: 'cpiW5QDmYAo', artist: 'Tash Blake', title: 'Heaven Can Wait', views: '28K', year: 2025 },
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

// Logo marquee. Image logos are white-on-transparent PNGs cut from the
// lyricvideo.tv strip and greyed with CSS. Text entries become images once
// the clean files arrive in public/logos/.
export const LOGOS = [
  { text: 'Sony Music', img: '/logos/sony-music.png', h: 48 },
  { text: 'Warner Records', img: '/logos/warner-records.png', h: 30 },
  { text: 'Four Music', img: '/logos/four-music.png', h: 32 },
  { text: 'Global Records', img: '/logos/global-records.png', h: 32 },
  { text: 'Machin Records', img: '/logos/machin-records.png', h: 48 },
  { text: 'Warner Music', img: '/logos/warner-music.png', h: 40 },
  { text: 'Madison Line Records', img: '/logos/madison-line-records.png', h: 26 },
  { text: 'Baste Records', img: '/logos/baste-records.png', h: 36 },
  { text: 'Beat Dealer Records', img: '/logos/beat-dealer-records.png', h: 40 },
  { text: 'Innovibrations' },
  { text: 'Jinx Music', img: '/logos/jinx-music.png', h: 30 },
  { text: 'Madnesstic', img: '/logos/madnesstic.svg', h: 26 },
  { text: 'BMG', img: '/logos/bmg.png', h: 30 },
  { text: "Spinnin' Records", img: '/logos/spinnin-records.png', h: 46 },
];

// Individual deliverables, sold on their own. PRICES ARE DRAFTS to confirm
// with Umesh (see the brief). "from" is the number shown.
export const SERVICES = [
  { key: 'lyric-video', name: 'Custom lyric video', from: '$1,500', line: 'Designed for the song. 1080p and broadcast masters, two revision rounds, ten business days.', img: '/thumbs/C7N_52T1Hm8.webp' },
  { key: 'visualizer', name: 'Audio visualizer', from: '$600', line: 'Your artwork brought to life with the lyrics on top. The fastest way to put a single on YouTube properly.', img: '/thumbs/sf4xhkoMCvw.webp' },
  { key: 'cover-art', name: 'Cover artwork', from: '$400', line: 'Single or album cover with the crops every platform asks for, built to match the video.', img: '/kit/biodad-cover.webp' },
  { key: 'promo-pack', name: 'Promo clip pack', from: '$700', line: 'One teaser, two trailers and three vertical cuts, in coming-soon and out-now versions.', video: '/kit/rockitout-short.mp4' },
  { key: 'thumbnails', name: 'Thumbnail pack', from: '$300', line: 'Five YouTube thumbnail designs built around the hook, ready to A/B test.', img: '/kit/rockitout-thumb-10.webp' },
  { key: 'canvas', name: 'Spotify Canvas', from: '$200', line: 'An eight-second loop for one single. Album packs of eight from $1,200.', video: '/kit/canvas-masochist.mp4' },
  { key: 'brand', name: 'Full brand guidelines', from: '$2,500', line: 'An artist visual identity: logo, type, colour, and templates for covers, posts and thumbnails.', img: '/kit/rockitout-banner-1.webp' },
];

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

export const FAQ = [
  {
    q: 'How much does it cost?',
    a: 'The Release Kit starts at $2,500 for one single. The Launch System starts at $5,000 when the single needs a custom concept, animation or your own footage. A Campaign of three releases is $12,000. Single deliverables start at $200 for a Spotify Canvas and $1,500 for a custom lyric video. You get the exact number in writing before you pay anything.',
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
    a: 'Yes. Every item in the kit is sold on its own: the lyric video, an audio visualizer, cover artwork, a promo clip pack, a thumbnail pack, Spotify Canvases for a single or a whole album, or full brand guidelines. The kit is cheaper than buying the parts, but nobody is forced into it.',
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
