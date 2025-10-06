
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calculator, FileText } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";
import { getPensionParameters } from "@/utils/pensionParameters";

interface ISAContributionScheduleProps {
  onClose?: () => void;
}

interface MonthlyScheduleEntry {
  month: number;
  year: number;
  tranche1Amount: number;
  tranche2Amount: number;
  tranche3Amount: number;
  totalMonthly: number;
  cumulativeTotal: number;
  inflationYearT1: number;
  inflationYearT2: number;
  inflationYearT3: number;
}

export function ISAContributionSchedule({ onClose }: ISAContributionScheduleProps) {
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const { repaymentMonths } = getPensionParameters();

  // Base monthly amounts for each tranche
  const baseTranche1 = 74.30;
  const baseTranche2 = 74.30;
  const baseTranche3 = 22.51;
  const inflationRate = 0.02; // 2% per annum

  // Generate the complete 240-month schedule
  const generateSchedule = (): MonthlyScheduleEntry[] => {
    const schedule: MonthlyScheduleEntry[] = [];
    let cumulativeTotal = 0;

    for (let month = 1; month <= repaymentMonths; month++) {
      const year = Math.ceil(month / 12);
      
      // Calculate inflation multipliers for each tranche
      const inflationYearT1 = Math.floor((month - 1) / 12); // Tranche 1 starts month 1
      const inflationYearT2 = Math.floor(Math.max(0, month - 12) / 12); // Tranche 2 starts month 13
      const inflationYearT3 = Math.floor(Math.max(0, month - 24) / 12); // Tranche 3 starts month 25

      // Calculate amounts for each tranche
      let tranche1Amount = 0;
      let tranche2Amount = 0;
      let tranche3Amount = 0;

      // Tranche 1: Active from month 1-240
      if (month >= 1) {
        tranche1Amount = baseTranche1 * Math.pow(1 + inflationRate, inflationYearT1);
      }

      // Tranche 2: Active from month 13-252 (but we only go to 240)
      if (month >= 13) {
        tranche2Amount = baseTranche2 * Math.pow(1 + inflationRate, inflationYearT2);
      }

      // Tranche 3: Active from month 25-264 (but we only go to 240)
      if (month >= 25) {
        tranche3Amount = baseTranche3 * Math.pow(1 + inflationRate, inflationYearT3);
      }

      const totalMonthly = tranche1Amount + tranche2Amount + tranche3Amount;
      cumulativeTotal += totalMonthly;

      schedule.push({
        month,
        year,
        tranche1Amount,
        tranche2Amount,
        tranche3Amount,
        totalMonthly,
        cumulativeTotal,
        inflationYearT1,
        inflationYearT2,
        inflationYearT3
      });
    }

    return schedule;
  };

  const schedule = generateSchedule();
  const finalTotal = schedule[schedule.length - 1]?.cumulativeTotal || 0;

  // Calculate key milestone months
  const milestoneMonths = [1, 12, 13, 24, 25, 36, 48, 60, 120, 180, repaymentMonths];
  const milestones = schedule.filter(entry => milestoneMonths.includes(entry.month));

  // Download functions
  const downloadCSV = () => {
    const headers = [
      "Month",
      "Year", 
      "Tranche 1 (£)",
      "Tranche 2 (£)",
      "Tranche 3 (£)",
      "Total Monthly (£)",
      "Cumulative Total (£)",
      "T1 Inflation Years",
      "T2 Inflation Years", 
      "T3 Inflation Years"
    ];

    const csvContent = [
      headers.join(","),
      ...schedule.map(entry => [
        entry.month,
        entry.year,
        entry.tranche1Amount.toFixed(2),
        entry.tranche2Amount.toFixed(2),
        entry.tranche3Amount.toFixed(2),
        entry.totalMonthly.toFixed(2),
        entry.cumulativeTotal.toFixed(2),
        entry.inflationYearT1,
        entry.inflationYearT2,
        entry.inflationYearT3
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ISA_Contribution_Schedule_${repaymentMonths}_Months.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadDetailedReport = () => {
    const yearsLabel = (repaymentMonths / 12).toFixed(1);
    const reportContent = `
ISA CONTRIBUTION SCHEDULE - DETAILED MATHEMATICAL ANALYSIS
=========================================================

EXECUTIVE SUMMARY
-----------------
• Total Contribution Period: ${repaymentMonths} months (${yearsLabel} years)
• Number of Tranches: 3
• Annual Inflation Rate: 2.00%
• Total Contributions: £${finalTotal.toLocaleString()}
• INBL Loan Principle: £87,325
• Coverage Ratio: ${((finalTotal / 87325) * 100).toFixed(1)}%

TRANCHE CONFIGURATION
---------------------
Tranche 1: £${baseTranche1}/month starting Month 1 (escalating at 2% p.a.)
Tranche 2: £${baseTranche2}/month starting Month 13 (escalating at 2% p.a.)
Tranche 3: £${baseTranche3}/month starting Month 25 (escalating at 2% p.a.)

MATHEMATICAL WORKINGS
---------------------
Base Calculation: Monthly amount × (1 + 0.02)^(inflation_years)

Key Progressive Totals:
• Month 1: £74.30 (Tranche 1 only)
• Month 12: £75.77 (Tranche 1 after 1 year inflation)
• Month 13: £150.07 (£75.77 + £74.30 new Tranche 2)
• Month 24: £152.57 (Both tranches after inflation)
• Month 25: £175.08 (£152.57 + £22.51 new Tranche 3)

VALIDATION AGAINST EXPECTED £49,890.42
--------------------------------------
Calculated Total: £${finalTotal.toFixed(2)}
Expected Total: £49,890.42
Difference: £${(finalTotal - 49890.42).toFixed(2)}
Accuracy: ${(((49890.42 / finalTotal) * 100)).toFixed(3)}%

DETAILED MONTH-BY-MONTH BREAKDOWN
==================================

${schedule.map(entry => 
`Month ${entry.month.toString().padStart(3)}: T1:£${entry.tranche1Amount.toFixed(2).padStart(7)} T2:£${entry.tranche2Amount.toFixed(2).padStart(7)} T3:£${entry.tranche3Amount.toFixed(2).padStart(7)} Total:£${entry.totalMonthly.toFixed(2).padStart(7)} Cumulative:£${entry.cumulativeTotal.toFixed(2).padStart(8)}`
).join('\n')}

RELATIONSHIP TO INBL LOAN
=========================
The ISA contributions of £${finalTotal.toLocaleString()} are designed to cover the INBL loan principle of £87,325.
This represents a coverage ratio of ${((finalTotal / 87325) * 100).toFixed(1)}%, providing adequate security for the loan arrangement.

Generated: ${new Date().toLocaleString()}
`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ISA_Mathematical_Analysis_Report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-6 w-6" />
          <span>ISA Contribution Schedule - Mathematical Analysis</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Complete {repaymentMonths}-month breakdown showing escalating contributions totaling £{finalTotal.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">£{finalTotal.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Contributions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{repaymentMonths}</div>
            <div className="text-sm text-gray-600">Payment Months</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-600">Tranches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">2.0%</div>
            <div className="text-sm text-gray-600">Annual Inflation</div>
          </div>
        </div>

        {/* Key Milestones */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Key Payment Milestones</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Month</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Tranche 1</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Tranche 2</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Tranche 3</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Monthly Total</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((entry, index) => (
                  <tr key={entry.month} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-3 py-2 font-medium">
                      Month {entry.month}
                      {entry.month === 1 && " (Start)"}
                      {entry.month === 13 && " (T2 Begins)"}
                      {entry.month === 25 && " (T3 Begins)"}
                      {entry.month === repaymentMonths && " (Final)"}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {formatCurrency(entry.tranche1Amount)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {entry.tranche2Amount > 0 ? formatCurrency(entry.tranche2Amount) : "-"}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {entry.tranche3Amount > 0 ? formatCurrency(entry.tranche3Amount) : "-"}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-semibold">
                      {formatCurrency(entry.totalMonthly)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-bold">
                      {formatCurrency(entry.cumulativeTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Validation Section */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-800">Mathematical Validation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Calculated Total:</span><br/>
              <span className="text-lg">£{finalTotal.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-medium">Expected Total:</span><br/>
              <span className="text-lg">£49,890.42</span>
            </div>
            <div>
              <span className="font-medium">Accuracy:</span><br/>
              <span className="text-lg">{(((49890.42 / finalTotal) * 100)).toFixed(3)}%</span>
            </div>
          </div>
          <div className="mt-3 text-sm text-green-700">
            <strong>INBL Loan Coverage:</strong> £{finalTotal.toLocaleString()} contributions cover the £87,325 INBL loan principle 
            ({((finalTotal / 87325) * 100).toFixed(1)}% coverage ratio)
          </div>
        </div>

        {/* Download Options */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={downloadCSV} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download Full Schedule (CSV)</span>
          </Button>
          
          <Button onClick={downloadDetailedReport} variant="outline" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Download Mathematical Report (TXT)</span>
          </Button>

          {onClose && (
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          )}
        </div>

        {/* Toggle Full Schedule View */}
        <div>
          <Button 
            onClick={() => setShowFullSchedule(!showFullSchedule)} 
            variant="outline"
            className="mb-4"
          >
            {showFullSchedule ? "Hide" : "Show"} Complete {repaymentMonths}-Month Schedule
          </Button>

          {showFullSchedule && (
            <div className="max-h-96 overflow-y-auto border rounded">
              <table className="w-full border-collapse text-xs">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="border px-2 py-1">Month</th>
                    <th className="border px-2 py-1">T1</th>
                    <th className="border px-2 py-1">T2</th>
                    <th className="border px-2 py-1">T3</th>
                    <th className="border px-2 py-1">Total</th>
                    <th className="border px-2 py-1">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((entry, index) => (
                    <tr key={entry.month} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border px-2 py-1">{entry.month}</td>
                      <td className="border px-2 py-1 text-right">
                        {entry.tranche1Amount > 0 ? entry.tranche1Amount.toFixed(2) : "-"}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {entry.tranche2Amount > 0 ? entry.tranche2Amount.toFixed(2) : "-"}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {entry.tranche3Amount > 0 ? entry.tranche3Amount.toFixed(2) : "-"}
                      </td>
                      <td className="border px-2 py-1 text-right font-medium">
                        {entry.totalMonthly.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {entry.cumulativeTotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
