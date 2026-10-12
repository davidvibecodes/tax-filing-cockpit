---
date: 2026-10-12
topic: salaried-tax-filing-cockpit
type: implementation-plan
artifact_contract: ce-unified-plan/v1
product_contract_source: ce-brainstorm
execution: code
deepened: 2026-10-12
---

# Salaried Tax Filing Cockpit

## Goal Capsule

- **Objective:** Enable a salaried Indian taxpayer to move from scattered financial records to a reviewed, editable, official-layout income-tax return without translating the same information repeatedly or trusting unsupported AI guesses.
- **Means:** A three-pane workspace combines persistent filing conversations, evidence-backed tax reasoning, and an editable official-form twin backed by one structured tax model.
- **Product authority:** The taxpayer remains responsible for the final return; the product must make evidence, uncertainty, calculations, overrides, and approvals visible.
- **Open blockers:** None for the requirements contract. Expansion beyond the initial salaried ITR-1 cohort is deferred until the narrow workflow is validated.

## Product Contract

### Summary

Build a ChatGPT-style tax filing cockpit for salaried Indian taxpayers. The workspace guides form selection, reads and reconciles financial records, explains deductions and regime choice, asks targeted questions, synchronizes the conversation with an editable official ITR form, and exports a reviewed PDF without silently inventing facts.

### Problem Frame

Salaried taxpayers commonly maintain spreadsheets or PDFs containing investments, income, and expenses, but those records do not map cleanly to the government's return structure. The difficult work is not only data entry; it includes choosing the correct form, understanding which claims are supported, resolving missing or conflicting information, and checking that the final numbers are correct.

Existing filing products make electronic submission and document extraction easier, but a fast or polished flow can still hide unsupported deductions, incomplete AIS data, wrong-form eligibility, or calculation changes. The product must reduce translation effort while preserving the taxpayer's ability to understand and control the final return.

### Requirements

**Workspace and continuity**

- R1. The product must provide a three-pane filing workspace with persistent conversation history, an assistant conversation, and an editable official-form twin visible as coordinated surfaces.
- R2. A new chat must create a filing session that preserves uploaded documents, extracted facts, evidence states, selected form, user decisions, approvals, and progress when the taxpayer returns later.
- R3. The workspace must let the taxpayer navigate between unresolved questions, evidence items, calculations, and the corresponding form fields without losing context.

**Form selection and eligibility**

- R4. Each new filing session must offer ITR-1 through ITR-7 and an Auto-select option, while making clear which forms the current product version can actually complete.
- R5. Auto-select must use the taxpayer's documents and answers to recommend a form and explain the eligibility signals, missing facts, and uncertainties behind that recommendation.
- R6. A manually selected form must be checked against the taxpayer profile before the workflow is loaded; an unsuitable selection must be flagged with a reason and an alternative path.
- R7. The assistant must ask targeted questions when an unanswered fact could change form eligibility, and it must preserve an unknown or unresolved state instead of guessing.
- R8. The initial supported path must focus on a narrow, well-validated resident salaried ITR-1 cohort; broader form coverage must not be implied by the selector alone.

**Document and evidence handling**

- R9. The product must accept the financial records needed for the supported cohort, including salary evidence, AIS or equivalent tax information, interest records, investment proofs, rent or property evidence where applicable, and taxpayer-entered facts.
- R10. Each extracted or entered value must retain its source and evidence state, distinguishing supported, missing proof, contradictory, calculated, user-entered, and manually overridden information.
- R11. The product must reconcile material differences across documents, extracted values, calculations, and form entries and present each difference as an actionable review item.
- R12. A deduction must not be silently included as a supported claim when its eligibility, evidence, or regime applicability is unresolved.
- R13. The product must ask only questions that resolve form eligibility, close a material evidence gap, or change a calculation or decision; unanswered questions must remain visible.

**Tax decisions and calculations**

- R14. The product must compare applicable tax regimes using deterministic calculations and show the assumptions, evidence-backed deductions, and changes that drive the result.
- R15. The taxpayer must be able to replay the regime comparison after changing an input and see which downstream values and recommendation changed.
- R16. Calculated fields must update when relevant inputs change and must be visually distinguishable from user-entered or manually overridden values.
- R17. The product must show enough calculation provenance for a taxpayer or reviewer to understand how a material form value was derived.

**Official-form twin and synchronization**

- R18. The right-side panel must reproduce the selected official ITR layout closely enough to preserve its pages, schedules, headings, tables, field labels, checkboxes, declarations, and field order.
- R19. Applicable fields in the official-form twin must be editable, with navigation across pages and schedules and direct links from unresolved questions to fields needing attention.
- R20. AI-confirmed or taxpayer-confirmed values must update the corresponding form fields through the structured tax model.
- R21. A taxpayer edit in the form must update the structured tax model, become available to the assistant, and retain an explicit manual-override state.
- R22. The form twin must not become the system of record; it must remain synchronized with the structured tax model and evidence states.

