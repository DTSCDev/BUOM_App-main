import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RetirementDataPoint {
  age: number;
  pensionValue: number;
  targetValue: number;
  shortfall: number;
  contributions: number;
}

interface BUOMRetirementGraphProps {
  data: RetirementDataPoint[];
  currentAge: number;
  retirementAge: number;
  title?: string;
}

const BUOMRetirementGraph: React.FC<BUOMRetirementGraphProps> = ({
  data,
  currentAge,
  retirementAge,
  title = "Retirement Projection"
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{`Age: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96 p-4">
      <h2 className="text-2xl font-bold text-center mb-4 text-foreground">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="age" 
            label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
            className="text-muted-foreground"
          />
          <YAxis 
            tickFormatter={formatCurrency}
            label={{ value: 'Value (£)', angle: -90, position: 'insideLeft' }}
            className="text-muted-foreground"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="pensionValue" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            name="Pension Value"
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="targetValue" 
            stroke="hsl(var(--secondary))" 
            strokeWidth={2}
            name="Target Value"
            strokeDasharray="5 5"
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="shortfall" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={2}
            name="Shortfall"
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="contributions" 
            stroke="hsl(var(--accent))" 
            strokeWidth={2}
            name="Annual Contributions"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BUOMRetirementGraph;