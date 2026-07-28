import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distDir, 'index.html');

console.log('--- GENERATING STATIC PRERENDERED HTML FOR ALL ROUTES ---');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Known routes to prerender
const routes = [
  '/',
  '/members/',
  '/members/kai/',
  '/members/sho/',
  '/members/leo/',
  '/members/ren/',
  '/members/yuto/',
  '/discography/',
  '/discography/firestarter/',
  '/discography/ignition/',
  '/discography/burn-it-down/',
  '/discography/no-limits/',
  '/discography/moonlit/',
  '/campaigns/',
  '/campaigns/no-limits/',
  '/campaigns/moonlit/',
  '/features/',
  '/features/no-limits-interview/',
  '/features/yuto-hightone-feature/',
  '/features/sho-burn-it-down-interview/',
  '/features/ignition-special-feature/',
  '/story/',
  '/fun/',
  '/privacy/',
  '/accessibility/',
  '/404.html',
];

for (const route of routes) {
  let targetPath;
  if (route === '/' || route === '/index.html') {
    targetPath = path.join(distDir, 'index.html');
  } else if (route === '/404.html') {
    targetPath = path.join(distDir, '404.html');
  } else {
    // Route like /members/kai/ -> dist/members/kai/index.html
    const normalized = route.replace(/^\//, '').replace(/\/$/, '');
    const routeDir = path.join(distDir, normalized);
    fs.mkdirSync(routeDir, { recursive: true });
    targetPath = path.join(routeDir, 'index.html');
  }

  // Customize title tag based on route for static SEO prerendering
  let routeTitle = 'IGNITE Official Portal — 3rd Single「No Limits」';
  if (route.includes('/members/')) {
    const slug = route.split('/')[2];
    if (slug) routeTitle = `${slug.toUpperCase()} Profile | IGNITE Official Portal`;
    else routeTitle = 'MEMBERS | IGNITE Official Portal';
  } else if (route.includes('/discography/')) {
    const slug = route.split('/')[2];
    if (slug) routeTitle = `${slug.toUpperCase()} | IGNITE Discography`;
    else routeTitle = 'DISCOGRAPHY | IGNITE Official Portal';
  } else if (route.includes('/campaigns/')) {
    const slug = route.split('/')[2];
    if (slug) routeTitle = `${slug.toUpperCase()} Campaign | IGNITE Archive`;
    else routeTitle = 'CAMPAIGN ARCHIVE | IGNITE Official Portal';
  } else if (route.includes('/features/')) {
    routeTitle = 'FEATURES & MAGAZINE | IGNITE Official Portal';
  } else if (route.includes('/story/')) {
    routeTitle = 'OFFICIAL STORY & TIMELINE | IGNITE Official Portal';
  } else if (route.includes('/fun/')) {
    routeTitle = 'JUKEBOX & EMBER DIGITAL PASS | IGNITE Official Portal';
  }

  let customizedHtml = baseHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${routeTitle}</title>`
  );

  fs.writeFileSync(targetPath, customizedHtml, 'utf8');
  console.log(`  Generated: ${targetPath.replace(distDir, 'dist')}`);
}

console.log(`✔ Static pre-rendering completed for ${routes.length} routes!`);
