# We Burn final publication conditions

The user confirmed the fictional release/publication dates on 2026-09-27. These supersede unresolved inputs in the historical implementation report. No scheduled execution was created.

| Event | Fictional date (JST) |
| --- | --- |
| Campaign announcement | 2025-03-26 12:00 |
| Jacket and tracklist | 2025-04-02 12:00 |
| FIVE DIRECTIONS | 2025-04-18 12:00 |
| Single release | 2025-04-23 |
| Release-day site update | 2025-04-23 12:00 |
| NO PLAN | 2025-04-25 12:00 |

The release is historical; the current LIVE ALBUM campaign is preserved. We Burn remains behind the staging publication gate until production review is complete.

All three approved MP3s are copied byte-for-byte, verified with SHA-256, and enabled through the existing player. Durations are measured from MP3 frames. Only internal navigation and actual audio playback are offered; no external CTA, placeholder URL or MV is introduced.

No verified approved site-wide OGP image was identified. All four We Burn pages therefore omit og:image and twitter:image in static HTML and client-side navigation, including removal of a previous route's image metadata. Titles, descriptions and canonical/OG URLs remain page-specific. The earlier review derivatives are not assigned as OGP. Existing card derivatives remain navigation thumbnails.

FIVE DIRECTIONS continues to use the verified, explicitly approved FEAT01 v1 with five individual interviews. Mislabeled v2 is never rendered. NO PLAN uses the separately approved FEAT02 source. The source registry's mislabel remains an editorial issue outside this website change.

Validation, TypeScript, production/staging builds, exact manuscript checks, audio hashes, historical dates, external-link exclusion, OGP omission and all 111 staging static routes pass. Production output excludes We Burn data, images and audio. Existing bundle-size warnings remain.

Staging workflow is restricted to a verified staging directory and does not delete independently managed remote audio. Production workflow is unchanged. Deployment and live-browser evidence are recorded separately after staging verification.
