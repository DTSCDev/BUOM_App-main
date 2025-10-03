
import { TAX_THRESHOLDS } from './taxThresholds';

export interface PAYETaxCodeResult {
  personalAllowance: number;
  isEmergency: boolean;
  specialCode: string | null;
}

export function parsePAYETaxCode(taxCode: string): PAYETaxCodeResult {
  // Handle special codes
  const specialCodes = {
    'BR': { personalAllowance: 0, isEmergency: false, specialCode: 'BR' }, // Basic Rate
    'D0': { personalAllowance: 0, isEmergency: false, specialCode: 'D0' }, // Higher Rate
    'D1': { personalAllowance: 0, isEmergency: false, specialCode: 'D1' }, // Additional Rate
    'NT': { personalAllowance: 999999, isEmergency: false, specialCode: 'NT' }, // No Tax
    '0T': { personalAllowance: 0, isEmergency: false, specialCode: '0T' } // Zero allowance
  };

  if (specialCodes[taxCode as keyof typeof specialCodes]) {
    return specialCodes[taxCode as keyof typeof specialCodes];
  }

  // Handle standard codes (e.g., 1257L, 1257L M1)
  const isEmergency = taxCode.includes('M1') || taxCode.includes('W1') || taxCode.includes('X');
  const cleanCode = taxCode.replace(/[MW][0-9]|X/g, '').trim();
  
  // Extract numeric part
  const numericMatch = cleanCode.match(/^(\d+)/);
  if (!numericMatch) {
    // Default to standard allowance if can't parse
    return { personalAllowance: TAX_THRESHOLDS.personalAllowance, isEmergency: false, specialCode: null };
  }

  const allowanceNumber = parseInt(numericMatch[1]);
  const personalAllowance = allowanceNumber * 10; // e.g., 1257 becomes £12,570

  return { personalAllowance, isEmergency, specialCode: null };
}
