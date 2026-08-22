import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  parseCanonicalLinerNotes,
  parseCanonicalLyrics,
  normalizeNewlines,
  readCanonicalSource,
  rootDir,
  sourceMap,
} from './equinox-canonical.mjs';
import {
  LyricSection,
  splitVisibleLyricLines,
} from '../src/components/discography/LyricSection.mjs';

const contentDir = path.join(rootDir, 'content', 'public');
const discography = JSON.parse(fs.readFileSync(path.join(contentDir, 'discography.json'), 'utf8'));
const articles = JSON.parse(fs.readFileSync(path.join(contentDir, 'articles.json'), 'utf8'));
const campaigns = JSON.parse(fs.readFileSync(path.join(contentDir, 'campaigns.json'), 'utf8'));
const failures = [];
const equinoxRelease = discography.releases.find((release) => release.id === 'equinox');
const liner = parseCanonicalLinerNotes(readCanonicalSource(sourceMap.linerNotes.sourcePath));

const decodeRenderedText = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#x27;', "'");

const renderedSectionEvidence = (section) => {
  const html = renderToStaticMarkup(React.createElement(LyricSection, section));
  const headingMatch = html.match(/<h3>([\s\S]*?)<\/h3>/);
  const paragraphMatch = html.match(/<p[^>]*data-source-line-count="(\d+)"[^>]*>([\s\S]*?)<\/p>/);
  const body = paragraphMatch
    ? decodeRenderedText(paragraphMatch[2].replace(/<br\s*\/?\s*>/g, '\n'))
    : '';
  return {
    html,
    heading: headingMatch ? decodeRenderedText(headingMatch[1]) : '',
    body,
    lineCount: paragraphMatch ? Number(paragraphMatch[1]) : 0,
    breakCount: (html.match(/<br\s*\/?\s*>/g) || []).length,
  };
};

const validateSourceHash = (mapping) => {
  const source = normalizeNewlines(fs.readFileSync(path.join(rootDir, mapping.sourcePath), 'utf8'));
  const actual = crypto.createHash('sha256').update(source, 'utf8').digest('hex');
  if (actual !== mapping.sha256) failures.push(`${mapping.assetCode} source SHA-256 differs from its SELECTED source mapping`);
};

validateSourceHash(sourceMap.linerNotes);
if (sourceMap.linerNotes.assetCode !== 'AR-LN01' || sourceMap.linerNotes.contentType !== 'LINER_NOTES') {
  failures.push('AR-LN01 source mapping is not typed as LINER_NOTES');
}
if (!sourceMap.linerNotes.selectedVersionId) failures.push('AR-LN01 has no SELECTED Version ID');
if (!equinoxRelease) failures.push('EQUINOX release is missing');
else if (equinoxRelease.linerNotes !== liner.releaseLinerNotes) failures.push('EQUINOX release liner notes differ from AR-LN01');

if (sourceMap.lyrics.length !== 12) failures.push(`expected 12 EQUINOX lyric mappings, found ${sourceMap.lyrics.length}`);
const mappedRecordingIds = new Set();
const mappedAssetCodes = new Set();
for (const mapping of sourceMap.lyrics) {
  const recording = discography.recordings.find((item) => item.id === mapping.recordingId);
  const expectedLyrics = parseCanonicalLyrics(readCanonicalSource(mapping.sourcePath));
  mappedRecordingIds.add(mapping.recordingId);
  mappedAssetCodes.add(mapping.assetCode);
  validateSourceHash(mapping);

  if (!mapping.selectedVersionId) failures.push(`${mapping.assetCode} has no SELECTED Version ID`);
  if (!recording || recording.releaseId !== 'equinox') failures.push(`${mapping.assetCode} maps outside EQUINOX: ${mapping.recordingId}`);
  else {
    if (recording.trackNumber !== mapping.trackNumber) failures.push(`${mapping.assetCode} track number mismatch`);
    if (recording.title !== mapping.trackTitle) failures.push(`${mapping.assetCode} track title mismatch`);
    if (JSON.stringify(recording.lyrics) !== JSON.stringify(expectedLyrics)) failures.push(`${mapping.assetCode} site lyrics differ from canonical Markdown`);
    if (recording.linerNotes !== liner.trackNotes.get(mapping.trackNumber)) failures.push(`${mapping.recordingId} liner note differs from AR-LN01`);
    for (const [sectionIndex, section] of expectedLyrics.entries()) {
      const rendered = renderedSectionEvidence(section);
      const expectedLines = section.text ? splitVisibleLyricLines(section.text) : [];
      if (rendered.heading !== `[${section.speaker}]`) failures.push(`${mapping.assetCode} section ${sectionIndex + 1} rendered member/section heading differs`);
      if (rendered.body !== section.text) failures.push(`${mapping.assetCode} section ${sectionIndex + 1} rendered visible lines differ`);
      if (rendered.lineCount !== expectedLines.length) failures.push(`${mapping.assetCode} section ${sectionIndex + 1} rendered line count differs`);
      if (rendered.breakCount !== Math.max(0, expectedLines.length - 1)) failures.push(`${mapping.assetCode} section ${sectionIndex + 1} rendered break count differs`);
    }
  }
}

if (mappedRecordingIds.size !== 12 || mappedAssetCodes.size !== 12) failures.push('EQUINOX canonical mappings contain duplicates');
if (equinoxRelease && JSON.stringify([...mappedRecordingIds]) !== JSON.stringify(equinoxRelease.trackIds)) {
  failures.push('EQ-LY01..12 mapping order differs from the EQUINOX track order');
}
if (articles.some((article) => article.id === 'equinox-liner-notes-article' || article.slug === 'equinox-liner-notes')) {
  failures.push('AR-LN01 is still registered as a Feature Article');
}
if (campaigns.some((campaign) => (campaign.relatedArticleIds || []).includes('equinox-liner-notes-article'))) {
  failures.push('Campaign data still references AR-LN01 as a Feature Article');
}

if (failures.length > 0) {
  throw new Error(`[EQUINOX CANONICAL CONTENT VALIDATION FAILED]\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
}

console.log('EQUINOX canonical validation PASSED: AR-LN01 -> 12 track notes; EQ-LY01..12 -> 12 recordings and production LyricSection render output; no Feature Article registration.');
