import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.resolve(__dirname, '../content/public/asset-manifest.json');

console.log('--- RUNNING ASSET MANIFEST VALIDATION ---');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

let pendingCount = 0;
let readyCount = 0;

for (const [id, info] of Object.entries(manifest.images)) {
  if (info.status === 'pending') {
    pendingCount++;
  } else if (info.status === 'ready') {
    readyCount++;
  }
}

console.log(`Asset manifest status: ${readyCount} ready, ${pendingCount} pending.`);
console.log('✔ Asset validation completed (Development placeholders active).');
