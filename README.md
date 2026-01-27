# AI Multicoding Playground

🧠 ➜ 📝 ➜ 🤝 ➜ ⚙️

Plan • Agreement • Implementation

## 🧠 Concept

This repository is a **starter template for human-governed AI development**
using **Claude Code**.

It is designed around a simple but strict idea:

AI does not decide.  
Humans decide first, and AI executes those decisions.

This repository provides:
- A clear separation between decision-making and implementation
- A filesystem-based governance model that Claude must follow
- A reproducible setup process that makes human choices explicit
- A controlled kickoff ritual that turns agreements into documents

⚠️ This repository is a **foundation**, not a finished system.  
It intentionally starts minimal and grows **only when humans decide to add structure**.

## 🧭 Guiding Principles

- 🧑 Human decisions come first  
- 📐 Configuration defines reality  
- 🤖 AI follows, never leads  
- 🧱 Structure is introduced only when needed  

## ⚠️ Important Notice (Claude Usage)

- This repository does **not** include Claude itself.
- Claude subscription, authentication, and installation are the responsibility of each user.
- Install and configure **Claude Code** according to the official documentation before use.

## 🗂️ Repository Structure (Initial State)

The repository starts in a **minimal but strict state**.

```
/claudecode-multicoding-playground (you will rename this directory)
├─ .claude/                       # Governance root read by Claude Code
│  ├─ kickoff.md                  # Ritual to start Context Definition (phase declaration)
│  ├─ plan.md                     # Project Framing specification and readiness checklist
│  ├─ commands/                   # Explicit commands that trigger state transitions
│  │  └─ yoroshiku.md              # GO command that hands execution over to Claude Code
│  └─ rules/                      # Rules that constrain Claude Code behavior
│     └─ mcp-usage.md              # MCP usage policy (human-managed, security-sensitive)
│
├─ scripts/                       # Helper scripts for setup and automation
│  └─ setup.mjs                   # Interactive setup reflecting human decisions only
│
├─ idea-discovery.txt             # Generic Idea Discovery prompt (human + any AI assistant)
├─ CLAUDE.md                      # Global, always-on rules for Claude Code
├─ README.md                      # Human-oriented documentation and usage guide
├─ project.config.json            # Explicit technical decisions selected by humans
├─ package.json                   # Node.js project metadata and scripts
└─ LICENSE                        # Repository license information
```

### Important design rules

- .claude/ contains **only machine-readable governance assets**
- No explanatory README files exist under .claude/
- The **existence of a directory under .claude/ means it was explicitly enabled by humans**
- Missing directories mean the concept is **not adopted**

## 🧠 Claude Governance Model (Core Idea)

Claude is governed by **filesystem state**, not inference.

- If a directory exists under .claude/, Claude must treat it as enabled
- If a directory does not exist, Claude must ignore the concept entirely
- Humans may add new governance directories **at any time**
- Claude must never create, remove, or rename .claude/ directories on its own

This ensures:
- Decisions are explicit
- History is inspectable
- AI behavior is deterministic

## 💡 Idea Discovery (Before Using Claude Code)

Before working with Claude Code, start with **Idea Discovery**.

Use `idea-discovery.txt` as a starting prompt with your preferred AI assistant
to explore and clarify early-stage ideas, assumptions, and business intent.

This step is intentionally:
- Exploratory and open-ended
- Free of implementation or technical decisions
- Focused on generating draft inputs for Context Definition

The outputs of Idea Discovery are **not final documents**.
They are inputs that will later be refined and formalized during `/kickoff`.

<details>
<summary>How to provide Idea Discovery outputs to /kickoff (optional)</summary>

Idea Discovery produces **draft notes and hypotheses**, not final documents.
These drafts are used as input during `/kickoff` to generate formal context files.

You can provide Idea Discovery outputs to Claude Code in either of the following ways:

### Option 1: Place drafts in the repository (recommended)

Save your notes or drafts anywhere in the repository (for example, under a `notes/` or `drafts/` directory).
When you run `/kickoff`, Claude Code will read these files as input.

This approach is recommended because it:
- Keeps inputs visible and reproducible
- Allows you to review and revise drafts before formalization
- Makes it clear what assumptions are being carried forward

### Option 2: Paste drafts directly into the conversation

Alternatively, you may paste Idea Discovery outputs directly into the Claude Code conversation
when prompted during `/kickoff`.

This approach is acceptable for quick experiments,
but may be less reproducible than keeping drafts as files.

In both cases, the drafts do not need to be complete or correct.
They serve as **inputs** that will be reviewed, refined, and formalized during Context Definition.

</details>

## 🚀 Quick Start

This repository is designed as a **template and foundation** for AI-driven parallel development.
While it is technically possible to implement product code directly in this repository,
we **strongly recommend** using the following fork-based workflow for real projects.

This approach is **not mandatory**, but it is the most reliable way to:
- Keep this repository clean as a reusable template
- Clearly separate the template from your actual product
- Allow your forked repository to evolve freely as a standalone project

### 🔹 Step1: Fork this repository (Recommended)

On GitHub, fork this repository into your own account or organization.

Forking establishes a clear boundary between:
- This repository as a **template**
- Your fork as **the actual product repository**

### 🔹 Step2: Rename the forked repository (Strongly recommended)

After forking, we strongly recommend renaming the repository
to match your product or project name.

You can do this from:
GitHub → Settings → General → Repository name

Why this is recommended:
- The repository identity clearly represents your product
- Issues, PRs, and discussions become product-centric
- Claude context naturally shifts from “template” to “implementation”

### 🔹 Step3: Clone the forked repository

