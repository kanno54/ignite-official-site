import React from 'react';
import { Link } from 'react-router-dom';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { LiveMarkdown } from '../components/live/LiveMarkdown';
import { getLiveAlbumData } from '../utils/contentLoader';

export const LiveAlbumNewsPage: React.FC = () => {
  const data = getLiveAlbumData();
  const body = data.newsMarkdown.replace(/^# .+\r?\n+/, '');
  return <article className="live-album-news">
    <span className="live-kicker">RELEASE NEWS // LA24-N01</span>
    <h1>IGNITE LIVE TOUR 2024、2枚組LIVE ALBUMとしてリリース決定</h1>
    <ResponsivePicture assetId="la24-h01" mobileAssetId="la24-h02" aspectRatio="16:9" mobileAspectRatio="4:5" title="IGNITE LIVE 2024" loading="eager" fetchPriority="high" />
    <div className="live-album-editorial-copy"><LiveMarkdown markdown={body} /></div>
    <div className="live-album-news__actions"><Link className="btn-primary" to="/discography/live-album-2024/">LISTEN TO THE LIVE ALBUM →</Link><Link className="btn-secondary" to="/live/live-tour-2024/">RETURN TO THE TOUR →</Link></div>
  </article>;
};
