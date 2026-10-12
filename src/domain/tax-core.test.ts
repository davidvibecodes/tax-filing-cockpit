import assert from "node:assert/strict";
import test from "node:test";
import { proposeSalaryCorrection } from "./assistant.js";
import { compareRegimes, calculateTax } from "./calculation.js";
import { assessItr1Eligibility } from "./eligibility.js";
import { buildItr1Form } from "./form.js";
import { approveReturn, publishExport } from "./export.js";
import { registerEvidence } from "./evidence.js";

const facts = {
  salary: { value: 1200000, source: "ai-extracted" as const, evidenceIds: ["e1"] },
  interest: { value: 25000, source: "user-entered" as const, evidenceIds: [] },
  houseProperty: { value: 0, source: "user-entered" as const, evidenceIds: [] },
  deductions: { value: 150000, source: "manual-override" as const, evidenceIds: ["e2"] },
};

test("eligibility is a gate rather than a salary-only guess", () => {
  const result = assessItr1Eligibility("2026-27", {
    resident: true,
    age: 31,
    salaryIncome: 1200000,
    otherIncome: 25000,
    housePropertyIncome: 0,
    capitalGains: true,
    businessIncome: false,
    foreignAssets: false,
    agriculturalIncome: 0,
    broughtForwardLosses: false,
    totalIncome: 1225000,
  });
  assert.equal(result.eligible, false);
  assert.match(result.reasons.join(" "), /Capital gains/);
});

test("regime calculations are deterministic and replayable", () => {
  const first = compareRegimes(facts);
  const second = compareRegimes(facts);
  assert.deepEqual(
    { old: first.old.totalTax, new: first.new.totalTax, recommended: first.recommended },
    { old: second.old.totalTax, new: second.new.totalTax, recommended: second.recommended },
  );
});

test("form, proposal, and export preserve evidence and approval boundaries", () => {
  const evidence = registerEvidence({
    tenantId: "tenant-a",
    returnId: "return-a",
    kind: "form-16",
    filename: "form-16.pdf",
    bytes: new TextEncoder().encode("fixture"),
  });
  const calculation = calculateTax(facts, "old");
  const form = buildItr1Form(facts, calculation);
  const proposal = proposeSalaryCorrection(form.salary, 1250000, evidence.id);
  assert.equal(proposal.kind, "set-form-field");
  if (proposal.kind === "set-form-field") assert.deepEqual(proposal.evidenceIds, [evidence.id]);

  const approval = approveReturn({ returnId: "return-a", returnVersion: 7, actorId: "user-a" });
  const manifest = publishExport({
    returnId: "return-a",
    currentReturnVersion: 7,
    approval,
    calculation,
    form,
    evidence: [evidence],
  });
  assert.deepEqual(manifest.sourceDocumentHashes, [evidence.sha256]);
  assert.throws(() =>
    publishExport({
      returnId: "return-a",
      currentReturnVersion: 8,
      approval,
      calculation,
      form,
      evidence: [evidence],
    }),
  );
});
