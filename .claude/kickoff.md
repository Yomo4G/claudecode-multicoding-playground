# /kickoff

This command initializes governance documents for this project.
This file defines the kickoff ritual.
It does not define governance by itself.

Kickoff is a **one-time initialization ritual**.
It exists only to turn explicit human decisions into governance files.

If no governance directories exist under `.claude/`,
kickoff must explain that there is nothing to initialize
and stop without generating any files.

---

## Preconditions

- This command MUST be executed only after `setup` is completed.
- This command MUST NOT be used during normal project operation.
- This command MUST follow all rules defined in `/CLAUDE.md`.

---

## Scope of Authority

Kickoff is strictly limited in scope.

Kickoff MAY:
- Ask questions to clarify human decisions
- Summarize agreed decisions
- Generate governance documents under existing `.claude/` directories

Kickoff MUST NOT:
- Create, remove, or rename directories under `.claude/`
- Operate on non-existent `.claude/` directories
- Introduce new governance concepts
- Modify product code
- Modify configuration files unless explicitly instructed
- Perform refactoring or implementation tasks

---

## Directory Handling Rules

- Only directories that already exist under `.claude/` are considered enabled.
- If a directory does not exist, it MUST be ignored completely.
- The absence of a directory means the concept is not adopted in this project.

---

## Execution Rules

Kickoff MUST proceed in small, explicit steps.

For each enabled governance directory:
1. Explain what will be decided (briefly)
2. Ask concrete questions
3. Wait for explicit human confirmation
4. Generate exactly one file
5. Stop and wait for further instructions

Bulk generation is prohibited.

---

## Generation Rules

- Generated files MUST be concrete, unambiguous, and machine-readable.
- Do NOT include explanations, comments, or guidance text in generated files.
- Do NOT restate information already defined in `/CLAUDE.md`.

---

## State Management

- After generating a file, record the action in `.claude/state/kickoff.json`.
- The state file MUST include:
  - Generated file path
  - Timestamp
  - Human confirmation reference (summary)

- The state file MUST be treated as append-only.
- Do NOT modify or delete existing state entries.

---

## Failure Handling

Kickoff MUST stop immediately if:
- Human intent is unclear
- Required decisions are missing
- The user requests actions outside kickoff scope
- Any rule in `/CLAUDE.md` would be violated

In such cases:
- Explain why execution stopped
- Ask for clarification or correction
- Do NOT proceed automatically

---

## Completion

Kickoff is considered complete when:
- All enabled `.claude/` directories have at least one governance file
- Or the human explicitly declares kickoff finished

After completion:
- Kickoff SHOULD NOT be run again during normal operation.
- Re-running kickoff is allowed only by explicit human intent.
