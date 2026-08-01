import React, { useState, useEffect } from 'react';
import { getAnalyticsConsent, setAnalyticsConsent, isAnalyticsEnabledEnv, ConsentStatus } from '../../utils/analytics';
import { Link } from 'react-router-dom';

export const ConsentBanner: React.FC = () => {
  const [consent, setConsent] = useState<ConsentStatus>('unset');
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    setConsent(getAnalyticsConsent());

    const handleOpenSettings = () => {
      setForceShow(true);
    };

    window.addEventListener('ignite:open-analytics-consent', handleOpenSettings);
    return () => {
      window.removeEventListener('ignite:open-analytics-consent', handleOpenSettings);
    };
  }, []);

  const handleAllow = () => {
    setAnalyticsConsent('granted');
    setConsent('granted');
    setForceShow(false);
  };

  const handleDeny = () => {
    setAnalyticsConsent('denied');
    setConsent('denied');
    setForceShow(false);
  };

  // Do not render if analytics environment is disabled or if consent is already set and not forced open
  if (!isAnalyticsEnabledEnv() && !forceShow) return null;
  if (consent !== 'unset' && !forceShow) return null;

  return (
    <div
      role="region"
      aria-label="アクセス解析同意設定"
      style={{
        position: 'fixed',
        bottom: '80px', // Floating safely above docked mini-player
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '720px',
        backgroundColor: '#0F1522',
        border: '1px solid var(--campaign-accent)',
        borderRadius: '4px',
        padding: '20px 24px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
        zIndex: 9999,
        color: '#F6F3ED',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', margin: 0, color: '#F6F3ED', letterSpacing: '0.05em' }}>
            アクセス解析について
          </h4>
          {consent !== 'unset' && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--campaign-accent)', fontWeight: 700 }}>
              現在の設定: {consent === 'granted' ? '許可中' : '拒否中'}
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.85rem', color: '#AEB6C4', lineHeight: 1.5, margin: 0 }}>
          サイト改善のため、Google Analyticsを利用します。
          同意した場合のみ、アクセス状況の計測を開始します。
          詳細は<Link to="/privacy/" style={{ color: 'var(--campaign-accent)', textDecoration: 'underline' }}>プライバシーポリシー</Link>をご覧ください。
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          onClick={handleAllow}
          className="btn-primary"
          style={{
            padding: '10px 20px',
            fontSize: '0.85rem',
            backgroundColor: 'var(--campaign-accent)',
            color: '#080A0F',
            fontWeight: 700,
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
        >
          アクセス解析を許可
        </button>
        <button
          onClick={handleDeny}
          className="btn-secondary"
          style={{
            padding: '10px 20px',
            fontSize: '0.85rem',
            backgroundColor: 'transparent',
            color: '#F6F3ED',
            border: '1px solid var(--color-border)',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
        >
          許可せず続ける
        </button>
      </div>
    </div>
  );
};

export const openAnalyticsConsentModal = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ignite:open-analytics-consent'));
  }
};
