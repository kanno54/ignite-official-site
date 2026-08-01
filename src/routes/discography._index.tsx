import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getReleases, getRecordingsForRelease, getRecordings } from '../utils/contentLoader';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { FiveLights } from '../components/common/FiveLights';
import { useAudio } from '../components/audio/AudioProvider';
import { trackDiscographyOpen } from '../utils/analytics';

export const DiscographyIndex: React.FC = () => {
  const releases = getReleases();
  const [filterFormat, setFilterFormat] = useState<string>('ALL');
  const { playRelease } = useAudio();

  const filteredReleases = releases.filter((r) => {
    if (filterFormat === 'ALL') return true;
    if (filterFormat === 'SINGLE') return r.format.includes('Single');
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <FiveLights height={20} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', margin: '8px 0', color: '#F6F3ED' }}>
          DISCOGRAPHY
        </h1>
        <p style={{ fontSize: '1rem', color: '#AEB6C4', maxWidth: '700px', lineHeight: 1.6, margin: 0 }}>
          インディーズミニアルバム『FIRESTARTER』から最新リリースまで。IGNITEの歩んできた軌跡と全{getRecordings().length}曲の公開収録音源。
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: 'ALL RELEASES' },
          { id: 'SINGLE', label: 'SINGLES' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterFormat(f.id)}
            style={{
              padding: '10px 20px',
              backgroundColor: filterFormat === f.id ? 'var(--campaign-accent)' : 'var(--color-surface)',
              color: filterFormat === f.id ? 'var(--campaign-on-accent)' : '#F6F3ED',
              border: filterFormat === f.id ? 'none' : '1px solid var(--color-border)',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              borderRadius: '2px',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Release Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
        {filteredReleases.map((rel) => {
          const readyCount = getRecordingsForRelease(rel.id).filter((r) => r.audioStatus === 'ready').length;
          return (
            <div
              key={rel.id}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: rel.campaignState === 'current' ? '1px solid var(--campaign-accent)' : '1px solid var(--color-border)',
                padding: '24px',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                position: 'relative',
              }}
            >
              {rel.campaignState === 'current' && (
                <span className="campaign-tag" style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
                  CURRENT ERA
                </span>
              )}

              <ResponsivePicture assetId={rel.coverAssetId} title={rel.title} subtitle={`${rel.format} — ${rel.fictionalReleaseDateFull}`} aspectRatio="1:1" accentColor="var(--campaign-accent)" />

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--campaign-accent)' }}>
                    {rel.format} // {rel.fictionalReleaseDateFull}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.8rem', fontWeight: 700, margin: '4px 0 8px', color: '#F6F3ED' }}>
                    {rel.title}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#AEB6C4', lineHeight: 1.5, margin: 0 }}>
                    {rel.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                  {readyCount > 0 && (
                    <button
                      onClick={() => playRelease(rel.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--campaign-accent)',
                        color: 'var(--campaign-on-accent)',
                        border: 'none',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        borderRadius: '2px',
                      }}
                    >
                      PLAY RELEASE ▶
                    </button>
                  )}
                  <Link
                    to={`/discography/${rel.slug}/`}
                    onClick={() => trackDiscographyOpen({ release_id: rel.slug, source: 'discography_index_card' })}
                    className="btn-secondary"
                    style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                  >
                    DETAILS & LYRICS ➔
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
