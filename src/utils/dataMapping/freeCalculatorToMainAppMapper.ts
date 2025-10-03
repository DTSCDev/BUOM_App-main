/**
 * Free Calculator to Main App Data Mapper
 * Maps Free Calculator SFM codes (SFM-001 to SFM-007) to Main App page-based SFM codes
 * Source: freeCalculatorFields.ts for Free Calculator codes
 * Target: profilePageFields.ts (SFM-PRF-XXXX) and netAssetValueFields.ts (SFM-NAV-XXXX)
 */

// Free Calculator Data Interfaces (from localStorage)
export interface FreeCalculatorData {
  dateOfBirth?: string;           // SFM-001
  annualSalary?: number;          // SFM-002  
  existingPensionValue?: number;  // SFM-003
  monthlyAECont?: number;         // SFM-004
  retirementAge?: number;         // SFM-005
  finalSalaryIncome?: number;     // SFM-006
  otherIncome?: number;           // SFM-007
}

// Eligibility Form Data (from funding eligibility form)
export interface EligibilityFormData {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  email: string;
  postCode: string;
  country: string;
  mobile: string;
}

// Main App Profile Page Data (SFM-PRF-XXXX)
export interface ProfilePageData {
  'SFM-PRF-2001'?: string;  // Full Name (firstName + lastName)
  'SFM-PRF-2002'?: string;  // Email Address
  'SFM-PRF-2003'?: string;  // Date of Birth
  'SFM-PRF-2005'?: number;  // Retirement Age
  'SFM-PRF-2021'?: number;  // Annual Salary
  'SFM-PRF-2041'?: number;  // Existing Pension Value
  'SFM-PRF-2043-GP'?: number;  // Gross Employer + Employee Pension Contribution Currency (£)
  'SFM-PRF-2081'?: string;  // Phone Number (mobile)
  'SFM-PRF-2082'?: string;  // Address (composed from address fields)
}

// Main App Net Asset Value Data (SFM-NAV-XXXX)
export interface NetAssetValueData {
  'SFM-NAV-3501'?: number;  // Workplace Pension (Existing Fund Value)
}

// Combined mapped data for Main App
export interface MainAppMappedData {
  profileData: ProfilePageData;
  netAssetValueData: NetAssetValueData;
}

/**
 * Map Free Calculator basic inputs (SFM-001 to SFM-007) to Main App Profile page
 */
export function mapFreeCalculatorToProfile(
  freeCalcData: FreeCalculatorData,
  eligibilityData: EligibilityFormData
): ProfilePageData {
  const profileData: ProfilePageData = {};

  // Map personal information
  if (eligibilityData.firstName && eligibilityData.lastName) {
    profileData['SFM-PRF-2001'] = `${eligibilityData.firstName} ${eligibilityData.lastName}`;
  }
  
  if (eligibilityData.email) {
    profileData['SFM-PRF-2002'] = eligibilityData.email;
  }

  if (freeCalcData.dateOfBirth) {
    profileData['SFM-PRF-2003'] = freeCalcData.dateOfBirth; // SFM-001 → SFM-PRF-2003
  }

  if (freeCalcData.retirementAge) {
    profileData['SFM-PRF-2005'] = freeCalcData.retirementAge; // SFM-005 → SFM-PRF-2005
  }

  // Map employment information
  if (freeCalcData.annualSalary) {
    profileData['SFM-PRF-2021'] = freeCalcData.annualSalary; // SFM-002 → SFM-PRF-2021
  }

  // Map pension information
  if (freeCalcData.existingPensionValue) {
    profileData['SFM-PRF-2041'] = freeCalcData.existingPensionValue; // SFM-003 → SFM-PRF-2041
  }

  // Map monthly AE contribution to gross pension contribution currency value
  // SFM-004 (£340/month) → SFM-PRF-2043-GP (Gross Employer + Employee Pension Contribution Currency)
  if (freeCalcData.monthlyAECont) {
    profileData['SFM-PRF-2043-GP'] = freeCalcData.monthlyAECont; // SFM-004 → SFM-PRF-2043-GP
  }

  // Map contact information
  if (eligibilityData.mobile) {
    profileData['SFM-PRF-2081'] = eligibilityData.mobile;
  }

  // Compose address string from provided fields
  const addressParts = [
    eligibilityData.addressLine1,
    eligibilityData.addressLine2 || '',
    eligibilityData.city,
    eligibilityData.postCode,
    eligibilityData.country
  ]
    .map(part => (part || '').trim())
    .filter(Boolean);

  if (addressParts.length > 0) {
    profileData['SFM-PRF-2082'] = addressParts.join(', ');
  }

  return profileData;
}

/**
 * Map Free Calculator existing pension value to Net Asset Value page
 */
export function mapFreeCalculatorToNetAssetValue(freeCalcData: FreeCalculatorData): NetAssetValueData {
  const navData: NetAssetValueData = {};

  // Map existing pension value to workplace pension asset
  if (freeCalcData.existingPensionValue) {
    navData['SFM-NAV-3501'] = freeCalcData.existingPensionValue; // SFM-003 → SFM-NAV-3501
  }

  return navData;
}

