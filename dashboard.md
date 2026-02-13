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
  - Notes (optional)
- Do not add or remove sections.
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

| Agent Name   | Status | Current Task | Last Update |
|--------------|--------|--------------|-------------|
| planner      | idle   | —            | —           |
| implementer  | idle   | —            | —           |
| tester       | idle   | —            | —           |

**Status values**
- `idle` — waiting for work
- `working` — actively working on a task
- `blocked` — unable to proceed (waiting for input or dependency)
- `done` — finished assigned work

---

## Tasks Overview

Tasks are grouped by their current state.
Only agreed tasks should appear here.

### 🟡 Waiting

- —

### 🔵 In Progress

- —

### 🟢 Done

- —

---

## Notes (Optional)

Use this section for short, human-readable notes only.
Avoid long explanations.

- —
