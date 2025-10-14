
import { Card } from "@/components/ui/card";
import { useRetirementCalculatorHub } from "@/hooks/useRetirementCalculatorHub";
import { getPensionParameters } from "@/utils/pensionParameters";
import { APFValueForMoneyCard } from "../APFStep2Cards/APFValueForMoneyCard";
import { APFAEEquivalentCard } from "../APFStep4Cards/APFAEEquivalentCard";

interface APFStep4SuccessStateProps {
  totalISAContributions: number;
  totalMaturityValue: number;
}

export function APFStep4SuccessState({ 
  totalISAContributions, 
  totalMaturityValue
}: APFStep4SuccessStateProps) {
  const hub = useRetirementCalculatorHub();
  const params = getPensionParameters();

  // APF-1261: receive value from APF-1282 (CAL-4121 capital shortfall)
  const apf1261_maturityValue = hub.cal4121_capitalShortfall || totalMaturityValue || 0;

  // APF-1260: ISA total contributions using Step 3 chart logic with custom start
  const startMonthlyISA = apf1261_maturityValue * 0.00098;
  const annualInflationRate = params.pensionIncomeInflation || 0;
  let apf1260_totalISAContributions = 0;
  for (let m = 1; m <= 240; m++) {
    const yearsElapsed = Math.floor((m - 1) / 12);
    const monthly = startMonthlyISA * Math.pow(1 + annualInflationRate, yearsElapsed);
    apf1260_totalISAContributions += monthly;
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#4FF456', color: '#1f2937' }}>4</div>
        <div>
          <h2 id="step4-header" className="text-2xl font-semibold" style={{ color: '#4FF456' }}>Value for Money Comparison</h2>
        </div>
      </div>

      <div className="space-y-6">
        <APFValueForMoneyCard
          isaContributions={apf1260_totalISAContributions}
          maturityValue={apf1261_maturityValue}
        />
        
        <APFAEEquivalentCard
          maturityValue={apf1261_maturityValue}
        />
      </div>

      <Card>
        <div className="p-6 bg-[#4FF456] text-gray-700 rounded">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Value for Money Comparison Complete</h3>
            <p className="text-sm">
              Click Next to review the Proposed Salary Exchange method recommended by Chartered Financial Advisors to help optimise your Statutory Rights to Tax Planning.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

