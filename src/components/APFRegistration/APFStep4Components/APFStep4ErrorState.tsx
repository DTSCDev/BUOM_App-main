
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface APFStep4ErrorStateProps {
  hasError: boolean;
  errorMessage: string;
}

export function APFStep4ErrorState({ 
  hasError, 
  errorMessage
}: APFStep4ErrorStateProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#4FF456', color: '#1f2937' }}>4</div>
        <div>
          <h2 id="step4-header" className="text-2xl font-semibold" style={{ color: '#4FF456' }}>Value for Money Comparison</h2>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-orange-600 mb-2">Calculation In Progress</h3>
            <p className="text-sm text-gray-600 mb-4">
              {hasError ? 
                `Calculation error: ${errorMessage}. You can still proceed with the registration.` :
                'Unable to calculate detailed analysis at this time. You can still proceed with the registration.'
              }
            </p>
            <p className="text-xs text-gray-500">
              Click Next to continue to the salary exchange setup.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
