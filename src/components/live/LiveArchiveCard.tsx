import React from 'react';
import { Link } from 'react-router-dom';
import { LiveArchive } from '../../types/content';
import { ResponsivePicture } from '../common/ResponsivePicture';

export const LiveArchiveCard: React.FC<{ archive: LiveArchive }> = ({ archive }) => (
  <article className="live-card">
    <Link to={`/live/${archive.slug}/`} className="live-card__image-link" aria-label={`${archive.title} archive`}>
      <ResponsivePicture
        assetId={archive.heroDesktopAssetId}
        mobileAssetId={archive.heroMobileAssetId}
        title={archive.title}
        alt={`${archive.eventTitle} archive visual`}
        aspectRatio="16:9"
        mobileAspectRatio="4:5"
      />
    </Link>
    <div className="live-card__body">
      <span className="live-kicker">{archive.timingLabel} // {archive.archiveRole} ARCHIVE</span>
      <h2>{archive.title}</h2>
      <p>{archive.subtitle}</p>
      <Link to={`/live/${archive.slug}/`} className="btn-secondary">VIEW ARCHIVE →</Link>
    </div>
  </article>
);
