# Native quality / overlay repair

## Why the previous edit looked broken

The earlier footage-only pipeline attempted to remove burned-in text/numbers and style compressed 720p frames. It preserved the camera tour, but image-based repair/tracking introduced transition smears, partial labels and geometry-shaped patches. Its 1080p60 file was an upscale/interpolation, not a native render. The floating bottom rectangles were editorial note/source-card planes with their text removed, not genuine dashboard controls. Passing functional tests/decoding checks did not establish visual cleanliness; that distinction matters.

The owner explicitly approved **native re-export of the existing editable scene** for this repair, relaxing the earlier footage-only restriction. This is not a redesigned scene or new camera journey.

## Repair strategy

- Keep the original `projectLayout('master')`, camera keyframes/targets/FOV, eight-project order, environment, lighting, seeded particles, floor and network geometry.
- Recompute and retain the exact previously approved 18-second motion-sensitive pacing map from the original master. Evaluate the original camera state directly at each native output frame.
- Export at **1920×1080 / 60fps directly**, not by spatial upscaling, optical-flow interpolation, unsharp enhancement or repainting the old MP4.
- Remove editorial note/code-card geometry, title/index planes, labels, owner/logo HUD and caption layers before rendering. There is no blank note-card plane left to cover the URL form or other dashboards. The actual ASTRA investigation modal is retained because it is real UI; Wazuh's editorial duplicated-detail plane is omitted.
- Use restrained reflective glass framing/clear coating. Keep the interface texture itself crisp rather than blurring, distorting or transmitting through its text/data.
- Preserve original non-textual matte/vignette grading; do not paint out background elements.
- Use fresh **2×/3× device-pixel-ratio captures** of the same pinned original interfaces and lossless texture encoding. URL form: 1674×1092 instead of 558×364. ASTRA, SOC and PassChecker: 2560×1600. Scanner: 2560×1412. Wireshark: original 3836×1751 capture pixels with native-coordinate privacy masks.
- Retain original report screenshots losslessly for Splunk/Wazuh. Their oldest fine text is inherently source-resolution limited; no fictional higher-resolution dashboard or measured security result is substituted.
- Preserve the small-control, larger, eligible-autoplay homepage layout. Use a new versioned MP4/poster URL so the previous artifact-prone file is not served from browser cache.

## Authentication and data boundaries

Original public source is pinned in `scripts/showreel/source-pins.json`. Capture logs record no page errors, scans, monitoring/control submissions, threat-intelligence lookups or API-backed generated results. Streamlit capture disables dotenv, API credentials and outbound lookups. ASTRA uses its existing sample table/modal with a fixed demo clock; no threat generator or unimplemented response action is exercised. Password input is explicitly synthetic. Wireshark address/SNI/payload/MAC/SSID privacy omissions remain.

## Source and commands

- `scripts/native-clean/panel.mjs`: original display geometry, clean glass material, genuine UI only. No call to the editorial `sourceCard`/title/number factories.
- The active renderer is clean-only after dependency-audited workspace cleanup. Historical labelled/card-based modes remain in Git history, not active files.
- `approved-timing.py` / `timing.json`: same approved timing, original camera sampled at native frame times.
- `capture-lab.py`, `capture.mjs`, `prepare-assets.py`: fresh high-density original UI and original PDF/capture pixels.
- `inspect.mjs`: native 1920×1080 source-frame previews and explicit eight-panel/zero-editorial-card audit.
- `render.mjs`: one browser, one frame in flight, two encoder threads, direct native frames, a single final H.264 encode. The existing matched 0.6-second loop dissolve is retained; no invented return-camera path or optical-flow morph is used.

```bash
npm ci
npx playwright install chromium
# FFmpeg installed separately; e.g. brew install ffmpeg on macOS.

# Use the supplied lossless textures; optional recapture is not needed for normal rerender.
npm run showreel:studio
# In a second terminal, render sequentially:
node scripts/native-clean/render.mjs
# Linux sandbox only: add --software for SwiftShader.
```

Optional original-interface refresh uses the existing isolated capture Python requirements, `prepare-capture.py`, a public pinned ASTRA checkout, the native capture lab and API-disabled Streamlit source. Run `node scripts/native-clean/capture.mjs`, then `python scripts/native-clean/prepare-assets.py`. Do not run all original project backends or submit scans/lookups. Stop capture servers before rendering on memory-constrained hardware.

## Verification requirements

