---
description: Audit a branch before pushing or opening a PR. Use when the user asks whether changes can go to GitHub, when a branch is ahead, or before creating/updating a PR.
disable-model-invocation: true
---

## Live project state

!`git status --short --branch`

!`git log --oneline --decorate --max-count=12`

!`git remote -v`

!`git diff --stat @{upstream}...HEAD 2>/dev/null || git diff --stat origin/main...HEAD 2>/dev/null || true`

!`git diff --name-only @{upstream}...HEAD 2>/dev/null || git diff --name-only origin/main...HEAD 2>/dev/null || true`

## Instructions

Produce a PR-readiness report with:

1. Current branch, upstream/base, ahead/behind state.
2. Commits that would be pushed or included in the PR.
3. Changed files grouped by purpose.
4. Untracked or modified files that are not part of the intended PR.
5. Secret/credential risk check. Search only changed files and report matches; do not print secret values.
6. Validation commands already run and commands still needed.
7. Recommended next action:
   - safe to push,
   - create a cleaner branch,
   - split PR,
   - or stop and ask the user.

Never run `git push`, `gh pr create`, `git add -A`, or a destructive command from this skill. It is a report-only command.

