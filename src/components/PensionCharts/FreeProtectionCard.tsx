import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/pensionCalculations';

interface ProtectionChartData {
  age: number;
  lifeCoverNeed: number;
  year: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    name: string;
  }>;
  label?: string;
}

interface FreeProtectionCardProps {
  targetIncomeToday: number; // SFM-013
  existingPensionValue: number; // SFM-022
  currentAge?: number;
  retirementAge?: number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">Age {label}</p>
        <p className="text-sm text-blue-600">
          Life Cover Need: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const VerticalSFMLabel: React.FC<{ sfmCode: string }> = ({ sfmCode }) => (
  <div className="absolute bottom-2 right-2 text-xs text-gray-400 font-mono">
    {sfmCode}
  </div>
);

export const FreeProtectionCard: React.FC<FreeProtectionCardProps> = ({ 
  targetIncomeToday,
  existingPensionValue,
  currentAge = 42,
  retirementAge = 67
}) => {
  // Calculate SFM-042: Lump Sum Cost of Target Income Today (SFM-013 / 3.5%)
  const lumpSumCost = targetIncomeToday / 0.035;
  
  // Calculate SFM-043: Estimated Life Cover Need (SFM-042 - SFM-022)
  const currentLifeCoverNeed = lumpSumCost - existingPensionValue;

  // Generate chart data for annual progression
  const generateChartData = (): ProtectionChartData[] => {
    const data: ProtectionChartData[] = [];
    const yearsToRetirement = retirementAge - currentAge;
    const inflationRate = 0.02; // FIXED: Changed from 0.025 to match unified 2% rate
    const fundGrowthRate = 0.05; // 5% fund growth
    
    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = currentAge + year;
      
      // Target income grows with inflation
      const inflatedTargetIncome = targetIncomeToday * Math.pow(1 + inflationRate, year);
      
      // Lump sum cost at 3.5% drawdown rate
      const inflatedLumpSumCost = inflatedTargetIncome / 0.035;
      
      // Existing pension value grows with fund growth
      const grownPensionValue = existingPensionValue * Math.pow(1 + fundGrowthRate, year);
      
      // Life cover need = inflated lump sum cost - grown pension value
      const lifeCoverNeed = Math.max(0, inflatedLumpSumCost - grownPensionValue);
      
      data.push({
        age,
        lifeCoverNeed,
        year
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  
  // Filter data to show only 5-year intervals for x-axis labels
  const getXAxisTicks = () => {
    return chartData
      .filter((_, index) => index % 5 === 0 || index === chartData.length - 1)
      .map(item => item.age);
  };

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Header with red background */}
      <div 
        className="-mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-lg bg-red-600"
      >
        <h3 className="text-2xl font-semibold text-white text-center">
          Estimated Life Cover Need
        </h3>
      </div>

      {/* Current Life Cover Need Display */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-red-600 mb-2">
          {formatCurrency(currentLifeCoverNeed)}
        </div>
        <p className="text-sm text-gray-600">
          Current life cover needed after existing pension value
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Based on {formatCurrency(targetIncomeToday)} target income at 3.5% drawdown
        </p>
      </div>

      {/* Line Chart */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="age"
              ticks={getXAxisTicks()}
              domain={['dataMin', 'dataMax']}
              type="number"
              scale="linear"
              tickFormatter={(value) => `${value}`}
              className="text-xs"
            />
            <YAxis 
              tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
              className="text-xs"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="lifeCoverNeed" 
              stroke="#dc2626" 
              strokeWidth={3}
              dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Description */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">
          Life cover need progression from age {currentAge} to {retirementAge}
        </p>
        <p className="text-xs text-gray-500">
          Accounts for inflation on target income and growth on existing pension
        </p>
      </div>

      {/* SFM Code Label */}
      <VerticalSFMLabel sfmCode="SFM-043" />
    </div>
  );
};