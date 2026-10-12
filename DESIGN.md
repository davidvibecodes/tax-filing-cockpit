# Tax Cockpit visual system

## Direction

Tax Cockpit is an operate surface for careful, evidence-backed filing. The
interface treats the workspace like a review desk: quiet enough for numbers,
structured enough for cross-checking, and warm enough that unresolved facts do
not feel like failure.

## Color

- `#f0f2ec` mineral canvas for the working environment
- `#fbfcf9` paper panels and form surfaces
- `#3e2639` plum navigation and primary actions
- `#57364f` plum interaction accent
- `#dce8d9` accepted or synced evidence
- `#f5e9cf` unresolved review state
- `#202221` ink for readable decisions and values

## Typography

DM Sans handles controls, metadata, and dense tax information. Newsreader
provides the few large editorial headings so the app feels like a calm review
desk rather than a generic admin dashboard.

## Composition

The desktop surface uses a fixed navigation rail and a three-pane cockpit:
filing history, assistant review, and official-form twin. On smaller screens
the same panes become a clear vertical sequence without hiding the task.

## Components and states

Thin mineral rules, compact labels, restrained shadows, and paper-like surfaces
support scanability. Evidence states are named as well as colored. Primary
actions use plum; approvals and sync use sage; unresolved review items use
amber. The form remains visually distinct from the assistant while showing
source tags and derived values inline.

## Motion

Interaction feedback is short and purposeful: toast confirmation, button state
changes, and a subtle form zoom. No decorative animation competes with review.
