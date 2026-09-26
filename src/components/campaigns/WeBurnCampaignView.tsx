import React from 'react';
import { Link } from 'react-router-dom';
import copy from '../../../content/public/we-burn.json';
import { getArticles, getRecordingsForRelease } from '../../utils/contentLoader';
import { TrackPlayButton } from '../audio/TrackPlayButton';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { LiveMarkdown } from '../live/LiveMarkdown';
import './weBurn.css';

export const WeBurnRelated: React.FC<{ exclude?: string }> = ({ exclude }) => (
  <nav className="wb-related" aria-label="We Burn 関連記事">
    {getArticles().filter(a=>a.relatedCampaignId==='we-burn' && a.slug!==exclude).map(a=>(
      <Link key={a.id} to={`/features/${a.slug}/`} className="wb-card">
        <ResponsivePicture assetId={a.cardAssetId || a.heroAssetId} alt={`${a.kicker} — IGNITE五人のエディトリアルイメージ`} aspectRatio="1:1" loading="lazy" />
        <span>{a.kicker}</span><h2>{a.title}</h2><p>{a.dek}</p><span>READ FEATURE →</span>
      </Link>
    ))}
  </nav>
);

export const WeBurnCampaignView: React.FC<{ release?: boolean }> = ({ release=false }) => (
  <div className="we-burn">
    <header className="wb-campaign-hero">
      <ResponsivePicture assetId="wb25-web01" mobileAssetId="wb25-web02" alt="光と反射の中、それぞれの方向を見つめるIGNITEの五人" aspectRatio="16:9" mobileAspectRatio="9:16" loading="eager" fetchPriority="high" />
      <div className="wb-hero-copy"><p className="wb-label">IGNITE 7th Single</p><h1>We Burn</h1><p className="wb-catch">燃える先は、ひとつじゃない。</p><p>FIVE DIRECTIONS. ONE FIRE.</p><p><time dateTime={copy.publicationDates.release}>2025.04.23 RELEASE</time><span className="wb-note">（作品世界内）</span></p></div>
    </header>
    <section className="wb-release-intro">
      <ResponsivePicture assetId="wb25-jk01" alt="IGNITE 7th Single『We Burn』ジャケット" aspectRatio="1:1" loading="lazy" />
      <div><LiveMarkdown markdown={copy.releaseMarkdown} headingOffset={0} /><Link className="btn-secondary" to={release?'/campaigns/we-burn/':'/discography/we-burn/'}>{release?'VIEW CAMPAIGN':'VIEW RELEASE'} →</Link></div>
    </section>
    <section aria-label="収録曲" className="wb-tracks">
      {copy.tracks.map((track,i)=>(<section key={track.title} className="wb-track" id={`track-${i+1}`}>
        <ResponsivePicture assetId={track.coverAssetId} alt={`${track.title} 楽曲ビジュアル`} aspectRatio="1:1" loading="lazy" />
        <div><p className="wb-label">0{i+1} / {track.direction}</p><LiveMarkdown markdown={track.markdown} headingOffset={0} />{i===2 && <p className="wb-note">2024年ツアー東京初日のライブ音源。</p>}{getRecordingsForRelease('we-burn').filter(recording=>recording.trackNumber===i+1 && recording.audioStatus==='ready').map(recording=><TrackPlayButton key={recording.id} recordingId={recording.id} />)}</div>
      </section>))}
    </section>
    <section><p className="wb-label">SPECIAL FEATURES</p><WeBurnRelated /></section>
    <section aria-labelledby="wb-history"><h2 id="wb-history">RELEASE HISTORY</h2><p className="wb-note">作品世界内の公開履歴・時刻は日本標準時（JST）</p><dl className="wb-history">{([
      ['キャンペーン発表',copy.publicationDates.announcement],['ジャケット・収録曲発表',copy.publicationDates.artwork],['FIVE DIRECTIONS 公開',copy.publicationDates.fiveDirections],['We Burn 発売',copy.publicationDates.release],['発売日サイト更新',copy.publicationDates.releaseUpdate],['NO PLAN 公開',copy.publicationDates.noPlan]
    ]).map(([label,date])=><div key={label}><dt>{label}</dt><dd><time dateTime={date}>{date.slice(0,10).replaceAll('-','.')} {date.includes('T')?'12:00 JST':''}</time></dd></div>)}</dl></section>
  </div>
);
