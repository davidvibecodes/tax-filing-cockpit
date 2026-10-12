import type { CalculationSnapshot } from "./calculation.js";
import type { ReturnFacts } from "./calculation.js";

export type Itr1Form = {
  schemaVersion: "itr1-prototype-2026";
  salary: number;
  interestIncome: number;
  housePropertyIncome: number;
  deductions: number;
  taxableIncome: number;
  totalTax: number;
};

export function buildItr1Form(
  facts: ReturnFacts,
  calculation: CalculationSnapshot,
): Itr1Form {
  return {
    schemaVersion: "itr1-prototype-2026",
    salary: facts.salary.value,
    interestIncome: facts.interest.value,
    housePropertyIncome: facts.houseProperty.value,
    deductions: facts.deductions.value,
    taxableIncome: calculation.taxableIncome,
    totalTax: calculation.totalTax,
  };
}

export function updateFormField(
  form: Itr1Form,
  field: keyof Itr1Form,
  value: number,
): Itr1Form {
  if (field === "schemaVersion") throw new Error("Schema version is not editable.");
  if (!Number.isFinite(value) || value < 0) throw new Error("Form values must be non-negative numbers.");
  return { ...form, [field]: value };
}
