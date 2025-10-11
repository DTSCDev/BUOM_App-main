
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
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
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#4FF456', color: '#1f2937' }}>4</div>
        <div>
          <h2 id="step4-header" className="text-xl font-semibold" style={{ color: '#4FF456' }}>Step 4: Best Use of Money</h2>
          <p className="text-sm text-gray-600">Analyze the value proposition of your APF investment over 240 months</p>
        </div>
      </div>

      <div className="space-y-6">
        <APFValueForMoneyCard
          isaContributions={totalISAContributions}
          maturityValue={totalMaturityValue}
        />
        
        <APFAEEquivalentCard
          maturityValue={totalMaturityValue}
        />
      </div>

      <Card>
        <div className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-600 mb-2">Analysis Complete</h3>
            <p className="text-sm text-gray-600">
              Your value analysis has been completed. Click Next to continue to the salary exchange setup.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

