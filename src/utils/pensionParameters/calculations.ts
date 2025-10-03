
import { DEFAULT_PENSION_PARAMETERS } from './constants';
import { AssetProjectionParameters } from './types';
import { hasActiveSubscription } from './subscription';

// Get asset-specific parameters for premium users
export const getAssetProjectionParameters = (assetId: string): AssetProjectionParameters | null => {
  const isPremium = hasActiveSubscription();
  if (!isPremium) return null;
  
  // This would normally fetch from user's custom settings
  // For now, return default structure
  return {
    assetId,
    riskProfile: 'moderate',
    assetClass: 'pension'
  };
};

// Calculate weighted portfolio return for premium users
export const calculateWeightedPortfolioReturn = (assets: any[]): number => {
  const isPremium = hasActiveSubscription();
  if (!isPremium || !assets.length) {
    return DEFAULT_PENSION_PARAMETERS.growthRateAccumulation;
  }
  
  let totalValue = 0;
  let weightedReturn = 0;
  
  assets.forEach(asset => {
    const assetParams = getAssetProjectionParameters(asset.id);
    const assetGrowthRate = assetParams?.customGrowthRate || DEFAULT_PENSION_PARAMETERS.growthRateAccumulation;
    const assetFees = assetParams?.customProviderCharges || DEFAULT_PENSION_PARAMETERS.providerCharges;
    const netReturn = assetGrowthRate - assetFees;
    
    totalValue += asset.value;
    weightedReturn += asset.value * netReturn;
  });
  
  return totalValue > 0 ? weightedReturn / totalValue : DEFAULT_PENSION_PARAMETERS.growthRateAccumulation;
};
