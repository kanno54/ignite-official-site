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
const checkOnly = process.argv.includes('--check');

const publicFile = (urlPath) => path.join(publicDir, urlPath.replace(/^\//, ''));
const derivativePath = (sourcePath, outputDirectory, width, format) => {
  const extension = path.posix.extname(sourcePath);
  const basename = path.posix.basename(sourcePath, extension);
  const directory = path.posix.dirname(sourcePath);
  return path.posix.join(directory, outputDirectory, `${basename}_${width}w.${format}`);
};
const generated = [];

for (const [assetId, profileName] of Object.entries(registry.assets)) {
  const derivativeConfig = registry.profiles[profileName];
  if (!derivativeConfig) throw new Error(`Unknown derivative profile: ${assetId} -> ${profileName}`);
  const sourceAsset = manifest.images[assetId];
  if (!sourceAsset || sourceAsset.status !== 'ready') {
    throw new Error(`Derivative source is unavailable: ${assetId}`);
  }

  const sourceFile = publicFile(sourceAsset.path);
  const sourceMetadata = await sharp(sourceFile).metadata();
  if (!sourceMetadata.width) throw new Error(`Source width is unavailable: ${assetId}`);

  for (const width of derivativeConfig.widths || []) {
    if (!Number.isInteger(width) || width <= 0) {
      throw new Error(`Invalid derivative width: ${assetId} -> ${width}`);
    }
    if (width > sourceMetadata.width) {
      throw new Error(`Derivative would upscale source: ${assetId} ${width}w > ${sourceMetadata.width}w`);
    }

    const outputPath = derivativePath(sourceAsset.path, registry.outputDirectory, width, derivativeConfig.format);
    const outputFile = publicFile(outputPath);
    if (!checkOnly) {
      await fs.mkdir(path.dirname(outputFile), { recursive: true });
      const pipeline = sharp(sourceFile).resize({ width, withoutEnlargement: true });
      if (derivativeConfig.format === 'webp') {
        pipeline.webp({
          quality: derivativeConfig.quality ?? 80,
          lossless: derivativeConfig.lossless ?? false,
          effort: 6,
          smartSubsample: !derivativeConfig.lossless,
        });
      } else {
        throw new Error(`Unsupported derivative format: ${derivativeConfig.format}`);
      }
      await pipeline.toFile(outputFile);
    }

    const outputMetadata = await sharp(outputFile).metadata();
    const outputStats = await fs.stat(outputFile);
    if (outputMetadata.format !== derivativeConfig.format || outputMetadata.width !== width) {
      throw new Error(`Generated derivative failed verification: ${outputPath}`);
    }
    generated.push({ assetId, width: outputMetadata.width, height: outputMetadata.height, bytes: outputStats.size, path: outputPath });
  }
}

console.log(`${checkOnly ? 'Verified' : 'Generated'} ${generated.length} image derivatives.`);
for (const item of generated) {
  console.log(`${item.assetId} ${item.width}x${item.height} ${(item.bytes / 1024).toFixed(1)} KiB ${item.path}`);
}
