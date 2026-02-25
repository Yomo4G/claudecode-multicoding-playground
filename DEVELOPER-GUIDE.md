# Developer Guide

Technical reference for contributors and developers working
with this repository's governance system, CI, and tooling.

For getting started, see [README.md](README.md).

---

## Repository Structure

```
/claudecode-multicoding-playground
├─ .github/
│  └─ workflows/                  # CI workflows (lifecycle-aware)
│     ├─ governance.yml           # Phase 1: YAML, skill, protected file checks
│     ├─ config-validation.yml    # Phase 2: project.config.json consistency
│     ├─ quality.yml              # Phase 3: install, typecheck, lint, build, test
│     └─ security.yml             # Phase 4: secret detection, dependency audit
├─ .claude/                       # Governance root read by Claude Code
│  ├─ project-framing.md          # Project Framing specification and readiness checklist
│  ├─ commands/                   # Explicit commands that trigger state transitions
│  │  ├─ kickoff.md               # Ritual to start Context Definition
│  │  ├─ plan.md                  # Project Framing planning command
│  │  ├─ yoroshiku.md             # GO command that hands execution over to Claude
│  │  ├─ handover.md              # Session handover and context preservation
│  │  └─ retro.md                 # AI retrospective and pattern analysis
│  ├─ rules/                      # Rules that constrain Claude Code behavior
│  │  ├─ execution-permissions.md # Writable/protected paths and permitted commands
│  │  ├─ skill-lifecycle.md       # Skill detection, evaluation, and proposal rules
│  │  ├─ agent-orchestration.md   # Multi-agent lifecycle, state contracts, pipeline
│  │  ├─ owasp-security.md        # OWASP Top 10 checklist and security principles
│  │  └─ mcp-usage.md             # MCP usage policy (human-managed)
│  ├─ agents/                     # Multi-agent team definitions
│  │  ├─ team.yaml                # Team composition, scaling, workflow pipeline
│  │  ├─ orchestrator.yaml        # Coordinator agent (main instance)
│  │  ├─ implementer.yaml         # Code writing agent (scalable, max 3)
│  │  ├─ reviewer.yaml            # Code review agent (read-only)
│  │  ├─ security-auditor.yaml    # Security audit agent (OWASP)
│  │  ├─ e2e-tester.yaml          # Integration testing agent
│  │  ├─ verifier.yaml            # Test/lint/build agent (scalable, max 2)
│  │  ├─ refactorer.yaml          # On-demand refactoring agent
│  │  └─ reporter.yaml            # Dashboard update agent (trigger-based)
│  ├─ skills/                     # Reusable procedural skills
│  │  ├─ secure-auth-setup/       # Authentication implementation (OWASP A02, A07)
│  │  ├─ input-sanitization/      # Input validation (OWASP A03)
│  │  ├─ access-control-enforcement/ # Access control (OWASP A01)
│  │  ├─ security-headers-setup/  # Security headers (OWASP A05)
│  │  └─ security-audit-logging/  # Audit logging (OWASP A09)
│  ├─ state/                      # Execution state (runtime, not governance)
│  │  ├─ HANDOVER.md              # Session handover document
│  │  └─ kickoff.json             # Kickoff progress tracking
│  └─ tasks/                      # Task definitions for execution
│
├─ scripts/                       # Helper scripts for setup and automation
│  ├─ setup.mjs                   # Interactive setup reflecting human decisions only
│  ├─ teardown.mjs                # Stop dev server, clean DB and generated files
│  └─ generate-placeholders.mjs   # SVG placeholder image generator
│
├─ public/                        # Static assets (placeholder images, etc.)
├─ idea-discovery.txt             # Generic Idea Discovery prompt
├─ CLAUDE.md                      # Global, always-on rules for Claude Code
├─ README.md                      # Getting started guide
├─ DEVELOPER-GUIDE.md             # This file — technical reference
├─ dashboard.md                   # Human-readable execution visibility dashboard
├─ project.config.json            # Explicit technical decisions selected by humans
├─ package.json                   # Node.js project metadata and scripts
└─ LICENSE                        # Repository license information
```

---

## Skill Auto-Proposal

When `.claude/skills/` exists, Claude Code monitors its own actions
for repeating patterns and proposes reusable skills.

Skills are **steps-based procedures**, not code templates.
They describe *what to do*, not *how to write it*.

### How It Works

1. **Detection** — Claude notices repeated actions during development
2. **Evaluation** — Each candidate passes a 4-stage quality check
3. **Recording** — Approved candidates are logged in `dashboard.md`
4. **Batch proposal** — At end-of-development, all candidates are proposed at once
5. **Generation** — Human-approved skills become `.claude/skills/{name}/SKILL.md`

### 4-Stage Evaluation Check

Before any candidate is recorded, Claude runs these checks in order.
If a check fails, the candidate is rejected and remaining checks are skipped.

