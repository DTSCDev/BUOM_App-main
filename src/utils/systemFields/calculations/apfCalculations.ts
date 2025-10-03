
import { calculateAPFValues as calculateAPFValuesFromModules } from './apf';
import { SFMCalculationContext } from '../types';

export function calculateAPFValues(sfmId: string, context: SFMCalculationContext, resolveSFM: (id: string) => number): number {
  // Delegate to refactored modules
  return calculateAPFValuesFromModules(sfmId, context, resolveSFM);
}
