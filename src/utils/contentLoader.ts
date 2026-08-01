import siteConfigData from '../../content/public/site-config.json';
import membersData from '../../content/public/members.json';
import discographyData from '../../content/public/discography.json';
import articlesData from '../../content/public/articles.json';
import newsData from '../../content/public/news.json';
import assetManifestData from '../../content/public/asset-manifest.json';
import campaignsData from '../../content/public/campaigns.json';

import { SiteConfig, Member, Release, Recording, Article, NewsItem, Campaign } from '../types/content';

export const isStagingEnv = (): boolean => {
  return import.meta.env.VITE_STAGING === 'true' || (typeof window !== 'undefined' && window.location.hostname.includes('staging'));
};

export const getCampaigns = (): Campaign[] => {
  const isStaging = isStagingEnv();
  return (campaignsData as Campaign[]).filter((c) => {
    if (c.status === 'staging' && !isStaging) return false;
    return true;
  });
};

export const getCampaignById = (id: string): Campaign | undefined => {
  const c = (campaignsData as Campaign[]).find((camp) => camp.id === id);
  if (!c) return undefined;
  if (c.status === 'staging' && !isStagingEnv()) return undefined;
  return c;
};

export const getCurrentCampaign = (): Campaign => {
  const campaigns = campaignsData as Campaign[];
  const current = campaigns.find((c) => c.status === 'current');
  return current || campaigns[0];
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

export const getRecordings = (): Recording[] => {
  return discographyData.recordings as Recording[];
};

export const getRecordingById = (id: string): Recording | undefined => {
  return getRecordings().find((rec) => rec.id === id);
};

export const getRecordingsForRelease = (releaseId: string): Recording[] => {
  const release = (discographyData.releases as Release[]).find((r) => r.id === releaseId || r.slug === releaseId);
  if (!release) return [];
  return release.trackIds
    .map((trackId) => getRecordingById(trackId))
    .filter((rec): rec is Recording => rec !== undefined);
};

export const getArticles = (): Article[] => {
  const isStaging = isStagingEnv();
  return (articlesData as Article[]).filter((a) => {
    if (a.publication.visibility !== 'public') return false;
    if (a.publication.campaignState === 'future') return false;
    if (a.publication.campaignState === 'staging' && !isStaging) return false;
    return true;
  });
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  const a = (articlesData as Article[]).find((art) => art.slug === slug);
  if (!a || a.publication.visibility !== 'public') return undefined;
  if (a.publication.campaignState === 'staging' && !isStagingEnv()) return undefined;
  if (a.publication.campaignState === 'future') return undefined;
  return a;
};

export const getNews = (): NewsItem[] => {
  return (newsData as NewsItem[]).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
};

export const getAssetManifest = () => assetManifestData;
