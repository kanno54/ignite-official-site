import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const assetStudioRoot = process.env.IGNITE_ASSET_STUDIO_ROOT
  || 'C:/Users/kanno/OneDrive/project/material_control';
const campaignId = 'live-tour-2024';
const packageId = 'pkg-live-tour-2024-2026-08-30T01-53-36-089Z';
const packageRoot = path.join(assetStudioRoot, 'asset-library', 'deliveries', campaignId, packageId);
const deliveryManifestPath = path.join(packageRoot, 'manifest.json');
const auditCsvPath = path.join(rootDir, 'reports', 'm11a-2-live-tour-2024-asset-audit', 'live-tour-2024-assets.csv');

// SELECTED v02 corrections verified against the production Asset Studio database.
// The original delivery package remains the immutable v01 baseline; these files
// are copied alongside it so canonical history is preserved.
const selectedCorrections = [
  ['LV24-L01', 'v-lv24-l01-2-1788063481331', 2, 'assets/live-tour-2024/LV24-L01/source/v02.md', 'LV24-L01_v02.md', '999d0b8718e012978f447fb91414e17e231f90512687c8d0cc24db97d556439c'],
  ['LV24-L02', 'v-lv24-l02-2-1788063479912', 2, 'assets/live-tour-2024/LV24-L02/source/v02.md', 'LV24-L02_v02.md', 'c3cf61f435bd1af5c0d03ad9238316aec34b070c80efb98612a365cc0d092d1c'],
  ['LV24-L03', 'v-lv24-l03-2-1788063478785', 2, 'assets/live-tour-2024/LV24-L03/source/v02.md', 'LV24-L03_v02.md', 'd748f46786094279485dacf3a57b0e838308d205ec51ebb9a304e20b67a69e93'],
  ['LV24-L04', 'v-lv24-l04-2-1788063477678', 2, 'assets/live-tour-2024/LV24-L04/source/v02.md', 'LV24-L04_v02.md', '8dbb3053a9927967ea8e9c2ba0a3cb5d0cc798d187b3e54f4587611c3215ab3e'],
  ['LV24-L04G-2', 'v-lv24-l04g-2-2-1788063486040', 2, 'assets/live-tour-2024/LV24-L04G-2/source/v02.png', 'LV24-L04G-2_v02.png', 'b3887eca36a215dc8faffcac7089e57801bbd16ae9b146819d09601e92d46fab'],
  ['LV24-L05', 'v-lv24-l05-2-1788063484443', 2, 'assets/live-tour-2024/LV24-L05/source/v02.md', 'LV24-L05_v02.md', 'a9f7ccb32f28bf6d1100b29a02c5bd7bd768c1432d40d8d3e94b7442b3ba01b7'],
  ['LV24-L06', 'v-lv24-l06-2-1788063482686', 2, 'assets/live-tour-2024/LV24-L06/source/v02.md', 'LV24-L06_v02.md', 'dcdd08aea9526860c2fbd559af7367ccc9b3d0e1727a9917a060d1e1ed873694'],
].map(([assetCode, versionId, versionNo, filePath, deliveryFilename, hash]) => ({
  assetCode,
  versionId,
  versionNo,
  filePath,
  deliveryFilename,
  sha256: hash,
}));
const selectedCorrectionByCode = new Map(selectedCorrections.map((item) => [item.assetCode, item]));

