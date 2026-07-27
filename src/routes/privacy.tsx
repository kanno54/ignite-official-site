import React from 'react';
import { FiveLights } from '../components/common/FiveLights';

export const PrivacyPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 'var(--article-content)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <FiveLights height={18} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', margin: '8px 0', color: '#F6F3ED' }}>
          PRIVACY POLICY
        </h1>
        <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--campaign-accent)' }}>
          最終更新: 2022年9月
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '32px', borderRadius: '2px', lineHeight: 1.8, color: '#F6F3ED' }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', color: 'var(--campaign-accent)' }}>1. 個人情報の取り扱いについて</h3>
        <p>本サイト（IGNITE Official Portal）は、架空のクリエイティブプロジェクトとして提供される静的ウェブサイトです。初期公開版においてCookieを用いたトラッキングやユーザーの個人情報のサーバー収集は行っておりません。</p>

        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', color: 'var(--campaign-accent)', marginTop: '24px' }}>2. EMBER DIGITAL PASS の入力データ</h3>
        <p>「EMBER DIGITAL PASS」生成機能において入力されたお名前（Display Name）および選択設定は、お使いの端末（ブラウザの LocalStorage）内でのみ保持され、外部サーバーへ送信・蓄積されることはありません。</p>

        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', color: 'var(--campaign-accent)', marginTop: '24px' }}>3. 音声およびコンテンツの利用権</h3>
        <p>掲載されている楽曲、歌詞、画像、文章の権利はプロジェクト権利者に帰属します。無断転載・複製を禁止いたします。</p>
      </div>
    </div>
  );
};
