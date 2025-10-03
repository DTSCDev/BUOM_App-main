
import { TrendingUp, Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePayslipCalculations } from "@/hooks/usePayslipCalculations";

interface ISAChartHeaderProps {
  finalISABalance: number;
  profile: any;
  sponsorships: any[];
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
              <div className="text-xs space-y-1">
                {sponsorships.map((sponsorship, index) => {
                  const payslipComparison = calculatePayslipComparison(annualSalary, sponsorship.sponsorshipAmount);
                  const annualINBLPrincipal = payslipComparison.totalINBLPrincipal * 12;
                  const repaymentAge = sponsorship.age + 20; // INBL gets repaid 20 years after sponsorship
                  
                  return (
                    <p key={index}>
                      • <strong>Age {repaymentAge}:</strong> Year {sponsorship.year} INBL debt £{annualINBLPrincipal.toLocaleString()} gets repaid
                    </p>
                  );
                })}
                <p>• <strong>Final ISA Balance:</strong> £{finalISABalance.toLocaleString()} remains after full INBL repayment</p>
              </div>
            </div>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    </div>
  );
};