**Review, export, and trust**

- R23. Before finalization, the product must surface material eligibility conflicts, unsupported deductions, unresolved evidence contradictions, and unexplained calculation deltas.
- R24. The taxpayer must be able to approve, reject, or override material claims, with the resulting decision and reason retained in the filing session.
- R25. The product must export the completed return as a PDF that preserves the selected official form's layout.
- R26. The product must provide a companion evidence record containing source references, assumptions, calculation version, unresolved items, changes, and approvals without presenting it as legal certification.
- R27. The product must make clear that the taxpayer is responsible for validating the return and that AIS or extracted information may be incomplete.

### Key Flows

- F1. **Start a filing session**
  - **Trigger:** A taxpayer selects New Chat.
  - **Actors:** Salaried taxpayer, tax assistant.
  - **Steps:** Create a persistent session; offer form choices and Auto-select; accept documents; establish the initial evidence and eligibility state.
  - **Outcome:** The taxpayer sees a clear starting point and the workspace retains the session context.
  - **Covers:** R1, R2, R4, R9.

- F2. **Select and validate a return form**
  - **Trigger:** The taxpayer chooses Auto-select or a specific ITR form.
  - **Actors:** Taxpayer, tax assistant.
  - **Steps:** Evaluate available evidence and answers; identify missing eligibility facts; ask targeted questions; recommend, accept, or reject the selected form.
  - **Outcome:** The workflow proceeds only with a form choice that is supported for the current profile or is explicitly routed for review.
  - **Covers:** R5-R8.

- F3. **Reconcile records into tax facts**
  - **Trigger:** Documents or taxpayer facts are uploaded or changed.
  - **Actors:** Taxpayer, tax assistant.
  - **Steps:** Extract candidate values; link them to sources; classify evidence states; surface conflicts; ask only decision-relevant questions.
  - **Outcome:** The taxpayer can see what is known, missing, contradictory, calculated, or overridden.
  - **Covers:** R9-R13.

- F4. **Explain and choose a tax regime**
  - **Trigger:** Enough evidence exists to compare applicable regimes.
  - **Actors:** Taxpayer, tax assistant.
  - **Steps:** Calculate each regime; show assumptions and deduction support; let the taxpayer replay the comparison after changing inputs; record the approved choice.
  - **Outcome:** The taxpayer understands and approves the selected regime rather than accepting an opaque recommendation.
  - **Covers:** R14-R17, R24.

- F5. **Review the official-form twin**
  - **Trigger:** The form workflow is loaded or a value is changed.
  - **Actors:** Taxpayer, tax assistant.
  - **Steps:** Populate the official-layout twin; navigate schedules; highlight missing or conflicting fields; accept edits; synchronize changes in both directions.
  - **Outcome:** The taxpayer can complete the return through conversation, direct editing, or both without duplicated data entry.
  - **Covers:** R18-R22.

- F6. **Finalize and export**
  - **Trigger:** The taxpayer requests finalization.
  - **Actors:** Taxpayer, tax assistant.
  - **Steps:** Run material-risk checks; show unresolved items; capture approvals or explicit overrides; generate the official-layout PDF and companion evidence record.
  - **Outcome:** The taxpayer receives a reviewed, explainable return package with visible limitations and provenance.
  - **Covers:** R23-R27.

### Acceptance Examples

- AE1. **Auto-select with incomplete evidence**
  - **Given** a taxpayer uploads salary and investment records but omits a fact that could change ITR eligibility.
  - **When** Auto-select runs.
  - **Then** the assistant asks the targeted eligibility question, shows the uncertainty, and does not finalize a form from an inferred answer.
  - **Covers:** R5, R7, R8.

- AE2. **Invalid manual form selection**
  - **Given** a taxpayer manually selects a form inconsistent with the available profile.
  - **When** the selection is validated.
  - **Then** the product explains the conflict and recommends the safer alternative before loading the incompatible workflow.
  - **Covers:** R6, R7.

- AE3. **Unsupported deduction**
  - **Given** a document suggests a possible deduction but the required proof or regime applicability is unresolved.
  - **When** the deduction is considered for the return.
  - **Then** it is marked unresolved or unsupported, the missing evidence is explained, and it is not silently included as a supported claim.
  - **Covers:** R10-R13, R23.

