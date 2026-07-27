
# Antigravity Master Prompt

以下のプロンプトと、同梱されている設計書・JSONを同じコンテキストへ渡してください。

```text
Build the official static portal for the fictional five-member dance and vocal group IGNITE.

AUTHORITATIVE INPUT
1. ignite-official-site-spec-v2.md
2. ui-wireframes.md
3. release-operations.md
4. data/site-config.json
5. data/members.json
6. data/discography.json
7. data/articles.json
8. data/news.json
9. data/asset-manifest.json

PUBLIC CONTINUITY — NON-NEGOTIABLE
- The public story currently ends at the September 2022 release of the 3rd single “No Limits”.
- Publish only FIRESTARTER, IGNITION, BURN IT DOWN, and No Limits.
- Do not expose, tease, bundle, prerender, index, or reference any future release.
- Do not use LINDEN colors, trees, roots, branches, leaves, or green as the current design.
- The current campaign is NO_LIMITS: upward motion, wind, speed, sky blue, white light, and deep navy.

PRODUCT POSITION
This is not a link hub. It is IGNITE’s official listening and editorial home.
Users must be able to listen to released full tracks, read lyrics and liner notes, discover members and articles, and continue listening while navigating.
Do not use a Suno embed or a primary Suno link.

STACK
- Vite + React + TypeScript.
- Use React Router Framework Mode.
- Configure static deployment with ssr:false and prerender every known public route, including dynamic member, release, and article slugs from the public JSON.
- Produce a real HTML document for every route.
- Stage the final verified static output in dist/.
- Do not ship a single-shell SPA as the final deployment.

IMPLEMENTATION ORDER
1. Scaffold the app, types, validation, route generation, and campaign tokens.
2. Build the responsive shell and all static pages.
3. Implement one shared HTMLAudioElement in a root AudioProvider.
4. Implement MiniPlayer, ExpandedPlayer, queue, lyrics, errors, keyboard support, and Media Session as progressive enhancement.
5. Implement IGNITE JUKEBOX and EMBER DIGITAL PASS.
6. Implement production content/asset gates.
7. Add tests and the GitHub Actions SFTP deployment workflow.

AUDIO
- Use one shared HTMLAudioElement only.
- Never autoplay.
- Preserve playback across client-side route changes.
- Use custom controls; do not show native audio controls in the normal UI.
- Support play/pause, seek, time, volume, mute, previous, next, queue, lyrics, and minimize/expand.
- Render no play button for audio.status !== "ready".
- Audio files are hosted separately under /media/audio/ and are not stored in the Git repository.
- The normal site deployment must never delete or mirror-delete /media/audio/.

CASUAL DOWNLOAD DETERRENCE
- Do not expose download buttons or visible audio URLs.
- Prevent contextmenu and dragstart only inside the player and protected artwork regions.
- Set artwork draggable=false and suppress mobile touch callout in those regions.
- Do not disable right-click or text selection for the whole site.
- Do not claim this prevents extraction through developer tools.

CREATIVE DIRECTION
Design a real, refined music-group archive: a modern music magazine inside a dark stage just before the lights rise.
Use photography or anime-compatible key art, generous negative space, large editorial typography, fine rules, and restrained glow.
Avoid cyberpunk, game HUDs, excessive neon, full-screen flame effects, generic card grids, and full-site glassmorphism.
Use the permanent IGNITE core colors for controls and the No Limits campaign tokens for the current skin.

DATA AND FUTURE-CONTENT SAFETY
- Treat the supplied JSON files as the only public content sources.
- Validate all IDs, references, slugs, statuses, asset IDs, and recording versions.
- Fail a production build if any public required asset is missing or pending.
- Fail if any future content or non-public visibility state reaches generated output.
- Do not invent biographies, release facts, dates, lyrics, or future content.
- Development and preview builds may use designed placeholders for pending assets without broken image icons or fake play controls.

PAGES
- Top
- Members index and five details
- Discography index and four release details
- Features index and two article details
- Story / public timeline ending in September 2022
- Fun / mini tools
- Privacy
- Accessibility
- 404

QUALITY
- WCAG 2.2 AA target.
- Keyboard-operable player and tools.
- Visible focus.
- Reduced-motion support.
- Responsive checks at 360, 390, 768, 1024, and 1440 px.
- Direct access to every generated route must return its real HTML page.
- Add metadata, canonical links, Open Graph, sitemap, and structured data only for public routes.

DEPLOYMENT
- Build and verify dist/.
- Deploy only dist/ to a precisely scoped SFTP remote path.
- Read credentials only from GitHub repository secrets.
- Prefer key authentication and host-key verification.
- Upload hashed assets before HTML.
- Never delete parent directories or /media/audio/.
- Add post-deployment smoke tests.
- Before choosing the transfer command, confirm the actual protocol and authentication supported by the user’s お名前.com plan; if it is FTPS rather than SFTP, replace only the transport layer.

WORKING STYLE
- Do not stop for visual micro-decisions that are already delegated to you by the specification.
- Use placeholders and configuration values for missing production assets.
- Stop and report only true blockers: unknown deployment protocol, unsafe remote path, or credentials that cannot be represented securely.
- At completion, report implemented routes, tests, remaining pending assets, and the exact production build/deploy commands.
```
