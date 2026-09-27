import assert from 'node:assert/strict';
import fs from 'node:fs';
import { selectCurrentCampaign, sortReleasesNewestFirst, releaseDateKey } from '../src/utils/contentSelection.mjs';
import { getPublicRouteEntries } from './public-site.mjs';
const read=name=>JSON.parse(fs.readFileSync(`content/public/${name}.json`));
const campaigns=read('campaigns'),config=read('site-config'),{releases}=read('discography');
assert.equal(selectCurrentCampaign(campaigns,config,true).id,'we-burn');
assert.equal(selectCurrentCampaign(campaigns,config,false).id,'live-album-2024');
const sorted=sortReleasesNewestFirst(releases);
assert.equal(sorted[0].id,'we-burn');
assert.equal(sorted[1].id,'live-album-2024');
assert.equal(releaseDateKey(sorted[0]),20250423);
assert.equal(releaseDateKey(sorted[1]),20250207);
const fixture=[{id:'missing'},{id:'month',fictionalReleaseDate:'2025-04'},{id:'day',fictionalReleaseDateFull:'2025.04.23'},{id:'newer',fictionalReleaseDate:'2026-01'}];
assert.deepEqual(sortReleasesNewestFirst(fixture).map(r=>r.id),['newer','day','month','missing']);
assert.equal(fixture[0].id,'missing');
for(const staging of [true,false]) {
  const home=getPublicRouteEntries({staging}).find(r=>r.path==='/');
  assert(home.title.includes(staging?'We Burn':'IGNITE LIVE 2024'));
  if(staging) assert.equal(home.image,null);
}
console.log('Campaign selection, environment isolation, real-date order, undated-last and home SEO passed.');
