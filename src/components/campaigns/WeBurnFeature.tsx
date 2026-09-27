import React from 'react';
import { Article } from '../../types/content';
import { ResponsivePicture } from '../common/ResponsivePicture';
import { parseWeBurnInterview } from '../../utils/weBurnInterview.mjs';
import { WeBurnInterviewCopy } from './WeBurnInterviewCopy';
import './weBurn.css';

// Formatting only: keep every manuscript line and speaker prefix in its original order.
export const WeBurnFeature: React.FC<{ article: Article }> = ({ article }) => {
  const individual = article.featureLayout === 'individual';
  const sections = parseWeBurnInterview(article.canonicalMarkdown || '', {
    closingEditorialStart: individual ? undefined : article.canonicalMarkdown?.split(/\r?\n/).find(line => line.startsWith('FUTURE —')),
  });
  const figure = (id:string,alt:string,portrait=false) => <figure className={portrait?'wb-portrait':'wb-insert'}><ResponsivePicture assetId={id} alt={alt} aspectRatio={portrait?'4:5':'16:9'} loading="lazy" /><figcaption>{alt}</figcaption></figure>;
  return <div className={`we-burn wb-feature-body ${individual?'wb-individual':'wb-conversation'}`}>
    <nav className="wb-toc" aria-label="記事の目次">{sections.filter(s=>s.heading).map((s,i)=><a href={`#section-${i+1}`} key={s.heading}>{individual?s.heading.split(' — ')[0]:s.heading}</a>)}</nav>
    {sections.map((section,i)=><section className="wb-editorial-section" id={i?`section-${i}`:undefined} key={i}>
      {section.heading && <h2>{section.heading}</h2>}
      <div className="wb-section-body">
        {individual && i>=1 && i<=5 && figure(`wb25-m0${i}`,`${['KAI','SHO','LEO','REN','YUTO'][i-1]} — We Burn ソロビジュアル`,true)}
        <WeBurnInterviewCopy blocks={section.blocks} />
      </div>
      {!individual && i===1 && figure('wb25-fe02-ph01','SHOが音に耳を傾けるエディトリアルイメージ',true)}
      {!individual && i===3 && figure('wb25-fe02-in01','リズムのずれを表す無人スタジオのエディトリアルイメージ')}
      {!individual && i===4 && figure('wb25-fe02-in02','五人それぞれの動きを描くエディトリアルイメージ')}
    </section>)}
  </div>;
};
