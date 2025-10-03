import { formatCurrency } from "@/utils/pensionCalculations";
import { systemFields } from "@/data/systemFields";
import { getSFMCodeForMetric } from "@/utils/systemFields/sfmCodeGenerator";

interface BUOMPrinciplesTableProps {
  apfSponsorships: unknown[];
  isaTimeline: unknown; // Not used - table gets values from SFM codes directly
}

export function BUOMPrinciplesTable({ apfSponsorships }: BUOMPrinciplesTableProps) {
  // Use systemFields directly instead of useSFMResolver
  const getSFMValue = (sfmCode: string): number => {
    const field = systemFields.find(f => f.sfmId === sfmCode);
    return field ? parseFloat(field.outputValue) || 0 : 0;
  };
  
  console.log('=== BUOM PRINCIPLES TABLE - USING SFM CODES DIRECTLY ===');
  console.log(`Number of sponsorships received: ${apfSponsorships.length}`);

  // HARD LIMIT: Force 2 years maximum regardless of sponsorship data
  const actualSponsorshipsToShow = 2; // HARD LIMIT: Always 2 years, never 10
  
  // Get values directly from SFM codes (APF Registration data)
  const inblValues: number[] = [];
  const apfValues: number[] = [];
  const isaMonthlyValues: number[] = [];
  
  for (let year = 1; year <= actualSponsorshipsToShow; year++) {
    const inblValue = getSFMValue(`SFM-166-${year}`); // Changed from SFM-066-${year}
    const apfValue = getSFMValue(`SFM-169-${year}`); // Changed from SFM-069-${year}  
    const isaMonthly = getSFMValue(`SFM-172-${year}`); // Changed from SFM-072-${year}
    
    inblValues.push(inblValue);
    apfValues.push(apfValue);
    isaMonthlyValues.push(isaMonthly);
    
    console.log(`🚨🚨🚨 Year ${year} SFM Values: INBL £${inblValue.toLocaleString()}, APF £${apfValue.toLocaleString()}, ISA Monthly £${isaMonthly.toLocaleString()}`);
    console.log(`🚨 APF VALUE FOR YEAR ${year}: £${apfValue.toLocaleString()} (should be much higher if using £129,942 target)`);
  }

  // Calculate totals
  const totalINBL = inblValues.reduce((sum, val) => sum + val, 0);
  const totalAPF = apfValues.reduce((sum, val) => sum + val, 0);
  const totalISAMonthly = isaMonthlyValues.reduce((sum, val) => sum + val, 0);
  
  console.log(`BUOM TABLE TOTALS (${actualSponsorshipsToShow} years from SFM codes):`);
  console.log(`Total INBL: £${totalINBL.toLocaleString()}`);
  console.log(`Total APF: £${totalAPF.toLocaleString()}`);
  console.log(`Total ISA Monthly: £${totalISAMonthly.toLocaleString()}`);

  return (
    <div className="mt-4 bg-white rounded-lg border p-4">
      <table className="w-full text-sm">
        {/* ... existing table content ... */}
      </table>
    </div>
  );
}