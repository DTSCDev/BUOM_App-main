
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
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold">Step 4: Best Use of Money</h2>
          <p className="text-sm text-gray-600">Analyze the value proposition of your APF investment</p>
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
