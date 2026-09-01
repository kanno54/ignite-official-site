import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const assetStudioRoot = process.env.IGNITE_ASSET_STUDIO_ROOT || 'C:/Users/kanno/OneDrive/project/material_control';
const campaignId = 'live-album-2024';
const packageId = 'pkg-live-album-2024-2026-08-29T03-23-41-039Z';
const packageRoot = path.join(assetStudioRoot, 'asset-library', 'deliveries', campaignId, packageId);
const manifestPath = path.join(packageRoot, 'manifest.json');

const readUtf8 = (filePath) => fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
const readJson = (filePath) => JSON.parse(readUtf8(filePath));
const writeJson = (filePath, value) => fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
const sha256 = (filePath) => crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
const assetIdFor = (assetCode) => assetCode.toLowerCase();
const slugify = (title) => title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

if (!fs.existsSync(manifestPath)) throw new Error(`Missing LIVE ALBUM delivery package: ${packageRoot}`);
const delivery = readJson(manifestPath);
if (delivery.campaign_id !== campaignId || delivery.package_id !== packageId || delivery.assets.length !== 105) {
  throw new Error('LIVE ALBUM delivery identity/count mismatch');
}
for (const asset of delivery.assets) {
  if (asset.decision !== 'SELECTED' || asset.production_status !== 'READY') throw new Error(`Asset failed SELECTED/READY gate: ${asset.asset_code}`);
  const source = path.join(packageRoot, asset.file_path);
  if (!fs.existsSync(source) || sha256(source) !== asset.sha256) throw new Error(`Asset hash mismatch: ${asset.asset_code}`);
}

const byCode = new Map(delivery.assets.map((asset) => [asset.asset_code, asset]));
const canonicalDir = path.join(rootDir, 'content', 'canonical', campaignId);
fs.mkdirSync(canonicalDir, { recursive: true });
fs.copyFileSync(manifestPath, path.join(canonicalDir, 'manifest.json'));
fs.copyFileSync(path.join(packageRoot, 'README.md'), path.join(canonicalDir, 'README.md'));
for (const asset of delivery.assets.filter((item) => item.file_path.endsWith('.md'))) {
  fs.copyFileSync(path.join(packageRoot, asset.file_path), path.join(canonicalDir, asset.delivery_filename));
}

const siteManifestPath = path.join(rootDir, 'content', 'public', 'asset-manifest.json');
const siteManifest = readJson(siteManifestPath);
const publicVisuals = delivery.assets.filter((asset) => (
  ['COVER', 'HERO', 'ARTICLE_IMAGE', 'SONG_DETAIL'].includes(asset.asset_type)
  && !asset.asset_code.includes('-REF-')
));
for (const asset of publicVisuals) {
  const relativePath = `/assets/images/live-album-2024/${asset.delivery_filename}`;
  const target = path.join(rootDir, 'public', relativePath.slice(1));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(packageRoot, asset.file_path), target);
  siteManifest.images[assetIdFor(asset.asset_code)] = {
    path: relativePath,
    status: 'ready',
    aspect: asset.metadata?.width === asset.metadata?.height ? '1:1' : asset.metadata?.width > asset.metadata?.height ? '16:9' : '3:4',
    assetCode: asset.asset_code,
    selectedVersion: asset.version_no,
    selectedVersionId: asset.version_id,
    sha256: asset.sha256,
    sourceCampaign: campaignId,
    sourcePackage: packageId,
  };
}
writeJson(siteManifestPath, siteManifest);

const derivativesPath = path.join(rootDir, 'content', 'public', 'image-derivatives.json');
const derivatives = readJson(derivativesPath);
derivatives.profiles.liveAlbumSquare = { format: 'webp', quality: 80, widths: [160, 320, 640] };
derivatives.profiles.liveAlbumDetail = { format: 'webp', quality: 80, widths: [384, 640, 960] };
derivatives.profiles.liveAlbumArticle = { format: 'webp', quality: 80, widths: [384, 640, 960, 1280] };
for (const asset of publicVisuals) {
  const id = assetIdFor(asset.asset_code);
  if (asset.asset_code === 'LA24-H01') derivatives.assets[id] = 'heroDesktop';
  else if (asset.asset_code === 'LA24-H02') derivatives.assets[id] = 'heroMobile';
  else if (asset.asset_type === 'ARTICLE_IMAGE') derivatives.assets[id] = 'liveAlbumArticle';
  else if (asset.asset_type === 'SONG_DETAIL') derivatives.assets[id] = 'liveAlbumDetail';
  else derivatives.assets[id] = 'liveAlbumSquare';
}
writeJson(derivativesPath, derivatives);

