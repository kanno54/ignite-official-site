import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPublicRouteEntries, isValidSitemapLastmod, siteConfig } from './public-site.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const defaultSitemapPath = path.join(rootDir, 'public', 'sitemap.xml');

export const validateSitemapLastmods = (sitemap) => {
  const failures = [];
  const openingTagCount = (sitemap.match(/<lastmod>/g) || []).length;
  const matches = [...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)];

  if (openingTagCount !== matches.length) failures.push('sitemap contains a malformed lastmod element');
  for (const match of matches) {
    if (!isValidSitemapLastmod(match[1])) failures.push(`sitemap contains invalid lastmod: ${match[1]}`);
  }

  return failures;
};

export const runRouteValidation = ({ sitemapPath = defaultSitemapPath } = {}) => {
  const expectedRoutes = getPublicRouteEntries({ staging: false, siteUrl: siteConfig.siteUrl });
  const stagingRoutes = getPublicRouteEntries({ staging: true, siteUrl: 'https://staging.ignite-official.site' });
  const expectedSitemapUrls = expectedRoutes.filter((entry) => entry.sitemap).map((entry) => entry.canonical).sort();
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const actualSitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]).sort();
  const failures = validateSitemapLastmods(sitemap);
  const routePathsWithDuplicates = stagingRoutes.map((entry) => entry.path);
  if (new Set(routePathsWithDuplicates).size !== routePathsWithDuplicates.length) failures.push('staging route list contains duplicate routes');
  const requiredLiveRoutes = [
    '/live/',
    '/live/history/',
    '/live/spark-2021/',
    '/live/no-limits-2022/',
    '/live/first-light-2022/',
    '/live/solar-tour-2023/',
    '/live/live-tour-2024/',
    '/live/live-tour-2024/tour-log/tokyo-opening/',
    '/live/live-tour-2024/tour-log/fukuoka/',
    '/live/live-tour-2024/tour-log/nagoya/',
    '/live/live-tour-2024/tour-log/osaka/',
    '/live/live-tour-2024/tour-log/sapporo/',
    '/live/live-tour-2024/tour-log/tokyo-final/',
  ];
  const stagingRoutePaths = new Set(routePathsWithDuplicates);
  for (const route of requiredLiveRoutes) if (!stagingRoutePaths.has(route)) failures.push(`staging route list is missing: ${route}`);
  const publicRoutePaths = new Set(expectedRoutes.map((entry) => entry.path));
  for (const route of requiredLiveRoutes) if (publicRoutePaths.has(route)) failures.push(`staging-only LIVE route leaked into public route list: ${route}`);

  if (JSON.stringify(expectedSitemapUrls) !== JSON.stringify(actualSitemapUrls)) {
    const expected = new Set(expectedSitemapUrls);
    const actual = new Set(actualSitemapUrls);
    for (const url of expectedSitemapUrls) if (!actual.has(url)) failures.push(`sitemap is missing: ${url}`);
    for (const url of actualSitemapUrls) if (!expected.has(url)) failures.push(`sitemap contains non-public route: ${url}`);
  }

  const routePaths = new Set(expectedRoutes.map((entry) => entry.path));
  const news = JSON.parse(fs.readFileSync(path.join(rootDir, 'content', 'public', 'news.json'), 'utf8'));
  for (const item of news) {
    if (!item.url.startsWith('/')) continue;
    if (item.publication?.campaignState === 'staging') {
      if (!stagingRoutePaths.has(item.url)) failures.push(`staging news ${item.id} links to an unknown staging route: ${item.url}`);
      continue;
    }
    if (!routePaths.has(item.url)) failures.push(`news ${item.id} links to a non-public route: ${item.url}`);
  }

  if (failures.length > 0) {
    throw new Error(`[ROUTE VALIDATION FAILED]\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  }

  console.log(`Route validation PASSED: ${expectedRoutes.length} static routes, ${expectedSitemapUrls.length} sitemap URLs, ${news.length} news links; all lastmod values valid.`);
  return { expectedRoutes, expectedSitemapUrls };
};

const isDirectExecution = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) runRouteValidation();
