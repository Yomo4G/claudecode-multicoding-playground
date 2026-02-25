# Integration Verification

This rule governs end-to-end integration testing
performed by the e2e-tester agent after implementation.

## Purpose

Integration verification is the final defense layer
that catches issues not detected by static checks,
contract validation, or code review.

It verifies the system works from a user perspective
by running the actual application and testing
real interactions.

## Precondition

Integration verification requires:
- The dev server is running
- The implementation task has completed
- E2e test files exist for the task

The orchestrator must ensure the dev server is running
before assigning work to the e2e-tester.

## Scope

Integration verification runs on every task
after the implementer reports completion.

## Implementer Obligations

For every task, the implementer must write
e2e test files that verify the implemented feature
works end-to-end.

E2e tests must be placed in the test directory
appropriate for the configured test tool:
- Playwright: `tests/e2e/` or `frontend/tests/e2e/`
- Cypress: `cypress/e2e/`
- Vitest/Jest: `tests/integration/`

E2e tests should cover:
- User-facing interactions (form submissions, navigation)
- API endpoint responses (correct status codes, response shapes)
- Frontend-backend integration (data flows through proxy)

## E2e-Tester Execution

The e2e-tester runs the configured e2e test command:
- Default: `pnpm test:e2e`
- Fallback: `pnpm test:integration`

If no e2e tests exist for a task,
the e2e-tester reports this in its result file
and the orchestrator decides whether to proceed
or request test creation.

## Failure Handling: Feedback Loop

When e2e tests fail:

1. The e2e-tester writes a detailed failure report
   to its result file, including:
   - Which tests failed
   - Error messages and stack traces
   - Suggested fix direction

2. The orchestrator reads the failure report
   and creates a fix subtask for the implementer.
   The fix subtask includes:
   - The original task reference
   - The e2e failure details
   - The instruction to fix and re-run

3. The implementer fixes the issue
   and reports completion.

4. The e2e-tester runs again on the same task.

5. This loop repeats until:
   - All e2e tests pass, OR
   - Maximum retry count (3) is reached

6. If maximum retries are reached:
   - The task is marked as blocked
   - The orchestrator reports to the user
   - Human intervention is required

## Result File Format

The e2e-tester writes results using
the standard agent result format:

```json
{
  "agent": "e2e-tester-0",
  "task_id": "<task-id>",
  "result": "success | failure",
  "summary": "<test outcome description>",
  "issues": [
    {
      "test": "<test name>",
      "error": "<error message>",
      "fix_suggestion": "<suggested fix>"
    }
  ],
  "retry_count": 0,
  "completed_at": "<ISO 8601>"
}
```
