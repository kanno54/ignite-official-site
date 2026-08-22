import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getArticleBySlug, getArticles, getMemberBySlug, getRecordingById } from '../utils/contentLoader';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { TrackPlayButton } from '../components/audio/TrackPlayButton';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug || '');
  const allArticles = getArticles();

  if (!article) {
    return <Navigate to="/features/" replace />;
  }

  const articleIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = allArticles[(articleIndex - 1 + allArticles.length) % allArticles.length];
  const nextArticle = allArticles[(articleIndex + 1) % allArticles.length];

  return (
    <article style={{ maxWidth: 'var(--article-content)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <span className="campaign-tag">
            {article.kicker}
          </span>
          {article.eraLabel && (
            <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--campaign-accent)', fontWeight: 600 }}>
              {article.eraLabel}
            </span>
          )}
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.35, color: '#F6F3ED', margin: '8px 0 16px' }}>
          {article.title}
        </h1>
        {article.dek && (
          <p style={{ fontSize: '1.1rem', color: '#AEB6C4', lineHeight: 1.6, margin: '0 0 16px' }}>
            {article.dek}
          </p>
        )}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--campaign-accent)' }}>
          {!article.publishDateFull.startsWith('2026') && (
            <span>PUBLISHED: {article.publishDateFull}</span>
          )}
          {article.storyDateFull && <span>STORY: {article.storyDateFull}</span>}
          <span>READING TIME: {article.readingTimeMinutes} MIN</span>
        </div>
      </div>

      {/* Hero Asset */}
      <div>
        <ResponsivePicture assetId={article.heroAssetId} title={article.kicker} subtitle={article.title} aspectRatio="3:2" accentColor="var(--campaign-accent)" />
      </div>

      {/* Article Blocks Renderer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '1.05rem', lineHeight: 1.9, color: '#F6F3ED' }}>
        {article.blocks.map((block, idx) => {
          switch (block.type) {
            case 'lead':
              return (
                <p
                  key={idx}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    lineHeight: 1.8,
                    color: 'var(--campaign-accent-2)',
                    backgroundColor: 'var(--color-surface)',
                    borderLeft: '4px solid var(--campaign-accent)',
                    padding: '20px 24px',
                    margin: 0,
                  }}
                >
                  {block.content}
                </p>
              );

            case 'heading':
              return (
                <h2
                  key={idx}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.8rem',
                    color: '#F6F3ED',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '8px',
                    marginTop: '20px',
                  }}
                >
                  {block.content}
                </h2>
              );

            case 'paragraph':
              return <p key={idx} style={{ margin: 0 }}>{block.content}</p>;

            case 'question':
              return (
                <p
                  key={idx}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--campaign-accent-2)',
                    marginTop: '20px',
                    marginBottom: '0',
                    lineHeight: 1.7,
                  }}
                >
                  {block.content}
                </p>
              );

            case 'dialogue': {
              const speaker = getMemberBySlug(block.speakerId || '');
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    borderLeft: `4px solid ${speaker?.colorHex || 'var(--campaign-accent)'}`,
                    padding: '16px 20px',
                    borderRadius: '0 2px 2px 0',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: speaker?.colorHex || 'var(--campaign-accent)',
                      fontWeight: 700,
                      display: 'block',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {speaker ? `${speaker.nameEn} (${speaker.role})` : block.speakerId}
                  </span>
                  <p style={{ margin: 0, color: '#F6F3ED' }}>{block.content}</p>
                </div>
              );
            }

            case 'pullquote':
              return (
                <blockquote
                  key={idx}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.4rem',
                    lineHeight: 1.6,
                    color: 'var(--campaign-accent)',
                    borderTop: '1px solid var(--campaign-accent)',
                    borderBottom: '1px solid var(--campaign-accent)',
                    padding: '24px 16px',
                    margin: '16px 0',
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}
                >
                  “{block.content}”
                </blockquote>
              );

            case 'image':
              return (
                <div key={idx} className="article-inline-image" style={{ margin: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100%', maxWidth: '800px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#05070A' }}>
                    <ResponsivePicture assetId={block.assetId || ''} title={block.caption || ''} aspectRatio="16:9" />
                  </div>
                  {block.caption && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--campaign-accent)', marginTop: '10px', textAlign: 'center' }}>
                      ▲ {block.caption}
                    </p>
                  )}
                </div>
              );

            case 'divider':
              return <hr key={idx} style={{ borderColor: 'var(--color-border)', margin: '20px 0' }} />;

            default:
              return null;
          }
        })}
      </div>

      {/* Related Audio Tracks */}
      {article.relatedTrackIds && article.relatedTrackIds.length > 0 && (
        <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '2px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#F6F3ED', margin: '0 0 16px' }}>
            LISTEN RELATED TRACKS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {article.relatedTrackIds.map((tId) => {
              const track = getRecordingById(tId);
              if (!track) return null;
              return (
                <div key={tId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-surface-elevated)' }}>
                  <div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F6F3ED' }}>{track.title}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--campaign-accent)', marginLeft: '8px' }}>({track.versionLabel})</span>
                  </div>
                  <TrackPlayButton recordingId={track.id} size="small" />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {article.relatedCampaignId && (
        <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--campaign-accent)', padding: '24px', borderRadius: '2px' }}>
          <span className="campaign-tag">RELATED CAMPAIGN</span>
          <div style={{ marginTop: '16px' }}>
            <Link to={`/campaigns/${article.relatedCampaignId}/`} className="btn-primary">
              VIEW {article.relatedCampaignId.toUpperCase()} CAMPAIGN →
            </Link>
          </div>
        </section>
      )}

      {/* Special Story CTA Card */}
      {article.specialStory && (
        <section
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--campaign-accent)',
            padding: '28px 24px',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div>
            <span className="campaign-tag" style={{ backgroundColor: 'var(--campaign-accent)', color: '#08111E' }}>
              {article.specialStory.kicker}
            </span>
          </div>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--campaign-accent)', margin: 0 }}>
            {article.specialStory.subtitle}
          </p>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#F6F3ED', margin: 0 }}>
            {article.specialStory.title}
          </h3>

          <p style={{ fontSize: '0.98rem', color: '#AEB6C4', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
            {article.specialStory.description}
          </p>

          {article.specialStory.pixivUrl ? (
            <a
              href={article.specialStory.pixivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ alignSelf: 'flex-start', marginTop: '8px', textDecoration: 'none' }}
            >
              pixivで読む ➔
            </a>
          ) : null}
        </section>
      )}

      {/* Navigation Footer */}
      <section style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
        <Link to={`/features/${prevArticle.slug}/`} className="btn-secondary">
          ← PREV FEATURE ({prevArticle.kicker})
        </Link>
        <Link to={`/features/${nextArticle.slug}/`} className="btn-secondary">
          NEXT FEATURE ({nextArticle.kicker}) →
        </Link>
      </section>
    </article>
  );
};
