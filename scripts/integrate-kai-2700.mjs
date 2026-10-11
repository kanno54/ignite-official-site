import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { mp3Duration } from './we-burn-publication.mjs';

const root = path.resolve(import.meta.dirname, '..');
const packageRoot = process.env.KAI_2700_DELIVERY || 'C:/Users/kanno/OneDrive/project/material_control/asset-library/deliveries/kai-2700/pkg-kai-2700-2026-10-11T09-36-45-868Z';
const read = p => fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
const json = p => JSON.parse(read(p));
const write = (p, value) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n'); };
const delivery = json(path.join(packageRoot, 'manifest.json'));
if (delivery.campaign_id !== 'kai-2700') throw new Error('Wrong delivery campaign');
for (const a of delivery.assets) {
  const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(packageRoot, a.file_path))).digest('hex');
  if (a.decision !== 'SELECTED' || a.production_status !== 'READY' || hash !== a.sha256) throw new Error(`Invalid delivery: ${a.asset_code}`);
}
const asset = code => delivery.assets.find(a => a.asset_code === code);
const copy = code => read(path.join(packageRoot, asset(code).file_path)).replaceAll('\r\n', '\n');
const plain = value => value.replace(/^#{1,6}\s+[^\n]*\n/gm, '').replaceAll('**', '').trim();
const title = value => value.split('\n')[0].replace(/^#+\s*/, '').trim();
const content = name => path.join(root, 'content/public', name + '.json');
const upsert = (array, item) => { const i = array.findIndex(x => x.id === item.id); if (i < 0) array.push(item); else array[i] = item; };
const canonical = path.join(root, 'content/canonical/kai-2700');
write(path.join(canonical, 'manifest.json'), delivery);
for (const a of delivery.assets.filter(a => a.category === 'CONTENT')) fs.copyFileSync(path.join(packageRoot, a.file_path), path.join(canonical, a.delivery_filename));

const manifest = json(content('asset-manifest'));
const visualCodes = ['K27-CV01', 'K27-WEB01', 'K27-WEB02', 'K27-OG01', 'K27-FEAT-H01', 'K27-FEAT-H02', ...Array.from({ length: 7 }, (_, i) => `K27-TR0${i + 1}-SQ`), ...Array.from({ length: 7 }, (_, i) => `K27-DT0${i + 1}`)];
for (const code of visualCodes) {
  const a = asset(code), url = `/assets/images/kai-2700/${a.delivery_filename.replace(/\.[^.]+$/, '.webp')}`;
  fs.mkdirSync(path.dirname(path.join(root, 'public', url)), { recursive: true });
  await sharp(path.join(packageRoot, a.file_path)).webp({ quality: 88 }).toFile(path.join(root, 'public', url));
  manifest.images[code.toLowerCase()] = { path: url, status: 'ready', aspect: code.includes('-SQ') || code === 'K27-CV01' ? '1:1' : code === 'K27-WEB02' ? '9:16' : code.includes('-DT') ? '3:4' : '16:9', assetCode: code, selectedVersion: a.version_no, selectedVersionId: a.version_id, sourceSha256: a.sha256, sourcePackage: delivery.package_id };
}
write(content('asset-manifest'), manifest);
const publication = { fictionalReleaseDate: '2025-10-15', publishAt: null, visibility: 'public', campaignState: 'current' };
const titles = ['STEPS', 'BACK ROOM', 'FIRST NAME', '27:00', 'OLD FRIENDS', 'いっぽ', '34'];
const trackIds = ['steps', 'back-room', 'first-name', '2700', 'old-friends', 'ippo', '34'].map(s => `kai-2700-${s}`);
const disc = json(content('discography'));
upsert(disc.releases, { id: 'kai-2700', slug: 'kai-2700', title: '27:00', format: 'KAI 1st Rap Mini Album', fictionalReleaseDate: '2025-10', fictionalReleaseDateFull: '2025.10.15', coverAssetId: 'k27-cv01', description: plain(copy('K27-TXT-DISC01')), linerNotes: plain(copy('K27-TXT-LINER01')), canonicalMarkdown: copy('K27-TXT-DISC01'), trackIds, campaignState: 'current', publication });
for (let i = 0; i < 7; i++) {
  const n = String(i + 1).padStart(2, '0'), next = String(i + 2).padStart(2, '0');
  const a = asset(`K27-AUD${n}`), bytes = fs.readFileSync(path.join(packageRoot, a.file_path));
  const audioUrl = `/media/audio/kai-2700/${a.delivery_filename}`;
  fs.mkdirSync(path.dirname(path.join(root, 'public', audioUrl)), { recursive: true });
  fs.writeFileSync(path.join(root, 'public', audioUrl), bytes);
  if (title(copy(`K27-TXT-DISC${next}`)) !== titles[i]) throw new Error(`Track order mismatch ${n}`);
  upsert(disc.recordings, { id: trackIds[i], releaseId: 'kai-2700', title: titles[i], versionLabel: 'Original', trackNumber: i + 1, durationSeconds: mp3Duration(bytes), audioUrl, audioStatus: 'ready', spotlightMemberIds: ['kai'], moodTags: [], linerNotes: [plain(copy(`K27-TXT-DISC${next}`)), plain(copy(`K27-TXT-LINER${next}`))].join('\n\n'), lyrics: copy(`K27-TXT-LYR${n}`).trim().split('\n').map(text => ({ speaker: 'kai', text })), posterAssetId: `k27-tr${n}-sq`, artwork: { square: `k27-tr${n}-sq`, vertical: `k27-dt${n}` }, source: { campaignId: 'kai-2700', audioAssetCode: a.asset_code, audioVersionId: a.version_id, audioSha256: a.sha256 } });
}
write(content('discography'), disc);
const articles = json(content('articles'));
const featureIds = ['kai-2700-production-interview', 'kai-2700-the-hidden-seven'];
for (let i = 0; i < 2; i++) {
  const code = `K27-TXT-FEAT0${i + 1}`, markdown = copy(code), slug = featureIds[i];
  upsert(articles, { id: slug, slug, title: title(markdown), kicker: i === 0 ? '27:00 Production Interview' : 'The Hidden Seven', dek: markdown.split('\n').find(l => l.startsWith('## ')).replace(/^##\s*/, ''), publishDate: '2025-10', publishDateFull: '2025.10.15', readingTimeMinutes: Math.ceil(markdown.length / 600), mainSpeakerIds: ['kai'], heroAssetId: `k27-feat-h0${i + 1}`, relatedTrackIds: trackIds, relatedCampaignId: 'kai-2700', blocks: [{ type: 'lead', content: plain(markdown).split('\n\n')[0] }], canonicalMarkdown: markdown, sourceAssetCode: code, sourceVersion: asset(code).version_no, publication: { ...publication, publishAt: '2025-10-15' } });
}
write(content('articles'), articles);
const campaigns = json(content('campaigns'));
upsert(campaigns, { id: 'kai-2700', slug: 'kai-2700', status: 'current', releaseId: 'kai-2700', releaseDate: '2025.10.15', eyebrow: 'KAI 1st Rap Mini Album', title: '27:00', catchCopy: title(copy('K27-TXT-WEB01')), desktopHero: manifest.images['k27-web01'].path, mobileHero: manifest.images['k27-web02'].path, heroAssetId: 'k27-web01', mobileHeroAssetId: 'k27-web02', ogAssetId: 'k27-og01', primaryCta: { text: 'PLAY RELEASE', action: 'play' }, secondaryCta: { text: 'READ INTERVIEW', action: 'link', url: `/features/${featureIds[0]}/` }, campaignColors: { accent: '#A9B9CD', deep: '#11151D', text: '#F6F3ED' }, relatedArticleIds: featureIds, introduction: { heading: 'KAI 1st Rap Mini Album『27:00』', body: plain(copy('K27-TXT-WEB02')) }, creationBackground: { heading: 'KAI', body: plain(copy('K27-TXT-WEB10')) }, commentary: { heading: title(copy('K27-TXT-WEB11')), body: plain(copy('K27-TXT-WEB11')) }, trackDescriptions: Object.fromEntries(trackIds.map((id, i) => [id, plain(copy(`K27-TXT-WEB${String(i + 3).padStart(2, '0')}`))])), focusSection: { eyebrow: 'RELEASE NOTES', heading: '27:00 — Album Release Notes', body: plain(copy('K27-TXT-LINER01')) }, storySourceAssetCode: 'K27-TXT-WEB12' });
write(content('campaigns'), campaigns);
const news = json(content('news'));
for (let i = 2; i >= 1; i--) {
  const code = `K27-TXT-NEWS0${i}`, markdown = copy(code), id = `kai-2700-news0${i}`;
  const item = { id, date: 'TBD', category: 'RELEASE', title: title(markdown), description: plain(markdown).split('\n\n').slice(0, 2).join('\n\n'), url: i === 1 ? '/campaigns/kai-2700/' : '/discography/kai-2700/', imageAssetId: 'k27-cv01', canonicalMarkdown: markdown, sourceAssetCode: code, publication };
  const index = news.findIndex(n => n.id === id); if (index >= 0) news[index] = item; else news.unshift(item);
}
write(content('news'), news);

console.log(`Verified ${delivery.assets.length} SELECTED/READY hashes; integrated kai-2700 into existing staging content.`);
