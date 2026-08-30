import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { LiveMarkdown } from '../components/live/LiveMarkdown';
import { getLiveTourLog } from '../utils/contentLoader';

export const LiveTourLogPage: React.FC = () => {
  const { slug = '', logSlug = '' } = useParams();
  const result = getLiveTourLog(slug, logSlug);
  if (!result) return <Navigate to="/404/" replace />;

  const { archive, log } = result;
  const logIndex = archive.tourLogs?.findIndex((item) => item.slug === log.slug) ?? -1;
  const previous = logIndex > 0 ? archive.tourLogs?.[logIndex - 1] : undefined;
  const next = archive.tourLogs && logIndex >= 0 && logIndex < archive.tourLogs.length - 1
    ? archive.tourLogs[logIndex + 1]
    : undefined;

  return (
    <article className="live-archive live-tour-log">
      <nav className="live-breadcrumb" aria-label="Breadcrumb">
        <Link to="/live/">LIVE</Link><span>/</span>
        <Link to="/live/history/">HISTORY</Link><span>/</span>
        <Link to={`/live/${archive.slug}/`}>{archive.title}</Link><span>/</span>
        <span aria-current="page">{log.title}</span>
      </nav>

      <header className="live-tour-log__hero">
        <ResponsivePicture assetId={log.heroAssetId} title={log.title} alt={`${archive.title} ${log.title} selected hero`} aspectRatio="3:2" />
        <div>
          <span className="live-kicker">TOUR LOG // {log.sourceAssetCode}</span>
          <h1>{log.title}</h1>
          <p>{log.dateRange.start.replaceAll('-', '.')}—{log.dateRange.end.replaceAll('-', '.')}</p>
          <strong>{log.venue}</strong>
        </div>
      </header>

      <div className="live-archive__content">
        <section className="live-document" aria-label={`${log.title} canonical tour log`}>
          <LiveMarkdown markdown={log.markdown} />
        </section>

        <section className="live-gallery" aria-labelledby="tour-log-gallery-heading">
          <span className="live-kicker">SELECTED TOUR LOG VISUALS</span>
          <h2 id="tour-log-gallery-heading">{log.title} GALLERY</h2>
          <div className="live-gallery__grid">
            {log.galleryAssetIds.map((assetId, index) => (
              <ResponsivePicture key={assetId} assetId={assetId} title={`${log.title} ${index + 1}`} alt={`${archive.title} ${log.title} gallery ${index + 1}`} aspectRatio="3:2" />
            ))}
          </div>
        </section>
      </div>

      <nav className="live-archive__pager" aria-label="Tour log navigation">
        {previous ? <Link to={`/live/${archive.slug}/tour-log/${previous.slug}/`}>← {previous.title}</Link> : <Link to={`/live/${archive.slug}/`}>← COMPLETE ARCHIVE</Link>}
        {next ? <Link to={`/live/${archive.slug}/tour-log/${next.slug}/`}>{next.title} →</Link> : <Link to={`/live/${archive.slug}/`}>COMPLETE ARCHIVE →</Link>}
      </nav>
    </article>
  );
};
