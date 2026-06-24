---
description: Start or resume work in x-auto-post by reading the current branch, PR, local changes, Claude Design state, and safest next actions. Use at the beginning of a session or when the user asks "今どういう状態?" or "何してる?".
disable-model-invocation: true
---

## Live project state

!`git status --short --branch`

!`git log --oneline --decorate --max-count=10`

!`git remote -v`

!`gh pr view --json number,title,isDraft,baseRefName,headRefName,url,changedFiles 2>/dev/null || true`

!`test -f .design-sync/NOTES.md && sed -n '1,180p' .design-sync/NOTES.md || true`

!`test -f package.json && node -e "const p=require('./package.json'); console.log(JSON.stringify({name:p.name,scripts:p.scripts,module:p.module,exports:p.exports}, null, 2))" || true`

## Instructions

Produce a concise Japanese status report with:

1. Current branch/worktree and whether it is clean.
2. Open PR, if detected.
3. What this repo currently appears to contain: X automation, Claude Design assets, or both.
4. Untracked or risky files that should not be staged blindly.
5. Recommended safest next action.

Do not modify files, stage changes, push, or run long builds from this skill. It is a state-orientation command.
