import React from 'react';
import { useAudio } from './AudioProvider';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { FiveLights } from '../common/FiveLights';
import { getRecordingById, getReleaseBySlug, getMemberBySlug } from '../../utils/contentLoader';
import { protectedMediaProps } from '../../utils/audioDeterrence';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const ExpandedPlayer: React.FC = () => {
  const {
    playerState,
    togglePlay,
    stopTrack,
    previousTrack,
    nextTrack,
    seek,
    setVolume,
    toggleMute,
    setIsExpanded,
    playTrack,
  } = useAudio();

  const { currentRecording, isPlaying, currentTime, duration, volume, muted, isExpanded, queue, queueIndex } = playerState;

  if (!isExpanded || !currentRecording) return null;

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
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 10, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={() => setIsExpanded(false)}
    >
      <div
        {...protectedMediaProps}
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          backgroundColor: '#11151D',
          borderLeft: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-15px 0 40px rgba(0,0,0,0.9)',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiveLights height={16} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.05em' }}>
              EXPANDED PLAYER
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            style={{
              padding: '6px 14px',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '2px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text)',
            }}
          >
            ▼ MINIMIZE
          </button>
        </div>

        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 3:4 Track Poster Artwork */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '320px',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
                border: '1px solid var(--color-border)',
              }}
            >
              <ResponsivePicture
                assetId={effectivePosterAssetId}
                title={currentRecording.title}
                subtitle={currentRecording.versionLabel}
                aspectRatio="3:4"
              />
            </div>
          </div>

          {/* Title & Info */}
          <div style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#F6F3ED',
                margin: 0,
              }}
            >
              {currentRecording.title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: 'var(--campaign-accent)',
                marginTop: '4px',
              }}
            >
              {currentRecording.versionLabel}
            </p>

            {/* Spotlight Members */}
            {currentRecording.spotlightMemberIds && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                {currentRecording.spotlightMemberIds.map((mId) => {
                  const m = getMemberBySlug(mId);
                  return (
                    <span
                      key={mId}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '2px',
                        backgroundColor: `${m?.colorHex || '#55A8FF'}20`,
                        border: `1px solid ${m?.colorHex || '#55A8FF'}`,
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        color: m?.colorHex || '#55A8FF',
                      }}
                    >
                      {m?.nameEn || mId}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Playhead & Seek */}
          <div>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#171C26',
                borderRadius: '3px',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                seek(ratio * duration);
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  backgroundColor: 'var(--campaign-accent)',
                  borderRadius: '3px',
                  boxShadow: '0 0 10px var(--campaign-accent)',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                color: '#AEB6C4',
                marginTop: '6px',
              }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <button
              type="button"
              onClick={previousTrack}
              style={{
                fontSize: '1.6rem',
                color: '#AEB6C4',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px',
              }}
              aria-label="前の曲"
            >
              ⏮
            </button>
            <button
              type="button"
              onClick={togglePlay}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: isPlaying ? 'var(--color-primary)' : 'var(--campaign-accent)',
                color: isPlaying ? '#FFF' : 'var(--campaign-on-accent)',
                fontSize: '1.5rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                boxShadow: isPlaying ? '0 0 20px var(--color-primary)' : '0 0 16px rgba(85,168,255,0.5)',
              }}
              aria-label={isPlaying ? '一時停止' : '再生'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              type="button"
              onClick={stopTrack}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                color: '#AEB6C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              aria-label="停止"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5" y="5" width="14" height="14" rx="2" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextTrack}
              style={{
                fontSize: '1.6rem',
                color: '#AEB6C4',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px',
              }}
              aria-label="次の曲"
            >
              ⏭
            </button>
          </div>

          {/* Volume Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
            <button onClick={toggleMute} style={{ fontSize: '1rem', color: '#AEB6C4' }}>
              {muted || volume === 0 ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: '140px', accentColor: 'var(--campaign-accent)' }}
              aria-label="Volume slider"
            />
          </div>

          {/* Liner Notes & Lyrics */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border)',
              padding: '16px',
              borderRadius: '2px',
            }}
          >
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--campaign-accent)', margin: '0 0 8px' }}>
              LINER NOTES
            </h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#F6F3ED', margin: 0 }}>
              {currentRecording.linerNotes}
            </p>
          </div>

          {/* Lyrics */}
          {currentRecording.lyrics && currentRecording.lyrics.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                padding: '20px',
                borderRadius: '2px',
              }}
            >
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--campaign-accent)', margin: '0 0 12px' }}>
                OFFICIAL LYRICS
              </h4>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                {currentRecording.lyrics.map((line, idx) =>
                  line.text === '' ? (
                    <div key={idx} style={{ height: '12px' }} />
                  ) : (
                    <div key={idx} style={{ color: '#F6F3ED' }}>
                      {line.text}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Play Queue */}
          {queue.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                padding: '16px',
                borderRadius: '2px',
              }}
            >
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--campaign-accent)', margin: '0 0 12px' }}>
                PLAY QUEUE ({queueIndex + 1} / {queue.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {queue.map((qTrackId, idx) => {
                  const qTrack = getRecordingById(qTrackId);
                  if (!qTrack) return null;
                  const isCurrentInQueue = idx === queueIndex;
                  return (
                    <div
                      key={`${qTrackId}-${idx}`}
                      onClick={() => playTrack(qTrackId, queue, playerState.queueContext)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: isCurrentInQueue ? 'rgba(85, 168, 255, 0.1)' : 'transparent',
                        borderLeft: isCurrentInQueue ? '3px solid var(--campaign-accent)' : '3px solid transparent',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#AEB6C4' }}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: isCurrentInQueue ? 700 : 400, color: '#F6F3ED' }}>
                          {qTrack.title}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--campaign-accent)' }}>
                        {qTrack.versionLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
