import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/pensionCalculations';

interface FreeCostComparisonChartProps {
  monthlyExistingPlan: number;
  totalExistingPlan: number;
  onChangeTab?: (tab: string) => void;
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
        fill={isGreenBar ? "#374151" : "#fff"} 
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

export const FreeCostComparisonChart: React.FC<FreeCostComparisonChartProps> = ({
  monthlyExistingPlan,
  totalExistingPlan,
  onChangeTab
}) => {
  // Add the missing useState hook for modal state
  const [showBUOMModal, setShowBUOMModal] = useState(false);
  
  // Calculate BUOM values as 50% of existing plan costs
  const buomMonthlyEquivalent = monthlyExistingPlan * 0.5;
  const buomTotalEquivalent = totalExistingPlan * 0.5;

  // Monthly cost bar chart data
  const monthlyBarData = [{
    name: 'Monthly Cost',
    'Existing Pension Plan': monthlyExistingPlan,
    'Best Use Of Money': buomMonthlyEquivalent
  }];

  // Total cost bar chart data
  const totalBarData = [{
    name: 'Total Cost',
    'Existing Pension Plan': totalExistingPlan,
    'Best Use Of Money': buomTotalEquivalent
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
                  fill="#9333EA" 
                  name="Existing Plan" 
                  label={(props) => <VerticalSFMLabel {...props} sfmCode="SFM-036" />}
                />
                <Bar 
                  dataKey="Best Use Of Money" 
                  fill="#4FF546" 
                  name="Best Use Of Money" 
                  label={(props) => <VerticalSFMLabel {...props} sfmCode="SFM-037" isGreenBar={true} />}
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
                  fill="#9333EA" 
                  name="Existing Plan" 
                  label={(props) => <VerticalSFMLabel {...props} sfmCode="SFM-038" />}
                />
                <Bar 
                  dataKey="Best Use Of Money" 
                  fill="#4FF546" 
                  name="Best Use Of Money" 
                  label={(props) => <VerticalSFMLabel {...props} sfmCode="SFM-039" isGreenBar={true} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Legend and Savings Message */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {/* Legend */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2" style={{
                backgroundColor: '#8B5CF6'
              }}></div>
              <span className="text-sm">Existing Pension Plan</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2" style={{
                backgroundColor: '#4FF546'
              }}></div>
              <span className="text-sm">Best Use Of Money</span>
            </div>
          </div>
          
          {/* Clickable BUOM Introduction */}
          {/* BUOM Principles Text */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => setShowBUOMModal(true)}
              className="hover:opacity-80 text-[12px] font-bold text-gray-700"
            >
              For a detailed introduction to Best Use Of Money (BUOM) Principles click here
            </button>
          </div>
          
          {/* CTA Button - Now using onChangeTab prop */}
          <div className="mt-4 text-center">
            <button 
              className="w-full px-6 py-3 text-gray-700 font-medium rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#4FF546' }}
              onClick={() => {
                if (onChangeTab) {
                  onChangeTab("funding-eligibility");
                } else {
                  console.log('SFM-040: Navigate to funding eligibility');
                }
              }}
            >
              Prefer to save {formatCurrency(buomTotalEquivalent)} in contribution costs?
              <span className="font-bold"> Click here to check if you are eligible </span>
            </button>
            <p className="text-[8px] text-gray-500 mt-1">SFM-040</p>
          </div>
          
          {/* BUOM Modal */}
          {showBUOMModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowBUOMModal(false)}>
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">BUOM Principles</h3>
                  <button 
                    onClick={() => setShowBUOMModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Our <strong>Best Use Of Money</strong> Principles leverage Advanced Pension Funding (APF) to reduce the impact of Cost Of Delay Dynamics (CODD). BUOM technology is purposefully designed to be both Product and Investment Agnostic, allowing Chartered Financial Advisors or approved BUOM AI Licensed Agents to target contribution cost reductions of up to 50%. This is achieved through Statutory Tax Planning and existing steps that have met FSMA and COBS expectations since 2010. BUOM Technology is committed to helping 2.72m SMEs and 27.8m Workers achieve a 1x Better Outcome, without having to increase either Investment Risk, or tie up extra Contributions in pension Default Funds that failed to meet 9 in 10 workers needs.            </p>
                <div className="mt-4 text-right">
                  <button 
                    onClick={() => setShowBUOMModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>;
};