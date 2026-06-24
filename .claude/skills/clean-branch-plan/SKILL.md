---
description: Plan a clean PR branch when the current branch has unrelated commits, generated files, media, credentials, or mixed task history. Use before push or PR when the user wants only a subset of changes included.
disable-model-invocation: true
---

## Live state

!`git status --short --branch`

!`git log --oneline --decorate --max-count=15`

!`git branch -vv`

!`git diff --stat @{upstream}...HEAD 2>/dev/null || git diff --stat origin/main...HEAD 2>/dev/null || true`

!`git diff --name-only @{upstream}...HEAD 2>/dev/null || git diff --name-only origin/main...HEAD 2>/dev/null || true`

## Instructions

Produce a Japanese clean-branch plan with:

1. Current branch and likely intended base branch.
2. Commits/files that appear relevant to the requested PR.
3. Commits/files that look unrelated or risky.
4. A safe worktree/cherry-pick plan, if needed.
5. Validation commands to run before push.
6. Exact next command only if it is safe and non-destructive.

Do not run `git push`, `gh pr create`, `git reset`, `git checkout --`, `git clean`, or destructive commands from this skill. It is a planning command.
