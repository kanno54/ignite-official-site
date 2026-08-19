import React from 'react';
import { EMBER_ASSETS, EmberAssetCode } from './emberAssets';

interface EmberRendererProps {
  assetCode: EmberAssetCode;
  altText: string;
  onClick: (e: React.MouseEvent) => void;
  onError?: () => void;
}

export const EmberRenderer: React.FC<EmberRendererProps> = ({
  assetCode,
  altText,
  onClick,
  onError,
}) => {
  const imageUrl = EMBER_ASSETS[assetCode] || EMBER_ASSETS['GE-S01'];

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
      <img
        src={imageUrl}
        alt={altText}
        className="ember-avatar-img"
        onError={onError}
        draggable={false}
      />
    </div>
  );
};
