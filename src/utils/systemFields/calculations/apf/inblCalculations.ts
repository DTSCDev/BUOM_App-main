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
    // NPG Amount - Years 1-10 (SFM-051-X)
    case "SFM-051-1":
    case "SFM-051-2":
    case "SFM-051-3":
    case "SFM-051-4":
    case "SFM-051-5":
    case "SFM-051-6":
    case "SFM-051-7":
    case "SFM-051-8":
    case "SFM-051-9":
    case "SFM-051-10":
      const npgYear = parseInt(sfmId.split('-')[2]);
      const npgSponsorship = sponsorships.find(s => s.year === npgYear);
      if (!npgSponsorship) return 0;
      
      // Calculate NPG as 80% of total INBL principal
      const npgAmount = npgSponsorship.sponsorshipAmount * 0.8;
      console.log(`${sfmId}: NPG amount for year ${npgYear}: £${npgAmount.toLocaleString()}`);
      return npgAmount;

    // NRSR Fee - Years 1-10 (SFM-052-X)
    case "SFM-052-1":
    case "SFM-052-2":
    case "SFM-052-3":
    case "SFM-052-4":
    case "SFM-052-5":
    case "SFM-052-6":
    case "SFM-052-7":
    case "SFM-052-8":
    case "SFM-052-9":
    case "SFM-052-10":
      const nrsrYear = parseInt(sfmId.split('-')[2]);
      const nrsrSponsorship = sponsorships.find(s => s.year === nrsrYear);
      if (!nrsrSponsorship) return 0;
      
      // Calculate NRSR as 20% of total INBL principal
      const nrsrAmount = nrsrSponsorship.sponsorshipAmount * 0.2;
      console.log(`${sfmId}: NRSR fee for year ${nrsrYear}: £${nrsrAmount.toLocaleString()}`);
      return nrsrAmount;

    // Total INBL Principal - Years 1-10 (SFM-053-X)
    case "SFM-053-1":
    case "SFM-053-2":
    case "SFM-053-3":
    case "SFM-053-4":
    case "SFM-053-5":
    case "SFM-053-6":
    case "SFM-053-7":
    case "SFM-053-8":
    case "SFM-053-9":
    case "SFM-053-10":
      const inblYear = parseInt(sfmId.split('-')[2]);
      const inblSponsorship = sponsorships.find(s => s.year === inblYear);
      if (!inblSponsorship) return 0;
      
      // INBL Principal is the sponsorship amount
      const inblPrincipal = inblSponsorship.sponsorshipAmount;
      console.log(`${sfmId}: INBL principal for year ${inblYear}: £${inblPrincipal.toLocaleString()}`);
      return inblPrincipal;

    default:
      return 0;
  }
}