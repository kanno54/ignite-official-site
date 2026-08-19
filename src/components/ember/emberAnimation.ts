import { EmberRuntimeState } from '../../types/ember';
import { EmberAssetCode } from './emberAssets';

export interface FrameInfo {
  assetCode: EmberAssetCode;
  altText: string;
}

export const getEmberFrame = (
  state: EmberRuntimeState,
  isReducedMotion: boolean,
  currentSequenceFrame: number,
  isSpecialInsertActive: boolean,
  isExpanded: boolean = false
): FrameInfo => {

  // 1. HIDDEN Check
  if (state.visibility === 'HIDDEN') {
    return { assetCode: 'GE-S01', altText: 'GUEST EMBER' };
  }

  // 2. RESTING / PEEK Check
  if (state.visibility === 'RESTING') {
    return { assetCode: 'GE-S09', altText: 'GUEST EMBER PEEK' };
  }

  // 3. TEMPORARY REACTION (BURN)
  if (state.temporaryReaction !== 'NONE') {
    switch (state.temporaryReaction) {
      case 'BURN_HEY': return { assetCode: 'GE-X01', altText: 'EMBER BURN HEY!' };
      case 'BURN_YEAH': return { assetCode: 'GE-X02', altText: 'EMBER BURN YEAH!!' };
      case 'BURN_STRONG': return { assetCode: 'GE-X03', altText: 'EMBER BURN MAXIMUM!!!' };
    }
  }

  // 4. TALK Mode
  if (state.speechState === 'OPEN') {
    return { assetCode: 'GE-S03', altText: 'GUEST EMBER TALKING' };
  }

  // Reduced Motion Fallback
  if (isReducedMotion) {
    if (state.playbackState === 'IDLE') return { assetCode: 'GE-S01', altText: 'GUEST EMBER IDLE' };
    switch (state.listeningMode) {
      case 'LISTEN': return { assetCode: 'GE-S02', altText: 'GUEST EMBER LISTEN' };
      case 'DANCE': return { assetCode: 'GE-S04', altText: 'GUEST EMBER DANCE' };
      case 'VOCAL': return { assetCode: 'GE-S06', altText: 'GUEST EMBER VOCAL' };
      case 'CHILL': return { assetCode: 'GE-S07', altText: 'GUEST EMBER CHILL' };
    }
  }

  // 5. PLAYBACK STATE = PAUSED -> BASE Static Frame
  if (state.playbackState === 'PAUSED') {
    switch (state.listeningMode) {
      case 'LISTEN': return { assetCode: 'GE-S02', altText: 'GUEST EMBER PAUSED' };
      case 'DANCE': return { assetCode: 'GE-S04', altText: 'GUEST EMBER PAUSED' };
      case 'VOCAL': return { assetCode: 'GE-S06', altText: 'GUEST EMBER PAUSED' };
      case 'CHILL': return { assetCode: 'GE-S07', altText: 'GUEST EMBER PAUSED' };
    }
  }

  // 6. PLAYBACK STATE = IDLE
  if (state.playbackState === 'IDLE') {
    if (isSpecialInsertActive) {
      return { assetCode: 'GE-S10', altText: 'GUEST EMBER BLINK' }; // 150ms Blink
    }
    return { assetCode: 'GE-S01', altText: 'GUEST EMBER IDLE' };
  }

  // 7. PLAYBACK STATE = PLAYING -> Active Listening Mode Sequences
  switch (state.listeningMode) {
    case 'LISTEN': {
      // GE-S02 -> GE-S11 -> GE-S02 -> GE-S12 -> GE-S02
      const listenFrames: EmberAssetCode[] = ['GE-S02', 'GE-S11', 'GE-S02', 'GE-S12'];
      const idx = currentSequenceFrame % listenFrames.length;
      return { assetCode: listenFrames[idx], altText: isExpanded ? 'EXPANDED EMBER LISTENING' : 'GUEST EMBER LISTENING' };
    }

    case 'DANCE': {
      // GE-S04 -> GE-S13 -> GE-S05 -> GE-S13
      const danceFrames: EmberAssetCode[] = ['GE-S04', 'GE-S13', 'GE-S05', 'GE-S13'];
      const idx = currentSequenceFrame % danceFrames.length;
      return { assetCode: danceFrames[idx], altText: isExpanded ? 'EXPANDED EMBER DANCING' : 'GUEST EMBER DANCING' };
    }

    case 'VOCAL': {
      // GE-S06 Base, occasionally GE-S14
      if (isSpecialInsertActive) {
        return { assetCode: 'GE-S14', altText: 'GUEST EMBER SINGING SOFT' };
      }
      return { assetCode: 'GE-S06', altText: 'GUEST EMBER VOCAL' };
    }

    case 'CHILL': {
      // GE-S07 Base, occasionally GE-S15
      if (isSpecialInsertActive) {
        return { assetCode: 'GE-S15', altText: 'GUEST EMBER CHILL SOFT' };
      }
      return { assetCode: 'GE-S07', altText: 'GUEST EMBER CHILL' };
    }
  }

  return { assetCode: 'GE-S01', altText: 'GUEST EMBER' };
};
