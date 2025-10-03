
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface ActionWarningProps {
  message: string;
  show: boolean;
}

export function ActionWarning({ message, show }: ActionWarningProps) {
  if (!show) return null;
  
  return (
    <Badge variant="secondary" className="bg-yellow-200 text-amber-800 flex items-center gap-1 text-xs">
      <AlertTriangle className="h-3 w-3" />
      {message}
    </Badge>
  );
}
