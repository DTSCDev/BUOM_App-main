
import { calculateAge } from './ageCalculations';
import { normalizeToAnnualSalary } from './salaryCalculations';

// Check if salary is within allowed limits
export const isSalaryWithinLimits = (
  salary: number, 
  isMonthly: boolean
): { isValid: boolean; message: string } => {
  // Define limits for annual values
  const minAnnual = 30000;
  const maxAnnual = 200000;
  
  // Normalize the input salary to annual for consistent validation
  const annualSalary = normalizeToAnnualSalary(salary, isMonthly);
  
  // Check if the annual equivalent is within allowed range
  if (annualSalary < minAnnual || annualSalary > maxAnnual) {
    return {
      isValid: false,
      message: "Unfortunately this FREE Retirement Shortfall Calculator has been built for those who we identify are Most at Risk (MaR) of the biggest proportionate reductions in income at retirement. Your current salary input is outside our scope of service. We are sorry for any inconvenience this may cause."
    };
  }
  
  return { isValid: true, message: "" };
};

// Check if age is within allowed limits
export const isAgeWithinLimits = (
  dateOfBirth: Date
): { isValid: boolean; message: string } => {
  const age = calculateAge(dateOfBirth);
  
  if (age.years < 21) {
    return {
      isValid: false,
      message: "Unfortunately this FREE Retirement Shortfall Calculator is only available for individuals who are at least 21 years old."
    };
  }
  
  if (age.years >= 67) {
    return {
      isValid: false,
      message: "Unfortunately this FREE Retirement Shortfall Calculator is only available for individuals who are below state pension age (67 years)."
    };
  }
  
  return { isValid: true, message: "" };
};

// Generate a BUOM membership number
export const generateBUOMMembershipNumber = (): string => {
  const prefix = "BUOM-";
  const timestamp = Date.now().toString().slice(-6);
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${prefix}${timestamp}-${randomPart}`;
};