- AE4. **Two-way edit synchronization**
  - **Given** the assistant populated a salary value in the official-form twin.
  - **When** the taxpayer edits that value in the form.
  - **Then** the structured tax value, relevant calculations, evidence state, and assistant context update, and the change is identified as a manual override.
  - **Covers:** R16, R20-R22.

- AE5. **Regime decision replay**
  - **Given** both regimes can be calculated from the current evidence.
  - **When** the taxpayer changes a deduction input.
  - **Then** the comparison recalculates, identifies the changed assumption, and updates the recommendation without losing the prior approved scenario.
  - **Covers:** R14-R17, R24.

- AE6. **Material inconsistency at finalization**
  - **Given** a form value conflicts with a source document or has an unexplained calculation delta.
  - **When** the taxpayer requests finalization.
  - **Then** the product surfaces the conflict, directs the taxpayer to the affected field, and requires resolution or an explicit override before export.
  - **Covers:** R11, R21, R23-R24.

- AE7. **Official-layout export**
  - **Given** all required review conditions are satisfied.
  - **When** the taxpayer exports the return.
  - **Then** the PDF preserves the selected official form's structure and the companion evidence record identifies sources, assumptions, approvals, and unresolved limitations.
  - **Covers:** R25-R27.

### Key Decisions

- K1. **Three-pane cockpit:** Use a persistent history pane, conversational assistant pane, and official-form pane together because the user's core problem spans continuity, explanation, and form completion rather than one isolated interaction.
- K2. **Structured tax model as authority:** Treat the official-form twin as a synchronized review surface rather than the source of truth so edits, calculations, and AI updates cannot silently diverge.
- K3. **Eligibility-gated form selector:** Show ITR-1 through ITR-7 as discoverable choices, but validate every choice and start with a narrow supported ITR-1 workflow because broad form coverage would multiply compliance and maintenance risk.
- K4. **Evidence before optimization:** Separate potential eligibility from supported claims and approval because preventing fabricated or indefensible deductions matters more than maximizing an unverified refund.
- K5. **Deterministic calculation with conversational explanation:** Use the assistant to explain, question, and guide while tax arithmetic and material field derivation remain inspectable and deterministic.
- K6. **Explicit human approval:** Keep the taxpayer in control of material claims, regime selection, conflicts, and overrides because the taxpayer remains responsible for the submitted return.
- K7. **Official-layout export plus evidence record:** Preserve the official PDF experience while retaining a portable explanation of provenance and decisions; the record is not legal certification.

### Success Criteria

- A first-time salaried taxpayer can complete the supported filing journey without re-entering the same fact across chat, evidence review, and form fields.
- Users can identify the source and evidence state of every material populated value before export.
- Material wrong-form, unsupported-deduction, source-conflict, and unexplained-calculation cases are surfaced before export rather than silently accepted.
- A user can explain why the selected regime was recommended and which assumptions would change it.
- User edits in the official-form twin remain synchronized with calculations and assistant context.
- Exported PDFs preserve the selected official form structure closely enough for the taxpayer's intended downstream use.
- The product does not represent incomplete AIS or uncertain extraction as verified fact.

### Scope Boundaries

#### In scope

- Persistent tax-filing chat sessions and history.
- Document upload and evidence-linked extraction for the supported salaried cohort.
- Auto-select and manual ITR form validation.
- Targeted questions for eligibility, missing evidence, and calculation-changing facts.
- Deduction evidence states and regime comparison.
- Three-pane workspace with official-form twin.
- Bidirectional synchronization, provenance, review, approval, and PDF export.
- Companion evidence record.

#### Deferred for later

- Full support for ITR-2 through ITR-7.
- Autonomous government-portal submission or e-verification.
- Year-round AIS discrepancy monitoring.
- Employer, payroll, bank, or fintech distribution.
- Broad Account Aggregator connectivity.
- CA marketplace or mandatory second-person review.
- Notice management, amended-return workflows, and post-filing remediation.
- Aggressive refund optimization or unsupported deduction discovery.

#### Outside this product's identity

- An open-ended general-purpose chatbot unrelated to a filing session.
- A legal guarantee, audit opinion, or official government certification.
- A product optimized primarily for maximizing refunds regardless of evidence.
- A generic tax accuracy score that hides field-level uncertainty and responsibility.

### Assumptions and Dependencies

- Official ITR layouts, eligibility rules, and tax calculations change over time and require an authoritative update process.
- The initial user has enough source material to begin a salaried filing but may have incomplete or contradictory records.
- The product can preserve sensitive financial documents and derived facts under an explicit privacy, retention, and deletion policy.
- The final PDF is an export artifact; government submission and verification are separate responsibilities unless later added explicitly.
- Tax professionals or authoritative rules remain available for boundary cases that the supported workflow cannot safely resolve.

