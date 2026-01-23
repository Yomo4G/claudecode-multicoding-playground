# AI Multicoding Playground

🧠 ➜ 📝 ➜ 🤝 ➜ ⚙️

Plan • Agreement • Implementation

## 🧠 Concept

This repository is a starter template for building projects with **Claude Code** using **parallel and structured workflows**.

It is meant to be a foundation for:
- Running Claude Code in parallel to complete product code
- Making human decisions explicit before any code is written
- Letting AI focus on implementation, review, and verification after agreement

⚠️ **No agents are defined yet.**  
Agents should be created **per project**, based on actual needs and usage patterns.

This repository is a **foundation**, not a finished system.

For real projects, see [Recommended Usage](#recommended-usage-fork-based-workflow) below.

## 🧭 Guiding Principles

- Human decisions come first
- Configuration defines reality
- AI follows, never leads
- Abstractions are earned, not assumed

## ⚠️ Important Notice (Claude Usage)

- This repository does **not** include Claude itself.
- Claude subscription/contract, authentication, and installation are **the responsibility of each user**.
- Install and configure Claude Code according to the official documentation before using this repository.

## 🗂️ Directory Structure Overview

```
ai-multicoding-playground/
  ├─ CLAUDE.md            # Always-on instructions that define how AI behaves in this repository
  ├─ README.md            # Entry point explaining the concept, usage, and overall workflow
  ├─ project.config.json  # Explicit technical decisions selected by humans via setup
  ├─ scripts/             # Automation helpers that support the workflow (e.g. interactive setup)
  ├─ contexts/            # Project context describing what is being built and why (business, domain, background)
  ├─ rules/               # Project rules and constraints defining how the project should be built
  ├─ agents/              # Definitions of AI roles used for parallel thinking and task separation
  └─ commands/            # Custom slash commands that standardize proven workflows
```

## 🚀 Quick Start

### 1. Clone the repository

Run:
```bash
git clone https://github.com/st-tech/ai-multicoding-playground.git  
cd ai-multicoding-playground
```

### 2. Run setup (configuration only)

This project uses **pnpm**.

Run:
```bash
pnpm run setup
```

What this does:
- Asks you to select runtime, framework, lint/format, and test tools
- Updates project.config.json
- Does **not** install dependencies
- Does **not** generate product code

This step is **fully reversible**.

### 3. Reset and re-select options (if needed)

To redo all selections, run:

```bash
pnpm run setup:reset
```

You can also manually edit project.config.json and set values back to null, then run pnpm run setup again.

## 🤝 Recommended Usage: Fork-based Workflow

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
mv ai-multicoding-playground your-product-name  
cd your-product-name
```

This helps keep:
- Local paths
- Editor workspaces
- Documentation references

consistent and easy to understand.

### 🔹 Step5: Run setup and start planning

Run the interactive setup to select runtime, framework, and tooling.

```bash
pnpm run setup
```

After setup is complete, open Claude Code and start with:

```bash
/plan
```

At this point:
- Technical assumptions are explicit
- Configuration is fixed
- You are ready to move from planning to implementation

### Summary of this workflow

- Forking is **recommended**, not required
- Renaming the fork is **strongly recommended**
- Local directory renaming is **optional but helpful**
- This workflow keeps template and product concerns cleanly separated

## ▶️ After Setup: What to Do Next

Once project.config.json is filled:

👉 Open Claude and run: /plan

You should:
- Confirm the selected runtime, framework, lint, and test tools
- Plan dependency installation and configuration generation
- Agree on steps **before** writing any product code

This repository intentionally enforces:

Plan → Agreement → Implementation

## 🎛️ Selectable Options in Setup

### Runtime

- Node.js  
  https://nodejs.org/

- Deno  
  https://deno.com/

- Bun  
  https://bun.sh/

### Frontend Frameworks

- React  
  https://react.dev/

- Vue.js  
  https://vuejs.org/

- Next.js  
  https://nextjs.org/

- Nuxt.js  
  https://nuxt.com/

- Astro  
  https://astro.build/

- Gatsby  
  https://www.gatsbyjs.com/

### Lint / Formatter

- Biome  
  https://biomejs.dev/

- ESLint  
  https://eslint.org/

- Prettier  
  https://prettier.io/

### Testing Tools

- Playwright  
  https://playwright.dev/

- Vitest  
  https://vitest.dev/

- Jest  
  https://jestjs.io/

- Cypress  
  https://www.cypress.io/

## 🧩 About Contexts, Rules, Agents, and Commands

### Contexts

The contexts directory contains project context documents
that describe **what is being built and why**.

These files are expected to be generated through
AI-guided conversations and refined by humans.

Typical content includes:
- Business goals and background
- Domain concepts and terminology
- Assumptions and constraints

See: [contexts/README.md](contexts/README.md)

### Rules

The rules directory contains explicit project rules and constraints
that define **how the project should be built**.

These files are also expected to be generated via AI-assisted dialogue
and treated as enforceable agreements.

Typical content includes:
- Coding standards
- Architectural constraints
- Non-functional requirements
- Prohibited practices

See: [rules/README.md](rules/README.md)

### Agents

The agents directory is reserved for Claude agent definitions.

Agents are intentionally not pre-defined to avoid premature abstraction.
Add agents only after real work reveals recurring roles that benefit from parallel execution.

See: [agents/README.md](agents/README.md)  

### Commands

The commands directory is reserved for custom slash commands.

Commands should be created only after workflows are:
- Clearly defined
- Repeated multiple times
- Stable enough to automate

See: [commands/README.md](commands/README.md)
