# /kickoff

This command initializes governance documents for this project.
This file defines the kickoff ritual.
It does not define governance by itself.

Kickoff is a **one-time initialization ritual**.
It exists only to turn explicit human decisions into governance files.

We are about to begin the **Context Definition** phase.

In this phase, we will clarify the foundations of this project:
its purpose, scope, actors, and core concepts.
The goal is to establish shared context that will be treated as
assumed truth in all later phases.

This is **not** a planning or implementation phase.
We will not decide how the system is built,
what technologies are used,
or how tasks are executed.

You remain in control at all times.
I will propose questions and draft context documents,
but nothing will be written or finalized without your explicit approval.

Once the context is sufficiently defined,
we will move on to the next phase: **Project Framing**.

If questions arise that belong to a different phase,
kickoff must pause and ask whether to proceed,
rather than assuming permission to move forward.

If no governance directories exist under `.claude/`,
kickoff must explain that there is nothing to initialize
and stop without generating any files.

## Language Selection

On the first execution of kickoff, the AI must ask the user
to select the language for this session.

Supported languages:
- English
- 日本語 (Japanese)

Once selected:
- All kickoff dialogue will be conducted in the chosen language.
- Generated governance files will be written in the chosen language.
- The selection is recorded in `.claude/state/kickoff.json`.

The AI must not assume a default language.
The AI must wait for explicit selection before proceeding.

## Context Definition Phase

Context Definition produces two kinds of outputs:

### Common Outputs (Required)

Every project must define the following under `contexts/`:

- **Domain Model**: The core concepts of this service
  and their relationships.
- **Actors**: Who interacts with this service
  and in what roles.
- **Actions**: What each actor can do within this service.
- **Boundary Conditions**: Where the service's responsibility, intervention, and relational scope begin and end.

These three outputs form the minimum shared language
required for Project Framing.

The AI must generate these as separate files,
one at a time, with human confirmation.

### Project-Specific Outputs (Discovery)

After completing the common outputs,
the AI must review the defined contexts
and identify concepts that are:

- central to this specific project's philosophy or mechanics
- not covered by domain model, actors, or actions
- necessary for a non-engineer to understand
  before entering Project Framing

The AI must propose these as additional context files, explain why each is needed, and wait for human approval before generating.

Examples of project-specific outputs:
- Lifecycle or temporal model
  (if time-based behavior is core)
- Interaction model
  (if relationships between actors are non-obvious)
- Boundary model
  (if moderation or constraint logic is central)

The AI must not generate project-specific outputs
without explicit human confirmation.

### Output Order

1. Domain Model
2. Actors
3. Actions
4. Boundary Conditions
5. Design Definition
6. (Project-specific outputs, if approved)

This order ensures that later outputs
can reference earlier definitions.

## Design Definition Phase

After completing the Context Definition outputs,
the AI must guide the user through design system decisions.

This phase determines how the visual design will be established.
It does not generate design assets — it records the approach.

### Step 1: Design Method Selection

Ask the user to choose one of the following methods:

1. **conversation** — Define design direction through dialogue
   (colors, typography, layout style, mood, etc.)
2. **image** — Provide a reference image or Figma design
3. **reference** — Use an existing well-known service as design inspiration
4. **auto** — Let the AI decide an appropriate modern design

The selection is stored in `project.config.json` as `designMethod`.

### Step 2: Method-Specific Follow-up

#### If "image" is selected:

Ask the user to specify the source:

- **File**: The user will provide an image file during execution.
  Record this and proceed.
- **Figma**: Inform the user that Figma integration requires MCP setup.
  - Explain that MCP configuration must be created manually by the user
    (per MCP Usage Policy in `.claude/rules/mcp-usage.md`).
  - Provide guidance on what MCP configuration is needed.
  - Do NOT create MCP configuration files.
  - Record `designMethod: "image"` and note Figma as the intended source.

#### If "reference" is selected:

Present a list of well-known services for design reference:

- X (Twitter)
- YouTube
- GitHub
- Spotify
- Notion
- Discord
- Slack
- ChatGPT

The user selects one. If the desired service is not listed,
the user may specify a custom service name.
The selection is stored in `project.config.json` as `designReference`.

#### If "conversation" is selected:

Record the selection. Detailed design conversations
will occur during the execution phase.

#### If "auto" is selected:

Record the selection. The AI will determine an appropriate
modern, clean design during the execution phase.

### Step 3: Breakpoint Configuration

Present the default breakpoints (Tailwind CSS standard):

| Name | Width (px) |
|------|-----------|
| sm   | 640       |
| md   | 768       |
| lg   | 1024      |
| xl   | 1280      |
| 2xl  | 1536      |

Ask the user:
- Accept these defaults, or
- Customize the values

The result is stored in `project.config.json` as `breakpoints`.
Inform the user that breakpoints can be changed at any time
by editing `project.config.json` directly.

### Design System Rules (Always Applied)

Regardless of the design method selected:

- All generated UI must be responsive.
- Breakpoints from `project.config.json` must be used consistently.
- The AI must not hardcode breakpoint values in source code;
  they must be derived from configuration.

### State Management

After completing this phase, record in `.claude/state/kickoff.json`:
- `designMethod` selected
- `designReference` (if applicable)
- `breakpoints` configuration
- Timestamp and human confirmation reference

## Preconditions

- This command MUST be executed only after `setup` is completed.
- This command MUST NOT be used during normal project operation.
- This command MUST follow all rules defined in `/CLAUDE.md`.

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

## Directory Handling Rules

- Only directories that already exist under `.claude/` are considered enabled.
- If a directory does not exist, it MUST be ignored completely.
- The absence of a directory means the concept is not adopted in this project.

## Execution Rules

Kickoff MUST proceed in small, explicit steps.                                                            
  
When operating within the Context Definition phase,                                                       
the outputs defined in "Context Definition Phase" take precedence over directory-based iteration.                                                           
                                                                                                          
For each output:
1. Explain what will be decided (briefly)
2. Ask concrete questions
3. Wait for explicit human confirmation
4. Generate exactly one file
5. Stop and wait for further instructions

For all other phases, iterate over each enabled governance directory:
1. Explain what will be decided (briefly)
2. Ask concrete questions
3. Wait for explicit human confirmation
4. Generate exactly one file
5. Stop and wait for further instructions

Bulk generation is prohibited.

## Generation Rules

- Generated files MUST be concrete, unambiguous, and machine-readable.
- Do NOT include explanations, comments, or guidance text in generated files.
- Do NOT restate information already defined in `/CLAUDE.md`.

## State Management

- After generating a file, record the action in `.claude/state/kickoff.json`.
- The state file MUST include:
  - Generated file path
  - Timestamp
  - Human confirmation reference (summary)

- The state file MUST be treated as append-only.
- Do NOT modify or delete existing state entries.

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

## Completion

Kickoff is considered complete when:
- All enabled `.claude/` directories have at least one governance file
- Or the human explicitly declares kickoff finished

After completion:
- Kickoff SHOULD NOT be run again during normal operation.
- Re-running kickoff is allowed only by explicit human intent.
