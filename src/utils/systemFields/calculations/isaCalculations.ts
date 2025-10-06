
import { calculateUnifiedBUOMValues } from '@/utils/pension/unifiedBuomCalculations';
import { SFMCalculationContext, Asset } from '../types';

// Helper function to calculate ISA value from assets
function calculateISAValueFromAssets(assets: Asset[]): number {
  if (!assets || assets.length === 0) return 0;
  
  const isaAssets = assets.filter(asset => {
    const assetName = asset.name?.toLowerCase() || '';
    const categoryName = asset.category?.name?.toLowerCase() || '';
    
    // Check for ISA in category name
    if (categoryName.includes('isa') || categoryName.includes('cash & isa')) {
      return true;
    }
    
    // Check for ISA in asset name
    if (assetName.includes('isa')) {
      return true;
    }
    
    return false;
  });
  
  const totalISAValue = isaAssets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  
  console.log(`🔧 ISA ASSET CALCULATION:`);
  console.log(`  Found ${isaAssets.length} ISA assets`);
  if (isaAssets.length > 0) {
    isaAssets.forEach(asset => {
      console.log(`    - ${asset.name}: £${asset.value?.toLocaleString()}`);
    });
  }
  console.log(`  Total ISA value: £${totalISAValue.toLocaleString()}`);
  
  return totalISAValue;
}

export function calculateISAValues(sfmId: string, context: SFMCalculationContext, resolveSFM: (id: string) => number): number {
  const { currentAge, existingPensionValue, profile, assets } = context;
  
  switch (sfmId) {
    case "SFM-030A": { // ISA Payday Savings Target (Monthly) - FIXED: Use capital shortfall-based calculation
      // Get capital shortfall (SFM-007)
      const capitalShortfall = resolveSFM('SFM-007') || 0;
      
      // Enhanced ISA rate: £98 per £100k of capital shortfall (monthly)
      const enhancedRate = 98; // £98 per £100k
      const isaMonthly030A = capitalShortfall > 0 ? 
        Math.round((capitalShortfall / 100000) * enhancedRate) : 0;
      
      console.log(`🔧 SFM-030A: Capital Shortfall: £${capitalShortfall.toLocaleString()}`);
      console.log(`🔧 SFM-030A: Enhanced ISA rate: £${enhancedRate} per £100k`);
      console.log(`🔧 SFM-030A: ISA Monthly Target: £${isaMonthly030A.toLocaleString()}`);
      return isaMonthly030A;
    }

    case "SFM-031": { // ISA Savings Value Today - FIXED: Use actual asset data
      const isaValueToday = calculateISAValueFromAssets(assets);
      console.log(`🔧 SFM-031: ISA Value Today (from assets): £${isaValueToday.toLocaleString()}`);
      return isaValueToday;
    }

    case "SFM-032": { // ISA Savings Target Today (Annual) - FIXED: Use SFM-030A × 12
      const monthlyTarget = resolveSFM('SFM-030A');
      const isaTargetAnnual032 = monthlyTarget * 12;
      console.log(`🔧 SFM-032: ISA Target Annual (£${monthlyTarget} × 12): £${isaTargetAnnual032.toLocaleString()}`);
      return isaTargetAnnual032;
    }

    case "SFM-033": { // ISA Progress Percentage - FIXED: Calculate based on actual progress
      const currentISAValue = resolveSFM('SFM-031'); // Current ISA value
      const annualISATarget = resolveSFM('SFM-032'); // Annual ISA target
      
      const progressPercentage = annualISATarget > 0 ? 
        Math.min(100, (currentISAValue / annualISATarget) * 100) : 0;
      
      console.log(`🔧 SFM-033: ISA Progress = £${currentISAValue.toLocaleString()} / £${annualISATarget.toLocaleString()} = ${progressPercentage.toFixed(1)}%`);
      return Math.round(progressPercentage);
    }

    default:
      console.warn(`🚨 UNKNOWN ISA SFM ID: ${sfmId}`);
      return 0;
  }
}
