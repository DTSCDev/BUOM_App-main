
import { calculateAge } from "@/utils/pensionCalculations";
import { getPensionParameters } from "@/utils/pensionParameters";
import { calculateActualSponsorshipsFromShortfall } from '@/utils/pension/apfSponsorshipCalculations';
import { calculateAPFValue } from '@/utils/pension/apfSponsorshipCalculations';

export interface ChartDataPoint {
  age: number;
  capitalShortfall: number;
  apfAssetValue: number;
  isaValue: number;
  buomTotalValue: number;
  targetValue: number;
  existingPlanValue: number;
  inblBalance?: number;
}

export function generateChartData(
  profile: any,
  assets: any[],
  resolveSFM: (id: string) => number
): { chartData: ChartDataPoint[], buomResult: null } {
  if (!profile?.date_of_birth || !profile?.annual_salary) {
    console.warn('Missing profile data for chart generation');
    return { chartData: [], buomResult: null };
  }

  const params = getPensionParameters();
  const dateOfBirth = new Date(profile.date_of_birth);
  const currentAge = calculateAge(dateOfBirth).years;
  const annualSalary = profile.annual_salary;
  
  const existingPensionValue = assets.filter(asset => 
    asset.category?.name?.toLowerCase().includes('pension') ||
    asset.name.toLowerCase().includes('pension')
  ).reduce((sum, asset) => sum + asset.value, 0);
  
  console.log('=== CHART DATA: USING ADVISORY ASSESSMENTS (SFM CODES) ===');
  console.log(`User current age: ${currentAge}`);
  console.log(`Annual salary: £${annualSalary.toLocaleString()}`);
  console.log(`Existing pension value: £${existingPensionValue.toLocaleString()}`);
  
  // Input validation
  if (isNaN(currentAge) || isNaN(annualSalary) || isNaN(existingPensionValue)) {
    console.error('Invalid input data for chart generation');
    return { chartData: [], buomResult: null };
  }
  
  // Use SFM-035 for capital shortfall calculation
  const sfm035CapitalShortfall = resolveSFM('SFM-035'); // APF Target Capital Shortfall 
  const userActualShortfallNeed = sfm035CapitalShortfall;
  
  console.log('🚨🚨🚨 CHART DATA GENERATOR: USING SFM-035 🚨🚨🚨');
  console.log(`SFM-035 APF Target Capital Shortfall: £${sfm035CapitalShortfall.toLocaleString()}`);
  console.log(`User's actual shortfall need: £${userActualShortfallNeed.toLocaleString()}`);
  
  // FIXED: Use actual shortfall-based sponsorship calculation - SAME AS APF REGISTRATION
  const apfSponsorships = userActualShortfallNeed > 0 
    ? calculateActualSponsorshipsFromShortfall(
        currentAge, 
        annualSalary,
        userActualShortfallNeed,
        true,
        profile
      )
    : [];
  
  console.log(`APF sponsorships from actual shortfall: ${apfSponsorships.length} (should be 2, not 9+1)`);
  console.log(`Sponsorship details:`, apfSponsorships.map(s => ({
    year: s.year,
    amount: s.sponsorshipAmount,
    maturity: s.maturityValue,
    isaMonthly: s.isaMonthlyRequired
  })));
  
  // Calculate chart configuration
  const retirementAge = params.retirementAge;
  const chartConfig = {
    startAge: Math.max(currentAge - 1, 40),
    finalAge: Math.min(retirementAge + 1, retirementAge + 2),
    totalYears: 0
  };
  chartConfig.totalYears = chartConfig.finalAge - chartConfig.startAge;
  
  // Use SFM-035 as the STARTING POINT for target capital 
  const targetCapitalRequired = userActualShortfallNeed; // This IS the target capital from SFM-035
  
  // FIXED: No ISA timeline needed - calculate ISA values directly from sponsorships
  console.log('=== CHART GENERATION: NO CIRCULAR CALLS ===');
  console.log(`Chart range: Age ${chartConfig.startAge} to ${chartConfig.finalAge}`);
  
  const chartData: ChartDataPoint[] = [];
  
  // Generate data points using ADVISORY ASSESSMENTS - SAME LOGIC AS APF REGISTRATION
  for (let yearOffset = 0; yearOffset <= chartConfig.totalYears; yearOffset++) {
    const age = chartConfig.startAge + yearOffset;
    const yearsFromCurrent = age - currentAge;
    
    // Calculate grown existing pension value
    const yearsToThisAge = Math.max(0, yearsFromCurrent);
    const grownExistingValue = existingPensionValue * Math.pow(1 + (params.growthRateAccumulation - params.providerCharges), yearsToThisAge);
    
    // Base capital shortfall starts from SFM-035 value and adjusts over time
    // SFM-035 is the shortfall at retirement that needs addressing
    let capitalShortfall = userActualShortfallNeed;
    
    // Apply State Pension benefit reduction ONLY from age 67+
    if (age >= 67) {
      const statePensionCapitalValue = (params.statePensionWeekly * 52) / params.drawdownRate;
      capitalShortfall = Math.max(0, capitalShortfall - statePensionCapitalValue);
    }
    
    // Calculate APF asset values for this age
    let apfAssetValue = 0;
    if (age >= currentAge) {
      apfSponsorships.forEach(sponsorship => {
        if (age >= sponsorship.age) {
          const monthsSinceSponsorship = Math.max(1, (age - sponsorship.age) * 12 + 1);
          const sponsorshipValue = calculateAPFValue(
            sponsorship.sponsorshipAmount,
            monthsSinceSponsorship, 
            age
          );
          
          if (!isNaN(sponsorshipValue)) {
            apfAssetValue += sponsorshipValue;
          }
        }
      });
    }
    
    // Calculate ISA values directly from sponsorships - NO CIRCULAR CALLS
    let isaValue = 0;
    let inblBalance = 0;
    
    if (age >= currentAge) {
      apfSponsorships.forEach(sponsorship => {
        if (age >= sponsorship.age) {
          // Simple ISA calculation: monthly × months elapsed × growth
          const monthsElapsed = Math.max(0, (age - sponsorship.age) * 12);
          const contributionMonths = Math.min(monthsElapsed, 240); // 20 years max
          const isaMonthly = sponsorship.isaMonthlyRequired || 0;
          
          // Calculate ISA balance with growth
          for (let m = 0; m < contributionMonths; m++) {
            const monthsGrowth = contributionMonths - m;
            const monthlyGrowthRate = (params.growthRateAccumulation - params.providerCharges) / 12;
            const contributionValue = isaMonthly * Math.pow(1 + monthlyGrowthRate, monthsGrowth);
            isaValue += contributionValue;
          }
          
          // INBL debt until redemption (age 62, 63, etc.)
          const redemptionAge = 62 + (sponsorship.year - 1);
          if (age < redemptionAge) {
            inblBalance += sponsorship.sponsorshipAmount;
          }
        }
      });
    }
    
    // Apply APF maturity reductions when sponsorships mature (21+ years)
    apfSponsorships.forEach(sponsorship => {
      const yearsFromSponsorship = age - sponsorship.age;
      if (yearsFromSponsorship >= 21) {
        capitalShortfall = Math.max(0, capitalShortfall - sponsorship.maturityValue);
      }
    });
    
    // Ensure values are clean
    capitalShortfall = Math.max(0, capitalShortfall);
    apfAssetValue = isNaN(apfAssetValue) ? 0 : Math.max(0, apfAssetValue);
    isaValue = isNaN(isaValue) ? 0 : Math.max(0, isaValue);
    const buomTotalValue = apfAssetValue + isaValue;
    
    chartData.push({
      age,
      capitalShortfall,
      apfAssetValue,
      isaValue,
      buomTotalValue,
      targetValue: targetCapitalRequired,
      existingPlanValue: grownExistingValue,
      inblBalance: -inblBalance // Negative for display
    });
    
    // Log key data points for verification
    if (age === currentAge || age === retirementAge) {
      console.log(`=== AGE ${age} (${age === currentAge ? 'CURRENT' : 'RETIREMENT'}) ===`);
      console.log(`Capital Shortfall: £${capitalShortfall.toLocaleString()}`);
      console.log(`APF Asset Value: £${apfAssetValue.toLocaleString()}`);
      console.log(`ISA Value: £${isaValue.toLocaleString()}`);
      console.log(`INBL Balance: £${Math.abs(inblBalance).toLocaleString()}`);
    }
  }

  console.log(`Generated ${chartData.length} chart data points using ADVISORY ASSESSMENTS (SFM-035)`);
  console.log(`Chart range: Age ${chartConfig.startAge} to ${chartConfig.finalAge}`);
  console.log(`Using ${apfSponsorships.length} actual sponsorships from SFM-035: £${userActualShortfallNeed.toLocaleString()}`);
  console.log(`Current age capital shortfall: £${chartData.find(d => d.age === currentAge)?.capitalShortfall.toLocaleString()}`);

  return { chartData, buomResult: null };
}
