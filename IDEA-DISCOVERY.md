# Idea Discovery

Detailed guide for the first phase where you explore
and articulate your project concept.

For getting started, see [README.md](README.md).

---

## Overview

Idea Discovery is an **exploratory, open-ended** phase
that happens **before** using Claude Code.

Use `idea-discovery.txt` as a starting prompt with
any AI assistant (ChatGPT, Claude, Copilot, etc.)
to explore early-stage ideas, assumptions, and business intent.

This step is intentionally:
- Free of implementation or technical decisions
- Focused on generating draft inputs for Context Definition
- Not tied to any specific AI tool

---

## How to Use

1. Open `idea-discovery.txt` in this repository
2. Provide the content to your preferred AI assistant
3. Have an open-ended conversation about your project idea
4. Save the outputs as notes or drafts

The outputs of Idea Discovery are **not final documents**.
They are inputs that will later be refined and formalized
during Context Definition (`/kickoff`).

---

## Providing Outputs to Kickoff

### Option 1: Place drafts in the repository (recommended)

Save your notes or drafts anywhere in the repository
(for example, under a `notes/` or `drafts/` directory).
When you run `/kickoff`, Claude Code will read these files as input.

This approach is recommended because it:
- Keeps inputs visible and reproducible
- Allows you to review and revise drafts before formalization
- Makes it clear what assumptions are being carried forward

### Option 2: Paste directly into the conversation

Paste Idea Discovery outputs directly into the Claude Code conversation
when prompted during `/kickoff`.

This approach is acceptable for quick experiments,
but may be less reproducible than keeping drafts as files.

---

## Example Outputs

Idea Discovery typically produces informal notes such as:

- **Concept summary** — What the service does in 2-3 sentences
- **Target users** — Who would use this and why
- **Key features** — Core functionality that defines the product
- **Business constraints** — Budget, timeline, team size considerations
- **Open questions** — Unresolved decisions that need further exploration
- **Inspiration** — Reference services or design patterns to consider

These notes do not need to be polished or complete.
They serve as starting material for the structured
Context Definition phase that follows.
