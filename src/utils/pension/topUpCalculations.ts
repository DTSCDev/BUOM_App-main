
import { compoundingCalculator } from './compoundingUtils';

// *** EQUATION 3: Calculate escalating Top-Up contributions to meet shortfall ***
export const calculateTopUpContributions = (
  shortfallAmount: number,
  yearsUntilPension: number
): { monthlyTopUpYear1: number; totalTopUpContributions: number; totalTopUpValue: number } => {
  console.log('🔥 calculateTopUpContributions called with:', { shortfallAmount, yearsUntilPension });
  
  if (yearsUntilPension <= 0 || shortfallAmount <= 0) {
    console.log('🔥 Early return due to invalid inputs');
    return { monthlyTopUpYear1: 0, totalTopUpContributions: 0, totalTopUpValue: 0 };
  }
  
  const totalMonths = yearsUntilPension * 12;
  
  // Calculate the monthly payment in Year 1 that, when escalated annually at salary inflation,
  // will compound to meet the shortfall
  let monthlyPaymentYear1 = 0;
  let iterations = 0;
  const maxIterations = 100;
  const tolerance = 1;
  
  // Use binary search to find the correct Year 1 monthly payment
  let low = 0;
  let high = shortfallAmount / 12; // Maximum possible monthly payment
  
  while (iterations < maxIterations && Math.abs(high - low) > tolerance) {
    monthlyPaymentYear1 = (low + high) / 2;
    
    // Calculate total value with escalating contributions
    const { futureValue } = compoundingCalculator.escalatingMonthlyContributions(
      monthlyPaymentYear1, 
      totalMonths
    );
    
    if (futureValue < shortfallAmount) {
      low = monthlyPaymentYear1;
    } else {
      high = monthlyPaymentYear1;
    }
    
    iterations++;
  }
  
  // Calculate final totals with the found monthly payment
  const finalResult = compoundingCalculator.escalatingMonthlyContributions(
    monthlyPaymentYear1, 
    totalMonths
  );
  
  console.log('=== TOP-UP CONTRIBUTIONS (ESCALATING) ===');
  console.log(`Shortfall amount: £${shortfallAmount.toLocaleString()}`);
  console.log(`Monthly payment Year 1 (before rounding): £${monthlyPaymentYear1.toLocaleString()}`);
  console.log(`Total contributions: £${finalResult.totalContributions.toLocaleString()}`);
  console.log(`Future value: £${finalResult.futureValue.toLocaleString()}`);
  console.log(`Difference from target: £${(finalResult.futureValue - shortfallAmount).toLocaleString()}`);
  
  // Use ceiling for monthly payment to ensure we meet or exceed the target
  let roundedMonthlyPayment = Math.ceil(monthlyPaymentYear1);
  console.log(`Monthly payment Year 1 (after Math.ceil): £${roundedMonthlyPayment.toLocaleString()}`);
  
  // Recalculate with the rounded monthly payment to get accurate totals
  let adjustedResult = compoundingCalculator.escalatingMonthlyContributions(
    roundedMonthlyPayment, 
    totalMonths
  );
  
  // If the rounded payment still doesn't meet the target, find the precise amount
  if (adjustedResult.futureValue < shortfallAmount) {
    // Use a more precise search to find the exact amount needed
    let precisePayment = roundedMonthlyPayment;
    const step = 0.1;
    
    while (adjustedResult.futureValue < shortfallAmount) {
      precisePayment += step;
      adjustedResult = compoundingCalculator.escalatingMonthlyContributions(
        precisePayment, 
        totalMonths
      );
    }
    
    // Round to nearest 50p for practical purposes
    roundedMonthlyPayment = Math.ceil(precisePayment * 2) / 2;
    adjustedResult = compoundingCalculator.escalatingMonthlyContributions(
      roundedMonthlyPayment, 
      totalMonths
    );
    
    console.log(`🎯 Precise payment needed: £${precisePayment.toFixed(2)} - Rounded to £${roundedMonthlyPayment.toFixed(2)}`);
    console.log(`🔄 Final result - Future value: £${adjustedResult.futureValue.toLocaleString()}`);
  }
  
  console.log(`=== AFTER ROUNDING UP ===`);
  console.log(`Adjusted total contributions: £${adjustedResult.totalContributions.toLocaleString()}`);
  console.log(`Adjusted future value: £${adjustedResult.futureValue.toLocaleString()}`);
  console.log(`Adjusted difference from target: £${(adjustedResult.futureValue - shortfallAmount).toLocaleString()}`);
  
  const result = {
    monthlyTopUpYear1: roundedMonthlyPayment,
    totalTopUpContributions: Math.round(adjustedResult.totalContributions),
    totalTopUpValue: Math.round(adjustedResult.futureValue)
  };
  
  console.log('🔥 calculateTopUpContributions returning:', result);
  return result;
};

// *** UPDATED: Monthly funding cost now uses Top-Up calculation ***
export const calculateMonthlyFundingCost = (
  shortfall: number,
  yearsUntilPension: number
): number => {
  if (yearsUntilPension <= 0) return 0;
  
  const { monthlyTopUpYear1 } = calculateTopUpContributions(shortfall, yearsUntilPension);
  return monthlyTopUpYear1;
};
