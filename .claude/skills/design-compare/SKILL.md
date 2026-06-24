---
description: Compare available Sakurazaka proposal/deck visual artifacts before and after Claude Design setup. Use when the user asks what changed visually, whether there is a before/after comparison, or how the proposal design improved.
disable-model-invocation: true
---

## Known comparison artifacts

- Earlier PowerPoint/contact-sheet style preview: `/tmp/codex-presentations/sakurazaka-designer-deck/tmp/preview/contact-sheet.jpg`
- Claude Design / Storybook refined overview: `/tmp/sakurazaka_design_story_full_refined.png`
- Claude Design browser confirmation screenshot: `/tmp/x-auto-post-design-system-confirmation.png`
- Possible PPT outputs:
  - `/Users/taku/x-auto-post/projects/sakurazaka_program/sakurazaka_tiger_designer_deck.pptx`
  - `/Users/taku/x-auto-post/projects/sakurazaka_program/sakurazaka_proposal.pptx`

## Live artifact check

!`ls -lah /tmp/codex-presentations/sakurazaka-designer-deck/tmp/preview/contact-sheet.jpg /tmp/sakurazaka_design_story_full_refined.png /tmp/x-auto-post-design-system-confirmation.png 2>/dev/null || true`

!`find /tmp /Users/taku/x-auto-post/projects/sakurazaka_program -maxdepth 5 \( -iname '*sakurazaka*' -o -iname '*桜坂*' -o -iname '*design-system-confirmation*.png' \) 2>/dev/null | sed -n '1,120p'`

!`git status --short --branch`

## Instructions

Produce a Japanese comparison report:

1. Which artifacts are available and which are missing.
2. What can be compared fairly. Note that PPT contact sheets and Storybook/Claude Design previews are different render paths.
3. Visual differences to inspect: typography hierarchy, photo handling, title overlap, slide density, brand tone, 4x4 overview readability.
4. Whether the current state is good enough for review or needs a side-by-side comparison image exported.

Do not edit files from this skill unless the user explicitly asks for a correction.
