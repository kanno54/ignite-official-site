import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPublicRouteEntries, routePathToOutputFile, siteConfig } from './public-site.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distDir, 'index.html');

console.log('--- GENERATING STATIC HTML FOR PUBLIC ROUTES ---');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const isStagingBuild = process.env.VITE_STAGING === 'true';
const siteUrl = process.env.VITE_SITE_URL || siteConfig.siteUrl;
const routes = getPublicRouteEntries({ staging: isStagingBuild, siteUrl });

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const replaceMeta = (html, selector, value) => {
  const escaped = escapeHtml(value);
  if (selector === 'description') {
    return html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escaped}" />`);
  }
  return html.replace(
    new RegExp(`<meta\\s+property="${selector}"\\s+content="[^"]*"\\s*\\/?>`, 'i'),
    `<meta property="${selector}" content="${escaped}" />`,
  );
};

for (const route of routes) {
  const relativeOutput = routePathToOutputFile(route.path);
  const targetPath = path.join(distDir, relativeOutput);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  const title = `${isStagingBuild ? '[STAGING] ' : ''}${route.title}`;
  const timestamp = Date.now();
  let customizedHtml = baseHtml
    .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${escapeHtml(route.canonical)}" />`)
    .replace('src="/assets/index.js"', `src="/assets/index.js?v=${timestamp}"`)
    .replace('href="/assets/index.css"', `href="/assets/index.css?v=${timestamp}"`);
  customizedHtml = replaceMeta(customizedHtml, 'description', route.description);
  customizedHtml = replaceMeta(customizedHtml, 'og:url', route.canonical);
  customizedHtml = replaceMeta(customizedHtml, 'og:title', title);
  customizedHtml = replaceMeta(customizedHtml, 'og:description', route.description);
  customizedHtml = replaceMeta(customizedHtml, 'og:image', route.image);
  customizedHtml = replaceMeta(customizedHtml, 'og:type', route.type);

  fs.writeFileSync(targetPath, customizedHtml, 'utf8');
  console.log(`  Generated: dist/${relativeOutput.replaceAll('\\', '/')}`);
}

const prodHtaccess = `<IfModule mod_headers.c>
  <FilesMatch "\\.(html|htm|js|css)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </FilesMatch>
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`;
fs.writeFileSync(path.join(distDir, '.htaccess'), prodHtaccess, 'utf8');

console.log(`Static HTML generation completed for ${routes.length} routes.`);
