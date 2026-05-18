# 2026-05-06 Patient Attention Stack

- Component name: `AttentionStack`
- Problem solved: the patient home screen needs a compact way to review high-priority items without turning the page into a stacked card farm.
- References used: the provided swipe-card references and the patient overview structure reference.
- Proposed states or API: ordered items, semantic tone, swipe left/right, and primary CTA per item.
- Why it belongs in the shared system: it does not yet. The interaction model is still being validated against a single patient-home flow.
- Fallback if it remains feature-local: keep it under `src/features/patients/components/` until another screen needs the same stack behavior and action pattern.

## Follow-up Notes: 2026-05-08

- The vertical gap between the card stack and the tertiary read/unread affordances should be reduced by roughly half, as long as the controls remain clearly tappable.
- The read and unread controls should expose drag progress as a threshold indicator. The requested behavior is a loading-bar style fill from `0%` to `100%` based on how far the active card is pulled toward each side.
- The same progress logic should apply symmetrically for both `Keep unread` and `Mark as read`.
- Swipe should only commit once the visible progress crosses the full threshold. Anything short of that should spring back into place.

## Current Validation Outcome

- The stack remains feature-local.
- Background cards now use blank structural previews instead of partial content previews. This is the current preferred treatment because partial medical text on non-active cards weakened alignment and legibility.
- The component is being validated as a triage/review mechanism, not yet as a shared interaction primitive.
