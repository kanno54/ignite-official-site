import React from 'react';
import { useAudio } from './AudioProvider';
import { EqualizerBars } from './EqualizerBars';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { getReleaseBySlug, getMemberBySlug } from '../../utils/contentLoader';
import { protectedMediaProps } from '../../utils/audioDeterrence';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const MiniPlayer: React.FC = () => {
  const { playerState, togglePlay, nextTrack, seek, toggleExpand } = useAudio();
  const { currentRecording, isPlaying, currentTime, duration, isExpanded, error } = playerState;

  if (!currentRecording) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40px',
          backgroundColor: '#080A0F',
          borderTop: '1px solid #1A202C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          color: '#AEB6C4',
          fontFamily: 'var(--font-mono)',
          zIndex: 1000,
        }}
      >
        <span>SELECT A TRACK TO BEGIN LISTENING — IGNITE OFFICIAL PORTAL</span>
      </div>
    );
  }

  const release = getReleaseBySlug(currentRecording.releaseId);
  const spotlightMember = currentRecording.spotlightMemberIds && currentRecording.spotlightMemberIds[0]
    ? getMemberBySlug(currentRecording.spotlightMemberIds[0])
    : null;

  const effectivePosterAssetId = currentRecording.posterAssetId
    || spotlightMember?.profileImageAssetId
    || release?.coverAssetId
    || 'hero-no-limits-desktop';

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      {...protectedMediaProps}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '84px',
        backgroundColor: 'rgba(17, 21, 29, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.8)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Interactive Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#1A202C',
          cursor: 'pointer',
          position: 'relative',
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = clickX / rect.width;
          seek(ratio * duration);
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: 'var(--campaign-accent)',
            boxShadow: '0 0 8px var(--campaign-accent)',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* Control Content */}
      <div
        className="mini-player-container"
        style={{
          flex: 1,
          maxWidth: 'var(--max-shell)',
          margin: '0 auto',
          width: '100%',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Left: 3:4 Poster & Track Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: '38px',
              height: '50px',
              backgroundColor: '#171C26',
              borderRadius: '3px',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              flexShrink: 0,
              position: 'relative',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            }}
          >
            <ResponsivePicture assetId={effectivePosterAssetId} title={currentRecording.title} aspectRatio="3:4" />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: isPlaying ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EqualizerBars isPlaying={isPlaying} height={14} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#F6F3ED',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentRecording.title}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--campaign-accent)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentRecording.versionLabel}
            </span>
          </div>
        </div>

        {/* Center: Play / Pause Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={togglePlay}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isPlaying ? 'var(--color-primary)' : 'var(--campaign-accent)',
              color: isPlaying ? '#FFF' : 'var(--campaign-on-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: isPlaying ? '0 0 12px var(--color-primary)' : '0 0 10px rgba(85,168,255,0.4)',
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            onClick={nextTrack}
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '1.1rem',
              padding: '6px',
            }}
            aria-label="Next Track"
          >
            ⏭
          </button>

          <div
            className="mini-player-time"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: '#AEB6C4',
              minWidth: '75px',
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Right: Expand Drawer Toggle */}
        <div style={{ flexShrink: 0 }}>
          <button
            onClick={toggleExpand}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '2px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text)',
            }}
          >
            <span className="mini-player-expand-text">{isExpanded ? '▼ MINIMIZE' : '▲ EXPAND PLAYER'}</span>
            <span className="mini-player-expand-icon">{isExpanded ? '▼' : '▲'}</span>
          </button>
        </div>
      </div>

      {/* Error notification banner if any */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '-32px',
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-error)',
            color: '#FFF',
            fontSize: '0.75rem',
            padding: '4px 16px',
            textAlign: 'center',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
