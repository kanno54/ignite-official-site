import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPublicRouteEntries, siteConfig } from './public-site.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../public/sitemap.xml');

const xmlEscape = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const urls = getPublicRouteEntries({ staging: false, siteUrl: siteConfig.siteUrl })
  .filter((entry) => entry.sitemap)
  .map((entry) => {
    const lastmod = entry.lastmod ? `\n    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : '';
    return `  <url>\n    <loc>${xmlEscape(entry.canonical)}</loc>${lastmod}\n  </url>`;
  });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
fs.writeFileSync(outputPath, sitemap, 'utf8');
console.log(`Generated public/sitemap.xml with ${urls.length} public routes.`);
