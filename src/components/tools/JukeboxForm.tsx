import React, { useState } from 'react';
import { getRecordings, getMemberBySlug } from '../../utils/contentLoader';
import { Recording } from '../../types/content';
import { useAudio } from '../audio/AudioProvider';

type Props = {
  onSelectResult: (recording: Recording, reason: string) => void;
};

export const JukeboxForm: React.FC<Props> = ({ onSelectResult }) => {
  const { playTrack } = useAudio();
  const [selectedMood, setSelectedMood] = useState<string>('火をつけたい');
  const [selectedMember, setSelectedMember] = useState<string>('all');

  const moods = ['火をつけたい', '前へ進みたい', '一緒に騒ぎたい', '朝の光へ戻りたい'];
  const members = [
    { id: 'all', label: 'FIVE MEMBERS' },
    { id: 'kai', label: 'KAI (Red)' },
    { id: 'sho', label: 'SHO (Purple)' },
    { id: 'leo', label: 'LEO (Orange)' },
    { id: 'ren', label: 'REN (Gold)' },
    { id: 'yuto', label: 'YUTO (Blue)' },
  ];

  const handleShuffleAll = () => {
    const allRecordings = getRecordings().filter((r) => r.audioStatus === 'ready');
    if (allRecordings.length === 0) return;

    // Fisher-Yates Shuffle
    const shuffled = [...allRecordings].sort(() => Math.random() - 0.5);
    const firstTrack = shuffled[0];
    const shuffledQueue = shuffled.map((r) => r.id);

    playTrack(firstTrack.id, shuffledQueue, 'jukebox');
    onSelectResult(
      firstTrack,
      `🎲 【全15曲 ランダム連続再生スタート】全15曲をランダムシャッフルしてプレイヤーにセットしました。`
    );
  };

  const handleRecommend = (e: React.FormEvent) => {
    e.preventDefault();

    const allRecordings = getRecordings().filter((r) => r.audioStatus === 'ready');
    
    // Primary Filter: Mood & Member
    let candidates = allRecordings.filter((r) => {
      const matchMood = r.moodTags && r.moodTags.includes(selectedMood);
      const matchMember = selectedMember === 'all' || (r.spotlightMemberIds && r.spotlightMemberIds.includes(selectedMember));
      return matchMood && matchMember;
    });

    // Fallback 1: Mood only
    if (candidates.length === 0) {
      candidates = allRecordings.filter((r) => r.moodTags && r.moodTags.includes(selectedMood));
    }

    // Fallback 2: Random pick
    let chosen = candidates[Math.floor(Math.random() * candidates.length)];
    if (!chosen) {
      chosen = allRecordings.find((r) => r.id === 'no-limits-title') || allRecordings[0];
    }

    let memberName = '5人';
    if (selectedMember !== 'all') {
      const m = getMemberBySlug(selectedMember);
      if (m) memberName = m.nameEn;
    }

    const reason = `今の気分「${selectedMood}」と【${memberName}】のパフォーマンスを体現する、今聴くべき1曲。`;
    
    // Create candidate queue starting with chosen track
    const otherTracks = allRecordings.filter((r) => r.id !== chosen.id).sort(() => Math.random() - 0.5);
    const queue = [chosen.id, ...otherTracks.map((r) => r.id)];
    playTrack(chosen.id, queue, 'jukebox');
    onSelectResult(chosen, reason);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Quick Shuffle All Button */}
      <button
        type="button"
        onClick={handleShuffleAll}
        style={{
          width: '100%',
          padding: '18px 24px',
          backgroundColor: 'var(--campaign-accent)',
          color: 'var(--campaign-on-accent)',
          border: 'none',
          borderRadius: '2px',
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(85, 168, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        <span>🎲 ALL 15 TRACKS SHUFFLE PLAY (全15曲 ランダム連続再生)</span>
      </button>

      <div style={{ textAlign: 'center', color: '#AEB6C4', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
        — OR FILTER BY MOOD & MEMBER —
      </div>

      <form
        onSubmit={handleRecommend}
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          padding: '24px',
          borderRadius: '2px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div>
          <label
            style={{
              fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: 'var(--campaign-accent)',
            display: 'block',
            marginBottom: '12px',
          }}
        >
          1. 今の気分は？
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
          {moods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMood(m)}
              style={{
                padding: '12px',
                backgroundColor: selectedMood === m ? 'var(--campaign-deep)' : 'var(--color-surface-elevated)',
                border: selectedMood === m ? '1px solid var(--campaign-accent)' : '1px solid var(--color-border)',
                color: selectedMood === m ? 'var(--campaign-accent-2)' : 'var(--color-text)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: selectedMood === m ? 700 : 400,
                borderRadius: '2px',
                textAlign: 'center',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: 'var(--campaign-accent)',
            display: 'block',
            marginBottom: '12px',
          }}
        >
          2. 誰の声／パフォーマンスを追いたい？
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
          {members.map((mem) => (
            <button
              key={mem.id}
              type="button"
              onClick={() => setSelectedMember(mem.id)}
              style={{
                padding: '10px',
                backgroundColor: selectedMember === mem.id ? 'var(--campaign-deep)' : 'var(--color-surface-elevated)',
                border: selectedMember === mem.id ? '1px solid var(--campaign-accent)' : '1px solid var(--color-border)',
                color: selectedMember === mem.id ? 'var(--campaign-accent-2)' : 'var(--color-text)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                borderRadius: '2px',
                textAlign: 'center',
              }}
            >
              {mem.label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
        SELECT TRACK NOW ▶
      </button>
    </form>
  </div>
  );
};
