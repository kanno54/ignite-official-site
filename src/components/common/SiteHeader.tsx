import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiveLights } from './FiveLights';
import { useAudio } from '../audio/AudioProvider';
import { EqualizerBars } from '../audio/EqualizerBars';
import { getCurrentCampaign, getLiveArchives } from '../../utils/contentLoader';

export const SiteHeader: React.FC = () => {
  const location = useLocation();
  const { playerState, toggleExpand } = useAudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentCampaign = getCurrentCampaign();
  const hasLiveArchives = getLiveArchives().length > 0;

  const navItems = [
    { label: 'MEMBERS', path: '/members/' },
    { label: 'DISCOGRAPHY', path: '/discography/' },
    ...(hasLiveArchives ? [{ label: 'LIVE', path: '/live/' }] : []),
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
        {/* Left: Brand Logo & Current Campaign Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
            aria-label="IGNITE Official Site Top Page"
          >
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
          </Link>

          {currentCampaign && (
            <Link
              to={`/campaigns/${currentCampaign.slug || currentCampaign.id}/`}
              onClick={() => setMobileMenuOpen(false)}
              className="campaign-tag brand-tag-mobile-hide"
              style={{
                fontSize: '0.65rem',
                padding: '3px 8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              aria-label={`CURRENT CAMPAIGN: ${currentCampaign.title.toUpperCase()}`}
              {...(location.pathname === `/campaigns/${currentCampaign.slug || currentCampaign.id}/` ? { 'aria-current': 'page' } : {})}
            >
              {currentCampaign.shortTitle || currentCampaign.title}
            </Link>
          )}
        </div>

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

      {/* Full-screen Mobile Drawer Overlay — 100% Solid Opaque #080A0F */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#080A0F',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Top Bar inside Overlay */}
          <div
            style={{
              height: '70px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: '#080A0F',
              flexShrink: 0,
            }}
          >
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiveLights height={22} gap={4} />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  letterSpacing: '0.1em',
                  fontWeight: 900,
                  color: '#F6F3ED',
                }}
              >
                IGNITE
              </span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--campaign-accent)',
                border: '1px solid var(--campaign-accent)',
                borderRadius: '2px',
                color: 'var(--campaign-on-accent)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              CLOSE ✕
            </button>
          </div>

          {/* Navigation Items */}
          <div
            style={{
              flex: 1,
              padding: '32px 24px 60px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: '#080A0F',
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
                    padding: '16px 20px',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <span>{item.label}</span>
                  <span style={{ fontSize: '1.1rem', color: active ? 'var(--campaign-accent)' : '#AEB6C4' }}>➔</span>
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
        </div>
      )}

      {/* Mobile Current Campaign Bar */}
      {currentCampaign && (
        <div className="mobile-campaign-bar-container">
          <Link
            to={`/campaigns/${currentCampaign.slug || currentCampaign.id}/`}
            className="mobile-campaign-bar"
            aria-label={`現在のキャンペーン ${currentCampaign.title} へ移動`}
            {...(location.pathname === `/campaigns/${currentCampaign.slug || currentCampaign.id}/` ? { 'aria-current': 'page' } : {})}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', minWidth: 0 }}>
              <span className="mobile-campaign-bar-label">CURRENT CAMPAIGN</span>
              <span className="mobile-campaign-bar-title">{currentCampaign.shortTitle || currentCampaign.title}</span>
            </div>
            <span className="mobile-campaign-bar-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-block !important; }
          .mobile-campaign-bar-container { display: block !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-campaign-bar-container { display: none !important; }
        }
      `}</style>
    </header>
  );
};
