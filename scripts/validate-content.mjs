import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
const manifest = readJson('asset-manifest.json');
const failures = [];

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

if (failures.length > 0) {
  throw new Error(`[CONTENT VALIDATION FAILED]\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
}

console.log(`Content validation PASSED: ${members.length} members, ${discography.releases.length} releases, ${discography.recordings.length} recordings, ${articles.length} articles, ${campaigns.length} campaigns.`);
