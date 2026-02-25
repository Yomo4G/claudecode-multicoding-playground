# AI Multicoding Playground

Plan · Agree · Implement

## Core Concept

This repository is a **starter template for human-governed AI development**
using **Claude Code**.

It is built around a simple but strict principle:

**AI does not decide. Humans decide first, and AI executes those decisions.**

All governance is expressed through filesystem state:

- If a directory exists under `.claude/`, Claude treats it as enabled
- If a directory does not exist, Claude ignores the concept entirely
- Humans may add governance directories at any time
- Claude never creates, removes, or renames `.claude/` directories on its own

This ensures decisions are explicit, history is inspectable,
and AI behavior is deterministic.

## What You Can Build

This template supports the full lifecycle from idea to working MVP:

1. **Concept articulation** — Explore and clarify your project idea
2. **Requirements definition** — Generate shared language for what is being built
3. **Specification and planning** — Define rules, tasks, and completion criteria
4. **MVP implementation** — Autonomous AI execution under strict governance

## Prerequisites

- **Node.js v24.13.0 or later** — required for the setup script
- **pnpm** — package manager used throughout the project
- **Claude Code** — subscription, authentication, and installation
  are the responsibility of each user.
  Install and configure according to the
  [official documentation](https://docs.anthropic.com/en/docs/claude-code/overview)
  before use.

## Getting Started

### 1. Clone and Rename

Fork this repository on GitHub, then clone it locally.
Renaming both the repository and local directory to match
your product name is recommended.

```bash
git clone https://github.com/your-account/ai-multicoding-playground.git
mv ai-multicoding-playground your-product-name
cd your-product-name
```

### 2. Idea Discovery — Articulate Your Concept

Use `idea-discovery.txt` as a starting prompt with any AI assistant
(ChatGPT, Claude, Copilot, etc.) to explore early-stage ideas,
assumptions, and business intent.

This step happens **before** using Claude Code
and is intentionally free of implementation decisions.

See [IDEA-DISCOVERY.md](IDEA-DISCOVERY.md) for details.

### 3. Context Definition — Define Requirements (`/kickoff`)

Run `/kickoff` in Claude Code to start a structured Q&A
that generates shared language everyone can use
to understand what is being built.

Files are generated one at a time,
with human confirmation at each step.

See [CONTEXT-DEFINITION.md](CONTEXT-DEFINITION.md) for details.

### 4. Technical Setup — Prepare Environment (`pnpm run setup`)

Run `pnpm run setup` to interactively select your framework,
linter, testing tool, and runtime.

Setup records **human decisions only** — it does not install
dependencies, generate product code, or define governance content.

See [TECHNICAL-SETUP.md](TECHNICAL-SETUP.md) for details.

### 5. Project Framing — Create Implementation Plan (`/plan`)

Run `/plan` in Claude Code to verify readiness,
define rules and tasks, and establish completion criteria.

Nothing is written until explicitly approved by a human.

See [PROJECT-FRAMING.md](PROJECT-FRAMING.md) for details.

### 6. Execution Engine — Build Your MVP (`/yoroshiku`)

Run `/yoroshiku` in Claude Code to grant GO
and hand execution over to the AI.

Claude operates autonomously under strict permission rules.
Monitor progress via `dashboard.md` in the repository root
and only intervene when the dashboard shows blocked tasks.

See [EXECUTION-ENGINE.md](EXECUTION-ENGINE.md) for details.

## Supplementary Documentation

| Document | Description |
|----------|-------------|
| [IDEA-DISCOVERY.md](IDEA-DISCOVERY.md) | Detailed guide for exploring and articulating your project concept |
| [CONTEXT-DEFINITION.md](CONTEXT-DEFINITION.md) | Requirements definition phase using `/kickoff` |
| [TECHNICAL-SETUP.md](TECHNICAL-SETUP.md) | Framework, tooling, and governance layer configuration |
| [PROJECT-FRAMING.md](PROJECT-FRAMING.md) | Planning phase for rules, tasks, and completion criteria |
| [EXECUTION-ENGINE.md](EXECUTION-ENGINE.md) | Autonomous execution, multi-agent system, and dashboard |
| [DEVELOPER-GUIDE.md](DEVELOPER-GUIDE.md) | Repository structure, skill generation, CI, and technical reference |
