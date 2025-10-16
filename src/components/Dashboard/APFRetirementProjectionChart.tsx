import React from 'react';
import { ComposedChart, Bar, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRetirementCalculatorHub } from '@/hooks/useRetirementCalculatorHub';
import { useProfile } from '@/hooks/useProfile';
import { calculateAge } from '@/utils/pensionCalculations';
import { getPensionParameters } from '@/utils/pensionParameters';

interface APFRetirementProjectionChartProps {
  className?: string;
}

interface ChartDataPoint {
  age: number;
  existingFundValue: number;        // Gray-700 stacked bar
  futureAEContributions: number;    // Gray-400 stacked bar  
  capitalTarget: number;            // Purple line
}

const APFRetirementProjectionChart: React.FC<APFRetirementProjectionChartProps> = ({ className }) => {
  const { profile } = useProfile();
  const hub = useRetirementCalculatorHub();
  const params = getPensionParameters();

  // Generate chart data points from current age to age 68 maximum
  const generateChartData = (): ChartDataPoint[] => {
    if (!profile?.date_of_birth || !hub) {
      return [];
    }

    const currentAge = calculateAge(new Date(profile.date_of_birth)).years;
    const retirementAge = profile.retirement_age || 67;
    const maxAge = Math.min(68, retirementAge + 5); // Restrict to age 68 maximum
    const data: ChartDataPoint[] = [];

    // CAL-4401: Growth Rate (Accumulation Phase)
    const growthRate = params.growthRateAccumulation; // 5% gross
    // CAL-4403: Provider Charges
    const providerCharges = params.providerCharges; // 0.5%
    // Net growth rate after charges
    const netGrowthRate = growthRate - providerCharges; // 4.5% net

    // Create data points from current age to age 68 maximum
    for (let age = currentAge; age <= maxAge; age++) {
      const yearsFromNow = age - currentAge;
      const isRetired = age > retirementAge;

      // For simplicity, we'll use the final values from hub and project them
      // In a real implementation, you'd calculate year-by-year projections
      let existingFundValue = 0;
      let futureAEContributions = 0;
      const capitalTarget = hub.cal4120_requiredCapital || 0;

      if (age === retirementAge) {
        // At retirement, show the full projected values with growth applied and charges deducted
        const baseExistingValue = hub.cal4115_estimatedExistingPensionFundValue || 0;
        const baseFutureContributions = hub.cal4117_futureAEContributions || 0;
        
        // Apply net growth rate (growth minus charges) over the years to retirement
        const growthFactor = Math.pow(1 + netGrowthRate, yearsFromNow);
        existingFundValue = baseExistingValue * growthFactor;
        futureAEContributions = baseFutureContributions * growthFactor;
      } else if (age < retirementAge) {
        // Before retirement, show progressive build-up with growth and charges
        const progressRatio = yearsFromNow / (retirementAge - currentAge);
        const baseExistingValue = hub.cal4115_estimatedExistingPensionFundValue || 0;
        const baseFutureContributions = hub.cal4117_futureAEContributions || 0;
        
        // Apply growth factor for the years elapsed
        const growthFactor = Math.pow(1 + netGrowthRate, yearsFromNow);
        existingFundValue = (baseExistingValue * (0.3 + 0.7 * progressRatio)) * growthFactor;
        futureAEContributions = (baseFutureContributions * progressRatio) * growthFactor;
      } else {
        // After retirement, show drawdown with charges continuing to be deducted
        const yearsAfterRetirement = age - retirementAge;
        const baseExistingValue = hub.cal4115_estimatedExistingPensionFundValue || 0;
        const baseFutureContributions = hub.cal4117_futureAEContributions || 0;
        
        // Apply growth to retirement, then drawdown with charges
        const growthToRetirement = Math.pow(1 + netGrowthRate, retirementAge - currentAge);
        const drawdownWithCharges = Math.pow(1 - params.drawdownRate - providerCharges, yearsAfterRetirement);
        
        existingFundValue = baseExistingValue * growthToRetirement * drawdownWithCharges;
        futureAEContributions = baseFutureContributions * growthToRetirement * drawdownWithCharges;
      }

      data.push({
        age,
        existingFundValue: Math.round(existingFundValue),
        futureAEContributions: Math.round(futureAEContributions),
        capitalTarget: Math.round(capitalTarget)
      });
    }

    return data;
  };

  const chartData = generateChartData();

  // Format Y-axis values in thousands/millions
  const formatYAxis = (value: number): string => {
    if (value >= 1000000) {
      return `£${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `£${(value / 1000).toFixed(0)}K`;
    }
    return `£${value}`;
  };

  // Custom tooltip formatter
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string | number;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{`Age: ${label}`}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatYAxis(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className={`bg-white p-6 rounded-lg border ${className}`}>
        <h3 className="text-lg font-semibold mb-4">APF Retirement Projection</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Complete your profile to see your retirement projection
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 rounded-lg border ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">APF Retirement Projection</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="age" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            stroke="#666"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Existing Fund Value - Gray-700 stacked bar */}
          <Bar
            dataKey="existingFundValue"
            stackId="2"
            fill="#374151"
            name="Existing Fund Value"
          />
          
          {/* Future AE Contributions - Gray-400 stacked bar */}
          <Bar
            dataKey="futureAEContributions"
            stackId="2"
            fill="#9CA3AF"
            name="Future AE Contributions"
          />
          
          {/* Capital Target - Purple line */}
          <Line
            type="monotone"
            dataKey="capitalTarget"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={false}
            name="Capital Target"
          />
        </ComposedChart>
      </ResponsiveContainer>

    </div>
  );
};

export default APFRetirementProjectionChart;