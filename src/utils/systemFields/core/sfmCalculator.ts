import { calculateSalaryValues } from '../calculations/salaryCalculations';
import { calculatePensionValues } from '../calculations/pensionCalculations';
import { calculateAPFValues } from '../calculations/apfCalculations';
import { calculateISAValues } from '../calculations/isaCalculations';
import { calculateProgressValues } from '../calculations/progressCalculations';
import { calculateUnlimitedAPFSponsorships } from '@/utils/pension/apfSponsorshipCalculations';
import { SFMCalculationContext } from '../types';

export class SFMCalculator {
  private context: SFMCalculationContext;

  constructor(profile: {
    date_of_birth?: string;
    pension_provider?: string;
    pension_contribution_employee?: number;
    pension_contribution_employer?: number;
    other_income?: number;
    annual_salary?: number;
  }, assets: {
    name?: string;
    category?: {
      name?: string;
    };
    value?: number;
  }[]) {
    // Calculate current age and existing pension value for context
    const currentAge = profile?.date_of_birth ? 
      Math.floor((new Date().getTime() - new Date(profile.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
      40; // fallback age

    // ENHANCED: Better pension asset detection and integration
    const existingPensionValue = this.calculateExistingPensionValue(assets, profile);

    console.log(`🔍 SFM CALCULATOR: Enhanced asset filtering for existing pension value`);
    console.log(`Total assets passed: ${assets?.length || 0}`);
    console.log(`Profile pension provider: ${profile?.pension_provider || 'None'}`);
    console.log(`Profile employee contribution: ${profile?.pension_contribution_employee || 0}%`);
    console.log(`Profile employer contribution: ${profile?.pension_contribution_employer || 0}%`);
    
    if (assets && assets.length > 0) {
      assets.forEach(asset => {
        console.log(`  Asset: "${asset.name}" | Category: "${asset.category?.name}" | Value: £${asset.value?.toLocaleString()}`);
        const isPension = this.isPensionAsset(asset, profile);
        console.log(`    → Identified as pension: ${isPension}`);
      });
    }
    console.log(`🎯 Total existing pension value calculated: £${existingPensionValue.toLocaleString()}`);

    this.context = {
      profile: profile || {},
      assets: assets || [],
      currentAge,
      existingPensionValue
    };
  }

  // ENHANCED: Better pension asset identification
  private isPensionAsset(asset: { 
    name?: string; 
    category?: {
      name?: string;
    };
    value?: number;
  }, profile: {
    pension_provider?: string;
  }): boolean {
    const assetName = asset.name?.toLowerCase() || '';
    const categoryName = asset.category?.name?.toLowerCase() || '';
    const profileProvider = profile?.pension_provider?.toLowerCase() || '';
    
    // Check category first
    if (categoryName.includes('pension') || categoryName.includes('retirement')) {
      return true;
    }
    
    // Check asset name for pension keywords
    const pensionKeywords = ['pension', 'retirement', 'workplace pension', 'personal pension', 'sipp', 'ssas'];
    if (pensionKeywords.some(keyword => assetName.includes(keyword))) {
      return true;
    }
    
    // Check if asset name matches profile pension provider
    if (profileProvider && assetName.includes(profileProvider)) {
      return true;
    }
    
    return false;
  }

  // ENHANCED: Calculate existing pension value with profile integration
  private calculateExistingPensionValue(assets: {
    name?: string;
    category?: {
      name?: string;
    };
    value?: number;
  }[], profile: {
    pension_provider?: string;
    pension_contribution_employee?: number;
    pension_contribution_employer?: number;
  }): number {
    if (!assets || assets.length === 0) {
      return 0;
    }
    
    // Filter pension assets using enhanced detection
    const pensionAssets = assets.filter(asset => this.isPensionAsset(asset, profile));
    
    // Sum up all pension asset values
    const totalPensionValue = pensionAssets.reduce((sum, asset) => sum + (asset.value || 0), 0);
    
    console.log(`🔧 PENSION ASSET INTEGRATION:`);
    console.log(`  Found ${pensionAssets.length} pension assets`);
    console.log(`  Total pension value: £${totalPensionValue.toLocaleString()}`);
    
    return totalPensionValue;
  }

  calculateSFMValue(sfmId: string, resolver: (id: string) => number): number {
    // Handle SFM-025 sub-codes first
    if (sfmId.startsWith('SFM-025-')) {
      const subCode = sfmId.split('-')[2];
      switch (subCode) {
        case '1': // Current Age
          return this.context.currentAge;
        case '2': // Time to Retirement  
          return Math.max(0, 67 - this.context.currentAge);
        case '3': { // Days Until Pension
          const yearsLeft = Math.max(0, 67 - this.context.currentAge);
          return Math.round(yearsLeft * 365.25);
        }
        default:
          console.warn(`Unknown SFM-025 sub-code: ${sfmId}`);
          return 0;
      }
    }

    // Remove SFM- prefix for easier matching
    const id = sfmId.replace('SFM-', '');
    
    // Salary calculations (SFM-001 to SFM-010, SFM-023, SFM-024, SFM-025, SFM-124)
    if ((id >= '001' && id <= '010') || id === '023' || id === '024' || id === '025' || id === '124') {
      return calculateSalaryValues(sfmId, this.context);
    }
    
    // SFM-123 uses SFM-008 to receive the monthly top up figure
    if (id === '123') {
      return resolver('SFM-008');
    }
    
    // SFM-101-1 is the logic for card color changes based on funding progress (moved from SFM-119)
    if (id === '101-1') {
      const monthlyNetPay = resolver('SFM-014');
      const monthlyFundingCost = resolver('SFM-115');
      return (monthlyNetPay > 0 && monthlyFundingCost <= (monthlyNetPay * 0.04)) ? 1 : 0;
    }
    
    // SFM-119 - Estimated Monthly Net Pay assuming 1257L
    if (id === '119') {
      const annualSalary = resolver('SFM-002'); // Use Free Calculator salary input
      const monthlyGross = annualSalary / 12;
      
      // Calculate tax and NI using fixed 1257L tax code
      const taxFreeAllowance = 12570; // 1257L tax code
      const monthlyTaxFreeAllowance = taxFreeAllowance / 12;
      
      // Income tax calculation (basic rate 20%)
      const taxableIncome = Math.max(0, monthlyGross - monthlyTaxFreeAllowance);
      const incomeTax = taxableIncome * 0.20;
      
      // National Insurance calculation (12% on earnings above £1,048/month)
      const niThreshold = 1048; // Monthly NI threshold for 2025-26
      const nationalInsurance = Math.max(0, (monthlyGross - niThreshold) * 0.12);
      
      // Net pay calculation
      const netPay = monthlyGross - incomeTax - nationalInsurance;
      
      return Math.max(0, netPay);
    }
    
    // SFM-030 - Other Income (manual user input)
    if (id === '030') {
      return this.context.profile?.other_income || 0;
    }
    
    // Pension calculations - EXCLUDING SFM-007 and SFM-033 to avoid conflicts
    if ((id >= '003' && id <= '006') || (id >= '008' && id <= '015') || (id >= '020' && id <= '027') || 
        id === '037' || id === '042' || id === '115') {
      return calculatePensionValues(sfmId, this.context, resolver);
    }
    
    // SFM-007 - Capital Shortfall (handled separately to avoid circular dependency with SFM-145)
    if (id === '007') {
      return calculatePensionValues(sfmId, this.context, resolver);
    }
    
    // SFM-145 - Capital Shortfall for APF (FIXED: Calculate directly, no circular dependency)
    if (id === '145') {
      // Calculate capital shortfall directly without calling SFM-007 to avoid circular dependency
      const targetIncome = this.context.profile?.annual_salary ? this.context.profile.annual_salary * 0.67 : 0;
      const requiredCapital = targetIncome / 0.04; // 4% drawdown rule
      const capitalShortfall = Math.max(0, requiredCapital - this.context.existingPensionValue);
      
      console.log(`🔧 SFM-145: Direct capital shortfall calculation: £${capitalShortfall.toLocaleString()}`);
      return capitalShortfall;
    }
    
    // APF calculations (SFM-144, SFM-146) and BUOM table codes
    if (id === '144' || id === '146' ||
        id.startsWith('147-') || id.startsWith('148-') || id.startsWith('150-') ||
        id.startsWith('151-') || id.startsWith('152-') || id.startsWith('153-') || id.startsWith('154-') ||
        id.startsWith('166-') || id.startsWith('169-') || id.startsWith('172-')) {
      return calculateAPFValues(sfmId, this.context, resolver);
    }
    
    // ISA calculations (SFM-030A, SFM-031, SFM-032, SFM-033) - FIXED: SFM-033 only here
    if (id === '030A' || id === '031' || id === '032' || id === '033') {
      // For now, return 0 for ISA calculations as they're not set up in GOSPEL data
      if (id === '030A' || id === '031' || id === '032') {
        console.log(`🔧 ISA SFM ${sfmId}: Returning 0 (not configured in current GOSPEL data)`);
        return 0;
      }
      return calculateISAValues(sfmId, this.context, resolver);
    }
    
    // Progress calculations (SFM-029)
    if (id === '029') {
      return calculateProgressValues(sfmId, this.context, resolver);
    }
    
    // APF Dashboard specific codes (SFM-087 to SFM-090) - DISABLED until APF is live
    if (id >= '087' && id <= '090') {
      console.warn(`🚨 APF Dashboard code ${sfmId} requested but APF is not live - returning 0`);
      return 0;
    }
    
    // APF Target Income calculation (SFM-028-1) - Calculate from income shortfall
    if (sfmId === 'SFM-028-1') {
      const targetIncome = resolver('SFM-026'); // Target Income at Retirement
      const existingPlanIncome = resolver('SFM-027'); // Existing Plan Future Income
      
      const validTargetIncome = isNaN(targetIncome) ? 0 : targetIncome;
      const validExistingPlanIncome = isNaN(existingPlanIncome) ? 0 : existingPlanIncome;
      
      const apfTargetIncome = Math.max(0, validTargetIncome - validExistingPlanIncome);
      
      console.log(`🔧 SFM-028-1: APF Target Income = £${validTargetIncome.toLocaleString()} - £${validExistingPlanIncome.toLocaleString()} = £${apfTargetIncome.toLocaleString()}`);
      return apfTargetIncome;
    }
    
    // APF Target Capital Shortfall (SFM-035) - FIXED: Calculate directly, no circular dependency
    if (id === '035') {
      // Calculate capital shortfall directly without calling SFM-007 to avoid circular dependency
      const targetIncome = this.context.profile?.annual_salary ? this.context.profile.annual_salary * 0.67 : 0;
      const requiredCapital = targetIncome / 0.04; // 4% drawdown rule
      const capitalShortfall = Math.max(0, requiredCapital - this.context.existingPensionValue);
      
      console.log(`🔧 SFM-035: Direct APF Target Capital Shortfall calculation: £${capitalShortfall.toLocaleString()}`);
      return capitalShortfall;
    }

    console.warn(`Unknown SFM ID: ${sfmId}`);
    return 0;
  }

  calculateYearSpecificSFMValue(baseCode: string, year: number, resolver: (id: string) => number): number {
    const baseId = baseCode.replace('SFM-', '');
    
    // APF NPG Amount (SFM-151-X) - UPDATED FROM 051 TO 151
    if (baseId === '151') {
      return calculateAPFValues(`SFM-151-${year}`, this.context, resolver);
    }
    
    // APF NRSR Fee (SFM-152-X) - UPDATED FROM 052 TO 152
    if (baseId === '152') {
      return calculateAPFValues(`SFM-152-${year}`, this.context, resolver);
    }
    
    // APF Total INBL Principal (SFM-153-X) - UPDATED FROM 053 TO 153
    if (baseId === '153') {
      return calculateAPFValues(`SFM-153-${year}`, this.context, resolver);
    }
    
    // APF ISA Contributions (SFM-154-X) - UPDATED FROM 054 TO 154
    if (baseId === '154') {
      return calculateAPFValues(`SFM-154-${year}`, this.context, resolver);
    }
    
    // APF Initial Funding (SFM-147-X) - UPDATED FROM 047 TO 147
    if (baseId === '147') {
      return this.calculateAPFInitialFundingForYear(year, resolver);
    }
    
    // APF Maturity (SFM-148-X) - UPDATED FROM 048 TO 148
    if (baseId === '148') {
      return this.calculateAPFMaturityForYear(year, resolver);
    }
    
    // Total INBL Principal (SFM-149-X) - UPDATED FROM 049 TO 149
    if (baseId === '149') {
      return this.calculateINBLPrincipalForYear(year, resolver);
    }
    
    // NPG Amount (SFM-155-X) - UPDATED FROM 055 TO 155
    if (baseId === '155') {
      return this.calculateNPGAmountForYear(year, resolver);
    }
    
    // NRSR Fee (SFM-156-X) - UPDATED FROM 056 TO 156
    if (baseId === '156') {
      return this.calculateNRSRFeeForYear(year, resolver);
    }
    
    // BUOM INBL Annual (SFM-166-X) - UPDATED FROM 066 TO 166
    if (baseId === '166') {
      return this.calculateBUOMINBLForYear(year, resolver);
    }
    
    // BUOM APF Funding (SFM-169-X) - UPDATED FROM 069 TO 169
    if (baseId === '169') {
      return this.calculateBUOMAPFForYear(year, resolver);
    }
    
    // BUOM ISA Monthly (SFM-172-X) - UPDATED FROM 072 TO 172
    if (baseId === '172') {
      return this.calculateBUOMISAForYear(year, resolver);
    }
    
    console.warn(`No year-specific calculation for base code: ${baseCode}, year: ${year}`);
    return 0;
  }

  private calculateAPFInitialFundingForYear(year: number, resolver: (id: string) => number): number {
    // FIXED: Use direct calculation instead of calling SFM-145 to avoid circular dependency
    const targetIncome = this.context.profile?.annual_salary ? this.context.profile.annual_salary * 0.67 : 0;
    const requiredCapital = targetIncome / 0.04;
    const totalAPFFunding = Math.max(0, requiredCapital - this.context.existingPensionValue);
    
    const estimatedYears = 3; // Typical APF funding spread over 3 years
    return totalAPFFunding / estimatedYears;
  }

  private calculateAPFMaturityForYear(year: number, resolver: (id: string) => number): number {
    // Get actual APF sponsorship amount for this year from profile
    const { profile } = this.context;
    const annualSalary = profile?.annual_salary || 0;
    const currentAge = this.context.currentAge;
    const existingPensionValue = this.context.existingPensionValue;
    
    if (!annualSalary || !currentAge) {
      // Fallback calculation if no profile data
      const initialFunding = this.calculateAPFInitialFundingForYear(year, resolver);
      return initialFunding * 1.3; // Rough maturity multiplier
    }
    
    // Calculate actual APF sponsorships to get precise maturity values - FIXED: Use parameter system
    const params = {
      pensionIncomeTarget: 0.67, // Target income as percentage of salary
      drawdownRate: 0.04 // Annual drawdown rate
    };
    const targetIncomeToday = annualSalary * params.pensionIncomeTarget;
    const capitalShortfallToday = Math.max(0, (targetIncomeToday / params.drawdownRate) - existingPensionValue);
    
    try {
      const sponsorships = calculateUnlimitedAPFSponsorships(currentAge, capitalShortfallToday, annualSalary, true, profile);
      
      if (sponsorships && sponsorships[year - 1]) {
        const maturityValue = sponsorships[year - 1].maturityValue || 0;
        console.log(`SFM-148-${year}: Using actual APF maturity value £${maturityValue.toLocaleString()}`);
        return maturityValue;
      }
    } catch (error) {
      console.warn(`Failed to get APF sponsorship data for year ${year}:`, error);
    }
    
    // Fallback if sponsorship calculation fails
    const initialFunding = this.calculateAPFInitialFundingForYear(year, resolver);
    return initialFunding * 1.3; // Rough maturity multiplier
  }

  private calculateINBLPrincipalForYear(year: number, resolver: (id: string) => number): number {
    // INBL principal relates to the APF initial funding
    const apfFunding = this.calculateAPFInitialFundingForYear(year, resolver);
    return apfFunding * 0.8; // INBL is typically 80% of APF funding
  }

  private calculateBUOMINBLForYear(year: number, resolver: (id: string) => number): number {
    return this.calculateINBLPrincipalForYear(year, resolver);
  }

  private calculateBUOMAPFForYear(year: number, resolver: (id: string) => number): number {
    return this.calculateAPFInitialFundingForYear(year, resolver);
  }

  private calculateBUOMISAForYear(year: number, resolver: (id: string) => number): number {
    // Get APF maturity value for this specific year using SFM-148-X - UPDATED FROM 048 TO 148
    const apfMaturityValue = this.calculateAPFMaturityForYear(year, resolver);
    
    // Calculate discrete ISA monthly using pro-rata: (APF Maturity ÷ 100,000) × £98.00
    const isaRate = 98.00; // £98.00 per £100k APF maturity
    const isaMonthly = (apfMaturityValue / 100000) * isaRate;
    
    console.log(`SFM-172-${year}: APF Maturity £${apfMaturityValue.toLocaleString()} → ISA Monthly £${isaMonthly.toLocaleString()}`);
    return isaMonthly;
  }

  private calculateNPGAmountForYear(year: number, resolver: (id: string) => number): number {
    // NPG amount is typically a portion of salary exchange
    const totalNPG = resolver('SFM-032') * 12; // Convert monthly to annual if needed
    const yearlyPortions = 3; // Typical spread over years
    return totalNPG / yearlyPortions;
  }

  private calculateAPFDashboardValue(sfmId: string, context: SFMCalculationContext, resolver: (id: string) => number): number {
    const id = sfmId.replace('SFM-', '');
    
    switch (id) {
      case '087': // APF Assets
        return 157137; // GOSPEL value for APF Assets
      case '088': // INBL Loan
        return 119908; // GOSPEL value for INBL Loan
      case '089': // ISA Savings
        return 30000; // GOSPEL value for ISA Savings
      case '090': // General Account
        return 49218; // GOSPEL value for General Account
      default:
        console.warn(`Unknown APF Dashboard SFM code: ${sfmId}`);
        return 0;
    }
  }

  private calculateNRSRFeeForYear(year: number, resolver: (id: string) => number): number {
    // NRSR fee is typically calculated based on APF funding
    const apfFunding = this.calculateAPFInitialFundingForYear(year, resolver);
    const nrsrFeeRate = 0.20; // 20% fee rate assumption
    return apfFunding * nrsrFeeRate;
  }
}
