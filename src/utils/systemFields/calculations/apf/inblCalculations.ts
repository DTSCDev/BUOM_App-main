import { calculateActualSponsorshipsFromShortfall } from '@/utils/pension/apfSponsorshipCalculations';
import { SFMCalculationContext } from '../../types';

export function calculateINBLValues(sfmId: string, context: SFMCalculationContext, retirementShortfall: number): number {
  const sponsorships = calculateActualSponsorshipsFromShortfall(
    context.currentAge,
    context.profile.annual_salary || 0,
    retirementShortfall, // Use the capital shortfall amount directly
    true, // Enhanced member
    context.profile
  );

  switch (sfmId) {
    // NPG Amount - Years 1-10 (SFM-151-X) UPDATED FROM 051 TO 151
    case "SFM-151-1":
    case "SFM-151-2":
    case "SFM-151-3":
    case "SFM-151-4":
    case "SFM-151-5":
    case "SFM-151-6":
    case "SFM-151-7":
    case "SFM-151-8":
    case "SFM-151-9":
    case "SFM-151-10": {
      const npgYear = parseInt(sfmId.split('-')[2]);
      const npgSponsorship = sponsorships.find(s => s.year === npgYear);
      if (!npgSponsorship) return 0;
      
      // Calculate NPG as 80% of total INBL principal
      const npgAmount = npgSponsorship.sponsorshipAmount * 0.8;
      console.log(`${sfmId}: NPG amount for year ${npgYear}: £${npgAmount.toLocaleString()}`);
      return npgAmount;
    }

    // NRSR Fee - Years 1-10 (SFM-152-X) UPDATED FROM 052 TO 152
    case "SFM-152-1":
    case "SFM-152-2":
    case "SFM-152-3":
    case "SFM-152-4":
    case "SFM-152-5":
    case "SFM-152-6":
    case "SFM-152-7":
    case "SFM-152-8":
    case "SFM-152-9":
    case "SFM-152-10": {
      const nrsrYear = parseInt(sfmId.split('-')[2]);
      const nrsrSponsorship = sponsorships.find(s => s.year === nrsrYear);
      if (!nrsrSponsorship) return 0;
      
      // Calculate NRSR as 20% of total INBL principal
      const nrsrAmount = nrsrSponsorship.sponsorshipAmount * 0.2;
      console.log(`${sfmId}: NRSR fee for year ${nrsrYear}: £${nrsrAmount.toLocaleString()}`);
      return nrsrAmount;
    }

    // Total INBL Principal - Years 1-10 (SFM-153-X) UPDATED FROM 053 TO 153
    case "SFM-153-1":
    case "SFM-153-2":
    case "SFM-153-3":
    case "SFM-153-4":
    case "SFM-153-5":
    case "SFM-153-6":
    case "SFM-153-7":
    case "SFM-153-8":
    case "SFM-153-9":
    case "SFM-153-10": {
      const inblYear = parseInt(sfmId.split('-')[2]);
      const inblSponsorship = sponsorships.find(s => s.year === inblYear);
      if (!inblSponsorship) return 0;
      
      // INBL Principal is the sponsorship amount
      const inblPrincipal = inblSponsorship.sponsorshipAmount;
      console.log(`${sfmId}: INBL principal for year ${inblYear}: £${inblPrincipal.toLocaleString()}`);
      return inblPrincipal;
    }

    default:
      return 0;
  }
}