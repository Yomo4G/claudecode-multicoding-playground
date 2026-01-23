# Rules

This directory contains **project rules and constraints**.

Rules define **how the project should be built and what must be respected**.
They act as guardrails for both humans and AI during planning and implementation.

Files in this directory are expected to be **generated through AI-assisted dialogue**
and maintained as explicit agreements.

---

## What belongs in this directory

Typical rule documents include (but are not limited to):

- Coding standards and style guidelines
- Architectural constraints
- Technology usage rules
- Non-functional requirements
- Performance and security requirements
- Testing and quality expectations
- Prohibited patterns or practices

These documents answer questions such as:
- What must we always follow?
- What must we never do?
- What constraints shape our implementation choices?

---

## Examples of rule files

A typical project may include files like:

- coding-standards.md  
- architectural-rules.md  
- testing-policy.md  
- non-functional-requirements.md  
- security-guidelines.md  
- prohibited-practices.md  

As with contexts, file names and structure are flexible.

---

## How these files are created

Rules are typically created by:

1. Discussing constraints and preferences with AI
2. Making trade-offs explicit
3. Writing them down as enforceable agreements

Rules should be **clear, explicit, and testable when possible**.

---

## How these files are used

- `/plan` must respect all rules defined here
- AI should not violate these rules unless explicitly instructed
- Changes to rules should be intentional
  and followed by re-planning when necessary

---

## Relationship to contexts

- Contexts define **what and why**
- Rules define **how and under what constraints**

Keeping these separate helps prevent confusion
and keeps planning focused.

---

## Guiding principle

Rules are **guardrails**, not suggestions.

They exist to reduce ambiguity
and prevent accidental divergence.
