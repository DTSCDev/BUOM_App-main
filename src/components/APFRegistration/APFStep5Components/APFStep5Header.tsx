
import { Calculator } from "lucide-react";

export function APFStep5Header() {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <Calculator className="h-6 w-6 text-blue-600" />
      <div>
        <h2 id="step5-header" className="text-xl font-semibold">Step 5: Salary Exchange</h2>
        <p className="text-sm text-gray-600">Understand your salary sacrifice and net pay guarantee</p>
      </div>
    </div>
  );
}
