---
description: Create a compact handoff note for another Claude Code/Codex session. Use when pausing, switching sessions, or preparing instructions for a remote session.
disable-model-invocation: true
---

## Live project state

!`git status --short --branch`

!`git log --oneline --decorate --max-count=8`

## Instructions

Write a handoff in Japanese with these sections:

1. 現在地: branch, PR number if known, and whether the tree is clean.
2. 完了済み: concrete artifacts, commits, URLs, and validation results.
3. 未完了: remaining tasks, blockers, and manual checks.
4. 触ってはいけないもの: unrelated/untracked files, secrets, generated outputs.
5. 次に出すべき指示: a copy-paste-ready instruction for the next Claude Code session.

Keep it concise enough to paste into another session.

