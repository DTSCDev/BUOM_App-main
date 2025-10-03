
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdvisorsLoadingState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Advisors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
