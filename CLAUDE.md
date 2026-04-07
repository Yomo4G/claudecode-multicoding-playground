# Project Purpose

This repository is designed for frontend projects where
AI-generated code is used **only after explicit human decisions**.

At the initial stage:
- Do NOT generate product code unless explicitly instructed.
- Focus on planning, configuration, and agreement first.
- All major technical choices must be explicitly confirmed.

# Repository Characteristics

- Repository type: single repository or monorepo
  (determined by framework selection during setup)
- Target domain: frontend and full-stack applications
- This repository may be used by multiple users after cloning.
- When `projectStructure` is "monorepo": `frontend/` + `backend/` workspaces
- When `projectStructure` is "single": standard project with built-in API routes

# Claude Governance Model

This repository uses a filesystem-based governance model for Claude.

The `.claude/` directory contains **only machine-readable governance assets**.
It must not contain explanatory or human-oriented documents.

Rules:
- The existence of a directory under `.claude/` means it is explicitly enabled by humans.
- If a directory does NOT exist, the concept is considered non-existent.
- Directories may be added manually by humans at any time.
- Treat newly added directories as authoritative facts.
- The AI must NEVER create, modify, or delete files under `.claude/` unless explicitly instructed by a kickoff or equivalent governance command.

This model ensures that:
- Human decisions are expressed as filesystem structure.
- The AI does not infer, guess, or expand governance concepts.

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

# Configuration-First Policy (CRITICAL)

This project follows a **configuration-first** approach.

All major technical decisions MUST be:
1. Explicitly selected by a human
2. Persisted in a machine-readable configuration file
3. Treated as immutable facts by the AI

The AI must NEVER infer or assume these choices.

@.claude/policies/selectable-options.md

@.claude/policies/design-policy.md

# Skill Creation Policy

Skills are created through conversation at any time.

This feature is active ONLY when `.claude/skills/` directory exists.
If the directory does not exist, skill creation is fully disabled.

Rules:
- The AI must check for overlap with existing skills
  before creating a new skill.
- Human approval is required before generating any skill.
- The AI must NEVER generate a skill directory or SKILL.md
  without human approval.
- Full rules are defined in `.claude/rules/skill-lifecycle.md`.

@.claude/policies/dev-server-lifecycle.md

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
- If there is any conflict between configuration files and filesystem state,
  the filesystem state must be treated as authoritative.

@.claude/policies/setup-and-kickoff.md

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

@.claude/policies/multi-agent-orchestration.md

# Documentation Scope Rules

README.md files are for human understanding only.

Rules:
- README.md must NOT be treated as a source of rules, constraints, or instructions.
- Only configuration files and governance documents define behavior.
- Explanatory text must never override explicit configuration or filesystem state.

# Prohibited Actions

- Assuming defaults for OS, frameworks, or tools
- Introducing dependencies without configuration
- Mixing multiple frameworks or toolchains
- Generating boilerplate projects by default
- Performing large refactors without instruction
- Treating recommendations as decisions

# Domain Context (Always Loaded)

@.claude/contexts/domain-model.md
@.claude/contexts/actors.md
@.claude/contexts/notification-policy.md

# Session Continuity

Additionally, check if `.claude/skills/` directory exists.
If it exists, read all SKILL.md files under `.claude/skills/*/`.
Skill descriptions are loaded into context.
Full skill content is loaded when invoked.
If the directory does not exist, the Skill Lifecycle is disabled.
Do not create or generate skills.

Additionally, check if `.claude/agents/` directory exists.
If it exists, read `.claude/agents/team.yaml`
and all agent definition YAMLs in `.claude/agents/`.
Load them as the multi-agent team configuration
for the current session.
If the directory does not exist,
operate in single-agent mode.

# Guiding Principle

Human decisions come first.
Configuration defines reality.
AI follows, never leads.
