import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateArtworkSurfaceArchitecture, validateArtworkUsage } from './validate-artwork-usage.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content', 'public');
const publicDir = path.join(rootDir, 'public');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(contentDir, name), 'utf8'));

console.log('--- RUNNING CONTENT DATA VALIDATION ---');

const siteConfig = readJson('site-config.json');
const members = readJson('members.json');
const discography = readJson('discography.json');
const articles = readJson('articles.json');
const campaigns = readJson('campaigns.json');
const liveArchives = readJson('live.json');
const news = readJson('news.json');
const manifest = readJson('asset-manifest.json');
const failures = [];
failures.push(...validateArtworkUsage(discography, manifest));
failures.push(...validateArtworkSurfaceArchitecture(rootDir));

const memberIds = new Set(members.map((member) => member.id));
const releaseIds = new Set(discography.releases.map((release) => release.id));
const recordingIds = new Set(discography.recordings.map((recording) => recording.id));
const articleIds = new Set(articles.map((article) => article.id));
const articleSlugs = new Set(articles.map((article) => article.slug));
const campaignIds = new Set(campaigns.map((campaign) => campaign.id));
const publicFile = (urlPath) => path.join(publicDir, urlPath.replace(/^\//, ''));

for (const memberId of siteConfig.group.memberOrder) {
  if (!memberIds.has(memberId)) failures.push(`site-config references unknown member ID: ${memberId}`);
}

const recordingOwners = new Map();
for (const release of discography.releases) {
  const uniqueTrackIds = new Set(release.trackIds);
  if (uniqueTrackIds.size !== release.trackIds.length) failures.push(`release ${release.id} contains duplicate track IDs`);
  for (const trackId of release.trackIds) {
    if (!recordingIds.has(trackId)) failures.push(`release ${release.id} references unknown track ID: ${trackId}`);
    if (recordingOwners.has(trackId)) failures.push(`recording ${trackId} belongs to multiple releases`);
    recordingOwners.set(trackId, release.id);
  }
}

for (const recording of discography.recordings) {
  if (!releaseIds.has(recording.releaseId)) failures.push(`recording ${recording.id} references unknown release: ${recording.releaseId}`);
  if (recordingOwners.get(recording.id) !== recording.releaseId) {
    failures.push(`recording/release relationship mismatch: ${recording.id} -> ${recording.releaseId}`);
  }
  if (!recording.audioUrl || !fs.existsSync(publicFile(recording.audioUrl))) {
    failures.push(`recording audio is missing: ${recording.id} -> ${recording.audioUrl}`);
  }
  if (recording.posterAssetId) {
    const asset = manifest.images[recording.posterAssetId];
    if (!asset || asset.status !== 'ready') failures.push(`recording poster asset is not ready: ${recording.id} -> ${recording.posterAssetId}`);
  }
  if (recording.coverImage && !fs.existsSync(publicFile(recording.coverImage))) {
    failures.push(`recording cover image is missing: ${recording.id} -> ${recording.coverImage}`);
  }
}

const allowedCampaignStatuses = new Set(['current', 'past', 'archived', 'staging']);
const currentCampaigns = campaigns.filter((campaign) => campaign.status === 'current');
if (currentCampaigns.length !== 1) failures.push(`expected one current campaign, found ${currentCampaigns.length}`);
for (const campaign of campaigns) {
  if (!allowedCampaignStatuses.has(campaign.status)) failures.push(`campaign ${campaign.id} has invalid status: ${campaign.status}`);
  if (!releaseIds.has(campaign.releaseId)) failures.push(`campaign ${campaign.id} references unknown release: ${campaign.releaseId}`);
  for (const articleId of campaign.relatedArticleIds || []) {
    if (!articleIds.has(articleId) && !articleSlugs.has(articleId)) failures.push(`campaign ${campaign.id} references unknown article: ${articleId}`);
  }
  for (const relatedCampaignId of campaign.relatedCampaignIds || []) {
    if (!campaignIds.has(relatedCampaignId)) failures.push(`campaign ${campaign.id} references unknown campaign: ${relatedCampaignId}`);
  }
}

const requiredArticleFields = ['id', 'slug', 'title', 'kicker', 'dek', 'publishDate', 'publishDateFull', 'readingTimeMinutes', 'mainSpeakerIds', 'heroAssetId', 'relatedTrackIds', 'blocks', 'publication'];
const allowedBlockTypes = new Set(['lead', 'heading', 'paragraph', 'dialogue', 'pullquote', 'image', 'divider', 'question']);
for (const article of articles) {
  for (const field of requiredArticleFields) {
    if (!(field in article)) failures.push(`article ${article.id || '<unknown>'} is missing required field: ${field}`);
  }
  if (!Array.isArray(article.mainSpeakerIds)) failures.push(`article ${article.id} mainSpeakerIds must be an array`);
  else for (const memberId of article.mainSpeakerIds) if (!memberIds.has(memberId)) failures.push(`article ${article.id} references unknown speaker: ${memberId}`);
  if (!article.publication || !Object.hasOwn(article.publication, 'publishAt')) failures.push(`article ${article.id} publication is missing publishAt`);
  else if (article.publication.publishAt !== null && Number.isNaN(Date.parse(article.publication.publishAt))) failures.push(`article ${article.id} has invalid publishAt: ${article.publication.publishAt}`);
  if (!/^\d{4}(?:-\d{2})?$/.test(article.publishDate)) failures.push(`article ${article.id} has invalid year/month publication key: ${article.publishDate}`);
  if (!/^\d{4}\.\d{2}(?:\.\d{2})?$/.test(article.publishDateFull)) failures.push(`article ${article.id} has non-chronological publication display: ${article.publishDateFull}`);
  if (!Array.isArray(article.relatedTrackIds)) failures.push(`article ${article.id} relatedTrackIds must be an array`);
  else for (const trackId of article.relatedTrackIds) if (!recordingIds.has(trackId)) failures.push(`article ${article.id} references unknown track: ${trackId}`);
  if (article.relatedCampaignId && !campaignIds.has(article.relatedCampaignId)) failures.push(`article ${article.id} references unknown campaign: ${article.relatedCampaignId}`);
  if (!Array.isArray(article.blocks) || article.blocks.length === 0) failures.push(`article ${article.id} must contain renderable blocks`);
  else for (const block of article.blocks) {
    if (!allowedBlockTypes.has(block.type)) failures.push(`article ${article.id} has unknown block type: ${block.type}`);
    if (!['divider', 'image'].includes(block.type) && typeof block.content !== 'string') failures.push(`article ${article.id} has a ${block.type} block without content`);
    if (block.type === 'image' && !block.assetId) failures.push(`article ${article.id} has an image block without assetId`);
    if (block.speakerId && !memberIds.has(block.speakerId)) failures.push(`article ${article.id} block references unknown speaker: ${block.speakerId}`);
    if (block.assetId && (!manifest.images[block.assetId] || manifest.images[block.assetId].status !== 'ready')) failures.push(`article ${article.id} block references unavailable asset: ${block.assetId}`);
  }
}

const expectedLiveArchiveIds = [
  'live-spark-2021',
  'live-no-limits-2022',
  'live-first-light-2022',
  'live-solar-tour-2023',
  'live-tour-2024',
];
const expectedLiveSlugs = ['spark-2021', 'no-limits-2022', 'first-light-2022', 'solar-tour-2023', 'live-tour-2024'];
const liveIds = liveArchives.map((archive) => archive.id);
const liveSlugs = liveArchives.map((archive) => archive.slug);
if (JSON.stringify(liveIds) !== JSON.stringify(expectedLiveArchiveIds)) {
  failures.push(`LIVE archive IDs/order mismatch: ${liveIds.join(', ')}`);
}
if (JSON.stringify(liveSlugs) !== JSON.stringify(expectedLiveSlugs)) {
  failures.push(`LIVE archive slugs/order mismatch: ${liveSlugs.join(', ')}`);
}
if (new Set(liveIds).size !== liveIds.length) failures.push('LIVE archives contain duplicate IDs');
if (new Set(liveSlugs).size !== liveSlugs.length) failures.push('LIVE archives contain duplicate slugs');

for (const archive of liveArchives) {
  if (archive.year > 2024) failures.push(`LIVE archive exceeds M11A-2 cutoff: ${archive.id}`);
  if (!['FULL', 'COMPACT', 'COMPLETE'].includes(archive.archiveRole)) failures.push(`LIVE archive ${archive.id} has invalid role: ${archive.archiveRole}`);
  if (archive.source?.campaignId !== archive.id) failures.push(`LIVE archive ${archive.id} source campaign mismatch`);
  if (!archive.source?.packageId?.startsWith(`pkg-${archive.id}-`)) failures.push(`LIVE archive ${archive.id} source package mismatch`);
  if (archive.publication?.visibility !== 'public' || archive.publication?.campaignState !== 'staging') {
    failures.push(`LIVE archive ${archive.id} must remain staging-only`);
  }
  if (!Array.isArray(archive.documents) || archive.documents.length === 0) failures.push(`LIVE archive ${archive.id} has no canonical documents`);
  for (const document of archive.documents || []) {
    if (!document.sourceAssetCode || !document.markdown?.trim()) failures.push(`LIVE archive ${archive.id} has an empty canonical document`);
    if (!archive.source.selectedAssetCodes.includes(document.sourceAssetCode)) failures.push(`LIVE archive ${archive.id} document is not SELECTED: ${document.sourceAssetCode}`);
  }

  const visualAssetIds = [
    archive.heroDesktopAssetId,
    archive.heroMobileAssetId,
    archive.logoAssetId,
    archive.compactLogoAssetId,
    archive.ogAssetId,
    archive.stageConceptAssetId,
    archive.costumeAssetId,
    ...(archive.galleryAssetIds || []),
    ...(archive.chapterVisuals || []).map((item) => item.assetId),
    ...(archive.documents || []).map((item) => item.imageAssetId),
    ...(archive.tourLogs || []).flatMap((item) => [item.heroAssetId, ...(item.galleryAssetIds || [])]),
  ].filter(Boolean);
  const renderedVisuals = [...new Set(visualAssetIds)].sort();
  const auditedVisuals = [...(archive.source.publicVisualAssetIds || [])].sort();
  if (JSON.stringify(renderedVisuals) !== JSON.stringify(auditedVisuals)) {
    failures.push(`LIVE archive ${archive.id} public visual mapping differs from audited source`);
  }
  for (const assetId of visualAssetIds) {
    const asset = manifest.images[assetId];
    if (!asset || asset.status !== 'ready') failures.push(`LIVE archive ${archive.id} references unavailable asset: ${assetId}`);
    if (!asset?.assetCode || !archive.source.selectedAssetCodes.includes(asset.assetCode)) failures.push(`LIVE archive ${archive.id} references non-SELECTED asset: ${assetId}`);
    if (asset?.assetCode?.includes('-REF-')) failures.push(`LIVE archive ${archive.id} exposes a reference asset: ${asset.assetCode}`);
  }
  if (!/-H01$/.test(manifest.images[archive.heroDesktopAssetId]?.assetCode || '')) failures.push(`LIVE archive ${archive.id} desktop hero must use H01`);
  if (!/-H02$/.test(manifest.images[archive.heroMobileAssetId]?.assetCode || '')) failures.push(`LIVE archive ${archive.id} mobile hero must use H02`);
  for (const assetId of archive.galleryAssetIds || []) {
    const galleryPattern = archive.id === 'live-tour-2024' ? /-FG\d{2}$/ : /-G\d{2}$/;
    if (!galleryPattern.test(manifest.images[assetId]?.assetCode || '')) failures.push(`LIVE archive ${archive.id} gallery uses the wrong asset series: ${assetId}`);
  }

  for (const releaseId of archive.relatedReleaseIds || []) {
    if (!releaseIds.has(releaseId)) failures.push(`LIVE archive ${archive.id} references unknown release: ${releaseId}`);
  }
  for (const recordingId of archive.relatedRecordingIds || []) {
    if (!recordingIds.has(recordingId)) failures.push(`LIVE archive ${archive.id} references unknown recording: ${recordingId}`);
  }
  if (archive.id !== 'live-tour-2024' && archive.setlist?.showTrackNumbers === true) failures.push(`LIVE archive ${archive.id} must not number an unconfirmed setlist`);
}

const sparkArchive = liveArchives.find((archive) => archive.id === 'live-spark-2021');
if (sparkArchive?.setlist.display !== false || sparkArchive?.setlist.status !== 'PENDING_CANON_CONFIRMATION' || sparkArchive?.setlist.tracks.length !== 0) {
  failures.push('LIVE SPARK 2021 setlist must remain hidden until canonical confirmation');
}
const firstLightArchive = liveArchives.find((archive) => archive.id === 'live-first-light-2022');
if (firstLightArchive?.archiveRole !== 'COMPACT' || firstLightArchive?.setlist.status !== 'PARTIAL_CONFIRMED' || firstLightArchive?.setlist.tracks.length !== 3) {
  failures.push('LIVE FIRST LIGHT 2022 must remain a compact archive with three confirmed performance references');
}
const noLimitsArchive = liveArchives.find((archive) => archive.id === 'live-no-limits-2022');
if (JSON.stringify(noLimitsArchive?.relatedRecordingIds) !== JSON.stringify(['run-with-us-live'])) {
  failures.push('LIVE NO LIMITS 2022 must reuse only the existing run-with-us-live recording reference');
}

const tour2024 = liveArchives.find((archive) => archive.id === 'live-tour-2024');
if (!tour2024 || tour2024.archiveRole !== 'COMPLETE') failures.push('LIVE TOUR 2024 must exist as a COMPLETE archive');
if (tour2024?.heroDesktopAssetId !== 'lv24-c-h01' || tour2024?.heroMobileAssetId !== 'lv24-c-h02') {
  failures.push('LIVE TOUR 2024 must use the selected Complete desktop/mobile hero pair');
}
if (tour2024?.logoAssetId === 'lv24-lg01' || tour2024?.source?.publicVisualAssetIds?.includes('lv24-lg01')) {
  failures.push('LIVE TOUR 2024 must not expose the LG01 reference master');
}
if (tour2024?.schedule?.showCount !== 12 || tour2024?.schedule?.cityCount !== 5 || tour2024?.schedule?.shows?.length !== 12) {
  failures.push('LIVE TOUR 2024 schedule must remain 12 shows / 5 cities');
}
const tour2024Tracks = tour2024?.setlist?.tracks || [];
if (tour2024Tracks.length !== 24 || tour2024?.setlist?.status !== 'CANONICAL_24_TRACK') {
  failures.push('LIVE TOUR 2024 must use the canonical 24-track setlist');
} else {
  const titles = tour2024Tracks.map((track) => track.title);
  if (new Set(titles).size !== 24) failures.push('LIVE TOUR 2024 setlist contains duplicate titles');
  if (tour2024Tracks[16]?.title !== 'Electric Blue' || tour2024Tracks[16]?.trackNumber !== 17) failures.push('Electric Blue must remain overall track 17');
  if (tour2024Tracks[22]?.title !== 'One More Flame' || tour2024Tracks[23]?.title !== 'We Burn') failures.push('LIVE TOUR 2024 finale must remain One More Flame / We Burn');
}
if (tour2024?.tourLogs?.length !== 6) failures.push('LIVE TOUR 2024 must expose six audited tour logs');
const expectedTourLogV02 = [
  ['LV24-L01', 'THE FIRST SIGNAL', '2 / 12', ['IGNITION', 'No Limits'], ['lv24-l01g-1', 'lv24-l01g-2']],
  ['LV24-L02', 'HEAT RETURNS', '4 / 12', ['Heatwave', 'RISE AGAIN'], ['lv24-l02g-1', 'lv24-l02g-2']],
  ['LV24-L03', 'HOLD THE SILENCE', '6 / 12', ['Silent Signal', 'EQUINOX'], ['lv24-l03g-1', 'lv24-l03g-2']],
  ['LV24-L04', 'ONE MORE TIME', '8 / 12', ['Silent Signal', 'Encore MC'], ['lv24-l04g-1', 'lv24-l04g-2']],
  ['LV24-L05', 'AFTERGLOW', '10 / 12', ['Afterglow'], ['lv24-l05g-1', 'lv24-l05g-2']],
  ['LV24-L06', 'WE BURN', '12 / 12 COMPLETE', ['EQUINOX', 'One More Flame', 'We Burn'], ['lv24-l06g-1', 'lv24-l06g-2']],
];
for (const [index, expected] of expectedTourLogV02.entries()) {
  const [assetCode, title, progressLabel, keyMoments, galleryAssetIds] = expected;
  const actual = tour2024?.tourLogs?.[index];
  if (!actual || actual.sourceAssetCode !== assetCode || actual.sourceVersion !== 2 || actual.title !== title
    || actual.progressLabel !== progressLabel || JSON.stringify(actual.keyMoments) !== JSON.stringify(keyMoments)
    || JSON.stringify(actual.galleryAssetIds) !== JSON.stringify(galleryAssetIds)) {
    failures.push(`LIVE TOUR 2024 Tour Log v02 mapping mismatch: ${assetCode}`);
  }
}
const l04g2 = manifest.images['lv24-l04g-2'];
if (l04g2?.selectedVersion !== 2 || l04g2?.selectedVersionId !== 'v-lv24-l04g-2-2-1788063486040'
  || l04g2?.path !== '/assets/images/live/live-tour-2024/LV24-L04G-2_v02.png') {
  failures.push('LV24-L04G-2 must resolve only to the SELECTED YUTO speaker v02 visual');
}
const tourConcept = tour2024?.documents?.find((document) => document.sourceAssetCode === 'LV24-D01');
const stageConcept = tour2024?.documents?.find((document) => document.sourceAssetCode === 'LV24-F03');
if (tourConcept?.imageAssetId) failures.push('TOUR CONCEPT must not render LV24-C-S01');
if (stageConcept?.imageAssetId !== 'lv24-c-s01') failures.push('STAGE CONCEPT must retain LV24-C-S01');
if (tour2024?.chapterVisuals?.map((chapter) => chapter.title).join('/') !== 'SOLAR/LUNAR/EQUINOX/SHADOW') {
  failures.push('LIVE TOUR 2024 must retain the four canonical chapters');
}

const liveTourAnnouncement = news.filter((item) => item.id === 'news-2024-09-15-live-tour-2024-archive');
if (liveTourAnnouncement.length !== 1) failures.push('Homepage must contain exactly one LIVE TOUR 2024 archive announcement');
else {
  const item = liveTourAnnouncement[0];
  if (item.category !== 'LIVE' || item.title !== 'LIVE TOUR 2024 — TOUR ARCHIVE NOW OPEN'
    || item.url !== '/live/live-tour-2024/' || item.ctaLabel !== 'VIEW LIVE TOUR 2024'
    || item.imageAssetId !== 'lv24-c-h01' || item.publication?.campaignState !== 'staging') {
    failures.push('Homepage LIVE TOUR 2024 announcement metadata mismatch');
  }
}

const previewRecordings = tour2024?.preview?.recordings || [];
const expectedPreviewIds = ['live-album-2024-heatwave', 'live-album-2024-moonlit', 'live-album-2024-silent-signal'];
if (JSON.stringify(previewRecordings.map((recording) => recording.id)) !== JSON.stringify(expectedPreviewIds)) {
  failures.push('LIVE TOUR 2024 must expose exactly the three stable Preview Recording identities');
}
if (releaseIds.has('live-album-2024')) failures.push('M11A-2 must not create the formal LIVE ALBUM release');
for (const recording of previewRecordings) {
  if (recording.publicationState !== 'PREVIEW' || recording.relation !== 'PREVIEW') failures.push(`Preview recording has invalid state: ${recording.id}`);
  if (recording.provenance !== 'UNSPECIFIED') failures.push(`Preview recording provenance was promoted without authority: ${recording.id}`);
  if (recording.source?.campaignId !== 'live-album-2024') failures.push(`Preview recording source campaign mismatch: ${recording.id}`);
  if (!recording.source?.audioAssetCode?.startsWith('LA24-AU-')) failures.push(`Preview recording source Asset is invalid: ${recording.id}`);
  if (!recording.audioUrl || !fs.existsSync(publicFile(recording.audioUrl))) failures.push(`Preview recording audio is missing: ${recording.id}`);
  const poster = manifest.images[recording.posterAssetId];
  if (!poster || poster.status !== 'ready' || poster.usage !== 'PREVIEW_ONLY') failures.push(`Preview recording teaser is unavailable: ${recording.id}`);
}

if (failures.length > 0) {
  throw new Error(`[CONTENT VALIDATION FAILED]\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
}

console.log(`Content validation PASSED: ${members.length} members, ${discography.releases.length} releases, ${discography.recordings.length} recordings, ${articles.length} articles, ${campaigns.length} campaigns, ${liveArchives.length} LIVE archives.`);
