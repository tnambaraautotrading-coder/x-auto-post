# x-auto-post Claude Code guide

Use this file as the project map for Claude Code sessions. Keep it short: long procedures belong in project skills under `.claude/skills/`.

## Project map

- X automation runtime: existing Python app, GitHub Actions, and prompts under `src/`, `.github/`, `prompts/`, and `README.md`.
- Claude Design assets: React/Storybook design system under `src/design/`.
- Claude Design sync state: `.design-sync/`, with operational notes in `.design-sync/NOTES.md`.
- Higgsfield MCP is configured in `.mcp.json`.

## Current design system

- Claude Design project: `x-auto-post Design System` (`d0fc5609-32d9-48f1-a2f1-c6e401ff932f`).
- Components:
  - `PostCard`: X post candidate review card.
  - `SakurazakaDeck`: 桜坂の経営者 sponsor pitch deck.
- Storybook build command: `npm run build-storybook -- --quiet`.
- Manual browser verification was completed on 2026-06-24 and recorded in `.design-sync/NOTES.md`.

## Default workflow

- If the session starts from an unclear state, run `/work-start` before doing anything else.
- Before editing, run `git status --short --branch` and identify unrelated local work.
- Do not stage broad paths such as `git add -A` when media, generated outputs, or unrelated files are present.
- Keep unrelated work out of design-system PRs. For this repo, check for accidental `media/**`, `projects/**`, `checkpoints/**`, `storybook-static/**`, `ds-bundle/**`, `.env`, and `secrets/**`.
- If the branch has mixed/unrelated work, run `/clean-branch-plan` before pushing or opening a PR.
- Before a commit or PR, run `/pr-scope-audit`.
- Before design sync or UI handoff, run `/design-sync-check`.
- When comparing proposal/deck visuals before and after Claude Design work, run `/design-compare`.
- Before asking for review or marking work done, run `/review-ready`.
- When ending a session, run `/session-handoff` and include what was changed, what was verified, what is blocked, and the exact next action.
- After adding or changing files under `.claude/skills/`, use `/reload-skills` or restart Claude Code so new slash commands are available.

## Useful built-in commands

- `/plan`: use before broad changes or when the user says the direction is unclear.
- `/context`: check what is filling the context window during long sessions.
- `/compact <focus>`: preserve important state before the context gets noisy, for example `/compact focus on current branch, changed files, blockers, next action`.
- `/diff`: inspect local changes before committing.
- `/code-review`: run a correctness-focused review before asking a human to review.
- `/security-review`: use when changes touch auth, credentials, external APIs, or deployment.
- `/remote-control`: use when the user wants to watch or continue the same local session from a phone.

## Safety rules

- Never read, print, commit, or summarize real secrets from `.env`, `.env.local`, `.env.production`, `secrets/**`, `cookies/**`, or `session_data/**`.
- `.env.example` is allowed because it contains placeholders.
- Push/PR only after confirming the branch base, commit list, changed files, and validation results.
- For Claude Design work, keep generated cache/build folders untracked unless explicitly requested.
- Path-specific design rules live in `.claude/rules/design-system.md` and should guide changes under `src/design/`, `.design-sync/`, and `.storybook/`.
