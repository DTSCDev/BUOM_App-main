
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/utils/formatUtils";
import { Clock } from "lucide-react";
import { MetricCard } from "@/components/Dashboard/MetricCard";
import { usePayslipCalculations } from "@/hooks/usePayslipCalculations";
import { APFSponsorshipBreakdown } from "@/utils/pension/buomTypes";

interface APFINBLRepaymentPlanCardProps {
  showMonthly: boolean;
  onToggle: (showMonthly: boolean) => void;
  sponsorships: APFSponsorshipBreakdown[];
  profile: any;
}

export function APFINBLRepaymentPlanCard({ showMonthly, onToggle, sponsorships, profile }: APFINBLRepaymentPlanCardProps) {
  const { calculatePayslipComparison } = usePayslipCalculations();

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

  const annualSalary = profile?.annual_salary || 60000;

  console.log(`=== DYNAMIC INBL REPAYMENT PLAN (${sponsorships.length} sponsorships) ===`);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>INBL Repayment Plan by Sponsorship Years ({sponsorships.length} Year{sponsorships.length !== 1 ? 's' : ''})</span>
          </CardTitle>
          <div className="flex items-center gap-4">
            <span className={showMonthly ? 'text-blue-600 font-medium' : 'text-gray-400'}>Monthly</span>
            <Switch
              checked={!showMonthly}
              onCheckedChange={(checked) => onToggle(!checked)}
            />
            <span className={!showMonthly ? 'text-blue-600 font-medium' : 'text-gray-400'}>Annual</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* FIXED: Display ALL actual sponsorships dynamically (not hardcoded slice(0, 3)) */}
          {sponsorships.map((sponsorship, index) => {
            // Calculate payslip comparison for this year's sponsorship amount
            const payslipComparison = calculatePayslipComparison(annualSalary, sponsorship.sponsorshipAmount);
            
            // Get the values for this year
            const npgAmount = payslipComparison.npgAmount; // Monthly NPG
            const nrsrFee = payslipComparison.nrsrFee; // Monthly NRSR fee
            const totalINBLPrincipal = payslipComparison.totalINBLPrincipal; // Monthly total
            const isaMonthlyRequired = sponsorship.isaMonthlyRequired || 0;
            
            const displayMultiplier = showMonthly ? 1 : 12;

            console.log(`Year ${sponsorship.year}: NPG £${npgAmount.toLocaleString()}, NRSR £${nrsrFee.toLocaleString()}, INBL £${totalINBLPrincipal.toLocaleString()}`);

            return (
              <div key={sponsorship.year} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-lg">Year {sponsorship.year} ({sponsorship.taxYear})</h4>
                  <span className="text-sm text-gray-600">Age {sponsorship.age}</span>
                </div>
                
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <MetricCard
                     title="NPG Amount"
                     value={formatCurrency(npgAmount * displayMultiplier)}
                     headerBgColor="bg-green-600"
                     valueTextColor="text-green-600"
                     sfmCode={`SFM-151-${sponsorship.year}`}
                   />
                   
                   <MetricCard
                     title="NRSR Fee"
                     value={formatCurrency(nrsrFee * displayMultiplier)}
                     headerBgColor="bg-green-600"
                     valueTextColor="text-green-600"
                     sfmCode={`SFM-152-${sponsorship.year}`}
                   />
                   
                   <MetricCard
                     title="Total INBL Principal"
                     value={formatCurrency(totalINBLPrincipal * displayMultiplier)}
                     headerBgColor="bg-green-600"
                     valueTextColor="text-green-600"
                     sfmCode={`SFM-153-${sponsorship.year}`}
                   />
                   
                   <MetricCard
                     title="ISA Contributions"
                     value={formatCurrency(isaMonthlyRequired * displayMultiplier)}
                     headerBgColor="bg-blue-600"
                     valueTextColor="text-blue-600"
                     sfmCode={`SFM-154-${sponsorship.year}`}
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
