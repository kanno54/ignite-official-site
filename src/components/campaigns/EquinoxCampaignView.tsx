import React from 'react';
import { Link } from 'react-router-dom';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { FiveLights } from '../common/FiveLights';
import { useAudio } from '../audio/AudioProvider';
import { Campaign, Article } from '../../types/content';
import { getRecordingsForRelease } from '../../utils/contentLoader';

interface EquinoxCampaignViewProps {
  campaign: Campaign;
  relatedArticles: Article[];
}

export const EquinoxCampaignView: React.FC<EquinoxCampaignViewProps> = ({ campaign, relatedArticles }) => {
  const { playTrack } = useAudio();
  const recordings = getRecordingsForRelease(campaign.releaseId);

  const members = [
    {
      id: 'kai',
      name: 'KAI',
      role: 'Main Vocal & Leader',
      keyword: 'XII — EQUINOX',
      quote: '正午の光と影の境目で、俺たちはもう一度一つになる。',
      image: '/assets/images/members/profile-kai.webp',
    },
    {
      id: 'sho',
      name: 'SHO',
      role: 'Performance & Choreography',
      keyword: 'VI — SHADOWPLAY',
      quote: '光があるからこそ影が伸びる。その動きのすべてをステージへ。',
      image: '/assets/images/members/profile-sho.webp',
    },
    {
      id: 'leo',
      name: 'LEO',
      role: 'Vocal & Visual',
      keyword: 'VIII — PARALLEL LINES',
      quote: '交わらない平行線でもいい。同じ方角を向いて歌えるなら。',
      image: '/assets/images/members/profile-leo.webp',
    },
    {
      id: 'ren',
      name: 'REN',
      role: 'Vocal & Lyrics',
      keyword: 'XXII — SHADOW',
      quote: '深い夜の底で光を見つめる。静かな影こそが僕らの力だ。',
      image: '/assets/images/members/profile-ren.webp',
    },
    {
      id: 'yuto',
      name: 'YUTO',
      role: 'Dance & Rap',
      keyword: 'X — ELECTRIC BLUE',
      quote: '夜の静寂を打ち破る青い火花。言葉を超えて加速する。',
      image: '/assets/images/members/profile-yuto.webp',
    },
  ];

  const romanNumerals = ['XII', 'II', 'IV', 'VI', 'VIII', 'X', 'XIV', 'XVI', 'XVIII', 'XX', 'XXII', 'XXIV'];
  const tracks = recordings.map((recording, index) => ({
    num: String(index + 1).padStart(2, '0'),
    roman: romanNumerals[index],
    title: recording.title,
    sub: recording.versionLabel,
    trackId: recording.id,
    coverImage: recording.coverImage,
    posterAssetId: recording.posterAssetId,
  }));

  return (
    <div style={{ backgroundColor: '#0B0F19', color: '#F8FAFC', minHeight: '100vh', position: 'relative' }}>
      {/* 1. Hero Section */}
      <section style={{ position: 'relative', width: '100%', minHeight: '75vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', backgroundColor: '#0F172A' }}>
        <ResponsivePicture
          desktopSrc={campaign.desktopHero || '/assets/images/campaigns/hero-rise-again-desktop.png'}
          mobileSrc={campaign.mobileHero || '/assets/images/campaigns/hero-rise-again-mobile.png'}
          alt="IGNITE 2nd Full Album EQUINOX Key Visual"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, opacity: 0.7 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,15,25,0.4) 0%, rgba(11,15,25,0.85) 75%, #0B0F19 100%)', zIndex: 2 }} />

        <div style={{ position: 'relative', zIndex: 3, maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 40px', width: '100%' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(217,180,74,0.15)', border: '1px solid #D9B44A', color: '#D9B44A', fontSize: '12px', fontWeight: 700, padding: '4px 12px', letterSpacing: '0.15em', marginBottom: '16px' }}>
            {campaign.eyebrow}
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: 'var(--font-serif, serif)', letterSpacing: '0.08em', margin: '0 0 16px', color: '#FFFFFF' }}>
            EQUINOX
          </h1>
          <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', color: '#D9B44A', fontWeight: 600, margin: '0 0 24px', letterSpacing: '0.05em' }}>
            {campaign.catchCopy}
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => playTrack('equinox-title')}
              style={{
                backgroundColor: '#D9B44A',
                color: '#0B0F19',
                border: 'none',
                padding: '14px 28px',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              LISTEN NOW ▶
            </button>
            <Link
              to="/discography/equinox/"
              style={{
                backgroundColor: 'transparent',
                color: '#F8FAFC',
                border: '1px solid rgba(248,250,252,0.4)',
                padding: '14px 28px',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              VIEW DISCOGRAPHY ➔
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Statement / Intro Section */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px' }}>
        <FiveLights height={20} />
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontFamily: 'var(--font-serif, serif)', color: '#D9B44A', marginBottom: '24px' }}>
            二つの影が、ひとつの光を形づくる。
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', color: '#CBD5E1', maxWidth: '780px', margin: '0 auto' }}>
            『Silent Signal』の静寂と、『RISE AGAIN』の再起の息吹を経て、IGNITEは2nd Full Album『EQUINOX』へと結実する。
            <br /><br />
            昼と夜が同じ長さを分け合うように、喜びと葛藤、光と影の双方を抱えたまま、五人は同じ中心へ向かって声を重ねる。
          </p>
        </div>
      </section>

      {/* 3. Five Members Concept Grid */}
      <section style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(217,180,74,0.2)', borderBottom: '1px solid rgba(217,180,74,0.2)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ color: '#D9B44A', fontSize: '12px', letterSpacing: '0.2em', fontWeight: 700 }}>ONE MOMENT / FIVE MEMBERS</span>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif, serif)', margin: '8px 0 0' }}>五つの時間の交錯</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {members.map((m) => (
              <div
                key={m.id}
                style={{
                  backgroundColor: 'rgba(15,23,42,0.8)',
                  border: '1px solid rgba(217,180,74,0.2)',
                  borderRadius: '4px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <img src={m.image} alt={m.name} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '2px' }} />
                <span style={{ fontSize: '11px', color: '#D9B44A', fontWeight: 700, letterSpacing: '0.1em' }}>{m.keyword}</span>
                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{m.name}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>{m.role}</p>
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#E2E8F0', fontStyle: 'italic', lineHeight: '1.5' }}>
                  "{m.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 2nd Full Album & 12 Track Highlights */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ color: '#D9B44A', fontSize: '12px', letterSpacing: '0.2em', fontWeight: 700 }}>2ND FULL ALBUM</span>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif, serif)', margin: '8px 0 0' }}>EQUINOX — 12 Tracks (XII ➔ XXIV)</h2>
          </div>
          <button
            onClick={() => playTrack('equinox-title')}
            style={{
              backgroundColor: '#D9B44A',
              color: '#0B0F19',
              border: 'none',
              padding: '12px 24px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ALBUM 全曲再生 ▶
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {tracks.map((t) => (
            <div
              key={t.num}
              style={{
                backgroundColor: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '20px',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D9B44A', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                  <span>TRACK {t.num} ({t.roman})</span>
                  <span style={{ fontSize: '10px', color: '#4ADE80', border: '1px solid #4ADE80', padding: '1px 4px', borderRadius: '2px' }}>COVER READY</span>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <ResponsivePicture
                    assetId={t.posterAssetId}
                    desktopSrc={t.coverImage}
                    title={t.title}
                    subtitle={t.sub}
                    aspectRatio="1:1"
                    accentColor="#D9B44A"
                  />
                </div>

                <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', color: '#FFFFFF' }}>{t.title}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>{t.sub}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={() => playTrack(t.trackId)}
                  style={{
                    backgroundColor: 'rgba(217,180,74,0.15)',
                    color: '#D9B44A',
                    border: '1px solid #D9B44A',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                >
                  PLAY ▶
                </button>
                <Link
                  to="/discography/equinox/"
                  style={{
                    color: '#94A3B8',
                    fontSize: '11px',
                    textDecoration: 'none',
                    alignSelf: 'center',
                  }}
                >
                  DETAIL ➔
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Editorial Features Section */}
      <section style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ color: '#D9B44A', fontSize: '12px', letterSpacing: '0.2em', fontWeight: 700 }}>EDITORIAL & INTERVIEWS</span>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif, serif)', margin: '8px 0 0' }}>EQUINOX 特集記事</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {relatedArticles.map((art) => (
              <Link
                key={art.id}
                to={`/features/${art.slug}/`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  backgroundColor: 'rgba(15,23,42,0.9)',
                  border: '1px solid rgba(217,180,74,0.2)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <ResponsivePicture assetId={art.heroAssetId} title={art.kicker} subtitle={art.title} aspectRatio="3:2" accentColor="#D9B44A" />
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '10px', color: '#D9B44A', fontWeight: 700, letterSpacing: '0.1em' }}>{art.kicker || art.category || 'SPECIAL FEATURE'}</span>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFFFFF', lineHeight: '1.4' }}>{art.title}</h3>
                  <p style={{ margin: 'auto 0 0', fontSize: '12px', color: '#94A3B8', paddingTop: '12px' }}>{art.publishDateFull || art.publishDate || art.publishedAt} ➔ READ FEATURE</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Campaign Archive Navigation */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 100px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#94A3B8', marginBottom: '20px' }}>RELATED ERA & CAMPAIGNS</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            to="/campaigns/silent-signal/"
            style={{
              backgroundColor: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#F8FAFC',
              padding: '12px 24px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            ← PREVIOUS: Silent Signal
          </Link>
          <Link
            to="/campaigns/rise-again/"
            style={{
              backgroundColor: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#F8FAFC',
              padding: '12px 24px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            ← PREVIOUS: RISE AGAIN
          </Link>
          <Link
            to="/story/"
            style={{
              backgroundColor: 'rgba(217,180,74,0.15)',
              border: '1px solid #D9B44A',
              color: '#D9B44A',
              padding: '12px 24px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            STORY / TIMELINE ➔
          </Link>
        </div>
      </section>
    </div>
  );
};
