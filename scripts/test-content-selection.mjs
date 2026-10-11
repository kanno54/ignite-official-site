import assert from 'node:assert/strict';
import fs from 'node:fs';
import { selectCurrentCampaign, sortReleasesNewestFirst, releaseDateKey } from '../src/utils/contentSelection.mjs';
import { getPublicRouteEntries } from './public-site.mjs';
const read=name=>JSON.parse(fs.readFileSync(`content/public/${name}.json`));
const campaigns=read('campaigns'),config=read('site-config'),{releases}=read('discography');
assert.equal(selectCurrentCampaign(campaigns,config,true).id,'kai-2700');
assert.equal(selectCurrentCampaign(campaigns,config,false).id,'we-burn');
const sorted=sortReleasesNewestFirst(releases);
assert.equal(sorted[0].id,'kai-2700');
assert.equal(sorted[1].id,'we-burn');
assert.equal(releaseDateKey(sorted[0]),20251015);
assert.equal(releaseDateKey(sorted[1]),20250423);
const fixture=[{id:'missing'},{id:'month',fictionalReleaseDate:'2025-04'},{id:'day',fictionalReleaseDateFull:'2025.04.23'},{id:'newer',fictionalReleaseDate:'2026-01'}];
assert.deepEqual(sortReleasesNewestFirst(fixture).map(r=>r.id),['newer','day','month','missing']);
assert.equal(fixture[0].id,'missing');
const tied=[{id:'first',fictionalReleaseDate:'2025-10-15'},{id:'second',fictionalReleaseDate:'2025-10-15'}];
assert.deepEqual(sortReleasesNewestFirst(tied).map(r=>r.id),['first','second']);
for(const staging of [true,false]) {
  const home=getPublicRouteEntries({staging}).find(r=>r.path==='/');
  assert(home.title.includes(staging ? '27:00' : 'We Burn'));
  if (staging) assert(home.image.endsWith('/assets/images/kai-2700/K27-WEB01_v01.webp'));
  else assert.equal(home.image,null);
}
console.log('Campaign selection, environment isolation, real-date order, undated-last and home SEO passed.');
