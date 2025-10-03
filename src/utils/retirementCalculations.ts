interface RetirementParams {
  currentAge: number;
  retirementAge: number;
  currentSalary: number;
  currentPensionValue: number;
  monthlyContribution: number;
  employerContribution: number;
  annualGrowthRate: number;
  inflationRate: number;
  targetRetirementIncome: number;
}

interface RetirementDataPoint {
  age: number;
  pensionValue: number;
  targetValue: number;
  shortfall: number;
  contributions: number;
}

export const calculateRetirementProjection = (params: RetirementParams): RetirementDataPoint[] => {
  const {
    currentAge,
    retirementAge,
    currentSalary,
    currentPensionValue,
    monthlyContribution,
    employerContribution,
    annualGrowthRate,
    inflationRate,
    targetRetirementIncome
  } = params;

  const data: RetirementDataPoint[] = [];
  const yearsToRetirement = retirementAge - currentAge;
  
  let pensionValue = currentPensionValue;
  let totalContributions = 0;
  let adjustedSalary = currentSalary;

  for (let year = 0; year <= yearsToRetirement + 5; year++) {
    const currentAgeAtYear = currentAge + year;
    
    if (currentAgeAtYear <= retirementAge) {
      // Before retirement - accumulating
      const annualPersonalContribution = monthlyContribution * 12;
      const annualEmployerContribution = employerContribution * 12;
      const totalAnnualContribution = annualPersonalContribution + annualEmployerContribution;
      
      // Apply growth to existing pension value
      pensionValue = pensionValue * (1 + annualGrowthRate);
      
      // Add contributions
      pensionValue += totalAnnualContribution;
      totalContributions += totalAnnualContribution;
      
      // Adjust salary for inflation
      adjustedSalary = adjustedSalary * (1 + inflationRate);
    } else {
      // After retirement - drawing down at 3.5% per year
      const annualDrawdown = pensionValue * 0.035;
      pensionValue -= annualDrawdown;
      
      // Continue growth on remaining balance
      pensionValue = pensionValue * (1 + annualGrowthRate);
    }
    
    // Calculate target value needed at retirement
    const yearsFromRetirement = retirementAge - currentAgeAtYear;
    const adjustedTargetIncome = targetRetirementIncome * Math.pow(1 + inflationRate, Math.max(0, yearsFromRetirement));
    const targetValue = adjustedTargetIncome / 0.035; // 3.5% safe withdrawal rate
    
    // Calculate shortfall
    const shortfall = Math.max(0, targetValue - pensionValue);
    
    data.push({
      age: currentAgeAtYear,
      pensionValue: Math.round(pensionValue),
      targetValue: Math.round(targetValue),
      shortfall: Math.round(shortfall),
      contributions: Math.round(totalContributions)
    });
  }
  
  return data;
};

export const calculateMonthlyContributionNeeded = (params: RetirementParams): number => {
  const {
    currentAge,
    retirementAge,
    currentPensionValue,
    employerContribution,
    annualGrowthRate,
    targetRetirementIncome
  } = params;

  const yearsToRetirement = retirementAge - currentAge;
  const targetPensionValue = targetRetirementIncome / 0.035; // 3.5% safe withdrawal rate
  
  // Future value of current pension at retirement
  const futureValueOfCurrentPension = currentPensionValue * Math.pow(1 + annualGrowthRate, yearsToRetirement);
  
  // Shortfall to make up
  const shortfall = Math.max(0, targetPensionValue - futureValueOfCurrentPension);
  
  // Monthly employer contribution
  const monthlyEmployerContribution = employerContribution;
  
  // Calculate required monthly personal contribution using PMT formula
  const monthlyRate = annualGrowthRate / 12;
  const totalMonths = yearsToRetirement * 12;
  
  if (shortfall === 0) return 0;
  
  // Future value of employer contributions
  const futureValueOfEmployerContributions = monthlyEmployerContribution * 
    (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
  
  // Remaining shortfall after employer contributions
  const remainingShortfall = shortfall - futureValueOfEmployerContributions;
  
  if (remainingShortfall <= 0) return 0;
  
  // Required monthly personal contribution
  const requiredMonthlyContribution = remainingShortfall * monthlyRate / 
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
  
  return Math.round(requiredMonthlyContribution);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const calculateRetirementSummary = (data: RetirementDataPoint[], retirementAge: number) => {
  const retirementData = data.find(d => d.age === retirementAge);
  const finalData = data[data.length - 1];
  
  return {
    pensionValueAtRetirement: retirementData?.pensionValue || 0,
    targetValueAtRetirement: retirementData?.targetValue || 0,
    shortfallAtRetirement: retirementData?.shortfall || 0,
    totalContributions: retirementData?.contributions || 0,
    finalPensionValue: finalData?.pensionValue || 0,
    projectedAnnualIncome: ((retirementData?.pensionValue || 0) * 0.035),
  };
};