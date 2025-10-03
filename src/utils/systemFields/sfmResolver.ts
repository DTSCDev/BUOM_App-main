
import { SFMCalculator } from './core/sfmCalculator';
import { validateSFMCode, extractBaseSFMCode, extractYearFromSFM } from './sfmCodeGenerator';

export interface SFMValueMap {
  [sfmId: string]: number;
}

export class SFMResolver {
  private calculator: SFMCalculator;
  private valueCache: SFMValueMap = {};
  private gospelOverrides: SFMValueMap = {};

  constructor(profile: Record<string, unknown>, assets: Record<string, unknown>[], gospelOverrides?: SFMValueMap) {
    try {
      this.calculator = new SFMCalculator(profile, assets);
      if (gospelOverrides) {
        this.gospelOverrides = gospelOverrides;
      }
    } catch (error) {
      console.error('Error creating SFM calculator:', error);
      this.calculator = new SFMCalculator(null, []);
    }
  }

  resolveSFM(sfmId: string, forceRefresh = false): number {
    try {
      // 1. Always check for Gospel override first
      if (this.gospelOverrides && this.gospelOverrides[sfmId] !== undefined) {
        console.log(`🟩 SFM RESOLVER: Using Gospel value for ${sfmId}: ${this.gospelOverrides[sfmId]}`);
        return this.gospelOverrides[sfmId];
      }
      // 2. If forceRefresh, skip cache
      if (!forceRefresh && this.valueCache[sfmId] !== undefined) {
        console.log(`✅ SFM RESOLVER: Using cached value for ${sfmId}: ${this.valueCache[sfmId]}`);
        return this.valueCache[sfmId];
      }

      // Validate SFM code format
      if (!validateSFMCode(sfmId)) {
        console.warn(`Invalid SFM code format: ${sfmId}`);
        return 0;
      }

      let value: number;
      // Year-specific and multi-part SFM code logic
      if (sfmId.includes('-') && sfmId.split('-').length === 3) {
        const parts = sfmId.split('-');
        const lastPart = parts[2];
        const isYearSpecific = (
          (parseInt(lastPart) > 10 && !isNaN(parseInt(lastPart))) ||
          (sfmId.startsWith('SFM-051-') || sfmId.startsWith('SFM-052-') ||
           sfmId.startsWith('SFM-053-') || sfmId.startsWith('SFM-054-') ||
           sfmId.startsWith('SFM-066-') || sfmId.startsWith('SFM-069-') ||
           sfmId.startsWith('SFM-072-') || sfmId.startsWith('SFM-047-'))
        ) && !sfmId.startsWith('SFM-030');
        if (isYearSpecific) {
          const baseCode = extractBaseSFMCode(sfmId);
          const year = extractYearFromSFM(sfmId);
          value = this.calculator.calculateYearSpecificSFMValue(baseCode, year, (id: string) => this.resolveSFM(id));
          if (value === 0) {
            value = this.calculator.calculateSFMValue(baseCode, (id: string) => this.resolveSFM(id));
          }
        } else {
          value = this.calculator.calculateSFMValue(sfmId, (id: string) => this.resolveSFM(id));
        }
      } else if (sfmId.endsWith('A')) {
        // Handle current year format (SFM-XXXA = current year/year 1)
        const baseCode = sfmId.slice(0, -1);
        value = this.calculator.calculateYearSpecificSFMValue(baseCode, 1, (id: string) => this.resolveSFM(id));
        if (value === 0) {
          value = this.calculator.calculateSFMValue(baseCode, (id: string) => this.resolveSFM(id));
        }
      } else {
        value = this.calculator.calculateSFMValue(sfmId, (id: string) => this.resolveSFM(id));
      }

      // 3. Only cache valid results (not null/undefined, and not 0 unless 0 is a valid result)
      if (value !== null && value !== undefined && (!isNaN(value)) && (value !== 0 || this.isZeroValid(sfmId))) {
        this.valueCache[sfmId] = value;
        console.log(`✅ SFM RESOLVER: Final cached value for ${sfmId}: ${value}`);
      } else {
        // Do not cache invalid results
        console.warn(`⚠️ SFM RESOLVER: Not caching invalid value for ${sfmId}: ${value}`);
      }
      return value;
    } catch (error) {
      console.error(`🚨 SFM RESOLVER ERROR for ${sfmId}:`, error);
      return 0;
    }
  }

  // Helper to determine if 0 is a valid value for a given SFM code
  private isZeroValid(sfmId: string): boolean {
    // For now, assume 0 is valid for all codes except those explicitly listed
    const zeroInvalid = [/* add SFM codes where 0 is never valid */];
    return !zeroInvalid.includes(sfmId);
  }

  getAllValues(): SFMValueMap {
    return { ...this.valueCache };
  }

  clearCache(): void {
    this.valueCache = {};
  }

  // Optionally, allow updating Gospel overrides at runtime
  setGospelOverrides(overrides: SFMValueMap) {
    this.gospelOverrides = overrides;
  }
}
