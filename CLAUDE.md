# Project Purpose

This repository is designed for frontend projects where
AI-generated code is used **only after explicit human decisions**.

At the initial stage:
- Do NOT generate product code unless explicitly instructed.
- Focus on planning, configuration, and agreement first.
- All major technical choices must be explicitly confirmed.

---

# Repository Characteristics

- Repository type: single repository (NOT monorepo)
- Target domain: frontend applications
- This repository may be used by multiple users after cloning.

---

# Operating System Context

This project may be used on different operating systems.

Supported environments include:
- macOS
- Windows

Rules:
- The operating system is a **runtime context**, not a project configuration.
- Do NOT persist OS selection in configuration files.
- Do NOT assume an OS by default.
- The AI must confirm the user's OS before suggesting CLI commands or scripts.
- If OS-specific differences exist, they must be clearly stated.

---

# Configuration-First Policy (CRITICAL)

This project follows a **configuration-first** approach.

All major technical decisions MUST be:
1. Explicitly selected by a human
2. Persisted in a machine-readable configuration file
3. Treated as immutable facts by the AI

The AI must NEVER infer or assume these choices.

---

# Supported Frameworks (Selectable)

The project supports multiple frontend frameworks.
However, **only one framework may be active at a time**.

Possible choices include:
- React
- Vue.js
- Next.js
- Nuxt.js
- Astro
- Gatsby

Rules:
- Do NOT assume any framework by default.
- Do NOT mix multiple frameworks.
- Framework selection must be confirmed via configuration
  before any product code is written.

---

# Lint / Formatter Policy (Selectable)

Multiple linting and formatting tools are supported.
Only one primary toolchain may be selected.

Possible choices include:
- Biome
- ESLint
- Prettier

Rules:
- Do NOT introduce multiple linters or formatters.
- The selected tool is the single source of truth.
- Tooling must be confirmed via configuration
  before generating configs or code.

---

# Testing Policy (Selectable)

Multiple testing tools are supported.
Only one testing strategy may be selected initially.

Possible choices include:
- Playwright
- Vitest
- Jest
- Cypress

Rules:
- Do NOT mix testing frameworks by default.
- Testing tool selection must align with the chosen framework.
- Test generation is prohibited until the tool is confirmed.

---

# Project Configuration Source of Truth

All selections related to the project structure
(framework, lint/format, testing, etc.)
must be stored in a dedicated configuration file
(e.g. `project.config.json` or equivalent).

Rules:
- If the configuration file does not exist,
  all options are considered undecided.
- If the configuration file exists,
  its contents are the single source of truth.
- The AI must strictly follow the configuration
  and must not suggest alternatives unless explicitly asked.

---

# AI Workflow Rules

Before writing or modifying any product code, the AI must:

1. Enter planning mode
2. Confirm that required configurations are defined
3. If configurations are missing:
   - Ask the user to run the setup process
   - Or explicitly decide via discussion
4. Propose a clear execution plan
5. Wait for explicit human approval

Coding without approval is prohibited.

---

# Multi-Agent Assumptions

The project may use multiple AI roles in parallel:

- Implementer: writes code after approval
- Reviewer: reviews architecture and design decisions
- Refactorer: simplifies and improves structure
- Verifier: focuses on testing and validation

Analysis and review tasks should be delegated
to separate contexts or sub-agents when possible,
to avoid polluting the main implementation thread.

---

# Prohibited Actions

- Assuming defaults for OS, frameworks, or tools
- Introducing dependencies without configuration
- Mixing multiple frameworks or toolchains
- Generating boilerplate projects by default
- Performing large refactors without instruction
- Treating recommendations as decisions

---

# Guiding Principle

Human decisions come first.
Configuration defines reality.
AI follows, never leads.
