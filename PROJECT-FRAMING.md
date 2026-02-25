# Project Framing

Detailed guide for the planning phase where rules, tasks,
and completion criteria are defined before implementation.

For getting started, see [README.md](README.md).

---

## Overview

Run `/plan` in Claude Code to initiate Project Framing.

This phase verifies readiness using an explicit checklist,
defines rules and tasks, and requires a conscious human GO
before execution is allowed to proceed.

---

## Process Flow

1. **Read contexts** — Claude reads all `.claude/contexts/` files as assumed truth
2. **Identify gaps** — Missing or risky areas are flagged
3. **Propose rules** — Hard constraints for the execution phase
4. **Propose tasks** — Implementation work broken into dependency-ordered units
5. **Define completion criteria** — Measurable conditions for task completion
6. **Human approval** — Nothing is written until explicitly approved

---

## What It Produces

### Rules (`.claude/rules/`)

Hard constraints that Claude must follow during execution.
Examples include testing requirements, error handling policies,
and documentation scope rules.

### Tasks (`.claude/tasks/`)

Implementation work items with:
- Clear scope and acceptance criteria
- Dependency ordering between tasks
- Assignment to specific agent roles

### Completion Criteria

Measurable conditions that must be met
for each task to be considered done.

---

## Governance Structure

Over time, you may introduce additional governance layers by
manually creating directories under `.claude/`.

| Directory | Purpose |
|-----------|---------|
| `.claude/contexts/` | Project purpose, assumptions, constraints |
| `.claude/rules/` | Hard rules and prohibitions |
| `.claude/skills/` | Reusable procedural skills |
| `.claude/output-styles/` | Standardized output formats |
| `.claude/workflows/` | Approved step-by-step procedures |
| `.claude/quality-gates/` | Checklists and verifiable conditions |
| `.claude/hooks/` | Deterministic enforcement points |
| `.claude/agents/` | AI role definitions for multi-agent orchestration |
| `.claude/mcp/` | Approved external integrations |

The act of creating a directory is itself an **explicit human decision**.
If a directory does not exist, Claude treats the concept as non-existent.

### Design Rules

- `.claude/` contains **only machine-readable governance assets**
- No explanatory README files exist under `.claude/`
- The **existence of a directory** means it was explicitly enabled by humans
- Missing directories mean the concept is **not adopted**

---

## Example Generated Files

After Project Framing, your `.claude/` structure might include:

```
.claude/
├─ rules/
│  ├─ execution-permissions.md    # Always present
│  ├─ testing.md                  # Generated during framing
│  ├─ done-definition.md          # Generated during framing
│  └─ failure-handling.md         # Generated during framing
├─ tasks/
│  ├─ phase1-foundation.md        # Task group 1
│  ├─ phase2-core.md              # Task group 2
│  ├─ phase3-features.md          # Task group 3
│  └─ phase4-system.md            # Task group 4
└─ ...
```
