
// ISAChartData interface moved inline

interface ISAChartData {
  age: number;
  inblDebt: number;
  isaTotal: number;
  isRepaymentPhase: boolean;
  redemptionEvent?: {
    tranche: number;
    npgReduction: number;
    inblRepayment: number;
  };
}

interface PayloadEntry {
  color: string;
  dataKey: string;
  name: string;
  value: number;
  payload: ISAChartData;
}

interface ISAChartTooltipProps {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: string | number;
}

export const ISAChartTooltip = ({ active, payload, label }: ISAChartTooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint: ISAChartData = payload[0]?.payload;
    return (
      <div className="bg-white p-3 border rounded shadow-lg max-w-xs">
        <p className="font-medium">{`Age: ${label}`}</p>
        {payload.map((entry: PayloadEntry, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.dataKey === 'inblDebt' 
              ? `INBL Debt: £${Math.abs(entry.value).toLocaleString()}`
              : `${entry.name}: £${Math.abs(entry.value).toLocaleString()}`
            }
          </p>
        ))}
        {dataPoint?.redemptionEvent && (
          <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-xs font-medium text-yellow-800">
              🎯 Tranche {dataPoint.redemptionEvent.tranche} Redemption (Month 24{dataPoint.redemptionEvent.tranche === 1 ? '1' : dataPoint.redemptionEvent.tranche === 2 ? '3' : '5'})
            </p>
            <p className="text-xs text-yellow-700">
              NPG Reduction: £{dataPoint.redemptionEvent.npgReduction.toLocaleString()}
            </p>
            <p className="text-xs text-yellow-700">
              INBL Repayment: £{dataPoint.redemptionEvent.inblRepayment.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};
