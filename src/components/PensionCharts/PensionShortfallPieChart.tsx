
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/pensionCalculations';

interface PensionShortfallPieChartProps {
  existingPlanValueTodayAtRetirement: number;
  existingPlanFutureContributions: number;
  shortfall: number;
}

const COLORS = ['#666666', '#999999', '#ea384c']; // Darker Grey, Medium Grey, Red

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

const PieTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow-lg border border-gray-200 text-sm">
        <p>{`${payload[0].name}: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export const PensionShortfallPieChart: React.FC<PensionShortfallPieChartProps> = ({
  existingPlanValueTodayAtRetirement,
  existingPlanFutureContributions,
  shortfall
}) => {
  const pieData = [{
    name: 'Existing Plan Value Today at Retirement',
    value: existingPlanValueTodayAtRetirement
  }, {
    name: 'Existing Plan Future Contributions Value',
    value: existingPlanFutureContributions
  }, {
    name: 'Shortfall at Retirement',
    value: shortfall
  }].filter(item => item.value > 0);

  return (
    <div className="flex flex-col items-center relative">
      <div className="w-full h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={pieData} 
              cx="50%" 
              cy="50%" 
              innerRadius={60} 
              outerRadius={90} 
              fill="#8884d8" 
              paddingAngle={3} 
              dataKey="value" 
              labelLine={false}
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Shortfall amount in the center of pie chart */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-xl font-bold text-red-600">
            {formatCurrency(shortfall)}
          </div>
        </div>
      </div>
      
      {/* Legends below the pie chart with SFM codes */}
      <div className="flex justify-center flex-wrap gap-4 mt-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#666666] mr-2"></div>
            <span className="text-sm">Existing Plan Value Today at Retirement</span>
          </div>
          <div className="text-[8px] text-gray-400 mt-1">SFM-CAL-4126</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#999999] mr-2"></div>
            <span className="text-sm">Existing Plan Future Contributions Value</span>
          </div>
          <div className="text-[8px] text-gray-400 mt-1">SFM-CAL-4127</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span className="text-sm">Shortfall at Retirement</span>
          </div>
          <div className="text-[8px] text-gray-400 mt-1">SFM-CAL-4121</div>
        </div>
      </div>
    </div>
  );
};
