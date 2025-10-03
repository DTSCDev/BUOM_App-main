import { DynamicINBLData } from './dynamicINBLCalculator';

export const processRedemptionEvent = (
  month: number, 
  isaCumulativeValue: number,
  inblData?: DynamicINBLData
) => {
  let redemptionEvent = undefined;
  let updatedISAValue = isaCumulativeValue;
  
  // If no dynamic data, return unchanged values
  if (!inblData) {
    return {
      updatedISAValue,
      redemptionEvent
    };
  }
  
  // Dynamic redemption processing for any number of sponsorship years
  for (let yearIndex = 0; yearIndex < inblData.sponsorshipCount; yearIndex++) {
    const redemptionMonth = 241 + (yearIndex * 12); // Year 1: 241, Year 2: 253, Year 3: 265, etc.
    
    if (month === redemptionMonth) {
      const npgAmount = inblData.npgAmounts[yearIndex] || 0;
      const inblAmount = inblData.inblAmounts[yearIndex] || 0;
      
      updatedISAValue = Math.max(0, isaCumulativeValue - npgAmount);
      redemptionEvent = {
        tranche: yearIndex + 1,
        inblRepayment: inblAmount,
        npgReduction: npgAmount
      };
      
      console.log(`Month ${month}: Year ${yearIndex + 1} redemption - ISA reduced by £${npgAmount.toLocaleString()}, INBL repaid £${inblAmount.toLocaleString()}`);
      break; // Only one redemption per month
    }
  }
  
  return {
    updatedISAValue,
    redemptionEvent
  };
};
