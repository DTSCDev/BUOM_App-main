/**
 * SFM Bespoke Allocation Service
 * 
 * Provides product-specific SFM code allocation based on the comprehensive
 * Net Asset Value page allocation structure provided by the user.
 */

import { SFMAllocationUtils } from './sfmAllocationTracker';

// Comprehensive product mapping based on user specifications
const ASSET_PRODUCT_MAPPING = {
  // PENSION ASSETS (SFM-NAV-3501 to 3599)
  'workplace_pension': 'SFM-NAV-3501',
  'personal_pension': 'SFM-NAV-3510', 
  'sipp': 'SFM-NAV-3520',
  'ssas': 'SFM-NAV-3530',
  'section_32': 'SFM-NAV-3540',
  'section_226': 'SFM-NAV-3550',
  'annuity_income': 'SFM-NAV-3560',
  'final_salary_income': 'SFM-NAV-3570',
  '3pps_zvar_assets': 'SFM-NAV-3580',
  'pension_total': 'SFM-NAV-3599',

  // PROPERTY ASSETS (SFM-NAV-3601 to 3699)
  'main_residence': 'SFM-NAV-3601',
  'btl_investment': 'SFM-NAV-3610',
  'commercial_property': 'SFM-NAV-3620',
  'overseas_home': 'SFM-NAV-3630',
  'off_plan': 'SFM-NAV-3640',
  'land': 'SFM-NAV-3650',
  'property_total': 'SFM-NAV-3699',

  // INVESTMENT ASSETS (SFM-NAV-3710 to 3799)
  'isa_cash': 'SFM-NAV-3710',
  'isa_stocks_shares': 'SFM-NAV-3720',
  'isa_innovative_finance': 'SFM-NAV-3730',
  'isa_lifetime': 'SFM-NAV-3740',
  'isa_junior': 'SFM-NAV-3750',
  'bond_onshore': 'SFM-NAV-3760',
  'bond_offshore': 'SFM-NAV-3770',
  'seis': 'SFM-NAV-3780',
  'eis_vct': 'SFM-NAV-3790',
  'investments_total': 'SFM-NAV-3799',
  'isa_total': 'SFM-NAV-3799-1',
  'bond_total': 'SFM-NAV-3799-2',
  'seis_eis_vct_total': 'SFM-NAV-3799-3',

  // CASH & SAVINGS ASSETS (SFM-NAV-3800 to 3899)
  'deposit': 'SFM-NAV-3800',
  'premium_bonds': 'SFM-NAV-3820',
  'cash_savings_total': 'SFM-NAV-3899',

  // OTHER INVESTMENTS (SFM-NAV-3900 to 3999)
  'other_investments': 'SFM-NAV-3900',
  'other_investments_total': 'SFM-NAV-3999'
};

const LIABILITY_PRODUCT_MAPPING = {
  // MORTGAGE LIABILITIES (SFM-NAV-3001 to 3199)
  'mortgage_main_residence': 'SFM-NAV-3001',
  'mortgage_equity_release': 'SFM-NAV-3002',
  'mortgage_investment_property': 'SFM-NAV-3101',

  // CREDIT CARD LIABILITIES (SFM-NAV-3201 to 3299)
  'credit_card': 'SFM-NAV-3201',

  // OTHER DEBTS (SFM-NAV-3301 to 3499)
  'inbl_principal': 'SFM-NAV-3301',
  'loan': 'SFM-NAV-3401'
};

// Product detection patterns for intelligent allocation
const PRODUCT_DETECTION_PATTERNS = {
  // Asset patterns
  workplace: ['workplace', 'nest', 'company pension', 'occupational'],
  personal_pension: ['personal pension', 'private pension', 'stakeholder'],
  sipp: ['sipp', 'self invested'],
  ssas: ['ssas', 'small self administered'],
  property: ['property', 'house', 'flat', 'apartment'],
  isa: ['isa', 'individual savings'],
  pension: ['pension', 'retirement', 'superannuation'],
  
  // Liability patterns
  mortgage: ['mortgage', 'home loan', 'property loan'],
  credit_card: ['credit card', 'visa', 'mastercard', 'amex'],
  loan: ['loan', 'personal loan', 'bank loan']
};

export class SFMBespokeAllocationService {
  /**
   * Allocate SFM code for a specific asset product
   */
  static allocateForAssetProduct(productType: string, description?: string): string | null {
    try {
      // First try exact product type match
      const exactMatch = ASSET_PRODUCT_MAPPING[productType.toLowerCase().replace(/\s+/g, '_')];
      if (exactMatch) {
        return SFMAllocationUtils.allocateSpecificCode(exactMatch);
      }

      // Try intelligent detection based on description
      if (description) {
        const detectedProduct = this.detectAssetProduct(description);
        if (detectedProduct && ASSET_PRODUCT_MAPPING[detectedProduct]) {
          return SFMAllocationUtils.allocateSpecificCode(ASSET_PRODUCT_MAPPING[detectedProduct]);
        }
      }

      // Fallback to general asset allocation
      console.warn(`No specific SFM code found for asset product: ${productType}`);
      return SFMAllocationUtils.autoAllocate('NET_ASSET_VALUE', {
        page: 'Net Asset Value',
        section: 'Assets',
        card: productType,
        description: `Asset product: ${productType}${description ? ` - ${description}` : ''}`,
        allocatedBy: 'SFMBespokeAllocationService'
      });
    } catch (error) {
      console.error('Error allocating SFM code for asset:', error);
      return null;
    }
  }

