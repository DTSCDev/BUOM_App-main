
import { AlertTriangle } from "lucide-react";

export function EmptyLegacyState() {
  return (
    <div className="text-center py-8">
      <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No Legacy Planning Arranged</h3>
      <p className="text-muted-foreground">
        Start planning for your future and protect your loved ones.
      </p>
    </div>
  );
}
