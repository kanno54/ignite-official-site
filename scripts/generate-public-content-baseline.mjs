import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadCurrentCollections } from './validate-regressions.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'baselines', 'public-content-baseline.json');

const protectedFields = {
  releases: ['slug', 'title', 'trackIds', 'coverAssetId', 'coverImage'],
  recordings: ['title', 'releaseId', 'audioUrl', 'posterAssetId', 'coverImage'],
  campaigns: ['slug', 'title', 'releaseId', 'releaseDate', 'desktopHero', 'mobileHero', 'relatedArticleIds', 'relatedCampaignIds'],
  articles: ['slug', 'title', 'heroAssetId', 'relatedTrackIds', 'relatedCampaignId'],
};

const currentCollections = loadCurrentCollections();
const entities = {};

for (const [entityType, fields] of Object.entries(protectedFields)) {
  entities[entityType] = currentCollections[entityType]
    .map((entity) => Object.fromEntries([
      ['id', entity.id],
      ...fields.map((field) => [field, entity[field] === undefined ? null : entity[field]]),
    ]))
    .sort((a, b) => a.id.localeCompare(b.id));
}

const baseline = {
  schemaVersion: 1,
  description: 'Approved public content regression baseline. Update only after explicit human QA approval.',
  protectedFields,
  entities,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(baseline, null, 2)}\n`, 'utf8');
console.log(`Generated ${path.relative(path.resolve(__dirname, '..'), outputPath).replaceAll('\\', '/')} with ${Object.values(entities).reduce((total, items) => total + items.length, 0)} approved entities.`);
