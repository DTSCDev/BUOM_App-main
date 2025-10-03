import { compoundingCalculator } from './compoundingUtils';

// Keep existing functions for backward compatibility
export const calculateRequiredRetirementIncome = (annualSalary: number): number => {
  return Math.round(annualSalary * compoundingCalculator.params.pensionIncomeTarget);
};

export const calculateRequiredCapital = (requiredIncome: number): number => {
  const drawdownRate = 0.035;
  return Math.round(requiredIncome / drawdownRate);
};

export const calculateAdjustedRequiredIncome = (
  requiredIncome: number,
  statePension: number = 0,
  finalSalaryIncome: number = 0,
  otherIncome: number = 0
): number => {
  return Math.max(0, requiredIncome - statePension - finalSalaryIncome - otherIncome);
};

export const calculateShortfall = (
  projectedPension: number,
  requiredCapital: number
): number => {
  return Math.max(0, requiredCapital - projectedPension);
};
