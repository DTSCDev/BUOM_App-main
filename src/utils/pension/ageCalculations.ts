
// Age and time-related pension calculations

// Calculate days until pension age
export const calculateDaysUntilPension = (dateOfBirth: Date, retirementAge: number = 67): number => {
  if (!dateOfBirth) return 0;
  
  const pensionAge = retirementAge; // Use user's selected age
  const today = new Date();
  
  const retirementDate = new Date(dateOfBirth);
  retirementDate.setFullYear(dateOfBirth.getFullYear() + pensionAge);
  
  const differenceInTime = retirementDate.getTime() - today.getTime();
  return Math.max(0, Math.ceil(differenceInTime / (1000 * 3600 * 24)));
};

// Calculate remaining monthly pay days (assuming one pay day per month on the 28th)
export const calculateRemainingPayDays = (daysUntilPension: number): number => {
  // Convert days to months (approximately)
  return Math.max(0, Math.ceil(daysUntilPension / 30));
};

// Calculate age from date of birth in years and months
export const calculateAge = (dateOfBirth: Date): { years: number, months: number } => {
  if (!dateOfBirth) return { years: 0, months: 0 };
  
  const today = new Date();
  
  let years = today.getFullYear() - dateOfBirth.getFullYear();
  let months = today.getMonth() - dateOfBirth.getMonth();
  
  // Only adjust if we haven't reached the birthday yet this year
  if (months < 0 || (months === 0 && today.getDate() < dateOfBirth.getDate())) {
    years--;
    months += 12;
  }
  
  // Adjust months only if we're before the birthday this month
  if (months > 0 && today.getDate() < dateOfBirth.getDate()) {
    months--;
  }
  
  // Ensure non-negative values
  years = Math.max(0, years);
  months = Math.max(0, months);
  
  return { years, months };
};

// Calculate years and months until pension
export const calculateYearsUntilPension = (dateOfBirth: Date): { years: number, months: number } => {
  if (!dateOfBirth) return { years: 0, months: 0 };
  
  const today = new Date();
  const pensionAge = 67;
  
  // Create retirement date
  const retirementDate = new Date(dateOfBirth);
  retirementDate.setFullYear(dateOfBirth.getFullYear() + pensionAge);
  
  // Calculate difference using same logic as age calculation
  let years = retirementDate.getFullYear() - today.getFullYear();
  let months = retirementDate.getMonth() - today.getMonth();
  
  // Only adjust if we haven't reached the retirement date yet this year
  if (months < 0 || (months === 0 && today.getDate() > retirementDate.getDate())) {
    years--;
    months += 12;
  }
  
  // Adjust months only if we're past the retirement day this month
  if (months > 0 && today.getDate() > retirementDate.getDate()) {
    months--;
  }
  
  // Ensure non-negative values
  years = Math.max(0, years);
  months = Math.max(0, months);
  
  console.log(`Years until pension: ${years} years ${months} months`);
  
  return { years, months };
};

// Format years and months as string
export const formatYearsAndMonths = (yearsAndMonths: { years: number, months: number }): string => {
  return `${yearsAndMonths.years} years ${yearsAndMonths.months.toString().padStart(2, '0')} months`;
};
