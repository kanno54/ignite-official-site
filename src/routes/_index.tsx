import React from 'react';
import { Link } from 'react-router-dom';
import { getSiteConfig, getMembers, getReleases, getArticles, getNews, getRecordingById, getCurrentCampaign } from '../utils/contentLoader';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { TrackPlayButton } from '../components/audio/TrackPlayButton';
import { FiveLights } from '../components/common/FiveLights';
import { useAudio } from '../components/audio/AudioProvider';

export const TopPage: React.FC = () => {
  const config = getSiteConfig();
  const members = getMembers();
  const releases = getReleases();
  const articles = getArticles();
  const newsList = getNews();
  const { playRelease, playTrack } = useAudio();
  const currentCampaign = getCurrentCampaign();

  const currentRelease = releases.find((r) => r.id === currentCampaign.releaseId) || releases[0];
  const pickUpTrack = getRecordingById(config.pickUpTrackId);
  const latestArticle = articles[0];

  const handlePrimaryCta = () => {
    if (currentRelease && currentRelease.trackIds.length > 0) {
      const firstTrack = getRecordingById(currentRelease.trackIds[0]);
      if (firstTrack) playTrack(firstTrack.id);
      else playRelease(currentRelease.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
      {/* 1. Dynamic Campaign Hero Banner */}
      <section
        style={{
          position: 'relative',
          padding: '60px 0 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
        }}
      >
        <div style={{ maxWidth: '900px', width: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
          <ResponsivePicture
            desktopSrc={currentCampaign.desktopHero}
            mobileSrc={currentCampaign.mobileHero}
            alt={currentCampaign.title}
            aspectRatio="16:9"
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '700px',
            width: '100%',
            padding: '0 16px',
            zIndex: 1,
          }}
        >
          <span className="campaign-tag">{currentCampaign.eyebrow}</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              margin: 0,
              letterSpacing: '0.08em',
              lineHeight: 1,
              color: currentCampaign.campaignColors.text || '#F6F3ED',
              textTransform: 'uppercase',
            }}
          >
            {currentCampaign.title}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
              color: currentCampaign.campaignColors.accent || 'var(--campaign-accent-2)',
              margin: 0,
              fontWeight: 500,
            }}
          >
            {currentCampaign.catchCopy}
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={handlePrimaryCta} className="btn-primary">
              {currentCampaign.primaryCta.text}
            </button>
            <Link to={currentCampaign.secondaryCta.url || `/discography/${currentRelease.slug}/`} className="btn-secondary">
              {currentCampaign.secondaryCta.text}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Latest News */}
      <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '2px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#F6F3ED', margin: 0 }}>
            LATEST NEWS
          </h2>
          <FiveLights height={14} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {newsList.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              to={item.url}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '16px 20px',
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderLeft: '3px solid var(--campaign-accent)',
                borderRadius: '2px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--campaign-accent)', fontWeight: 600 }}>
                  {item.date}
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', backgroundColor: 'var(--campaign-deep)', border: '1px solid var(--campaign-accent)', color: 'var(--campaign-accent-2)', borderRadius: '2px' }}>
                  {item.category}
                </span>
              </div>
              <span style={{ fontSize: '0.95rem', color: '#F6F3ED', fontWeight: 600, lineHeight: 1.5, wordBreak: 'break-word' }}>
                {item.title} ➔
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Pick Up Track */}
      {pickUpTrack && (
        <section style={{ backgroundColor: 'var(--campaign-deep)', border: '1px solid var(--campaign-accent)', padding: 'clamp(20px, 4vw, 36px)', borderRadius: '2px' }}>
          <span className="campaign-tag" style={{ marginBottom: '12px' }}>PICK UP TRACK</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', marginTop: '16px' }}>
            <div style={{ width: '140px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', margin: '0 auto' }}>
              <ResponsivePicture
                assetId={pickUpTrack.posterAssetId || currentRelease.coverAssetId}
                title={pickUpTrack.title}
                subtitle={pickUpTrack.versionLabel}
                aspectRatio="3:4"
                accentColor="var(--campaign-accent)"
              />
            </div>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', margin: '0 0 8px', color: '#F6F3ED' }}>
                {pickUpTrack.title}
              </h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--campaign-accent)', margin: 0 }}>
                {pickUpTrack.versionLabel}
              </p>

              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#F6F3ED', marginTop: '12px' }}>
                {pickUpTrack.linerNotes}
              </p>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                <TrackPlayButton recordingId={pickUpTrack.id} size="large" />
                <Link to={`/discography/${currentRelease.slug}/`} className="btn-secondary">
                  READ LYRICS & NOTES
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Five Members */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--campaign-accent)' }}>FIVE VOICES, ONE STAGE</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', color: '#F6F3ED', margin: 0 }}>
              MEMBERS
            </h2>
          </div>
          <Link to="/members/" className="btn-secondary" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
            VIEW ALL ➔
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          {members.map((m) => (
            <Link
              key={m.id}
              to={`/members/${m.slug}/`}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '2px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              <ResponsivePicture assetId={m.avatarAssetId} title={m.nameEn} subtitle={m.role} aspectRatio="1:1" accentColor={m.colorHex} />
              <div style={{ padding: '12px', borderTop: `3px solid ${m.colorHex}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: 0, color: '#F6F3ED' }}>
                    {m.nameEn}
                  </h3>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: m.colorHex }}>
                    {m.colorName}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#AEB6C4', marginTop: '4px', lineHeight: 1.3, margin: 0 }}>
                  {m.shortCopy}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Latest Feature */}
      {latestArticle && (
        <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(20px, 4vw, 36px)', borderRadius: '2px' }}>
          <span className="campaign-tag" style={{ marginBottom: '12px' }}>{latestArticle.kicker}</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', alignItems: 'center', marginTop: '16px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', lineHeight: 1.4, color: '#F6F3ED', margin: '0 0 12px' }}>
                {latestArticle.title}
              </h2>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#AEB6C4', margin: 0 }}>
                {latestArticle.dek}
              </p>
              <Link to={`/features/${latestArticle.slug}/`} className="btn-primary" style={{ marginTop: '20px' }}>
                READ INTERVIEW ➔
              </Link>
            </div>
            <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <ResponsivePicture assetId={latestArticle.heroAssetId} title={latestArticle.kicker} subtitle={latestArticle.title} aspectRatio="3:2" accentColor="var(--campaign-accent)" />
            </div>
          </div>
        </section>
      )}

      {/* 6. From the Archive */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--campaign-accent)' }}>DISCOGRAPHY 2020–2022</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: '#F6F3ED', margin: 0 }}>
              FROM THE ARCHIVE
            </h2>
          </div>
          <Link to="/discography/" className="btn-secondary" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
            ALL RELEASES ➔
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {releases.map((rel) => (
            <Link
              key={rel.id}
              to={`/discography/${rel.slug}/`}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '20px',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <ResponsivePicture assetId={rel.coverAssetId} title={rel.title} subtitle={`${rel.format} — ${rel.fictionalReleaseDateFull}`} aspectRatio="1:1" accentColor="var(--campaign-accent)" />
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--campaign-accent)' }}>
                  {rel.format} — {rel.fictionalReleaseDateFull}
                </span>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 700, margin: '4px 0', color: '#F6F3ED' }}>
                  {rel.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#AEB6C4', lineHeight: 1.5, margin: 0 }}>
                  {rel.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Mini Tools */}
      <section style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', padding: '36px', borderRadius: '2px', textAlign: 'center' }}>
        <FiveLights height={24} gap={8} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', margin: '16px 0 8px', color: '#F6F3ED' }}>
          INTERACTIVE TOOLS
        </h2>
        <p style={{ fontSize: '1rem', color: '#AEB6C4', maxWidth: '600px', margin: '0 auto 24px' }}>
          今の気分から選曲する「IGNITE JUKEBOX」と、あなただけのデジタル会員証「EMBER DIGITAL PASS」を体験。
        </p>
        <Link to="/fun/" className="btn-primary">
          LAUNCH MINI TOOLS ✦
        </Link>
      </section>

      {/* 8. Campaign Archive Navigation */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderTop: '3px solid var(--campaign-accent)',
          padding: '40px 32px',
          borderRadius: '2px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--campaign-accent)', fontWeight: 600 }}>
          HISTORY & VISUALS
        </span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: '#F6F3ED', margin: 0 }}>
          EXPLORE CAMPAIGN ARCHIVE
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#AEB6C4', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
          歴代シングルのキャンペーンHero、コピー、およびビジュアルの世界観をアーカイブにて公開中。
        </p>

        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/campaigns/" className="btn-primary">
            EXPLORE ARCHIVE ➔
          </Link>

          {currentCampaign.id === 'moonlit' && (
            <Link to="/campaigns/no-limits/" className="btn-secondary">
              PREVIOUS CAMPAIGN — NO LIMITS ↗
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};
