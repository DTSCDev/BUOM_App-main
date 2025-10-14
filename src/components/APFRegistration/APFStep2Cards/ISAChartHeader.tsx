
import { TrendingUp, Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePayslipCalculations } from "@/hooks/usePayslipCalculations";
import { APFSponsorshipBreakdown } from "@/utils/pension/buomTypes";

interface Profile {
  annual_salary?: number;
  date_of_birth?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  paye_tax_code?: string;
  is_director?: boolean;
  has_controlling_shares?: boolean;
  p11d?: number | string;
}

interface ISAChartHeaderProps {
  finalISABalance: number;
  profile: Profile;
  sponsorships: APFSponsorshipBreakdown[];
}

export const ISAChartHeader = ({ finalISABalance, profile, sponsorships }: ISAChartHeaderProps) => {
  const { calculatePayslipComparison } = usePayslipCalculations();
  const annualSalary = profile?.annual_salary || 60000;

  return (
    <div className="flex items-center space-x-2">
      <TrendingUp className="h-5 w-5" />
      <span>ISA Repayment Analysis</span>
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-gray-500 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Key INBL Debt Repayment Milestones:</h4>
              <ul className="list-disc list-outside pl-6 text-xs space-y-1">
                {sponsorships.map((sponsorship, index) => {
                  const payslipComparison = calculatePayslipComparison(annualSalary, sponsorship.sponsorshipAmount);
                  const annualINBLPrincipal = payslipComparison.totalINBLPrincipal * 12;
                  const repaymentAge = sponsorship.age + 20; // INBL gets repaid 20 years after sponsorship
                  
                  return (
                    <li key={index}>
                      <strong>Age {repaymentAge}:</strong> Year {sponsorship.year} INBL debt £{annualINBLPrincipal.toLocaleString()} gets repaid
                    </li>
                  );
                })}
                <li><strong>Final ISA Balance:</strong> £{finalISABalance.toLocaleString()} remains after full INBL repayment</li>
              </ul>
            </div>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    </div>
  );
};
