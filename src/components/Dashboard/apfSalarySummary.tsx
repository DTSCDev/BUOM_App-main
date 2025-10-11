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
import { Switch } from "@/components/ui/switch";

interface ApfSalarySummaryProps {
  currentSalary: number;
  futureSalary: number;
  paydaysRemaining: number;
  formatValue: (value: number) => string;
  isAnnualView: boolean;
  onToggle: (checked: boolean) => void;
}

export function ApfSalarySummary({ currentSalary, futureSalary, paydaysRemaining, formatValue, isAnnualView, onToggle }: ApfSalarySummaryProps) {

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700">Salary Assumptions</h3>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${isAnnualView ? 'text-gray-400' : ''}`} style={!isAnnualView ? { color: '#4FF456', fontWeight: 600 } : undefined}>
            Monthly
          </span>
          <Switch
            checked={isAnnualView}
            onCheckedChange={onToggle}
            className="data-[state=unchecked]:bg-input data-[state=checked]:bg-primary"
          />
          <span className={`text-sm ${!isAnnualView ? 'text-gray-400' : ''}`} style={isAnnualView ? { color: '#4FF456', fontWeight: 600 } : undefined}>
            Annual
          </span>
        </div>
      </div>
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
          value={paydaysRemaining.toString()}
          headerBgColor="bg-gray-600"
          valueTextColor="text-gray-600"
          sfmCode="SFM-APF-1003"
        />
      </div>
    </div>
  );
}