
// Main ISA calculation engine - now using refactored modules
export type { ISATimelineEntry, ISAFullTimelineResult } from './isaTypes';
export { calculateFullISATimeline, getISAMonthlyForYear } from './isaTimelineCalculator';
export { calculateISASchedule, getISATotalForYear, getISAMonthlyForYear as getISAMonthlyForYearLegacy } from './isaLegacyCompat';
