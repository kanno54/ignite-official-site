export type Publication = {
  fictionalReleaseDate: string;
  publishAt: string | null;
  visibility: 'draft' | 'scheduled' | 'public' | 'archived';
  campaignState: 'past' | 'current' | 'future' | 'staging';
};

export type SiteConfig = {
  siteUrl: string;
  canonicalUrl: string;
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
  coverImage?: string;
  artwork?: {
    square: string;
    vertical: string;
  };
  romanNumeral?: string;
};

export type Release = {
  id: string;
  slug: string;
  title: string;
  format: string;
  fictionalReleaseDate: string;
  fictionalReleaseDateFull: string;
  coverAssetId: string;
  coverImage?: string;
  artwork?: {
    cover: string;
    detail: string;
    heroDesktop: string;
    heroMobile: string;
  };
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

export type SpecialStoryCTA = {
  kicker: string;
  subtitle: string;
  title: string;
  description: string;
  pixivUrl?: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  dek: string;
  category?: string;
  publishDate: string;
  publishDateFull: string;
  publishedAt?: string;
  storyDate?: string;
  storyDateFull?: string;
  era?: string;
  eraLabel?: string;
  series?: string;
  format?: string;
  interviewee?: string;
  heroCopy?: string;
  heroAlt?: string;
  heroImage?: string;
  readingTimeMinutes: number;
  mainSpeakerIds: string[];
  heroAssetId: string;
  relatedTrackIds: string[];
  relatedCampaignId?: string;
  blocks: ArticleBlock[];
  publication: Publication;
  specialStory?: SpecialStoryCTA;
};

export type CampaignCTA = {
  text: string;
  action: 'play' | 'link';
  url?: string;
};

export type CampaignTimelineItem = {
  date: string;
  title: string;
  body: string;
};

export type Campaign = {
  id: string;
  slug?: string;
  shortTitle?: string;
  status: 'current' | 'past' | 'archived' | 'staging';
  releaseId: string;
  releaseDate: string;
  archiveOrderDate?: string;
  eyebrow: string;
  title: string;
  catchCopy: string;
  headline?: string;
  subheadline?: string;
  desktopHero: string;
  mobileHero: string;
  heroAlt?: string;
  primaryCta: CampaignCTA;
  secondaryCta: CampaignCTA;
  campaignColors: {
    accent: string;
    deep: string;
    text: string;
  };
  relatedArticleIds: string[];
  introduction?: {
    heading: string;
    body: string;
  };
  creationBackground?: {
    heading: string;
    subtitle?: string;
    body: string;
  };
  timelineHeading?: string;
  timelineSubtitle?: string;
  timeline?: CampaignTimelineItem[];
  commentary?: {
    heading: string;
    body: string;
  };
  comparison?: {
    heading: string;
    subtitle: string;
    indies: {
      title: string;
      subtitle: string;
      body: string;
    };
    major: {
      title: string;
      subtitle: string;
      body: string;
    };
  };
  performance?: {
    heading: string;
    subtitle: string;
    body: string;
    elements?: string[];
  };
  focusSection?: {
    eyebrow: string;
    heading: string;
    subtitle?: string;
    body: string;
    link?: {
      text: string;
      url: string;
    };
  };
  vocalFocus?: {
    eyebrow: string;
    heading: string;
    subtitle?: string;
    yuto: {
      label: string;
      body: string;
    };
    ren: {
      label: string;
      body: string;
    };
    link?: {
      text: string;
      url: string;
    };
  };
  memberRoles?: {
    eyebrow: string;
    heading: string;
    subtitle?: string;
    roles: Array<{
      name: string;
      role: string;
      desc: string;
    }>;
  };
  bannerCopy?: string;
  trackOverview?: {
    eyebrow: string;
    heading: string;
    subtitle?: string;
    items: Array<{
      trackNo: string;
      title: string;
      subtitle: string;
      desc: string;
    }>;
  };
  trackDescriptions?: Record<string, string>;
  relatedCampaignIds?: string[];
  threeWays?: {
    eyebrow: string;
    heading: string;
    items: Array<{
      category: string;
      title: string;
      body: string;
      links?: Array<{
        text: string;
        url: string;
      }>;
    }>;
  };
  oneDayTwelveTracks?: {
    eyebrow: string;
    heading: string;
    items: Array<{
      timeSlot: string;
      title: string;
      body: string;
    }>;
  };
};

export type NewsItem = {
  id: string;
  date: string;
  category: string;
  title: string;
  url: string;
  description?: string;
  ctaLabel?: string;
  imageAssetId?: string;
  publication?: Publication;
};

export type LiveArchiveDocument = {
  label: string;
  sourceAssetCode: string;
  markdown: string;
  imageAssetId?: string;
};

export type LiveArchiveTrackReference = {
  trackNumber?: number;
  title: string;
  section: string | null;
  note: string | null;
};

export type LiveTourLog = {
  slug: string;
  title: string;
  city: string;
  leg: string | null;
  venue: string;
  dateRange: { start: string; end: string };
  sourceAssetCode: string;
  sourceVersion?: number;
  progressLabel?: string;
  keyMoments?: string[];
  markdown: string;
  heroAssetId: string;
  galleryAssetIds: string[];
};

export type LivePreviewRecording = Recording & {
  publicationState: 'PREVIEW';
  relation: 'PREVIEW';
  provenance: 'UNSPECIFIED';
  source: {
    campaignId: 'live-album-2024';
    audioAssetCode: string;
    audioVersionId: string;
    audioSha256: string;
    teaserAssetCode: string;
    teaserVersionId: string;
    teaserSha256: string;
  };
};

export type LiveArchive = {
  id: string;
  slug: string;
  year: number;
  timingLabel: string;
  title: string;
  eventTitle: string;
  subtitle: string;
  archiveRole: 'FULL' | 'COMPACT' | 'COMPLETE';
  heroDesktopAssetId: string;
  heroMobileAssetId: string;
  logoAssetId?: string;
  compactLogoAssetId?: string;
  ogAssetId?: string;
  stageConceptAssetId?: string;
  costumeAssetId?: string;
  chapterVisuals?: Array<{ id: string; title: string; assetId: string }>;
  galleryAssetIds: string[];
  documents: LiveArchiveDocument[];
  schedule?: {
    cityCount: number;
    showCount: number;
    start: string;
    end: string;
    sourceAssetCode: string;
    shows: Array<{
      stop: string;
      city: string;
      leg: string | null;
      venue: string;
      date: string;
      weekday: string;
      show: string;
      status: string | null;
    }>;
  };
  setlist: {
    display: boolean;
    status: string;
    displayLabel: string;
    showTrackNumbers?: boolean;
    tracks: LiveArchiveTrackReference[];
    sourceAssetCode?: string;
  };
  tourLogs?: LiveTourLog[];
  preview?: {
    eyebrow: string;
    title: string;
    copy: string;
    sourceAssetCode: string;
    formalReleaseRoute: string | null;
    recordings: LivePreviewRecording[];
  };
  relatedReleaseIds: string[];
  relatedRecordingIds: string[];
  source: {
    campaignId: string;
    packageId: string;
    packageGeneratedAt: string;
    selectedAssetCodes: string[];
    publicVisualAssetIds: string[];
    auditCsv?: string;
    excludedReferenceAssetCodes?: string[];
    selectedCorrections?: Array<{
      assetCode: string;
      versionId: string;
      versionNo: number;
      sha256: string;
    }>;
  };
  publication: Publication;
};