### Sources / Research

- Income Tax Department, ITR-1 Sahaj user manual and eligibility guidance.
- Income Tax Department, AIS and TIS FAQs and taxpayer responsibility guidance.
- Public product positioning from ClearTax, TaxBuddy, Quicko, Tax2win, and myITreturn.
- NIST AI Risk Management Framework for accountable high-impact AI behavior.
- RBI Account Aggregator directions as a consent and purpose-limitation pattern for future integrations.


---

## Planning Contract

### Product Contract preservation

Product Contract unchanged. The implementation plan enriches the confirmed requirements and preserves all R, F, AE, and K IDs and their meaning.

### Key Technical Decisions

- KTD1. **Modular monolith with isolated asynchronous workers:** Keep the first release in one deployable application boundary with explicit domain modules, while isolating OCR, extraction, calculation, and export jobs as least-privileged workers. (session-settled: user-directed — chosen over a service-oriented split and a technology-agnostic plan: it keeps the MVP operable while preserving safety and future extraction boundaries.)
- KTD2. **Return aggregate plus append-only revisions:** Model a filing as a tax-year-scoped return aggregate with immutable documents, facts, decisions, calculation runs, and export records; expose current projections to the UI and use optimistic concurrency for edits. This makes persistent sessions resumable without making chat history the source of truth.
- KTD3. **Three independent version domains:** Version tax rules/calculation engine, official form schema/validation, and PDF/JSON rendering adapters independently. A return records all three versions so historical results are reproducible and annual Department changes do not silently rewrite prior work.
- KTD4. **Typed proposal boundary for the assistant:** The assistant may inspect approved context, propose evidence-linked claims, ask questions, explain calculations, and prepare navigation or edit diffs. Only explicit user commands through validated domain operations may change effective facts, approvals, regime choice, or exports.
- KTD5. **Evidence and approval state machines:** Keep extracted candidates, accepted facts, rejected evidence, conflicts, overrides, approvals, and export locks as distinct states with legal transitions. A value without provenance or a material claim without approval cannot become exportable.
- KTD6. **Canonical-to-form mapping layer:** Generate the official-form twin from the canonical return model through a versioned mapping and validate reverse edits before committing them as manual overrides. The form twin never owns unmapped state.
- KTD7. **Privacy boundary before model calls:** Quarantine and validate uploads, minimize and redact sensitive fields before LLM processing, use only approved providers/configurations, and keep document text, PAN, prompts, and model responses out of ordinary logs.
- KTD8. **PDF-first user export with machine-readable compatibility kept behind the boundary:** Preserve the Product Contract promise of an official-layout PDF and companion evidence record. Build the internal return representation so an AY-specific Department-compatible JSON adapter can be added or used for validation, but do not make portal submission, scraping, or JSON delivery a new MVP promise.

### High-Level Technical Design

The implementation should use one authoritative return model and explicit boundaries around untrusted extraction, deterministic tax logic, assistant proposals, form synchronization, and export. The paths below are proposed greenfield locations and must be adapted to the eventual repository structure without changing the boundaries.

`mermaid
flowchart LR
  UI[Three-pane cockpit] --> API[Application/API boundary]
  API --> Session[Return sessions and projections]
  API --> Domain[Canonical tax domain]
  Domain --> Evidence[Evidence and provenance]
  Domain --> Rules[Eligibility and calculation engines]
  Domain --> Form[Versioned form schema and mappings]
  API --> Assistant[Assistant proposal boundary]
  Assistant --> Domain
  Upload[Quarantined documents] --> Workers[Isolated async workers]
  Workers --> Evidence
  Domain --> Review[Approval and audit]
  Review --> Export[PDF/evidence/optional JSON adapters]
`

The return lifecycle is explicit:

`mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> EligibilityReview
  EligibilityReview --> EvidenceReview: enough profile facts
  EligibilityReview --> NeedsInformation: missing eligibility fact
  NeedsInformation --> EligibilityReview: answer or remain unknown
  EvidenceReview --> CalculationReady: material conflicts resolved
  CalculationReady --> RegimeReview
  RegimeReview --> FormReview: regime approved
  FormReview --> FormReview: chat/form edit creates revision
  FormReview --> ExportLocked: material review complete
  ExportLocked --> Exported: artifact pair committed
  ExportLocked --> FormReview: stale or changed input
`

A synchronized edit follows this sequence:

`mermaid
sequenceDiagram
  participant User
  participant FormTwin
  participant Domain
  participant Calc
  participant Assistant
  User->>FormTwin: edit field
  FormTwin->>Domain: typed change with base version
  Domain->>Domain: validate, append revision, mark override
  Domain->>Calc: recalculate affected snapshot
  Calc-->>Domain: traceable results and warnings
  Domain-->>FormTwin: new projection and review state
  Domain-->>Assistant: updated context and unresolved items
`

