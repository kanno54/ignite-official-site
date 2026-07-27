import React from 'react';
import { Link } from 'react-router-dom';
import { FiveLights } from '../components/common/FiveLights';

export const StoryPage: React.FC = () => {
  const timelineEvents = [
    {
      date: '2020.10',
      era: 'FIRESTARTER ERA',
      title: 'インディーズ始動 & 1st Mini Album『FIRESTARTER』リリース',
      description: '架空の5人（KAI, SHO, LEO, REN, YUTO）が集結。自分たちの足で立った原点であり、小規模ライブハウスからの熱狂がスタート。',
      link: '/discography/firestarter/',
    },
    {
      date: '2021.07',
      era: 'IGNITION ERA',
      title: 'メジャーデビュー Single『IGNITION』リリース',
      description: '暗闇を切り裂く烈火のような重厚ビートと圧倒的ダンスパフォーマンスでメジャーシーンに覚悟を提示。全国のファン（EMBER）へ飛び火。',
      link: '/discography/ignition/',
    },
    {
      date: '2021.10',
      era: 'BURN IT DOWN ERA',
      title: '2nd Single『BURN IT DOWN』リリース & 東名阪クアトロツアー',
      description: '自らの装飾を燃やし尽くしパフォーマンスの本質へ。SHOが振付を本格主導し、ソリッドな群舞スタイルを確立。',
      link: '/discography/burn-it-down/',
    },
    {
      date: '2022.09',
      era: 'NO LIMITS ERA (CURRENT)',
      title: '3rd Single『No Limits』リリース — スカイブルーの地平へ',
      description: '炎の熱を保ったまま、青空と風が舞う大会場へと視界を開く。YUTOの最高音サビフィーチャーが大きな話題を呼ぶ最高到達点。',
      link: '/discography/no-limits/',
    },
  ];

  return (
    <div style={{ maxWidth: 'var(--article-content)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '50px' }}>
      <div>
        <FiveLights height={20} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', margin: '8px 0', color: '#F6F3ED' }}>
          OFFICIAL STORY & TIMELINE
        </h1>
        <p style={{ fontSize: '1rem', color: '#AEB6C4', lineHeight: 1.6, margin: 0 }}>
          2020年10月のインディーズ結成から2022年9月『No Limits』リリースまでの公式年表。
        </p>
      </div>

      {/* Timeline Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '19px', width: '2px', backgroundColor: 'var(--color-border)', zIndex: 0 }} />

        {timelineEvents.map((ev, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '24px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: ev.era.includes('CURRENT') ? 'var(--campaign-accent)' : 'var(--color-surface-elevated)',
                border: '2px solid var(--campaign-accent)',
                color: ev.era.includes('CURRENT') ? 'var(--campaign-on-accent)' : '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              0{idx + 1}
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: 'var(--color-surface)',
                border: ev.era.includes('CURRENT') ? '1px solid var(--campaign-accent)' : '1px solid var(--color-border)',
                padding: '24px',
                borderRadius: '2px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--campaign-accent)', fontWeight: 600 }}>
                  {ev.date} // {ev.era}
                </span>
                <Link to={ev.link} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#AEB6C4' }}>
                  VIEW RELEASE ➔
                </Link>
              </div>

              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 700, margin: '8px 0', color: '#F6F3ED' }}>
                {ev.title}
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#AEB6C4', lineHeight: 1.6, margin: 0 }}>
                {ev.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* External Archive Links */}
      <section style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', padding: '32px', borderRadius: '2px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#F6F3ED', margin: '0 0 12px' }}>
          EXTERNAL STORY ARCHIVE
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#AEB6C4', lineHeight: 1.6, marginBottom: '20px' }}>
          公式短編・小説作品は外部掲載サイトにてお楽しみいただけます。（※外部リンクは別タブで開きます）
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <a
            href="https://pixiv.net"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--campaign-accent)' }}>PIXIV ARCHIVE ↗</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#F6F3ED' }}>公式ストーリーアーカイブ（pixiv）</span>
            <span style={{ fontSize: '0.8rem', color: '#AEB6C4' }}>メンバーの日常とライブ前夜を描いた公式Short Novel集</span>
          </a>
        </div>
      </section>
    </div>
  );
};
