
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { ValidationResult } from "@/utils/validation/systemValidation";

interface ValidationDisplayProps {
  validationResult: ValidationResult | null;
  show?: boolean;
}

export function ValidationDisplay({ validationResult, show = false }: ValidationDisplayProps) {
  if (!show || !validationResult) return null;

  return (
    <Card className="mt-4 border-yellow-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          {validationResult.isValid ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          )}
          System Validation
          <Badge variant={validationResult.isValid ? "default" : "destructive"}>
            {validationResult.isValid ? "PASSED" : "FAILED"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {validationResult.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-600">Errors:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {validationResult.errors.map((error, index) => (
                <li key={index} className="text-red-600">{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {validationResult.warnings.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="font-medium text-yellow-500">Warnings:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {validationResult.warnings.map((warning, index) => (
                <li key={index} className="text-yellow-500">{warning}</li>
              ))}
            </ul>
          </div>
        )}
        
        {validationResult.isValid && (
          <p className="text-green-600 text-sm">All card values are consistent and calculations are correct.</p>
        )}
      </CardContent>
    </Card>
  );
}
