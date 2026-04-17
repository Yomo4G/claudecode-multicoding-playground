#!/bin/bash
# Guard hook: blocks Edit/Write to protected paths
# Called by PreToolUse hook with $TOOL_INPUT as JSON via stdin
#
# Two protection levels:
#   1. Always protected — blocked in all phases
#   2. Phase-protected — writable only during specific phases
#
# Phase detection:
#   - kickoff: .claude/state/kickoff.json exists and phase != "completed"
#   - plan:    .claude/state/plan-active flag file exists
#   - setup:   human-run script (pnpm run setup), not subject to this guard

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//;s/"$//')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Normalize to relative path from project root
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
case "$FILE_PATH" in
  "$PROJECT_ROOT"/*) FILE_PATH="${FILE_PATH#$PROJECT_ROOT/}" ;;
  /*) exit 0 ;;  # Absolute path outside project — allow
esac

# --- Always protected paths (blocked in all phases) ---
case "$FILE_PATH" in
  CLAUDE.md)          echo "BLOCKED: $FILE_PATH is a protected path. Modification requires explicit human approval."; exit 2 ;;
  .claude/rules/*)    echo "BLOCKED: $FILE_PATH is a protected path. Modification requires explicit human approval."; exit 2 ;;
  .claude/policies/*) echo "BLOCKED: $FILE_PATH is a protected path. Modification requires explicit human approval."; exit 2 ;;
  .claude/agents/*)   echo "BLOCKED: $FILE_PATH is a protected path. Modification requires explicit human approval."; exit 2 ;;
  scripts/*)          echo "BLOCKED: $FILE_PATH is a protected path. Modification requires explicit human approval."; exit 2 ;;
  README.md)          echo "BLOCKED: $FILE_PATH is a protected path. Modification requires explicit human approval."; exit 2 ;;
  idea-discovery.txt) echo "BLOCKED: $FILE_PATH is a protected path. Modification requires explicit human approval."; exit 2 ;;
esac

# --- Phase detection helpers ---
is_kickoff_active() {
  local kickoff_file="$PROJECT_ROOT/.claude/state/kickoff.json"
  [ -f "$kickoff_file" ] || return 1
  # Kickoff is active unless phase is explicitly "completed"
  local phase
  phase=$(grep -o '"phase"[[:space:]]*:[[:space:]]*"[^"]*"' "$kickoff_file" \
    | head -1 | sed 's/.*"phase"[[:space:]]*:[[:space:]]*"//;s/"$//')
  [ "$phase" != "completed" ]
}

is_plan_active() {
  [ -f "$PROJECT_ROOT/.claude/state/plan-active" ]
}

# --- Phase-protected paths (writable only during specific phases) ---
case "$FILE_PATH" in
  .claude/contexts/*)
    if ! is_kickoff_active; then
      echo "BLOCKED: $FILE_PATH is writable only during kickoff phase."
      exit 2
    fi
    ;;
  .claude/project-framing.md)
    if ! is_plan_active; then
      echo "BLOCKED: $FILE_PATH is writable only during plan phase."
      exit 2
    fi
    ;;
  project.config.json)
    if ! is_kickoff_active; then
      echo "BLOCKED: $FILE_PATH is writable only during kickoff or setup phase."
      exit 2
    fi
    ;;
esac

exit 0
