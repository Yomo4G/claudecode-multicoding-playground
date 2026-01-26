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
├─ .claude/
│  ├─ kickoff.md          # One-time initialization ritual (no governance by itself)
│  └─ state/
│     └─ kickoff.json     # Append-only record of kickoff actions
│
├─ scripts/
│  └─ setup.mjs           # Interactive setup (human decisions only)
│
├─ CLAUDE.md              # The single, authoritative rulebook for Claude
├─ README.md              # This document (human-oriented)
├─ project.config.json    # Explicit technical decisions selected by humans
├─ package.json
└─ LICENSE
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

Kickoff will:
- Ask questions
- Wait for explicit agreement
- Generate **one file at a time**
- Record actions in .claude/state/kickoff.json

Kickoff will **not**:
- Create directories
- Modify product code
- Introduce new concepts

If no governance directories were enabled during setup,
running kickoff will simply explain that there is nothing to initialize.

Note:
Claude commands such as /kickoff are executed **inside Claude Code**,
not in your terminal.

## ▶️ After Kickoff: What Happens Next

Once kickoff is complete:
- Governance documents exist under enabled .claude/* directories
- Claude is now constrained by those documents
- You can safely move to planning and implementation

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
