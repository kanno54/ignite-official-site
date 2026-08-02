import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

console.log('--- VERIFYING STATIC OUTPUT ROUTES ---');

const isStagingBuild = process.env.VITE_STAGING === 'true';

const expectedFiles = [
  'index.html',
  '404.html',
  'members/index.html',
  'members/kai/index.html',
  'members/sho/index.html',
  'members/leo/index.html',
  'members/ren/index.html',
  'members/yuto/index.html',
  'discography/index.html',
  'discography/firestarter/index.html',
  'discography/ignition/index.html',
  'discography/burn-it-down/index.html',
  'discography/no-limits/index.html',
  'discography/moonlit/index.html',
  'campaigns/index.html',
  'campaigns/firestarter/index.html',
  'campaigns/no-limits/index.html',
  'campaigns/burn-it-down/index.html',
  'campaigns/ignition/index.html',
  'campaigns/moonlit/index.html',
  'features/index.html',
  'features/archive-firestarter-leo-one-day-ahead/index.html',
  'features/no-limits-interview/index.html',
  'features/ren-moonlit-interview/index.html',
  'features/between-the-lights-story/index.html',
  'features/yuto-hightone-feature/index.html',
  'features/sho-burn-it-down-interview/index.html',
  'features/kai-ignition-five-names/index.html',
  'features/ignition-special-feature/index.html',
  'story/index.html',
  'fun/index.html',
  'privacy/index.html',
  'accessibility/index.html',
];

if (isStagingBuild) {
  expectedFiles.push('features/six-new-lights/index.html');
  expectedFiles.push('features/leo-from-stage-to-solar/index.html');
}

let missing = 0;
for (const relPath of expectedFiles) {
  const fullPath = path.join(distDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`  ✕ MISSING STATIC FILE: dist/${relPath}`);
    missing++;
  } else {
    console.log(`  ✓ VERIFIED: dist/${relPath}`);
  }
}

if (missing > 0) {
  throw new Error(`[STATIC VERIFICATION FAILED] ${missing} expected static routes are missing.`);
}

console.log(`✔ All ${expectedFiles.length} static routes successfully verified in dist/!`);
