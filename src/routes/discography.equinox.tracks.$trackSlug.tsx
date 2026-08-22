import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { TrackPlayButton } from '../components/audio/TrackPlayButton';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { LyricsRenderer } from '../components/discography/LyricSection.mjs';
import {
  getArticles,
  getEquinoxRecordingBySlug,
  getEquinoxRecordingSlug,
  getRecordingsForRelease,
} from '../utils/contentLoader';

export const EquinoxSongDetailPage: React.FC = () => {
  const { trackSlug: slug = '' } = useParams<{ trackSlug: string }>();
  const track = getEquinoxRecordingBySlug(slug);
  const tracks = getRecordingsForRelease('equinox');

  if (!track) return <Navigate to="/discography/equinox/" replace />;

  const index = tracks.findIndex((item) => item.id === track.id);
  const previous = tracks[(index - 1 + tracks.length) % tracks.length];
  const next = tracks[(index + 1) % tracks.length];
  const verticalArtworkId = `poster-equinox-tr${String(index + 1).padStart(2, '0')}-v`;
  const relatedArticles = getArticles().filter((article) => (
    article.relatedCampaignId === 'equinox'
    && (
      article.relatedTrackIds.includes(track.id)
      || article.id === 'equinox-special-feature-article'
    )
  ));

  return (
    <article className="equinox-song-detail">
      <nav className="equinox-song-detail__breadcrumb" aria-label="Breadcrumb">
        <Link to="/discography/">DISCOGRAPHY</Link>
        <span>/</span>
        <Link to="/discography/equinox/">EQUINOX</Link>
        <span>/</span>
        <span>TRACK {String(index + 1).padStart(2, '0')}</span>
      </nav>

      <section className="equinox-song-detail__hero">
        <div className="equinox-song-detail__artwork">
          <ResponsivePicture
            assetId={verticalArtworkId}
            title={track.title}
            subtitle={track.romanNumeral}
            aspectRatio="3:4"
            accentColor="#D9B44A"
          />
        </div>

        <div className="equinox-song-detail__intro">
          <span className="equinox-song-detail__eyebrow">
            TRACK {String(index + 1).padStart(2, '0')} / {track.romanNumeral}
          </span>
          <h1>{track.title}</h1>
          {track.versionLabel && <p className="equinox-song-detail__version">{track.versionLabel}</p>}
          <p className="equinox-song-detail__notes">{track.linerNotes}</p>
          <div className="equinox-song-detail__audio">
            <TrackPlayButton recordingId={track.id} size="large" />
            <span>LISTEN TO {track.title.toUpperCase()}</span>
          </div>
          <Link to="/discography/equinox/" className="btn-secondary">
            ← BACK TO EQUINOX ALBUM
          </Link>
        </div>
      </section>

      <section className="equinox-song-detail__lyrics">
        <span className="equinox-song-detail__eyebrow">OFFICIAL LYRIC</span>
        <h2>LYRIC</h2>
        <LyricsRenderer
          lyrics={track.lyrics}
          surface="song-detail"
          className="equinox-song-detail__lyric-copy"
        />
      </section>

      <section className="equinox-song-detail__related">
        <span className="equinox-song-detail__eyebrow">EXPLORE THE ERA</span>
        <h2>RELATED CONTENT</h2>
        <div className="equinox-song-detail__related-grid">
          {relatedArticles.map((article) => (
            <Link key={article.id} to={`/features/${article.slug}/`}>
              <span>{article.kicker}</span>
              <strong>{article.title}</strong>
              <small>READ FEATURE →</small>
            </Link>
          ))}
          <Link to="/campaigns/equinox/">
            <span>CAMPAIGN</span>
            <strong>TWO SIDES, ONE MOMENT</strong>
            <small>VIEW CAMPAIGN →</small>
          </Link>
        </div>
      </section>

      <nav className="equinox-song-detail__navigation" aria-label="Track navigation">
        <Link to={`/discography/equinox/tracks/${getEquinoxRecordingSlug(previous.id)}/`}>
          <span>← PREVIOUS</span>
          <strong>{previous.title}</strong>
        </Link>
        <Link to="/discography/equinox/" className="equinox-song-detail__album-link">
          <span>ALBUM</span>
          <strong>EQUINOX</strong>
        </Link>
        <Link to={`/discography/equinox/tracks/${getEquinoxRecordingSlug(next.id)}/`}>
          <span>NEXT →</span>
          <strong>{next.title}</strong>
        </Link>
      </nav>
    </article>
  );
};
