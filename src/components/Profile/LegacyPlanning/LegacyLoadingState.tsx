
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LegacyLoadingState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Legacy Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
