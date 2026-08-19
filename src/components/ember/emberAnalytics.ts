import { ListeningMode } from '../../types/ember';

// Safe GA Analytics Dispatcher for GUEST EMBER
const sendGaEvent = (eventName: string, params?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params || {});
    }
  } catch (err) {
    // Non-blocking catch
  }
};

export const trackEmberView = () => sendGaEvent('ember_view');
export const trackEmberTap = () => sendGaEvent('ember_tap');
export const trackEmberRest = () => sendGaEvent('ember_rest');
export const trackEmberRestore = () => sendGaEvent('ember_restore');

export const trackEmberModeChange = (mode: ListeningMode) => {
  switch (mode) {
    case 'LISTEN': sendGaEvent('ember_mode_listen'); break;
    case 'DANCE': sendGaEvent('ember_mode_dance'); break;
    case 'VOCAL': sendGaEvent('ember_mode_vocal'); break;
    case 'CHILL': sendGaEvent('ember_mode_chill'); break;
  }
};

export const trackEmberBurn = (combo: number) => {
  sendGaEvent('ember_burn');
  if (combo === 2) sendGaEvent('ember_burn_combo_2');
  if (combo >= 3) sendGaEvent('ember_burn_combo_3');
};

export const trackEmberNoticeView = () => sendGaEvent('ember_notice_view');
export const trackEmberNoticeClick = () => sendGaEvent('ember_notice_click');
export const trackEmberReduceMotion = () => sendGaEvent('ember_reduce_motion');
