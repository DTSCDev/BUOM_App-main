import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { UnifiedCalculationResult } from "@/utils/pension/unifiedCalculationEngine";
import { APFMetricSummaryCard } from "@/components/Dashboard/APFMetricSummaryCard";
// APF-1283 wiring: derive from APF-1282 using specified factor
import { APFSponsorshipBreakdown } from "@/utils/pension/buomTypes";

interface APFINBLSummaryCardProps {
  profile: {
    annualSalary: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
  };
  unifiedResult: UnifiedCalculationResult;
  sponsorships: APFSponsorshipBreakdown[];
  opacity?: string;
}

export function APFINBLSummaryCard({ profile, unifiedResult, sponsorships, opacity = "opacity-100" }: APFINBLSummaryCardProps) {
  
  // Use profile annual salary passed into the card
  const annualSalary = profile.annualSalary || 0;
  
  // Formulas per APF spec:
  // APF-1202 = CAL-4105 (Estimated Shortfall)
  const apf1202_maturity = unifiedResult?.currentCapitalShortfall ?? 0;
  // APF-1201 = APF-1202 / 1.582
  const apf1201_initialFunding = apf1202_maturity / 1.582;
  // APF-1283 should show APF-1282 × 0.5215786284925253 (per wiring spec)
  const APF_1283_FACTOR = 0.5215786284925253;
  const apf1203_inblPrincipal = apf1202_maturity * APF_1283_FACTOR;
  
  // Show constraint information if APF is limited by salary exchange
  const isConstrainedBySalaryExchange = unifiedResult.proposedAPFFunding > unifiedResult.feasibleAPFFunding;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span>APF & INBL Summary - Total Program</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <APFMetricSummaryCard
            title="TOTAL APF FUNDING"
            value={formatCurrency(apf1201_initialFunding)}
            headerBgColor="bg-amber-600" // ZVaR Asset
            valueTextColor="text-amber-600"
            sfmCode="SFM-APF-1281"
            opacity={opacity}
          />
          
          <APFMetricSummaryCard
            title="TOTAL MATURITY VALUE"
            value={formatCurrency(apf1202_maturity)}
            headerBgColor="bg-blue-600" // ISA/asset maturity cue
            valueTextColor="text-blue-600"
            sfmCode="SFM-APF-1282"
            opacity={opacity}
          />
          
          <APFMetricSummaryCard
            title="TOTAL INBL PRINCIPAL"
            value={formatCurrency(apf1203_inblPrincipal)}
            headerBgColor="bg-green-600" // INBL loan principal
            valueTextColor="text-green-600"
            sfmCode="SFM-APF-1283"
            opacity={opacity}
          />
        </div>
        
        {isConstrainedBySalaryExchange && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="text-amber-600 text-sm">
                <strong>Salary Exchange Constraint:</strong> APF funding limited to 
                <span className={opacity}>£{formatCurrency(unifiedResult.feasibleAPFFunding)}</span>
                {" "}due to {unifiedResult.salaryExchangeReasonForLimit.toLowerCase()}.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
