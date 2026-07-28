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

  const desktopAsset = desktopSrc
    ? { path: desktopSrc, status: 'ready' }
    : manifest?.images?.[assetId];

  const mobileAsset = mobileSrc
    ? { path: mobileSrc, status: 'ready' }
    : mobileAssetId
    ? manifest?.images?.[mobileAssetId]
    : null;

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
    ...style,
  };

  const imgStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    ...protectedMediaProps.style,
  };

  const getImageType = (pathStr?: string) => {
    if (!pathStr) return undefined;
    if (pathStr.endsWith('.webp')) return 'image/webp';
    if (pathStr.endsWith('.png')) return 'image/png';
    if (pathStr.endsWith('.jpg') || pathStr.endsWith('.jpeg')) return 'image/jpeg';
    return undefined;
  };

  const displayAlt = alt || title;

  return (
    <div
      className={`responsive-picture ${className}`}
      style={containerStyle}
      onContextMenu={protectedMediaProps.onContextMenu}
      onDragStart={protectedMediaProps.onDragStart}
    >
      <picture style={{ width: '100%', height: '100%', display: 'block' }}>
        {mobileAsset && mobileAsset.status === 'ready' && (
          <source media="(max-width: 768px)" srcSet={mobileAsset.path} type={getImageType(mobileAsset.path)} />
        )}
        <source srcSet={desktopAsset.path} type={getImageType(desktopAsset.path)} />
        <img
          src={desktopAsset.path}
          alt={displayAlt}
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
