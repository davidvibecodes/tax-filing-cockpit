export type AssessmentYear = `${number}-${number}`;

export type ReturnStatus =
  | "draft"
  | "eligibility-review"
  | "evidence-review"
  | "calculation-ready"
  | "regime-review"
  | "form-review"
  | "export-locked"
  | "exported"
  | "needs-review"
  | "archived";

export type Actor =
  | { kind: "user"; id: string }
  | { kind: "service"; id: string };

export type AuditEvent = {
  id: string;
  tenantId: string;
  returnId: string;
  actor: Actor;
  action: string;
  version: number;
  occurredAt: string;
};

export type FilingReturn = {
  id: string;
  tenantId: string;
  assessmentYear: AssessmentYear;
  status: ReturnStatus;
  version: number;
  selectedForm: "auto" | "ITR-1" | "ITR-2" | "ITR-3" | "ITR-4" | "ITR-5" | "ITR-6" | "ITR-7";
  createdAt: string;
  updatedAt: string;
};

export type FilingSession = {
  id: string;
  tenantId: string;
  returnId: string;
  lastSeenVersion: number;
  unresolvedQuestionIds: string[];
  selectedEvidenceIds: string[];
  updatedAt: string;
};

export type WorkspaceState = {
  returns: Map<string, FilingReturn>;
  sessions: Map<string, FilingSession>;
  audit: AuditEvent[];
};

export class VersionConflictError extends Error {
  constructor(
    public readonly returnId: string,
    public readonly expectedVersion: number,
    public readonly actualVersion: number,
  ) {
    super(
      `Return ${returnId} is at version ${actualVersion}; expected ${expectedVersion}.`,
    );
    this.name = "VersionConflictError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

function now(): string {
  return new Date().toISOString();
}

function id(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function requireTenant(expectedTenantId: string, actualTenantId: string): void {
  if (expectedTenantId !== actualTenantId) {
    throw new AuthorizationError("The requested filing is outside the active tenant.");
  }
}

function audit(
  state: WorkspaceState,
  tenantId: string,
  returnId: string,
  actor: Actor,
  action: string,
  version: number,
): void {
  state.audit.push({
    id: id("audit"),
    tenantId,
    returnId,
    actor,
    action,
    version,
    occurredAt: now(),
  });
}

export function createWorkspaceState(): WorkspaceState {
  return {
    returns: new Map(),
    sessions: new Map(),
    audit: [],
  };
}

export function createFiling(
  state: WorkspaceState,
  input: {
    tenantId: string;
    assessmentYear: AssessmentYear;
    actor: Actor;
  },
): { filing: FilingReturn; session: FilingSession } {
  const timestamp = now();
  const filing: FilingReturn = {
    id: id("return"),
    tenantId: input.tenantId,
    assessmentYear: input.assessmentYear,
    status: "draft",
    version: 1,
    selectedForm: "auto",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const session: FilingSession = {
    id: id("session"),
    tenantId: input.tenantId,
    returnId: filing.id,
    lastSeenVersion: filing.version,
    unresolvedQuestionIds: [],
    selectedEvidenceIds: [],
    updatedAt: timestamp,
  };
  state.returns.set(filing.id, filing);
  state.sessions.set(session.id, session);
  audit(state, filing.tenantId, filing.id, input.actor, "filing.created", filing.version);
  return { filing, session };
}

export function getFiling(
  state: WorkspaceState,
  tenantId: string,
  returnId: string,
): FilingReturn {
  const filing = state.returns.get(returnId);
  if (!filing) {
    throw new Error("Filing not found.");
  }
  requireTenant(tenantId, filing.tenantId);
  return filing;
}

export function updateFiling(
  state: WorkspaceState,
  input: {
    tenantId: string;
    returnId: string;
    expectedVersion: number;
    actor: Actor;
    changes: Partial<Pick<FilingReturn, "status" | "selectedForm">>;
  },
): FilingReturn {
  const filing = getFiling(state, input.tenantId, input.returnId);
  if (filing.version !== input.expectedVersion) {
    throw new VersionConflictError(filing.id, input.expectedVersion, filing.version);
  }
  const updated: FilingReturn = {
    ...filing,
    ...input.changes,
    version: filing.version + 1,
    updatedAt: now(),
  };
  state.returns.set(updated.id, updated);
  audit(
    state,
    updated.tenantId,
    updated.id,
    input.actor,
    "filing.updated",
    updated.version,
  );
  return updated;
}
