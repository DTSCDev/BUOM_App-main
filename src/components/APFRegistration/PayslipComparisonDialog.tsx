
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";
import { PayslipComparison } from "@/hooks/usePayslipCalculations";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import SFMCodeBadge from "@/components/SystemFields/SFMCodeBadge";

interface PayslipComparisonDialogProps {
  payslipComparison: PayslipComparison;
  showMonthly: boolean;
  showLabel?: boolean;
}

export function PayslipComparisonDialog({ payslipComparison, showMonthly, showLabel = true }: PayslipComparisonDialogProps) {
  const { before, after, inblLoanAmount } = payslipComparison;
  const [isMonthly, setIsMonthly] = useState<boolean>(showMonthly ?? true);
  const multiplier = isMonthly ? 1 : 12;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto px-2 py-1">
          {showLabel && (
            <span className="text-lg font-semibold text-gray-700 mr-1">Payslip Comparison</span>
          )}
          <Info className="h-4 w-4" style={{ color: '#1f2937' }} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] md:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-0">
          <div className="rounded-t-md px-4 py-3" style={{ backgroundColor: '#4FF456', color: '#374151' }}>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-700">Payslip Comparison</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        {/* Toggle on its own line outside header */}
        <div className="px-4 pt-3 flex items-center justify-end gap-2">
          <span className={`${isMonthly ? "text-gray-700 font-semibold" : "text-gray-700"} text-xs`}>Monthly</span>
          <Switch checked={!isMonthly} onCheckedChange={(checked) => setIsMonthly(!checked)} aria-label="Toggle Monthly/Annual" />
          <span className={`${!isMonthly ? "text-gray-700 font-semibold" : "text-gray-700"} text-xs`}>Annual</span>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-4 items-stretch">
            {/* Before APF Payslip */}
            <div className="flex flex-col space-y-3 h-full">
              <h3 className="font-semibold text-gray-700 border-b pb-2">
                Current Payslip (before APF)
              </h3>
              <div className="flex flex-col space-y-2 text-sm flex-1">
                <div className="flex justify-between">
                  <span>Gross Pay:</span>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(before.grossPay * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1520" : "SFM-APF-1540"} /></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Pension Contribution (AE):</span>
                  <div className="text-right">
                    <span className="font-medium text-red-600">-{formatCurrency(before.pensionContribution * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1521" : "SFM-APF-1541"} /></div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Gross Pay After Pension:</span>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(before.grossPayAfterPension * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1522" : "SFM-APF-1542"} /></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Income Tax:</span>
                  <div className="text-right">
                    <span className="font-medium text-red-600">-{formatCurrency(before.incomeTax * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1523" : "SFM-APF-1543"} /></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>National Insurance:</span>
                  <div className="text-right">
                    <span className="font-medium text-red-600">-{formatCurrency(before.nationalInsurance * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1524" : "SFM-APF-1544"} /></div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold mt-auto">
                  <span>Net Payslip Amount:</span>
                  <div className="text-right">
                    <span className="text-green-600">{formatCurrency(before.netPay * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1525" : "SFM-APF-1545"} /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* After APF Payslip */}
            <div className="flex flex-col space-y-3 h-full">
              <h3 className="font-semibold text-gray-700 border-b pb-2">
                New Payslip (with APF)
              </h3>
              <div className="flex flex-col space-y-2 text-sm flex-1">
                <div className="flex justify-between">
                  <span>Gross Pay:</span>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(before.grossPay * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1533" : "SFM-APF-1550"} /></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>APF Salary Sacrifice:</span>
                  <div className="text-right">
                    <span className="font-medium text-red-600">-{formatCurrency((before.grossPay - after.grossPayAfterPension) * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1534" : "SFM-APF-1551"} /></div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Gross Pay After APF:</span>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(after.grossPayAfterPension * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1535" : "SFM-APF-1552"} /></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Income Tax:</span>
                  <div className="text-right">
                    <span className="font-medium text-red-600">-{formatCurrency(after.incomeTax * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1536" : "SFM-APF-1553"} /></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>National Insurance:</span>
                  <div className="text-right">
                    <span className="font-medium text-red-600">-{formatCurrency(after.nationalInsurance * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1537" : "SFM-APF-1554"} /></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>INBL Loan Support:</span>
                  <div className="text-right">
                    <span className="font-medium text-green-600">+{formatCurrency(inblLoanAmount * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1538" : "SFM-APF-1555"} /></div>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold mt-auto">
                  <span>Net Payslip Amount:</span>
                  <div className="text-right">
                    <span className="text-green-600">{formatCurrency((after.netPay + inblLoanAmount) * multiplier)}</span>
                    <div className="flex justify-end mt-1"><SFMCodeBadge sfmId={isMonthly ? "SFM-APF-1539" : "SFM-APF-1556"} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deprecated summary card removed as requested */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
