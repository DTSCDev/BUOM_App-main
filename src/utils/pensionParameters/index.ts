
// Main export file for pension parameters
export { DEFAULT_PENSION_PARAMETERS, SUBSCRIPTION_OPTIONS } from './constants';
export type { PensionParametersConfig, AssetProjectionParameters } from './types';
export { hasActiveSubscription } from './subscription';
export { 
  getAssetProjectionParameters, 
  calculateWeightedPortfolioReturn 
} from './calculations';

import { DEFAULT_PENSION_PARAMETERS } from './constants';
import { PensionParametersConfig } from './types';
import { hasActiveSubscription } from './subscription';

// Get pension parameters based on subscription status - SINGLE SOURCE OF TRUTH
export const getPensionParameters = (): PensionParametersConfig => {
  const isPremium = hasActiveSubscription();
  
  return {
    ...DEFAULT_PENSION_PARAMETERS,
    isCustomizable: isPremium,
  };
};
