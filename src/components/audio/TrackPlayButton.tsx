import React from 'react';
import { useAudio } from './AudioProvider';
import { getRecordingById } from '../../utils/contentLoader';

type Props = {
  recordingId: string;
  queueContext?: string[];
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
};

export const TrackPlayButton: React.FC<Props> = ({
  recordingId,
  queueContext,
  size = 'medium',
  showLabel = true,
}) => {
  const { playerState, playTrack, togglePlay } = useAudio();
  const recording = getRecordingById(recordingId);

  if (!recording || recording.audioStatus !== 'ready') {
    return null; // Render no play button if status !== "ready" as specified
  }

  const isCurrent = playerState.currentTrackId === recordingId;
  const isPlaying = isCurrent && playerState.isPlaying;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(recordingId, queueContext);
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small': return '4px 10px';
      case 'large': return '12px 24px';
      default: return '8px 16px';
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return '0.75rem';
      case 'large': return '1.1rem';
      default: return '0.9rem';
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: getPadding(),
        fontSize: getFontSize(),
        backgroundColor: isPlaying ? 'var(--color-primary)' : 'var(--campaign-accent)',
        color: isPlaying ? '#FFFFFF' : 'var(--campaign-on-accent)',
        border: 'none',
        borderRadius: '2px',
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.08em',
        transition: 'all 0.2s ease',
        boxShadow: isPlaying ? '0 0 12px var(--color-primary)' : '0 0 10px rgba(85, 168, 255, 0.3)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        cursor: 'pointer',
      }}
      aria-label={isPlaying ? `Pause ${recording.title}` : `Play ${recording.title}`}
    >
      <span style={{ fontSize: size === 'small' ? '0.9rem' : '1.1rem' }}>
        {isPlaying ? '⏸' : '▶'}
      </span>
      {showLabel && (
        <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
      )}
    </button>
  );
};
