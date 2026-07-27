import React from 'react';

type Props = {
  assetId?: string;
  mobileAssetId?: string;
  title: string;
  subtitle?: string;
  aspectRatio?: string; // "16:9" | "3:4" | "1:1" | "4:5" | "3:2"
  accentColor?: string;
  className?: string;
};

export const AssetPlaceholder: React.FC<Props> = ({
  title,
  subtitle,
  aspectRatio = '16:9',
  accentColor = '#55A8FF',
  className = '',
}) => {
  const getPaddingTop = () => {
    switch (aspectRatio) {
      case '16:9': return '56.25%';
      case '3:4': return '133.33%';
      case '1:1': return '100%';
      case '4:5': return '125%';
      case '3:2': return '66.66%';
      default: return '56.25%';
    }
  };

  return (
    <div
      className={`asset-placeholder ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: getPaddingTop(),
        backgroundColor: '#11151D',
        border: '1px solid #2A303C',
        borderRadius: '2px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          textAlign: 'center',
          background: `radial-gradient(circle at center, ${accentColor}15 0%, transparent 70%), linear-gradient(180deg, #11151D 0%, #080A0F 100%)`,
        }}
      >
        {/* Five Lights Motif */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {['#D62839', '#7B5CFF', '#FF8A24', '#D9B44A', '#2450A4'].map((color, idx) => (
            <span
              key={idx}
              style={{
                width: '3px',
                height: '18px',
                backgroundColor: color,
                borderRadius: '1px',
                boxShadow: `0 0 8px ${color}`,
              }}
            />
          ))}
        </div>

        <span
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '1.4rem',
            letterSpacing: '0.08em',
            color: '#F6F3ED',
            lineHeight: 1.2,
          }}
        >
          {title}
        </span>

        {subtitle && (
          <span
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '0.75rem',
              color: '#AEB6C4',
              marginTop: '6px',
              letterSpacing: '0.05em',
            }}
          >
            {subtitle}
          </span>
        )}

        <span
          style={{
            marginTop: '10px',
            padding: '2px 8px',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${accentColor}40`,
            borderRadius: '2px',
            fontSize: '0.65rem',
            color: accentColor,
            fontFamily: '"IBM Plex Mono", monospace',
          }}
        >
          OFFICIAL ASSET PLACEHOLDER
        </span>
      </div>
    </div>
  );
};
