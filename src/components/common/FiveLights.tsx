import React from 'react';

type Props = {
  height?: number;
  gap?: number;
  className?: string;
};

export const FiveLights: React.FC<Props> = ({ height = 20, gap = 6, className = '' }) => {
  const colors = [
    { name: 'KAI', hex: '#D62839' },
    { name: 'SHO', hex: '#7B5CFF' },
    { name: 'LEO', hex: '#FF8A24' },
    { name: 'REN', hex: '#D9B44A' },
    { name: 'YUTO', hex: '#2450A4' },
  ];

  return (
    <div
      className={`five-lights ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: `${gap}px` }}
      aria-label="Five Lights Motif"
    >
      {colors.map((c) => (
        <span
          key={c.name}
          title={c.name}
          style={{
            width: '3px',
            height: `${height}px`,
            backgroundColor: c.hex,
            borderRadius: '1px',
            boxShadow: `0 0 8px ${c.hex}`,
          }}
        />
      ))}
    </div>
  );
};
