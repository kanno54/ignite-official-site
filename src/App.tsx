import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AudioProvider } from './components/audio/AudioProvider';
import { SiteHeader } from './components/common/SiteHeader';
import { SiteFooter } from './components/common/SiteFooter';
import { MiniPlayer } from './components/audio/MiniPlayer';
import { ExpandedPlayer } from './components/audio/ExpandedPlayer';

import { TopPage } from './routes/_index';
import { MembersIndex } from './routes/members._index';
import { MemberDetailPage } from './routes/members.$slug';
import { DiscographyIndex } from './routes/discography._index';
import { ReleaseDetailPage } from './routes/discography.$slug';
import { FeaturesIndex } from './routes/features._index';
import { ArticleDetailPage } from './routes/features.$slug';
import { StoryPage } from './routes/story';
import { CampaignsIndex } from './routes/campaigns._index';
import { CampaignDetailPage } from './routes/campaigns.$id';
import { FunPage } from './routes/fun';
import { PrivacyPage } from './routes/privacy';
import { AccessibilityPage } from './routes/accessibility';
import { NotFoundPage } from './routes/404';
import { getCurrentCampaign, isStagingEnv } from './utils/contentLoader';
import { ConsentBanner } from './components/common/ConsentBanner';
import { loadGoogleTag, sendPageViewEvent, trackScrollDepth, getAnalyticsConsent, isAnalyticsEnabledEnv, ConsentStatus } from './utils/analytics';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnalyticsTracker: React.FC = () => {
  const { pathname } = useLocation();
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(() => getAnalyticsConsent());

  useEffect(() => {
    const handleConsentChange = () => {
      setConsentStatus(getAnalyticsConsent());
    };
    window.addEventListener('ignite:analytics-consent-changed', handleConsentChange);
    return () => {
      window.removeEventListener('ignite:analytics-consent-changed', handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (!isAnalyticsEnabledEnv() || consentStatus !== 'granted') return;

    loadGoogleTag();

    let page_type = 'general';
    let content_id: string | undefined = undefined;
    let campaign_id: string | undefined = undefined;
    let release_id: string | undefined = undefined;

    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) {
      page_type = 'home';
    } else if (parts[0] === 'campaigns') {
      page_type = 'campaign';
      content_id = parts[1] || 'archive';
      campaign_id = parts[1];
    } else if (parts[0] === 'features') {
      page_type = 'feature';
      content_id = parts[1] || 'index';
    } else if (parts[0] === 'discography') {
      page_type = 'discography';
      content_id = parts[1] || 'index';
      release_id = parts[1];
    } else if (parts[0] === 'members') {
      page_type = 'member';
      content_id = parts[1] || 'index';
    } else if (parts[0] === 'story') {
      page_type = 'story';
    } else if (parts[0] === 'fun') {
      page_type = 'fun';
    } else if (parts[0] === 'privacy') {
      page_type = 'privacy';
    }

    sendPageViewEvent({
      page_location: window.location.href,
      page_title: document.title,
      page_type,
      content_id,
      campaign_id,
      release_id,
    });

    const trackedMilestones = { 25: false, 50: false, 75: false, 90: false };

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercent = (window.scrollY / scrollHeight) * 100;

      const milestones: (25 | 50 | 75 | 90)[] = [25, 50, 75, 90];
      for (const m of milestones) {
        if (scrollPercent >= m && !trackedMilestones[m]) {
          trackedMilestones[m] = true;
          trackScrollDepth({
            percent_scrolled: m,
            page_type,
            content_id,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, consentStatus]);

  return <ConsentBanner />;
};

export const App: React.FC = () => {
  const location = useLocation();
  const currentCampaign = getCurrentCampaign();
  const isStaging = isStagingEnv();

  return (
    <AudioProvider>
      <ScrollToTop />
      <AnalyticsTracker />
      <div className="app-container" data-campaign={currentCampaign.id}>
        {isStaging && (
          <div
            style={{
              backgroundColor: '#D62839',
              color: '#FFFFFF',
              textAlign: 'center',
              padding: '6px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              zIndex: 100000,
              position: 'relative',
            }}
          >
            [STAGING ENVIRONMENT — MOONLIT PRE-RELEASE PREVIEW]
          </div>
        )}
        <SiteHeader />
        
        <main className="main-content">
          <div key={location.pathname} className="page-transition">
            <Routes>
              <Route path="/" element={<TopPage />} />
              <Route path="/members/" element={<MembersIndex />} />
              <Route path="/members/:slug/" element={<MemberDetailPage />} />
              <Route path="/discography/" element={<DiscographyIndex />} />
              <Route path="/discography/:slug/" element={<ReleaseDetailPage />} />
              <Route path="/features/" element={<FeaturesIndex />} />
              <Route path="/features/:slug/" element={<ArticleDetailPage />} />
              <Route path="/campaigns/" element={<CampaignsIndex />} />
              <Route path="/campaigns/:id/" element={<CampaignDetailPage />} />
              <Route path="/story/" element={<StoryPage />} />
              <Route path="/fun/" element={<FunPage />} />
              <Route path="/privacy/" element={<PrivacyPage />} />
              <Route path="/accessibility/" element={<AccessibilityPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>

        <MiniPlayer />
        <ExpandedPlayer />
        <SiteFooter />
      </div>
    </AudioProvider>
  );
};