const readUtf8 = (filePath) => fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
const readJson = (filePath) => JSON.parse(readUtf8(filePath));
const writeJson = (filePath, value) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};
const sha256 = (filePath) => crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
const assetIdFor = (assetCode) => assetCode.toLowerCase();
const imageDimensions = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buffer.subarray(0, 8).equals(signature)) throw new Error(`Expected PNG source: ${filePath}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};
const aspectFor = ({ width, height }) => {
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.04) return '16:9';
  if (Math.abs(ratio - 3 / 2) < 0.04) return '3:2';
  if (Math.abs(ratio - 4 / 5) < 0.04) return '4:5';
  if (Math.abs(ratio - 3 / 4) < 0.04) return '3:4';
  if (Math.abs(ratio - 1) < 0.04) return '1:1';
  return `${width}:${height}`;
};
const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(field);
      field = '';
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers, ...values] = rows;
  return values.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ''])));
};

if (!fs.existsSync(deliveryManifestPath)) throw new Error(`Missing delivery package: ${packageRoot}`);
if (!fs.existsSync(auditCsvPath)) throw new Error(`Missing latest READ-ONLY audit CSV: ${auditCsvPath}`);

const deliveryManifest = readJson(deliveryManifestPath);
if (deliveryManifest.campaign_id !== campaignId || deliveryManifest.package_id !== packageId) {
  throw new Error('LIVE TOUR 2024 delivery identity mismatch');
}
const byCode = new Map(deliveryManifest.assets.map((asset) => [asset.asset_code, asset]));
const auditByCode = new Map(parseCsv(readUtf8(auditCsvPath)).map((asset) => [asset.asset_code, asset]));

const tourVisualCodes = [
  'LV24-C-H01', 'LV24-C-H02', 'LV24-C-C01', 'LV24-C-S01',
  'LV24-I01', 'LV24-I02', 'LV24-I03', 'LV24-I04',
  ...Array.from({ length: 12 }, (_, index) => `LV24-FG${String(index + 1).padStart(2, '0')}`),
  ...Array.from({ length: 6 }, (_, index) => [`LV24-L${String(index + 1).padStart(2, '0')}G-1`, `LV24-L${String(index + 1).padStart(2, '0')}G-2`]).flat(),
  'LV24-LG04', 'LV24-LG05', 'LV24-OG01',
];
const requiredContentCodes = [
  'LV24-P01', 'LV24-D01', 'LV24-D02', 'LV24-F01', 'LV24-F02', 'LV24-F03',
  'LV24-F04', 'LV24-F05', 'LV24-L00', 'LV24-L01', 'LV24-L02', 'LV24-L03',
  'LV24-L04', 'LV24-L05', 'LV24-L06', 'LV24-R01',
];
const requiredTourCodes = [...tourVisualCodes, ...requiredContentCodes];

for (const assetCode of requiredTourCodes) {
  const delivered = byCode.get(assetCode);
  if (!delivered) throw new Error(`Required delivery asset is missing: ${assetCode}`);
  if (delivered.decision !== 'SELECTED' || delivered.production_status !== 'READY') {
    throw new Error(`Required delivery asset is not SELECTED/READY: ${assetCode}`);
  }
  const audited = auditByCode.get(assetCode);
  if (!audited) throw new Error(`Required asset is missing from latest audit CSV: ${assetCode}`);
  if (audited.selected_version_status !== 'SELECTED' || audited.file_exists !== 'TRUE' || !audited.delivery_status.startsWith('DELIVERED:')) {
    throw new Error(`Required asset failed latest audit gate: ${assetCode}`);
  }
}

const manifestPath = path.join(rootDir, 'content', 'public', 'asset-manifest.json');
const siteManifest = readJson(manifestPath);
const canonicalDir = path.join(rootDir, 'content', 'canonical', 'live', campaignId);
fs.mkdirSync(canonicalDir, { recursive: true });
fs.copyFileSync(deliveryManifestPath, path.join(canonicalDir, 'manifest.json'));
fs.copyFileSync(path.join(packageRoot, 'README.md'), path.join(canonicalDir, 'README.md'));

for (const asset of deliveryManifest.assets.filter((item) => item.file_path.endsWith('.md'))) {
  const sourcePath = path.join(packageRoot, asset.file_path);
  if (sha256(sourcePath) !== asset.sha256) throw new Error(`Source hash mismatch: ${asset.asset_code}`);
  fs.copyFileSync(sourcePath, path.join(canonicalDir, asset.delivery_filename));
}

for (const correction of selectedCorrections) {
  const sourcePath = path.join(assetStudioRoot, 'asset-library', correction.filePath);
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing SELECTED correction source: ${correction.assetCode}`);
  if (sha256(sourcePath) !== correction.sha256) throw new Error(`SELECTED correction hash mismatch: ${correction.assetCode}`);
  if (correction.filePath.endsWith('.md')) {
    fs.copyFileSync(sourcePath, path.join(canonicalDir, correction.deliveryFilename));
  }
}

