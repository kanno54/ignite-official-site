import fs from 'fs';
import path from 'path';
import {
  parseCanonicalLinerNotes,
  parseCanonicalLyrics,
  readCanonicalSource,
  rootDir,
  sourceMap,
} from './equinox-canonical.mjs';

const contentDir = path.join(rootDir, 'content', 'public');
const discographyPath = path.join(contentDir, 'discography.json');
const articlesPath = path.join(contentDir, 'articles.json');
const campaignsPath = path.join(contentDir, 'campaigns.json');
const discography = JSON.parse(fs.readFileSync(discographyPath, 'utf8'));
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
const campaigns = JSON.parse(fs.readFileSync(campaignsPath, 'utf8'));

const equinoxRelease = discography.releases.find((release) => release.id === 'equinox');
if (!equinoxRelease) throw new Error('EQUINOX release not found');

const liner = parseCanonicalLinerNotes(readCanonicalSource(sourceMap.linerNotes.sourcePath));
equinoxRelease.linerNotes = liner.releaseLinerNotes;

for (const mapping of sourceMap.lyrics) {
  const recording = discography.recordings.find((item) => item.id === mapping.recordingId);
  if (!recording || recording.releaseId !== 'equinox') {
    throw new Error(`${mapping.assetCode} does not map to an EQUINOX recording: ${mapping.recordingId}`);
  }
  recording.lyrics = parseCanonicalLyrics(readCanonicalSource(mapping.sourcePath));
  recording.linerNotes = liner.trackNotes.get(mapping.trackNumber);
}

const featureArticleId = 'equinox-liner-notes-article';
const nextArticles = articles.filter((article) => article.id !== featureArticleId);
if (nextArticles.length !== articles.length - 1) {
  throw new Error(`expected exactly one ${featureArticleId} entry`);
}
for (const campaign of campaigns) {
  campaign.relatedArticleIds = (campaign.relatedArticleIds || []).filter((id) => id !== featureArticleId);
}

fs.writeFileSync(discographyPath, `${JSON.stringify(discography, null, 2)}\n`, 'utf8');
fs.writeFileSync(articlesPath, `${JSON.stringify(nextArticles, null, 2)}\n`, 'utf8');
fs.writeFileSync(campaignsPath, `${JSON.stringify(campaigns, null, 2)}\n`, 'utf8');

console.log('Synchronized AR-LN01 and EQ-LY01..12; removed AR-LN01 from Feature Article data.');
