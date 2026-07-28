import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const discographyPath = path.resolve(__dirname, '../content/public/discography.json');
const campaignsPath = path.resolve(__dirname, '../content/public/campaigns.json');
const manifestPath = path.resolve(__dirname, '../content/public/asset-manifest.json');

// 1. Fix discography.json Moonlit release date to May 2023
const disco = JSON.parse(fs.readFileSync(discographyPath, 'utf8'));
const moonlitRelease = disco.releases.find(r => r.id === 'moonlit');
if (moonlitRelease) {
  moonlitRelease.fictionalReleaseDate = '2023-05';
  moonlitRelease.fictionalReleaseDateFull = '2023.05.20';
  moonlitRelease.publication.fictionalReleaseDate = '2023-05';
  moonlitRelease.publication.publishAt = '2023-05-20T00:00:00Z';
}
fs.writeFileSync(discographyPath, JSON.stringify(disco, null, 2), 'utf8');
console.log('✔ Updated discography.json Moonlit release date to May 2023 (2023-05-20)!');

// 2. Fix campaigns.json Moonlit release date and webp hero paths
const campaigns = JSON.parse(fs.readFileSync(campaignsPath, 'utf8'));
const moonlitCamp = campaigns.find(c => c.id === 'moonlit');
if (moonlitCamp) {
  moonlitCamp.releaseDate = '2023-05-20';
  moonlitCamp.eyebrow = '4TH SINGLE / 2023.05.20 RELEASE';
  moonlitCamp.desktopHero = '/assets/images/heroes/hero-moonlit-desktop.webp';
  moonlitCamp.mobileHero = '/assets/images/heroes/hero-moonlit-mobile.webp';
}
fs.writeFileSync(campaignsPath, JSON.stringify(campaigns, null, 2), 'utf8');
console.log('✔ Updated campaigns.json Moonlit release date to May 2023 & hero webp paths!');

// 3. Fix asset-manifest.json to point to real .webp assets
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.images['cover-moonlit'] = {
  path: '/assets/images/covers/cover-moonlit.webp',
  status: 'ready',
  aspect: '1:1'
};
manifest.images['hero-moonlit-desktop'] = {
  path: '/assets/images/heroes/hero-moonlit-desktop.webp',
  status: 'ready',
  aspect: '16:9'
};
manifest.images['hero-moonlit-mobile'] = {
  path: '/assets/images/heroes/hero-moonlit-mobile.webp',
  status: 'ready',
  aspect: '3:4'
};
manifest.images['track-poster-moonlit'] = {
  path: '/assets/images/tracks/poster-moonlit.webp',
  status: 'ready',
  aspect: '3:4'
};
manifest.images['track-poster-between-the-lights'] = {
  path: '/assets/images/tracks/poster-between-the-lights.webp',
  status: 'ready',
  aspect: '3:4'
};
manifest.images['track-poster-afterimage-live'] = {
  path: '/assets/images/tracks/poster-afterimage-live.webp',
  status: 'ready',
  aspect: '3:4'
};
manifest.images['article-ren-moonlit-interview'] = {
  path: '/assets/images/articles/hero-ren-moonlit-interview.webp',
  status: 'ready',
  aspect: '16:9'
};
manifest.images['article-between-the-lights-story'] = {
  path: '/assets/images/articles/hero-between-the-lights-track-story.webp',
  status: 'ready',
  aspect: '16:9'
};
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log('✔ Updated asset-manifest.json to real .webp paths!');
