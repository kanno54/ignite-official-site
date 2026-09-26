> Historical initial integration report. Publication inputs and deployment status below are superseded by final-confirmation.md.

# We Burn integration handoff

The campaign is implemented as a staging integration in the existing Vite / React / TypeScript site. No deployment, Asset Studio registration, source-image generation, or production-database write was performed. The current public LIVE ALBUM 2024 campaign is preserved.

## Preview

The local staging development server is at http://127.0.0.1:5173.
The verified built staging artifact is also served at http://127.0.0.1:4173 with the same four paths.

| Page | Local URL |
| --- | --- |
| Campaign | http://127.0.0.1:5173/campaigns/we-burn/ |
| Release | http://127.0.0.1:5173/discography/we-burn/ |
| FIVE DIRECTIONS | http://127.0.0.1:5173/features/five-directions/ |
| NO PLAN | http://127.0.0.1:5173/features/no-plan/ |

## Audit and reuse

The repository already supplied campaign and discography routes, feature routing/indexes, shared header/footer, ResponsivePicture and image derivatives, LiveMarkdown, the persistent audio player, analytics, static per-route metadata, sitemap generation, and regression validators. These were reused. No framework migration or existing-content replacement was needed.

Before this change, there was no We Burn single/campaign or either requested feature. Existing references to We Burn belonged to the 2024 live tour and live album and remain separate recording identities. Baseline validation passed. The baseline build required elevated execution because Windows esbuild could not resolve the project path inside the sandbox; it then passed.

Implemented: a three-track campaign/release view with FUTURE / NOW / ORIGIN in the prescribed order; two different feature layouts; individual portraits, speaker labels, section anchors, related cards and reciprocal links; top-page, header, feature-index and discography entry points; dedicated mobile hero; responsive WebP images; article-specific OGP/card derivatives; shared-copy SEO/OG descriptions; staging exclusion from production data, routes, sitemap and image output. Pending recordings are excluded from Jukebox recommendations, and playback controls require ready audio.

## Editorial source correction

Delivery: `pkg-we-burn-2026-09-26T22-42-00-254Z`, 74 SELECTED / READY assets. All 74 SHA-256 values were verified against the files before integration.

- FIVE DIRECTIONS uses **WB25-TXT-FEAT01 v1**, explicitly approved by the user in this task. The original Asset Studio v1 has the correct title, KAI / SHO / LEO / REN / YUTO sections, and the same closing question five times. Selected v2 contains a NO PLAN interview and is invalid for FIVE DIRECTIONS. It is retained only in the canonical audit source directory, never rendered. `content/canonical/we-burn/editorial-correction.json` records the exception and v1 hash. The source registry was not changed.
- NO PLAN uses **WB25-TXT-FEAT02 v1**, from the approved delivery package, unchanged.
- Both article JSON strings equal their canonical files byte for byte. Browser comparison of all rendered manuscript headings and paragraphs also matched both sources (ignoring Markdown heading markers and whitespace).
- The release introduction uses DISC01; the three track sections use WEB03–05; SEO and OGP descriptions use EXT09 and EXT08 respectively. WEB02 was not used because it introduces BRANCHES; no future campaign announcement was inferred from that text.

## Asset mapping

`asset-map.json` contains the full 74-asset package mapping (file, source hash, version, approval state, site path, disposition), plus the explicitly approved v1 correction. `content/canonical/we-burn/manifest.json` preserves the original delivery manifest. The mapping of actual displayed images is:

| Asset code | Local optimized file under `/assets/images/we-burn/` | Placement |
| --- | --- | --- |
| WB25-WEB01 | WB25-WEB01_v01.webp | Desktop campaign/release hero |
| WB25-WEB02 | WB25-WEB02_v01.webp | Dedicated 9:16 mobile hero |
| WB25-JK01 | WB25-JK01_v01.webp | Single jacket, release card, campaign/release OGP |
| WB25-WB01 | WB25-WB01_v01.webp | Track 01 |
| WB25-NP01 | WB25-NP01_v01.webp | Track 02; delivered image visually verified as five members without instrument performance |
| WB25-BS01 | WB25-BS01_v01.webp | Track 03 |
| WB25-FE01-HR01 | WB25-FE01-HR01_v01.webp | FIVE DIRECTIONS hero |
| WB25-M01 | WB25-M01_v01.webp | KAI |
| WB25-M02 | WB25-M02_v01.webp | SHO |
| WB25-M03 | WB25-M03_v01.webp | LEO |
| WB25-M04 | WB25-M04_v01.webp | REN |
| WB25-M05 | WB25-M05_v01.webp | YUTO |
| WB25-FE02-HR01 | WB25-FE02-HR01_v01.webp | NO PLAN hero |
| WB25-FE02-PH01 | WB25-FE02-PH01_v01.webp | SHO listening portrait after section 1 |
| WB25-FE02-IN01 | WB25-FE02-IN01_v01.webp | Empty studio after section 3 |
| WB25-FE02-IN02 | WB25-FE02-IN02_v01.webp | Optional five-member movement image after section 4 |

The same filenames receive width-specific WebP derivatives in `derivatives/`. Originals remain unchanged in the delivery package. The delivered files mix true formats despite `.png` filenames, so the site copies were explicitly decoded and encoded as WebP.

