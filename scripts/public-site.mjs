import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, '../content/public');

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(contentDir, name), 'utf8'));

export const siteConfig = readJson('site-config.json');
export const members = readJson('members.json');
export const discography = readJson('discography.json');
export const articles = readJson('articles.json');
export const campaigns = readJson('campaigns.json');
export const assetManifest = readJson('asset-manifest.json');
export const liveArchives = readJson('live.json');

const readyAssetPath = (assetId) => {
  const asset = assetManifest.images[assetId];
  return asset?.status === 'ready' ? asset.path : undefined;
};

const publicationIsPublic = (publication, staging) => {
  if (!publication || publication.visibility !== 'public') return false;
  if (publication.campaignState === 'future') return false;
  if (publication.campaignState === 'staging' && !staging) return false;
  return true;
};

const normalizeSiteUrl = (value) => value.replace(/\/$/, '');
const absoluteUrl = (siteUrl, value) => {
  if (/^https?:\/\//.test(value)) return value;
  return `${normalizeSiteUrl(siteUrl)}${value.startsWith('/') ? value : `/${value}`}`;
};

const sitemapDatePattern = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2}))?$/;

export const isValidSitemapLastmod = (value) => {
  if (typeof value !== 'string') return false;
  const match = sitemapDatePattern.exec(value);
  if (!match) return false;

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, timezone] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  if (calendarDate.getUTCFullYear() !== year || calendarDate.getUTCMonth() !== month - 1 || calendarDate.getUTCDate() !== day) return false;

  if (hourText !== undefined) {
    if (Number(hourText) > 23 || Number(minuteText) > 59 || Number(secondText) > 59) return false;
    if (timezone !== 'Z') {
      const [offsetHour, offsetMinute] = timezone.slice(1).split(':').map(Number);
      if (offsetHour > 14 || offsetMinute > 59 || (offsetHour === 14 && offsetMinute !== 0)) return false;
    }
  }

  return true;
};

export const normalizeSitemapLastmod = (value) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  const candidate = /^\d{4}\.\d{2}\.\d{2}$/.test(trimmed) ? trimmed.replaceAll('.', '-') : trimmed;
  return isValidSitemapLastmod(candidate) ? candidate : undefined;
};

