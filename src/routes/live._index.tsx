import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiveLights } from '../components/common/FiveLights';
import { LiveArchiveCard } from '../components/live/LiveArchiveCard';
import { getLiveArchives } from '../utils/contentLoader';

export const LiveIndex: React.FC = () => {
  const archives = getLiveArchives();
  if (!archives.length) return <Navigate to="/" replace />;
  const currentArchive = archives.find((archive) => archive.id === 'live-tour-2024');
  const historicalArchives = archives.filter((archive) => archive.id !== 'live-tour-2024');

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
