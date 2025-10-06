import { calculateActualSponsorshipsFromShortfall } from '@/utils/pension/apfSponsorshipCalculations';
import { SFMCalculationContext } from '../../types';

export function calculateBUOMTableValues(sfmId: string, context: SFMCalculationContext, retirementShortfall: number): number {
  const sponsorships = calculateActualSponsorshipsFromShortfall(
    context.currentAge,
    context.profile.annual_salary || 0,
    retirementShortfall, // Use the capital shortfall amount directly
    true, // Enhanced member
    context.profile
  );

  // FIXED: Log sponsorship details to debug Year 2 partial year issue
  console.log(`🔍 BUOM TABLE DEBUG for ${sfmId}:`);
  console.log(`Total sponsorships: ${sponsorships.length}`);
  sponsorships.forEach((s, i) => {
    console.log(`  Year ${s.year}: Amount £${s.sponsorshipAmount.toLocaleString()}, Maturity £${s.maturityValue?.toLocaleString()}, Constrained: ${s.salaryExchangeConstrained}`);
  });

  switch (sfmId) {
    // BUOM Table - Annual INBL (SFM-066-X)
    case "SFM-066-1":
    case "SFM-066-2":
    case "SFM-066-3":
    case "SFM-066-4":
    case "SFM-066-5":
    case "SFM-066-6":
    case "SFM-066-7":
    case "SFM-066-8":
    case "SFM-066-9":
    case "SFM-066-10": {
      const buomInblYear = parseInt(sfmId.split('-')[2]);
      const buomInblSponsorship = sponsorships.find(s => s.year === buomInblYear);
      if (!buomInblSponsorship) {
        console.log(`🚨 BUOM INBL: No sponsorship found for year ${buomInblYear}`);
        return 0;
      }
      
      // FIXED: Annual INBL should be sponsorship amount, not monthly * 12
      const annualINBL = buomInblSponsorship.sponsorshipAmount;
      console.log(`${sfmId}: BUOM Annual INBL for year ${buomInblYear}: £${annualINBL.toLocaleString()}`);
      return annualINBL;
    }

    // BUOM Table - APF Funding (SFM-069-X)
    case "SFM-069-1":
    case "SFM-069-2":
    case "SFM-069-3":
    case "SFM-069-4":
    case "SFM-069-5":
    case "SFM-069-6":
    case "SFM-069-7":
    case "SFM-069-8":
    case "SFM-069-9":
    case "SFM-069-10": {
      const buomApfYear = parseInt(sfmId.split('-')[2]);
      const buomApfSponsorship = sponsorships.find(s => s.year === buomApfYear);
      if (!buomApfSponsorship) {
        console.log(`🚨 BUOM APF: No sponsorship found for year ${buomApfYear}`);
        return 0;
      }
      
      // APF Funding is the sponsorship amount
      const apfFunding = buomApfSponsorship.sponsorshipAmount;
      console.log(`${sfmId}: BUOM APF Funding for year ${buomApfYear}: £${apfFunding.toLocaleString()}`);
      return apfFunding;
    }

    // BUOM Table - ISA Monthly (SFM-072-X)
    case "SFM-072-1":
    case "SFM-072-2":
    case "SFM-072-3":
    case "SFM-072-4":
    case "SFM-072-5":
    case "SFM-072-6":
    case "SFM-072-7":
    case "SFM-072-8":
    case "SFM-072-9":
    case "SFM-072-10": {
      const buomIsaYear = parseInt(sfmId.split('-')[2]);
      const buomIsaSponsorship = sponsorships.find(s => s.year === buomIsaYear);
      if (!buomIsaSponsorship) {
        console.log(`🚨 BUOM ISA: No sponsorship found for year ${buomIsaYear}`);
        return 0;
      }
      
      // ISA Monthly from APF maturity value
      const isaMonthlyFromMaturity = buomIsaSponsorship.isaMonthlyRequired || 0;
      console.log(`${sfmId}: BUOM ISA Monthly for year ${buomIsaYear}: £${isaMonthlyFromMaturity.toLocaleString()}`);
      return isaMonthlyFromMaturity;
    }

    default:
      return 0;
  }
}