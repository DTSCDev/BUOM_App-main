import { SystemField } from './types';
import { freeCalculatorFields } from './freeCalculatorFields';
import { apfPageFields, generateAPFYearCodes } from './apfPageFields';
import { profilePageFields } from './profilePageFields';
import { netAssetValueFields } from './netAssetValueFields';
import { calculatorsPageFields, paymentsPageFields, reportsPageFields, statementsPageFields, benefitsPageFields, generateAPF42XXSeries } from './pageBasedSFMFields';
import { buomHubFields } from './buomHubFields';
import { retirementCalculatorFields } from './RetirementCalculatorFields';

export type { SystemField } from './types';

// NEW PAGE-BASED SFM STRUCTURE
// This replaces the old mixed field structure with the new page-based organization
export const systemFields: SystemField[] = [
  ...freeCalculatorFields,        // SFM-0XX-X series (Free Calculator & Affordability)
  ...apfPageFields,              // SFM-APF-1XXX-X series (APF Pages & Sub Pages)
  ...generateAPFYearCodes(),     // SFM-APF-1XXX-X series (APF Year-specific codes)
  ...generateAPF42XXSeries(),    // SFM-APF-42XX series (Per-year APF metrics with M/P suffix)
  ...profilePageFields,          // SFM-PRF-2XXX-X series (Profile Page)
  ...netAssetValueFields,        // SFM-NAV-3XXX-X series (Net Asset Value)
  ...calculatorsPageFields,       // SFM-CAL-4XXX-X series (Calculators Page)
  ...retirementCalculatorFields, // SFM-CAL-4XXX-X series (Retirement Calculator - Main App)
  ...paymentsPageFields,         // SFM-PAY-5XXX-X series (Payments Page)
  ...reportsPageFields,          // SFM-REP-6XXX-X series (Reports Page)
  ...statementsPageFields,       // SFM-STA-7XXX-X series (Statements Page)
  ...benefitsPageFields,         // SFM-BEN-8XXX-X series (FREE Benefits Page)
  ...buomHubFields              // SFM-HUB-9XXX-X series (BUOM Hub)
];

// Export individual field collections for specific use cases
export {
  freeCalculatorFields,
  apfPageFields,
  generateAPFYearCodes,
  profilePageFields,
  netAssetValueFields,
  calculatorsPageFields,
  retirementCalculatorFields,
  paymentsPageFields,
  reportsPageFields,
  statementsPageFields,
  benefitsPageFields,
  buomHubFields
};

// Export page-based utilities
export * from './pageBasedSFMFields';

// Legacy exports removed to enforce page-based SFM codes only.
