import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(rootDir, 'public');
const manifestPath = path.join(rootDir, 'content', 'public', 'asset-manifest.json');
const derivativesPath = path.join(rootDir, 'content', 'public', 'image-derivatives.json');

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const registry = JSON.parse(await fs.readFile(derivativesPath, 'utf8'));

const publicFile = (urlPath) => path.join(publicDir, urlPath.replace(/^\//, ''));
const generated = [];

for (const [assetId, derivativeConfig] of Object.entries(registry.assets)) {
  const sourceAsset = manifest.images[assetId];
  if (!sourceAsset || sourceAsset.status !== 'ready') {
    throw new Error(`Derivative source is unavailable: ${assetId}`);
  }

  const sourceFile = publicFile(sourceAsset.path);
  const sourceMetadata = await sharp(sourceFile).metadata();
  if (!sourceMetadata.width) throw new Error(`Source width is unavailable: ${assetId}`);

  for (const derivative of derivativeConfig.webp || []) {
    if (!Number.isInteger(derivative.width) || derivative.width <= 0) {
      throw new Error(`Invalid derivative width: ${assetId} -> ${derivative.width}`);
    }
    if (derivative.width > sourceMetadata.width) {
      throw new Error(`Derivative would upscale source: ${assetId} ${derivative.width}w > ${sourceMetadata.width}w`);
    }

    const outputFile = publicFile(derivative.path);
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await sharp(sourceFile)
      .resize({ width: derivative.width, withoutEnlargement: true })
      .webp({ quality: derivativeConfig.quality ?? 80, effort: 6, smartSubsample: true })
      .toFile(outputFile);

    const outputMetadata = await sharp(outputFile).metadata();
    const outputStats = await fs.stat(outputFile);
    if (outputMetadata.format !== 'webp' || outputMetadata.width !== derivative.width) {
      throw new Error(`Generated derivative failed verification: ${derivative.path}`);
    }
    generated.push({ assetId, width: outputMetadata.width, height: outputMetadata.height, bytes: outputStats.size, path: derivative.path });
  }
}

console.log(`Generated ${generated.length} image derivatives.`);
for (const item of generated) {
  console.log(`${item.assetId} ${item.width}x${item.height} ${(item.bytes / 1024).toFixed(1)} KiB ${item.path}`);
}