Clone your forked (and renamed) repository to your local machine.

```bash
git clone https://github.com/your-name/your-product-name.git
```

### 🔹 Step4: Rename the local directory (Optional but recommended)

After cloning, you may rename the local directory
to match the repository and product name.

This has **no impact on Git operations** and is completely safe.

Example:

```bash
mv claudecode-multicoding-playground your-product-name  
cd your-product-name
```

This step has no impact on Git history and is completely safe,
but it has a **significant impact on clarity and AI behavior**.

### 🔹 Step5: Run setup (human decisions only)

#### Requirements:
- Node.js v24.13.0 or later (required for setup)
- pnpm

```bash
pnpm run setup
```

What setup does:
- Asks you to select:
  - Runtime (Node / Deno / Bun)
  - Frontend framework
  - Lint / formatter
  - Testing tool
- Writes those decisions to project.config.json
- Asks (y/n) which Claude governance layers to enable
- Creates only the selected .claude/* directories

What setup does **not** do:
- ❌ Install dependencies
- ❌ Generate product code
- ❌ Define governance content

Setup is **fully reversible**.

```bash
pnpm run setup:reset
```

You can also manually edit project.config.json and set values back to null, then run pnpm run setup again.

### 🔹 Step6: Initialize governance with kickoff

After setup:

Review .claude/kickoff.md  
Run /kickoff in Claude Code

Kickoff is:
- A **one-time initialization ritual**
- A structured Q&A with Claude
- The only moment when governance documents are generated

Kickoff always begins with a phase declaration.
This declaration explicitly marks the start of **Context Definition**,
clarifying that the goal is to establish shared assumptions—not to plan or implement.
Only after context is sufficiently defined does the process move forward to **Project Framing**.

Kickoff will:
- Ask questions
- Wait for explicit agreement
- Generate **one file at a time**
- Record actions in .claude/state/kickoff.json

Kickoff will **not**:
- Create directories
- Modify product code
- Introduce new concepts

Before execution begins, the project must pass **Project Framing**.
Project Framing uses an explicit checklist to confirm readiness,
define rules and tasks, and require a conscious human GO
before planning and implementation proceed.

If no governance directories were enabled during setup,
running kickoff will simply explain that there is nothing to initialize.

Note:
Claude commands such as /kickoff are executed **inside Claude Code**,
not in your terminal.

## ▶️ After Kickoff: What Happens Next

From this stage onward, work is executed through explicitly defined tasks.
Tasks are proposed during planning, approved by humans, and executed by Claude
with dependencies respected and progress tracked under `.claude/tasks` and `.claude/state`.

State records execution facts only.
It tracks what has happened and what is currently true,
while human judgment remains the final authority over completion.

Once kickoff is complete:
- Governance documents exist under enabled .claude/* directories
- Claude is now constrained by those documents
- You can safely move to planning and implementation

Before implementation begins, run **/plan** in Claude Code.

`/plan` initiates the **Project Framing** phase.
This phase verifies readiness using an explicit checklist,
defines rules and tasks, and requires a conscious human GO
before execution is allowed to proceed.

`/plan` will:
- Read existing contexts as assumed truth
- Identify missing or risky areas
- Propose rules, tasks, and completion criteria
- Pause for explicit human approval before writing any files

External integrations such as MCP are governed by explicit usage policies.
MCP configuration files and credentials are managed manually by humans and are never generated or modified by Claude Code.

When Project Framing is complete and you are ready to proceed,
run **/yoroshiku** in Claude Code.

`/yoroshiku` explicitly grants GO and hands execution over to Claude Code.

From this point forward:

🧠 Plan  
🤝 Agree  
⚙️ Implement  

## 🎛️ Project Configuration

### Framework / Lint / Testing

All technical selections are:
- Explicitly chosen by humans
- Stored in project.config.json
- Treated as immutable facts by Claude

Claude must never assume defaults.

### Runtime (Node / Bun / Deno)

The selected runtime represents the **execution environment**.

- Runtime selection is an explicit human decision
- It is stored in project.config.json for reproducibility
- Runtime choice does **not** define project architecture
- Changing runtime does not imply framework or tooling changes

Runtime is treated as an execution constraint,
not as part of the product’s functional design.

## 🔐 Node.js Version Requirement (Setup Only)

Running scripts/setup.mjs requires **Node.js v24.13.0 or later**.

Why:
- A widely publicized, security-critical vulnerability affecting earlier
  Node.js versions was fixed in v24.13.0
- Setup performs filesystem and configuration operations that must
  run in a secure environment

This requirement applies **only to the setup process**.
It does not mandate the Node.js version used for application development
unless Node.js is explicitly selected as the runtime.

## 🧩 Growing the Governance Structure (Later)

Over time, you may introduce additional governance layers by
**manually creating directories under .claude/**, for example:

- .claude/contexts/ – project purpose, assumptions, constraints
- .claude/rules/ – hard rules and prohibitions
- .claude/skills/ – explicitly allowed actions
- .claude/output-styles/ – standardized output formats
- .claude/workflows/ – approved step-by-step procedures
- .claude/quality-gates/ – checklists and verifiable conditions
- .claude/hooks/ – deterministic enforcement points
- .claude/agents/ – optional AI role definitions
- .claude/mcp/ – approved external integrations

The act of creating a directory is itself an **explicit human decision**.

## 🏁 Final Note

This repository enforces one invariant:

AI never decides what to build or how to govern itself.  
Humans decide.  
Filesystem state makes those decisions real.

Everything else is intentionally left flexible.

Happy multicoding 🚀
