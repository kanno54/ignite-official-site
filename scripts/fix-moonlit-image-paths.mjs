import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestPath = path.resolve(__dirname, '../content/public/asset-manifest.json');
const campaignsPath = path.resolve(__dirname, '../content/public/campaigns.json');

// Update asset manifest
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.images['cover-moonlit'] = {
  path: '/assets/images/covers/cover-moonlit.jpg',
  status: 'ready',
  aspect: '1:1'
};
manifest.images['hero-moonlit-desktop'] = {
  path: '/assets/images/heroes/hero-moonlit-desktop.jpg',
  status: 'ready',
  aspect: '16:9'
};
manifest.images['hero-moonlit-mobile'] = {
  path: '/assets/images/heroes/hero-moonlit-mobile.jpg',
  status: 'ready',
  aspect: '3:4'
};
manifest.images['track-poster-moonlit'] = {
  path: '/assets/images/tracks/poster-moonlit.jpg',
  status: 'ready',
  aspect: '3:4'
};
manifest.images['track-poster-between-the-lights'] = {
  path: '/assets/images/tracks/poster-between-the-lights.jpg',
  status: 'ready',
  aspect: '3:4'
};
manifest.images['track-poster-afterimage-live'] = {
  path: '/assets/images/tracks/poster-afterimage-live.jpg',
  status: 'ready',
  aspect: '3:4'
};
manifest.images['article-ren-moonlit-interview'] = {
  path: '/assets/images/articles/hero-ren-moonlit-interview.jpg',
  status: 'ready',
  aspect: '16:9'
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log('✔ Updated asset-manifest.json with .jpg paths!');

// Update campaigns.json
const campaigns = JSON.parse(fs.readFileSync(campaignsPath, 'utf8'));
const moonlitCamp = campaigns.find(c => c.id === 'moonlit');
if (moonlitCamp) {
  moonlitCamp.desktopHero = '/assets/images/heroes/hero-moonlit-desktop.jpg';
  moonlitCamp.mobileHero = '/assets/images/heroes/hero-moonlit-mobile.jpg';
  fs.writeFileSync(campaignsPath, JSON.stringify(campaigns, null, 2), 'utf8');
  console.log('✔ Updated campaigns.json with .jpg hero paths!');
}
