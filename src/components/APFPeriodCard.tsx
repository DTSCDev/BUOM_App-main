import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface APFPeriodCardProps {
  shortfall: number;
  userGrowthRate: number;
  userInflationRate: number;
  userRetirementAge: number;
  currentAge: number;
  maxAnnualContribution: number;
}

export const APFPeriodCard: React.FC<APFPeriodCardProps> = ({ 
  shortfall,
  userGrowthRate,
  userInflationRate,
  userRetirementAge,
  currentAge,
  maxAnnualContribution
}) => {
  
  // Dynamic APF calculation based on user's selected parameters
  const calculateDynamicAPFPeriod = () => {
    const yearsToRetirement = userRetirementAge - currentAge;
    const realGrowthRate = (userGrowthRate - userInflationRate) / 100;
    
    // Calculate required annual contribution to meet shortfall
    const requiredAnnualContribution = Math.min(
      shortfall / Math.max(yearsToRetirement, 1),
      maxAnnualContribution
    );
    
    // Calculate minimum years needed with maximum contribution
    const minYears = Math.ceil(shortfall / maxAnnualContribution);
    
    // Calculate optimized years with growth consideration
    const optimizedYears = Math.ceil(
      Math.log(1 + (shortfall * realGrowthRate) / maxAnnualContribution) / 
      Math.log(1 + realGrowthRate)
    );
    
    // Ensure realistic bounds
    const finalMinYears = Math.max(minYears, 3);
    const finalMaxYears = Math.min(optimizedYears + 2, yearsToRetirement, 10);
    
    return {
      minYears: finalMinYears,
      maxYears: Math.max(finalMaxYears, finalMinYears + 1),
      requiredAnnualContribution,
      yearsToRetirement
    };
  };

  const apfCalculation = calculateDynamicAPFPeriod();
  const periodRange = `${apfCalculation.minYears} - ${apfCalculation.maxYears}`;

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-gray-200 rounded-lg text-center">
      <div className="text-sm font-medium text-gray-700">
        Advanced Pension Funding Period:
      </div>
      <div className="text-xl font-bold text-blue-600 my-1">
        {periodRange} years
      </div>
      <div className="text-xs text-gray-600">
        Based on maximum annual pension contribution of £{maxAnnualContribution.toLocaleString()}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        SFM-CAL-4132
      </div>
    </div>
  );
};