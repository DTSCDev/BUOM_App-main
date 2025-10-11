# SFM Page Sequencing and SFM ID Allocation – Update Note

This document is a practical reminder of the page-first SFM allocation policy and how outputs should be sequenced and reused across the app.

## Core Principles
- Each page has its own SFM ID series; do not reuse IDs across pages.
- Allocate SFM IDs strictly in top-to-bottom, left-to-right order that matches the UI.
- Treat outputs like Excel cell references: if a value already exists and is correct, reuse it via its SFM ID instead of re-implementing the formula.
- Badges show only the SFM ID (no descriptive text in the badge line).
- Never duplicate or invent new IDs unless the page’s sequence requires a new output position.

## Allocation Steps
1) Finalise the UI layout for the page.
2) Allocate the page’s SFM sequence prefix based on its context.
   - Example: APF Registration Step 5 → `SFM-APF-15XX` (APF = 1XXX; Step 5 = 15XX).
3) Assign SFM IDs in top-to-bottom, left-to-right order within each card.
   - Start with “Existing” column outputs, then “Proposed” column outputs.
   - Continue the sequence for dialogs/popups (e.g., Payslip Comparison), then subsequent sections (e.g., Monthly Schedule).

## Example: APF Registration – Step 5 (Salary Exchange)
Sequence (`SFM-APF-15XX`) mapped to the UI flow:
- Existing
  - `SFM-APF-1501` Existing Annual Salary
  - `SFM-APF-1502` Existing Monthly Salary
  - `SFM-APF-1503` Existing Annual Net Pay
  - `SFM-APF-1504` Existing Monthly Net Pay
- Proposed
  - `SFM-APF-1505` Proposed Annual Salary
  - `SFM-APF-1506` Proposed Monthly Salary
  - `SFM-APF-1507` Proposed Annual Salary Exchange
  - `SFM-APF-1508` Proposed Monthly Salary Exchange
  - `SFM-APF-1509` Proposed Annual Net Pay
  - `SFM-APF-1510` Proposed Monthly Net Pay
- Next sections (continue numbering)
  - Payslip Comparison popup → next available numbers
  - Monthly Salary Exchange Schedule → next available numbers

## Reuse Policy (Excel-style)
- If an output value already exists elsewhere and the amount is correct, reference that SFM ID and reuse the value.
- Do not replicate complex logic; prefer `getValue(<SFM ID>)` semantics over re-computing.
- Maintain page isolation: even when reusing a value, the consuming page must have its own SFM ID that points to the source value.

## Do’s and Don’ts
- Do: keep IDs unique per page and ordered by the visible layout.
- Do: extend sequences only when new visible outputs are added.
- Don’t: show or reuse codes from other pages directly in badges.
- Don’t: add descriptive text alongside SFM badges.
- Don’t: backfill formulas where a correct value can be referenced.

## Implementation Notes
- Define page maps in `src/data/systemFields/pageBasedSFMFields.ts` and use a central getter API to retrieve values by SFM ID.
- For dialogs/modals tied to a page, continue the sequence after main card outputs.
- For schedules/tables, assign contiguous IDs covering totals, subtotals, and key line items in UI order.

## Quick Checklist Before Coding
- Is the page’s UI order final? If not, finalise it first.
- Is the page’s sequence prefix correct (e.g., `SFM-APF-15XX` for Step 5)?
- Are IDs assigned in top-to-bottom, left-to-right order per card?
- Are “Existing” outputs allocated before “Proposed” outputs?
- Are dialog/schedule IDs continuing the sequence without gaps?
- Are any reused values referenced via their SFM ID (no formula duplication)?
- Are badges only showing SFM IDs (no cross-page IDs, no descriptions)?

This codifies the allocation discipline to keep the app debuggable, auditable, and consistent with the spreadsheet model.