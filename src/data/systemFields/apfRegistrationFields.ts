
import { SystemField } from './types';

export const apfRegistrationFields: SystemField[] = [
  // APF INBL Summary Card
  {
    sfmId: 'SFM-144',
    description: 'Total APF funding across all sponsorship years',
    pageName: 'APF Registration',
    cardName: 'APF INBL Summary Card',
    outputValue: 'Currency',
    correlatedTo: 'Sum of all APF sponsorship amounts',
    valueType: 'Calculated'
  },
  
  // APF Registration - Extended to 10 years
  // APF Initial Funding - Years 1-10
  {
    sfmId: 'SFM-147-1',
    description: 'APF Initial Funding - Year 1',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'First year APF sponsorship amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-147-2',
    description: 'APF Initial Funding - Year 2',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Second year APF sponsorship amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-147-3',
    description: 'APF Initial Funding - Year 3',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Third year APF sponsorship amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-147-4',
    description: 'APF Initial Funding - Year 4',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Fourth year APF sponsorship amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-147-5',
    description: 'APF Initial Funding - Year 5',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Fifth year APF sponsorship amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-147-6',
    description: 'APF Initial Funding - Year 6',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Sixth year APF sponsorship amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-147-7',
    description: 'APF Initial Funding - Year 7',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Seventh year APF sponsorship amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-147-8',
    description: 'APF Initial Funding - Year 8',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Eighth year APF sponsorship amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-147-9',
    description: 'APF Initial Funding - Year 9',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Ninth year APF sponsorship amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-147-10',
    description: 'APF Initial Funding - Year 10',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Tenth year APF sponsorship amount',
    valueType: 'Calculated'
  },
  
  // APF Maturity - Years 1-10
  {
    sfmId: 'SFM-148-1',
    description: 'APF Maturity - Year 1',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'First year APF maturity value',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-148-2',
    description: 'APF Maturity - Year 2',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Second year APF maturity value',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-148-3',
    description: 'APF Maturity - Year 3',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Third year APF maturity value',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-148-4',
    description: 'APF Maturity - Year 4',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Fourth year APF maturity value',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-148-5',
    description: 'APF Maturity - Year 5',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Fifth year APF maturity value',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-148-6',
    description: 'APF Maturity - Year 6',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Sixth year APF maturity value',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-148-7',
    description: 'APF Maturity - Year 7',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Seventh year APF maturity value',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-148-8',
    description: 'APF Maturity - Year 8',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Eighth year APF maturity value',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-148-9',
    description: 'APF Maturity - Year 9',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Ninth year APF maturity value',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-148-10',
    description: 'APF Maturity - Year 10',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Tenth year APF maturity value',
    valueType: 'Calculated'
  },
  
  // Total INBL Principal - Years 1-10
  {
    sfmId: 'SFM-149-1',
    description: 'Total INBL Principal - Year 1',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'First year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-149-2',
    description: 'Total INBL Principal - Year 2',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Second year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-149-3',
    description: 'Total INBL Principal - Year 3',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Third year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-149-4',
    description: 'Total INBL Principal - Year 4',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Fourth year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-149-5',
    description: 'Total INBL Principal - Year 5',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Fifth year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-149-6',
    description: 'Total INBL Principal - Year 6',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Sixth year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-149-7',
    description: 'Total INBL Principal - Year 7',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Seventh year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-149-8',
    description: 'Total INBL Principal - Year 8',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Eighth year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-149-9',
    description: 'Total INBL Principal - Year 9',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Ninth year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-149-10',
    description: 'Total INBL Principal - Year 10',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Tenth year total INBL principal amount',
    valueType: 'Calculated'
  },
  
  // NPG Amount - Years 1-10
  {
    sfmId: 'SFM-151-1',
    description: 'NPG Amount - Year 1',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'First year NPG amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-151-2',
    description: 'NPG Amount - Year 2',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Second year NPG amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-151-3',
    description: 'NPG Amount - Year 3',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Third year NPG amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-151-4',
    description: 'NPG Amount - Year 4',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Fourth year NPG amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-151-5',
    description: 'NPG Amount - Year 5',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Fifth year NPG amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-151-6',
    description: 'NPG Amount - Year 6',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Sixth year NPG amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-151-7',
    description: 'NPG Amount - Year 7',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Seventh year NPG amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-151-8',
    description: 'NPG Amount - Year 8',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Eighth year NPG amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-151-9',
    description: 'NPG Amount - Year 9',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Ninth year NPG amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-151-10',
    description: 'NPG Amount - Year 10',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Tenth year NPG amount',
    valueType: 'Calculated'
  },

  // NRSR Fee - Years 1-10
  {
    sfmId: 'SFM-152-1',
    description: 'NRSR Fee - Year 1',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'First year NRSR fee',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-152-2',
    description: 'NRSR Fee - Year 2',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Second year NRSR fee',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-152-3',
    description: 'NRSR Fee - Year 3',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Third year NRSR fee',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-152-4',
    description: 'NRSR Fee - Year 4',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Fourth year NRSR fee',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-152-5',
    description: 'NRSR Fee - Year 5',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Fifth year NRSR fee',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-152-6',
    description: 'NRSR Fee - Year 6',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Sixth year NRSR fee',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-152-7',
    description: 'NRSR Fee - Year 7',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Seventh year NRSR fee',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-152-8',
    description: 'NRSR Fee - Year 8',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Eighth year NRSR fee',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-152-9',
    description: 'NRSR Fee - Year 9',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Ninth year NRSR fee',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-152-10',
    description: 'NRSR Fee - Year 10',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Tenth year NRSR fee',
    valueType: 'Calculated'
  },

  // Total INBL Principal - Years 1-10 (for INBL Repayment Plan)
  {
    sfmId: 'SFM-153-1',
    description: 'Total INBL Principal - Year 1 (Repayment Plan)',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'First year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-153-2',
    description: 'Total INBL Principal - Year 2 (Repayment Plan)',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Second year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-153-3',
    description: 'Total INBL Principal - Year 3 (Repayment Plan)',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Third year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-153-4',
    description: 'Total INBL Principal - Year 4 (Repayment Plan)',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Fourth year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-153-5',
    description: 'Total INBL Principal - Year 5 (Repayment Plan)',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Fifth year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-153-6',
    description: 'Total INBL Principal - Year 6 (Repayment Plan)',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Sixth year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-153-7',
    description: 'Total INBL Principal - Year 7 (Repayment Plan)',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Seventh year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-153-8',
    description: 'Total INBL Principal - Year 8 (Repayment Plan)',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Eighth year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-153-9',
    description: 'Total INBL Principal - Year 9 (Repayment Plan)',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Ninth year total INBL principal amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-153-10',
    description: 'Total INBL Principal - Year 10 (Repayment Plan)',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Tenth year total INBL principal amount',
    valueType: 'Calculated'
  },

  // ISA Contributions - Years 1-10
  {
    sfmId: 'SFM-154-1',
    description: 'ISA Contributions - Year 1',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'First year ISA contribution amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-154-2',
    description: 'ISA Contributions - Year 2',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Second year ISA contribution amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-154-3',
    description: 'ISA Contributions - Year 3',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Third year ISA contribution amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-154-4',
    description: 'ISA Contributions - Year 4',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Fourth year ISA contribution amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-154-5',
    description: 'ISA Contributions - Year 5',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Fifth year ISA contribution amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-154-6',
    description: 'ISA Contributions - Year 6',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Sixth year ISA contribution amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-154-7',
    description: 'ISA Contributions - Year 7',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Seventh year ISA contribution amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-154-8',
    description: 'ISA Contributions - Year 8',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Eighth year ISA contribution amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-154-9',
    description: 'ISA Contributions - Year 9',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Ninth year ISA contribution amount',
    valueType: 'Calculated'
  },
  {
    sfmId: 'SFM-154-10',
    description: 'ISA Contributions - Year 10',
    pageName: 'APF Registration',
    cardName: 'INBL Repayment Plan',
    outputValue: 'Currency',
    correlatedTo: 'Tenth year ISA contribution amount',
    valueType: 'Calculated'
  },

  {
    sfmId: 'SFM-150',
    description: 'Shortfall Balance',
    pageName: 'APF Registration',
    cardName: 'Sponsorship Years Card',
    outputValue: 'Currency',
    correlatedTo: 'Remaining capital shortfall after APF funding',
    valueType: 'Calculated'
  }
];
