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
    sfmId: "SFM-PRF-2001-FN",
    description: "Profile First Name",
    pageName: "Profile",
    cardName: "Personal Information",
    outputValue: "firstName",
    correlatedTo: "User's first name",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2001-LN",
    description: "Profile Last Name",
    pageName: "Profile",
    cardName: "Personal Information",
    outputValue: "lastName",
    correlatedTo: "User's last name",
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
    description: "Profile Mobile Number",
    pageName: "Profile",
    cardName: "Personal Information",
    outputValue: "mobileNumber",
    correlatedTo: "Mobile contact number",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2007",
    description: "Profile Relationship Status",
    pageName: "Profile",
    cardName: "Personal Information",
    outputValue: "relationshipStatus",
    correlatedTo: "Relationship status (Single, Married, Divorced, Co-habiting, Private)",
    valueType: "Text"
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
    sfmId: "SFM-PRF-2023-ADDR",
    description: "Profile Employer Address",
    pageName: "Profile",
    cardName: "Employment Information",
    outputValue: "employerAddress",
    correlatedTo: "Current employer address",
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
    sfmId: "SFM-PRF-2026",
    description: "Profile Trading Name",
    pageName: "Profile",
    cardName: "Employment Information",
    outputValue: "tradingName",
    correlatedTo: "Trading name for self-employed or business owner",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2027",
    description: "Profile Company Number",
    pageName: "Profile",
    cardName: "Employment Information",
    outputValue: "companyNumber",
    correlatedTo: "Registered company number",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2028",
    description: "Profile Business Address",
    pageName: "Profile",
    cardName: "Employment Information",
    outputValue: "businessAddress",
    correlatedTo: "Registered business address",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2029",
    description: "Profile Works From Home",
    pageName: "Profile",
    cardName: "Employment Information",
    outputValue: "worksFromHome",
    correlatedTo: "Whether the user works from home",
    valueType: "Boolean"
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
  {
    sfmId: "SFM-PRF-2030",
    description: "Profile P11D Benefit In Kind",
    pageName: "Profile",
    cardName: "Employment Information",
    outputValue: "p11d",
    correlatedTo: "P11D benefits-in-kind total for tax year",
    valueType: "Currency"
  },

  // Pension Information (SFM-PRF-2041 to SFM-PRF-2060)
  {
    sfmId: "SFM-PRF-2041",
    description: "Profile Retirement Age",
    pageName: "Profile",
    cardName: "Pension Information",
    outputValue: "retirementAge",
    correlatedTo: "Retirement age (sync CAL-4405 Age)",
    valueType: "Number"
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
    description: "Profile House Name",
    pageName: "Profile",
    cardName: "Contact Information",
    outputValue: "houseName",
    correlatedTo: "House name or building name",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2082",
    description: "Profile Address Line 1",
    pageName: "Profile",
    cardName: "Contact Information",
    outputValue: "addressLine1",
    correlatedTo: "Home address line 1",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2083",
    description: "Profile Address Line 2",
    pageName: "Profile",
    cardName: "Contact Information",
    outputValue: "addressLine2",
    correlatedTo: "Home address line 2",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2084",
    description: "Profile Town/City",
    pageName: "Profile",
    cardName: "Contact Information",
    outputValue: "city",
    correlatedTo: "Town or City",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2085",
    description: "Profile Postcode",
    pageName: "Profile",
    cardName: "Contact Information",
    outputValue: "postcode",
    correlatedTo: "Postcode",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2086",
    description: "Profile Country",
    pageName: "Profile",
    cardName: "Contact Information",
    outputValue: "country",
    correlatedTo: "Country",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PRF-2087",
    description: "Profile Preferred Contact Method",
    pageName: "Profile",
    cardName: "Contact Information",
    outputValue: "preferredContactMethod",
    correlatedTo: "Preferred method of contact",
    valueType: "Text"
  }
];