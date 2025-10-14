
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/utils/formatUtils";
import { MetricCard } from "@/components/Dashboard/MetricCard";
import { usePayslipCalculations } from "@/hooks/usePayslipCalculations";
import { APFSponsorshipBreakdown } from "@/utils/pension/buomTypes";
import { useRetirementCalculatorHub } from "@/hooks/useRetirementCalculatorHub";
import { getPensionParameters } from "@/utils/pensionParameters";
import { useState } from "react";

interface ProfileForINBLCard {
  annual_salary?: number;
  paye_tax_code?: string;
  is_director?: boolean;
  p11d?: string | number | null;
}

interface APFINBLRepaymentPlanCardProps {
  showMonthly: boolean;
  onToggle: (showMonthly: boolean) => void;
  sponsorships: APFSponsorshipBreakdown[];
  profile: ProfileForINBLCard;
}

export function APFINBLRepaymentPlanCard({ showMonthly, onToggle, sponsorships, profile }: APFINBLRepaymentPlanCardProps) {
  const { calculatePayslipComparison } = usePayslipCalculations();
  const hub = useRetirementCalculatorHub();
  const params = getPensionParameters();
  // Local toggle for Year 1 card only (default Monthly)
  const [showMonthlyYear1, setShowMonthlyYear1] = useState(true);

  const toShortTaxYear = (ty: unknown): string => {
    const s = String(ty ?? "");
    const parts = s.split("/");
    if (parts.length === 2 && parts[1].length === 4) {
      return `${parts[0]}/${parts[1].slice(2)}`;
    }
    return s;
  };

  if (!sponsorships || sponsorships.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Calculating repayment plan...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const safeNumber = (v: unknown, fallback = 0): number => {
    const n = typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : fallback;
  };

  const annualSalary = safeNumber(profile?.annual_salary, 60000);

  console.log(`=== DYNAMIC INBL REPAYMENT PLAN (${sponsorships.length} sponsorships) ===`);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            <span style={{ color: '#4FF456' }}>INBL Repayment Plan by Sponsorship Years ({sponsorships.length} Year{sponsorships.length !== 1 ? 's' : ''})</span>
          </CardTitle>
          {/* Global toggle removed per requirement; card-specific toggle added inside Year 1 card. */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* FIXED: Display ALL actual sponsorships dynamically (not hardcoded slice(0, 3)) */}
          {sponsorships.map((sponsorship, index) => {
            // Base payslip comparison for this year's sponsorship amount with guards
            const sAmount = safeNumber(sponsorship.sponsorshipAmount, 0);
            let payslipComparisonDefault: ReturnType<typeof calculatePayslipComparison> | null = null;
            try {
              payslipComparisonDefault = calculatePayslipComparison(annualSalary, sAmount);
            } catch {
              payslipComparisonDefault = null;
            }

            // Defaults (monthly basis)
            let npgMonthly = payslipComparisonDefault?.npgAmount || 0;
            let nrsrMonthly = payslipComparisonDefault?.nrsrFee || 0;
            let inblMonthly = payslipComparisonDefault?.totalINBLPrincipal || 0;
            let isaMonthlyRequired = safeNumber(sponsorship.isaMonthlyRequired, 0);

            // Year 1 MUST follow APF codes as per instruction
            if (sponsorship.year === 1) {
              // APF-4201-M: Year 1 Max Initial Contribution
              const parseCurrencyToNumber = (raw?: string | number | null): number => {
                if (!raw) return 0;
                const cleaned = String(raw).replace(/[^0-9.-]/g, "");
                const n = Number(cleaned);
                return isNaN(n) ? 0 : n;
              };
              const p11d = parseCurrencyToNumber(profile?.p11d);
              const feasibleAPFFunding = Math.max(0, annualSalary + p11d - params.personalAllowance);

              // Recompute payslip comparison using APF-4201-M funding
              let npgMonthlyYear1 = 0;
              try {
                const pcYear1 = calculatePayslipComparison(annualSalary, feasibleAPFFunding);
                npgMonthlyYear1 = pcYear1.npgAmount; // monthly
              } catch {
                npgMonthlyYear1 = 0;
              }

              // Apply APF rules
              npgMonthly = npgMonthlyYear1; // NPG
              nrsrMonthly = npgMonthly * 0.25; // 25% of NPG
              inblMonthly = npgMonthly + nrsrMonthly; // NPG + NRSR

              // APF-4211-M (Year 1 Maturity) = APF-4201-M × maturity multiplier
              const year1Maturity = feasibleAPFFunding * params.apfMaturityMultiplier;
              isaMonthlyRequired = year1Maturity * 0.00098; // monthly ISA per rule

              console.log(
                `Year 1 (APF rules): APF-4201-M £${feasibleAPFFunding.toLocaleString()}, NPG £${npgMonthly.toLocaleString()}, NRSR £${nrsrMonthly.toLocaleString()}, INBL £${inblMonthly.toLocaleString()}, ISA/m £${isaMonthlyRequired.toLocaleString()}`
              );
            }

            // Use local toggle ONLY for Year 1; other years remain Monthly by default
            const displayMultiplier = sponsorship.year === 1
              ? (showMonthlyYear1 ? 1 : 12)
              : 1;

            const npgDisplay = npgMonthly * displayMultiplier;
            const nrsrDisplay = nrsrMonthly * displayMultiplier;
            const inblDisplay = inblMonthly * displayMultiplier;
            const isaDisplay = isaMonthlyRequired * displayMultiplier;

            console.log(
              `Year ${sponsorship.year}: NPG £${npgDisplay.toLocaleString()}, NRSR £${nrsrDisplay.toLocaleString()}, INBL £${inblDisplay.toLocaleString()}, ISA £${isaDisplay.toLocaleString()}`
            );

            return (
              <div key={sponsorship.year} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg text-green-600">INBL Year {sponsorship.year} ({toShortTaxYear(sponsorship.taxYear)})</h4>
                  <span className="text-sm text-gray-600">Age {sponsorship.age}</span>
                </div>

                {sponsorship.year === 1 && (
                  <div className="flex justify-end mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${showMonthlyYear1 ? '' : 'text-gray-300'}`}
                        style={showMonthlyYear1 ? { color: '#4FF456' } : undefined}
                      >
                        Monthly
                      </span>
                      <Switch
                        checked={!showMonthlyYear1}
                        onCheckedChange={(checked) => setShowMonthlyYear1(!checked)}
                        className="bg-[#4FF456] scale-[.67]"
                        style={{ backgroundColor: '#4FF456' }}
                      />
                      <span
                        className={`text-sm font-medium ${showMonthlyYear1 ? 'text-gray-300' : ''}`}
                        style={!showMonthlyYear1 ? { color: '#4FF456' } : undefined}
                      >
                        Annual
                      </span>
                    </div>
                  </div>
                )}
                
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <MetricCard
                     title="NPG Amount"
                     value={formatCurrency(npgDisplay)}
                     headerBgColor="bg-green-600"
                     valueTextColor="text-green-600"
                     sfmCode={`SFM-APF-${4220 + sponsorship.year}-M`}
                   />
                   
                   <MetricCard
                     title="NRSR Fee"
                     value={formatCurrency(nrsrDisplay)}
                     headerBgColor="bg-green-600"
                     valueTextColor="text-green-600"
                     sfmCode={`SFM-APF-${4230 + sponsorship.year}-M`}
                   />
                   
                   <MetricCard
                     title="Total INBL Principal"
                     value={formatCurrency(inblDisplay)}
                     headerBgColor="bg-green-600"
                     valueTextColor="text-green-600"
                     sfmCode={`SFM-APF-${4240 + sponsorship.year}-M`}
                   />
                   
                   <MetricCard
                     title="ISA Contributions"
                     value={formatCurrency(isaDisplay)}
                     headerBgColor="bg-blue-600"
                     valueTextColor="text-blue-600"
                     sfmCode={`SFM-APF-${4260 + sponsorship.year}-M`}
                   />
                 </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <strong>Note:</strong> Figures shown represent {showMonthly ? 'monthly' : 'annual'} amounts calculated from your specific salary and tax situation for {sponsorships.length} sponsorship year{sponsorships.length !== 1 ? 's' : ''}. 
          NPG Amount is your actual net pay reduction from salary sacrifice. All calculations are based on your current PAYE tax code ({profile?.paye_tax_code || '1257L'}) 
          and {profile?.is_director ? 'director' : 'employee'} status.
        </div>
      </CardContent>
    </Card>
  );
}
