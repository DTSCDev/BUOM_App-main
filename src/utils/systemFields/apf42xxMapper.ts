export type APFMetric = 'APF_INITIAL_FUNDING' | 'APF_MATURITY' | 'TOTAL_INBL_PRINCIPAL' | 'SHORTFALL_BALANCE';

// Map metrics to APF-42XX base numbers
const METRIC_BASE_MAP: Record<APFMetric, number> = {
  APF_INITIAL_FUNDING: 4200, // 4201-4210
  APF_MATURITY: 4210,        // 4211-4220
  TOTAL_INBL_PRINCIPAL: 4240, // 4241-4250
  SHORTFALL_BALANCE: 4250     // 4251-4260
};

/**
 * Get page-based APF-42XX SFM code for a metric and year.
 * Suffix: 'M' for Maximum, 'P' for Partial.
 */
export function getAPF42XXCode(metric: APFMetric, year: number, isPartial: boolean): string {
  const base = METRIC_BASE_MAP[metric];
  const codeNumber = base + year; // e.g. 4200 + 1 => 4201
  const suffix = isPartial ? 'P' : 'M';
  return `SFM-APF-${codeNumber}-${suffix}`;
}