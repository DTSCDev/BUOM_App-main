import { systemFields } from "@/data/systemFields";
// MetricCard is already imported above

// Local SFM Code Display Component
const SFMCodeDisplay: React.FC<{ sfmCode: string }> = ({ sfmCode }) => {
  const sfmField = systemFields.find(field => field.sfmId === sfmCode);
  
  return (
    <div className="text-[8px] text-gray-500 opacity-80 font-mono border border-gray-300 px-1 py-0.5 rounded mt-1">
      <div>{sfmCode.replace('SFM-', '')}</div>
      {sfmField && (
        <div className="text-[6px] mt-0.5">
          {sfmField.pageName} › {sfmField.cardName}
        </div>
      )}
    </div>
  );
};

import { MetricCard } from "./MetricCard";

interface ApfSalarySummaryProps {
  currentSalary: number;
  futureSalary: number;
  formatValue: (value: number) => string;
}

export function ApfSalarySummary({ currentSalary, futureSalary, formatValue }: ApfSalarySummaryProps) {
  // Calculate pay days remaining (example calculation)
  const payDaysRemaining = 260; // Typical working days per year

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-700">Salary Assumptions</h3>
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          title="CURRENT SALARY"
          value={formatValue(currentSalary || 0)}
          headerBgColor="bg-gray-600"
          valueTextColor="text-gray-600"
          sfmCode="SFM-APF-1001"
        />
        <MetricCard
          title="FUTURE SALARY"
          value={formatValue(futureSalary || 0)}
          headerBgColor="bg-gray-600"
          valueTextColor="text-gray-600"
          sfmCode="SFM-APF-1002"
        />
        <MetricCard
          title="PAY DAYS REMAINING"
          value={payDaysRemaining.toString()}
          headerBgColor="bg-gray-600"
          valueTextColor="text-gray-600"
          sfmCode="SFM-APF-1003"
        />
      </div>
    </div>
  );
}