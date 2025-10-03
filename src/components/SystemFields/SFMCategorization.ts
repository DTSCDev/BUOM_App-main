export type SFMCategory = 'salary' | 'existing-plan' | 'ae-contributions' | 'inbl' | 'isa' | 'apf-assets';

export interface SFMCategoryConfig {
  name: string;
  color: string;
  textColor: string;
  description: string;
}

export const SFM_CATEGORY_CONFIG: Record<SFMCategory, SFMCategoryConfig> = {
  'salary': {
    name: 'Salary',
    color: 'bg-gray-900',
    textColor: 'text-gray-900',
    description: 'Salary and income related metrics'
  },
  'existing-plan': {
    name: 'Existing Plan',
    color: 'bg-gray-700',
    textColor: 'text-gray-700',
    description: 'Current pension plan values'
  },
  'ae-contributions': {
    name: 'AE Contributions',
    color: 'bg-gray-500',
    textColor: 'text-gray-500',
    description: 'Auto-enrollment contributions'
  },
  'inbl': {
    name: 'INBL/NPG/NRSR',
    color: 'bg-green-600',
    textColor: 'text-green-600',
    description: 'INBL loans, NPG amounts, and NRSR fees'
  },
  'isa': {
    name: 'ISA',
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    description: 'Individual Savings Account metrics'
  },
  'apf-assets': {
    name: 'APF Assets',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    description: 'Advanced Pension Funding assets'
  }
};

export function categorizeSFMField(description: string, sfmId: string): SFMCategory {
  const desc = description.toLowerCase();
  const id = sfmId.toLowerCase();
  
  // APF Assets - check first as it's most specific
  if (desc.includes('apf') || desc.includes('advanced pension funding') || 
      desc.includes('maturity') || id.includes('047') || id.includes('048')) {
    return 'apf-assets';
  }
  
  // INBL/NPG/NRSR - includes all INBL-related metrics
  if (desc.includes('inbl') || desc.includes('npg') || desc.includes('nrsr') ||
      desc.includes('net pay guarantee') || desc.includes('zvar') || 
      desc.includes('zero value at risk') || id.includes('049') || 
      id.includes('055') || id.includes('056') || id.includes('066') ||
      desc.includes('loan') || desc.includes('principal')) {
    return 'inbl';
  }
  
  // ISA
  if (desc.includes('isa') || desc.includes('individual savings') || 
      id.includes('072') || desc.includes('savings')) {
    return 'isa';
  }
  
  // Existing Plan
  if (desc.includes('existing plan') || desc.includes('current pension') ||
      desc.includes('existing pension') || id.includes('013') || id.includes('022')) {
    return 'existing-plan';
  }
  
  // AE Contributions
  if (desc.includes('ae ') || desc.includes('auto enrollment') || 
      desc.includes('employee contribution') || desc.includes('employer contribution') ||
      id.includes('014') || desc.includes('future ae')) {
    return 'ae-contributions';
  }
  
  // Salary (default for salary, pay, income not covered above)
  if (desc.includes('salary') || desc.includes('pay') || desc.includes('income')) {
    return 'salary';
  }
  
  // Default to salary for uncategorized
  return 'salary';
}
