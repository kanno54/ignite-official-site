# We Burn staging reintegration

## Audit and causes

- Compared `/campaigns/live-album-2024/` (`LiveAlbumCampaignView`), `/campaigns/equinox/` (`EquinoxCampaignView`) and the generic campaign branch used by SOLAR, NO LIMITS, IGNITION and other historical campaigns. The latter is the most reused layout. It is extracted without redesign into `StandardCampaignView`; both `/campaigns/solar/` and `/campaigns/we-burn/` now render that same component. `CampaignTracks` and `CampaignFeatures` reuse its existing sections on the home page. Existing specialized campaigns remain available.
- Home was driven by LIVE ALBUM current status, with a separate We Burn feature block inserted ahead of the hero. Previous campaign was picked by array adjacency. Removed this special pre-hero block, centralized environment selection in `contentSelection.mjs` / `site-config.stagingCurrentCampaignId`, and choose previous campaigns from release chronology. Header, home, archive badges and static/client metadata share that selection.
- Discography pinned LIVE ALBUM first, sorted singles ascending, and home used input array order. `sortReleasesNewestFirst` is now shared through `getReleases`. Full formal dates take precedence; existing month/year precision is retained; undated releases sort last, stable ties. Actual order starts We Burn (2025-04-23), LIVE ALBUM 2024 (2025-02-07), EQUINOX (2024-05-15).
- User reports iPhone 13 Pro and SHARP AQUOS R8 Pro freezing after failed playback until reload, possibly poor connectivity. Available in-app browser played the original We Burn to 0:16, so the exact device fault is not reproduced. Chrome connection returned unavailable; only the in-app browser is exposed. This does not invalidate the user's report.
- Audio inspection found current-track state only committed after the play promise resolved, no request cancellation/version guard, no loading timeout, swallowed resume/advance failures, and media playback side effects inside the ended state updater. Fixed the shared provider: immediate track selection, cancellable loading, 20-second failure feedback, retry after error without reload, stale promise isolation, and ended handling outside state updater. Also guard inaccessible/corrupt volume storage, synchronize mute with volume, and reference actual artwork rather than guessing JPG filenames. Added keyboard seek and media-error diagnostic logging.
- Vite previously emitted fixed JS/CSS names. Build now emits content hashes, avoiding old/new asset collisions. No CDN service was identified or modified.

## Content and publication constraints

Approved WB25-WEB01/WB25-WEB02 campaign artwork is mapped through manifest IDs to existing `/assets/images/we-burn/` files, not feature hero replacements. FIVE DIRECTIONS FEAT01 v1 and NO PLAN FEAT02 v1 remain unchanged. Dates remain fictional history; no schedule is added. No external streaming/MV links. Home plus the four campaign pages omit OGP image. Production selection remains LIVE ALBUM; We Burn source/assets remain staging gated.

## Verification before deployment

- Existing validation and regression gates, TypeScript, production/staging builds, static metadata and manuscript/audio hash tests pass.
- Added `test:content-selection`: staging vs production selection, full-date ordering, later release fixture, missing-date handling, nonmutation and home SEO.
- Local recovery server uses the actual approved MP3s. One AUD03 request fails HTTP 503; retry without reload reaches 0:16 / 4:04. One AUD02 request stalls then fails; retry without reload reaches 0:46 / 4:12. `recovery-browser.json` records observed UI; `recovery-server.mjs` is local-only and is not part of deployed site.
- Range requests to the staging host currently return full HTTP 200 audio/mpeg, not 206, even with Accept-Encoding: identity; server advertises Accept-Ranges: bytes. Do not report 206 support. Full audio hashes were previously verified; live responses are rechecked after deployment.

## Remaining environment limitations / release gate

Physical iPhone/Android Safari/Chrome and audible speaker output are not accessible through the current tools. They must not be claimed as verified. Post-deployment actual URL checks and screenshots are recorded below. Production remains blocked until staging review and actual-device recovery confirmation.
