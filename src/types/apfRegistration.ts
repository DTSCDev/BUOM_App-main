// APF Registration Data model aligned to PRF inputs and per-step outputs

// Step 1: Personal details form data (strings mirror UI inputs)
export interface Step1PersonalDetailsData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  mobile: string;
  niNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postCode: string;
  country: string;
  annualSalary: string; // GBP-formatted; parsed before persisting to PRF
  payeTaxCode: string;
  p11dBenefit: string;
  employmentType: string;
  employerName: string;
  employerAddress: string;
  tradingName: string;
  companyNumber: string;
  businessAddress: string;
  worksFromHome: boolean;
  referralSource: string;
  referralCode: string;
  dataProtectionConsent: boolean;
  marketingConsent: boolean;
  termsAccepted: boolean;
}

// Step 2: Key financials (based on existing Step 2 form)
export interface Step2KeyFinancialsData {
  annualSalary: number;
  existingPensionValue: number;
  inblFundingApproved: boolean;
  shortfallAmount?: number;
  monthlyISAContribution?: number;
}

// Extend with richer types for subsequent steps as their forms are finalized.
// Using named sections avoids generic catch-alls.
export interface APFRegistrationData {
  step1?: Step1PersonalDetailsData;
  step2?: Step2KeyFinancialsData;
  step3?: Record<string, unknown>; // TODO: define concrete type
  step4?: Record<string, unknown>; // TODO: define concrete type
  step5?: Record<string, unknown>; // TODO: define concrete type
  step6?: Record<string, unknown>; // TODO: define concrete type
}