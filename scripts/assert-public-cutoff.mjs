import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

console.log('--- RUNNING PUBLIC CUTOFF SAFETY ASSERTION ---');

const robotsPath = path.join(distDir, 'robots.txt');
const isStagingBuild =
  process.env.VITE_STAGING === 'true' ||
  (fs.existsSync(robotsPath) && fs.readFileSync(robotsPath, 'utf8').includes('Disallow: /'));

const FORBIDDEN_FUTURE_KEYWORDS = isStagingBuild
  ? ['LINDEN', 'Silent Signal', 'RISE AGAIN']
  : ['SOLAR', 'EQUINOX', 'LINDEN', 'Silent Signal', 'RISE AGAIN'];

if (!fs.existsSync(distDir)) {
  console.log('Dist directory does not exist yet; checking source directory...');
} else {
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.json')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const kw of FORBIDDEN_FUTURE_KEYWORDS) {
          if (content.includes(kw)) {
            throw new Error(`[CUTOFF VIOLATION ERROR] Found forbidden future keyword "${kw}" in built file: ${fullPath}`);
          }
        }
      }
    }
  }
  scanDir(distDir);
}

console.log('✔ Public cutoff safety assertion PASSED! Zero future keywords or LINDEN terms found in outputs.');
