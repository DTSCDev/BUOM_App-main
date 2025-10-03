
import { calculateUnifiedPensionMetrics } from "@/utils/pension/unifiedCalculationEngine";
import { APFSponsorshipBreakdown } from '@/utils/pension/buomTypes';

export class ComponentCalculators {
  static calculateAllComponents(
    yearsFromCurrent: number,
    targetIncomeToday: number,
    existingPensionValue: number,
    annualSalary: number,
    age: number,
    params: any
  ) {
    // Input validation to prevent NaN propagation
    const safeYearsFromCurrent = isNaN(yearsFromCurrent) ? 0 : Math.max(0, yearsFromCurrent);
    const safeTargetIncomeToday = isNaN(targetIncomeToday) ? 0 : targetIncomeToday;
    const safeExistingPensionValue = isNaN(existingPensionValue) ? 0 : existingPensionValue;
    const safeAnnualSalary = isNaN(annualSalary) ? 0 : annualSalary;
    
    console.log(`ComponentCalculators: Using unified calculation engine for age ${age} with standardized ${(params.salaryInflation * 100)}% inflation`);
    
    // Use the unified calculation engine for consistent results
    const currentAge = age - safeYearsFromCurrent;
    const unifiedResult = calculateUnifiedPensionMetrics(
      currentAge,
      safeAnnualSalary,
      safeExistingPensionValue,
      false
    );
    
    // Extract the components we need from the unified calculation
    const result = {
      targetCapitalRequired: unifiedResult.requiredCapital,
      grownExistingValue: unifiedResult.projectedExistingPlan,
      totalContributionValue: unifiedResult.totalFutureAEContributions,
      statePensionCapitalValue: unifiedResult.statePensionLumpSum,
      targetIncomeAtRetirement: unifiedResult.targetIncomeAtRetirement
    };
    
    // Final validation to ensure no NaN values
    Object.entries(result).forEach(([key, value]) => {
      if (isNaN(value)) {
        console.warn(`ComponentCalculators: ${key} resulted in NaN, setting to 0`);
        (result as any)[key] = 0;
      }
    });
    
    console.log(`ComponentCalculators for age ${age} (standardized inflation):`, {
      targetCapitalRequired: result.targetCapitalRequired,
      grownExistingValue: result.grownExistingValue,
      totalContributionValue: result.totalContributionValue
    });
    
    return result;
  }
  
  static calculateApfMaturityReduction(
    monthsElapsed: number,
    apfSponsorships: APFSponsorshipBreakdown[],
    isaTimeline: any
  ): number {
    // Input validation
    const safeMonthsElapsed = isNaN(monthsElapsed) ? 0 : Math.max(0, monthsElapsed);
    
    let totalReduction = 0;
    
    apfSponsorships.forEach(sponsorship => {
      const maturityMonths = (sponsorship.maturityAge - sponsorship.age) * 12;
      
      if (safeMonthsElapsed >= maturityMonths) {
        // This sponsorship has matured
        const maturityValue = sponsorship.maturityValue || 0;
        
        if (!isNaN(maturityValue)) {
          totalReduction += maturityValue;
        }
      }
    });
    
    // Ensure total reduction is never NaN
    const result = isNaN(totalReduction) ? 0 : totalReduction;
    
    if (result > 0) {
      console.log(`APF maturity reduction at ${safeMonthsElapsed} months: £${result.toLocaleString()}`);
    }
    
    return result;
  }
}
