# State

This directory records the **current and historical state of execution**.

State represents facts about what has happened,
not intentions, plans, or future decisions.

Claude Code updates state files to reflect progress,
but **humans remain the final authority** over what counts as complete.

## What State Is

State is a record of:

- Which tasks exist
- Which tasks are in progress
- Which tasks are completed
- When transitions occurred

State does **not** define what should be done.
It only reflects what **has already been done**.

## What State Is Not

State is not:

- A task definition
- A planning artifact
- A source of truth for business requirements
- A substitute for human judgment

If a decision is ambiguous, it should not be resolved in state.
It should be resolved by humans and reflected elsewhere.

## When State Is Updated

State is updated when:

- A task begins execution
- A task completes execution
- A human confirms completion
- Execution is intentionally paused or resumed

Claude Code must not invent state transitions.
All state changes must correspond to real execution events.

## Human Authority

Humans are responsible for:

- Confirming when a task is complete
- Deciding whether work should continue
- Overriding or correcting state when necessary

Claude Code must defer to human decisions
when state and human judgment conflict.

## Relationship to Tasks

Tasks define **what work exists**.

State records **what has happened** to those tasks.

These responsibilities must remain separate.

Do not define task structure or dependencies in state files.

## Current State vs History

State files may record history,
but Claude Code must always be able to identify
the **current state of each task unambiguously**.

Historical records exist for traceability and review,
not as a source of ambiguity about what is active now.

## Durability and History

State files are append-only by default.

Past states should not be deleted or rewritten,
except to correct clear mistakes with explicit human approval.

State exists to provide transparency and traceability,
not to enforce behavior.

## Guiding Principles

- State records facts, not intent
- Humans decide, Claude records
- Current state must be unambiguous
- History matters
- Clarity over cleverness
