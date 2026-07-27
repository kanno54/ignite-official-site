import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getMemberBySlug, getMembers, getRecordingById, getArticles } from '../utils/contentLoader';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { TrackPlayButton } from '../components/audio/TrackPlayButton';

export const MemberDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const member = getMemberBySlug(slug || '');
  const allMembers = getMembers();

  if (!member) {
    return <Navigate to="/members/" replace />;
  }

  const memberIndex = allMembers.findIndex((m) => m.id === member.id);
  const prevMember = allMembers[(memberIndex - 1 + allMembers.length) % allMembers.length];
  const nextMember = allMembers[(memberIndex + 1) % allMembers.length];

  const relatedArticles = getArticles().filter((a) => a.mainSpeakerIds.includes(member.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      {/* 1. Large Profile Hero */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          padding: '40px',
          borderRadius: '2px',
          borderLeft: `6px solid ${member.colorHex}`,
        }}
      >
        <div>
          <ResponsivePicture
            assetId={member.profileImageAssetId}
            title={member.nameEn}
            subtitle={`${member.role} — ${member.colorName}`}
            aspectRatio="4:5"
            accentColor={member.colorHex}
          />
        </div>

        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: member.colorHex, fontWeight: 700 }}>
            {member.colorName.toUpperCase()} // {member.height}
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 5rem)', margin: '4px 0 8px', color: '#F6F3ED' }}>
            {member.nameEn}
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--campaign-accent)', margin: '0 0 16px' }}>
            {member.nameJa} — {member.role}
          </p>

          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#F6F3ED', fontWeight: 500 }}>
            {member.biography}
          </p>
        </div>
      </section>

      {/* 2. Chapters: Origin / Turning Point / Current Chapter */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '2px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--campaign-accent)' }}>CHAPTER 01</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#F6F3ED', margin: '4px 0 12px' }}>ORIGIN</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#AEB6C4', margin: 0 }}>{member.origin}</p>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '2px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--campaign-accent)' }}>CHAPTER 02</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#F6F3ED', margin: '4px 0 12px' }}>TURNING POINT</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#AEB6C4', margin: 0 }}>{member.turningPoint}</p>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '2px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--campaign-accent)' }}>CHAPTER 03</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#F6F3ED', margin: '4px 0 12px' }}>CURRENT CHAPTER</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#AEB6C4', margin: 0 }}>{member.currentChapter}</p>
        </div>
      </section>

      {/* 3. Stage Strengths & Signature Performance */}
      <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '32px', borderRadius: '2px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#F6F3ED', margin: '0 0 20px' }}>
          STAGE PERFORMANCE & STRENGTHS
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: member.colorHex, margin: '0 0 12px' }}>
              KEY STRENGTHS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {member.stageStrengths.map((str, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: '#F6F3ED' }}>
                  <span style={{ color: member.colorHex }}>◆</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: member.colorHex, margin: '0 0 12px' }}>
              SIGNATURE PERFORMANCE
            </h4>
            <div style={{ backgroundColor: 'var(--color-surface-elevated)', border: `1px solid ${member.colorHex}40`, padding: '16px', borderRadius: '2px' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#F6F3ED', margin: 0 }}>
                {member.signaturePerformance}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Public Featured Tracks */}
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#F6F3ED', margin: '0 0 20px' }}>
          SPOTLIGHT TRACKS
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {member.featuredTrackIds.map((trackId) => {
            const track = getRecordingById(trackId);
            if (!track) return null;
            return (
              <div
                key={trackId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  padding: '16px 24px',
                  borderRadius: '2px',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: member.colorHex }}>
                    FEATURED VOCAL / PERFORMANCE
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', margin: '2px 0 0', color: '#F6F3ED' }}>
                    {track.title} <span style={{ fontSize: '0.85rem', color: 'var(--campaign-accent)', fontWeight: 400 }}>({track.versionLabel})</span>
                  </h4>
                </div>
                <TrackPlayButton recordingId={track.id} size="medium" />
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Related Articles */}
      {relatedArticles.length > 0 && (
        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#F6F3ED', margin: '0 0 20px' }}>
            RELATED INTERVIEWS
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {relatedArticles.map((art) => (
              <Link
                key={art.id}
                to={`/features/${art.slug}/`}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  padding: '20px',
                  borderRadius: '2px',
                }}
              >
                <span className="campaign-tag">{art.kicker}</span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: '10px 0 6px', color: '#F6F3ED' }}>
                  {art.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#AEB6C4', margin: 0 }}>{art.dek}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. Member Navigation Footer */}
      <section style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
        <Link to={`/members/${prevMember.slug}/`} className="btn-secondary">
          ← PREV MEMBER ({prevMember.nameEn})
        </Link>
        <Link to={`/members/${nextMember.slug}/`} className="btn-secondary">
          NEXT MEMBER ({nextMember.nameEn}) →
        </Link>
      </section>
    </div>
  );
};
