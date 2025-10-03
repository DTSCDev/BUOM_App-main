import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/pensionCalculations';

interface CostComparisonChartProps {
  monthlyFundingCost: number;
  buomMonthlyCost: number;
  totalStandardCost: number;
  totalBUOMCost: number;
  onChangeTab: (tab: string) => void;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
  label?: string;
}

const BarTooltip = ({
  active,
  payload,
  label
}: TooltipProps) => {
  if (active && payload && payload.length) {
    return <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry, index: number) => <p key={`item-${index}`} className="text-sm">
            <span className="inline-block w-3 h-3 mr-2" style={{
          backgroundColor: entry.fill
        }}></span>
            <span>{entry.name}: {formatCurrency(entry.value)}</span>
          </p>)}
      </div>;
  }
  return null;
};

// Custom label component for vertical SFM codes
const VerticalSFMLabel = (props: {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  sfmCode: string;
  isGreenBar?: boolean;
}) => {
  const { x, y, width, height, value, sfmCode, isGreenBar } = props;
  const labelX = x + width / 2; // Center the amount in the bar
  const labelY = y + height / 2; // Center vertically
  const sfmX = x + width + 8; // Position SFM code with 8px gap from bar
  const sfmY = y + height / 2; // Center SFM code vertically with the bar
  
  return (
    <g>
      {/* Currency amount centered in the bar */}
      <text 
        x={labelX} 
        y={labelY} 
        fill={isGreenBar ? "#000" : "#fff"} 
        fontSize="20" 
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {formatCurrency(value)}
      </text>
      {/* SFM code positioned with gap from bar and vertically centered */}
      <text 
        x={sfmX} 
        y={sfmY} 
        fill="#666" 
        fontSize="8" 
        textAnchor="middle"
        dominantBaseline="central"
        transform={`rotate(-90, ${sfmX}, ${sfmY})`}
      >
        {sfmCode}
      </text>
    </g>
  );
};

export const CostComparisonChart: React.FC<CostComparisonChartProps> = ({
  monthlyFundingCost,
  buomMonthlyCost,
  totalStandardCost,
  totalBUOMCost,
  onChangeTab
}) => {
  // Monthly cost bar chart data
  const monthlyBarData = [{
    name: 'Monthly Cost',
    'Existing Pension Plan': monthlyFundingCost,
    'Best Use Of Money': buomMonthlyCost
  }];

  // Total cost bar chart data
  const totalBarData = [{
    name: 'Total Cost',
    'Existing Pension Plan': totalStandardCost,
    'Best Use Of Money': totalBUOMCost
  }];

  return <div className="flex flex-col h-full">
      <div className="space-y-6">
        {/* Monthly Cost Chart */}
        <div className="relative">
          <h3 className="text-base font-semibold mb-2 text-center">Monthly Top Up Contribution</h3>
          <div className="w-full h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBarData} layout="vertical" margin={{
              top: 5,
              right: 80,
              left: 20,
              bottom: 5
            }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={0} tick={false} />
                <Tooltip content={<BarTooltip />} />
                <Bar 
                  dataKey="Existing Pension Plan" 
                  fill="#7c3aed" 
                  name="Existing Plan" 
                  label={(props) => <VerticalSFMLabel {...props} sfmCode="SFM-CAL-4128" />}
                />
                <Bar 
                  dataKey="Best Use Of Money" 
                  fill="#4FF546" 
                  name="Best Use Of Money" 
                  label={(props) => <VerticalSFMLabel {...props} sfmCode="SFM-CAL-4129" isGreenBar={true} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Total Cost Chart */}
        <div className="relative">
          <h3 className="text-base font-semibold mb-2 text-center">Total Contribution Cost</h3>
          <div className="w-full h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totalBarData} layout="vertical" margin={{
              top: 5,
              right: 80,
              left: 20,
              bottom: 5
            }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={0} tick={false} />
                <Tooltip content={<BarTooltip />} />
                <Bar 
                  dataKey="Existing Pension Plan" 
                  fill="#7c3aed" 
                  name="Existing Plan" 
                  label={(props) => <VerticalSFMLabel {...props} sfmCode="SFM-CAL-4122" />}
                />
                <Bar 
                  dataKey="Best Use Of Money" 
                  fill="#4FF546" 
                  name="Best Use Of Money" 
                  label={(props) => <VerticalSFMLabel {...props} sfmCode="SFM-CAL-4131" isGreenBar={true} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Legend and Savings Message */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#7c3aed] mr-2"></div>
              <span className="text-sm">Existing Pension Plan</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2" style={{
              backgroundColor: '#4FF546'
            }}></div>
              <span className="text-sm">Best Use Of Money</span>
            </div>
          </div>
          
          <div className="text-center p-2 mt-4 rounded-md relative cursor-pointer hover:opacity-90" style={{
          backgroundColor: '#4FF546',
          color: '#000000'
        }} onClick={() => onChangeTab("funding-eligibility")}>
            <span className="font-bold">Apply for Advanced Pension Funding by clicking here</span>
            <div className="absolute top-0 right-0 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-CAL-4130
            </div>
          </div>
        </div>
      </div>
    </div>;
};