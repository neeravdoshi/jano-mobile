# Jano Mobile Design System v0

This is the first mobile synthesis of the Figma desktop design-system file:

- Figma source: `Jano-Design-System-1.0`
- File key: `KKlKZX1n365W03JMxkD3tU`
- Relevant collections: `Mode`, `Typography`, `Numerics`

## What Carries Over

- Primary typeface: `Figtree`
- Secondary/support typeface: `Noto Sans`
- Neutral base: `Snow`, `Charcoal`, `Stroke`, `Oslo`, and `Warm Grey` from the working-file palette
- Semantic accents: `Success Green`, `Crimson`, and `Intermediate Yellow`

## Working-File Palette

The current implementation should stay aligned to the colors visible in the Jano working file:

- `Crimson Base` `#E54B4B`
- `Crimson Deep` `#E71212`
- `Crimson 60` `#BE1010`
- `Crimson 80` `#7F2325`
- `Error Red` `#FF4F04`
- `Crimson 30` `#F4AAAA`
- `Crimson 20` `#FBD4DB`
- `Crimson 10` `#F6E7E7`
- `Crimson 5` `#FFFEFB`
- `Charcoal Base` `#252323`
- `Charcoal Warm` `#343131`
- `Charcoal 50 Text` `#4A4D4D`
- `Warm Grey` `#DADBDC`
- `Warm Grey 130` `#B4ABB5`
- `Warm Grey 120` `#C9C9C5`
- `Stroke` `#D4D8DB`
- `Stroke 20` `#A2A8C3`
- `Stroke 40` `#737CA5`
- `Oslo 80` `#424749`
- `Oslo Base` `#6B7576`
- `Oslo 30` `#BEC1D1`
- `Oslo 10` `#E2E3E3`
- `Oslo 5` `#EFEFED`
- `Snow Base` `#FFFFFF`
- `Success Green` `#12B05F`
- `Success Green 15%` `#12B05F26`
- `Intermediate Yellow` `#FFD000`

## Mobile Adaptation Rules

- Reduce decorative spread from the desktop system and keep color concentrated in states and highlights.
- Keep the surface model light-first and warm rather than stark white.
- Use fewer typography steps on mobile than desktop, with stronger contrast between title and body levels.
- Default interaction targets should be 44px minimum height.
- Corners should stay in the 12-24px range for cards and shell surfaces.

## Initial Primitive Set

- `Button`
- `IconButton`
- `Card`
- `TextField`
- `Pill`
- `SectionHeading`
- `PatientRow`

## Documented Repeating Patterns

These are the cross-screen structures and recurring UI families that should be treated as named patterns in this repo. They are not all promoted to `design-system/components/` yet, but they should be reused intentionally rather than recreated ad hoc.

### Shared Primitives

- `Button`
  - primary command surface
  - supports the calm, high-contrast CTA language used across the prototype
- `IconButton`
  - circular icon action for back, filter, export, and other compact controls
  - standard choice for subpage leading/trailing actions
- `Card`
  - base framed surface for compact modules and list objects
  - feature-level cards may extend it with local classes
- `TextField`
  - standard search and input field shell
- `Pill`
  - small semantic status and metadata chip
- `SectionHeading`
  - eyebrow, title, and optional detail row for in-page sections
- `PatientRow`
  - compact patient summary row for patient list usage

### Validated Shared Page Patterns

- `SubPageHeader`
  - source hooks: `.subpage-header`, `.subpage-header__title`, `.subpage-header__subtitle`
  - used by `TrendsPage` and `MedicationsPage`
  - this is the standard subsection header pattern for the app
  - includes:
    - leading circular back action
    - title/subtitle stack with fixed text hierarchy
    - optional trailing contextual action such as export or filter
  - rule:
    - subsection pages should match this spacing, text scale, and header rhythm unless the flow explicitly requires a different shell

- `SubPageBody`
  - source hooks: `.trends-body`, `.meds-body`
  - purpose:
    - padded inner content wrapper inside the flush subpage screen shell
    - restores the horizontal breathing room and section rhythm that should remain consistent across subsections
  - rule:
    - new subsection pages should define a dedicated body wrapper rather than placing sections directly into the flush container

