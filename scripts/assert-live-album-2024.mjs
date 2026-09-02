import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, 'content', 'public', file), 'utf8'));
const discography = read('discography.json');
const articles = read('articles.json');
const news = read('news.json');
const live = read('live.json');
const manifest = read('asset-manifest.json');
const campaigns = read('campaigns.json');
const liveAlbumData = read('live-album-2024.json');
const release = discography.releases.find((item) => item.id === 'live-album-2024');
const tracks = discography.recordings.filter((item) => item.releaseId === 'live-album-2024');
const required = (condition, label) => { if (!condition) throw new Error(`M11B ASSERT FAILED: ${label}`); console.log(`${label} = PASS`); };

required(release?.trackIds?.length === 24 && tracks.length === 24, 'LIVE_ALBUM_TRACK_COUNT_24');
required(tracks.filter((item) => item.discNumber === 1).length === 12, 'DISC_1_COUNT_12');
required(tracks.filter((item) => item.discNumber === 2).length === 12, 'DISC_2_COUNT_12');
required(tracks.find((item) => item.title === 'Electric Blue')?.overallTrackNumber === 17, 'ELECTRIC_BLUE_OVERALL_TRACK_17');
required(new Set(tracks.map((item) => item.source.audioSha256)).size === 24, 'PREVIEW_RECORDING_DUPLICATES_0');
const audioRoot = path.join(root, 'public', 'media', 'audio', 'live-album-2024');
const physicalAudio = fs.readdirSync(audioRoot, { recursive: true }).filter((item) => item.toLowerCase().endsWith('.mp3'));
required(physicalAudio.length === 24, 'PHYSICAL_LIVE_ALBUM_AUDIO_FILES_24');
required(tracks.every((item) => manifest.images[item.artwork.square]?.status === 'ready' && manifest.images[item.artwork.vertical]?.status === 'ready'), 'MISSING_TRACK_ARTWORK_0');
required(tracks.every((item) => fs.existsSync(path.join(root, 'public', item.audioUrl.slice(1)))), 'MISSING_AUDIO_0');
required(tracks.every((item) => item.songDetailSlug && release.trackIds.includes(item.id)), 'ORPHAN_SONG_DETAILS_0');
required(articles.filter((item) => item.relatedCampaignId === 'live-album-2024').length === 6, 'EDITORIAL_COUNT_6');
required(news.filter((item) => item.id === 'la24-n01').length === 1, 'RELEASE_NEWS_1');
required(!live.find((item) => item.id === 'live-tour-2024')?.preview, 'OBSOLETE_PREVIEW_MODULE_0');
required(!Object.values(manifest.images).some((item) => item.sourceCampaign === 'live-album-2024' && item.assetCode?.includes('-REF-')), 'PUBLIC_REFERENCE_ASSETS_0');

const campaign = campaigns.find((item) => item.id === 'live-album-2024');
const campaignRoute = fs.readFileSync(path.join(root, 'src', 'routes', 'campaigns.$id.tsx'), 'utf8');
required((campaignRoute.match(/campaign\.id === 'live-album-2024'/gu) || []).length === 1, 'CAMPAIGN_ROUTE_1');
required(campaign?.status === 'staging', 'CAMPAIGN_STAGING_ONLY');
required(campaign?.heroAssetId === 'la24-kv01', 'CAMPAIGN_PC_HERO_LA24_KV01');
required(campaign?.mobileHeroAssetId === 'la24-kv02', 'CAMPAIGN_MOBILE_HERO_LA24_KV02');
required(campaign?.cardAssetId === 'la24-kv03', 'CAMPAIGN_SQUARE_KV_LA24_KV03');
required(campaign?.ogAssetId === 'la24-og02', 'CAMPAIGN_OGP_LA24_OG02');
required(![campaign?.heroAssetId, campaign?.mobileHeroAssetId, campaign?.cardAssetId, campaign?.ogAssetId].includes('la24-og01'), 'CAMPAIGN_OG01_USAGE_0');
required(['la24-kv01', 'la24-kv02', 'la24-kv03', 'la24-og02'].every((id) => manifest.images[id]?.status === 'ready' && fs.existsSync(path.join(root, 'public', manifest.images[id].path.slice(1)))), 'CAMPAIGN_ASSETS_READY_4');

const hash = (value) => createHash('sha256').update(value).digest('hex');
const canonicalCampaign = fs.readFileSync(path.join(root, 'content', 'canonical', 'live-album-2024', 'LA24-CP01_v01.md'), 'utf8');
const canonicalStory = fs.readFileSync(path.join(root, 'content', 'canonical', 'live-album-2024', 'LA24-ST01_v01.md'), 'utf8');
required(hash(canonicalCampaign) === 'c13d2f70221ced040f51e51ce8286e4bbfb197518e4f7a62307097f74cb699a0' && liveAlbumData.campaignMarkdown === canonicalCampaign, 'LA24_CP01_CANONICAL_EXACT');
required(hash(canonicalStory) === 'd40f2ab556a1a55e804196f602c2762b4263f910f83f5001798c73c0ce2ba2bf' && liveAlbumData.storyMarkdown === canonicalStory, 'LA24_ST01_CANONICAL_EXACT');
required(liveAlbumData.campaignSourceAssetCode === 'LA24-CP01', 'CAMPAIGN_COPY_LA24_CP01');
required(liveAlbumData.storySourceAssetCode === 'LA24-ST01', 'STORY_UPDATE_LA24_ST01');
const campaignHeadings = ['FROM THE TOUR', 'IGNITE LIVE 2024', 'TWO DISCS / 24 TRACKS', 'THREE LIVE VERSIONS', 'HOW THE SONGS CHANGED', 'THE SESSIONS', 'FIVE SONGS THAT CHANGED ON TOUR', 'RETURN TO THE STAGE', 'LISTEN / VIEW RELEASE'];
required(campaignHeadings.every((heading) => canonicalCampaign.includes(heading)), 'CAMPAIGN_REQUIRED_SECTIONS_10');

const campaignComponent = fs.readFileSync(path.join(root, 'src', 'components', 'campaigns', 'LiveAlbumCampaignView.tsx'), 'utf8');
const newsRouteSource = fs.readFileSync(path.join(root, 'src', 'routes', 'news.live-album-2024.tsx'), 'utf8');
required(!/la24-tr\d+/iu.test(campaignComponent), 'CAMPAIGN_INITIAL_TRACK_ARTWORK_0');
required(!campaignComponent.includes('la24-og02'), 'CAMPAIGN_BODY_OG_ASSET_0');
const publicLiveAlbumSources = [
  fs.readFileSync(path.join(root, 'src', 'routes', 'discography.live-album-2024.tsx'), 'utf8'),
  campaignComponent,
  newsRouteSource.replace(".replace('初期仕様では23曲として設計されていましたが、', '');", ''),
];
const obsoleteCountPattern = /(?:23\s*TRACKS|全\s*23\s*曲|23\s*曲\s*(?:Player|構成))/iu;
required(publicLiveAlbumSources.every((source) => !obsoleteCountPattern.test(source)), 'PUBLIC_23_TRACK_DRIFT_STRINGS_0');
required(newsRouteSource.includes(".replace('初期仕様では23曲として設計されていましたが、', '');"), 'HISTORICAL_23_COUNT_FILTERED_FROM_NEWS_UI');
console.log('M11B-r1 LIVE ALBUM 2024 campaign assertions PASSED.');
