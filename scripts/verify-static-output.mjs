import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPublicRouteEntries, routePathToOutputFile, siteConfig } from './public-site.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const builtIndexPath = path.join(distDir, 'index.html');
const builtIndex = fs.existsSync(builtIndexPath) ? fs.readFileSync(builtIndexPath, 'utf8') : '';
const isStagingBuild = process.env.VITE_STAGING === 'true' || builtIndex.includes('<title>[STAGING] ');
const siteUrl = process.env.VITE_SITE_URL
  || (isStagingBuild ? 'https://staging.ignite-official.site' : siteConfig.siteUrl);
const routes = getPublicRouteEntries({ staging: isStagingBuild, siteUrl });

console.log('--- VERIFYING STATIC OUTPUT ROUTES AND METADATA ---');

const failures = [];
for (const route of routes) {
  const relativeOutput = routePathToOutputFile(route.path);
  const fullPath = path.join(distDir, relativeOutput);
  if (!fs.existsSync(fullPath)) {
    failures.push(`missing static file: dist/${relativeOutput}`);
    continue;
  }

  const html = fs.readFileSync(fullPath, 'utf8');
  const expectedTitle = `${isStagingBuild ? '[STAGING] ' : ''}${route.title}`;
  const expectedTitleHtml = expectedTitle.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  if (!html.includes(`<title>${expectedTitleHtml}</title>`)) failures.push(`incorrect title: ${route.path}`);
  if (!html.includes(`<link rel="canonical" href="${route.canonical}" />`)) failures.push(`incorrect canonical: ${route.path}`);
  if (!html.includes(`<meta property="og:url" content="${route.canonical}" />`)) failures.push(`incorrect og:url: ${route.path}`);
  if (!html.includes(`<meta property="og:image" content="${route.image}" />`)) failures.push(`incorrect og:image: ${route.path}`);
  console.log(`  VERIFIED: dist/${relativeOutput.replaceAll('\\', '/')}`);
}

if (failures.length > 0) {
  throw new Error(`[STATIC VERIFICATION FAILED]\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
}

console.log(`All ${routes.length} public static routes and metadata verified.`);
