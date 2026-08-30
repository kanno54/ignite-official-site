import React, { useState } from 'react';
import imageDerivativesData from '../../../content/public/image-derivatives.json';
import { getAssetManifest } from '../../utils/contentLoader';
import { AssetPlaceholder } from './AssetPlaceholder';
import { protectedMediaProps } from '../../utils/audioDeterrence';

type Props = {
  assetId?: string;
  title?: string;
  subtitle?: string;
  alt?: string;
  aspectRatio?: '16:9' | '3:4' | '1:1' | '4:5' | '3:2';
  mobileAspectRatio?: '16:9' | '3:4' | '1:1' | '4:5' | '3:2';
  accentColor?: string;
  className?: string;
  mobileAssetId?: string;
  desktopSrc?: string;
  mobileSrc?: string;
  style?: React.CSSProperties;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
  sizes?: string;
};

export const ResponsivePicture: React.FC<Props> = ({
  assetId = '',
  title = 'IGNITE',
  subtitle,
  alt,
  aspectRatio = '16:9',
  mobileAspectRatio,
  accentColor = '#55A8FF',
  className = '',
  mobileAssetId,
  desktopSrc,
  mobileSrc,
  style,
  loading,
  fetchPriority,
  decoding,
  sizes,
}) => {
  const [hasError, setHasError] = useState(false);
  const rawId = React.useId();
  const instanceClass = `rp-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const manifest = getAssetManifest() as any;

  const desktopAsset = desktopSrc
    ? { path: desktopSrc, status: 'ready' }
    : manifest?.images?.[assetId];

  const mobileAsset = mobileSrc
    ? { path: mobileSrc, status: 'ready' }
    : mobileAssetId
    ? manifest?.images?.[mobileAssetId]
    : null;

  const derivativeRegistry = imageDerivativesData as {
    outputDirectory: string;
    profiles: Record<string, { format: string; widths: number[] }>;
    assets: Record<string, string>;
  };
  const derivativeSrcSet = (id?: string, sourcePath?: string) => {
    const profile = derivativeRegistry.profiles[derivativeRegistry.assets[id || '']];
    if (!profile || !sourcePath) return undefined;
    const extensionIndex = sourcePath.lastIndexOf('.');
    const slashIndex = sourcePath.lastIndexOf('/');
    const directory = sourcePath.slice(0, slashIndex);
    const basename = sourcePath.slice(slashIndex + 1, extensionIndex);
    return profile.widths
      .map((width) => `${directory}/${derivativeRegistry.outputDirectory}/${basename}_${width}w.${profile.format} ${width}w`)
      .join(', ');
  };
  const desktopDerivativeSrcSet = desktopSrc ? undefined : derivativeSrcSet(assetId, desktopAsset?.path);
  const mobileDerivativeSrcSet = mobileSrc ? undefined : derivativeSrcSet(mobileAssetId, mobileAsset?.path);
  const desktopDerivativeType = desktopDerivativeSrcSet
    ? `image/${derivativeRegistry.profiles[derivativeRegistry.assets[assetId || '']].format}`
    : undefined;
  const mobileDerivativeType = mobileDerivativeSrcSet
    ? `image/${derivativeRegistry.profiles[derivativeRegistry.assets[mobileAssetId || '']].format}`
    : undefined;

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

  const getPaddingTopVal = (ratioStr: string) => {
    switch (ratioStr) {
      case '16:9': return '56.25%';
      case '3:4': return '133.33%';
      case '1:1': return '100%';
      case '4:5': return '125%';
      case '3:2': return '66.66%';
      default: return '56.25%';
    }
  };

  const desktopPadding = getPaddingTopVal(aspectRatio);
  const effectiveMobileRatio = mobileAspectRatio || (mobileAsset ? '3:4' : aspectRatio);
  const mobilePadding = getPaddingTopVal(effectiveMobileRatio);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
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
    <>
      <style>{`
        .${instanceClass} {
          padding-top: ${mobilePadding};
        }
        @media (min-width: 769px) {
          .${instanceClass} {
            padding-top: ${desktopPadding};
          }
        }
      `}</style>
      <div
        className={`responsive-picture ${instanceClass} ${className}`}
        style={containerStyle}
        onContextMenu={protectedMediaProps.onContextMenu}
        onDragStart={protectedMediaProps.onDragStart}
      >
        <picture style={{ width: '100%', height: '100%', display: 'block' }}>
          {mobileAsset && mobileAsset.status === 'ready' && (
            <>
              {mobileDerivativeSrcSet && <source media="(max-width: 768px)" srcSet={mobileDerivativeSrcSet} sizes={sizes} type={mobileDerivativeType} />}
              <source media="(max-width: 768px)" srcSet={mobileAsset.path} type={getImageType(mobileAsset.path)} />
            </>
          )}
          {desktopDerivativeSrcSet && <source srcSet={desktopDerivativeSrcSet} sizes={sizes} type={desktopDerivativeType} />}
          <source srcSet={desktopAsset.path} type={getImageType(desktopAsset.path)} />
          <img
            src={desktopAsset.path}
            alt={displayAlt}
            loading={loading}
            fetchPriority={fetchPriority}
            decoding={decoding}
            sizes={sizes}
            onError={() => setHasError(true)}
            draggable={false}
            style={imgStyle}
            onContextMenu={protectedMediaProps.onContextMenu}
            onDragStart={protectedMediaProps.onDragStart}
          />
        </picture>
      </div>
    </>
  );
};
