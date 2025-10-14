import { useState } from "react";
import { isTestingAccount } from "@/utils/testing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APFStep5MonthlyScheduleTable } from "./APFStep5Components/APFStep5MonthlyScheduleTable";
import { APFStep5ConfirmationSection } from "./APFStep5Components/APFStep5ConfirmationSection";
import { usePayslipCalculations } from "@/hooks/usePayslipCalculations";
import { formatCurrency } from "@/utils/formatUtils";
import { MonthlySalaryExchangeDialog } from "./MonthlySalaryExchangeDialog";
import SFMCodeBadge from "@/components/SystemFields/SFMCodeBadge";
import { PayslipComparisonDialog } from "./PayslipComparisonDialog";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/hooks/useProfile";
import { getPensionParameters } from "@/utils/pensionParameters";

interface APFSponsorship {
  year: number;
  sponsorshipAmount: number;
  maturityValue: number;
  inblPrincipal: number;
}

interface APFStep5SalaryExchangeProps {
  profile: {
    date_of_birth?: string;
    annual_salary?: number;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    first_name?: string;
    last_name?: string;
    email?: string;
    mobile?: string;
    paye_tax_code?: string;
    is_director?: boolean;
  };
  applicationData: Record<string, unknown>;
  onComplete: (data: Record<string, unknown>) => void;
}

