# Agents

This directory is reserved for **Claude agent definitions**.

Agents are used to split work into distinct roles
(e.g. implementation, review, verification) and run them in parallel.
However, **this project intentionally does NOT define any agents upfront**.

---

## Why this directory is empty

In this project, agents are **not created in advance**.

Defining agents too early often leads to:
- Roles that are never actually used
- Rigid workflows that do not match real work
- Extra maintenance cost with little benefit

Instead, this project follows this rule:

**Agents are added only after real work reveals a repeated role.**

---

## When should you add an agent?

Consider adding an agent when:
- The same type of thinking is repeated across tasks
- You want to separate concerns (e.g. implementation vs review)
- Parallel thinking would clearly improve speed or quality

---

## Reference: Common Agent Patterns (Examples)

The following are **typical agent roles commonly used in real projects**.
They are **examples only**, not requirements.

### Implementer
- Writes product code
- Follows decisions agreed in `/plan`
- Does not change requirements or architecture

### Reviewer
- Reviews architecture, boundaries, and design decisions
- Focuses on maintainability, clarity, and risk
- Does not write product code

### Verifier
- Focuses on testing strategy and validation
- Checks edge cases and failure scenarios
- Confirms that behavior matches requirements

### Refactorer
- Improves readability and structure
- Reduces duplication and complexity
- Works only after functionality is confirmed

You do **not** need all of these.
Start with zero, add only what proves useful.

---

## How this fits into the workflow

1. Start with `/plan` in Claude
2. Do the work without agents at least once
3. Identify roles that repeat
4. Define agents in this directory **only if they help**

---

## Guiding principle

Agents are **tools**, not a goal.

Create them when they reduce cognitive load,
not just because the system allows it.