  /**
   * Allocate SFM code for a specific liability product
   */
  static allocateForLiabilityProduct(productType: string, description?: string): string | null {
    try {
      // First try exact product type match
      const exactMatch = LIABILITY_PRODUCT_MAPPING[productType.toLowerCase().replace(/\s+/g, '_')];
      if (exactMatch) {
        return SFMAllocationUtils.allocateSpecificCode(exactMatch);
      }

      // Try intelligent detection based on description
      if (description) {
        const detectedProduct = this.detectLiabilityProduct(description);
        if (detectedProduct && LIABILITY_PRODUCT_MAPPING[detectedProduct]) {
          return SFMAllocationUtils.allocateSpecificCode(LIABILITY_PRODUCT_MAPPING[detectedProduct]);
        }
      }

      // Fallback to general liability allocation
      console.warn(`No specific SFM code found for liability product: ${productType}`);
      return SFMAllocationUtils.autoAllocate('NET_ASSET_VALUE', {
        page: 'Net Asset Value',
        section: 'Liabilities',
        card: productType,
        description: `Liability product: ${productType}${description ? ` - ${description}` : ''}`,
        allocatedBy: 'SFMBespokeAllocationService'
      });
    } catch (error) {
      console.error('Error allocating SFM code for liability:', error);
      return null;
    }
  }

  /**
   * Detect asset product type from description
   */
  private static detectAssetProduct(description: string): string | null {
    const desc = description.toLowerCase();

    // Pension detection
    if (PRODUCT_DETECTION_PATTERNS.workplace.some(pattern => desc.includes(pattern))) {
      return 'workplace_pension';
    }
    if (PRODUCT_DETECTION_PATTERNS.sipp.some(pattern => desc.includes(pattern))) {
      return 'sipp';
    }
    if (PRODUCT_DETECTION_PATTERNS.ssas.some(pattern => desc.includes(pattern))) {
      return 'ssas';
    }
    if (PRODUCT_DETECTION_PATTERNS.personal_pension.some(pattern => desc.includes(pattern))) {
      return 'personal_pension';
    }
    if (PRODUCT_DETECTION_PATTERNS.pension.some(pattern => desc.includes(pattern))) {
      return 'workplace_pension'; // Default pension type
    }

    // Property detection
    if (PRODUCT_DETECTION_PATTERNS.property.some(pattern => desc.includes(pattern))) {
      if (desc.includes('main') || desc.includes('primary') || desc.includes('residence')) {
        return 'main_residence';
      }
      if (desc.includes('btl') || desc.includes('buy to let') || desc.includes('rental')) {
        return 'btl_investment';
      }
      if (desc.includes('commercial')) {
        return 'commercial_property';
      }
      return 'main_residence'; // Default property type
    }

    // ISA detection
    if (PRODUCT_DETECTION_PATTERNS.isa.some(pattern => desc.includes(pattern))) {
      if (desc.includes('cash')) return 'isa_cash';
      if (desc.includes('stocks') || desc.includes('shares')) return 'isa_stocks_shares';
      if (desc.includes('innovative')) return 'isa_innovative_finance';
      if (desc.includes('lifetime')) return 'isa_lifetime';
      if (desc.includes('junior')) return 'isa_junior';
      return 'isa_cash'; // Default ISA type
    }

    return null;
  }

  /**
   * Detect liability product type from description
   */
  private static detectLiabilityProduct(description: string): string | null {
    const desc = description.toLowerCase();

    // Mortgage detection
    if (PRODUCT_DETECTION_PATTERNS.mortgage.some(pattern => desc.includes(pattern))) {
      if (desc.includes('equity release')) {
        return 'mortgage_equity_release';
      }
      if (desc.includes('investment') || desc.includes('btl') || desc.includes('buy to let')) {
        return 'mortgage_investment_property';
      }
      return 'mortgage_main_residence'; // Default mortgage type
    }

    // Credit card detection
    if (PRODUCT_DETECTION_PATTERNS.credit_card.some(pattern => desc.includes(pattern))) {
      return 'credit_card';
    }

    // Loan detection
    if (PRODUCT_DETECTION_PATTERNS.loan.some(pattern => desc.includes(pattern))) {
      if (desc.includes('inbl')) {
        return 'inbl_principal';
      }
      return 'loan';
    }

    return null;
  }

  /**
   * Get all available asset product types
   */
  static getAssetProductTypes(): string[] {
    return Object.keys(ASSET_PRODUCT_MAPPING);
  }

  /**
   * Get all available liability product types
   */
  static getLiabilityProductTypes(): string[] {
    return Object.keys(LIABILITY_PRODUCT_MAPPING);
  }

  /**
   * Get SFM code for specific product
   */
  static getSFMCodeForProduct(productType: string, isAsset: boolean = true): string | null {
    const mapping = isAsset ? ASSET_PRODUCT_MAPPING : LIABILITY_PRODUCT_MAPPING;
    return mapping[productType.toLowerCase().replace(/\s+/g, '_')] || null;
  }

  /**
   * Validate if SFM code belongs to correct category
   */
  static validateSFMCodeCategory(sfmCode: string, isAsset: boolean): boolean {
    const codeNumber = parseInt(sfmCode.replace('SFM-NAV-', ''));
    
    if (isAsset) {
      return codeNumber >= 3500 && codeNumber <= 3999;
    } else {
      return codeNumber >= 3000 && codeNumber <= 3499;
    }
  }
}

// Export for use in other services
export const AutoAllocateBespoke = SFMBespokeAllocationService;