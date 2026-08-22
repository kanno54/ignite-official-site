import React from 'react';
import { Link } from 'react-router-dom';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { FiveLights } from '../common/FiveLights';
import { useAudio } from '../audio/AudioProvider';
import { Article, Campaign } from '../../types/content';

interface EquinoxCampaignViewProps {
  campaign: Campaign;
  relatedArticles: Article[];
}

const primaryArticleIds = [
  'equinox-special-feature-article',
  'equinox-roundtable-article',
];

const secondaryArticleIds = [
  'equinox-artwork-article',
  'equinox-costume-article',
];

const EditorialCard: React.FC<{ article: Article; primary?: boolean }> = ({ article, primary = false }) => (
  <Link
    to={`/features/${article.slug}/`}
    className={`equinox-editorial-card${primary ? ' equinox-editorial-card--primary' : ''}`}
  >
    {article.heroAssetId ? (
      <ResponsivePicture
        assetId={article.heroAssetId}
        title={article.kicker}
        subtitle={article.title}
        aspectRatio="16:9"
        accentColor="#D9B44A"
      />
    ) : (
      <div className="equinox-editorial-card__text-hero">
        <span>XII → XXIV</span>
        <strong>OFFICIAL<br />LINER NOTES</strong>
      </div>
    )}
    <div className="equinox-editorial-card__body">
      <span>{primary ? 'PRIMARY EDITORIAL' : 'SECONDARY EDITORIAL'} / {article.kicker}</span>
      <h3>{article.title}</h3>
      <p>{article.dek}</p>
      <small>READ FEATURE →</small>
    </div>
  </Link>
);

export const EquinoxCampaignView: React.FC<EquinoxCampaignViewProps> = ({ campaign, relatedArticles }) => {
  const { playTrack } = useAudio();
  const primaryArticles = primaryArticleIds
    .map((id) => relatedArticles.find((article) => article.id === id))
    .filter((article): article is Article => Boolean(article));
  const secondaryArticles = secondaryArticleIds
    .map((id) => relatedArticles.find((article) => article.id === id))
    .filter((article): article is Article => Boolean(article));

  return (
    <div className="equinox-campaign">
      <section className="equinox-campaign__hero">
        <ResponsivePicture
          desktopSrc={campaign.desktopHero}
          mobileSrc={campaign.mobileHero}
          alt={campaign.heroAlt || 'IGNITE 2nd Full Album EQUINOX Key Visual'}
          aspectRatio="16:9"
          mobileAspectRatio="3:4"
          className="equinox-campaign__hero-picture"
        />
        <div className="equinox-campaign__hero-overlay" />
        <div className="equinox-campaign__hero-copy">
          <span>{campaign.eyebrow}</span>
          <h1>{campaign.title}</h1>
          <p>{campaign.catchCopy}</p>
          <div>
            <button onClick={() => playTrack('equinox-title')} className="btn-primary">LISTEN NOW ▶</button>
            <Link to="/discography/equinox/" className="btn-secondary">VIEW ALBUM →</Link>
          </div>
        </div>
      </section>

      <section className="equinox-campaign__statement">
        <FiveLights height={20} />
        <span>CAMPAIGN STATEMENT</span>
        <h2>TWO SIDES,<br />ONE MOMENT</h2>
        <h3>二つの影が、ひとつの光を形づくる。</h3>
        <p>{campaign.introduction?.body}</p>
      </section>

      <section className="equinox-campaign__journey">
        <div className="equinox-campaign__section-heading">
          <span>THE ROAD TO EQUINOX</span>
          <h2>静寂から再起へ。再起から、ひとつの瞬間へ。</h2>
        </div>
        <div className="equinox-campaign__journey-grid">
          <Link to="/campaigns/silent-signal/">
            <span>2024.01 / CHAPTER I</span>
            <h3>Silent Signal</h3>
            <p>言葉を削ぎ落とし、五人の視線と呼吸が同じ静寂の中でつながる。</p>
            <small>WE SPEAK WITHOUT WORDS →</small>
          </Link>
          <Link to="/campaigns/rise-again/">
            <span>2024.03 / CHAPTER II</span>
            <h3>RISE AGAIN</h3>
            <p>傷を消すのではなく、不完全なままもう一度同じ場所へ立つ。</p>
            <small>STILL STANDING →</small>
          </Link>
          <div className="is-current">
            <span>2024.04 / CHAPTER III</span>
            <h3>EQUINOX</h3>
            <p>光と影のどちらも抱え、違うままの五人がひとつの中心へ集う。</p>
            <small>TWO SIDES, ONE MOMENT</small>
          </div>
        </div>
      </section>

      <section className="equinox-campaign__album-gateway">
        <div className="equinox-campaign__album-cover">
          <ResponsivePicture
            assetId="cover-equinox"
            title="EQUINOX"
            subtitle="2nd Full Album"
            aspectRatio="1:1"
            accentColor="#D9B44A"
          />
        </div>
        <div>
          <span>2ND FULL ALBUM / 12 TRACKS</span>
          <h2>XII → XXIV<br />TIME &amp; SHADOW</h2>
          <p>正午から夜明けへ。12曲すべてのローマ数字、歌詞、音源、Song Detail ArtworkはDiscographyでたどることができます。</p>
          <div className="equinox-campaign__album-actions">
            <Link to="/discography/equinox/" className="btn-primary">EXPLORE ALL 12 TRACKS →</Link>
            <button onClick={() => playTrack('equinox-title')} className="btn-secondary">PLAY ALBUM ▶</button>
          </div>
        </div>
      </section>

      <section className="equinox-campaign__editorial">
        <div className="equinox-campaign__section-heading">
          <span>PRIMARY EDITORIAL</span>
          <h2>作品の中心を読む</h2>
        </div>
        <div className="equinox-campaign__primary-grid">
          {primaryArticles.map((article) => <EditorialCard key={article.id} article={article} primary />)}
        </div>

        <div className="equinox-campaign__section-heading equinox-campaign__section-heading--secondary">
          <span>DESIGN STORIES</span>
          <h2>光と影を形にする</h2>
        </div>
        <div className="equinox-campaign__secondary-grid">
          {secondaryArticles.map((article) => <EditorialCard key={article.id} article={article} />)}
        </div>
      </section>

      <section className="equinox-campaign__archive">
        <span>RELATED ERA &amp; CAMPAIGNS</span>
        <div>
          <Link to="/campaigns/silent-signal/" className="btn-secondary">Silent Signal</Link>
          <Link to="/campaigns/rise-again/" className="btn-secondary">RISE AGAIN</Link>
          <Link to="/story/" className="btn-primary">STORY / TIMELINE →</Link>
        </div>
      </section>
    </div>
  );
};
