import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LiveArchiveCard } from '../components/live/LiveArchiveCard';
import { getLiveArchives } from '../utils/contentLoader';

export const LiveHistoryPage: React.FC = () => {
  const archives = getLiveArchives();
  if (!archives.length) return <Navigate to="/" replace />;

  return (
    <div className="live-page">
      <nav className="live-breadcrumb" aria-label="Breadcrumb">
        <Link to="/live/">LIVE</Link><span>/</span><span aria-current="page">HISTORY</span>
      </nav>
      <header className="live-page__intro live-page__intro--compact">
        <span className="live-kicker">CHRONOLOGICAL INDEX</span>
        <h1>LIVE HISTORY</h1>
        <p>2021年のSPARKから2024年のComplete Archiveまで、IGNITEのステージの変化をたどる公式記録。</p>
      </header>
      <div className="live-timeline">
        {archives.map((archive) => (
          <div className="live-timeline__row" key={archive.id}>
            <div className="live-timeline__year">{archive.timingLabel}</div>
            <LiveArchiveCard archive={archive} />
          </div>
        ))}
      </div>
    </div>
  );
};
