
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatUtils";
import { CheckCircle, AlertTriangle } from "lucide-react";

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

interface RegistrationData {
  annualSalary?: number;
  existingPensionValue?: number;
  [key: string]: unknown;
}

interface FormData {
  currentMonthlyExpenses: number;
  budgetConfirmed: boolean;
  emergencyContact: string;
  emergencyContactPhone: string;
}

interface APFRegistrationStep3Props {
  onNext: (data: FormData) => void;
  onBack: () => void;
  dashboardData: DashboardData;
  registrationData: RegistrationData;
}

export function APFRegistrationStep3({ onNext, onBack, dashboardData, registrationData }: APFRegistrationStep3Props) {
  const [formData, setFormData] = useState({
    currentMonthlyExpenses: 0,
    budgetConfirmed: false,
    emergencyContact: "",
    emergencyContactPhone: ""
  });

  const monthlyISA = dashboardData?.isaTargetMonthly || 0;
  const currentSalary = registrationData?.annualSalary || 60000;
  const monthlyNetIncome = currentSalary * 0.75 / 12; // Approximate net monthly
  const affordabilityRatio = monthlyISA / monthlyNetIncome;
  const isAffordable = affordabilityRatio <= 0.15; // 15% of net income threshold

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold leading-tight">Step 3: Budget Affordability Check</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Before & After Assessment */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Current Situation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly net income:</span>
                  <span className="font-medium">{formatCurrency(monthlyNetIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current pension savings:</span>
                  <span className="font-medium">£340/month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Projected retirement income:</span>
                  <span className="font-medium text-red-600">{formatCurrency(dashboardData?.existingPlanIncomeAtRetirement || 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">With BUOM APF</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly net income:</span>
                  <span className="font-medium">{formatCurrency(monthlyNetIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total retirement savings:</span>
                  <span className="font-medium">£{(340 + monthlyISA).toLocaleString()}/month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Projected retirement income:</span>
                  <span className="font-medium text-green-600">{formatCurrency(dashboardData?.targetIncomeAtRetirement || 0)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Affordability Analysis */}
          <div className={`p-4 rounded-lg ${isAffordable ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <div className="flex items-start space-x-3">
              {isAffordable ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div>
                <h4 className={`font-medium ${isAffordable ? 'text-green-900' : 'text-yellow-900'}`}>
                  Affordability Assessment
                </h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Proposed monthly ISA contribution:</span>
                    <span className="font-bold">{formatCurrency(monthlyISA)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>As % of net income:</span>
                    <span className={`font-bold ${isAffordable ? 'text-green-600' : 'text-yellow-600'}`}>
                      {(affordabilityRatio * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className={`text-xs mt-2 ${isAffordable ? 'text-green-800' : 'text-yellow-800'}`}>
                    {isAffordable 
                      ? "This contribution level is within our recommended affordability guidelines (≤15% of net income)."
                      : "This contribution level exceeds our recommended guidelines. Please consider adjusting or speak with our financial review team."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expenses">Current Monthly Expenses (Optional)</Label>
              <Input
                id="expenses"
                type="number"
                value={formData.currentMonthlyExpenses}
                onChange={(e) => setFormData(prev => ({ ...prev, currentMonthlyExpenses: e.target.value === '' ? 0 : parseFloat(e.target.value) }))}
                placeholder="Enter your total monthly expenses"
              />
              <p className="text-xs text-muted-foreground">
                This helps us better assess affordability for your situation
              </p>
            </div>

            {!isAffordable && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Emergency Contact Name</Label>
                  <Input
                    id="emergency-contact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    placeholder="Contact for financial review"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency-phone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <input
              type="checkbox"
              id="budget-confirmed"
              checked={formData.budgetConfirmed}
              onChange={(e) => setFormData(prev => ({ ...prev, budgetConfirmed: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="budget-confirmed" className="text-sm">
              I confirm that the proposed monthly contribution of {formatCurrency(monthlyISA)} fits within my budget
            </Label>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.budgetConfirmed || (!isAffordable && !formData.emergencyContact)}
            >
              Continue to Tax Planning
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