const trackTitles = [
  'IGNITION', 'BURN IT DOWN', 'No Limits', 'FIRESTARTER', 'SOLAR', 'Heatwave',
  'Golden Hour', 'OVERDRIVE', 'Moonlit', 'Afterimage', 'Nocturne Drive', 'Afterglow',
  'Silent Signal', 'Parallel Lines', 'RISE AGAIN', 'EQUINOX', 'Electric Blue', 'Glass Ceiling',
  'Shadowplay', 'SHADOW', '5 VOICES', 'Run With Us', 'One More Flame', 'We Burn',
];
const audioCodeByTitle = Object.fromEntries(delivery.assets.filter((asset) => asset.asset_type === 'AUDIO').map((asset) => [asset.display_name.replace(/ — Live Version Audio$/, ''), asset.asset_code]));
const p01 = readUtf8(path.join(packageRoot, byCode.get('LA24-P01').file_path));
const noteFor = (trackNumber) => {
  const marker = `#### ${String(trackNumber).padStart(2, '0')}.`;
  const start = p01.indexOf(marker);
  const tail = p01.slice(start + marker.length);
  const endMatch = tail.search(/\n#{1,4} /);
  const section = (endMatch >= 0 ? tail.slice(0, endMatch) : tail).trim();
  const lines = section.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return {
    arrangementLabel: (lines.find((line) => /^\*\*.*\*\*$/.test(line)) || '').replace(/^\*\*|\*\*$/g, ''),
    arrangementText: lines.filter((line) => !/^\*\*.*\*\*$/.test(line) && line !== '---').join('\n\n'),
  };
};
const studioRelations = {
  'IGNITION': ['ignition-main', 'ignition'], 'BURN IT DOWN': ['burn-it-down-main', 'burn-it-down'], 'No Limits': ['no-limits-title', 'no-limits'],
  FIRESTARTER: ['firestarter-main', 'firestarter'], SOLAR: ['solar-title', 'solar'], Heatwave: ['solar-heatwave-remix', 'solar'],
  'Golden Hour': ['solar-golden-hour', 'solar'], OVERDRIVE: ['solar-overdrive', 'solar'], Moonlit: ['moonlit-title', 'moonlit'],
  Afterimage: ['solar-afterimage', 'solar'], 'Nocturne Drive': ['equinox-nocturne-drive', 'equinox'], Afterglow: ['equinox-afterglow', 'equinox'],
  'Silent Signal': ['silent-signal-title', 'silent-signal'], 'Parallel Lines': ['equinox-parallel-lines', 'equinox'], 'RISE AGAIN': ['rise-again-title', 'rise-again'],
  EQUINOX: ['equinox-title', 'equinox'], 'Electric Blue': ['equinox-electric-blue', 'equinox'], 'Glass Ceiling': ['equinox-glass-ceiling', 'equinox'],
  Shadowplay: ['equinox-shadowplay', 'equinox'], SHADOW: ['equinox-shadow', 'equinox'], '5 VOICES': ['equinox-5-voices', 'equinox'],
  'Run With Us': ['solar-run-with-us', 'solar'],
};
const stablePreviewIds = new Map([
  ['Heatwave', 'live-album-2024-heatwave'], ['Moonlit', 'live-album-2024-moonlit'], ['Silent Signal', 'live-album-2024-silent-signal'],
]);

const recordings = trackTitles.map((title, index) => {
  const overall = index + 1;
  const discNumber = overall <= 12 ? 1 : 2;
  const assetIndex = String(overall).padStart(2, '0');
  const audioCode = audioCodeByTitle[title];
  const audioAsset = byCode.get(audioCode);
  if (!audioAsset) throw new Error(`Missing Player Metadata audio mapping for ${title}`);
  const audioRelativePath = `/media/audio/live-album-2024/${audioAsset.delivery_filename}`;
  const audioTarget = path.join(rootDir, 'public', audioRelativePath.slice(1));
  fs.mkdirSync(path.dirname(audioTarget), { recursive: true });
  fs.copyFileSync(path.join(packageRoot, audioAsset.file_path), audioTarget);
  const relation = studioRelations[title] || [null, null];
  return {
    id: stablePreviewIds.get(title) || `live-album-2024-${slugify(title)}`,
    releaseId: campaignId,
    title,
    versionLabel: 'LIVE 2024',
    trackNumber: overall,
    durationSeconds: 0,
    audioUrl: audioRelativePath,
    audioStatus: 'ready',
    spotlightMemberIds: [],
    moodTags: [],
    linerNotes: noteFor(overall).arrangementText,
    lyrics: [],
    posterAssetId: `la24-tr${assetIndex}-sq`,
    artwork: { square: `la24-tr${assetIndex}-sq`, vertical: `la24-tr${assetIndex}-sd` },
    discNumber,
    discTrackNumber: overall <= 12 ? overall : overall - 12,
    overallTrackNumber: overall,
    arrangementLabel: noteFor(overall).arrangementLabel,
    arrangementText: noteFor(overall).arrangementText,
    originalRecordingId: relation[0],
    relatedReleaseId: relation[1],
    songDetailSlug: slugify(title),
    publicationState: 'RELEASED',
    relation: 'LIVE_VERSION',
    provenance: 'UNSPECIFIED',
    source: { campaignId, audioAssetCode: audioCode, audioVersionId: audioAsset.version_id, audioSha256: audioAsset.sha256 },
  };
});

// PREVIEW -> RELEASED is a migration, not a copy. Remove only the three
// explicitly identified legacy preview files after their formal targets exist.
for (const title of stablePreviewIds.keys()) {
  const audioCode = audioCodeByTitle[title];
  const legacyPreview = path.join(rootDir, 'public', 'media', 'audio', campaignId, 'previews', `${audioCode}_v01.mp3`);
  const formalRecording = recordings.find((recording) => recording.title === title);
  const formalFile = path.join(rootDir, 'public', formalRecording.audioUrl.slice(1));
  if (fs.existsSync(legacyPreview)) {
    if (sha256(legacyPreview) !== sha256(formalFile)) throw new Error(`Legacy preview differs from formal Recording: ${title}`);
    fs.rmSync(legacyPreview);
  }
}

const discographyPath = path.join(rootDir, 'content', 'public', 'discography.json');
const discography = readJson(discographyPath);
// Recover any studio recordings removed by an interrupted/older migration run.
// The protected M11A Git baseline is authoritative for those pre-existing IDs.
const baselineDiscography = JSON.parse(execFileSync('git', ['show', 'HEAD:content/public/discography.json'], { cwd: rootDir, encoding: 'utf8' }));
for (const baselineRecording of baselineDiscography.recordings) {
  if (!discography.recordings.some((recording) => recording.id === baselineRecording.id)) discography.recordings.push(baselineRecording);
}
discography.releases = discography.releases.filter((release) => release.id !== campaignId);
discography.recordings = discography.recordings.filter((recording) => recording.releaseId !== campaignId);
discography.releases.push({
  id: campaignId,
  slug: campaignId,
  title: 'IGNITE LIVE 2024',
  format: '2-Disc Live Album',
  fictionalReleaseDate: '',
  fictionalReleaseDateFull: '',
  coverAssetId: 'la24-c01',
  description: 'THE SHOW ENDED. THE SOUND REMAINS. 2024年のライブで作り直された楽曲を、2枚組・全24曲の音楽作品として残す。',
  linerNotes: readUtf8(path.join(packageRoot, byCode.get('LA24-D02').file_path)).replace(/^#.*\r?\n+## Album Liner Note\r?\n+/s, '').trim(),
  trackIds: recordings.map((recording) => recording.id),
  campaignState: 'past',
  releaseKind: 'LIVE_ALBUM',
  discCount: 2,
  canonicalMarkdown: p01,
  relatedLiveArchiveId: 'live-tour-2024',
  relatedReleaseIds: [...new Set(recordings.map((recording) => recording.relatedReleaseId).filter(Boolean))],
  source: { campaignId, packageId, tracklistAssetCode: 'LA24-D01', linerNotesAssetCode: 'LA24-D02', pageAssetCode: 'LA24-P01' },
  publication: { fictionalReleaseDate: '', publishAt: null, visibility: 'public', campaignState: 'staging' },
});
discography.recordings.push(...recordings);
writeJson(discographyPath, discography);

const editorialMeta = [
  ['LA24-AR01', 'how-ignite-changed-the-songs', 'HOW IGNITE CHANGED THE SONGS'],
  ['LA24-AR02', 'solar-brass-session', 'SOLAR BRASS SESSION'],
  ['LA24-AR03', 'midnight-session', 'MIDNIGHT SESSION'],
  ['LA24-AR04', 'silent-signal-when-the-signal-stopped-being-silent', 'SILENT SIGNAL — WHEN THE SIGNAL STOPPED BEING SILENT'],
  ['LA24-AR05', 'remove-the-light', 'REMOVE THE LIGHT'],
  ['LA24-AR06', 'five-songs-that-changed-on-tour', 'FIVE SONGS THAT CHANGED ON TOUR'],
];
const articlesPath = path.join(rootDir, 'content', 'public', 'articles.json');
const articles = readJson(articlesPath).filter((article) => article.relatedCampaignId !== campaignId);
for (const [code, slug, title] of editorialMeta) {
  const markdown = readUtf8(path.join(packageRoot, byCode.get(code).file_path));
  const firstBody = markdown.split(/\r?\n\r?\n/).find((part) => !part.startsWith('#')) || '';
  articles.unshift({
    id: code.toLowerCase(), slug, title, kicker: 'LIVE ALBUM 2024', dek: firstBody.replace(/\*\*/g, ''),
    publishDate: '', publishDateFull: '', readingTimeMinutes: Math.max(4, Math.ceil(markdown.length / 700)),
    mainSpeakerIds: [], heroAssetId: `${code.toLowerCase()}-h`, relatedTrackIds: [], relatedCampaignId: campaignId,
    canonicalMarkdown: markdown, sourceAssetCode: code, blocks: [{ type: 'lead', content: firstBody.replace(/\*\*/g, '') }],
    publication: { fictionalReleaseDate: '', publishAt: null, visibility: 'public', campaignState: 'staging' },
  });
}
writeJson(articlesPath, articles);

const campaignsPath = path.join(rootDir, 'content', 'public', 'campaigns.json');
const campaigns = readJson(campaignsPath).filter((campaign) => campaign.id !== campaignId);
campaigns.push({
  id: campaignId, slug: campaignId, shortTitle: 'LIVE ALBUM 2024', status: 'staging', releaseId: campaignId, releaseDate: '',
  eyebrow: '2-DISC LIVE ALBUM // 24 TRACKS', title: 'IGNITE LIVE 2024', catchCopy: 'THE SHOW ENDED. THE SOUND REMAINS.',
  desktopHero: '/assets/images/live-album-2024/LA24-H01_v01.png', mobileHero: '/assets/images/live-album-2024/LA24-H02_v01.png',
  primaryCta: { text: 'LISTEN TO THE LIVE ALBUM', action: 'link', url: '/discography/live-album-2024/' },
  secondaryCta: { text: 'EXPLORE LIVE TOUR 2024', action: 'link', url: '/live/live-tour-2024/' },
  campaignColors: { accent: '#5f82ff', deep: '#080b13', text: '#f6f3ed' },
  relatedArticleIds: editorialMeta.map(([code]) => code.toLowerCase()),
});
writeJson(campaignsPath, campaigns);

const canonicalNewsMarkdown = readUtf8(path.join(packageRoot, byCode.get('LA24-N01').file_path));
// The approved announcement remains canonical, while its obsolete teaser section
// is not rendered after formal release.
const newsMarkdown = canonicalNewsMarkdown.replace(/\n## MORE DETAILS COMING[\s\S]*?(?=\n### RELATED)/, '');
const newsPath = path.join(rootDir, 'content', 'public', 'news.json');
const news = readJson(newsPath).filter((item) => item.id !== 'la24-n01');
news.unshift({
  id: 'la24-n01', date: '', category: 'RELEASE', title: 'IGNITE LIVE TOUR 2024、2枚組LIVE ALBUMとしてリリース決定',
  description: 'THE SHOW ENDED. THE SOUND REMAINS. 2 Discs / 24 Tracks.', ctaLabel: 'READ RELEASE NEWS',
  url: '/news/live-album-2024/', imageAssetId: 'la24-h01', canonicalMarkdown: newsMarkdown, sourceAssetCode: 'LA24-N01',
  publication: { fictionalReleaseDate: '', publishAt: null, visibility: 'public', campaignState: 'staging' },
});
writeJson(newsPath, news);

const livePath = path.join(rootDir, 'content', 'public', 'live.json');
const live = readJson(livePath);
const tour = live.find((archive) => archive.id === 'live-tour-2024');
if (!tour) throw new Error('Protected LIVE TOUR 2024 archive is missing');
delete tour.preview;
tour.relatedReleaseIds = [...new Set([...(tour.relatedReleaseIds || []), campaignId])];
writeJson(livePath, live);

writeJson(path.join(rootDir, 'content', 'public', 'live-album-2024.json'), {
  id: campaignId, packageId, tracklistAssetCode: 'LA24-D01', pageMarkdown: p01,
  linerNotesMarkdown: readUtf8(path.join(packageRoot, byCode.get('LA24-D02').file_path)),
  newsMarkdown, editorialIds: editorialMeta.map(([code]) => code.toLowerCase()),
  excludedReferenceAssetCodes: delivery.assets.filter((asset) => asset.asset_type === 'REFERENCE').map((asset) => asset.asset_code),
  publicVisualAssetIds: publicVisuals.map((asset) => assetIdFor(asset.asset_code)),
});

console.log(`LIVE ALBUM 2024 integrated: ${recordings.length} tracks, ${editorialMeta.length} editorials, ${publicVisuals.length} public visuals, 0 reference visuals.`);
