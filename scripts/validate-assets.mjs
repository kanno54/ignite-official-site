import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const contentDir = path.join(rootDir, 'content', 'public');
const manifest = JSON.parse(fs.readFileSync(path.join(contentDir, 'asset-manifest.json'), 'utf8'));

console.log('--- RUNNING PHYSICAL ASSET VALIDATION ---');

const failures = [];
const publicFile = (urlPath) => path.join(publicDir, urlPath.replace(/^\//, '').replace(/^public[\\/]/, ''));
const signatureIsValid = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  const fileSize = fs.statSync(filePath).size;
  const buffer = Buffer.alloc(Math.min(fileSize, 4096));
  const descriptor = fs.openSync(filePath, 'r');
  try {
    fs.readSync(descriptor, buffer, 0, buffer.length, 0);
  } finally {
    fs.closeSync(descriptor);
  }
  if (buffer.length === 0) return false;
  if (extension === '.png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (extension === '.jpg' || extension === '.jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (extension === '.webp') return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  if (extension === '.mp3') return buffer.toString('ascii', 0, 3) === 'ID3' || (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0);
  if (extension === '.svg') {
    const text = buffer.toString('utf8').replace(/^\uFEFF/, '').trimStart();
    return text.startsWith('<svg') || (text.startsWith('<?xml') && text.includes('<svg'));
  }
  return true;
};

let readyCount = 0;
let pendingCount = 0;
for (const [assetId, asset] of Object.entries(manifest.images)) {
  if (asset.status === 'pending') {
    pendingCount += 1;
    continue;
  }
  if (asset.status !== 'ready') {
    failures.push(`manifest asset ${assetId} has unknown status: ${asset.status}`);
    continue;
  }
  readyCount += 1;
  const filePath = publicFile(asset.path);
  if (!fs.existsSync(filePath)) {
    failures.push(`ready manifest asset is missing: ${assetId} -> ${asset.path}`);
  } else if (fs.statSync(filePath).size === 0) {
    failures.push(`ready manifest asset is empty: ${assetId} -> ${asset.path}`);
  } else if (!signatureIsValid(filePath)) {
    failures.push(`ready manifest asset signature mismatch: ${assetId} -> ${asset.path}`);
  }
}

const walk = (directory) => {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...walk(fullPath));
    else result.push(fullPath);
  }
  return result;
};

for (const filePath of walk(publicDir)) {
  if (!['.png', '.jpg', '.jpeg', '.webp', '.svg', '.mp3'].includes(path.extname(filePath).toLowerCase())) continue;
  if (!signatureIsValid(filePath)) {
    failures.push(`public asset extension/signature mismatch: ${path.relative(rootDir, filePath)}`);
  }
}

const referencedPaths = new Set();
const collectPaths = (value) => {
  if (typeof value === 'string' && (/^\/(assets|media)\//.test(value))) {
    referencedPaths.add(value);
  } else if (Array.isArray(value)) {
    value.forEach(collectPaths);
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(collectPaths);
  }
};

for (const fileName of fs.readdirSync(contentDir).filter((name) => name.endsWith('.json'))) {
  collectPaths(JSON.parse(fs.readFileSync(path.join(contentDir, fileName), 'utf8')));
}

for (const referencedPath of referencedPaths) {
  const filePath = publicFile(referencedPath);
  if (!fs.existsSync(filePath)) failures.push(`JSON-referenced file is missing: ${referencedPath}`);
  else if (fs.statSync(filePath).size === 0) failures.push(`JSON-referenced file is empty: ${referencedPath}`);
}

if (failures.length > 0) {
  throw new Error(`[ASSET VALIDATION FAILED]\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
}

console.log(`Asset validation PASSED: ${readyCount} ready, ${pendingCount} pending, ${referencedPaths.size} JSON paths checked.`);
