
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, Line, ComposedChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { CustomTooltip } from "./ChartTooltip";
import { chartConfig } from "./ChartConfig";

interface PensionChartProps {
  chartData: Array<{
    age: number;
    capitalShortfall: number;
    apfAssetValue: number;
    isaValue: number;
    buomTotalValue: number;
    targetValue: number;
    existingPlanValue: number;
    inblBalance?: number;
  }>;
}

// Custom Legend Component with SFM codes
const CustomLegend = (props: any) => {
  const { payload } = props;
  
  const legendItemsWithSFM = [
    { value: "INBL Debt", color: "#16a34a", sfmCode: "SFM-038" },
    { value: "APF Asset Value", color: "#ca8a04", sfmCode: "SFM-039" },
    { value: "ISA Value", color: "#3b82f6", sfmCode: "SFM-040" },
    { value: "BUOM Total Value", color: "#4FF546", sfmCode: "SFM-041" },
    { value: "Capital Shortfall", color: "#666666", sfmCode: "SFM-042" }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 pt-5">
      {legendItemsWithSFM.map((item, index) => (
        <div key={index} className="flex items-center gap-2 relative">
          <div 
            className="w-3 h-3 rounded-sm" 
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-700">{item.value}</span>
          <span className="text-[8px] text-gray-500 font-mono border border-gray-300 px-1 py-0.5 rounded opacity-60">
            {item.sfmCode.replace('SFM-', '')}
          </span>
        </div>
      ))}
    </div>
  );
};

export function PensionChart({ chartData }: PensionChartProps) {
  // Focus Y-axis on capital shortfall values instead of target values
  const maxCapitalShortfall = chartData.length > 0 ? 
    Math.max(...chartData.map(d => d.capitalShortfall)) : 100000;
  const yAxisMaxValue = Math.ceil(maxCapitalShortfall * 1.1);

  // Calculate chart age range from actual data
  const startAge = chartData.length > 0 ? chartData[0].age : 41;
  const finalAge = chartData.length > 0 ? chartData[chartData.length - 1].age : 68;
  
  console.log('=== PENSION CHART X-AXIS CONFIGURATION (FIXED) ===');
  console.log(`Chart starts at age: ${startAge} (current age - 1)`);
  console.log(`Chart ends at age: ${finalAge} (retirement + 1 or latest APF maturity)`);
  console.log(`Data points: ${chartData.length}`);
  console.log(`Age range: ${finalAge - startAge + 1} years`);

  return (
    <div className="bg-white rounded-lg" style={{ width: '800px', height: '500px', maxWidth: '100%' }}>
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="age" 
              type="number"
              domain={[startAge, finalAge]}
              tick={{ fill: '#333333' }}
            />
            <YAxis 
              domain={[0, yAxisMaxValue]}
              tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
              tick={{ fill: '#333333' }}
            />
            <ChartTooltip content={<CustomTooltip />} />

            {/* ALIGNED BARS: INBL, APF, ISA all with same stackId */}
            <Bar
              dataKey="inblBalance"
              stackId="funding"
              fill="#16a34a"
              name="INBL Debt"
              radius={[0, 0, 0, 0]}
            />

            <Bar
              dataKey="apfAssetValue"
              stackId="funding"
              fill="#ca8a04"
              name="APF Asset Value"
              radius={[0, 0, 0, 0]}
            />

            <Bar
              dataKey="isaValue"
              stackId="funding"
              fill="#3b82f6"
              name="ISA Value"
              radius={[2, 2, 0, 0]}
            />

            <Line
              type="monotone"
              dataKey="buomTotalValue"
              stroke="#4FF546"
              strokeWidth={2}
              dot={false}
              name="BUOM Total Value"
            />

            <Line
              type="monotone"
              dataKey="capitalShortfall"
              stroke="#666666"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Capital Shortfall"
            />
            
            <Legend 
              content={<CustomLegend />}
              verticalAlign="bottom" 
              height={60}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
