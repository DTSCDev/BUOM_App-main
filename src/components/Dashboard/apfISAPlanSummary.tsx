import { Button } from "@/components/ui/button";
import { ProgressBanner } from "./ProgressBanner";
import { MetricCard } from "./MetricCard";
import { DemoDataService } from "@/services/demoDataService";

interface ApfISAPlanSummaryProps {
  calculations: {
    isaTargetMonthly: number;
    isaValueToday: number;
    isaSavingsTargetToday: number;
    repaymentProgressPercentage: number;
  };
  formatValue: (value: number) => string;
}

export function ApfISAPlanSummary({ calculations, formatValue }: ApfISAPlanSummaryProps) {
  const fundingStatus = DemoDataService.getUserFundingStatus();

  // Add null checking and default values
  if (!calculations) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-blue-600">Repayment Plan Target</h3>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-blue-600">Repayment Plan Target</h3>
      <ProgressBanner 
        progressPercentage={calculations.repaymentProgressPercentage || 0}
        className="mb-3"
      />
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          title="ISA PAYDAY SAVINGS TARGET"
          value={formatValue(calculations.isaTargetMonthly || 0)}
          headerBgColor="bg-blue-600"
          valueTextColor="text-blue-600"
          sfmCode="SFM-APF-1007"
        />
        <MetricCard
          title="ISA SAVINGS VALUE TODAY"
          value={formatValue(calculations.isaValueToday || 0)}
          headerBgColor="bg-blue-600"
          valueTextColor="text-blue-600"
          sfmCode="SFM-APF-1008"
        />
        <MetricCard
          title="ISA SAVINGS TARGET TODAY"
          value={formatValue(calculations.isaSavingsTargetToday || 0)}
          headerBgColor="bg-blue-600"
          valueTextColor="text-blue-600"
          opacity={fundingStatus.hasAPF ? "opacity-100" : "opacity-35"}
          sfmCode="SFM-APF-1009"
        />
      </div>
    </div>
  );
}