- `BottomNav`
  - shared persistent navigation with centered quick action
  - used in both main and subpage layouts
  - stable shell pattern, not feature-local UI

### Validated Repeating Product Patterns

- `QuickActionTile`
  - source hooks: `.quick-action`, `.quick-action__icon`, `.quick-action__label`
  - current use:
    - patient home quick-access grid
  - role:
    - compact launch tile into high-frequency doctor tasks

- `TrendSummaryCard`
  - source hooks: `.trends-summary-card*`
  - current use:
    - trends overview and filter summary
  - role:
    - compact metric summary with tone-aware emphasis and selected state

- `MedicationCard`
  - source hooks: `.med-card*`
  - current use:
    - patient medications list
  - role:
    - doctor-facing prescription object with regimen status, compact regimen facts, and review timing
    - content should support the same clinical narrative as timeline and pathology views
  - note:
    - prefer compact review layouts over dashboard-style subgrids when the screen goal is rapid regimen scanning
    - this should remain a documented feature pattern until a second medication-like object needs the same structure

- `AISuggestion`
  - source hooks: `.ai-suggestion*`
  - current use:
    - medication review recommendation
  - role:
    - compact AI-authored recommendation block that is clearly distinct from ordinary clinical content without becoming visually loud
  - rule:
    - keep the icon inline and small
    - use only Jano token-aligned shine/accent colors
    - the treatment should compress attention, not expand the card vertically

## Deferred

- Swipe stacks
- Expandable FAB clusters
- Drag/reorder surfaces
- Bottom sheets
- Complex record timeline patterns

Those should be added when the wireframes demand them, not earlier.

## Current Boundary

The current patient home screen may use a feature-local swipe stack and timeline treatment for validation, but those patterns are not yet promoted into `design-system/`. They should stay local until a second flow needs the same API and interaction model.

## Active Local Patterns

The following patterns are intentionally live in product code but remain outside the shared design system for now:

- `AttentionStack`
  - finite deck behavior
  - simplified horizontal drag tuned for mobile screens
  - threshold-based swipe commit with no momentum carry
  - tertiary read/unread affordances with drag-progress fill
  - blank background preview cards for depth rather than partial content preview
- homepage clinical timeline
  - vertical rail with date + category stamp
  - a local family of event variants rather than one repeated card
  - compact event cards, attachment rows, metric bands, medication rows, and bullet-led note blocks depending on event type
  - should represent a longitudinal care relationship, not just a short recent activity feed
  - each card should lead with one main takeaway; secondary details should be trimmed, not exhaustively listed
- notes flow
  - split between an index surface for scanning/filtering and an editor surface for capture
  - keep list cards concise and metadata-led; do not turn notes into a generic card feed
  - use structured sections in the editor instead of a blank longform document by default
  - patient profile detail should open as a centered in-phone modal sheet rather than a bottom sheet when the content is summary-heavy and read-focused
- chat flow
  - merge multi-channel patient communication into one doctor-facing thread
  - clearly distinguish patient messages, team replies, and internal care-team notes
  - keep the conversation clinically calm and operational, not consumer-social
  - entry point is the home quick-action tile; the bottom-nav chat slot stays disabled
- prescription flow
  - if `New Rx` overwhelmingly means creating a typed prescription, route there directly instead of presenting a chooser overlay
  - print preview is a mobile-contained document surface and should remain visually bounded by the device shell
- `TimelineCard`
  - source hooks: `.timeline-card*`
  - repeated within the home clinical record, but still intentionally local
  - reason:
    - the chronology shell is stable, but the internal variants are still being shaped against incoming flows and references

These are implementation patterns under validation, not reusable primitives yet.

## Typography Notes

- Home and Trends should share the same title logic:
  - display face for primary titles and critical labels
  - support face for metadata, filters, and secondary descriptors
- Timeline cards should prefer wider text measure over side-by-side compression. If a CTA causes body text to narrow or feel weak, move the CTA to a footer row before reducing type.
- Timeline content should read like clinical progression over time. Favor believable milestone sequencing over evenly distributed recent entries.
- Trends and medications should not drift into unrelated chronic-care placeholders. If the timeline says the patient is on a dialysis pathway, the medication list and lab trends should reinforce that same pathway.
