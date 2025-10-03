/**
 * SFM Auto-Allocation Service
 * 
 * This service automatically assigns SFM codes when new components, assets, 
 * or system fields are created. It ensures no duplicates and maintains 
 * audit trails for all allocations.
 */

import { sfmAllocationRegistry, SFMAllocationUtils } from './sfmAllocationTracker';

export interface AllocationRequest {
  page: string;
  section: string;
  card?: string;
  description: string;
  allocatedBy: string;
  preferredRange?: string;
}

export interface AllocationResult {
  success: boolean;
  sfmCode?: string;
  error?: string;
  allocationInfo?: {
    page: string;
    section: string;
    card?: string;
    description: string;
    allocatedDate: string;
    allocatedBy: string;
  };
}

/**
 * Page to Range Mapping
 * Maps page names to their corresponding SFM code ranges
 */
const PAGE_RANGE_MAPPING: Record<string, string> = {
  'Calculator': 'FREE_CALC',
  'Affordability': 'FREE_CALC',
  'Free Calculator': 'FREE_CALC',
  'APF Dashboard': 'APF_PAGES',
  'APF Registration': 'APF_PAGES',
  'APF Plan Overview': 'APF_PAGES',
  'Profile': 'PROFILE_PAGE',
  'Net Asset Value': 'NET_ASSET_VALUE',
  'NAV': 'NET_ASSET_VALUE',
  'Assets': 'NET_ASSET_VALUE',
  'Liabilities': 'NET_ASSET_VALUE',
  'Calculators': 'CALCULATORS_PAGE',
  'Retirement Calculator': 'CALCULATORS_PAGE',
  'Pension Calculator': 'CALCULATORS_PAGE',
  'Payments': 'PAYMENTS_PAGE',
  'Reports': 'REPORTS_PAGE',
  'Statements': 'STATEMENTS_PAGE',
  'Benefits': 'BENEFITS_PAGE'
};

