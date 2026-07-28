import React, { useState } from 'react';
import { getAssetManifest } from '../../utils/contentLoader';
import { AssetPlaceholder } from './AssetPlaceholder';
import { protectedMediaProps } from '../../utils/audioDeterrence';

type Props = {
  assetId?: string;
  title?: string;
  subtitle?: string;
  alt?: string;
  aspectRatio?: '16:9' | '3:4' | '1:1' | '4:5' | '3:2';
  accentColor?: string;
  className?: string;
  mobileAssetId?: string;
  desktopSrc?: string;
  mobileSrc?: string;
  style?: React.CSSProperties;
};

export const ResponsivePicture: React.FC<Props> = ({
  assetId = '',
  title = 'IGNITE',
  subtitle,
  alt,
  aspectRatio = '16:9',
  accentColor = '#55A8FF',
  className = '',
  mobileAssetId,
  desktopSrc,
  mobileSrc,
  style,
}) => {
  const [hasError, setHasError] = useState(false);
  const manifest = getAssetManifest() as any;

  // Direct src override
  if (desktopSrc) {
    const displayAlt = alt || title;
    const combinedStyle: React.CSSProperties = {
      ...protectedMediaProps.style,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      ...style,
    };
    return (
      <picture className={className} style={{ width: '100%', height: '100%', display: 'block' }}>
        {mobileSrc && <source media="(max-width: 640px)" srcSet={mobileSrc} />}
        <img
          src={desktopSrc}
          alt={displayAlt}
          onContextMenu={protectedMediaProps.onContextMenu}
          onDragStart={protectedMediaProps.onDragStart}
          draggable={protectedMediaProps.draggable}
          style={combinedStyle}
          onError={() => setHasError(true)}
        />
      </picture>
    );
  }

  const desktopAsset = manifest?.images?.[assetId];
  const mobileAsset = mobileAssetId ? manifest?.images?.[mobileAssetId] : null;

  const isReady = desktopAsset && desktopAsset.status === 'ready' && !hasError;

  if (!isReady) {
    return (
      <AssetPlaceholder
        title={title}
        subtitle={subtitle}
        aspectRatio={aspectRatio}
        accentColor={accentColor}
        className={className}
      />
    );
  }

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

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingTop: getPaddingTop(),
    backgroundColor: '#11151D',
    borderRadius: '2px',
    overflow: 'hidden',
    border: '1px solid #2A303C',
    ...protectedMediaProps.style,
  };

  const imgStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    ...protectedMediaProps.style,
  };

  return (
    <div
      className={`responsive-picture ${className}`}
      style={containerStyle}
      onContextMenu={protectedMediaProps.onContextMenu}
      onDragStart={protectedMediaProps.onDragStart}
    >
      <picture>
        {mobileAsset && mobileAsset.status === 'ready' && (
          <source media="(max-width: 768px)" srcSet={mobileAsset.path} type="image/webp" />
        )}
        <source srcSet={desktopAsset.path} type="image/webp" />
        <img
          src={desktopAsset.path}
          alt={title}
          onError={() => setHasError(true)}
          draggable={false}
          style={imgStyle}
          onContextMenu={protectedMediaProps.onContextMenu}
          onDragStart={protectedMediaProps.onDragStart}
        />
      </picture>
    </div>
  );
};
