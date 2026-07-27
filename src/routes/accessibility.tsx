import React from 'react';
import { FiveLights } from '../components/common/FiveLights';

export const AccessibilityPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 'var(--article-content)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <FiveLights height={18} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', margin: '8px 0', color: '#F6F3ED' }}>
          ACCESSIBILITY STATEMENT
        </h1>
        <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--campaign-accent)' }}>
          Target: WCAG 2.2 Level AA
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '32px', borderRadius: '2px', lineHeight: 1.8, color: '#F6F3ED' }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', color: 'var(--campaign-accent)' }}>アクセシビリティへの取り組み</h3>
        <p>IGNITE Official Portal は、すべてのファンが快適かつ安全に音楽とストーリーにアクセスできるよう、WCAG 2.2 AA基準に準拠した設計を行っています。</p>

        <ul style={{ paddingLeft: '20px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <li><strong>キーボード操作対応:</strong> 音楽プレイヤー、フォーム、ドロワーメニューの全機能をキーボードのみで操作可能。</li>
          <li><strong>明確なフォーカス表示:</strong> フォーカス状態（:focus-visible）を視覚的に明瞭に提示。</li>
          <li><strong>音声自動再生の排除:</strong> すべての音源はユーザーの明示的な操作によってのみ再生を開始。</li>
          <li><strong>視覚効果の抑制 (Reduced Motion):</strong> OSの視覚効果抑制設定（prefers-reduced-motion）を尊重し、不要なアニメーションを停止。</li>
          <li><strong>十分なコントラスト:</strong> 黒背景とテキスト・トークンカラー間で4.5:1以上のコントラスト比を確保。</li>
        </ul>
      </div>
    </div>
  );
};
