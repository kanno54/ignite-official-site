import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync('src/routes/story.tsx', 'utf8');
const required = [
  "id: 'live-tour-2024-tokyo-final'",
  "date: '2024.09'",
  '「We Burn」を初披露',
  "id: 'we-burn-announcement'",
  "date: '2025.03.26'",
  "id: 'we-burn'",
  "date: '2025.04.23'",
  'Back to the Spark - Live Version -',
  "link: '/campaigns/we-burn/'",
  "secondaryLink: '/discography/we-burn/'",
  "currentCamp.id === ev.id",
];
for (const phrase of required) assert.ok(source.includes(phrase), `Missing STORY We Burn requirement: ${phrase}`);
assert.ok(source.indexOf("id: 'live-tour-2024-tokyo-final'") < source.indexOf("id: 'live-album-2024'"));
assert.ok(source.indexOf("id: 'live-album-2024'") < source.indexOf("id: 'we-burn-announcement'"));
assert.ok(source.indexOf("id: 'we-burn-announcement'") < source.indexOf("id: 'we-burn'"));
assert.ok(!source.includes("currentCamp.id === 'live-album-2024'"), 'LIVE ALBUM must not be the current campaign');
console.log('STORY We Burn chronology, current campaign, and internal links passed.');
