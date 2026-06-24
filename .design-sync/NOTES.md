# design-sync notes — x-auto-post Design System

Project: **x-auto-post Design System** (`d0fc5609-32d9-48f1-a2f1-c6e401ff932f`)
Shape: **storybook**. Components:

- **PostCard** (`src/design/PostCard.tsx`), styled by `src/design/post-card.css`. 3 stories.
- **SakurazakaDeck** (`src/design/SakurazakaDeck.tsx`), styled by `src/design/sakurazaka-deck.css`. 4 stories: Full Deck / Cover / Sponsor Pitch / Roadmap.

## What this sync set up (don't undo without reading)

- **Barrel entry + package fields.** This is the design system's OWN source repo — there is no `dist/`. Export discovery (`exportedNames`) reads `package.json` `types`, so the sync added:
  - `src/design/index.ts` — barrel re-exporting `PostCard` + types.
  - `package.json` `module` / `types` / `exports["."]` → `src/design/index.ts`.
  - `cfg.entry: "src/design/index.ts"` (the esbuild bundle entry).
  Without these, the build prints `[TITLE_UNMAPPED] … dropped: PostCard`, `exported PascalCase symbols: 0`, and emits **0 components**.
- **`@types/react` is a repo devDependency.** The converter resolves prop bodies from `--node-modules` (= repo `node_modules`). Missing it → `[DTS_REACT]`, empty prop bodies. Installed in the repo (not just `.ds-sync`).
- **Inter is shipped (user-approved).** The CSS uses `font-family: Inter, …` but the repo never bundled it → `[FONT_MISSING]`. Fixed by:
  - `npm i @fontsource/inter`; `cfg.extraFonts` → its `latin-400..900` CSS (latin subset only; content is Latin + Japanese).
  - **`.storybook/preview.ts` imports the same `@fontsource/inter/latin-*.css`** so the reference storybook (the fidelity oracle) renders Inter too — otherwise preview-vs-storybook would diverge on Latin glyphs. **These two must move together**; rebuild `.design-sync/sb-reference` after any `preview.ts` change.
- **`cfg.overrides.PostCard.cardMode: "column"`** — stories render wider than a grid cell (`[GRID_OVERFLOW] wide`); column gives each story full card width.
- **`cfg.overrides.SakurazakaDeck.cardMode: "single"`** — the primary story is a 16-slide overview for the 桜坂の経営者 sponsor pitch deck. The component embeds its required JPGs as data URIs in `src/design/sakurazaka-assets.ts` so Design Sync preview does not depend on external image loading.

## Grading

All 3 stories (Executive Memo / Market Signal / Priority) **image-judged `match`** on the first sync. Framing/scale differs by design (storybook centers the card on a tight charcoal canvas; the preview frames it on a larger dark page with the card's drop-shadow visible) — ignored per the rubric. Tone variants (gold/teal/coral), badges, avatar, gold rule, and Inter typography all match.

SakurazakaDeck stories (Full Deck / Cover / Sponsor Pitch / Roadmap) are **image-judged `match`** after embedding assets. Full Deck is intentionally a 4x4 overview so Claude Design can inspect the 16-slide proposal at once; individual slide stories keep the full 16:9 slide scale.

### 2026-06-24 design polish (CSS-only, both sb + ds re-verified `match`)
Minor proposal-quality tweaks to `sakurazaka-deck.css` only — no `.tsx`/asset changes, so the grade contract is unchanged (styling-class carry):
- **Roadmap**: `PHASE 1-5` labels (CSS counter), gold top-accent per card, gold `›` chevron connectors between phases, taller balanced cards, top margin 138→108px.
- **Sponsor pitch (`.sz-benefits`)**: number is now a 30px gold left rail in a 2-col grid (`auto 1fr`) with heading/detail stacked — long headings can no longer collide with the number.
- **Cover**: gradient dark-band pushed right (40%→46% solid, 58%→62%) + a bottom vignette so the full title sits on near-solid black.
- **16-slide overview**: gold leading-zero index badges (01-16) per thumbnail via a `.sz-stage--overview` CSS counter — turns the overview into a referenceable contact sheet.
PostCard was re-confirmed `match` via the driver's `reference_drift` canary spot-check (sz-* and post-card__* namespaces don't collide).

- 2026-06-24: manual browser verification complete — claude.ai/design (owner 南原, Published) shows both PostCard & SakurazakaDeck with live previews and all 17 SakurazakaDeck variants in the README.

## Component quirks (documented in conventions.md for the design agent)

- Avatar glyph is the **hardcoded character `南`** — `accountName`/`handle` do not change it.
- Badge label is **derived from `tone`** (executive→Executive Memo, signal→Market Signal, urgent→Priority) — not a prop.
- Card is designed for a **dark `#0f1115` surface**; no provider/context.

## Re-sync risks (watch-list for the next run)

- **Font coupling.** If `@fontsource/inter` is removed or version-bumped, update BOTH `cfg.extraFonts` and `.storybook/preview.ts`, then rebuild `sb-reference`. A `preview.ts`/source change without an `sb-reference` rebuild trips `[REFERENCE_STALE?]`.
- **Export plumbing is load-bearing.** If `package.json` `types`/`module`/`exports` or `src/design/index.ts` is removed/renamed, export discovery silently drops PostCard. Re-verify after any package.json refactor.
- **Japanese fonts are OS-provided** (Hiragino/Yu Gothic, in the font-family fallback). Not shipped — acceptable and intentional (only Inter, the listed primary, was shipped). On a machine without those, Japanese falls back to a system sans; the design agent's hosts generally have them.
- **`@types/react` must stay installed** in the repo for prop-body extraction on re-sync.
- Stories use a fixed `timestamp` string ("Today 19:00") — no `new Date()`/random content, so captures are deterministic.
- `SakurazakaDeck` image data is generated from `projects/sakurazaka_program/assets/*.jpg`. If those source images are replaced, regenerate `src/design/sakurazaka-assets.ts`, rebuild Storybook, and run Design Sync again.
