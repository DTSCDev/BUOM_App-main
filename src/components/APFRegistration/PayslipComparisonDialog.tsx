
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";
import { PayslipComparison } from "@/hooks/usePayslipCalculations";

interface PayslipComparisonDialogProps {
  payslipComparison: PayslipComparison;
  showMonthly: boolean;
}

export function PayslipComparisonDialog({ payslipComparison, showMonthly }: PayslipComparisonDialogProps) {
  const { before, after, inblLoanAmount } = payslipComparison;
  const multiplier = showMonthly ? 1 : 12;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          <Info className="h-4 w-4 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Net Pay Guarantee Calculation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before APF Payslip */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                Before APF (Current Payslip)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross Pay:</span>
                  <span className="font-medium">{formatCurrency(before.grossPay * multiplier)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pension Contribution (AE):</span>
                  <span className="font-medium text-red-600">-{formatCurrency(before.pensionContribution * multiplier)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Gross Pay After Pension:</span>
                  <span className="font-medium">{formatCurrency(before.grossPayAfterPension * multiplier)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Income Tax:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(before.incomeTax * multiplier)}</span>
                </div>
                <div className="flex justify-between">
                  <span>National Insurance:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(before.nationalInsurance * multiplier)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Net Pay:</span>
                  <span className="text-green-600">{formatCurrency(before.netPay * multiplier)}</span>
                </div>
              </div>
            </div>

            {/* After APF Payslip */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                With APF & INBL
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross Pay:</span>
                  <span className="font-medium">{formatCurrency(before.grossPay * multiplier)}</span>
                </div>
                <div className="flex justify-between">
                  <span>APF Salary Sacrifice:</span>
                  <span className="font-medium text-red-600">-{formatCurrency((before.grossPay - after.grossPayAfterPension) * multiplier)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Gross Pay After APF:</span>
                  <span className="font-medium">{formatCurrency(after.grossPayAfterPension * multiplier)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Income Tax:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(after.incomeTax * multiplier)}</span>
                </div>
                <div className="flex justify-between">
                  <span>National Insurance:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(after.nationalInsurance * multiplier)}</span>
                </div>
                <div className="flex justify-between">
                  <span>INBL Loan Support:</span>
                  <span className="font-medium text-green-600">+{formatCurrency(inblLoanAmount * multiplier)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Net Pay:</span>
                  <span className="text-green-600">{formatCurrency((after.netPay + inblLoanAmount) * multiplier)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Net Pay Guarantee Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Original Net Pay:</span>
                <span className="font-medium">{formatCurrency(before.netPay * multiplier)}</span>
              </div>
              <div className="flex justify-between">
                <span>Net Pay with APF & INBL:</span>
                <span className="font-medium">{formatCurrency((after.netPay + inblLoanAmount) * multiplier)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold">
                <span>Net Pay Difference:</span>
                <span className="text-green-600">{formatCurrency(0)}</span>
              </div>
            </div>
            <p className="text-xs text-green-800 mt-2">
              The INBL loan exactly covers your net pay reduction, ensuring you're no worse off.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
