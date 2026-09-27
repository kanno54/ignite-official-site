import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { getPublicRouteEntries } from './public-site.mjs';
import { publicationDates, mp3Duration } from './we-burn-publication.mjs';
const read = p => fs.readFileSync(p,'utf8');
const json = p => JSON.parse(read(p));
const articles = json('content/public/articles.json');
const disc = json('content/public/discography.json');
const campaign = json('content/public/campaigns.json').find(c=>c.id==='we-burn');
const correction = json('content/canonical/we-burn/editorial-correction.json');
for (const [slug,file] of [['five-directions','WB25-TXT-FEAT01_v01.md'],['no-plan','WB25-TXT-FEAT02_v01.md']]) {
  const a=articles.find(a=>a.slug===slug);
  assert.equal(a.canonicalMarkdown,read(`content/canonical/we-burn/${file}`),'Manuscript must remain byte-for-byte unchanged');
  assert.equal(a.publication.publishAt,slug==='five-directions'?publicationDates.fiveDirections:publicationDates.noPlan);assert.equal(a.publishDate,'2025-04');
  assert.equal(a.ogAssetId,undefined);assert.ok(a.cardAssetId);
}
assert.equal(crypto.createHash('sha256').update(read('content/canonical/we-burn/WB25-TXT-FEAT01_v01.md')).digest('hex'),correction.sha256);
assert.equal(articles.find(a=>a.slug==='five-directions').sourceVersion,1);
assert.ok(read('content/canonical/we-burn/WB25-TXT-FEAT01_v02.md').startsWith('# NO PLAN'));
assert.deepEqual(disc.releases.find(r=>r.id==='we-burn').trackIds.map(id=>disc.recordings.find(r=>r.id===id).title),['We Burn','NO PLAN','Back to the Spark - Live Version -']);
assert.deepEqual(json('content/public/we-burn.json').tracks.map(t=>t.direction),['FUTURE','NOW','ORIGIN']);
for(const r of disc.recordings.filter(r=>r.releaseId==='we-burn')) {
  assert.equal(r.audioStatus,'ready');
  const bytes=fs.readFileSync('public'+r.audioUrl);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),r.source.audioSha256);
  assert.equal(r.durationSeconds,mp3Duration(bytes));
}
assert.equal(disc.releases.find(r=>r.id==='we-burn').fictionalReleaseDateFull,'2025.04.23');
assert.deepEqual(json('content/public/we-burn.json').publicationDates,publicationDates);
assert.deepEqual(json('content/public/we-burn.json').externalLinks,[]);
assert.equal(campaign.status,'staging');
const routes=['/campaigns/we-burn/','/discography/we-burn/','/features/five-directions/','/features/no-plan/'];
const production=getPublicRouteEntries({}),staging=getPublicRouteEntries({staging:true});
for(const route of routes){assert.ok(!production.some(r=>r.path===route));assert.ok(staging.some(r=>r.path===route));}
for(const a of articles.filter(a=>a.relatedCampaignId==='we-burn')){
  const route=staging.find(r=>r.path===`/features/${a.slug}/`);
  assert.equal(route.image,null);assert.equal(route.lastmod,a.publishDateFull.replaceAll('.','-'));
}
const staged=read('dist/index.html').includes('[STAGING]');
if(!staged){
  assert.ok(!fs.existsSync('dist/assets/images/we-burn'));
  assert.ok(!fs.existsSync('dist/media/audio/we-burn'));
  const bundle=fs.readdirSync('dist/assets').filter(f=>f.endsWith('.js')).map(f=>read('dist/assets/'+f)).join('');
  for(const phrase of ['自分一人だったら、何を言うんだろうって。','WB25-TXT-FEAT01','WB25-JK01_v01.webp']) assert.ok(!bundle.includes(phrase),`Staging content leaked: ${phrase}`);
}
for(const route of routes) assert.equal(staging.find(r=>r.path===route).image,null);
console.log(`We Burn checks passed: exact manuscripts, confirmed fictional dates, verified audio, no external CTA, staging routes, OGP omission, ${staged?'staging':'production isolation'} build.`);
