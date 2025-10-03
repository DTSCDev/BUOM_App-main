
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatUtils";

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
  // Generate 12 months of data using the actual props passed to the component
  const monthlyScheduleData = Array.from({ length: 12 }, (_, index) => ({
    month: `Month ${index + 1}`,
    salaryExchange: monthlySalaryExchange,
    netPayReduction: monthlyNetPayReduction,
    netPayGuarantee: monthlyNetPayGuarantee
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Salary Exchange Schedule</CardTitle>
        <p className="text-sm text-gray-600">
          This schedule shows your monthly salary exchange and how the Net Pay Guarantee ensures no reduction in your take-home pay.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Month</TableHead>
                <TableHead className="font-semibold text-right">Salary Exchange</TableHead>
                <TableHead className="font-semibold text-right">Net Pay Reduction</TableHead>
                <TableHead className="font-semibold text-right">Net Pay Guarantee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyScheduleData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.month}</TableCell>
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
              <TableRow className="border-t-2 border-gray-300 bg-gray-50">
                <TableCell className="font-bold">Total (12 Months)</TableCell>
                <TableCell className="text-right font-bold text-red-600">
                  -{formatCurrency(annualSalaryExchange)}
                </TableCell>
                <TableCell className="text-right font-bold text-red-600">
                  -{formatCurrency(annualNetPayReduction)}
                </TableCell>
                <TableCell className="text-right font-bold text-green-600">
                  +{formatCurrency(annualNetPayGuarantee)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-green-900">Net Impact on Your Take-Home Pay:</span>
            <span className="text-lg font-bold text-green-600">{formatCurrency(0)}</span>
          </div>
          <p className="text-sm text-green-800 mt-1">
            The Net Pay Guarantee ensures your take-home pay remains unchanged throughout the salary exchange period.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
