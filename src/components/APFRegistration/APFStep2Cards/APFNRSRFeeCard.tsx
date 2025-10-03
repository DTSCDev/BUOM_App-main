
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { systemFields } from '@/data/systemFields';
import { Shield } from 'lucide-react';
import { APFMetricSummaryCard } from '@/components/Dashboard/APFMetricSummaryCard';
import { usePayslipCalculations } from '@/hooks/usePayslipCalculations';
import { APFSponsorshipBreakdown } from '@/utils/pension/buomTypes';

interface Profile {
  annual_salary?: number;
  // Add other profile properties as needed
}

interface APFNRSRFeeCardProps {
  showMonthly: boolean;
  sponsorships: APFSponsorshipBreakdown[];
  profile: Profile;
  className?: string;
}

export function APFNRSRFeeCard({ showMonthly, sponsorships, profile, className }: APFNRSRFeeCardProps) {
  const { calculatePayslipComparison } = usePayslipCalculations();

  // Use systemFields directly instead of useSFMResolver
  const getSFMValue = (sfmCode: string): number => {
    const field = systemFields.find(f => f.sfmId === sfmCode);
    return field ? parseFloat(field.outputValue) || 0 : 0;
  };

  // Get annual salary from proper SFM codes (NO HARDCODED VALUES)
  const baseAnnualSalary = getSFMValue('SFM-PRF-2021'); // Profile Annual Salary
  const inflationRate = getSFMValue('SFM-CAL-4402'); // Annual Inflation Rate
  const timeToRetirement = getSFMValue('SFM-CAL-4111'); // Time to Retirement (years)
  
  // Calculate Annual Salary with Inflation: SFM-PRF-2021 × (1 + SFM-CAL-4402)^SFM-CAL-4111
  const annualSalaryWithInflation = baseAnnualSalary * Math.pow(1 + inflationRate, timeToRetirement);
  
  // Use inflated salary for all calculations
  const annualSalary = annualSalaryWithInflation;

  // Calculate totals across all sponsorship years
  let totalNPGAmount = 0;
  let totalNRSRFee = 0;
  let totalINBLPrincipal = 0;

  if (sponsorships && sponsorships.length > 0) {
    sponsorships.forEach((sponsorship) => {
      const payslipComparison = calculatePayslipComparison(annualSalary, sponsorship.sponsorshipAmount);
      totalNPGAmount += payslipComparison.npgAmount;
      totalNRSRFee += payslipComparison.nrsrFee;
      totalINBLPrincipal += payslipComparison.totalINBLPrincipal;
    });
  } else {
    // Fallback to page-based SFM values if no sponsorship data
    totalNPGAmount = getSFMValue('SFM-APF-1301'); // APF NPG Amount
    totalNRSRFee = getSFMValue('SFM-APF-1302'); // APF NRSR Fee
    totalINBLPrincipal = getSFMValue('SFM-APF-1303'); // APF INBL Principal
  }

  // Get display values from page-based SFM codes
  const displayNPGAmount = getSFMValue('SFM-APF-1301');
  const displayNRSRFee = getSFMValue('SFM-APF-1302');
  const displayINBLPrincipal = getSFMValue('SFM-APF-1303');

  // Format values for display (handle monthly display if needed)
  const formatValue = (value: number) => {
    const displayValue = showMonthly ? value / 12 : value;
    return formatCurrency(displayValue);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          APF NRSR Fee Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <APFMetricSummaryCard
            title="NPG Amount"
            value={formatValue(displayNPGAmount)}
            headerBgColor="bg-blue-600"
            valueTextColor="text-blue-600"
            sfmCode="SFM-APF-1301"
          />
          
          <APFMetricSummaryCard
            title="NRSR Fee"
            value={formatValue(displayNRSRFee)}
            headerBgColor="bg-orange-600"
            valueTextColor="text-orange-600"
            sfmCode="SFM-APF-1302"
          />
          
          <APFMetricSummaryCard
            title="INBL Principal"
            value={formatValue(displayINBLPrincipal)}
            headerBgColor="bg-green-600"
            valueTextColor="text-green-600"
            sfmCode="SFM-APF-1303"
          />
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold text-blue-800 mb-2">Loan Terms</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Interest Rate: 2.5% per annum</p>
            <p>• Repayment Period: Up to 10 years</p>
            <p>• Early Repayment: No penalties</p>
          </div>
        </div>

        <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          <strong>Salary Calculation:</strong> Base: £{formatCurrency(baseAnnualSalary)} × (1 + {(inflationRate * 100).toFixed(2)}%)^{timeToRetirement} years = £{formatCurrency(annualSalaryWithInflation)}
        </div>
      </CardContent>
    </Card>
  );
}
