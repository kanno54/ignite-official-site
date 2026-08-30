import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const assetStudioRoot = process.env.IGNITE_ASSET_STUDIO_ROOT
  || 'C:/Users/kanno/OneDrive/project/material_control';
const deliveryRoot = path.join(assetStudioRoot, 'asset-library', 'deliveries');

const campaigns = [
  {
    id: 'live-spark-2021',
    packageDir: 'pkg-live-spark-2021-2026-08-26T13-42-56-938Z',
    slug: 'spark-2021',
    year: 2021,
    timingLabel: '2021.12',
    title: 'LIVE SPARK 2021',
    eventTitle: 'IGNITE 1st LIVE “SPARK”',
    subtitle: 'IGNITE、最初のワンマンライブ。',
    archiveRole: 'FULL',
    heroDesktopCode: 'LV-SP-H01',
    heroMobileCode: 'LV-SP-H02',
    galleryCodes: ['LV-SP-G01', 'LV-SP-G02', 'LV-SP-G03', 'LV-SP-G04'],
    documents: [
      ['ARCHIVE', 'content/LV-SP-P01_v01.md'],
      ['OVERVIEW / ARCHIVE NOTE', 'content/LV-SP-A01_v01.md'],
    ],
    setlistFile: 'images/LV-SP-D01_v01.md',
    setlistKind: 'hidden',
    relatedReleaseIds: ['ignition', 'burn-it-down'],
    relatedRecordingIds: [],
  },
  {
    id: 'live-no-limits-2022',
    packageDir: 'pkg-live-no-limits-2022-2026-08-28T06-15-05-975Z',
    slug: 'no-limits-2022',
    year: 2022,
    timingLabel: '2022.11',
    title: 'LIVE NO LIMITS 2022',
    eventTitle: 'IGNITE LIVE HOUSE TOUR “NO LIMITS”',
    subtitle: '2022 — 小さな会場で、五人と客席の距離が変わった',
    archiveRole: 'FULL',
    heroDesktopCode: 'LV-NL-H01',
    heroMobileCode: 'LV-NL-H02',
    galleryCodes: ['LV-NL-G01', 'LV-NL-G02', 'LV-NL-G03', 'LV-NL-G04', 'LV-NL-G05', 'LV-NL-G06'],
    documents: [
      ['ARCHIVE', 'content/LV-NL-P01_v01.md'],
      ['OVERVIEW / ARCHIVE NOTE', 'content/LV-NL-A01_v01.md'],
      ['TOUR HIGHLIGHTS', 'content/LV-NL-D02_v01.md'],
    ],
    setlistFile: 'images/LV-NL-D01_v01.md',
    setlistKind: 'representative',
    relatedReleaseIds: ['no-limits'],
    relatedRecordingIds: ['run-with-us-live'],
  },
  {
    id: 'live-first-light-2022',
    packageDir: 'pkg-live-first-light-2022-2026-08-26T14-19-43-995Z',
    slug: 'first-light-2022',
    year: 2022,
    timingLabel: '2022.12',
    title: 'LIVE FIRST LIGHT 2022',
    eventTitle: 'IGNITE YEAR-END LIVE “FIRST LIGHT”',
    subtitle: 'ひとつの年の終わりであり、次の朝が始まる直前の記録。',
    archiveRole: 'COMPACT',
    heroDesktopCode: 'LV-FL-H01',
    heroMobileCode: 'LV-FL-H02',
    galleryCodes: ['LV-FL-G01', 'LV-FL-G02', 'LV-FL-G03', 'LV-FL-G04'],
    documents: [
      ['COMPACT ARCHIVE', 'content/LV-FL-P01_v01.md'],
      ['SHORT ARCHIVE NOTE', 'content/LV-FL-A01_v01.md'],
    ],
    setlistFile: 'images/LV-FL-D01_v01.md',
    setlistKind: 'partial',
    relatedReleaseIds: ['no-limits', 'firestarter'],
    relatedRecordingIds: [],
  },
  {
    id: 'live-solar-tour-2023',
    packageDir: 'pkg-live-solar-tour-2023-2026-08-28T07-55-29-881Z',
    slug: 'solar-tour-2023',
    year: 2023,
    timingLabel: '2023.09–11',
    title: 'LIVE SOLAR TOUR 2023',
    eventTitle: 'IGNITE LIVE TOUR 2023 “SOLAR”',
    subtitle: '朝から、次の朝まで。',
    archiveRole: 'FULL',
    heroDesktopCode: 'LV-SO-H01',
    heroMobileCode: 'LV-SO-H02',
    galleryCodes: ['LV-SO-G01', 'LV-SO-G02', 'LV-SO-G03', 'LV-SO-G04', 'LV-SO-G05', 'LV-SO-G06', 'LV-SO-G07', 'LV-SO-G08'],
    documents: [
      ['FULL ARCHIVE', 'content/LV-SO-P01_v02.md'],
      ['OVERVIEW / CONCEPT', 'content/LV-SO-A01_v01.md'],
      ['TOUR HIGHLIGHTS', 'content/LV-SO-D02_v01.md'],
      ['FINAL ARCHIVE NOTE', 'content/LV-SO-D03_v01.md'],
    ],
    setlistFile: 'images/LV-SO-D01_v01.md',
    setlistKind: 'representative',
    relatedReleaseIds: ['solar', 'moonlit'],
    relatedRecordingIds: [],
  },
];

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
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buffer.subarray(0, 8).equals(pngSignature)) throw new Error(`Expected PNG source: ${filePath}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};
const aspectFor = ({ width, height }) => {
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.03) return '16:9';
  if (Math.abs(ratio - 3 / 2) < 0.03) return '3:2';
  if (Math.abs(ratio - 4 / 5) < 0.03) return '4:5';
  if (Math.abs(ratio - 3 / 4) < 0.03) return '3:4';
  if (Math.abs(ratio - 1) < 0.03) return '1:1';
  throw new Error(`Unsupported aspect ratio: ${width}x${height}`);
};

const manifestPath = path.join(rootDir, 'content', 'public', 'asset-manifest.json');
const siteManifest = readJson(manifestPath);
const liveRecords = [];

for (const campaign of campaigns) {
  const packageRoot = path.join(deliveryRoot, campaign.id, campaign.packageDir);
  const deliveryManifestPath = path.join(packageRoot, 'manifest.json');
  if (!fs.existsSync(deliveryManifestPath)) throw new Error(`Missing delivery package: ${packageRoot}`);

  const deliveryManifest = readJson(deliveryManifestPath);
  if (deliveryManifest.campaign_id !== campaign.id) {
    throw new Error(`Campaign mismatch: ${deliveryManifest.campaign_id} !== ${campaign.id}`);
  }
  const invalidAssets = deliveryManifest.assets.filter((asset) => (
    asset.decision !== 'SELECTED' || asset.production_status !== 'READY'
  ));
  if (invalidAssets.length) {
    throw new Error(`${campaign.id} package contains non-SELECTED/READY assets: ${invalidAssets.map((asset) => asset.asset_code).join(', ')}`);
  }

  const byCode = new Map(deliveryManifest.assets.map((asset) => [asset.asset_code, asset]));
  const canonicalDir = path.join(rootDir, 'content', 'canonical', 'live', campaign.id);
  fs.mkdirSync(canonicalDir, { recursive: true });
  fs.copyFileSync(deliveryManifestPath, path.join(canonicalDir, 'manifest.json'));
  fs.copyFileSync(path.join(packageRoot, 'README.md'), path.join(canonicalDir, 'README.md'));

  for (const asset of deliveryManifest.assets.filter((item) => item.file_path.endsWith('.md'))) {
    const sourcePath = path.join(packageRoot, asset.file_path);
    if (sha256(sourcePath) !== asset.sha256) throw new Error(`Source hash mismatch: ${asset.asset_code}`);
    fs.copyFileSync(sourcePath, path.join(canonicalDir, asset.delivery_filename));
  }

  const publicVisualIds = [];
  for (const asset of deliveryManifest.assets.filter((item) => ['HERO', 'ARTICLE_IMAGE'].includes(item.asset_type))) {
    const sourcePath = path.join(packageRoot, asset.file_path);
    if (sha256(sourcePath) !== asset.sha256) throw new Error(`Source hash mismatch: ${asset.asset_code}`);
    const assetId = assetIdFor(asset.asset_code);
    const relativePath = `/assets/images/live/${campaign.slug}/${asset.delivery_filename}`;
    const targetPath = path.join(rootDir, 'public', relativePath.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
    if (sha256(targetPath) !== asset.sha256) throw new Error(`Copied hash mismatch: ${asset.asset_code}`);
    siteManifest.images[assetId] = {
      path: relativePath,
      status: 'ready',
      aspect: aspectFor(asset.metadata?.width ? asset.metadata : imageDimensions(sourcePath)),
      assetCode: asset.asset_code,
      selectedVersion: asset.version_no,
      sha256: asset.sha256,
      sourcePackage: deliveryManifest.package_id,
    };
    publicVisualIds.push(assetId);
  }

  const setlistSource = readUtf8(path.join(packageRoot, campaign.setlistFile));
  let setlist;
  if (campaign.setlistKind === 'hidden') {
    setlist = {
      display: false,
      status: 'PENDING_CANON_CONFIRMATION',
      displayLabel: 'SETLIST HIDDEN UNTIL CONFIRMED',
      tracks: [],
    };
  } else {
    const parsed = JSON.parse(setlistSource);
    const sourceTracks = campaign.setlistKind === 'partial'
      ? parsed.setlist.items
      : parsed.representativeTracks;
    setlist = {
      display: true,
      status: campaign.setlistKind === 'partial' ? parsed.setlist.status : parsed.setlistStatus,
      displayLabel: campaign.setlistKind === 'partial'
        ? 'CONFIRMED PERFORMANCE REFERENCES — ORDER UNCONFIRMED'
        : 'REPRESENTATIVE TRACKS — ORDER UNCONFIRMED',
      showTrackNumbers: false,
      tracks: sourceTracks.map((track) => ({
        title: track.title,
        section: track.section || track.placement || null,
        note: track.editorialCue || null,
      })),
    };
  }

  liveRecords.push({
    id: campaign.id,
    slug: campaign.slug,
    year: campaign.year,
    timingLabel: campaign.timingLabel,
    title: campaign.title,
    eventTitle: campaign.eventTitle,
    subtitle: campaign.subtitle,
    archiveRole: campaign.archiveRole,
    heroDesktopAssetId: assetIdFor(campaign.heroDesktopCode),
    heroMobileAssetId: assetIdFor(campaign.heroMobileCode),
    galleryAssetIds: campaign.galleryCodes.map(assetIdFor),
    documents: campaign.documents.map(([label, relativePath]) => ({
      label,
      sourceAssetCode: path.basename(relativePath).replace(/_v\d+\.md$/, ''),
      markdown: readUtf8(path.join(packageRoot, relativePath)).trim(),
    })),
    setlist,
    relatedReleaseIds: campaign.relatedReleaseIds,
    relatedRecordingIds: campaign.relatedRecordingIds,
    source: {
      campaignId: deliveryManifest.campaign_id,
      packageId: deliveryManifest.package_id,
      packageGeneratedAt: deliveryManifest.generated_at,
      selectedAssetCodes: deliveryManifest.assets.map((asset) => asset.asset_code),
      publicVisualAssetIds: publicVisualIds,
    },
    publication: {
      fictionalReleaseDate: campaign.timingLabel,
      publishAt: null,
      visibility: 'public',
      campaignState: 'staging',
    },
  });
}

writeJson(manifestPath, siteManifest);
writeJson(path.join(rootDir, 'content', 'public', 'live.json'), liveRecords);
console.log(`Integrated ${liveRecords.length} historical LIVE archives with ${liveRecords.reduce((count, archive) => count + archive.source.publicVisualAssetIds.length, 0)} SELECTED visual assets.`);
