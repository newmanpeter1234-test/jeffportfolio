# Jefrine Correya — cybersecurity portfolio

The active project is the React/TypeScript/Vite application in this folder. Dedicated working branch: `feat/animated-window-hero`. Original GitHub main, original site and custom DNS remain untouched; no remote push/merge is implied.

Approved review site: https://jefrine-correya-portfolio.vercel.app

## Run and check

```bash
npm ci
npm run dev
npm run check
npx playwright install chromium
npm test
```

Vite binds to `0.0.0.0:5173` and accepts the preview host. Normal builds need no Python, FFmpeg, project backends or live Three.js scene. Visitors receive ordinary H.264 video plus static fallback images. Three.js is used only by the offline render studio.

## Active structure

- `src/`: application, real content/project data and currently reachable routes.
- `public/documents/`: the **four original PDFs**, byte-identical to the supplied originals.
- `public/images/document-*`: active document preview pages/thumbnails; these are used by the Document Room, not unused screenshots.
- `public/images/`, `public/fonts/`: active website artwork, current posters and locally hosted licensed fonts.
- `public/media/`: current native hero and the original archived full film/captions/provenance.
- `scripts/native-clean/`: current high-density original UI textures, capture/timing/native render and verification tools.
- `scripts/showreel/`: shared original camera/environment and current clean offline studio plus pinned source/capture support. Retired labelled/slideshow/repair branches are removed.
- `scripts/prepare-documents.py`: optional preparation of the active original PDF previews/readable text.
- `ops/release-baseline.json`: last verified approved-project release facts, without expired staging/tunnel copies.
- `docs/WORKSPACE-CLEANUP.json`: per-file cleanup reasons/hashes; authored history remains in Git.

The workspace root keeps `portfolio/`, original uploaded inputs in `uploads/`, and generated downloads in `deliverables/`. Old public-source research copies, QA screenshots, obsolete deployment staging and the redundant historical Git bundle were removed after dependency/ref checks. Hidden package/browser caches are tooling, not authored portfolio files.

## Features preserved

19 real case studies and the 26-repository index; accurate Doha/Qatar profile/time; Contact CTA, no contact phone and the slightly smaller 24×30 lime native arrow; original résumé/certificate/experience previews first, with explicit download inside the viewer. The active Document Room is retained. Legacy résumé links resolve to the one canonical PDF instead of storing a duplicate.

The direct website Send mail flow remains activated. Previous owner-confirmed inbox receipt is real delivery evidence; automated tests mock responses and do not constitute new email delivery proof. No additional real email is sent by routine QA.

Routes: `/`, `/projects`, `/projects/:slug`, `/journey`, `/credentials`, `/contact`, `/sources`, and the existing archived `/showreel`.

## Current offline render

```bash
npm run showreel:studio
# Separate terminal, using supplied genuine textures:
npm run native:render
# Linux software renderer only: add -- --software
```

FFmpeg and Playwright Chromium are required for rerendering. Existing camera/environment are checked against the approved baseline; output is native 1920×1080/60fps, silent, 18 seconds. No visitor-facing scene runtime. No fabricated scans, live incidents, API verdicts or security performance metrics.

The current task adds genuine internal-interface motion and improves the outside video/page blend after workspace cleanup. Exact source/capture/render/QA details will be documented with that release. See `docs/NATIVE-QUALITY-REPAIR.md` for the native baseline and `docs/CONTENT-SOURCES.md` for factual boundaries. Older implementations/reports are available in Git history rather than duplicate active files.
