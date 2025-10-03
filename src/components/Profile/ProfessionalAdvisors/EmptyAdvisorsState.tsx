
import { User } from "lucide-react";

export function EmptyAdvisorsState() {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>No professional advisors added yet</p>
      <p className="text-sm">Add your trusted advisors to manage your financial affairs</p>
    </div>
  );
}
