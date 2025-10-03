/**
 * SFM Code Allocation Tracker
 * 
 * This system manages the complete allocation of all SFM codes across the 9 XXX ranges.
 * It prevents duplicates by maintaining a centralized allocation registry and 
 * automatically assigns the next available code when requested.
 * 
 * CRITICAL: This system operates on pre-allocated code pools. All codes must be 
 * defined in advance and checked for availability before assignment.
 */

export interface SFMAllocation {
  sfmCode: string;
  status: 'allocated' | 'reserved' | 'unallocated';
  allocatedTo?: {
    page: string;
    section: string;
    card?: string;
    description: string;
    allocatedDate: string;
    allocatedBy: string; // system, user, or component name
  };
  reservedFor?: {
    purpose: string;
    reservedDate: string;
    expiryDate?: string;
  };
}

export interface SFMCodeRange {
  prefix: string;
  description: string;
  startCode: number;
  endCode: number;
  totalCodes: number;
  allocatedCount: number;
  reservedCount: number;
  availableCount: number;
}

/**
 * Complete SFM Code Range Definitions
 * Based on the 9 XXX variable system with XXXX or XXXX-X patterns
 */
export const SFM_CODE_RANGES: Record<string, SFMCodeRange> = {
  // Free Calculator & Affordability: SFM-0XX-X series (000-099)
  'FREE_CALC': {
    prefix: 'SFM-0',
    description: 'Free Calculator & Affordability',
    startCode: 1,
    endCode: 99,
    totalCodes: 99,
    allocatedCount: 0,
    reservedCount: 0,
    availableCount: 99
  },
  
  // APF Pages & Sub Pages: SFM-APF-1XXX-X series (1000-1999)
  'APF_PAGES': {
    prefix: 'SFM-APF-1',
    description: 'APF Pages & Sub Pages',
    startCode: 1000,
    endCode: 1999,
    totalCodes: 1000,
    allocatedCount: 0,
    reservedCount: 0,
    availableCount: 1000
  },
  
  // Profile Page: SFM-PRF-2XXX-X series (2000-2999)
  'PROFILE_PAGE': {
    prefix: 'SFM-PRF-2',
    description: 'Profile Page',
    startCode: 2000,
    endCode: 2999,
    totalCodes: 1000,
    allocatedCount: 0,
    reservedCount: 0,
    availableCount: 1000
  },
  
  // Net Asset Value: SFM-NAV-3XXX-X series (3000-3999)
  'NET_ASSET_VALUE': {
    prefix: 'SFM-NAV-3',
    description: 'Net Asset Value',
    startCode: 3000,
    endCode: 3999,
    totalCodes: 1000,
    allocatedCount: 0,
    reservedCount: 0,
    availableCount: 1000
  },
  
  // Calculators Page: SFM-CAL-4XXX-X series (4000-4999)
  'CALCULATORS_PAGE': {
    prefix: 'SFM-CAL-4',
    description: 'Calculators Page',
    startCode: 4000,
    endCode: 4999,
    totalCodes: 1000,
    allocatedCount: 0,
    reservedCount: 0,
    availableCount: 1000
  },
  
  // Payments Page: SFM-PAY-5XXX-X series (5000-5999)
  'PAYMENTS_PAGE': {
    prefix: 'SFM-PAY-5',
    description: 'Payments Page',
    startCode: 5000,
    endCode: 5999,
    totalCodes: 1000,
    allocatedCount: 0,
    reservedCount: 0,
    availableCount: 1000
  },
  
  // Reports Page: SFM-REP-6XXX-X series (6000-6999)
  'REPORTS_PAGE': {
    prefix: 'SFM-REP-6',
    description: 'Reports Page',
    startCode: 6000,
    endCode: 6999,
    totalCodes: 1000,
    allocatedCount: 0,
    reservedCount: 0,
    availableCount: 1000
  },
  
  // Statements Page: SFM-STA-7XXX-X series (7000-7999)
  'STATEMENTS_PAGE': {
    prefix: 'SFM-STA-7',
    description: 'Statements Page',
    startCode: 7000,
    endCode: 7999,
    totalCodes: 1000,
    allocatedCount: 0,
    reservedCount: 0,
    availableCount: 1000
  },
  
  // FREE Benefits Page: SFM-BEN-8XXX-X series (8000-8999)
  'BENEFITS_PAGE': {
    prefix: 'SFM-BEN-8',
    description: 'FREE Benefits Page',
    startCode: 8000,
    endCode: 8999,
    totalCodes: 1000,
    allocatedCount: 0,
    reservedCount: 0,
    availableCount: 1000
  }
};

