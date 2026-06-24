---
description: Check whether the x-auto-post Claude Design / Storybook assets are ready to sync, review, or hand off. Use before design-sync, visual QA, or reporting design status.
disable-model-invocation: true
---

## Live project state

!`git status --short --branch`

!`test -f package.json && cat package.json || true`

!`test -f .design-sync/config.json && cat .design-sync/config.json || true`

!`test -f .design-sync/NOTES.md && sed -n '1,220p' .design-sync/NOTES.md || true`

## Instructions

1. State whether `PostCard` and `SakurazakaDeck` are present under `src/design/`.
2. Run `npm run build-storybook -- --quiet` unless the user asked for analysis only.
3. Check that generated folders are not staged: `storybook-static/`, `ds-bundle/`, `.design-sync/.cache/`, `.design-sync/sb-reference/`.
4. Verify `.design-sync/config.json` points at the expected project id `d0fc5609-32d9-48f1-a2f1-c6e401ff932f`.
5. Report:
   - build result,
   - changed files relevant to design sync,
   - any unrelated files that must not be staged,
   - the next safe action.

Do not push, create PRs, or touch secrets from this skill.

