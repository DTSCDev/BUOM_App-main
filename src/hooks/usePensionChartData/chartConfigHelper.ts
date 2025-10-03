
import { getPensionParameters } from "@/utils/pensionParameters";

export interface ChartConfig {
  startAge: number;
  finalAge: number;
  totalYears: number;
}

export function calculateChartConfig(
  currentAge: number,
  apfTranches: any[]
): ChartConfig {
  const params = getPensionParameters();
  const retirementAge = params.retirementAge;
  
  // Calculate latest APF maturity age
  const latestAPFMaturityAge = apfTranches.length > 0 
    ? Math.max(...apfTranches.map(t => t.maturityAge))
    : 0;
  
  // FIXED: Cap the final age to prevent excessive chart extension
  const finalAge = Math.min(
    Math.max(retirementAge + 1, latestAPFMaturityAge),
    retirementAge + 5 // Cap at retirement + 5 years maximum
  );
  
  const startAge = currentAge - 1; // Start one year before current age
  const totalYears = finalAge - startAge;
  
  console.log(`Chart configuration: Age ${startAge} to ${finalAge} (${totalYears + 1} years)`);
  
  return {
    startAge,
    finalAge,
    totalYears
  };
}
