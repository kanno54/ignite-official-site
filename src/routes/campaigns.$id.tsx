import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCampaignById, getReleaseBySlug, getRecordingsForRelease, getArticles } from '../utils/contentLoader';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { FiveLights } from '../components/common/FiveLights';
import { useAudio } from '../components/audio/AudioProvider';
import { NotFoundPage } from './404';

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const campaign = id ? getCampaignById(id) : undefined;
  const { playTrack } = useAudio();

  if (!campaign) {
    return <NotFoundPage />;
  }

  const release = getReleaseBySlug(campaign.releaseId);
  const recordings = getRecordingsForRelease(campaign.releaseId);
  const allArticles = getArticles();
  const relatedArticles = allArticles.filter((art) => campaign.relatedArticleIds.includes(art.slug) || campaign.relatedArticleIds.includes(art.id));

  const handlePlayTitleTrack = () => {
    if (recordings.length > 0) {
      playTrack(recordings[0].id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      {/* Campaign Hero Banner Recreation */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '70vh',
          backgroundColor: campaign.campaignColors.deep,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '60px 24px',
          overflow: 'hidden',
          borderRadius: '4px',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <ResponsivePicture
            desktopSrc={campaign.desktopHero}
            mobileSrc={campaign.mobileHero}
            alt={campaign.title}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to top, rgba(8, 10, 15, 0.95) 0%, rgba(8, 10, 15, 0.4) 60%, transparent 100%)',
            }}
          />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 'var(--article-content)',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: campaign.campaignColors.accent,
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              {campaign.eyebrow}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                backgroundColor: campaign.status === 'current' ? campaign.campaignColors.accent : 'rgba(255,255,255,0.1)',
                color: campaign.status === 'current' ? '#080A0F' : '#AEB6C4',
                padding: '2px 8px',
                borderRadius: '2px',
                fontWeight: 700,
              }}
            >
              {campaign.status === 'current' ? '● CURRENT CAMPAIGN' : 'ARCHIVED CAMPAIGN'}
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              margin: 0,
              color: '#F6F3ED',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            {campaign.title}
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#AEB6C4', lineHeight: 1.5, margin: 0, maxWidth: '600px' }}>
            {campaign.catchCopy}
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
            {recordings.length > 0 && (
              <button
                onClick={handlePlayTitleTrack}
                style={{
                  padding: '14px 28px',
                  backgroundColor: campaign.campaignColors.accent,
                  color: '#080A0F',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: '2px',
                }}
              >
                {campaign.primaryCta.text}
              </button>
            )}

            {release && (
              <Link
                to={`/discography/${release.slug}/`}
                style={{
                  padding: '14px 28px',
                  backgroundColor: 'transparent',
                  color: '#F6F3ED',
                  border: '1px solid var(--color-border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  borderRadius: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {campaign.secondaryCta.text}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: 'var(--article-content)', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {/* Navigation Back */}
        <div>
          <Link to="/campaigns/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--campaign-accent)' }}>
            ← BACK TO CAMPAIGN ARCHIVE
          </Link>
        </div>

        {/* Tracklist Preview */}
        {release && recordings.length > 0 && (
          <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '32px', borderRadius: '4px' }}>
            <FiveLights height={16} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#F6F3ED', margin: '8px 0 20px' }}>
              RELEASE TRACKLIST ({release.title})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recordings.map((rec, idx) => (
                <div
                  key={rec.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: 'var(--color-surface-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '2px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--campaign-accent)', fontWeight: 700 }}>
                      0{idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#F6F3ED' }}>{rec.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#AEB6C4' }}>{rec.versionLabel}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => playTrack(rec.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      color: 'var(--campaign-accent)',
                      border: '1px solid var(--campaign-accent)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      borderRadius: '2px',
                    }}
                  >
                    PLAY ▶
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Articles & Interviews */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#F6F3ED', margin: '0 0 20px' }}>
              RELATED ARTICLES & INTERVIEWS
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {relatedArticles.map((art) => (
                <Link
                  key={art.id}
                  to={`/features/${art.slug}/`}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    padding: '24px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--campaign-accent)' }}>
                    {art.kicker} // {art.publishDateFull}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F6F3ED', margin: 0 }}>
                    {art.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#AEB6C4', margin: 0, lineHeight: 1.5 }}>
                    {art.dek}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
