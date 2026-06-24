---
description: Prepare this branch for human review by combining design readiness, PR scope, validation, and remaining risk into one report. Use before saying the branch is ready or before converting a draft PR to ready.
disable-model-invocation: true
---

## Live project state

!`git status --short --branch`

!`git log --oneline --decorate --max-count=12`

!`git diff --stat @{upstream}...HEAD 2>/dev/null || git diff --stat origin/main...HEAD 2>/dev/null || true`

!`git diff --name-only @{upstream}...HEAD 2>/dev/null || git diff --name-only origin/main...HEAD 2>/dev/null || true`

!`test -f package.json && cat package.json || true`

## Instructions

Run or verify the core checks:

1. `npm run build-storybook -- --quiet` when design files exist.
2. `git diff --check`.
3. Changed-file secret scan. Do not print real secret values.
4. Generated-output check for `storybook-static/`, `ds-bundle/`, `.design-sync/.cache/`, `.design-sync/sb-reference/`, and `node_modules/`.

Then produce a concise Japanese report:

- Ready / not ready.
- What changed.
- What was validated.
- What remains risky.
- Whether the PR can stay draft, be marked ready, or should be split.

Do not push, create PRs, mark a PR ready, or merge from this skill. It is a review-prep command.

