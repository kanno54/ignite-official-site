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
import { FunPage } from './routes/fun';
import { PrivacyPage } from './routes/privacy';
import { AccessibilityPage } from './routes/accessibility';
import { NotFoundPage } from './routes/404';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <AudioProvider>
      <ScrollToTop />
      <div className="app-container" data-campaign="no-limits">
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