export const getPublicRouteEntries = ({ staging = false, siteUrl = siteConfig.siteUrl }) => {
  const currentCampaign = campaigns.find((campaign) => campaign.status === 'current') || campaigns[0];
  const currentRelease = discography.releases.find((release) => release.id === currentCampaign.releaseId) || discography.releases[0];
  const fallbackImage = currentCampaign.desktopHero;
  const entries = [];

  const add = (routePath, metadata) => {
    const canonical = routePath === '/404.html'
      ? absoluteUrl(siteUrl, '/404.html')
      : absoluteUrl(siteUrl, routePath);
    const image = metadata.image || fallbackImage;
    entries.push({
      path: routePath,
      title: metadata.title,
      description: metadata.description,
      canonical,
      image: absoluteUrl(siteUrl, image),
      type: metadata.type || 'website',
      lastmod: normalizeSitemapLastmod(metadata.lastmod),
      sitemap: metadata.sitemap !== false,
    });
  };

  add('/', {
    title: `IGNITE Official Portal — ${currentRelease.format}『${currentRelease.title}』`,
    description: `${currentCampaign.catchCopy}。${currentRelease.description}`,
    image: currentCampaign.desktopHero,
    lastmod: currentCampaign.releaseDate,
  });

  add('/members/', {
    title: 'MEMBERS | IGNITE Official Portal',
    description: 'IGNITEメンバー5人のプロフィールと現在地。',
  });
  for (const member of members.filter((member) => publicationIsPublic(member.publication, staging))) {
    add(`/members/${member.slug}/`, {
      title: `${member.nameEn} Profile | IGNITE Official Portal`,
      description: member.shortCopy,
      image: readyAssetPath(member.profileImageAssetId) || readyAssetPath(member.avatarAssetId),
    });
  }

  add('/discography/', {
    title: 'DISCOGRAPHY | IGNITE Official Portal',
    description: 'IGNITEの公開リリースと全収録曲。',
  });
  for (const release of discography.releases.filter((release) => publicationIsPublic(release.publication, staging))) {
    add(`/discography/${release.slug}/`, {
      title: `${release.title} | IGNITE Discography`,
      description: release.description,
      image: release.coverImage || readyAssetPath(release.coverAssetId),
      type: 'music.album',
      lastmod: release.fictionalReleaseDateFull,
    });

    if (release.id === 'equinox') {
      for (const recordingId of release.trackIds) {
        const recording = discography.recordings.find((item) => item.id === recordingId);
        if (!recording) continue;
        const slug = recording.id === 'equinox-title' ? 'equinox' : recording.id.replace(/^equinox-/, '');
        const artworkId = `poster-equinox-tr${String(recording.trackNumber).padStart(2, '0')}-v`;
        add(`/discography/equinox/tracks/${slug}/`, {
          title: `${recording.title} (${recording.romanNumeral}) | EQUINOX Song Detail`,
          description: recording.linerNotes,
          image: readyAssetPath(artworkId),
          type: 'music.song',
          lastmod: release.fictionalReleaseDateFull,
        });
      }
    }
    if (release.id === 'live-album-2024') {
      for (const recordingId of release.trackIds) {
        const recording = discography.recordings.find((item) => item.id === recordingId);
        if (!recording?.songDetailSlug) continue;
        add(`/discography/live-album-2024/tracks/${recording.songDetailSlug}/`, {
          title: `${recording.title} | IGNITE LIVE 2024 Song Detail`,
          description: recording.arrangementText,
          image: readyAssetPath(recording.artwork?.vertical),
          type: 'music.song',
          sitemap: false,
        });
      }
    }
  }

  add('/campaigns/', {
    title: 'CAMPAIGN ARCHIVE | IGNITE Official Portal',
    description: 'IGNITEのCurrent Campaignと歴代Campaign Archive。',
  });
  for (const campaign of campaigns.filter((campaign) => campaign.status !== 'staging' || staging)) {
    add(`/campaigns/${campaign.slug || campaign.id}/`, {
      title: `${campaign.title} Campaign | IGNITE Official Portal`,
      description: `${campaign.catchCopy}。${campaign.introduction?.body || ''}`.replace(/\s+/g, ' ').trim(),
      image: campaign.desktopHero,
      lastmod: campaign.releaseDate,
    });
  }

  add('/features/', {
    title: 'FEATURES & MAGAZINE | IGNITE Official Portal',
    description: 'IGNITEのインタビュー、制作記録、公式ライナーノーツ。',
  });
  for (const article of articles.filter((article) => publicationIsPublic(article.publication, staging))) {
    add(`/features/${article.slug}/`, {
      title: `${article.title} | IGNITE Official Site`,
      description: article.dek,
      image: article.heroImage || readyAssetPath(article.heroAssetId),
      type: 'article',
      lastmod: article.publishDateFull,
    });
  }

  const visibleLiveArchives = liveArchives.filter((archive) => publicationIsPublic(archive.publication, staging));
  if (visibleLiveArchives.length > 0) {
    add('/live/', {
      title: 'LIVE | IGNITE Official Portal',
      description: 'IGNITEのステージとツアーを記録する公式Live Archive。',
      image: readyAssetPath('lv24-og01') || readyAssetPath('lv-so-h01'),
      sitemap: !staging,
    });
    add('/live/history/', {
      title: 'LIVE HISTORY | IGNITE Official Portal',
      description: 'IGNITEの2021年から2024年までのLive Archive。',
      image: readyAssetPath('lv24-og01') || readyAssetPath('lv-so-h01'),
      sitemap: !staging,
    });
    for (const archive of visibleLiveArchives) {
      add(`/live/${archive.slug}/`, {
        title: `${archive.title} | IGNITE LIVE Archive`,
        description: `${archive.eventTitle} — ${archive.subtitle}`,
        image: readyAssetPath(archive.ogAssetId || archive.heroDesktopAssetId),
        type: 'article',
        sitemap: !staging,
      });
      for (const log of archive.tourLogs || []) {
        add(`/live/${archive.slug}/tour-log/${log.slug}/`, {
          title: `${log.title} | ${archive.title} Tour Log`,
          description: `${log.dateRange.start}—${log.dateRange.end} // ${log.venue}`,
          image: readyAssetPath(log.heroAssetId),
          type: 'article',
          sitemap: !staging,
        });
      }
    }
  }

  if (staging && discography.releases.some((release) => release.id === 'live-album-2024')) {
    add('/news/live-album-2024/', {
      title: 'IGNITE LIVE TOUR 2024、2枚組LIVE ALBUMとしてリリース決定',
      description: 'THE SHOW ENDED. THE SOUND REMAINS. 2 Discs / 24 Tracks.',
      image: readyAssetPath('la24-h01'),
      type: 'article',
      sitemap: false,
    });
  }

  add('/story/', {
    title: 'OFFICIAL STORY & TIMELINE | IGNITE Official Portal',
    description: 'IGNITEの活動をたどる公式ストーリーとタイムライン。',
  });
  add('/fun/', {
    title: 'JUKEBOX & EMBER DIGITAL PASS | IGNITE Official Portal',
    description: 'IGNITEの楽曲とインタラクティブコンテンツ。',
  });
  add('/privacy/', {
    title: 'PRIVACY POLICY | IGNITE Official Portal',
    description: 'IGNITE Official Portalのプライバシーポリシー。',
  });
  add('/accessibility/', {
    title: 'ACCESSIBILITY | IGNITE Official Portal',
    description: 'IGNITE Official Portalのアクセシビリティ方針。',
  });
  add('/404.html', {
    title: 'PAGE NOT FOUND | IGNITE Official Portal',
    description: '指定されたページは見つかりませんでした。',
    sitemap: false,
  });

  return entries;
};

export const routePathToOutputFile = (routePath) => {
  if (routePath === '/') return 'index.html';
  if (routePath === '/404.html') return '404.html';
  return `${routePath.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
};
