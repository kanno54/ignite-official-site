import { ListeningMode } from '../../types/ember';

export const EMBER_ASSETS = {
  // IDLE Group
  'GE-S01': '/assets/images/ember/GE-S01.png', // IDLE BASE
  'GE-S10': '/assets/images/ember/GE-S10.png', // IDLE BLINK

  // LISTEN Group
  'GE-S02': '/assets/images/ember/GE-S02.png', // LISTEN CENTER
  'GE-S11': '/assets/images/ember/GE-S11.png', // LISTEN SWAY LEFT
  'GE-S12': '/assets/images/ember/GE-S12.png', // LISTEN SWAY RIGHT

  // TALK Group
  'GE-S03': '/assets/images/ember/GE-S03.png', // TALK

  // DANCE Group
  'GE-S04': '/assets/images/ember/GE-S04.png', // DANCE A
  'GE-S05': '/assets/images/ember/GE-S05.png', // DANCE B
  'GE-S13': '/assets/images/ember/GE-S13.png', // DANCE C

  // VOCAL Group
  'GE-S06': '/assets/images/ember/GE-S06.png', // VOCAL BASE
  'GE-S14': '/assets/images/ember/GE-S14.png', // VOCAL SOFT

  // CHILL Group
  'GE-S07': '/assets/images/ember/GE-S07.png', // CHILL BASE
  'GE-S15': '/assets/images/ember/GE-S15.png', // CHILL SOFT

  // EVENT Group
  'GE-S08': '/assets/images/ember/GE-S08.png', // SLEEPY
  'GE-S09': '/assets/images/ember/GE-S09.png', // PEEK / RESTING

  // BURN Group
  'GE-X01': '/assets/images/ember/GE-X01.png', // BURN HEY
  'GE-X02': '/assets/images/ember/GE-X02.png', // BURN YEAH
  'GE-X03': '/assets/images/ember/GE-X03.png', // BURN STRONG
} as const;

export type EmberAssetCode = keyof typeof EMBER_ASSETS;

// Track preloaded image objects in memory to avoid flash / blank frames
const preloadedMap = new Set<string>();

export const preloadAsset = (code: EmberAssetCode): Promise<void> => {
  const url = EMBER_ASSETS[code];
  if (!url || preloadedMap.has(url)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      preloadedMap.add(url);
      resolve();
    };
    img.onerror = () => {
      resolve(); // resolve anyway so execution isn't blocked
    };
  });
};

// Initial preload set (GE-S01, GE-S10, GE-S03)
export const preloadInitialEmberAssets = () => {
  preloadAsset('GE-S01');
  preloadAsset('GE-S10');
  preloadAsset('GE-S03');
};

// Preload specific mode assets on demand
export const preloadModeAssets = (mode: ListeningMode) => {
  switch (mode) {
    case 'LISTEN':
      preloadAsset('GE-S02');
      preloadAsset('GE-S11');
      preloadAsset('GE-S12');
      break;
    case 'DANCE':
      preloadAsset('GE-S04');
      preloadAsset('GE-S13');
      preloadAsset('GE-S05');
      break;
    case 'VOCAL':
      preloadAsset('GE-S06');
      preloadAsset('GE-S14');
      break;
    case 'CHILL':
      preloadAsset('GE-S07');
      preloadAsset('GE-S15');
      break;
  }
};

export const preloadBurnAssets = () => {
  preloadAsset('GE-X01');
  preloadAsset('GE-X02');
  preloadAsset('GE-X03');
};
