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

  React.useEffect(() => {
    if (campaign) {
      document.title = `${campaign.title}｜Campaign Archive｜IGNITE Official Site`;
      const canonicalEl = document.querySelector("link[rel='canonical']");
      if (canonicalEl) {
        canonicalEl.setAttribute('href', `https://ignite-official.site/campaigns/${campaign.slug || campaign.id}/`);
      }
      const ogUrlEl = document.querySelector("meta[property='og:url']");
      if (ogUrlEl) {
        ogUrlEl.setAttribute('content', `https://ignite-official.site/campaigns/${campaign.slug || campaign.id}/`);
      }
    }
  }, [campaign]);

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
            alt={campaign.heroAlt || campaign.title}
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
        {/* Navigation Back (Top) */}
        <div>
          <Link to="/campaigns/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: campaign.campaignColors.accent }}>
            ← BACK TO CAMPAIGN ARCHIVE
          </Link>
        </div>

        {/* INTRODUCTION Section */}
        {campaign.introduction && (
          <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '36px 32px', borderRadius: '4px' }}>
            <span className="campaign-tag" style={{ backgroundColor: campaign.campaignColors.accent, color: '#080A0F', fontWeight: 700, marginBottom: '12px' }}>
              INTRODUCTION
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#F6F3ED', margin: '12px 0 16px' }}>
              {campaign.introduction.heading}
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#AEB6C4', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>
              {campaign.introduction.body}
            </p>
          </section>
        )}

        {/* CREATION BACKGROUND Section */}
        {campaign.creationBackground && (
          <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '36px 32px', borderRadius: '4px' }}>
            <span className="campaign-tag" style={{ backgroundColor: campaign.campaignColors.accent, color: '#080A0F', fontWeight: 700, marginBottom: '12px' }}>
              {campaign.creationBackground.heading}
            </span>
            {campaign.creationBackground.subtitle && (
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#F6F3ED', margin: '12px 0 16px' }}>
                {campaign.creationBackground.subtitle}
              </h2>
            )}
            <p style={{ fontSize: '1.02rem', color: '#AEB6C4', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>
              {campaign.creationBackground.body}
            </p>
          </section>
        )}

        {/* PERFORMANCE FOCUS Section */}
        {campaign.focusSection && (
          <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '36px 32px', borderRadius: '4px' }}>
            <span className="campaign-tag" style={{ backgroundColor: campaign.campaignColors.accent, color: '#080A0F', fontWeight: 700, marginBottom: '12px' }}>
              {campaign.focusSection.eyebrow}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#F6F3ED', margin: '12px 0 6px' }}>
              {campaign.focusSection.heading}
            </h2>
            {campaign.focusSection.subtitle && (
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: campaign.campaignColors.accent, margin: '0 0 16px' }}>
                {campaign.focusSection.subtitle}
              </p>
            )}
            <p style={{ fontSize: '1.02rem', color: '#AEB6C4', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>
              {campaign.focusSection.body}
            </p>
            {campaign.focusSection.link && (
              <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <Link
                  to={campaign.focusSection.link.url}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: campaign.campaignColors.accent, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {campaign.focusSection.link.text}
                </Link>
              </div>
            )}
          </section>
        )}

        {/* VOCAL FOCUS Section (2 Vocals: YUTO & REN) */}
        {campaign.vocalFocus && (
          <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '36px 32px', borderRadius: '4px' }}>
            <span className="campaign-tag" style={{ backgroundColor: campaign.campaignColors.accent, color: '#080A0F', fontWeight: 700, marginBottom: '12px' }}>
              {campaign.vocalFocus.eyebrow}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#F6F3ED', margin: '12px 0 6px' }}>
              {campaign.vocalFocus.heading}
            </h2>
            {campaign.vocalFocus.subtitle && (
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: campaign.campaignColors.accent, margin: '0 0 20px' }}>
                {campaign.vocalFocus.subtitle}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '4px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#F6F3ED', fontWeight: 900 }}>
                  YUTO
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: campaign.campaignColors.accent, display: 'block', margin: '4px 0 12px', fontWeight: 700 }}>
                  {campaign.vocalFocus.yuto.label}
                </span>
                <p style={{ fontSize: '0.92rem', color: '#AEB6C4', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                  {campaign.vocalFocus.yuto.body}
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--color-surface-elevated)', border: `1px solid ${campaign.campaignColors.accent}`, padding: '24px', borderRadius: '4px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#F6F3ED', fontWeight: 900 }}>
                  REN
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: campaign.campaignColors.accent, display: 'block', margin: '4px 0 12px', fontWeight: 700 }}>
                  {campaign.vocalFocus.ren.label}
                </span>
                <p style={{ fontSize: '0.92rem', color: '#AEB6C4', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                  {campaign.vocalFocus.ren.body}
                </p>
              </div>
            </div>
            {campaign.vocalFocus.link && (
              <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <Link
                  to={campaign.vocalFocus.link.url}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: campaign.campaignColors.accent, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {campaign.vocalFocus.link.text}
                </Link>
              </div>
            )}
          </section>
        )}

        {/* INDIES vs MAJOR Version Comparison Section */}
        {campaign.comparison && (
          <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '36px 32px', borderRadius: '4px' }}>
            <span className="campaign-tag" style={{ backgroundColor: campaign.campaignColors.accent, color: '#080A0F', fontWeight: 700, marginBottom: '12px' }}>
              {campaign.comparison.heading}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#F6F3ED', margin: '12px 0 24px' }}>
              {campaign.comparison.subtitle}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '4px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: campaign.campaignColors.accent, fontWeight: 700 }}>
                  {campaign.comparison.indies.title}
                </span>
                <h3 style={{ fontSize: '1.2rem', color: '#F6F3ED', margin: '8px 0 12px' }}>
                  {campaign.comparison.indies.subtitle}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#AEB6C4', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                  {campaign.comparison.indies.body}
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--color-surface-elevated)', border: `1px solid ${campaign.campaignColors.accent}`, padding: '24px', borderRadius: '4px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: campaign.campaignColors.accent, fontWeight: 700 }}>
                  {campaign.comparison.major.title}
                </span>
                <h3 style={{ fontSize: '1.2rem', color: '#F6F3ED', margin: '8px 0 12px' }}>
                  {campaign.comparison.major.subtitle}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#AEB6C4', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                  {campaign.comparison.major.body}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Design Banner Copy */}
        {campaign.bannerCopy && (
          <div style={{ padding: '32px 24px', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: `4px solid ${campaign.campaignColors.accent}`, borderRadius: '2px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.08em', fontWeight: 900, color: '#F6F3ED', margin: 0, lineHeight: 1.4 }}>
              {campaign.bannerCopy}
            </p>
          </div>
        )}

        {/* THREE WAYS FORWARD (Track Overview Cards) */}
        {campaign.trackOverview && (
          <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '36px 32px', borderRadius: '4px' }}>
            <span className="campaign-tag" style={{ backgroundColor: campaign.campaignColors.accent, color: '#080A0F', fontWeight: 700, marginBottom: '12px' }}>
              {campaign.trackOverview.eyebrow}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#F6F3ED', margin: '12px 0 24px' }}>
              {campaign.trackOverview.heading}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {campaign.trackOverview.items.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: campaign.campaignColors.accent, fontWeight: 700 }}>
                      {item.trackNo}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#AEB6C4', textTransform: 'uppercase' }}>
                      {item.subtitle}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#F6F3ED', margin: 0, fontWeight: 700 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#AEB6C4', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tracklist Preview & Commentary */}
        {release && recordings.length > 0 && (
          <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '32px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <FiveLights height={16} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#F6F3ED', margin: '8px 0 4px' }}>
                RELEASE / TRACKLIST ({release.title})
              </h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: campaign.campaignColors.accent, margin: 0 }}>
                {release.format} — {release.fictionalReleaseDateFull} RELEASE
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recordings.map((rec, idx) => (
                <div
                  key={rec.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '20px',
                    backgroundColor: 'var(--color-surface-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '2px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: campaign.campaignColors.accent, fontWeight: 700, fontSize: '1.1rem' }}>
                        0{idx + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, color: '#F6F3ED', fontSize: '1.05rem' }}>{rec.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#AEB6C4' }}>{rec.versionLabel}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => playTrack(rec.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: campaign.campaignColors.accent,
                        border: `1px solid ${campaign.campaignColors.accent}`,
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

                  {campaign.trackDescriptions?.[rec.id] && (
                    <p style={{ fontSize: '0.88rem', color: '#AEB6C4', lineHeight: 1.6, margin: '4px 0 0', whiteSpace: 'pre-line', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                      {campaign.trackDescriptions[rec.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {campaign.commentary && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px', marginTop: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#F6F3ED', margin: '0 0 12px' }}>
                  {campaign.commentary.heading}
                </h3>
                <p style={{ fontSize: '0.98rem', color: '#AEB6C4', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-line' }}>
                  {campaign.commentary.body}
                </p>
              </div>
            )}
          </section>
        )}

        {/* FIVE POSITIONS, ONE NAME (Performance Section) */}
        {campaign.performance && (
          <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '36px 32px', borderRadius: '4px' }}>
            <span className="campaign-tag" style={{ backgroundColor: campaign.campaignColors.accent, color: '#080A0F', fontWeight: 700, marginBottom: '12px' }}>
              PERFORMANCE
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#F6F3ED', margin: '12px 0 6px' }}>
              {campaign.performance.heading}
            </h2>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: campaign.campaignColors.accent, margin: '0 0 16px' }}>
              {campaign.performance.subtitle}
            </p>
            <p style={{ fontSize: '1.02rem', color: '#AEB6C4', lineHeight: 1.8, margin: '0 0 24px', whiteSpace: 'pre-line' }}>
              {campaign.performance.body}
            </p>

            {campaign.performance.elements && campaign.performance.elements.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                {campaign.performance.elements.map((elem, idx) => (
                  <div key={idx} style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#AEB6C4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: campaign.campaignColors.accent }}>✦</span>
                    {elem}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Timeline Section */}
        {campaign.timeline && campaign.timeline.length > 0 && (
          <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '36px 32px', borderRadius: '4px' }}>
            <span className="campaign-tag" style={{ backgroundColor: campaign.campaignColors.accent, color: '#080A0F', fontWeight: 700, marginBottom: '12px' }}>
              TIMELINE
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#F6F3ED', margin: '12px 0 6px' }}>
              {campaign.timelineHeading || 'THE FIRST FLAME'}
            </h2>
            {campaign.timelineSubtitle && (
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: campaign.campaignColors.accent, margin: '0 0 20px' }}>
                {campaign.timelineSubtitle}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {campaign.timeline.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    padding: '20px 24px',
                    borderRadius: '0 4px 4px 0',
                    border: '1px solid var(--color-border)',
                    borderLeft: `4px solid ${campaign.campaignColors.accent}`,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: campaign.campaignColors.accent, fontWeight: 700 }}>
                    {item.date}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 700, color: '#F6F3ED', margin: '6px 0 10px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#AEB6C4', lineHeight: 1.6, margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Articles & Interviews (FROM THE ARCHIVE) */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#F6F3ED', margin: '0 0 20px' }}>
              FROM THE ARCHIVE
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
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: campaign.campaignColors.accent }}>
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

        {/* Navigation Back (Bottom) */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
          <Link to="/campaigns/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: campaign.campaignColors.accent, textDecoration: 'none' }}>
            ← BACK TO CAMPAIGN ARCHIVE
          </Link>
        </div>
      </div>
    </div>
  );
};
