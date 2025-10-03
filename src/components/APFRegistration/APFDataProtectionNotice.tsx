
import { AlertCircle } from "lucide-react";

export function APFDataProtectionNotice() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start space-x-2">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900">Data Protection Notice</h4>
          <p className="text-sm text-blue-800 mt-1">
            Your personal information will be used to process your APF application and is protected 
            under GDPR regulations. We will not share your data with third parties without your consent.
          </p>
        </div>
      </div>
    </div>
  );
}
