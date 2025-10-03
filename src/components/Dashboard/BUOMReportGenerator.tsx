
import { BUOMCalculationResult } from "@/utils/pension/buomCalculations";
import { generateBUOMReportContent } from "@/utils/reports/buomReportContent";
import { downloadWordDocument } from "@/utils/reports/reportDownload";
import { ReportDownloadButton } from "./ReportDownloadButton";

interface BUOMReportGeneratorProps {
  calculationResult: BUOMCalculationResult;
  userProfile: {
    age: number;
    salary: number;
    targetIncome: number;
    existingPension: number;
  };
}

export function BUOMReportGenerator({ calculationResult, userProfile }: BUOMReportGeneratorProps) {
  const handleDownload = () => {
    const content = generateBUOMReportContent(calculationResult, userProfile);
    downloadWordDocument(content, userProfile.age);
  };

  return <ReportDownloadButton onDownload={handleDownload} />;
}
