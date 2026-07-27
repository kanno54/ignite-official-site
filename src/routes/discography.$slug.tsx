import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getReleaseBySlug, getReleases, getRecordingsForRelease, getMemberBySlug } from '../utils/contentLoader';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { TrackPlayButton } from '../components/audio/TrackPlayButton';
import { useAudio } from '../components/audio/AudioProvider';

export const ReleaseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const release = getReleaseBySlug(slug || '');
  const allReleases = getReleases();
  const { playRelease } = useAudio();

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
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          padding: '40px',
          borderRadius: '2px',
        }}
      >
        <div style={{ maxWidth: '360px' }}>
          <ResponsivePicture
            assetId={release.coverAssetId}
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
        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#AEB6C4', margin: 0 }}>
          {release.linerNotes}
        </p>
      </section>

      {/* Track List */}
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#F6F3ED', margin: '0 0 24px' }}>
          TRACK LIST ({tracks.length} TRACKS)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {tracks.map((track, idx) => (
            <div
              key={track.id}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '24px',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--campaign-accent)', fontWeight: 700 }}>
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#F6F3ED' }}>
                      {track.title}
                    </h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#AEB6C4' }}>
                      {track.versionLabel}
                    </span>
                  </div>
                </div>

                <TrackPlayButton recordingId={track.id} size="medium" />
              </div>

              {/* Track Liner Notes */}
              <p style={{ fontSize: '0.9rem', color: '#AEB6C4', lineHeight: 1.5, margin: 0 }}>
                {track.linerNotes}
              </p>

              {/* Track Lyrics */}
              {track.lyrics && track.lyrics.length > 0 && (
                <div style={{ backgroundColor: 'var(--color-surface-elevated)', padding: '16px', borderRadius: '2px', marginTop: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--campaign-accent)', display: 'block', marginBottom: '8px' }}>
                    LYRICS EXCERPT
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {track.lyrics.map((l, lIdx) => {
                      const m = getMemberBySlug(l.speaker);
                      return (
                        <div key={lIdx} style={{ fontSize: '0.85rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', color: m?.colorHex || '#AEB6C4', fontSize: '0.75rem', marginRight: '8px' }}>
                            [{l.speaker}]
                          </span>
                          <span style={{ color: '#F6F3ED' }}>{l.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
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
