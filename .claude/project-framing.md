# Project Framing Checklist

This document defines the conditions under which a project
is considered ready to move from **Context Definition**
to **Execution**.

Project Framing is a **decision gate**.
Its purpose is not to eliminate uncertainty,
but to ensure that uncertainty is understood,
explicitly acknowledged, and accepted by humans
before implementation begins.

## Framing Philosophy

Project Framing aims for a **practical level of readiness**.

- The project must be safe to execute.
- The project does not need to be fully specified.
- Assumptions and hypotheses are allowed,
  as long as they are explicitly documented.

The goal is to move forward with clarity,
not to wait for perfect information.

## PF-1: Context Readiness

Before entering execution, all context sections must be present.

- [ ] All context sections are filled.
- [ ] Content may be provisional or based on assumptions.
- [ ] No section is left undefined or empty.
- [ ] Open questions and assumptions are explicitly documented.

Contexts are treated as **assumed truth**
during execution, even if they are provisional.

## PF-2: Rules Readiness

The following rules must be defined before execution begins.

- [ ] A rule exists that requires testing for all tasks.
- [ ] A rule exists that enforces explicit Done definitions per task.
- [ ] A rule exists that requires scope and non-scope to be documented per task.
- [ ] A policy exists for handling failure or interruption, including:
  - revisiting definitions
  - updating contexts if necessary
  - optionally consulting an engineer

Rules define **how execution is constrained**,
not what is implemented.

## PF-3: Task Readiness

Task breakdown is considered sufficient when:

- [ ] Each task documents:
  - its Done criteria
  - its scope and non-scope
  - its dependencies (dependencies may be optional)
- [ ] The task dependency graph contains no cycles.
- [ ] Each task explicitly states whether it can be executed in parallel
      or must be executed sequentially.
- [ ] The set of tasks that can be started first is clearly identified.

Tasks represent **agreements**, not suggestions.

## PF-4: Human GO Responsibility

Before granting GO, the responsible human confirms:

- [ ] I have reviewed the contexts, rules, and tasks,
      and have no remaining unanswered questions.
- [ ] I understand which parts of the project
      are based on assumptions or hypotheses
      and accept the associated risks.
- [ ] I understand which decisions are delegated to AI
      and which require human judgment.
- [ ] I understand what “finish” means for this project
      and how completion will be evaluated.

Granting GO means accepting responsibility
for proceeding with execution under these conditions.

## Granting GO

Execution may begin only after all required checks are completed
and a human explicitly grants GO.

Once GO is granted:

- Execution proceeds according to tasks and rules.
- State is recorded, not decided.
- Adjustments are allowed, but must follow the same framing principles.

Project Framing may be revisited if circumstances change,
but execution does not begin without an explicit GO.
