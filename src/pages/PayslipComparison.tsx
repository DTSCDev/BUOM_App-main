import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePayslipCalculations } from '@/hooks/usePayslipCalculations';
import { formatCurrency } from '@/utils/formatUtils';

const PayslipComparison = () => {
  const [annualSalary, setAnnualSalary] = useState(50000);
  const [pensionContribution, setPensionContribution] = useState(5);
  const [taxCode, setTaxCode] = useState('1257L');
  
  const { calculatePayslipComparison } = usePayslipCalculations();
  
  const handleCalculate = () => {
    // Implementation for payslip comparison calculation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payslip Comparison Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Compare different payslip scenarios with various tax codes and pension contributions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Salary & Tax Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="salary">Annual Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="pension">Pension Contribution (%)</Label>
                <Input
                  id="pension"
                  type="number"
                  value={pensionContribution}
                  onChange={(e) => setPensionContribution(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="taxCode">Tax Code</Label>
                <Input
                  id="taxCode"
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                />
              </div>
              <Button onClick={handleCalculate} className="w-full">
                Calculate Payslip
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card>
            <CardHeader>
              <CardTitle>Payslip Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Payslip results will be displayed here */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gross Pay:</span>
                  <span>{formatCurrency(annualSalary / 12)}</span>
                </div>
                {/* Add more payslip details */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PayslipComparison;