import React, { useRef, useEffect } from 'react';
import { EMBER_ASSETS, EmberAssetCode } from './emberAssets';

interface EmberRendererProps {
  assetCode: EmberAssetCode;
  altText: string;
  onClick: (e: React.MouseEvent) => void;
  onError?: () => void;
  onDomSrcChange?: (domSrc: string) => void;
  renderMode?: 'SRC_REPLACE' | 'FRAME_STACK';
  currentListeningMode?: string;
}

export const EmberRenderer: React.FC<EmberRendererProps> = ({
  assetCode,
  altText,
  onClick,
  onError,
  onDomSrcChange,
  renderMode = 'SRC_REPLACE',
  currentListeningMode = 'LISTEN',
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imageUrl = EMBER_ASSETS[assetCode] || EMBER_ASSETS['GE-S01'];

  // Layer 4 Diagnostic Tracker: Read real DOM img.src
  useEffect(() => {
    if (imgRef.current && onDomSrcChange) {
      const src = imgRef.current.src || imageUrl;
      const filename = src.split('/').pop() || src;
      onDomSrcChange(filename);
    }
  }, [assetCode, imageUrl, onDomSrcChange]);

  // Frame Stack Mode Asset sets for Layer 5 Paint Isolation Test
  const frameStackAssets: EmberAssetCode[] =
    currentListeningMode === 'LISTEN'
      ? ['GE-S02', 'GE-S11', 'GE-S12']
      : currentListeningMode === 'DANCE'
      ? ['GE-S04', 'GE-S05', 'GE-S13']
      : currentListeningMode === 'VOCAL'
      ? ['GE-S06', 'GE-S14']
      : currentListeningMode === 'CHILL'
      ? ['GE-S07', 'GE-S15']
      : ['GE-S01', 'GE-S10'];

  return (
    <div
      className="ember-avatar-container"
      onClick={onClick}
      aria-label={altText}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e as any);
        }
      }}
    >
      {renderMode === 'FRAME_STACK' ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {frameStackAssets.map((code) => {
            const isActive = assetCode === code;
            return (
              <img
                key={code}
                src={EMBER_ASSETS[code]}
                alt={altText}
                className="ember-avatar-img"
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: isActive ? 1 : 0,
                  transition: 'none',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
                draggable={false}
              />
            );
          })}
        </div>
      ) : (
        <img
          ref={imgRef}
          src={imageUrl}
          alt={altText}
          className="ember-avatar-img"
          onError={onError}
          draggable={false}
        />
      )}
    </div>
  );
};
