import siteConfigData from '../../content/public/site-config.json';
import membersData from '../../content/public/members.json';
import discographyData from '../../content/public/discography.json';
import articlesData from '../../content/public/articles.json';
import newsData from '../../content/public/news.json';
import assetManifestData from '../../content/public/asset-manifest.json';
import campaignsData from '../../content/public/campaigns.json';
import liveData from '../../content/public/live.json';

import { SiteConfig, Member, Release, Recording, Article, NewsItem, Campaign, LiveArchive } from '../types/content';

export const isStagingEnv = (): boolean => {
  return import.meta.env.VITE_STAGING === 'true' || (typeof window !== 'undefined' && window.location.hostname.includes('staging'));
};

export const getCampaigns = (): Campaign[] => {
  const isStaging = isStagingEnv();
  return (campaignsData as Campaign[]).filter((c) => {
    if (c.status === 'staging' && !isStaging) {
      return false;
    }
    return true;
  });
};

export const getCampaignById = (id: string): Campaign | undefined => {
  const c = (campaignsData as Campaign[]).find((camp) => camp.id === id || camp.slug === id);
  if (!c) return undefined;
  if (c.status === 'staging' && !isStagingEnv()) {
    return undefined;
  }
  return c;
};

export const getCurrentCampaign = (): Campaign => {
  const campaigns = campaignsData as Campaign[];
  const current = campaigns.find((c) => c.status === 'current');
  if (current) return current;
  return campaigns[0];
};

export const getSiteConfig = (): SiteConfig => {
  return siteConfigData as SiteConfig;
};

export const getMembers = (): Member[] => {
  return (membersData as Member[]).filter(
    (m) => m.publication.visibility === 'public' && m.publication.campaignState !== 'future'
  );
};

export const getMemberBySlug = (slug: string): Member | undefined => {
  return getMembers().find((m) => m.slug === slug);
};

export const getReleases = (): Release[] => {
  const isStaging = isStagingEnv();
  return (discographyData.releases as Release[]).filter((r) => {
    if (r.publication.visibility !== 'public') return false;
    if (r.publication.campaignState === 'future') return false;
    if (r.publication.campaignState === 'staging' && !isStaging) return false;
    return true;
  });
};

export const getReleaseBySlug = (slug: string): Release | undefined => {
  const release = (discographyData.releases as Release[]).find((r) => r.slug === slug);
  if (!release || release.publication.visibility !== 'public') return undefined;
  if (release.publication.campaignState === 'staging' && !isStagingEnv()) {
    return undefined;
  }
  return release;
};

export const getReleaseById = (id: string): Release | undefined => {
  return getReleases().find((release) => release.id === id);
};

export const getRecordings = (): Recording[] => {
  return discographyData.recordings as Recording[];
};

export const getJukeboxRecordings = (): Recording[] => {
  return (discographyData.recordings as Recording[]).filter(
    (r) => r.id !== 'solar-no-limits' && r.id !== 'solar-moonlit'
  );
};

export const getRecordingById = (id: string): Recording | undefined => {
  const recording = getRecordings().find((rec) => rec.id === id);
  if (recording || !isStagingEnv()) return recording;
  return (liveData as LiveArchive[])
    .flatMap((archive) => archive.preview?.recordings || [])
    .find((preview) => preview.id === id);
};

export type RecordingArtworkSlot = 'square' | 'vertical';
export type ReleaseArtworkSlot = 'cover' | 'detail' | 'heroDesktop' | 'heroMobile';

export const getRecordingArtworkAssetId = (
  recording: Recording,
  slot: RecordingArtworkSlot,
): string | undefined => {
  if (recording.artwork) return recording.artwork[slot];
  return recording.posterAssetId;
};

export const getReleaseArtworkAssetId = (
  release: Release,
  slot: ReleaseArtworkSlot,
): string | undefined => {
  if (release.artwork) return release.artwork[slot];
  return slot === 'cover' || slot === 'detail' ? release.coverAssetId : undefined;
};

