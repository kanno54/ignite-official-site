import React from 'react';

interface EmberSpeechBubbleProps {
  messageText: string;
  onClose: () => void;
  onRestEmber: () => void;
}

export const EmberSpeechBubble: React.FC<EmberSpeechBubbleProps> = ({
  messageText,
  onClose,
  onRestEmber,
}) => {
  return (
    <div className="ember-speech-bubble" role="dialog" aria-label="EMBER TALK">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#EAB308', fontWeight: 700, letterSpacing: '0.1em' }}>
          GUEST EMBER // TALK
        </span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.9rem', padding: '0 2px' }}
          aria-label="Close speech bubble"
        >
          ✕
        </button>
      </div>

      <p style={{ margin: '0 0 12px', color: '#F8FAFC', fontSize: '0.88rem', lineHeight: 1.5 }}>
        {messageText}
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '8px' }}>
        <button
          onClick={onRestEmber}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            textDecoration: 'underline',
            padding: '2px 4px',
          }}
        >
          EMBERを休ませる
        </button>
      </div>
    </div>
  );
};