WB25-FE01-SNS01 and WB25-FE02-SNS01 are prepared, but not used as article body images. FE02-SNS01 was visually verified as the five-member version, not the old SHO-only image. WB25-WB02 / NP02 / BS02 are prepared track-detail assets but not displayed in this three-track overview. KV, GR and general SNS assets were not needed for these pages. No source was chosen merely because its filename resembled the requested asset.

No FE01/FE02 OG01 or TH01 was present in the package. The four local derivatives `wb25-fe01-og-review.jpg`, `wb25-fe02-og-review.jpg` (1200×630), and `wb25-fe01-card.jpg`, `wb25-fe02-card.jpg` (1080×1080) retain the entire approved hero with dark padding. No face crops or AI generation were used. These are local review derivatives, not newly registered Asset Studio assets, and still require editorial acceptance.

## Verification

- `npm run validate`: data, physical image/audio assets, derivatives, routes, regression protection and negative validator cases pass. Existing 82 protected entities remain intact.
- `npm run build` and `npm run build:staging`: pass. The existing large-bundle warning remains.
- `npm run test:static`: production and staging route/metadata output pass.
- `npm run test:we-burn`: canonical equality, correction hash, exact track order, missing-date/audio gates, staging-only routes, article OGP and production exclusion pass.
- Browser: all four pages at 360 / 390 / 768 / 1440 CSS pixels; no horizontal overflow, missing alt or `href="#"`. Top, feature index and discography index at 360 / 1440 also pass entry-point/overflow checks.
- All article images loaded, correct five portraits were mapped, mobile single-column portrait layout confirmed, anchors and mobile WE BURN navigation exercised, reciprocal links checked.
- Existing IGNITION playback started, advanced to 0:04, showed the persistent mini-player, and paused successfully.
- Fresh campaign browser console: no errors. Existing React Router future-flag warnings remain. The discovered React fetchPriority warning was fixed in ResponsivePicture.
- Static HTML contains route-specific metadata; the existing application renders article bodies client-side. This task did not replace the site's rendering architecture.

Evidence: `browser-responsive.json`, `browser-fidelity.json`, `browser-images-links.json`, `browser-indexes.json`, `browser-console.json`, build/validation logs and desktop/mobile PNG screenshots in this directory. `asset-review.png` records the visual source audit. No assertion is made that every historical page or every legacy audio file was manually played.

## Unresolved publication inputs

1. Confirm the release/publication phase and actual publication dates. Delivery creation timestamps were not used as public dates. The old campaign remains current; We Burn is staging-only.
2. The package contains three approved audio files, but their publication phase is unconfirmed. None was copied to the public audio directory. The three site recording records are pending with no URLs, and show no player controls. On clearance, copy the exact approved files, measure duration, update audio metadata/status and register the manifest entries; existing TrackPlayButton then supplies playback.
3. Streaming destinations and MV URLs/status are absent. No dummy buttons or links were added. NEWS01–03 are retained as canonical sources but not announced without phase/date/MV confirmation.
4. Editorial acceptance of the four local social/card derivatives is pending. Replace with approved OG01/TH01 deliveries if supplied.
5. Asset Studio's FEAT01 v2 selection remains mislabeled; the website exception is documented, but the source registry needs a separate editorial correction.

## Build, publication and rollback

Local preview: PowerShell `$env:VITE_STAGING='true'; npm run dev -- --host 127.0.0.1`. `npm run build:staging` generates staging HTML with noindex/nofollow, blocked robots and the existing staging domain default. `VITE_SITE_URL` can override that domain. No new credentials, analytics IDs, or services are required.

The final `dist` is a **staging build**, not a production deployment artifact. Do not upload it to production. Production builds currently exclude the campaign's article/release data and images; `npm run test:we-burn` checks that isolation. The source `public/sitemap.xml` is regenerated for production after staging verification.

Before publication, resolve the inputs above, update campaign/release/article lifecycle data consistently, adapt the campaign verification expectations from staging to the approved phase, and rerun all validation/build/static checks. The Vite gate follows the campaign's staging state. If We Burn is to become current, retire the old current campaign and update site-config and the existing current-era assertions deliberately. Do not fabricate dates to satisfy a validator. No live deployment authorization was assumed.

Before an authorized deployment, retain the currently deployed static artifact and the corresponding content/config revision. Use the existing deployment workflow only after its approval. Preserve the independently managed audio directory. Rollback is redeployment of that retained static artifact plus its content/config revision; no database migration is introduced by this change. Do not roll back the entire uncommitted workspace, because unrelated reports existed before this task.

## Changed files

New: `scripts/integrate-we-burn.mjs`, `scripts/verify-we-burn.mjs`, `content/public/we-burn.json`, `content/canonical/we-burn/*`, `public/assets/images/we-burn/*`, `src/components/campaigns/WeBurnCampaignView.tsx`, `WeBurnFeature.tsx`, `weBurn.css`, and this task's `reports/we-burn/*`.

Updated: `package.json`; public articles/asset-manifest/campaigns/discography/image-derivatives JSON; `vite.config.ts`; `scripts/build-static.mjs`, `public-site.mjs`, `validate-content.mjs`; `src/App.tsx`, `src/types/content.ts`, `src/utils/contentLoader.ts`; common MetadataManager/ResponsivePicture/SiteHeader; LiveMarkdown; top/campaign/release/article/feature-index routes. Other existing report directories were left untouched.
