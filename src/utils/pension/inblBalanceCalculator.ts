
import { DynamicINBLData, calculateDynamicINBLBalances } from './dynamicINBLCalculator';

export const calculateINBLBalances = (month: number, inblData?: DynamicINBLData) => {
  // If no dynamic data provided, return zeros (fallback for legacy code)
  if (!inblData) {
    return {
      year1INBLBalance: 0,
      year2INBLBalance: 0,
      year3INBLBalance: 0,
      totalINBLBalance: 0
    };
  }
  
  const dynamicResult = calculateDynamicINBLBalances(month, inblData);
  
  // Return in legacy format for backward compatibility while supporting dynamic data
  return {
    year1INBLBalance: dynamicResult.inblBalances[0] || 0,
    year2INBLBalance: dynamicResult.inblBalances[1] || 0,
    year3INBLBalance: dynamicResult.inblBalances[2] || 0,
    totalINBLBalance: dynamicResult.totalINBLBalance
  };
};
