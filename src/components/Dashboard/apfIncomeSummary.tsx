import { ProgressBanner } from "./ProgressBanner";
import { MetricCard } from "./MetricCard";
import { DemoDataService } from "@/services/demoDataService";

interface ApfIncomeSummaryProps {
  calculations: {
    targetIncomeAtRetirement: number;
    existingPlanIncomeAtRetirement: number;
    apfTargetIncome: number;
    retirementProgressPercentage: number;
  };
  formatValue: (value: number) => string;
}

export function ApfIncomeSummary({ calculations, formatValue }: ApfIncomeSummaryProps) {
  const fundingStatus = DemoDataService.getUserFundingStatus();

  // Add null checking and default values
  if (!calculations) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-purple-600">Retirement Plan Target Income</h3>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-purple-600">Retirement Plan Target Income</h3>
      <ProgressBanner 
        progressPercentage={calculations.retirementProgressPercentage || 0}
        className="mb-3"
      />
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          title="FUTURE TARGET INCOME"
          value={formatValue(calculations.targetIncomeAtRetirement || 0)}
          headerBgColor="bg-gray-600"
          valueTextColor="text-gray-600"
          sfmCode="SFM-APF-1004"
        />
        <MetricCard
          title="EXISTING PLAN FUTURE INCOME"
          value={formatValue(calculations.existingPlanIncomeAtRetirement || 0)}
          headerBgColor="bg-gray-600"
          valueTextColor="text-gray-600"
          sfmCode="SFM-APF-1005"
        />
        <MetricCard
          title="APF FUTURE TARGET INCOME"
          value={formatValue(calculations.apfTargetIncome || 0)}
          headerBgColor="bg-purple-600"
          valueTextColor="text-purple-600"
          opacity={fundingStatus.hasAPF ? "opacity-100" : "opacity-35"}
          sfmCode="SFM-APF-1006"
        />
      </div>
    </div>
  );
}