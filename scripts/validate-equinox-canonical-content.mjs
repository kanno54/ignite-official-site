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
  LyricsRenderer,
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

const lyricsSurfaces = ['song-detail', 'expanded-player', 'album-accordion'];

const renderedSectionEvidence = (section, surface) => {
  const html = renderToStaticMarkup(React.createElement(LyricSection, { ...section, surface }));
  const headingMatch = html.match(/<div class="lyric-speaker"[^>]*>([\s\S]*?)<\/div>/);
  const linesMatch = html.match(/<div class="lyric-lines"[^>]*data-source-line-count="(\d+)"[^>]*>([\s\S]*?)<\/div><\/section>/);
  const tokens = [];
  const tokenPattern = /<div class="(lyric-line|lyric-stanza-gap)"[^>]*>([\s\S]*?)<\/div>/g;
  let tokenMatch;
  while ((tokenMatch = tokenPattern.exec(linesMatch?.[2] || '')) !== null) {
    tokens.push({
      type: tokenMatch[1],
      text: tokenMatch[1] === 'lyric-line' ? decodeRenderedText(tokenMatch[2]) : '',
    });
  }
  return {
    html,
    heading: headingMatch ? decodeRenderedText(headingMatch[1]) : '',
    body: tokens.map((token) => token.text).join('\n'),
    lineCount: linesMatch ? Number(linesMatch[1]) : 0,
    lineElementCount: tokens.filter((token) => token.type === 'lyric-line').length,
    gapElementCount: tokens.filter((token) => token.type === 'lyric-stanza-gap').length,
    lineTexts: tokens.filter((token) => token.type === 'lyric-line').map((token) => token.text),
    breakCount: (html.match(/<br\s*\/?\s*>/g) || []).length,
    hasSurfaceMarker: html.includes(`lyric-section--${surface}`),
  };
};

const validateSharedRendererArchitecture = () => {
  const consumers = [
    {
      sourcePath: 'src/routes/discography.equinox.tracks.$trackSlug.tsx',
      surface: 'song-detail',
      forbiddenRenderer: 'track.lyrics.map(',
    },
    {
      sourcePath: 'src/components/audio/ExpandedPlayer.tsx',
      surface: 'expanded-player',
      forbiddenRenderer: 'currentRecording.lyrics.map(',
    },
    {
      sourcePath: 'src/routes/discography.$slug.tsx',
      surface: 'album-accordion',
      forbiddenRenderer: 'track.lyrics.map(',
    },
  ];

  for (const consumer of consumers) {
    const source = fs.readFileSync(path.join(rootDir, consumer.sourcePath), 'utf8');
    if (!source.includes('<LyricsRenderer')) failures.push(`${consumer.sourcePath} does not use the shared LyricsRenderer`);
    if (!source.includes(`surface="${consumer.surface}"`)) failures.push(`${consumer.sourcePath} does not identify the ${consumer.surface} lyrics surface`);
    if (source.includes(consumer.forbiddenRenderer)) failures.push(`${consumer.sourcePath} still contains its independent lyrics renderer`);
  }
};

validateSharedRendererArchitecture();

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
    for (const surface of lyricsSurfaces) {
      const rendererHtml = renderToStaticMarkup(React.createElement(LyricsRenderer, { lyrics: expectedLyrics, surface }));
      const sectionCount = (rendererHtml.match(/data-lyric-section=/g) || []).length;
      if (!rendererHtml.includes(`data-lyrics-surface="${surface}"`)) failures.push(`${mapping.assetCode} ${surface} renderer surface marker is missing`);
      if (sectionCount !== expectedLyrics.length) failures.push(`${mapping.assetCode} ${surface} rendered section count differs`);

      for (const [sectionIndex, section] of expectedLyrics.entries()) {
        const rendered = renderedSectionEvidence(section, surface);
        const expectedLines = section.text ? splitVisibleLyricLines(section.text) : [];
        const expectedVisibleLines = expectedLines.filter((line) => line !== '');
        const expectedGapCount = expectedLines.filter((line) => line === '').length;
        if (!rendered.hasSurfaceMarker) failures.push(`${mapping.assetCode} ${surface} section ${sectionIndex + 1} surface marker differs`);
        if (rendered.heading !== `[${section.speaker}]`) failures.push(`${mapping.assetCode} ${surface} section ${sectionIndex + 1} rendered member/section heading differs`);
        if (rendered.body !== section.text) failures.push(`${mapping.assetCode} ${surface} section ${sectionIndex + 1} rendered source line sequence differs`);
        if (rendered.lineCount !== expectedLines.length) failures.push(`${mapping.assetCode} ${surface} section ${sectionIndex + 1} source line count differs`);
        if (rendered.lineElementCount !== expectedVisibleLines.length) failures.push(`${mapping.assetCode} ${surface} section ${sectionIndex + 1} explicit line element count differs`);
        if (rendered.gapElementCount !== expectedGapCount) failures.push(`${mapping.assetCode} ${surface} section ${sectionIndex + 1} explicit stanza gap count differs`);
        if (rendered.breakCount !== 0) failures.push(`${mapping.assetCode} ${surface} section ${sectionIndex + 1} unexpectedly relies on br elements`);
      }
    }

    if (mapping.assetCode === 'EQ-LY01') {
      const expectedIntro = ['Light and shadow', 'Heat and silence', 'We are here', 'EQUINOX'];
      for (const surface of lyricsSurfaces) {
        const intro = renderedSectionEvidence(expectedLyrics[0], surface);
        if (JSON.stringify(intro.lineTexts) !== JSON.stringify(expectedIntro)) failures.push(`EQ-LY01 ${surface} Intro does not render the four canonical line elements`);
      }
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

console.log('EQUINOX canonical validation PASSED: AR-LN01 -> 12 track notes; EQ-LY01..12 -> 12 recordings; shared block-DOM LyricsRenderer verified for Song Detail, Expanded Player, and Album accordion; no Feature Article registration.');
