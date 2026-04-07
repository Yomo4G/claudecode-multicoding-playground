# CLAUDE.md Maintenance

This rule governs the size and structure of CLAUDE.md.

## Line Limit

CLAUDE.md must stay under 200 lines.
This is the recommended maximum for optimal adherence
by Claude Code (per Anthropic guidance).

## When Adding Content

Before adding new content to CLAUDE.md:

1. Check the current line count of CLAUDE.md.
2. If the addition would exceed 200 lines:
   - Extract the new content into a separate file
     under `.claude/policies/`.
   - Add an `@import` reference in CLAUDE.md instead.
3. If the addition fits within 200 lines:
   - Add it directly, but consider extraction
     if the content is self-contained and long (30+ lines).

## Extraction Rules

- Extract to `.claude/policies/{topic-name}.md`.
- Each extracted file must be self-contained
  (understandable without reading CLAUDE.md).
- Use `@.claude/policies/{topic-name}.md` in CLAUDE.md
  to import the extracted file.
- One `@import` per line. Place it where the original
  section heading was.

## What NOT to Extract

- Core identity statements (Project Purpose, Guiding Principle)
- Governance model definition
- Configuration-First Policy
- Short rules (under 10 lines)

These belong in CLAUDE.md directly
as they define the project's fundamental character.

## Relationship to Other Directories

- `.claude/rules/`: Auto-loaded by Claude Code's rules system.
  Do not duplicate with `@import`.
- `.claude/contexts/`: Domain knowledge files.
  May be selectively `@import`ed when always needed.
- `.claude/policies/`: Extracted policy sections from CLAUDE.md.
  Always loaded via `@import`.
