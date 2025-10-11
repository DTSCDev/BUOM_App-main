
import { Card, CardContent } from "@/components/ui/card";
import SFMCodeBadge from "@/components/SystemFields/SFMCodeBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatUtils";
import { getPensionParameters } from "@/utils/pensionParameters";

interface APFStep5MonthlyScheduleTableProps {
  monthlySalaryExchange: number;
  monthlyNetPayReduction: number;
  monthlyNetPayGuarantee: number;
  annualSalaryExchange: number;
  annualNetPayReduction: number;
  annualNetPayGuarantee: number;
}

export function APFStep5MonthlyScheduleTable({ 
  monthlySalaryExchange, 
  monthlyNetPayReduction, 
  monthlyNetPayGuarantee,
  annualSalaryExchange,
  annualNetPayReduction,
  annualNetPayGuarantee
}: APFStep5MonthlyScheduleTableProps) {
  // Parameterized schedule length using Pension Parameters
  const { salaryExchangeMonths } = getPensionParameters();
  const monthlyScheduleData = Array.from({ length: salaryExchangeMonths }, (_, index) => ({
    month: `Month ${index + 1}`,
    salaryExchange: monthlySalaryExchange,
    netPayReduction: monthlyNetPayReduction,
    netPayGuarantee: monthlyNetPayGuarantee
  }));

  return (
    <Card>
      <CardContent>
        <p className="text-sm mb-2" style={{ color: '#374151' }}>
          This schedule shows your monthly salary exchange and how the Net Pay Guarantee (NPG) ensures no reduction in your net monthly spending whilst APF is in motion. The NPG amount is added to your 0% interest INBL Loan account each month.
        </p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-gray-700">Month</TableHead>
                <TableHead className="font-semibold text-right text-gray-700">Salary Exchange</TableHead>
                <TableHead className="font-semibold text-right text-gray-700">Net Pay Reduction</TableHead>
                <TableHead className="font-semibold text-right text-green-600">Net Pay Guarantee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyScheduleData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className={index === 0 ? 'font-bold text-gray-700' : 'font-medium text-gray-700'}>{row.month}</TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    -{formatCurrency(row.salaryExchange)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    -{formatCurrency(row.netPayReduction)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    +{formatCurrency(row.netPayGuarantee)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Total Row */}
              <TableRow className="border-t-2 border-gray-300">
                <TableCell className="font-bold text-gray-700">Total ({salaryExchangeMonths} Months)</TableCell>
                <TableCell className="text-right font-bold bg-red-600 text-white" data-sfm-id="SFM-APF-1530">
                  -{formatCurrency(annualSalaryExchange)}
                </TableCell>
                <TableCell className="text-right font-bold bg-red-600 text-white" data-sfm-id="SFM-APF-1531">
                  -{formatCurrency(annualNetPayReduction)}
                </TableCell>
                <TableCell className="text-right font-bold bg-green-600 text-white" data-sfm-id="SFM-APF-1532">
                  +{formatCurrency(annualNetPayGuarantee)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* SFM badges on their own line below the total row */}
          <div className="grid grid-cols-4 gap-x-6 mt-2">
            <div></div>
            <div className="flex justify-end"><SFMCodeBadge sfmId="SFM-APF-1530" /></div>
            <div className="flex justify-end"><SFMCodeBadge sfmId="SFM-APF-1531" /></div>
            <div className="flex justify-end"><SFMCodeBadge sfmId="SFM-APF-1532" /></div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-green-900">Net Impact on Your Take-Home Pay:</span>
            <span className="text-lg font-bold text-green-600">{formatCurrency(0)}</span>
          </div>
          <p className="text-sm text-green-800 mt-1">
            The Net Pay Guarantee ensures your net spending power each month remains unchanged whilst APF is in motion.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
