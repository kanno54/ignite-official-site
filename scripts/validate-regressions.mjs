import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const defaultContentDir = path.join(rootDir, 'content', 'public');
const defaultBaselinePath = path.join(__dirname, 'baselines', 'public-content-baseline.json');

const collectionSources = {
  releases: { file: 'discography.json', property: 'releases' },
  recordings: { file: 'discography.json', property: 'recordings' },
  campaigns: { file: 'campaigns.json' },
  articles: { file: 'articles.json' },
};

const minimumProtectedFields = {
  releases: ['slug', 'trackIds'],
  recordings: ['releaseId', 'audioUrl', 'posterAssetId', 'coverImage'],
  campaigns: ['slug', 'releaseId'],
  articles: ['slug', 'heroAssetId', 'relatedTrackIds', 'relatedCampaignId'],
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const normalizeField = (value) => value === undefined ? null : value;
const displayValue = (value) => JSON.stringify(normalizeField(value));

export const loadCurrentCollections = (contentDir = defaultContentDir) => {
  const cache = new Map();
  const readContent = (name) => {
    if (!cache.has(name)) cache.set(name, readJson(path.join(contentDir, name)));
    return cache.get(name);
  };

  return Object.fromEntries(Object.entries(collectionSources).map(([entityType, source]) => {
    const data = readContent(source.file);
    return [entityType, source.property ? data[source.property] : data];
  }));
};

export const validateRegressionBaseline = (baseline, currentCollections) => {
  const failures = [];
  const additions = {};

  if (baseline.schemaVersion !== 1) failures.push(`unsupported baseline schemaVersion: ${baseline.schemaVersion}`);

  for (const entityType of Object.keys(collectionSources)) {
    const protectedFields = baseline.protectedFields?.[entityType];
    const baselineEntities = baseline.entities?.[entityType];
    const currentEntities = currentCollections[entityType];

    if (!Array.isArray(protectedFields)) {
      failures.push(`baseline protectedFields.${entityType} must be an array`);
      continue;
    }
    if (!Array.isArray(baselineEntities)) {
      failures.push(`baseline entities.${entityType} must be an array`);
      continue;
    }
    if (!Array.isArray(currentEntities)) {
      failures.push(`current ${entityType} collection must be an array`);
      continue;
    }

    for (const requiredField of minimumProtectedFields[entityType]) {
      if (!protectedFields.includes(requiredField)) {
        failures.push(`baseline ${entityType} does not protect required field: ${requiredField}`);
      }
    }

    const baselineIds = new Set();
    for (const entity of baselineEntities) {
      if (!entity.id) failures.push(`baseline ${entityType} contains an entity without id`);
      else if (baselineIds.has(entity.id)) failures.push(`baseline ${entityType} contains duplicate id: ${entity.id}`);
      else baselineIds.add(entity.id);
    }

    const currentById = new Map();
    for (const entity of currentEntities) {
      if (!entity.id) failures.push(`current ${entityType} contains an entity without id`);
      else if (currentById.has(entity.id)) failures.push(`current ${entityType} contains duplicate id: ${entity.id}`);
      else currentById.set(entity.id, entity);
    }

    for (const approvedEntity of baselineEntities) {
      if (!approvedEntity.id) continue;
      const currentEntity = currentById.get(approvedEntity.id);
      if (!currentEntity) {
        failures.push(`approved ${entityType} entity was deleted: ${approvedEntity.id}`);
        continue;
      }

      for (const field of protectedFields) {
        const approvedValue = normalizeField(approvedEntity[field]);
        const currentValue = normalizeField(currentEntity[field]);
        if (JSON.stringify(currentValue) !== JSON.stringify(approvedValue)) {
          failures.push(`approved ${entityType} field changed: ${approvedEntity.id}.${field} (${displayValue(approvedValue)} -> ${displayValue(currentValue)})`);
        }
      }
    }

    additions[entityType] = [...currentById.keys()].filter((id) => !baselineIds.has(id)).sort();
  }

  return { failures, additions };
};

export const runRegressionValidation = ({
  contentDir = defaultContentDir,
  baselinePath = defaultBaselinePath,
} = {}) => {
  const baseline = readJson(baselinePath);
  const currentCollections = loadCurrentCollections(contentDir);
  const result = validateRegressionBaseline(baseline, currentCollections);

  if (result.failures.length > 0) {
    throw new Error(`[APPROVED CONTENT REGRESSION VALIDATION FAILED]\n${result.failures.map((failure) => `- ${failure}`).join('\n')}`);
  }

  const protectedCount = Object.values(baseline.entities).reduce((total, entities) => total + entities.length, 0);
  const additionCount = Object.values(result.additions).reduce((total, ids) => total + ids.length, 0);
  console.log(`Regression validation PASSED: ${protectedCount} approved entities protected; ${additionCount} new entities allowed.`);
  return result;
};

const isDirectExecution = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) runRegressionValidation();
