import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { TrackPlayButton } from '../components/audio/TrackPlayButton';
import { LiveMarkdown } from '../components/live/LiveMarkdown';
import { useAudio } from '../components/audio/AudioProvider';
import { getReleaseById, getRecordingsForRelease } from '../utils/contentLoader';

export const LiveAlbumReleasePage: React.FC = () => {
  const release = getReleaseById('live-album-2024');
  const tracks = getRecordingsForRelease('live-album-2024');
  const { playRelease } = useAudio();
  if (!release || tracks.length !== 24) return <Navigate to="/discography/" replace />;
  const queue = tracks.map((track) => track.id);
  const related = (release.relatedReleaseIds || []).map(getReleaseById).filter(Boolean);

  return (
    <div className="live-album-page">
      <section className="live-album-hero">
        <ResponsivePicture assetId="la24-h01" mobileAssetId="la24-h02" aspectRatio="16:9" mobileAspectRatio="4:5" title="IGNITE LIVE 2024" alt="IGNITE LIVE 2024 live album artwork" loading="eager" fetchPriority="high" className="live-album-hero__picture" />
        <div className="live-album-hero__shade" />
        <div className="live-album-hero__copy">
          <span className="live-kicker">2-DISC LIVE ALBUM // 24 TRACKS</span>
          <h1>IGNITE LIVE 2024</h1>
          <p>SOLAR / LUNAR × EQUINOX / SHADOW</p>
          <strong>THE SHOW ENDED. THE SOUND REMAINS.</strong>
          <button className="btn-primary" onClick={() => playRelease(release.id)}>PLAY ALL 24 TRACKS ▶</button>
        </div>
      </section>

      <section className="live-album-intro">
        <ResponsivePicture assetId="la24-c01" aspectRatio="1:1" title="IGNITE LIVE 2024 album cover" alt="IGNITE LIVE 2024 album cover" sizes="(max-width: 768px) calc(100vw - 48px), 420px" />
        <div>
          <span className="live-kicker">FORMAL DISCOGRAPHY RELEASE</span>
          <h2>ライブは終わった。音は、まだ残っている。</h2>
          <p>同じセットリストでも、同じライブは一度もなかった。2024年のライブで作り直された楽曲を、一つの音楽作品として残す2枚組・全24曲。</p>
          <dl className="live-album-metadata">
            <div><dt>FORMAT</dt><dd>2-Disc Live Album</dd></div>
            <div><dt>DISC 1</dt><dd>SOLAR / LUNAR — 12 TRACKS</dd></div>
            <div><dt>DISC 2</dt><dd>EQUINOX / SHADOW — 12 TRACKS</dd></div>
          </dl>
        </div>
      </section>

      <section id="player" className="live-album-player">
        <div className="live-section-heading"><div><span className="live-kicker">CANONICAL PLAYER</span><h2>2 DISCS / 24 TRACKS</h2></div><span>ALL TRACKS RELEASED</span></div>
        <div className="live-album-discs">
          {[1, 2].map((disc) => (
            <div className={`live-album-disc live-album-disc--${disc}`} key={disc}>
              <div className="live-album-disc__heading">
                <span>DISC {disc}</span>
                <h3>{disc === 1 ? 'SOLAR / LUNAR' : 'EQUINOX / SHADOW'}</h3>
                <small>12 TRACKS</small>
              </div>
              <div className="live-album-track-list">
                {tracks.filter((track) => track.discNumber === disc).map((track) => (
                  <article className="live-album-track" key={track.id}>
                    <ResponsivePicture assetId={track.artwork?.square} aspectRatio="1:1" title={track.title} alt={`${track.title} LIVE 2024 square artwork`} loading="lazy" decoding="async" sizes="72px" />
                    <span className="live-album-track__number">{String(track.overallTrackNumber).padStart(2, '0')}</span>
                    <div><h4>{track.title}</h4><p>{track.arrangementLabel}</p></div>
                    <TrackPlayButton recordingId={track.id} queueContext={queue} size="small" />
                    <Link to={`/discography/live-album-2024/tracks/${track.songDetailSlug}/`} aria-label={`${track.title} song detail`}>DETAIL →</Link>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="live-album-liner">
        <span className="live-kicker">OFFICIAL ALBUM LINER NOTE // LA24-D02</span>
        <LiveMarkdown markdown={release.linerNotes} />
      </section>

      <section className="live-album-related-tour">
        <ResponsivePicture assetId="la24-kv03" aspectRatio="1:1" title="IGNITE LIVE 2024 campaign" alt="IGNITE LIVE 2024 campaign key visual" loading="lazy" decoding="async" sizes="(max-width: 768px) calc(100vw - 48px), 460px" />
        <div><span className="live-kicker">CAMPAIGN GUIDE // LA24-CP01</span><h2>EXPLORE LIVE ALBUM 2024</h2><p>ツアーで曲がどう変わり、その変化を24曲のLive Versionとしてなぜ残したのか。セッション、三つのLive Version、六つのFeatureをキャンペーンガイドで辿る。</p><Link className="btn-primary" to="/campaigns/live-album-2024/">EXPLORE CAMPAIGN →</Link></div>
      </section>

      <section className="live-album-related-tour">
        <ResponsivePicture assetId="lv24-c-h01" aspectRatio="16:9" title="IGNITE LIVE TOUR 2024" loading="lazy" decoding="async" />
        <div><span className="live-kicker">FROM THE LIVE ARCHIVE</span><h2>IGNITE LIVE TOUR 2024<br />SOLAR / LUNAR / EQUINOX / SHADOW</h2><p>ライブアルバムの原点となった2024年ツアーへ。音源として再構成される前のステージ、その流れと記録をLIVE ARCHIVEで辿る。</p><Link className="btn-primary" to="/live/live-tour-2024/">EXPLORE LIVE TOUR 2024 →</Link></div>
      </section>

      <section>
        <div className="live-section-heading"><div><span className="live-kicker">ORIGINAL / STUDIO RELATIONSHIPS</span><h2>RELATED STUDIO RELEASES</h2></div></div>
        <div className="live-album-related-releases">{related.map((item) => item && <Link to={`/discography/${item.slug}/`} key={item.id}>{item.title}<small>{item.format}</small></Link>)}</div>
      </section>

      <section className="live-album-credits"><span className="live-kicker">CREDITS / METADATA</span><h2>CANONICAL SOURCES</h2><p>Release page: LA24-P01 · Tracklist: LA24-D01 · Liner notes: LA24-D02 · Player: LA24-R01</p><p>Recording provenance not supplied by the canonical registry remains UNSPECIFIED.</p></section>
    </div>
  );
};
