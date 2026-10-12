import type { CalculationSnapshot } from "./calculation.js";
import type { Evidence } from "./evidence.js";
import type { Itr1Form } from "./form.js";

export type Approval = {
  returnId: string;
  approvedVersion: number;
  approvedAt: string;
  actorId: string;
};

export type ExportManifest = {
  id: string;
  returnId: string;
  returnVersion: number;
  calculationId: string;
  formSchemaVersion: string;
  sourceDocumentHashes: string[];
  artifact: "official-layout-pdf";
  createdAt: string;
};

export function approveReturn(input: {
  returnId: string;
  returnVersion: number;
  actorId: string;
}): Approval {
  return {
    returnId: input.returnId,
    approvedVersion: input.returnVersion,
    approvedAt: new Date().toISOString(),
    actorId: input.actorId,
  };
}

export function publishExport(input: {
  returnId: string;
  currentReturnVersion: number;
  approval: Approval;
  calculation: CalculationSnapshot;
  form: Itr1Form;
  evidence: Evidence[];
}): ExportManifest {
  if (
    input.approval.returnId !== input.returnId ||
    input.approval.approvedVersion !== input.currentReturnVersion
  ) {
    throw new Error("Approval is stale; review the current return before exporting.");
  }
  return {
    id: `export_${crypto.randomUUID()}`,
    returnId: input.returnId,
    returnVersion: input.currentReturnVersion,
    calculationId: input.calculation.id,
    formSchemaVersion: input.form.schemaVersion,
    sourceDocumentHashes: input.evidence.map((item) => item.sha256).sort(),
    artifact: "official-layout-pdf",
    createdAt: new Date().toISOString(),
  };
}
