import React from 'react';
import { Link } from 'react-router-dom';
import type { Article, Campaign } from '../../types/content';
import { useAudio } from '../audio/AudioProvider';
import { TrackPlayButton } from '../audio/TrackPlayButton';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { LiveMarkdown } from '../live/LiveMarkdown';
import { getLiveAlbumCampaignContent } from '../../utils/contentLoader';

type Props = { campaign: Campaign; relatedArticles: Article[] };

const withoutCtas = (markdown: string) => markdown
  .replace(/^\*\*CTA｜.+?\*\*\s*$/gmu, '')
  .trim();

export const LiveAlbumCampaignView: React.FC<Props> = ({ campaign, relatedArticles }) => {
  const { campaignMarkdown = '' } = getLiveAlbumCampaignContent();
  const { playRelease } = useAudio();
  const blocks = campaignMarkdown.split(/\r?\n---\r?\n/u).map(withoutCtas);
  const find = (heading: string) => blocks.find((block) => block.includes(heading)) || '';
  const storyLinks = new Map(relatedArticles.map((article) => [article.sourceAssetCode, article.slug]));
  const section = (className: string, markdown: string, actions?: React.ReactNode) => (
    <section className={`live-album-campaign__section ${className}`}>
      <LiveMarkdown markdown={markdown} />
      {actions && <div className="live-album-campaign__actions">{actions}</div>}
    </section>
  );

  return (
    <article className="live-album-campaign">
      <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>IGNITE LIVE 2024</h1>
      <section className="live-album-campaign__hero">
        <ResponsivePicture assetId="la24-kv01" mobileAssetId="la24-kv02" aspectRatio="16:9" mobileAspectRatio="3:4" alt="IGNITE LIVE 2024 campaign key visual" loading="eager" decoding="async" fetchPriority="high" sizes="100vw" className="live-album-campaign__hero-picture" />
        <div className="live-album-campaign__hero-copy">
          <span className="live-kicker">CURRENT CAMPAIGN // LA24-CP01</span>
          <LiveMarkdown markdown={blocks[0] || ''} />
          <Link className="btn-primary" to="/discography/live-album-2024/">LISTEN TO THE RELEASE →</Link>
        </div>
      </section>

      {section('live-album-campaign__from-tour', find('## FROM THE TOUR'), <Link className="btn-primary" to="/live/live-tour-2024/">VIEW LIVE TOUR 2024 →</Link>)}
      {section('', find('## IGNITE LIVE 2024'))}
      {section('', find('## TWO DISCS / 24 TRACKS'), <Link className="btn-primary" to="/discography/live-album-2024/#player">VIEW ALL 24 TRACKS →</Link>)}

      <section className="live-album-campaign__section">
        <LiveMarkdown markdown={find('## THREE LIVE VERSIONS')} />
        <div className="live-album-campaign__live-versions">
          {[
            ['### HEATWAVE', 'live-album-2024-heatwave'],
            ['### MOONLIT', 'live-album-2024-moonlit'],
            ['### SILENT SIGNAL', 'live-album-2024-silent-signal'],
          ].map(([heading, recordingId]) => (
            <article key={recordingId}>
              <LiveMarkdown markdown={find(heading)} />
              <TrackPlayButton recordingId={recordingId} size="large" />
            </article>
          ))}
        </div>
      </section>

      {section('', find('## HOW THE SONGS CHANGED'), storyLinks.get('LA24-AR01') && <Link className="btn-primary" to={`/features/${storyLinks.get('LA24-AR01')}/`}>READ HOW IGNITE CHANGED THE SONGS →</Link>)}
      {section('', find('## THE SESSIONS'), <div className="live-album-campaign__feature-links">
        {['LA24-AR02', 'LA24-AR03', 'LA24-AR04', 'LA24-AR05'].map((code) => storyLinks.get(code) && <Link key={code} to={`/features/${storyLinks.get(code)}/`}>{code} — READ FEATURE →</Link>)}
      </div>)}
      {section('', find('## FIVE SONGS THAT CHANGED ON TOUR'), storyLinks.get('LA24-AR06') && <Link className="btn-primary" to={`/features/${storyLinks.get('LA24-AR06')}/`}>READ FIVE SONGS THAT CHANGED ON TOUR →</Link>)}
      {section('live-album-campaign__return', find('## RETURN TO THE STAGE'), <Link className="btn-primary" to="/live/live-tour-2024/">RETURN TO THE TOUR →</Link>)}
      {section('live-album-campaign__final', find('# LISTEN / VIEW RELEASE'), <>
        <button className="btn-primary" onClick={() => playRelease(campaign.releaseId)}>LISTEN TO THE LIVE ALBUM ▶</button>
        <Link className="btn-secondary" to="/discography/live-album-2024/">VIEW RELEASE →</Link>
      </>)}
    </article>
  );
};
