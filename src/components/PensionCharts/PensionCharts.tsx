
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PensionShortfallPieChart } from './PensionShortfallPieChart';
import { APFFundingPlanCard } from './APFFundingPlanCard';
import { CostComparisonChart } from './CostComparisonChart';
import { PensionChart } from '../Dashboard/PensionChart';
import { chartDataFixer } from '@/utils/chartDataFixer';

interface PensionChartsProps {
  projectedPensionPot: number;
  existingPensionValue: number;
  existingPlanValueTodayAtRetirement: number;
  existingPlanFutureContributions: number;
  shortfall: number;
  monthlyFundingCost: number;
  totalStandardCost: number;
  annualSalary: number;
  yearsToRetirement: number;
  onChangeTab: (tab: string) => void;
}

const PensionCharts: React.FC<PensionChartsProps> = ({
  existingPensionValue,
  existingPlanValueTodayAtRetirement,
  existingPlanFutureContributions,
  shortfall,
  monthlyFundingCost,
  totalStandardCost,
  annualSalary,
  yearsToRetirement,
  onChangeTab
}) => {
  // FIXED: Generate consistent chart data using the new chartDataFixer
  const chartData = useMemo(() => {
    // Calculate current age from years to retirement (assuming retirement at 67)
    const currentAge = 67 - yearsToRetirement;
    
    const calculationInputs = {
      currentAge,
      annualSalary,
      existingPensionValue,
      yearsToRetirement
    };
    
    console.log('=== GENERATING FIXED CHART DATA ===');
    console.log('Inputs:', calculationInputs);
    
    const fixedChartData = chartDataFixer.generateFixedChartData(calculationInputs);
    
    console.log(`Generated ${fixedChartData.length} fixed chart data points`);
    console.log('Sample data point:', fixedChartData[0]);
    
    return fixedChartData;
  }, [annualSalary, existingPensionValue, yearsToRetirement]);

  // Derive BUOM comparison costs (50% monthly discount; total = 12 × monthly)
  const buomMonthlyCost = useMemo(() => Math.round(monthlyFundingCost * 0.5), [monthlyFundingCost]);
  const totalBUOMCost = useMemo(() => buomMonthlyCost * 12, [buomMonthlyCost]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <Card className="border" style={{ borderColor: '#4FF456' }}>
        <CardHeader className="pb-3">
          <CardTitle style={{ color: '#4FF456' }}>Estimated Pension Funding Shortfall</CardTitle>
        </CardHeader>
        <CardContent>
          <PensionShortfallPieChart
            existingPlanValueTodayAtRetirement={existingPlanValueTodayAtRetirement}
            existingPlanFutureContributions={existingPlanFutureContributions}
            shortfall={shortfall}
          />
          <APFFundingPlanCard shortfall={shortfall} />
        </CardContent>
      </Card>
      
      <Card className="border" style={{ borderColor: '#4FF456' }}>
        <CardHeader className="pb-3">
          <CardTitle style={{ color: '#4FF456' }}>Cost Comparison to Fund Shortfall</CardTitle>
        </CardHeader>
        <CardContent>
          <CostComparisonChart
            monthlyFundingCost={monthlyFundingCost}
            buomMonthlyCost={buomMonthlyCost}
            totalStandardCost={totalStandardCost}
            totalBUOMCost={totalBUOMCost}
            onChangeTab={onChangeTab}
          />
        </CardContent>
      </Card>
      
    </div>
  );
};

export default PensionCharts;
