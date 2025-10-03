import { SystemField } from './types';

// Profile Page is SFM-PRF-2XXX-X
export const profilePageFields: SystemField[] = [
  // Personal Information (SFM-PRF-2001 to SFM-PRF-2020)
  {
    sfmId: "SFM-PRF-2001",
    description: "Profile Full Name",
    pageName: "Profile",
    cardName: "Personal Information",
    outputValue: "fullName",
    correlatedTo: "User's full name from profile",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2002",
    description: "Profile Email Address",
    pageName: "Profile",
    cardName: "Personal Information",
    outputValue: "emailAddress",
    correlatedTo: "User's email address",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2003",
    description: "Profile Date of Birth",
    pageName: "Profile",
    cardName: "Personal Information",
    outputValue: "dateOfBirth",
    correlatedTo: "User's date of birth for age calculations",
    valueType: "Date"
  },
  {
    sfmId: "SFM-PRF-2004",
    description: "Profile Current Age",
    pageName: "Profile",
    cardName: "Personal Information",
    outputValue: "currentAge",
    correlatedTo: "Calculated current age from date of birth",
    valueType: "Number"
  },
  {
    sfmId: "SFM-PRF-2005",
    description: "Profile Retirement Age",
    pageName: "Profile",
    cardName: "Personal Information",
    outputValue: "retirementAge",
    correlatedTo: "Target retirement age (default 67)",
    valueType: "Number"
  },
  {
    sfmId: "SFM-PRF-2006",
    description: "Profile National Insurance Number",
    pageName: "Profile",
    cardName: "Personal Information",
    outputValue: "nationalInsuranceNumber",
    correlatedTo: "UK National Insurance Number for tax calculations",
    valueType: "Text"
  },

  // Employment Information (SFM-PRF-2021 to SFM-PRF-2040)
  {
    sfmId: "SFM-PRF-2021",
    description: "Profile Annual Salary",
    pageName: "Profile",
    cardName: "Employment Information",
    outputValue: "annualSalary",
    correlatedTo: "Current annual gross salary",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-PRF-2022",
    description: "Profile Employment Status",
    pageName: "Profile",
    cardName: "Employment Information",
    outputValue: "employmentStatus",
    correlatedTo: "Current employment status",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2023",
    description: "Profile Employer Name",
    pageName: "Profile",
    cardName: "Employment Information",
    outputValue: "employerName",
    correlatedTo: "Current employer name",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2024",
    description: "Profile Job Title",
    pageName: "Profile",
    cardName: "Employment Information",
    outputValue: "jobTitle",
    correlatedTo: "Current job title",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2025",
    description: "Profile Tax Code",
    pageName: "Profile",
    cardName: "Employment Information",
    outputValue: "taxCode",
    correlatedTo: "Current HMRC tax code for PAYE calculations",
    valueType: "Text"
  },

  // Pension Information (SFM-PRF-2041 to SFM-PRF-2060)
  {
    sfmId: "SFM-PRF-2041",
    description: "Profile Existing Pension Value",
    pageName: "Profile",
    cardName: "Pension Information",
    outputValue: "existingPensionValue",
    correlatedTo: "Current pension fund value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-PRF-2042-EeP",
    description: "Profile Employee Pension Contribution Percentage",
    pageName: "Profile",
    cardName: "Pension Information",
    outputValue: "pensionContributionEmployeePercentage",
    correlatedTo: "Employee pension contribution percentage (%)",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-PRF-2042-ErP",
    description: "Profile Employer Pension Contribution Percentage",
    pageName: "Profile",
    cardName: "Pension Information",
    outputValue: "pensionContributionEmployerPercentage",
    correlatedTo: "Employer pension contribution percentage (%)",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-PRF-2042-GP",
    description: "Profile Gross Employer + Employee Pension Contribution Percentage",
    pageName: "Profile",
    cardName: "Pension Information",
    outputValue: "pensionContributionGrossPercentage",
    correlatedTo: "Total gross pension contribution percentage (Employee + Employer %)",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-PRF-2043-Ee",
    description: "Profile Employee Pension Contribution Currency",
    pageName: "Profile",
    cardName: "Pension Information",
    outputValue: "pensionContributionEmployeeCurrency",
    correlatedTo: "Employee pension contribution amount in £ (e.g. £213)",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-PRF-2043-Er",
    description: "Profile Employer Pension Contribution Currency",
    pageName: "Profile",
    cardName: "Pension Information",
    outputValue: "pensionContributionEmployerCurrency",
    correlatedTo: "Employer pension contribution amount in £ (e.g. £128)",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-PRF-2043-GP",
    description: "Profile Gross Employer + Employee Pension Contribution Currency",
    pageName: "Profile",
    cardName: "Pension Information",
    outputValue: "pensionContributionGrossCurrency",
    correlatedTo: "Total gross pension contribution amount in £ (e.g. £340)",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-PRF-2044",
    description: "Profile Pension Provider",
    pageName: "Profile",
    cardName: "Pension Information",
    outputValue: "pensionProvider",
    correlatedTo: "Current pension provider name",
    valueType: "Text"
  },

  // Financial Goals (SFM-PRF-2061 to SFM-PRF-2080)
  {
    sfmId: "SFM-PRF-2061",
    description: "Profile Target Retirement Income",
    pageName: "Profile",
    cardName: "Financial Goals",
    outputValue: "targetRetirementIncome",
    correlatedTo: "Desired annual retirement income",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-PRF-2062",
    description: "Profile Risk Tolerance",
    pageName: "Profile",
    cardName: "Financial Goals",
    outputValue: "riskTolerance",
    correlatedTo: "Investment risk tolerance level",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2063",
    description: "Profile Investment Experience",
    pageName: "Profile",
    cardName: "Financial Goals",
    outputValue: "investmentExperience",
    correlatedTo: "Level of investment experience",
    valueType: "Text"
  },

  // Contact Information (SFM-PRF-2081 to SFM-PRF-2100)
  {
    sfmId: "SFM-PRF-2081",
    description: "Profile Phone Number",
    pageName: "Profile",
    cardName: "Contact Information",
    outputValue: "phoneNumber",
    correlatedTo: "Contact phone number",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2082",
    description: "Profile Address",
    pageName: "Profile",
    cardName: "Contact Information",
    outputValue: "address",
    correlatedTo: "Home address",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2083",
    description: "Profile Preferred Contact Method",
    pageName: "Profile",
    cardName: "Contact Information",
    outputValue: "preferredContactMethod",
    correlatedTo: "Preferred method of contact",
    valueType: "Text"
  }
];