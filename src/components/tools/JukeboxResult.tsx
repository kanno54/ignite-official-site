import React from 'react';
import { Recording } from '../../types/content';
import { TrackPlayButton } from '../audio/TrackPlayButton';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { getReleaseBySlug, getJukeboxRecordings } from '../../utils/contentLoader';
import { useAudio } from '../audio/AudioProvider';

type Props = {
  recording: Recording;
  reason: string;
  onReset: () => void;
};

export const JukeboxResult: React.FC<Props> = ({ recording, reason, onReset }) => {
  const { playerState, playTrack } = useAudio();

  // Dynamically synchronize with playerState.currentRecording when in jukebox queueContext
  const isJukeboxActive = playerState.queueContext === 'jukebox' && playerState.currentRecording;
  const displayRecording = isJukeboxActive ? playerState.currentRecording! : recording;
  const release = getReleaseBySlug(displayRecording.releaseId);
  const isOriginalTrack = displayRecording.id === recording.id;

  const handleShuffleAll = () => {
    const allRecordings = getJukeboxRecordings().filter((r) => r.audioStatus === 'ready');
    if (allRecordings.length === 0) return;
    const shuffled = [...allRecordings].sort(() => Math.random() - 0.5);
    const firstTrack = shuffled[0];
    const shuffledQueue = shuffled.map((r) => r.id);
    playTrack(firstTrack.id, shuffledQueue, 'jukebox');
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        border: '1px solid var(--campaign-accent)',
        padding: '32px',
        borderRadius: '2px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: '0 0 30px rgba(85, 168, 255, 0.15)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
        <div style={{ width: '130px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <ResponsivePicture
            assetId={displayRecording.posterAssetId || release?.coverAssetId || 'hero-no-limits-desktop'}
            title={displayRecording.title}
            aspectRatio="3:4"
          />
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="campaign-tag">
              {isOriginalTrack ? 'JUKEBOX RECOMMENDATION' : 'JUKEBOX NOW PLAYING'}
            </span>
            {playerState.isPlaying && isJukeboxActive && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--campaign-accent)', fontWeight: 700 }}>
                ● NOW PLAYING
              </span>
            )}
          </div>

          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.8rem', fontWeight: 700, margin: '4px 0', color: '#F6F3ED' }}>
            {displayRecording.title}
          </h3>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--campaign-accent)', margin: 0 }}>
            {displayRecording.versionLabel} — {release?.title}
          </p>

          <p style={{ fontSize: '0.9rem', color: '#AEB6C4', marginTop: '12px', lineHeight: 1.6 }}>
            {isOriginalTrack
              ? reason
              : `JUKEBOX 連続再生中（${playerState.queueIndex + 1} / ${playerState.queue.length} 曲目）。${reason}`}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <TrackPlayButton recordingId={displayRecording.id} size="large" />
        <button onClick={handleShuffleAll} className="btn-secondary" style={{ backgroundColor: 'var(--campaign-deep)', borderColor: 'var(--campaign-accent)' }}>
          🎲 SHUFFLE ALL {getJukeboxRecordings().filter((r) => r.audioStatus === 'ready').length} TRACKS
        </button>
        <button onClick={onReset} className="btn-secondary">
          TRY AGAIN ↻
        </button>
      </div>
    </div>
  );
};
