/**
 * System Fields Aggregator (Authoritative Entry Point)
 *
 * Purpose
 * - Acts as the canonical export surface for all SFM field definitions used by both
 *   the Free Calculator (SFM-0XX-X) and Main App (page-based SFM-XXXX formats).
 * - Centralizes the update process and documents the strict wiring rules so updates
 *   are auditable and consistent across the application.
 *
 * Data Sources (page-based organization)
 * - Free Calculator: `freeCalculatorFields` (SFM-0XX-X series)
 * - APF Pages: `apfPageFields`, `generateAPFYearCodes` (SFM-APF-1XXX-X)
 * - Profile Page: `profilePageFields` (SFM-PRF-2XXX-X)
 * - Net Asset Value: `netAssetValueFields` (SFM-NAV-3XXX-X)
 * - Calculators Page: `calculatorsPageFields`, `retirementCalculatorFields` (SFM-CAL-4XXX-X)
 * - Payments Page: `paymentsPageFields` (SFM-PAY-5XXX-X)
 * - Reports Page: `reportsPageFields` (SFM-REP-6XXX-X)
 * - Statements Page: `statementsPageFields` (SFM-STA-7XXX-X)
 * - Benefits Page: `benefitsPageFields` (SFM-BEN-8XXX-X)
 * - BUOM Hub: `buomHubFields` (SFM-HUB-9XXX-X)
 *
 * Strict Update Process (SFM Tracker and Allocator)
 * 1) Define new SFM codes in the correct page-based file listed above.
 * 2) Ensure `sfmId`, `description`, `pageName`, `cardName`, `outputValue`, `correlatedTo`, `valueType`
 *    are completed and consistent with the code’s purpose.
 * 3) Export the field group from its page file and include it in the aggregated `systemFields` array
 *    via the directory barrel (`src/data/systemFields/index.ts`).
 * 4) Where calculated values are needed, wire resolution through `SFMResolver` (profile/assets/gospel)
 *    so CSV/Audit tools and debug tables compute values consistently.
 * 5) Run a quick check in the System Fields page to verify the new codes render and filter correctly.
 *
 * Wiring the Main App
 * - Main app UI should reference page-based SFM codes only (CAL/PRF/NAV/etc.).
 * - Free Calculator continues to use SFM-0XX-X series. Do not mix series across contexts.
 * - Any cross-page dependency must be explicitly documented in `correlatedTo`.
 *
 * Validation Guidelines
 * - SFM IDs must be unique across the entire `systemFields` export.
 * - Prefixes must match their page (e.g., `SFM-CAL-4`, `SFM-PRF-2`).
 * - Avoid computed values baked into `correlatedTo`; use resolvers for runtime calculations.
 *
 * Compatibility
 * - This file re-exports the authoritative directory barrel so legacy imports to
 *   `@/data/systemFields` continue to work without ambiguity.
 */

export * from './systemFields/index';
export { systemFields } from './systemFields/index';
