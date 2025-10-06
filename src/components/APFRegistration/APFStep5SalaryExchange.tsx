import { useState } from "react";
import { isTestingAccount } from "@/utils/testing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APFStep5MonthlyScheduleTable } from "./APFStep5Components/APFStep5MonthlyScheduleTable";
import { APFStep5ConfirmationSection } from "./APFStep5Components/APFStep5ConfirmationSection";
import { usePayslipCalculations } from "@/hooks/usePayslipCalculations";
import { formatCurrency } from "@/utils/formatUtils";

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
  const [formData, setFormData] = useState({
    monthlyScheduleAccepted: true, // Auto-accept since checkbox removed
    salaryExchangeUnderstood: true, // Auto-accept since checkbox removed
    netPayGuaranteeAccepted: isTestingAccount() ? true : false,
    payslipChangesAcknowledged: isTestingAccount() ? true : false
  });

  const { calculatePayslipComparison } = usePayslipCalculations();
  
  // Use data from previous steps
  const sponsorships = (applicationData?.sponsorships as APFSponsorship[]) || [];
  const firstYearSponsorship = sponsorships.length > 0 ? sponsorships[0] : null;
  
  // Get proper values from Step 2 sponsorship data
  const feasibleAPFFunding = firstYearSponsorship?.sponsorshipAmount || 0; // APF funding (e.g., £47,430)
  const annualSalary = profile?.annual_salary ?? 0;
  
  // Calculate NPG using the dynamic payslip comparison - this is the correct approach
  const payslipComparison = calculatePayslipComparison(annualSalary, feasibleAPFFunding);
  const annualNPG = payslipComparison.npgAmount * 12; // Monthly NPG * 12 for annual
  
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
            5
          </div>
          Salary Exchange Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Salary Exchange Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Current Gross Salary:</span>
              <div className="font-semibold">{formatCurrency(annualSalary)}</div>
            </div>
            <div>
              <span className="text-blue-700">APF Funding Amount:</span>
              <div className="font-semibold">{formatCurrency(feasibleAPFFunding)}</div>
            </div>
            <div>
              <span className="text-blue-700">New Gross Salary:</span>
              <div className="font-semibold">{formatCurrency(annualSalary - feasibleAPFFunding)}</div>
            </div>
            <div>
              <span className="text-blue-700">Annual NPG:</span>
              <div className="font-semibold text-green-600">{formatCurrency(annualNPG)}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h4 className="font-medium">Monthly Payment Schedule</h4>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showMonthly}
              onChange={(checked) => setShowMonthly(checked.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show monthly breakdown</span>
          </label>
        </div>

        {showMonthly && (
          <APFStep5MonthlyScheduleTable 
            monthlySalaryExchange={feasibleAPFFunding / 12}
            monthlyNetPayReduction={payslipComparison.netPayDifference}
            monthlyNetPayGuarantee={payslipComparison.npgAmount}
            annualSalaryExchange={feasibleAPFFunding}
            annualNetPayReduction={payslipComparison.netPayDifference * 12}
            annualNetPayGuarantee={annualNPG}
          />
        )}

        <APFStep5ConfirmationSection
          profile={profile}
          feasibleAPFFunding={feasibleAPFFunding}
          formData={formData}
          setFormData={setFormData}
          canProceed={canProceed}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}