### System-Wide Impact

- **Identity and authorization:** Every document, fact, event, job, export, and assistant operation is tenant- and return-scoped. Enforce authorization in the application/domain boundary and again in workers; UI visibility is not a security boundary.
- **Sensitive-data lifecycle:** Originals, OCR text, normalized facts, embeddings, prompts, responses, previews, exports, caches, and backups each need an explicit retention class and deletion propagation path.
- **Concurrency:** Chat edits, form edits, extraction completion, calculation runs, and export locks use base-version checks. Last-write-wins is not acceptable for tax facts, overrides, approvals, or conflicts.
- **Auditability:** Store append-only audit records for access, extraction, review, overrides, calculation, assistant proposals, approvals, exports, downloads, and deletion requests without putting sensitive content into operational logs.
- **External contract:** Official AY-specific schemas, validation documents, layouts, and e-filing integration rules are release inputs. Undocumented portal scraping is excluded.
- **Agent parity:** The assistant and UI operate on the same durable return object; assistant actions are typed proposals or reviewable diffs, not arbitrary field mutation.

### Assumptions

- The eventual repository will provide an application framework, relational persistence, object storage, background-job execution, and a test runner; exact technologies and commands are execution-time binding decisions because no repository was available during planning.
- A tax-rule owner and an official-form/schema update process will exist before the first filing season; rule updates are reviewed and released as versioned artifacts, not changed by prompt edits.
- The initial MVP supports only the confirmed resident-salaried ITR-1 cohort and may route boundary cases to “needs review” without attempting unsupported calculations.
- Provider contracts must prohibit training on submitted data and define retention, region, subprocessors, and deletion behavior before production use.

### Sequencing

The sequence is dependency-driven: establish identity and durable return revisions; add immutable document/evidence handling; add the canonical ITR-1 facts and eligibility gate; add deterministic calculations and regime scenarios; add the versioned form twin and two-way synchronization; add assistant proposals and navigation; then add approval, export, and operational hardening. Do not build the chat or PDF renderer as a shortcut around the canonical model.

### Risks and Dependencies

- Annual ITR eligibility, fields, and validation can change; mitigate with AY-versioned policy and schema fixtures, release checks, and compatibility metadata.
- OCR and LLM extraction can be confidently wrong; mitigate by separating candidates from confirmed facts, requiring evidence links, and never allowing extraction output to bypass review.
- Form mappings can lose information; mitigate with explicit mapping metadata, round-trip tests, and blocking unmapped material fields.
- Sensitive data can leak through providers, logs, exports, caches, or support tooling; mitigate with redaction, provider allowlists, encryption, access audits, and deletion tests.
- Persistent revision history increases storage and complexity; mitigate with projection-based reads, bounded document derivatives, and compensating revisions rather than destructive updates.
- No repository-specific patterns or test commands were available; the first execution pass must bind the proposed paths and verification suites to the selected stack before implementation begins.

## Implementation Units

### U1. Establish tenant-scoped identity and durable filing workspace
- **Goal:** Create the authenticated workspace, taxpayer/return/assessment-year boundary, persistent sessions, and least-privileged access policy required by R1-R4, R27, F1.
- **Requirements:** R1-R4, R27; KTD2, KTD7.
- **Files:** Proposed: apps/web/, services/application/, packages/domain/workspace/, packages/security/, packages/persistence/; tests in packages/domain/workspace/*.test.* and services/application/**/*.integration.test.*.
- **Approach:** Use a return aggregate separate from UI session metadata. Scope every read, write, job, and export by tenant and return. Add optimistic versioning, resumable session state, revocation, and retention metadata before any document or AI feature.
- **Test Scenarios:** A new filing creates an isolated return and resumable session; a reopened session restores the same selected form, evidence state, questions, and progress; cross-tenant identifiers and revoked users cannot read or mutate a return; stale writes are rejected without losing the newer revision; deletion revokes access and schedules derivative cleanup.
- **Verification:** Authorization matrix, persistence/reload integration tests, optimistic-concurrency tests, deletion propagation tests, and audit-event assertions.
- **Dependencies:** None.

