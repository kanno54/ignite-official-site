import React, { useState } from 'react';
import { FiveLights } from '../components/common/FiveLights';
import { JukeboxForm } from '../components/tools/JukeboxForm';
import { JukeboxResult } from '../components/tools/JukeboxResult';
import { EmberPassForm } from '../components/tools/EmberPassForm';
import { EmberPassCard } from '../components/tools/EmberPassCard';
import { Recording } from '../types/content';

export const FunPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jukebox' | 'pass'>('jukebox');
  const [jukeboxResult, setJukeboxResult] = useState<{ recording: Recording; reason: string } | null>(null);
  const [passData, setPassData] = useState<{ name: string; favoriteMemberId: string } | null>(null);

  return (
    <div style={{ maxWidth: 'var(--article-content)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <FiveLights height={20} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', margin: '8px 0', color: '#F6F3ED' }}>
          FUN & DIGITAL PASS
        </h1>
        <p style={{ fontSize: '1rem', color: '#AEB6C4', lineHeight: 1.6, margin: 0 }}>
          気分から楽曲を引く「IGNITE JUKEBOX」と、あなただけの「EMBER DIGITAL PASS」を作成。
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={() => setActiveTab('jukebox')}
          style={{
            flex: 1,
            padding: '16px',
            backgroundColor: activeTab === 'jukebox' ? 'var(--campaign-accent)' : 'var(--color-surface)',
            color: activeTab === 'jukebox' ? 'var(--campaign-on-accent)' : '#F6F3ED',
            border: activeTab === 'jukebox' ? 'none' : '1px solid var(--color-border)',
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            fontWeight: 700,
            borderRadius: '2px',
          }}
        >
          ♫ IGNITE JUKEBOX
        </button>

        <button
          onClick={() => setActiveTab('pass')}
          style={{
            flex: 1,
            padding: '16px',
            backgroundColor: activeTab === 'pass' ? 'var(--campaign-accent)' : 'var(--color-surface)',
            color: activeTab === 'pass' ? 'var(--campaign-on-accent)' : '#F6F3ED',
            border: activeTab === 'pass' ? 'none' : '1px solid var(--color-border)',
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            fontWeight: 700,
            borderRadius: '2px',
          }}
        >
          ✦ EMBER DIGITAL PASS
        </button>
      </div>

      {/* Tool Content */}
      {activeTab === 'jukebox' ? (
        <div>
          {jukeboxResult ? (
            <JukeboxResult
              recording={jukeboxResult.recording}
              reason={jukeboxResult.reason}
              onReset={() => setJukeboxResult(null)}
            />
          ) : (
            <JukeboxForm
              onSelectResult={(recording, reason) => setJukeboxResult({ recording, reason })}
            />
          )}
        </div>
      ) : (
        <div>
          {passData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
              <EmberPassCard name={passData.name} favoriteMemberId={passData.favoriteMemberId} />
              <button onClick={() => setPassData(null)} className="btn-secondary">
                RE-EDIT PASS NAME / ACCENT ✎
              </button>
            </div>
          ) : (
            <EmberPassForm
              onGenerate={(name, favoriteMemberId) => setPassData({ name, favoriteMemberId })}
            />
          )}
        </div>
      )}
    </div>
  );
};
