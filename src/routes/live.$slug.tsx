import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { TrackPlayButton } from '../components/audio/TrackPlayButton';
import { LiveMarkdown } from '../components/live/LiveMarkdown';
import {
  getLiveArchiveBySlug,
  getLiveArchives,
  getRecordingById,
  getReleaseArtworkAssetId,
  getReleaseById,
} from '../utils/contentLoader';

export const LiveArchivePage: React.FC = () => {
  const { slug = '' } = useParams();
  const archives = getLiveArchives();
  const archive = getLiveArchiveBySlug(slug);
  if (!archives.length) return <Navigate to="/" replace />;
  if (!archive) return <Navigate to="/404/" replace />;

  const currentIndex = archives.findIndex((item) => item.id === archive.id);
  const previous = currentIndex > 0 ? archives[currentIndex - 1] : undefined;
  const next = currentIndex < archives.length - 1 ? archives[currentIndex + 1] : undefined;
  const relatedReleases = archive.relatedReleaseIds.map(getReleaseById).filter(Boolean);
  const relatedRecordings = archive.relatedRecordingIds.map(getRecordingById).filter(Boolean);
  const previewQueue = archive.preview?.recordings.map((recording) => recording.id) || [];

  return (
    <article className="live-archive">
      <nav className="live-breadcrumb" aria-label="Breadcrumb">
        <Link to="/live/">LIVE</Link><span>/</span><Link to="/live/history/">HISTORY</Link><span>/</span><span aria-current="page">{archive.title}</span>
      </nav>

      <header className="live-archive__hero">
        <ResponsivePicture
          assetId={archive.heroDesktopAssetId}
          mobileAssetId={archive.heroMobileAssetId}
          title={archive.title}
          alt={`${archive.eventTitle} official archive hero`}
          aspectRatio="16:9"
          mobileAspectRatio="4:5"
        />
        <div className="live-archive__hero-copy">
          <span className="live-kicker">{archive.timingLabel} // {archive.archiveRole} ARCHIVE</span>
          {archive.logoAssetId && (
            <ResponsivePicture
              assetId={archive.logoAssetId}
              mobileAssetId={archive.compactLogoAssetId}
              title={`${archive.title} approved logo`}
              alt={`${archive.title} approved logo`}
              aspectRatio="3:2"
              mobileAspectRatio="1:1"
              className="live-archive__logo"
            />
          )}
          <h1>{archive.title}</h1>
          <p className="live-archive__event">{archive.eventTitle}</p>
          <p>{archive.subtitle}</p>
        </div>
      </header>

      <div className="live-archive__content">
        {archive.schedule && (
          <section className="live-schedule" aria-labelledby="live-schedule-heading">
            <span className="live-kicker">CANONICAL TOUR DATA // {archive.schedule.sourceAssetCode}</span>
            <h2 id="live-schedule-heading">{archive.schedule.showCount} SHOWS // {archive.schedule.cityCount} CITIES</h2>
            <div className="live-schedule__grid">
              {archive.schedule.shows.map((show) => (
                <article key={`${show.date}-${show.show}`}>
                  <time dateTime={show.date}>{show.date.replaceAll('-', '.')} {show.weekday}</time>
                  <strong>{show.stop}</strong>
                  <span>{show.venue} // {show.show}</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {archive.chapterVisuals && archive.chapterVisuals.length > 0 && (
          <section className="live-chapters" aria-labelledby="live-chapters-heading">
            <span className="live-kicker">FOUR PHASES</span>
            <h2 id="live-chapters-heading">SOLAR / LUNAR / EQUINOX / SHADOW</h2>
            <div className="live-chapters__grid">
              {archive.chapterVisuals.map((chapter) => (
                <figure key={chapter.id}>
                  <ResponsivePicture assetId={chapter.assetId} title={chapter.title} alt={`${archive.title} ${chapter.title} chapter visual`} aspectRatio="16:9" />
                  <figcaption>{chapter.title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {archive.documents.map((document) => (
          <section className="live-document" key={document.sourceAssetCode} aria-label={document.label}>
            <span className="live-kicker">{document.label} // {document.sourceAssetCode}</span>
            {document.imageAssetId && (
              <ResponsivePicture
                assetId={document.imageAssetId}
                title={document.label}
                alt={`${archive.title} ${document.label} selected visual`}
                aspectRatio="16:9"
                className="live-document__visual"
              />
            )}
            <LiveMarkdown markdown={document.markdown} />
          </section>
        ))}

        {archive.setlist.display && (
          <section className="live-setlist" aria-labelledby="live-setlist-heading">
            <span className="live-kicker">AUDITED PERFORMANCE REFERENCES</span>
            <h2 id="live-setlist-heading">{archive.setlist.displayLabel}</h2>
            <ul>
              {archive.setlist.tracks.map((track) => (
                <li key={`${track.trackNumber || ''}-${track.title}-${track.section || ''}`}>
                  <div>
                    <strong>{archive.setlist.showTrackNumbers && track.trackNumber ? `${String(track.trackNumber).padStart(2, '0')} ` : ''}{track.title}</strong>
                    {track.section && <span>{track.section.replaceAll('_', ' ')}</span>}
                  </div>
                  {track.note && <p>{track.note}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {archive.preview && (
          <section className="live-preview" aria-labelledby="live-preview-heading">
            <span className="live-kicker">{archive.preview.eyebrow} // {archive.preview.sourceAssetCode}</span>
            <h2 id="live-preview-heading">{archive.preview.title}</h2>
            <p>{archive.preview.copy}</p>
            <div className="live-preview__grid">
              {archive.preview.recordings.map((recording) => (
                <article key={recording.id}>
                  <ResponsivePicture
                    assetId={recording.posterAssetId}
                    title={recording.title}
                    alt={`${recording.title} LIVE 2024 preview visual`}
                    aspectRatio="1:1"
                  />
                  <div>
                    <span>TRACK {String(recording.trackNumber).padStart(2, '0')} // PREVIEW</span>
                    <strong>{recording.title}</strong>
                    <TrackPlayButton recordingId={recording.id} queueContext={previewQueue} size="small" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {archive.tourLogs && archive.tourLogs.length > 0 && (
          <section className="live-tour-logs" aria-labelledby="live-tour-logs-heading">
            <span className="live-kicker">COMPLETE TOUR LOG</span>
            <h2 id="live-tour-logs-heading">TOUR LOG</h2>
            <div className="live-tour-logs__grid">
              {archive.tourLogs.map((log) => (
                <article key={log.slug}>
                  <Link to={`/live/${archive.slug}/tour-log/${log.slug}/`}>
                    <ResponsivePicture assetId={log.heroAssetId} title={log.title} alt={`${archive.title} ${log.title} tour log`} aspectRatio="3:2" />
                    <div>
                      <time dateTime={log.dateRange.start}>{log.dateRange.start.replaceAll('-', '.')}—{log.dateRange.end.replaceAll('-', '.')}</time>
                      <strong>{log.title}</strong>
                      <span>{log.venue}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="live-gallery" aria-labelledby="live-gallery-heading">
          <span className="live-kicker">SELECTED ASSET STUDIO VISUALS</span>
          <h2 id="live-gallery-heading">ARCHIVE GALLERY</h2>
          <div className="live-gallery__grid">
            {archive.galleryAssetIds.map((assetId, index) => (
              <ResponsivePicture key={assetId} assetId={assetId} title={`${archive.title} gallery ${index + 1}`} alt={`${archive.title} archive gallery ${index + 1}`} aspectRatio="3:2" />
            ))}
          </div>
        </section>

        {(relatedReleases.length > 0 || relatedRecordings.length > 0) && (
          <section className="live-related" aria-labelledby="live-related-heading">
            <span className="live-kicker">EXISTING DISCOGRAPHY REFERENCES</span>
            <h2 id="live-related-heading">RELATED MUSIC</h2>
            {relatedReleases.length > 0 && (
              <div className="live-related__releases">
                {relatedReleases.map((release) => release && (
                  <Link to={`/discography/${release.slug}/`} className="live-release-link" key={release.id}>
                    <ResponsivePicture assetId={getReleaseArtworkAssetId(release, 'cover')} title={release.title} alt={`${release.title} artwork`} aspectRatio="1:1" />
                    <span>{release.format}</span><strong>{release.title}</strong>
                  </Link>
                ))}
              </div>
            )}
            {relatedRecordings.map((recording) => recording && (
              <div className="live-recording-reference" key={recording.id}>
                <div>
                  <span>RELATED LIVE RECORDING // PROVENANCE NOT PROMOTED</span>
                  <strong>{recording.title}</strong>
                  <p>既存Discography Recordingへの参照です。本Archiveの特定公演音源とは断定していません。</p>
                </div>
                <TrackPlayButton recordingId={recording.id} />
              </div>
            ))}
          </section>
        )}
      </div>

      <nav className="live-archive__pager" aria-label="Live archive navigation">
        {previous ? <Link to={`/live/${previous.slug}/`}>← {previous.title}</Link> : <span />}
        {next ? <Link to={`/live/${next.slug}/`}>{next.title} →</Link> : <span />}
      </nav>
    </article>
  );
};
