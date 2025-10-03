import { MetricCard } from "./MetricCard";
import { formatCurrency } from "@/utils/formatUtils";
import { systemFields } from "@/data/systemFields";

// Enhanced SFM Code Display Component
const SFMCodeDisplay: React.FC<{ sfmCode: string }> = ({ sfmCode }) => {
  const sfmField = systemFields.find(field => field.sfmId === sfmCode);
  
  return (
    <div className="text-[8px] text-white opacity-60 font-mono border border-gray-400 px-1 py-0.5 rounded mt-1">
      <div>{sfmCode.replace('SFM-', '')}</div>
      {sfmField && (
        <div className="text-[6px] mt-0.5">
          {sfmField.pageName} › {sfmField.cardName}
        </div>
      )}
    </div>
  );
};

export function APFSummaryCards() {
  // Use systemFields directly for these values
  const getSFMValue = (sfmCode: string): number => {
    const field = systemFields.find(f => f.sfmId === sfmCode);
    return field ? parseFloat(field.outputValue) || 0 : 0;
  };

  // Get values from systemFields
  const apfAssets = getSFMValue('SFM-APF-1001'); // Changed from SFM-087
  const inblLoan = getSFMValue('SFM-APF-1002'); // Changed from SFM-088
  const isaSavings = getSFMValue('SFM-APF-1003'); // Changed from SFM-089
  const generalAccount = getSFMValue('SFM-APF-1004'); // Changed from SFM-090

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="relative">
        <MetricCard
          title="APF Assets"
          value={formatCurrency(apfAssets)}
          headerBgColor="bg-blue-600"
          valueTextColor="text-blue-800"
          sfmCode="SFM-APF-1001" // Changed from SFM-087
        />
        <div className="absolute top-2 right-2">
          <SFMCodeDisplay sfmCode="SFM-APF-1001" /> // Changed from SFM-087
        </div>
      </div>
      
      <div className="relative">
        <MetricCard
          title="INBL Loan"
          value={formatCurrency(inblLoan)}
          headerBgColor="bg-orange-600"
          valueTextColor="text-orange-800"
          sfmCode="SFM-APF-1002" // Changed from SFM-088
        />
        <div className="absolute top-2 right-2">
          <SFMCodeDisplay sfmCode="SFM-APF-1002" /> // Changed from SFM-088
        </div>
      </div>
      
      <div className="relative">
        <MetricCard
          title="ISA Savings"
          value={formatCurrency(isaSavings)}
          headerBgColor="bg-green-600"
          valueTextColor="text-green-800"
          sfmCode="SFM-APF-1003" // Changed from SFM-089
        />
        <div className="absolute top-2 right-2">
          <SFMCodeDisplay sfmCode="SFM-APF-1003" /> // Changed from SFM-089
        </div>
      </div>
      
      <div className="relative">
        <MetricCard
          title="General Account"
          value={formatCurrency(generalAccount)}
          headerBgColor="bg-purple-600"
          valueTextColor="text-purple-800"
          sfmCode="SFM-APF-1004" // Changed from SFM-090
        />
        <div className="absolute top-2 right-2">
          <SFMCodeDisplay sfmCode="SFM-APF-1004" /> // Changed from SFM-090
        </div>
      </div>
    </div>
  );
}
