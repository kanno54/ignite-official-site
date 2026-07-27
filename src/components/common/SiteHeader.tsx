import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiveLights } from './FiveLights';
import { useAudio } from '../audio/AudioProvider';
import { EqualizerBars } from '../audio/EqualizerBars';

export const SiteHeader: React.FC = () => {
  const location = useLocation();
  const { playerState, toggleExpand } = useAudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'MEMBERS', path: '/members/' },
    { label: 'DISCOGRAPHY', path: '/discography/' },
    { label: 'FEATURES', path: '/features/' },
    { label: 'STORY', path: '/story/' },
    { label: 'FUN & PASS', path: '/fun/' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        backgroundColor: '#080A0F',
        borderBottom: '1px solid var(--color-border)',
        zIndex: 1500,
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-shell)',
          margin: '0 auto',
          height: '100%',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Brand Logo & Five Lights */}
        <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiveLights height={22} gap={4} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem',
              letterSpacing: '0.1em',
              fontWeight: 900,
              color: '#F6F3ED',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #AEB6C4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            IGNITE
          </span>
          <span className="campaign-tag brand-tag-mobile-hide" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
            NO LIMITS
          </span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav style={{ display: 'flex', gap: '32px' }} className="desktop-nav">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  letterSpacing: '0.08em',
                  color: active ? 'var(--campaign-accent)' : 'var(--color-text)',
                  position: 'relative',
                  padding: '6px 0',
                  transition: 'color 0.2s ease',
                }}
              >
                {item.label}
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: 'var(--campaign-accent)',
                      boxShadow: '0 0 8px var(--campaign-accent)',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Now Playing Indicator & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {playerState.currentRecording && (
            <button
              onClick={toggleExpand}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--campaign-accent)',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
              title="Now Playing — Click to expand player"
            >
              <EqualizerBars isPlaying={playerState.isPlaying} height={14} barWidth={2} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--campaign-accent)' }}>
                NOW PLAYING
              </span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              padding: '8px 14px',
              backgroundColor: mobileMenuOpen ? 'var(--campaign-accent)' : 'var(--color-surface)',
              border: mobileMenuOpen ? '1px solid var(--campaign-accent)' : '1px solid var(--color-border)',
              borderRadius: '2px',
              color: mobileMenuOpen ? 'var(--campaign-on-accent)' : '#F6F3ED',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? 'CLOSE ✕' : 'MENU ☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu — 100% Solid Opaque Background */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#080A0F',
            padding: '32px 24px 60px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 2500,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div style={{ marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--campaign-accent)', letterSpacing: '0.1em' }}>
              NAVIGATION MENU
            </span>
            <FiveLights height={14} />
          </div>

          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.6rem',
                  letterSpacing: '0.08em',
                  color: active ? 'var(--campaign-accent)' : '#FFFFFF',
                  backgroundColor: active ? 'var(--color-surface)' : 'transparent',
                  borderLeft: active ? '4px solid var(--campaign-accent)' : '4px solid transparent',
                  padding: '14px 16px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <span>{item.label}</span>
                <span style={{ fontSize: '1rem', color: active ? 'var(--campaign-accent)' : '#AEB6C4' }}>➔</span>
              </Link>
            );
          })}

          <div style={{ marginTop: 'auto', paddingTop: '32px', textAlign: 'center' }}>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                color: '#F6F3ED',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                borderRadius: '2px',
              }}
            >
              CLOSE MENU ✕
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-block !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};
