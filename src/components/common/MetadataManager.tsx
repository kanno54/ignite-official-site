import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  getArticleBySlug,
  getAssetManifest,
  getCampaignById,
  getCurrentCampaign,
  getMemberBySlug,
  getReleaseBySlug,
  getSiteConfig,
  isStagingEnv,
} from '../../utils/contentLoader';

type PageMetadata = {
  title: string;
  description: string;
  image: string;
  type?: string;
};

const ensureMeta = (attribute: 'name' | 'property', key: string) => {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  return element;
};

const ensureCanonical = () => {
  let element = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  return element;
};

export const MetadataManager: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    const config = getSiteConfig();
    const campaign = getCurrentCampaign();
    const currentRelease = getReleaseBySlug(campaign.releaseId);
    const manifest = getAssetManifest();
    const manifestImages = manifest.images as Record<string, { path: string; status: string }>;
    const parts = pathname.split('/').filter(Boolean);
    const fallbackImage = campaign.desktopHero;
    let metadata: PageMetadata = {
      title: currentRelease
        ? `IGNITE Official Portal — ${currentRelease.format}『${currentRelease.title}』`
        : 'IGNITE Official Portal',
      description: currentRelease ? `${campaign.catchCopy}。${currentRelease.description}` : campaign.catchCopy,
      image: fallbackImage,
    };

    if (parts[0] === 'members') {
      const member = parts[1] ? getMemberBySlug(parts[1]) : undefined;
      metadata = member ? {
        title: `${member.nameEn} Profile | IGNITE Official Portal`,
        description: member.shortCopy,
        image: manifestImages[member.profileImageAssetId]?.path || manifestImages[member.avatarAssetId]?.path || fallbackImage,
      } : {
        title: 'MEMBERS | IGNITE Official Portal',
        description: 'IGNITEメンバー5人のプロフィールと現在地。',
        image: fallbackImage,
      };
    } else if (parts[0] === 'discography') {
      const release = parts[1] ? getReleaseBySlug(parts[1]) : undefined;
      metadata = release ? {
        title: `${release.title} | IGNITE Discography`,
        description: release.description,
        image: release.coverImage || manifestImages[release.coverAssetId]?.path || fallbackImage,
        type: 'music.album',
      } : {
        title: 'DISCOGRAPHY | IGNITE Official Portal',
        description: 'IGNITEの公開リリースと全収録曲。',
        image: fallbackImage,
      };
    } else if (parts[0] === 'campaigns') {
      const routeCampaign = parts[1] ? getCampaignById(parts[1]) : undefined;
      metadata = routeCampaign ? {
        title: `${routeCampaign.title} Campaign | IGNITE Official Portal`,
        description: `${routeCampaign.catchCopy}。${routeCampaign.introduction?.body || ''}`.replace(/\s+/g, ' ').trim(),
        image: routeCampaign.desktopHero,
      } : {
        title: 'CAMPAIGN ARCHIVE | IGNITE Official Portal',
        description: 'IGNITEのCurrent Campaignと歴代Campaign Archive。',
        image: fallbackImage,
      };
    } else if (parts[0] === 'features') {
      const article = parts[1] ? getArticleBySlug(parts[1]) : undefined;
      metadata = article ? {
        title: `${article.title} | IGNITE Official Site`,
        description: article.dek,
        image: article.heroImage || manifestImages[article.heroAssetId]?.path || fallbackImage,
        type: 'article',
      } : {
        title: 'FEATURES & MAGAZINE | IGNITE Official Portal',
        description: 'IGNITEのインタビュー、制作記録、公式ライナーノーツ。',
        image: fallbackImage,
      };
    } else if (parts[0] === 'story') {
      metadata = { title: 'OFFICIAL STORY & TIMELINE | IGNITE Official Portal', description: 'IGNITEの活動をたどる公式ストーリーとタイムライン。', image: fallbackImage };
    } else if (parts[0] === 'fun') {
      metadata = { title: 'JUKEBOX & EMBER DIGITAL PASS | IGNITE Official Portal', description: 'IGNITEの楽曲とインタラクティブコンテンツ。', image: fallbackImage };
    } else if (parts[0] === 'privacy') {
      metadata = { title: 'PRIVACY POLICY | IGNITE Official Portal', description: 'IGNITE Official Portalのプライバシーポリシー。', image: fallbackImage };
    } else if (parts[0] === 'accessibility') {
      metadata = { title: 'ACCESSIBILITY | IGNITE Official Portal', description: 'IGNITE Official Portalのアクセシビリティ方針。', image: fallbackImage };
    }

    const configuredSiteUrl = import.meta.env.VITE_SITE_URL || config.siteUrl;
    const siteUrl = configuredSiteUrl.replace(/\/$/, '');
    const canonical = `${siteUrl}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
    const image = /^https?:\/\//.test(metadata.image) ? metadata.image : `${siteUrl}${metadata.image}`;
    const title = `${isStagingEnv() ? '[STAGING] ' : ''}${metadata.title}`;

    document.title = title;
    ensureCanonical().href = canonical;
    ensureMeta('name', 'description').content = metadata.description;
    ensureMeta('property', 'og:url').content = canonical;
    ensureMeta('property', 'og:title').content = title;
    ensureMeta('property', 'og:description').content = metadata.description;
    ensureMeta('property', 'og:image').content = image;
    ensureMeta('property', 'og:type').content = metadata.type || 'website';
  }, [pathname]);

  return null;
};
