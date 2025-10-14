import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APFMetricSummaryCard } from '@/components/Dashboard/APFMetricSummaryCard';
import { formatCurrency } from '@/utils/formatUtils';
import { useRetirementCalculatorHub } from '@/hooks/useRetirementCalculatorHub';
import { getPensionParameters } from '@/utils/pensionParameters';

interface APFInblSummaryProposedCardProps {
  profile: { annual_salary?: number };
  sponsorships: { sponsorshipAmount: number }[];
  opacity?: string;
}

export function APFInblSummaryProposedCard({ profile, sponsorships, opacity = 'opacity-100' }: APFInblSummaryProposedCardProps) {
  const hub = useRetirementCalculatorHub();
  const params = getPensionParameters();

  // Per spec: APF-1282 receives CAL-4121; APF-1281 = APF-1282 / 1.582
  const apf1202_totalMaturityValue = hub.cal4121_capitalShortfall;
  const apf1201_totalInitialFunding = apf1202_totalMaturityValue / params.apfMaturityMultiplier;
  // APF-1283 should show APF-1282 × 0.5215786284925253 (per wiring spec)
  const APF_1283_FACTOR = 0.5215786284925253;
  const apf1203_totalINBLPrincipal = apf1202_totalMaturityValue * APF_1283_FACTOR;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          <span style={{ color: '#4FF456' }}>Proposed APF & INBL  Key Financials</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <APFMetricSummaryCard
            title="TOTAL INITIAL CONTRIBUTION"
            value={formatCurrency(apf1201_totalInitialFunding)}
            headerBgColor="bg-transparent"
            valueTextColor="text-[rgb(191,144,0)]"
            style={{ backgroundColor: 'rgb(191,144,0)' }}
            sfmCode="SFM-APF-1281"
            opacity={opacity}
          />

          <APFMetricSummaryCard
            title="TOTAL MATURITY VALUE"
            value={formatCurrency(apf1202_totalMaturityValue)}
            headerBgColor="bg-purple-600"
            valueTextColor="text-purple-600"
            sfmCode="SFM-APF-1282"
            opacity={opacity}
          />

          <APFMetricSummaryCard
            title="TOTAL INBL PRINCIPAL"
            value={formatCurrency(apf1203_totalINBLPrincipal)}
            headerBgColor="bg-green-600"
            valueTextColor="text-green-600"
            sfmCode="SFM-APF-1283"
            opacity={opacity}
          />
        </div>
      </CardContent>
    </Card>
  );
}