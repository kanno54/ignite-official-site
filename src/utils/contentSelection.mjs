// Shared by the browser and static metadata builder. Deployment time is never a release date.
export const selectCurrentCampaign = (campaigns, config, staging) =>
  (staging && campaigns.find(c => c.id === config.stagingCurrentCampaignId))
  || campaigns.find(c => c.status === 'current') || campaigns[0];

export const releaseDateKey = release => {
  const candidates = [release.fictionalReleaseDateFull, release.publication?.fictionalReleaseDate, release.fictionalReleaseDate];
  for (const precision of [3, 2, 1]) {
    for (const value of candidates) {
      const match = typeof value === 'string' && /^(\d{4})(?:[-.](\d{2}))?(?:[-.](\d{2}))?$/.exec(value);
      if (match && match.filter(Boolean).length === precision + 1) return Number(match[1]) * 10000 + Number(match[2] || 0) * 100 + Number(match[3] || 0);
    }
  }
  return 0; // Undated releases last; ties retain source order. No invented day.
};
export const sortReleasesNewestFirst = releases => [...releases].sort((a,b) => releaseDateKey(b)-releaseDateKey(a));
