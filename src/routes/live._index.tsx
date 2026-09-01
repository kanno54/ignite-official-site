import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiveLights } from '../components/common/FiveLights';
import { LiveArchiveCard } from '../components/live/LiveArchiveCard';
import { getLiveArchives, getReleaseById } from '../utils/contentLoader';

export const LiveIndex: React.FC = () => {
  const archives = getLiveArchives();
  if (!archives.length) return <Navigate to="/" replace />;
  const currentArchive = archives.find((archive) => archive.id === 'live-tour-2024');
  const historicalArchives = archives.filter((archive) => archive.id !== 'live-tour-2024');
  const liveAlbum = getReleaseById('live-album-2024');

  return (
    <div className="live-page">
      <header className="live-page__intro">
        <FiveLights height={20} />
        <span className="live-kicker">OFFICIAL PERFORMANCE ARCHIVE</span>
        <h1>LIVE</h1>
        <p>IGNITEのステージとツアーで起きたことを、公演ごとの監査済み記録からたどる公式Archive。</p>
        <Link to="/live/history/" className="btn-secondary">VIEW LIVE HISTORY →</Link>
      </header>

      {currentArchive && (
        <section className="live-current" aria-labelledby="live-current-heading">
          <div className="live-section-heading">
            <div>
              <span className="live-kicker">2024 // LATEST LIVE</span>
              <h2 id="live-current-heading">CURRENT ARCHIVE</h2>
            </div>
            <span>12 SHOWS // 5 CITIES</span>
          </div>
          <LiveArchiveCard archive={currentArchive} />
        </section>
      )}

      {liveAlbum && (
        <section className="live-related-release" aria-labelledby="live-release-heading">
          <div className="live-section-heading"><div><span className="live-kicker">RELATED LIVE RELEASES</span><h2 id="live-release-heading">LIVE ALBUM 2024</h2></div><span>2 DISCS // 24 TRACKS</span></div>
          <Link to="/discography/live-album-2024/" className="live-related-release__card">
            <span>IGNITE LIVE 2024</span><strong>THE SHOW ENDED. THE SOUND REMAINS.</strong><small>LISTEN TO THE LIVE ALBUM →</small>
          </Link>
        </section>
      )}

      <section aria-labelledby="live-archive-heading">
        <div className="live-section-heading">
          <div>
            <span className="live-kicker">2021—2023</span>
            <h2 id="live-archive-heading">HISTORICAL ARCHIVES</h2>
          </div>
          <span>{historicalArchives.length} ARCHIVES</span>
        </div>
        <div className="live-card-grid">
          {historicalArchives.map((archive) => <LiveArchiveCard key={archive.id} archive={archive} />)}
        </div>
      </section>
    </div>
  );
};
