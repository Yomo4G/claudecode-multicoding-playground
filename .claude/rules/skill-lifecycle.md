# Skill Lifecycle

This rule governs how reusable skills are created
and managed in this project.

Skills are reusable procedural patterns that Claude Code
captures for consistent execution across tasks.

## Precondition

The Skill Lifecycle is active ONLY when
the `.claude/skills/` directory exists.

If the directory does not exist, Claude Code must not
create or manage skills.

## Skill Acquisition Path

Skills are created through conversation.
The user requests a skill interactively during any session.

Flow:
1. User describes the skill they want
2. Run overlap check (see Evaluation below)
3. If overlap found, inform user and stop
4. Present the proposed SKILL.md content for confirmation
5. User approves → generate `.claude/skills/{name}/SKILL.md`
6. User rejects → discard

## Evaluation: Overlap Check

Before creating any skill, Claude Code must check
for overlap with existing skills.

Read all `SKILL.md` files in `.claude/skills/*/SKILL.md`.
Compare the candidate against existing skills
by `name`, `trigger`, and `tags`.

- If a skill with substantially overlapping purpose exists,
  inform the user and do not create.
- If the candidate extends an existing skill,
  suggest updating the existing skill instead.

## Skill Format (Agent Skills Spec)

Skills follow the [Agent Skills specification](https://agentskills.io/specification).
Each skill is a directory containing a `SKILL.md` file
with YAML frontmatter and a Markdown body.

### Directory Structure

```
.claude/skills/
  {name}/
    SKILL.md            # Required
    scripts/            # Optional: executable scripts
    references/         # Optional: detailed reference docs
```

### SKILL.md Format

```markdown
---
name: rename-concept
description: >
  Renames a domain model concept across all project layers
  including type definitions, components, API routes, and tests.
  Use when a domain concept needs to be renamed consistently.
compatibility: Designed for Claude Code
metadata:
  version: "1"
---

## Triggers

- When renaming a domain model concept
- When user references a previous rename ("same as before")

## Preconditions

- Project has established domain model with type definitions

## Steps

1. Update type definitions
   - Target: `src/types/**`
2. Update components
   - Target: `src/components/**`
3. Update API routes
   - Target: `src/api/**` or `backend/src/**`
4. Update tests
   - Target: `tests/**`
5. Verify no remaining references
   - Verify: `grep -r "OldName"` returns zero results

## Tags

refactoring, domain-model
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Max 64 chars. Lowercase letters, numbers, hyphens only. Must match directory name. |
| `description` | Yes | Max 1024 chars. What the skill does and when to use it. |
| `license` | No | License name or reference. |
| `compatibility` | No | Environment requirements. |
| `metadata` | No | Arbitrary key-value pairs (e.g., version, author). |

### Description Style

Descriptions should be written to maximize trigger accuracy.
They should clearly state what the skill does
and specify when it should be used.

Good example:
  "Enforces route-level and data-level access control.
   Use when creating API endpoints that access user-specific data,
   admin routes, or any route handling user-owned resources.
   If you see authorization, IDOR, or role checks, USE THIS SKILL."

Bad example:
  "A skill for access control."

The description is the primary triggering mechanism.
Specificity and directness improve invocation accuracy.

### Markdown Body Conventions

The body uses free-form Markdown with these project-specific sections:

| Section | Purpose |
|---------|---------|
| `## Triggers` | Conditions that activate this skill |
| `## Preconditions` | Required state before applying |
| `## Steps` | Numbered procedure with Target/Verify annotations |
| `## Tags` | Comma-separated category tags |

These sections are project conventions within the Agent Skills spec.
External agents can read the body as plain Markdown.

Rules:
- Skills follow the Agent Skills directory format.
- The `name` in frontmatter must match the directory name.
- Steps describe procedures with optional code examples.
  Supporting scripts should be placed in `scripts/`.
  Detailed references should be placed in `references/`.
- Each skill must have at least one Trigger
  and at least 3 Steps in the body.

## Skill Metadata

Skills created through conversation must include:

```yaml
metadata:
  origin: conversation
  created_date: "{ISO 8601}"
```

## Skill Consumption

At the start of each session, if `.claude/skills/` exists,
Claude Code must read all `SKILL.md` files under `.claude/skills/*/`.
Skill descriptions are loaded into context.
Full skill content is loaded when invoked.

During execution:
- Before starting a task, check if any loaded skill
  matches the current work by comparing triggers.
- If a match is found, follow the skill's steps.
- If no match is found, proceed normally.

## Constraints

- Claude Code must NEVER generate a skill directory or SKILL.md
  without human approval.
- Claude Code must NEVER skip the overlap check.
- Skills are created through conversation.
- If `.claude/skills/` does not exist,
  the entire lifecycle is disabled.
