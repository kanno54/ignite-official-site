export type Publication = {
  fictionalReleaseDate: string;
  publishAt: string | null;
  visibility: 'draft' | 'scheduled' | 'public' | 'archived';
  campaignState: 'past' | 'current' | 'future';
};

export type SiteConfig = {
  fictionalCurrentDate: string;
  currentCampaign: string;
  latestReleaseId: string;
  pickUpTrackId: string;
  group: {
    name: string;
    japaneseName: string;
    debutYear: string;
    majorDebutYear: string;
    memberCount: number;
    catchphraseEn: string;
    catchphraseJa: string;
    fanName: string;
    memberOrder: string[];
  };
  brandTokens: Record<string, string>;
  campaignSkin: {
    campaign: string;
    accent: string;
    accentLight: string;
    deep: string;
    white: string;
    onAccent: string;
    heroEyebrow: string;
    heroTitle: string;
    heroCopy: string;
    primaryCta: string;
    secondaryCta: string;
  };
  featureFlags: Record<string, boolean>;
};

export type Member = {
  id: string;
  slug: string;
  nameEn: string;
  nameJa: string;
  role: string;
  colorHex: string;
  colorName: string;
  height: string;
  shortCopy: string;
  biography: string;
  origin: string;
  turningPoint: string;
  currentChapter: string;
  stageStrengths: string[];
  signaturePerformance: string;
  featuredTrackIds: string[];
  avatarAssetId: string;
  profileImageAssetId: string;
  publication: Publication;
};

export type LyricLine = {
  speaker: string;
  text: string;
};

export type Recording = {
  id: string;
  releaseId: string;
  title: string;
  versionLabel: string;
  trackNumber: number;
  durationSeconds: number;
  audioUrl: string;
  audioStatus: 'ready' | 'pending';
  spotlightMemberIds: string[];
  moodTags: string[];
  linerNotes: string;
  lyrics: LyricLine[];
  posterAssetId?: string;
};

export type Release = {
  id: string;
  slug: string;
  title: string;
  format: string;
  fictionalReleaseDate: string;
  fictionalReleaseDateFull: string;
  coverAssetId: string;
  description: string;
  linerNotes: string;
  trackIds: string[];
  campaignState: 'past' | 'current' | 'future';
  publication: Publication;
};

export type ArticleBlock = {
  type: 'lead' | 'heading' | 'paragraph' | 'dialogue' | 'pullquote' | 'image' | 'divider' | 'question';
  content?: string;
  speakerId?: string;
  assetId?: string;
  caption?: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  dek: string;
  publishDate: string;
  publishDateFull: string;
  readingTimeMinutes: number;
  mainSpeakerIds: string[];
  heroAssetId: string;
  relatedTrackIds: string[];
  blocks: ArticleBlock[];
  publication: Publication;
};

export type NewsItem = {
  id: string;
  date: string;
  category: string;
  title: string;
  url: string;
};
