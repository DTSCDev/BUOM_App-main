import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FreePensionShortfallPieChart } from './FreePensionShortfallPieChart';
import { FreeAPFPeriodCard } from './FreeAPFPeriodCard';
import { FreeCostComparisonChart } from './FreeCostComparisonChart';
import { FreeProtectionCard } from './FreeProtectionCard';

interface FreePensionChartsProps {
  existingPlanValueTodayAtRetirement: number;
  existingPlanFutureContributions: number;
  shortfall: number;
  monthlyFundingCost: number;
  totalStandardCost: number;
  targetIncomeToday: number; // SFM-013
  existingPensionValue: number; // SFM-022
  currentAge: number;
  retirementAge: number;
  onChangeTab?: (tab: string) => void;
}

const FreePensionCharts: React.FC<FreePensionChartsProps> = ({
  existingPlanValueTodayAtRetirement,
  existingPlanFutureContributions,
  shortfall,
  monthlyFundingCost,
  totalStandardCost,
  targetIncomeToday,
  existingPensionValue,
  currentAge,
  retirementAge,
  onChangeTab,
}) => {
  return (
    <div className="space-y-6 mt-8">
      {/* Existing charts in grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle style={{ color: '#4FF456' }}>Estimated Pension Funding Shortfall</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            <div className="flex-grow">
              <FreePensionShortfallPieChart
                existingPlanValueTodayAtRetirement={existingPlanValueTodayAtRetirement}
                existingPlanFutureContributions={existingPlanFutureContributions}
                shortfall={shortfall}
              />
            </div>
            <div className="mt-auto pt-4">
              <FreeAPFPeriodCard shortfall={shortfall} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle style={{ color: '#4FF456' }}>Cost Comparison to Fund Shortfall</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <FreeCostComparisonChart
              monthlyExistingPlan={monthlyFundingCost}
              totalExistingPlan={totalStandardCost}
              onChangeTab={onChangeTab}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Protection Card as full-width block */}
      <div className="w-full">
        <FreeProtectionCard
          targetIncomeToday={targetIncomeToday}
          existingPensionValue={existingPensionValue}
          currentAge={currentAge}
          retirementAge={retirementAge}
        />
      </div>
    </div>
  );
};

export default FreePensionCharts;