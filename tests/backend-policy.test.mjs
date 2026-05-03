import assert from "node:assert/strict";
import test from "node:test";

import {
  planBackendExecution,
  resolveBackendPolicy
} from "../skills/miku-readfile/lib/backend-policy.mjs";

test("resolves default backend policy", () => {
  assert.equal(resolveBackendPolicy(), "cli-preferred");
});

test("user request policy wins", () => {
  assert.equal(resolveBackendPolicy({ userRequestPolicy: "handoff-only" }), "handoff-only");
});

test("plans CLI execution when available", () => {
  assert.deepEqual(
    planBackendExecution({
      policy: "cli-preferred",
      operation: "read",
      cliAvailable: true
    }),
    {
      policy: "cli-preferred",
      operation: "read",
      mode: "execute",
      selectedBackend: "cli",
      attemptedBackends: ["cli"],
      fallback: null,
      error: null
    }
  );
});

test("falls back to handoff under cli-preferred when CLI is unavailable", () => {
  const plan = planBackendExecution({
    policy: "cli-preferred",
    operation: "read",
    cliAvailable: false
  });
  assert.equal(plan.mode, "handoff");
  assert.deepEqual(plan.fallback, {
    from: "cli",
    to: "handoff",
    reason: "cli_unavailable"
  });
});

test("reports hard error under cli-only when CLI is unavailable", () => {
  const plan = planBackendExecution({
    policy: "cli-only",
    operation: "read",
    cliAvailable: false
  });
  assert.equal(plan.mode, "error");
  assert.equal(plan.error.reason, "cli_unavailable");
});

test("handoff-only never selects a backend", () => {
  const plan = planBackendExecution({
    policy: "handoff-only",
    operation: "read",
    cliAvailable: true
  });
  assert.equal(plan.mode, "handoff");
  assert.equal(plan.selectedBackend, null);
});
