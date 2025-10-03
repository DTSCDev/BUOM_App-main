import React from 'react';
import { formatCurrency } from '@/utils/pensionCalculations';

interface FreeAPFPeriodCardProps {
  shortfall: number;
}

export const FreeAPFPeriodCard: React.FC<FreeAPFPeriodCardProps> = ({ shortfall }) => {
  // SFM-041: APF Estimated Funding Period calculation
  // Correct APF funding formula: (60,000 - 12,570) x 1.582 = £75,034
  const maxAPFFunding = (60000 - 12570) * 1.582; // £75,034
  const apfYearsRaw = shortfall / maxAPFFunding; // Base calculation using correct formula
  const apfYearsRounded = Math.round(apfYearsRaw); // Rounded value
  const apfYearsWithBuffer = apfYearsRounded + 2; // Add 2 years buffer

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative">
      <div 
        className="text-lg font-semibold mb-4 text-center py-3 px-4 rounded-lg"
        style={{ backgroundColor: '#4FF546', color: 'black' }}
      >
        Advanced Pension Funding Period
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold mb-2" style={{ color: '#4FF546' }}>
          {apfYearsRounded} to {apfYearsWithBuffer} years
        </div>
        <p className="text-sm text-gray-600">
          Time needed to fund the shortfall of {formatCurrency(shortfall)} assuming Maximum APF Funding each tax year, inclusive of costs, fees and charges.
        </p>
      </div>
      
      {/* SFM code for the card */}
      <div className="absolute bottom-0 right-0 text-[8px] text-gray-400">SFM-041</div>
    </div>
  );
};