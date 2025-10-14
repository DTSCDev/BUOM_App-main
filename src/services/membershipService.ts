import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a BUOM membership ID already exists in either the free calculator or members tables.
 * RLS may restrict unauthenticated reads of `members`; we ignore errors and only treat confirmed hits as taken.
 */
export async function isMembershipIdTaken(membershipId: string): Promise<boolean> {
  try {
    // Check free-rs-calculator first (anonymous-accessible)
    const { count: freeCount, error: freeError } = await supabase
      .from('free-rs-calculator')
      .select('membership_id', { count: 'exact', head: true })
      .eq('membership_id', membershipId);

    if (freeError) {
      console.warn('free-rs-calculator check error:', freeError.message);
    }
    const freeCountSafe = freeCount ?? 0; // count is available with head:true

    // Check members table; ignore errors due to RLS
    const { count: memberCount, error: memberError } = await supabase
      .from('members')
      .select('membership_id', { count: 'exact', head: true })
      .eq('membership_id', membershipId);

    if (memberError) {
      console.warn('members check error (likely RLS):', memberError.message);
    }
    const memberCountSafe = memberCount ?? 0;

    // If either table confirmed presence, treat as taken
    return (freeCountSafe > 0) || (memberCountSafe > 0);
  } catch (e) {
    console.error('Membership ID check failed:', e);
    // On error, assume not taken to avoid blocking, but log; downstream insert will still conflict if truly duplicate
    return false;
  }
}

/**
 * Generate a unique BUOM membership ID, retrying a few times if collisions are detected.
 */
export async function generateUniqueMembershipId(generator: () => string, maxAttempts = 5): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = generator();
    const taken = await isMembershipIdTaken(candidate);
    if (!taken) return candidate;
    console.warn('Collision detected for membership ID, regenerating...', candidate);
  }
  // As a last resort, return a freshly generated ID
  return generator();
}