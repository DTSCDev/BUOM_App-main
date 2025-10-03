import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PensionShortfallChart() {
  console.log('🚨🚨🚨 PENSION SHORTFALL CHART - UI ONLY (Calculations stripped)');
  console.log('🚨 Chart data will be rebuilt from Calculator Tab!');

  return (
    <Card className="h-full bg-white shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900">
          Dashboard Ready for Rebuild
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Pension Shortfall Chart
          </h3>
          <p className="text-sm text-gray-600">
            Chart will be rebuilt using Calculator Tab data
          </p>
          <p className="text-xs text-gray-500 mt-2">
            No more hardcoded calculations - pure UI only
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
