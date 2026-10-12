import type { AssessmentYear } from "./workspace.js";

export type TaxpayerProfile = {
  resident: boolean;
  age: number;
  salaryIncome: number;
  otherIncome: number;
  housePropertyIncome: number;
  capitalGains: boolean;
  businessIncome: boolean;
  foreignAssets: boolean;
  agriculturalIncome: number;
  broughtForwardLosses: boolean;
  totalIncome: number;
};

export type EligibilityResult = {
  form: "ITR-1";
  eligible: boolean;
  reasons: string[];
  assessmentYear: AssessmentYear;
};

export function assessItr1Eligibility(
  assessmentYear: AssessmentYear,
  profile: TaxpayerProfile,
): EligibilityResult {
  const reasons: string[] = [];
  if (!profile.resident) reasons.push("Taxpayer is not resident for this return.");
  if (profile.capitalGains) reasons.push("Capital gains are present.");
  if (profile.businessIncome) reasons.push("Business or professional income is present.");
  if (profile.foreignAssets) reasons.push("Foreign assets or income are present.");
  if (profile.broughtForwardLosses) reasons.push("Brought-forward losses are present.");
  if (profile.housePropertyIncome < 0) reasons.push("House-property loss is present.");
  if (profile.agriculturalIncome > 5000) reasons.push("Agricultural income exceeds the ITR-1 threshold.");
  if (profile.totalIncome > 5000000) reasons.push("Total income exceeds the ITR-1 threshold.");
  if (profile.salaryIncome <= 0) reasons.push("Salary income is not available.");

  return { form: "ITR-1", eligible: reasons.length === 0, reasons, assessmentYear };
}
