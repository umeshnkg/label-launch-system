// Pure derivation for the Rollout: a ROLLOUT entry + the site data → a Project
// the renderer and timeline consume. No DOM here; tests run it in Node.

const DAY = 86400000;
const parse = (iso) => (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) : NaN);

/* The one red tag on the notification. The real gap when it is 3 weeks or
   less; a longer gap returns null and the project list fills it with the
   studio's usual 2 or 3 weeks, alternating (Umesh, 2026-10-16: never more). */
export const HORIZON_CAP_DAYS = 21;
export function releaseHorizon(ordered, released) {
  const a = parse(ordered), b = parse(released);
  if (Number.isNaN(a) || Number.isNaN(b)) return 'Date set';
  const days = Math.round((b - a) / DAY);
  if (days < 1) return 'Date set';
  if (days > HORIZON_CAP_DAYS) return null;
  if (days <= 13) return `In ${days} day${days === 1 ? '' : 's'}`;
  const weeks = Math.round(days / 7);
  return `In ${weeks} week${weeks === 1 ? '' : 's'}`;
}

const CAPPED_HORIZONS = ['In 2 weeks', 'In 3 weeks'];
/* Give every over-the-cap project 2 or 3 weeks, alternating through the rotation. */
function alternateHorizons(list) {
  let k = 0;
  for (const p of list) {
    const chips = p.notification?.chips;
    if (chips && chips.at(-1) === null) chips[chips.length - 1] = CAPPED_HORIZONS[k++ % 2];
  }
  return list;
}

const HEADINGS = { song: 'New track', 'song+cover': 'New track + cover art', 'song+images': 'New track + images', 'song+photo': 'New track + artist photo' };

export function notificationFor(record, story) {
  const kind = story.input === 'song+cover' ? 'cover' : (story.input === 'song+images' || story.input === 'song+photo') ? 'stack' : 'song';
  const images = kind === 'cover' ? [record.cover].filter(Boolean) : kind === 'stack' ? (story.inputImages || []).slice(0, 2) : [];
  return {
    heading: HEADINGS[story.input] || HEADINGS.song,
    line2: `${record.artist}, ${record.title}`,
    chips: [...(story.files || []), releaseHorizon(record.ordered, record.released)],
    icon: { kind, images, count: story.inputCount ?? null },
  };
}

const MAX = { reels: 3, verticals: 3, thumbs: 3 };

/* Beat 4 tiles, derived from the kit the case page already lists. Posters only. */
export function kitTiles(record, story, REELS) {
  const kit = record.kit || [];
  const pack = (ui) => kit.find((k) => k.type === 'pack' && k.ui === ui);
  const reelsPack = pack('reels'), spotifyPack = pack('spotify');
  const posterOf = (it) => it.poster || it.img;
  const reels = (reelsPack?.items || []).slice(0, MAX.reels).map((it, i) => ({ poster: posterOf(it), badge: i % 2 ? 'tiktok' : 'instagram', label: it.label || '' }));
  const verticals = (spotifyPack?.items || []).slice(0, MAX.verticals - (story?.motionCover ? 1 : 0)).map((it) => ({ poster: posterOf(it), badge: 'spotify', kind: 'canvas' }));
  if (story?.motionCover) verticals.push({ poster: story.motionCover.poster, badge: 'apple', kind: 'motion' });
  const ab = kit.find((k) => k.type === 'ab');
  const thumbs = (record.thumbs || ab?.items || []).slice(0, MAX.thumbs);
  const reel = record.reel || (reelsPack?.items?.[0]?.video && REELS?.[reelsPack.items[0].video]) || null;
  return {
    reels, verticals, thumbs, reel,
    banner: record.banner || null,
    counts: { clips: reelsPack?.n || reels.length, canvases: spotifyPack?.n || verticals.filter((v) => v.kind === 'canvas').length, thumbs: ab?.n || thumbs.length },
  };
}