export function APFStep5SalaryExchange({ profile, applicationData, onComplete }: APFStep5SalaryExchangeProps) {
  const [showMonthly, setShowMonthly] = useState(false);
  const isAnnual = !showMonthly;
  const frequencyLabel = isAnnual ? "Annual" : "Monthly";
  const [formData, setFormData] = useState({
    monthlyScheduleAccepted: true, // Auto-accept since checkbox removed
    salaryExchangeUnderstood: true, // Auto-accept since checkbox removed
    netPayGuaranteeAccepted: isTestingAccount() ? true : false,
    payslipChangesAcknowledged: isTestingAccount() ? true : false
  });

  const { calculatePayslipComparison } = usePayslipCalculations();
  const { profile: profileFromStore } = useProfile();
  const params = getPensionParameters();
  
  // Use data from previous steps
  const sponsorships = (applicationData?.sponsorships as APFSponsorship[]) || [];
  const firstYearSponsorship = sponsorships.length > 0 ? sponsorships[0] : null;
  
  // Use central inputs for APF-4201-M instead of relying on applicationData
  const annualSalary = profile?.annual_salary ?? profileFromStore?.annual_salary ?? 0; // SFM-PRF-2021
  // Safely parse P11D from store profile if available
  const parseCurrencyToNumber = (raw?: string | null): number => {
    if (!raw) return 0;
    const cleaned = String(raw).replace(/[^0-9.-]/g, "");
    const n = Number(cleaned);
    return isNaN(n) ? 0 : n;
  };
  const p11d = parseCurrencyToNumber(profileFromStore?.p11d ?? null);
  const personalAllowance = params.personalAllowance;

  // APF-4201-M: Year 1 Max Initial Contribution (no Carry Forward)
  const feasibleAPFFunding = Math.max(0, annualSalary + p11d - personalAllowance);
  
  // Calculate NPG using the dynamic payslip comparison - this is the correct approach
  const payslipComparison = calculatePayslipComparison(annualSalary, feasibleAPFFunding);
  const annualNPG = payslipComparison.npgAmount * 12; // Monthly NPG * 12 for annual
  const annualNetPayReduction = (payslipComparison.netPayDifference || 0) * 12; // APF-1503
  
  console.log('APFStep5 - Salary Exchange calculations:', {
    feasibleAPFFunding,
    annualSalary,
    monthlyNPG: payslipComparison.npgAmount,
    annualNPG,
    payslipComparison
  });

  const canProceed = isTestingAccount() || (formData.netPayGuaranteeAccepted && formData.payslipChangesAcknowledged);

  const handleSubmit = () => {
    if (canProceed) {
      const completionData = {
        ...formData,
        feasibleAPFFunding,
        annualNPG,
        payslipComparison,
        taxCode: profile?.paye_tax_code || '1257L',
        isDirector: profile?.is_director || false
      };
      
      console.log('APFStep5 - Submitting completion data:', completionData);
      onComplete(completionData);
    }
  };

  return (
    <Card>
      <CardHeader id="step5-header">
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold leading-tight">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#4FF456', color: '#1f2937' }}>
            5
          </div>
          <span style={{ color: '#4FF456' }}>Salary Exchange Proposal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2 justify-end">
            <span className={`${showMonthly ? "text-gray-900 font-semibold" : "text-gray-500"} text-xs`}>Monthly</span>
            <Switch
              checked={!showMonthly}
              onCheckedChange={(checked) => setShowMonthly(!checked)}
              aria-label="Toggle Monthly/Annual"
            />
            <span className={`${!showMonthly ? "text-green-600 font-semibold" : "text-gray-500"} text-xs`}>Annual</span>
          </div>
          <div className="text-sm text-gray-700">
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              <div></div>
              <div className="text-right font-semibold text-xl md:text-2xl" style={{ color: '#4FF456' }}>Existing</div>
              <div className="text-right font-semibold text-xl md:text-2xl" style={{ color: '#4FF456' }}>Proposed</div>

              {/* Gross Salary row */}
              <div>
                Gross Salary <span className="ml-2 text-xs text-gray-500">{frequencyLabel}</span>
              </div>
              <div className="text-right font-semibold">
                {formatCurrency(isAnnual ? annualSalary : annualSalary / 12)}
                <div className="flex justify-end mt-1">
                  <SFMCodeBadge sfmId={isAnnual ? 'SFM-APF-1501' : 'SFM-APF-1502'} />
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {formatCurrency(isAnnual ? (annualSalary - feasibleAPFFunding) : (annualSalary - feasibleAPFFunding) / 12)}
                </div>
                <div className="flex justify-end mt-1">
                  <SFMCodeBadge sfmId={isAnnual ? 'SFM-APF-1505' : 'SFM-APF-1506'} />
                </div>
              </div>

              {/* Salary Sacrifice row */}
              <div>
                Salary Sacrifice <span className="ml-2 text-xs text-gray-500">{frequencyLabel}</span>
              </div>
              <div className="text-right text-gray-500 font-medium">£ n/a</div>
              <div className="text-right">
                <div className="font-semibold text-red-600">-{formatCurrency(isAnnual ? feasibleAPFFunding : feasibleAPFFunding / 12)}</div>
                <div className="flex justify-end mt-1">
                  <SFMCodeBadge sfmId={isAnnual ? 'SFM-APF-1507' : 'SFM-APF-1508'} />
                </div>
              </div>

              {/* Net Pay row */}
              <div>
                Net Pay <span className="ml-2 text-xs text-gray-500">{frequencyLabel}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">{formatCurrency(isAnnual ? (payslipComparison.before.netPay || 0) * 12 : (payslipComparison.before.netPay || 0))}</div>
                <div className="flex justify-end mt-1">
                  <SFMCodeBadge sfmId={isAnnual ? 'SFM-APF-1503' : 'SFM-APF-1504'} />
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">{formatCurrency(isAnnual ? (payslipComparison.after.netPay || 0) * 12 : (payslipComparison.after.netPay || 0))}</div>
                <div className="flex justify-end mt-1">
                  <SFMCodeBadge sfmId={isAnnual ? 'SFM-APF-1509' : 'SFM-APF-1510'} />
                </div>
              </div>
            </div>
          </div>
          {/* Reduction & Guarantee */}
          <div className="mt-4 text-sm space-y-3">
            <div>
              <div className="flex items-baseline justify-between">
                <div>
                  Net Pay Reduction <span className="ml-2 text-xs text-gray-500">{frequencyLabel}</span>
                </div>
                <div className="text-right font-semibold text-red-600">
                  -{formatCurrency(isAnnual ? (payslipComparison.netPayDifference || 0) * 12 : (payslipComparison.netPayDifference || 0))}
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <SFMCodeBadge sfmId={isAnnual ? 'SFM-APF-1511' : 'SFM-APF-1513'} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <div>
                  Net Pay Guarantee <span className="ml-2 text-xs text-gray-500">{frequencyLabel}</span>
                </div>
                <div className="text-right font-semibold text-green-600">
                  +{formatCurrency(isAnnual ? annualNPG : (payslipComparison.npgAmount || 0))}
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <SFMCodeBadge sfmId={isAnnual ? 'SFM-APF-1512' : 'SFM-APF-1514'} />
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-700">
            The outcome achieved is a zero reduction in net spending and a sponsored contribution of {formatCurrency(feasibleAPFFunding)} for the current 2025/26 Tax Year ✅
          </p>
        </div>

        {/* Payslip Comparison label (with info icon) shown directly above the Monthly Salary Exchange Schedule */}
        <div className="flex justify-start">
          <PayslipComparisonDialog payslipComparison={payslipComparison} showMonthly={true} />
        </div>

        {/* Open schedule as modal instead of inline table */}
        <MonthlySalaryExchangeDialog 
          monthlySalaryExchange={feasibleAPFFunding / 12}
          monthlyNetPayReduction={payslipComparison.netPayDifference}
          monthlyNetPayGuarantee={payslipComparison.npgAmount}
          annualSalaryExchange={feasibleAPFFunding}
          annualNetPayReduction={payslipComparison.netPayDifference * 12}
          annualNetPayGuarantee={annualNPG}
        />

        <APFStep5ConfirmationSection
          profile={profile}
          feasibleAPFFunding={feasibleAPFFunding}
          annualNPG={annualNPG}
          annualNetPayReduction={annualNetPayReduction}
          formData={formData}
          setFormData={setFormData}
          canProceed={canProceed}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}
