import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { APFStep5MonthlyScheduleTable } from "./APFStep5Components/APFStep5MonthlyScheduleTable";

interface MonthlySalaryExchangeDialogProps {
  monthlySalaryExchange: number;
  monthlyNetPayReduction: number;
  monthlyNetPayGuarantee: number;
  annualSalaryExchange: number;
  annualNetPayReduction: number;
  annualNetPayGuarantee: number;
}

export function MonthlySalaryExchangeDialog({
  monthlySalaryExchange,
  monthlyNetPayReduction,
  monthlyNetPayGuarantee,
  annualSalaryExchange,
  annualNetPayReduction,
  annualNetPayGuarantee
}: MonthlySalaryExchangeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto px-2 py-1">
          <span className="text-lg font-semibold text-gray-700 mr-1">Monthly Salary Exchange Schedule</span>
          <Info className="h-4 w-4" style={{ color: '#1f2937' }} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] md:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-0">
          <div className="rounded-t-md px-4 py-3" style={{ backgroundColor: '#4FF456', color: '#374151' }}>
            <DialogTitle className="text-xl font-semibold" style={{ color: '#374151' }}>Monthly Salary Exchange Schedule</DialogTitle>
          </div>
        </DialogHeader>
        {/* Description moved into table card to avoid duplication under the header */}
        <div className="pt-2 px-4 pb-4">
          <APFStep5MonthlyScheduleTable
            monthlySalaryExchange={monthlySalaryExchange}
            monthlyNetPayReduction={monthlyNetPayReduction}
            monthlyNetPayGuarantee={monthlyNetPayGuarantee}
            annualSalaryExchange={annualSalaryExchange}
            annualNetPayReduction={annualNetPayReduction}
            annualNetPayGuarantee={annualNetPayGuarantee}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}