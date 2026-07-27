import React from 'react';
import { Link } from 'react-router-dom';
import { getMembers } from '../utils/contentLoader';
import { ResponsivePicture } from '../components/common/ResponsivePicture';
import { FiveLights } from '../components/common/FiveLights';

export const MembersIndex: React.FC = () => {
  const members = getMembers();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <FiveLights height={20} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', margin: '8px 0', color: '#F6F3ED' }}>
          MEMBERS
        </h1>
        <p style={{ fontSize: '1rem', color: '#AEB6C4', maxWidth: '700px', lineHeight: 1.6, margin: 0 }}>
          身体表現を軸に歌唱・ダンス・フォーメーションを一体として見せる5人のパフォーマー。個々の熱と個性がステージ上で一つに合わさる。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {members.map((m) => (
          <Link
            key={m.id}
            to={`/members/${m.slug}/`}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '2px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease',
            }}
          >
            <ResponsivePicture assetId={m.avatarAssetId} title={m.nameEn} subtitle={m.role} aspectRatio="1:1" accentColor={m.colorHex} />
            <div style={{ padding: '20px', borderTop: `4px solid ${m.colorHex}`, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: m.colorHex, fontWeight: 600 }}>
                  {m.colorName.toUpperCase()} — {m.role}
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: '4px 0 8px', color: '#F6F3ED' }}>
                  {m.nameEn} ({m.nameJa})
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#AEB6C4', lineHeight: 1.5, margin: 0 }}>
                  {m.shortCopy}
                </p>
              </div>

              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--campaign-accent)', marginTop: '16px' }}>
                VIEW PROFILE ➔
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
