import type { Itr1Form } from "./form.js";

export type AssistantProposal =
  | {
      kind: "set-form-field";
      field: Exclude<keyof Itr1Form, "schemaVersion">;
      value: number;
      rationale: string;
      evidenceIds: string[];
    }
  | {
      kind: "ask-question";
      question: string;
      missingFact: string;
    };

export function proposeSalaryCorrection(
  current: number,
  extracted: number,
  evidenceId: string,
): AssistantProposal {
  if (current === extracted) {
    return {
      kind: "ask-question",
      question: "Is the salary figure shown in the document your final annual salary?",
      missingFact: "salary-confirmation",
    };
  }
  return {
    kind: "set-form-field",
    field: "salary",
    value: extracted,
    rationale: "The extracted salary differs from the current form value.",
    evidenceIds: [evidenceId],
  };
}
