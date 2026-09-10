import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const packageId = 'pkg-live-album-2024-2026-09-02T00-08-40-852Z';
const delivery = path.join('C:', 'Users', 'kanno', 'OneDrive', 'project', 'material_control', 'asset-library', 'deliveries', 'live-album-2024', packageId);
const expected = {
  'content/LA24-CP01_v01.md': 'c13d2f70221ced040f51e51ce8286e4bbfb197518e4f7a62307097f74cb699a0',
  'content/LA24-ST01_v01.md': 'd40f2ab556a1a55e804196f602c2762b4263f910f83f5001798c73c0ce2ba2bf',
  'images/LA24-KV01_v01.png': '36c7eb42e164fc08e45e172c086ea789cf9e19056e737dcd3d6c2e8a08d73b43',
  'images/LA24-KV02_v01.png': '33f77c591937441dc00fe1a1544e0f71df1b774dec7a497c1b1e5135fc43e2ed',
  'images/LA24-KV03_v01.png': '8bb8f473c1bed7bd7714522590a9a7b6fbb54f0af6e63188db342f383fcaaf0f',
  'images/LA24-OG02_v01.png': '40f9a0e8623cbaa3b5afe6d536c486c3a9a6a8f10dd8ec84dadaaca8e1bcb63d',
};

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
for (const [relativePath, checksum] of Object.entries(expected)) {
  const actual = sha256(await readFile(path.join(delivery, relativePath)));
  if (actual !== checksum) throw new Error(`${relativePath}: expected ${checksum}, received ${actual}`);
}

const publicImageDir = path.join(root, 'public', 'assets', 'images', 'live-album-2024');
const canonicalDir = path.join(root, 'content', 'canonical', 'live-album-2024');
await mkdir(publicImageDir, { recursive: true });
await mkdir(canonicalDir, { recursive: true });
for (const filename of ['LA24-KV01_v01.png', 'LA24-KV02_v01.png', 'LA24-KV03_v01.png', 'LA24-OG02_v01.png']) {
  await copyFile(path.join(delivery, 'images', filename), path.join(publicImageDir, filename));
}
for (const filename of ['LA24-CP01_v01.md', 'LA24-ST01_v01.md']) {
  await copyFile(path.join(delivery, 'content', filename), path.join(canonicalDir, filename));
}
await copyFile(path.join(delivery, 'manifest.json'), path.join(canonicalDir, 'manifest.json'));
await copyFile(path.join(delivery, 'README.md'), path.join(canonicalDir, 'README.md'));

const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
const writeJson = async (relativePath, value) => writeFile(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);

const manifest = await readJson('content/public/asset-manifest.json');
const imageEntries = {
  'la24-kv01': ['LA24-KV01', '16:9', expected['images/LA24-KV01_v01.png'], 'CAMPAIGN_HERO_DESKTOP', 'v-la24-kv01-1-1788307423250'],
  'la24-kv02': ['LA24-KV02', '3:4', expected['images/LA24-KV02_v01.png'], 'CAMPAIGN_HERO_MOBILE', 'v-la24-kv02-1-1788307421833'],
  'la24-kv03': ['LA24-KV03', '1:1', expected['images/LA24-KV03_v01.png'], 'CAMPAIGN_CARD', 'v-la24-kv03-1-1788307420098'],
  'la24-og02': ['LA24-OG02', '16:9', expected['images/LA24-OG02_v01.png'], 'CAMPAIGN_OGP', 'v-la24-og02-1-1788307441530'],
};
for (const [id, [assetCode, aspect, checksum, usage, selectedVersionId]] of Object.entries(imageEntries)) {
  manifest.images[id] = {
    path: `/assets/images/live-album-2024/${assetCode}_v01.png`,
    status: 'ready',
    aspect,
    assetCode,
    selectedVersion: 1,
    selectedVersionId,
    sha256: checksum,
    sourceCampaign: 'live-album-2024',
    sourcePackage: packageId,
    usage,
  };
}
await writeJson('content/public/asset-manifest.json', manifest);

const derivatives = await readJson('content/public/image-derivatives.json');
derivatives.profiles.campaignMobile = { format: 'webp', quality: 80, widths: [384, 640, 960] };
derivatives.assets['la24-kv01'] = 'heroDesktop';
derivatives.assets['la24-kv02'] = 'campaignMobile';
derivatives.assets['la24-kv03'] = 'liveAlbumSquare';
delete derivatives.assets['la24-og02'];
await writeJson('content/public/image-derivatives.json', derivatives);

const campaigns = await readJson('content/public/campaigns.json');
const campaign = campaigns.find((item) => item.id === 'live-album-2024');
if (!campaign) throw new Error('live-album-2024 campaign entry is missing');
Object.assign(campaign, {
  status: 'staging',
  eyebrow: 'CURRENT CAMPAIGN // LIVE ALBUM 2024',
  title: 'IGNITE LIVE 2024',
  catchCopy: 'ステージで育った曲を、そのまま残す。',
  desktopHero: '/assets/images/live-album-2024/LA24-KV01_v01.png',
  mobileHero: '/assets/images/live-album-2024/LA24-KV02_v01.png',
  heroAssetId: 'la24-kv01',
  mobileHeroAssetId: 'la24-kv02',
  cardAssetId: 'la24-kv03',
  ogAssetId: 'la24-og02',
  canonicalSourceAssetCode: 'LA24-CP01',
  storySourceAssetCode: 'LA24-ST01',
  primaryCta: { text: 'EXPLORE CAMPAIGN', action: 'link', url: '/campaigns/live-album-2024/' },
  secondaryCta: { text: 'LISTEN TO THE RELEASE', action: 'link', url: '/discography/live-album-2024/' },
});
await writeJson('content/public/campaigns.json', campaigns);

const liveAlbum = await readJson('content/public/live-album-2024.json');
liveAlbum.packageId = packageId;
liveAlbum.campaignSourceAssetCode = 'LA24-CP01';
liveAlbum.storySourceAssetCode = 'LA24-ST01';
liveAlbum.campaignMarkdown = await readFile(path.join(delivery, 'content', 'LA24-CP01_v01.md'), 'utf8');
liveAlbum.storyMarkdown = await readFile(path.join(delivery, 'content', 'LA24-ST01_v01.md'), 'utf8');
liveAlbum.campaignVisualAssetIds = ['la24-kv01', 'la24-kv02', 'la24-kv03', 'la24-og02'];
await writeJson('content/public/live-album-2024.json', liveAlbum);

console.log(`Integrated ${packageId}: LA24-KV01/KV02/KV03/OG02/CP01/ST01`);
