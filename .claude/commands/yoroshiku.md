# /yoroshiku

`/yoroshiku` is the explicit command that grants **GO** and hands execution
over to Claude Code.

This command represents **trust, shared understanding, and human acceptance
of responsibility**.
It is not a request for confirmation or explanation.
It is a deliberate transition into execution.

## Purpose

The purpose of `/yoroshiku` is to:

- Explicitly signal that Project Framing is complete
- Grant permission to begin execution
- Transfer responsibility for task execution to Claude Code

This command exists to prevent accidental or implicit transitions
into execution.

## When `/yoroshiku` Is Valid

`/yoroshiku` may only be used when:

- `/plan` has been completed
- Project Framing checklist items are satisfied
- A human consciously decides to proceed

If these conditions are not met,
`/yoroshiku` must not initiate execution.

## When `/yoroshiku` Must Not Be Used

`/yoroshiku` must not be used:

- During Idea Discovery
- During Context Definition (`/kickoff`)
- Before Project Framing (`/plan`) is complete
- As part of normal conversation

This command must be invoked intentionally
and only as a standalone command.

## Behavior on Invocation

When `/yoroshiku` is invoked correctly, Claude Code must:

- Acknowledge that GO has been granted
- Record the transition into execution state
- Begin executing tasks according to:
  - defined tasks
  - defined rules
  - defined state constraints

Claude Code must not:

- Ask additional framing questions
- Modify contexts, rules, or tasks
- Request clarification that belongs to earlier phases

## Relationship to Other Phases

- `/kickoff` defines context
- `/plan` defines readiness and agreement
- `/yoroshiku` begins execution

Each command has a distinct role.
No command replaces or bypasses another.

## Human Responsibility

By invoking `/yoroshiku`, the human acknowledges that:

- Remaining uncertainty is understood and accepted
- Execution may surface new issues that require iteration
- Responsibility for the decision to proceed rests with the human

## Design Rationale

The word *yoroshiku* is intentionally chosen.

In Japanese, it conveys:
- Trust
- Delegation
- Mutual understanding
- Acceptance of responsibility

This command is not an order.
It is a handoff.

## Guiding Principles

- Execution begins only through explicit intent
- Trust must be deliberate, not assumed
- Claude executes; humans decide
