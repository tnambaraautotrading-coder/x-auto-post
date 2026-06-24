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

- Before editing, run `git status --short --branch` and identify unrelated local work.
- Do not stage broad paths such as `git add -A` when media, generated outputs, or unrelated files are present.
- Keep unrelated work out of design-system PRs. For this repo, check for accidental `media/**`, `projects/**`, `checkpoints/**`, `storybook-static/**`, `ds-bundle/**`, `.env`, and `secrets/**`.
- Before a commit or PR, run `/pr-scope-audit`.
- Before design sync or UI handoff, run `/design-sync-check`.
- When ending a session, run `/session-handoff` and include what was changed, what was verified, what is blocked, and the exact next action.

## Safety rules

- Never read, print, commit, or summarize real secrets from `.env`, `.env.local`, `.env.production`, `secrets/**`, `cookies/**`, or `session_data/**`.
- `.env.example` is allowed because it contains placeholders.
- Push/PR only after confirming the branch base, commit list, changed files, and validation results.
- For Claude Design work, keep generated cache/build folders untracked unless explicitly requested.