for (const assetCode of tourVisualCodes) {
  const asset = byCode.get(assetCode);
  const sourcePath = path.join(packageRoot, asset.file_path);
  if (sha256(sourcePath) !== asset.sha256) throw new Error(`Source hash mismatch: ${assetCode}`);
  const relativePath = `/assets/images/live/live-tour-2024/${asset.delivery_filename}`;
  const targetPath = path.join(rootDir, 'public', relativePath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
  if (sha256(targetPath) !== asset.sha256) throw new Error(`Copied hash mismatch: ${assetCode}`);
  const dimensions = asset.metadata?.width ? asset.metadata : imageDimensions(sourcePath);
  siteManifest.images[assetIdFor(assetCode)] = {
    path: relativePath,
    status: 'ready',
    aspect: aspectFor(dimensions),
    assetCode,
    selectedVersion: asset.version_no,
    sha256: asset.sha256,
    sourcePackage: packageId,
  };
}


const correctedVisual = selectedCorrectionByCode.get('LV24-L04G-2');
const correctedVisualSource = path.join(assetStudioRoot, 'asset-library', correctedVisual.filePath);
const correctedVisualRelativePath = `/assets/images/live/live-tour-2024/${correctedVisual.deliveryFilename}`;
const correctedVisualTarget = path.join(rootDir, 'public', correctedVisualRelativePath.replace(/^\//, ''));
fs.copyFileSync(correctedVisualSource, correctedVisualTarget);
if (sha256(correctedVisualTarget) !== correctedVisual.sha256) throw new Error('Copied hash mismatch: LV24-L04G-2 v02');
siteManifest.images[assetIdFor('LV24-L04G-2')] = {
  path: correctedVisualRelativePath,
  status: 'ready',
  aspect: aspectFor(imageDimensions(correctedVisualSource)),
  assetCode: 'LV24-L04G-2',
  selectedVersion: correctedVisual.versionNo,
  selectedVersionId: correctedVisual.versionId,
  sha256: correctedVisual.sha256,
  sourceCampaign: campaignId,
  source: 'ASSET_STUDIO_SELECTED_CORRECTION',
};

const previewSources = [
  {
    id: 'live-album-2024-heatwave',
    title: 'Heatwave',
    trackNumber: 6,
    audioAssetCode: 'LA24-AU-HEATWAVE',
    audioVersionId: 'v-la24-au-heatwave-1-1787958772427',
    audioSha256: '75f5a209e929e62c815c7792008bfa836759a2960773aa01d6e57da2b81548f8',
    teaserAssetCode: 'LA24-T03',
    teaserVersionId: 'v-la24-t03-1-1787972807273',
    teaserSha256: 'a272cda8f08c8248f9477104e03539c0a905c74262ab09b5241f2a7ca27b1c87',
  },
  {
    id: 'live-album-2024-moonlit',
    title: 'Moonlit',
    trackNumber: 9,
    audioAssetCode: 'LA24-AU-MOONLIT',
    audioVersionId: 'v-la24-au-moonlit-1-1787958821593',
    audioSha256: '3668334020bb96db976c608e7508406e91ae301209bafcf2d0a331d01fcd0f84',
    teaserAssetCode: 'LA24-T04',
    teaserVersionId: 'v-la24-t04-1-1787972809089',
    teaserSha256: '105e32f9b790586fd210427a373fa65512d9beba42a68f330cf68bb1450f97a2',
  },
  {
    id: 'live-album-2024-silent-signal',
    title: 'Silent Signal',
    trackNumber: 13,
    audioAssetCode: 'LA24-AU-SILENT-SIGNAL',
    audioVersionId: 'v-la24-au-silent-signal-1-1787959064384',
    audioSha256: 'e9d5069649bdd4388041aa2dabaa31e7ec8b2415893121e1c6bbc299d58f57a4',
    teaserAssetCode: 'LA24-T05',
    teaserVersionId: 'v-la24-t05-1-1787972810504',
    teaserSha256: '13dc60356c26c198c7e3f603c033f6eca80530c855372a6c9bfa3d3b20be78d9',
  },
];

for (const preview of previewSources) {
  const audioSource = path.join(assetStudioRoot, 'asset-library', 'assets', 'live-album-2024', preview.audioAssetCode, 'source', 'v01.mp3');
  const teaserSource = path.join(assetStudioRoot, 'asset-library', 'assets', 'live-album-2024', preview.teaserAssetCode, 'source', 'v01.png');
  if (sha256(audioSource) !== preview.audioSha256) throw new Error(`Preview audio hash mismatch: ${preview.audioAssetCode}`);
  if (sha256(teaserSource) !== preview.teaserSha256) throw new Error(`Preview teaser hash mismatch: ${preview.teaserAssetCode}`);

  const audioRelativePath = `/media/audio/live-album-2024/previews/${preview.audioAssetCode}_v01.mp3`;
  const audioTarget = path.join(rootDir, 'public', audioRelativePath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(audioTarget), { recursive: true });
  fs.copyFileSync(audioSource, audioTarget);

  const teaserRelativePath = `/assets/images/live/live-tour-2024/previews/${preview.teaserAssetCode}_v01.png`;
  const teaserTarget = path.join(rootDir, 'public', teaserRelativePath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(teaserTarget), { recursive: true });
  fs.copyFileSync(teaserSource, teaserTarget);
  siteManifest.images[assetIdFor(preview.teaserAssetCode)] = {
    path: teaserRelativePath,
    status: 'ready',
    aspect: aspectFor(imageDimensions(teaserSource)),
    assetCode: preview.teaserAssetCode,
    selectedVersion: 1,
    selectedVersionId: preview.teaserVersionId,
    sha256: preview.teaserSha256,
    sourceCampaign: 'live-album-2024',
    usage: 'PREVIEW_ONLY',
  };
  preview.audioUrl = audioRelativePath;
}

const readCanonical = (assetCode) => {
  const correction = selectedCorrectionByCode.get(assetCode);
  const filename = correction?.deliveryFilename || byCode.get(assetCode).delivery_filename;
  return readUtf8(path.join(canonicalDir, filename)).trim();
};
const scheduleData = JSON.parse(readCanonical('LV24-D02'));
const setlistData = JSON.parse(readCanonical('LV24-F01'));
const tourLogIndex = JSON.parse(readCanonical('LV24-L00'));
const tourLogImageCodes = Array.from({ length: 6 }, (_, index) => {
  const prefix = `LV24-L${String(index + 1).padStart(2, '0')}G`;
  return [`${prefix}-1`, `${prefix}-2`];
});
const tourLogMetadata = [
  { title: 'THE FIRST SIGNAL', progressLabel: '2 / 12', keyMoments: ['IGNITION', 'No Limits'] },
  { title: 'HEAT RETURNS', progressLabel: '4 / 12', keyMoments: ['Heatwave', 'RISE AGAIN'] },
  { title: 'HOLD THE SILENCE', progressLabel: '6 / 12', keyMoments: ['Silent Signal', 'EQUINOX'] },
  { title: 'ONE MORE TIME', progressLabel: '8 / 12', keyMoments: ['Silent Signal', 'Encore MC'] },
  { title: 'AFTERGLOW', progressLabel: '10 / 12', keyMoments: ['Afterglow'] },
  { title: 'WE BURN', progressLabel: '12 / 12 COMPLETE', keyMoments: ['EQUINOX', 'One More Flame', 'We Burn'] },
];

const archive = {
  id: campaignId,
  slug: 'live-tour-2024',
  year: 2024,
  timingLabel: '2024.05–09',
  title: 'LIVE TOUR 2024',
  eventTitle: 'IGNITE LIVE TOUR 2024 “SOLAR / LUNAR / EQUINOX / SHADOW”',
  subtitle: 'FOUR PHASES. FIVE VOICES. ONE STAGE.',
  archiveRole: 'COMPLETE',
  heroDesktopAssetId: assetIdFor('LV24-C-H01'),
  heroMobileAssetId: assetIdFor('LV24-C-H02'),
  logoAssetId: assetIdFor('LV24-LG05'),
  compactLogoAssetId: assetIdFor('LV24-LG04'),
  ogAssetId: assetIdFor('LV24-OG01'),
  stageConceptAssetId: assetIdFor('LV24-C-S01'),
  costumeAssetId: assetIdFor('LV24-C-C01'),
  chapterVisuals: [
    { id: 'solar', title: 'SOLAR', assetId: assetIdFor('LV24-I01') },
    { id: 'lunar', title: 'LUNAR', assetId: assetIdFor('LV24-I02') },
    { id: 'equinox', title: 'EQUINOX', assetId: assetIdFor('LV24-I03') },
    { id: 'shadow', title: 'SHADOW', assetId: assetIdFor('LV24-I04') },
  ],
  galleryAssetIds: Array.from({ length: 12 }, (_, index) => assetIdFor(`LV24-FG${String(index + 1).padStart(2, '0')}`)),
  documents: [
    ['COMPLETE ARCHIVE', 'LV24-P01', null],
    ['TOUR CONCEPT', 'LV24-D01', null],
    ['TOUR FINAL REPORT', 'LV24-F02', null],
    ['STAGE CONCEPT', 'LV24-F03', 'LV24-C-S01'],
    ['COSTUME OVERVIEW', 'LV24-F04', 'LV24-C-C01'],
    ['FIVE-MEMBER FINAL COMMENTS', 'LV24-F05', null],
  ].map(([label, sourceAssetCode, imageAssetCode]) => ({
    label,
    sourceAssetCode,
    markdown: readCanonical(sourceAssetCode),
    imageAssetId: imageAssetCode ? assetIdFor(imageAssetCode) : undefined,
  })),
  schedule: {
    cityCount: scheduleData.tour.city_count,
    showCount: scheduleData.tour.show_count,
    start: scheduleData.tour.period.start,
    end: scheduleData.tour.period.end,
    shows: scheduleData.schedule,
    sourceAssetCode: 'LV24-D02',
  },
  setlist: {
    display: true,
    status: 'CANONICAL_24_TRACK',
    displayLabel: '24-TRACK CANONICAL SETLIST',
    showTrackNumbers: true,
    tracks: setlistData.setlist.filter((item) => item.type === 'TRACK').map((track) => ({
      trackNumber: track.track_number,
      title: track.title,
      section: track.chapter || null,
      note: track.note || null,
    })),
    sourceAssetCode: 'LV24-F01',
  },
  tourLogs: tourLogIndex.entries.map((entry, index) => ({
    slug: entry.log_id,
    title: tourLogMetadata[index].title,
    city: entry.city,
    leg: entry.leg,
    venue: entry.venue,
    dateRange: entry.date_range,
    sourceAssetCode: `LV24-L${String(index + 1).padStart(2, '0')}`,
    sourceVersion: 2,
    progressLabel: tourLogMetadata[index].progressLabel,
    keyMoments: tourLogMetadata[index].keyMoments,
    markdown: readCanonical(`LV24-L${String(index + 1).padStart(2, '0')}`),
    heroAssetId: assetIdFor(tourLogImageCodes[index][0]),
    galleryAssetIds: tourLogImageCodes[index].map(assetIdFor),
  })),
  relatedReleaseIds: ['solar', 'moonlit', 'silent-signal', 'rise-again', 'equinox'],
  relatedRecordingIds: [],
  preview: {
    eyebrow: 'LIVE ALBUM 2024 // PREVIEW',
    title: 'LISTEN TO THE LIVE ALBUM',
    copy: 'あの日の24曲を、もう一度。',
    sourceAssetCode: 'LV24-R01',
    formalReleaseRoute: null,
    recordings: previewSources.map((preview) => ({
      id: preview.id,
      releaseId: 'live-album-2024',
      title: preview.title,
      versionLabel: 'LIVE 2024 PREVIEW',
      trackNumber: preview.trackNumber,
      durationSeconds: 0,
      audioUrl: preview.audioUrl,
      audioStatus: 'ready',
      spotlightMemberIds: [],
      moodTags: [],
      linerNotes: '',
      lyrics: [],
      posterAssetId: assetIdFor(preview.teaserAssetCode),
      publicationState: 'PREVIEW',
      relation: 'PREVIEW',
      provenance: 'UNSPECIFIED',
      source: {
        campaignId: 'live-album-2024',
        audioAssetCode: preview.audioAssetCode,
        audioVersionId: preview.audioVersionId,
        audioSha256: preview.audioSha256,
        teaserAssetCode: preview.teaserAssetCode,
        teaserVersionId: preview.teaserVersionId,
        teaserSha256: preview.teaserSha256,
      },
    })),
  },
  source: {
    campaignId,
    packageId,
    packageGeneratedAt: deliveryManifest.generated_at,
    selectedAssetCodes: deliveryManifest.assets.map((asset) => asset.asset_code),
    publicVisualAssetIds: tourVisualCodes.map(assetIdFor),
    auditCsv: 'reports/m11a-2-live-tour-2024-asset-audit/live-tour-2024-assets.csv',
    excludedReferenceAssetCodes: ['LV24-REF-LOGO-SPEC', 'LV24-REF-SETLIST24', 'LV24-LG01'],
    selectedCorrections: selectedCorrections.map(({ assetCode, versionId, versionNo, sha256: hash }) => ({ assetCode, versionId, versionNo, sha256: hash })),
  },
  publication: {
    fictionalReleaseDate: '2024.09',
    publishAt: null,
    visibility: 'public',
    campaignState: 'staging',
  },
};

const livePath = path.join(rootDir, 'content', 'public', 'live.json');
const liveArchives = readJson(livePath).filter((item) => item.id !== campaignId);
liveArchives.push(archive);
liveArchives.sort((a, b) => a.year - b.year || a.timingLabel.localeCompare(b.timingLabel));
writeJson(livePath, liveArchives);
writeJson(manifestPath, siteManifest);

const announcement = {
  id: 'news-2024-09-15-live-tour-2024-archive',
  date: '2024.09.15',
  category: 'LIVE',
  title: 'LIVE TOUR 2024 — TOUR ARCHIVE NOW OPEN',
  description: 'SOLAR / LUNAR / EQUINOX / SHADOW。12公演を巡ったIGNITE LIVE TOUR 2024の特設ページを公開しました。Tour Log、ステージ／衣装コンセプト、Final Galleryとともにツアーの記録を辿れます。',
  ctaLabel: 'VIEW LIVE TOUR 2024',
  url: '/live/live-tour-2024/',
  imageAssetId: assetIdFor('LV24-C-H01'),
  publication: {
    visibility: 'public',
    campaignState: 'staging',
  },
};
const newsPath = path.join(rootDir, 'content', 'public', 'news.json');
const news = readJson(newsPath).filter((item) => item.id !== announcement.id);
news.push(announcement);
news.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
writeJson(newsPath, news);

console.log(`Integrated ${campaignId}: ${archive.setlist.tracks.length} tracks, ${archive.tourLogs.length} tour logs, ${archive.preview.recordings.length} preview recordings.`);
