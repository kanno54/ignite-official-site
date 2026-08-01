import React from 'react';
import { Link } from 'react-router-dom';
import { FiveLights } from './FiveLights';

export const SiteFooter: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#080A0F',
        borderTop: '1px solid var(--color-border)',
        padding: '60px 24px 100px', // Extra bottom padding for docked MiniPlayer
        color: 'var(--color-text-muted)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-shell)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
        }}
      >
        {/* Top Footer Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '32px',
          }}
        >
          {/* Brand Intro */}
          <div style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <FiveLights height={20} />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  color: '#F6F3ED',
                  letterSpacing: '0.1em',
                }}
              >
                IGNITE
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                color: '#AEB6C4',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              We don’t just perform. We burn.
              <br />
              ただ演じるのではない。自分たち自身を燃やして、舞台に立つ。
            </p>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', color: '#F6F3ED', fontSize: '1.1rem', margin: '0 0 12px' }}>
                ARCHIVE
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <li><Link to="/members/" style={{ color: '#AEB6C4' }}>MEMBERS</Link></li>
                <li><Link to="/discography/" style={{ color: '#AEB6C4' }}>DISCOGRAPHY</Link></li>
                <li><Link to="/features/" style={{ color: '#AEB6C4' }}>FEATURES</Link></li>
                <li><Link to="/story/" style={{ color: '#AEB6C4' }}>STORY & TIMELINE</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', color: '#F6F3ED', fontSize: '1.1rem', margin: '0 0 12px' }}>
                INTERACTIVE
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <li><Link to="/fun/" style={{ color: '#AEB6C4' }}>IGNITE JUKEBOX</Link></li>
                <li><Link to="/fun/" style={{ color: '#AEB6C4' }}>EMBER DIGITAL PASS</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', color: '#F6F3ED', fontSize: '1.1rem', margin: '0 0 12px' }}>
                LEGAL & ACCESSIBILITY
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <li><Link to="/privacy/" style={{ color: '#AEB6C4' }}>PRIVACY POLICY</Link></li>
                <li><Link to="/accessibility/" style={{ color: '#AEB6C4' }}>ACCESSIBILITY</Link></li>
                <li>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('ignite:open-analytics-consent'));
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#AEB6C4',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                  >
                    ANALYTICS SETTINGS (アクセス解析設定)
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--color-border)', margin: 0 }} />

        {/* Bottom Legal & Disclaimer */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: '#717D96',
          }}
        >
          <div>IGNITE Official Management / Fictional Group Production</div>
          <div>This is a fictional creative project created for demonstration and artistic storytelling.</div>
          <div>© 2020–2023 IGNITE Project. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};
