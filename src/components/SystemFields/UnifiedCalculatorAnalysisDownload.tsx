
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadUnifiedCalculatorAnalysis } from '@/utils/reports/unifiedCalculatorAnalysis';

export function UnifiedCalculatorAnalysisDownload() {
  return (
    <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex-1">
        <h3 className="font-semibold text-blue-900">Unified Calculator Analysis</h3>
        <p className="text-sm text-blue-700">
          Download comprehensive analysis of all calculation steps and the bug fix implementation
        </p>
      </div>
      <Button 
        onClick={downloadUnifiedCalculatorAnalysis}
        variant="outline"
        size="sm"
        className="bg-white hover:bg-blue-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Download Analysis
      </Button>
    </div>
  );
}
