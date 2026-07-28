import React, { useEffect } from 'react';
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

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  const location = useLocation();
  const currentCampaign = getCurrentCampaign();
  const isStaging = isStagingEnv();

  return (
    <AudioProvider>
      <ScrollToTop />
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