/**
 * In-memory allocation registry
 * In production, this would be stored in a database or persistent storage
 */
class SFMAllocationRegistry {
  private allocations: Map<string, SFMAllocation> = new Map();
  private initialized: boolean = false;

  /**
   * Initialize the allocation registry with all possible SFM codes
   */
  public initialize(): void {
    if (this.initialized) return;

    console.log('🔧 Initializing SFM Allocation Registry...');
    
    // Pre-allocate all possible SFM codes
    Object.entries(SFM_CODE_RANGES).forEach(([rangeKey, range]) => {
      for (let i = range.startCode; i <= range.endCode; i++) {
        const sfmCode = this.generateSFMCode(range.prefix, i);
        this.allocations.set(sfmCode, {
          sfmCode,
          status: 'unallocated'
        });
      }
    });

    this.initialized = true;
    console.log(`✅ SFM Allocation Registry initialized with ${this.allocations.size} codes`);
  }

  /**
   * Generate SFM code based on prefix and number
   */
  private generateSFMCode(prefix: string, codeNumber: number): string {
    // Handle different prefix formats
    if (prefix.includes('APF') || prefix.includes('PRF') || prefix.includes('NAV') || 
        prefix.includes('CAL') || prefix.includes('PAY') || prefix.includes('REP') || 
        prefix.includes('STA') || prefix.includes('BEN')) {
      return `${prefix}${codeNumber.toString().padStart(3, '0')}`;
    } else {
      // Free calculator format: SFM-0XX
      return `${prefix}${codeNumber.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Get the next available SFM code in a specific range
   */
  public getNextAvailableCode(rangeKey: string, purpose: {
    page: string;
    section: string;
    card?: string;
    description: string;
    allocatedBy: string;
  }): string | null {
    this.initialize();

    const range = SFM_CODE_RANGES[rangeKey];
    if (!range) {
      throw new Error(`Invalid SFM range key: ${rangeKey}`);
    }

    // Find the first unallocated code in the range
    for (let i = range.startCode; i <= range.endCode; i++) {
      const sfmCode = this.generateSFMCode(range.prefix, i);
      const allocation = this.allocations.get(sfmCode);
      
      if (allocation && allocation.status === 'unallocated') {
        // Allocate this code
        allocation.status = 'allocated';
        allocation.allocatedTo = {
          ...purpose,
          allocatedDate: new Date().toISOString()
        };

        this.updateRangeCounters();
        console.log(`✅ Allocated SFM code ${sfmCode} for ${purpose.page} > ${purpose.section}`);
        return sfmCode;
      }
    }

    console.warn(`⚠️ No available SFM codes in range ${rangeKey} (${range.description})`);
    return null;
  }

  /**
   * Allocate a specific SFM code
   */
  public allocateCode(sfmCode: string, purpose: {
    page: string;
    section: string;
    card?: string;
    description: string;
    allocatedBy: string;
  }): boolean {
    this.initialize();

    const allocation = this.allocations.get(sfmCode);
    if (!allocation) {
      throw new Error(`SFM code ${sfmCode} does not exist in registry`);
    }

    if (allocation.status !== 'unallocated') {
      console.warn(`⚠️ SFM code ${sfmCode} is already ${allocation.status}`);
      return false;
    }

    allocation.status = 'allocated';
    allocation.allocatedTo = {
      ...purpose,
      allocatedDate: new Date().toISOString()
    };

    this.updateRangeCounters();
    console.log(`✅ Allocated specific SFM code ${sfmCode}`);
    return true;
  }

  /**
   * Reserve an SFM code for future use
   */
  public reserveCode(sfmCode: string, purpose: {
    purpose: string;
    expiryDate?: string;
  }): boolean {
    this.initialize();

    const allocation = this.allocations.get(sfmCode);
    if (!allocation) {
      throw new Error(`SFM code ${sfmCode} does not exist in registry`);
    }

    if (allocation.status !== 'unallocated') {
      console.warn(`⚠️ SFM code ${sfmCode} is already ${allocation.status}`);
      return false;
    }

    allocation.status = 'reserved';
    allocation.reservedFor = {
      ...purpose,
      reservedDate: new Date().toISOString()
    };

    this.updateRangeCounters();
    console.log(`🔒 Reserved SFM code ${sfmCode}`);
    return true;
  }

  /**
   * Release a reserved or allocated SFM code
   */
  public releaseCode(sfmCode: string): boolean {
    this.initialize();

    const allocation = this.allocations.get(sfmCode);
    if (!allocation) {
      throw new Error(`SFM code ${sfmCode} does not exist in registry`);
    }

    if (allocation.status === 'unallocated') {
      console.warn(`⚠️ SFM code ${sfmCode} is already unallocated`);
      return false;
    }

    // Reset allocation
    allocation.status = 'unallocated';
    delete allocation.allocatedTo;
    delete allocation.reservedFor;

    this.updateRangeCounters();
    console.log(`🔄 Released SFM code ${sfmCode}`);
    return true;
  }

  /**
   * Get allocation status for a specific code
   */
  public getAllocationStatus(sfmCode: string): SFMAllocation | null {
    this.initialize();
    return this.allocations.get(sfmCode) || null;
  }

  /**
   * Get all allocations in a specific range
   */
  public getAllocationsInRange(rangeKey: string): SFMAllocation[] {
    this.initialize();

    const range = SFM_CODE_RANGES[rangeKey];
    if (!range) {
      throw new Error(`Invalid SFM range key: ${rangeKey}`);
    }

    const allocations: SFMAllocation[] = [];
    for (let i = range.startCode; i <= range.endCode; i++) {
      const sfmCode = this.generateSFMCode(range.prefix, i);
      const allocation = this.allocations.get(sfmCode);
      if (allocation) {
        allocations.push(allocation);
      }
    }

    return allocations;
  }

  /**
   * Get allocation summary for all ranges
   */
  public getAllocationSummary(): Record<string, SFMCodeRange> {
    this.initialize();
    this.updateRangeCounters();
    return { ...SFM_CODE_RANGES };
  }

  /**
   * Update range counters based on current allocations
   */
  private updateRangeCounters(): void {
    // Reset counters
    Object.values(SFM_CODE_RANGES).forEach(range => {
      range.allocatedCount = 0;
      range.reservedCount = 0;
      range.availableCount = range.totalCodes;
    });

    // Count allocations
    this.allocations.forEach(allocation => {
      const rangeKey = this.getRangeKeyForCode(allocation.sfmCode);
      if (rangeKey) {
        const range = SFM_CODE_RANGES[rangeKey];
        if (allocation.status === 'allocated') {
          range.allocatedCount++;
          range.availableCount--;
        } else if (allocation.status === 'reserved') {
          range.reservedCount++;
          range.availableCount--;
        }
      }
    });
  }

  /**
   * Get range key for a specific SFM code
   */
  private getRangeKeyForCode(sfmCode: string): string | null {
    for (const [rangeKey, range] of Object.entries(SFM_CODE_RANGES)) {
      if (sfmCode.startsWith(range.prefix)) {
        return rangeKey;
      }
    }
    return null;
  }

  /**
   * Validate that no duplicate allocations exist
   */
  public validateNoDuplicates(): { isValid: boolean; duplicates: string[] } {
    this.initialize();

    const duplicates: string[] = [];
    const allocatedCodes = new Set<string>();

    this.allocations.forEach(allocation => {
      if (allocation.status === 'allocated') {
        if (allocatedCodes.has(allocation.sfmCode)) {
          duplicates.push(allocation.sfmCode);
        } else {
          allocatedCodes.add(allocation.sfmCode);
        }
      }
    });

    return {
      isValid: duplicates.length === 0,
      duplicates
    };
  }

  /**
   * Export allocation data for audit purposes
   */
  public exportAllocationData(): {
    summary: Record<string, SFMCodeRange>;
    allocations: SFMAllocation[];
    validation: { isValid: boolean; duplicates: string[] };
  } {
    this.initialize();

    return {
      summary: this.getAllocationSummary(),
      allocations: Array.from(this.allocations.values()).filter(a => a.status !== 'unallocated'),
      validation: this.validateNoDuplicates()
    };
  }
}

// Singleton instance
export const sfmAllocationRegistry = new SFMAllocationRegistry();

/**
 * Utility functions for easy access
 */
export const SFMAllocationUtils = {
  /**
   * Auto-allocate the next available SFM code for a specific purpose
   */
  autoAllocate: (rangeKey: string, purpose: {
    page: string;
    section: string;
    card?: string;
    description: string;
    allocatedBy: string;
  }): string | null => {
    return sfmAllocationRegistry.getNextAvailableCode(rangeKey, purpose);
  },

  /**
   * Allocate a specific SFM code if available
   */
  allocateSpecificCode: (sfmCode: string, purpose?: {
    page?: string;
    section?: string;
    card?: string;
    description?: string;
    allocatedBy?: string;
  }): string | null => {
    const status = sfmAllocationRegistry.getAllocationStatus(sfmCode);
    
    if (!status || status.status !== 'unallocated') {
      console.warn(`SFM code ${sfmCode} is not available for allocation`);
      return null;
    }

    // Allocate the specific code
    const allocation: SFMAllocation = {
      sfmCode,
      status: 'allocated',
      allocatedTo: {
        page: purpose?.page || 'Net Asset Value',
        section: purpose?.section || 'Bespoke Product Allocation',
        card: purpose?.card,
        description: purpose?.description || `Specific allocation for ${sfmCode}`,
        allocatedBy: purpose?.allocatedBy || 'SFMBespokeAllocationService',
        allocatedDate: new Date().toISOString()
      }
    };

    sfmAllocationRegistry.allocateCode(sfmCode, allocation.allocatedTo);
    return sfmCode;
  },

  /**
   * Check if a specific SFM code is available
   */
  isAvailable: (sfmCode: string): boolean => {
    const status = sfmAllocationRegistry.getAllocationStatus(sfmCode);
    return status?.status === 'unallocated';
  },

  /**
   * Get allocation info for a specific code
   */
  getAllocationInfo: (sfmCode: string): SFMAllocation | null => {
    return sfmAllocationRegistry.getAllocationStatus(sfmCode);
  },

  /**
   * Get summary of all ranges
   */
  getSummary: (): {
    totalCodes: number;
    allocatedCodes: number;
    reservedCodes: number;
    availableCodes: number;
    ranges: Array<{
      name: string;
      allocated: number;
      reserved: number;
      available: number;
      total: number;
    }>;
  } => {
    const summary = sfmAllocationRegistry.getAllocationSummary();
    
    let totalCodes = 0;
    let allocatedCodes = 0;
    let reservedCodes = 0;
    let availableCodes = 0;
    
    const ranges = Object.entries(summary).map(([key, range]) => {
      totalCodes += range.totalCodes;
      allocatedCodes += range.allocatedCount;
      reservedCodes += range.reservedCount;
      availableCodes += range.availableCount;
      
      return {
        name: range.description,
        allocated: range.allocatedCount,
        reserved: range.reservedCount,
        available: range.availableCount,
        total: range.totalCodes
      };
    });

    return {
      totalCodes,
      allocatedCodes,
      reservedCodes,
      availableCodes,
      ranges
    };
  },

  /**
   * Validate system integrity
   */
  validateSystem: (): { isValid: boolean; duplicates: string[] } => {
    return sfmAllocationRegistry.validateNoDuplicates();
  },

  /**
   * Export allocation data for audit purposes
   */
  exportAllocationData: () => {
    return sfmAllocationRegistry.exportAllocationData();
  }
};