### U2. Add quarantined document intake and evidence provenance
- **Goal:** Accept supported records, preserve originals, extract candidates asynchronously, and make every candidate traceable under R9-R13 and F3.
- **Requirements:** R9-R13; KTD5, KTD7.
- **Files:** Proposed: services/documents/, services/workers/document-processing/, packages/domain/evidence/, packages/storage/; tests in services/documents/**/*.integration.test.*, services/workers/document-processing/**/*.test.*, and packages/domain/evidence/*.test.*.
- **Approach:** Quarantine uploads, validate magic bytes and size/page limits, scan before parsing, store immutable originals and hashes, and record extraction candidates separately from accepted facts. Preserve source page/region, raw value, normalized value, extraction method/model version, confidence, and supersession links. Treat document text as untrusted prompt input.
- **Test Scenarios:** Duplicate upload deduplicates logical identity while retaining audit events; malformed or oversized files are rejected; OCR rerun creates a new candidate revision without changing accepted facts; a manual override survives re-extraction; contradictory documents create an actionable conflict; hostile document text cannot change assistant instructions; deleted returns remove previews, OCR derivatives, queues, and download access.
- **Verification:** Upload-abuse suite, provenance/state-transition tests, worker idempotency tests, storage access tests, and prompt-boundary tests.
- **Dependencies:** U1.

### U3. Implement the canonical ITR-1 model and eligibility firewall
- **Goal:** Establish AY-versioned resident-salaried ITR-1 facts, evidence states, unknown handling, and explainable form eligibility under R4-R8, R10-R13 and F2-F3.
- **Requirements:** R4-R8, R10-R13; KTD2, KTD3, KTD5.
- **Files:** Proposed: packages/tax-domain/return/, packages/tax-domain/evidence/, packages/tax-domain/eligibility/, packages/tax-rules/assessment-years/; tests in packages/tax-domain/eligibility/*.test.*, packages/tax-domain/return/*.test.*, and packages/tax-rules/assessment-years/**/*.fixture.test.*.
- **Approach:** Model unknown, unsupported, contradictory, confirmed, calculated, and overridden states explicitly. Implement an AY-specific decision table whose output includes eligible, ineligible, missing-fact, and needs-review outcomes with reasons and alternative routing. Keep the selector discoverable for ITR-1 through ITR-7 while preventing unsupported workflows from loading.
- **Test Scenarios:** Auto-select asks for missing residence or income facts; excluded income/assets route away from ITR-1; a manual incompatible form selection is blocked with a reason; AIS absence does not prove absence of income; accepted evidence supports exactly one effective value per material field; AY rule changes do not mutate prior return decisions.
- **Verification:** Decision-table coverage for every supported inclusion/exclusion, unknown-state tests, property checks for no silent eligibility fallback, and fixture snapshots for each supported AY.
- **Dependencies:** U1, U2.

### U4. Build deterministic tax calculation and regime replay
- **Goal:** Calculate the supported return with inspectable arithmetic and replayable old/new-regime scenarios under R14-R17, F4.
- **Requirements:** R14-R17, R24; KTD3, KTD4.
- **Files:** Proposed: packages/tax-engine/, packages/tax-rules/, packages/tax-domain/scenarios/; tests in packages/tax-engine/**/*.property.test.*, packages/tax-engine/**/*.fixture.test.*, and packages/tax-domain/scenarios/*.test.*.
- **Approach:** Make calculation a pure deterministic function over an immutable normalized snapshot, AY ruleset, regime, engine version, precision, and rounding policy. Emit line-item trace, intermediate values, rule references, warnings, and scenario identity. Keep projected scenarios separate from the effective filing state until approved.
- **Test Scenarios:** Same snapshot and versions produce identical results; deduction changes update only affected downstream values; missing or unresolved evidence cannot enter an approved calculation; boundary rounding and zero/negative inputs follow one policy; scenario replay remains unchanged after later live-session edits; old rules do not recalculate historical exports.
- **Verification:** Golden tax fixtures, property-based arithmetic invariants, differential checks against authoritative examples, replay determinism, and trace completeness tests.
- **Dependencies:** U3.

### U5. Add versioned official-form schema and synchronized form twin
- **Goal:** Render and edit the selected official ITR layout while preserving canonical authority and bidirectional synchronization under R18-R22, F5.
- **Requirements:** R18-R22; KTD3, KTD6.
- **Files:** Proposed: packages/form-schema/assessment-years/, packages/form-mapping/, services/form-twin/, apps/web/features/form-twin/; tests in packages/form-mapping/**/*.roundtrip.test.*, services/form-twin/**/*.integration.test.*, and apps/web/features/form-twin/**/*.component.test.*.
- **Approach:** Store official field metadata, page/schedule order, labels, checkbox semantics, validation, transformations, and mapping provenance as versioned schema data. Generate the twin from the canonical projection. Convert form edits into typed commands with base-version checks; reject unmapped or invalid material edits rather than preserving hidden form-only state.
- **Test Scenarios:** Canonical values populate the correct pages and schedules; a form edit creates a manual override and updates calculation/assistant projections; stale tab edits are rejected and preserved for resolution; required fields and checkboxes validate before lock; every material canonical field round-trips through the mapping; schema version incompatibility blocks export.
- **Verification:** Schema fixture tests, mapping round-trip tests, cross-surface synchronization tests, accessibility/navigation checks, and visual/structural PDF-form comparison fixtures.
- **Dependencies:** U3, U4.

