
import { Card, CardContent } from "@/components/ui/card";

export function APFStep4LoadingState() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading financial data...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
