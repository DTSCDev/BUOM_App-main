import React from 'react';
import { FreePensionCalculationResults } from '../FreeCalculatorResults';
import { useFreeCentralisedCalculations } from '@/hooks/useFreeCentralisedCalculations';

interface FreeKeyMetricsCardProps {
  results: FreePensionCalculationResults;
}

export function FreeKeyMetricsCard({ results }: FreeKeyMetricsCardProps) {
  const calculations = useFreeCentralisedCalculations(results);
  
  const formatYearsMonths = (totalMonths: number) => {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return `${years} years ${months.toString().padStart(2, '0')} months`;
  };

  return (
  <div className="p-4 rounded-lg border" style={{ backgroundColor: '#4FF456', borderColor: '#4FF456' }}>
      <h3 className="font-semibold mb-3 text-gray-700">Key Metrics</h3>
      
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between relative pb-6">
          <span>Current Age</span>
          <span className="font-medium text-gray-700">{calculations.keyMetrics.currentAge} years</span>
          <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
            SFM-017
          </div>
        </div>

        <div className="flex justify-between relative pb-6">
          <span>Time to Retirement</span>
          <span className="font-medium text-gray-700">{formatYearsMonths(calculations.keyMetrics.monthsToRetirement)}</span>
          <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
            SFM-018
          </div>
        </div>

        <div className="flex justify-between relative pb-6">
          <span>Days Until Pension</span>
          <span className="font-medium text-gray-700">{calculations.keyMetrics.daysToRetirement?.toLocaleString()}</span>
          <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
            SFM-019
          </div>
        </div>

        <div className="flex justify-between relative pb-6">
          <span>Paydays Remaining</span>
          <span className="font-medium text-gray-700">{calculations.keyMetrics.paydaysRemaining?.toLocaleString()}</span>
          <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
            SFM-020
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreeKeyMetricsCard;