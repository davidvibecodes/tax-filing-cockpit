# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Salaried taxpayers in India who need to turn salary, AIS, investment, interest,
and rent or property records into a reviewed income-tax return.

## Product Purpose

Tax Cockpit helps a taxpayer reconcile scattered financial records, understand
eligibility and regime choices, and complete a reviewed ITR workflow without
silently inventing facts. Success means the taxpayer can see what is supported,
what is unresolved, how material numbers were calculated, and what they are
approving.

## Positioning

An evidence-backed filing workspace: the assistant explains and proposes, while
structured facts, deterministic calculations, and explicit approval remain the
authority.

## Operating Context

The product is used in a browser while a taxpayer reviews financial documents,
answers targeted questions, checks calculations, and edits an official-form
twin. Taxpayer data is sensitive and must remain tenant-scoped.

## Capabilities and Constraints

The first supported journey is a narrow resident salaried ITR-1 workflow. The
cockpit has persistent filing history, an assistant conversation, evidence
review, deterministic regime comparison, an editable form twin, and approval
boundaries. Broader ITR coverage, portal submission, and real taxpayer data
handling remain future work. Unknown or unsupported facts must stay unresolved.

## Brand Commitments

The product name is Tax Cockpit. The voice is calm, precise, transparent, and
non-judgmental. It must make tax work feel inspectable rather than magical.

## Evidence on Hand

The current repository contains a TypeScript domain prototype, Supabase Edge
Function, migration, and implementation plan. No customer testimonials,
production tax certifications, or real taxpayer records are available and must
not be fabricated.

## Product Principles

- Evidence before optimization.
- Deterministic arithmetic, conversational explanation.
- Unknown is a valid state.
- The taxpayer approves material claims.
- The form is a synchronized surface, not the source of truth.

## Accessibility & Inclusion

The web UI must remain keyboard usable, readable at responsive widths, and
clear without relying on color alone for evidence state.
