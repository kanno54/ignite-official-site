import siteConfigData from '../../content/public/site-config.json';
import membersData from '../../content/public/members.json';
import discographyData from '../../content/public/discography.json';
import articlesData from '../../content/public/articles.json';
import newsData from '../../content/public/news.json';
import assetManifestData from '../../content/public/asset-manifest.json';

import { SiteConfig, Member, Release, Recording, Article, NewsItem } from '../types/content';

export const getSiteConfig = (): SiteConfig => siteConfigData as SiteConfig;

export const getMembers = (): Member[] => {
  return (membersData as Member[]).filter(
    (m) => m.publication.visibility === 'public' && m.publication.campaignState !== 'future'
  );
};

export const getMemberBySlug = (slug: string): Member | undefined => {
  return getMembers().find((m) => m.slug === slug);
};

export const getReleases = (): Release[] => {
  return (discographyData.releases as Release[]).filter(
    (r) => r.publication.visibility === 'public' && r.publication.campaignState !== 'future'
  );
};

export const getReleaseBySlug = (slug: string): Release | undefined => {
  return getReleases().find((r) => r.slug === slug);
};

export const getRecordings = (): Recording[] => {
  return discographyData.recordings as Recording[];
};

export const getRecordingById = (id: string): Recording | undefined => {
  return getRecordings().find((rec) => rec.id === id);
};

export const getRecordingsForRelease = (releaseId: string): Recording[] => {
  const release = getReleases().find((r) => r.id === releaseId);
  if (!release) return [];
  return release.trackIds
    .map((trackId) => getRecordingById(trackId))
    .filter((rec): rec is Recording => rec !== undefined);
};

export const getArticles = (): Article[] => {
  return (articlesData as Article[]).filter(
    (a) => a.publication.visibility === 'public' && a.publication.campaignState !== 'future'
  );
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  return getArticles().find((a) => a.slug === slug);
};

export const getNews = (): NewsItem[] => {
  return newsData as NewsItem[];
};

export const getAssetManifest = () => assetManifestData;
