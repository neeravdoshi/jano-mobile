# Jano Prototype Brief

Jano is a doctor-facing mobile PWA prototype for Clinic OPD workflows. This repository is for fast product iteration and rigorous user testing, not production deployment.

## Direction

- Audience: clinic doctors reviewing queue, patient context, notes, prescriptions, and prior records.
- Tone: premium, calm, clinically confident, minimal.
- Build rule: wireframes define structure, references define craft.
- Platform: mobile-first React PWA, Vercel-ready.
- Color source: the current Jano working-file palette, including `Crimson`, `Charcoal`, `Snow`, `Success Green`, `Stroke`, `Oslo`, and `Intermediate Yellow`.
- Current patient-home structure: patient header first, then active items that need attention, then quick actions, then a timeline-led record view. AI search stays deferred on this screen.
- Motion split: use `Framer Motion` for state-driven page transitions, swipe interactions, and layout handoffs. Reserve `GSAP` for future choreography-heavy sequences only when the interaction demands explicit timeline control.

## Current Implementation Status

- Shell: phone-sized preview with sticky bottom navigation.
- Patient home: live route with patient identity block, a mobile-safe finite attention-card stack, quick action tiles, and clinical timeline.
- Chat should be reachable from the quick-access tile, not from the bottom navigation. The bottom-nav chat icon remains present but disabled.
- Notes:
  - `Notes` quick action now routes into a real notes flow
  - split into a filterable notes index and a focused structured editor
  - note capture should support progress notes, initial assessments, and discharge summaries without making the doctor browse a generic document app
- Chat:
  - `Chat` quick action now routes into a real doctor-side communication thread
  - incoming patient messages may originate from WhatsApp, SMS, or the patient app, but should be merged into one clinical conversation surface
  - the patient experiences this as direct doctor messaging; the doctor UI should still expose team visibility and internal coordination context
- Attention stack:
  - cards dismiss permanently rather than looping
  - drag must cross the full threshold before dismissal commits
  - tertiary `Keep unread` and `Mark as read` actions mirror the swipe behavior
  - background cards are blank structural previews, not partial text previews
- Timeline:
  - vertical chronology with date stamp and category chip
  - multiple event archetypes rather than one repeated card
  - longer longitudinal care story, starting from the beginning of the doctor-patient relationship and continuing through workup, treatment plan, dialysis initiation, medication changes, and ongoing review
  - each event should surface one primary clinical takeaway, not every available detail from the encounter
- Trends:
  - live route exists
  - uses the same entry-transition language as the home screen
  - pathology parameters are now aligned to a dialysis / renal follow-up story rather than a generic mixed lab panel
- Medications:
  - regimen content should reflect the same nephrology relationship shown in the timeline
  - supportive renal medications, dialysis-related medications, and diabetes management should read as one connected care story rather than unrelated specialties
  - layout should prioritize fast regimen review over dashboard treatment; reduce decorative detail and redundant controls

## Documentation Rule

When interaction or IA decisions change in the code, update the related markdown in this repository in the same pass. The brief, design-system note, references index, and any relevant proposal note should not drift behind the implementation.

When a structure repeats across screens or becomes the expected default for a class of pages, promote it into the design-system documentation as a named pattern. Do not leave cross-page spacing, header, shell, or card conventions implicit in code alone.

## Phase 0 and 1 Scope

- Scaffold the React PWA foundation.
- Translate Figma desktop design-system color and type choices into a mobile-first token system.
- Establish a thin reusable primitive layer.
- Create realistic fixture conventions and a canonical shell page for phone-sized review.
