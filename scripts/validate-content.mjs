import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, '../content/public');

console.log('--- RUNNING CONTENT DATA VALIDATION ---');

const siteConfig = JSON.parse(fs.readFileSync(path.join(contentDir, 'site-config.json'), 'utf8'));
const members = JSON.parse(fs.readFileSync(path.join(contentDir, 'members.json'), 'utf8'));
const discography = JSON.parse(fs.readFileSync(path.join(contentDir, 'discography.json'), 'utf8'));
const articles = JSON.parse(fs.readFileSync(path.join(contentDir, 'articles.json'), 'utf8'));
const campaigns = JSON.parse(fs.readFileSync(path.join(contentDir, 'campaigns.json'), 'utf8'));

// 1. Check member ID references in site-config
const memberIds = new Set(members.map((m) => m.id));
for (const mId of siteConfig.group.memberOrder) {
  if (!memberIds.has(mId)) {
    throw new Error(`[VALIDATION ERROR] site-config references unknown member ID: ${mId}`);
  }
}

// 2. Check recording IDs in releases
const recordingIds = new Set(discography.recordings.map((r) => r.id));
const releaseIds = new Set(discography.releases.map((r) => r.id));
for (const rel of discography.releases) {
  for (const trackId of rel.trackIds) {
    if (!recordingIds.has(trackId)) {
      throw new Error(`[VALIDATION ERROR] Release ${rel.id} references unknown track ID: ${trackId}`);
    }
  }
}

// 3. Check release IDs in campaigns
for (const camp of campaigns) {
  if (!releaseIds.has(camp.releaseId)) {
    throw new Error(`[VALIDATION ERROR] Campaign ${camp.id} references unknown release ID: ${camp.releaseId}`);
  }
}

// 4. Check speaker IDs in articles
for (const art of articles) {
  for (const speakerId of art.mainSpeakerIds) {
    if (!memberIds.has(speakerId)) {
      throw new Error(`[VALIDATION ERROR] Article ${art.id} references unknown speaker ID: ${speakerId}`);
    }
  }
}

console.log(`✔ Data validation PASSED! (${members.length} members, ${discography.releases.length} releases, ${discography.recordings.length} recordings, ${articles.length} articles, ${campaigns.length} campaigns verified)`);
