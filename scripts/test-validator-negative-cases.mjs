import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadCurrentCollections, validateRegressionBaseline } from './validate-regressions.mjs';
import { validateSitemapLastmods } from './validate-routes.mjs';
import { validateArtworkUsage } from './validate-artwork-usage.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'baselines', 'public-content-baseline.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content', 'public', 'asset-manifest.json'), 'utf8'));
const current = loadCurrentCollections();

const expectPass = (label, failures) => {
  if (failures.length > 0) throw new Error(`${label} unexpectedly failed:\n${failures.join('\n')}`);
};

const expectFailure = (label, failures, pattern) => {
  if (!failures.some((failure) => pattern.test(failure))) {
    throw new Error(`${label} did not produce the expected failure. Actual failures:\n${failures.join('\n')}`);
  }
};

expectPass('approved baseline', validateRegressionBaseline(baseline, current).failures);

const changedRecording = structuredClone(current);
const protectedRecordingId = baseline.entities.recordings[0].id;
const recording = changedRecording.recordings.find((item) => item.id === protectedRecordingId);
recording.audioUrl = '/media/audio/negative-test.mp3';
recording.posterAssetId = 'negative-test-poster';
expectFailure(
  'recording audio/poster mutation',
  validateRegressionBaseline(baseline, changedRecording).failures,
  new RegExp(`approved recordings field changed: ${protectedRecordingId}\\.(audioUrl|posterAssetId)`),
);

const changedTrackOrder = structuredClone(current);
const protectedRelease = baseline.entities.releases.find((item) => item.trackIds.length > 1);
const release = changedTrackOrder.releases.find((item) => item.id === protectedRelease.id);
release.trackIds = [...release.trackIds].reverse();
expectFailure(
  'release track-order mutation',
  validateRegressionBaseline(baseline, changedTrackOrder).failures,
  new RegExp(`approved releases field changed: ${protectedRelease.id}\\.trackIds`),
);

const deletedRecording = structuredClone(current);
deletedRecording.recordings = deletedRecording.recordings.filter((item) => item.id !== protectedRecordingId);
expectFailure(
  'approved entity deletion',
  validateRegressionBaseline(baseline, deletedRecording).failures,
  new RegExp(`approved recordings entity was deleted: ${protectedRecordingId}`),
);

const additions = structuredClone(current);
additions.releases.push({ id: 'negative-test-release' });
additions.recordings.push({ id: 'negative-test-recording' });
additions.campaigns.push({ id: 'negative-test-campaign' });
additions.articles.push({ id: 'negative-test-article' });
expectPass('new entity additions', validateRegressionBaseline(baseline, additions).failures);

const swappedRecordingArtwork = structuredClone(current);
const artworkRecording = swappedRecordingArtwork.recordings.find((item) => item.artwork);
[artworkRecording.artwork.square, artworkRecording.artwork.vertical] = [artworkRecording.artwork.vertical, artworkRecording.artwork.square];
expectFailure(
  'recording artwork slot swap',
  validateArtworkUsage(swappedRecordingArtwork, manifest),
  /artwork slot aspect mismatch: square/,
);

const swappedReleaseArtwork = structuredClone(current);
const artworkRelease = swappedReleaseArtwork.releases.find((item) => item.artwork);
[artworkRelease.artwork.cover, artworkRelease.artwork.heroDesktop] = [artworkRelease.artwork.heroDesktop, artworkRelease.artwork.cover];
expectFailure(
  'release artwork slot swap',
  validateArtworkUsage(swappedReleaseArtwork, manifest),
  /artwork slot aspect mismatch: cover/,
);

const sameAspectReleaseArtworkSwap = structuredClone(current);
const sameAspectRelease = sameAspectReleaseArtworkSwap.releases.find((item) => item.artwork);
[sameAspectRelease.artwork.detail, sameAspectRelease.artwork.heroMobile] = [sameAspectRelease.artwork.heroMobile, sameAspectRelease.artwork.detail];
expectFailure(
  'same-aspect release artwork slot swap',
  validateArtworkUsage(sameAspectReleaseArtworkSwap, manifest),
  /artwork slot Asset Code mismatch: detail/,
);

expectFailure(
  'invalid sitemap lastmod',
  validateSitemapLastmods('<urlset><url><lastmod>2023 Summer</lastmod></url></urlset>'),
  /invalid lastmod: 2023 Summer/,
);
expectFailure(
  'invalid sitemap calendar date',
  validateSitemapLastmods('<urlset><url><lastmod>2023-02-30</lastmod></url></urlset>'),
  /invalid lastmod: 2023-02-30/,
);
expectPass(
  'valid sitemap lastmod values',
  validateSitemapLastmods('<urlset><url><lastmod>2026-08-22</lastmod></url><url><lastmod>2026-08-22T00:00:00+09:00</lastmod></url></urlset>'),
);

console.log('Negative validator tests PASSED: protected-field mutation, track-order mutation, deletion, new additions, artwork slot swaps, and sitemap lastmod cases behaved as expected.');