export const getEquinoxRecordingSlug = (recordingId: string): string =>
  recordingId === 'equinox-title' ? 'equinox' : recordingId.replace(/^equinox-/, '');

export const getEquinoxRecordingBySlug = (slug: string): Recording | undefined => {
  return getRecordings().find((recording) => (
    recording.releaseId === 'equinox'
    && getEquinoxRecordingSlug(recording.id) === slug
  ));
};

export const getRecordingsForRelease = (releaseId: string): Recording[] => {
  const release = (discographyData.releases as Release[]).find((r) => r.id === releaseId || r.slug === releaseId);
  if (!release) return [];
  return release.trackIds
    .map((trackId) => getRecordingById(trackId))
    .filter((rec): rec is Recording => rec !== undefined);
};

const getArticlePublicationOrder = (article: Article): [number, number, number, number] => {
  if (article.publication.publishAt) {
    const exact = new Date(article.publication.publishAt);
    if (!Number.isNaN(exact.getTime())) {
      return [exact.getUTCFullYear(), exact.getUTCMonth() + 1, exact.getUTCDate(), exact.getTime()];
    }
  }

  const monthPrecision = /^(\d{4})-(\d{2})$/.exec(article.publishDate);
  if (monthPrecision) return [Number(monthPrecision[1]), Number(monthPrecision[2]), 0, 0];

  const yearPrecision = /^(\d{4})$/.exec(article.publishDate);
  if (yearPrecision) return [Number(yearPrecision[1]), 0, 0, 0];

  return [0, 0, 0, 0];
};

export const getArticles = (): Article[] => {
  const isStaging = isStagingEnv();
  return (articlesData as Article[])
    .filter((a) => {
      if (a.publication.visibility !== 'public') return false;
      if (a.publication.campaignState === 'future') return false;
      if (a.publication.campaignState === 'staging' && !isStaging) return false;
      return true;
    })
    .map((article, originalIndex) => ({ article, originalIndex }))
    .sort((a, b) => {
      const aOrder = getArticlePublicationOrder(a.article);
      const bOrder = getArticlePublicationOrder(b.article);
      for (let index = 0; index < aOrder.length; index += 1) {
        if (aOrder[index] !== bOrder[index]) return bOrder[index] - aOrder[index];
      }
      return a.originalIndex - b.originalIndex;
    })
    .map(({ article }) => article);
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  const a = (articlesData as Article[]).find((art) => art.slug === slug);
  if (!a || a.publication.visibility !== 'public') return undefined;
  if (a.publication.campaignState === 'staging' && !isStagingEnv()) return undefined;
  if (a.publication.campaignState === 'future') return undefined;
  return a;
};

export const getNews = (): NewsItem[] => {
  const isStaging = isStagingEnv();
  return (newsData as NewsItem[])
    .filter((item) => item.publication?.campaignState !== 'staging' || isStaging)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
};

export const getLiveArchives = (): LiveArchive[] => {
  if (!isStagingEnv()) return [];
  return (liveData as LiveArchive[])
    .filter((archive) => (
      archive.publication.visibility === 'public'
      && archive.publication.campaignState === 'staging'
    ))
    .slice()
    .sort((a, b) => a.year - b.year || a.timingLabel.localeCompare(b.timingLabel));
};

export const getLiveArchiveBySlug = (slug: string): LiveArchive | undefined => {
  return getLiveArchives().find((archive) => archive.slug === slug || archive.id === slug);
};

export const getLiveTourLog = (archiveSlug: string, logSlug: string) => {
  const archive = getLiveArchiveBySlug(archiveSlug);
  const log = archive?.tourLogs?.find((item) => item.slug === logSlug);
  return archive && log ? { archive, log } : undefined;
};

export const getAssetManifest = () => assetManifestData;
