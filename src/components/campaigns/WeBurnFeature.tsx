import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types/content';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { WeBurnRelated } from './WeBurnCampaignView';
import './weBurn.css';

// Formatting only: keep every manuscript line and speaker prefix in its original order.
export const WeBurnFeature: React.FC<{ article: Article }> = ({ article }) => {
  const individual = article.featureLayout === 'individual';
  const lines = (article.canonicalMarkdown || '').replace(/\r\n/g,'\n').split('\n');
  const first = lines.findIndex(l=>l.trim());
  const sections: {heading:string;lines:string[]}[] = [{heading:'',lines:[]}];
  lines.slice(first+1).forEach(line=>{
    const heading=line.match(/^##\s+(.+)$/) || line.match(/^(\d{2}｜.+)$/);
    if(heading) sections.push({heading:heading[1],lines:[]});
    else sections[sections.length-1].lines.push(line);
  });
  const renderCopy = (body:string[]) => body.filter(l=>l.trim()).map((line,i)=>{
    const speaker=line.match(/^(KAI|SHO|LEO|REN|YUTO)(：\s*)(.*)$/);
    return <p key={i} className={line.startsWith('――')?'wb-question':speaker?'wb-dialogue':undefined}>{speaker?<><strong>{speaker[1]}</strong>{speaker[2]}{speaker[3]}</>:line}</p>;
  });
  const figure = (id:string,alt:string,portrait=false) => <figure className={portrait?'wb-portrait':'wb-insert'}><ResponsivePicture assetId={id} alt={alt} aspectRatio={portrait?'4:5':'16:9'} loading="lazy" /><figcaption>{alt}</figcaption></figure>;
  return <article className={`we-burn wb-feature ${individual?'wb-individual':'wb-conversation'}`}>
    <header className="wb-feature-hero"><ResponsivePicture assetId={article.heroAssetId} alt={individual?'同じ空間でそれぞれ別の方向を見つめるIGNITEの五人':'IGNITE五人が集まる制作スタジオのエディトリアルイメージ'} aspectRatio="16:9" loading="eager" fetchPriority="high" /><div className="wb-feature-title"><p className="wb-label">We Burn / SPECIAL FEATURE</p><h1>{article.title}</h1></div></header>
    <p className="wb-note">公開（作品世界内）：<time dateTime={article.publication.publishAt || undefined}>{article.publishDateFull} 12:00 JST</time></p>
    <nav className="wb-toc" aria-label="記事の目次">{sections.filter(s=>s.heading).map((s,i)=><a href={`#section-${i+1}`} key={s.heading}>{individual?s.heading.split(' — ')[0]:s.heading}</a>)}</nav>
    {sections.map((section,i)=><section className="wb-editorial-section" id={i?`section-${i}`:undefined} key={i}>
      {section.heading && <h2>{section.heading}</h2>}
      <div className="wb-section-body">
        {individual && i>=1 && i<=5 && figure(`wb25-m0${i}`,`${['KAI','SHO','LEO','REN','YUTO'][i-1]} — We Burn ソロビジュアル`,true)}
        <div className="wb-copy">{renderCopy(section.lines)}</div>
      </div>
      {!individual && i===1 && figure('wb25-fe02-ph01','SHOが音に耳を傾けるエディトリアルイメージ',true)}
      {!individual && i===3 && figure('wb25-fe02-in01','リズムのずれを表す無人スタジオのエディトリアルイメージ')}
      {!individual && i===4 && figure('wb25-fe02-in02','五人それぞれの動きを描くエディトリアルイメージ')}
    </section>)}
    <div className="wb-actions"><Link className="btn-primary" to="/discography/we-burn/">We Burn / 収録曲を見る →</Link><Link className="btn-secondary" to="/campaigns/we-burn/">キャンペーンへ →</Link></div>
    <WeBurnRelated exclude={article.slug} />
  </article>;
};
