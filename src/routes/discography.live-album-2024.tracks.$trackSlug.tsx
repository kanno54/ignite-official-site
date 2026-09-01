import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { TrackPlayButton } from '../components/audio/TrackPlayButton';
import { getRecordingById, getRecordingsForRelease, getReleaseById } from '../utils/contentLoader';

export const LiveAlbumSongDetailPage: React.FC = () => {
  const { trackSlug } = useParams<{ trackSlug: string }>();
  const tracks = getRecordingsForRelease('live-album-2024');
  const index = tracks.findIndex((track) => track.songDetailSlug === trackSlug);
  if (index < 0) return <Navigate to="/discography/live-album-2024/" replace />;
  const track = tracks[index];
  const previous = tracks[(index - 1 + tracks.length) % tracks.length];
  const next = tracks[(index + 1) % tracks.length];
  const original = track.originalRecordingId ? getRecordingById(track.originalRecordingId) : undefined;
  const relatedRelease = track.relatedReleaseId ? getReleaseById(track.relatedReleaseId) : undefined;
  const queue = tracks.map((item) => item.id);

  return <article className="live-album-song-detail">
    <Link to="/discography/live-album-2024/" className="back-to-index">← LIVE ALBUM INDEX</Link>
    <header>
      <ResponsivePicture assetId={track.artwork?.vertical} aspectRatio="3:4" title={track.title} alt={`${track.title} LIVE ALBUM 2024 song detail artwork`} loading="eager" fetchPriority="high" />
      <div><span className="live-kicker">DISC {track.discNumber} // TRACK {String(track.discTrackNumber).padStart(2, '0')} // OVERALL {String(track.overallTrackNumber).padStart(2, '0')}</span><h1>{track.title}</h1><p>{track.arrangementLabel}</p><TrackPlayButton recordingId={track.id} queueContext={queue} size="large" /></div>
    </header>
    <section><span className="live-kicker">CANONICAL ARRANGEMENT NOTE</span><h2>HOW THE SONG CHANGED</h2><p className="live-album-song-detail__note">{track.arrangementText}</p></section>
    <section className="live-album-song-relation"><span className="live-kicker">RECORDING RELATIONSHIP</span><h2>ORIGINAL / STUDIO VERSION</h2>{original && relatedRelease ? <><p>このLIVE Recordingは、Studio Recordingを置き換えず、別の演奏記録として関係づけられています。</p><Link className="btn-secondary" to={`/discography/${relatedRelease.slug}/`}>{original.title} — {relatedRelease.title} →</Link></> : <p>Canonical studio relationship is not supplied for this track. No relationship has been inferred.</p>}</section>
    <nav className="live-album-song-nav"><Link to={`/discography/live-album-2024/tracks/${previous.songDetailSlug}/`}>← {String(previous.overallTrackNumber).padStart(2, '0')} {previous.title}</Link><Link to={`/discography/live-album-2024/tracks/${next.songDetailSlug}/`}>{String(next.overallTrackNumber).padStart(2, '0')} {next.title} →</Link></nav>
  </article>;
};
