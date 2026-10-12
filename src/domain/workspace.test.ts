import assert from "node:assert/strict";
import test from "node:test";
import {
  AuthorizationError,
  VersionConflictError,
  createFiling,
  createWorkspaceState,
  getFiling,
  updateFiling,
} from "./workspace.js";

test("creates a tenant-scoped filing and resumable session", () => {
  const state = createWorkspaceState();
  const { filing, session } = createFiling(state, {
    tenantId: "tenant-a",
    assessmentYear: "2026-27",
    actor: { kind: "user", id: "user-a" },
  });

  assert.equal(session.returnId, filing.id);
  assert.equal(session.lastSeenVersion, 1);
  assert.equal(getFiling(state, "tenant-a", filing.id).status, "draft");
  assert.equal(state.audit[0]?.action, "filing.created");
});

test("rejects cross-tenant access", () => {
  const state = createWorkspaceState();
  const { filing } = createFiling(state, {
    tenantId: "tenant-a",
    assessmentYear: "2026-27",
    actor: { kind: "user", id: "user-a" },
  });

  assert.throws(
    () => getFiling(state, "tenant-b", filing.id),
    (error) => error instanceof AuthorizationError,
  );
});

test("rejects stale writes without overwriting the newer revision", () => {
  const state = createWorkspaceState();
  const { filing } = createFiling(state, {
    tenantId: "tenant-a",
    assessmentYear: "2026-27",
    actor: { kind: "user", id: "user-a" },
  });
  const updated = updateFiling(state, {
    tenantId: "tenant-a",
    returnId: filing.id,
    expectedVersion: 1,
    actor: { kind: "user", id: "user-a" },
    changes: { selectedForm: "ITR-1" },
  });

  assert.equal(updated.version, 2);
  assert.throws(
    () =>
      updateFiling(state, {
        tenantId: "tenant-a",
        returnId: filing.id,
        expectedVersion: 1,
        actor: { kind: "user", id: "user-a" },
        changes: { status: "eligibility-review" },
      }),
    (error) => error instanceof VersionConflictError,
  );
  assert.equal(getFiling(state, "tenant-a", filing.id).status, "draft");
});
