import React from 'react';

type Props = {
  isPlaying: boolean;
  height?: number;
  barWidth?: number;
};

export const EqualizerBars: React.FC<Props> = ({ isPlaying, height = 18, barWidth = 3 }) => {
  const memberColors = [
    '#D62839', // KAI
    '#7B5CFF', // SHO
    '#FF8A24', // LEO
    '#D9B44A', // REN
    '#2450A4', // YUTO
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap: '3px',
        height: `${height}px`,
      }}
      aria-hidden="true"
    >
      {memberColors.map((color, idx) => (
        <span
          key={idx}
          style={{
            width: `${barWidth}px`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '1px',
            boxShadow: isPlaying ? `0 0 6px ${color}` : 'none',
            transformOrigin: 'bottom',
            animation: isPlaying
              ? `eqPulse 0.8s ease-in-out infinite alternate ${idx * 0.15}s`
              : 'none',
            transform: isPlaying ? 'scaleY(0.6)' : 'scaleY(0.2)',
          }}
        />
      ))}
      <style>{`
        @keyframes eqPulse {
          0% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
          100% { transform: scaleY(0.4); }
        }
        @media (prefers-reduced-motion: reduce) {
          .equalizer-bars span { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
