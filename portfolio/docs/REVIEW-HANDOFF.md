# Review handoff — isolated deployment, no main changes

## Actual state

- Repository base: `https://github.com/jeff-1217/Portfolio`
- Base commit: `809388399e17c9e949f14ef201ece51701ec5816`
- Feature branch: `fix/native-glass-quality`
- Latest eight-project film audit/render/QA: `docs/SPATIAL-SHOWREEL.md` and `docs/QA-SPATIAL-SHOWREEL-2026-10-22.json`. Earlier hero records remain historical. The earlier feature branch remains preserved.
- Local application preview: Vite on port 5173 in the provided workspace.
- The branch is committed locally and included in the review bundle.
- **No branch was pushed. No remote PR was created. No merge was performed.** The redesigned review copy is now manually hosted in the approved separate Vercel project; the original main/site/domain are untouched.
- Main was not checked out or committed to. The original remote-tracking main ref is left unchanged.

## Review without touching main

Use the provided source ZIP for a normal local run, or use the Git bundle to preserve the feature branch and its original history:

```bash
# In an existing clone of jeff-1217/Portfolio:
git fetch /path/to/portfolio-review.bundle \
  fix/native-glass-quality:fix/native-glass-quality
git switch fix/native-glass-quality
npm ci
npm run dev
```

Alternatively clone the bundle directly into a new directory on the feature branch:

```bash
git clone -b fix/native-glass-quality /path/to/portfolio-review.bundle portfolio-review
cd portfolio-review
npm ci
npm run dev
```

The standalone HTML is a zero-network preview of the same source, including the complete page navigation, project data, photographs, fonts, and PDF. It deliberately uses internal memory navigation in sandboxed viewers. External destinations and email/download actions still depend on browser permissions.

## Opening the requested PR later

These commands are supplied for the repository owner to run with authenticated GitHub access. **They were not executed here.** Ensure the remote points to the intended repository before pushing; if this was cloned from the bundle, update its origin URL first.

```bash
git switch fix/native-glass-quality
git remote -v
# Only if origin is still the local bundle path:
# git remote set-url origin https://github.com/jeff-1217/Portfolio.git

git push -u origin fix/native-glass-quality
gh pr create --repo jeff-1217/Portfolio --base main \
  --head fix/native-glass-quality \
  --title "Reimagine Jefrine’s portfolio as an interactive security dossier" \
  --body-file docs/PULL_REQUEST.md
```

Do not merge or run a deployment command. If the no-deploy rule also includes automated hosting-provider PR previews, review that provider's branch-preview settings before any push. No hosting configuration was changed remotely by this work.

## Scope to review

1. Confirm the 19 case studies and 26-repository inventory.
2. Review the current Doha/Qatar base and the four PDFs supplied on 22 October; the source PDFs remain unchanged and historical work/training locations are retained.
3. Test the interactive globe, local SOC scenario, filters, keyboard search, mobile menu, and motion switch.
4. Review explicit prototype / lab / simulation boundaries and source links.
5. Verify the source ZIP, standalone HTML, and feature-branch bundle match the same implementation.

The live site is not changed by running the local preview or opening the standalone file.

## Current liquid-glass edit

The active hero is the 18-second 1080p60 footage-only edit with one small control and no visible labels/film CTA. See `LIQUID-GLASS-EDIT.md` and `QA-LIQUID-GLASS.json`. The new MP4 and standalone HTML are separate deliverables to avoid archive duplication. The old `portfolio-review.bundle` is historical (the preceding spatial-film release); the current feature branch/source ZIP are authoritative for this edit. No main/remote changes.

## Native quality repair is current

The prior footage-only edit is superseded after the owner approved native re-export. Read `NATIVE-QUALITY-REPAIR.md` and `QA-NATIVE-QUALITY.json`. Current native 1080p60 footage has no editorial bottom cards/title/index planes, high-density genuine app captures and the same original camera/environment/approved 18s timing. Video/poster URLs are versioned and legacy paths alias to the replacement. Old bundle remains historical; current workspace/source archive is authoritative.
