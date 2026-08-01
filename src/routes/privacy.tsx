import React, { useState, useEffect } from 'react';
import { FiveLights } from '../components/common/FiveLights';
import { getAnalyticsConsent, setAnalyticsConsent, ConsentStatus } from '../utils/analytics';

export const PrivacyPage: React.FC = () => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('unset');

  useEffect(() => {
    setConsentStatus(getAnalyticsConsent());
  }, []);

  const handleToggleConsent = (newStatus: 'granted' | 'denied') => {
    setAnalyticsConsent(newStatus);
    setConsentStatus(newStatus);
  };

  return (
    <div style={{ maxWidth: 'var(--article-content)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <FiveLights height={18} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', margin: '8px 0', color: '#F6F3ED' }}>
          PRIVACY POLICY
        </h1>
        <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--campaign-accent)' }}>
          最終更新: 2026年8月
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '32px', borderRadius: '2px', lineHeight: 1.8, color: '#F6F3ED' }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', color: 'var(--campaign-accent)' }}>1. 個人情報の取り扱いについて</h3>
        <p>本サイト（IGNITE Official Site）は、コンテンツの閲覧にあたりユーザーの氏名、メールアドレス等の個人情報を直接入力・収集することはありません。</p>

        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', color: 'var(--campaign-accent)', marginTop: '24px' }}>2. EMBER DIGITAL PASS の入力データ</h3>
        <p>「EMBER DIGITAL PASS」生成機能において入力されたお名前（Display Name）および選択設定は、お使いの端末（ブラウザの LocalStorage）内でのみ保持され、外部サーバーへ送信・蓄積されることはありません。</p>

        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', color: 'var(--campaign-accent)', marginTop: '24px' }}>3. 音声およびコンテンツの利用権</h3>
        <p>掲載されている楽曲、歌詞、画像、文章の権利はプロジェクト権利者に帰属します。無断転載・複製を禁止いたします。</p>

        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', color: 'var(--campaign-accent)', marginTop: '24px' }}>4. Google Analytics およびアクセス解析について</h3>
        <p>本サイトでは、本番環境においてウェブサイトの改善および利用状況の把握を目的として、Google tag（gtag.js）による Google Analytics 4（GA4）を利用しています。</p>
        <p>計測は閲覧者が「アクセス解析を許可」を選択した場合にのみ行われ、ファーストパーティ Cookie を使用して閲覧ページ、利用環境、参照元、操作イベント等の匿名のトラフィックデータを送信・収集します。個人を特定する情報（氏名、メールアドレス等）は送信されません。</p>
        <p style={{ fontSize: '0.9rem', color: '#AEB6C4' }}>
          ※ Google Analytics によるデータの取扱いについては、<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--campaign-accent)', textDecoration: 'underline' }}>Googleのプライバシーポリシー</a>をご参照ください。
        </p>

        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#F6F3ED', margin: '0 0 8px' }}>アクセス解析の設定変更</h4>
          <p style={{ fontSize: '0.85rem', color: '#AEB6C4', margin: '0 0 12px' }}>
            現在の状態: <strong style={{ color: consentStatus === 'granted' ? 'var(--campaign-accent)' : consentStatus === 'denied' ? '#D62839' : '#AEB6C4' }}>
              {consentStatus === 'granted' ? '● 許可中 (Granted)' : consentStatus === 'denied' ? '✕ 拒否中 (Denied)' : '未設定 (Unset)'}
            </strong>
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleToggleConsent('granted')}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              アクセス解析を許可する
            </button>
            <button
              onClick={() => handleToggleConsent('denied')}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              アクセス解析を拒否する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
