import React from 'react';
import { Link } from 'react-router-dom';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { FiveLights } from '../common/FiveLights';
import { useAudio } from '../audio/AudioProvider';
import { Campaign, Article } from '../../types/content';

interface RiseAgainCampaignViewProps {
  campaign: Campaign;
  relatedArticles: Article[];
}

export const RiseAgainCampaignView: React.FC<RiseAgainCampaignViewProps> = ({ campaign }) => {
  const { playTrack } = useAudio();

  const members = [
    {
      id: 'kai',
      name: 'KAI',
      role: 'Main Vocal & Leader',
      keyword: 'PRESENCE & TIME',
      quote: '立ち止まるなら一緒に止まる／でも進むなら 俺らで進む',
      image: '/media/images/rise-again/RA-G02_v01.png',
    },
    {
      id: 'sho',
      name: 'SHO',
      role: 'Performance & Choreography',
      keyword: 'STEP & FORMATION',
      quote: '揃わなかったステップと、崩れたフォーメーションを連れて',
      image: '/media/images/rise-again/RA-G03_v01.png',
    },
    {
      id: 'leo',
      name: 'LEO',
      role: 'Vocal & Visual',
      keyword: 'GAZE & DISTANCE',
      quote: '近づくほど遠く見える目標に、もう一度手を伸ばす',
      image: '/media/images/rise-again/RA-G04_v01.png',
    },
    {
      id: 'ren',
      name: 'REN',
      role: 'Vocal & Lyrics',
      keyword: 'NIGHT & VOICES',
      quote: '失ったものを数えていた夜の中で、隣から聞こえた声を拾う',
      image: '/media/images/rise-again/RA-G05_v01.png',
    },
    {
      id: 'yuto',
      name: 'YUTO',
      role: 'Dance & Rap',
      keyword: 'MORNING & LACES',
      quote: '上手く笑えない朝に、昨日より少し重い足で靴紐を結び直す',
      image: '/media/images/rise-again/RA-G06_v01.png',
    },
  ];

  return (
    <div style={{ backgroundColor: '#080A0F', color: '#F6F3ED', minHeight: '100vh', position: 'relative' }}>
      {/* Background Vertical Ambient Lines */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.12 }}>
        <div style={{ position: 'absolute', left: '10%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent, #55A8FF, transparent)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(246,243,237,0.3), transparent)' }} />
        <div style={{ position: 'absolute', right: '10%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent, #55A8FF, transparent)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '90px' }}>
        
        {/* SECTION 01: HERO */}
        <section
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '60px 24px',
            overflow: 'hidden',
            backgroundColor: '#080A0F',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <ResponsivePicture
              desktopSrc="/media/images/rise-again/RA-H01_v01.png"
              mobileSrc="/media/images/rise-again/RA-H02_v01.png"
              alt="IGNITE 6th Single RISE AGAIN Hero Visual"
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to top, #080A0F 0%, rgba(8, 10, 15, 0.4) 50%, transparent 100%)',
              }}
            />
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              maxWidth: '850px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#55A8FF', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
              {campaign.eyebrow || 'SPECIAL CAMPAIGN / 6TH SINGLE'}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 9vw, 6.5rem)', color: '#F6F3ED', letterSpacing: '0.08em', margin: 0, lineHeight: 1 }}>
              RISE AGAIN
            </h1>
            <div style={{ width: '50px', height: '2px', background: '#55A8FF', margin: '8px 0' }} />
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: '#55A8FF', letterSpacing: '0.12em', margin: 0, fontWeight: 600 }}>
              {campaign.catchCopy || 'まだ終わってない。何度でも、ここからだ。'}
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => playTrack('rise-again-title')}
                className="btn-primary"
                style={{ backgroundColor: '#55A8FF', color: '#080A0F', borderColor: '#55A8FF', fontWeight: 700, padding: '14px 28px' }}
              >
                LISTEN TITLE TRACK ▶
              </button>
              <Link
                to="/discography/rise-again/"
                className="btn-secondary"
                style={{ borderColor: 'var(--color-border)', color: '#F6F3ED', padding: '14px 28px' }}
              >
                VIEW DISCOGRAPHY ➔
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 02: CAMPAIGN STATEMENT */}
        <section style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <FiveLights height={20} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#55A8FF', letterSpacing: '0.2em', display: 'block', marginTop: '12px', textTransform: 'uppercase' }}>
            CAMPAIGN STATEMENT
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#F6F3ED', margin: '16px 0 32px', lineHeight: 1.4 }}>
            不完全な再出発。傷ついたまま、迷ったまま、もう一度同じ場所へ。
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(24px, 5vw, 40px)', borderRadius: '4px', lineHeight: 1.8, fontSize: '1.05rem', color: '#DCE6F5' }}>
            <p style={{ margin: 0 }}>
              2024年3月、IGNITEは6th Single『RISE AGAIN』をリリースする。
            </p>
            <p style={{ margin: 0 }}>
              タイトルだけを見れば、力強い再起のアンセムだ。けれど、この曲が見つめているのは、勝利の瞬間でも、迷いを振り切った後の姿でもない。
            </p>
            <p style={{ margin: 0, fontWeight: 700, color: '#55A8FF', borderLeft: '3px solid #55A8FF', paddingLeft: '16px' }}>
              傷ついたまま。迷ったまま。昨日より少し重い足で、それでももう一度、同じ場所へ向かうこと。
            </p>
            <p style={{ margin: 0 }}>
              『RISE AGAIN』が歌うのは、そんな不完全な再出発だ。誰か一人が四人を救うのではない。全員が同じ強さを持つ必要もない。それぞれが違う場所で立ち止まり、それでも同じステージへ戻ってくる。
            </p>
          </div>
        </section>

        {/* SECTION 03: VISUAL CONCEPT & ARTIST GALLERY */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#55A8FF', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              VISUAL CONCEPT & ARTIST GALLERY
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#F6F3ED', margin: '12px 0' }}>
              暗青から白金へ――傷や影を照らしながら朝へ近づく
            </h2>
            <p style={{ color: '#AEB6C4', maxWidth: '700px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
              RISE AGAIN期のビジュアルは、完成された復活ではなく、膝をついた姿から立ち上がる直前、身体を起こしている途中の姿を切り取っている。
            </p>
          </div>

          {/* Group Photo */}
          <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: '40px' }}>
            <ResponsivePicture desktopSrc="/media/images/rise-again/RA-G01_v01.png" mobileSrc="/media/images/rise-again/RA-G01_v01.png" alt="IGNITE RISE AGAIN Group Artist Photo" aspectRatio="16:9" />
          </div>

          {/* 5 Members Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {members.map((m) => (
              <div key={m.id} style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <ResponsivePicture desktopSrc={m.image} mobileSrc={m.image} alt={`${m.name} Artist Photo`} aspectRatio="3:4" />
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#55A8FF' }}>{m.keyword}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: 0, color: '#F6F3ED' }}>{m.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#AEB6C4' }}>{m.role}</span>
                  <p style={{ fontSize: '0.85rem', color: '#DCE6F5', margin: '8px 0 0', lineHeight: 1.5, fontStyle: 'italic', flex: 1 }}>
                    “{m.quote}”
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 04: 3 TRACKS SPECIFICATION */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#55A8FF', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              6TH SINGLE TRACKLIST
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#F6F3ED', margin: '12px 0' }}>
              三曲で描く、「続ける」ということ
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Track 01 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '4px', alignItems: 'center' }}>
              <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <ResponsivePicture desktopSrc="/media/images/rise-again/RA-C02_v01.png" mobileSrc="/media/images/rise-again/RA-C02_v01.png" alt="RISE AGAIN Song Detail Image" aspectRatio="1:1" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#55A8FF', fontWeight: 600 }}>TRACK 01 // TITLE TRACK</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: 0, color: '#F6F3ED' }}>RISE AGAIN</h3>
                <p style={{ color: '#DCE6F5', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                  傷ついたまま、迷ったまま。それでももう一度靴紐を結び直してステージへ戻る不完全な再出発のアンセム。五人の声と合唱が胸を打つ。
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => playTrack('rise-again-title')} className="btn-primary" style={{ backgroundColor: '#55A8FF', color: '#080A0F', borderColor: '#55A8FF', fontWeight: 700 }}>
                    LISTEN TRACK ▶
                  </button>
                  <Link to="/discography/rise-again/#tracks" className="btn-secondary" style={{ borderColor: 'var(--color-border)', color: '#F6F3ED' }}>
                    VIEW LYRICS & DETAILS
                  </Link>
                </div>
              </div>
            </div>

            {/* Track 02 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '4px', alignItems: 'center' }}>
              <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <ResponsivePicture desktopSrc="/media/images/rise-again/RA-C03_v01.png" mobileSrc="/media/images/rise-again/RA-C03_v01.png" alt="Keep the Flame Song Detail Image" aspectRatio="1:1" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#55A8FF', fontWeight: 600 }}>TRACK 02 // C/W TRACK</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: 0, color: '#F6F3ED' }}>Keep the Flame</h3>
                <p style={{ color: '#DCE6F5', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                  立ち上がったあとに残る小さな火。迷いが戻ってきても完全には消さずに守っておく火種。前へ進み続けることだけではなく、“消さないこと”もまた意志なのだと静かに示す。
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => playTrack('rise-again-keep-the-flame')} className="btn-primary" style={{ backgroundColor: '#55A8FF', color: '#080A0F', borderColor: '#55A8FF', fontWeight: 700 }}>
                    LISTEN TRACK ▶
                  </button>
                  <Link to="/discography/rise-again/#tracks" className="btn-secondary" style={{ borderColor: 'var(--color-border)', color: '#F6F3ED' }}>
                    VIEW LYRICS & DETAILS
                  </Link>
                </div>
              </div>
            </div>

            {/* Track 03 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '4px', alignItems: 'center' }}>
              <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <ResponsivePicture desktopSrc="/media/images/rise-again/RA-C04_v01.png" mobileSrc="/media/images/rise-again/RA-C04_v01.png" alt="Afterglow - Live Version - Song Detail Image" aspectRatio="1:1" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#55A8FF', fontWeight: 600 }}>TRACK 03 // LIVE TRACK</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: 0, color: '#F6F3ED' }}>Afterglow - Live Version -</h3>
                <p style={{ color: '#DCE6F5', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                  ステージが終わったあとに残る熱へ視点が移る。後に『EQUINOX』へ収録されるスタジオ版に先行して記録されたLive Version。LEOの柔らかな声、客席の光、会場の呼吸。
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => playTrack('rise-again-afterglow-live')} className="btn-primary" style={{ backgroundColor: '#55A8FF', color: '#080A0F', borderColor: '#55A8FF', fontWeight: 700 }}>
                    LISTEN TRACK ▶
                  </button>
                  <Link to="/discography/rise-again/#tracks" className="btn-secondary" style={{ borderColor: 'var(--color-border)', color: '#F6F3ED' }}>
                    VIEW LYRICS & DETAILS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 05: SILENT SIGNAL -> RISE AGAIN TRANSITION */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', width: '100%', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'rgba(85, 168, 255, 0.04)', border: '1px solid #55A8FF', padding: 'clamp(24px, 5vw, 40px)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#55A8FF', letterSpacing: '0.2em' }}>
              TRANSITION // SILENT SIGNAL ➔ RISE AGAIN
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', color: '#F6F3ED', margin: 0 }}>
              『Silent Signal』の静寂から、声が重なる場所へ
            </h3>
            <p style={{ color: '#DCE6F5', lineHeight: 1.8, fontSize: '1rem', margin: 0 }}>
              前作『Silent Signal』でIGNITEは言葉を極限まで減らし、視線や呼吸や靴音など身体そのものに作品を預けた。『RISE AGAIN』はその静寂の次にある。いきなりすべてが解決するわけではない。静寂の中で残った緊張や迷いを抱えたまま、もう一度身体を起こし、声を出し、客席へ向かって手を伸ばす。
            </p>
          </div>
        </section>

        {/* SECTION 06: FEATURE ARTICLE CTA */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', padding: '32px', alignItems: 'center' }}>
            <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <ResponsivePicture desktopSrc="/media/images/rise-again/RA-ARH01_v01.png" mobileSrc="/media/images/rise-again/RA-ARH01_v01.png" alt="RISE AGAIN Feature Article Hero" aspectRatio="3:2" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#55A8FF', letterSpacing: '0.15em', fontWeight: 600 }}>
                SPECIAL FEATURE / 6TH SINGLE INTERVIEW
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#F6F3ED', margin: 0, lineHeight: 1.4 }}>
                立ち上がることは、戻ることじゃない。IGNITE『RISE AGAIN』が描く、“再起”のかたち
              </h3>
              <p style={{ color: '#AEB6C4', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                格好よく勝つことよりも、迷ったまま立ち上がること。SHOとKAIが語る、制作の背景と五人の関係性。
              </p>
              <Link to="/features/rise-again-feature/" className="btn-primary" style={{ backgroundColor: '#55A8FF', color: '#080A0F', borderColor: '#55A8FF', fontWeight: 700, width: 'fit-content', marginTop: '8px' }}>
                READ FEATURE INTERVIEW ➔
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 07: CLOSING & ARCHIVE CTA */}
        <section style={{ maxWidth: '800px', margin: '0 auto 40px', padding: '0 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <FiveLights height={20} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', color: '#F6F3ED', margin: 0 }}>
            まだ終わっていない。だから、ここからまた始められる。
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/discography/rise-again/" className="btn-primary" style={{ backgroundColor: '#55A8FF', color: '#080A0F', borderColor: '#55A8FF', fontWeight: 700 }}>
              VIEW DISCOGRAPHY ➔
            </Link>
            <Link to="/campaigns/" className="btn-secondary" style={{ borderColor: 'var(--color-border)', color: '#F6F3ED' }}>
              VIEW CAMPAIGN ARCHIVE ➔
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