### U6. Add assistant proposals, targeted questions, and context parity
- **Goal:** Let the assistant explain, ask only decision-relevant questions, reconcile evidence, and prepare reviewable changes without bypassing domain controls under R3, R7, R10-R17, R20-R24, F2-F5.
- **Requirements:** R3, R7, R10-R17, R20-R24; KTD4, KTD7.
- **Files:** Proposed: services/assistant/, packages/assistant-contracts/, packages/domain/proposals/, apps/web/features/assistant/; tests in services/assistant/**/*.contract.test.*, packages/domain/proposals/*.test.*, and apps/web/features/assistant/**/*.integration.test.*.
- **Approach:** Give the assistant typed read tools for evidence, conflicts, calculations, form mappings, and unresolved questions. Give it proposal operations such as evidence-linked claim proposal, discrepancy explanation, question proposal, regime comparison, and form-change preparation. Require explicit user acceptance for effective mutations and record tool inputs/outputs, provenance, affected fields, and approval status in the shared return timeline.
- **Test Scenarios:** The assistant asks only when an answer changes eligibility, evidence, calculation, or decision; a document prompt injection cannot override system policy; unsupported deductions remain proposals/unresolved; accepted assistant proposals and direct form edits converge to one revision; the assistant sees the same authorized return state as the form; interrupted work resumes from durable state rather than chat text.
- **Verification:** Schema validation, tool authorization, prompt-injection resistance, proposal-to-command tests, context-parity tests, checkpoint/resume tests, and assistant/form integration scenarios.
- **Dependencies:** U2-U5.

### U7. Implement review, approval, audit, and export package
- **Goal:** Block unsafe finalization, bind approval to an exact immutable state, and produce the official-layout PDF plus evidence record under R23-R27, F6.
- **Requirements:** R23-R27; KTD3, KTD5, KTD8.
- **Files:** Proposed: packages/domain/review/, services/export/, services/audit/, services/workers/export/, apps/web/features/review/; tests in packages/domain/review/*.test.*, services/export/**/*.integration.test.*, services/audit/**/*.test.*, and services/workers/export/**/*.test.*.
- **Approach:** Compute a material-risk review set covering eligibility conflicts, unsupported claims, unresolved evidence, unexplained deltas, stale approvals, and schema incompatibility. Lock an exact snapshot and bind approval to return version, calculation/rule versions, form schema, source hashes, and export configuration. Generate PDF and evidence record atomically as immutable artifacts; optionally validate an AY-specific JSON adapter without expanding the submission scope.
- **Test Scenarios:** Finalization blocks unresolved conflicts; explicit override records actor/reason and invalidates prior approval; any post-approval mutation requires re-review; PDF and evidence record share the same manifest hashes; failed export creates no falsely published artifact; locked sessions reject ordinary mutations; download/export access is scoped, short-lived, auditable, and revocable.
- **Verification:** End-to-end export fixtures, approval invalidation tests, manifest/hash checks, artifact reproducibility tests, access-control tests, audit-integrity tests, and deletion/retention tests.
- **Dependencies:** U1-U6.

### U8. Operationalize tax-rule, schema, privacy, and incident controls
- **Goal:** Make annual rule/schema updates, provider boundaries, observability, quotas, and incident response safe enough for production use.
- **Requirements:** Supports R4-R8, R14-R18, R23-R27 and all success criteria; KTD3, KTD7, KTD8.
- **Files:** Proposed: packages/tax-rules/release/, packages/form-schema/release/, services/model-gateway/, services/policy/, services/observability/, docs/operations/; tests in services/policy/**/*.security.test.*, services/model-gateway/**/*.contract.test.*, packages/tax-rules/release/**/*.fixture.test.*, and packages/form-schema/release/**/*.fixture.test.*.
- **Approach:** Establish controlled release inputs for official AY rules, schemas, validation documents, and renderer versions. Add provider allowlists, redaction, cost/rate limits, worker authorization re-checks, sensitive-log scanning, tamper-evident audit storage, backup/restore checks, and retention/deletion runbooks. Keep release metadata attached to every calculation and export.
- **Test Scenarios:** A new AY schema cannot publish without fixture and mapping validation; provider calls contain only approved/redacted data; revoked access prevents queued jobs; rate limits prevent upload/token/export exhaustion; restore/rebuild reproduces effective facts and manifests; incident and deletion workflows leave no usable derivative access.
- **Verification:** Release-gate suite, security/threat scenarios, quota and retry-storm tests, restore/rebuild verification, provider contract tests, and operational runbook review.
- **Dependencies:** U1-U7.

