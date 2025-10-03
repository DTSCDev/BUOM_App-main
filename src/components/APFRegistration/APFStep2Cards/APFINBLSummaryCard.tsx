import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { systemFields } from '@/data/systemFields';
import { TrendingUp } from "lucide-react";
import { UnifiedCalculationResult } from "@/utils/pension/unifiedCalculationEngine";
import { APFMetricSummaryCard } from "@/components/Dashboard/APFMetricSummaryCard";
import { usePayslipCalculations } from "@/hooks/usePayslipCalculations";
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
}

export function APFINBLSummaryCard({ profile, unifiedResult, sponsorships }: APFINBLSummaryCardProps) {
  const { calculatePayslipComparison } = usePayslipCalculations();
  
  // Use systemFields directly instead of useSFMResolver
  const getSFMValue = (sfmCode: string): number => {
    const field = systemFields.find(f => f.sfmId === sfmCode);
    return field ? parseFloat(field.outputValue) || 0 : 0;
  };

  // Get annual salary from SFM-PRF-2021 (Profile Annual Salary)
  const annualSalary = getSFMValue('SFM-PRF-2021');
  
  // Calculate totals across ALL sponsorship years (fallback values)
  const totalAPFInitialFunding = sponsorships.reduce((sum, s) => sum + s.sponsorshipAmount, 0);
  const totalMaturityValue = sponsorships.reduce((sum, s) => sum + s.maturityValue, 0);
  
  // Calculate total INBL across all years (fallback value)
  const totalINBLPrincipal = sponsorships.reduce((sum, sponsorship) => {
    const payslipComparison = calculatePayslipComparison(annualSalary, sponsorship.sponsorshipAmount);
    return sum + (payslipComparison.totalINBLPrincipal * 12);
  }, 0);
  
  // Get SFM values for display (using page-based codes)
  const sfmAPFFunding = getSFMValue('SFM-APF-1201');
  const sfmMaturityValue = getSFMValue('SFM-APF-1202');
  const sfmINBLPrincipal = getSFMValue('SFM-APF-1203');
  
  // Use SFM values if available, otherwise fall back to calculated values
  const displayAPFFunding = sfmAPFFunding > 0 ? sfmAPFFunding : totalAPFInitialFunding;
  const displayMaturityValue = sfmMaturityValue > 0 ? sfmMaturityValue : totalMaturityValue;
  const displayINBLPrincipal = sfmINBLPrincipal > 0 ? sfmINBLPrincipal : totalINBLPrincipal;
  
  // Show constraint information if APF is limited by salary exchange
  const isConstrainedBySalaryExchange = unifiedResult.proposedAPFFunding > unifiedResult.feasibleAPFFunding;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>APF & INBL Summary - Total Program</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <APFMetricSummaryCard
            title="TOTAL APF FUNDING"
            value={formatCurrency(displayAPFFunding)}
            headerBgColor="bg-yellow-600"
            valueTextColor="text-yellow-600"
            sfmCode="SFM-APF-1201"
          />
          
          <APFMetricSummaryCard
            title="TOTAL MATURITY VALUE"
            value={formatCurrency(displayMaturityValue)}
            headerBgColor="bg-yellow-600"
            valueTextColor="text-yellow-600"
            sfmCode="SFM-APF-1202"
          />
          
          <APFMetricSummaryCard
            title="TOTAL INBL PRINCIPAL"
            value={formatCurrency(displayINBLPrincipal)}
            headerBgColor="bg-yellow-600"
            valueTextColor="text-yellow-600"
            sfmCode="SFM-APF-1203"
          />
        </div>
        
        {isConstrainedBySalaryExchange && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="text-amber-600 text-sm">
                <strong>Salary Exchange Constraint:</strong> APF funding limited to £{formatCurrency(unifiedResult.feasibleAPFFunding)} 
                due to {unifiedResult.salaryExchangeReasonForLimit.toLowerCase()}.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
