import type { Campaign, Release, SiteConfig } from '../types/content';
export function selectCurrentCampaign(campaigns: Campaign[], config: SiteConfig, staging: boolean): Campaign;
export function releaseDateKey(release: Partial<Release>): number;
export function sortReleasesNewestFirst<T extends Partial<Release>>(releases: T[]): T[];
