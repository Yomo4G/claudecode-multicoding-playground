# Commands

This directory is reserved for **custom slash commands** for Claude.

Custom commands are used to:
- Standardize repeated procedures
- Reduce prompt verbosity
- Make workflows easier to reuse and share

At the moment, **no custom commands are defined here on purpose**.

---

## Why this directory exists

This project encourages starting with **manual `/plan` usage**.

Custom commands should not replace thinking.
They should only appear when a workflow is:
- Clearly defined
- Repeated multiple times
- Stable enough to automate

---

## When should you add a command?

A simple rule of thumb:

**If you do the same thing three times, consider a command.**

---

## Reference: Common Command Patterns (Examples)

The following are **typical slash commands commonly used in mature projects**.
They are **examples only**, not requirements.

### /plan
- Clarifies requirements and constraints
- Lists risks and assumptions
- Produces an agreed execution plan
- Blocks implementation until approval

### /review
- Reviews architecture and code changes
- Checks consistency with project rules
- Focuses on long-term maintainability

### /verify
- Lists test cases and validation steps
- Checks edge cases and regressions
- Confirms expected behavior

### /simplify
- Proposes refactoring opportunities
- Improves naming and structure
- Reduces unnecessary complexity

### /setup-check
- Verifies local environment assumptions
- Confirms configuration consistency
- Detects missing prerequisites

---

## Recommended workflow before creating commands

1. Write steps manually in `/plan`
2. Refine them through real usage
3. Ensure the steps are stable
4. Convert them into a command only then

---

## Guiding principle

Commands should **capture proven workflows**.

They are a result of experience,
not a substitute for it.
