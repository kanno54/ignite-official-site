import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getReleaseBySlug, getReleases, getRecordingsForRelease } from '../utils/contentLoader';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { TrackPlayButton } from '../components/audio/TrackPlayButton';
import { useAudio } from '../components/audio/AudioProvider';

export const ReleaseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const release = getReleaseBySlug(slug || '');
  const allReleases = getReleases();
  const { playRelease } = useAudio();

  const [lyricsOpen, setLyricsOpen] = useState<Record<string, boolean>>({});

  const toggleLyrics = (trackId: string) => {
    setLyricsOpen((prev) => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  if (!release) {
    return <Navigate to="/discography/" replace />;
  }

  const tracks = getRecordingsForRelease(release.id);
  const releaseIndex = allReleases.findIndex((r) => r.id === release.id);
  const prevRelease = allReleases[(releaseIndex - 1 + allReleases.length) % allReleases.length];
  const nextRelease = allReleases[(releaseIndex + 1) % allReleases.length];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      {/* Release Hero Header */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          padding: 'clamp(20px, 4vw, 40px)',
          borderRadius: '2px',
        }}
      >
        <div style={{ maxWidth: '360px', width: '100%' }}>
          <ResponsivePicture
            assetId={release.coverAssetId}
            desktopSrc={release.coverImage}
            title={release.title}
            subtitle={`${release.format} — ${release.fictionalReleaseDateFull}`}
            aspectRatio="1:1"
            accentColor="var(--campaign-accent)"
          />
        </div>

        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--campaign-accent)', fontWeight: 600 }}>
            {release.format} // {release.fictionalReleaseDateFull}
          </span>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, margin: '4px 0 12px', color: '#F6F3ED' }}>
            {release.title}
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#F6F3ED', fontWeight: 500, margin: '0 0 24px' }}>
            {release.description}
          </p>

          <button onClick={() => playRelease(release.id)} className="btn-primary">
            PLAY FULL RELEASE ▶
          </button>
        </div>
      </section>

      {/* Liner Notes */}
      <section style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', padding: '32px', borderRadius: '2px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--campaign-accent)', margin: '0 0 12px' }}>
          OFFICIAL LINER NOTES
        </h3>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#AEB6C4', margin: 0, whiteSpace: 'pre-line' }}>
          {release.linerNotes}
        </p>
      </section>

      {/* Track List */}
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#F6F3ED', margin: '0 0 24px' }}>
          TRACK LIST ({tracks.length} TRACKS)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {tracks.map((track, idx) => {
            const formatSec = (s?: number) => {
              if (!s) return '';
              const m = Math.floor(s / 60);
              const sec = s % 60;
              return `${m}:${sec < 10 ? '0' : ''}${sec}`;
            };
            const trackAssetId = track.posterAssetId || (track.id.startsWith('rise-again') ? `poster-${track.id}` : release.coverAssetId);

            return (
              <div
                key={track.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  padding: '24px',
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {/* Header Row with SongDetail Image, Info & Play Button */}
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 120px 1fr auto', alignItems: 'center', gap: '20px' }}>
                  {/* Track No */}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: 'var(--campaign-accent)', fontWeight: 700 }}>
                    0{idx + 1}
                  </span>

                  {/* SongDetail Artwork Image */}
                  <div style={{ width: '120px', height: track.id.startsWith('rise-again') ? '160px' : '120px', flexShrink: 0, borderRadius: '2px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <ResponsivePicture
                      assetId={trackAssetId}
                      desktopSrc={track.coverImage}
                      title={track.title}
                      subtitle={track.versionLabel}
                      aspectRatio={track.id.startsWith('rise-again') ? '3:4' : '1:1'}
                      accentColor="var(--campaign-accent)"
                    />
                  </div>

                  {/* Track Title & Song Parameters */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#F6F3ED' }}>
                        {track.title}
                      </h3>
                      {track.durationSeconds && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--campaign-accent)', fontWeight: 600 }}>
                          [{formatSec(track.durationSeconds)}]
                        </span>
                      )}
                    </div>

                    {track.versionLabel && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#AEB6C4', fontWeight: 500 }}>
                        {track.versionLabel}
                      </span>
                    )}

                    {/* Spotlight Members & Mood Tags */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                      {track.spotlightMemberIds && track.spotlightMemberIds.length > 0 && (
                        <span style={{ color: '#E2E8F0', backgroundColor: 'var(--color-surface-elevated)', padding: '2px 8px', borderRadius: '2px', border: '1px solid var(--color-border)' }}>
                          FEAT: {track.spotlightMemberIds.map((m) => m.toUpperCase()).join(', ')}
                        </span>
                      )}
                      {track.moodTags && track.moodTags.length > 0 && (
                        <span style={{ color: 'var(--campaign-accent)', backgroundColor: 'var(--color-surface-elevated)', padding: '2px 8px', borderRadius: '2px', border: '1px solid var(--color-border)' }}>
                          TAGS: {track.moodTags.join(' / ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Audio Play Button */}
                  <TrackPlayButton recordingId={track.id} size="medium" />
                </div>

                {/* Track Specific Liner Notes */}
                {track.linerNotes && (
                  <div style={{ backgroundColor: 'var(--color-surface-elevated)', padding: '16px 20px', borderRadius: '2px', borderLeft: '3px solid var(--campaign-accent)' }}>
                    <p style={{ fontSize: '0.92rem', color: '#CBD5E1', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                      {track.linerNotes}
                    </p>
                  </div>
                )}

                {/* Track Lyrics Accordion */}
                {track.lyrics && track.lyrics.length > 0 && (
                  <div style={{ marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => toggleLyrics(track.id)}
                      style={{
                        backgroundColor: 'var(--color-surface-elevated)',
                        border: '1px solid var(--color-border)',
                        padding: '10px 16px',
                        borderRadius: '2px',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        color: '#F6F3ED',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ color: 'var(--campaign-accent)', fontWeight: 600 }}>
                        {lyricsOpen[track.id] ? '▲ OFFICIAL LYRICS (CLOSE)' : '▼ OFFICIAL LYRICS (EXPAND)'}
                      </span>
                      <span style={{ color: '#AEB6C4', fontSize: '0.75rem' }}>
                        {lyricsOpen[track.id] ? '歌詞をたたむ' : '歌詞を表示する'}
                      </span>
                    </button>

                    {lyricsOpen[track.id] && (
                      <div
                        style={{
                          backgroundColor: '#05070A',
                          border: '1px solid var(--color-border)',
                          borderTop: 'none',
                          padding: '24px 20px',
                          borderRadius: '0 0 2px 2px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.95rem',
                          lineHeight: 1.8,
                        }}
                      >
                        {track.lyrics.map((l, lIdx) =>
                          l.text === '' ? (
                            <div key={lIdx} style={{ height: '14px' }} />
                          ) : (
                            <div key={lIdx} style={{ color: '#F6F3ED' }}>
                              {l.text}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Release Navigation Footer */}
      <section style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
        <Link to={`/discography/${prevRelease.slug}/`} className="btn-secondary">
          ← PREV RELEASE ({prevRelease.title})
        </Link>
        <Link to={`/discography/${nextRelease.slug}/`} className="btn-secondary">
          NEXT RELEASE ({nextRelease.title}) →
        </Link>
      </section>
    </div>
  );
};
