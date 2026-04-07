# Setup and Kickoff Responsibilities

This repository distinguishes between setup and kickoff phases.

- `setup`:
  - Establishes initial directory structure and configuration files
  - Represents initial human decisions
  - Does NOT define project meaning or behavior

- `kickoff`:
  - Initializes governance documents only during initial project kickoff
  - Must NOT be used for governance changes during normal operation
  - Must only operate on directories that already exist
  - Must NOT introduce new governance concepts

Rules:
- Kickoff must ignore non-existent `.claude/` directories.
- Setup decisions may be extended later by manual directory creation.
