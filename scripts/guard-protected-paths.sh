#!/bin/bash
# Guard hook: blocks Edit/Write to protected paths
# Called by PreToolUse hook with $TOOL_INPUT as JSON via stdin

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

# Protected paths (from execution-permissions.md)
BLOCKED=false
case "$FILE_PATH" in
  CLAUDE.md) BLOCKED=true ;;
  project.config.json) BLOCKED=true ;;
  .claude/rules/*) BLOCKED=true ;;
  .claude/contexts/*) BLOCKED=true ;;
  .claude/policies/*) BLOCKED=true ;;
  .claude/agents/*) BLOCKED=true ;;
  .claude/project-framing.md) BLOCKED=true ;;
  scripts/*) BLOCKED=true ;;
  README.md) BLOCKED=true ;;
  idea-discovery.txt) BLOCKED=true ;;
esac

if [ "$BLOCKED" = true ]; then
  echo "BLOCKED: $FILE_PATH is a protected path. Modification requires explicit human approval."
  exit 2
fi

exit 0
