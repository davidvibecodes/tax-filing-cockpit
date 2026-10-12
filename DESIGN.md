# Tax Cockpit visual system

## Direction

Tax Cockpit is an operate surface for careful, evidence-backed filing. The
interface follows Fluent 2: clear hierarchy, calm neutral layers, compact
command surfaces, predictable focus states, and color reserved for meaning.
The workspace feels like a trustworthy productivity tool rather than a
marketing page.

## Color

- Neutral background layers: `#f5f5f5`, `#faf9f8`, and `#ffffff`
- Neutral strokes: `#e1dfdd` and `#d2d0ce`
- Brand blue: `#0f6cbd` for primary actions and selected navigation
- Brand tint: `#deecf9` for selected surfaces and assistant context
- Success: `#dff6dd` / `#0e700e`
- Warning: `#fff4ce` / `#8a5700`
- Foreground: `#242424`, `#424242`, and `#616161`

## Typography

Segoe UI Variable (falling back to Segoe UI and system UI) handles all
controls, metadata, headings, and dense tax information for native Windows
clarity and Fluent-compatible metrics.

## Composition

The desktop surface uses a compact navigation rail and a three-pane cockpit:
filing history, assistant review, and official-form twin. Panels use one-pixel
strokes and restrained elevation. On smaller screens the same panes become a
clear vertical sequence without hiding the task.

## Components and states

Buttons, list items, inputs, and cards use compact 4px corner radii and a
4px-based spacing rhythm. Evidence states are named as well as colored.
Primary actions use brand blue; approvals and sync use green; unresolved review
items use yellow. The form remains visually distinct from the assistant while
showing source tags and derived values inline.

## Motion

Interaction feedback is short and purposeful: hover and focus states, toast
confirmation, button state changes, and a subtle form zoom. No decorative
animation competes with review.
