export type FeatureFlagState = 'OFF' | 'INTERNAL' | 'PUBLIC';

export const FEATURE_FLAGS: Record<string, FeatureFlagState> = {
  GUEST_EMBER: 'OFF',
  MY_EMBER_PILOT: 'OFF',
};

export const isFeatureEnabled = (flagName: keyof typeof FEATURE_FLAGS): boolean => {
  const status = FEATURE_FLAGS[flagName];
  if (status === 'OFF') return false;
  if (status === 'PUBLIC') return true;
  if (status === 'INTERNAL') {
    // Enable for dev / staging / internal testing
    if (typeof window !== 'undefined') {
      const isInternal = window.location.hostname.includes('staging') ||
        window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1') ||
        window.location.search.includes('ember=true');
      return isInternal;
    }
    return true;
  }
  return false;
};