export function resolveProject(entry, { FEATURED, YT_CARDS, REELS }) {
  const record = entry.record || FEATURED.find((r) => r.slug === entry.slug);
  if (!record) throw new Error(`rollout: no record for ${entry.slug}`);
  const story = entry.story;
  const card = YT_CARDS[record.id] || null;
  const notification = notificationFor(record, story);
  const tiles = kitTiles(record, story, REELS);
  // A delivered video that is not on YouTube yet (record.unpublished) gets a
  // "master" card: our thumbnail and the delivery's title, no channel, no
  // platform badge. Nothing is claimed about an upload that does not exist.
  const unpublished = !!record.unpublished;
  const p = {
    slug: record.slug, title: record.title, artist: record.artist,
    ytId: record.id, cardKind: unpublished ? 'master' : 'youtube',
    ytTitle: unpublished ? `${record.title} (Official Lyric Video)` : (card?.title || ''),
    channel: unpublished ? '' : (card?.channel || ''), avatar: unpublished ? '' : (card?.avatar || ''),
    thumb: record.thumb || `/thumbs/${record.id}.webp`,   // record.thumb: a delivered thumbnail design, for premieres YouTube has no image for yet
    notification, boards: story.boards || [], pick: story.pick, preview: story.preview, note: story.note,
    change: story.change, tiles, hasCard: unpublished || !!card,
  };
  const urls = [
    p.thumb, p.avatar, ...notification.icon.images, ...p.boards.map((b) => b.img), ...p.boards.map((b) => b.from).filter(Boolean),
    p.preview?.video, p.preview?.poster,
    ...tiles.reels.map((t) => t.poster), ...tiles.verticals.map((t) => t.poster), ...tiles.thumbs, tiles.banner, tiles.reel?.avatar,
  ].filter(Boolean);
  p.assets = [...new Set(urls)];
  return p;
}

const LIMITS = { heading: 24, line2: 34, chips: 4, chipChars: 30, note: 70 };

export function validateProject(p) {
  const out = [];
  const n = p.notification || {};
  if (!p.boards || p.boards.length < 2 || p.boards.length > 4) out.push(`boards: need 2 to 4, got ${p.boards?.length ?? 0}`);
  if (p.pick !== undefined && !(Number.isInteger(p.pick) && p.pick >= 0 && p.pick < (p.boards?.length || 0))) out.push(`pick: ${p.pick} out of range`);
  if ((n.heading || '').length > LIMITS.heading) out.push(`heading: ${n.heading.length} chars > ${LIMITS.heading}`);
  if ((n.line2 || '').length > LIMITS.line2) out.push(`line2: ${n.line2.length} chars > ${LIMITS.line2}, would wrap at 360 px`);
  const chips = n.chips || [];
  if (chips.length > LIMITS.chips) out.push(`chips: ${chips.length} > ${LIMITS.chips}`);
  if (chips.join('').length > LIMITS.chipChars) out.push(`chips: ${chips.join('').length} chars > ${LIMITS.chipChars}, would wrap at 360 px`);
  const icon = n.icon || {};
  if (icon.kind === 'cover' && icon.images.length !== 1) out.push('icon: cover input needs record.cover');
  if (icon.kind === 'stack' && (icon.images.length < 1 || icon.images.length > 2)) out.push('icon: images input needs 1 or 2 inputImages');
  if ((p.note || '').length > LIMITS.note) out.push(`note: ${p.note.length} chars > ${LIMITS.note}`);
  if (!(p.assets || []).every((u) => typeof u === 'string' && u.startsWith('/'))) out.push('assets: every URL must start with /');
  if (!p.hasCard) out.push(`YT_CARDS: no entry for ${p.ytId}`);
  if (!p.preview?.video?.endsWith('.mp4')) out.push('preview.video: must be an .mp4');
  if (!p.preview?.poster?.endsWith('.webp')) out.push('preview.poster: must be a .webp');
  if (!p.tiles?.reel) out.push('reel: no Reels overlay data (record.reel or a REELS entry for the first promo clip)');
  return out;
}

/* Strict: the tests and the budget script use it; one bad entry fails the build. */
export function activeProjects(list, deps) {
  return alternateHorizons(list.filter((e) => e.on).map((e) => {
    const p = resolveProject(e, deps);
    const problems = validateProject(p);
    if (problems.length) throw new Error(`rollout: ${p.slug}: ${problems.join('; ')}`);
    return p;
  }));
}

/* Lenient: the live page uses it; a bad entry is logged and skipped, the rest play. */
export function safeProjects(list, deps) {
  const out = [];
  for (const e of list.filter((x) => x.on)) {
    try {
      const p = resolveProject(e, deps);
      const problems = validateProject(p);
      if (problems.length) { console.error(`rollout: ${p.slug}: ${problems.join('; ')}`); continue; }
      out.push(p);
    } catch (err) {
      console.error(err && err.message ? err.message : String(err));
    }
  }
  return alternateHorizons(out);
}