Before publishing: inspect actual native frames and the encoded URL/other scenes, decode the entire final file, verify 18 seconds / 1080 frames / 60fps / no audio / H.264 / fast-start; confirm zero editorial cards, title planes and number planes; compare actual camera position/target against the unchanged original timeline at every rendered frame. Regress desktop/touch autoplay, loop, preferences, visibility/pause, tiny control/focus, failure recovery, archive, contact, original PDFs and factual content. Field CWV, physical M2/Safari and manual assistive-technology certification are not claimed.

Measured export, visual/regression results and approved-project publication details follow when verified.


## Measured native delivery and local review

- Native file: `public/media/cybersecurity-native-glass-1080p60.mp4`, **18.00 s / 1920×1080 / 60fps / 1,080 frames / H.264 High4.2 / yuv420p / BT.709 / fast-start / no audio**.
- Size: **11,641,244 bytes (11.64 MB)**. SHA256 `d6da76f987e75f9f0cc5edb5e6b1f42646d089664a17c9a7d84b0f891544d503`.
- All 1,080 encoded frames decoded with zero blank frames. Loop boundary mean absolute RGB difference: **0.748/255 at 160×90 QC resolution**. This is a diagnostic, not a lossy-frame byte-identity claim.
- Native viewport and every output frame are 1920×1080; no spatial video upscale, optical-flow interpolation, CV inpaint, unsharp pass or multi-generation MP4 repair chain is used.
- Every rendered frame compared against the unchanged original camera timeline: maximum position deviation **5.33e−15** world units (floating-point roundoff), target deviation **0**.
- Eight-screen source audit: **0 editorial cards, 0 title planes, 0 chapter-number planes**; only the real ASTRA modal remains as an interface overlay. No replacement blank rectangle was created.
- Native source frames and 36 encoded half-second samples across all eight scenes were visually reviewed. The URL form/button, scanner controls, PassChecker feedback, Wazuh table and surrounding transitions are unobstructed and clean. Real empty input fields (e.g. SOC log entry) are genuine UI, not the discarded editorial cards.
- Local production build/content checks passed. Full suite: **86 passed / 2 intentional skips / 0 failures or flaky**, **153.40 seconds**, no retries. Actual native video autoplay/manual/loop behavior, desktop/touch, preferences, visibility/pause, tiny control, fallback/retry and the existing portfolio/document/contact/archive behavior passed.
- Still source-limited: original scanned Splunk report fine text and some historical lab imagery. No AI-upsampled or invented dashboard data is substituted. No physical M2/Safari, manual screen-reader or field-CWV certification is claimed.
- Old artifact-prone video/proof/previews are removed from the active tree; compatible public aliases resolve to the new version. The original 41-second master remains unchanged. New filename/poster URLs prevent reusing the old cached clip.


## Published repair

- Live homepage: **https://jefrine-correya-portfolio.vercel.app**. New MP4: `/media/cybersecurity-native-glass-1080p60.mp4`.
- Existing approved `jefftest / jefrine-correya-portfolio` only. Deployment `dpl_HzgvNUXu5cigYeNmJWcPV5Zpgo7N` is **Ready / production**. Implementation `80963c14eaf1a3b2f33f80fbbc1423e5e5a16bb3`, branch `fix/native-glass-quality`. No new project/domain/DNS.
- Public verification: **62 exact asset hashes / 26 sitemap routes**, native MP4 `video/mp4` and HTTP 206 `bytes 0-1023/11641244`, original master unchanged, captions MIME/security/noindex headers retained. Old video/poster/provenance paths successfully alias to the new assets, rather than serving the bad generation.
- Complete public suite: **86 passed / 2 intentional skips / 0 failed or flaky**, **112.29 seconds**, zero retries. Local and public runs are independent executions of the same checks, not 172 distinct tests. Temporary capture/studio/transfer/tunnel processes are stopped; the site is independent of the workspace.
- Reviewed static artifact SHA256 `b15af1003ec24a7fb394c549cd2ec3a4ea8fd2aef922c7de145086c77a4964a2`, **20,775,705 bytes**, retained durably on the same site under `/.well-known/portfolio-builds/`. Capture/render tools are not visitor runtime dependencies.
- The large native MP4 is delivered separately from source; authored source/history/PDFs remain intact. Current source archive omits unused legacy site assets and MP4 binaries to avoid redundant large artifacts; native/archival videos can be downloaded separately. The earlier Git bundle remains historical, not this new branch.
- Original main remains `809388399e17c9e949f14ef201ece51701ec5816`. Original site/domain/DNS, other projects, supplied PDF bytes and contact-provider setup unchanged. No remote push/PR/merge and no new real-email test.
