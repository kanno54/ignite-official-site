export type ConsentStatus = 'granted' | 'denied' | 'unset';

export interface PageViewParams {
  page_location: string;
  page_title: string;
  page_type?: string;
  content_id?: string;
  campaign_id?: string;
  release_id?: string;
  era?: string;
}

export interface TrackEventParams {
  track_id: string;
  release_id?: string;
  track_position?: number;
  track_version?: string;
  source: string;
}

export interface FeatureOpenParams {
  feature_id: string;
  content_id?: string;
  source: string;
}

export interface DiscographyOpenParams {
  release_id: string;
  content_id?: string;
  source: string;
}

export interface ScrollDepthParams {
  percent_scrolled: 25 | 50 | 75 | 90;
  page_type: string;
  content_id?: string;
}

const CONSENT_STORAGE_KEY = 'ignite_analytics_consent';
let googleTagLoaded = false;
let lastPageViewParams: PageViewParams | null = null;
let lastSentPageViewKey: string | null = null;

export const getAnalyticsMeasurementId = (): string => {
  return import.meta.env.VITE_GA_MEASUREMENT_ID || '';
};

export const isAnalyticsEnabledEnv = (): boolean => {
  const enabledFlag = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  const measurementId = getAnalyticsMeasurementId();
  if (!enabledFlag || !measurementId) return false;

  if (typeof window === 'undefined') return false;

  const hostname = window.location.hostname;
  // Strictly disable on staging, localhost, 127.0.0.1, preview, or staging build
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('staging') ||
    hostname.includes('preview') ||
    hostname.endsWith('.local') ||
    import.meta.env.VITE_STAGING === 'true'
  ) {
    return false;
  }

  return true;
};

export const getAnalyticsConsent = (): ConsentStatus => {
  if (typeof window === 'undefined') return 'unset';
  const val = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (val === 'granted' || val === 'denied') return val;
  return 'unset';
};

export const enableGoogleTagWindowFlag = () => {
  const measurementId = getAnalyticsMeasurementId();
  if (measurementId && typeof window !== 'undefined') {
    (window as any)[`ga-disable-${measurementId}`] = false;
  }
};

export const disableGoogleTagWindowFlag = () => {
  const measurementId = getAnalyticsMeasurementId();
  if (measurementId && typeof window !== 'undefined') {
    (window as any)[`ga-disable-${measurementId}`] = true;
  }
};

export const setAnalyticsConsent = (status: 'granted' | 'denied') => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_STORAGE_KEY, status);

  if (status === 'granted') {
    enableGoogleTagWindowFlag();
    loadGoogleTag();
    flushPageViewOnConsentGrant();
  } else {
    disableGoogleTagWindowFlag();
  }
};

export const loadGoogleTag = () => {
  if (!isAnalyticsEnabledEnv()) return;
  if (getAnalyticsConsent() !== 'granted') return;

  enableGoogleTagWindowFlag();

  if (googleTagLoaded) return;

  const measurementId = getAnalyticsMeasurementId();
  if (!measurementId) return;

  // Insert gtag.js asynchronously
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  // Configure with send_page_view: false for SPA manual page_view dispatch
  gtag('config', measurementId, {
    send_page_view: false,
    anonymize_ip: true,
  });

  googleTagLoaded = true;
};

export const flushPageViewOnConsentGrant = () => {
  if (!isAnalyticsEnabledEnv() || getAnalyticsConsent() !== 'granted') return;
  if (typeof window === 'undefined') return;

  const currentUrl = window.location.href;
  const currentTitle = document.title;

  const paramsToSend: PageViewParams = lastPageViewParams
    ? { ...lastPageViewParams, page_location: currentUrl, page_title: currentTitle }
    : {
        page_location: currentUrl,
        page_title: currentTitle,
        page_type: 'general',
      };

  const pageKey = `${paramsToSend.page_location}_${paramsToSend.page_title}`;

  if (lastSentPageViewKey === pageKey) return;

  if (window.gtag) {
    window.gtag('event', 'page_view', paramsToSend);
    lastSentPageViewKey = pageKey;
  }
};

export const trackPageView = (params: PageViewParams) => {
  lastPageViewParams = params;
  if (!isAnalyticsEnabledEnv() || getAnalyticsConsent() !== 'granted') return;

  const measurementId = getAnalyticsMeasurementId();
  if (measurementId && (window as any)[`ga-disable-${measurementId}`]) return;

  const pageKey = `${params.page_location}_${params.page_title}`;
  if (lastSentPageViewKey === pageKey) return;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', params);
    lastSentPageViewKey = pageKey;
  }
};

export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (!isAnalyticsEnabledEnv() || getAnalyticsConsent() !== 'granted') return;

  const measurementId = getAnalyticsMeasurementId();
  if (measurementId && (window as any)[`ga-disable-${measurementId}`]) return;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Specialized event trackers
export const trackCampaignArchiveSelect = (campaignId: string, source: string = 'archive_list') => {
  trackEvent('campaign_archive_select', {
    content_id: campaignId,
    campaign_id: campaignId,
    source,
  });
};

export const trackTrackPlay = (params: TrackEventParams) => {
  trackEvent('track_play', params);
};

export const trackTrackComplete = (params: TrackEventParams) => {
  trackEvent('track_complete', params);
};

export const trackJukeboxPlay = (params: Omit<TrackEventParams, 'source'> & { source?: string }) => {
  trackEvent('jukebox_play', {
    ...params,
    source: params.source || 'jukebox',
  });
};

export const trackFeatureOpen = (params: FeatureOpenParams) => {
  trackEvent('feature_open', {
    feature_id: params.feature_id,
    content_id: params.content_id || params.feature_id,
    source: params.source,
  });
};

export const trackDiscographyOpen = (params: DiscographyOpenParams) => {
  trackEvent('discography_open', {
    release_id: params.release_id,
    content_id: params.content_id || params.release_id,
    source: params.source,
  });
};

export const trackScrollDepth = (params: ScrollDepthParams) => {
  trackEvent('scroll_depth', params);
};
