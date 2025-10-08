import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APFMetricSummaryCard } from '@/components/Dashboard/APFMetricSummaryCard';
import { formatCurrency } from '@/utils/formatUtils';
import { TrendingUp } from 'lucide-react';
import { useRetirementCalculatorHub } from '@/hooks/useRetirementCalculatorHub';
import { computeStage2Summary } from '@/utils/apf/apfCentralCalculator';

interface APFInblSummaryProposedCardProps {
  profile: { annual_salary?: number };
  sponsorships: { sponsorshipAmount: number }[];
  opacity?: string;
}

export function APFInblSummaryProposedCard({ profile, sponsorships, opacity = 'opacity-100' }: APFInblSummaryProposedCardProps) {
  const hub = useRetirementCalculatorHub();

  const { apf1201_totalInitialFunding, apf1202_totalMaturityValue, apf1203_totalINBLPrincipal } = computeStage2Summary({
    cal4121_capitalShortfall: hub.cal4121_capitalShortfall,
    prf2021_annualSalary: profile.annual_salary || hub.prf2021_annualSalary,
    sponsorshipAmounts: (sponsorships || []).map(s => s.sponsorshipAmount),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>APF & INBL Summary - Proposed Funding</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <APFMetricSummaryCard
            title="TOTAL INITIAL FUNDING"
            value={formatCurrency(apf1201_totalInitialFunding)}
            headerBgColor="bg-amber-600"
            valueTextColor="text-amber-600"
            sfmCode="APF-1201"
            opacity={opacity}
          />

          <APFMetricSummaryCard
            title="TOTAL MATURITY VALUE"
            value={formatCurrency(apf1202_totalMaturityValue)}
            headerBgColor="bg-blue-600"
            valueTextColor="text-blue-600"
            sfmCode="APF-1202"
            opacity={opacity}
          />

          <APFMetricSummaryCard
            title="TOTAL INBL PRINCIPAL"
            value={formatCurrency(apf1203_totalINBLPrincipal)}
            headerBgColor="bg-emerald-600"
            valueTextColor="text-emerald-600"
            sfmCode="APF-1203"
            opacity={opacity}
          />
        </div>
      </CardContent>
    </Card>
  );
}