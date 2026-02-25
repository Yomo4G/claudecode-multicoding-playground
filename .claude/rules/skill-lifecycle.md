# Skill Lifecycle

This rule governs how reusable skills are detected, evaluated,
recorded, and generated during autonomous execution.

Skills are steps-based procedural patterns that Claude Code
identifies from repeated work during MVP development.

## Precondition

The Skill Proposal Lifecycle is active ONLY when
the `.claude/skills/` directory exists.

If the directory does not exist, Claude Code must not
detect, record, or propose skills.

## Detection

Claude Code must monitor its own actions during execution
and flag potential skill candidates when ANY of the following
triggers are observed:

- The same sequence of actions is performed 2 or more times
  within a single session
- The same structural change is applied to 3 or more files
- The user gives an instruction that references a previous action
  (e.g., "same as before", "do the same thing for X")
- A refactoring decision applies a consistent rule
  across multiple locations

## Evaluation: 4-Stage Check

When a potential skill candidate is detected,
Claude Code must run the following checks in order.
If a check results in rejection, skip remaining checks.

### Stage 1: Existing Skills Overlap Check (lightweight)

Read all `SKILL.md` files in `.claude/skills/*/SKILL.md`.
Compare the candidate against existing skills
by `name`, `trigger`, and `tags`.

- If a skill with substantially overlapping purpose exists,
  reject the candidate.
- If the candidate extends an existing skill,
  record it as an extension candidate instead.

Additionally, if `.claude/agents/` exists:
- Read all files in `.claude/state/skill-candidates/*.json`
- Compare the candidate against pending candidates
  from other agents by `name` and `trigger`

Additionally, read `dashboard.md` and check the
`## Skill Candidates` table for existing pending candidates.
Compare by `Name` and `Trigger` columns.

### Stage 2: Value Assessment (lightweight)

Evaluate the candidate against the following criteria:

| Criterion | Description | Threshold |
|---|---|---|
| Repeatability | Same action performed 2+ times in session | Required |
| Complexity | The procedure has 3+ distinct steps | Required |
| Generality | Applicable to other components/pages/modules | Required |
| Originality | Not fully covered by a well-known best practice | Required |

The candidate must meet at least 3 out of 4 criteria
to proceed. This threshold is configurable
(see Threshold Configuration below).

If the candidate does not meet the threshold, reject it.

### Stage 3: Web Search for Existing Practices (heavy)

Use `WebSearch` to check whether the pattern
is already a well-documented industry practice.

Search query pattern:
`"{pattern description}" best practice site:{framework-docs-domain}`

- If the pattern is entirely covered by an existing
  well-documented practice, reject the candidate.
- If the pattern is partially original
  (project-specific adaptation), proceed.

### Stage 4: Official Documentation Analysis (heavy)

Use `WebSearch` to locate the specific relevant page,
then use `WebFetch` to retrieve and analyze it.

The documentation target is determined by `project.config.json`:

| Config value | Documentation domain |
|---|---|
| `framework: "react"` | react.dev |
| `framework: "next"` | nextjs.org |
| `framework: "vue"` | vuejs.org |
| `framework: "nuxt"` | nuxt.com |
| `framework: "astro"` | docs.astro.build |
| `framework: "gatsby"` | gatsbyjs.com |
| `lint: "biome"` | biomejs.dev |
| `lint: "eslint"` | eslint.org |
| `test: "vitest"` | vitest.dev |
| `test: "playwright"` | playwright.dev |

- If the official documentation provides an identical
  recommended pattern, reject the candidate.
- If the documentation provides a partial match
  but the candidate adds project-specific value, proceed.

## Recording: Dashboard Candidates

Candidates that pass all 4 stages are recorded
in `dashboard.md` under a `## Skill Candidates` section.

### Dashboard Format

```markdown
## Skill Candidates

| # | Name | Trigger | Steps | Criteria | Status |
|---|---|---|---|---|---|
| 1 | rename-concept | Domain concept rename | 5 | 4/4 | pending |

### Candidate Details

#### 1. rename-concept
- **Trigger**: When renaming a domain model concept
- **Steps**: Type defs → Components → API routes → Tests → grep verify
- **Evidence**: Performed 2x in session (User→Account, Post→Article)
- **Web check**: No existing framework pattern found
- **Doc check**: Not covered in official docs
- **Assessment**: Repeatability:Yes Complexity:Yes Generality:Yes Originality:Yes (4/4)
```

### Status Values

| Status | Meaning |
|---|---|
| `pending` | Candidate awaiting batch proposal |
| `rejected` | Human manually rejected (will not be proposed) |

Humans may change `pending` to `rejected` at any time
by editing `dashboard.md`. Candidates not marked `rejected`
remain as proposal targets.

## Batch Proposal

Skill candidates are NOT proposed individually during execution.
They accumulate in `dashboard.md` during development.

At the end of the development phase
(before `/handover` or when explicitly requested),
Claude Code must:

1. Read all `pending` candidates from `dashboard.md`
2. Present them as a batch using `AskUserQuestion`
3. For each approved candidate, generate a skill directory
   `.claude/skills/{name}/` containing a `SKILL.md` file
4. Update `dashboard.md` status accordingly

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
- Steps describe procedures, not implementations.
  No code templates in the body.
- Each skill must have at least one Trigger
  and at least 3 Steps in the body.
- Supporting scripts may be placed in `scripts/`.
- Detailed references may be placed in `references/`.

## Skill Consumption

At the start of each session, if `.claude/skills/` exists,
Claude Code must read all `SKILL.md` files under `.claude/skills/*/`.

During execution:
- Before starting a task, check if any loaded skill
  matches the current work by comparing triggers.
- If a match is found, follow the skill's steps.
- If no match is found, proceed normally
  and watch for new detection triggers.

## Threshold Configuration

The default value assessment threshold is 3 out of 4 criteria.

This threshold can be changed by editing this file directly.
The current threshold is:

```
minimum_criteria: 3
total_criteria: 4
```

Humans may increase this to 4/4 for stricter evaluation
or decrease to 2/4 for more permissive recording.

## Retro Path (Special Exception)

When skills are generated by the `/retro` command,
an alternative evaluation path is used.

### Retro Path Stages

1. **Stage 1: Existing Skills Overlap Check** -- REQUIRED
   Same as the standard Stage 1.

2. **Stage 2: Value Assessment** -- REQUIRED
   Same as the standard Stage 2.
   Must meet the configured threshold (default 3/4).

3. **Stage 3: Web Search** -- SKIPPED
   Retro-detected patterns are project-specific rework
   patterns unlikely to appear in framework documentation.

4. **Stage 4: Documentation Analysis** -- SKIPPED
   Same rationale as Stage 3.

### Retro Path Approval

Skills that pass Stages 1-2 via the retro path
are generated directly without batch proposal
or human approval.

This exception applies ONLY when `/retro` is active.

### Retro Path Metadata

Skills generated via the retro path must include:

```yaml
metadata:
  origin: retro
  retro_date: "{ISO 8601}"
```

### Retro Path Constraints

- Only the `/retro` command may use the retro path
- The retro path must not be used during normal execution
- Retro-generated skills have the same authority
  as standard skills once generated

## Constraints

- Claude Code must NEVER generate a skill directory or SKILL.md
  without explicit human approval via batch proposal.
- Claude Code must NEVER skip the 4-stage check.
- Claude Code must NEVER propose skills during active execution.
  Proposals happen only at end-of-development.
- If `.claude/skills/` does not exist,
  the entire lifecycle is disabled.
- Exception: The `/retro` command may generate skills
  using the retro path defined above, bypassing
  Stages 3-4 and batch proposal.
