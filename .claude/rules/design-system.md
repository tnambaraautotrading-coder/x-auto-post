---
paths:
  - "src/design/**/*"
  - ".design-sync/**/*"
  - ".storybook/**/*"
  - "package.json"
  - "tsconfig.json"
---

# Design system rules

- Keep `PostCard` and `SakurazakaDeck` exported from `src/design/index.ts`; Design Sync discovery depends on named exports.
- Keep `package.json` `module`, `types`, and `exports["."]` pointing to `src/design/index.ts` unless replacing the Design Sync entry intentionally.
- Keep `@fontsource/inter` imports in `.storybook/preview.ts` aligned with `.design-sync/config.json` `extraFonts`.
- Treat `storybook-static/`, `ds-bundle/`, `.design-sync/.cache/`, `.design-sync/sb-reference/`, and `.design-sync/node_modules` as generated outputs. Do not commit them unless explicitly requested.
- For proposal deck changes, verify text fit at the 16:9 slide scale and the 4x4 overview scale.
- Prefer stable layout dimensions over content-driven resizing: fixed slide aspect ratios, grid columns, and min/max text areas.
- For Claude Design handoff, update `.design-sync/NOTES.md` only when the note helps a future re-sync or review.