/**
 * Main mapping function that combines all Free Calculator data to Main App format
 */
export function mapFreeCalculatorToMainApp(
  freeCalcData: FreeCalculatorData,
  eligibilityData: EligibilityFormData
): MainAppMappedData {
  return {
    profileData: mapFreeCalculatorToProfile(freeCalcData, eligibilityData),
    netAssetValueData: mapFreeCalculatorToNetAssetValue(freeCalcData)
  };
}

/**
 * Utility function to retrieve Free Calculator data from localStorage
 */
export function getFreeCalculatorDataFromStorage(): FreeCalculatorData | null {
  try {
    const storedData = localStorage.getItem('retirement-calculator-data');
    if (!storedData) return null;
    
    const parsedData = JSON.parse(storedData);
    
    // Extract the relevant SFM-001 to SFM-007 data
    return {
      dateOfBirth: parsedData.dateOfBirth,           // SFM-001
      annualSalary: parsedData.annualSalary,         // SFM-002
      existingPensionValue: parsedData.existingPensionValue, // SFM-003
      monthlyAECont: parsedData.monthlyAECont,       // SFM-004
      retirementAge: parsedData.retirementAge,       // SFM-005
      finalSalaryIncome: parsedData.finalSalaryIncome, // SFM-006
      otherIncome: parsedData.otherIncome            // SFM-007
    };
  } catch (error) {
    console.error('Error retrieving Free Calculator data from localStorage:', error);
    return null;
  }
}

/**
 * Utility function to retrieve eligibility form data from localStorage
 * Note: This might need to be enhanced based on how eligibility data is actually stored
 */
export function getEligibilityDataFromStorage(): EligibilityFormData | null {
  try {
    // Check for eligibility data in localStorage
    // This might be stored under a different key - adjust as needed
    const eligibilityData = localStorage.getItem('funding-eligibility-data');
    if (eligibilityData) {
      const parsed = JSON.parse(eligibilityData);
      return {
        firstName: parsed.firstName || '',
        lastName: parsed.lastName || '',
        addressLine1: parsed.addressLine1 || '',
        addressLine2: parsed.addressLine2 || '',
        city: parsed.city || '',
        email: parsed.email || '',
        postCode: parsed.postCode || '',
        country: parsed.country || '',
        mobile: parsed.mobile || ''
      };
    }

    // Fallback: try to get from user profile or other sources
    const userProfile = localStorage.getItem('user-profile');
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      return {
        firstName: profile.firstName || profile.first_name || '',
        lastName: profile.lastName || profile.last_name || '',
        addressLine1: profile.addressLine1 || profile.address_line1 || '',
        addressLine2: profile.addressLine2 || profile.address_line2 || '',
        city: profile.city || '',
        email: profile.email || '',
        postCode: profile.postCode || profile.post_code || '',
        country: profile.country || '',
        mobile: profile.mobile || profile.phone || ''
      };
    }

    return null;
  } catch (error) {
    console.error('Error retrieving eligibility data from localStorage:', error);
    return null;
  }
}

/**
 * Debug utility to log mapping results
 */
export function debugMappingResults(mappedData: MainAppMappedData): void {
  console.group('🔄 Free Calculator to Main App Data Mapping Results');
  
  console.log('📋 Profile Data (SFM-PRF-XXXX):');
  Object.entries(mappedData.profileData).forEach(([sfmCode, value]) => {
    console.log(`  ${sfmCode}: ${value}`);
  });
  
  console.log('💰 Net Asset Value Data (SFM-NAV-XXXX):');
  Object.entries(mappedData.netAssetValueData).forEach(([sfmCode, value]) => {
    console.log(`  ${sfmCode}: ${value}`);
  });
  
  console.groupEnd();
}

/**
 * Validation function to check if Free Calculator data is available for migration
 */
export function validateMigrationData(): { isValid: boolean; missingItems: string[] } {
  const missingItems: string[] = [];
  
  const freeCalcData = getFreeCalculatorDataFromStorage();
  if (!freeCalcData) {
    missingItems.push('Free Calculator data not found in localStorage');
  } else {
    // Check for essential data points
    if (!freeCalcData.annualSalary) missingItems.push('Annual Salary (SFM-002)');
    if (!freeCalcData.dateOfBirth) missingItems.push('Date of Birth (SFM-001)');
    if (!freeCalcData.retirementAge) missingItems.push('Retirement Age (SFM-005)');
  }
  
  const eligibilityData = getEligibilityDataFromStorage();
  if (!eligibilityData) {
    missingItems.push('Eligibility form data not found');
  } else {
    if (!eligibilityData.firstName) missingItems.push('First Name');
    if (!eligibilityData.lastName) missingItems.push('Last Name');
    if (!eligibilityData.email) missingItems.push('Email Address');
  }
  
  return {
    isValid: missingItems.length === 0,
    missingItems
  };
}