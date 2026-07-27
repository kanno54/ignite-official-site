import React from 'react';
import { Link } from 'react-router-dom';
import { FiveLights } from '../components/common/FiveLights';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ padding: '80px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <FiveLights height={28} gap={8} />
      <span className="campaign-tag">ERROR 404</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 6rem)', margin: 0, color: '#F6F3ED' }}>
        PAGE NOT FOUND
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#AEB6C4', maxWidth: '500px', lineHeight: 1.6, margin: 0 }}>
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link to="/" className="btn-primary" style={{ marginTop: '16px' }}>
        RETURN TO TOP PAGE ➔
      </Link>
    </div>
  );
};
