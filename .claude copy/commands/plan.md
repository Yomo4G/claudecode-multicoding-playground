# Plan

This document defines the behavior and responsibilities of the `/plan` command.

`/plan` initiates the **Project Framing** phase.
This phase determines whether the project is ready to move from
**Context Definition** into **Execution**.

Project Framing is a **decision gate**, not an implementation step.

## Phase Declaration

We are about to begin the **Project Framing** phase.

In this phase, we will determine whether this project
is ready to move into execution.
The goal is not to eliminate all uncertainty,
but to confirm that remaining uncertainty is understood,
documented, and consciously accepted.

This phase focuses on **agreement and commitment**.
We will define rules, tasks, and completion criteria,
and explicitly decide whether to grant GO for implementation.

This is **not** an implementation phase.
No product code will be written during this phase.

You remain the final decision-maker.
I will propose checklists, questions, and draft governance files,
but execution will not begin without your explicit approval.

If questions arise that belong to a different phase,
I will pause and ask whether you want to proceed,
rather than assuming permission to move forward.

## Role of `/plan`

The responsibilities of `/plan` are:

- To read and treat existing contexts as assumed truth
- To verify readiness through an explicit Project Framing checklist
- To identify missing, unclear, or risky areas
- To propose:
  - rules
  - task definitions
  - completion criteria
- To require explicit human approval before generating or modifying files
- To record decisions in a form suitable for execution

`/plan` must not:

- Write product code
- Skip or weaken framing requirements
- Proceed to execution without an explicit human GO

## Project Framing Checklist

The following checklist defines the minimum conditions
for granting GO to execution.

This checklist may evolve per project,
but all items must be explicitly reviewed.

### PF-1: Technical Setup

- [ ] Technical setup has been completed.
- [ ] Required runtimes, tools, and directories exist.
- [ ] The current environment reflects the technical assumptions
      agreed upon before execution.

### PF-2: Context Readiness

- [ ] All context sections are filled.
- [ ] Content may be provisional or based on assumptions.
- [ ] No section is left undefined or empty.
- [ ] Open questions and assumptions are explicitly documented.

### PF-3: Rules Readiness

- [ ] A rule exists that requires testing for all tasks.
- [ ] A rule exists that enforces explicit Done definitions per task.
- [ ] A rule exists that requires scope and non-scope to be documented per task.
- [ ] A clear policy exists for handling failure or interruption, including:
  - revisiting definitions
  - updating contexts if necessary
  - optionally consulting an engineer

### PF-4: Task Readiness

- [ ] Each task documents:
  - its Done criteria
  - its scope and non-scope
  - its dependencies (dependencies may be optional).
- [ ] The task dependency graph contains no cycles.
- [ ] Each task explicitly states whether it can be executed in parallel
      or must be executed sequentially.
- [ ] The set of tasks that can be started first is clearly identified.

### PF-5: Human GO Responsibility

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

## Granting GO

Execution may begin only after:

- All required checklist items are satisfied
- A human explicitly grants GO

Once GO is granted:

- Execution proceeds according to tasks and rules
- State is recorded, not decided
- Adjustments are allowed,
  but must follow the same framing principles

Project Framing may be revisited if circumstances change,
but execution must not begin without an explicit GO.

## Guiding Principles

- Project Framing is about readiness, not perfection
- Uncertainty is allowed, but must be explicit
- Humans decide, AI executes
- GO is a conscious commitment
