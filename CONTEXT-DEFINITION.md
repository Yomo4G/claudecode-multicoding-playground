# Context Definition

Detailed guide for the requirements definition phase
using Claude Code's `/kickoff` command.

For getting started, see [README.md](README.md).

---

## Overview

Run `/kickoff` in Claude Code to start Context Definition.

This is a **one-time initialization ritual** — a structured Q&A
with Claude that generates shared language everyone can use
to understand what is being built.

Files are generated **one at a time**,
with human confirmation at each step.

> Note: `/kickoff` is executed inside Claude Code, not in your terminal.

---

## Process Flow

1. **Phase declaration** — Claude explicitly marks the start of Context Definition
2. **Structured Q&A** — Claude asks questions about your project
3. **File generation** — Each context file is generated after agreement
4. **Human confirmation** — Every file requires explicit approval
5. **Transition** — Once context is complete, the process moves to Project Framing

---

## What It Produces

### Common Outputs (Every Project)

These are always required and generated one at a time.

| Output | What it answers |
|--------|----------------|
| **Domain Model** | What concepts exist in this service? |
| **Actors** | Who interacts with this service? |
| **Actions** | What can each actor do? |
| **Boundary Conditions** | Where does the service's responsibility start and end? |

### Project-Specific Outputs

After the common outputs are defined,
kickoff identifies concepts uniquely important to your project.

Examples:
- A **lifecycle model** — if time-based behavior is central
- An **interaction model** — if relationships between actors are non-obvious
- A **boundary model** — if moderation or constraint logic is central

These are proposed by Claude and require explicit human approval.

---

## What Kickoff Will Not Do

- Create new `.claude/` directories
- Modify product code
- Introduce new governance concepts
- Skip human confirmation steps

---

## Providing Inputs

You can provide Idea Discovery outputs to kickoff in two ways:

### Option 1: Place drafts in the repository (recommended)

Save notes or drafts anywhere in the repository
(for example, under a `notes/` or `drafts/` directory).
When you run `/kickoff`, Claude Code reads these files as input.

### Option 2: Paste directly into the conversation

Paste Idea Discovery outputs into the Claude Code conversation
when prompted during `/kickoff`.

In both cases, drafts do not need to be complete or correct.
They serve as inputs that will be refined during Context Definition.

---

## Example Generated Files

After Context Definition, your `.claude/contexts/` directory might contain:

```
.claude/contexts/
├─ domain-model.md          # Core concepts and their relationships
├─ actors.md                # Users, roles, and external systems
├─ actions.md               # What each actor can do
├─ boundary-conditions.md   # Service scope and responsibilities
├─ lifecycle.md             # Time-based state transitions (if applicable)
├─ assumptions.md           # Working assumptions
├─ risks.md                 # Known risks
└─ non-goals.md             # Explicitly out-of-scope items
```

Each file uses a structured format with clear definitions
that both engineers and non-engineers can understand.
