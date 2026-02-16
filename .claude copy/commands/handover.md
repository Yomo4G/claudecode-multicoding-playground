# /handover

This command generates a session handover document
so that the next Claude Code session can continue
with full context.

## Purpose

`/handover` preserves institutional knowledge across sessions.
It prevents context loss when a session ends
due to context window limits, user intent, or interruption.

## When to Use

- Before ending a session intentionally
- When the context window is approaching its limit
- When switching to a different task or phase

## Output

- File: `.claude/state/HANDOVER.md`
- Mode: Overwrite (always replace the previous version)
- The file is for Claude Code consumption.
  Humans may read it, but it is not intended as documentation.

## Required Sections

The generated HANDOVER.md must contain exactly these sections:

### Session Summary

- What was the goal of this session
- What was accomplished
- What was not accomplished

### Decisions Made

- All decisions confirmed by the human during this session
- Include the rationale if discussed

### Current State

- Which files were created or modified
- Current status of tasks (if tasks exist)
- Any in-progress work that is not yet complete

### Issues and Pitfalls

- Problems encountered during this session
- Workarounds applied
- Known issues that remain unresolved

### Lessons Learned

- Insights that would help the next session avoid mistakes
- Patterns that worked well
- Approaches that failed and should not be repeated

### Next Steps

- What should the next session do first
- Any dependencies or prerequisites
- Open questions that require human input

## Content Rules

- Be concrete and specific, not vague or general
- Include file paths, command names, and error messages where relevant
- Do not include explanatory prose or commentary
- Use bullet points and short statements
- Keep the document under 200 lines

## Pre-Generation Actions

Before generating HANDOVER.md, the AI must:

1. Stop the dev server if it is running: `pnpm teardown`

## Post-Generation Actions

After generating HANDOVER.md, the AI must:

1. Stage the file: `git add .claude/state/HANDOVER.md`
2. Commit with message: `:handshake: Update session handover`
3. Push to remote: `git push`

These actions are mandatory and must not be skipped.
The auto-commit ensures the next session can read the file
regardless of how or where it starts.

## Restrictions

- This command must not modify any file other than `.claude/state/HANDOVER.md`
- This command must not modify contexts, rules, or tasks
- This command must not perform any implementation work
- The handover document must reflect facts, not assumptions
