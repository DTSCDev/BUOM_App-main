
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatUtils";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { APFSponsorshipBreakdown } from "@/utils/pension/buomTypes";
import { MetricCard } from "@/components/Dashboard/MetricCard";
import { usePayslipCalculations } from "@/hooks/usePayslipCalculations";
import { getAPF42XXCode } from "@/utils/systemFields/apf42xxMapper";
// Removed SFM resolver to avoid circular dependencies with Steps 3 & 5

// Define a minimal Profile type to avoid `any`
interface Profile {
  annual_salary?: number;
}

interface APFSponsorshipYearsCardProps {
  sponsorships: APFSponsorshipBreakdown[];
  showMonthly: boolean;
  profile: Profile;
  initialCapitalShortfall: number;
  opacity?: string;
}

export function APFSponsorshipYearsCard({ sponsorships, showMonthly, profile, initialCapitalShortfall, opacity = "opacity-100" }: APFSponsorshipYearsCardProps) {
  const { calculatePayslipComparison } = usePayslipCalculations();
  const monthlyDivisor = 252;
  const annualSalary = profile?.annual_salary || 60000;
  
  console.log(`FIXED: Using initial capital shortfall: £${initialCapitalShortfall.toLocaleString()}`);
  console.log(`FIXED: Displaying ${sponsorships.length} required sponsorships (no unused years)`);
  
  // FIXED: Calculate total APF funding requirement from all sponsorships
  const totalAPFFundingRequired = sponsorships.reduce((sum, s) => sum + s.sponsorshipAmount, 0);
  const totalMaturityValue = sponsorships.reduce((sum, s) => sum + s.maturityValue, 0);
  
  console.log(`Total APF funding required: £${totalAPFFundingRequired.toLocaleString()}`);
  console.log(`Total maturity value: £${totalMaturityValue.toLocaleString()}`);
  
  // FIXED: Calculate cumulative shortfall reduction using APF maturity values
  const calculateCumulativeShortfall = (index: number): number => {
    // Sum up all APF maturity values received up to and including this year
    const totalMaturityToDate = sponsorships
      .slice(0, index + 1)
      .reduce((sum, s) => sum + s.maturityValue, 0);
    
    // Shortfall balance = Initial shortfall - maturity value received to date
    const remainingShortfall = Math.max(0, initialCapitalShortfall - totalMaturityToDate);
    
    console.log(`Year ${index + 1}: Maturity to date: £${totalMaturityToDate.toLocaleString()}, Remaining shortfall: £${remainingShortfall.toLocaleString()}`);
    
    return remainingShortfall;
  };
  
  // Calculate proper INBL amount using payslip comparison (includes NPG + NRSR Fee)
  const calculateINBLAmount = (sponsorship: APFSponsorshipBreakdown): number => {
    const payslipComparison = calculatePayslipComparison(annualSalary, sponsorship.sponsorshipAmount);
    return payslipComparison.totalINBLPrincipal * 12; // Annual total INBL principal
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span>Sponsorship Years Required ({sponsorships.length} Year{sponsorships.length !== 1 ? 's' : ''})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* FIXED: Show all required sponsorships, no arbitrary slice */}
          {sponsorships.map((sponsorship, index) => {
            const cumulativeShortfall = calculateCumulativeShortfall(index);
            const inblAmount = calculateINBLAmount(sponsorship);
            
            const displayAge = sponsorship.age;
            const isShortfallEliminated = cumulativeShortfall === 0;
            const yearNumber = index + 1;
            // Partial year detection: treat only the final year as partial when the
            // contribution is below the optimized allowance (~£47,430)
            const OPTIMIZED_CONTRIBUTION = 47430;
            const isFinalYear = index === sponsorships.length - 1;
            const isPartialYear = isFinalYear && sponsorship.sponsorshipAmount < OPTIMIZED_CONTRIBUTION;
            
            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    Year {sponsorship.year} ({sponsorship.taxYear})
                    {isPartialYear && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Partial Year
                      </span>
                    )}
                    {isShortfallEliminated && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </h4>
                  <span className="text-sm text-gray-600">Age {displayAge}</span>
                </div>
                
                {/* Show constraint information */}
                {sponsorship.salaryExchangeConstrained && (
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">
                        Advisory Protection Applied
                      </span>
                    </div>
                    <span className="text-xs text-amber-700">
                      {sponsorship.constraintReason || 'Salary exchange limit applied'}
                    </span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const sfmCode = getAPF42XXCode('APF_INITIAL_FUNDING', yearNumber, isPartialYear);
                    const displayValue = sponsorship.sponsorshipAmount;
                    return (
                      <MetricCard
                        title="APF INITIAL FUNDING"
                        value={formatCurrency(showMonthly ? displayValue / monthlyDivisor : displayValue)}
                        headerBgColor="bg-yellow-600"
                        valueTextColor="text-yellow-600"
                        sfmCode={sfmCode}
                        opacity={opacity}
                      />
                    );
                  })()}
                  
                  {(() => {
                    const sfmCode = getAPF42XXCode('APF_MATURITY', yearNumber, isPartialYear);
                    const displayValue = sponsorship.maturityValue;
                    return (
                      <MetricCard
                        title="APF MATURITY"
                        value={formatCurrency(showMonthly ? displayValue / monthlyDivisor : displayValue)}
                        headerBgColor="bg-yellow-600"
                        valueTextColor="text-yellow-600"
                        sfmCode={sfmCode}
                        opacity={opacity}
                      />
                    );
                  })()}
                  
                  {(() => {
                    const sfmCode = getAPF42XXCode('TOTAL_INBL_PRINCIPAL', yearNumber, isPartialYear);
                    const displayValue = inblAmount;
                    return (
                      <MetricCard
                        title="TOTAL INBL PRINCIPAL"
                        value={formatCurrency(showMonthly ? displayValue / monthlyDivisor : displayValue)}
                        headerBgColor="bg-green-600"
                        valueTextColor="text-green-600"
                        sfmCode={sfmCode}
                        opacity={opacity}
                      />
                    );
                  })()}
                  
                  {(() => {
                    const sfmCode = getAPF42XXCode('SHORTFALL_BALANCE', yearNumber, isPartialYear);
                    const displayValue = cumulativeShortfall;
                    const eliminated = displayValue <= 0 || isShortfallEliminated;
                    const titleText = eliminated ? 'SHORTFALL ELIMINATED!' : 'SHORTFALL BALANCE';
                    return (
                      <MetricCard
                        title={titleText}
                        value={eliminated ? "£0" : formatCurrency(showMonthly ? displayValue / monthlyDivisor : displayValue)}
                        headerBgColor={eliminated ? "bg-green-600" : "bg-red-600"}
                        valueTextColor={eliminated ? "text-green-600" : "text-red-600"}
                        opacity={opacity}
                        sfmCode={sfmCode}
                      />
                    );
                  })()}
                </div>
                
                {/* Show status message */}
                {isShortfallEliminated ? (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                    <strong>Success:</strong> APF funding has eliminated the capital shortfall for retirement income.
                  </div>
                ) : (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                    <strong>Note:</strong> Remaining shortfall of {" "}
                    <span className={opacity}>£{cumulativeShortfall.toLocaleString()}</span>{" "}
                    to be covered by {index === sponsorships.length - 1 ? 'future APF funding' : 'next year APF funding'}.
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Summary section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">APF Plan Summary</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Years Required:</span>
                <span className="font-medium ml-2">{sponsorships.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Initial APF Funding:</span>
                <span className={`font-medium ml-2 ${opacity}`}>£{totalAPFFundingRequired.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Total APF Maturity Value:</span>
                <span className={`font-medium ml-2 ${opacity}`}>£{totalMaturityValue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Plan Status:</span>
                <span className={`font-medium ml-2 text-green-600 ${opacity}`}>
                  {totalMaturityValue >= initialCapitalShortfall ? 'Complete' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
