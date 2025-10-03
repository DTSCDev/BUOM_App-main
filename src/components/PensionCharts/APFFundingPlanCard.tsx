
import React from 'react';
import { formatCurrency } from '@/utils/pensionCalculations';

interface APFFundingPlanCardProps {
  shortfall: number;
}

export const APFFundingPlanCard: React.FC<APFFundingPlanCardProps> = ({ shortfall }) => {
  // ONLY THE APF YEARS CALCULATION LOGIC
  const buomSolutionValue = 94800;
  const apfYearsRaw = shortfall / buomSolutionValue;
  const minYears = Math.ceil(apfYearsRaw);
  const maxYears = minYears + 2;

  return (
    <div className="text-center mt-6 space-y-2">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="font-medium text-gray-800">APF Funding Period:</div>
        <div className="text-xl font-bold mt-2">
          {minYears} - {maxYears} years
        </div>
      </div>
    </div>
  );
};
