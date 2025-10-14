
import { Calculator } from "lucide-react";

export function APFStep5Header() {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <Calculator className="h-6 w-6 text-blue-600" />
      <div>
        <h2 id="step5-header" className="text-2xl font-semibold">Salary Exchange Proposal</h2>
      </div>
    </div>
  );
}
