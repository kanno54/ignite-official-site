import fs from 'fs';
import path from 'path';

const releaseSlotAspects = {
  cover: '1:1',
  detail: '3:4',
  heroDesktop: '16:9',
  heroMobile: '3:4',
};

const releaseSlotCodeSuffixes = {
  cover: '-A01',
  detail: '-A02',
  heroDesktop: '-A03',
  heroMobile: '-A04',
};

const recordingSlotAspects = {
  square: '1:1',
  vertical: '3:4',
};

const validateSlot = (failures, manifest, owner, slot, assetId, expectedAspect) => {
  if (!assetId) {
    failures.push(`${owner} artwork slot is missing: ${slot}`);
    return;
  }

  const asset = manifest.images?.[assetId];
  if (!asset || asset.status !== 'ready') {
    failures.push(`${owner} artwork slot is not ready: ${slot} -> ${assetId}`);
    return;
  }
  if (!asset.assetCode) failures.push(`${owner} artwork slot has no Asset Code: ${slot} -> ${assetId}`);
  if (asset.aspect !== expectedAspect) {
    failures.push(`${owner} artwork slot aspect mismatch: ${slot} -> ${assetId} (${asset.assetCode || 'NO_CODE'}, expected ${expectedAspect}, found ${asset.aspect || 'NONE'})`);
  }
};

export const validateArtworkUsage = (discography, manifest) => {
  const failures = [];

  for (const release of discography.releases) {
    if (!release.artwork) continue;
    for (const [slot, aspect] of Object.entries(releaseSlotAspects)) {
      validateSlot(failures, manifest, `release ${release.id}`, slot, release.artwork[slot], aspect);
    }
    const assetIds = Object.values(release.artwork).filter(Boolean);
    if (new Set(assetIds).size !== assetIds.length) failures.push(`release ${release.id} reuses one asset across explicit artwork slots`);

    const slotCodes = Object.fromEntries(Object.keys(releaseSlotCodeSuffixes).map((slot) => [
      slot,
      manifest.images?.[release.artwork[slot]]?.assetCode || '',
    ]));
    for (const [slot, suffix] of Object.entries(releaseSlotCodeSuffixes)) {
      if (!slotCodes[slot].endsWith(suffix)) {
        failures.push(`release ${release.id} artwork slot Asset Code mismatch: ${slot} must end in ${suffix}, found ${slotCodes[slot] || 'NONE'}`);
      }
    }
    const codeFamilies = Object.values(slotCodes).filter(Boolean).map((code) => code.replace(/-A0[1-4]$/, ''));
    if (codeFamilies.length && new Set(codeFamilies).size !== 1) {
      failures.push(`release ${release.id} explicit artwork belongs to different Asset Code families: ${Object.values(slotCodes).join(' / ')}`);
    }
  }

  for (const recording of discography.recordings) {
    if (!recording.artwork) continue;
    for (const [slot, aspect] of Object.entries(recordingSlotAspects)) {
      validateSlot(failures, manifest, `recording ${recording.id}`, slot, recording.artwork[slot], aspect);
    }

    const square = manifest.images?.[recording.artwork.square];
    const vertical = manifest.images?.[recording.artwork.vertical];
    const squareCode = square?.assetCode || '';
    const verticalCode = vertical?.assetCode || '';
    if (!squareCode.endsWith('-SQ')) failures.push(`recording ${recording.id} square slot Asset Code must end in -SQ: ${squareCode || 'NONE'}`);
    if (!verticalCode.endsWith('-V')) failures.push(`recording ${recording.id} vertical slot Asset Code must end in -V: ${verticalCode || 'NONE'}`);
    if (squareCode && verticalCode && squareCode.replace(/-SQ$/, '') !== verticalCode.replace(/-V$/, '')) {
      failures.push(`recording ${recording.id} square/vertical artwork belongs to different Asset Code families: ${squareCode} / ${verticalCode}`);
    }
  }

  return failures;
};

export const validateArtworkSurfaceArchitecture = (rootDir) => {
  const failures = [];
  const consumers = [
    ['src/routes/discography._index.tsx', "getReleaseArtworkAssetId(rel, 'cover')", 'Release Card -> cover'],
    ['src/routes/discography.$slug.tsx', "getReleaseArtworkAssetId(release, 'detail')", 'Album Detail -> detail'],
    ['src/routes/discography.$slug.tsx', "getReleaseArtworkAssetId(release, 'heroDesktop')", 'Desktop Hero -> heroDesktop'],
    ['src/routes/discography.$slug.tsx', "getReleaseArtworkAssetId(release, 'heroMobile')", 'Mobile Hero -> heroMobile'],
    ['src/routes/discography.$slug.tsx', "getRecordingArtworkAssetId(track, 'square')", 'Track List -> square'],
    ['src/routes/discography.equinox.tracks.$trackSlug.tsx', "getRecordingArtworkAssetId(track, 'vertical')", 'Song Detail -> vertical'],
    ['src/components/audio/MiniPlayer.tsx', "getRecordingArtworkAssetId(currentRecording, 'square')", 'Mini Player -> square'],
    ['src/components/audio/ExpandedPlayer.tsx', "getRecordingArtworkAssetId(currentRecording, 'vertical')", 'Expanded Player -> vertical'],
  ];

  for (const [sourcePath, requiredUsage, label] of consumers) {
    const source = fs.readFileSync(path.join(rootDir, sourcePath), 'utf8');
    if (!source.includes(requiredUsage)) failures.push(`${label} is not connected to its explicit artwork slot in ${sourcePath}`);
  }

  return failures;
};
