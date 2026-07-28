import React from 'react';
import { Recording } from '../../types/content';
import { TrackPlayButton } from '../audio/TrackPlayButton';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { getReleaseBySlug, getRecordings } from '../../utils/contentLoader';
import { useAudio } from '../audio/AudioProvider';

type Props = {
  recording: Recording;
  reason: string;
  onReset: () => void;
};

export const JukeboxResult: React.FC<Props> = ({ recording, reason, onReset }) => {
  const release = getReleaseBySlug(recording.releaseId);
  const { playTrack } = useAudio();

  const handleShuffleAll = () => {
    const allRecordings = getRecordings().filter((r) => r.audioStatus === 'ready');
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
            assetId={recording.posterAssetId || release?.coverAssetId || 'hero-no-limits-desktop'}
            title={recording.title}
            aspectRatio="3:4"
          />
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <span className="campaign-tag" style={{ marginBottom: '8px' }}>
            JUKEBOX RECOMMENDATION
          </span>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.8rem', fontWeight: 700, margin: '4px 0', color: '#F6F3ED' }}>
            {recording.title}
          </h3>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--campaign-accent)', margin: 0 }}>
            {recording.versionLabel} — {release?.title}
          </p>

          <p style={{ fontSize: '0.9rem', color: '#AEB6C4', marginTop: '12px', lineHeight: 1.6 }}>
            {reason}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <TrackPlayButton recordingId={recording.id} size="large" />
        <button onClick={handleShuffleAll} className="btn-secondary" style={{ backgroundColor: 'var(--campaign-deep)', borderColor: 'var(--campaign-accent)' }}>
          🎲 SHUFFLE ALL {getRecordings().filter((r) => r.audioStatus === 'ready').length} TRACKS
        </button>
        <button onClick={onReset} className="btn-secondary">
          TRY AGAIN ↻
        </button>
      </div>
    </div>
  );
};
