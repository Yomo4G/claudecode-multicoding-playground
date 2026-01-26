# Tasks

This directory defines **what work needs to be done** and **in what order**.

Tasks represent the agreed units of work that Claude Code is allowed to execute.
They are created during the planning phase and must be explicitly approved by a human
before execution begins.

This directory defines **task intent and structure**, not execution state.

## What a Task Is

A task is a **single, meaningful unit of work** that:

- Has a clear purpose
- Produces a concrete outcome
- Can be reviewed independently
- Depends on zero or more other tasks

Tasks are not implementation steps.
They represent **what needs to be accomplished**, not how to implement it.

## When Tasks Are Created

Tasks are created during `/plan`.

Claude Code is responsible for:
- Proposing an appropriate task breakdown
- Identifying dependencies between tasks

Humans are responsible for:
- Reviewing the task list
- Approving or modifying task boundaries
- Approving the dependency order

No task may be executed without explicit human approval.

## Task Granularity

Tasks should be:

- Large enough to be meaningful
- Small enough to be completed without ambiguity
- Reviewable without requiring full project context

If a task feels trivial, it may be a step.
If a task feels vague, it should be split.

## Task Dependencies

Tasks may declare dependencies on other tasks, but **dependencies are optional**.

A task with no dependencies may be executed immediately once approved.

Task relationships may be:
- Sequential (one task must complete before another)
- Parallel (multiple tasks can proceed independently)
- Branching (tasks may diverge based on decisions or outcomes)

The overall task structure may form a **tree or graph**, not just a linear chain.

Claude Code must:
- Respect all declared dependencies
- Never bypass a dependency, even if parallel execution seems possible
- Avoid inventing dependencies that were not explicitly agreed upon

Dependency correctness is more important than speed.

## Task Completion

A task is considered complete only when:

- Its defined outcome is achieved
- All required tests (as defined in rules) pass
- A human explicitly marks the task as done

Claude Code must not mark tasks as complete by itself.

## Human Checkpoints

Humans are expected to intervene at the following points:

- Task creation and approval
- Task completion confirmation
- Decision-making when ambiguities arise

Claude Code must pause and ask for confirmation
when a task cannot proceed without human judgment.

## Relationship to State

This directory defines **what tasks are**.

Execution progress, status, and history
are tracked separately under `.claude/state`.

Do not store execution state or progress information here.

## Guiding Principles

- Tasks are agreements, not suggestions
- Order matters more than speed
- Human approval is mandatory
- Claude executes, humans decide
