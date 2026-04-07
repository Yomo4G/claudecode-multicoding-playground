<!--
AI UPDATE CONTRACT

This file is a human-readable dashboard for execution visibility.
It is not a source of truth.

When updating this file, AI agents must follow these rules:
- Do not change the overall structure or headings.
- Only update content inside the following sections:
  - Overall Progress
  - Agent Status
  - Tasks Overview
  - Review Summary
  - Skill Candidates
  - Retrospective
  - Notes (optional)
- Do not add or remove sections.
- When multi-agent orchestration is active,
  only the reporter agent may write to this file.
- When operating in single-agent mode,
  the main instance writes to this file directly.
- Do not include detailed reasoning or discussion.
- Timestamps must use the execution user's local time.
  Do NOT use UTC or any assumed timezone.
  Format: YYYY-MM-DD HH:MM (local).

Authoritative execution state lives under .claude/state/ and .claude/tasks/.
-->

# Project Dashboard

This dashboard provides a **human-readable overview** of the current execution state.

It is intended for:
- Visibility
- Coordination
- Situational awareness

This file summarizes what is happening.
It does not define what must happen.

---

## Overall Progress

Progress is an approximate indicator based on task states.
It does not need to be exact.

Progress: ░░░░░░░░░░░░ 0%

---

## Agent Status

This section shows what each agent is currently doing.

| Agent | Instance | Status | Current Task | Last Update |
|-------|----------|--------|--------------|-------------|
| orchestrator | orchestrator-0 | idle | — | — |
| implementer | implementer-0 | idle | — | — |
| reviewer | reviewer-0 | idle | — | — |
| security-auditor | security-auditor-0 | idle | — | — |
| verifier | verifier-0 | idle | — | — |
| reporter | reporter-0 | idle | — | — |

**Status values**
- `idle` — waiting for work
- `working` — actively working on a task
- `blocked` — unable to proceed (waiting for input or dependency)
- `error` — encountered an error (orchestrator will retry once)
- `done` — finished assigned work

---

## Tasks Overview

Tasks are shown with their current pipeline stage and assigned agent.

| Task | Stage | Agent | Status | Updated |
|------|-------|-------|--------|---------|
| — | — | — | — | — |

**Pipeline stages**: `implement` → `review` (parallel: reviewer + security-auditor) → `verify`

### 🔴 Blocked

Tasks requiring human intervention.

- —

---

## Review Summary

Review records from `.claude/state/review-records/`.

| Task | Findings | Open | Resolved | Status | Reviewer |
|------|----------|------|----------|--------|----------|
| — | — | — | — | — | — |

**Categories**: design-principle, coding-standard, owasp, architecture

---

## Skill Candidates

Skill candidates detected during execution.
See `.claude/rules/skill-lifecycle.md` for evaluation criteria.

| # | Name | Trigger | Steps | Criteria | Source | Status |
|---|------|---------|-------|----------|--------|--------|

### Candidate Details

(No candidates recorded yet.)

---

## Retrospective

Last run: —

| Category | Count | Tasks |
|----------|-------|-------|
| — | — | — |

Rules generated: 0
Skills generated: 0

---

## Notes (Optional)

Use this section for short, human-readable notes only.
Avoid long explanations.

- —
