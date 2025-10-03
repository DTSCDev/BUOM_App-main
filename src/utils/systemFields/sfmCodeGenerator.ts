
export interface SFMCodePattern {
  baseCode: string;
  description: string;
  maxYears: number;
}

export const SFM_CODE_PATTERNS: Record<string, SFMCodePattern> = {
  // APF Registration - Year-specific patterns
  'APF_INITIAL_FUNDING': {
    baseCode: 'SFM-047',
    description: 'APF Initial Funding',
    maxYears: 10
  },
  'APF_MATURITY': {
    baseCode: 'SFM-048',
    description: 'APF Maturity Value',
    maxYears: 10
  },
  'TOTAL_INBL_PRINCIPAL': {
    baseCode: 'SFM-049',
    description: 'Total INBL Principal',
    maxYears: 10
  },
  
  // Dashboard BUOM Table - Year-specific patterns
  'BUOM_INBL_ANNUAL': {
    baseCode: 'SFM-066',
    description: 'BUOM Table Annual INBL',
    maxYears: 10
  },
  'BUOM_APF_FUNDING': {
    baseCode: 'SFM-069',
    description: 'BUOM Table APF Funding',
    maxYears: 10
  },
  'BUOM_ISA_MONTHLY': {
    baseCode: 'SFM-072',
    description: 'BUOM Table ISA Monthly',
    maxYears: 10
  },
  
  // NPG and NRSR Fee patterns - NEW
  'NPG_AMOUNT': {
    baseCode: 'SFM-055',
    description: 'NPG Amount',
    maxYears: 10
  },
  'NRSR_FEE': {
    baseCode: 'SFM-056',
    description: 'NRSR Fee',
    maxYears: 10
  }
};

/**
 * Generate a year-specific SFM code
 * @param baseCode - The base SFM code (e.g., 'SFM-047')
 * @param year - The year number (1-based)
 * @returns The year-specific SFM code (e.g., 'SFM-047-1')
 */
export const generateYearSpecificSFM = (baseCode: string, year: number): string => {
  return `${baseCode}-${year}`;
};

/**
 * Extract the base SFM code from a year-specific code
 * @param yearSpecificCode - The year-specific code (e.g., 'SFM-047-1')
 * @returns The base SFM code (e.g., 'SFM-047')
 */
export const extractBaseSFMCode = (yearSpecificCode: string): string => {
  const parts = yearSpecificCode.split('-');
  if (parts.length >= 3) {
    return `${parts[0]}-${parts[1]}`;
  }
  return yearSpecificCode;
};

/**
 * Extract the year from a year-specific SFM code
 * @param yearSpecificCode - The year-specific code (e.g., 'SFM-047-1')
 * @returns The year number (1-based)
 */
export const extractYearFromSFM = (yearSpecificCode: string): number => {
  const parts = yearSpecificCode.split('-');
  if (parts.length >= 3) {
    return parseInt(parts[2], 10) || 1;
  }
  return 1;
};

/**
 * Validate an SFM code format
 * @param sfmCode - The SFM code to validate
 * @returns Whether the code is valid
 */
export const validateSFMCode = (sfmCode: string): boolean => {
  // Base format: SFM-XXX
  const basePattern = /^SFM-\d{3}$/;
  // Year-specific format: SFM-XXX-Y
  const yearPattern = /^SFM-\d{3}-\d+$/;
  // Current year format: SFM-XXX-A (A = current year)
  const currentYearPattern = /^SFM-\d{3}A$/;
  
  return basePattern.test(sfmCode) || yearPattern.test(sfmCode) || currentYearPattern.test(sfmCode);
};

/**
 * Get SFM code for a specific metric and year
 * @param metricType - The type of metric
 * @param year - The year number (1-based)
 * @returns The appropriate SFM code
 */
export const getSFMCodeForMetric = (metricType: keyof typeof SFM_CODE_PATTERNS, year: number): string => {
  const pattern = SFM_CODE_PATTERNS[metricType];
  if (!pattern) {
    console.warn(`Unknown metric type: ${metricType}`);
    return 'SFM-000';
  }
  
  if (year > pattern.maxYears) {
    console.warn(`Year ${year} exceeds maximum years (${pattern.maxYears}) for metric ${metricType}`);
    return pattern.baseCode;
  }
  
  return generateYearSpecificSFM(pattern.baseCode, year);
};
