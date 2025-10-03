
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ReportDownloadButtonProps {
  onDownload: () => void;
}

export function ReportDownloadButton({ onDownload }: ReportDownloadButtonProps) {
  return (
    <div className="flex justify-center mt-6">
      <Button onClick={onDownload} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
        <Download className="w-4 h-4 mr-2" />
        Download Professional BUOM Report
      </Button>
    </div>
  );
}
