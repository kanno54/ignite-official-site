import React from 'react';
import { Link } from 'react-router-dom';
import { getArticles, getMemberBySlug } from '../utils/contentLoader';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { FiveLights } from '../components/common/FiveLights';

export const FeaturesIndex: React.FC = () => {
  const articles = getArticles();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <FiveLights height={20} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', margin: '8px 0', color: '#F6F3ED' }}>
          FEATURES & MAGAZINE
        </h1>
        <p style={{ fontSize: '1rem', color: '#AEB6C4', maxWidth: '700px', lineHeight: 1.6, margin: 0 }}>
          メンバーへのインタビュー、舞台裏のドキュメント、作品ごとのロング座談会を掲載するWebマガジン。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {articles.map((art) => (
          <Link
            key={art.id}
            to={`/features/${art.slug}/`}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '2px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease',
            }}
          >
            <ResponsivePicture assetId={art.heroAssetId} title={art.kicker} subtitle={art.title} aspectRatio="3:2" accentColor="var(--campaign-accent)" />

            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span className="campaign-tag">
                    {art.kicker}
                  </span>
                  {art.eraLabel && (
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--campaign-accent)', fontWeight: 600 }}>
                      {art.eraLabel}
                    </span>
                  )}
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', lineHeight: 1.4, margin: '8px 0', color: '#F6F3ED' }}>
                  {art.title}
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#AEB6C4', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                  {art.dek}
                </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--campaign-accent)' }}>
                <span>
                  {!art.publishDateFull.startsWith('2026') ? `${art.publishDateFull} — ` : art.storyDateFull ? `STORY ${art.storyDateFull} — ` : ''}
                  {art.readingTimeMinutes} MIN READ
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {art.mainSpeakerIds.map((sId) => {
                    const m = getMemberBySlug(sId);
                    return (
                      <span key={sId} style={{ color: m?.colorHex || '#FFF', fontWeight: 700 }}>
                        ●
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
