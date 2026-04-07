# Execution Engine

Detailed guide for the execution phase where Claude Code
autonomously implements your project.

For getting started, see [README.md](README.md).

---

## Overview

Run `/yoroshiku` in Claude Code to grant GO
and hand execution over to the AI.

Once execution begins, Claude operates autonomously
under strict permission rules.
Humans monitor progress via `dashboard.md`
and only intervene when the dashboard shows blocked tasks.

---

## Execution Permissions

Claude Code operates under explicit constraints
defined in `.claude/rules/execution-permissions.md`.

### Writable Paths

Claude may only create, modify, or delete files in:

- `src/**`, `frontend/**`, `backend/**` — product code
- `tests/**` / `test/**` — test files
- `public/**` — static assets
- `db/**` — database files
- `.claude/state/**`, `.claude/tasks/**`, `.claude/skills/**` — execution state
- `dashboard.md` — progress dashboard
- `.github/workflows/**` — CI workflows
- Tool configuration files (`tsconfig.json`, `vite.config.ts`, etc.)
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`

### Protected Paths (Never Modified)

- `CLAUDE.md`, `project.config.json`
- `.claude/commands/**`, `.claude/rules/**`, `.claude/contexts/**`, `.claude/agents/**`
- `scripts/**`, `README.md`

### Prohibited Commands

- Git destructive operations (`push --force`, `reset --hard`, `branch -D`)
- Publishing (`npm publish`, `pnpm publish`)
- System-level changes (`brew install`, `rm -rf` on protected paths)
- Creating or modifying `.env` or credential files

If a prohibited action is needed, Claude must stop and ask.

---

## Multi-Agent Orchestration

When `.claude/agents/` exists, the project uses
a multi-agent system with 8 specialized roles.

### Agent Roles

| Role | Description | Instances |
|------|-------------|-----------|
| Orchestrator | Coordinates task assignment and agent lifecycle | 1 |
| Implementer | Writes product code after approval | 1–3 |
| Reviewer | Reviews code for quality and architecture | 1 |
| Security Auditor | Audits code using OWASP Top 10 checklist | 1 |
| E2E Tester | Verifies integration between components | 1 |
| Verifier | Runs tests, lint, and build checks | 1–2 |
| Refactorer | Simplifies code structure (on-demand only) | 0–1 |
| Reporter | Updates dashboard.md on trigger events | 1 |

### Workflow Pipeline

Every task flows through this pipeline:

```
implement → e2e-test → [review + security-audit] → verify
                              (parallel)
```

- Implementation produces code
- E2E tester verifies integration
- Review and security audit run in parallel
- Verification confirms tests, lint, and build pass
- If review or audit raises issues, the task returns to implementer

### Scaling

The orchestrator scales agents based on workload:

- **Scale up**: When task queue depth ≥ 3 (implementer) or pending verifications ≥ 2 (verifier)
- **Scale down**: When agent is idle > 5 minutes and instances > minimum
- Never exceeds the `max` defined in agent YAML definitions

---

## Dashboard

The `dashboard.md` file provides a human-readable overview
of the current execution state.

### Sections

| Section | What it shows |
|---------|---------------|
| **Overall Progress** | Approximate completion percentage with progress bar |
| **Agent Status** | What each agent is currently doing (idle, working, blocked, error, done) |
| **Tasks Overview** | All tasks with their pipeline stage, assigned agent, and status |
| **Blocked** | Tasks requiring human intervention |
| **Retrospective** | Results from the last `/retro` run |
| **Notes** | Short human-readable notes |

### Viewing in VSCode

Open `dashboard.md` and press `Cmd+Shift+V` (macOS) or `Ctrl+Shift+V` (Windows/Linux)
to see the rendered Markdown preview.

The dashboard updates automatically during execution
when the reporter agent is triggered by events
such as task completion, task start, or agent errors.

---

## Session Management

### /retro — AI Self-Reflection

Run `/retro` after completing tasks to analyze rework patterns.

It examines:
- Dependency failures across tasks
- Security issues caught by the auditor
- E2E test failures
- Human rejections during review

Based on patterns found, it may generate:
- **Rules** (`.claude/rules/retro-*.md`) — with human approval per file
- **Report** (`.claude/state/retro-report.md`) — always generated
