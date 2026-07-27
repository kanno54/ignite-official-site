import React, { useState } from 'react';
import { getMembers } from '../../utils/contentLoader';

type Props = {
  onGenerate: (name: string, favoriteMemberId: string) => void;
};

export const EmberPassForm: React.FC<Props> = ({ onGenerate }) => {
  const members = getMembers();
  const [name, setName] = useState('');
  const [favoriteMemberId, setFavoriteMemberId] = useState('kai');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().normalize('NFKC').slice(0, 20);
    if (!cleanName) return;
    onGenerate(cleanName, favoriteMemberId);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '24px',
        borderRadius: '2px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div>
        <label
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: 'var(--campaign-accent)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          DISPLAY NAME (1–20文字)
        </label>
        <input
          type="text"
          maxLength={20}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="EMBER NAME"
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#080A0F',
            border: '1px solid var(--color-border)',
            color: '#F6F3ED',
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            borderRadius: '2px',
          }}
        />
        <p style={{ fontSize: '0.75rem', color: '#AEB6C4', marginTop: '6px', margin: 0 }}>
          ※ 入力内容はこの端末（ブラウザ）内だけで保持され、サーバーへ送信されることはありません。
        </p>
      </div>

      <div>
        <label
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: 'var(--campaign-accent)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          FAVORITE MEMBER ACCENT
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setFavoriteMemberId(m.id)}
              style={{
                padding: '10px',
                backgroundColor: favoriteMemberId === m.id ? `${m.colorHex}25` : 'var(--color-surface-elevated)',
                border: favoriteMemberId === m.id ? `2px solid ${m.colorHex}` : '1px solid var(--color-border)',
                color: favoriteMemberId === m.id ? '#FFF' : '#AEB6C4',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                borderRadius: '2px',
              }}
            >
              {m.nameEn}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
        GENERATE DIGITAL PASS ✦
      </button>
    </form>
  );
};
