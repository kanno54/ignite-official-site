import React from 'react';
import { Link } from 'react-router-dom';
import { getCampaigns } from '../utils/contentLoader';
import { FiveLights } from '../components/common/FiveLights';
import { ResponsivePicture } from '../components/common/ResponsivePicture';

export const CampaignsIndex: React.FC = () => {
  const campaigns = getCampaigns();

  return (
    <div style={{ maxWidth: 'var(--article-content)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <FiveLights height={20} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', margin: '8px 0', color: '#F6F3ED' }}>
          CAMPAIGN ARCHIVE
        </h1>
        <p style={{ fontSize: '1rem', color: '#AEB6C4', lineHeight: 1.6, margin: 0 }}>
          歴代シングルのキャンペーンHero、コピー、および関連コンテンツのアーカイブ。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: camp.status === 'current' ? '2px solid var(--campaign-accent)' : '1px solid var(--color-border)',
              borderRadius: '4px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ position: 'relative', width: '100%', backgroundColor: camp.campaignColors.deep }}>
              <ResponsivePicture
                desktopSrc={camp.desktopHero}
                mobileSrc={camp.mobileHero}
                alt={camp.title}
                aspectRatio="16:9"
                mobileAspectRatio="3:4"
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: camp.status === 'current' ? 'var(--campaign-accent)' : 'rgba(8, 10, 15, 0.85)',
                  color: camp.status === 'current' ? 'var(--campaign-on-accent)' : '#AEB6C4',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '2px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {camp.status === 'current' ? '● CURRENT' : 'ARCHIVED'}
              </div>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: camp.campaignColors.accent, fontWeight: 600 }}>
                {camp.eyebrow}
              </span>

              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.6rem', fontWeight: 700, color: '#F6F3ED', margin: 0 }}>
                {camp.title}
              </h2>

              <p style={{ fontSize: '0.95rem', color: '#AEB6C4', lineHeight: 1.5, margin: 0, flex: 1 }}>
                {camp.catchCopy}
              </p>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                <Link
                  to={`/campaigns/${camp.id}/`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 18px',
                    backgroundColor: camp.campaignColors.accent,
                    color: '#080A0F',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    borderRadius: '2px',
                  }}
                >
                  VIEW ARCHIVE ➔
                </Link>

                <Link
                  to={`/discography/${camp.releaseId}/`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 18px',
                    backgroundColor: 'transparent',
                    color: '#F6F3ED',
                    border: '1px solid var(--color-border)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    borderRadius: '2px',
                  }}
                >
                  DISCOGRAPHY ↗
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