| Stage | Check | Rejection condition |
|-------|-------|---------------------|
| 1 | **Existing Skills overlap** | Substantially overlaps with an existing skill |
| 2 | **Value assessment** (4 criteria) | Does not meet minimum threshold (default: 3/4) |
| 3 | **Web search** | Pattern is entirely covered by a well-documented practice |
| 4 | **Official documentation analysis** | Pattern is an officially recommended approach |

Stages 1–2 are lightweight (local file reads).
Stages 3–4 are heavier (web search and document fetch)
and only run for candidates that survive the first two.

### Value Assessment Criteria

| Criterion | Description |
|-----------|-------------|
| **Repeatability** | Same action performed 2+ times in a session |
| **Complexity** | The procedure involves 3+ distinct steps |
| **Generality** | Applicable beyond the specific instance |
| **Originality** | Not fully covered by a well-known public best practice |

A candidate must meet at least **3 out of 4** criteria by default.

### Threshold Configuration

The threshold is configurable by editing `.claude/rules/skill-lifecycle.md` directly.
Look for the `minimum_criteria` / `total_criteria` values:

```
minimum_criteria: 3
total_criteria: 4
```

Increase to `4/4` for stricter evaluation
or decrease to `2/4` for more permissive recording.

### Dashboard Integration

Skill candidates appear in `dashboard.md` under a **Skill Candidates** section.

- Candidates start with status `pending`
- Humans can change status to `rejected` at any time
- Candidates not marked `rejected` remain as proposal targets
- At end-of-development, all `pending` candidates are proposed for final approval

### Enabling Skill Auto-Proposal

Create the `.claude/skills/` directory:

```bash
mkdir -p .claude/skills
```

If the directory does not exist, the entire feature is disabled.
Directory existence = human decision to enable.

---

## Continuous Integration

This repository uses lifecycle-aware CI that activates progressively
based on the project's current state.

| Phase | Workflow | What it checks | Active when |
|-------|----------|---------------|-------------|
| 1 | `governance.yml` | Agent YAML syntax, team.yaml references, skill format, protected file changes | Always |
| 2 | `config-validation.yml` | project.config.json values, derived settings consistency | `framework` is set |
| 3 | `quality.yml` | Install, type check, lint, build, test | Product code and lockfile exist |
| 4 | `security.yml` | Secret patterns, .env files, `pnpm audit` | Always (audit requires lockfile) |

### Why Some Checks Show as Skipped

Before setup, Phases 2–3 will skip because `project.config.json` fields are null
and no product code exists yet. Each workflow checks preconditions at runtime
and skips gracefully when not applicable.

### Workflow Details

**governance.yml** — Runs on every push and pull request.
- Validates YAML syntax for all `.claude/agents/*.yaml` files
- Verifies all agents referenced in `team.yaml` have corresponding definition files
- Validates SKILL.md format (frontmatter fields, required sections, minimum 3 steps)
- Warns when protected files are modified in a pull request

**config-validation.yml** — Triggered by `project.config.json` changes.
- Validates `framework` value against allowlist (react, vue, next, nuxt, astro, gatsby)
- Checks derived settings consistency (e.g., Next.js requires `single` structure)
- Validates `lint` and `test` values against their respective allowlists
- Warns if `pnpm-lock.yaml` is missing

**quality.yml** — Triggered by source code changes.
- Precondition: `pnpm-lock.yaml` exists AND (`src/` or `frontend/` exists)
- Runs: `pnpm install --frozen-lockfile`, type check, lint, build, test
- Lint and test jobs only run when configured in `project.config.json`

**security.yml** — Runs on every push, pull request, and weekly schedule.
- Scans for `.env` files that should not be committed
- Detects common secret patterns (private keys, API key assignments)
- Runs `pnpm audit --audit-level=high` when dependencies are installed

### Trigger Design

| Workflow | Trigger |
|----------|---------|
| governance.yml | `push`, `pull_request` (all branches) |
| config-validation.yml | `push` (paths: `project.config.json`), `pull_request` |
| quality.yml | `push`, `pull_request` (paths: `src/**`, `frontend/**`, `backend/**`) |
| security.yml | `push`, `pull_request`, `schedule` (weekly) |

---

## OWASP Security Integration

The repository integrates OWASP security principles
into the multi-agent development workflow.

Defined in `.claude/rules/owasp-security.md`, the integration provides:

- **7 security principles** as behavioral constraints
  (Security by Default, Defense in Depth, Least Privilege, Fail Safe,
  Complete Mediation, Economy of Mechanism, Leveraging Existing Components)
- **OWASP Top 10 checklist** (A01–A10) for systematic security auditing
- **5 reusable skills** covering A01, A02/A07, A03, A05, and A09

The **implementer** receives OWASP context during development (shift-left security).
The **security-auditor** verifies compliance using the checklist
and reports `owasp_coverage` in result files.
