
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { systemFields } from '@/data/systemFields';
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
    if (!field) return 0;
    const cleaned = String(field.outputValue).replace(/[^0-9.-]/g, "");
    const n = Number(cleaned);
    return isNaN(n) ? 0 : n;
  };

  // Normalize rates
  const normalizeRate = (raw: number | undefined, fallback: number): number => {
    let r = (typeof raw === 'number' && isFinite(raw)) ? raw : fallback;
    if (r > 1) r = r / 100; // support percent inputs
    if (!isFinite(r)) r = fallback;
    if (r < -0.99) r = -0.99;
    if (r > 0.99) r = 0.99;
    return r;
  };

  // Get annual salary from SFM, fallback to profile
  const baseAnnualSalary = getSFMValue('SFM-PRF-2021') || (profile?.annual_salary ?? 0);
  const inflationRate = normalizeRate(getSFMValue('SFM-CAL-4402'), 0.03); // Annual Inflation Rate
  const timeToRetirementRaw = getSFMValue('SFM-CAL-4111'); // Time to Retirement (years)
  const timeToRetirement = Number.isFinite(timeToRetirementRaw) && timeToRetirementRaw > 0 ? timeToRetirementRaw : 20;
  
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

  // TOP 3 CARDS: Fixed values per instruction
  const displayNPGAmount = 118458; // SFM-APF-1301
  const displayNRSRFee = 29614;   // SFM-APF-1302
  const displayINBLPrincipal = 148072; // SFM-APF-1303

  // Format values for display (handle monthly display if needed)
  const formatValue = (value: number) => {
    const displayValue = showMonthly ? value / 12 : value;
    return formatCurrency(displayValue);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle style={{ color: '#4FF456' }}>
          INBL Loan Summary - Proposed Total Funding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700">
          The figures below are estimates based on your total shortfall funding needs. You will need to re-apply each year for INBL funding.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <APFMetricSummaryCard
            title="NPG Amount"
            value={formatValue(displayNPGAmount)}
            headerBgColor="bg-green-600"
            valueTextColor="text-green-600"
            sfmCode="SFM-APF-1301"
          />
          
          <APFMetricSummaryCard
            title="NRSR Fee"
            value={formatValue(displayNRSRFee)}
            headerBgColor="bg-green-600"
            valueTextColor="text-green-600"
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

        {/* Loan Terms block — match screenshot layout and copy */}
        <div className="mt-4">
          {/* Green bar header */}
          <div className="bg-green-600 text-white text-center text-sm font-semibold py-2 rounded">
            LOAN TERMS
          </div>
          {/* Bullet list */}
          <div className="p-4 border border-green-200 rounded-b text-sm text-gray-800 space-y-1">
            <p>• Interest Rate: 0.00%</p>
            <p>• Repayment Period: 20 years</p>
            <p>• Single repayment at maturity</p>
            <p>• Non-recourse structure</p>
            <p>• NPG: Net Pay Guarantee covers the net pay lost from salary sacrifice each pay day</p>
            <p>• NRSR Fee: Non Recourse, Single Repayment Fee allows you to save monthly into a Tax-Free ISA earning compound growth until a single repayment at Maturity.</p>
            <p>• Time Tokens are awarded to BUOM members who agree to do good with their Time & Money.</p>
          </div>

          {/* Blue note box */}
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-gray-700">
            <strong>Time Tokens:</strong> are awarded to BUOM Members for Loyalty, Good Deeds, Investing Sustainably, Keeping your Data up to date and simply by spending your Time completing financial education challenges and helping others via our Power of Ten (10x) Community challenge. Time Tokens are being launched in 2026 and will aim to help BUOM members repay in full the NRSR Fee after 20yrs.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