class SFMAutoAllocationService {
  /**
   * Automatically allocate an SFM code for a new component or field
   */
  public async allocateForComponent(request: AllocationRequest): Promise<AllocationResult> {
    try {
      // Determine the appropriate range
      const rangeKey = request.preferredRange || this.determineRangeFromPage(request.page);
      
      if (!rangeKey) {
        return {
          success: false,
          error: `Unable to determine SFM range for page: ${request.page}`
        };
      }

      // Auto-allocate the next available code
      const sfmCode = SFMAllocationUtils.autoAllocate(rangeKey, {
        page: request.page,
        section: request.section,
        card: request.card,
        description: request.description,
        allocatedBy: request.allocatedBy
      });

      if (!sfmCode) {
        return {
          success: false,
          error: `No available SFM codes in range ${rangeKey} for ${request.page}`
        };
      }

      // Get allocation info for confirmation
      const allocationInfo = SFMAllocationUtils.getAllocationInfo(sfmCode);

      return {
        success: true,
        sfmCode,
        allocationInfo: allocationInfo?.allocatedTo
      };

    } catch (error) {
      return {
        success: false,
        error: `Allocation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Allocate SFM code for a new asset
   */
  public async allocateForAsset(assetName: string, assetCategory: string, allocatedBy: string = 'system'): Promise<AllocationResult> {
    return this.allocateForComponent({
      page: 'Net Asset Value',
      section: 'Assets',
      card: assetCategory,
      description: `Individual Asset: ${assetName}`,
      allocatedBy
    });
  }

  /**
   * Allocate SFM code for a new liability
   */
  public async allocateForLiability(liabilityName: string, liabilityCategory: string, allocatedBy: string = 'system'): Promise<AllocationResult> {
    return this.allocateForComponent({
      page: 'Net Asset Value',
      section: 'Liabilities',
      card: liabilityCategory,
      description: `Individual Liability: ${liabilityName}`,
      allocatedBy
    });
  }

  /**
   * Allocate SFM code for a new system field
   */
  public async allocateForSystemField(fieldName: string, page: string, section: string, allocatedBy: string = 'system'): Promise<AllocationResult> {
    return this.allocateForComponent({
      page,
      section,
      description: `System Field: ${fieldName}`,
      allocatedBy
    });
  }

  /**
   * Batch allocate multiple SFM codes
   */
  public async batchAllocate(requests: AllocationRequest[]): Promise<AllocationResult[]> {
    const results: AllocationResult[] = [];

    for (const request of requests) {
      const result = await this.allocateForComponent(request);
      results.push(result);

      // If allocation fails, log the error but continue with other allocations
      if (!result.success) {
        console.error(`❌ Failed to allocate SFM code for ${request.page} > ${request.section}: ${result.error}`);
      }
    }

    return results;
  }

  /**
   * Determine SFM range from page name
   */
  private determineRangeFromPage(pageName: string): string | null {
    // Direct mapping
    if (PAGE_RANGE_MAPPING[pageName]) {
      return PAGE_RANGE_MAPPING[pageName];
    }

    // Fuzzy matching for variations
    const normalizedPage = pageName.toLowerCase();
    
    if (normalizedPage.includes('calculator') || normalizedPage.includes('affordability')) {
      return 'FREE_CALC';
    }
    
    if (normalizedPage.includes('apf')) {
      return 'APF_PAGES';
    }
    
    if (normalizedPage.includes('profile')) {
      return 'PROFILE_PAGE';
    }
    
    if (normalizedPage.includes('asset') || normalizedPage.includes('nav') || normalizedPage.includes('liability')) {
      return 'NET_ASSET_VALUE';
    }
    
    if (normalizedPage.includes('payment')) {
      return 'PAYMENTS_PAGE';
    }
    
    if (normalizedPage.includes('report')) {
      return 'REPORTS_PAGE';
    }
    
    if (normalizedPage.includes('statement')) {
      return 'STATEMENTS_PAGE';
    }
    
    if (normalizedPage.includes('benefit')) {
      return 'BENEFITS_PAGE';
    }

    return null;
  }

  /**
   * Get allocation statistics
   */
  public getStatistics(): {
    totalAllocated: number;
    totalReserved: number;
    totalAvailable: number;
    rangeBreakdown: Record<string, { allocated: number; reserved: number; available: number; total: number }>;
  } {
    const summary = sfmAllocationRegistry.getAllocationSummary();
    
    let totalAllocated = 0;
    let totalReserved = 0;
    let totalAvailable = 0;
    
    const rangeBreakdown: Record<string, { allocated: number; reserved: number; available: number; total: number }> = {};

    Object.entries(summary).forEach(([rangeKey, range]) => {
      totalAllocated += range.allocatedCount;
      totalReserved += range.reservedCount;
      totalAvailable += range.availableCount;
      
      rangeBreakdown[rangeKey] = {
        allocated: range.allocatedCount,
        reserved: range.reservedCount,
        available: range.availableCount,
        total: range.totalCodes
      };
    });

    return {
      totalAllocated,
      totalReserved,
      totalAvailable,
      rangeBreakdown
    };
  }

  /**
   * Validate system integrity and check for duplicates
   */
  public validateSystemIntegrity(): {
    isValid: boolean;
    duplicates: string[];
    statistics: ReturnType<typeof this.getStatistics>;
    recommendations: string[];
  } {
    const validation = SFMAllocationUtils.validateSystem();
    const statistics = this.getStatistics();
    const recommendations: string[] = [];

    // Generate recommendations based on usage
    Object.entries(statistics.rangeBreakdown).forEach(([rangeKey, stats]) => {
      const usagePercentage = (stats.allocated / stats.total) * 100;
      
      if (usagePercentage > 80) {
        recommendations.push(`⚠️ Range ${rangeKey} is ${usagePercentage.toFixed(1)}% full - consider expanding or optimizing`);
      }
      
      if (stats.reserved > stats.allocated) {
        recommendations.push(`🔄 Range ${rangeKey} has more reserved codes than allocated - review reservations`);
      }
    });

    if (validation.duplicates.length > 0) {
      recommendations.push(`❌ CRITICAL: ${validation.duplicates.length} duplicate allocations found - immediate action required`);
    }

    return {
      isValid: validation.isValid,
      duplicates: validation.duplicates,
      statistics,
      recommendations
    };
  }
}

// Singleton instance
export const sfmAutoAllocationService = new SFMAutoAllocationService();

/**
 * Convenience functions for common allocation scenarios
 */
export const AutoAllocate = {
  /**
   * For new assets
   */
  asset: (assetName: string, category: string) => 
    sfmAutoAllocationService.allocateForAsset(assetName, category),

  /**
   * For new liabilities
   */
  liability: (liabilityName: string, category: string) => 
    sfmAutoAllocationService.allocateForLiability(liabilityName, category),

  /**
   * For new system fields
   */
  systemField: (fieldName: string, page: string, section: string) => 
    sfmAutoAllocationService.allocateForSystemField(fieldName, page, section),

  /**
   * For new components
   */
  component: (request: AllocationRequest) => 
    sfmAutoAllocationService.allocateForComponent(request),

  /**
   * Get system statistics
   */
  getStats: () => sfmAutoAllocationService.getStatistics(),

  /**
   * Validate system
   */
  validate: () => sfmAutoAllocationService.validateSystemIntegrity()
};