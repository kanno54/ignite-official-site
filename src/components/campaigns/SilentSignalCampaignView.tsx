import React from 'react';
import { Link } from 'react-router-dom';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { FiveLights } from '../common/FiveLights';
import { useAudio } from '../audio/AudioProvider';
import { Campaign, Article } from '../../types/content';

interface SilentSignalCampaignViewProps {
  campaign: Campaign;
  relatedArticles: Article[];
}

export const SilentSignalCampaignView: React.FC<SilentSignalCampaignViewProps> = ({
  campaign,
}) => {
  const { playTrack } = useAudio();

  const members = [
    { name: 'KAI', signal: 'PRESENCE', role: 'Main Vocal', image: '/assets/images/members/avatar-kai-ss.webp' },
    { name: 'SHO', signal: 'MOTION', role: 'Performance & Choreography', image: '/assets/images/members/avatar-sho-ss.webp' },
    { name: 'LEO', signal: 'GAZE', role: 'Vocal & Visual', image: '/assets/images/members/avatar-leo-ss.webp' },
    { name: 'REN', signal: 'BREATH', role: 'Vocal', image: '/assets/images/members/avatar-ren-ss.webp' },
    { name: 'YUTO', signal: 'PULSE', role: 'Dance & Rap', image: '/assets/images/members/avatar-yuto-ss.webp' },
  ];

  return (
    <div style={{ backgroundColor: '#05070B', color: '#E6E8EB', minHeight: '100vh', position: 'relative' }}>
      {/* Background Vertical Ambient Lines (Signal Line) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.15 }}>
        <div style={{ position: 'absolute', left: '15%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent, #8496B4, transparent)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(220,230,245,0.4), transparent)' }} />
        <div style={{ position: 'absolute', right: '15%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent, #8496B4, transparent)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '80px' }}>
        
        {/* SECTION 01: HERO */}
        <section
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '60px 24px',
            overflow: 'hidden',
            backgroundColor: '#05070B',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <ResponsivePicture
              desktopSrc="/assets/images/campaigns/hero-silent-signal-desktop.webp"
              mobileSrc="/assets/images/campaigns/hero-silent-signal-mobile.webp"
              alt="IGNITE Silent Signal 5th Single Hero"
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to top, #05070B 0%, rgba(5, 7, 11, 0.4) 50%, transparent 100%)',
              }}
            />
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              maxWidth: '800px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <h1 className="sr-only">IGNITE 5th Single Silent Signal</h1>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#8496B4', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {campaign.eyebrow || 'IGNITE 5TH SINGLE'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#F6F3ED', letterSpacing: '0.12em', margin: 0, fontWeight: 300 }}>
              SILENT SIGNAL
            </h2>
            <div style={{ width: '40px', height: '1px', background: '#8496B4', margin: '8px 0' }} />
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', color: '#DCE6F5', letterSpacing: '0.15em', margin: 0 }}>
              WE SPEAK WITHOUT WORDS.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => playTrack('silent-signal-title')}
                className="btn-primary"
                style={{ backgroundColor: '#8496B4', color: '#05070B', borderColor: '#8496B4', fontWeight: 700 }}
              >
                LISTEN NOW ▶
              </button>
              <Link
                to="/discography/silent-signal/"
                className="btn-secondary"
                style={{ borderColor: 'rgba(220,230,245,0.3)', color: '#E6E8EB' }}
              >
                VIEW DISCOGRAPHY ➔
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 02: INTRO */}
        <section style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#8496B4', letterSpacing: '0.15em' }}>
            SILENT SIGNAL
          </span>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#F6F3ED', margin: 0, fontWeight: 400 }}>
            言葉より先に、伝わるもの。
          </h3>
          <div style={{ fontSize: '1.05rem', color: '#9AA3AE', lineHeight: 2, whiteSpace: 'pre-line', marginTop: '12px' }}>
            視線。
            呼吸。
            靴音。
            そして、動かない時間。

            IGNITE 5th Single「Silent Signal」は、
            五人の身体そのものをひとつの言語として描いた作品。

            声にならないものが、
            もっとも強く伝わる瞬間を切り取る。
          </div>
        </section>

        {/* SECTION 03: FOUR SIGNALS */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { en: 'GAZE', ja: '視線' },
              { en: 'BREATH', ja: '呼吸' },
              { en: 'STEP', ja: '足音' },
              { en: 'SILENCE', ja: '静止' },
            ].map((sig, i) => (
              <div
                key={i}
                style={{
                  borderLeft: '1px solid rgba(220,230,245,0.22)',
                  padding: '24px 20px',
                  backgroundColor: '#080D15',
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: '#DCE6F5', letterSpacing: '0.1em', fontWeight: 300 }}>
                  {sig.en}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#9AA3AE' }}>
                  {sig.ja}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 04: PERFORMANCE */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#8496B4', letterSpacing: '0.15em' }}>
              PERFORMANCE
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#F6F3ED', margin: '8px 0 0' }}>
              THE PERFORMANCE
            </h3>
            <p style={{ color: '#9AA3AE', marginTop: '6px' }}>動かない時間まで、振付になる。</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {/* Block 1 */}
            <div style={{ backgroundColor: '#080D15', border: '1px solid rgba(220,230,245,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <img src="/assets/images/performance/ss-d01-silence.webp" alt="SILENCE" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#8496B4', letterSpacing: '0.1em' }}>SILENCE</span>
                <p style={{ fontSize: '0.95rem', color: '#E6E8EB', margin: '8px 0 0', lineHeight: 1.6 }}>音が消えた瞬間も、身体は止まっていない。</p>
              </div>
            </div>

            {/* Block 2 */}
            <div style={{ backgroundColor: '#080D15', border: '1px solid rgba(220,230,245,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <img src="/assets/images/performance/ss-d03-step.webp" alt="STEP" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#8496B4', letterSpacing: '0.1em' }}>STEP</span>
                <p style={{ fontSize: '0.95rem', color: '#E6E8EB', margin: '8px 0 0', lineHeight: 1.6 }}>五つの足音が、一瞬だけ同じ時間に重なる。</p>
              </div>
            </div>

            {/* Block 3 */}
            <div style={{ backgroundColor: '#080D15', border: '1px solid rgba(220,230,245,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <img src="/assets/images/performance/ss-d05-signal.webp" alt="SIGNAL" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#8496B4', letterSpacing: '0.1em' }}>SIGNAL</span>
                <p style={{ fontSize: '0.95rem', color: '#E6E8EB', margin: '8px 0 0', lineHeight: 1.6 }}>最後の一拍で、五人の呼吸が揃う。</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 05: SHO / CHOREOGRAPHY */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
          <div
            style={{
              backgroundColor: '#080D15',
              border: '1px solid rgba(220,230,245,0.15)',
              borderRadius: '4px',
              padding: '40px 32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#8496B4', letterSpacing: '0.15em' }}>
                CHOREOGRAPHY / SHO
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#F6F3ED', margin: 0, fontWeight: 400 }}>
                言葉を消したとき、身体に何が残るのか。
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#9AA3AE', lineHeight: 1.7, margin: 0 }}>
                「何を踊るか」ではなく、「どこまで動かなくていいか」から始まった。SHOが語る、『Silent Signal』の身体設計。
              </p>
              <Link
                to="/features/silent-signal-sho-interview/"
                className="btn-primary"
                style={{ backgroundColor: '#8496B4', color: '#05070B', alignSelf: 'flex-start', marginTop: '8px', fontWeight: 700 }}
              >
                READ INTERVIEW ➔
              </Link>
            </div>
            <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', minHeight: '260px' }}>
              <img
                src="/assets/images/articles/hero-sho-choreography-ss.webp"
                alt="SHO Choreography Interview Hero"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>

        {/* SECTION 06: FIVE SIGNALS */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#8496B4', letterSpacing: '0.15em' }}>
              FIVE SIGNALS
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#F6F3ED', margin: '8px 0 0' }}>
              INDIVIDUAL BODY EXPRESSION
            </h3>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '16px',
              scrollSnapType: 'x mandatory',
            }}
          >
            {members.map((m, i) => (
              <div
                key={i}
                style={{
                  minWidth: '180px',
                  flex: '1 0 180px',
                  backgroundColor: '#080D15',
                  border: '1px solid rgba(220,230,245,0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  scrollSnapAlign: 'start',
                }}
              >
                <img src={m.image} alt={`IGNITE ${m.name} Silent Signal`} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#DCE6F5', fontWeight: 700 }}>
                    {m.name}
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#8496B4', marginTop: '4px', letterSpacing: '0.1em' }}>
                    {m.signal}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 07: TRACK 01 SILENT SIGNAL */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
          <div
            style={{
              backgroundColor: '#080D15',
              border: '1px solid rgba(220,230,245,0.15)',
              borderRadius: '4px',
              padding: '36px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <img
              src="/assets/images/covers/poster-silent-signal.webp"
              alt="Silent Signal Poster"
              style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#8496B4', letterSpacing: '0.15em' }}>
                TRACK 01 — TITLE TRACK
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#F6F3ED', margin: 0 }}>
                SILENT SIGNAL
              </h3>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#DCE6F5', margin: 0 }}>
                声にならないままで、君にだけ届けばいい。
              </p>
              <p style={{ fontSize: '0.95rem', color: '#9AA3AE', lineHeight: 1.7, margin: 0 }}>
                言葉より先に伝わる視線、呼吸、身体の動き。SHO全面監修の振付と静寂を使った演出によって、IGNITEの身体表現をひとつの到達点まで押し進めた楽曲。
              </p>
              <button
                onClick={() => playTrack('silent-signal-title')}
                className="btn-primary"
                style={{ backgroundColor: '#8496B4', color: '#05070B', alignSelf: 'flex-start', marginTop: '8px', fontWeight: 700 }}
              >
                PLAY TRACK 1 ▶
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 08: TRACK 02 INVISIBLE LINE */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
          <div
            style={{
              backgroundColor: '#080D15',
              border: '1px solid rgba(220,230,245,0.15)',
              borderRadius: '4px',
              padding: '36px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#8496B4', letterSpacing: '0.15em' }}>
                TRACK 02 — COUPLING
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#F6F3ED', margin: 0 }}>
                INVISIBLE LINE
              </h3>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#DCE6F5', margin: 0 }}>
                分かっているからこそ、踏み込まない。
              </p>
              <p style={{ fontSize: '0.95rem', color: '#9AA3AE', lineHeight: 1.7, margin: 0 }}>
                Silent Signalが「言葉がなくても伝わる関係」なら、Invisible Lineは「分かっているから越えない距離」として対比させる。
              </p>
              <button
                onClick={() => playTrack('silent-signal-invisible-line')}
                className="btn-primary"
                style={{ backgroundColor: '#8496B4', color: '#05070B', alignSelf: 'flex-start', marginTop: '8px', fontWeight: 700 }}
              >
                PLAY TRACK 2 ▶
              </button>
            </div>
            <img
              src="/assets/images/covers/poster-invisible-line.webp"
              alt="Invisible Line Poster"
              style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '4px' }}
            />
          </div>
        </section>

        {/* SECTION 09: TRACK 03 NOCTURNE DRIVE */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
          <div
            style={{
              backgroundColor: '#080D15',
              border: '1px solid rgba(220,230,245,0.15)',
              borderRadius: '4px',
              padding: '36px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <img
              src="/assets/images/covers/poster-nocturne-drive.webp"
              alt="Nocturne Drive Live Poster"
              style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#8496B4', letterSpacing: '0.15em' }}>
                TRACK 03 — LIVE VERSION
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#F6F3ED', margin: 0 }}>
                NOCTURNE DRIVE - LIVE VERSION -
              </h3>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#DCE6F5', margin: 0 }}>
                夜を走る身体。
              </p>
              <p style={{ fontSize: '0.95rem', color: '#9AA3AE', lineHeight: 1.7, margin: 0 }}>
                SHOとYUTOのダンスを中心に、静かな夜を強い疾走感へ変えたLive Version。IGNITEのシングル3曲目がLive Versionである文化を象徴する1曲。
              </p>
              <button
                onClick={() => playTrack('silent-signal-nocturne-drive-live')}
                className="btn-primary"
                style={{ backgroundColor: '#8496B4', color: '#05070B', alignSelf: 'flex-start', marginTop: '8px', fontWeight: 700 }}
              >
                PLAY TRACK 3 ▶
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 10: RELEASE */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
          <div
            style={{
              backgroundColor: '#080D15',
              border: '1px solid rgba(220,230,245,0.2)',
              borderRadius: '4px',
              padding: '40px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <img
              src="/assets/images/covers/cover-silent-signal.webp"
              alt="Silent Signal Single Cover"
              style={{ width: '220px', height: '220px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 12px 32px rgba(0,0,0,0.6)' }}
            />
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#8496B4' }}>
                IGNITE 5TH SINGLE
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#F6F3ED', margin: '4px 0 16px' }}>
                Silent Signal
              </h3>
              <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#9AA3AE', fontFamily: 'var(--font-mono)' }}>
                <li>01. Silent Signal</li>
                <li>02. Invisible Line</li>
                <li>03. Nocturne Drive - Live Version -</li>
              </ol>
              <Link
                to="/discography/silent-signal/"
                className="btn-primary"
                style={{ backgroundColor: '#8496B4', color: '#05070B', fontWeight: 700 }}
              >
                VIEW DISCOGRAPHY ➔
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 11: CLOSING */}
        <section
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 24px',
            overflow: 'hidden',
            backgroundColor: '#05070B',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <img
              src="/assets/images/backgrounds/ss-bg01-horizontal.webp"
              alt="Silent Signal Stage Light Background"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, transparent 20%, #05070B 90%)',
              }}
            />
          </div>

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FiveLights height={20} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#F6F3ED', letterSpacing: '0.15em', margin: 0, fontWeight: 300 }}>
              THE SIGNAL REMAINS.
            </h2>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#8496B4', letterSpacing: '0.2em', margin: 0 }}>
              WE SPEAK WITHOUT WORDS.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
