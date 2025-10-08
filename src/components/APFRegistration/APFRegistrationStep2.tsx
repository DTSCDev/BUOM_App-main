
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatUtils";
import { AlertCircle, TrendingUp } from "lucide-react";

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
}

interface DashboardData {
  apfTargetIncome?: number;
  isaTargetMonthly?: number;
  currentAge?: number;
  retirementAge?: number;
  existingPensionValue?: number;
  totalAPFFunding?: number;
  totalMaturityValue?: number;
  shortfallAmount?: number;
  capitalShortfall?: number;
  shortfall?: number;
  existingPlanIncomeAtRetirement?: number;
  targetIncomeAtRetirement?: number;
}

interface FormData {
  annualSalary: number;
  existingPensionValue: number;
  inblFundingApproved: boolean;
  shortfallAmount?: number;
  monthlyISAContribution?: number;
}

interface APFRegistrationStep2Props {
  onNext: (data: FormData) => void;
  onBack: () => void;
  profile: Profile;
  dashboardData: DashboardData;
}

export function APFRegistrationStep2({ onNext, onBack, profile, dashboardData }: APFRegistrationStep2Props) {
  const [formData, setFormData] = useState({
    annualSalary: profile?.annual_salary || 60000,
    existingPensionValue: 157088, // Default calculated value
    inblFundingApproved: false
  });

  // Use dashboard calculations for shortfall
  const shortfallAmount = (dashboardData?.apfTargetIncome || 0) * 25; // Approximate shortfall
  const monthlyISAContribution = dashboardData?.isaTargetMonthly || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ ...formData, shortfallAmount, monthlyISAContribution });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Financial Assessment</CardTitle>
        <p className="text-sm text-muted-foreground">
          Review and confirm your financial details from the calculator.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Annual Salary</Label>
              <Input
                id="salary"
                type="number"
                value={formData.annualSalary}
                onChange={(e) => setFormData(prev => ({ ...prev, annualSalary: e.target.value === '' ? 0 : parseFloat(e.target.value) }))}
              />
              <p className="text-xs text-muted-foreground">Pre-populated from calculator</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pension">Existing Pension Value</Label>
              <Input
                id="pension"
                type="number"
                value={formData.existingPensionValue}
                onChange={(e) => setFormData(prev => ({ ...prev, existingPensionValue: e.target.value === '' ? 0 : parseFloat(e.target.value) }))}
              />
              <p className="text-xs text-muted-foreground">Calculated based on contribution history</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900">Retirement Shortfall Analysis</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current projected income at retirement:</span>
                    <span className="font-medium">{formatCurrency(dashboardData?.existingPlanIncomeAtRetirement || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target retirement income:</span>
                    <span className="font-medium">{formatCurrency(dashboardData?.targetIncomeAtRetirement || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="font-medium">Income shortfall:</span>
                    <span className="font-bold text-red-600">{formatCurrency(dashboardData?.apfTargetIncome || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Capital required (25x multiple):</span>
                    <span className="font-bold">{formatCurrency(shortfallAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">INBL Funding Proposal</h4>
                <p className="text-sm text-blue-800 mt-1">
                  We propose securing {formatCurrency(shortfallAmount)} through our Invest Now Buy Later (INBL) facility.
                  This will be funded through optimized ISA contributions and tax-efficient strategies.
                </p>
                <div className="mt-3 p-3 bg-white rounded border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Proposed monthly ISA contribution:</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(monthlyISAContribution)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <input
              type="checkbox"
              id="inbl-approval"
              checked={formData.inblFundingApproved}
              onChange={(e) => setFormData(prev => ({ ...prev, inblFundingApproved: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="inbl-approval" className="text-sm">
              I approve the INBL funding amount of {formatCurrency(shortfallAmount)} to secure my retirement funding
            </Label>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" disabled={!formData.inblFundingApproved}>
              Continue to Affordability Check
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
