# Contexts

This directory contains **project context documents**.

Contexts describe **what is being built and why**.
They capture the background knowledge that both humans and AI
must share before planning or implementation begins.

Files in this directory are expected to be **generated and refined**
through conversations with AI, and then edited by humans as needed.

---

## What belongs in this directory

Typical context documents include (but are not limited to):

- Business goals and objectives
- Problem statements and motivations
- Target users and personas
- Business model and success metrics
- Domain concepts and terminology
- Assumptions and constraints
- Out-of-scope clarifications

These documents answer questions such as:
- What problem are we solving?
- For whom are we building this?
- Why does this project exist?
- What must be true for this project to succeed?

---

## Examples of context files

A typical project may include files like:

- business-overview.md  
- product-vision.md  
- user-personas.md  
- domain-model.md  
- assumptions-and-constraints.md  
- glossary.md  

File names and structure are intentionally **not fixed**.
Use what best matches your project and domain.

---

## How these files are created

In this project, context files are expected to be:

1. Generated through **AI-guided interviews**
2. Reviewed and refined by humans
3. Updated as understanding evolves

They are not meant to be static specifications,
but **living documents**.

---

## How these files are used

- `/plan` treats all context documents as **given premises**
- AI should not invent requirements already covered here
- Humans may update these documents at any time,
  followed by a new planning step if needed

---

## Guiding principle

Contexts explain **what and why**.

They provide shared understanding,
not implementation instructions.