## Verification Contract

The eventual repository must bind its standard package/lint/type-check commands to these named suites; no repository or runtime manifest was available during planning, so command names remain an execution-time prerequisite rather than invented certainty.

| Gate | Applies to | Required evidence | Covered units |
|---|---|---|---|
| Static quality | Every change | Formatter, linter, type checker, dependency/security scan pass | U1-U8 |
| Domain correctness | Tax model and rules | Eligibility decision fixtures, tax golden cases, property invariants, calculation trace completeness | U3-U4 |
| Evidence integrity | Ingestion and review | Provenance, conflict, override, deletion, and idempotency scenarios pass | U2, U3, U7 |
| Cross-surface parity | Assistant, form, projections | Chat/form convergence, stale-write rejection, context parity, navigation links | U5-U6 |
| Security/privacy | All sensitive paths | Tenant isolation, upload abuse, prompt injection, redaction, provider, export, audit, retention, and deletion scenarios pass | U1, U2, U6-U8 |
| Export integrity | Final package | PDF/evidence manifest equality, reproducibility, approval binding, schema compatibility, no false publication | U7-U8 |
| Operational readiness | Release | AY/schema release checklist, restore test, incident/deletion runbook review, quota/circuit-breaker checks | U8 |

Verification must include both automated tests and a curated manual review of representative taxpayer journeys, because official-form fidelity, explanation quality, and unresolved-state clarity are not fully captured by unit tests.

## Definition of Done

- Product Contract requirements R1-R27 and flows F1-F6 are implemented or explicitly mapped to a deferred boundary; no unsupported ITR workflow is presented as complete.
- Every feature-bearing unit U1-U8 has passing scenario coverage for its happy path, failure/edge paths, and cross-layer behavior where applicable.
- The canonical return model, evidence state, calculation trace, form mapping, approval record, and export manifest can be followed for every material output.
- No AI-generated or OCR-derived value becomes an effective filing fact without provenance, validation, and required human approval.
- Deterministic calculations are reproducible from the recorded snapshot, tax-rule version, engine version, precision, and rounding policy.
- Chat and official-form edits converge through versioned domain operations; stale or conflicting writes are surfaced rather than overwritten.
- PDF and companion evidence record are generated from one locked state and cannot be marked published independently.
- Tenant isolation, encryption, redaction, provider controls, audit trails, retention, deletion, and export authorization are verified in pre-production scenarios.
- Annual AY/schema updates have a controlled release path with fixtures, compatibility checks, and rollback/disable behavior.
- Documentation covers taxpayer responsibility, AIS incompleteness, supported cohort, unresolved states, export limitations, retention/deletion behavior, and operational ownership.
- Abandoned experimental code, dead-end adapters, temporary fixtures, and superseded plan artifacts are removed before completion.

---

## Appendix

### Planning research that changed the design

- The Income Tax Department's current ITR-1 guidance makes eligibility Assessment-Year-specific and excludes multiple income, residency, asset, and loss conditions; this supports the eligibility firewall and AY-versioned policy rather than a salary-only heuristic. Sources: https://www.incometax.gov.in/iec/foportal/downloads/income-tax-returns, https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/ITR1-FAQ.
- AIS guidance states that the statement contains information presently available to the Department and may omit transactions; taxpayers remain responsible for a complete and accurate return. This supports reconciliation and explicit missing-data warnings rather than AIS-as-truth. Source: https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/ais%20-%20annual%20information%20statement-faqs.
- Official e-filing materials describe annual JSON utilities and ERI-oriented APIs; this supports keeping JSON compatibility versioned behind the PDF promise and excluding undocumented portal scraping or assumed public submission APIs. Sources: https://www.incometax.gov.in/iec/foportal/help/offline-utility, https://www.incometax.gov.in/iec/foportal/api-specifications.
- The Digital Personal Data Protection Act, 2023 and CERT-In directions support privacy-by-design, reasonable safeguards, incident readiness, minimization, retention controls, and restricted logs for PAN-linked financial data. Sources: https://www.meity.gov.in/content/digital-personal-data-protection-act-2023, https://www.cert-in.org.in/Directions70B.jsp.
- The assistant review identified read/action parity as important now for evidence search, reconciliation, explanation, and preparation, while submission, attestation, and legal acceptance remain human-only.

