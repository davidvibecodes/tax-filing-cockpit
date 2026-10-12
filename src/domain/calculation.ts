import type { TaxpayerProfile } from "./eligibility.js";
import type { TaxFact } from "./evidence.js";

export type ReturnFacts = {
  salary: TaxFact<number>;
  interest: TaxFact<number>;
  houseProperty: TaxFact<number>;
  deductions: TaxFact<number>;
};

export type TaxRegime = "old" | "new";

export type CalculationSnapshot = {
  id: string;
  regime: TaxRegime;
  grossIncome: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  cess: number;
  totalTax: number;
  engineVersion: string;
  precision: "INR-integer";
};

function roundInr(value: number): number {
  return Math.max(0, Math.round(value));
}

function slabTax(income: number, regime: TaxRegime): number {
  if (regime === "new") {
    const slabs = [
      [400000, 0],
      [800000, 0.05],
      [1200000, 0.1],
      [1600000, 0.15],
      [2000000, 0.2],
      [2400000, 0.25],
      [Infinity, 0.3],
    ] as const;
    let previous = 0;
    return slabs.reduce((tax, [limit, rate]) => {
      const amount = Math.max(0, Math.min(income, limit) - previous);
      previous = limit;
      return tax + amount * rate;
    }, 0);
  }
  const slabs = [
    [250000, 0],
    [500000, 0.05],
    [1000000, 0.2],
    [Infinity, 0.3],
  ] as const;
  let previous = 0;
  return slabs.reduce((tax, [limit, rate]) => {
    const amount = Math.max(0, Math.min(income, limit) - previous);
    previous = limit;
    return tax + amount * rate;
  }, 0);
}

export function calculateTax(
  facts: ReturnFacts,
  regime: TaxRegime,
): CalculationSnapshot {
  const grossIncome = facts.salary.value + facts.interest.value + facts.houseProperty.value;
  const standardDeduction = regime === "new" ? 75000 : 50000;
  const deductions = regime === "old" ? facts.deductions.value : 0;
  const taxableIncome = Math.max(0, grossIncome - standardDeduction - deductions);
  const taxBeforeRebate = slabTax(taxableIncome, regime);
  const rebate = taxableIncome <= (regime === "new" ? 700000 : 500000) ? taxBeforeRebate : 0;
  const netTax = taxBeforeRebate - rebate;
  const cess = roundInr(netTax * 0.04);
  return {
    id: `calc_${crypto.randomUUID()}`,
    regime,
    grossIncome: roundInr(grossIncome),
    taxableIncome: roundInr(taxableIncome),
    taxBeforeRebate: roundInr(netTax),
    cess,
    totalTax: roundInr(netTax + cess),
    engineVersion: "prototype-2026.1",
    precision: "INR-integer",
  };
}

export function compareRegimes(
  facts: ReturnFacts,
): { old: CalculationSnapshot; new: CalculationSnapshot; recommended: TaxRegime } {
  const old = calculateTax(facts, "old");
  const modern = calculateTax(facts, "new");
  return { old, new: modern, recommended: old.totalTax <= modern.totalTax ? "old" : "new" };
}

export function profileFromFacts(facts: ReturnFacts): TaxpayerProfile {
  return {
    resident: true,
    age: 30,
    salaryIncome: facts.salary.value,
    otherIncome: facts.interest.value,
    housePropertyIncome: facts.houseProperty.value,
    capitalGains: false,
    businessIncome: false,
    foreignAssets: false,
    agriculturalIncome: 0,
    broughtForwardLosses: false,
    totalIncome: facts.salary.value + facts.interest.value + facts.houseProperty.value,
  };
}
