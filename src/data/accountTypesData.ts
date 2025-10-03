
// Define account types
export const accountTypes = [
  { id: 'sme', label: 'SME / Small Business Owner' },
  { id: 'startup', label: 'Start-Up / Founder' },
  { id: 'employee', label: 'Employee' },
  { id: 'advisor', label: 'Professional Advisor' },
  { id: 'pension', label: 'Pension Provider / Pension Trustee' },
  { id: 'philanthropist', label: 'Philanthropist' },
  { id: 'charity', label: 'Charity / NGO' }
];

// Define interest options for each account type
export const interestOptions: Record<string, Array<{ id: string, label: string }>> = {
  sme: [
    { id: 'profitability', label: 'Improve Profitability' },
    { id: 'growth-capital', label: 'Strategic Growth Capital' },
    { id: 'free-benefits', label: 'FREE Benefits for Workers' },
    { id: 'net-zero', label: 'Net Zero Transition Funding' },
    { id: 'adv-pension', label: 'Advanced Pension Funding' },
    { id: 'vulnerability', label: 'Employee Retirement Vulnerability Report' }
  ],
  startup: [
    { id: 'launch-capital', label: 'Strategic Launch Capital' },
    { id: 'growth-capital', label: 'Strategic Growth Capital' },
    { id: 'grant-funding', label: 'FREE Benefit Grant Funding' },
    { id: 'net-zero', label: 'Net Zero Transition Funding' },
    { id: 'adv-pension', label: 'Advanced Pension Funding' },
    { id: 'vulnerability', label: 'Employee Retirement Vulnerability Report' },
    { id: 'venture-fund', label: 'Cherub Venture Fund' }
  ],
  employee: [
    { id: 'calculator', label: 'Free Retirement Calculator' },
    { id: 'risk-free', label: 'Risk Free Pension Funding' },
    { id: 'net-zero-finance', label: 'Net Zero Transition Finance' },
    { id: 'self-build', label: 'Net Zero Self Build Finance' },
    { id: 'advice', label: 'Low Cost Chartered Financial Advice' },
    { id: 'grant', label: 'Cherub Investment Grant' }
  ],
  advisor: [
    { id: 'license', label: 'FREE Benefits License' },
    { id: 'bulk-calc', label: 'Bulk DC Workplace Pension Shortfall Calculator' },
    { id: 'r-day', label: 'R-Day Vulnerability Assessment' },
    { id: 'partnership', label: 'Advanced Pension Funding Partnership' }
  ],
  pension: [
    { id: 'license', label: 'FREE Benefits License' },
    { id: 'bulk-calc', label: 'Bulk DC Workplace Pension Shortfall Calculator' },
    { id: 'r-day', label: 'R-Day Vulnerability Assessment' },
    { id: 'partnership', label: 'Advanced Pension Funding Partnership' }
  ],
  philanthropist: [
    { id: 'foundation', label: 'Facta Non Verba Foundation' },
    { id: 'license', label: 'BUOM TECH Partnership License' },
    { id: 'community', label: 'Cherub Investment Community' }
  ],
  charity: [
    { id: 'foundation', label: 'Facta Non Verba Foundation' },
    { id: 'license', label: 'BUOM TECH Partnership License' },
    { id: 'community', label: 'Cherub Investment Community' }
  ]
};
