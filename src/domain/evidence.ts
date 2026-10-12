import { createHash } from "node:crypto";

export type EvidenceKind =
  | "form-16"
  | "ais"
  | "bank-statement"
  | "investment-proof"
  | "rent-receipt"
  | "other";
export type EvidenceState = "uploaded" | "extracted" | "accepted" | "rejected" | "needs-review";
export type FactSource = "ai-extracted" | "user-entered" | "rule-calculated" | "manual-override";

export type Evidence = {
  id: string;
  tenantId: string;
  returnId: string;
  kind: EvidenceKind;
  filename: string;
  sha256: string;
  state: EvidenceState;
  uploadedAt: string;
};

export type TaxFact<T> = {
  value: T;
  source: FactSource;
  evidenceIds: string[];
  confidence?: number;
};

export function registerEvidence(input: {
  tenantId: string;
  returnId: string;
  kind: EvidenceKind;
  filename: string;
  bytes: Uint8Array;
}): Evidence {
  return {
    id: `evidence_${crypto.randomUUID()}`,
    tenantId: input.tenantId,
    returnId: input.returnId,
    kind: input.kind,
    filename: input.filename,
    sha256: createHash("sha256").update(input.bytes).digest("hex"),
    state: "uploaded",
    uploadedAt: new Date().toISOString(),
  };
}
